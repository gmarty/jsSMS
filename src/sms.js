'use strict';

/**
 * The frequency in ms at which the fps rate is displayed.
 * @const
 */
var fpsInterval = 500;

/**
 * NTSC Clock Speed (3579545Hz for NTSC systems).
 * @const
 */
var CLOCK_NTSC = 3579545;

/**
 * PAL Clock Speed (3546893Hz for PAL/SECAM systems).
 * @const
 */
var CLOCK_PAL = 3546893;

/**
 * @constructor
 * @param {Object.<string, *>=} opts
 */
function JSSMS(opts) {
  /**
   * The list of options that can be overridden at instantiation.
   * @dict
   */
  this.opts = {
    ui: JSSMS.DummyUI,
  };
  if (opts !== undefined) {
    var key;
    for (key in this.opts) {
      if (opts[key] !== undefined) {
        this.opts[key] = opts[key];
      }
    }
  }

  // Modify global flags set in setup.js on a per instance basis.
  if (opts['DEBUG'] !== undefined) {
    DEBUG = opts['DEBUG'];
  }
  if (opts['ENABLE_COMPILER'] !== undefined) {
    ENABLE_COMPILER = opts['ENABLE_COMPILER'];
  }

  this.keyboard = new JSSMS.Keyboard(this);
  this.ui = new this.opts['ui'](this);
  this.vdp = new JSSMS.Vdp(this);
  this.psg = new JSSMS.SN76489(this);
  this.ports = new JSSMS.Ports(this);
  this.cpu = new JSSMS.Z80(this);

  this.ui.updateStatus('Ready to load a ROM.');

  if (this.soundEnabled) {
    // @todo Move to psg.js.
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.audioBuffer = this.audioContext.createBuffer(1, 1, SAMPLE_RATE);
  }

  // Exposing ui publicly after minification.
  this['ui'] = this.ui;
}

JSSMS.prototype = {
  /**
   * Is thread running?
   * @type {boolean}
   */
  isRunning: false,

  /**
   * CPU cycles per scanline.
   * @type {number}
   */
  cyclesPerLine: 0,

  /**
   * No of scanlines to render (including blanking).
   * @type {number}
   */
  no_of_scanlines: 0,

  /**
   * Render every FRAMESKIP frames.
   * @type {number}
   */
  frameSkip: 0,

  /**
   * Throttle mode.
   * @type {boolean}
   */
  throttle: true,

  /**
   * Target FPS (NTSC / PAL).
   * @type {number}
   */
  fps: 0,

  /**
   * Counter for frameskip.
   * @type {number}
   */
  frameskip_counter: 0,

  /**
   * SMS Pause button pressed?
   * @type {boolean}
   */
  pause_button: false,

  /**
   * SMS mode.
   * @type {boolean}
   */
  is_sms: true,

  /**
   * GG mode.
   * @type {boolean}
   */
  is_gg: false,

  // Audio Related
  /**
   * Sound enabled.
   * @type {boolean}
   */
  soundEnabled: true,

  /**
   * Audio context.
   * @type {AudioContext}
   */
  audioContext: null,

  /**
   * Audio buffer.
   * @type {AudioBuffer}
   */
  audioBuffer: null,

  /**
   * Offset into audio buffer.
   * @type {number}
   */
  audioBufferOffset: 0,

  /**
   * Number of samples to generate per frame.
   * @type {number}
   */
  samplesPerFrame: 0,

  /** How many samples to generate per line.
   * @type {Array.<number>}
   */
  samplesPerLine: [],

  // Emulation Related
  /**
   * Emulated screen width.
   * @type {number}
   */
  emuWidth: 0,

  /**
   * Emulated screen height.
   * @type {number}
   */
  emuHeight: 0,

  /**
   * @type {number}
   */
  fpsFrameCount: 0,

  /**
   * @type {number}
   * @private
   */
  z80Time: 0,

  /**
   * @type {number}
   * @private
   */
  drawTime: 0,

  /**
   * @type {number}
   * @private
   */
  z80TimeCounter: 0,

  /**
   * @type {number}
   * @private
   */
  drawTimeCounter: 0,

  /**
   * @type {number}
   * @private
   */
  frameCount: 0,

  /**
   * The data of the rom currently loaded.
   * @type {string}
   */
  romData: '',

  /**
   * The file name of the current loaded rom.
   * @type {string}
   */
  romFileName: '',

  // Debugger
  lineno: 0,

  /**
   * Reset all emulation.
   */
  reset: function() {
    // Setup Default Timing
    this.setVideoTiming(this.vdp.videoMode);

    this.frameCount = 0;
    this.frameskip_counter = this.frameSkip;

    this.keyboard.reset();
    this.ui.reset();
    this.vdp.reset();
    this.ports.reset();
    this.cpu.reset();
    if (ENABLE_DEBUGGER) {
      this.cpu.resetDebug();
    }

    if (DEBUG) {
      clearInterval(this.fpsInterval);
    }
  },

  start: function() {
    var self = this;

    if (!this.isRunning) {
      this.isRunning = true;

      this.ui.requestAnimationFrame(this.frame.bind(this), this.ui.screen);

      if (DEBUG) {
        this.resetFps();
        this.fpsInterval = setInterval(function() {
          self.printFps();
        }, fpsInterval);
      }
    }

    this.ui.updateStatus('Running');
  },

  stop: function() {
    if (DEBUG) {
      clearInterval(this.fpsInterval);
    }
    this.isRunning = false;
  },

  /**
   * Draw one frame on the screen.
   */
  frame: function() {
    if (this.isRunning) {
      this.cpu.frame();

      this.fpsFrameCount++;
      this.ui.requestAnimationFrame(this.frame.bind(this), this.ui.screen);
    }
  },

  /**
   * At the moment, execute one frame, but should be changed to be executed at each instruction.
   */
  nextStep: function() {
    this.cpu.frame();
  },

  /**
   * Set SMS Mode.
   */
  setSMS: function() {
    this.is_sms = true;
    this.is_gg = false;

    this.vdp.h_start = 0;
    this.vdp.h_end = 32;

    this.emuWidth = SMS_WIDTH;
    this.emuHeight = SMS_HEIGHT;
  },

  /**
   * Set GG Mode.
   */
  setGG: function() {
    this.is_gg = true;
    this.is_sms = false;

    this.vdp.h_start = 6;
    this.vdp.h_end = 26;

    this.emuWidth = GG_WIDTH;
    this.emuHeight = GG_HEIGHT;
  },

  /**
   * Set NTSC/PAL Timing.
   *
   * Exact timings from:
   * http://www.smspower.org/dev/docs/wiki/Systems/MasterSystem
   */
  setVideoTiming: function(mode) {
    var clockSpeedHz = 0,
      i,
      v;

    // Game Gear should only work in NTSC
    if (mode === NTSC || this.is_gg) {
      this.fps = 60;
      this.no_of_scanlines = SMS_Y_PIXELS_NTSC;
      clockSpeedHz = CLOCK_NTSC;
    } else {
      // PAL
      this.fps = 50;
      this.no_of_scanlines = SMS_Y_PIXELS_PAL;
      clockSpeedHz = CLOCK_PAL;
    }

    // Add one manually here for rounding accuracy
    this.cyclesPerLine = Math.round(
      clockSpeedHz / this.fps / this.no_of_scanlines + 1
    );
    this.vdp.videoMode = mode;

    // Setup appropriate sound buffer
    if (this.soundEnabled) {
      this.psg.init(clockSpeedHz);

      this.samplesPerFrame = Math.round(SAMPLE_RATE / this.fps);

      if (this.audioBuffer.length !== this.samplesPerFrame) {
        this.audioBuffer = this.audioContext.createBuffer(
          1,
          this.samplesPerFrame,
          SAMPLE_RATE
        );
      }

      if (
        this.samplesPerLine.length === 0 ||
        this.samplesPerLine.length !== this.no_of_scanlines
      ) {
        this.samplesPerLine = new Array(this.no_of_scanlines);

        var fractional = 0;

        // Calculate number of sound samples to generate per scanline
        for (i = 0; i < this.no_of_scanlines; i++) {
          v = (this.samplesPerFrame << 16) / this.no_of_scanlines + fractional;
          fractional = v - ((v >> 16) << 16);
          this.samplesPerLine[i] = v >> 16;
        }
      }
    }

    //setFrameSkip(frameSkip);
  },

  // Sound Output
  /**
   * @param {Array.<number>} buffer
   */
  audioOutput: function(buffer) {
    this.ui.writeAudio(buffer);
  },

  // Screen Rendering
  doRepaint: function() {
    this.ui.writeFrame();
  },

  printFps: function() {
    var now = JSSMS.Utils.getTimestamp();
    var s =
      'Running: ' +
      (this.fpsFrameCount / ((now - this.lastFpsTime) / 1000)).toFixed(2) +
      ' FPS';
    this.ui.updateStatus(s);
    this.fpsFrameCount = 0;
    this.lastFpsTime = now;
  },

  resetFps: function() {
    this.lastFpsTime = JSSMS.Utils.getTimestamp();
    this.fpsFrameCount = 0;
  },

  /**
   * @param {number} line
   */
  updateSound: function(line) {
    if (line === 0) {
      this.audioBufferOffset = 0;
    }

    var samplesToGenerate = this.samplesPerLine[line];
    this.psg.update(
      this.audioBuffer,
      this.audioBufferOffset,
      samplesToGenerate
    );
    this.audioBufferOffset += samplesToGenerate;
  },

  // File Loading Routines
  /**
   * Bypass config file and directly load rom.
   *
   * \@todo readRomDirectly() and loadROM() can be confusing. Renaming needed.
   *
   * @param {string} data Rom binary data.
   * @param {string} fileName Filename to load.
   * @return {boolean}
   */
  readRomDirectly: function(data, fileName) {
    var pages;
    var extension = JSSMS.Utils.getFileExtension(fileName);
    var size = data.length;

    // Toggle SMS / GG emulation.
    if (extension === 'gg') {
      this.setGG();
    } else {
      this.setSMS();
    }

    pages = this.loadROM(data, size);

    if (pages === null) {
      return false;
    }

    // Default Mapping (Needed or Shinobi doesn't work)
    this.cpu.resetMemory(pages);

    // Store these info locally to enable rom reloading
    this.romData = data;
    this.romFileName = fileName;

    return true;
  },

  /**
   * \@todo readRomDirectly() and loadROM() can be confusing. Renaming needed.
   *
   * @param {string} data Rom binary data.
   * @param {number} size
   * @return {Array.<Array.<number>>}
   */
  loadROM: function(data, size) {
    // Calculate number of pages from file size and create array appropriately
    var i, j;
    var number_of_pages = Math.ceil(size / PAGE_SIZE);
    var pages = new Array(number_of_pages);

    for (i = 0; i < number_of_pages; i++) {
      pages[i] = JSSMS.Utils.Array(PAGE_SIZE);
      // Read file into pages array
      // \@todo Move this part to JSSMS.Utils.
      if (SUPPORT_DATAVIEW) {
        for (j = 0; j < PAGE_SIZE; j++) {
          pages[i].setUint8(j, data.charCodeAt(i * PAGE_SIZE + j));
        }
      } else {
        for (j = 0; j < PAGE_SIZE; j++) {
          pages[i][j] = data.charCodeAt(i * PAGE_SIZE + j) & 0xff;
        }
      }
    }

    return pages;
  },

  /**
   * Reload a rom previously set in memory. Returns true if a rom was
   * successfully reloaded.
   *
   * @return {boolean}
   */
  reloadRom: function() {
    if (this.romData !== '' && this.romFileName !== '') {
      return this.readRomDirectly(this.romData, this.romFileName);
    } else {
      return false;
    }
  },
};
