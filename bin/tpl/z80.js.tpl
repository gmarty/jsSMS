/**
 * jsSMS - A Sega Master System/GameGear emulator in JavaScript
 * Copyright (C) 2012  Guillaume Marty (https://github.com/gmarty)
 * Based on JavaGear Copyright (c) 2002-2008 Chris White
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
   * @type {Array.<Array.<number>>}
   */
  this.rom = [];

  /**
   * RAM.
   * @type {Array.<Array.<number>>}
   */
  this.ram = new Array(8);

  /**
   * SRAM.
   * @type {Array.<Array.<number>>}
   */
  this.sram = Array(32);

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
   * Total number of 16K cartridge pages.
   * @type {number}
   */
  this.number_of_pages = 0;

  /**
   * Memory map.
   * @type {Array.<Array>}
   */
  this.memWriteMap = new Array(65);

  /**
   * @type {Array.<Array>}
   */
  this.memReadMap = new Array(65);

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


  /**
   * Write to a memory location.
   *
   * @param {number} address Memory address.
   * @param {number} value Value to write.
   */
  this.writeMem = JSSMS.Utils.writeMem.bind(this, this);


  /**
   * Read from a memory location.
   *
   * @param {number} address Memory location.
   * @return {number} Value from memory location.
   */
  this.readMem = JSSMS.Utils.readMem.bind(this, this.memReadMap);


  /**
   * Read a word (two bytes) from a memory location.
   *
   * @param {number} address Memory address.
   * @return {number} Value from memory location.
   */
  this.readMemWord = JSSMS.Utils.readMemWord.bind(this, this.memReadMap);
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
    this.tstates = 0;
    this.totalCycles = 0;

    this.im = 0;
    this.iff1 = false;
    this.iff2 = false;
    this.EI_inst = false;
    this.interruptVector = 0;
    this.halt = false;
  },


  /**
   * Run Z80.
   *
   * @param {number} cycles Machine cycles to run for in total.
   * @param {number} cyclesTo
   */
  run: {{run_method_code}},


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

    if (Setup.REFRESH_EMULATION)
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
    if (!this.iff1 || (Setup.ACCURATE_INTERRUPT_EMULATION && this.EI_inst)) return;

    // If we're in a halt instruction, increment the PC and get out of it
    if (this.halt) {
      this.pc++;
      this.halt = false;
    }

    if (Setup.REFRESH_EMULATION)
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
    this.writeMem(--this.sp, value & 0xff); // (SP - 2) <- low
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
   * CB RLC - Rotate left carry.
   *
   * @param {number} value Value to adjust.
   * @return {number} Adjusted value.
   */
  rlc: function(value) {
    var carry = (value & 0x80) >> 7;
    value = ((value << 1) | (value >> 7)) & 0xff;
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
    value = ((value >> 1) | (value << 7)) & 0xff;
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
    value = ((value << 1) | (this.f & F_CARRY)) & 0xff;
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
    value = ((value >> 1) | (this.f << 7)) & 0xff;
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
    value = (value << 1) & 0xff;
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
    value = ((value << 1) | 1) & 0xff;
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
    value = (value >> 1) & 0xff;
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
   * Pre-calculate DAA table.
   *
   * Address:
   *
   * Bottom 8 bytes = a value
   * Byte 9  = carry flag
   * Byte 10 = neative flag
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
    if ((flags & F_HALFCARRY) != 0 || (a_copy & 0x0f) > 0x09) {
      correction |= 0x06;
    }
    if ((carry == 1) || (a_copy > 0x9f) || ((a_copy > 0x8f) && ((a_copy & 0x0f) > 0x09))) {
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

    flags = (this.f & 0xfe) | carry_copy;

    if (this.getParity(this.a)) {
      flags = (flags & 0xfb) | F_PARITY;
    } else {
      flags = (flags & 0xfb);
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
    var temp = (this.a + value) & 0xff;
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
    var temp = (this.a + value + carry) & 0xff;
    this.f = this.SZHVC_ADD_TABLE[(carry << 16) | (this.a << 8) | temp];
    this.a = temp;
  },


  /**
   * SUB 8 BIT.
   *
   * @param {number} value Value to subtract.
   */
  sub_a: function(value) {
    var temp = (this.a - value) & 0xff;
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
    var temp = (this.a - value - carry) & 0xff;
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
    this.f = this.SZHVC_SUB_TABLE[(this.a << 8) | ((this.a - value) & 0xff)];
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
    this.a = ((this.a >> 1) | (this.f & F_CARRY) << 7) & 0xff; // Shift Right One Bit Position
    this.f = (this.f & 0xec) | carry;
  },


  /**
   * RLA Operation - Rotate left accumulator.
   */
  rla_a: function() {
    var carry = this.a >> 7; // bit 7 rotates to carry flag
    this.a = ((this.a << 1) | (this.f & F_CARRY)) & 0xff;
    this.f = (this.f & 0xec) | carry;
  },


  /**
   * RLCA Operation - Rotate left with carry accumulator.
   */
  rlca_a: function() {
    // Transfer Original Bit 7 to Bit 0 and Carry Flag
    var carry = this.a >> 7;

    // Shift register left
    this.a = ((this.a << 1) & 0xff) | carry;

    // Retain Sign, Zero, Bit 5, Bit 3 and Parity
    this.f = (this.f & 0xec) | carry;
  },


  /**
   * RRCA Operation - Rotate right with carry accumulator.
   */
  rrca_a: function() {
    var carry = this.a & 1;

    this.a = (this.a >> 1) | (carry << 7);

    // Retain Sign, Zero, Bit 5, Bit 3 and Parity
    this.f = (this.f & 0xec) | carry;
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
    this.c = value & 0xff;
  },


  /**
   * @param {number} value
   */
  setDE: function(value) {
    this.d = (value >> 8);
    this.e = value & 0xff;
  },


  /**
   * @param {number} value
   */
  setHL: function(value) {
    this.h = (value >> 8);
    this.l = value & 0xff;
  },


  /**
   * @param {number} value
   */
  setIX: function(value) {
    this.ixH = (value >> 8);
    this.ixL = value & 0xff;
  },


  /**
   * @param {number} value
   */
  setIY: function(value) {
    this.iyH = (value >> 8);
    this.iyL = value & 0xff;
  },


  incBC: function() {
    this.c = (this.c + 1) & 0xff;
    if (this.c == 0) this.b = (this.b + 1) & 0xff;
  },


  incDE: function() {
    this.e = (this.e + 1) & 0xff;
    if (this.e == 0) this.d = (this.d + 1) & 0xff;
  },


  incHL: function() {
    this.l = (this.l + 1) & 0xff;
    if (this.l == 0) this.h = (this.h + 1) & 0xff;
  },


  incIX: function() {
    this.ixL = (this.ixL + 1) & 0xff;
    if (this.ixL == 0) this.ixH = (this.ixH + 1) & 0xff;
  },


  incIY: function() {
    this.iyL = (this.iyL + 1) & 0xff;
    if (this.iyL == 0) this.iyH = (this.iyH + 1) & 0xff;
  },


  decBC: function() {
    this.c = (this.c - 1) & 0xff;
    if (this.c == 255) this.b = (this.b - 1) & 0xff;
  },


  decDE: function() {
    this.e = (this.e - 1) & 0xff;
    if (this.e == 255) this.d = (this.d - 1) & 0xff;
  },


  decHL: function() {
    this.l = (this.l - 1) & 0xff;
    if (this.l == 255) this.h = (this.h - 1) & 0xff;
  },


  decIX: function() {
    this.ixL = (this.ixL - 1) & 0xff;
    if (this.ixL == 255) this.ixH = (this.ixH - 1) & 0xff;
  },


  decIY: function() {
    this.iyL = (this.iyL - 1) & 0xff;
    if (this.iyL == 255) this.iyH = (this.iyH - 1) & 0xff;
  },


  /**
   * @param {number} value
   * @return {number}
   */
  inc8: function(value) {
    value = (value + 1) & 0xff;
    this.f = (this.f & F_CARRY) | this.SZHV_INC_TABLE[value];
    return value;
  },


  /**
   * @param {number} value
   * @return {number}
   */
  dec8: function(value) {
    value = (value - 1) & 0xff;
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
    this.f = (this.f & 0xc4) | (((reg ^ result ^ value) >> 8) & 0x10) | ((result >> 16) & 1);
    return result & 0xffff;
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
    this.f = (((hl ^ result ^ value) >> 8) & 0x10) | ((result >> 16) & 1) | ((result >> 8) & 0x80) | (((result & 0xffff) != 0) ? 0 : 0x40) | (((value ^ hl ^ 0x8000) & (value ^ result) & 0x8000) >> 13);
    this.h = (result >> 8) & 0xff;
    this.l = result & 0xff;
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
    this.f = (((hl ^ result ^ value) >> 8) & 0x10) | 0x02 | ((result >> 16) & 1) | ((result >> 8) & 0x80) | (((result & 0xffff) != 0) ? 0 : 0x40) | (((value ^ hl) & (hl ^ result) & 0x8000) >> 13);
    this.h = (result >> 8) & 0xff;
    this.l = result & 0xff;
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
      this.SZHV_INC_TABLE[i] |= ((i & 0x0f) == 0x00) ? F_HALFCARRY : 0;

      // Generate table for dec8 instruction
      this.SZHV_DEC_TABLE[i] = (sf | zf | yf | xf | F_NEGATIVE);
      this.SZHV_DEC_TABLE[i] |= (i == 0x7F) ? F_OVERFLOW : 0;
      this.SZHV_DEC_TABLE[i] |= ((i & 0x0f) == 0x0F) ? F_HALFCARRY : 0;

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

        if ((newval & 0x0f) < (oldval & 0x0f)) {
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
        if ((newval & 0x0f) <= (oldval & 0x0f)) {
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
        if ((newval & 0x0f) > (oldval & 0x0f)) {
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
        if ((newval & 0x0f) >= (oldval & 0x0f)) {
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
   * @return {Array.<number>}
   */
  getDummyWrite: function() {
    return JSSMS.Utils.Array(Setup.PAGE_SIZE);
  },


  /**
   * Memory constructor.
   */
  generateMemory: function() {
    // Create read/write memory map (64 positions each representing 1K)

    // Note we create one extra dummy position to get around a dodgy write in
    // Back to the Future 2.
    //this.memReadMap = new Array(65);
    //this.memWriteMap = new Array(65);

    for (var i = 0; i < 65; i++) {
      this.memReadMap[i] = JSSMS.Utils.Array(Setup.PAGE_SIZE);
      this.memWriteMap[i] = JSSMS.Utils.Array(Setup.PAGE_SIZE);
    }

    // Create 8K System RAM
    //this.ram = new Array(8);
    for (i = 0; i < 8; i++) {
      this.ram[i] = JSSMS.Utils.Array(Setup.PAGE_SIZE);
    }

    // Create 2 x 16K RAM Cartridge Pages
    if (this.sram == null) {
      this.sram = Array(32);
      for (i = 0; i < 32; i++) {
        this.sram[i] = JSSMS.Utils.Array(Setup.PAGE_SIZE);
      }
      this.useSRAM = false;
    }

    // Create dummy memory (for invalid writes)
    //this.dummyWrite = new Array(Setup.PAGE_SIZE);

    // Ignore bad writes in Back To The Future 2
    this.memReadMap[64] = this.getDummyWrite();
    this.memWriteMap[64] = this.getDummyWrite();

    this.number_of_pages = 2;
  },


  /**
   * Reset memory to default values.
   *
   * @param {Array.<Array.<number>>=} p
   */
  resetMemory: function(p) {
    if (p) {
      this.rom = p;
    }

    this.frameReg[0] = 0;
    this.frameReg[1] = 0;
    this.frameReg[2] = 1;
    this.frameReg[3] = 0;

    // Default Mapping
    if (this.rom.length) {
      // 16K Page Chunks :)
      this.number_of_pages = this.rom.length / 16;
      this.setDefaultMemoryMapping();
    } else {
      this.number_of_pages = 0;
    }
  },


  setDefaultMemoryMapping: function() {
    // Map ROM
    for (var i = 0; i < 0x30; i++) {
      this.memReadMap[i] = this.rom[i & 0x1F];
      this.memWriteMap[i] = this.getDummyWrite();
    }

    // Map RAM
    for (i = 0x30; i < 0x40; i++) {
      this.memReadMap[i] = this.ram[i & 0x07];
      this.memWriteMap[i] = this.ram[i & 0x07];
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
   * Write to a paging register.
   *
   * $FFFC - Control register
   *
   * D7 : 1= /GWR disabled (write protect), 0= /GWR enabled (write enable)
   * D4 : 1= SRAM mapped to $C000-$FFFF (*1)
   * D3 : 1= SRAM mapped to $8000-$BFFF, 0= ROM mapped to $8000-$BFFF
   * D2 : SRAM banking; BA14 state when $8000-$BFFF is accessed (1= high, 0= low)
   * D1 : Bank shift, bit 1
   * D0 : Bank shift, bit 0
   *
   * @param {number} address Memory location.
   * @param {number} value Value to write.
   */
  page: function(address, value) {
    var p, i, offset;

    this.frameReg[address] = value;

    switch (address) {
      // 0xFFFC: RAM/ROM select register
      case 0:
        // 1= SRAM mapped to $8000-$BFFF
        if ((value & 0x08) != 0) {
          // SRAM banking; BA14 state when $8000-$BFFF is accessed (1= high, 0= low)

          // 16K offset into SRAM
          offset = (value & 0x04) << 2;

          // Map 16K of SRAM
          for (i = 32; i < 48; i++) {
            this.memReadMap[i] = this.sram[offset];
            this.memWriteMap[i] = this.sram[offset];
            offset++;
          }

          this.useSRAM = true;
        } else {
          // 0= ROM mapped to $8000-$BFFF
          p = (this.frameReg[3] % this.number_of_pages) << 4;

          // Map 16K of ROM
          for (i = 32; i < 48; i++) {
            this.memReadMap[i] = this.rom[p++];
            this.memWriteMap[i] = this.getDummyWrite();
          }
        }
        break;

      // 0xFFFD: Page 0 ROM Bank
      case 1:
        // Note +1 here, because for loop starts at '1'
        p = ((value % this.number_of_pages) << 4) + 1;

        for (i = 1; i < 16; i++)
          this.memReadMap[i] = this.rom[p++];
        break;

      // 0xFFFE: Page 1 ROM Bank
      case 2:
        p = (value % this.number_of_pages) << 4;

        for (i = 16; i < 32; i++)
          this.memReadMap[i] = this.rom[p++];
        break;

      // 0xFFFF: Page 2 ROM Bank
      case 3:
        // Map ROM
        if ((this.frameReg[0] & 0x08) == 0) {
          p = (value % this.number_of_pages) << 4;

          for (i = 32; i < 48; i++)
            this.memReadMap[i] = this.rom[p++];
        }
        break;
    }
  },


  /**
   * @return {boolean}
   */
  hasUsedSRAM: function() {
    return this.useSRAM;
  },


  setSRAM: function(bytes) {
    var length = bytes.length / Setup.PAGE_SIZE;
    var i;

    for (i = 0; i < length; i++)
      JSSMS.Utils.copyArrayElements(bytes, i * Setup.PAGE_SIZE, this.sram[i], 0, Setup.PAGE_SIZE);
  },


  /**
   * Called when restoring from a saved state.
   *
   * @param {Array.<number>} state Contents of frame register.
   */
  setStateMem: function(state) {
    this.frameReg = state;

    this.setDefaultMemoryMapping();

    this.page(3, this.frameReg[3]);
    this.page(2, this.frameReg[2]);
    this.page(1, this.frameReg[1]);
    this.page(0, this.frameReg[0]);
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
