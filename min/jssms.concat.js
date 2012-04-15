/*
 jsSMS - A Sega Master System/GameGear emulator in JavaScript
 Copyright (C) 2012  Guillaume Marty (https://github.com/gmarty)
 Based on JavaGear Copyright (c) 2002-2008 Chris White.

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';var DEBUG = true;
var ACCURATE = true;
var Setup = {DEBUG_TIMING: DEBUG, REFRESH_EMULATION: false, ACCURATE_INTERRUPT_EMULATION: ACCURATE, LIGHTGUN: false, VDP_SPRITE_COLLISIONS: ACCURATE, PAGE_SIZE: 1024};
var frameTime = 17;
var fpsInterval = 500;
var CLOCK_NTSC = 3579545;
var CLOCK_PAL = 3546893;
function JSSMS(opts) {
  this.opts = {'ui': JSSMS.DummyUI};
  if (typeof opts != 'undefined') {
    var key;
    for (key in this.opts) {
      if (typeof opts[key] != 'undefined') {
        this.opts[key] = opts[key];
      }
    }
  }
  this.keyboard = new JSSMS.Keyboard(this);
  this.ui = new opts['ui'](this);
  this.vdp = new JSSMS.Vdp(this);
  this.psg = new JSSMS.SN76489(this);
  this.ports = new JSSMS.Ports(this);
  this.cpu = new JSSMS.Z80(this);
  this.ui.updateStatus('Ready to load a ROM.');
}
JSSMS.prototype = {isRunning: false, cyclesPerLine: 0, no_of_scanlines: 0, frameSkip: 0, throttle: true, fps: 0, frameskip_counter: 0, pause_button: false, is_sms: true, is_gg: false, soundEnabled: false, emuWidth: 0, emuHeight: 0, fpsFrameCount: 0, z80Time: 0, drawTime: 0, z80TimeCounter: 0, drawTimeCounter: 0, frameCount: 0, romData: '', romFileName: '', reset: function() {
  this.setVideoTiming(this.vdp.videoMode);
  this.frameCount = 0;
  this.frameskip_counter = this.frameSkip;
  this.keyboard.reset();
  this.ui.reset();
  this.vdp.reset();
  this.ports.reset();
  this.cpu.reset();
  this.cpu.resetMemory(null);
}, start: function() {
  var self = this;
  if (!this.isRunning) {
    this.isRunning = true;
  }
  this.frameInterval = setInterval(function() {
    self.frame();
  }, frameTime);
  this.resetFps();
  this.printFps();
  this.fpsInterval = setInterval(function() {
    self.printFps();
  }, fpsInterval);
}, stop: function() {
  clearInterval(this.frameInterval);
  clearInterval(this.fpsInterval);
  this.isRunning = false;
}, frame: function() {
  if (!this.throttle) {
    if (this.emulateNextFrame()) {
      this.doRepaint();
    }
  }else {
    var startTime = +new Date;
    if (this.emulateNextFrame()) {
      this.doRepaint();
    }
  }
  this.fpsFrameCount++;
}, emulateNextFrame: function() {
  var startTime;
  var lineno;
  for (lineno = 0; lineno < this.no_of_scanlines; lineno++) {
    if (Setup.DEBUG_TIMING) {
      startTime = +new Date;
    }
    if (Setup.ACCURATE_INTERRUPT_EMULATION && lineno == 193) {
      this.cpu.run(this.cyclesPerLine, 8);
      this.vdp.setVBlankFlag();
      this.cpu.run(0, 0);
    }else {
      this.cpu.run(this.cyclesPerLine, 0);
    }
    if (Setup.DEBUG_TIMING) {
      this.z80TimeCounter += +new Date - startTime;
    }
    this.vdp.line = lineno;
    if (this.frameskip_counter == 0 && lineno < 192) {
      if (Setup.DEBUG_TIMING) {
        startTime = +new Date;
      }
      this.vdp.drawLine(lineno);
      if (Setup.DEBUG_TIMING) {
        this.drawTimeCounter += +new Date - startTime;
      }
    }
    this.vdp.interrupts(lineno);
  }
  if (Setup.DEBUG_TIMING && ++this.frameCount == 60) {
    this.z80Time = this.z80TimeCounter;
    this.drawTime = this.drawTimeCounter;
    this.z80TimeCounter = 0;
    this.drawTimeCounter = 0;
    this.frameCount = 0;
  }
  if (this.pause_button) {
    this.cpu.nmi();
    this.pause_button = false;
  }
  if (this.frameskip_counter-- == 0) {
    this.frameskip_counter = this.frameSkip;
    return true;
  }
  return false;
}, setSMS: function() {
  this.is_sms = true;
  this.is_gg = false;
  this.vdp.h_start = 0;
  this.vdp.h_end = 32;
  this.emuWidth = SMS_WIDTH;
  this.emuHeight = SMS_HEIGHT;
}, setGG: function() {
  this.is_gg = true;
  this.is_sms = false;
  this.vdp.h_start = 5;
  this.vdp.h_end = 27;
  this.emuWidth = GG_WIDTH;
  this.emuHeight = GG_HEIGHT;
}, setVideoTiming: function(mode) {
  var clockSpeedHz = 0;
  if (mode == NTSC || this.is_gg) {
    this.fps = 60;
    this.no_of_scanlines = SMS_Y_PIXELS_NTSC;
    clockSpeedHz = CLOCK_NTSC;
  }else {
    if (mode == PAL) {
      this.fps = 50;
      this.no_of_scanlines = SMS_Y_PIXELS_PAL;
      clockSpeedHz = CLOCK_PAL;
    }
  }
  this.cyclesPerLine = Math.round(clockSpeedHz / this.fps / this.no_of_scanlines + 1);
  this.vdp.videoMode = mode;
}, doRepaint: function() {
  this.ui.writeFrame(this.vdp.display, []);
}, printFps: function() {
  var now = +new Date, s = 'Running';
  if (this.lastFpsTime) {
    s += ': ' + (this.fpsFrameCount / ((now - this.lastFpsTime) / 1E3)).toFixed(2) + ' (/ ' + (1E3 / frameTime).toFixed(2) + ') FPS';
  }
  this.ui.updateStatus(s);
  this.fpsFrameCount = 0;
  this.lastFpsTime = now;
}, resetFps: function() {
  this.lastFpsTime = null;
  this.fpsFrameCount = 0;
}, readRomDirectly: function(data, fileName) {
  var pages;
  var mode = fileName.substr(-3).toLowerCase() === '.gg' ? 2 : 1;
  var size = data.length;
  if (mode == 1) {
    this.setSMS();
  }else {
    if (mode == 2) {
      this.setGG();
    }
  }
  if (size <= Setup.PAGE_SIZE) {
    return false;
  }
  pages = this.loadROM(data, size);
  if (pages == null) {
    return false;
  }
  this.cpu.resetMemory(pages);
  this.romData = data;
  this.romFileName = fileName;
  return true;
}, loadROM: function(data, size) {
  if (size % 1024 != 0) {
    data = data.substr(512);
    size -= 512;
  }
  var i, j;
  var number_of_pages = Math.round(size / Setup.PAGE_SIZE);
  var pages = new Array(number_of_pages);
  for (i = 0; i < number_of_pages; i++) {
    pages[i] = new Array(Setup.PAGE_SIZE);
    for (j = 0; j < Setup.PAGE_SIZE; j++) {
      pages[i][j] = data.charCodeAt(i * Setup.PAGE_SIZE + j) & 255;
    }
  }
  return pages;
}, reloadRom: function() {
  if (this.romData !== '' && this.romFileName !== '') {
    return this.readRomDirectly(this.romData, this.romFileName);
  }else {
    return false;
  }
}};
JSSMS.Utils = {rndInt: function(range) {
  return Math.round(Math.random() * range);
}, copyArrayElements: function(src, srcPos, dest, destPos, length) {
  var i = length;
  while (i--) {
    dest[destPos + i] = src[srcPos + i];
  }
}, copyArray: function(src) {
  if (src === undefined) {
    return [];
  }
  var i = src.length, dest = new Array(i);
  while (i--) {
    if (typeof src[i] != 'undefined') {
      dest[i] = src[i];
    }
  }
  return dest;
}, getPrefix: function(arr) {
  var prefix = false;
  arr.some(function(prop) {
    if (prop in document) {
      prefix = prop;
      return true;
    }
    return false;
  });
  return prefix;
}, isIE: function() {
  return/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}};
var HALT_SPEEDUP = false;
var F_CARRY = 1;
var F_NEGATIVE = 2;
var F_PARITY = 4;
var F_OVERFLOW = 4;
var F_BIT3 = 8;
var F_HALFCARRY = 16;
var F_BIT5 = 32;
var F_ZERO = 64;
var F_SIGN = 128;
var BIT_0 = 1;
var BIT_1 = 2;
var BIT_2 = 4;
var BIT_3 = 8;
var BIT_4 = 16;
var BIT_5 = 32;
var BIT_6 = 64;
var BIT_7 = 128;
var OP_STATES = [4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4,
  4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11];
var OP_CB_STATES = [8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8,
  8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8];
var OP_DD_STATES = [4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19,
  4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4];
var OP_INDEX_CB_STATES = [0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0,
  0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0];
var OP_ED_STATES = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
JSSMS.Z80 = function(sms) {
  this.main = sms;
  this.port = sms.ports;
  this.pc = 0;
  this.sp = 0;
  this.im = 0;
  this.iff1 = false;
  this.iff2 = false;
  this.halt = false;
  this.EI_inst = false;
  this.interruptLine = false;
  this.interruptVector = 0;
  this.a = 0;
  this.a2 = 0;
  this.b = 0;
  this.c = 0;
  this.b2 = 0;
  this.c2 = 0;
  this.d = 0;
  this.e = 0;
  this.d2 = 0;
  this.e2 = 0;
  this.h = 0;
  this.l = 0;
  this.h2 = 0;
  this.l2 = 0;
  this.ixL = 0;
  this.ixH = 0;
  this.iyL = 0;
  this.iyH = 0;
  this.r = 0;
  this.i = 0;
  this.f = 0;
  this.f2 = 0;
  this.totalCycles = 0;
  this.tstates = 0;
  this.rom = [];
  this.ram = new Array(8);
  this.sram = null;
  this.useSRAM = false;
  this.frameReg = new Array(4);
  this.number_of_pages = 0;
  this.memWriteMap = new Array(65);
  this.memReadMap = new Array(65);
  this.dummyWrite = new Array(Setup.PAGE_SIZE);
  this.DAA_TABLE = [];
  this.SZ_TABLE = [];
  this.SZP_TABLE = [];
  this.SZHV_INC_TABLE = [];
  this.SZHV_DEC_TABLE = [];
  this.SZHVC_ADD_TABLE = [];
  this.SZHVC_SUB_TABLE = [];
  this.SZ_BIT_TABLE = [];
  this.generateFlagTables();
  this.generateDAATable();
  this.generateMemory();
};
JSSMS.Z80.prototype = {reset: function() {
  this.a = this.a2 = 0;
  this.b = this.c = this.b2 = this.c2 = 0;
  this.d = this.e = this.d2 = this.e2 = 0;
  this.h = this.l = this.h2 = this.l2 = 0;
  this.ixL = this.ixH = 0;
  this.iyL = this.iyH = 0;
  this.r = 0;
  this.i = 0;
  this.f = 0;
  this.f2 = 0;
  this.pc = 0;
  this.sp = 57328;
  this.tstates = 0;
  this.totalCycles = 0;
  this.im = 0;
  this.iff1 = false;
  this.iff2 = false;
  this.EI_inst = false;
  this.interruptVector = 0;
  this.halt = false;
}, getOp: function() {
  var opcode = this.readMem(this.pc);
  var oplist = (opcode & 255).toString(16);
  switch (opcode) {
    case 203:
;
    case 237:
      opcode = this.readMem(this.pc + 1);
      oplist += ' ' + (opcode & 255).toString(16);
      break;
    case 221:
;
    case 253:
      opcode = this.readMem(this.pc + 1);
      oplist += ' ' + (opcode & 255).toString(16);
      if (opcode == 203) {
        opcode = this.readMem(this.pc + 3);
        oplist += ' ' + (opcode & 255).toString(16);
      }
      break;
    default:
      break;
  }
  return oplist.toUpperCase();
}, getMnu: function() {
  var opcode = this.readMem(this.pc);
}, consoledebug: function() {
  console.log('----------------------------------------------------------------------------');
  console.log(this.pc.toString(16) + ' 0x' + this.getOp() + ' ');
  console.log('A: ' + this.a.toString(16) + ' BC: ' + this.getBC().toString(16) + ' DE: ' + this.getDE().toString(16) + ' HL: ' + this.getHL().toString(16) + ' IX: ' + this.getIX().toString(16) + ' IY: ' + this.getIY().toString(16));
  this.exAF();
  this.exBC();
  this.exDE();
  this.exHL();
  console.log("A': " + this.a.toString(16) + " BC': " + this.getBC().toString(16) + " DE': " + this.getDE().toString(16) + " HL': " + this.getHL().toString(16) + ' SP: ' + this.sp.toString(16));
  this.exAF();
  this.exBC();
  this.exDE();
  this.exHL();
}, run: function(cycles, cyclesTo) {
  this.tstates += cycles;
  if (cycles != 0) {
    this.totalCycles = cycles;
  }
  if (!Setup.ACCURATE_INTERRUPT_EMULATION) {
    if (this.interruptLine) {
      this.interrupt();
    }
  }
  while (this.tstates > cyclesTo) {
    if (Setup.ACCURATE_INTERRUPT_EMULATION) {
      if (this.interruptLine) {
        this.interrupt();
      }
    }
    var opcode = this.readMem(this.pc++);
    if (Setup.ACCURATE_INTERRUPT_EMULATION) {
      this.EI_inst = false;
    }
    this.tstates -= OP_STATES[opcode];
    if (Setup.REFRESH_EMULATION) {
      this.incR();
    }
    switch (opcode) {
      case 0:
        break;
      case 1:
        this.c = this.readMem(this.pc++);
        this.b = this.readMem(this.pc++);
        break;
      case 2:
        this.writeMem(this.getBC(), this.a);
        break;
      case 3:
        this.incBC();
        break;
      case 4:
        this.b = this.inc8(this.b);
        break;
      case 5:
        this.b = this.dec8(this.b);
        break;
      case 6:
        this.b = this.readMem(this.pc++);
        break;
      case 7:
        this.rlca_a();
        break;
      case 8:
        this.exAF();
        break;
      case 9:
        this.setHL(this.add16(this.getHL(), this.getBC()));
        break;
      case 10:
        this.a = this.readMem(this.getBC());
        break;
      case 11:
        this.decBC();
        break;
      case 12:
        this.c = this.inc8(this.c);
        break;
      case 13:
        this.c = this.dec8(this.c);
        break;
      case 14:
        this.c = this.readMem(this.pc++);
        break;
      case 15:
        this.rrca_a();
        break;
      case 16:
        this.b = this.b - 1 & 255;
        this.jr(this.b != 0);
        break;
      case 17:
        this.e = this.readMem(this.pc++);
        this.d = this.readMem(this.pc++);
        break;
      case 18:
        this.writeMem(this.getDE(), this.a);
        break;
      case 19:
        this.incDE();
        break;
      case 20:
        this.d = this.inc8(this.d);
        break;
      case 21:
        this.d = this.dec8(this.d);
        break;
      case 22:
        this.d = this.readMem(this.pc++);
        break;
      case 23:
        this.rla_a();
        break;
      case 24:
        this.pc += this.d_() + 1;
        break;
      case 25:
        this.setHL(this.add16(this.getHL(), this.getDE()));
        break;
      case 26:
        this.a = this.readMem(this.getDE());
        break;
      case 27:
        this.decDE();
        break;
      case 28:
        this.e = this.inc8(this.e);
        break;
      case 29:
        this.e = this.dec8(this.e);
        break;
      case 30:
        this.e = this.readMem(this.pc++);
        break;
      case 31:
        this.rra_a();
        break;
      case 32:
        this.jr(!((this.f & F_ZERO) != 0));
        break;
      case 33:
        this.l = this.readMem(this.pc++);
        this.h = this.readMem(this.pc++);
        break;
      case 34:
        var location = this.readMemWord(this.pc);
        this.writeMem(location, this.l);
        this.writeMem(++location, this.h);
        this.pc += 2;
        break;
      case 35:
        this.incHL();
        break;
      case 36:
        this.h = this.inc8(this.h);
        break;
      case 37:
        this.h = this.dec8(this.h);
        break;
      case 38:
        this.h = this.readMem(this.pc++);
        break;
      case 39:
        this.daa();
        break;
      case 40:
        this.jr((this.f & F_ZERO) != 0);
        break;
      case 41:
        this.setHL(this.add16(this.getHL(), this.getHL()));
        break;
      case 42:
        var location = this.readMemWord(this.pc);
        this.l = this.readMem(location);
        this.h = this.readMem(location + 1);
        this.pc += 2;
        break;
      case 43:
        this.decHL();
        break;
      case 44:
        this.l = this.inc8(this.l);
        break;
      case 45:
        this.l = this.dec8(this.l);
        break;
      case 46:
        this.l = this.readMem(this.pc++);
        break;
      case 47:
        this.cpl_a();
        break;
      case 48:
        this.jr(!((this.f & F_CARRY) != 0));
        break;
      case 49:
        this.sp = this.readMemWord(this.pc);
        this.pc += 2;
        break;
      case 50:
        this.writeMem(this.readMemWord(this.pc), this.a);
        this.pc += 2;
        break;
      case 51:
        this.sp++;
        break;
      case 52:
        this.incMem(this.getHL());
        break;
      case 53:
        this.decMem(this.getHL());
        break;
      case 54:
        this.writeMem(this.getHL(), this.readMem(this.pc++));
        break;
      case 55:
        this.f |= F_CARRY;
        this.f &= ~F_NEGATIVE;
        this.f &= ~F_HALFCARRY;
        break;
      case 56:
        this.jr((this.f & F_CARRY) != 0);
        break;
      case 57:
        this.setHL(this.add16(this.getHL(), this.sp));
        break;
      case 58:
        this.a = this.readMem(this.readMemWord(this.pc));
        this.pc += 2;
        break;
      case 59:
        this.sp--;
        break;
      case 60:
        this.a = this.inc8(this.a);
        break;
      case 61:
        this.a = this.dec8(this.a);
        break;
      case 62:
        this.a = this.readMem(this.pc++);
        break;
      case 63:
        this.ccf();
        break;
      case 64:
        break;
      case 65:
        this.b = this.c;
        break;
      case 66:
        this.b = this.d;
        break;
      case 67:
        this.b = this.e;
        break;
      case 68:
        this.b = this.h;
        break;
      case 69:
        this.b = this.l;
        break;
      case 70:
        this.b = this.readMem(this.getHL());
        break;
      case 71:
        this.b = this.a;
        break;
      case 72:
        this.c = this.b;
        break;
      case 73:
        break;
      case 74:
        this.c = this.d;
        break;
      case 75:
        this.c = this.e;
        break;
      case 76:
        this.c = this.h;
        break;
      case 77:
        this.c = this.l;
        break;
      case 78:
        this.c = this.readMem(this.getHL());
        break;
      case 79:
        this.c = this.a;
        break;
      case 80:
        this.d = this.b;
        break;
      case 81:
        this.d = this.c;
        break;
      case 82:
        break;
      case 83:
        this.d = this.e;
        break;
      case 84:
        this.d = this.h;
        break;
      case 85:
        this.d = this.l;
        break;
      case 86:
        this.d = this.readMem(this.getHL());
        break;
      case 87:
        this.d = this.a;
        break;
      case 88:
        this.e = this.b;
        break;
      case 89:
        this.e = this.c;
        break;
      case 90:
        this.e = this.d;
        break;
      case 91:
        break;
      case 92:
        this.e = this.h;
        break;
      case 93:
        this.e = this.l;
        break;
      case 94:
        this.e = this.readMem(this.getHL());
        break;
      case 95:
        this.e = this.a;
        break;
      case 96:
        this.h = this.b;
        break;
      case 97:
        this.h = this.c;
        break;
      case 98:
        this.h = this.d;
        break;
      case 99:
        this.h = this.e;
        break;
      case 100:
        break;
      case 101:
        this.h = this.l;
        break;
      case 102:
        this.h = this.readMem(this.getHL());
        break;
      case 103:
        this.h = this.a;
        break;
      case 104:
        this.l = this.b;
        break;
      case 105:
        this.l = this.c;
        break;
      case 106:
        this.l = this.d;
        break;
      case 107:
        this.l = this.e;
        break;
      case 108:
        this.l = this.h;
        break;
      case 109:
        break;
      case 110:
        this.l = this.readMem(this.getHL());
        break;
      case 111:
        this.l = this.a;
        break;
      case 112:
        this.writeMem(this.getHL(), this.b);
        break;
      case 113:
        this.writeMem(this.getHL(), this.c);
        break;
      case 114:
        this.writeMem(this.getHL(), this.d);
        break;
      case 115:
        this.writeMem(this.getHL(), this.e);
        break;
      case 116:
        this.writeMem(this.getHL(), this.h);
        break;
      case 117:
        this.writeMem(this.getHL(), this.l);
        break;
      case 118:
        if (HALT_SPEEDUP) {
          this.tstates = 0;
        }
        this.halt = true;
        this.pc--;
        break;
      case 119:
        this.writeMem(this.getHL(), this.a);
        break;
      case 120:
        this.a = this.b;
        break;
      case 121:
        this.a = this.c;
        break;
      case 122:
        this.a = this.d;
        break;
      case 123:
        this.a = this.e;
        break;
      case 124:
        this.a = this.h;
        break;
      case 125:
        this.a = this.l;
        break;
      case 126:
        this.a = this.readMem(this.getHL());
        break;
      case 127:
        break;
      case 128:
        this.add_a(this.b);
        break;
      case 129:
        this.add_a(this.c);
        break;
      case 130:
        this.add_a(this.d);
        break;
      case 131:
        this.add_a(this.e);
        break;
      case 132:
        this.add_a(this.h);
        break;
      case 133:
        this.add_a(this.l);
        break;
      case 134:
        this.add_a(this.readMem(this.getHL()));
        break;
      case 135:
        this.add_a(this.a);
        break;
      case 136:
        this.adc_a(this.b);
        break;
      case 137:
        this.adc_a(this.c);
        break;
      case 138:
        this.adc_a(this.d);
        break;
      case 139:
        this.adc_a(this.e);
        break;
      case 140:
        this.adc_a(this.h);
        break;
      case 141:
        this.adc_a(this.l);
        break;
      case 142:
        this.adc_a(this.readMem(this.getHL()));
        break;
      case 143:
        this.adc_a(this.a);
        break;
      case 144:
        this.sub_a(this.b);
        break;
      case 145:
        this.sub_a(this.c);
        break;
      case 146:
        this.sub_a(this.d);
        break;
      case 147:
        this.sub_a(this.e);
        break;
      case 148:
        this.sub_a(this.h);
        break;
      case 149:
        this.sub_a(this.l);
        break;
      case 150:
        this.sub_a(this.readMem(this.getHL()));
        break;
      case 151:
        this.sub_a(this.a);
        break;
      case 152:
        this.sbc_a(this.b);
        break;
      case 153:
        this.sbc_a(this.c);
        break;
      case 154:
        this.sbc_a(this.d);
        break;
      case 155:
        this.sbc_a(this.e);
        break;
      case 156:
        this.sbc_a(this.h);
        break;
      case 157:
        this.sbc_a(this.l);
        break;
      case 158:
        this.sbc_a(this.readMem(this.getHL()));
        break;
      case 159:
        this.sbc_a(this.a);
        break;
      case 160:
        this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;
        break;
      case 161:
        this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;
        break;
      case 162:
        this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;
        break;
      case 163:
        this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;
        break;
      case 164:
        this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;
        break;
      case 165:
        this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;
        break;
      case 166:
        this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;
        break;
      case 167:
        this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;
        break;
      case 168:
        this.f = this.SZP_TABLE[this.a ^= this.b];
        break;
      case 169:
        this.f = this.SZP_TABLE[this.a ^= this.c];
        break;
      case 170:
        this.f = this.SZP_TABLE[this.a ^= this.d];
        break;
      case 171:
        this.f = this.SZP_TABLE[this.a ^= this.e];
        break;
      case 172:
        this.f = this.SZP_TABLE[this.a ^= this.h];
        break;
      case 173:
        this.f = this.SZP_TABLE[this.a ^= this.l];
        break;
      case 174:
        this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];
        break;
      case 175:
        this.f = this.SZP_TABLE[this.a = 0];
        break;
      case 176:
        this.f = this.SZP_TABLE[this.a |= this.b];
        break;
      case 177:
        this.f = this.SZP_TABLE[this.a |= this.c];
        break;
      case 178:
        this.f = this.SZP_TABLE[this.a |= this.d];
        break;
      case 179:
        this.f = this.SZP_TABLE[this.a |= this.e];
        break;
      case 180:
        this.f = this.SZP_TABLE[this.a |= this.h];
        break;
      case 181:
        this.f = this.SZP_TABLE[this.a |= this.l];
        break;
      case 182:
        this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];
        break;
      case 183:
        this.f = this.SZP_TABLE[this.a];
        break;
      case 184:
        this.cp_a(this.b);
        break;
      case 185:
        this.cp_a(this.c);
        break;
      case 186:
        this.cp_a(this.d);
        break;
      case 187:
        this.cp_a(this.e);
        break;
      case 188:
        this.cp_a(this.h);
        break;
      case 189:
        this.cp_a(this.l);
        break;
      case 190:
        this.cp_a(this.readMem(this.getHL()));
        break;
      case 191:
        this.cp_a(this.a);
        break;
      case 192:
        this.ret((this.f & F_ZERO) == 0);
        break;
      case 193:
        this.setBC(this.readMemWord(this.sp));
        this.sp += 2;
        break;
      case 194:
        this.jp((this.f & F_ZERO) == 0);
        break;
      case 195:
        this.pc = this.readMemWord(this.pc);
        break;
      case 196:
        this.call((this.f & F_ZERO) == 0);
        break;
      case 197:
        this.push(this.b, this.c);
        break;
      case 198:
        this.add_a(this.readMem(this.pc++));
        break;
      case 199:
        this.push(this.pc);
        this.pc = 0;
        break;
      case 200:
        this.ret((this.f & F_ZERO) != 0);
        break;
      case 201:
        this.pc = this.readMemWord(this.sp);
        this.sp += 2;
        break;
      case 202:
        this.jp((this.f & F_ZERO) != 0);
        break;
      case 203:
        this.doCB(this.readMem(this.pc++));
        break;
      case 204:
        this.call((this.f & F_ZERO) != 0);
        break;
      case 205:
        this.push(this.pc + 2);
        this.pc = this.readMemWord(this.pc);
        break;
      case 206:
        this.adc_a(this.readMem(this.pc++));
        break;
      case 207:
        this.push(this.pc);
        this.pc = 8;
        break;
      case 208:
        this.ret((this.f & F_CARRY) == 0);
        break;
      case 209:
        this.setDE(this.readMemWord(this.sp));
        this.sp += 2;
        break;
      case 210:
        this.jp((this.f & F_CARRY) == 0);
        break;
      case 211:
        this.port.out(this.readMem(this.pc++), this.a);
        break;
      case 212:
        this.call((this.f & F_CARRY) == 0);
        break;
      case 213:
        this.push(this.d, this.e);
        break;
      case 214:
        this.sub_a(this.readMem(this.pc++));
        break;
      case 215:
        this.push(this.pc);
        this.pc = 16;
        break;
      case 216:
        this.ret((this.f & F_CARRY) != 0);
        break;
      case 217:
        this.exBC();
        this.exDE();
        this.exHL();
        break;
      case 218:
        this.jp((this.f & F_CARRY) != 0);
        break;
      case 219:
        this.a = this.port.in_(this.readMem(this.pc++));
        break;
      case 220:
        this.call((this.f & F_CARRY) != 0);
        break;
      case 221:
        this.doIndexOpIX(this.readMem(this.pc++));
        break;
      case 222:
        this.sbc_a(this.readMem(this.pc++));
        break;
      case 223:
        this.push(this.pc);
        this.pc = 24;
        break;
      case 224:
        this.ret((this.f & F_PARITY) == 0);
        break;
      case 225:
        this.setHL(this.readMemWord(this.sp));
        this.sp += 2;
        break;
      case 226:
        this.jp((this.f & F_PARITY) == 0);
        break;
      case 227:
        var temp = this.h;
        this.h = this.readMem(this.sp + 1);
        this.writeMem(this.sp + 1, temp);
        temp = this.l;
        this.l = this.readMem(this.sp);
        this.writeMem(this.sp, temp);
        break;
      case 228:
        this.call((this.f & F_PARITY) == 0);
        break;
      case 229:
        this.push(this.h, this.l);
        break;
      case 230:
        this.f = this.SZP_TABLE[this.a &= this.readMem(this.pc++)] | F_HALFCARRY;
        break;
      case 231:
        this.push(this.pc);
        this.pc = 32;
        break;
      case 232:
        this.ret((this.f & F_PARITY) != 0);
        break;
      case 233:
        this.pc = this.getHL();
        break;
      case 234:
        this.jp((this.f & F_PARITY) != 0);
        break;
      case 235:
        var temp = this.d;
        this.d = this.h;
        this.h = temp;
        temp = this.e;
        this.e = this.l;
        this.l = temp;
        break;
      case 236:
        this.call((this.f & F_PARITY) != 0);
        break;
      case 237:
        this.doED(this.readMem(this.pc));
        break;
      case 238:
        this.f = this.SZP_TABLE[this.a ^= this.readMem(this.pc++)];
        break;
      case 239:
        this.push(this.pc);
        this.pc = 40;
        break;
      case 240:
        this.ret((this.f & F_SIGN) == 0);
        break;
      case 241:
        this.f = this.readMem(this.sp++);
        this.a = this.readMem(this.sp++);
        break;
      case 242:
        this.jp((this.f & F_SIGN) == 0);
        break;
      case 243:
        this.iff1 = this.iff2 = false;
        this.EI_inst = true;
        break;
      case 244:
        this.call((this.f & F_SIGN) == 0);
        break;
      case 245:
        this.push(this.a, this.f);
        break;
      case 246:
        this.f = this.SZP_TABLE[this.a |= this.readMem(this.pc++)];
        break;
      case 247:
        this.push(this.pc);
        this.pc = 48;
        break;
      case 248:
        this.ret((this.f & F_SIGN) != 0);
        break;
      case 249:
        this.sp = this.getHL();
        break;
      case 250:
        this.jp((this.f & F_SIGN) != 0);
        break;
      case 251:
        this.iff1 = this.iff2 = this.EI_inst = true;
        break;
      case 252:
        this.call((this.f & F_SIGN) != 0);
        break;
      case 253:
        this.doIndexOpIY(this.readMem(this.pc++));
        break;
      case 254:
        this.cp_a(this.readMem(this.pc++));
        break;
      case 255:
        this.push(this.pc);
        this.pc = 56;
        break;
    }
  }
}, getCycle: function() {
  return this.totalCycles - this.tstates;
}, nmi: function() {
  this.iff2 = this.iff1;
  this.iff1 = false;
  if (Setup.REFRESH_EMULATION) {
    this.incR();
  }
  if (this.halt) {
    this.pc++;
    this.halt = false;
  }
  this.push(this.pc);
  this.pc = 102;
  this.tstates -= 11;
}, interrupt: function() {
  if (!this.iff1 || Setup.ACCURATE_INTERRUPT_EMULATION && this.EI_inst) {
    return;
  }
  if (this.halt) {
    this.pc++;
    this.halt = false;
  }
  if (Setup.REFRESH_EMULATION) {
    this.incR();
  }
  this.iff1 = this.iff2 = false;
  this.interruptLine = false;
  this.push(this.pc);
  if (this.im == 0) {
    this.pc = this.interruptVector == 0 || this.interruptVector == 255 ? 56 : this.interruptVector;
    this.tstates -= 13;
  }else {
    if (this.im == 1) {
      this.pc = 56;
      this.tstates -= 13;
    }else {
      this.pc = this.readMemWord((this.i << 8) + this.interruptVector);
      this.tstates -= 19;
    }
  }
}, jp: function(condition) {
  if (condition) {
    this.pc = this.readMemWord(this.pc);
  }else {
    this.pc += 2;
  }
}, jr: function(condition) {
  if (condition) {
    var d = this.d_() + 1;
    this.pc += d < 128 ? d : d - 256;
    this.tstates -= 5;
  }else {
    this.pc++;
  }
}, call: function(condition) {
  if (condition) {
    this.push(this.pc + 2);
    this.pc = this.readMemWord(this.pc);
    this.tstates -= 7;
  }else {
    this.pc += 2;
  }
}, ret: function(condition) {
  if (condition) {
    this.pc = this.readMemWord(this.sp);
    this.sp += 2;
    this.tstates -= 6;
  }
}, push: function(value, l) {
  if (typeof l === 'undefined') {
    this.writeMem(--this.sp, value >> 8);
    this.writeMem(--this.sp, value & 255);
  }else {
    this.writeMem(--this.sp, value);
    this.writeMem(--this.sp, l);
  }
}, incMem: function(offset) {
  this.writeMem(offset, this.inc8(this.readMem(offset)));
}, decMem: function(offset) {
  this.writeMem(offset, this.dec8(this.readMem(offset)));
}, ccf: function() {
  if ((this.f & F_CARRY) != 0) {
    this.f &= ~F_CARRY;
    this.f |= F_HALFCARRY;
  }else {
    this.f |= F_CARRY;
    this.f &= ~F_HALFCARRY;
  }
  this.f &= ~F_NEGATIVE;
}, daa: function() {
  var temp = this.DAA_TABLE[this.a | (this.f & F_CARRY) << 8 | (this.f & F_NEGATIVE) << 8 | (this.f & F_HALFCARRY) << 6];
  this.a = temp & 255;
  this.f = this.f & F_NEGATIVE | temp >> 8;
}, doCB: function(opcode) {
  this.tstates -= OP_CB_STATES[opcode];
  if (Setup.REFRESH_EMULATION) {
    this.incR();
  }
  switch (opcode) {
    case 0:
      this.b = this.rlc(this.b);
      break;
    case 1:
      this.c = this.rlc(this.c);
      break;
    case 2:
      this.d = this.rlc(this.d);
      break;
    case 3:
      this.e = this.rlc(this.e);
      break;
    case 4:
      this.h = this.rlc(this.h);
      break;
    case 5:
      this.l = this.rlc(this.l);
      break;
    case 6:
      this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));
      break;
    case 7:
      this.a = this.rlc(this.a);
      break;
    case 8:
      this.b = this.rrc(this.b);
      break;
    case 9:
      this.c = this.rrc(this.c);
      break;
    case 10:
      this.d = this.rrc(this.d);
      break;
    case 11:
      this.e = this.rrc(this.e);
      break;
    case 12:
      this.h = this.rrc(this.h);
      break;
    case 13:
      this.l = this.rrc(this.l);
      break;
    case 14:
      this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));
      break;
    case 15:
      this.a = this.rrc(this.a);
      break;
    case 16:
      this.b = this.rl(this.b);
      break;
    case 17:
      this.c = this.rl(this.c);
      break;
    case 18:
      this.d = this.rl(this.d);
      break;
    case 19:
      this.e = this.rl(this.e);
      break;
    case 20:
      this.h = this.rl(this.h);
      break;
    case 21:
      this.l = this.rl(this.l);
      break;
    case 22:
      this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));
      break;
    case 23:
      this.a = this.rl(this.a);
      break;
    case 24:
      this.b = this.rr(this.b);
      break;
    case 25:
      this.c = this.rr(this.c);
      break;
    case 26:
      this.d = this.rr(this.d);
      break;
    case 27:
      this.e = this.rr(this.e);
      break;
    case 28:
      this.h = this.rr(this.h);
      break;
    case 29:
      this.l = this.rr(this.l);
      break;
    case 30:
      this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));
      break;
    case 31:
      this.a = this.rr(this.a);
      break;
    case 32:
      this.b = this.sla(this.b);
      break;
    case 33:
      this.c = this.sla(this.c);
      break;
    case 34:
      this.d = this.sla(this.d);
      break;
    case 35:
      this.e = this.sla(this.e);
      break;
    case 36:
      this.h = this.sla(this.h);
      break;
    case 37:
      this.l = this.sla(this.l);
      break;
    case 38:
      this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));
      break;
    case 39:
      this.a = this.sla(this.a);
      break;
    case 40:
      this.b = this.sra(this.b);
      break;
    case 41:
      this.c = this.sra(this.c);
      break;
    case 42:
      this.d = this.sra(this.d);
      break;
    case 43:
      this.e = this.sra(this.e);
      break;
    case 44:
      this.h = this.sra(this.h);
      break;
    case 45:
      this.l = this.sra(this.l);
      break;
    case 46:
      this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));
      break;
    case 47:
      this.a = this.sra(this.a);
      break;
    case 48:
      this.b = this.sll(this.b);
      break;
    case 49:
      this.c = this.sll(this.c);
      break;
    case 50:
      this.d = this.sll(this.d);
      break;
    case 51:
      this.e = this.sll(this.e);
      break;
    case 52:
      this.h = this.sll(this.h);
      break;
    case 53:
      this.l = this.sll(this.l);
      break;
    case 54:
      this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));
      break;
    case 55:
      this.a = this.sll(this.a);
      break;
    case 56:
      this.b = this.srl(this.b);
      break;
    case 57:
      this.c = this.srl(this.c);
      break;
    case 58:
      this.d = this.srl(this.d);
      break;
    case 59:
      this.e = this.srl(this.e);
      break;
    case 60:
      this.h = this.srl(this.h);
      break;
    case 61:
      this.l = this.rl(this.l);
      break;
    case 62:
      this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));
      break;
    case 63:
      this.a = this.srl(this.a);
      break;
    case 64:
      this.bit(this.b & BIT_0);
      break;
    case 65:
      this.bit(this.c & BIT_0);
      break;
    case 66:
      this.bit(this.d & BIT_0);
      break;
    case 67:
      this.bit(this.e & BIT_0);
      break;
    case 68:
      this.bit(this.h & BIT_0);
      break;
    case 69:
      this.bit(this.l & BIT_0);
      break;
    case 70:
      this.bit(this.readMem(this.getHL()) & BIT_0);
      break;
    case 71:
      this.bit(this.a & BIT_0);
      break;
    case 72:
      this.bit(this.b & BIT_1);
      break;
    case 73:
      this.bit(this.c & BIT_1);
      break;
    case 74:
      this.bit(this.d & BIT_1);
      break;
    case 75:
      this.bit(this.e & BIT_1);
      break;
    case 76:
      this.bit(this.h & BIT_1);
      break;
    case 77:
      this.bit(this.l & BIT_1);
      break;
    case 78:
      this.bit(this.readMem(this.getHL()) & BIT_1);
      break;
    case 79:
      this.bit(this.a & BIT_1);
      break;
    case 80:
      this.bit(this.b & BIT_2);
      break;
    case 81:
      this.bit(this.c & BIT_2);
      break;
    case 82:
      this.bit(this.d & BIT_2);
      break;
    case 83:
      this.bit(this.e & BIT_2);
      break;
    case 84:
      this.bit(this.h & BIT_2);
      break;
    case 85:
      this.bit(this.l & BIT_2);
      break;
    case 86:
      this.bit(this.readMem(this.getHL()) & BIT_2);
      break;
    case 87:
      this.bit(this.a & BIT_2);
      break;
    case 88:
      this.bit(this.b & BIT_3);
      break;
    case 89:
      this.bit(this.c & BIT_3);
      break;
    case 90:
      this.bit(this.d & BIT_3);
      break;
    case 91:
      this.bit(this.e & BIT_3);
      break;
    case 92:
      this.bit(this.h & BIT_3);
      break;
    case 93:
      this.bit(this.l & BIT_3);
      break;
    case 94:
      this.bit(this.readMem(this.getHL()) & BIT_3);
      break;
    case 95:
      this.bit(this.a & BIT_3);
      break;
    case 96:
      this.bit(this.b & BIT_4);
      break;
    case 97:
      this.bit(this.c & BIT_4);
      break;
    case 98:
      this.bit(this.d & BIT_4);
      break;
    case 99:
      this.bit(this.e & BIT_4);
      break;
    case 100:
      this.bit(this.h & BIT_4);
      break;
    case 101:
      this.bit(this.l & BIT_4);
      break;
    case 102:
      this.bit(this.readMem(this.getHL()) & BIT_4);
      break;
    case 103:
      this.bit(this.a & BIT_4);
      break;
    case 104:
      this.bit(this.b & BIT_5);
      break;
    case 105:
      this.bit(this.c & BIT_5);
      break;
    case 106:
      this.bit(this.d & BIT_5);
      break;
    case 107:
      this.bit(this.e & BIT_5);
      break;
    case 108:
      this.bit(this.h & BIT_5);
      break;
    case 109:
      this.bit(this.l & BIT_5);
      break;
    case 110:
      this.bit(this.readMem(this.getHL()) & BIT_5);
      break;
    case 111:
      this.bit(this.a & BIT_5);
      break;
    case 112:
      this.bit(this.b & BIT_6);
      break;
    case 113:
      this.bit(this.c & BIT_6);
      break;
    case 114:
      this.bit(this.d & BIT_6);
      break;
    case 115:
      this.bit(this.e & BIT_6);
      break;
    case 116:
      this.bit(this.h & BIT_6);
      break;
    case 117:
      this.bit(this.l & BIT_6);
      break;
    case 118:
      this.bit(this.readMem(this.getHL()) & BIT_6);
      break;
    case 119:
      this.bit(this.a & BIT_6);
      break;
    case 120:
      this.bit(this.b & BIT_7);
      break;
    case 121:
      this.bit(this.c & BIT_7);
      break;
    case 122:
      this.bit(this.d & BIT_7);
      break;
    case 123:
      this.bit(this.e & BIT_7);
      break;
    case 124:
      this.bit(this.h & BIT_7);
      break;
    case 125:
      this.bit(this.l & BIT_7);
      break;
    case 126:
      this.bit(this.readMem(this.getHL()) & BIT_7);
      break;
    case 127:
      this.bit(this.a & BIT_7);
      break;
    case 128:
      this.b &= ~BIT_0;
      break;
    case 129:
      this.c &= ~BIT_0;
      break;
    case 130:
      this.d &= ~BIT_0;
      break;
    case 131:
      this.e &= ~BIT_0;
      break;
    case 132:
      this.h &= ~BIT_0;
      break;
    case 133:
      this.l &= ~BIT_0;
      break;
    case 134:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);
      break;
    case 135:
      this.a &= ~BIT_0;
      break;
    case 136:
      this.b &= ~BIT_1;
      break;
    case 137:
      this.c &= ~BIT_1;
      break;
    case 138:
      this.d &= ~BIT_1;
      break;
    case 139:
      this.e &= ~BIT_1;
      break;
    case 140:
      this.h &= ~BIT_1;
      break;
    case 141:
      this.l &= ~BIT_1;
      break;
    case 142:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);
      break;
    case 143:
      this.a &= ~BIT_1;
      break;
    case 144:
      this.b &= ~BIT_2;
      break;
    case 145:
      this.c &= ~BIT_2;
      break;
    case 146:
      this.d &= ~BIT_2;
      break;
    case 147:
      this.e &= ~BIT_2;
      break;
    case 148:
      this.h &= ~BIT_2;
      break;
    case 149:
      this.l &= ~BIT_2;
      break;
    case 150:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);
      break;
    case 151:
      this.a &= ~BIT_2;
      break;
    case 152:
      this.b &= ~BIT_3;
      break;
    case 153:
      this.c &= ~BIT_3;
      break;
    case 154:
      this.d &= ~BIT_3;
      break;
    case 155:
      this.e &= ~BIT_3;
      break;
    case 156:
      this.h &= ~BIT_3;
      break;
    case 157:
      this.l &= ~BIT_3;
      break;
    case 158:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);
      break;
    case 159:
      this.a &= ~BIT_3;
      break;
    case 160:
      this.b &= ~BIT_4;
      break;
    case 161:
      this.c &= ~BIT_4;
      break;
    case 162:
      this.d &= ~BIT_4;
      break;
    case 163:
      this.e &= ~BIT_4;
      break;
    case 164:
      this.h &= ~BIT_4;
      break;
    case 165:
      this.l &= ~BIT_4;
      break;
    case 166:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);
      break;
    case 167:
      this.a &= ~BIT_4;
      break;
    case 168:
      this.b &= ~BIT_5;
      break;
    case 169:
      this.c &= ~BIT_5;
      break;
    case 170:
      this.d &= ~BIT_5;
      break;
    case 171:
      this.e &= ~BIT_5;
      break;
    case 172:
      this.h &= ~BIT_5;
      break;
    case 173:
      this.l &= ~BIT_5;
      break;
    case 174:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);
      break;
    case 175:
      this.a &= ~BIT_5;
      break;
    case 176:
      this.b &= ~BIT_6;
      break;
    case 177:
      this.c &= ~BIT_6;
      break;
    case 178:
      this.d &= ~BIT_6;
      break;
    case 179:
      this.e &= ~BIT_6;
      break;
    case 180:
      this.h &= ~BIT_6;
      break;
    case 181:
      this.l &= ~BIT_6;
      break;
    case 182:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);
      break;
    case 183:
      this.a &= ~BIT_6;
      break;
    case 184:
      this.b &= ~BIT_7;
      break;
    case 185:
      this.c &= ~BIT_7;
      break;
    case 186:
      this.d &= ~BIT_7;
      break;
    case 187:
      this.e &= ~BIT_7;
      break;
    case 188:
      this.h &= ~BIT_7;
      break;
    case 189:
      this.l &= ~BIT_7;
      break;
    case 190:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);
      break;
    case 191:
      this.a &= ~BIT_7;
      break;
    case 192:
      this.b |= BIT_0;
      break;
    case 193:
      this.c |= BIT_0;
      break;
    case 194:
      this.d |= BIT_0;
      break;
    case 195:
      this.e |= BIT_0;
      break;
    case 196:
      this.h |= BIT_0;
      break;
    case 197:
      this.l |= BIT_0;
      break;
    case 198:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);
      break;
    case 199:
      this.a |= BIT_0;
      break;
    case 200:
      this.b |= BIT_1;
      break;
    case 201:
      this.c |= BIT_1;
      break;
    case 202:
      this.d |= BIT_1;
      break;
    case 203:
      this.e |= BIT_1;
      break;
    case 204:
      this.h |= BIT_1;
      break;
    case 205:
      this.l |= BIT_1;
      break;
    case 206:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);
      break;
    case 207:
      this.a |= BIT_1;
      break;
    case 208:
      this.b |= BIT_2;
      break;
    case 209:
      this.c |= BIT_2;
      break;
    case 210:
      this.d |= BIT_2;
      break;
    case 211:
      this.e |= BIT_2;
      break;
    case 212:
      this.h |= BIT_2;
      break;
    case 213:
      this.l |= BIT_2;
      break;
    case 214:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2);
      break;
    case 215:
      this.a |= BIT_2;
      break;
    case 216:
      this.b |= BIT_3;
      break;
    case 217:
      this.c |= BIT_3;
      break;
    case 218:
      this.d |= BIT_3;
      break;
    case 219:
      this.e |= BIT_3;
      break;
    case 220:
      this.h |= BIT_3;
      break;
    case 221:
      this.l |= BIT_3;
      break;
    case 222:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);
      break;
    case 223:
      this.a |= BIT_3;
      break;
    case 224:
      this.b |= BIT_4;
      break;
    case 225:
      this.c |= BIT_4;
      break;
    case 226:
      this.d |= BIT_4;
      break;
    case 227:
      this.e |= BIT_4;
      break;
    case 228:
      this.h |= BIT_4;
      break;
    case 229:
      this.l |= BIT_4;
      break;
    case 230:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);
      break;
    case 231:
      this.a |= BIT_4;
      break;
    case 232:
      this.b |= BIT_5;
      break;
    case 233:
      this.c |= BIT_5;
      break;
    case 234:
      this.d |= BIT_5;
      break;
    case 235:
      this.e |= BIT_5;
      break;
    case 236:
      this.h |= BIT_5;
      break;
    case 237:
      this.l |= BIT_5;
      break;
    case 238:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);
      break;
    case 239:
      this.a |= BIT_5;
      break;
    case 240:
      this.b |= BIT_6;
      break;
    case 241:
      this.c |= BIT_6;
      break;
    case 242:
      this.d |= BIT_6;
      break;
    case 243:
      this.e |= BIT_6;
      break;
    case 244:
      this.h |= BIT_6;
      break;
    case 245:
      this.l |= BIT_6;
      break;
    case 246:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);
      break;
    case 247:
      this.a |= BIT_6;
      break;
    case 248:
      this.b |= BIT_7;
      break;
    case 249:
      this.c |= BIT_7;
      break;
    case 250:
      this.d |= BIT_7;
      break;
    case 251:
      this.e |= BIT_7;
      break;
    case 252:
      this.h |= BIT_7;
      break;
    case 253:
      this.l |= BIT_7;
      break;
    case 254:
      this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);
      break;
    case 255:
      this.a |= BIT_7;
      break;
    default:
      DEBUG && console.log('Unimplemented CB Opcode: ' + opcode.toString(16));
      break;
  }
}, rlc: function(value) {
  var carry = (value & 128) >> 7;
  value = (value << 1 | value >> 7) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, rrc: function(value) {
  var carry = value & 1;
  value = (value >> 1 | value << 7) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, rl: function(value) {
  var carry = (value & 128) >> 7;
  value = (value << 1 | this.f & F_CARRY) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, rr: function(value) {
  var carry = value & 1;
  value = (value >> 1 | this.f << 7) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, sla: function(value) {
  var carry = (value & 128) >> 7;
  value = value << 1 & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, sll: function(value) {
  var carry = (value & 128) >> 7;
  value = (value << 1 | 1) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, sra: function(value) {
  var carry = value & 1;
  value = value >> 1 | value & 128;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, srl: function(value) {
  var carry = value & 1;
  value = value >> 1 & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, bit: function(mask) {
  this.f = this.f & F_CARRY | this.SZ_BIT_TABLE[mask];
}, doIndexOpIX: function(opcode) {
  this.tstates -= OP_DD_STATES[opcode];
  if (Setup.REFRESH_EMULATION) {
    this.incR();
  }
  switch (opcode) {
    case 9:
      this.setIX(this.add16(this.getIX(), this.getBC()));
      break;
    case 25:
      this.setIX(this.add16(this.getIX(), this.getDE()));
      break;
    case 33:
      this.setIX(this.readMemWord(this.pc));
      this.pc += 2;
      break;
    case 34:
      var location = this.readMemWord(this.pc);
      this.writeMem(location++, this.ixL);
      this.writeMem(location, this.ixH);
      this.pc += 2;
      break;
    case 35:
      this.incIX();
      break;
    case 36:
      this.ixH = this.inc8(this.ixH);
      break;
    case 37:
      this.ixH = this.dec8(this.ixH);
      break;
    case 38:
      this.ixH = this.readMem(this.pc++);
      break;
    case 41:
      this.setIX(this.add16(this.getIX(), this.getIX()));
      break;
    case 42:
      var location = this.readMemWord(this.pc);
      this.ixL = this.readMem(location);
      this.ixH = this.readMem(++location);
      this.pc += 2;
      break;
    case 43:
      this.decIX();
      break;
    case 44:
      this.ixL = this.inc8(this.ixL);
      break;
    case 45:
      this.ixL = this.dec8(this.ixL);
      break;
    case 46:
      this.ixL = this.readMem(this.pc++);
      break;
    case 52:
      this.incMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 53:
      this.decMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 54:
      this.writeMem(this.getIX() + this.d_(), this.readMem(++this.pc));
      this.pc++;
      break;
    case 57:
      this.setIX(this.add16(this.getIX(), this.sp));
      break;
    case 68:
      this.b = this.ixH;
      break;
    case 69:
      this.b = this.ixL;
      break;
    case 70:
      this.b = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 76:
      this.c = this.ixH;
      break;
    case 77:
      this.c = this.ixL;
      break;
    case 78:
      this.c = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 84:
      this.d = this.ixH;
      break;
    case 85:
      this.d = this.ixL;
      break;
    case 86:
      this.d = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 92:
      this.e = this.ixH;
      break;
    case 93:
      this.e = this.ixL;
      break;
    case 94:
      this.e = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 96:
      this.ixH = this.b;
      break;
    case 97:
      this.ixH = this.c;
      break;
    case 98:
      this.ixH = this.d;
      break;
    case 99:
      this.ixH = this.e;
      break;
    case 100:
      break;
    case 101:
      this.ixH = this.ixL;
      break;
    case 102:
      this.h = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 103:
      this.ixH = this.a;
      break;
    case 104:
      this.ixL = this.b;
      break;
    case 105:
      this.ixL = this.c;
      break;
    case 106:
      this.ixL = this.d;
      break;
    case 107:
      this.ixL = this.e;
      break;
    case 108:
      this.ixL = this.ixH;
      break;
    case 109:
      break;
    case 110:
      this.l = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 111:
      this.ixL = this.a;
      break;
    case 112:
      this.writeMem(this.getIX() + this.d_(), this.b);
      this.pc++;
      break;
    case 113:
      this.writeMem(this.getIX() + this.d_(), this.c);
      this.pc++;
      break;
    case 114:
      this.writeMem(this.getIX() + this.d_(), this.d);
      this.pc++;
      break;
    case 115:
      this.writeMem(this.getIX() + this.d_(), this.e);
      this.pc++;
      break;
    case 116:
      this.writeMem(this.getIX() + this.d_(), this.h);
      this.pc++;
      break;
    case 117:
      this.writeMem(this.getIX() + this.d_(), this.l);
      this.pc++;
      break;
    case 119:
      this.writeMem(this.getIX() + this.d_(), this.a);
      this.pc++;
      break;
    case 124:
      this.a = this.ixH;
      break;
    case 125:
      this.a = this.ixL;
      break;
    case 126:
      this.a = this.readMem(this.getIX() + this.d_());
      this.pc++;
      break;
    case 132:
      this.add_a(this.ixH);
      break;
    case 133:
      this.add_a(this.ixL);
      break;
    case 134:
      this.add_a(this.readMem(this.getIX() + this.d_()));
      this.pc++;
      break;
    case 140:
      this.adc_a(this.ixH);
      break;
    case 141:
      this.adc_a(this.ixL);
      break;
    case 142:
      this.adc_a(this.readMem(this.getIX() + this.d_()));
      this.pc++;
      break;
    case 148:
      this.sub_a(this.ixH);
      break;
    case 149:
      this.sub_a(this.ixL);
      break;
    case 150:
      this.sub_a(this.readMem(this.getIX() + this.d_()));
      this.pc++;
      break;
    case 156:
      this.sbc_a(this.ixH);
      break;
    case 157:
      this.sbc_a(this.ixL);
      break;
    case 158:
      this.sbc_a(this.readMem(this.getIX() + this.d_()));
      this.pc++;
      break;
    case 164:
      this.f = this.SZP_TABLE[this.a &= this.ixH] | F_HALFCARRY;
      break;
    case 165:
      this.f = this.SZP_TABLE[this.a &= this.ixL] | F_HALFCARRY;
      break;
    case 166:
      this.f = this.SZP_TABLE[this.a &= this.readMem(this.getIX() + this.d_())] | F_HALFCARRY;
      this.pc++;
      break;
    case 172:
      this.f = this.SZP_TABLE[this.a ^= this.ixH];
      break;
    case 173:
      this.f = this.SZP_TABLE[this.a ^= this.ixL];
      break;
    case 174:
      this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getIX() + this.d_())];
      this.pc++;
      break;
    case 180:
      this.f = this.SZP_TABLE[this.a |= this.ixH];
      break;
    case 181:
      this.f = this.SZP_TABLE[this.a |= this.ixL];
      break;
    case 182:
      this.f = this.SZP_TABLE[this.a |= this.readMem(this.getIX() + this.d_())];
      this.pc++;
      break;
    case 188:
      this.cp_a(this.ixH);
      break;
    case 189:
      this.cp_a(this.ixL);
      break;
    case 190:
      this.cp_a(this.readMem(this.getIX() + this.d_()));
      this.pc++;
      break;
    case 203:
      this.doIndexCB(this.getIX());
      break;
    case 225:
      this.setIX(this.readMemWord(this.sp));
      this.sp += 2;
      break;
    case 227:
      var temp = this.getIX();
      this.setIX(this.readMemWord(this.sp));
      this.writeMem(this.sp, temp & 255);
      this.writeMem(this.sp + 1, temp >> 8);
      break;
    case 229:
      this.push(this.ixH, this.ixL);
      break;
    case 233:
      this.pc = this.getIX();
      break;
    case 249:
      this.sp = this.getIX();
      break;
    default:
      this.pc--;
      break;
  }
}, doIndexOpIY: function(opcode) {
  this.tstates -= OP_DD_STATES[opcode];
  if (Setup.REFRESH_EMULATION) {
    this.incR();
  }
  switch (opcode) {
    case 9:
      this.setIY(this.add16(this.getIY(), this.getBC()));
      break;
    case 25:
      this.setIY(this.add16(this.getIY(), this.getDE()));
      break;
    case 33:
      this.setIY(this.readMemWord(this.pc));
      this.pc += 2;
      break;
    case 34:
      var location = this.readMemWord(this.pc);
      this.writeMem(location++, this.iyL);
      this.writeMem(location, this.iyH);
      this.pc += 2;
      break;
    case 35:
      this.incIY();
      break;
    case 36:
      this.iyH = this.inc8(this.iyH);
      break;
    case 37:
      this.iyH = this.dec8(this.iyH);
      break;
    case 38:
      this.iyH = this.readMem(this.pc++);
      break;
    case 41:
      this.setIY(this.add16(this.getIY(), this.getIY()));
      break;
    case 42:
      var location = this.readMemWord(this.pc);
      this.iyL = this.readMem(location);
      this.iyH = this.readMem(++location);
      this.pc += 2;
      break;
    case 43:
      this.decIY();
      break;
    case 44:
      this.iyL = this.inc8(this.iyL);
      break;
    case 45:
      this.iyL = this.dec8(this.iyL);
      break;
    case 46:
      this.iyL = this.readMem(this.pc++);
      break;
    case 52:
      this.incMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 53:
      this.decMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 54:
      this.writeMem(this.getIY() + this.d_(), this.readMem(++this.pc));
      this.pc++;
      break;
    case 57:
      this.setIY(this.add16(this.getIY(), this.sp));
      break;
    case 68:
      this.b = this.iyH;
      break;
    case 69:
      this.b = this.iyL;
      break;
    case 70:
      this.b = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 76:
      this.c = this.iyH;
      break;
    case 77:
      this.c = this.iyL;
      break;
    case 78:
      this.c = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 84:
      this.d = this.iyH;
      break;
    case 85:
      this.d = this.iyL;
      break;
    case 86:
      this.d = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 92:
      this.e = this.iyH;
      break;
    case 93:
      this.e = this.iyL;
      break;
    case 94:
      this.e = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 96:
      this.iyH = this.b;
      break;
    case 97:
      this.iyH = this.c;
      break;
    case 98:
      this.iyH = this.d;
      break;
    case 99:
      this.iyH = this.e;
      break;
    case 100:
      break;
    case 101:
      this.iyH = this.iyL;
      break;
    case 102:
      this.h = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 103:
      this.iyH = this.a;
      break;
    case 104:
      this.iyL = this.b;
      break;
    case 105:
      this.iyL = this.c;
      break;
    case 106:
      this.iyL = this.d;
      break;
    case 107:
      this.iyL = this.e;
      break;
    case 108:
      this.iyL = this.iyH;
      break;
    case 109:
      break;
    case 110:
      this.l = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 111:
      this.iyL = this.a;
      break;
    case 112:
      this.writeMem(this.getIY() + this.d_(), this.b);
      this.pc++;
      break;
    case 113:
      this.writeMem(this.getIY() + this.d_(), this.c);
      this.pc++;
      break;
    case 114:
      this.writeMem(this.getIY() + this.d_(), this.d);
      this.pc++;
      break;
    case 115:
      this.writeMem(this.getIY() + this.d_(), this.e);
      this.pc++;
      break;
    case 116:
      this.writeMem(this.getIY() + this.d_(), this.h);
      this.pc++;
      break;
    case 117:
      this.writeMem(this.getIY() + this.d_(), this.l);
      this.pc++;
      break;
    case 119:
      this.writeMem(this.getIY() + this.d_(), this.a);
      this.pc++;
      break;
    case 124:
      this.a = this.iyH;
      break;
    case 125:
      this.a = this.iyL;
      break;
    case 126:
      this.a = this.readMem(this.getIY() + this.d_());
      this.pc++;
      break;
    case 132:
      this.add_a(this.iyH);
      break;
    case 133:
      this.add_a(this.iyL);
      break;
    case 134:
      this.add_a(this.readMem(this.getIY() + this.d_()));
      this.pc++;
      break;
    case 140:
      this.adc_a(this.iyH);
      break;
    case 141:
      this.adc_a(this.iyL);
      break;
    case 142:
      this.adc_a(this.readMem(this.getIY() + this.d_()));
      this.pc++;
      break;
    case 148:
      this.sub_a(this.iyH);
      break;
    case 149:
      this.sub_a(this.iyL);
      break;
    case 150:
      this.sub_a(this.readMem(this.getIY() + this.d_()));
      this.pc++;
      break;
    case 156:
      this.sbc_a(this.iyH);
      break;
    case 157:
      this.sbc_a(this.iyL);
      break;
    case 158:
      this.sbc_a(this.readMem(this.getIY() + this.d_()));
      this.pc++;
      break;
    case 164:
      this.f = this.SZP_TABLE[this.a &= this.iyH] | F_HALFCARRY;
      break;
    case 165:
      this.f = this.SZP_TABLE[this.a &= this.iyL] | F_HALFCARRY;
      break;
    case 166:
      this.f = this.SZP_TABLE[this.a &= this.readMem(this.getIY() + this.d_())] | F_HALFCARRY;
      this.pc++;
      break;
    case 172:
      this.f = this.SZP_TABLE[this.a ^= this.iyH];
      break;
    case 173:
      this.f = this.SZP_TABLE[this.a ^= this.iyL];
      break;
    case 174:
      this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getIY() + this.d_())];
      this.pc++;
      break;
    case 180:
      this.f = this.SZP_TABLE[this.a |= this.iyH];
      break;
    case 181:
      this.f = this.SZP_TABLE[this.a |= this.iyL];
      break;
    case 182:
      this.f = this.SZP_TABLE[this.a |= this.readMem(this.getIY() + this.d_())];
      this.pc++;
      break;
    case 188:
      this.cp_a(this.iyH);
      break;
    case 189:
      this.cp_a(this.iyL);
      break;
    case 190:
      this.cp_a(this.readMem(this.getIY() + this.d_()));
      this.pc++;
      break;
    case 203:
      this.doIndexCB(this.getIY());
      break;
    case 225:
      this.setIY(this.readMemWord(this.sp));
      this.sp += 2;
      break;
    case 227:
      var temp = this.getIY();
      this.setIY(this.readMemWord(this.sp));
      this.writeMem(this.sp, temp & 255);
      this.writeMem(this.sp + 1, temp >> 8);
      break;
    case 229:
      this.push(this.iyH, this.iyL);
      break;
    case 233:
      this.pc = this.getIY();
      break;
    case 249:
      this.sp = this.getIY();
      break;
    default:
      this.pc--;
      break;
  }
}, doIndexCB: function(index) {
  var location = index + this.d_() & 65535;
  var opcode = this.readMem(++this.pc);
  this.tstates -= OP_INDEX_CB_STATES[opcode];
  switch (opcode) {
    case 6:
      this.writeMem(location, this.rlc(this.readMem(location)));
      break;
    case 14:
      this.writeMem(location, this.rrc(this.readMem(location)));
      break;
    case 22:
      this.writeMem(location, this.rl(this.readMem(location)));
      break;
    case 30:
      this.writeMem(location, this.rr(this.readMem(location)));
      break;
    case 38:
      this.writeMem(location, this.sla(this.readMem(location)));
      break;
    case 46:
      this.writeMem(location, this.sra(this.readMem(location)));
      break;
    case 54:
      this.writeMem(location, this.sll(this.readMem(location)));
      break;
    case 62:
      this.writeMem(location, this.srl(this.readMem(location)));
      break;
    case 70:
      this.bit(this.readMem(location) & BIT_0);
      break;
    case 78:
      this.bit(this.readMem(location) & BIT_1);
      break;
    case 86:
      this.bit(this.readMem(location) & BIT_2);
      break;
    case 94:
      this.bit(this.readMem(location) & BIT_3);
      break;
    case 102:
      this.bit(this.readMem(location) & BIT_4);
      break;
    case 110:
      this.bit(this.readMem(location) & BIT_5);
      break;
    case 118:
      this.bit(this.readMem(location) & BIT_6);
      break;
    case 126:
      this.bit(this.readMem(location) & BIT_7);
      break;
    case 134:
      this.writeMem(location, this.readMem(location) & ~BIT_0);
      break;
    case 142:
      this.writeMem(location, this.readMem(location) & ~BIT_1);
      break;
    case 150:
      this.writeMem(location, this.readMem(location) & ~BIT_2);
      break;
    case 158:
      this.writeMem(location, this.readMem(location) & ~BIT_3);
      break;
    case 166:
      this.writeMem(location, this.readMem(location) & ~BIT_4);
      break;
    case 174:
      this.writeMem(location, this.readMem(location) & ~BIT_5);
      break;
    case 182:
      this.writeMem(location, this.readMem(location) & ~BIT_6);
      break;
    case 190:
      this.writeMem(location, this.readMem(location) & ~BIT_7);
      break;
    case 198:
      this.writeMem(location, this.readMem(location) | BIT_0);
      break;
    case 206:
      this.writeMem(location, this.readMem(location) | BIT_1);
      break;
    case 214:
      this.writeMem(location, this.readMem(location) | BIT_2);
      break;
    case 222:
      this.writeMem(location, this.readMem(location) | BIT_3);
      break;
    case 230:
      this.writeMem(location, this.readMem(location) | BIT_4);
      break;
    case 238:
      this.writeMem(location, this.readMem(location) | BIT_5);
      break;
    case 246:
      this.writeMem(location, this.readMem(location) | BIT_6);
      break;
    case 254:
      this.writeMem(location, this.readMem(location) | BIT_7);
      break;
    default:
      DEBUG && console.log('Unimplemented DDCB or FDCB Opcode: ' + (opcode & 255).toString(16));
      break;
  }
  this.pc++;
}, doED: function(opcode) {
  var temp;
  this.tstates -= OP_ED_STATES[opcode];
  if (Setup.REFRESH_EMULATION) {
    this.incR();
  }
  switch (opcode) {
    case 64:
      this.b = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.b];
      this.pc++;
      break;
    case 65:
      this.port.out(this.c, this.b);
      this.pc++;
      break;
    case 66:
      this.sbc16(this.getBC());
      this.pc++;
      break;
    case 67:
      var location = this.readMemWord(this.pc + 1);
      this.writeMem(location++, this.c);
      this.writeMem(location, this.b);
      this.pc += 3;
      break;
    case 68:
;
    case 76:
;
    case 84:
;
    case 92:
;
    case 100:
;
    case 108:
;
    case 116:
;
    case 124:
      var a_copy = this.a;
      this.a = 0;
      this.sub_a(a_copy);
      this.pc++;
      break;
    case 69:
;
    case 77:
;
    case 85:
;
    case 93:
;
    case 101:
;
    case 109:
;
    case 117:
;
    case 125:
      this.pc = this.readMemWord(this.sp);
      this.sp += 2;
      this.iff1 = this.iff2;
      break;
    case 70:
;
    case 78:
;
    case 102:
;
    case 110:
      this.im = 0;
      this.pc++;
      break;
    case 71:
      this.i = this.a;
      this.pc++;
      break;
    case 72:
      this.c = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.c];
      this.pc++;
      break;
    case 73:
      this.port.out(this.c, this.c);
      this.pc++;
      break;
    case 74:
      this.adc16(this.getBC());
      this.pc++;
      break;
    case 75:
      var location = this.readMemWord(this.pc + 1);
      this.c = this.readMem(location++);
      this.b = this.readMem(location);
      this.pc += 3;
      break;
    case 79:
      this.r = this.a;
      this.pc++;
      break;
    case 80:
      this.d = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.d];
      this.pc++;
      break;
    case 81:
      this.port.out(this.c, this.d);
      this.pc++;
      break;
    case 82:
      this.sbc16(this.getDE());
      this.pc++;
      break;
    case 83:
      var location = this.readMemWord(this.pc + 1);
      this.writeMem(location++, this.e);
      this.writeMem(location, this.d);
      this.pc += 3;
      break;
    case 86:
;
    case 118:
      this.im = 1;
      this.pc++;
      break;
    case 87:
      this.a = this.i;
      this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);
      this.pc++;
      break;
    case 88:
      this.e = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.e];
      this.pc++;
      break;
    case 89:
      this.port.out(this.c, this.e);
      this.pc++;
      break;
    case 90:
      this.adc16(this.getDE());
      this.pc++;
      break;
    case 91:
      var location = this.readMemWord(this.pc + 1);
      this.e = this.readMem(location++);
      this.d = this.readMem(location);
      this.pc += 3;
      break;
    case 95:
      this.a = Setup.REFRESH_EMULATION ? this.r : JSSMS.Utils.rndInt(255);
      this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);
      this.pc++;
      break;
    case 96:
      this.h = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.h];
      this.pc++;
      break;
    case 97:
      this.port.out(this.c, this.h);
      this.pc++;
      break;
    case 98:
      this.sbc16(this.getHL());
      this.pc++;
      break;
    case 99:
      var location = this.readMemWord(this.pc + 1);
      this.writeMem(location++, this.l);
      this.writeMem(location, this.h);
      this.pc += 3;
      break;
    case 103:
      var location = this.getHL();
      var hlmem = this.readMem(location);
      this.writeMem(location, hlmem >> 4 | (this.a & 15) << 4);
      this.a = this.a & 240 | hlmem & 15;
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];
      this.pc++;
      break;
    case 104:
      this.l = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.l];
      this.pc++;
      break;
    case 105:
      this.port.out(this.c, this.l);
      this.pc++;
      break;
    case 106:
      this.adc16(this.getHL());
      this.pc++;
      break;
    case 107:
      var location = this.readMemWord(this.pc + 1);
      this.l = this.readMem(location++);
      this.h = this.readMem(location);
      this.pc += 3;
      break;
    case 111:
      var location = this.getHL();
      var hlmem = this.readMem(location);
      this.writeMem(location, (hlmem & 15) << 4 | this.a & 15);
      this.a = this.a & 240 | hlmem >> 4;
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];
      this.pc++;
      break;
    case 113:
      this.port.out(this.c, 0);
      this.pc++;
      break;
    case 114:
      this.sbc16(this.sp);
      this.pc++;
      break;
    case 115:
      var location = this.readMemWord(this.pc + 1);
      this.writeMem(location++, this.sp & 255);
      this.writeMem(location, this.sp >> 8);
      this.pc += 3;
      break;
    case 120:
      this.a = this.port.in_(this.c);
      this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];
      this.pc++;
      break;
    case 121:
      this.port.out(this.c, this.a);
      this.pc++;
      break;
    case 122:
      this.adc16(this.sp);
      this.pc++;
      break;
    case 123:
      this.sp = this.readMemWord(this.readMemWord(this.pc + 1));
      this.pc += 3;
      break;
    case 160:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.incDE();
      this.incHL();
      this.decBC();
      this.f = this.f & 193 | (this.getBC() != 0 ? F_PARITY : 0);
      this.pc++;
      break;
    case 161:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.incHL();
      this.decBC();
      temp |= this.getBC() == 0 ? 0 : F_PARITY;
      this.f = this.f & 248 | temp;
      this.pc++;
      break;
    case 162:
      temp = this.port.in_(this.c);
      this.writeMem(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if ((temp & 128) == 128) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 163:
      temp = this.readMem(this.getHL());
      this.port.out(this.c, temp);
      this.incHL();
      this.b = this.dec8(this.b);
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      }else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) == 128) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 168:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.decDE();
      this.decHL();
      this.decBC();
      this.f = this.f & 193 | (this.getBC() != 0 ? F_PARITY : 0);
      this.pc++;
      break;
    case 169:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.decHL();
      this.decBC();
      temp |= this.getBC() == 0 ? 0 : F_PARITY;
      this.f = this.f & 248 | temp;
      this.pc++;
      break;
    case 170:
      temp = this.port.in_(this.c);
      this.writeMem(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if ((temp & 128) != 0) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 171:
      temp = this.readMem(this.getHL());
      this.port.out(this.c, temp);
      this.decHL();
      this.b = this.dec8(this.b);
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      }else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) == 128) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 176:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.incDE();
      this.incHL();
      this.decBC();
      if (this.getBC() != 0) {
        this.f |= F_PARITY;
        this.tstates -= 5;
        this.pc--;
      }else {
        this.f &= ~F_PARITY;
        this.pc++;
      }
      this.f &= ~F_NEGATIVE;
      this.f &= ~F_HALFCARRY;
      break;
    case 177:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.incHL();
      this.decBC();
      temp |= this.getBC() == 0 ? 0 : F_PARITY;
      if ((temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0) {
        this.tstates -= 5;
        this.pc--;
      }else {
        this.pc++;
      }
      this.f = this.f & 248 | temp;
      break;
    case 178:
      temp = this.port.in_(this.c);
      this.writeMem(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if (this.b != 0) {
        this.tstates -= 5;
        this.pc--;
      }else {
        this.pc++;
      }
      if ((temp & 128) == 128) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    case 179:
      temp = this.readMem(this.getHL());
      this.port.out(this.c, temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if (this.b != 0) {
        this.tstates -= 5;
        this.pc--;
      }else {
        this.pc++;
      }
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      }else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) != 0) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    case 184:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.decDE();
      this.decHL();
      this.decBC();
      if (this.getBC() != 0) {
        this.f |= F_PARITY;
        this.tstates -= 5;
        this.pc--;
      }else {
        this.f &= ~F_PARITY;
        this.pc++;
      }
      this.f &= ~F_NEGATIVE;
      this.f &= ~F_HALFCARRY;
      break;
    case 185:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.decHL();
      this.decBC();
      temp |= this.getBC() == 0 ? 0 : F_PARITY;
      if ((temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0) {
        this.tstates -= 5;
        this.pc--;
      }else {
        this.pc++;
      }
      this.f = this.f & 248 | temp;
      break;
    case 186:
      temp = this.port.in_(this.c);
      this.writeMem(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if (this.b != 0) {
        this.tstates -= 5;
        this.pc--;
      }else {
        this.pc++;
      }
      if ((temp & 128) != 0) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    case 187:
      temp = this.readMem(this.getHL());
      this.port.out(this.c, temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if (this.b != 0) {
        this.tstates -= 5;
        this.pc--;
      }else {
        this.pc++;
      }
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      }else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) != 0) {
        this.f |= F_NEGATIVE;
      }else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    default:
      DEBUG && console.log('Unimplemented ED Opcode: ' + opcode.toString(16)), this.pc++;
      break;
  }
}, generateDAATable: function() {
  this.DAA_TABLE = new Array(2048);
  for (var i = 256; i-- != 0;) {
    for (var c = 0; c <= 1; c++) {
      for (var h = 0; h <= 1; h++) {
        for (var n = 0; n <= 1; n++) {
          this.DAA_TABLE[c << 8 | n << 9 | h << 10 | i] = this.getDAAResult(i, c | n << 1 | h << 4);
        }
      }
    }
  }
  this.a = this.f = 0;
}, getDAAResult: function(value, flags) {
  this.a = value;
  this.f = flags;
  var a_copy = this.a;
  var correction = 0;
  var carry = flags & F_CARRY;
  var carry_copy = carry;
  if ((flags & F_HALFCARRY) != 0 || (a_copy & 15) > 9) {
    correction |= 6;
  }
  if (carry == 1 || a_copy > 159 || a_copy > 143 && (a_copy & 15) > 9) {
    correction |= 96;
    carry_copy = 1;
  }
  if (a_copy > 153) {
    carry_copy = 1;
  }
  if ((flags & F_NEGATIVE) != 0) {
    this.sub_a(correction);
  }else {
    this.add_a(correction);
  }
  flags = this.f & 254 | carry_copy;
  if (this.getParity(this.a)) {
    flags = flags & 251 | F_PARITY;
  }else {
    flags = flags & 251;
  }
  return this.a | flags << 8;
}, add_a: function(value) {
  var temp = this.a + value & 255;
  this.f = this.SZHVC_ADD_TABLE[this.a << 8 | temp];
  this.a = temp;
}, adc_a: function(value) {
  var carry = this.f & F_CARRY;
  var temp = this.a + value + carry & 255;
  this.f = this.SZHVC_ADD_TABLE[carry << 16 | this.a << 8 | temp];
  this.a = temp;
}, sub_a: function(value) {
  var temp = this.a - value & 255;
  this.f = this.SZHVC_SUB_TABLE[this.a << 8 | temp];
  this.a = temp;
}, sbc_a: function(value) {
  var carry = this.f & F_CARRY;
  var temp = this.a - value - carry & 255;
  this.f = this.SZHVC_SUB_TABLE[carry << 16 | this.a << 8 | temp];
  this.a = temp;
}, cp_a: function(value) {
  this.f = this.SZHVC_SUB_TABLE[this.a << 8 | this.a - value & 255];
}, cpl_a: function() {
  this.a ^= 255;
  this.f |= F_NEGATIVE | F_HALFCARRY;
}, rra_a: function() {
  var carry = this.a & 1;
  this.a = (this.a >> 1 | (this.f & F_CARRY) << 7) & 255;
  this.f = this.f & 236 | carry;
}, rla_a: function() {
  var carry = this.a >> 7;
  this.a = (this.a << 1 | this.f & F_CARRY) & 255;
  this.f = this.f & 236 | carry;
}, rlca_a: function() {
  var carry = this.a >> 7;
  this.a = this.a << 1 & 255 | carry;
  this.f = this.f & 236 | carry;
}, rrca_a: function() {
  var carry = this.a & 1;
  this.a = this.a >> 1 | carry << 7;
  this.f = this.f & 236 | carry;
}, getBC: function() {
  return this.b << 8 | this.c;
}, getDE: function() {
  return this.d << 8 | this.e;
}, getHL: function() {
  return this.h << 8 | this.l;
}, getIX: function() {
  return this.ixH << 8 | this.ixL;
}, getIY: function() {
  return this.iyH << 8 | this.iyL;
}, setBC: function(value) {
  this.b = value >> 8;
  this.c = value & 255;
}, setDE: function(value) {
  this.d = value >> 8;
  this.e = value & 255;
}, setHL: function(value) {
  this.h = value >> 8;
  this.l = value & 255;
}, setIX: function(value) {
  this.ixH = value >> 8;
  this.ixL = value & 255;
}, setIY: function(value) {
  this.iyH = value >> 8;
  this.iyL = value & 255;
}, incBC: function() {
  this.c = this.c + 1 & 255;
  if (this.c == 0) {
    this.b = this.b + 1 & 255;
  }
}, incDE: function() {
  this.e = this.e + 1 & 255;
  if (this.e == 0) {
    this.d = this.d + 1 & 255;
  }
}, incHL: function() {
  this.l = this.l + 1 & 255;
  if (this.l == 0) {
    this.h = this.h + 1 & 255;
  }
}, incIX: function() {
  this.ixL = this.ixL + 1 & 255;
  if (this.ixL == 0) {
    this.ixH = this.ixH + 1 & 255;
  }
}, incIY: function() {
  this.iyL = this.iyL + 1 & 255;
  if (this.iyL == 0) {
    this.iyH = this.iyH + 1 & 255;
  }
}, decBC: function() {
  this.c = this.c - 1 & 255;
  if (this.c == 255) {
    this.b = this.b - 1 & 255;
  }
}, decDE: function() {
  this.e = this.e - 1 & 255;
  if (this.e == 255) {
    this.d = this.d - 1 & 255;
  }
}, decHL: function() {
  this.l = this.l - 1 & 255;
  if (this.l == 255) {
    this.h = this.h - 1 & 255;
  }
}, decIX: function() {
  this.ixL = this.ixL - 1 & 255;
  if (this.ixL == 255) {
    this.ixH = this.ixH - 1 & 255;
  }
}, decIY: function() {
  this.iyL = this.iyL - 1 & 255;
  if (this.iyL == 255) {
    this.iyH = this.iyH - 1 & 255;
  }
}, inc8: function(value) {
  value = value + 1 & 255;
  this.f = this.f & F_CARRY | this.SZHV_INC_TABLE[value];
  return value;
}, dec8: function(value) {
  value = value - 1 & 255;
  this.f = this.f & F_CARRY | this.SZHV_DEC_TABLE[value];
  return value;
}, exAF: function() {
  var temp = this.a;
  this.a = this.a2;
  this.a2 = temp;
  temp = this.f;
  this.f = this.f2;
  this.f2 = temp;
}, exBC: function() {
  var temp = this.b;
  this.b = this.b2;
  this.b2 = temp;
  temp = this.c;
  this.c = this.c2;
  this.c2 = temp;
}, exDE: function() {
  var temp = this.d;
  this.d = this.d2;
  this.d2 = temp;
  temp = this.e;
  this.e = this.e2;
  this.e2 = temp;
}, exHL: function() {
  var temp = this.h;
  this.h = this.h2;
  this.h2 = temp;
  temp = this.l;
  this.l = this.l2;
  this.l2 = temp;
}, add16: function(reg, value) {
  var result = reg + value;
  this.f = this.f & 196 | (reg ^ result ^ value) >> 8 & 16 | result >> 16 & 1;
  return result & 65535;
}, adc16: function(value) {
  var hl = this.h << 8 | this.l;
  var result = hl + value + (this.f & F_CARRY);
  this.f = (hl ^ result ^ value) >> 8 & 16 | result >> 16 & 1 | result >> 8 & 128 | ((result & 65535) != 0 ? 0 : 64) | ((value ^ hl ^ 32768) & (value ^ result) & 32768) >> 13;
  this.h = result >> 8 & 255;
  this.l = result & 255;
}, sbc16: function(value) {
  var hl = this.h << 8 | this.l;
  var result = hl - value - (this.f & F_CARRY);
  this.f = (hl ^ result ^ value) >> 8 & 16 | 2 | result >> 16 & 1 | result >> 8 & 128 | ((result & 65535) != 0 ? 0 : 64) | ((value ^ hl) & (hl ^ result) & 32768) >> 13;
  this.h = result >> 8 & 255;
  this.l = result & 255;
}, incR: function() {
  this.r = this.r & 128 | this.r + 1 & 127;
}, generateFlagTables: function() {
  this.SZ_TABLE = new Array(256);
  this.SZP_TABLE = new Array(256);
  this.SZHV_INC_TABLE = new Array(256);
  this.SZHV_DEC_TABLE = new Array(256);
  this.SZ_BIT_TABLE = new Array(256);
  for (var i = 0; i < 256; i++) {
    var sf = (i & 128) != 0 ? F_SIGN : 0;
    var zf = i == 0 ? F_ZERO : 0;
    var yf = i & 32;
    var xf = i & 8;
    var pf = this.getParity(i) ? F_PARITY : 0;
    this.SZ_TABLE[i] = sf | zf | yf | xf;
    this.SZP_TABLE[i] = sf | zf | yf | xf | pf;
    this.SZHV_INC_TABLE[i] = sf | zf | yf | xf;
    this.SZHV_INC_TABLE[i] |= i == 128 ? F_OVERFLOW : 0;
    this.SZHV_INC_TABLE[i] |= (i & 15) == 0 ? F_HALFCARRY : 0;
    this.SZHV_DEC_TABLE[i] = sf | zf | yf | xf | F_NEGATIVE;
    this.SZHV_DEC_TABLE[i] |= i == 127 ? F_OVERFLOW : 0;
    this.SZHV_DEC_TABLE[i] |= (i & 15) == 15 ? F_HALFCARRY : 0;
    this.SZ_BIT_TABLE[i] = i != 0 ? i & 128 : F_ZERO | F_PARITY;
    this.SZ_BIT_TABLE[i] |= yf | xf | F_HALFCARRY;
  }
  this.SZHVC_ADD_TABLE = new Array(2 * 256 * 256);
  this.SZHVC_SUB_TABLE = new Array(2 * 256 * 256);
  var padd = 0 * 256;
  var padc = 256 * 256;
  var psub = 0 * 256;
  var psbc = 256 * 256;
  for (var oldval = 0; oldval < 256; oldval++) {
    for (var newval = 0; newval < 256; newval++) {
      var val = newval - oldval;
      if (newval != 0) {
        if ((newval & 128) != 0) {
          this.SZHVC_ADD_TABLE[padd] = F_SIGN;
        }else {
          this.SZHVC_ADD_TABLE[padd] = 0;
        }
      }else {
        this.SZHVC_ADD_TABLE[padd] = F_ZERO;
      }
      this.SZHVC_ADD_TABLE[padd] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) < (oldval & 15)) {
        this.SZHVC_ADD_TABLE[padd] |= F_HALFCARRY;
      }
      if (newval < oldval) {
        this.SZHVC_ADD_TABLE[padd] |= F_CARRY;
      }
      if (((val ^ oldval ^ 128) & (val ^ newval) & 128) != 0) {
        this.SZHVC_ADD_TABLE[padd] |= F_OVERFLOW;
      }
      padd++;
      val = newval - oldval - 1;
      if (newval != 0) {
        if ((newval & 128) != 0) {
          this.SZHVC_ADD_TABLE[padc] = F_SIGN;
        }else {
          this.SZHVC_ADD_TABLE[padc] = 0;
        }
      }else {
        this.SZHVC_ADD_TABLE[padc] = F_ZERO;
      }
      this.SZHVC_ADD_TABLE[padc] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) <= (oldval & 15)) {
        this.SZHVC_ADD_TABLE[padc] |= F_HALFCARRY;
      }
      if (newval <= oldval) {
        this.SZHVC_ADD_TABLE[padc] |= F_CARRY;
      }
      if (((val ^ oldval ^ 128) & (val ^ newval) & 128) != 0) {
        this.SZHVC_ADD_TABLE[padc] |= F_OVERFLOW;
      }
      padc++;
      val = oldval - newval;
      if (newval != 0) {
        if ((newval & 128) != 0) {
          this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE | F_SIGN;
        }else {
          this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE;
        }
      }else {
        this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE | F_ZERO;
      }
      this.SZHVC_SUB_TABLE[psub] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) > (oldval & 15)) {
        this.SZHVC_SUB_TABLE[psub] |= F_HALFCARRY;
      }
      if (newval > oldval) {
        this.SZHVC_SUB_TABLE[psub] |= F_CARRY;
      }
      if (((val ^ oldval) & (oldval ^ newval) & 128) != 0) {
        this.SZHVC_SUB_TABLE[psub] |= F_OVERFLOW;
      }
      psub++;
      val = oldval - newval - 1;
      if (newval != 0) {
        if ((newval & 128) != 0) {
          this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE | F_SIGN;
        }else {
          this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE;
        }
      }else {
        this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE | F_ZERO;
      }
      this.SZHVC_SUB_TABLE[psbc] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) >= (oldval & 15)) {
        this.SZHVC_SUB_TABLE[psbc] |= F_HALFCARRY;
      }
      if (newval >= oldval) {
        this.SZHVC_SUB_TABLE[psbc] |= F_CARRY;
      }
      if (((val ^ oldval) & (oldval ^ newval) & 128) != 0) {
        this.SZHVC_SUB_TABLE[psbc] |= F_OVERFLOW;
      }
      psbc++;
    }
  }
}, getParity: function(value) {
  var parity = true;
  for (var j = 0; j < 8; j++) {
    if ((value & 1 << j) != 0) {
      parity = !parity;
    }
  }
  return parity;
}, getDummyWrite: function() {
  return new Array(Setup.PAGE_SIZE);
}, generateMemory: function() {
  for (var i = 0; i < 65; i++) {
    this.memReadMap[i] = new Array(Setup.PAGE_SIZE);
    this.memWriteMap[i] = new Array(Setup.PAGE_SIZE);
  }
  for (i = 0; i < 8; i++) {
    this.ram[i] = new Array(Setup.PAGE_SIZE);
  }
  if (this.sram == null) {
    this.sram = new Array(32);
    this.useSRAM = false;
  }
  this.memReadMap[64] = this.getDummyWrite();
  this.memWriteMap[64] = this.getDummyWrite();
  this.number_of_pages = 2;
}, resetMemory: function(p) {
  if (p != null) {
    this.rom = p;
  }
  this.frameReg[0] = 0;
  this.frameReg[1] = 0;
  this.frameReg[2] = 1;
  this.frameReg[3] = 0;
  if (this.rom != null) {
    this.number_of_pages = this.rom.length / 16;
    this.setDefaultMemoryMapping();
  }else {
    this.number_of_pages = 0;
  }
}, setDefaultMemoryMapping: function() {
  for (var i = 0; i < 48; i++) {
    this.memReadMap[i] = JSSMS.Utils.copyArray(this.rom[i & 31]);
    this.memWriteMap[i] = this.getDummyWrite();
  }
  for (i = 48; i < 64; i++) {
    this.memReadMap[i] = this.ram[i & 7];
    this.memWriteMap[i] = this.ram[i & 7];
  }
}, writeMem: function(address, value) {
  if (DEBUG && (address >> 10 >= this.memWriteMap.length || !this.memWriteMap[address >> 10] || (address & 1023) >= this.memWriteMap[address >> 10].length)) {
    console.log(address, address >> 10, address & 1023);
    debugger;
  }
  this.memWriteMap[address >> 10][address & 1023] = value;
  if (address >= 65532) {
    this.page(address & 3, value);
  }
}, readMem: function(address) {
  if (DEBUG && (address >> 10 >= this.memReadMap.length || !this.memReadMap[address >> 10] || (address & 1023) >= this.memReadMap[address >> 10].length)) {
    console.log(address, address >> 10, address & 1023);
    debugger;
  }
  return this.memReadMap[address >> 10][address & 1023] & 255;
}, d_: function() {
  return this.memReadMap[this.pc >> 10][this.pc & 1023];
}, readMemWord: function(address) {
  return this.memReadMap[address >> 10][address & 1023] & 255 | (this.memReadMap[++address >> 10][address & 1023] & 255) << 8;
}, page: function(address, value) {
  this.frameReg[address] = value;
  switch (address) {
    case 0:
      if ((value & 8) != 0) {
        var offset = (value & 4) << 2;
        for (var i = 32; i < 48; i++) {
          this.memReadMap[i] = JSSMS.Utils.copyArray(this.sram[offset]);
          this.memWriteMap[i] = JSSMS.Utils.copyArray(this.sram[offset]);
          offset++;
        }
        this.useSRAM = true;
      }else {
        var p = this.frameReg[3] % this.number_of_pages << 4;
        for (var i = 32; i < 48; i++) {
          this.memReadMap[i] = JSSMS.Utils.copyArray(this.rom[p++]);
          this.memWriteMap[i] = this.getDummyWrite();
        }
      }
      break;
    case 1:
      var p = (value % this.number_of_pages << 4) + 1;
      for (var i = 1; i < 16; i++) {
        this.memReadMap[i] = JSSMS.Utils.copyArray(this.rom[p++]);
      }
      break;
    case 2:
      var p = value % this.number_of_pages << 4;
      for (var i = 16; i < 32; i++) {
        this.memReadMap[i] = JSSMS.Utils.copyArray(this.rom[p++]);
      }
      break;
    case 3:
      if ((this.frameReg[0] & 8) == 0) {
        var p = value % this.number_of_pages << 4;
        for (var i = 32; i < 48; i++) {
          this.memReadMap[i] = JSSMS.Utils.copyArray(this.rom[p++]);
        }
      }
      break;
  }
}, hasUsedSRAM: function() {
  return this.useSRAM;
}, setSRAM: function(bytes) {
  var length = bytes.length / Setup.PAGE_SIZE;
  for (var i = 0; i < length; i++) {
    JSSMS.Utils.copyArrayElements(bytes, i * Setup.PAGE_SIZE, this.sram[i], 0, Setup.PAGE_SIZE);
  }
}, setStateMem: function(state) {
  this.frameReg = state;
  this.setDefaultMemoryMapping();
  this.page(3, this.frameReg[3]);
  this.page(2, this.frameReg[2]);
  this.page(1, this.frameReg[1]);
  this.page(0, this.frameReg[0]);
}, getState: function() {
  var STATE_LENGTH = 8;
  var state = new Array(STATE_LENGTH);
  state[0] = this.pc | this.sp << 16;
  state[1] = (this.iff1 ? 1 : 0) | (this.iff2 ? 2 : 0) | (this.halt ? 4 : 0) | (this.EI_inst ? 8 : 0) | (this.interruptLine ? 16 : 0);
  state[2] = this.a | this.a2 << 8 | this.f << 16 | this.f2 << 24;
  state[3] = this.getBC() | this.getDE() << 16;
  state[4] = this.getHL() | this.r << 16 | this.i << 24;
  state[5] = this.getIX() | this.getIY() << 16;
  this.exBC();
  this.exDE();
  this.exHL();
  state[6] = this.getBC() | this.getDE() << 16;
  state[7] = this.getHL() | this.im << 16 | this.interruptVector << 24;
  this.exBC();
  this.exDE();
  this.exHL();
  return state;
}, setState: function(state) {
  var temp = state[0];
  this.pc = temp & 65535;
  this.sp = temp >> 16 & 65535;
  temp = state[1];
  this.iff1 = (temp & 1) != 0;
  this.iff2 = (temp & 2) != 0;
  this.halt = (temp & 4) != 0;
  this.EI_inst = (temp & 8) != 0;
  this.interruptLine = (temp & 16) != 0;
  temp = state[2];
  this.a = temp & 255;
  this.a2 = temp >> 8 & 255;
  this.f = temp >> 16 & 255;
  this.f2 = temp >> 24 & 255;
  temp = state[3];
  this.setBC(temp & 65535);
  this.setDE(temp >> 16 & 65535);
  temp = state[4];
  this.setHL(temp & 65535);
  this.r = temp >> 16 & 255;
  this.i = temp >> 24 & 255;
  temp = state[5];
  this.setIX(temp & 65535);
  this.setIY(temp >> 16 & 65535);
  this.exBC();
  this.exDE();
  this.exHL();
  temp = state[6];
  this.setBC(temp & 65535);
  this.setDE(temp >> 16 & 65535);
  temp = state[7];
  this.setHL(temp & 65535);
  this.im = temp >> 16 & 255;
  this.interruptVector = temp >> 24 & 255;
  this.exBC();
  this.exDE();
  this.exHL();
}};
var KEY_UP = 1;
var KEY_DOWN = 2;
var KEY_LEFT = 4;
var KEY_RIGHT = 8;
var KEY_FIRE1 = 16;
var KEY_FIRE2 = 32;
var KEY_START = 64;
JSSMS.Keyboard = function(sms) {
  this.main = sms;
  this.controller1 = 0;
  this.controller2 = 0;
  this.ggstart = 0;
  this.lightgunX = 0;
  this.lightgunY = 0;
  this.lightgunClick = false;
  this.lightgunEnabled = false;
};
JSSMS.Keyboard.prototype = {reset: function() {
  this.controller1 = 255;
  this.controller2 = 255;
  this.ggstart = 255;
  if (Setup.LIGHTGUN) {
    this.lightgunClick = false;
  }
  this.pause_button = false;
}, keydown: function(evt) {
  switch (evt.keyCode) {
    case 38:
      this.controller1 &= ~KEY_UP;
      break;
    case 40:
      this.controller1 &= ~KEY_DOWN;
      break;
    case 37:
      this.controller1 &= ~KEY_LEFT;
      break;
    case 39:
      this.controller1 &= ~KEY_RIGHT;
      break;
    case 88:
      this.controller1 &= ~KEY_FIRE1;
      break;
    case 90:
      this.controller1 &= ~KEY_FIRE2;
      break;
    case 13:
      if (this.main.is_sms) {
        this.main.pause_button = true;
      }else {
        this.ggstart &= ~128;
      }
      break;
    case 104:
      this.controller2 &= ~KEY_UP;
      break;
    case 98:
      this.controller2 &= ~KEY_DOWN;
      break;
    case 100:
      this.controller2 &= ~KEY_LEFT;
      break;
    case 102:
      this.controller2 &= ~KEY_RIGHT;
      break;
    case 103:
      this.controller2 &= ~KEY_FIRE1;
      break;
    case 105:
      this.controller2 &= ~KEY_FIRE2;
      break;
    case 97:
      this.controller2 &= ~KEY_START;
      break;
    default:
      return;
  }
  evt.preventDefault();
}, keyup: function(evt) {
  switch (evt.keyCode) {
    case 38:
      this.controller1 |= KEY_UP;
      break;
    case 40:
      this.controller1 |= KEY_DOWN;
      break;
    case 37:
      this.controller1 |= KEY_LEFT;
      break;
    case 39:
      this.controller1 |= KEY_RIGHT;
      break;
    case 88:
      this.controller1 |= KEY_FIRE1;
      break;
    case 90:
      this.controller1 |= KEY_FIRE2;
      break;
    case 13:
      if (!this.main.is_sms) {
        this.ggstart |= 128;
      }
      break;
    case 104:
      this.controller2 |= KEY_UP;
      break;
    case 98:
      this.controller2 |= KEY_DOWN;
      break;
    case 100:
      this.controller2 |= KEY_LEFT;
      break;
    case 102:
      this.controller2 |= KEY_RIGHT;
      break;
    case 103:
      this.controller2 |= KEY_FIRE1;
      break;
    case 105:
      this.controller2 |= KEY_FIRE2;
      break;
    case 97:
      this.controller2 |= KEY_START;
      break;
    default:
      return;
  }
  evt.preventDefault();
}};
JSSMS.SN76489 = function(sms) {
  this.main = sms;
};
JSSMS.SN76489.prototype = {write: function(value) {
}};
var NTSC = 0;
var PAL = 1;
var SMS_X_PIXELS = 342;
var SMS_Y_PIXELS_NTSC = 262;
var SMS_Y_PIXELS_PAL = 313;
var SMS_WIDTH = 256;
var SMS_HEIGHT = 192;
var GG_WIDTH = 160;
var GG_HEIGHT = 144;
var GG_X_OFFSET = 48;
var GG_Y_OFFSET = 24;
var STATUS_VINT = 128;
var STATUS_OVERFLOW = 64;
var STATUS_COLLISION = 32;
var STATUS_HINT = 4;
var BGT_LENGTH = 32 * 28 * 2;
var SPRITES_PER_LINE = 8;
var SPRITE_COUNT = 0;
var SPRITE_X = 1;
var SPRITE_Y = 2;
var SPRITE_N = 3;
var TOTAL_TILES = 512;
var TILE_SIZE = 8;
JSSMS.Vdp = function(sms) {
  this.main = sms;
  var i;
  this.videoMode = NTSC;
  this.VRAM = new Array(16384);
  this.CRAM = new Array(32);
  for (i = 0; i < 32; i++) {
    this.CRAM[i] = 0;
  }
  this.vdpreg = new Array(16);
  this.status = 0;
  this.firstByte = false;
  this.commandByte = 0;
  this.location = 0;
  this.operation = 0;
  this.readBuffer = 0;
  this.line = 0;
  this.counter = 0;
  this.bgPriority = new Array(SMS_WIDTH);
  if (Setup.VDP_SPRITE_COLLISIONS) {
    this.spriteCol = new Array(SMS_WIDTH);
  }
  this.bgt = 0;
  this.vScrollLatch = 0;
  this.display = new Array(SMS_WIDTH * SMS_HEIGHT);
  this.main_JAVA = [];
  this.GG_JAVA1 = [];
  this.GG_JAVA2 = [];
  this.h_start = 0;
  this.h_end = 0;
  this.sat = 0;
  this.isSatDirty = false;
  this.lineSprites = new Array(SMS_HEIGHT);
  for (i = 0; i < SMS_HEIGHT; i++) {
    this.lineSprites[i] = new Array(1 + 3 * SPRITES_PER_LINE);
  }
  this.tiles = new Array(TOTAL_TILES);
  this.isTileDirty = new Array(TOTAL_TILES);
  this.minDirty = 0;
  this.maxDirty = 0;
  this.createCachedImages();
};
JSSMS.Vdp.prototype = {reset: function() {
  var i;
  this.generateConvertedPals();
  this.firstByte = true;
  this.location = 0;
  this.counter = 0;
  this.status = 0;
  this.operation = 0;
  for (i = 0; i < 16; i++) {
    this.vdpreg[i] = 0;
  }
  this.vdpreg[2] = 14;
  this.vdpreg[5] = 126;
  this.vScrollLatch = 0;
  this.main.cpu.interruptLine = false;
  this.isSatDirty = true;
  this.minDirty = TOTAL_TILES;
  this.maxDirty = -1;
  for (i = 0; i < 16384; i++) {
    this.VRAM[i] = 0;
  }
  for (i = 0; i < SMS_WIDTH * SMS_HEIGHT; i++) {
    this.display[i] = 0;
  }
}, forceFullRedraw: function() {
  this.bgt = (this.vdpreg[2] & 15 & ~1) << 10;
  this.minDirty = 0;
  this.maxDirty = TOTAL_TILES - 1;
  for (var i = 0, l = this.isTileDirty.length; i < l; i++) {
    this.isTileDirty[i] = true;
  }
  this.sat = (this.vdpreg[5] & ~1 & ~128) << 7;
  this.isSatDirty = true;
}, getVCount: function() {
  if (this.videoMode == NTSC) {
    if (this.line > 218) {
      return this.line - 6;
    }
  }else {
    if (this.line > 242) {
      return this.line - 57;
    }
  }
  return this.line;
}, controlRead: function() {
  this.firstByte = true;
  var statuscopy = this.status;
  this.status = 0;
  this.main.cpu.interruptLine = false;
  return statuscopy;
}, controlWrite: function(value) {
  if (this.firstByte) {
    this.firstByte = false;
    this.commandByte = value;
    this.location = this.location & 16128 | value;
  }else {
    this.firstByte = true;
    this.operation = value >> 6 & 3;
    this.location = this.commandByte | value << 8;
    if (this.operation == 0) {
      this.readBuffer = this.VRAM[this.location++ & 16383] & 255;
    }else {
      if (this.operation == 2) {
        var reg = value & 15;
        switch (reg) {
          case 0:
            if (Setup.ACCURATE_INTERRUPT_EMULATION && (this.status & STATUS_HINT) != 0) {
              this.main.cpu.interruptLine = (this.commandByte & 16) != 0;
            }
            break;
          case 1:
            if ((this.status & STATUS_VINT) != 0 && (this.commandByte & 32) != 0) {
              this.main.cpu.interruptLine = true;
            }
            if ((this.commandByte & 3) != (this.vdpreg[reg] & 3)) {
              this.isSatDirty = true;
            }
            break;
          case 2:
            this.bgt = (this.commandByte & 15 & ~1) << 10;
            break;
          case 5:
            var old = this.sat;
            this.sat = (this.commandByte & ~1 & ~128) << 7;
            if (old != this.sat) {
              this.isSatDirty = true;
              DEBUG && console.log('New address written to SAT: ' + old + ' -> ' + this.sat);
            }
            break;
        }
        this.vdpreg[reg] = this.commandByte;
      }
    }
  }
}, dataRead: function() {
  this.firstByte = true;
  var value = this.readBuffer;
  this.readBuffer = this.VRAM[this.location++ & 16383] & 255;
  return value;
}, dataWrite: function(value) {
  this.firstByte = true;
  switch (this.operation) {
    case 0:
;
    case 1:
;
    case 2:
      var address = this.location & 16383;
      if (value != (this.VRAM[address] & 255)) {
        if (address >= this.sat && address < this.sat + 64) {
          this.isSatDirty = true;
        }else {
          if (address >= this.sat + 128 && address < this.sat + 256) {
            this.isSatDirty = true;
          }else {
            var tileIndex = address >> 5;
            this.isTileDirty[tileIndex] = true;
            if (tileIndex < this.minDirty) {
              this.minDirty = tileIndex;
            }
            if (tileIndex > this.maxDirty) {
              this.maxDirty = tileIndex;
            }
          }
        }
        this.VRAM[address] = value;
      }
      break;
    case 3:
      if (this.main.is_sms) {
        this.CRAM[this.location & 31] = this.main_JAVA[value & 63];
      }else {
        if (this.main.is_gg) {
          if ((this.location & 1) == 0) {
            this.CRAM[(this.location & 63) >> 1] = this.GG_JAVA1[value];
          }else {
            this.CRAM[(this.location & 63) >> 1] |= this.GG_JAVA2[value & 15];
          }
        }
      }
      break;
  }
  if (ACCURATE) {
    this.readBuffer = value;
  }
  this.location++;
}, interrupts: function(lineno) {
  if (lineno <= 192) {
    if (!Setup.ACCURATE_INTERRUPT_EMULATION && lineno == 192) {
      this.status |= STATUS_VINT;
    }
    if (this.counter == 0) {
      this.counter = this.vdpreg[10];
      this.status |= STATUS_HINT;
    }else {
      this.counter--;
    }
    if ((this.status & STATUS_HINT) != 0 && (this.vdpreg[0] & 16) != 0) {
      this.main.cpu.interruptLine = true;
    }
  }else {
    this.counter = this.vdpreg[10];
    if ((this.status & STATUS_VINT) != 0 && (this.vdpreg[1] & 32) != 0 && lineno < 224) {
      this.main.cpu.interruptLine = true;
    }
    if (ACCURATE && lineno == this.main.no_of_scanlines - 1) {
      this.vScrollLatch = this.vdpreg[9];
    }
  }
}, setVBlankFlag: function() {
  this.status |= STATUS_VINT;
}, drawLine: function(lineno) {
  if (this.main.is_gg) {
    if (lineno < GG_Y_OFFSET || lineno >= GG_Y_OFFSET + GG_HEIGHT) {
      return;
    }
  }
  if (Setup.VDP_SPRITE_COLLISIONS) {
    for (var i = this.spriteCol.length; i-- != 0;) {
      this.spriteCol[i] = false;
    }
  }
  if ((this.vdpreg[1] & 64) != 0) {
    if (this.maxDirty != -1) {
      this.decodeTiles();
    }
    this.drawBg(lineno);
    if (this.isSatDirty) {
      this.decodeSat();
    }
    if (this.lineSprites[lineno][SPRITE_COUNT] != 0) {
      this.drawSprite(lineno);
    }
    if (this.main.is_sms && (this.vdpreg[0] & 32) != 0) {
      var colour = this.CRAM[16 + (this.vdpreg[7] & 15)];
      var location = lineno << 8;
      if (16 + (this.vdpreg[7] & 15) > 32) {
        debugger;
      }
      if (location > SMS_WIDTH * SMS_HEIGHT) {
        debugger;
      }
      this.display[location++] = colour;
      this.display[location++] = colour;
      this.display[location++] = colour;
      this.display[location++] = colour;
      this.display[location++] = colour;
      this.display[location++] = colour;
      this.display[location++] = colour;
      this.display[location] = colour;
    }
  }else {
    this.drawBGColour(lineno);
  }
}, drawBg: function(lineno) {
  var hscroll = this.vdpreg[8];
  var vscroll = ACCURATE ? this.vScrollLatch : this.vdpreg[9];
  if (lineno < 16 && (this.vdpreg[0] & 64) != 0) {
    hscroll = 0;
  }
  var lock = this.vdpreg[0] & 128;
  var tile_column = 32 - (hscroll >> 3) + this.h_start;
  var tile_row = lineno + vscroll >> 3;
  if (tile_row > 27) {
    tile_row -= 28;
  }
  var tile_y = (lineno + (vscroll & 7) & 7) << 3;
  var rowprecal = lineno << 8;
  for (var tx = this.h_start; tx < this.h_end; tx++) {
    var tile_props = this.bgt + ((tile_column & 31) << 1) + (tile_row << 6);
    var secondbyte = this.VRAM[tile_props + 1];
    var pal = (secondbyte & 8) << 1;
    var sx = (tx << 3) + (hscroll & 7);
    var pixY = (secondbyte & 4) == 0 ? tile_y : (7 << 3) - tile_y;
    var tile = this.tiles[(this.VRAM[tile_props] & 255) + ((secondbyte & 1) << 8)];
    if ((secondbyte & 2) == 0) {
      for (var pixX = 0; pixX < 8 && sx < SMS_WIDTH; pixX++, sx++) {
        var colour = tile[pixX + pixY];
        this.bgPriority[sx] = (secondbyte & 16) != 0 && colour != 0;
        this.display[sx + rowprecal] = this.CRAM[colour + pal];
      }
    }else {
      for (var pixX = 7; pixX >= 0 && sx < SMS_WIDTH; pixX--, sx++) {
        var colour = tile[pixX + pixY];
        this.bgPriority[sx] = (secondbyte & 16) != 0 && colour != 0;
        this.display[sx + rowprecal] = this.CRAM[colour + pal];
      }
    }
    tile_column++;
    if (lock != 0 && tx == 23) {
      tile_row = lineno >> 3;
      tile_y = (lineno & 7) << 3;
    }
  }
}, drawSprite: function(lineno) {
  var sprites = this.lineSprites[lineno];
  var count = Math.min(SPRITES_PER_LINE, sprites[SPRITE_COUNT]);
  var zoomed = this.vdpreg[1] & 1;
  var row_precal = lineno << 8;
  var off = count * 3;
  for (var i = count; i-- != 0;) {
    var n = sprites[off--] | (this.vdpreg[6] & 4) << 6;
    var y = sprites[off--];
    var x = sprites[off--] - (this.vdpreg[0] & 8);
    var tileRow = lineno - y >> zoomed;
    if ((this.vdpreg[1] & 2) != 0) {
      n &= ~1;
    }
    var tile = this.tiles[n + ((tileRow & 8) >> 3)];
    var pix = 0;
    if (x < 0) {
      pix = -x;
      x = 0;
    }
    var offset = pix + ((tileRow & 7) << 3);
    if (zoomed == 0) {
      for (; pix < 8 && x < SMS_WIDTH; pix++, x++) {
        var colour = tile[offset++];
        if (colour != 0 && !this.bgPriority[x]) {
          this.display[x + row_precal] = this.CRAM[colour + 16];
          if (Setup.VDP_SPRITE_COLLISIONS) {
            if (!this.spriteCol[x]) {
              this.spriteCol[x] = true;
            }else {
              this.status |= 32;
            }
          }
        }
      }
    }else {
      for (; pix < 8 && x < SMS_WIDTH; pix++, x += 2) {
        var colour = tile[offset++];
        if (colour != 0 && !this.bgPriority[x]) {
          this.display[x + row_precal] = this.CRAM[colour + 16];
          if (Setup.VDP_SPRITE_COLLISIONS) {
            if (!this.spriteCol[x]) {
              this.spriteCol[x] = true;
            }else {
              this.status |= 32;
            }
          }
        }
        if (colour != 0 && !this.bgPriority[x + 1]) {
          this.display[x + row_precal + 1] = this.CRAM[colour + 16];
          if (Setup.VDP_SPRITE_COLLISIONS) {
            if (!this.spriteCol[x + 1]) {
              this.spriteCol[x + 1] = true;
            }else {
              this.status |= 32;
            }
          }
        }
      }
    }
  }
  if (sprites[SPRITE_COUNT] >= SPRITES_PER_LINE) {
    this.status |= 64;
  }
}, drawBGColour: function(lineno) {
  var colour = this.CRAM[16 + (this.vdpreg[7] & 15)];
  var row_precal = lineno << 8;
  var i;
  for (i = 0; i < SMS_WIDTH; i++) {
    this.display[row_precal++] = colour;
  }
}, generateConvertedPals: function() {
  var i;
  var r, g, b;
  if (this.main.is_sms && !this.main_JAVA.length) {
    this.main_JAVA = new Array(64);
    for (i = 0; i < 64; i++) {
      r = i & 3;
      g = i >> 2 & 3;
      b = i >> 4 & 3;
      this.main_JAVA[i] = r * 85 | g * 85 << 8 | b * 85 << 16;
    }
  }else {
    if (this.main.is_gg && !this.GG_JAVA1.length) {
      this.GG_JAVA1 = new Array(256);
      this.GG_JAVA2 = new Array(16);
      for (i = 0; i < 256; i++) {
        g = i & 15;
        b = i >> 4 & 15;
        this.GG_JAVA1[i] = b << 12 | b << 8 | g << 4 | g;
      }
      for (i = 0; i < 16; i++) {
        this.GG_JAVA2[i] = i << 20;
      }
    }
  }
}, createCachedImages: function() {
  for (var i = 0; i < TOTAL_TILES; i++) {
    this.tiles[i] = new Array(TILE_SIZE * TILE_SIZE);
  }
}, decodeTiles: function() {
  DEBUG && console.log('[' + this.line + ']' + ' min dirty:' + this.minDirty + ' max: ' + this.maxDirty);
  for (var i = this.minDirty; i <= this.maxDirty; i++) {
    if (!this.isTileDirty[i]) {
      continue;
    }
    this.isTileDirty[i] = false;
    DEBUG && console.log('tile ' + i + ' is dirty');
    var tile = this.tiles[i];
    var pixel_index = 0;
    var address = i << 5;
    for (var y = 0; y < TILE_SIZE; y++) {
      var address0 = this.VRAM[address++];
      var address1 = this.VRAM[address++];
      var address2 = this.VRAM[address++];
      var address3 = this.VRAM[address++];
      for (var bit = 128; bit != 0; bit >>= 1) {
        var colour = 0;
        if ((address0 & bit) != 0) {
          colour |= 1;
        }
        if ((address1 & bit) != 0) {
          colour |= 2;
        }
        if ((address2 & bit) != 0) {
          colour |= 4;
        }
        if ((address3 & bit) != 0) {
          colour |= 8;
        }
        tile[pixel_index++] = colour;
      }
    }
  }
  this.minDirty = TOTAL_TILES;
  this.maxDirty = -1;
}, decodeSat: function() {
  this.isSatDirty = false;
  for (var i = 0; i < this.lineSprites.length; i++) {
    this.lineSprites[i][SPRITE_COUNT] = 0;
  }
  var height = (this.vdpreg[1] & 2) == 0 ? 8 : 16;
  if ((this.vdpreg[1] & 1) == 1) {
    height <<= 1;
  }
  for (var spriteno = 0; spriteno < 64; spriteno++) {
    var y = this.VRAM[this.sat + spriteno] & 255;
    if (y == 208) {
      return;
    }
    y++;
    if (y > 240) {
      y -= 256;
    }
    for (var lineno = 0; lineno < SMS_HEIGHT; lineno++) {
      if (lineno >= y && lineno - y < height) {
        var sprites = this.lineSprites[lineno];
        if (sprites[SPRITE_COUNT] < SPRITES_PER_LINE) {
          var off = sprites[SPRITE_COUNT] * 3 + SPRITE_X;
          var address = this.sat + (spriteno << 1) + 128;
          sprites[off++] = this.VRAM[address++] & 255;
          sprites[off++] = y;
          sprites[off++] = this.VRAM[address] & 255;
          sprites[SPRITE_COUNT]++;
        }
      }
    }
  }
}, getState: function() {
  var state = new Array(3 + 16 + 32);
  state[0] = this.videoMode | this.status << 8 | (this.firstByte ? 1 << 16 : 0) | this.commandByte << 24;
  state[1] = this.location | this.operation << 16 | this.readBuffer << 24;
  state[2] = this.counter | this.vScrollLatch << 8 | this.line << 16;
  JSSMS.Utils.copyArrayElements(this.vdpreg, 0, state, 3, 16);
  JSSMS.Utils.copyArrayElements(this.CRAM, 0, state, 3 + 16, 32);
  return state;
}, setState: function(state) {
  var temp = state[0];
  this.videoMode = temp & 255;
  this.status = temp >> 8 & 255;
  this.firstByte = (temp >> 16 & 255) != 0;
  this.commandByte = temp >> 24 & 255;
  temp = state[1];
  this.location = temp & 65535;
  this.operation = temp >> 16 & 255;
  this.readBuffer = temp >> 24 & 255;
  temp = state[2];
  this.counter = temp & 255;
  this.vScrollLatch = temp >> 8 & 255;
  this.line = temp >> 16 & 65535;
  JSSMS.Utils.copyArrayElements(state, 3, this.vdpreg, 0, 16);
  JSSMS.Utils.copyArrayElements(state, 3 + 16, this.CRAM, 0, 32);
  this.forceFullRedraw();
}};
JSSMS.DummyUI = function(sms) {
  this.main = sms;
  this.enable = function() {
  };
  this.updateStatus = function() {
  };
  this.writeAudio = function() {
  };
  this.writeFrame = function() {
  }
};
if (typeof $ !== 'undefined') {
  $.fn.JSSMSUI = function(roms) {
    var parent = this;
    var UI = function(sms) {
      this.main = sms;
      var self = this;
      var root = $('<div></div>');
      var romContainer = $('<div class="roms"></div>');
      var controls = $('<div class="controls"></div>');
      var fullscreenSupport = JSSMS.Utils.getPrefix(['fullscreenEnabled', 'mozFullScreenEnabled', 'webkitCancelFullScreen']);
      this.hiddenPrefix = JSSMS.Utils.getPrefix(['hidden', 'mozHidden', 'webkitHidden', 'msHidden']);
      this.screen = $('<canvas width=' + SMS_WIDTH + ' height=' + SMS_HEIGHT + ' class="screen"></canvas>');
      this.canvasContext = this.screen[0].getContext('2d');
      if (!this.canvasContext.getImageData) {
        $(parent).html('<div class="alert-message error"><p><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest versions of Firefox, Google Chrome, Opera or Safari!</p></div>');
        return;
      }
      this.canvasImageData = this.canvasContext.getImageData(0, 0, SMS_WIDTH, SMS_HEIGHT);
      this.resetCanvas();
      this.romSelect = $('<select></select>').appendTo(romContainer);
      this.romSelect.change(function() {
        self.loadROM();
        self.buttons.start.removeAttr('disabled');
      });
      this.buttons = {start: $('<input type="button" value="Stop" class="btn" disabled="disabled">').appendTo(controls), restart: $('<input type="button" value="Restart" class="btn" disabled="disabled">').appendTo(controls), sound: $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').appendTo(controls), zoom: $('<input type="button" value="Zoom in" class="btn">').appendTo(controls)};
      if (fullscreenSupport) {
        $('<input type="button" value="Go fullscreen" class="btn">').appendTo(controls).click(function() {
          var screen = self.screen[0];
          if (screen.requestFullscreen) {
            screen.requestFullscreen();
          }else {
            if (screen.mozRequestFullScreen) {
              screen.mozRequestFullScreen();
            }else {
              screen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          }
        });
      }
      this.log = $('<div id="status"></div>');
      this.buttons.start.click(function() {
        if (!self.main.isRunning) {
          self.main.start();
          self.buttons.start.attr('value', 'Stop');
        }else {
          self.main.stop();
          self.updateStatus('Paused');
          self.buttons.start.attr('value', 'Start');
        }
      });
      this.buttons.restart.click(function() {
        if (!self.main.reloadRom()) {
          $(this).attr('disabled', 'disabled');
          return;
        }
        self.main.reset();
        self.main.vdp.forceFullRedraw();
        self.main.start();
      });
      this.buttons.sound.click(function() {
      });
      this.zoomed = false;
      this.buttons.zoom.click(function() {
        if (self.zoomed) {
          self.screen.animate({width: SMS_WIDTH + 'px', height: SMS_HEIGHT + 'px'}, function() {
            $(this).removeAttr('style');
          });
          self.buttons.zoom.attr('value', 'Zoom in');
        }else {
          self.screen.animate({width: SMS_WIDTH * 2 + 'px', height: SMS_HEIGHT * 2 + 'px'});
          self.buttons.zoom.attr('value', 'Zoom out');
        }
        self.zoomed = !self.zoomed;
      });
      this.screen.appendTo(root);
      romContainer.appendTo(root);
      controls.appendTo(root);
      this.log.appendTo(root);
      root.appendTo($(parent));
      if (typeof roms != 'undefined') {
        this.setRoms(roms);
      }
      $(document).bind('keydown', function(evt) {
        self.main.keyboard.keydown(evt);
      }).bind('keyup', function(evt) {
        self.main.keyboard.keyup(evt);
      });
    };
    UI.prototype = {reset: function() {
      this.screen[0].width = SMS_WIDTH;
      this.screen[0].height = SMS_HEIGHT;
      this.log.text('');
    }, resetCanvas: function() {
      this.canvasContext.fillStyle = 'black';
      this.canvasContext.fillRect(0, 0, SMS_WIDTH, SMS_HEIGHT);
      for (var i = 3; i <= this.canvasImageData.data.length - 3; i += 4) {
        this.canvasImageData.data[i] = 255;
      }
    }, setRoms: function(roms) {
      this.romSelect.children().remove();
      $('<option>Select a ROM...</option>').appendTo(this.romSelect);
      for (var groupName in roms) {
        if (roms.hasOwnProperty(groupName)) {
          var optgroup = $('<optgroup></optgroup>').attr('label', groupName);
          for (var i = 0; i < roms[groupName].length; i++) {
            $('<option>' + roms[groupName][i][0] + '</option>').attr('value', roms[groupName][i][1]).appendTo(optgroup);
          }
          this.romSelect.append(optgroup);
        }
      }
    }, loadROM: function() {
      var self = this;
      this.updateStatus('Downloading...');
      $.ajax({url: escape(this.romSelect.val()), xhr: function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhr.overrideMimeType !== 'undefined') {
          xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }
        self.xhr = xhr;
        return xhr;
      }, complete: function(xhr, status) {
        var i, data;
        data = xhr.responseText;
        self.main.readRomDirectly(data, self.romSelect.val());
        self.main.reset();
        self.main.vdp.forceFullRedraw();
        self.main.start();
        self.enable();
      }});
    }, enable: function() {
      this.buttons.restart.removeAttr('disabled');
      if (this.main.soundEnabled) {
        this.buttons.sound.attr('value', 'Disable sound');
      }else {
        this.buttons.sound.attr('value', 'Enable sound');
      }
    }, updateStatus: function(s) {
      this.log.text(s);
    }, writeFrame: function(buffer, prevBuffer) {
      if (this.hiddenPrefix && document[this.hiddenPrefix]) {
        return;
      }
      var imageData = this.canvasImageData.data;
      var pixel, i, j;
      for (i = 0; i <= SMS_WIDTH * SMS_HEIGHT; i++) {
        pixel = buffer[i];
        j = i * 4;
        imageData[j] = pixel & 255;
        imageData[j + 1] = pixel >> 8 & 255;
        imageData[j + 2] = pixel >> 16 & 255;
      }
      this.canvasContext.putImageData(this.canvasImageData, 0, 0);
    }};
    return UI;
  };
}
var IO_TR_DIRECTION = 0;
var IO_TH_DIRECTION = 1;
var IO_TR_OUTPUT = 2;
var IO_TH_OUTPUT = 3;
var IO_TH_INPUT = 4;
var PORT_A = 0;
var PORT_B = 5;
JSSMS.Ports = function(sms) {
  this.main = sms;
  this.vdp = sms.vdp;
  this.psg = sms.psg;
  this.keyboard = sms.keyboard;
  this.europe = 64;
  this.hCounter = 0;
  this.ioPorts = [];
};
JSSMS.Ports.prototype = {reset: function() {
  if (Setup.LIGHTGUN) {
    this.ioPorts = new Array(10);
    this.ioPorts[PORT_A + IO_TH_INPUT] = 1;
    this.ioPorts[PORT_B + IO_TH_INPUT] = 1;
  }else {
    this.ioPorts = new Array(2);
  }
}, out: function(port, value) {
  if (this.main.is_gg && port < 7) {
    return;
  }
  switch (port & 193) {
    case 1:
      if (Setup.LIGHTGUN) {
        this.oldTH = this.getTH(PORT_A) != 0 || this.getTH(PORT_B) != 0;
        this.writePort(PORT_A, value);
        this.writePort(PORT_B, value >> 2);
        if (!this.oldTH && (this.getTH(PORT_A) != 0 || this.getTH(PORT_B) != 0)) {
          this.hCounter = this.getHCount();
        }
      }else {
        this.ioPorts[0] = (value & 32) << 1;
        this.ioPorts[1] = value & 128;
        if (this.europe == 0) {
          this.ioPorts[0] = ~this.ioPorts[0];
          this.ioPorts[1] = ~this.ioPorts[1];
        }
      }
      break;
    case 128:
      this.vdp.dataWrite(value);
      break;
    case 129:
      this.vdp.controlWrite(value);
      break;
    case 64:
;
    case 65:
      if (this.main.soundEnabled) {
        this.psg.write(value);
      }
      break;
  }
}, in_: function(port) {
  if (this.main.is_gg && port < 7) {
    switch (port) {
      case 0:
        return this.keyboard.ggstart & 191 | this.europe;
      case 1:
;
      case 2:
;
      case 3:
;
      case 4:
;
      case 5:
        return 0;
      case 6:
        return 255;
    }
  }
  switch (port & 193) {
    case 64:
      return this.vdp.getVCount();
    case 65:
      return this.hCounter;
    case 128:
      return this.vdp.dataRead();
    case 129:
      return this.vdp.controlRead();
    case 192:
      return this.keyboard.controller1;
    case 193:
      if (Setup.LIGHTGUN) {
        if (this.keyboard.lightgunClick) {
          this.lightPhaserSync();
        }
        return this.keyboard.controller2 & 63 | (this.getTH(PORT_A) != 0 ? 64 : 0) | (this.getTH(PORT_B) != 0 ? 128 : 0);
      }else {
        return this.keyboard.controller2 & 63 | this.ioPorts[0] | this.ioPorts[1];
      }
  }
  return 255;
}, writePort: function(index, value) {
  this.ioPorts[index + IO_TR_DIRECTION] = value & 1;
  this.ioPorts[index + IO_TH_DIRECTION] = value & 2;
  this.ioPorts[index + IO_TR_OUTPUT] = value & 16;
  this.ioPorts[index + IO_TH_OUTPUT] = this.europe == 0 ? ~value & 32 : value & 32;
}, getTH: function(index) {
  return this.ioPorts[index + IO_TH_DIRECTION] == 0 ? this.ioPorts[index + IO_TH_OUTPUT] : this.ioPorts[index + IO_TH_INPUT];
}, setTH: function(index, on) {
  this.ioPorts[index + IO_TH_DIRECTION] = 1;
  this.ioPorts[index + IO_TH_INPUT] = on ? 1 : 0;
}, getHCount: function() {
  var pixels = Math.round(this.main.cpu.getCycle() * SMS_X_PIXELS / this.main.cyclesPerLine);
  var v = pixels - 8 >> 1;
  if (v > 147) {
    v += 233 - 148;
  }
  return v & 255;
}, X_RANGE: 48, Y_RANGE: 4, lightPhaserSync: function() {
  var oldTH = this.getTH(PORT_A);
  var hc = this.getHCount();
  var dx = this.keyboard.lightgunX - (hc << 1);
  var dy = this.keyboard.lightgunY - this.vdp.line;
  if (dy > -this.Y_RANGE && dy < this.Y_RANGE && dx > -this.X_RANGE && dx < this.X_RANGE) {
    this.setTH(PORT_A, false);
    if (oldTH != this.getTH(PORT_A)) {
      this.hCounter = 20 + (this.keyboard.lightgunX >> 1);
    }
  }else {
    this.setTH(PORT_A, true);
    if (oldTH != this.getTH(PORT_A)) {
      this.hCounter = hc;
    }
  }
}, setDomestic: function(value) {
  this.europe = value ? 64 : 0;
}, isDomestic: function() {
  return this.europe != 0;
}};

