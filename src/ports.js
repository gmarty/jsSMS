'use strict';

/** @const */ var IO_TR_DIRECTION = 0;
/** @const */ var IO_TH_DIRECTION = 1;
/** @const */ var IO_TR_OUTPUT = 2;
/** @const */ var IO_TH_OUTPUT = 3;
/** @const */ var IO_TH_INPUT = 4;

/** @const */ var PORT_A = 0;
/** @const */ var PORT_B = 5;

/**
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.Ports = function(sms) {
  this.main = sms;
  this.vdp = sms.vdp;
  this.psg = sms.psg;
  this.keyboard = sms.keyboard;

  /**
   * European / Domestic system.
   * @type {number}
   */
  this.europe = 0x40;

  /**
   * Horizontal counter latch.
   * @type {number}
   */
  this.hCounter = 0;

  /**
   * I/O Ports A and B * (5 ints each).
   * @type {Array.<number>}
   */
  this.ioPorts = [];
};

JSSMS.Ports.prototype = {
  reset: function() {
    if (LIGHTGUN) {
      this.ioPorts = new Array(10);
      this.ioPorts[PORT_A + IO_TH_INPUT] = 1;
      this.ioPorts[PORT_B + IO_TH_INPUT] = 1;
    } else {
      this.ioPorts = new Array(2);
    }
  },

  /**
   * Output to a Z80 port.
   *
   * @param {number} port Port number.
   * @param {number} value Value to output.
   */
  out: function(port, value) {
    // Game Gear Serial Ports (do nothing for now)
    if (this.main.is_gg && port < 0x07) {
      return;
    }

    switch (port & 0xc1) {
      // 0x3F IO Port
      // 0xD7 : Port B TH pin output level (1=high, 0=low)
      // 0xD6 : Port B TR pin output level (1=high, 0=low)
      // 0xD5 : Port A TH pin output level (1=high, 0=low)
      // 0xD4 : Port A TR pin output level (1=high, 0=low)
      // 0xD3 : Port B TH pin direction (1=input, 0=output)
      // 0xD2 : Port B TR pin direction (1=input, 0=output)
      // 0xD1 : Port A TH pin direction (1=input, 0=output)
      // 0xD0 : Port A TR pin direction (1=input, 0=output)
      case 0x01:
        // Accurate emulation with HCounter
        if (LIGHTGUN) {
          this.oldTH = this.getTH(PORT_A) !== 0 || this.getTH(PORT_B) !== 0;

          this.writePort(PORT_A, value);
          this.writePort(PORT_B, value >> 2);

          // Toggling TH latches H Counter
          if (
            !this.oldTH &&
            (this.getTH(PORT_A) !== 0 || this.getTH(PORT_B) !== 0)
          ) {
            this.hCounter = this.getHCount();
          }
        } else {
          // Rough emulation of Nationalisation bits
          this.ioPorts[0] = (value & 0x20) << 1;
          this.ioPorts[1] = value & 0x80;

          if (this.europe === 0) {
            // Not European system
            this.ioPorts[0] = ~this.ioPorts[0];
            this.ioPorts[1] = ~this.ioPorts[1];
          }
        }
        break;

      // 0xBE VDP Data port
      case 0x80:
        this.vdp.dataWrite(value);
        break;

      // 0xBD / 0xBF VDP Control port (Mirrored at two locations)
      case 0x81:
        this.vdp.controlWrite(value);
        break;

      // 0x7F: PSG
      case 0x40:
      case 0x41:
        if (this.main.soundEnabled) {
          this.psg.write(value);
        }
        break;
    }
  },

  /**
   * Read from a Z80 port.
   *
   * @param {number} port Port number.
   * @return {number} Value from port number.
   */
  in_: function(port) {
    // Game Gear Serial Ports (not fully emulated)
    if (this.main.is_gg && port < 0x07) {
      switch (port) {
        // Game Gear (Start Button and Nationalisation)
        case 0x00:
          return (this.keyboard.ggstart & 0xbf) | this.europe;

        // GG Serial Communication Ports -
        // Return 0 for now as "OutRun" gets stuck in a loop by returning 0xFF
        case 0x01:
        case 0x02:
        case 0x03:
        case 0x04:
        case 0x05:
          return 0x00;
        case 0x06:
          return 0xff;
      }
    }

    switch (port & 0xc1) {
      // 0x7E - Vertical Port
      case 0x40:
        return this.vdp.getVCount();

      // 0x7F - Horizontal Port
      case 0x41:
        return this.hCounter;

      // VDP Data port
      case 0x80:
        return this.vdp.dataRead();

      // VDP Control port
      case 0x81:
        return this.vdp.controlRead();

      // 0xC0 / 0xDC - I/O Port A
      // 0xD7 : Port B DOWN pin input
      // 0xD6 : Port B UP pin input
      // 0xD5 : Port A TR pin input
      // 0xD4 : Port A TL pin input
      // 0xD3 : Port A RIGHT pin input
      // 0xD2 : Port A LEFT pin input
      // 0xD1 : Port A DOWN pin input
      // 0xD0 : Port A UP pin input
      case 0xc0:
        return this.keyboard.controller1;

      // 0xC1 / 0xDD - I/O Port B and Misc
      // 0xD7 : Port B TH pin input
      // 0xD6 : Port A TH pin input
      // 0xD5 : Unused
      // 0xD4 : RESET button (1= not pressed, 0= pressed)
      // 0xD3 : Port B TR pin input
      // 0xD2 : Port B TL pin input
      // 0xD1 : Port B RIGHT pin input
      // 0xD0 : Port B LEFT pin input
      case 0xc1:
        if (LIGHTGUN) {
          if (this.keyboard.lightgunClick) {
            this.lightPhaserSync();
          }

          return (
            (this.keyboard.controller2 & 0x3f) |
            (this.getTH(PORT_A) !== 0 ? 0x40 : 0) |
            (this.getTH(PORT_B) !== 0 ? 0x80 : 0)
          );
        } else {
          return (
            (this.keyboard.controller2 & 0x3f) |
            this.ioPorts[0] |
            this.ioPorts[1]
          );
        }
    }

    // Default Value is 0xFF
    return 0xff;
  },

  // Port A/B Emulation
  /**
   * @param {number} index
   * @param {number} value
   */
  writePort: function(index, value) {
    this.ioPorts[index + IO_TR_DIRECTION] = value & 0x01;
    this.ioPorts[index + IO_TH_DIRECTION] = value & 0x02;
    this.ioPorts[index + IO_TR_OUTPUT] = value & 0x10;
    this.ioPorts[index + IO_TH_OUTPUT] =
      this.europe === 0 ? ~value & 0x20 : value & 0x20;
  },

  /**
   * @param {number} index
   * @return {number}
   */
  getTH: function(index) {
    return this.ioPorts[index + IO_TH_DIRECTION] === 0
      ? this.ioPorts[index + IO_TH_OUTPUT]
      : this.ioPorts[index + IO_TH_INPUT];
  },

  /**
   * @param {number} index
   * @param {boolean} on
   */
  setTH: function(index, on) {
    this.ioPorts[index + IO_TH_DIRECTION] = 1;
    this.ioPorts[index + IO_TH_INPUT] = on ? 1 : 0;
  },

  // H Counter Emulation
  //
  //  The H counter is 9 bits, and reading it returns the upper 8 bits. This is
  //  because a scanline consists of 342 pixels, which couldn't be represented
  //  with an 8-bit counter. Each scanline is divided up as follows:
  //
  //    Pixels H.Cnt   Description
  //    256 : 0x00-0x7F : Active display
  //     15 : 0x80-0x87 : Right border
  //      8 : 0x87-0x8B : Right blanking
  //     26 : 0x8B-0xED : Horizontal sync
  //      2 : 0xED-0xEE : Left blanking
  //     14 : 0xEE-0xF5 : Color burst
  //      8 : 0xF5-0xF9 : Left blanking
  //     13 : 0xF9-0xFF : Left border
  /**
   * @return {number}
   */
  getHCount: function() {
    var pixels = Math.round(
      this.main.cpu.getCycle() * SMS_X_PIXELS / this.main.cyclesPerLine
    );
    var v = (pixels - 8) >> 1;
    if (v > 0x93) {
      v += 0xe9 - 0x94;
    }

    return v & 0xff;
  },

  // Lightgun <-> Port Synchronisation
  // This is a hacky way to do things, but works reasonably well.
  /**
   * X range of Lightgun.
   * @type {number}
   */
  X_RANGE: 48,

  /**
   * Y range of Lightgun.
   * @type {number}
   */
  Y_RANGE: 4,

  lightPhaserSync: function() {
    var oldTH = this.getTH(PORT_A);
    var hc = this.getHCount();

    var dx = this.keyboard.lightgunX - (hc << 1);
    var dy = this.keyboard.lightgunY - this.vdp.line;

    // Within 8 pixels of click on Y value
    // Within 96 pixels of click on X value
    if (
      dy > -this.Y_RANGE &&
      dy < this.Y_RANGE &&
      (dx > -this.X_RANGE && dx < this.X_RANGE)
    ) {
      this.setTH(PORT_A, false);

      // TH has been toggled, update with lightgun position
      if (oldTH !== this.getTH(PORT_A)) {
        this.hCounter = 20 + (this.keyboard.lightgunX >> 1);
      }
    } else {
      this.setTH(PORT_A, true);

      // TH has been toggled, update with usual HCounter value
      if (oldTH !== this.getTH(PORT_A)) {
        this.hCounter = hc;
      }
    }
  },

  /**
   * Set console to European / Japanese model.
   *
   * @param {boolean} value True is European, false is Japanese.
   */
  setDomestic: function(value) {
    this.europe = value ? 0x40 : 0;
  },

  /**
   * @return {boolean}
   */
  isDomestic: function() {
    return this.europe !== 0;
  },
};
