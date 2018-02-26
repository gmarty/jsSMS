'use strict';

/**
 * Fixed point scaling.
 * @const
 */
var SCALE = 8;

/**
 * Value to denote that antialiasing should not be used on sample.
 * @const
 */
var NO_ANTIALIAS = Number.MIN_VALUE;

/**
 * Shift register reset value. Only the highest bit is set.
 * @const
 */
var SHIFT_RESET = 0x8000;

/**
 * SMS Only: Tapped bits are bits 0 and 3 (0x0009), fed back into bit 15.
 * @const
 */
var FEEDBACK_PATTERN = 0x09;

// Amplification
/**
 * Tests with an SMS and a TV card found the highest three volume levels to be clipped.
 * @const
 */
var PSG_VOLUME = [
  //1516, 1205, 957, 760, 603, 479, 381, 303, 240, 191, 152, 120, 96, 76, 60, 0
  25,
  20,
  16,
  13,
  10,
  8,
  6,
  5,
  4,
  3,
  3,
  2,
  2,
  1,
  1,
  0,
];

/**
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.SN76489 = function(sms) {
  this.main = sms;

  /**
   * SN76489 Internal Clock Speed (Hz) [SCALED].
   * @type {number}
   */
  this.clock = 0;

  /**
   * Stores fractional part of clock for various precise updates [SCALED].
   * @type {number}
   */
  this.clockFrac = 0;

  // The SN76489 has 8 "registers":
  // 4 x 4 bit volume registers,
  // 3 x 10 bit tone registers and
  // 1 x 3 bit noise register.
  /**
   * SN76489 Registers.
   * @type {Array.<number>}
   */
  this.reg = new Array(8);

  /**
   * Register Latch.
   * @type {number}
   */
  this.regLatch = 0;

  /**
   * Channel Counters (10-bits on original hardware).
   * @type {Array.<number>}
   */
  this.freqCounter = new Array(4);

  /**
   * Polarity of Tone Channel Counters.
   * @type {Array.<number>}
   */
  this.freqPolarity = new Array(4);

  /**
   * Position of Tone Amplitude Changes.
   * @type {Array.<number>}
   */
  this.freqPos = new Array(3);

  /**
   * Noise Generator Frequency.
   * @type {number}
   */
  this.noiseFreq = 0x10;

  /**
   * The Linear Feedback Shift Register (16-bits on original hardware).
   * @type {number}
   */
  this.noiseShiftReg = SHIFT_RESET;

  /**
   * Output channels.
   * @type {Array.<number>}
   */
  this.outputChannel = new Array(4);
};

JSSMS.SN76489.prototype = {
  /**
   * Init SN76496 to Default Values.
   *
   * @param {number} clockSpeed Clock Speed (Hz).
   */
  init: function(clockSpeed) {
    // Master clock divided by 16 to get internal clock
    // e.g. 3579545 / 16 / 44100 = 5
    this.clock = (clockSpeed << SCALE) / 16 / SAMPLE_RATE;

    this.clockFrac = 0;
    this.regLatch = 0;
    this.noiseFreq = 0x10;
    this.noiseShiftReg = SHIFT_RESET;

    for (var i = 0; i < 4; i++) {
      // Set Tone Frequency (Don't want this to be zero)
      this.reg[i << 1] = 1;

      // Set Volume Off
      this.reg[(i << 1) + 1] = 0x0f;

      // Set Frequency Counters
      this.freqCounter[i] = 0;

      // Set Amplitudes Positive
      this.freqPolarity[i] = 1;
    }

    // Do not use intermediate positions
    for (i = 0; i < 3; i++) {
      this.freqPos[i] = NO_ANTIALIAS;
    }
  },

  /**
   * Program the SN76489.
   *
   * @param {number} value Value to write (0-0xFF).
   */
  write: function(value) {
    // If bit 7 is 1 then the byte is a LATCH/DATA byte.
    //  %1cctdddd
    //    |||````-- Data
    //    ||`------ Type
    //    ``------- Channel

    if ((value & 0x80) !== 0) {
      // Bits 6 and 5 ("cc") give the channel to be latched, ALWAYS.
      // Bit 4 ("t") determines whether to latch volume (1) or tone/noise (0) data -
      // this gives the column.

      this.regLatch = (value >> 4) & 7;

      // Zero lower 4 bits of register and mask new value
      this.reg[this.regLatch] =
        (this.reg[this.regLatch] & 0x3f0) | (value & 0x0f);
    } else {
      // If bit 7 is 0 then the byte is a DATA byte.
      //  %0-DDDDDD
      //    |``````-- Data
      //    `-------- Unused

      // TONE REGISTERS
      // If the currently latched register is a tone register then the low 6
      // bits of the byte are placed into the high 6 bits of the latched register.
      if (this.regLatch === 0 || this.regLatch === 2 || this.regLatch === 4) {
        // ddddDDDDDD (10 bits total) - keep lower 4 bits and replace upper 6 bits.
        // ddddDDDDDD gives the 10-bit half-wave counter reset value.
        this.reg[this.regLatch] =
          (this.reg[this.regLatch] & 0x0f) | ((value & 0x3f) << 4);
      } else {
        // VOLUME & NOISE REGISTERS
        this.reg[this.regLatch] = value & 0x0f;
      }
    }

    switch (this.regLatch) {
      // Tone register updated
      // If the register value is zero then the output is a constant value of +1.
      // This is often used for sample playback on the SN76489.
      case 0:
      case 2:
      case 4:
        if (this.reg[this.regLatch] === 0) {
          this.reg[this.regLatch] = 1;
        }
        break;

      // Noise generator updated
      //
      // Noise register:      dddd(DDDDDD) = -trr(---trr)
      //
      // The low 2 bits of dddd select the shift rate and the next highest bit (bit 2)
      // selects  the mode (white (1) or "periodic" (0)).
      // If a data byte is written, its low 3 bits update the shift rate and mode in the
      // same way.
      case 6:
        this.noiseFreq = 0x10 << (this.reg[6] & 3);
        this.noiseShiftReg = SHIFT_RESET;
        break;
    }
  },

  /**
   * @param {AudioBuffer} audioBuffer
   * @param {number} offset
   * @param {number} samplesToGenerate
   * @return {Array}
   */
  update: function(audioBuffer, offset, samplesToGenerate) {
    var buffer = audioBuffer.getChannelData(0);
    var sample = 0;
    var i = 0;

    for (; sample < samplesToGenerate; sample++) {
      // Generate Sound from Tone Channels
      for (i = 0; i < 3; i++) {
        if (this.freqPos[i] !== NO_ANTIALIAS) {
          this.outputChannel[i] =
            (PSG_VOLUME[this.reg[(i << 1) + 1]] * this.freqPos[i]) >> SCALE;
        } else {
          this.outputChannel[i] =
            PSG_VOLUME[this.reg[(i << 1) + 1]] * this.freqPolarity[i];
        }
      }

      // Generate Sound from Noise Channel
      this.outputChannel[3] =
        (PSG_VOLUME[this.reg[7]] * (this.noiseShiftReg & 1)) << 1; // Double output

      // Output sound to buffer
      var output =
        this.outputChannel[0] +
        this.outputChannel[1] +
        this.outputChannel[2] +
        this.outputChannel[3];

      output /= 0x80;

      // Check boundaries
      if (output > 1) {
        output = 1;
      } else if (output < -1) {
        output = -1;
      }

      buffer[offset + sample] = output;

      // Update Clock
      this.clockFrac += this.clock;

      // Contains Main Integer Part (For General Counter Decrements)
      //int clockCyclesPerUpdate = clockFrac &~ ((1 << SCALE) - 1);
      var clockCycles = this.clockFrac >> SCALE;
      var clockCyclesScaled = clockCycles << SCALE;

      // Clock Counter Updated with Fractional Part Only (For Accurate Stuff Later)
      this.clockFrac -= clockCyclesScaled;

      // Decrement Counters

      // Decrement Tone Counters
      this.freqCounter[0] -= clockCycles;
      this.freqCounter[1] -= clockCycles;
      this.freqCounter[2] -= clockCycles;

      // Decrement Noise Counter OR Match to Tone 2
      if (this.noiseFreq === 0x80) {
        this.freqCounter[3] = this.freqCounter[2];
      } else {
        this.freqCounter[3] -= clockCycles;
      }

      // Update 3 x Tone Generators
      for (i = 0; i < 3; i++) {
        var counter = this.freqCounter[i];

        // The counter is reset to the value currently in the corresponding register
        // (eg. Tone0 for channel 0).
        // The polarity of the output is changed,
        // ie. if it is currently outputting -1 then it outputs +1, and vice versa.
        if (counter <= 0) {
          var tone = this.reg[i << 1];

          // In tests on an SMS2, the highest note that gave any audible output was
          // register value $006, giving frequency 18643Hz (MIDI note A12 -12 cents).
          if (tone > 6) {
            // Calculate what fraction of the way through the sample the flip-flop
            // changes state and render it as that fraction of the way through the transition.

            // Note we divide a scaled number by a scaled number here
            // So to maintain accuracy we shift the top part of the fraction again
            this.freqPos[i] =
              ((clockCyclesScaled - this.clockFrac + (2 << SCALE) * counter) <<
                SCALE) *
              this.freqPolarity[i] /
              (clockCyclesScaled + this.clockFrac);

            // Flip Polarity
            this.freqPolarity[i] = -this.freqPolarity[i];
          } else {
            this.freqPolarity[i] = 1;
            this.freqPos[i] = NO_ANTIALIAS;
          }

          // Reset to 10-bit value in corresponding tone register
          this.freqCounter[i] += tone * (clockCycles / tone + 1);
        } else {
          this.freqPos[i] = NO_ANTIALIAS;
        }
      }

      // Update Noise Generators
      if (this.freqCounter[3] <= 0) {
        // Flip Polarity
        this.freqPolarity[3] = -this.freqPolarity[3];

        // Not matching Tone 2 Value, so reload counter
        if (this.noiseFreq !== 0x80) {
          this.freqCounter[3] +=
            this.noiseFreq * (clockCycles / this.noiseFreq + 1);
        }

        // Positive Amplitude i.e. We only want to do this once per cycle
        if (this.freqPolarity[3] === 1) {
          var feedback = 0;

          // White Noise Selected
          if ((this.reg[6] & 0x04) !== 0) {
            // If two bits fed back, I can do Feedback=(nsr & fb) && (nsr & fb ^ fb)
            // since that's (one or more bits set) && (not all bits set)
            feedback =
              (this.noiseShiftReg & FEEDBACK_PATTERN) !== 0 &&
              ((this.noiseShiftReg & FEEDBACK_PATTERN) ^ FEEDBACK_PATTERN) !== 0
                ? 1
                : 0;
          } else {
            // Periodic Noise Selected
            feedback = this.noiseShiftReg & 1;
          }

          this.noiseShiftReg = (this.noiseShiftReg >> 1) | (feedback << 15);
        }
      }
    } // end for loop
  },
};
