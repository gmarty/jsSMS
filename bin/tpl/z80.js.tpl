'use strict';

/** Speedup hack to set tstates to '0' on halt instruction. */
/** @const */ var HALT_SPEEDUP = true;

/** carry (set when a standard carry occurred). */
/** @const */ var F_CARRY = 0x01;

/** negative (set when instruction is subtraction, clear when addition). */
/** @const */ var F_NEGATIVE = 0x02;

/** true indicates even parity in the result, false for 2s complement sign overflow. */
/** @const */ var F_PARITY = 0x04;

/** true indicates even parity in the result, false for 2s complement sign overflow. */
/** @const */ var F_OVERFLOW = 0x04;

/** bit3 (usually a copy of bit 3 of the result). */
/** @const */ var F_BIT3 = 0x08;

/** half carry (set when a carry occurred between bit 3 / 4 of result - used for BCD. */
/** @const */ var F_HALFCARRY = 0x10;

/** bit5 (usually a copy of bit 5 of the result). */
/** @const */ var F_BIT5 = 0x20;

/** zero (set when a result is zero). */
/** @const */ var F_ZERO = 0x40;

/** sign (set when a result is negative). */
/** @const */ var F_SIGN = 0x80;

// Misc Helper Stuff
/** Easy bit reference for CB operations. */
/** @const */ var BIT_0 = 0x01;
/** @const */ var BIT_1 = 0x02;
/** @const */ var BIT_2 = 0x04;
/** @const */ var BIT_3 = 0x08;
/** @const */ var BIT_4 = 0x10;
/** @const */ var BIT_5 = 0x20;
/** @const */ var BIT_6 = 0x40;
/** @const */ var BIT_7 = 0x80;


/**
 * @const
 */
var OP_STATES = [
  /*         0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F */
  /* 0x00 */ 4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4,
  /* 0x10 */ 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4,
  /* 0x20 */ 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4,
  /* 0x30 */ 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4,
  /* 0x40 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0x50 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0x60 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0x70 */ 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0x80 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0x90 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0xA0 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0xB0 */ 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
  /* 0xC0 */ 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11,
  /* 0xD0 */ 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11,
  /* 0xE0 */ 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11,
  /* 0xF0 */ 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11
];


/**
 * @const
 */
var OP_CB_STATES = [
  /*         0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F */
  /* 0x00 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0x10 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0x20 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0x30 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0x40 */ 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8,
  /* 0x50 */ 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8,
  /* 0x60 */ 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8,
  /* 0x70 */ 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8,
  /* 0x80 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0x90 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0xA0 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0xB0 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0xC0 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0xD0 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0xE0 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8,
  /* 0xF0 */ 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8
];


/**
 * @const
 */
var OP_DD_STATES = [
  /*         0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F */
  /* 0x00 */ 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4,
  /* 0x10 */ 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4,
  /* 0x20 */ 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4,
  /* 0x30 */ 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4,
  /* 0x40 */ 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0x50 */ 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0x60 */ 8, 8, 8, 8, 8, 8, 19, 8, 8, 8, 8, 8, 8, 8, 19, 8,
  /* 0x70 */ 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0x80 */ 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0x90 */ 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0xA0 */ 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0xB0 */ 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4,
  /* 0xC0 */ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4,
  /* 0xD0 */ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  /* 0xE0 */ 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4,
  /* 0xF0 */ 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4
];


/**
 * @const
 */
var OP_INDEX_CB_STATES = [
  /*        0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F */
  /* x00 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* x10 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* x20 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* x30 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* x40 */ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
  /* x50 */ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
  /* x60 */ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
  /* x70 */ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
  /* x80 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* x90 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* xA0 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* xB0 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* xC0 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* xD0 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* xE0 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
  /* xF0 */ 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23
];


/**
 * @const
 */
var OP_ED_STATES = [
  /*         0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F */
  /* 0x00 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0x10 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0x20 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0x30 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0x40 */ 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9,
  /* 0x50 */ 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9,
  /* 0x60 */ 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18,
  /* 0x70 */ 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8,
  /* 0x80 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0x90 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0xA0 */ 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8,
  /* 0xB0 */ 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8,
  /* 0xC0 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0xD0 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0xE0 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  /* 0xF0 */ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8
];



/**
 * @constructor
 * @param {JSSMS} sms
 */
JSSMS.Z80 = function(sms) {
  this.main = sms;
  this.vdp = sms.vdp;
  this.psg = sms.psg;
  this.port = sms.ports;

  // Z80 Internal Stuff
  /**
   * Program counter.
   * @type {number}
   */
  this.pc = 0;

  /**
   * Stack pointer.
   * @type {number}
   */
  this.sp = 0;

  /**
   * Interrupt mode (0,1,2).
   * \@todo Use {enum} here instead?
   * @type {number}
   */
  this.im = 0;

  /**
   * Interrupt Flip Flop 1.
   * @type {boolean}
   */
  this.iff1 = false;

  /**
   * Interrupt Flip Flop 2.
   * @type {boolean}
   */
  this.iff2 = false;

  /**
   * Halt instruction called.
   * @type {boolean}
   */
  this.halt = false;

  /**
   * EI instruction called.
   * @type {boolean}
   */
  this.EI_inst = false;

  /**
   * Interrupt line status.
   * @type {boolean}
   */
  this.interruptLine = false;

  /**
   * Interrupt vector.
   * @type {number}
   */
  this.interruptVector = 0;

  // Registers
  /** Accumulator register. */
  /** @type {number} */ this.a = 0;
  /** @type {number} */ this.a2 = 0;

  /** BC register. */
  /** @type {number} */ this.b = 0;
  /** @type {number} */ this.c = 0;
  /** @type {number} */ this.b2 = 0;
  /** @type {number} */ this.c2 = 0;

  /** DE register. */
  /** @type {number} */ this.d = 0;
  /** @type {number} */ this.e = 0;
  /** @type {number} */ this.d2 = 0;
  /** @type {number} */ this.e2 = 0;

  /** HL register. */
  /** @type {number} */ this.h = 0;
  /** @type {number} */ this.l = 0;
  /** @type {number} */ this.h2 = 0;
  /** @type {number} */ this.l2 = 0;

  /** IX register. */
  /** @type {number} */ this.ixL = 0;
  /** @type {number} */ this.ixH = 0;

  /** IY register. */
  /** @type {number} */ this.iyL = 0;
  /** @type {number} */ this.iyH = 0;

  /** Memory refresh register. */
  /** @type {number} */ this.r = 0;

  /** Interrupt page address register. */
  /** @type {number} */ this.i = 0;

  // Flag Register
  /** @type {number} */ this.f = 0;
  /** @type {number} */ this.f2 = 0;

  // Opcode timings
  /** Total number of cycles we're executing for. */
  /** @type {number} */ this.totalCycles = 0;

  /** TStates remaining. */
  /** @type {number} */ this.tstates = 0;

  // MEMORY ACCESS
  /**
   * Cartridge ROM pages.
   * @type {Array.<DataView|Array.<number>>}
   */
  this.rom = [];

  /**
   * SRAM.
   * @type {DataView|Array.<number>}
   */
  this.sram = JSSMS.Utils.Array(0x8000);

  /**
   * Cartridge uses SRAM.
   * @type {boolean}
   */
  this.useSRAM = false;

  /**
   * Memory frame registers.
   * @type {Array.<number>}
   */
  this.frameReg = new Array(4);

  /**
   * @type {number}
   */
  this.romPageMask = 0;

  /**
   * Total number of 16K cartridge pages.
   * @type {number}
   */
  this.number_of_pages = 0;

  /**
   * Memory map.
   * @type {DataView|Array.<number>}
   */
  this.memWriteMap = JSSMS.Utils.Array(0x2000);

  // Precalculated tables for speed purposes
  /** Pre-calculated result for DAA instruction. */
  this.DAA_TABLE = new Array(0x800);

  /** Sign, Zero table. */
  this.SZ_TABLE = new Array(256);

  /** Sign, Zero, Parity table. */
  this.SZP_TABLE = new Array(256);

  /** Flag lookup table for inc8 instruction. */
  this.SZHV_INC_TABLE = new Array(256);

  /** Flag lookup table for dec8 instruction. */
  this.SZHV_DEC_TABLE = new Array(256);

  /** Flag lookup table for add/adc instruction. */
  this.SZHVC_ADD_TABLE = new Array(2 * 256 * 256);

  /** Flag lookup table for dec/sbc instruction. */
  this.SZHVC_SUB_TABLE = new Array(2 * 256 * 256);

  /** Flag lookup table for bit instruction. */
  this.SZ_BIT_TABLE = new Array(256);

  // Generate flag lookups
  this.generateFlagTables();

  // Pre-calculate results for DAA instruction
  this.generateDAATable();

  // Generate memory arrays
  this.generateMemory();
};

JSSMS.Z80.prototype = {
  /**
   * Reset CPU.
   *
   * Note that some of these values aren't what a real Z80 would reset to.
   * They are the values that the SMS BIOS (to the best of my knowledge)
   * sets the registers to.
   *
   * For example, the Index Registers should reset to 0xFFFF
   * but doing so breaks 'Prince of Persia', so they are set to 0x0000.
   *
   * The stack pointer is also reset to 0xDFF0 as opposed to 0x0000.
   */
  reset: function() {
    this.a = this.a2 = 0;

    this.b = this.c = this.b2 = this.c2 = 0;
    this.d = this.e = this.d2 = this.e2 = 0;
    this.h = this.l = this.h2 = this.l2 = 0;
    this.ixL = this.ixH = 0;
    this.iyL = this.iyH = 0;

    this.r = 0;
    this.i = 0;
    this.f = 0; this.f2 = 0;

    this.pc = 0x0000;
    this.sp = 0xDFF0;

    this.totalCycles = 0;
    this.tstates = 0;

    this.im = 0;
    this.iff1 = false;
    this.iff2 = false;
    this.EI_inst = false;
    this.interruptVector = 0;
    this.halt = false;
  },


  /**
   * Emulate one frame.
   */
  frame: function() {
    this.lineno = 0;

    this.tstates += this.main.cyclesPerLine;
    this.totalCycles = this.main.cyclesPerLine;

    if (ACCURATE_INTERRUPT_EMULATION) {
      if (this.interruptLine)
        this.interrupt();                    // Check for interrupt
    }

    while (true) {
      if (DEBUGGER) {
        this.main.ui.updateDisassembly(this.pc);
      }

      //console.log(JSSMS.Utils.toHex(this.pc));

      this.recompile();

      // Execute eol() at end of scanlines and exit at end of frame.
      if (this.tstates <= 0) {
        if (this.eol())
          return;
      }
    }
  },


  recompile: function() {
    if (this.pc < 0x0400 && this[''][this.pc]) {
      this[''][this.pc].call(this);
      return;
    } else if (this.pc < 0x4000 && this[this.frameReg[0]][this.pc]) {
      this[this.frameReg[0]][this.pc].call(this);
      return;
    } else if (this.pc < 0x8000 && this[this.frameReg[1]][this.pc]) {
      this[this.frameReg[1]][this.pc].call(this);
      return;
    } else if (this.pc < 0xC000 && this[this.frameReg[2]][this.pc]) {
      this[this.frameReg[2]][this.pc].call(this);
      return;
    }

    this.interpret();
  },


  /**
   * End of scanline.
   * @return {boolean} Whether the end of the current frame or an interrupt was reached or not.
   */
  eol: function() {
    if (ACCURATE_INTERRUPT_EMULATION)
      var prevPc = this.pc;

    // PSG
    if (this.main.soundEnabled)
      this.main.updateSound(this.lineno);

    // VDP
    this.vdp.line = this.lineno;

    // Draw next line.
    if (this.lineno < 192) {
      this.vdp.drawLine(this.lineno);
    }

    // Assert interrupt line if necessary.
    this.vdp.interrupts(this.lineno);

    // Check for end of frame.
    if (this.lineno >= this.main.no_of_scanlines) {
      this.eof();

      return true;
    }

    // Start a new scanline.
    this.lineno++;

    if (!ACCURATE_INTERRUPT_EMULATION && this.interruptLine)
      this.interrupt();                    // Check for interrupt

    // If no, let's continue to next scanline.
    this.tstates += this.main.cyclesPerLine;
    this.totalCycles = this.main.cyclesPerLine;

    // Has an interrupt happened?
    if (ACCURATE_INTERRUPT_EMULATION && prevPc != this.pc)
      return true;

    return false;
  },


  /**
   * End of frame.
   */
  eof: function() {
    if (this.main.soundEnabled)
      this.main.audioOutput(this.main.audioBuffer);

    // Only check for pause button once per frame to increase emulation speed.
    if (this.main.pause_button) {
      this.nmi();
      this.main.pause_button = false;
    }

    this.main.doRepaint();
  },


  {{run_method_code}},


  /**
   * Run the Z80 interpreter.
   */
  interpret: function() {
    var location = 0;
    var temp = 0;

    // Main Opcode Switch Rolled In For Speed
    var opcode = this.readMem(this.pc++);                    // Fetch & Interpret Opcode

    if (ACCURATE_INTERRUPT_EMULATION)
      this.EI_inst = false;

    this.tstates -= OP_STATES[opcode];   // Decrement TStates

    if (REFRESH_EMULATION)
      this.incR();

    switch (opcode) {
      case 0x00: break;                                                   // NOP
      case 0x01: this.setBC(this.readMemWord(this.pc++)); this.pc++; break;             // LD BC,nn
      case 0x02: this.writeMem(this.getBC(), this.a); break;                             // LD (BC),A
      case 0x03: this.incBC(); break;                                          // INC BC
      case 0x04: this.b = this.inc8(this.b); break;                                      // INC B
      case 0x05: this.b = this.dec8(this.b); break;                                      // DEC B
      case 0x06: this.b = this.readMem(this.pc++); break;                                // LD B,n
      case 0x07: this.rlca_a(); break;                                         // RLCA
      case 0x08: this.exAF(); break;                                           // EX AF AF'
      case 0x09: this.setHL(this.add16(this.getHL(), this.getBC())); break;                   // ADD HL,BC
      case 0x0A: this.a = this.readMem(this.getBC()); break;                             // LD A,(BC)
      case 0x0B: this.decBC(); break;                                          // DEC BC
      case 0x0C: this.c = this.inc8(this.c); break;                                      // INC C
      case 0x0D: this.c = this.dec8(this.c); break;                                      // DEC C
      case 0x0E: this.c = this.readMem(this.pc++); break;                                // LD C,n
      case 0x0F: this.rrca_a(); break;                                         // RRCA
      case 0x10: this.b = (this.b - 1) & 0xFF; this.jr(this.b != 0); break;                                      // DJNZ (PC+e)
      case 0x11: this.setDE(this.readMemWord(this.pc++)); this.pc++; break;             // LD DE,nn
      case 0x12: this.writeMem(this.getDE(), this.a); break;                             // LD (DE),A
      case 0x13: this.incDE(); break;                                          // INC DE
      case 0x14: this.d = this.inc8(this.d); break;                                      // INC D
      case 0x15: this.d = this.dec8(this.d); break;                                      // DEC D
      case 0x16: this.d = this.readMem(this.pc++); break;                              // LD D,n
      case 0x17: this.rla_a(); break;                                          // RLA
      case 0x18: this.pc += this.signExtend(this.d_() + 1); break;                                      // JR (PC+e)
      case 0x19: this.setHL(this.add16(this.getHL(), this.getDE())); break;                   // ADD HL,DE
      case 0x1A: this.a = this.readMem(this.getDE()); break;                             // LD A,(DE)
      case 0x1B: this.decDE(); break;                                          // DEC DE
      case 0x1C: this.e = this.inc8(this.e); break;                                      // INC E
      case 0x1D: this.e = this.dec8(this.e); break;                                      // DEC E
      case 0x1E: this.e = this.readMem(this.pc++); break;                                // LD E,n
      case 0x1F: this.rra_a(); break;                                          // RRA
      case 0x20: this.jr(!((this.f & F_ZERO) != 0)); break;                         // JR NZ,(PC+e)
      case 0x21: this.setHL(this.readMemWord(this.pc++)); this.pc++; break;             // LD HL,nn
      case 0x22:                                                        // LD (nn),HL
        location = this.readMemWord(this.pc);
        this.writeMem(location++, this.l);
        this.writeMem(location, this.h);
        this.pc += 2;
        break;
      case 0x23: this.incHL(); break;                                          // INC HL
      case 0x24: this.h = this.inc8(this.h); break;                                      // INC H
      case 0x25: this.h = this.dec8(this.h); break;                                      // DEC H
      case 0x26: this.h = this.readMem(this.pc++); break;                                // LD H,n
      case 0x27: this.daa(); break;                                            // DAA
      case 0x28: this.jr((this.f & F_ZERO) != 0); break;                          // JR Z,(PC+e)
      case 0x29: this.setHL(this.add16(this.getHL(), this.getHL())); break;                   // ADD HL,HL
      case 0x2A: this.setHL(this.readMemWord(this.readMemWord(this.pc))); this.pc += 2; break; // LD HL,(nn)
      case 0x2B: this.decHL(); break;                                          // DEC HL
      case 0x2C: this.l = this.inc8(this.l); break;                                      // INC L
      case 0x2D: this.l = this.dec8(this.l); break;                                      // DEC L
      case 0x2E: this.l = this.readMem(this.pc++); break;                                // LD L,n
      case 0x2F: this.cpl_a(); break;                                          // CPL
      case 0x30: this.jr(!((this.f & F_CARRY) != 0)); break;                        // JR NC,(PC+e)
      case 0x31: this.sp = this.readMemWord(this.pc); this.pc += 2; break;                      // LD SP,nn
      case 0x32: this.writeMem(this.readMemWord(this.pc), this.a); this.pc += 2; break;              // LD (nn),A
      case 0x33: this.sp++; break;                                             // INC SP
      case 0x34: this.incMem(this.getHL()); break;                                  // INC (HL)
      case 0x35: this.decMem(this.getHL()); break;                                  // DEC (HL)
      case 0x36: this.writeMem(this.getHL(), this.readMem(this.pc++)); break;                 // LD (HL),n
      case 0x37: this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY; break;       // SCF
      case 0x38: this.jr((this.f & F_CARRY) != 0); break;                           // JR C,(PC+e)
      case 0x39: this.setHL(this.add16(this.getHL(), this.sp)); break;                        // ADD HL,SP
      case 0x3A: this.a = this.readMem(this.readMemWord(this.pc)); this.pc += 2; break;              // LD A,(nn)
      case 0x3B: this.sp--; break;                                             // DEC SP
      case 0x3C: this.a = this.inc8(this.a); break;                                      // INC A
      case 0x3D: this.a = this.dec8(this.a); break;                                      // DEC A
      case 0x3E: this.a = this.readMem(this.pc++); break;                                // LD A,n
      case 0x3F: this.ccf(); break;                                            // CCF
      case 0x40: break;                                                   // LD B,B
      case 0x41: this.b = this.c; break;                                            // LD B,C
      case 0x42: this.b = this.d; break;                                            // LD B,D
      case 0x43: this.b = this.e; break;                                            // LD B,E
      case 0x44: this.b = this.h; break;                                            // LD B,H
      case 0x45: this.b = this.l; break;                                            // LD B,L
      case 0x46: this.b = this.readMem(this.getHL()); break;                             // LD B,(HL)
      case 0x47: this.b = this.a; break;                                            // LD B,A
      case 0x48: this.c = this.b; break;                                            // LD C,B
      case 0x49: break;                                                   // LD C,C
      case 0x4A: this.c = this.d; break;                                            // LD C,D
      case 0x4B: this.c = this.e; break;                                            // LD C,E
      case 0x4C: this.c = this.h; break;                                            // LD C,H
      case 0x4D: this.c = this.l; break;                                            // LD C,L
      case 0x4E: this.c = this.readMem(this.getHL()); break;                             // LD C,(HL)
      case 0x4F: this.c = this.a; break;                                            // LD C,A
      case 0x50: this.d = this.b; break;                                            // LD D,B
      case 0x51: this.d = this.c; break;                                            // LD D,C
      case 0x52: break;                                                   // LD D,D
      case 0x53: this.d = this.e; break;                                            // LD D,E
      case 0x54: this.d = this.h; break;                                            // LD D,H
      case 0x55: this.d = this.l; break;                                            // LD D,L
      case 0x56: this.d = this.readMem(this.getHL()); break;                             // LD D,(HL)
      case 0x57: this.d = this.a; break;                                            // LD D,A
      case 0x58: this.e = this.b; break;                                            // LD E,B
      case 0x59: this.e = this.c; break;                                            // LD E,C
      case 0x5A: this.e = this.d; break;                                            // LD E,D
      case 0x5B: break;                                                   // LD E,E
      case 0x5C: this.e = this.h; break;                                            // LD E,H
      case 0x5D: this.e = this.l; break;                                            // LD E,L
      case 0x5E: this.e = this.readMem(this.getHL()); break;                             // LD E,(HL)
      case 0x5F: this.e = this.a; break;                                            // LD E,A
      case 0x60: this.h = this.b; break;                                            // LD H,B
      case 0x61: this.h = this.c; break;                                            // LD H,C
      case 0x62: this.h = this.d; break;                                            // LD H,D
      case 0x63: this.h = this.e; break;                                            // LD H,E
      case 0x64: break;                                                   // LD H,H
      case 0x65: this.h = this.l; break;                                            // LD H,L
      case 0x66: this.h = this.readMem(this.getHL()); break;                             // LD H,(HL)
      case 0x67: this.h = this.a; break;                                            // LD H,A
      case 0x68: this.l = this.b; break;                                            // LD L,B
      case 0x69: this.l = this.c; break;                                            // LD L,C
      case 0x6A: this.l = this.d; break;                                            // LD L,D
      case 0x6B: this.l = this.e; break;                                            // LD L,E
      case 0x6C: this.l = this.h; break;                                            // LD L,H
      case 0x6D: break;                                                   // LD L,L
      case 0x6E: this.l = this.readMem(this.getHL()); break;                             // LD L,(HL)
      case 0x6F: this.l = this.a; break;                                            // LD L,A
      case 0x70: this.writeMem(this.getHL(), this.b); break;                             // LD (HL),B
      case 0x71: this.writeMem(this.getHL(), this.c); break;                             // LD (HL),C
      case 0x72: this.writeMem(this.getHL(), this.d); break;                             // LD (HL),D
      case 0x73: this.writeMem(this.getHL(), this.e); break;                             // LD (HL),E
      case 0x74: this.writeMem(this.getHL(), this.h); break;                             // LD (HL),H
      case 0x75: this.writeMem(this.getHL(), this.l); break;                             // LD (HL),L
      case 0x76: if (HALT_SPEEDUP) this.tstates = 0; this.halt = true; this.pc--; break;                               // HALT
      case 0x77: this.writeMem(this.getHL(), this.a); break;                             // LD (HL),A
      case 0x78: this.a = this.b; break;                                            // LD A,B
      case 0x79: this.a = this.c; break;                                            // LD A,C
      case 0x7A: this.a = this.d; break;                                            // LD A,D
      case 0x7B: this.a = this.e; break;                                            // LD A,E
      case 0x7C: this.a = this.h; break;                                            // LD A,H
      case 0x7D: this.a = this.l; break;                                            // LD A,L
      case 0x7E: this.a = this.readMem(this.getHL()); break;                             // LD A,(HL)
      case 0x7F: break;                                                   // LD A,A
      case 0x80: this.add_a(this.b); break;                                         // ADD A,B
      case 0x81: this.add_a(this.c); break;                                         // ADD A,C
      case 0x82: this.add_a(this.d); break;                                         // ADD A,D
      case 0x83: this.add_a(this.e); break;                                         // ADD A,E
      case 0x84: this.add_a(this.h); break;                                         // ADD A,H
      case 0x85: this.add_a(this.l); break;                                         // ADD A,L
      case 0x86: this.add_a(this.readMem(this.getHL())); break;                          // ADD A,(HL)
      case 0x87: this.add_a(this.a); break;                                         // ADD A,A
      case 0x88: this.adc_a(this.b); break;                                         // ADC A,B
      case 0x89: this.adc_a(this.c); break;                                         // ADC A,C
      case 0x8A: this.adc_a(this.d); break;                                         // ADC A,D
      case 0x8B: this.adc_a(this.e); break;                                         // ADC A,E
      case 0x8C: this.adc_a(this.h); break;                                         // ADC A,H
      case 0x8D: this.adc_a(this.l); break;                                         // ADC A,L
      case 0x8E: this.adc_a(this.readMem(this.getHL())); break;                          // ADC A,(HL)
      case 0x8F: this.adc_a(this.a); break;                                         // ADC A,A
      case 0x90: this.sub_a(this.b); break;                                         // SUB A,B
      case 0x91: this.sub_a(this.c); break;                                         // SUB A,C
      case 0x92: this.sub_a(this.d); break;                                         // SUB A,D
      case 0x93: this.sub_a(this.e); break;                                         // SUB A,E
      case 0x94: this.sub_a(this.h); break;                                         // SUB A,H
      case 0x95: this.sub_a(this.l); break;                                         // SUB A,L
      case 0x96: this.sub_a(this.readMem(this.getHL())); break;                          // SUB A,(HL)
      case 0x97: this.sub_a(this.a); break;                                         // SUB A,A
      case 0x98: this.sbc_a(this.b); break;                                         // SBC A,B
      case 0x99: this.sbc_a(this.c); break;                                         // SBC A,C
      case 0x9A: this.sbc_a(this.d); break;                                         // SBC A,D
      case 0x9B: this.sbc_a(this.e); break;                                         // SBC A,E
      case 0x9C: this.sbc_a(this.h); break;                                         // SBC A,H
      case 0x9D: this.sbc_a(this.l); break;                                         // SBC A,L
      case 0x9E: this.sbc_a(this.readMem(this.getHL())); break;                          // SBC A,(HL)
      case 0x9F: this.sbc_a(this.a); break;                                         // SBC A,A
      case 0xA0: this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY; break;              // AND A,B
      case 0xA1: this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY; break;              // AND A,C
      case 0xA2: this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY; break;              // AND A,D
      case 0xA3: this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY; break;              // AND A,E
      case 0xA4: this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY; break;              // AND A,H
      case 0xA5: this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY; break;              // AND A,L
      case 0xA6: this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY; break; // AND A,(HL)
      case 0xA7: this.f = this.SZP_TABLE[this.a] | F_HALFCARRY; break;                   // AND A,A
      case 0xA8: this.f = this.SZP_TABLE[this.a ^= this.b]; break;                            // XOR A,B
      case 0xA9: this.f = this.SZP_TABLE[this.a ^= this.c]; break;                            // XOR A,C
      case 0xAA: this.f = this.SZP_TABLE[this.a ^= this.d]; break;                            // XOR A,D
      case 0xAB: this.f = this.SZP_TABLE[this.a ^= this.e]; break;                            // XOR A,E
      case 0xAC: this.f = this.SZP_TABLE[this.a ^= this.h]; break;                            // XOR A,H
      case 0xAD: this.f = this.SZP_TABLE[this.a ^= this.l]; break;                            // XOR A,L
      case 0xAE: this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())]; break;             // XOR A,(HL)
      case 0xAF: this.f = this.SZP_TABLE[this.a = 0]; break;                             // XOR A,A
      case 0xB0: this.f = this.SZP_TABLE[this.a |= this.b]; break;                            // OR A,B
      case 0xB1: this.f = this.SZP_TABLE[this.a |= this.c]; break;                            // OR A,C
      case 0xB2: this.f = this.SZP_TABLE[this.a |= this.d]; break;                            // OR A,D
      case 0xB3: this.f = this.SZP_TABLE[this.a |= this.e]; break;                            // OR A,E
      case 0xB4: this.f = this.SZP_TABLE[this.a |= this.h]; break;                            // OR A,H
      case 0xB5: this.f = this.SZP_TABLE[this.a |= this.l]; break;                            // OR A,L
      case 0xB6: this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())]; break;             // OR A,(HL)
      case 0xB7: this.f = this.SZP_TABLE[this.a]; break;                                 // OR A,A
      case 0xB8: this.cp_a(this.b); break;                                          // CP A,B
      case 0xB9: this.cp_a(this.c); break;                                          // CP A,C
      case 0xBA: this.cp_a(this.d); break;                                          // CP A,D
      case 0xBB: this.cp_a(this.e); break;                                          // CP A,E
      case 0xBC: this.cp_a(this.h); break;                                          // CP A,H
      case 0xBD: this.cp_a(this.l); break;                                          // CP A,L
      case 0xBE: this.cp_a(this.readMem(this.getHL())); break;                           // CP A,(HL)
      case 0xBF: this.cp_a(this.a); break;                                          // CP A,A
      case 0xC0: this.ret((this.f & F_ZERO) == 0); break;                          // RET NZ
      case 0xC1: this.setBC(this.readMemWord(this.sp)); this.sp += 2; break;                    // POP BC
      case 0xC2: this.jp((this.f & F_ZERO) == 0); break;                            // JP NZ,(nn)
      case 0xC3: this.pc = this.readMemWord(this.pc); break;                             // JP (nn)
      case 0xC4: this.call((this.f & F_ZERO) == 0); break;                          // CALL NZ (nn)
      case 0xC5: this.push2(this.b, this.c); break;                                       // PUSH BC
      case 0xC6: this.add_a(this.readMem(this.pc++)); break;                             // ADD A,n
      case 0xC7: this.push1(this.pc); this.pc = 0x00; break;                                // RST 00H
      case 0xC8: this.ret((this.f & F_ZERO) != 0); break;                           // RET Z
      case 0xC9: this.pc = this.readMemWord(this.sp); this.sp += 2; break;                      // RET
      case 0xCA: this.jp((this.f & F_ZERO) != 0); break;                            // JP Z,(nn)
      case 0xCB: this.doCB(this.readMem(this.pc++)); break;                              // CB Opcode
      case 0xCC: this.call((this.f & F_ZERO) != 0); break;                          // CALL Z (nn)
      case 0xCD: this.push1(this.pc + 2); this.pc = this.readMemWord(this.pc); break;                 // CALL (nn)
      case 0xCE: this.adc_a(this.readMem(this.pc++)); break;                             // ADC A,n
      case 0xCF: this.push1(this.pc); this.pc = 0x08; break;                                // RST 08H
      case 0xD0: this.ret((this.f & F_CARRY) == 0); break;                          // RET NC
      case 0xD1: this.setDE(this.readMemWord(this.sp)); this.sp += 2; break;                    // POP DE
      case 0xD2: this.jp((this.f & F_CARRY) == 0); break;                           // JP NC,(nn)
      case 0xD3: this.port.out(this.readMem(this.pc++), this.a); break;                       // OUT (n),A
      case 0xD4: this.call((this.f & F_CARRY) == 0); break;                         // CALL NC (nn)
      case 0xD5: this.push2(this.d, this.e); break;                                       // PUSH DE
      case 0xD6: this.sub_a(this.readMem(this.pc++)); break;                             // SUB n
      case 0xD7: this.push1(this.pc); this.pc = 0x10; break;                                // RST 10H
      case 0xD8: this.ret((this.f & F_CARRY) != 0); break;                        // RET C
      case 0xD9: this.exBC(); this.exDE(); this.exHL(); break;                           // EXX
      case 0xDA: this.jp((this.f & F_CARRY) != 0); break;                           // JP C,(nn)
      case 0xDB: this.a = this.port.in_(this.readMem(this.pc++)); break;                       // IN A,(n)
      case 0xDC: this.call((this.f & F_CARRY) != 0); break;                         // CALL C (nn)
      case 0xDD: this.doIndexOpIX(this.readMem(this.pc++)); break;                       // DD Opcode
      case 0xDE: this.sbc_a(this.readMem(this.pc++)); break;                             // SBC A,n
      case 0xDF: this.push1(this.pc); this.pc = 0x18; break;                                // RST 18H
      case 0xE0: this.ret((this.f & F_PARITY) == 0); break;                        // RET PO
      case 0xE1: this.setHL(this.readMemWord(this.sp)); this.sp += 2; break;                    // POP HL
      case 0xE2: this.jp((this.f & F_PARITY) == 0); break;                          // JP PO,(nn)
      case 0xE3:                                                       // EX (SP),HL
        temp = this.h;
        this.h = this.readMem(this.sp + 1);
        this.writeMem(this.sp + 1, temp);
        temp = this.l;
        this.l = this.readMem(this.sp);
        this.writeMem(this.sp, temp);
        break;
      case 0xE4: this.call((this.f & F_PARITY) == 0); break;                        // CALL PO (nn)
      case 0xE5: this.push2(this.h, this.l); break;                                       // PUSH HL
      case 0xE6: this.f = this.SZP_TABLE[this.a &= this.readMem(this.pc++)] | F_HALFCARRY; break;  // AND (n)
      case 0xE7: this.push1(this.pc); this.pc = 0x20; break;                                // RST 20H
      case 0xE8: this.ret((this.f & F_PARITY) != 0); break;                         // RET PE
      case 0xE9: this.pc = this.getHL(); break;                                     // JP (HL)
      case 0xEA: this.jp((this.f & F_PARITY) != 0); break;                          // JP PE,(nn)
      case 0xEB:                                                       // EX DE,HL
        temp = this.d;
        this.d = this.h;
        this.h = temp;
        temp = this.e;
        this.e = this.l;
        this.l = temp;
        break;
      case 0xEC: this.call((this.f & F_PARITY) != 0); break;                        // CALL PE (nn)
      case 0xED: this.doED(this.d_()); break;                                // ED Opcode
      case 0xEE: this.f = this.SZP_TABLE[this.a ^= this.readMem(this.pc++)]; break;                // XOR n
      case 0xEF: this.push1(this.pc); this.pc = 0x28; break;                                // RST 28H
      case 0xF0: this.ret((this.f & F_SIGN) == 0); break;                           // RET P
      case 0xF1: this.setAF(this.readMemWord(this.sp)); this.sp += 2; break;             // POP AF
      case 0xF2: this.jp((this.f & F_SIGN) == 0); break;                            // JP P,(nn)
      case 0xF3: this.iff1 = this.iff2 = false; this.EI_inst = true; break;              // DI
      case 0xF4: this.call((this.f & F_SIGN) == 0); break;                         // CALL P (nn)
      case 0xF5: this.push2(this.a, this.f); break;                                       // PUSH AF
      case 0xF6: this.f = this.SZP_TABLE[this.a |= this.readMem(this.pc++)]; break;                // OR n
      case 0xF7: this.push1(this.pc); this.pc = 0x30; break;                                // RST 30H
      case 0xF8: this.ret((this.f & F_SIGN) != 0); break;                           // RET M
      case 0xF9: this.sp = this.getHL(); break;                                     // LD SP,HL
      case 0xFA: this.jp((this.f & F_SIGN) != 0); break;                            // JP M,(nn)
      case 0xFB: this.iff1 = this.iff2 = this.EI_inst = true; break;                     // EI
      case 0xFC: this.call((this.f & F_SIGN) != 0); break;                          // CALL M (nn)
      case 0xFD: this.doIndexOpIY(this.readMem(this.pc++)); break;                       // FD Opcode
      case 0xFE: this.cp_a(this.readMem(this.pc++)); break;                              // CP n
      case 0xFF: this.push1(this.pc); this.pc = 0x38; break;                                // RST 38H
    } // end switch
  },


  /**
   * Get current cycle number.
   *
   * @return {number} Cycle number.
   */
  getCycle: function() {
    return this.totalCycles - this.tstates;
  },


  /**
   * Generate non maskable interrupt (NMI).
   */
  nmi: function() {
    this.iff2 = this.iff1;
    this.iff1 = false;

    if (REFRESH_EMULATION)
      this.incR();

    // If we're in a halt instruction, increment the PC and get out of it
    if (this.halt) {
      this.pc++;
      this.halt = false;
    }

    this.push1(this.pc);                // Preserve PC on stack
    this.pc = 0x66;
    this.tstates -= 11;
  },


  /**
   * Normal interrupt routine.
   */
  interrupt: function() {
    // Interrupts not allowed OR
    // Interupts not allowed after EI instruction
    if (!this.iff1 || (ACCURATE_INTERRUPT_EMULATION && this.EI_inst)) return;

    // If we're in a halt instruction, increment the PC and get out of it
    if (this.halt) {
      this.pc++;
      this.halt = false;
    }

    if (REFRESH_EMULATION)
      this.incR();

    this.iff1 = this.iff2 = false;
    this.interruptLine = false;

    this.push1(this.pc);                // Preserve PC on stack

    if (this.im == 0) {
      // IM 0: Execute Instruction on Bus
      this.pc = (this.interruptVector == 0 || this.interruptVector == 0xFF) ? 0x38 : this.interruptVector;
      this.tstates -= 13;
    } else if (this.im == 1) {
      // IM 1: Do RST 38h. Ignore Value on Bus.
      this.pc = 0x38;
      this.tstates -= 13;
    } else {
      // IM 2
      this.pc = this.readMemWord((this.i << 8) + this.interruptVector);
      this.tstates -= 19;
    }
  },


  /**
   * Jump.
   *
   * @param {boolean} condition If true jump will be taken.
   */
  jp: function(condition) {
    if (condition) this.pc = this.readMemWord(this.pc);
    else this.pc += 2;
  },


  /**
   * Jump relative.
   *
   * @param {boolean} condition If true jump will be taken.
   */
  jr: function(condition) {
    if (condition) {
      this.pc += this.signExtend(this.d_() + 1);
      this.tstates -= 5;
    }
    else this.pc++;
  },


  /**
   * Sign extend.
   *
   * @param {number} d
   * @return {number}
   */
  signExtend: function(d) {
    if (d >= 128) {
      d = d - 256;
    }
    return d;
  },


  /**
   * Call.
   *
   * @param {boolean} condition If true call will be taken.
   */
  call: function(condition) {
    if (condition) {
      this.push1(this.pc + 2);                 // write value of PC to stack
      this.pc = this.readMemWord(this.pc);
      this.tstates -= 7;
    }
    else this.pc += 2;
  },


  /**
   * Return.
   *
   * @param {boolean} condition If true return will be taken.
   */
  ret: function(condition) {
    if (condition) {
      this.pc = this.readMemWord(this.sp);
      this.sp += 2;
      this.tstates -= 6;
    }
  },


  /**
   * Push value onto stack.
   *
   * @param {number} value Value to push.
   */
  push1: function(value) {
    this.writeMem(--this.sp, value >> 8);   // (SP - 1) <- high
    this.writeMem(--this.sp, value & 0xFF); // (SP - 2) <- low
    //console.log(this.tstates, JSSMS.Utils.toHex(value));
  },


  /**
   * Push value onto stack.
   *
   * @param {number} hi Value to push.
   * @param {number} lo Value to push.
   */
  push2: function(hi, lo) {
    this.writeMem(--this.sp, hi);           // (SP - 1) <- high
    this.writeMem(--this.sp, lo);           // (SP - 2) <- low
    //console.log(this.tstates, JSSMS.Utils.toHex(hi), JSSMS.Utils.toHex(lo));
  },


  /**
   * INC - Increment memory location.
   *
   * @param {number} offset Memory offset to increment.
   */
  incMem: function(offset) {
    this.writeMem(offset, this.inc8(this.readMem(offset)));
  },


  /**
   * DEC - Decrement memory location.
   *
   * @param {number} offset Memory offset to decrement.
   */
  decMem: function(offset) {
    this.writeMem(offset, this.dec8(this.readMem(offset)));
  },


  /**
   * CCF - Complement carry flag.
   */
  ccf: function() {
    if ((this.f & F_CARRY) != 0) {
      this.f &= ~ F_CARRY;
      this.f |= F_HALFCARRY;
    } else {
      this.f |= F_CARRY;
      this.f &= ~ F_HALFCARRY;
    }
    this.f &= ~ F_NEGATIVE;
  },


  /**
   * DAA - Decimal adjust accumulator.
   * Adds 6 to left and/or right nibble.
   *
   * Pre-calculated result for speed.
   *
   * Checked with ZEXALL.
   */
  daa: function() {
    // Get result for calculated table (carry flag = bit 8, negative = bit 9, halfcarry = bit 10)
    var temp = this.DAA_TABLE[this.a | ((this.f & F_CARRY) << 8) | ((this.f & F_NEGATIVE) << 8) | ((this.f & F_HALFCARRY) << 6)];
    this.a = temp & 0xFF;
    this.f = (this.f & F_NEGATIVE) | (temp >> 8);
  },


  /**
   * Execute CB prefixed opcode.
   *
   * @param {number} opcode Opcode hex value.
   */
  doCB: function(opcode) {
    this.tstates -= OP_CB_STATES[opcode];

    if (REFRESH_EMULATION)
      this.incR();

    switch (opcode) {
      case 0x00: this.b = this.rlc(this.b); break;                                 // RLC B
      case 0x01: this.c = this.rlc(this.c); break;                                 // RLC C
      case 0x02: this.d = this.rlc(this.d); break;                                 // RLC D
      case 0x03: this.e = this.rlc(this.e); break;                                 // RLC E
      case 0x04: this.h = this.rlc(this.h); break;                                 // RLC H
      case 0x05: this.l = this.rlc(this.l); break;                                 // RLC L
      case 0x06: this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL()))); break;     // RLC (HL)
      case 0x07: this.a = this.rlc(this.a); break;                                   // RLC A
      case 0x08: this.b = this.rrc(this.b); break;                                 // RRC B
      case 0x09: this.c = this.rrc(this.c); break;                                 // RRC C
      case 0x0A: this.d = this.rrc(this.d); break;                                 // RRC D
      case 0x0B: this.e = this.rrc(this.e); break;                                 // RRC E
      case 0x0C: this.h = this.rrc(this.h); break;                                 // RRC H
      case 0x0D: this.l = this.rrc(this.l); break;                                 // RRC L
      case 0x0E: this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL()))); break;     // RRC (HL)
      case 0x0F: this.a = this.rrc(this.a); break;                                   // RRC A
      case 0x10: this.b = this.rl(this.b); break;                                  // RL B
      case 0x11: this.c = this.rl(this.c); break;                                  // RL C
      case 0x12: this.d = this.rl(this.d); break;                                  // RL D
      case 0x13: this.e = this.rl(this.e); break;                                  // RL E
      case 0x14: this.h = this.rl(this.h); break;                                  // RL H
      case 0x15: this.l = this.rl(this.l); break;                                  // RL L
      case 0x16: this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL()))); break;      // RL (HL)
      case 0x17: this.a = this.rl(this.a); break;                                    // RL A
      case 0x18: this.b = this.rr(this.b); break;                                  // RR B
      case 0x19: this.c = this.rr(this.c); break;                                  // RR C
      case 0x1A: this.d = this.rr(this.d); break;                                  // RR D
      case 0x1B: this.e = this.rr(this.e); break;                                  // RR E
      case 0x1C: this.h = this.rr(this.h); break;                                  // RR H
      case 0x1D: this.l = this.rr(this.l); break;                                  // RR L
      case 0x1E: this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL()))); break;      // RR (HL)
      case 0x1F: this.a = this.rr(this.a); break;                                    // RR A
      case 0x20: this.b = this.sla(this.b); break;                                 // SLA B
      case 0x21: this.c = this.sla(this.c); break;                                 // SLA C
      case 0x22: this.d = this.sla(this.d); break;                                 // SLA D
      case 0x23: this.e = this.sla(this.e); break;                                 // SLA E
      case 0x24: this.h = this.sla(this.h); break;                                 // SLA H
      case 0x25: this.l = this.sla(this.l); break;                                 // SLA L
      case 0x26: this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL()))); break;     // SLA (HL)
      case 0x27: this.a = this.sla(this.a); break;                                   // SLA A
      case 0x28: this.b = this.sra(this.b); break;                                 // SRA B
      case 0x29: this.c = this.sra(this.c); break;                                 // SRA C
      case 0x2A: this.d = this.sra(this.d); break;                                 // SRA D
      case 0x2B: this.e = this.sra(this.e); break;                                 // SRA E
      case 0x2C: this.h = this.sra(this.h); break;                                 // SRA H
      case 0x2D: this.l = this.sra(this.l); break;                                 // SRA L
      case 0x2E: this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL()))); break;     // SRA (HL)
      case 0x2F: this.a = this.sra(this.a); break;                                   // SRA A
      case 0x30: this.b = this.sll(this.b); break;                                 // SLL B
      case 0x31: this.c = this.sll(this.c); break;                                 // SLL C
      case 0x32: this.d = this.sll(this.d); break;                                 // SLL D
      case 0x33: this.e = this.sll(this.e); break;                                 // SLL E
      case 0x34: this.h = this.sll(this.h); break;                                 // SLL H
      case 0x35: this.l = this.sll(this.l); break;                                 // SLL L
      case 0x36: this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL()))); break;     // SLL (HL)
      case 0x37: this.a = this.sll(this.a); break;                                 // SLL A
      case 0x38: this.b = this.srl(this.b); break;                                 // SRL B
      case 0x39: this.c = this.srl(this.c); break;                                 // SRL C
      case 0x3A: this.d = this.srl(this.d); break;                                 // SRL D
      case 0x3B: this.e = this.srl(this.e); break;                                 // SRL E
      case 0x3C: this.h = this.srl(this.h); break;                                 // SRL H
      case 0x3D: this.l = this.srl(this.l); break;                                 // SRL L
      case 0x3E: this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL()))); break;     // SRL (HL)
      case 0x3F: this.a = this.srl(this.a); break;                                   // SRL A
      case 0x40: this.bit(this.b & BIT_0); break;                               // BIT 0,B
      case 0x41: this.bit(this.c & BIT_0); break;                               // BIT 0,C
      case 0x42: this.bit(this.d & BIT_0); break;                               // BIT 0,D
      case 0x43: this.bit(this.e & BIT_0); break;                               // BIT 0,E
      case 0x44: this.bit(this.h & BIT_0); break;                               // BIT 0,H
      case 0x45: this.bit(this.l & BIT_0); break;                               // BIT 0,L
      case 0x46: this.bit(this.readMem(this.getHL()) & BIT_0); break;                // BIT 0,(HL)
      case 0x47: this.bit(this.a & BIT_0); break;                               // BIT 0,A
      case 0x48: this.bit(this.b & BIT_1); break;                               // BIT 1,B
      case 0x49: this.bit(this.c & BIT_1); break;                               // BIT 1,C
      case 0x4A: this.bit(this.d & BIT_1); break;                               // BIT 1,D
      case 0x4B: this.bit(this.e & BIT_1); break;                               // BIT 1,E
      case 0x4C: this.bit(this.h & BIT_1); break;                               // BIT 1,H
      case 0x4D: this.bit(this.l & BIT_1); break;                               // BIT 1,L
      case 0x4E: this.bit(this.readMem(this.getHL()) & BIT_1); break;                // BIT 1,(HL)
      case 0x4F: this.bit(this.a & BIT_1); break;                               // BIT 1,A
      case 0x50: this.bit(this.b & BIT_2); break;                               // BIT 2,B
      case 0x51: this.bit(this.c & BIT_2); break;                               // BIT 2,C
      case 0x52: this.bit(this.d & BIT_2); break;                               // BIT 2,D
      case 0x53: this.bit(this.e & BIT_2); break;                               // BIT 2,E
      case 0x54: this.bit(this.h & BIT_2); break;                               // BIT 2,H
      case 0x55: this.bit(this.l & BIT_2); break;                               // BIT 2,L
      case 0x56: this.bit(this.readMem(this.getHL()) & BIT_2); break;                // BIT 2,(HL)
      case 0x57: this.bit(this.a & BIT_2); break;                               // BIT 2,A
      case 0x58: this.bit(this.b & BIT_3); break;                               // BIT 3,B
      case 0x59: this.bit(this.c & BIT_3); break;                               // BIT 3,C
      case 0x5A: this.bit(this.d & BIT_3); break;                               // BIT 3,D
      case 0x5B: this.bit(this.e & BIT_3); break;                               // BIT 3,E
      case 0x5C: this.bit(this.h & BIT_3); break;                               // BIT 3,H
      case 0x5D: this.bit(this.l & BIT_3); break;                               // BIT 3,L
      case 0x5E: this.bit(this.readMem(this.getHL()) & BIT_3); break;                // BIT 3,(HL)
      case 0x5F: this.bit(this.a & BIT_3); break;                               // BIT 3,A
      case 0x60: this.bit(this.b & BIT_4); break;                               // BIT 4,B
      case 0x61: this.bit(this.c & BIT_4); break;                               // BIT 4,C
      case 0x62: this.bit(this.d & BIT_4); break;                               // BIT 4,D
      case 0x63: this.bit(this.e & BIT_4); break;                               // BIT 4,E
      case 0x64: this.bit(this.h & BIT_4); break;                               // BIT 4,H
      case 0x65: this.bit(this.l & BIT_4); break;                               // BIT 4,L
      case 0x66: this.bit(this.readMem(this.getHL()) & BIT_4); break;                // BIT 4,(HL)
      case 0x67: this.bit(this.a & BIT_4); break;                               // BIT 4,A
      case 0x68: this.bit(this.b & BIT_5); break;                               // BIT 5,B
      case 0x69: this.bit(this.c & BIT_5); break;                               // BIT 5,C
      case 0x6A: this.bit(this.d & BIT_5); break;                               // BIT 5,D
      case 0x6B: this.bit(this.e & BIT_5); break;                               // BIT 5,E
      case 0x6C: this.bit(this.h & BIT_5); break;                               // BIT 5,H
      case 0x6D: this.bit(this.l & BIT_5); break;                               // BIT 5,L
      case 0x6E: this.bit(this.readMem(this.getHL()) & BIT_5); break;                // BIT 5,(HL)
      case 0x6F: this.bit(this.a & BIT_5); break;                               // BIT 5,A
      case 0x70: this.bit(this.b & BIT_6); break;                               // BIT 6,B
      case 0x71: this.bit(this.c & BIT_6); break;                               // BIT 6,C
      case 0x72: this.bit(this.d & BIT_6); break;                               // BIT 6,D
      case 0x73: this.bit(this.e & BIT_6); break;                               // BIT 6,E
      case 0x74: this.bit(this.h & BIT_6); break;                               // BIT 6,H
      case 0x75: this.bit(this.l & BIT_6); break;                               // BIT 6,L
      case 0x76: this.bit(this.readMem(this.getHL()) & BIT_6); break;                // BIT 6,(HL)
      case 0x77: this.bit(this.a & BIT_6); break;                               // BIT 6,A
      case 0x78: this.bit(this.b & BIT_7); break;                               // BIT 7,B
      case 0x79: this.bit(this.c & BIT_7); break;                               // BIT 7,C
      case 0x7A: this.bit(this.d & BIT_7); break;                               // BIT 7,D
      case 0x7B: this.bit(this.e & BIT_7); break;                               // BIT 7,E
      case 0x7C: this.bit(this.h & BIT_7); break;                               // BIT 7,H
      case 0x7D: this.bit(this.l & BIT_7); break;                               // BIT 7,L
      case 0x7E: this.bit(this.readMem(this.getHL()) & BIT_7); break;                // BIT 7,(HL)
      case 0x7F: this.bit(this.a & BIT_7); break;                               // BIT 7,A
      case 0x80: this.b &= ~BIT_0; break;                                  // RES 0,B
      case 0x81: this.c &= ~BIT_0; break;                                  // RES 0,C
      case 0x82: this.d &= ~BIT_0; break;                                  // RES 0,D
      case 0x83: this.e &= ~BIT_0; break;                                  // RES 0,E
      case 0x84: this.h &= ~BIT_0; break;                                  // RES 0,H
      case 0x85: this.l &= ~BIT_0; break;                                  // RES 0,L
      case 0x86: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0); break; // RES 0,(HL)
      case 0x87: this.a &= ~BIT_0; break;                                  // RES 0,A
      case 0x88: this.b &= ~BIT_1; break;                                  // RES 1,B
      case 0x89: this.c &= ~BIT_1; break;                                  // RES 1,C
      case 0x8A: this.d &= ~BIT_1; break;                                  // RES 1,D
      case 0x8B: this.e &= ~BIT_1; break;                                  // RES 1,E
      case 0x8C: this.h &= ~BIT_1; break;                                  // RES 1,H
      case 0x8D: this.l &= ~BIT_1; break;                                  // RES 1,L
      case 0x8E: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1); break; // RES 1,(HL)
      case 0x8F: this.a &= ~BIT_1; break;                                  // RES 1,A
      case 0x90: this.b &= ~BIT_2; break;                                  // RES 2,B
      case 0x91: this.c &= ~BIT_2; break;                                  // RES 2,C
      case 0x92: this.d &= ~BIT_2; break;                                  // RES 2,D
      case 0x93: this.e &= ~BIT_2; break;                                  // RES 2,E
      case 0x94: this.h &= ~BIT_2; break;                                  // RES 2,H
      case 0x95: this.l &= ~BIT_2; break;                                  // RES 2,L
      case 0x96: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2); break; // RES 2,(HL)
      case 0x97: this.a &= ~BIT_2; break;                                  // RES 2,A
      case 0x98: this.b &= ~BIT_3; break;                                  // RES 3,B
      case 0x99: this.c &= ~BIT_3; break;                                  // RES 3,C
      case 0x9A: this.d &= ~BIT_3; break;                                  // RES 3,D
      case 0x9B: this.e &= ~BIT_3; break;                                  // RES 3,E
      case 0x9C: this.h &= ~BIT_3; break;                                  // RES 3,H
      case 0x9D: this.l &= ~BIT_3; break;                                  // RES 3,L
      case 0x9E: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3); break; // RES 3,(HL)
      case 0x9F: this.a &= ~BIT_3; break;                                  // RES 3,A
      case 0xA0: this.b &= ~BIT_4; break;                                  // RES 4,B
      case 0xA1: this.c &= ~BIT_4; break;                                  // RES 4,C
      case 0xA2: this.d &= ~BIT_4; break;                                  // RES 4,D
      case 0xA3: this.e &= ~BIT_4; break;                                  // RES 4,E
      case 0xA4: this.h &= ~BIT_4; break;                                  // RES 4,H
      case 0xA5: this.l &= ~BIT_4; break;                                  // RES 4,L
      case 0xA6: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4); break; // RES 4,(HL)
      case 0xA7: this.a &= ~BIT_4; break;                                  // RES 4,A
      case 0xA8: this.b &= ~BIT_5; break;                                  // RES 5,B
      case 0xA9: this.c &= ~BIT_5; break;                                  // RES 5,C
      case 0xAA: this.d &= ~BIT_5; break;                                  // RES 5,D
      case 0xAB: this.e &= ~BIT_5; break;                                  // RES 5,E
      case 0xAC: this.h &= ~BIT_5; break;                                  // RES 5,H
      case 0xAD: this.l &= ~BIT_5; break;                                  // RES 5,L
      case 0xAE: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5); break; // RES 5,(HL)
      case 0xAF: this.a &= ~BIT_5; break;                                  // RES 5,A
      case 0xB0: this.b &= ~BIT_6; break;                                  // RES 6,B
      case 0xB1: this.c &= ~BIT_6; break;                                  // RES 6,C
      case 0xB2: this.d &= ~BIT_6; break;                                  // RES 6,D
      case 0xB3: this.e &= ~BIT_6; break;                                  // RES 6,E
      case 0xB4: this.h &= ~BIT_6; break;                                  // RES 6,H
      case 0xB5: this.l &= ~BIT_6; break;                                  // RES 6,L
      case 0xB6: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6); break; // RES 6,(HL)
      case 0xB7: this.a &= ~BIT_6; break;                                  // RES 6,A
      case 0xB8: this.b &= ~BIT_7; break;                                  // RES 7,B
      case 0xB9: this.c &= ~BIT_7; break;                                  // RES 7,C
      case 0xBA: this.d &= ~BIT_7; break;                                  // RES 7,D
      case 0xBB: this.e &= ~BIT_7; break;                                  // RES 7,E
      case 0xBC: this.h &= ~BIT_7; break;                                  // RES 7,H
      case 0xBD: this.l &= ~BIT_7; break;                                  // RES 7,L
      case 0xBE: this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7); break; // RES 7,(HL)
      case 0xBF: this.a &= ~BIT_7; break;                                  // RES 7,A
      case 0xC0: this.b |= BIT_0; break;                                   // SET 0,B
      case 0xC1: this.c |= BIT_0; break;                                   // SET 0,C
      case 0xC2: this.d |= BIT_0; break;                                   // SET 0,D
      case 0xC3: this.e |= BIT_0; break;                                   // SET 0,E
      case 0xC4: this.h |= BIT_0; break;                                   // SET 0,H
      case 0xC5: this.l |= BIT_0; break;                                   // SET 0,L
      case 0xC6: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0); break;  // SET 0,(HL)
      case 0xC7: this.a |= BIT_0; break;                                   // SET 0,A
      case 0xC8: this.b |= BIT_1; break;                                   // SET 1,B
      case 0xC9: this.c |= BIT_1; break;                                   // SET 1,C
      case 0xCA: this.d |= BIT_1; break;                                   // SET 1,D
      case 0xCB: this.e |= BIT_1; break;                                   // SET 1,E
      case 0xCC: this.h |= BIT_1; break;                                   // SET 1,H
      case 0xCD: this.l |= BIT_1; break;                                   // SET 1,L
      case 0xCE: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1); break;  // SET 1,(HL)
      case 0xCF: this.a |= BIT_1; break;                                   // SET 1,A
      case 0xD0: this.b |= BIT_2; break;                                   // SET 2,B
      case 0xD1: this.c |= BIT_2; break;                                   // SET 2,C
      case 0xD2: this.d |= BIT_2; break;                                   // SET 2,D
      case 0xD3: this.e |= BIT_2; break;                                   // SET 2,E
      case 0xD4: this.h |= BIT_2; break;                                   // SET 2,H
      case 0xD5: this.l |= BIT_2; break;                                   // SET 2,L
      case 0xD6: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2); break;  // SET 2,(HL)
      case 0xD7: this.a |= BIT_2; break;                                   // SET 2,A
      case 0xD8: this.b |= BIT_3; break;                                   // SET 3,B
      case 0xD9: this.c |= BIT_3; break;                                   // SET 3,C
      case 0xDA: this.d |= BIT_3; break;                                   // SET 3,D
      case 0xDB: this.e |= BIT_3; break;                                   // SET 3,E
      case 0xDC: this.h |= BIT_3; break;                                   // SET 3,H
      case 0xDD: this.l |= BIT_3; break;                                   // SET 3,L
      case 0xDE: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3); break;  // SET 3,(HL)
      case 0xDF: this.a |= BIT_3; break;                                   // SET 3,A
      case 0xE0: this.b |= BIT_4; break;                                   // SET 4,B
      case 0xE1: this.c |= BIT_4; break;                                   // SET 4,C
      case 0xE2: this.d |= BIT_4; break;                                   // SET 4,D
      case 0xE3: this.e |= BIT_4; break;                                   // SET 4,E
      case 0xE4: this.h |= BIT_4; break;                                   // SET 4,H
      case 0xE5: this.l |= BIT_4; break;                                   // SET 4,L
      case 0xE6: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4); break;  // SET 4,(HL)
      case 0xE7: this.a |= BIT_4; break;                                   // SET 4,A
      case 0xE8: this.b |= BIT_5; break;                                   // SET 5,B
      case 0xE9: this.c |= BIT_5; break;                                   // SET 5,C
      case 0xEA: this.d |= BIT_5; break;                                   // SET 5,D
      case 0xEB: this.e |= BIT_5; break;                                   // SET 5,E
      case 0xEC: this.h |= BIT_5; break;                                   // SET 5,H
      case 0xED: this.l |= BIT_5; break;                                   // SET 5,L
      case 0xEE: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5); break;  // SET 5,(HL)
      case 0xEF: this.a |= BIT_5; break;                                   // SET 5,A
      case 0xF0: this.b |= BIT_6; break;                                   // SET 6,B
      case 0xF1: this.c |= BIT_6; break;                                   // SET 6,C
      case 0xF2: this.d |= BIT_6; break;                                   // SET 6,D
      case 0xF3: this.e |= BIT_6; break;                                   // SET 6,E
      case 0xF4: this.h |= BIT_6; break;                                   // SET 6,H
      case 0xF5: this.l |= BIT_6; break;                                   // SET 6,L
      case 0xF6: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6); break;  // SET 6,(HL)
      case 0xF7: this.a |= BIT_6; break;                                   // SET 6,A
      case 0xF8: this.b |= BIT_7; break;                                   // SET 7,B
      case 0xF9: this.c |= BIT_7; break;                                   // SET 7,C
      case 0xFA: this.d |= BIT_7; break;                                   // SET 7,D
      case 0xFB: this.e |= BIT_7; break;                                   // SET 7,E
      case 0xFC: this.h |= BIT_7; break;                                   // SET 7,H
      case 0xFD: this.l |= BIT_7; break;                                   // SET 7,L
      case 0xFE: this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7); break;  // SET 7,(HL)
      case 0xFF: this.a |= BIT_7; break;                                   // SET 7,A

      // Unimplemented CB Opcode
      default:
        JSSMS.Utils.console.log('Unimplemented CB Opcode: ' + JSSMS.Utils.toHex(opcode));
        break;
    }
  },


  /**
   * CB RLC - Rotate left carry.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  rlc: function(value) {
    var carry = (value & 0x80) >> 7;
    value = ((value << 1) | (value >> 7)) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB RRC - Rotate right carry.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  rrc: function(value) {
    var carry = (value & 0x01);
    value = ((value >> 1) | (value << 7)) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB RL - Rotate left.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  rl: function(value) {
    var carry = (value & 0x80) >> 7;
    value = ((value << 1) | (this.f & F_CARRY)) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB RR - Rotate right.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  rr: function(value) {
    var carry = (value & 0x01);
    value = ((value >> 1) | (this.f << 7)) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB SLA - Shift left arithmetic.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  sla: function(value) {
    var carry = (value & 0x80) >> 7;
    value = (value << 1) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB SLL - Logical left shift.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  sll: function(value) {
    var carry = (value & 0x80) >> 7;
    value = ((value << 1) | 1) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB SRA - Shift right arithmetic.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  sra: function(value) {
    var carry = value & 0x01;
    value = (value >> 1) | (value & 0x80);
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB SRL - Logical shift right.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  srl: function(value) {
    var carry = value & 0x01;
    value = (value >> 1) & 0xFF;
    this.f = carry | this.SZP_TABLE[value];
    return value;
  },


  /**
   * CB BIT - Test bit.
   *
   * @param {number} mask Masked value.
   */
  bit: function(mask) {
    this.f = (this.f & F_CARRY) | this.SZ_BIT_TABLE[mask];
  },


  /**
   * Execute DD/FD prefixed index opcode.
   *
   * @param {number} opcode Opcode hex value.
   */
  doIndexOpIX: function(opcode) {
    var location = 0;
    var temp = 0;

    this.tstates -= OP_DD_STATES[opcode];

    if (REFRESH_EMULATION)
      this.incR();

    switch (opcode) {
      case 0x09: this.setIX(this.add16(this.getIX(), this.getBC())); break;             // ADD IX,BC
      case 0x19: this.setIX(this.add16(this.getIX(), this.getDE())); break;             // ADD IX,DE
      case 0x21: this.setIX(this.readMemWord(this.pc)); this.pc += 2; break;              // LD IX,nn
      case 0x22:                                                  // LD (nn),IX
        location = this.readMemWord(this.pc);
        this.writeMem(location++, this.ixL);
        this.writeMem(location, this.ixH);
        this.pc += 2;
        break;
      case 0x23: this.incIX(); break;                                    // INC IX
      case 0x24: this.ixH = this.inc8(this.ixH); break;                            // INC IXH *
      case 0x25: this.ixH = this.dec8(this.ixH); break;                            // DEC IXH *
      case 0x26: this.ixH = this.readMem(this.pc++); break;                        // LD IXh,n *
      case 0x29: this.setIX(this.add16(this.getIX(), this.getIX())); break;             // ADD IX,IX
      case 0x2A:                                                  // LD IX,(nn)
        location = this.readMemWord(this.pc);
        this.ixL = this.readMem(location++);
        this.ixH = this.readMem(location);
        this.pc += 2;
        break;
      case 0x2B: this.decIX(); break;                                    // DEC IX
      case 0x2C: this.ixL = this.inc8(this.ixL); break;                            // INC IXL *
      case 0x2D: this.ixL = this.dec8(this.ixL); break;                            // DEC IXL *
      case 0x2E: this.ixL = this.readMem(this.pc++); break;                        // LD IXl,n
      case 0x34: this.incMem(this.getIX() + this.d_()); this.pc++; break;                  // INC (IX+d)
      case 0x35: this.decMem(this.getIX() + this.d_()); this.pc++; break;                  // DEC (IX+d)
      case 0x36: this.writeMem(this.getIX() + this.d_(), this.readMem(++this.pc)); this.pc++; break; // LD (IX+d),n
      case 0x39: this.setIX(this.add16(this.getIX(), this.sp)); break;                  // ADD IX,SP
      case 0x44: this.b = this.ixH; break;                                    // LD B,IXH *
      case 0x45: this.b = this.ixL; break;                                    // LD B,IXL *
      case 0x46: this.b = this.readMem(this.getIX() + this.d_()); this.pc++; break;             // LD B,(IX+d)
      case 0x4C: this.c = this.ixH; break;                                    // LD C,IXH *
      case 0x4D: this.c = this.ixL; break;                                    // LD C,IXL *
      case 0x4E: this.c = this.readMem(this.getIX() + this.d_()); this.pc++; break;             // LD C,(IX+d)
      case 0x54: this.d = this.ixH; break;                                    // LD D,IXH *
      case 0x55: this.d = this.ixL; break;                                    // LD D,IXL *
      case 0x56: this.d = this.readMem(this.getIX() + this.d_()); this.pc++; break;             // LD D,(IX+d)
      case 0x5C: this.e = this.ixH; break;                                    // LD E,IXH *
      case 0x5D: this.e = this.ixL; break;                                    // LD E,IXL *
      case 0x5E: this.e = this.readMem(this.getIX() + this.d_()); this.pc++; break;             // LD E,(IX+d)
      case 0x60: this.ixH = this.b; break;                                    // LD IXH,B *
      case 0x61: this.ixH = this.c; break;                                    // LD IXH,C *
      case 0x62: this.ixH = this.d; break;                                    // LD IXH,D *
      case 0x63: this.ixH = this.e; break;                                    // LD IXH,E *
      case 0x64: break;                                             // LD IXH,IXH*
      case 0x65: this.ixH = this.ixL; break;                                  // LD IXH,IXL *
      case 0x66: this.h = this.readMem(this.getIX() + this.d_()); this.pc++; break;             // LD H,(IX+d)
      case 0x67: this.ixH = this.a; break;                                    // LD IXH,A *
      case 0x68: this.ixL = this.b; break;                                    // LD IXL,B *
      case 0x69: this.ixL = this.c; break;                                    // LD IXl,C *
      case 0x6A: this.ixL = this.d; break;                                    // LD IXL,D *
      case 0x6B: this.ixL = this.e; break;                                    // LD IXl,E *
      case 0x6C: this.ixL = this.ixH; break;                                  // LD IXl,IXH *
      case 0x6D: break;                                             // LD IXl,IXL *
      case 0x6E: this.l = this.readMem(this.getIX() + this.d_()); this.pc++; break;            // LD L,(IX+d)
      case 0x6F: this.ixL = this.a; break;                                    // LD IXl,A *
      case 0x70: this.writeMem(this.getIX() + this.d_(), this.b); this.pc++; break;             // LD (IX+d),B
      case 0x71: this.writeMem(this.getIX() + this.d_(), this.c); this.pc++; break;             // LD (IX+d),C
      case 0x72: this.writeMem(this.getIX() + this.d_(), this.d); this.pc++; break;             // LD (IX+d),D
      case 0x73: this.writeMem(this.getIX() + this.d_(), this.e); this.pc++; break;             // LD (IX+d),E
      case 0x74: this.writeMem(this.getIX() + this.d_(), this.h); this.pc++; break;             // LD (IX+d),H
      case 0x75: this.writeMem(this.getIX() + this.d_(), this.l); this.pc++; break;             // LD (IX+d),L
      case 0x77: this.writeMem(this.getIX() + this.d_(), this.a); this.pc++; break;             // LD (IX+d),A
      case 0x7C: this.a = this.ixH; break;                                    // LD A,IXH *
      case 0x7D: this.a = this.ixL; break;                                    // LD A,IXL *
      case 0x7E: this.a = this.readMem(this.getIX() + this.d_()); this.pc++; break;             // LD A,(IX+d)
      case 0x84: this.add_a(this.ixH); break;                                 // ADD A,IXH *
      case 0x85: this.add_a(this.ixL); break;                                 // ADD A,IXL *
      case 0x86: this.add_a(this.readMem(this.getIX() + this.d_())); this.pc++; break;          // ADD A,(IX+d)
      case 0x8C: this.adc_a(this.ixH); break;                                 // ADC A,IXH *
      case 0x8D: this.adc_a(this.ixL); break;                                 // ADC A,IXL *
      case 0x8E: this.adc_a(this.readMem(this.getIX() + this.d_())); this.pc++; break;          // ADC A,(IX+d)
      case 0x94: this.sub_a(this.ixH); break;                                 // SUB IXH *
      case 0x95: this.sub_a(this.ixL); break;                                 // SUB IXL *
      case 0x96: this.sub_a(this.readMem(this.getIX() + this.d_())); this.pc++; break;          // SUB A,(IX+d)
      case 0x9C: this.sbc_a(this.ixH); break;                                 // SBC A,IXH *
      case 0x9D: this.sbc_a(this.ixL); break;                                 // SBC A,IXL *
      case 0x9E: this.sbc_a(this.readMem(this.getIX() + this.d_())); this.pc++; break;          // SBC A,(IX+d)
      case 0xA4: this.f = this.SZP_TABLE[this.a &= this.ixH] | F_HALFCARRY; break;      // AND IXH *
      case 0xA5: this.f = this.SZP_TABLE[this.a &= this.ixL] | F_HALFCARRY; break;      // AND IXL *
      case 0xA6: this.f = this.SZP_TABLE[this.a &= this.readMem(this.getIX() + this.d_())] | F_HALFCARRY; this.pc++; break;      // AND A,(IX+d)
      case 0xAC: this.f = this.SZP_TABLE[this.a ^= this.ixH]; break;                    // XOR A IXH*
      case 0xAD: this.f = this.SZP_TABLE[this.a ^= this.ixL]; break;                    // XOR A IXL*
      case 0xAE: this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getIX() + this.d_())];this.pc++; break;// XOR A,(IX+d)
      case 0xB4: this.f = this.SZP_TABLE[this.a |= this.ixH]; break;                    // OR A IXH*
      case 0xB5: this.f = this.SZP_TABLE[this.a |= this.ixL]; break;                    // OR A IXL*
      case 0xB6: this.f = this.SZP_TABLE[this.a |= this.readMem(this.getIX() + this.d_())];this.pc++; break;// OR A,(IX+d)
      case 0xBC: this.cp_a(this.ixH); break;                                    // CP IXH *
      case 0xBD: this.cp_a(this.ixL); break;                                    // CP IXL *
      case 0xBE: this.cp_a(this.readMem(this.getIX() + this.d_())); this.pc++; break; // CP (IX+d)
      case 0xCB: this.doIndexCB(this.getIX()); break;                           // CB Opcode
      case 0xE1: this.setIX(this.readMemWord(this.sp)); this.sp += 2; break;    // POP IX
      case 0xE3:                                                                // EX SP,(IX)
        temp = this.getIX();
        this.setIX(this.readMemWord(this.sp));
        this.writeMem(this.sp, temp & 0xFF);
        this.writeMem(this.sp + 1, temp >> 8);
        break;
      case 0xE5: this.push2(this.ixH, this.ixL); break;                          // PUSH IX
      case 0xE9: this.pc = this.getIX(); break;                                 // JP (IX)
      case 0xF9: this.sp = this.getIX(); break;                                 // LD SP,IX

      // Unimplemented DD/FD Opcode
      default:
        JSSMS.Utils.console.log('Unimplemented DD/FD Opcode: ' + JSSMS.Utils.toHex(opcode));
        this.pc--;
        break;
    } // end of switch
  },


  /**
   * @param {number} opcode Opcode hex value.
   */
  doIndexOpIY: function(opcode) {
    var location;
    var temp;

    this.tstates -= OP_DD_STATES[opcode];

    if (REFRESH_EMULATION)
      this.incR();

    switch (opcode) {
      case 0x09: this.setIY(this.add16(this.getIY(), this.getBC())); break;             // ADD IY,BC
      case 0x19: this.setIY(this.add16(this.getIY(), this.getDE())); break;             // ADD IY,DE
      case 0x21: this.setIY(this.readMemWord(this.pc)); this.pc += 2; break;              // LD IY,nn
      case 0x22:                                                  // LD (nn),IY
        location = this.readMemWord(this.pc);
        this.writeMem(location++, this.iyL);
        this.writeMem(location, this.iyH);
        this.pc += 2;
        break;
      case 0x23: this.incIY(); break;                                    // INC IY
      case 0x24: this.iyH = this.inc8(this.iyH); break;                            // INC IYH *
      case 0x25: this.iyH = this.dec8(this.iyH); break;                            // DEC IYH *
      case 0x26: this.iyH = this.readMem(this.pc++); break;                        // LD IYH,n *
      case 0x29: this.setIY(this.add16(this.getIY(), this.getIY())); break;             // ADD IY,IY
      case 0x2A:                                                  // LD IY,(nn)
        location = this.readMemWord(this.pc);
        this.iyL = this.readMem(location++);
        this.iyH = this.readMem(location);
        this.pc += 2;
        break;
      case 0x2B: this.decIY(); break;                                    // DEC IY
      case 0x2C: this.iyL = this.inc8(this.iyL); break;                            // INC IYL *
      case 0x2D: this.iyL = this.dec8(this.iyL); break;                            // DEC IYL *
      case 0x2E: this.iyL = this.readMem(this.pc++); break;                        // LD IYL,n
      case 0x34: this.incMem(this.getIY() + this.d_()); this.pc++; break;                  // INC (IY+d)
      case 0x35: this.decMem(this.getIY() + this.d_()); this.pc++; break;                  // DEC (IY+d)
      case 0x36: this.writeMem(this.getIY() + this.d_(), this.readMem(++this.pc)); this.pc++; break; // LD (IY+d),n
      case 0x39: this.setIY(this.add16(this.getIY(), this.sp)); break;                  // ADD IY,SP
      case 0x44: this.b = this.iyH; break;                                    // LD B,IYH *
      case 0x45: this.b = this.iyL; break;                                    // LD B,IYL *
      case 0x46: this.b = this.readMem(this.getIY() + this.d_()); this.pc++; break;             // LD B,(IY+d)
      case 0x4C: this.c = this.iyH; break;                                    // LD C,IYH *
      case 0x4D: this.c = this.iyL; break;                                    // LD C,IYL *
      case 0x4E: this.c = this.readMem(this.getIY() + this.d_()); this.pc++; break;             // LD C,(IY+d)
      case 0x54: this.d = this.iyH; break;                                    // LD D,IYH *
      case 0x55: this.d = this.iyL; break;                                    // LD D,IYL *
      case 0x56: this.d = this.readMem(this.getIY() + this.d_()); this.pc++; break;             // LD D,(IY+d)
      case 0x5C: this.e = this.iyH; break;                                    // LD E,IYH *
      case 0x5D: this.e = this.iyL; break;                                    // LD E,IYL *
      case 0x5E: this.e = this.readMem(this.getIY() + this.d_()); this.pc++; break;             // LD E,(IY+d)
      case 0x60: this.iyH = this.b; break;                                    // LD IYH,B *
      case 0x61: this.iyH = this.c; break;                                    // LD IYH,C *
      case 0x62: this.iyH = this.d; break;                                    // LD IYH,D *
      case 0x63: this.iyH = this.e; break;                                    // LD IYH,E *
      case 0x64: break;                                             // LD IYH,IYH*
      case 0x65: this.iyH = this.iyL; break;                                  // LD IYH,IYL *
      case 0x66: this.h = this.readMem(this.getIY() + this.d_()); this.pc++; break;             // LD H,(IY+d)
      case 0x67: this.iyH = this.a; break;                                    // LD IYH,A *
      case 0x68: this.iyL = this.b; break;                                    // LD IYL,B *
      case 0x69: this.iyL = this.c; break;                                    // LD IYL,C *
      case 0x6A: this.iyL = this.d; break;                                    // LD IYL,D *
      case 0x6B: this.iyL = this.e; break;                                    // LD IYL,E *
      case 0x6C: this.iyL = this.iyH; break;                                  // LD IYL,IYH *
      case 0x6D: break;                                             // LD IYL,IYL *
      case 0x6E: this.l = this.readMem(this.getIY() + this.d_()); this.pc++; break;            // LD L,(IY+d)
      case 0x6F: this.iyL = this.a; break;                                    // LD IYL,A *
      case 0x70: this.writeMem(this.getIY() + this.d_(), this.b); this.pc++; break;             // LD (IY+d),B
      case 0x71: this.writeMem(this.getIY() + this.d_(), this.c); this.pc++; break;             // LD (IY+d),C
      case 0x72: this.writeMem(this.getIY() + this.d_(), this.d); this.pc++; break;             // LD (IY+d),D
      case 0x73: this.writeMem(this.getIY() + this.d_(), this.e); this.pc++; break;             // LD (IY+d),E
      case 0x74: this.writeMem(this.getIY() + this.d_(), this.h); this.pc++; break;             // LD (IY+d),H
      case 0x75: this.writeMem(this.getIY() + this.d_(), this.l); this.pc++; break;             // LD (IY+d),L
      case 0x77: this.writeMem(this.getIY() + this.d_(), this.a); this.pc++; break;             // LD (IY+d),A
      case 0x7C: this.a = this.iyH; break;                                    // LD A,IYH *
      case 0x7D: this.a = this.iyL; break;                                    // LD A,IYL *
      case 0x7E: this.a = this.readMem(this.getIY() + this.d_()); this.pc++; break;             // LD A,(IY+d)
      case 0x84: this.add_a(this.iyH); break;                                 // ADD A,IYH *
      case 0x85: this.add_a(this.iyL); break;                                 // ADD A,IYL *
      case 0x86: this.add_a(this.readMem(this.getIY() + this.d_())); this.pc++; break;          // ADD A,(IY+d)
      case 0x8C: this.adc_a(this.iyH); break;                                 // ADC A,IYH *
      case 0x8D: this.adc_a(this.iyL); break;                                 // ADC A,IYL *
      case 0x8E: this.adc_a(this.readMem(this.getIY() + this.d_())); this.pc++; break;          // ADC A,(IY+d)
      case 0x94: this.sub_a(this.iyH); break;                                 // SUB IYH *
      case 0x95: this.sub_a(this.iyL); break;                                 // SUB IYL *
      case 0x96: this.sub_a(this.readMem(this.getIY() + this.d_())); this.pc++; break;          // SUB A,(IY+d)
      case 0x9C: this.sbc_a(this.iyH); break;                                 // SBC A,IYH *
      case 0x9D: this.sbc_a(this.iyL); break;                                 // SBC A,IYL *
      case 0x9E: this.sbc_a(this.readMem(this.getIY() + this.d_())); this.pc++; break;          // SBC A,(IY+d)
      case 0xA4: this.f = this.SZP_TABLE[this.a &= this.iyH] | F_HALFCARRY; break;      // AND IYH *
      case 0xA5: this.f = this.SZP_TABLE[this.a &= this.iyL] | F_HALFCARRY; break;      // AND IYL *
      case 0xA6: this.f = this.SZP_TABLE[this.a &= this.readMem(this.getIY() + this.d_())] | F_HALFCARRY; this.pc++; break; // AND A,(IY+d)
      case 0xAC: this.f = this.SZP_TABLE[this.a ^= this.iyH]; break;                    // XOR A IYH*
      case 0xAD: this.f = this.SZP_TABLE[this.a ^= this.iyL]; break;                    // XOR A IYL*
      case 0xAE: this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getIY() + this.d_())];this.pc++; break;// XOR A,(IY+d)
      case 0xB4: this.f = this.SZP_TABLE[this.a |= this.iyH]; break;                    // OR A IYH*
      case 0xB5: this.f = this.SZP_TABLE[this.a |= this.iyL]; break;                    // OR A IYL*
      case 0xB6: this.f = this.SZP_TABLE[this.a |= this.readMem(this.getIY() + this.d_())];this.pc++; break;// OR A,(IY+d)
      case 0xBC: this.cp_a(this.iyH); break;                                  // CP IYH *
      case 0xBD: this.cp_a(this.iyL); break;                                  // CP IYL *
      case 0xBE: this.cp_a(this.readMem(this.getIY() + this.d_())); this.pc++; break;           // CP (IY+d)
      case 0xCB: this.doIndexCB(this.getIY()); break;                         // CB Opcode
      case 0xE1: this.setIY(this.readMemWord(this.sp)); this.sp += 2; break;              // POP IY
      case 0xE3:                                                                // EX SP,(IY)
        temp = this.getIY();
        this.setIY(this.readMemWord(this.sp));
        this.writeMem(this.sp, temp & 0xFF);
        this.writeMem(this.sp + 1, temp >> 8);
        break;
      case 0xE5: this.push2(this.iyH, this.iyL); break;                          // PUSH IY
      case 0xE9: this.pc = this.getIY(); break;                                 // JP (IY)
      case 0xF9: this.sp = this.getIY(); break;                                 // LD SP,IY

      // Unimplemented DD/FD Opcode
      default:
        JSSMS.Utils.console.log('Unimplemented DD/FD Opcode: ' + JSSMS.Utils.toHex(opcode));
        this.pc--;
        break;
    } // end of switch
  },


  /**
   * Execute DDCB/FDCB prefixed opcode.
   *
   * @todo Implement missing opcodes.
   * @param {number} index Index register to use.
   */
  doIndexCB: function(index) {
    var location = (index + this.d_()) & 0xFFFF;
    var opcode = this.readMem(++this.pc);

    this.tstates -= OP_INDEX_CB_STATES[opcode];

    switch (opcode) {
      case 0x00: this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b); break; // LD B,RLC (IX)
      case 0x01: this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c); break; // LD C,RLC (IX)
      case 0x02: this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d); break; // LD D,RLC (IX)
      case 0x03: this.e = this.rlc(this.readMem(location)); this.writeMem(location, this.e); break; // LD E,RLC (IX)
      case 0x04: this.h = this.rlc(this.readMem(location)); this.writeMem(location, this.h); break; // LD H,RLC (IX)
      case 0x05: this.l = this.rlc(this.readMem(location)); this.writeMem(location, this.l); break; // LD L,RLC (IX)
      case 0x06: this.writeMem(location, this.rlc(this.readMem(location))); break;       // RLC (IX)
      case 0x07: this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a); break; // LD A,RLC (IX)
      case 0x08: this.b = this.rrc(this.readMem(location)); this.writeMem(location, this.b); break; // LD B,RRC (IX)
      case 0x09: this.c = this.rrc(this.readMem(location)); this.writeMem(location, this.c); break; // LD C,RRC (IX)
      case 0x0A: this.d = this.rrc(this.readMem(location)); this.writeMem(location, this.d); break; // LD D,RRC (IX)
      case 0x0B: this.e = this.rrc(this.readMem(location)); this.writeMem(location, this.e); break; // LD E,RRC (IX)
      case 0x0C: this.h = this.rrc(this.readMem(location)); this.writeMem(location, this.h); break; // LD H,RRC (IX)
      case 0x0D: this.l = this.rrc(this.readMem(location)); this.writeMem(location, this.l); break; // LD L,RRC (IX)
      case 0x0E: this.writeMem(location, this.rrc(this.readMem(location))); break;      // RRC (IX)
      case 0x0F: this.a = this.rrc(this.readMem(location)); this.writeMem(location, this.a); break; // LD A,RRC (IX)
      case 0x10: this.b = this.rl(this.readMem(location)); this.writeMem(location, this.b); break;  // LD B,RL (IX)
      case 0x11: this.c = this.rl(this.readMem(location)); this.writeMem(location, this.c); break;  // LD C,RL (IX)
      case 0x12: this.d = this.rl(this.readMem(location)); this.writeMem(location, this.d); break;  // LD D,RL (IX)
      case 0x13: this.e = this.rl(this.readMem(location)); this.writeMem(location, this.e); break;  // LD E,RL (IX)
      case 0x14: this.h = this.rl(this.readMem(location)); this.writeMem(location, this.h); break;  // LD H,RL (IX)
      case 0x15: this.l = this.rl(this.readMem(location)); this.writeMem(location, this.l); break;  // LD L,RL (IX)
      case 0x16: this.writeMem(location, this.rl(this.readMem(location))); break;        // RL (IX)
      case 0x17: this.a = this.rl(this.readMem(location)); this.writeMem(location, this.a); break;  // LD A,RL (IX)
      case 0x18: this.b = this.rr(this.readMem(location)); this.writeMem(location, this.b); break;  // LD B,RR (IX)
      case 0x19: this.c = this.rr(this.readMem(location)); this.writeMem(location, this.c); break;  // LD C,RR (IX)
      case 0x1A: this.d = this.rr(this.readMem(location)); this.writeMem(location, this.d); break;  // LD D,RR (IX)
      case 0x1B: this.e = this.rr(this.readMem(location)); this.writeMem(location, this.e); break;  // LD E,RR (IX)
      case 0x1C: this.h = this.rr(this.readMem(location)); this.writeMem(location, this.h); break;  // LD H,RR (IX)
      case 0x1D: this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l); break;  // LD L,RR (IX)
      case 0x1E: this.writeMem(location, this.rr(this.readMem(location))); break;        // RR (IX)
      case 0x1F: this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a); break;  // LD A,RR (IX)
      case 0x20: this.b = this.sla(this.readMem(location)); this.writeMem(location, this.b); break; // LD B,SLA (IX)
      case 0x21: this.c = this.sla(this.readMem(location)); this.writeMem(location, this.c); break; // LD C,SLA (IX)
      case 0x22: this.d = this.sla(this.readMem(location)); this.writeMem(location, this.d); break; // LD D,SLA (IX)
      case 0x23: this.e = this.sla(this.readMem(location)); this.writeMem(location, this.e); break; // LD E,SLA (IX)
      case 0x24: this.h = this.sla(this.readMem(location)); this.writeMem(location, this.h); break; // LD H,SLA (IX)
      case 0x25: this.l = this.sla(this.readMem(location)); this.writeMem(location, this.l); break; // LD L,SLA (IX)
      case 0x26: this.writeMem(location, this.sla(this.readMem(location))); break;       // SLA (IX)
      case 0x27: this.a = this.sla(this.readMem(location)); this.writeMem(location, this.a); break; // LD A,SLA (IX)
      case 0x28: this.b = this.sra(this.readMem(location)); this.writeMem(location, this.b); break; // LD B,SRA (IX)
      case 0x29: this.c = this.sra(this.readMem(location)); this.writeMem(location, this.c); break; // LD C,SRA (IX)
      case 0x2A: this.d = this.sra(this.readMem(location)); this.writeMem(location, this.d); break; // LD D,SRA (IX)
      case 0x2B: this.e = this.sra(this.readMem(location)); this.writeMem(location, this.e); break; // LD E,SRA (IX)
      case 0x2C: this.h = this.sra(this.readMem(location)); this.writeMem(location, this.h); break; // LD H,SRA (IX)
      case 0x2D: this.l = this.sra(this.readMem(location)); this.writeMem(location, this.l); break; // LD L,SRA (IX)
      case 0x2E: this.writeMem(location, this.sra(this.readMem(location))); break;       // SRA (IX)
      case 0x2F: this.a = this.sra(this.readMem(location)); this.writeMem(location, this.a); break; // LD A,SRA (IX)
      case 0x30: this.b = this.sll(this.readMem(location)); this.writeMem(location, this.b); break; // LD B,SLL (IX)
      case 0x31: this.c = this.sll(this.readMem(location)); this.writeMem(location, this.c); break; // LD C,SLL (IX)
      case 0x32: this.d = this.sll(this.readMem(location)); this.writeMem(location, this.d); break; // LD D,SLL (IX)
      case 0x33: this.e = this.sll(this.readMem(location)); this.writeMem(location, this.e); break; // LD E,SLL (IX)
      case 0x34: this.h = this.sll(this.readMem(location)); this.writeMem(location, this.h); break; // LD H,SLL (IX)
      case 0x35: this.l = this.sll(this.readMem(location)); this.writeMem(location, this.l); break; // LD L,SLL (IX)
      case 0x36: this.writeMem(location, this.sll(this.readMem(location))); break;       // SLL (IX) *
      case 0x37: this.a = this.sll(this.readMem(location)); this.writeMem(location, this.a); break; // LD A,SLL (IX)
      case 0x38: this.b = this.srl(this.readMem(location)); this.writeMem(location, this.b); break; // LD B,SRL (IX)
      case 0x39: this.c = this.srl(this.readMem(location)); this.writeMem(location, this.c); break; // LD C,SRL (IX)
      case 0x3A: this.d = this.srl(this.readMem(location)); this.writeMem(location, this.d); break; // LD D,SRL (IX)
      case 0x3B: this.e = this.srl(this.readMem(location)); this.writeMem(location, this.e); break; // LD E,SRL (IX)
      case 0x3C: this.h = this.srl(this.readMem(location)); this.writeMem(location, this.h); break; // LD H,SRL (IX)
      case 0x3D: this.l = this.srl(this.readMem(location)); this.writeMem(location, this.l); break; // LD L,SRL (IX)
      case 0x3E: this.writeMem(location, this.srl(this.readMem(location))); break;       // SRL (IX)
      case 0x3F: this.a = this.srl(this.readMem(location)); this.writeMem(location, this.a); break; // LD A,SRL (IX)
      case 0x40:
      case 0x41:
      case 0x42:
      case 0x43:
      case 0x44:
      case 0x45:
      case 0x46:
      case 0x47: this.bit(this.readMem(location) & BIT_0); break;                   // BIT 0,(IX)
      case 0x48:
      case 0x49:
      case 0x4A:
      case 0x4B:
      case 0x4C:
      case 0x4D:
      case 0x4E:
      case 0x4F: this.bit(this.readMem(location) & BIT_1); break;                   // BIT 1,(IX)
      case 0x50:
      case 0x51:
      case 0x52:
      case 0x53:
      case 0x54:
      case 0x55:
      case 0x56:
      case 0x57: this.bit(this.readMem(location) & BIT_2); break;                   // BIT 2,(IX)
      case 0x58:
      case 0x59:
      case 0x5A:
      case 0x5B:
      case 0x5C:
      case 0x5D:
      case 0x5E:
      case 0x5F: this.bit(this.readMem(location) & BIT_3); break;                   // BIT 3,(IX)
      case 0x60:
      case 0x61:
      case 0x62:
      case 0x63:
      case 0x64:
      case 0x65:
      case 0x66:
      case 0x67: this.bit(this.readMem(location) & BIT_4); break;                   // BIT 4,(IX)
      case 0x68:
      case 0x69:
      case 0x6A:
      case 0x6B:
      case 0x6C:
      case 0x6D:
      case 0x6E:
      case 0x6F: this.bit(this.readMem(location) & BIT_5); break;                   // BIT 5,(IX)
      case 0x70:
      case 0x71:
      case 0x72:
      case 0x73:
      case 0x74:
      case 0x75:
      case 0x76:
      case 0x77: this.bit(this.readMem(location) & BIT_6); break;                   // BIT 6,(IX)
      case 0x78:
      case 0x79:
      case 0x7A:
      case 0x7B:
      case 0x7C:
      case 0x7D:
      case 0x7E:
      case 0x7F: this.bit(this.readMem(location) & BIT_7); break;                   // BIT 7,(IX)
      case 0x80:
      case 0x81:
      case 0x82:
      case 0x83:
      case 0x84:
      case 0x85:
      case 0x86:
      case 0x87: this.writeMem(location, this.readMem(location) & ~BIT_0); break;   // RES 0,(IX)
      case 0x88:
      case 0x89:
      case 0x8A:
      case 0x8B:
      case 0x8C:
      case 0x8D:
      case 0x8E:
      case 0x8F: this.writeMem(location, this.readMem(location) & ~BIT_1); break;   // RES 1,(IX)
      case 0x90:
      case 0x91:
      case 0x92:
      case 0x93:
      case 0x94:
      case 0x95:
      case 0x96:
      case 0x97: this.writeMem(location, this.readMem(location) & ~BIT_2); break;   // RES 2,(IX)
      case 0x98:
      case 0x99:
      case 0x9A:
      case 0x9B:
      case 0x9C:
      case 0x9D:
      case 0x9E:
      case 0x9F: this.writeMem(location, this.readMem(location) & ~BIT_3); break;   // RES 3,(IX)
      case 0xA0:
      case 0xA1:
      case 0xA2:
      case 0xA3:
      case 0xA4:
      case 0xA5:
      case 0xA6:
      case 0xA7: this.writeMem(location, this.readMem(location) & ~BIT_4); break;   // RES 4,(IX)
      case 0xA8:
      case 0xA9:
      case 0xAA:
      case 0xAB:
      case 0xAC:
      case 0xAD:
      case 0xAE:
      case 0xAF: this.writeMem(location, this.readMem(location) & ~BIT_5); break;   // RES 5,(IX)
      case 0xB0:
      case 0xB1:
      case 0xB2:
      case 0xB3:
      case 0xB4:
      case 0xB5:
      case 0xB6:
      case 0xB7: this.writeMem(location, this.readMem(location) & ~BIT_6); break;   // RES 6,(IX)
      case 0xB8:
      case 0xB9:
      case 0xBA:
      case 0xBB:
      case 0xBC:
      case 0xBD:
      case 0xBE:
      case 0xBF: this.writeMem(location, this.readMem(location) & ~BIT_7); break;   // RES 7,(IX)
      case 0xC0:
      case 0xC1:
      case 0xC2:
      case 0xC3:
      case 0xC4:
      case 0xC5:
      case 0xC6:
      case 0xC7: this.writeMem(location, this.readMem(location) | BIT_0); break;    // SET 0,(IX)
      case 0xC8:
      case 0xC9:
      case 0xCA:
      case 0xCB:
      case 0xCC:
      case 0xCD:
      case 0xCE:
      case 0xCF: this.writeMem(location, this.readMem(location) | BIT_1); break;    // SET 1,(IX)
      case 0xD0:
      case 0xD1:
      case 0xD2:
      case 0xD3:
      case 0xD4:
      case 0xD5:
      case 0xD6:
      case 0xD7: this.writeMem(location, this.readMem(location) | BIT_2); break;    // SET 2,(IX)
      case 0xD8:
      case 0xD9:
      case 0xDA:
      case 0xDB:
      case 0xDC:
      case 0xDD:
      case 0xDE:
      case 0xDF: this.writeMem(location, this.readMem(location) | BIT_3); break;    // SET 3,(IX)
      case 0xE0:
      case 0xE1:
      case 0xE2:
      case 0xE3:
      case 0xE4:
      case 0xE5:
      case 0xE6:
      case 0xE7: this.writeMem(location, this.readMem(location) | BIT_4); break;    // SET 4,(IX)
      case 0xE8:
      case 0xE9:
      case 0xEA:
      case 0xEB:
      case 0xEC:
      case 0xED:
      case 0xEE:
      case 0xEF: this.writeMem(location, this.readMem(location) | BIT_5); break;    // SET 5,(IX)
      case 0xF0:
      case 0xF1:
      case 0xF2:
      case 0xF3:
      case 0xF4:
      case 0xF5:
      case 0xF6:
      case 0xF7: this.writeMem(location, this.readMem(location) | BIT_6); break;    // SET 6,(IX)
      case 0xF8:
      case 0xF9:
      case 0xFA:
      case 0xFB:
      case 0xFC:
      case 0xFD:
      case 0xFE:
      case 0xFF: this.writeMem(location, this.readMem(location) | BIT_7); break;    // SET 7,(IX)

      // Unimplemented DDCB/FDCB Opcode
      default:
        JSSMS.Utils.console.log('Unimplemented DDCB/FDCB Opcode: ' + JSSMS.Utils.toHex(opcode));
        break;

    } // end of switch
    this.pc++;
  },


  /**
   * Execute ED prefixed opcode.
   *
   * @param {number} opcode Opcode hex value.
   */
  doED: function(opcode) {
    var temp = 0;
    var location = 0;

    this.tstates -= OP_ED_STATES[opcode];

    if (REFRESH_EMULATION)
      this.incR();

    switch (opcode) {
      //  -- ED40 IN B,(C) -------------------------
      case 0x40:
        this.b = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];
        this.pc++;
        break;

      //  -- ED41 OUT (C),B -------------------------
      case 0x41: this.port.out(this.c, this.b); this.pc++; break;

      // --  ED42 SBC HL,BC ------------------------
      case 0x42: this.sbc16(this.getBC()); this.pc++; break;

      //  -- ED43 LD (nn),BC ------------------------
      case 0x43:
        location = this.readMemWord(++this.pc);
        this.writeMem(location++, this.c);
        this.writeMem(location, this.b);
        this.pc += 2;
        break;

      //  -- ED44 NEG -------------------------------
      case 0x44:
      case 0x4C:
      case 0x54:
      case 0x5C:
      case 0x64:
      case 0x6C:
      case 0x74:
      case 0x7C:
        // A <- 0-A
        temp = this.a;
        this.a = 0;
        this.sub_a(temp);
        this.pc++;
        break;

      //  -- ED45 RETN / RETI ------------------------------
      case 0x45:
      case 0x4D:
      case 0x55:
      case 0x5D:
      case 0x65:
      case 0x6D:
      case 0x75:
      case 0x7D:
        this.pc = this.readMemWord(this.sp);
        this.sp += 2;
        this.iff1 = this.iff2;
        break;

      //  -- ED46 IM 0-------------------------------
      case 0x46:
      case 0x4E:
      case 0x66:
      case 0x6E:
        this.im = 0;
        this.pc++;
        break;

      //  -- ED47 LD I,A ---------------------------
      case 0x47: this.i = this.a; this.pc++; break;

      //  -- ED48 IN C,(C) -------------------------
      case 0x48:
        this.c = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];
        this.pc++;
        break;

      //  -- ED49 OUT (C),C -------------------------
      case 0x49: this.port.out(this.c, this.c); this.pc++; break;

      //  -- ED4A ADC HL,BC ------------------------
      case 0x4A: this.adc16(this.getBC()); this.pc++; break;

      //  -- ED4B LD BC,(nn) -----------------------
      case 0x4B:
        this.setBC(this.readMemWord(this.readMemWord(++this.pc)));
        this.pc += 2;
        break;

      //  -- ED4F LD R,A ---------------------------
      case 0x4F: this.r = this.a; this.pc++; break;

      //  -- ED50 IN D,(C) -------------------------
      case 0x50:
        this.d = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];
        this.pc++;
        break;

      //  -- ED51 OUT (C),D -------------------------
      case 0x51: this.port.out(this.c, this.d); this.pc++; break;

      // --  ED52 SBC HL,DE ------------------------
      case 0x52: this.sbc16(this.getDE()); this.pc++; break;

      //  -- ED53 LD (nn),DE ------------------------
      case 0x53:
        location = this.readMemWord(++this.pc);
        this.writeMem(location++, this.e); // SPl
        this.writeMem(location, this.d);   // SPh
        this.pc += 2;
        break;

      //  -- ED56 IM 1-------------------------------
      case 0x56:
      case 0x76: this.im = 1; this.pc++; break;

      //  -- ED57 LD A,I ---------------------------
      case 0x57:
        this.a = this.i;
        this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);
        this.pc++;
        break;

      //  -- ED58 IN E,(C) -------------------------
      case 0x58:
        this.e = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];
        this.pc++;
        break;

      //  -- ED59 OUT (C),E -------------------------
      case 0x59: this.port.out(this.c, this.e); this.pc++; break;

      //  -- ED5A ADC HL,DE ------------------------
      case 0x5A: this.adc16(this.getDE()); this.pc++; break;

      //  -- ED5B LD DE,(nn) -----------------------
      case 0x5B:
        this.setDE(this.readMemWord(this.readMemWord(++this.pc)));
        this.pc += 2;
        break;

      // -- ED5F LD A,R -----------------------------
      case 0x5F:
        // Note, to fake refresh emulation we use the random number generator
        this.a = REFRESH_EMULATION ? this.r : JSSMS.Utils.rndInt(255);
        this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);
        this.pc++;
        break;

      //  -- ED60 IN H,(C) -------------------------
      case 0x60:
        this.h = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];
        this.pc++;
        break;

      //  -- ED61 OUT (C),H -------------------------
      case 0x61: this.port.out(this.c, this.h); this.pc++; break;

      // --  ED62 SBC HL,HL ------------------------
      case 0x62: this.sbc16(this.getHL()); this.pc++; break;

      //  -- ED63 LD (nn),HL ------------------------
      case 0x63:
        location = this.readMemWord(++this.pc);
        this.writeMem(location++, this.l); // SPl
        this.writeMem(location, this.h);   // SPh
        this.pc += 2;
        break;

      //  -- ED67 RRD -------------------------------
      case 0x67:
        location = this.getHL();
        temp = this.readMem(location);

        // move high 4 of hl to low 4 of hl
        // move low 4 of a to high 4 of hl
        this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));
        // move 4 lowest bits of hl to low 4 of a
        this.a = (this.a & 0xF0) | (temp & 0x0F);

        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];
        this.pc++;
        break;

      //  -- ED68 IN L,(C) --------------------------
      case 0x68:
        this.l = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];
        this.pc++;
        break;

      //  -- ED69 OUT (C),L -------------------------
      case 0x69: this.port.out(this.c, this.l); this.pc++; break;

      //  -- ED6A ADC HL,HL ------------------------
      case 0x6A: this.adc16(this.getHL()); this.pc++; break;

      //  -- ED6B LD HL,(nn) -----------------------
      case 0x6B:
        this.setHL(this.readMemWord(this.readMemWord(++this.pc)));
        this.pc += 2;
        break;

      //  -- ED6F RLD -------------------------------
      case 0x6F:
        location = this.getHL();
        temp = this.readMem(location);

        // move low 4 of hl to high 4 of hl
        // move low 4 of a to low 4 of hl
        this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));

        // move high 4 of hl to low 4 of a
        this.a = (this.a & 0xF0) | (temp >> 4);

        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];
        this.pc++;
        break;

      //  *- ED71 OUT (C),0 -------------------------
      case 0x71: this.port.out(this.c, 0); this.pc++; break;

      // --  ED72 SBC HL,SP ------------------------
      case 0x72: this.sbc16(this.sp); this.pc++; break;

      //  -- ED73 LD (nn),SP ------------------------
      case 0x73:
        location = this.readMemWord(++this.pc);
        this.writeMem(location++, this.sp & 0xFF); // SPl
        this.writeMem(location, this.sp >> 8);     // SPh
        this.pc += 2;
        break;

      //  -- ED78 IN A,(C) -------------------------
      case 0x78:
        this.a = this.port.in_(this.c);
        this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];
        this.pc++;
        break;

      //  -- ED79 OUT (C),A -------------------------
      case 0x79: this.port.out(this.c, this.a); this.pc++; break;

      // --  ED7A ADC HL,SP ------------------------
      case 0x7A: this.adc16(this.sp); this.pc++; break;

      //  -- ED7B LD SP,(nn) -----------------------
      case 0x7B:
        this.sp = this.readMemWord(this.readMemWord(++this.pc));
        this.pc += 2;
        break;

      //  -- EDA0 LDI ----------------------------------
      case 0xA0:
        // (DE) <- (HL)
        this.writeMem(this.getDE(), this.readMem(this.getHL()));
        this.incDE();
        this.incHL();
        this.decBC();

        this.f = (this.f & 0xC1) | (this.getBC() != 0 ? F_PARITY : 0);
        this.pc++;
        break;

      //  -- EDA1 CPI ------------------------------
      case 0xA1:
        temp = (this.f & F_CARRY) | F_NEGATIVE;
        this.cp_a(this.readMem(this.getHL())); // sets some flags
        this.incHL();
        this.decBC();

        temp |= (this.getBC() == 0 ? 0 : F_PARITY);

        this.f = (this.f & 0xF8) | temp;
        this.pc++;
        break;

      //  -- EDA2 INI -------------------------------
      case 0xA2:
        temp = this.port.in_(this.c);
        this.writeMem(this.getHL(), temp);
        this.b = this.dec8(this.b);
        this.incHL();

        if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        this.pc++;
        // undocumented flags not finished.
        break;

      //  -- EDA3 OUTI ------------------------------
      // see p14 of undocumented z80 for additional flag info
      case 0xA3:
        temp = this.readMem(this.getHL());
        // (C) <- (HL)
        this.port.out(this.c, temp);
        // HL <- HL + 1
        this.incHL();
        // B <- B -1
        this.b = this.dec8(this.b); // Flags in OUTI adjusted in same way as dec b anyway.

        if ((this.l + temp) > 255) {
          this.f |= F_CARRY; this.f |= F_HALFCARRY;
        } else {
          this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;
        }
        if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        this.pc++;
        break;

      //  -- EDA8 LDD ----------------------------------
      case 0xA8:
        // (DE) <- (HL)
        this.writeMem(this.getDE(), this.readMem(this.getHL()));
        this.decDE();
        this.decHL();
        this.decBC();

        this.f = (this.f & 0xC1) | (this.getBC() != 0 ? F_PARITY : 0);
        this.pc++;
        break;

      //  -- EDA9 CPD ------------------------------
      case 0xA9:
        temp = (this.f & F_CARRY) | F_NEGATIVE;
        this.cp_a(this.readMem(this.getHL())); // sets some flags
        this.decHL();
        this.decBC();

        temp |= (this.getBC() == 0 ? 0 : F_PARITY);

        this.f = (this.f & 0xF8) | temp;
        this.pc++;
        break;

      //  -- EDAA IND -------------------------------
      case 0xAA:
        temp = this.port.in_(this.c);
        this.writeMem(this.getHL(), temp);
        this.b = this.dec8(this.b);
        this.decHL();

        if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        this.pc++;
        // undocumented flags not finished.
        break;

      //  -- EDAB OUTD ------------------------------
      // see p14 of undocumented z80 for additional flag info
      case 0xAB:
        temp = this.readMem(this.getHL());
        // (C) <- (HL)
        this.port.out(this.c, temp);
        // HL <- HL - 1
        this.decHL();
        // B <- B -1
        this.b = this.dec8(this.b); // Flags in OUTI adjusted in same way as dec b anyway.

        if ((this.l + temp) > 255) {
          this.f |= F_CARRY; this.f |= F_HALFCARRY;
        } else {
          this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;
        }
        if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        this.pc++;
        break;

      //  -- EDB0 LDIR ------------------------------
      case 0xB0:
        this.writeMem(this.getDE(), this.readMem(this.getHL()));
        this.incDE();
        this.incHL();
        this.decBC();

        if (this.getBC() != 0) {
          this.f |= F_PARITY;
          this.tstates -= 5;
          this.pc--;
        } else {
          this.f &= ~ F_PARITY;
          this.pc++;
        }

        this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;
        break;

      //  -- EDB1 CPIR ------------------------------
      case 0xB1:
        temp = (this.f & F_CARRY) | F_NEGATIVE;
        this.cp_a(this.readMem(this.getHL())); // sets zero flag for us
        this.incHL();
        this.decBC();

        temp |= (this.getBC() == 0 ? 0 : F_PARITY);

        // Repeat instruction until a = (hl) or bc == 0
        if ((temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0) {
          this.tstates -= 5;
          this.pc--;
        } else {
          this.pc++;
        }

        this.f = (this.f & 0xF8) | temp; // Sign set by the cp instruction
        break;

      //  -- EDB2 INIR ------------------------------
      case 0xB2:
        temp = this.port.in_(this.c);
        this.writeMem(this.getHL(), temp);
        this.b = this.dec8(this.b);
        this.incHL();

        if (this.b != 0) {
          this.tstates -= 5;
          this.pc--;
        } else {
          this.pc++;
        }

        if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        // undocumented flags not finished.
        break;

      //  -- EDB3 OTIR ------------------------------
      case 0xB3:
        temp = this.readMem(this.getHL());
        // (C) <- (HL)
        this.port.out(this.c, temp);
        // B <- B -1
        this.b = this.dec8(this.b);
        // HL <- HL + 1
        this.incHL();

        if (this.b != 0) {
          this.tstates -= 5;
          this.pc--;
        } else {
          this.pc++;
        }
        if ((this.l + temp) > 255) {
          this.f |= F_CARRY; this.f |= F_HALFCARRY;
        } else {
          this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;
        }

        if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        break;

      // -- EDB8 LDDR ---------------------------------
      case 0xB8:
        this.writeMem(this.getDE(), this.readMem(this.getHL()));
        this.decDE();
        this.decHL();
        this.decBC();

        if (this.getBC() != 0) {
          this.f |= F_PARITY;
          this.tstates -= 5;
          this.pc--;
        } else {
          this.f &= ~ F_PARITY;
          this.pc++;
        }

        this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;
        break;

      // -- EDB9 CPDR ------------------------------------
      case 0xB9:
        temp = (this.f & F_CARRY) | F_NEGATIVE;
        this.cp_a(this.readMem(this.getHL())); // sets zero flag for us
        this.decHL();
        this.decBC();

        temp |= (this.getBC() == 0 ? 0 : F_PARITY);

        // Repeat instruction until a = (hl) or bc == 0
        if ((temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0) {
          this.tstates -= 5;
          this.pc--;
        } else {
          this.pc++;
        }

        this.f = (this.f & 0xF8) | temp;
        break;

      //  -- EDBA INDR ------------------------------
      case 0xBA:
        temp = this.port.in_(this.c);
        this.writeMem(this.getHL(), temp);
        this.b = this.dec8(this.b);
        this.decHL();

        if (this.b != 0) {
          this.tstates -= 5;
          this.pc--;
        } else {
          this.pc++;
        }

        if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        // undocumented flags not finished.
        break;

      //  -- EDBB OTDR ------------------------------
      case 0xBB:
        temp = this.readMem(this.getHL());
        // (C) <- (HL)
        this.port.out(this.c, temp);
        // B <- B -1
        this.b = this.dec8(this.b);
        // HL <- HL + 1
        this.decHL();

        if (this.b != 0) {
          this.tstates -= 5;
          this.pc--;
        } else {
          this.pc++;
        }
        if ((this.l + temp) > 255) {
          this.f |= F_CARRY; this.f |= F_HALFCARRY;
        } else {
          this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;
        }

        if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;
        else this.f &= ~ F_NEGATIVE;
        break;

      // Unimplemented ED Opcode
      default:
        JSSMS.Utils.console.log('Unimplemented ED Opcode: ' + JSSMS.Utils.toHex(opcode));
        this.pc++;
        break;
    } // end of switch
  },


  /**
   * Pre-calculate DAA table.
   *
   * Address:
   *
   * Bottom 8 bytes = a value
   * Byte 9  = carry flag
   * Byte 10 = negative flag
   * Byte 11 = halfcarry flag
   *
   * Returned value:
   *
   * a register stored in lower 8 bits
   * f register stored in higher 8 bits
   */
  generateDAATable: function() {
    var i, c, h, n;

    // Iterate all possible values of a register (0 to 0xFF)
    i = 256;
    while (i--) {
      // Iterate carry / not-carry set
      for (c = 0; c <= 1; c++) {
        // Iterate halfcarry / not-halfcarry set
        for (h = 0; h <= 1; h++) {
          // Iterate negative / not-negative set
          for (n = 0; n <= 1; n++) {
            this.DAA_TABLE[(c << 8) | (n << 9) | (h << 10) | i] = this.getDAAResult(i, c | (n << 1) | (h << 4));
          }
        }
      }
    }

    // Reset these to be sure
    this.a = this.f = 0;
  },


  /**
   * @param {number} value
   * @param {number} flags
   * @return {number}
   */
  getDAAResult: function(value, flags) {
    this.a = value;
    this.f = flags;

    var a_copy = this.a;
    var correction = 0;
    var carry = (flags & F_CARRY);
    var carry_copy = carry;
    if ((flags & F_HALFCARRY) != 0 || (a_copy & 0x0F) > 0x09) {
      correction |= 0x06;
    }
    if ((carry == 1) || (a_copy > 0x9F) || ((a_copy > 0x8F) && ((a_copy & 0x0F) > 0x09))) {
      correction |= 0x60;
      carry_copy = 1;
    }
    if (a_copy > 0x99) {
      carry_copy = 1;
    }
    if ((flags & F_NEGATIVE) != 0) {
      // cycle -= 4;
      this.sub_a(correction);
    } else {
      // cycle -= 4;
      this.add_a(correction);
    }

    flags = (this.f & 0xFE) | carry_copy;

    if (this.getParity(this.a)) {
      flags = (flags & 0xFB) | F_PARITY;
    } else {
      flags = (flags & 0xFB);
    }

    return this.a | (flags << 8);
  },


  // ACCUMULATOR REGISTER
  /**
   * ADD 8 BIT.
   *
   * @param {number} value Value to add.
   */
  add_a: function(value) {
    var temp = (this.a + value) & 0xFF;
    this.f = this.SZHVC_ADD_TABLE[(this.a << 8) | temp];
    this.a = temp;
  },


  /**
   * ADC 8 BIT - Add with carry.
   *
   * @param {number} value Value to add.
   */
  adc_a: function(value) {
    var carry = this.f & F_CARRY;
    var temp = (this.a + value + carry) & 0xFF;
    this.f = this.SZHVC_ADD_TABLE[(carry << 16) | (this.a << 8) | temp];
    this.a = temp;
  },


  /**
   * SUB 8 BIT.
   *
   * @param {number} value Value to subtract.
   */
  sub_a: function(value) {
    var temp = (this.a - value) & 0xFF;
    this.f = this.SZHVC_SUB_TABLE[(this.a << 8) | temp];
    this.a = temp;
  },


  /**
   * SBC 8 BIT.
   *
   * @param {number} value Subtract with carry.
   */
  sbc_a: function(value) {
    var carry = this.f & F_CARRY;
    var temp = (this.a - value - carry) & 0xFF;
    this.f = this.SZHVC_SUB_TABLE[(carry << 16) | (this.a << 8) | temp];
    this.a = temp;
  },


  /**
   * CP Operation - Compare with accumulator.
   *
   * @param {number} value Value to compare.
   */
  cp_a: function(value) {
    // Subtract value from accumulator but discard result
    this.f = this.SZHVC_SUB_TABLE[(this.a << 8) | ((this.a - value) & 0xFF)];
  },


  /**
   * CPL Operation - Complement accumulator.
   *
   * Bit 3 and Bit incomplete
   */
  cpl_a: function() {
    this.a ^= 0xFF;
    this.f |= (F_NEGATIVE | F_HALFCARRY);
  },


  /**
   * RRA Operation - Rotate right accumulator.
   */
  rra_a: function() {
    var carry = this.a & 1; // bit 1 rotates to carry flag
    this.a = ((this.a >> 1) | (this.f & F_CARRY) << 7) & 0xFF; // Shift Right One Bit Position
    this.f = (this.f & 0xEC) | carry;
  },


  /**
   * RLA Operation - Rotate left accumulator.
   */
  rla_a: function() {
    var carry = this.a >> 7; // bit 7 rotates to carry flag
    this.a = ((this.a << 1) | (this.f & F_CARRY)) & 0xFF;
    this.f = (this.f & 0xEC) | carry;
  },


  /**
   * RLCA Operation - Rotate left with carry accumulator.
   */
  rlca_a: function() {
    // Transfer Original Bit 7 to Bit 0 and Carry Flag
    var carry = this.a >> 7;

    // Shift register left
    this.a = ((this.a << 1) & 0xFF) | carry;

    // Retain Sign, Zero, Bit 5, Bit 3 and Parity
    this.f = (this.f & 0xEC) | carry;
  },


  /**
   * RRCA Operation - Rotate right with carry accumulator.
   */
  rrca_a: function() {
    var carry = this.a & 1;

    this.a = (this.a >> 1) | (carry << 7);

    // Retain Sign, Zero, Bit 5, Bit 3 and Parity
    this.f = (this.f & 0xEC) | carry;
  },


  // NORMAL REGISTER ACCESS
  /**
   * @return {number}
   */
  getBC: function() {
    return (this.b << 8) | this.c;
  },


  /**
   * @return {number}
   */
  getDE: function() {
    return (this.d << 8) | this.e;
  },


  /**
   * @return {number}
   */
  getHL: function() {
    return (this.h << 8) | this.l;
  },


  /**
   * @return {number}
   */
  getIX: function() {
    return (this.ixH << 8) | this.ixL;
  },


  /**
   * @return {number}
   */
  getIY: function() {
    return (this.iyH << 8) | this.iyL;
  },


  /**
   * @param {number} value
   */
  setBC: function(value) {
    this.b = (value >> 8);
    this.c = value & 0xFF;
  },


  /**
   * @param {number} value
   */
  setDE: function(value) {
    this.d = (value >> 8);
    this.e = value & 0xFF;
  },


  /**
   * @param {number} value
   */
  setHL: function(value) {
    this.h = (value >> 8);
    this.l = value & 0xFF;
  },


  /**
   * @param {number} value
   */
  setAF: function(value) {
    this.a = (value >> 8);
    this.f = value & 0xFF;
  },


  /**
   * @param {number} value
   */
  setIX: function(value) {
    this.ixH = (value >> 8);
    this.ixL = value & 0xFF;
  },


  /**
   * @param {number} value
   */
  setIY: function(value) {
    this.iyH = (value >> 8);
    this.iyL = value & 0xFF;
  },


  incBC: function() {
    this.c = (this.c + 1) & 0xFF;
    if (this.c == 0) this.b = (this.b + 1) & 0xFF;
  },


  incDE: function() {
    this.e = (this.e + 1) & 0xFF;
    if (this.e == 0) this.d = (this.d + 1) & 0xFF;
  },


  incHL: function() {
    this.l = (this.l + 1) & 0xFF;
    if (this.l == 0) this.h = (this.h + 1) & 0xFF;
  },


  incIX: function() {
    this.ixL = (this.ixL + 1) & 0xFF;
    if (this.ixL == 0) this.ixH = (this.ixH + 1) & 0xFF;
  },


  incIY: function() {
    this.iyL = (this.iyL + 1) & 0xFF;
    if (this.iyL == 0) this.iyH = (this.iyH + 1) & 0xFF;
  },


  decBC: function() {
    this.c = (this.c - 1) & 0xFF;
    if (this.c == 255) this.b = (this.b - 1) & 0xFF;
  },


  decDE: function() {
    this.e = (this.e - 1) & 0xFF;
    if (this.e == 255) this.d = (this.d - 1) & 0xFF;
  },


  decHL: function() {
    this.l = (this.l - 1) & 0xFF;
    if (this.l == 255) this.h = (this.h - 1) & 0xFF;
  },


  decIX: function() {
    this.ixL = (this.ixL - 1) & 0xFF;
    if (this.ixL == 255) this.ixH = (this.ixH - 1) & 0xFF;
  },


  decIY: function() {
    this.iyL = (this.iyL - 1) & 0xFF;
    if (this.iyL == 255) this.iyH = (this.iyH - 1) & 0xFF;
  },


  /**
   * @param {number} value
   * @return {number}
   */
  inc8: function(value) {
    value = (value + 1) & 0xFF;
    this.f = (this.f & F_CARRY) | this.SZHV_INC_TABLE[value];
    return value;
  },


  /**
   * @param {number} value
   * @return {number}
   */
  dec8: function(value) {
    value = (value - 1) & 0xFF;
    this.f = (this.f & F_CARRY) | this.SZHV_DEC_TABLE[value];
    return value;
  },


  // EXCHANGE REGISTER BANKS
  exAF: function() {
    var temp = this.a; this.a = this.a2; this.a2 = temp;
    temp = this.f; this.f = this.f2; this.f2 = temp;
  },


  exBC: function() {
    var temp = this.b; this.b = this.b2; this.b2 = temp;
    temp = this.c; this.c = this.c2; this.c2 = temp;
  },


  exDE: function() {
    var temp = this.d; this.d = this.d2; this.d2 = temp;
    temp = this.e; this.e = this.e2; this.e2 = temp;
  },


  exHL: function() {
    var temp = this.h; this.h = this.h2; this.h2 = temp;
    temp = this.l; this.l = this.l2; this.l2 = temp;
  },


  /**
   * @param {number} reg
   * @param {number} value
   * @return {number}
   */
  add16: function(reg, value) {
    var result = reg + value;
    this.f = (this.f & 0xC4) | (((reg ^ result ^ value) >> 8) & 0x10) | ((result >> 16) & 1);
    return result & 0xFFFF;
  },


  /**
   * Add with carry (16-bit).
   * Only ever affects HL register.
   *
   * @param {number} value
   */
  adc16: function(value) {
    var hl = this.getHL();

    var result = hl + value + (this.f & F_CARRY);
    this.f = (((hl ^ result ^ value) >> 8) & 0x10) | ((result >> 16) & 1) | ((result >> 8) & 0x80) | (((result & 0xFFFF) != 0) ? 0 : 0x40) | (((value ^ hl ^ 0x8000) & (value ^ result) & 0x8000) >> 13);
    this.h = (result >> 8) & 0xFF;
    this.l = result & 0xFF;
  },


  /**
   * Subtract with carry (16-bit).
   * Only ever affects HL register.
   *
   * @param {number} value
   */
  sbc16: function(value) {
    var hl = this.getHL();

    var result = hl - value - (this.f & F_CARRY);
    this.f = (((hl ^ result ^ value) >> 8) & 0x10) | 0x02 | ((result >> 16) & 1) | ((result >> 8) & 0x80) | (((result & 0xFFFF) != 0) ? 0 : 0x40) | (((value ^ hl) & (hl ^ result) & 0x8000) >> 13);
    this.h = (result >> 8) & 0xFF;
    this.l = result & 0xFF;
  },


  /**
   * Increment refresh register.
   */
  incR: function() {
    this.r = (this.r & 0x80) | ((this.r + 1) & 0x7F);
  },


  // FLAG REGISTER
  /**
   * Generate flag tables.
   *
   * Based on code from the Java Emulation Framework
   * Copyright (C) 2002 Erik Duijs (erikduijs@yahoo.com)
   */
  generateFlagTables: function() {
    var i, sf, zf, yf, xf, pf;
    var padd, padc, psub, psbc;
    var val, oldval, newval;

    // Generate tables
    for (i = 0; i < 256; i++) {
      // Sign bits (0x80)
      sf = ((i & 0x80) != 0 ? F_SIGN : 0);

      // Zero bits (0x40)
      zf = (i == 0 ? F_ZERO : 0);

      // Bit 5 (0x20)
      yf = i & 0x20;

      // Halfcarry (0x10)
      //hf = 0;

      // Bit 3 (0x08)
      xf = i & 0x08;

      // Overflow (0x04)
      //vf = 0;

      // Parity bits (0x04)
      pf = (this.getParity(i) ? F_PARITY : 0);

      // Generate Sign/Zero Table
      this.SZ_TABLE[i] = (sf | zf | yf | xf);

      // Generate Sign/Zero/Parity Table
      this.SZP_TABLE[i] = (sf | zf | yf | xf | pf);

      // Generate table for inc8 instruction
      this.SZHV_INC_TABLE[i] = (sf | zf | yf | xf);
      this.SZHV_INC_TABLE[i] |= (i == 0x80) ? F_OVERFLOW : 0;
      this.SZHV_INC_TABLE[i] |= ((i & 0x0F) == 0x00) ? F_HALFCARRY : 0;

      // Generate table for dec8 instruction
      this.SZHV_DEC_TABLE[i] = (sf | zf | yf | xf | F_NEGATIVE);
      this.SZHV_DEC_TABLE[i] |= (i == 0x7F) ? F_OVERFLOW : 0;
      this.SZHV_DEC_TABLE[i] |= ((i & 0x0F) == 0x0F) ? F_HALFCARRY : 0;

      // Generate table for bit instruction (set sign flag on here)
      this.SZ_BIT_TABLE[i] = ((i != 0) ? i & 0x80 : F_ZERO | F_PARITY);
      this.SZ_BIT_TABLE[i] |= yf | xf | F_HALFCARRY; // halfcarry is always on with bit instruction :)
    }

    // Generate fast lookups for ADD/SUB/ADC/SBC instructions
    padd = 0 * 256;
    padc = 256 * 256;
    psub = 0 * 256;
    psbc = 256 * 256;

    for (oldval = 0; oldval < 256; oldval++) {
      for (newval = 0; newval < 256; newval++) {
        /* add or adc w/o carry set */
        val = newval - oldval;

        if (newval != 0) {
          if ((newval & 0x80) != 0) {
            this.SZHVC_ADD_TABLE[padd] = F_SIGN;
          } else {
            this.SZHVC_ADD_TABLE[padd] = 0;
          }
        } else {
          this.SZHVC_ADD_TABLE[padd] = F_ZERO;
        }

        this.SZHVC_ADD_TABLE[padd] |= (newval & (F_BIT5 | F_BIT3)); /* undocumented flag bits 5+3 */

        if ((newval & 0x0F) < (oldval & 0x0F)) {
          this.SZHVC_ADD_TABLE[padd] |= F_HALFCARRY;
        }
        if (newval < oldval) {
          this.SZHVC_ADD_TABLE[padd] |= F_CARRY;
        }
        if (((val ^ oldval ^ 0x80) & (val ^ newval) & 0x80) != 0) {
          this.SZHVC_ADD_TABLE[padd] |= F_OVERFLOW;
        }
        padd++;

        /* adc with carry set */
        val = newval - oldval - 1;
        if (newval != 0) {
          if ((newval & 0x80) != 0) {
            this.SZHVC_ADD_TABLE[padc] = F_SIGN;
          } else {
            this.SZHVC_ADD_TABLE[padc] = 0;
          }
        } else {
          this.SZHVC_ADD_TABLE[padc] = F_ZERO;
        }

        this.SZHVC_ADD_TABLE[padc] |= (newval & (F_BIT5 | F_BIT3)); /* undocumented flag bits 5+3 */
        if ((newval & 0x0F) <= (oldval & 0x0F)) {
          this.SZHVC_ADD_TABLE[padc] |= F_HALFCARRY;
        }
        if (newval <= oldval) {
          this.SZHVC_ADD_TABLE[padc] |= F_CARRY;
        }
        if (((val ^ oldval ^ 0x80) & (val ^ newval) & 0x80) != 0) {
          this.SZHVC_ADD_TABLE[padc] |= F_OVERFLOW;
        }
        padc++;

        /* cp, sub or sbc w/o carry set */
        val = oldval - newval;
        if (newval != 0) {
          if ((newval & 0x80) != 0) {
            this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE | F_SIGN;
          } else {
            this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE;
          }
        } else {
          this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE | F_ZERO;
        }

        this.SZHVC_SUB_TABLE[psub] |= (newval & (F_BIT5 | F_BIT3)); /* undocumented flag bits 5+3 */
        if ((newval & 0x0F) > (oldval & 0x0F)) {
          this.SZHVC_SUB_TABLE[psub] |= F_HALFCARRY;
        }
        if (newval > oldval) {
          this.SZHVC_SUB_TABLE[psub] |= F_CARRY;
        }
        if (((val ^ oldval) & (oldval ^ newval) & 0x80) != 0) {
          this.SZHVC_SUB_TABLE[psub] |= F_OVERFLOW;
        }
        psub++;

        /* sbc with carry set */
        val = oldval - newval - 1;
        if (newval != 0) {
          if ((newval & 0x80) != 0) {
            this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE | F_SIGN;
          } else {
            this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE;
          }
        } else {
          this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE | F_ZERO;
        }

        this.SZHVC_SUB_TABLE[psbc] |= (newval & (F_BIT5 | F_BIT3)); /* undocumented flag bits 5+3 */
        if ((newval & 0x0F) >= (oldval & 0x0F)) {
          this.SZHVC_SUB_TABLE[psbc] |= F_HALFCARRY;
        }
        if (newval >= oldval) {
          this.SZHVC_SUB_TABLE[psbc] |= F_CARRY;
        }
        if (((val ^ oldval) & (oldval ^ newval) & 0x80) != 0) {
          this.SZHVC_SUB_TABLE[psbc] |= F_OVERFLOW;
        }
        psbc++;
      }
    }
  },


  /**
   * Return the parity of a number.
   * Only used for pre-calculations.
   *
   * @param {number} value
   * @return {boolean} true if parity.
   */
  getParity: function(value) {
    var parity = true;
    var j;
    for (j = 0; j < 8; j++) {
      if ((value & (1 << j)) != 0) {
        parity = !parity;
      }
    }
    return parity;
  },


  // MEMORY ACCESS
  /**
   * Memory constructor.
   */
  generateMemory: function() {
    if (SUPPORT_DATAVIEW) {
      for (var i = 0; i < 0x2000; i++) {
        this.memWriteMap.setUint8(i, 0);
      }
    } else {
      for (var i = 0; i < 0x2000; i++) {
        this.memWriteMap[i] = 0;
      }
    }

    // Create 2 x 16K RAM Cartridge Pages
    if (SUPPORT_DATAVIEW) {
      for (i = 0; i < 0x8000; i++) {
        this.sram.setUint8(i, 0);
      }
    } else {
      for (i = 0; i < 0x8000; i++) {
        this.sram[i] = 0;
      }
    }
    this.useSRAM = false;

    this.number_of_pages = 2;

    for (i = 0; i < 4; i++) {
      this.frameReg[i] = i % 3;
    }
  },


  /**
   * Reset memory to default values.
   *
   * @param {Array.<Array.<number>>=} pages
   */
  resetMemory: function(pages) {
    if (pages) {
      this.rom = pages;
    }

    // Default Mapping
    if (this.rom.length) {
      this.number_of_pages = this.rom.length;
      this.romPageMask = this.number_of_pages - 1;

      // Paginated memory registers
      for (var i = 0; i < 3; i++) {
        this.frameReg[i] = i % this.number_of_pages;
      }
      this.frameReg[3] = 0;
    } else {
      this.number_of_pages = 0;
      this.romPageMask = 0;
    }
  },


  /**
   * Read a signed value from next memory location.
   *
   * @return {number} Value from memory location.
   */
  d_: function() {
    return this.readMem(this.pc);
  },


  /**
   * Write to a memory location.
   */
  writeMem: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} address Memory address.
       * @param {number} value Value to write.
       */
      return function(address, value) {
        if (address <= 0xFFFF) {
          this.memWriteMap.setInt8(address & 0x1FFF, value);
          if (address == 0xFFFC) {
            this.frameReg[3] = value;
          } else if (address == 0xFFFD) {
            this.frameReg[0] = value & this.romPageMask;
          } else if (address == 0xFFFE) {
            this.frameReg[1] = value & this.romPageMask;
          } else if (address == 0xFFFF) {
            this.frameReg[2] = value & this.romPageMask;
          }
        } else {
          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address), JSSMS.Utils.toHex(address & 0x1FFF));
          if (DEBUGGER)
            debugger;
        }
      }
    } else {
      /**
       * @param {number} address Memory address.
       * @param {number} value Value to write.
       */
      return function(address, value) {
        if (address <= 0xFFFF) {
          this.memWriteMap[address & 0x1FFF] = value;
          if (address == 0xFFFC) {
            this.frameReg[3] = value;
          } else if (address == 0xFFFD) {
            this.frameReg[0] = value & this.romPageMask;
          } else if (address == 0xFFFE) {
            this.frameReg[1] = value & this.romPageMask;
          } else if (address == 0xFFFF) {
            this.frameReg[2] = value & this.romPageMask;
          }
        } else {
          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address), JSSMS.Utils.toHex(address & 0x1FFF));
          if (DEBUGGER)
            debugger;
        }
      }
    }
  }(),


  /**
   * Read a signed value from next memory location.
   */
  readMem: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        if (address < 0x0400) {
          return this.rom[0].getUint8(address);
        } else if (address < 0x4000) {
          return this.rom[this.frameReg[0]].getUint8(address);
        } else if (address < 0x8000) {
          return this.rom[this.frameReg[1]].getUint8(address - 0x4000);
        } else if (address < 0xC000) {
          if ((this.frameReg[3] & 12) == 8) {
            this.useSRAM = true;
            return this.sram.getUint8(address - 0x8000);
          } else if ((this.frameReg[3] & 12) == 12) {
            this.useSRAM = true;
            return this.sram.getUint8(address - 0x4000);
          } else {
            return this.rom[this.frameReg[2]].getUint8(address - 0x8000);
          }
        } else if (address < 0xE000) {
          return this.memWriteMap.getUint8(address - 0xC000);
        } else if (address < 0xFFFC) {
          return this.memWriteMap.getUint8(address - 0xE000);
        } else if (address == 0xFFFC) {
          // 0xFFFC: RAM/ROM select register
          return this.frameReg[3];
        } else if (address == 0xFFFD) {
          // 0xFFFD: Page 0 ROM Bank
          return this.frameReg[0];
        } else if (address == 0xFFFE) {
          // 0xFFFE: Page 1 ROM Bank
          return this.frameReg[1];
        } else if (address == 0xFFFF) {
          // 0xFFFF: Page 2 ROM Bank
          return this.frameReg[2];
        } else {
          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
          if (DEBUGGER)
            debugger;
        }
        return 0x00;
      }
    } else {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        if (address < 0x0400) {
          return this.rom[0][address];
        } else if (address < 0x4000) {
          return this.rom[this.frameReg[0]][address];
        } else if (address < 0x8000) {
          return this.rom[this.frameReg[1]][address - 0x4000];
        } else if (address < 0xc000) {
          if ((this.frameReg[3] & 12) == 8) {
            this.useSRAM = true;
            return this.sram[address - 0x8000];
          } else if ((this.frameReg[3] & 12) == 12) {
            this.useSRAM = true;
            return this.sram[address - 0x4000];
          } else {
            return this.rom[this.frameReg[2]][address - 0x8000];
          }
        } else if (address < 0xE000) {
          return this.memWriteMap[address - 0xC000];
        } else if (address < 0xFFFC) {
          return this.memWriteMap[address - 0xE000];
        } else if (address == 0xFFFC) {
          // 0xFFFC: RAM/ROM select register
          return this.frameReg[3];
        } else if (address == 0xFFFD) {
          // 0xFFFD: Page 0 ROM Bank
          return this.frameReg[0];
        } else if (address == 0xFFFE) {
          // 0xFFFE: Page 1 ROM Bank
          return this.frameReg[1];
        } else if (address == 0xFFFF) {
          // 0xFFFF: Page 2 ROM Bank
          return this.frameReg[2];
        } else {
          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
          if (DEBUGGER)
            debugger;
        }
        return 0x00;
      }
    }
  }(),


  /**
   * Read a word (two bytes) from a memory location.
   */
  readMemWord: function() {
    if (SUPPORT_DATAVIEW) {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        if (address < 0x0400) {
          return this.rom[0].getUint16(address, LITTLE_ENDIAN);
        } else if (address < 0x4000) {
          return this.rom[this.frameReg[0]].getUint16(address, LITTLE_ENDIAN);
        } else if (address < 0x8000) {
          return this.rom[this.frameReg[1]].getUint16(address - 0x4000, LITTLE_ENDIAN);
        } else if (address < 0xC000) {
          if ((this.frameReg[3] & 12) == 8) {
            this.useSRAM = true;
            return this.sram[address - 0x8000];
          } else if ((this.frameReg[3] & 12) == 12) {
            this.useSRAM = true;
            return this.sram[address - 0x4000];
          } else {
            return this.rom[this.frameReg[2]].getUint16(address - 0x8000, LITTLE_ENDIAN);
          }
        } else if (address < 0xE000) {
          return this.memWriteMap.getUint16(address - 0xC000, LITTLE_ENDIAN);
        } else if (address < 0xFFFC) {
          return this.memWriteMap.getUint16(address - 0xE000, LITTLE_ENDIAN);
        } else if (address == 0xFFFC) {
          // 0xFFFC: RAM/ROM select register
          return this.frameReg[3];
        } else if (address == 0xFFFD) {
          // 0xFFFD: Page 0 ROM Bank
          return this.frameReg[0];
        } else if (address == 0xFFFE) {
          // 0xFFFE: Page 1 ROM Bank
          return this.frameReg[1];
        } else if (address == 0xFFFF) {
          // 0xFFFF: Page 2 ROM Bank
          return this.frameReg[2];
        } else {
          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
          if (DEBUGGER)
            debugger;
        }
        return 0x00;
      }
    } else {
      /**
       * @param {number} address
       * @return {number} Value from memory location.
       */
      return function(address) {
        if (address < 0x0400) {
          return this.rom[0][address] | this.rom[0][++address] << 8;
        } else if (address < 0x4000) {
          return this.rom[this.frameReg[0]][address] | this.rom[this.frameReg[0]][++address] << 8;
        } else if (address < 0x8000) {
          return this.rom[this.frameReg[1]][address - 0x4000] | this.rom[this.frameReg[1]][++address - 0x4000] << 8;
        } else if (address < 0xC000) {
          if ((this.frameReg[3] & 12) == 8) {
            this.useSRAM = true;
            return this.sram[address - 0x8000] | this.sram[++address - 0x8000] << 8;
          } else if ((this.frameReg[3] & 12) == 12) {
            this.useSRAM = true;
            return this.sram[address - 0x4000] | this.sram[++address - 0x4000] << 8;
          } else {
            return this.rom[this.frameReg[2]][address - 0x8000] | this.rom[this.frameReg[2]][++address - 0x8000] << 8;
          }
        } else if (address < 0xE000) {
          return this.memWriteMap[address - 0xC000] | this.memWriteMap[++address - 0xC000] << 8;
        } else if (address < 0xFFFC) {
          return this.memWriteMap[address - 0xE000] | this.memWriteMap[++address - 0xE000] << 8;
        } else if (address == 0xFFFC) {
          // 0xFFFC: RAM/ROM select register
          return this.frameReg[3];
        } else if (address == 0xFFFD) {
          // 0xFFFD: Page 0 ROM Bank
          return this.frameReg[0];
        } else if (address == 0xFFFE) {
          // 0xFFFE: Page 1 ROM Bank
          return this.frameReg[1];
        } else if (address == 0xFFFF) {
          // 0xFFFF: Page 2 ROM Bank
          return this.frameReg[2];
        } else {
          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
          if (DEBUGGER)
            debugger;
        }
        return 0x00;
      }
    }
  }(),


  /**
   * @return {boolean}
   */
  hasUsedSRAM: function() {
    return this.useSRAM;
  },


  setSRAM: function(bytes) {
    var length = bytes.length / PAGE_SIZE;
    var i;

    for (i = 0; i < length; i++)
      JSSMS.Utils.copyArrayElements(bytes, i * PAGE_SIZE, this.sram[i], 0, PAGE_SIZE);
  },


  /**
   * Called when restoring from a saved state.
   *
   * @param {Array.<number>} state Contents of frame register.
   */
  setStateMem: function(state) {
    this.frameReg = state;
  },


  // Z80 State Saving
  /**
   * @return {Array.<number>}
   */
  getState: function() {
    /**
     * Length of state array.
     * @type {number}
     */
    var STATE_LENGTH = 8;
    var state = new Array(STATE_LENGTH);

    state[0] = this.pc | (this.sp << 16);
    state[1] = (this.iff1 ? 0x01 : 0) | (this.iff2 ? 0x02 : 0) | (this.halt ? 0x04 : 0) | (this.EI_inst ? 0x08 : 0) | (this.interruptLine ? 0x10 : 0);
    state[2] = this.a | (this.a2 << 8) | (this.f << 16) | (this.f2 << 24); // AF AF'
    state[3] = this.getBC() | (this.getDE() << 16); // BC DE
    state[4] = this.getHL() | (this.r << 16) | (this.i << 24); // HL, r, i
    state[5] = this.getIX() | (this.getIY() << 16); // IX, IY

    this.exBC(); this.exDE(); this.exHL(); // swap registers

    state[6] = this.getBC() | (this.getDE() << 16); // BC' DE'
    state[7] = this.getHL() | (this.im << 16) | (this.interruptVector << 24); // HL' and interrupt mode

    this.exBC(); this.exDE(); this.exHL(); // restore registers

    return state;
  },


  /**
   * @param {Array.<number>} state
   */
  setState: function(state) {
    var temp = state[0];
    this.pc = temp & 0xFFFF;
    this.sp = (temp >> 16) & 0xFFFF;

    temp = state[1];
    this.iff1 = (temp & 0x01) != 0;
    this.iff2 = (temp & 0x02) != 0;
    this.halt = (temp & 0x04) != 0;
    this.EI_inst = (temp & 0x08) != 0;
    this.interruptLine = (temp & 0x10) != 0;

    temp = state[2];
    this.a = temp & 0xFF;
    this.a2 = (temp >> 8) & 0xFF;
    this.f = (temp >> 16) & 0xFF;
    this.f2 = (temp >> 24) & 0xFF;

    temp = state[3];
    this.setBC(temp & 0xFFFF);
    this.setDE((temp >> 16) & 0xFFFF);

    temp = state[4];
    this.setHL(temp & 0xFFFF);
    this.r = (temp >> 16) & 0xFF;
    this.i = (temp >> 24) & 0xFF;

    temp = state[5];
    this.setIX(temp & 0xFFFF);
    this.setIY((temp >> 16) & 0xFFFF);

    this.exBC(); this.exDE(); this.exHL(); // swap registers

    temp = state[6];
    this.setBC(temp & 0xFFFF);
    this.setDE((temp >> 16) & 0xFFFF);

    temp = state[7];
    this.setHL(temp & 0xFFFF);
    this.im = (temp >> 16) & 0xFF;
    this.interruptVector = (temp >> 24) & 0xFF;

    this.exBC(); this.exDE(); this.exHL(); // restore registers
  }
};
