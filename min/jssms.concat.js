/*
jsSMS - A Sega Master System/Game Gear emulator in JavaScript
Copyright (C) 2012-2013 Guillaume Marty (https://github.com/gmarty)
Based on JavaGear Copyright (c) 2002-2008 Chris White

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
'use strict';var DEBUG = false;
var ENABLE_DEBUGGER = false;
var ENABLE_COMPILER = true;
var WRITE_MODE = 0;
var READ_MODE = 1;
var ENABLE_SERVER_LOGGER = false;
var SYNC_MODE = READ_MODE;
var ACCURATE = false;
var LITTLE_ENDIAN = true;
var FORCE_TYPED_ARRAYS = false;
var SUPPORT_TYPED_ARRAYS = FORCE_TYPED_ARRAYS || "Uint8Array" in window;
var FORCE_DATAVIEW = false;
var SUPPORT_DATAVIEW = FORCE_DATAVIEW || "ArrayBuffer" in window && "DataView" in window;
var FORCE_DESTRUCTURING = false;
var SUPPORT_DESTRUCTURING = false;
var SAMPLE_RATE = 44100;
var DEBUG_TIMING = DEBUG;
var REFRESH_EMULATION = false;
var ACCURATE_INTERRUPT_EMULATION = false;
var LIGHTGUN = false;
var VDP_SPRITE_COLLISIONS = ACCURATE;
var PAGE_SIZE = 16384;
var fpsInterval = 500;
var CLOCK_NTSC = 3579545;
var CLOCK_PAL = 3546893;
function JSSMS(opts) {
  this.opts = {"ui":JSSMS.DummyUI};
  if (opts !== undefined) {
    var key;
    for (key in this.opts) {
      if (opts[key] !== undefined) {
        this.opts[key] = opts[key];
      }
    }
  }
  if (opts["DEBUG"] !== undefined) {
    DEBUG = opts["DEBUG"];
  }
  if (opts["ENABLE_COMPILER"] !== undefined) {
    ENABLE_COMPILER = opts["ENABLE_COMPILER"];
  }
  this.keyboard = new JSSMS.Keyboard(this);
  this.ui = new this.opts["ui"](this);
  this.vdp = new JSSMS.Vdp(this);
  this.psg = new JSSMS.SN76489(this);
  this.ports = new JSSMS.Ports(this);
  this.cpu = new JSSMS.Z80(this);
  this.ui.updateStatus("Ready to load a ROM.");
  if (this.soundEnabled) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext;
    this.audioBuffer = this.audioContext.createBuffer(1, 1, SAMPLE_RATE);
  }
  this["ui"] = this.ui;
}
JSSMS.prototype = {isRunning:false, cyclesPerLine:0, no_of_scanlines:0, frameSkip:0, throttle:true, fps:0, frameskip_counter:0, pause_button:false, is_sms:true, is_gg:false, soundEnabled:true, audioContext:null, audioBuffer:null, audioBufferOffset:0, samplesPerFrame:0, samplesPerLine:[], emuWidth:0, emuHeight:0, fpsFrameCount:0, z80Time:0, drawTime:0, z80TimeCounter:0, drawTimeCounter:0, frameCount:0, romData:"", romFileName:"", lineno:0, reset:function() {
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
}, start:function() {
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
  this.ui.updateStatus("Running");
}, stop:function() {
  if (DEBUG) {
    clearInterval(this.fpsInterval);
  }
  this.isRunning = false;
}, frame:function() {
  if (this.isRunning) {
    this.cpu.frame();
    this.fpsFrameCount++;
    this.ui.requestAnimationFrame(this.frame.bind(this), this.ui.screen);
  }
}, nextStep:function() {
  this.cpu.frame();
}, setSMS:function() {
  this.is_sms = true;
  this.is_gg = false;
  this.vdp.h_start = 0;
  this.vdp.h_end = 32;
  this.emuWidth = SMS_WIDTH;
  this.emuHeight = SMS_HEIGHT;
}, setGG:function() {
  this.is_gg = true;
  this.is_sms = false;
  this.vdp.h_start = 6;
  this.vdp.h_end = 26;
  this.emuWidth = GG_WIDTH;
  this.emuHeight = GG_HEIGHT;
}, setVideoTiming:function(mode) {
  var clockSpeedHz = 0, i, v;
  if (mode === NTSC || this.is_gg) {
    this.fps = 60;
    this.no_of_scanlines = SMS_Y_PIXELS_NTSC;
    clockSpeedHz = CLOCK_NTSC;
  } else {
    this.fps = 50;
    this.no_of_scanlines = SMS_Y_PIXELS_PAL;
    clockSpeedHz = CLOCK_PAL;
  }
  this.cyclesPerLine = Math.round(clockSpeedHz / this.fps / this.no_of_scanlines + 1);
  this.vdp.videoMode = mode;
  if (this.soundEnabled) {
    this.psg.init(clockSpeedHz);
    this.samplesPerFrame = Math.round(SAMPLE_RATE / this.fps);
    if (this.audioBuffer.length !== this.samplesPerFrame) {
      this.audioBuffer = this.audioContext.createBuffer(1, this.samplesPerFrame, SAMPLE_RATE);
    }
    if (this.samplesPerLine.length === 0 || this.samplesPerLine.length !== this.no_of_scanlines) {
      this.samplesPerLine = new Array(this.no_of_scanlines);
      var fractional = 0;
      for (i = 0;i < this.no_of_scanlines;i++) {
        v = (this.samplesPerFrame << 16) / this.no_of_scanlines + fractional;
        fractional = v - (v >> 16 << 16);
        this.samplesPerLine[i] = v >> 16;
      }
    }
  }
}, audioOutput:function(buffer) {
  this.ui.writeAudio(buffer);
}, doRepaint:function() {
  this.ui.writeFrame();
}, printFps:function() {
  var now = JSSMS.Utils.getTimestamp();
  var s = "Running: " + (this.fpsFrameCount / ((now - this.lastFpsTime) / 1E3)).toFixed(2) + " FPS";
  this.ui.updateStatus(s);
  this.fpsFrameCount = 0;
  this.lastFpsTime = now;
}, resetFps:function() {
  this.lastFpsTime = JSSMS.Utils.getTimestamp();
  this.fpsFrameCount = 0;
}, updateSound:function(line) {
  if (line === 0) {
    this.audioBufferOffset = 0;
  }
  var samplesToGenerate = this.samplesPerLine[line];
  this.psg.update(this.audioBuffer, this.audioBufferOffset, samplesToGenerate);
  this.audioBufferOffset += samplesToGenerate;
}, readRomDirectly:function(data, fileName) {
  var pages;
  var extension = JSSMS.Utils.getFileExtension(fileName);
  var size = data.length;
  if (extension === "gg") {
    this.setGG();
  } else {
    this.setSMS();
  }
  pages = this.loadROM(data, size);
  if (pages === null) {
    return false;
  }
  this.cpu.resetMemory(pages);
  this.romData = data;
  this.romFileName = fileName;
  return true;
}, loadROM:function(data, size) {
  var i, j;
  var number_of_pages = Math.ceil(size / PAGE_SIZE);
  var pages = new Array(number_of_pages);
  for (i = 0;i < number_of_pages;i++) {
    pages[i] = JSSMS.Utils.Array(PAGE_SIZE);
    if (SUPPORT_DATAVIEW) {
      for (j = 0;j < PAGE_SIZE;j++) {
        pages[i].setUint8(j, data.charCodeAt(i * PAGE_SIZE + j));
      }
    } else {
      for (j = 0;j < PAGE_SIZE;j++) {
        pages[i][j] = data.charCodeAt(i * PAGE_SIZE + j) & 255;
      }
    }
  }
  return pages;
}, reloadRom:function() {
  if (this.romData !== "" && this.romFileName !== "") {
    return this.readRomDirectly(this.romData, this.romFileName);
  } else {
    return false;
  }
}};
(function() {
  if (!("console" in window)) {
    window.console = {log:function() {
    }, error:function() {
    }};
  } else {
    if (!("bind" in window.console.log)) {
      window.console.log = function(fn) {
        return function(msg) {
          return fn(msg);
        };
      }(window.console.log);
      window.console.error = function(fn) {
        return function(msg) {
          return fn(msg);
        };
      }(window.console.error);
    }
  }
})();
JSSMS.Utils = {rndInt:function(range) {
  return Math.round(Math.random() * range);
}, Uint8Array:function() {
  if (SUPPORT_TYPED_ARRAYS) {
    return Uint8Array;
  } else {
    return Array;
  }
}(), Uint16Array:function() {
  if (SUPPORT_TYPED_ARRAYS) {
    return Uint16Array;
  } else {
    return Array;
  }
}(), Array:function() {
  if (SUPPORT_DATAVIEW) {
    return function(length) {
      return new DataView(new ArrayBuffer(length));
    };
  } else {
    return Array;
  }
}(), copyArrayElements:function() {
  if (SUPPORT_DATAVIEW) {
    return function(src, srcPos, dest, destPos, length) {
      while (length--) {
        dest.setInt8(destPos + length, src.getInt8(srcPos + length));
      }
    };
  } else {
    return function(src, srcPos, dest, destPos, length) {
      while (length--) {
        dest[destPos + length] = src[srcPos + length];
      }
    };
  }
}(), console:{log:function() {
  if (DEBUG) {
    return window.console.log.bind(window.console);
  }
  return function(var_args) {
  };
}(), error:function() {
  if (DEBUG) {
    return window.console.error.bind(window.console);
  }
  return function(var_args) {
  };
}(), time:function() {
  if (DEBUG && window.console.time) {
    return window.console.time.bind(window.console);
  }
  return function(label) {
  };
}(), timeEnd:function() {
  if (DEBUG && window.console.timeEnd) {
    return window.console.timeEnd.bind(window.console);
  }
  return function(label) {
  };
}()}, traverse:function(object, fn) {
  var key, child;
  fn.call(null, object);
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      child = object[key];
      if (Object(child) === child) {
        object[key] = JSSMS.Utils.traverse(child, fn);
      }
    }
  }
  return object;
}, getTimestamp:function() {
  if (window.performance && window.performance.now) {
    return window.performance.now.bind(window.performance);
  } else {
    return function() {
      return (new Date).getTime();
    };
  }
}(), toHex:function(dec) {
  var minus = dec < 0;
  var hex = Math.abs(dec).toString(16).toUpperCase();
  if (hex.length % 2) {
    hex = "0" + hex;
  }
  if (minus) {
    return "-0x" + hex;
  }
  return "0x" + hex;
}, getPrefix:function(arr, obj) {
  var prefix = false;
  if (obj === undefined) {
    obj = document;
  }
  arr.some(function(prop) {
    if (prop in obj) {
      prefix = prop;
      return true;
    }
    return false;
  });
  return prefix;
}, getFileExtension:function(fileName) {
  if (typeof fileName !== "string") {
    return "";
  }
  return fileName.split(".").pop().toLowerCase();
}, getFileName:function(fileName) {
  if (typeof fileName !== "string") {
    return "";
  }
  var parts = fileName.split(".");
  parts.pop();
  return parts.join(".").split("/").pop();
}, crc32:function(str) {
  var crcTable = function makeCRCTable() {
    var c = 0;
    var crcTable = new Uint32Array(256);
    for (var n = 0;n < 256;n++) {
      c = n;
      for (var k = 0;k < 8;k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      crcTable[n] = c;
    }
    return crcTable;
  }();
  this.crc32 = function(str) {
    var crc = 0 ^ -1;
    for (var i = 0;i < str.length;i++) {
      crc = crc >>> 8 ^ crcTable[(crc ^ str.charCodeAt(i)) & 255];
    }
    return (crc ^ -1) >>> 0;
  };
  return this.crc32(str);
}, isIE:function() {
  return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}};
var LOG_LENGTH = 100;
function BinaryRequest(method, url, args, data, cb) {
  method = method || "GET";
  var alwaysCallbacks = [];
  if (args) {
    var arg_str = [];
    var i;
    for (i in args) {
      var arg = encodeURI(i);
      if (args[i] !== undefined) {
        arg += "=" + encodeURI(args[i]);
      }
      arg_str.push(arg);
    }
    url += "?" + arg_str.join("&");
  }
  function invokeAlways() {
    var i;
    for (i = 0;i < alwaysCallbacks.length;++i) {
      alwaysCallbacks[i]();
    }
  }
  var xhr = new XMLHttpRequest;
  xhr.open(method, url, true);
  try {
    xhr.responseType = "arraybuffer";
  } catch (e) {
    console.error("responseType arrayBuffer not supported!");
  }
  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      invokeAlways();
    }
  };
  xhr.onload = function onload() {
    if (this.response instanceof ArrayBuffer) {
      cb(this.response);
    } else {
      console.error("Bad response type: " + typeof this.response + " for " + JSON.stringify(this.response));
    }
  };
  xhr.send(data);
  this.always = function(cb) {
    if (xhr.readyState === 4) {
      cb();
    }
    alwaysCallbacks.push(cb);
    return this;
  };
}
function SyncWriter() {
  this.kBufferLength = 1024 * 1024 / 2;
  this.syncBuffer = new Uint16Array(this.kBufferLength);
  this.syncBufferIdx = 0;
  this.fileOffset = 0;
  this.curRequest = null;
  this.buffers = [];
}
SyncWriter.prototype = {flushBuffer:function() {
  if (this.syncBufferIdx >= this.syncBuffer.length) {
    this.buffers.push(this.syncBuffer);
    this.syncBuffer = new Uint16Array(this.kBufferLength);
    this.syncBufferIdx = 0;
  }
}, tick:function() {
  if (!this.curRequest && this.syncBufferIdx > 0) {
    var b = new Uint16Array(this.syncBufferIdx);
    for (var i = 0;i < this.syncBufferIdx;++i) {
      b[i] = this.syncBuffer[i];
    }
    this.buffers.push(b);
    this.syncBuffer = new Uint16Array(this.kBufferLength);
    this.syncBufferIdx = 0;
  }
  if (!this.curRequest && this.buffers.length > 0) {
    var self = this;
    var buffer = this.buffers[0];
    this.buffers.splice(0, 1);
    var bytes = buffer.length * 2;
    this.curRequest = (new BinaryRequest("POST", "/wsynclog", {o:this.fileOffset, l:bytes}, buffer, function() {
      self.fileOffset += bytes;
    })).always(function() {
      self.curRequest = null;
    });
  }
  return this.buffers.length === 0;
}, getAvailableBytes:function() {
  return 1E9;
}, sync16:function(val, name) {
  if (this.syncBufferIdx >= this.syncBuffer.length) {
    this.flushBuffer();
  }
  this.syncBuffer[this.syncBufferIdx] = val;
  this.syncBufferIdx++;
}, reflect16:function(val) {
  if (this.syncBufferIdx >= this.syncBuffer.length) {
    this.flushBuffer();
  }
  this.syncBuffer[this.syncBufferIdx] = val;
  this.syncBufferIdx++;
  return val;
}};
function SyncReader() {
  this.kBufferLength = 1024 * 1024;
  this.syncBuffer = null;
  this.syncBufferIdx = 0;
  this.fileOffset = 0;
  this.curRequest = null;
  this.oos = false;
  this.nextBuffer = null;
  this.log = new Array(LOG_LENGTH);
}
SyncReader.prototype = {refill:function() {
  if (!this.syncBuffer || this.syncBufferIdx >= this.syncBuffer.length) {
    this.syncBuffer = this.nextBuffer;
    this.syncBufferIdx = 0;
    this.nextBuffer = null;
  }
}, tick:function() {
  this.refill();
  if (!this.nextBuffer && !this.curRequest) {
    var self = this;
    this.curRequest = (new BinaryRequest("GET", "/rsynclog", {o:this.fileOffset, l:this.kBufferLength}, undefined, function(result) {
      self.nextBuffer = new Uint16Array(result);
      self.fileOffset += result.byteLength;
    })).always(function() {
      self.curRequest = null;
    });
    return false;
  }
  return true;
}, getAvailableBytes:function() {
  var ops = 0;
  if (this.syncBuffer) {
    ops += this.syncBuffer.length - this.syncBufferIdx;
  }
  if (this.nextBuffer) {
    ops += this.nextBuffer.length;
  }
  return ops * 2;
}, pop:function() {
  if (!this.syncBuffer || this.syncBufferIdx >= this.syncBuffer.length) {
    this.refill();
  }
  if (this.syncBuffer && this.syncBufferIdx < this.syncBuffer.length) {
    var r = this.syncBuffer[this.syncBufferIdx];
    this.syncBufferIdx++;
    return r;
  }
  return -1;
}, sync16:function(val, name) {
  if (this.oos) {
    return;
  }
  var toHex = JSSMS.Utils.toHex;
  var writtenVal = this.pop();
  if (val === writtenVal) {
    this.log.shift();
    this.log.push([name, toHex(val), toHex(writtenVal)]);
  } else {
    this.log.forEach(function(log) {
      console.log.apply(console, log);
    });
    this.log = new Array(LOG_LENGTH);
    console.log("%c" + name, "color: red;", toHex(val), toHex(writtenVal));
    if (name === "pc") {
      debugger;
    }
  }
}, reflect16:function(val) {
  if (this.oos) {
    return val;
  }
  return this.pop();
}};
var HALT_SPEEDUP = true;
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
var OP_STATES = new JSSMS.Utils.Uint8Array([4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 
4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11]);
var OP_CB_STATES = new JSSMS.Utils.Uint8Array([8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 
8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8]);
var OP_DD_STATES = new JSSMS.Utils.Uint8Array([4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 
19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4]);
var OP_INDEX_CB_STATES = new JSSMS.Utils.Uint8Array([23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 
20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23]);
var OP_ED_STATES = new JSSMS.Utils.Uint8Array([8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]);
JSSMS.Z80 = function(sms) {
  this.main = sms;
  this.vdp = sms.vdp;
  this.psg = sms.psg;
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
  this.sram = JSSMS.Utils.Array(32768);
  this.useSRAM = false;
  this.frameReg = new Array(4);
  this.romPageMask = 0;
  this.number_of_pages = 0;
  this.memWriteMap = JSSMS.Utils.Array(8192);
  this.DAA_TABLE = new JSSMS.Utils.Uint16Array(2048);
  this.SZ_TABLE = new JSSMS.Utils.Uint8Array(256);
  this.SZP_TABLE = new JSSMS.Utils.Uint8Array(256);
  this.SZHV_INC_TABLE = new JSSMS.Utils.Uint8Array(256);
  this.SZHV_DEC_TABLE = new JSSMS.Utils.Uint8Array(256);
  this.SZHVC_ADD_TABLE = new JSSMS.Utils.Uint8Array(2 * 256 * 256);
  this.SZHVC_SUB_TABLE = new JSSMS.Utils.Uint8Array(2 * 256 * 256);
  this.SZ_BIT_TABLE = new JSSMS.Utils.Uint8Array(256);
  this.generateFlagTables();
  this.generateDAATable();
  this.generateMemory();
  if (ENABLE_DEBUGGER) {
    for (var method in JSSMS.Debugger.prototype) {
      this[method] = JSSMS.Debugger.prototype[method];
    }
  }
  if (ENABLE_COMPILER) {
    this.recompiler = new Recompiler(this);
  }
  if (ENABLE_SERVER_LOGGER) {
    if (SYNC_MODE === WRITE_MODE) {
      this.syncServer = new SyncWriter;
    } else {
      this.syncServer = new SyncReader;
    }
    this.syncServer.tick();
    this.sync = function() {
      this.syncServer.sync16(this.pc, "pc");
    };
  }
};
JSSMS.Z80.prototype = {reset:function() {
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
  this.totalCycles = 0;
  this.tstates = 0;
  this.im = 0;
  this.iff1 = false;
  this.iff2 = false;
  this.EI_inst = false;
  this.interruptVector = 0;
  this.halt = false;
  if (ENABLE_COMPILER) {
    this.recompiler.reset();
  }
}, frame:function() {
  this.lineno = 0;
  this.tstates += this.main.cyclesPerLine;
  this.totalCycles = this.main.cyclesPerLine;
  if (ACCURATE_INTERRUPT_EMULATION) {
    if (this.interruptLine) {
      this.interrupt();
    }
  }
  while (true) {
    if (ENABLE_DEBUGGER) {
      this.main.ui.updateDisassembly(this.pc);
    }
    if (ENABLE_COMPILER) {
      this.recompile();
    } else {
      if (ENABLE_SERVER_LOGGER) {
        this.sync();
      }
      this.interpret();
    }
    if (this.tstates <= 0) {
      if (this.eol()) {
        break;
      }
    }
  }
  if (ENABLE_SERVER_LOGGER) {
    this.syncServer.tick();
  }
}, recompile:function() {
  if (this.pc < 1024) {
    if (!this.branches[0]["_" + this.pc]) {
      this.recompiler.recompileFromAddress(this.pc, 0, 0);
    }
    this.branches[0]["_" + this.pc].call(this, 0);
    return;
  } else {
    if (this.pc < 49152) {
      var frameId = this.pc % 16384;
      var frameReg = Math.floor(this.pc / 16384);
      if (!this.branches[this.frameReg[frameReg]]["_" + frameId]) {
        this.recompiler.recompileFromAddress(this.pc, this.frameReg[frameReg], frameReg);
      }
      this.branches[this.frameReg[frameReg]]["_" + frameId].call(this, frameReg);
      return;
    }
  }
  this.interpret();
}, eol:function() {
  if (this.main.soundEnabled) {
    this.main.updateSound(this.lineno);
  }
  this.vdp.line = this.lineno;
  if (this.lineno < 192) {
    this.vdp.drawLine(this.lineno);
  }
  this.vdp.interrupts(this.lineno);
  if (this.interruptLine) {
    this.interrupt();
  }
  this.lineno++;
  if (this.lineno >= this.main.no_of_scanlines) {
    this.eof();
    return true;
  }
  this.tstates += this.main.cyclesPerLine;
  this.totalCycles = this.main.cyclesPerLine;
  return false;
}, eof:function() {
  if (this.main.soundEnabled) {
    this.main.audioOutput(this.main.audioBuffer);
  }
  if (this.main.pause_button) {
    this.nmi();
    this.main.pause_button = false;
  }
  this.main.doRepaint();
}, branches:[Object.create(null), Object.create(null), Object.create(null)], interpret:function() {
  var temp = 0;
  var opcode = this.getUint8(this.pc++);
  if (ACCURATE_INTERRUPT_EMULATION) {
    this.EI_inst = false;
  }
  this.tstates -= OP_STATES[opcode];
  if (REFRESH_EMULATION) {
    this.incR();
  }
  switch(opcode) {
    case 0:
      break;
    case 1:
      this.setBC(this.getUint16(this.pc++));
      this.pc++;
      break;
    case 2:
      this.setUint8(this.getBC(), this.a);
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
      this.b = this.getUint8(this.pc++);
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
      this.a = this.getUint8(this.getBC());
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
      this.c = this.getUint8(this.pc++);
      break;
    case 15:
      this.rrca_a();
      break;
    case 16:
      this.b = this.b - 1 & 255;
      this.jr(this.b !== 0);
      break;
    case 17:
      this.setDE(this.getUint16(this.pc++));
      this.pc++;
      break;
    case 18:
      this.setUint8(this.getDE(), this.a);
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
      this.d = this.getUint8(this.pc++);
      break;
    case 23:
      this.rla_a();
      break;
    case 24:
      this.pc += this.getInt8(this.pc);
      break;
    case 25:
      this.setHL(this.add16(this.getHL(), this.getDE()));
      break;
    case 26:
      this.a = this.getUint8(this.getDE());
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
      this.e = this.getUint8(this.pc++);
      break;
    case 31:
      this.rra_a();
      break;
    case 32:
      this.jr(!((this.f & F_ZERO) !== 0));
      break;
    case 33:
      this.setHL(this.getUint16(this.pc++));
      this.pc++;
      break;
    case 34:
      this.setUint16(this.getUint16(this.pc++), this.getHL());
      this.pc++;
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
      this.h = this.getUint8(this.pc++);
      break;
    case 39:
      this.daa();
      break;
    case 40:
      this.jr((this.f & F_ZERO) !== 0);
      break;
    case 41:
      this.setHL(this.add16(this.getHL(), this.getHL()));
      break;
    case 42:
      this.setHL(this.getUint16(this.getUint16(this.pc++)));
      this.pc++;
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
      this.l = this.getUint8(this.pc++);
      break;
    case 47:
      this.cpl_a();
      break;
    case 48:
      this.jr(!((this.f & F_CARRY) !== 0));
      break;
    case 49:
      this.sp = this.getUint16(this.pc++);
      this.pc++;
      break;
    case 50:
      this.setUint8(this.getUint16(this.pc++), this.a);
      this.pc++;
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
      this.setUint8(this.getHL(), this.getUint8(this.pc++));
      break;
    case 55:
      this.f |= F_CARRY;
      this.f &= ~F_NEGATIVE;
      this.f &= ~F_HALFCARRY;
      break;
    case 56:
      this.jr((this.f & F_CARRY) !== 0);
      break;
    case 57:
      this.setHL(this.add16(this.getHL(), this.sp));
      break;
    case 58:
      this.a = this.getUint8(this.getUint16(this.pc++));
      this.pc++;
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
      this.a = this.getUint8(this.pc++);
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
      this.b = this.getUint8(this.getHL());
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
      this.c = this.getUint8(this.getHL());
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
      this.d = this.getUint8(this.getHL());
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
      this.e = this.getUint8(this.getHL());
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
      this.h = this.getUint8(this.getHL());
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
      this.l = this.getUint8(this.getHL());
      break;
    case 111:
      this.l = this.a;
      break;
    case 112:
      this.setUint8(this.getHL(), this.b);
      break;
    case 113:
      this.setUint8(this.getHL(), this.c);
      break;
    case 114:
      this.setUint8(this.getHL(), this.d);
      break;
    case 115:
      this.setUint8(this.getHL(), this.e);
      break;
    case 116:
      this.setUint8(this.getHL(), this.h);
      break;
    case 117:
      this.setUint8(this.getHL(), this.l);
      break;
    case 118:
      if (HALT_SPEEDUP) {
        this.tstates = 0;
      }
      this.halt = true;
      this.pc--;
      break;
    case 119:
      this.setUint8(this.getHL(), this.a);
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
      this.a = this.getUint8(this.getHL());
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
      this.add_a(this.getUint8(this.getHL()));
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
      this.adc_a(this.getUint8(this.getHL()));
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
      this.sub_a(this.getUint8(this.getHL()));
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
      this.sbc_a(this.getUint8(this.getHL()));
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
      this.f = this.SZP_TABLE[this.a &= this.getUint8(this.getHL())] | F_HALFCARRY;
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
      this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.getHL())];
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
      this.f = this.SZP_TABLE[this.a |= this.getUint8(this.getHL())];
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
      this.cp_a(this.getUint8(this.getHL()));
      break;
    case 191:
      this.cp_a(this.a);
      break;
    case 192:
      this.ret((this.f & F_ZERO) === 0);
      break;
    case 193:
      this.setBC(this.getUint16(this.sp));
      this.sp += 2;
      break;
    case 194:
      this.jp((this.f & F_ZERO) === 0);
      break;
    case 195:
      this.pc = this.getUint16(this.pc);
      break;
    case 196:
      this.call((this.f & F_ZERO) === 0);
      break;
    case 197:
      this.push(this.getBC());
      break;
    case 198:
      this.add_a(this.getUint8(this.pc++));
      break;
    case 199:
      this.push(this.pc);
      this.pc = 0;
      break;
    case 200:
      this.ret((this.f & F_ZERO) !== 0);
      break;
    case 201:
      this.pc = this.getUint16(this.sp);
      this.sp += 2;
      break;
    case 202:
      this.jp((this.f & F_ZERO) !== 0);
      break;
    case 203:
      this.doCB(this.getUint8(this.pc++));
      break;
    case 204:
      this.call((this.f & F_ZERO) !== 0);
      break;
    case 205:
      this.push(this.pc + 2);
      this.pc = this.getUint16(this.pc);
      break;
    case 206:
      this.adc_a(this.getUint8(this.pc++));
      break;
    case 207:
      this.push(this.pc);
      this.pc = 8;
      break;
    case 208:
      this.ret((this.f & F_CARRY) === 0);
      break;
    case 209:
      this.setDE(this.getUint16(this.sp));
      this.sp += 2;
      break;
    case 210:
      this.jp((this.f & F_CARRY) === 0);
      break;
    case 211:
      this.port.out(this.getUint8(this.pc++), this.a);
      break;
    case 212:
      this.call((this.f & F_CARRY) === 0);
      break;
    case 213:
      this.push(this.getDE());
      break;
    case 214:
      this.sub_a(this.getUint8(this.pc++));
      break;
    case 215:
      this.push(this.pc);
      this.pc = 16;
      break;
    case 216:
      this.ret((this.f & F_CARRY) !== 0);
      break;
    case 217:
      this.exBC();
      this.exDE();
      this.exHL();
      break;
    case 218:
      this.jp((this.f & F_CARRY) !== 0);
      break;
    case 219:
      this.a = this.port.in_(this.getUint8(this.pc++));
      break;
    case 220:
      this.call((this.f & F_CARRY) !== 0);
      break;
    case 221:
      this.doIndexOpIX(this.getUint8(this.pc++));
      break;
    case 222:
      this.sbc_a(this.getUint8(this.pc++));
      break;
    case 223:
      this.push(this.pc);
      this.pc = 24;
      break;
    case 224:
      this.ret((this.f & F_PARITY) === 0);
      break;
    case 225:
      this.setHL(this.getUint16(this.sp));
      this.sp += 2;
      break;
    case 226:
      this.jp((this.f & F_PARITY) === 0);
      break;
    case 227:
      temp = this.getHL();
      this.setHL(this.getUint16(this.sp));
      this.setUint16(this.sp, temp);
      break;
    case 228:
      this.call((this.f & F_PARITY) === 0);
      break;
    case 229:
      this.push(this.getHL());
      break;
    case 230:
      this.f = this.SZP_TABLE[this.a &= this.getUint8(this.pc++)] | F_HALFCARRY;
      break;
    case 231:
      this.push(this.pc);
      this.pc = 32;
      break;
    case 232:
      this.ret((this.f & F_PARITY) !== 0);
      break;
    case 233:
      this.pc = this.getHL();
      break;
    case 234:
      this.jp((this.f & F_PARITY) !== 0);
      break;
    case 235:
      temp = this.d;
      this.d = this.h;
      this.h = temp;
      temp = this.e;
      this.e = this.l;
      this.l = temp;
      break;
    case 236:
      this.call((this.f & F_PARITY) !== 0);
      break;
    case 237:
      this.doED(this.getUint8(this.pc));
      break;
    case 238:
      this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.pc++)];
      break;
    case 239:
      this.push(this.pc);
      this.pc = 40;
      break;
    case 240:
      this.ret((this.f & F_SIGN) === 0);
      break;
    case 241:
      this.setAF(this.getUint16(this.sp));
      this.sp += 2;
      break;
    case 242:
      this.jp((this.f & F_SIGN) === 0);
      break;
    case 243:
      this.iff1 = this.iff2 = false;
      this.EI_inst = true;
      break;
    case 244:
      this.call((this.f & F_SIGN) === 0);
      break;
    case 245:
      this.push(this.getAF());
      break;
    case 246:
      this.f = this.SZP_TABLE[this.a |= this.getUint8(this.pc++)];
      break;
    case 247:
      this.push(this.pc);
      this.pc = 48;
      break;
    case 248:
      this.ret((this.f & F_SIGN) !== 0);
      break;
    case 249:
      this.sp = this.getHL();
      break;
    case 250:
      this.jp((this.f & F_SIGN) !== 0);
      break;
    case 251:
      this.iff1 = this.iff2 = this.EI_inst = true;
      break;
    case 252:
      this.call((this.f & F_SIGN) !== 0);
      break;
    case 253:
      this.doIndexOpIY(this.getUint8(this.pc++));
      break;
    case 254:
      this.cp_a(this.getUint8(this.pc++));
      break;
    case 255:
      this.push(this.pc);
      this.pc = 56;
      break;
  }
}, getCycle:function() {
  return this.totalCycles - this.tstates;
}, nmi:function() {
  this.iff2 = this.iff1;
  this.iff1 = false;
  if (REFRESH_EMULATION) {
    this.incR();
  }
  if (this.halt) {
    this.pc++;
    this.halt = false;
  }
  this.push(this.pc);
  this.pc = 102;
  this.tstates -= 11;
}, interrupt:function() {
  if (!this.iff1 || ACCURATE_INTERRUPT_EMULATION && this.EI_inst) {
    return;
  }
  if (this.halt) {
    this.pc++;
    this.halt = false;
  }
  if (REFRESH_EMULATION) {
    this.incR();
  }
  this.iff1 = this.iff2 = false;
  this.interruptLine = false;
  this.push(this.pc);
  if (this.im === 0) {
    this.pc = this.interruptVector === 0 || this.interruptVector === 255 ? 56 : this.interruptVector;
    this.tstates -= 13;
  } else {
    if (this.im === 1) {
      this.pc = 56;
      this.tstates -= 13;
    } else {
      this.pc = this.getUint16((this.i << 8) + this.interruptVector);
      this.tstates -= 19;
    }
  }
}, jp:function(condition) {
  if (condition) {
    this.pc = this.getUint16(this.pc);
  } else {
    this.pc += 2;
  }
}, jr:function(condition) {
  if (condition) {
    this.pc += this.getInt8(this.pc);
    this.tstates -= 5;
  } else {
    this.pc++;
  }
}, call:function(condition) {
  if (condition) {
    this.push(this.pc + 2);
    this.pc = this.getUint16(this.pc);
    this.tstates -= 7;
  } else {
    this.pc += 2;
  }
}, ret:function(condition) {
  if (condition) {
    this.pc = this.getUint16(this.sp);
    this.sp += 2;
    this.tstates -= 6;
  }
}, push:function(value) {
  this.sp -= 2;
  this.setUint16(this.sp, value);
}, pushUint8:function(hi, lo) {
  this.sp -= 2;
  this.setUint16(this.sp, hi << 8 | lo);
}, incMem:function(offset) {
  this.setUint8(offset, this.inc8(this.getUint8(offset)));
}, decMem:function(offset) {
  this.setUint8(offset, this.dec8(this.getUint8(offset)));
}, ccf:function() {
  if ((this.f & F_CARRY) !== 0) {
    this.f &= ~F_CARRY;
    this.f |= F_HALFCARRY;
  } else {
    this.f |= F_CARRY;
    this.f &= ~F_HALFCARRY;
  }
  this.f &= ~F_NEGATIVE;
}, daa:function() {
  var temp = this.DAA_TABLE[this.a | (this.f & F_CARRY) << 8 | (this.f & F_NEGATIVE) << 8 | (this.f & F_HALFCARRY) << 6];
  this.a = temp & 255;
  this.f = this.f & F_NEGATIVE | temp >> 8;
}, doCB:function(opcode) {
  this.tstates -= OP_CB_STATES[opcode];
  if (REFRESH_EMULATION) {
    this.incR();
  }
  switch(opcode) {
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
      this.setUint8(this.getHL(), this.rlc(this.getUint8(this.getHL())));
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
      this.setUint8(this.getHL(), this.rrc(this.getUint8(this.getHL())));
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
      this.setUint8(this.getHL(), this.rl(this.getUint8(this.getHL())));
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
      this.setUint8(this.getHL(), this.rr(this.getUint8(this.getHL())));
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
      this.setUint8(this.getHL(), this.sla(this.getUint8(this.getHL())));
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
      this.setUint8(this.getHL(), this.sra(this.getUint8(this.getHL())));
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
      this.setUint8(this.getHL(), this.sll(this.getUint8(this.getHL())));
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
      this.l = this.srl(this.l);
      break;
    case 62:
      this.setUint8(this.getHL(), this.srl(this.getUint8(this.getHL())));
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
      this.bit(this.getUint8(this.getHL()) & BIT_0);
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
      this.bit(this.getUint8(this.getHL()) & BIT_1);
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
      this.bit(this.getUint8(this.getHL()) & BIT_2);
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
      this.bit(this.getUint8(this.getHL()) & BIT_3);
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
      this.bit(this.getUint8(this.getHL()) & BIT_4);
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
      this.bit(this.getUint8(this.getHL()) & BIT_5);
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
      this.bit(this.getUint8(this.getHL()) & BIT_6);
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
      this.bit(this.getUint8(this.getHL()) & BIT_7);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_0);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_1);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_2);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_3);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_4);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_5);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_6);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_7);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_0);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_1);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_2);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_3);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_4);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_5);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_6);
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
      this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_7);
      break;
    case 255:
      this.a |= BIT_7;
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented CB Opcode: " + JSSMS.Utils.toHex(opcode));
      break;
  }
}, rlc:function(value) {
  var carry = (value & 128) >> 7;
  value = (value << 1 | value >> 7) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, rrc:function(value) {
  var carry = value & 1;
  value = (value >> 1 | value << 7) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, rl:function(value) {
  var carry = (value & 128) >> 7;
  value = (value << 1 | this.f & F_CARRY) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, rr:function(value) {
  var carry = value & 1;
  value = (value >> 1 | this.f << 7) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, sla:function(value) {
  var carry = (value & 128) >> 7;
  value = value << 1 & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, sll:function(value) {
  var carry = (value & 128) >> 7;
  value = (value << 1 | 1) & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, sra:function(value) {
  var carry = value & 1;
  value = value >> 1 | value & 128;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, srl:function(value) {
  var carry = value & 1;
  value = value >> 1 & 255;
  this.f = carry | this.SZP_TABLE[value];
  return value;
}, bit:function(mask) {
  this.f = this.f & F_CARRY | this.SZ_BIT_TABLE[mask];
}, doIndexOpIX:function(opcode) {
  var temp = 0;
  this.tstates -= OP_DD_STATES[opcode];
  if (REFRESH_EMULATION) {
    this.incR();
  }
  switch(opcode) {
    case 9:
      this.setIXHIXL(this.add16(this.getIXHIXL(), this.getBC()));
      break;
    case 25:
      this.setIXHIXL(this.add16(this.getIXHIXL(), this.getDE()));
      break;
    case 33:
      this.setIXHIXL(this.getUint16(this.pc++));
      this.pc++;
      break;
    case 34:
      this.setUint16(this.getUint16(this.pc++), this.getIXHIXL());
      this.pc++;
      break;
    case 35:
      this.incIXHIXL();
      break;
    case 36:
      this.ixH = this.inc8(this.ixH);
      break;
    case 37:
      this.ixH = this.dec8(this.ixH);
      break;
    case 38:
      this.ixH = this.getUint8(this.pc++);
      break;
    case 41:
      this.setIXHIXL(this.add16(this.getIXHIXL(), this.getIXHIXL()));
      break;
    case 42:
      this.setIXHIXL(this.getUint16(this.getUint16(this.pc++)));
      this.pc++;
      break;
    case 43:
      this.decIXHIXL();
      break;
    case 44:
      this.ixL = this.inc8(this.ixL);
      break;
    case 45:
      this.ixL = this.dec8(this.ixL);
      break;
    case 46:
      this.ixL = this.getUint8(this.pc++);
      break;
    case 52:
      this.incMem(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 53:
      this.decMem(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 54:
      this.setUint8(this.getIXHIXL() + this.d_(), this.getUint8(++this.pc));
      this.pc++;
      break;
    case 57:
      this.setIXHIXL(this.add16(this.getIXHIXL(), this.sp));
      break;
    case 68:
      this.b = this.ixH;
      break;
    case 69:
      this.b = this.ixL;
      break;
    case 70:
      this.b = this.getUint8(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 76:
      this.c = this.ixH;
      break;
    case 77:
      this.c = this.ixL;
      break;
    case 78:
      this.c = this.getUint8(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 84:
      this.d = this.ixH;
      break;
    case 85:
      this.d = this.ixL;
      break;
    case 86:
      this.d = this.getUint8(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 92:
      this.e = this.ixH;
      break;
    case 93:
      this.e = this.ixL;
      break;
    case 94:
      this.e = this.getUint8(this.getIXHIXL() + this.d_());
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
      this.h = this.getUint8(this.getIXHIXL() + this.d_());
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
      this.l = this.getUint8(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 111:
      this.ixL = this.a;
      break;
    case 112:
      this.setUint8(this.getIXHIXL() + this.d_(), this.b);
      this.pc++;
      break;
    case 113:
      this.setUint8(this.getIXHIXL() + this.d_(), this.c);
      this.pc++;
      break;
    case 114:
      this.setUint8(this.getIXHIXL() + this.d_(), this.d);
      this.pc++;
      break;
    case 115:
      this.setUint8(this.getIXHIXL() + this.d_(), this.e);
      this.pc++;
      break;
    case 116:
      this.setUint8(this.getIXHIXL() + this.d_(), this.h);
      this.pc++;
      break;
    case 117:
      this.setUint8(this.getIXHIXL() + this.d_(), this.l);
      this.pc++;
      break;
    case 119:
      this.setUint8(this.getIXHIXL() + this.d_(), this.a);
      this.pc++;
      break;
    case 124:
      this.a = this.ixH;
      break;
    case 125:
      this.a = this.ixL;
      break;
    case 126:
      this.a = this.getUint8(this.getIXHIXL() + this.d_());
      this.pc++;
      break;
    case 132:
      this.add_a(this.ixH);
      break;
    case 133:
      this.add_a(this.ixL);
      break;
    case 134:
      this.add_a(this.getUint8(this.getIXHIXL() + this.d_()));
      this.pc++;
      break;
    case 140:
      this.adc_a(this.ixH);
      break;
    case 141:
      this.adc_a(this.ixL);
      break;
    case 142:
      this.adc_a(this.getUint8(this.getIXHIXL() + this.d_()));
      this.pc++;
      break;
    case 148:
      this.sub_a(this.ixH);
      break;
    case 149:
      this.sub_a(this.ixL);
      break;
    case 150:
      this.sub_a(this.getUint8(this.getIXHIXL() + this.d_()));
      this.pc++;
      break;
    case 156:
      this.sbc_a(this.ixH);
      break;
    case 157:
      this.sbc_a(this.ixL);
      break;
    case 158:
      this.sbc_a(this.getUint8(this.getIXHIXL() + this.d_()));
      this.pc++;
      break;
    case 164:
      this.f = this.SZP_TABLE[this.a &= this.ixH] | F_HALFCARRY;
      break;
    case 165:
      this.f = this.SZP_TABLE[this.a &= this.ixL] | F_HALFCARRY;
      break;
    case 166:
      this.f = this.SZP_TABLE[this.a &= this.getUint8(this.getIXHIXL() + this.d_())] | F_HALFCARRY;
      this.pc++;
      break;
    case 172:
      this.f = this.SZP_TABLE[this.a ^= this.ixH];
      break;
    case 173:
      this.f = this.SZP_TABLE[this.a ^= this.ixL];
      break;
    case 174:
      this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.getIXHIXL() + this.d_())];
      this.pc++;
      break;
    case 180:
      this.f = this.SZP_TABLE[this.a |= this.ixH];
      break;
    case 181:
      this.f = this.SZP_TABLE[this.a |= this.ixL];
      break;
    case 182:
      this.f = this.SZP_TABLE[this.a |= this.getUint8(this.getIXHIXL() + this.d_())];
      this.pc++;
      break;
    case 188:
      this.cp_a(this.ixH);
      break;
    case 189:
      this.cp_a(this.ixL);
      break;
    case 190:
      this.cp_a(this.getUint8(this.getIXHIXL() + this.d_()));
      this.pc++;
      break;
    case 203:
      this.doIndexCB(this.getIXHIXL());
      break;
    case 225:
      this.setIXHIXL(this.getUint16(this.sp));
      this.sp += 2;
      break;
    case 227:
      temp = this.getIXHIXL();
      this.setIXHIXL(this.getUint16(this.sp));
      this.setUint16(this.sp, temp);
      break;
    case 229:
      this.push(this.getIXHIXL());
      break;
    case 233:
      this.pc = this.getIXHIXL();
      break;
    case 249:
      this.sp = this.getIXHIXL();
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented DD/FD Opcode: " + JSSMS.Utils.toHex(opcode));
      this.pc--;
      break;
  }
}, doIndexOpIY:function(opcode) {
  var temp;
  this.tstates -= OP_DD_STATES[opcode];
  if (REFRESH_EMULATION) {
    this.incR();
  }
  switch(opcode) {
    case 9:
      this.setIYHIYL(this.add16(this.getIYHIYL(), this.getBC()));
      break;
    case 25:
      this.setIYHIYL(this.add16(this.getIYHIYL(), this.getDE()));
      break;
    case 33:
      this.setIYHIYL(this.getUint16(this.pc++));
      this.pc++;
      break;
    case 34:
      this.setUint16(this.getUint16(this.pc++), this.getIYHIYL());
      this.pc++;
      break;
    case 35:
      this.incIYHIYL();
      break;
    case 36:
      this.iyH = this.inc8(this.iyH);
      break;
    case 37:
      this.iyH = this.dec8(this.iyH);
      break;
    case 38:
      this.iyH = this.getUint8(this.pc++);
      break;
    case 41:
      this.setIYHIYL(this.add16(this.getIYHIYL(), this.getIYHIYL()));
      break;
    case 42:
      this.setIYHIYL(this.getUint16(this.getUint16(this.pc++)));
      this.pc++;
      break;
    case 43:
      this.decIYHIYL();
      break;
    case 44:
      this.iyL = this.inc8(this.iyL);
      break;
    case 45:
      this.iyL = this.dec8(this.iyL);
      break;
    case 46:
      this.iyL = this.getUint8(this.pc++);
      break;
    case 52:
      this.incMem(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 53:
      this.decMem(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 54:
      this.setUint8(this.getIYHIYL() + this.d_(), this.getUint8(++this.pc));
      this.pc++;
      break;
    case 57:
      this.setIYHIYL(this.add16(this.getIYHIYL(), this.sp));
      break;
    case 68:
      this.b = this.iyH;
      break;
    case 69:
      this.b = this.iyL;
      break;
    case 70:
      this.b = this.getUint8(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 76:
      this.c = this.iyH;
      break;
    case 77:
      this.c = this.iyL;
      break;
    case 78:
      this.c = this.getUint8(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 84:
      this.d = this.iyH;
      break;
    case 85:
      this.d = this.iyL;
      break;
    case 86:
      this.d = this.getUint8(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 92:
      this.e = this.iyH;
      break;
    case 93:
      this.e = this.iyL;
      break;
    case 94:
      this.e = this.getUint8(this.getIYHIYL() + this.d_());
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
      this.h = this.getUint8(this.getIYHIYL() + this.d_());
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
      this.l = this.getUint8(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 111:
      this.iyL = this.a;
      break;
    case 112:
      this.setUint8(this.getIYHIYL() + this.d_(), this.b);
      this.pc++;
      break;
    case 113:
      this.setUint8(this.getIYHIYL() + this.d_(), this.c);
      this.pc++;
      break;
    case 114:
      this.setUint8(this.getIYHIYL() + this.d_(), this.d);
      this.pc++;
      break;
    case 115:
      this.setUint8(this.getIYHIYL() + this.d_(), this.e);
      this.pc++;
      break;
    case 116:
      this.setUint8(this.getIYHIYL() + this.d_(), this.h);
      this.pc++;
      break;
    case 117:
      this.setUint8(this.getIYHIYL() + this.d_(), this.l);
      this.pc++;
      break;
    case 119:
      this.setUint8(this.getIYHIYL() + this.d_(), this.a);
      this.pc++;
      break;
    case 124:
      this.a = this.iyH;
      break;
    case 125:
      this.a = this.iyL;
      break;
    case 126:
      this.a = this.getUint8(this.getIYHIYL() + this.d_());
      this.pc++;
      break;
    case 132:
      this.add_a(this.iyH);
      break;
    case 133:
      this.add_a(this.iyL);
      break;
    case 134:
      this.add_a(this.getUint8(this.getIYHIYL() + this.d_()));
      this.pc++;
      break;
    case 140:
      this.adc_a(this.iyH);
      break;
    case 141:
      this.adc_a(this.iyL);
      break;
    case 142:
      this.adc_a(this.getUint8(this.getIYHIYL() + this.d_()));
      this.pc++;
      break;
    case 148:
      this.sub_a(this.iyH);
      break;
    case 149:
      this.sub_a(this.iyL);
      break;
    case 150:
      this.sub_a(this.getUint8(this.getIYHIYL() + this.d_()));
      this.pc++;
      break;
    case 156:
      this.sbc_a(this.iyH);
      break;
    case 157:
      this.sbc_a(this.iyL);
      break;
    case 158:
      this.sbc_a(this.getUint8(this.getIYHIYL() + this.d_()));
      this.pc++;
      break;
    case 164:
      this.f = this.SZP_TABLE[this.a &= this.iyH] | F_HALFCARRY;
      break;
    case 165:
      this.f = this.SZP_TABLE[this.a &= this.iyL] | F_HALFCARRY;
      break;
    case 166:
      this.f = this.SZP_TABLE[this.a &= this.getUint8(this.getIYHIYL() + this.d_())] | F_HALFCARRY;
      this.pc++;
      break;
    case 172:
      this.f = this.SZP_TABLE[this.a ^= this.iyH];
      break;
    case 173:
      this.f = this.SZP_TABLE[this.a ^= this.iyL];
      break;
    case 174:
      this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.getIYHIYL() + this.d_())];
      this.pc++;
      break;
    case 180:
      this.f = this.SZP_TABLE[this.a |= this.iyH];
      break;
    case 181:
      this.f = this.SZP_TABLE[this.a |= this.iyL];
      break;
    case 182:
      this.f = this.SZP_TABLE[this.a |= this.getUint8(this.getIYHIYL() + this.d_())];
      this.pc++;
      break;
    case 188:
      this.cp_a(this.iyH);
      break;
    case 189:
      this.cp_a(this.iyL);
      break;
    case 190:
      this.cp_a(this.getUint8(this.getIYHIYL() + this.d_()));
      this.pc++;
      break;
    case 203:
      this.doIndexCB(this.getIYHIYL());
      break;
    case 225:
      this.setIYHIYL(this.getUint16(this.sp));
      this.sp += 2;
      break;
    case 227:
      temp = this.getIYHIYL();
      this.setIYHIYL(this.getUint16(this.sp));
      this.setUint16(this.sp, temp);
      break;
    case 229:
      this.push(this.getIYHIYL());
      break;
    case 233:
      this.pc = this.getIYHIYL();
      break;
    case 249:
      this.sp = this.getIYHIYL();
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented DD/FD Opcode: " + JSSMS.Utils.toHex(opcode));
      this.pc--;
      break;
  }
}, doIndexCB:function(index) {
  var location = index + this.getUint8(this.pc) & 65535;
  var opcode = this.getUint8(++this.pc);
  this.tstates -= OP_INDEX_CB_STATES[opcode];
  switch(opcode) {
    case 0:
      this.b = this.rlc(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 1:
      this.c = this.rlc(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 2:
      this.d = this.rlc(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 3:
      this.e = this.rlc(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 4:
      this.h = this.rlc(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 5:
      this.l = this.rlc(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 6:
      this.setUint8(location, this.rlc(this.getUint8(location)));
      break;
    case 7:
      this.a = this.rlc(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 8:
      this.b = this.rrc(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 9:
      this.c = this.rrc(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 10:
      this.d = this.rrc(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 11:
      this.e = this.rrc(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 12:
      this.h = this.rrc(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 13:
      this.l = this.rrc(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 14:
      this.setUint8(location, this.rrc(this.getUint8(location)));
      break;
    case 15:
      this.a = this.rrc(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 16:
      this.b = this.rl(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 17:
      this.c = this.rl(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 18:
      this.d = this.rl(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 19:
      this.e = this.rl(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 20:
      this.h = this.rl(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 21:
      this.l = this.rl(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 22:
      this.setUint8(location, this.rl(this.getUint8(location)));
      break;
    case 23:
      this.a = this.rl(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 24:
      this.b = this.rr(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 25:
      this.c = this.rr(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 26:
      this.d = this.rr(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 27:
      this.e = this.rr(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 28:
      this.h = this.rr(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 29:
      this.l = this.rr(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 30:
      this.setUint8(location, this.rr(this.getUint8(location)));
      break;
    case 31:
      this.a = this.rr(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 32:
      this.b = this.sla(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 33:
      this.c = this.sla(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 34:
      this.d = this.sla(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 35:
      this.e = this.sla(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 36:
      this.h = this.sla(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 37:
      this.l = this.sla(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 38:
      this.setUint8(location, this.sla(this.getUint8(location)));
      break;
    case 39:
      this.a = this.sla(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 40:
      this.b = this.sra(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 41:
      this.c = this.sra(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 42:
      this.d = this.sra(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 43:
      this.e = this.sra(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 44:
      this.h = this.sra(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 45:
      this.l = this.sra(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 46:
      this.setUint8(location, this.sra(this.getUint8(location)));
      break;
    case 47:
      this.a = this.sra(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 48:
      this.b = this.sll(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 49:
      this.c = this.sll(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 50:
      this.d = this.sll(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 51:
      this.e = this.sll(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 52:
      this.h = this.sll(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 53:
      this.l = this.sll(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 54:
      this.setUint8(location, this.sll(this.getUint8(location)));
      break;
    case 55:
      this.a = this.sll(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 56:
      this.b = this.srl(this.getUint8(location));
      this.setUint8(location, this.b);
      break;
    case 57:
      this.c = this.srl(this.getUint8(location));
      this.setUint8(location, this.c);
      break;
    case 58:
      this.d = this.srl(this.getUint8(location));
      this.setUint8(location, this.d);
      break;
    case 59:
      this.e = this.srl(this.getUint8(location));
      this.setUint8(location, this.e);
      break;
    case 60:
      this.h = this.srl(this.getUint8(location));
      this.setUint8(location, this.h);
      break;
    case 61:
      this.l = this.srl(this.getUint8(location));
      this.setUint8(location, this.l);
      break;
    case 62:
      this.setUint8(location, this.srl(this.getUint8(location)));
      break;
    case 63:
      this.a = this.srl(this.getUint8(location));
      this.setUint8(location, this.a);
      break;
    case 64:
    ;
    case 65:
    ;
    case 66:
    ;
    case 67:
    ;
    case 68:
    ;
    case 69:
    ;
    case 70:
    ;
    case 71:
      this.bit(this.getUint8(location) & BIT_0);
      break;
    case 72:
    ;
    case 73:
    ;
    case 74:
    ;
    case 75:
    ;
    case 76:
    ;
    case 77:
    ;
    case 78:
    ;
    case 79:
      this.bit(this.getUint8(location) & BIT_1);
      break;
    case 80:
    ;
    case 81:
    ;
    case 82:
    ;
    case 83:
    ;
    case 84:
    ;
    case 85:
    ;
    case 86:
    ;
    case 87:
      this.bit(this.getUint8(location) & BIT_2);
      break;
    case 88:
    ;
    case 89:
    ;
    case 90:
    ;
    case 91:
    ;
    case 92:
    ;
    case 93:
    ;
    case 94:
    ;
    case 95:
      this.bit(this.getUint8(location) & BIT_3);
      break;
    case 96:
    ;
    case 97:
    ;
    case 98:
    ;
    case 99:
    ;
    case 100:
    ;
    case 101:
    ;
    case 102:
    ;
    case 103:
      this.bit(this.getUint8(location) & BIT_4);
      break;
    case 104:
    ;
    case 105:
    ;
    case 106:
    ;
    case 107:
    ;
    case 108:
    ;
    case 109:
    ;
    case 110:
    ;
    case 111:
      this.bit(this.getUint8(location) & BIT_5);
      break;
    case 112:
    ;
    case 113:
    ;
    case 114:
    ;
    case 115:
    ;
    case 116:
    ;
    case 117:
    ;
    case 118:
    ;
    case 119:
      this.bit(this.getUint8(location) & BIT_6);
      break;
    case 120:
    ;
    case 121:
    ;
    case 122:
    ;
    case 123:
    ;
    case 124:
    ;
    case 125:
    ;
    case 126:
    ;
    case 127:
      this.bit(this.getUint8(location) & BIT_7);
      break;
    case 128:
    ;
    case 129:
    ;
    case 130:
    ;
    case 131:
    ;
    case 132:
    ;
    case 133:
    ;
    case 134:
    ;
    case 135:
      this.setUint8(location, this.getUint8(location) & ~BIT_0);
      break;
    case 136:
    ;
    case 137:
    ;
    case 138:
    ;
    case 139:
    ;
    case 140:
    ;
    case 141:
    ;
    case 142:
    ;
    case 143:
      this.setUint8(location, this.getUint8(location) & ~BIT_1);
      break;
    case 144:
    ;
    case 145:
    ;
    case 146:
    ;
    case 147:
    ;
    case 148:
    ;
    case 149:
    ;
    case 150:
    ;
    case 151:
      this.setUint8(location, this.getUint8(location) & ~BIT_2);
      break;
    case 152:
    ;
    case 153:
    ;
    case 154:
    ;
    case 155:
    ;
    case 156:
    ;
    case 157:
    ;
    case 158:
    ;
    case 159:
      this.setUint8(location, this.getUint8(location) & ~BIT_3);
      break;
    case 160:
    ;
    case 161:
    ;
    case 162:
    ;
    case 163:
    ;
    case 164:
    ;
    case 165:
    ;
    case 166:
    ;
    case 167:
      this.setUint8(location, this.getUint8(location) & ~BIT_4);
      break;
    case 168:
    ;
    case 169:
    ;
    case 170:
    ;
    case 171:
    ;
    case 172:
    ;
    case 173:
    ;
    case 174:
    ;
    case 175:
      this.setUint8(location, this.getUint8(location) & ~BIT_5);
      break;
    case 176:
    ;
    case 177:
    ;
    case 178:
    ;
    case 179:
    ;
    case 180:
    ;
    case 181:
    ;
    case 182:
    ;
    case 183:
      this.setUint8(location, this.getUint8(location) & ~BIT_6);
      break;
    case 184:
    ;
    case 185:
    ;
    case 186:
    ;
    case 187:
    ;
    case 188:
    ;
    case 189:
    ;
    case 190:
    ;
    case 191:
      this.setUint8(location, this.getUint8(location) & ~BIT_7);
      break;
    case 192:
    ;
    case 193:
    ;
    case 194:
    ;
    case 195:
    ;
    case 196:
    ;
    case 197:
    ;
    case 198:
    ;
    case 199:
      this.setUint8(location, this.getUint8(location) | BIT_0);
      break;
    case 200:
    ;
    case 201:
    ;
    case 202:
    ;
    case 203:
    ;
    case 204:
    ;
    case 205:
    ;
    case 206:
    ;
    case 207:
      this.setUint8(location, this.getUint8(location) | BIT_1);
      break;
    case 208:
    ;
    case 209:
    ;
    case 210:
    ;
    case 211:
    ;
    case 212:
    ;
    case 213:
    ;
    case 214:
    ;
    case 215:
      this.setUint8(location, this.getUint8(location) | BIT_2);
      break;
    case 216:
    ;
    case 217:
    ;
    case 218:
    ;
    case 219:
    ;
    case 220:
    ;
    case 221:
    ;
    case 222:
    ;
    case 223:
      this.setUint8(location, this.getUint8(location) | BIT_3);
      break;
    case 224:
    ;
    case 225:
    ;
    case 226:
    ;
    case 227:
    ;
    case 228:
    ;
    case 229:
    ;
    case 230:
    ;
    case 231:
      this.setUint8(location, this.getUint8(location) | BIT_4);
      break;
    case 232:
    ;
    case 233:
    ;
    case 234:
    ;
    case 235:
    ;
    case 236:
    ;
    case 237:
    ;
    case 238:
    ;
    case 239:
      this.setUint8(location, this.getUint8(location) | BIT_5);
      break;
    case 240:
    ;
    case 241:
    ;
    case 242:
    ;
    case 243:
    ;
    case 244:
    ;
    case 245:
    ;
    case 246:
    ;
    case 247:
      this.setUint8(location, this.getUint8(location) | BIT_6);
      break;
    case 248:
    ;
    case 249:
    ;
    case 250:
    ;
    case 251:
    ;
    case 252:
    ;
    case 253:
    ;
    case 254:
    ;
    case 255:
      this.setUint8(location, this.getUint8(location) | BIT_7);
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented DDCB/FDCB Opcode: " + JSSMS.Utils.toHex(opcode));
      break;
  }
  this.pc++;
}, doED:function(opcode) {
  var temp = 0;
  var location = 0;
  this.tstates -= OP_ED_STATES[opcode];
  if (REFRESH_EMULATION) {
    this.incR();
  }
  switch(opcode) {
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
      this.setUint16(this.getUint16(++this.pc), this.getBC());
      this.pc += 2;
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
      temp = this.a;
      this.a = 0;
      this.sub_a(temp);
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
      this.pc = this.getUint16(this.sp);
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
      this.setBC(this.getUint16(this.getUint16(++this.pc)));
      this.pc += 2;
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
      this.setUint16(this.getUint16(++this.pc), this.getDE());
      this.pc += 2;
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
      this.setDE(this.getUint16(this.getUint16(++this.pc)));
      this.pc += 2;
      break;
    case 95:
      this.a = REFRESH_EMULATION ? this.r : JSSMS.Utils.rndInt(255);
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
      this.setUint16(this.getUint16(++this.pc), this.getHL());
      this.pc += 2;
      break;
    case 103:
      location = this.getHL();
      temp = this.getUint8(location);
      this.setUint8(location, temp >> 4 | (this.a & 15) << 4);
      this.a = this.a & 240 | temp & 15;
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
      this.setHL(this.getUint16(this.getUint16(++this.pc)));
      this.pc += 2;
      break;
    case 111:
      location = this.getHL();
      temp = this.getUint8(location);
      this.setUint8(location, (temp & 15) << 4 | this.a & 15);
      this.a = this.a & 240 | temp >> 4;
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
      this.setUint16(this.getUint16(++this.pc), this.sp);
      this.pc += 2;
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
      this.sp = this.getUint16(this.getUint16(++this.pc));
      this.pc += 2;
      break;
    case 160:
      temp = this.getUint8(this.getHL());
      this.setUint8(this.getDE(), temp);
      this.decBC();
      this.incDE();
      this.incHL();
      temp = temp + this.a & 255;
      this.f = this.f & 193 | (this.getBC() ? F_PARITY : 0) | temp & 8 | (temp & 2 ? 32 : 0);
      this.pc++;
      break;
    case 161:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.getUint8(this.getHL()));
      this.decBC();
      this.incHL();
      temp |= this.getBC() === 0 ? 0 : F_PARITY;
      this.f = this.f & 248 | temp;
      this.pc++;
      break;
    case 162:
      temp = this.port.in_(this.c);
      this.setUint8(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if ((temp & 128) === 128) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 163:
      temp = this.getUint8(this.getHL());
      this.port.out(this.c, temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      } else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) === 128) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 168:
      temp = this.getUint8(this.getHL());
      this.setUint8(this.getDE(), temp);
      this.decBC();
      this.decDE();
      this.decHL();
      temp = temp + this.a & 255;
      this.f = this.f & 193 | (this.getBC() ? F_PARITY : 0) | temp & F_BIT3 | (temp & F_NEGATIVE ? 32 : 0);
      this.pc++;
      break;
    case 169:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.getUint8(this.getHL()));
      this.decBC();
      this.decHL();
      temp |= this.getBC() === 0 ? 0 : F_PARITY;
      this.f = this.f & 248 | temp;
      this.pc++;
      break;
    case 170:
      temp = this.port.in_(this.c);
      this.setUint8(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if ((temp & 128) !== 0) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 171:
      temp = this.getUint8(this.getHL());
      this.port.out(this.c, temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      } else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) === 128) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      this.pc++;
      break;
    case 176:
      temp = this.getUint8(this.getHL());
      this.setUint8(this.getDE(), temp);
      this.decBC();
      this.incDE();
      this.incHL();
      temp = temp + this.a & 255;
      this.f = this.f & 193 | (this.getBC() ? F_PARITY : 0) | temp & 8 | (temp & 2 ? 32 : 0);
      if (this.getBC() !== 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      break;
    case 177:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.getUint8(this.getHL()));
      this.decBC();
      this.incHL();
      temp |= this.getBC() === 0 ? 0 : F_PARITY;
      if ((temp & F_PARITY) !== 0 && (this.f & F_ZERO) === 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      this.f = this.f & 248 | temp;
      break;
    case 178:
      temp = this.port.in_(this.c);
      this.setUint8(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if (this.b !== 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      if ((temp & 128) === 128) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    case 179:
      temp = this.getUint8(this.getHL());
      this.port.out(this.c, temp);
      this.b = this.dec8(this.b);
      this.incHL();
      if (this.b !== 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      } else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) !== 0) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    case 184:
      temp = this.getUint8(this.getHL());
      this.setUint8(this.getDE(), temp);
      this.decBC();
      this.decDE();
      this.decHL();
      temp = temp + this.a & 255;
      this.f = this.f & 193 | (this.getBC() ? F_PARITY : 0) | temp & F_BIT3 | (temp & F_NEGATIVE ? 32 : 0);
      if (this.getBC() !== 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      break;
    case 185:
      temp = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.getUint8(this.getHL()));
      this.decBC();
      this.decHL();
      temp |= this.getBC() === 0 ? 0 : F_PARITY;
      if ((temp & F_PARITY) !== 0 && (this.f & F_ZERO) === 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      this.f = this.f & 248 | temp;
      break;
    case 186:
      temp = this.port.in_(this.c);
      this.setUint8(this.getHL(), temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if (this.b !== 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      if ((temp & 128) !== 0) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    case 187:
      temp = this.getUint8(this.getHL());
      this.port.out(this.c, temp);
      this.b = this.dec8(this.b);
      this.decHL();
      if (this.b !== 0) {
        this.tstates -= 5;
        this.pc--;
      } else {
        this.pc++;
      }
      if (this.l + temp > 255) {
        this.f |= F_CARRY;
        this.f |= F_HALFCARRY;
      } else {
        this.f &= ~F_CARRY;
        this.f &= ~F_HALFCARRY;
      }
      if ((temp & 128) !== 0) {
        this.f |= F_NEGATIVE;
      } else {
        this.f &= ~F_NEGATIVE;
      }
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented ED Opcode: " + JSSMS.Utils.toHex(opcode));
      this.pc++;
      break;
  }
}, generateDAATable:function() {
  var i, c, h, n;
  i = 256;
  while (i--) {
    for (c = 0;c <= 1;c++) {
      for (h = 0;h <= 1;h++) {
        for (n = 0;n <= 1;n++) {
          this.DAA_TABLE[c << 8 | n << 9 | h << 10 | i] = this.getDAAResult(i, c | n << 1 | h << 4);
        }
      }
    }
  }
  this.a = this.f = 0;
}, getDAAResult:function(value, flags) {
  this.a = value;
  this.f = flags;
  var a_copy = this.a;
  var correction = 0;
  var carry = flags & F_CARRY;
  var carry_copy = carry;
  if ((flags & F_HALFCARRY) !== 0 || (a_copy & 15) > 9) {
    correction |= 6;
  }
  if (carry === 1 || a_copy > 159 || a_copy > 143 && (a_copy & 15) > 9) {
    correction |= 96;
    carry_copy = 1;
  }
  if (a_copy > 153) {
    carry_copy = 1;
  }
  if ((flags & F_NEGATIVE) !== 0) {
    this.sub_a(correction);
  } else {
    this.add_a(correction);
  }
  flags = this.f & 254 | carry_copy;
  if (this.getParity(this.a)) {
    flags = flags & 251 | F_PARITY;
  } else {
    flags = flags & 251;
  }
  return this.a | flags << 8;
}, add_a:function(value) {
  var temp = this.a + value & 255;
  this.f = this.SZHVC_ADD_TABLE[this.a << 8 | temp];
  this.a = temp;
}, adc_a:function(value) {
  var carry = this.f & F_CARRY;
  var temp = this.a + value + carry & 255;
  this.f = this.SZHVC_ADD_TABLE[carry << 16 | this.a << 8 | temp];
  this.a = temp;
}, sub_a:function(value) {
  var temp = this.a - value & 255;
  this.f = this.SZHVC_SUB_TABLE[this.a << 8 | temp];
  this.a = temp;
}, sbc_a:function(value) {
  var carry = this.f & F_CARRY;
  var temp = this.a - value - carry & 255;
  this.f = this.SZHVC_SUB_TABLE[carry << 16 | this.a << 8 | temp];
  this.a = temp;
}, cp_a:function(value) {
  this.f = this.SZHVC_SUB_TABLE[this.a << 8 | this.a - value & 255];
}, cpl_a:function() {
  this.a ^= 255;
  this.f |= F_NEGATIVE | F_HALFCARRY;
}, rra_a:function() {
  var carry = this.a & 1;
  this.a = (this.a >> 1 | (this.f & F_CARRY) << 7) & 255;
  this.f = this.f & 236 | carry;
}, rla_a:function() {
  var carry = this.a >> 7;
  this.a = (this.a << 1 | this.f & F_CARRY) & 255;
  this.f = this.f & 236 | carry;
}, rlca_a:function() {
  var carry = this.a >> 7;
  this.a = this.a << 1 & 255 | carry;
  this.f = this.f & 236 | carry;
}, rrca_a:function() {
  var carry = this.a & 1;
  this.a = this.a >> 1 | carry << 7;
  this.f = this.f & 236 | carry;
}, getBC:function() {
  return this.b << 8 | this.c;
}, getDE:function() {
  return this.d << 8 | this.e;
}, getHL:function() {
  return this.h << 8 | this.l;
}, getAF:function() {
  return this.a << 8 | this.f;
}, getIXHIXL:function() {
  return this.ixH << 8 | this.ixL;
}, getIYHIYL:function() {
  return this.iyH << 8 | this.iyL;
}, setBC:function(value) {
  this.b = value >> 8;
  this.c = value & 255;
}, setDE:function(value) {
  this.d = value >> 8;
  this.e = value & 255;
}, setHL:function(value) {
  this.h = value >> 8;
  this.l = value & 255;
}, setAF:function(value) {
  this.a = value >> 8;
  this.f = value & 255;
}, setIXHIXL:function(value) {
  this.ixH = value >> 8;
  this.ixL = value & 255;
}, setIYHIYL:function(value) {
  this.iyH = value >> 8;
  this.iyL = value & 255;
}, incBC:function() {
  this.c = this.c + 1 & 255;
  if (this.c === 0) {
    this.b = this.b + 1 & 255;
  }
}, incDE:function() {
  this.e = this.e + 1 & 255;
  if (this.e === 0) {
    this.d = this.d + 1 & 255;
  }
}, incHL:function() {
  this.l = this.l + 1 & 255;
  if (this.l === 0) {
    this.h = this.h + 1 & 255;
  }
}, incIXHIXL:function() {
  this.ixL = this.ixL + 1 & 255;
  if (this.ixL === 0) {
    this.ixH = this.ixH + 1 & 255;
  }
}, incIYHIYL:function() {
  this.iyL = this.iyL + 1 & 255;
  if (this.iyL === 0) {
    this.iyH = this.iyH + 1 & 255;
  }
}, decBC:function() {
  this.c = this.c - 1 & 255;
  if (this.c === 255) {
    this.b = this.b - 1 & 255;
  }
}, decDE:function() {
  this.e = this.e - 1 & 255;
  if (this.e === 255) {
    this.d = this.d - 1 & 255;
  }
}, decHL:function() {
  this.l = this.l - 1 & 255;
  if (this.l === 255) {
    this.h = this.h - 1 & 255;
  }
}, decIXHIXL:function() {
  this.ixL = this.ixL - 1 & 255;
  if (this.ixL === 255) {
    this.ixH = this.ixH - 1 & 255;
  }
}, decIYHIYL:function() {
  this.iyL = this.iyL - 1 & 255;
  if (this.iyL === 255) {
    this.iyH = this.iyH - 1 & 255;
  }
}, inc8:function(value) {
  value = value + 1 & 255;
  this.f = this.f & F_CARRY | this.SZHV_INC_TABLE[value];
  return value;
}, dec8:function(value) {
  value = value - 1 & 255;
  this.f = this.f & F_CARRY | this.SZHV_DEC_TABLE[value];
  return value;
}, exAF:function() {
  var temp = this.a;
  this.a = this.a2;
  this.a2 = temp;
  temp = this.f;
  this.f = this.f2;
  this.f2 = temp;
}, exBC:function() {
  var temp = this.b;
  this.b = this.b2;
  this.b2 = temp;
  temp = this.c;
  this.c = this.c2;
  this.c2 = temp;
}, exDE:function() {
  var temp = this.d;
  this.d = this.d2;
  this.d2 = temp;
  temp = this.e;
  this.e = this.e2;
  this.e2 = temp;
}, exHL:function() {
  var temp = this.h;
  this.h = this.h2;
  this.h2 = temp;
  temp = this.l;
  this.l = this.l2;
  this.l2 = temp;
}, add16:function(reg, value) {
  var result = reg + value;
  this.f = this.f & 196 | (reg ^ result ^ value) >> 8 & 16 | result >> 16 & 1;
  return result & 65535;
}, adc16:function(value) {
  var hl = this.getHL();
  var result = hl + value + (this.f & F_CARRY);
  this.f = (hl ^ result ^ value) >> 8 & 16 | result >> 16 & 1 | result >> 8 & 128 | ((result & 65535) !== 0 ? 0 : 64) | ((value ^ hl ^ 32768) & (value ^ result) & 32768) >> 13;
  this.h = result >> 8 & 255;
  this.l = result & 255;
}, sbc16:function(value) {
  var hl = this.getHL();
  var result = hl - value - (this.f & F_CARRY);
  this.f = (hl ^ result ^ value) >> 8 & 16 | 2 | result >> 16 & 1 | result >> 8 & 128 | ((result & 65535) !== 0 ? 0 : 64) | ((value ^ hl) & (hl ^ result) & 32768) >> 13;
  this.h = result >> 8 & 255;
  this.l = result & 255;
}, incR:function() {
  this.r = this.r & 128 | this.r + 1 & 127;
}, nop:function() {
}, generateFlagTables:function() {
  var i, sf, zf, yf, xf, pf;
  var padd, padc, psub, psbc;
  var val, oldval, newval;
  for (i = 0;i < 256;i++) {
    sf = (i & 128) !== 0 ? F_SIGN : 0;
    zf = i === 0 ? F_ZERO : 0;
    yf = i & 32;
    xf = i & 8;
    pf = this.getParity(i) ? F_PARITY : 0;
    this.SZ_TABLE[i] = sf | zf | yf | xf;
    this.SZP_TABLE[i] = sf | zf | yf | xf | pf;
    this.SZHV_INC_TABLE[i] = sf | zf | yf | xf;
    this.SZHV_INC_TABLE[i] |= i === 128 ? F_OVERFLOW : 0;
    this.SZHV_INC_TABLE[i] |= (i & 15) === 0 ? F_HALFCARRY : 0;
    this.SZHV_DEC_TABLE[i] = sf | zf | yf | xf | F_NEGATIVE;
    this.SZHV_DEC_TABLE[i] |= i === 127 ? F_OVERFLOW : 0;
    this.SZHV_DEC_TABLE[i] |= (i & 15) === 15 ? F_HALFCARRY : 0;
    this.SZ_BIT_TABLE[i] = i !== 0 ? i & 128 : F_ZERO | F_PARITY;
    this.SZ_BIT_TABLE[i] |= yf | xf | F_HALFCARRY;
  }
  padd = 0 * 256;
  padc = 256 * 256;
  psub = 0 * 256;
  psbc = 256 * 256;
  for (oldval = 0;oldval < 256;oldval++) {
    for (newval = 0;newval < 256;newval++) {
      val = newval - oldval;
      if (newval !== 0) {
        if ((newval & 128) !== 0) {
          this.SZHVC_ADD_TABLE[padd] = F_SIGN;
        } else {
          this.SZHVC_ADD_TABLE[padd] = 0;
        }
      } else {
        this.SZHVC_ADD_TABLE[padd] = F_ZERO;
      }
      this.SZHVC_ADD_TABLE[padd] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) < (oldval & 15)) {
        this.SZHVC_ADD_TABLE[padd] |= F_HALFCARRY;
      }
      if (newval < oldval) {
        this.SZHVC_ADD_TABLE[padd] |= F_CARRY;
      }
      if (((val ^ oldval ^ 128) & (val ^ newval) & 128) !== 0) {
        this.SZHVC_ADD_TABLE[padd] |= F_OVERFLOW;
      }
      padd++;
      val = newval - oldval - 1;
      if (newval !== 0) {
        if ((newval & 128) !== 0) {
          this.SZHVC_ADD_TABLE[padc] = F_SIGN;
        } else {
          this.SZHVC_ADD_TABLE[padc] = 0;
        }
      } else {
        this.SZHVC_ADD_TABLE[padc] = F_ZERO;
      }
      this.SZHVC_ADD_TABLE[padc] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) <= (oldval & 15)) {
        this.SZHVC_ADD_TABLE[padc] |= F_HALFCARRY;
      }
      if (newval <= oldval) {
        this.SZHVC_ADD_TABLE[padc] |= F_CARRY;
      }
      if (((val ^ oldval ^ 128) & (val ^ newval) & 128) !== 0) {
        this.SZHVC_ADD_TABLE[padc] |= F_OVERFLOW;
      }
      padc++;
      val = oldval - newval;
      if (newval !== 0) {
        if ((newval & 128) !== 0) {
          this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE | F_SIGN;
        } else {
          this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE;
        }
      } else {
        this.SZHVC_SUB_TABLE[psub] = F_NEGATIVE | F_ZERO;
      }
      this.SZHVC_SUB_TABLE[psub] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) > (oldval & 15)) {
        this.SZHVC_SUB_TABLE[psub] |= F_HALFCARRY;
      }
      if (newval > oldval) {
        this.SZHVC_SUB_TABLE[psub] |= F_CARRY;
      }
      if (((val ^ oldval) & (oldval ^ newval) & 128) !== 0) {
        this.SZHVC_SUB_TABLE[psub] |= F_OVERFLOW;
      }
      psub++;
      val = oldval - newval - 1;
      if (newval !== 0) {
        if ((newval & 128) !== 0) {
          this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE | F_SIGN;
        } else {
          this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE;
        }
      } else {
        this.SZHVC_SUB_TABLE[psbc] = F_NEGATIVE | F_ZERO;
      }
      this.SZHVC_SUB_TABLE[psbc] |= newval & (F_BIT5 | F_BIT3);
      if ((newval & 15) >= (oldval & 15)) {
        this.SZHVC_SUB_TABLE[psbc] |= F_HALFCARRY;
      }
      if (newval >= oldval) {
        this.SZHVC_SUB_TABLE[psbc] |= F_CARRY;
      }
      if (((val ^ oldval) & (oldval ^ newval) & 128) !== 0) {
        this.SZHVC_SUB_TABLE[psbc] |= F_OVERFLOW;
      }
      psbc++;
    }
  }
}, getParity:function(value) {
  var parity = true;
  var j;
  for (j = 0;j < 8;j++) {
    if ((value & 1 << j) !== 0) {
      parity = !parity;
    }
  }
  return parity;
}, generateMemory:function() {
  if (SUPPORT_DATAVIEW) {
    for (var i = 0;i < 8192;i++) {
      this.memWriteMap.setUint8(i, 0);
    }
  } else {
    for (i = 0;i < 8192;i++) {
      this.memWriteMap[i] = 0;
    }
  }
  if (SUPPORT_DATAVIEW) {
    for (i = 0;i < 32768;i++) {
      this.sram.setUint8(i, 0);
    }
  } else {
    for (i = 0;i < 32768;i++) {
      this.sram[i] = 0;
    }
  }
  this.useSRAM = false;
  this.number_of_pages = 2;
  for (i = 0;i < 4;i++) {
    this.frameReg[i] = i % 3;
  }
}, resetMemory:function(pages) {
  var i = 0;
  if (pages) {
    this.rom = pages;
  }
  if (this.rom.length) {
    this.number_of_pages = this.rom.length;
    this.romPageMask = this.number_of_pages - 1;
    for (i = 0;i < 3;i++) {
      this.frameReg[i] = i % this.number_of_pages;
    }
    this.frameReg[3] = 0;
    if (ENABLE_COMPILER) {
      this.branches = Array(this.number_of_pages);
      for (i = 0;i < this.number_of_pages;i++) {
        this.branches[i] = Object.create(null);
      }
      this.recompiler.setRom(this.rom);
    }
  } else {
    this.number_of_pages = 0;
    this.romPageMask = 0;
  }
}, d_:function() {
  return this.getUint8(this.pc);
}, setUint8:function() {
  if (SUPPORT_DATAVIEW) {
    return function setUint8(address, value) {
      if (address <= 65535) {
        this.memWriteMap.setUint8(address & 8191, value);
        if (address === 65532) {
          this.frameReg[3] = value;
        } else {
          if (address === 65533) {
            this.frameReg[0] = value & this.romPageMask;
          } else {
            if (address === 65534) {
              this.frameReg[1] = value & this.romPageMask;
            } else {
              if (address === 65535) {
                this.frameReg[2] = value & this.romPageMask;
              }
            }
          }
        }
      } else {
        JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
      }
    };
  } else {
    return function setUint8(address, value) {
      if (address <= 65535) {
        this.memWriteMap[address & 8191] = value;
        if (address === 65532) {
          this.frameReg[3] = value;
        } else {
          if (address === 65533) {
            this.frameReg[0] = value & this.romPageMask;
          } else {
            if (address === 65534) {
              this.frameReg[1] = value & this.romPageMask;
            } else {
              if (address === 65535) {
                this.frameReg[2] = value & this.romPageMask;
              }
            }
          }
        }
      } else {
        JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
      }
    };
  }
}(), setUint16:function() {
  if (SUPPORT_DATAVIEW) {
    return function setUint16(address, value) {
      if (address < 65532) {
        this.memWriteMap.setUint16(address & 8191, value, LITTLE_ENDIAN);
      } else {
        if (address === 65532) {
          this.frameReg[3] = value & 255;
          this.frameReg[0] = value >> 8 & this.romPageMask;
        } else {
          if (address === 65533) {
            this.frameReg[0] = value & 255 & this.romPageMask;
            this.frameReg[1] = value >> 8 & this.romPageMask;
          } else {
            if (address === 65534) {
              this.frameReg[1] = value & 255 & this.romPageMask;
              this.frameReg[2] = value >> 8 & this.romPageMask;
            } else {
              JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
            }
          }
        }
      }
    };
  } else {
    return function setUint16(address, value) {
      if (address < 65532) {
        address &= 8191;
        this.memWriteMap[address++] = value & 255;
        this.memWriteMap[address] = value >> 8;
      } else {
        if (address === 65532) {
          this.frameReg[3] = value & 255;
          this.frameReg[0] = value >> 8 & this.romPageMask;
        } else {
          if (address === 65533) {
            this.frameReg[0] = value & 255 & this.romPageMask;
            this.frameReg[1] = value >> 8 & this.romPageMask;
          } else {
            if (address === 65534) {
              this.frameReg[1] = value & 255 & this.romPageMask;
              this.frameReg[2] = value >> 8 & this.romPageMask;
            } else {
              JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
            }
          }
        }
      }
    };
  }
}(), getUint8:function() {
  if (SUPPORT_DATAVIEW) {
    return function getUint8(address) {
      if (address < 1024) {
        return this.rom[0].getUint8(address);
      } else {
        if (address < 16384) {
          return this.rom[this.frameReg[0]].getUint8(address);
        } else {
          if (address < 32768) {
            return this.rom[this.frameReg[1]].getUint8(address - 16384);
          } else {
            if (address < 49152) {
              if ((this.frameReg[3] & 12) === 8) {
                this.useSRAM = true;
                return this.sram.getUint8(address - 32768);
              } else {
                if ((this.frameReg[3] & 12) === 12) {
                  this.useSRAM = true;
                  return this.sram.getUint8(address - 16384);
                } else {
                  return this.rom[this.frameReg[2]].getUint8(address - 32768);
                }
              }
            } else {
              if (address < 57344) {
                return this.memWriteMap.getUint8(address - 49152);
              } else {
                if (address < 65532) {
                  return this.memWriteMap.getUint8(address - 57344);
                } else {
                  if (address === 65532) {
                    return this.frameReg[3];
                  } else {
                    if (address === 65533) {
                      return this.frameReg[0];
                    } else {
                      if (address === 65534) {
                        return this.frameReg[1];
                      } else {
                        if (address === 65535) {
                          return this.frameReg[2];
                        } else {
                          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return 0;
    };
  } else {
    return function getUint8(address) {
      if (address < 1024) {
        return this.rom[0][address];
      } else {
        if (address < 16384) {
          return this.rom[this.frameReg[0]][address];
        } else {
          if (address < 32768) {
            return this.rom[this.frameReg[1]][address - 16384];
          } else {
            if (address < 49152) {
              if ((this.frameReg[3] & 12) === 8) {
                this.useSRAM = true;
                return this.sram[address - 32768];
              } else {
                if ((this.frameReg[3] & 12) === 12) {
                  this.useSRAM = true;
                  return this.sram[address - 16384];
                } else {
                  return this.rom[this.frameReg[2]][address - 32768];
                }
              }
            } else {
              if (address < 57344) {
                return this.memWriteMap[address - 49152];
              } else {
                if (address < 65532) {
                  return this.memWriteMap[address - 57344];
                } else {
                  if (address === 65532) {
                    return this.frameReg[3];
                  } else {
                    if (address === 65533) {
                      return this.frameReg[0];
                    } else {
                      if (address === 65534) {
                        return this.frameReg[1];
                      } else {
                        if (address === 65535) {
                          return this.frameReg[2];
                        } else {
                          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return 0;
    };
  }
}(), getUint16:function() {
  if (SUPPORT_DATAVIEW) {
    return function getUint16(address) {
      if (address < 1024) {
        return this.rom[0].getUint16(address, LITTLE_ENDIAN);
      } else {
        if (address < 16384) {
          return this.rom[this.frameReg[0]].getUint16(address, LITTLE_ENDIAN);
        } else {
          if (address < 32768) {
            return this.rom[this.frameReg[1]].getUint16(address - 16384, LITTLE_ENDIAN);
          } else {
            if (address < 49152) {
              if ((this.frameReg[3] & 12) === 8) {
                this.useSRAM = true;
                return this.sram[address - 32768];
              } else {
                if ((this.frameReg[3] & 12) === 12) {
                  this.useSRAM = true;
                  return this.sram[address - 16384];
                } else {
                  return this.rom[this.frameReg[2]].getUint16(address - 32768, LITTLE_ENDIAN);
                }
              }
            } else {
              if (address < 57344) {
                return this.memWriteMap.getUint16(address - 49152, LITTLE_ENDIAN);
              } else {
                if (address < 65532) {
                  return this.memWriteMap.getUint16(address - 57344, LITTLE_ENDIAN);
                } else {
                  if (address === 65532) {
                    return this.frameReg[3];
                  } else {
                    if (address === 65533) {
                      return this.frameReg[0];
                    } else {
                      if (address === 65534) {
                        return this.frameReg[1];
                      } else {
                        if (address === 65535) {
                          return this.frameReg[2];
                        } else {
                          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return 0;
    };
  } else {
    return function getUint16(address) {
      if (address < 1024) {
        return this.rom[0][address++] | this.rom[0][address] << 8;
      } else {
        if (address < 16384) {
          return this.rom[this.frameReg[0]][address++] | this.rom[this.frameReg[0]][address] << 8;
        } else {
          if (address < 32768) {
            return this.rom[this.frameReg[1]][address++ - 16384] | this.rom[this.frameReg[1]][address - 16384] << 8;
          } else {
            if (address < 49152) {
              if ((this.frameReg[3] & 12) === 8) {
                this.useSRAM = true;
                return this.sram[address++ - 32768] | this.sram[address - 32768] << 8;
              } else {
                if ((this.frameReg[3] & 12) === 12) {
                  this.useSRAM = true;
                  return this.sram[address++ - 16384] | this.sram[address - 16384] << 8;
                } else {
                  return this.rom[this.frameReg[2]][address++ - 32768] | this.rom[this.frameReg[2]][address - 32768] << 8;
                }
              }
            } else {
              if (address < 57344) {
                return this.memWriteMap[address++ - 49152] | this.memWriteMap[address - 49152] << 8;
              } else {
                if (address < 65532) {
                  return this.memWriteMap[address++ - 57344] | this.memWriteMap[address - 57344] << 8;
                } else {
                  if (address === 65532) {
                    return this.frameReg[3];
                  } else {
                    if (address === 65533) {
                      return this.frameReg[0];
                    } else {
                      if (address === 65534) {
                        return this.frameReg[1];
                      } else {
                        if (address === 65535) {
                          return this.frameReg[2];
                        } else {
                          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return 0;
    };
  }
}(), getInt8:function() {
  if (SUPPORT_DATAVIEW) {
    return function getInt8(address) {
      var value = 0;
      if (address < 1024) {
        value = this.rom[0].getInt8(address);
      } else {
        if (address < 16384) {
          value = this.rom[this.frameReg[0]].getInt8(address);
        } else {
          if (address < 32768) {
            value = this.rom[this.frameReg[1]].getInt8(address - 16384);
          } else {
            if (address < 49152) {
              if ((this.frameReg[3] & 12) === 8) {
                this.useSRAM = true;
                value = this.sram.getInt8(address - 32768);
              } else {
                if ((this.frameReg[3] & 12) === 12) {
                  this.useSRAM = true;
                  value = this.sram.getInt8(address - 16384);
                } else {
                  value = this.rom[this.frameReg[2]].getInt8(address - 32768);
                }
              }
            } else {
              if (address < 57344) {
                value = this.memWriteMap.getInt8(address - 49152);
              } else {
                if (address < 65532) {
                  value = this.memWriteMap.getInt8(address - 57344);
                } else {
                  if (address === 65532) {
                    return this.frameReg[3];
                  } else {
                    if (address === 65533) {
                      return this.frameReg[0];
                    } else {
                      if (address === 65534) {
                        return this.frameReg[1];
                      } else {
                        if (address === 65535) {
                          return this.frameReg[2];
                        } else {
                          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return value + 1;
    };
  } else {
    return function getInt8(address) {
      var value = 0;
      if (address < 1024) {
        value = this.rom[0][address];
      } else {
        if (address < 16384) {
          value = this.rom[this.frameReg[0]][address];
        } else {
          if (address < 32768) {
            value = this.rom[this.frameReg[1]][address - 16384];
          } else {
            if (address < 49152) {
              if ((this.frameReg[3] & 12) === 8) {
                this.useSRAM = true;
                value = this.sram[address - 32768];
              } else {
                if ((this.frameReg[3] & 12) === 12) {
                  this.useSRAM = true;
                  value = this.sram[address - 16384];
                } else {
                  value = this.rom[this.frameReg[2]][address - 32768];
                }
              }
            } else {
              if (address < 57344) {
                value = this.memWriteMap[address - 49152];
              } else {
                if (address < 65532) {
                  value = this.memWriteMap[address - 57344];
                } else {
                  if (address === 65532) {
                    return this.frameReg[3];
                  } else {
                    if (address === 65533) {
                      return this.frameReg[0];
                    } else {
                      if (address === 65534) {
                        return this.frameReg[1];
                      } else {
                        if (address === 65535) {
                          return this.frameReg[2];
                        } else {
                          JSSMS.Utils.console.error(JSSMS.Utils.toHex(address));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      value += 1;
      if (value >= 128) {
        value = value - 256;
      }
      return value;
    };
  }
}(), hasUsedSRAM:function() {
  return this.useSRAM;
}, setSRAM:function(bytes) {
  var length = bytes.length / PAGE_SIZE;
  var i;
  for (i = 0;i < length;i++) {
    JSSMS.Utils.copyArrayElements(bytes, i * PAGE_SIZE, this.sram[i], 0, PAGE_SIZE);
  }
}, setStateMem:function(state) {
  this.frameReg = state;
}, getState:function() {
  var STATE_LENGTH = 8;
  var state = new Array(STATE_LENGTH);
  state[0] = this.pc | this.sp << 16;
  state[1] = (this.iff1 ? 1 : 0) | (this.iff2 ? 2 : 0) | (this.halt ? 4 : 0) | (this.EI_inst ? 8 : 0) | (this.interruptLine ? 16 : 0);
  state[2] = this.a | this.a2 << 8 | this.f << 16 | this.f2 << 24;
  state[3] = this.getBC() | this.getDE() << 16;
  state[4] = this.getHL() | this.r << 16 | this.i << 24;
  state[5] = this.getIXHIXL() | this.getIYHIYL() << 16;
  this.exBC();
  this.exDE();
  this.exHL();
  state[6] = this.getBC() | this.getDE() << 16;
  state[7] = this.getHL() | this.im << 16 | this.interruptVector << 24;
  this.exBC();
  this.exDE();
  this.exHL();
  return state;
}, setState:function(state) {
  var temp = state[0];
  this.pc = temp & 65535;
  this.sp = temp >> 16 & 65535;
  temp = state[1];
  this.iff1 = (temp & 1) !== 0;
  this.iff2 = (temp & 2) !== 0;
  this.halt = (temp & 4) !== 0;
  this.EI_inst = (temp & 8) !== 0;
  this.interruptLine = (temp & 16) !== 0;
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
  this.setIXHIXL(temp & 65535);
  this.setIYHIYL(temp >> 16 & 65535);
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
JSSMS.Debugger = function() {
};
JSSMS.Debugger.prototype = {instructions:[], resetDebug:function() {
  this.instructions = [];
  this.main.ui.updateStatus("Parsing instructions...");
  this.parseInstructions();
  this.main.ui.updateStatus("Instructions parsed");
}, parseInstructions:function() {
  JSSMS.Utils.console.time("Instructions parsing");
  var romSize = PAGE_SIZE * this.rom.length;
  var instruction;
  var currentAddress;
  var i = 0;
  var addresses = [];
  var entryPoints = [0, 56, 102];
  entryPoints.forEach(function(entryPoint) {
    addresses.push(entryPoint);
  });
  while (addresses.length) {
    currentAddress = addresses.shift();
    if (this.instructions[currentAddress]) {
      continue;
    }
    if (currentAddress >= romSize || currentAddress >> 10 >= 65) {
      JSSMS.Utils.console.log("Invalid address", JSSMS.Utils.toHex(currentAddress));
      continue;
    }
    instruction = this.disassemble(currentAddress);
    this.instructions[currentAddress] = instruction;
    if (instruction.nextAddress !== null) {
      addresses.push(instruction.nextAddress);
    }
    if (instruction.target !== null) {
      addresses.push(instruction.target);
    }
  }
  entryPoints.forEach(function(entryPoint) {
    if (!this.instructions[entryPoint]) {
      return;
    }
    this.instructions[entryPoint].isJumpTarget = true;
  }, this);
  for (;i < romSize;i++) {
    if (!this.instructions[i]) {
      continue;
    }
    if (this.instructions[i].nextAddress !== null && this.instructions[this.instructions[i].nextAddress]) {
      this.instructions[this.instructions[i].nextAddress].jumpTargetNb++;
    }
    if (this.instructions[i].target !== null) {
      if (this.instructions[this.instructions[i].target]) {
        this.instructions[this.instructions[i].target].isJumpTarget = true;
        this.instructions[this.instructions[i].target].jumpTargetNb++;
      } else {
        JSSMS.Utils.console.log("Invalid target address", JSSMS.Utils.toHex(this.instructions[i].target));
      }
    }
  }
  JSSMS.Utils.console.timeEnd("Instructions parsing");
}, writeGraphViz:function() {
  JSSMS.Utils.console.time("DOT generation");
  var tree = this.instructions;
  var INDENT = " ";
  var content = ["digraph G {"];
  for (var i = 0, length = tree.length;i < length;i++) {
    if (!tree[i]) {
      continue;
    }
    content.push(INDENT + i + ' [label="' + tree[i].label + '"];');
    if (tree[i].target !== null) {
      content.push(INDENT + i + " -> " + tree[i].target + ";");
    }
    if (tree[i].nextAddress !== null) {
      content.push(INDENT + i + " -> " + tree[i].nextAddress + ";");
    }
  }
  content.push("}");
  content = content.join("\n");
  content = content.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  JSSMS.Utils.console.timeEnd("DOT generation");
  return content;
}, writeJavaScript:function() {
  JSSMS.Utils.console.time("JavaScript generation");
  var tree = this.instructions;
  var toHex = JSSMS.Utils.toHex;
  var tstates = 0;
  var prevAddress = 0;
  var prevNextAddress = 0;
  var breakNeeded = false;
  var pageBreakPoint = 1024;
  var pageNumber = 0;
  var i = 0, length = 0;
  var code = ['"": {', '"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'];
  for (i = 0, length = tree.length;i < length;i++) {
    if (!tree[i]) {
      continue;
    }
    if (prevAddress <= pageBreakPoint && tree[i].address >= pageBreakPoint) {
      code.push("this.pc = " + toHex(tree[i].address) + ";");
      code.push("}");
      code.push("},");
      code.push("" + pageNumber + ": {");
      code.push('"": function() {');
      code.push('throw "Bad address: " + JSSMS.Utils.toHex(this.pc);');
      breakNeeded = true;
      pageNumber++;
      pageBreakPoint = pageNumber * PAGE_SIZE;
    }
    if (tree[i].isJumpTarget || prevNextAddress !== tree[i].address || breakNeeded) {
      insertTStates();
      if (prevNextAddress && !breakNeeded) {
        code.push("this.pc = " + toHex(prevNextAddress) + ";");
      }
      code.push("},");
      code.push("" + toHex(tree[i].address) + ": function(temp, location) {");
    }
    code.push("// " + tree[i].label);
    breakNeeded = tree[i].code.substr(-7) === "return;";
    tstates += getTotalTStates(tree[i].opcodes);
    if (/return;/.test(tree[i].code) || /this\.tstates/.test(tree[i].code)) {
      insertTStates();
    }
    if (tree[i].code !== "") {
      code.push(tree[i].code);
    }
    prevAddress = tree[i].address;
    prevNextAddress = tree[i].nextAddress;
  }
  code.push("}");
  code.push("}");
  code = code.join("\n");
  JSSMS.Utils.console.timeEnd("JavaScript generation");
  return code;
  function getTotalTStates(opcodes) {
    var tstates = 0;
    switch(opcodes[0]) {
      case 203:
        tstates = OP_CB_STATES[opcodes[1]];
        break;
      case 221:
      ;
      case 253:
        if (opcodes.length === 2) {
          tstates = OP_DD_STATES[opcodes[1]];
        } else {
          tstates = OP_INDEX_CB_STATES[opcodes[2]];
        }
        break;
      case 237:
        tstates = OP_ED_STATES[opcodes[1]];
        break;
      default:
        tstates = OP_STATES[opcodes[0]];
        break;
    }
    return tstates;
  }
  function insertTStates() {
    if (tstates) {
      code.push("this.tstates -= " + toHex(tstates) + ";");
    }
    tstates = 0;
  }
}, disassemble:function(address) {
  var toHex = JSSMS.Utils.toHex;
  var opcode = this.readRom8bit(address);
  var opcodesArray = [opcode];
  var inst = "Unknown Opcode";
  var currAddr = address;
  var target = null;
  var code = 'throw "Unimplemented opcode ' + toHex(opcode) + '";';
  var operand = "";
  var location = 0;
  address++;
  var _inst = {};
  switch(opcode) {
    case 0:
      inst = "NOP";
      code = "";
      break;
    case 1:
      operand = toHex(this.readRom16bit(address));
      inst = "LD BC," + operand;
      code = "this.setBC(" + operand + ");";
      address += 2;
      break;
    case 2:
      inst = "LD (BC),A";
      code = "this.setUint8(this.getBC(), this.a);";
      break;
    case 3:
      inst = "INC BC";
      code = "this.incBC();";
      break;
    case 4:
      inst = "INC B";
      code = "this.b = this.inc8(this.b);";
      break;
    case 5:
      inst = "DEC B";
      code = "this.b = this.dec8(this.b);";
      break;
    case 6:
      operand = toHex(this.readRom8bit(address));
      inst = "LD B," + operand;
      code = "this.b = " + operand + ";";
      address++;
      break;
    case 7:
      inst = "RLCA";
      code = "this.rlca_a();";
      break;
    case 8:
      inst = "EX AF AF'";
      code = "this.exAF();";
      break;
    case 9:
      inst = "ADD HL,BC";
      code = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      inst = "LD A,(BC)";
      code = "this.a = this.getUint8(this.getBC());";
      break;
    case 11:
      inst = "DEC BC";
      code = "this.decBC();";
      break;
    case 12:
      inst = "INC C";
      code = "this.c = this.inc8(this.c);";
      break;
    case 13:
      inst = "DEC C";
      code = "this.c = this.dec8(this.c);";
      break;
    case 14:
      operand = toHex(this.readRom8bit(address));
      inst = "LD C," + operand;
      code = "this.c = " + operand + ";";
      address++;
      break;
    case 15:
      inst = "RRCA";
      code = "this.rrca_a();";
      break;
    case 16:
      target = address + this.signExtend(this.readRom8bit(address) + 1);
      inst = "DJNZ (" + toHex(target) + ")";
      code = "this.b = this.b - 0x01 & 0xFF;" + "if (this.b !== 0x00) {" + "this.tstates -= 0x05;" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address++;
      break;
    case 17:
      operand = toHex(this.readRom16bit(address));
      inst = "LD DE," + operand;
      code = "this.setDE(" + operand + ");";
      address += 2;
      break;
    case 18:
      inst = "LD (DE),A";
      code = "this.setUint8(this.getDE(), this.a);";
      break;
    case 19:
      inst = "INC DE";
      code = "this.incDE();";
      break;
    case 20:
      inst = "INC D";
      code = "this.d = this.inc8(this.d);";
      break;
    case 21:
      inst = "DEC D";
      code = "this.d = this.dec8(this.d);";
      break;
    case 22:
      operand = toHex(this.readRom8bit(address));
      inst = "LD D," + operand;
      code = "this.d = " + operand + ";";
      address++;
      break;
    case 23:
      inst = "RLA";
      code = "this.rla_a();";
      break;
    case 24:
      target = address + this.signExtend(this.readRom8bit(address) + 1);
      inst = "JR (" + toHex(target) + ")";
      code = "this.pc = " + toHex(target) + "; return;";
      address = null;
      break;
    case 25:
      inst = "ADD HL,DE";
      code = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      inst = "LD A,(DE)";
      code = "this.a = this.getUint8(this.getDE());";
      break;
    case 27:
      inst = "DEC DE";
      code = "this.decDE();";
      break;
    case 28:
      inst = "INC E";
      code = "this.e = this.inc8(this.e);";
      break;
    case 29:
      inst = "DEC E";
      code = "this.e = this.dec8(this.e);";
      break;
    case 30:
      operand = toHex(this.readRom8bit(address));
      inst = "LD E," + operand;
      code = "this.e = " + operand + ";";
      address++;
      break;
    case 31:
      inst = "RRA";
      code = "this.rra_a();";
      break;
    case 32:
      target = address + this.signExtend(this.readRom8bit(address) + 1);
      inst = "JR NZ,(" + toHex(target) + ")";
      code = "if (!((this.f & F_ZERO) !== 0x00)) {" + "this.tstates -= 0x05;" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address++;
      break;
    case 33:
      operand = toHex(this.readRom16bit(address));
      inst = "LD HL," + operand;
      code = "this.setHL(" + operand + ");";
      address += 2;
      break;
    case 34:
      location = this.readRom16bit(address);
      operand = toHex(location);
      inst = "LD (" + operand + "),HL";
      code = "this.setUint8(" + operand + ", this.l);" + "this.setUint8(" + toHex(location + 1) + ", this.h);";
      address += 2;
      break;
    case 35:
      inst = "INC HL";
      code = "this.incHL();";
      break;
    case 36:
      inst = "INC H";
      code = "this.h = this.inc8(this.h);";
      break;
    case 37:
      inst = "DEC H";
      code = "this.h = this.dec8(this.h);";
      break;
    case 38:
      operand = toHex(this.readRom8bit(address));
      inst = "LD H," + operand;
      code = "this.h = " + operand + ";";
      address++;
      break;
    case 39:
      inst = "DAA";
      code = "this.daa();";
      break;
    case 40:
      target = address + this.signExtend(this.readRom8bit(address) + 1);
      inst = "JR Z,(" + toHex(target) + ")";
      code = "if ((this.f & F_ZERO) !== 0x00) {" + "this.tstates -= 0x05;" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address++;
      break;
    case 41:
      inst = "ADD HL,HL";
      code = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      operand = toHex(this.readRom16bit(address));
      inst = "LD HL,(" + operand + ")";
      code = "this.setHL(this.getUint16(" + operand + "));";
      address += 2;
      break;
    case 43:
      inst = "DEC HL";
      code = "this.decHL();";
      break;
    case 44:
      inst = "INC L";
      code = "this.l = this.inc8(this.l);";
      break;
    case 45:
      inst = "DEC L";
      code = "this.l = this.dec8(this.l);";
      break;
    case 46:
      operand = toHex(this.readRom8bit(address));
      inst = "LD L," + operand;
      code = "this.l = " + operand + ";";
      address++;
      break;
    case 47:
      inst = "CPL";
      code = "this.cpl_a();";
      break;
    case 48:
      target = address + this.signExtend(this.readRom8bit(address) + 1);
      inst = "JR NC,(" + toHex(target) + ")";
      code = "if (!((this.f & F_CARRY) !== 0x00)) {" + "this.tstates -= 0x05;" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address++;
      break;
    case 49:
      operand = toHex(this.readRom16bit(address));
      inst = "LD SP," + operand;
      code = "this.sp = " + operand + ";";
      address += 2;
      break;
    case 50:
      operand = toHex(this.readRom16bit(address));
      inst = "LD (" + operand + "),A";
      code = "this.setUint8(" + operand + ", this.a);";
      address += 2;
      break;
    case 51:
      inst = "INC SP";
      code = "this.sp++;";
      break;
    case 52:
      inst = "INC (HL)";
      code = "this.incMem(this.getHL());";
      break;
    case 53:
      inst = "DEC (HL)";
      code = "this.decMem(this.getHL());";
      break;
    case 54:
      operand = toHex(this.readRom8bit(address));
      inst = "LD (HL)," + operand;
      code = "this.setUint8(this.getHL(), " + operand + ");";
      address++;
      break;
    case 55:
      inst = "SCF";
      code = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      target = address + this.signExtend(this.readRom8bit(address) + 1);
      inst = "JR C,(" + toHex(target) + ")";
      code = "if ((this.f & F_CARRY) !== 0x00) {" + "this.tstates -= 0x05;" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address++;
      break;
    case 57:
      inst = "ADD HL,SP";
      code = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      operand = toHex(this.readRom16bit(address));
      inst = "LD A,(" + operand + ")";
      code = "this.a = this.getUint8(" + operand + ");";
      address += 2;
      break;
    case 59:
      inst = "DEC SP";
      code = "this.sp--;";
      break;
    case 60:
      inst = "INC A";
      code = "this.a = this.inc8(this.a);";
      break;
    case 61:
      inst = "DEC A";
      code = "this.a = this.dec8(this.a);";
      break;
    case 62:
      operand = toHex(this.readRom8bit(address));
      inst = "LD A," + operand;
      code = "this.a = " + operand + ";";
      address++;
      break;
    case 63:
      inst = "CCF";
      code = "this.ccf();";
      break;
    case 64:
      inst = "LD B,B";
      code = "";
      break;
    case 65:
      inst = "LD B,C";
      code = "this.b = this.c;";
      break;
    case 66:
      inst = "LD B,D";
      code = "this.b = this.d;";
      break;
    case 67:
      inst = "LD B,E";
      code = "this.b = this.e;";
      break;
    case 68:
      inst = "LD B,H";
      code = "this.b = this.h;";
      break;
    case 69:
      inst = "LD B,L";
      code = "this.b = this.l;";
      break;
    case 70:
      inst = "LD B,(HL)";
      code = "this.b = this.getUint8(this.getHL());";
      break;
    case 71:
      inst = "LD B,A";
      code = "this.b = this.a;";
      break;
    case 72:
      inst = "LD C,B";
      code = "this.c = this.b;";
      break;
    case 73:
      inst = "LD C,C";
      code = "";
      break;
    case 74:
      inst = "LD C,D";
      code = "this.c = this.d;";
      break;
    case 75:
      inst = "LD C,E";
      code = "this.c = this.e;";
      break;
    case 76:
      inst = "LD C,H";
      code = "this.c = this.h;";
      break;
    case 77:
      inst = "LD C,L";
      code = "this.c = this.l;";
      break;
    case 78:
      inst = "LD C,(HL)";
      code = "this.c = this.getUint8(this.getHL());";
      break;
    case 79:
      inst = "LD C,A";
      code = "this.c = this.a;";
      break;
    case 80:
      inst = "LD D,B";
      code = "this.d = this.b;";
      break;
    case 81:
      inst = "LD D,C";
      code = "this.d = this.c;";
      break;
    case 82:
      inst = "LD D,D";
      code = "";
      break;
    case 83:
      inst = "LD D,E";
      code = "this.d = this.e;";
      break;
    case 84:
      inst = "LD D,H";
      code = "this.d = this.h;";
      break;
    case 85:
      inst = "LD D,L";
      code = "this.d = this.l;";
      break;
    case 86:
      inst = "LD D,(HL)";
      code = "this.d = this.getUint8(this.getHL());";
      break;
    case 87:
      inst = "LD D,A";
      code = "this.d = this.a;";
      break;
    case 88:
      inst = "LD E,B";
      code = "this.e = this.b;";
      break;
    case 89:
      inst = "LD E,C";
      code = "this.e = this.c;";
      break;
    case 90:
      inst = "LD E,D";
      code = "this.e = this.d;";
      break;
    case 91:
      inst = "LD E,E";
      code = "";
      break;
    case 92:
      inst = "LD E,H";
      code = "this.e = this.h;";
      break;
    case 93:
      inst = "LD E,L";
      code = "this.e = this.l;";
      break;
    case 94:
      inst = "LD E,(HL)";
      code = "this.e = this.getUint8(this.getHL());";
      break;
    case 95:
      inst = "LD E,A";
      code = "this.e = this.a;";
      break;
    case 96:
      inst = "LD H,B";
      code = "this.h = this.b;";
      break;
    case 97:
      inst = "LD H,C";
      code = "this.h = this.c;";
      break;
    case 98:
      inst = "LD H,D";
      code = "this.h = this.d;";
      break;
    case 99:
      inst = "LD H,E";
      code = "this.h = this.e;";
      break;
    case 100:
      inst = "LD H,H";
      code = "";
      break;
    case 101:
      inst = "LD H,L";
      code = "this.h = this.l;";
      break;
    case 102:
      inst = "LD H,(HL)";
      code = "this.h = this.getUint8(this.getHL());";
      break;
    case 103:
      inst = "LD H,A";
      code = "this.h = this.a;";
      break;
    case 104:
      inst = "LD L,B";
      code = "this.l = this.b;";
      break;
    case 105:
      inst = "LD L,C";
      code = "this.l = this.c;";
      break;
    case 106:
      inst = "LD L,D";
      code = "this.l = this.d;";
      break;
    case 107:
      inst = "LD L,E";
      code = "this.l = this.e;";
      break;
    case 108:
      inst = "LD L,H";
      code = "this.l = this.h;";
      break;
    case 109:
      inst = "LD L,L";
      code = "";
      break;
    case 110:
      inst = "LD L,(HL)";
      code = "this.l = this.getUint8(this.getHL());";
      break;
    case 111:
      inst = "LD L,A";
      code = "this.l = this.a;";
      break;
    case 112:
      inst = "LD (HL),B";
      code = "this.setUint8(this.getHL(), this.b);";
      break;
    case 113:
      inst = "LD (HL),C";
      code = "this.setUint8(this.getHL(), this.c);";
      break;
    case 114:
      inst = "LD (HL),D";
      code = "this.setUint8(this.getHL(), this.d);";
      break;
    case 115:
      inst = "LD (HL),E";
      code = "this.setUint8(this.getHL(), this.e);";
      break;
    case 116:
      inst = "LD (HL),H";
      code = "this.setUint8(this.getHL(), this.h);";
      break;
    case 117:
      inst = "LD (HL),L";
      code = "this.setUint8(this.getHL(), this.l);";
      break;
    case 118:
      inst = "HALT";
      if (HALT_SPEEDUP) {
        code = "this.tstates = 0x00;";
      } else {
        code = "";
      }
      code += "this.halt = true; this.pc = " + toHex(address - 1) + "; return;";
      break;
    case 119:
      inst = "LD (HL),A";
      code = "this.setUint8(this.getHL(), this.a);";
      break;
    case 120:
      inst = "LD A,B";
      code = "this.a = this.b;";
      break;
    case 121:
      inst = "LD A,C";
      code = "this.a = this.c;";
      break;
    case 122:
      inst = "LD A,D";
      code = "this.a = this.d;";
      break;
    case 123:
      inst = "LD A,E";
      code = "this.a = this.e;";
      break;
    case 124:
      inst = "LD A,H";
      code = "this.a = this.h;";
      break;
    case 125:
      inst = "LD A,L";
      code = "this.a = this.l;";
      break;
    case 126:
      inst = "LD A,(HL)";
      code = "this.a = this.getUint8(this.getHL());";
      break;
    case 127:
      inst = "LD A,A";
      code = "";
      break;
    case 128:
      inst = "ADD A,B";
      code = "this.add_a(this.b);";
      break;
    case 129:
      inst = "ADD A,C";
      code = "this.add_a(this.c);";
      break;
    case 130:
      inst = "ADD A,D";
      code = "this.add_a(this.d);";
      break;
    case 131:
      inst = "ADD A,E";
      code = "this.add_a(this.e);";
      break;
    case 132:
      inst = "ADD A,H";
      code = "this.add_a(this.h);";
      break;
    case 133:
      inst = "ADD A,L";
      code = "this.add_a(this.l);";
      break;
    case 134:
      inst = "ADD A,(HL)";
      code = "this.add_a(this.getUint8(this.getHL()));";
      break;
    case 135:
      inst = "ADD A,A";
      code = "this.add_a(this.a);";
      break;
    case 136:
      inst = "ADC A,B";
      code = "this.adc_a(this.b);";
      break;
    case 137:
      inst = "ADC A,C";
      code = "this.adc_a(this.c);";
      break;
    case 138:
      inst = "ADC A,D";
      code = "this.adc_a(this.d);";
      break;
    case 139:
      inst = "ADC A,E";
      code = "this.adc_a(this.e);";
      break;
    case 140:
      inst = "ADC A,H";
      code = "this.adc_a(this.h);";
      break;
    case 141:
      inst = "ADC A,L";
      code = "this.adc_a(this.l);";
      break;
    case 142:
      inst = "ADC A,(HL)";
      code = "this.adc_a(this.getUint8(this.getHL()));";
      break;
    case 143:
      inst = "ADC A,A";
      code = "this.adc_a(this.a);";
      break;
    case 144:
      inst = "SUB A,B";
      code = "this.sub_a(this.b);";
      break;
    case 145:
      inst = "SUB A,C";
      code = "this.sub_a(this.c);";
      break;
    case 146:
      inst = "SUB A,D";
      code = "this.sub_a(this.d);";
      break;
    case 147:
      inst = "SUB A,E";
      code = "this.sub_a(this.e);";
      break;
    case 148:
      inst = "SUB A,H";
      code = "this.sub_a(this.h);";
      break;
    case 149:
      inst = "SUB A,L";
      code = "this.sub_a(this.l);";
      break;
    case 150:
      inst = "SUB A,(HL)";
      code = "this.sub_a(this.getUint8(this.getHL()));";
      break;
    case 151:
      inst = "SUB A,A";
      code = "this.sub_a(this.a);";
      break;
    case 152:
      inst = "SBC A,B";
      code = "this.sbc_a(this.b);";
      break;
    case 153:
      inst = "SBC A,C";
      code = "this.sbc_a(this.c);";
      break;
    case 154:
      inst = "SBC A,D";
      code = "this.sbc_a(this.d);";
      break;
    case 155:
      inst = "SBC A,E";
      code = "this.sbc_a(this.e);";
      break;
    case 156:
      inst = "SBC A,H";
      code = "this.sbc_a(this.h);";
      break;
    case 157:
      inst = "SBC A,L";
      code = "this.sbc_a(this.l);";
      break;
    case 158:
      inst = "SBC A,(HL)";
      code = "this.sbc_a(this.getUint8(this.getHL()));";
      break;
    case 159:
      inst = "SBC A,A";
      code = "this.sbc_a(this.a);";
      break;
    case 160:
      inst = "AND A,B";
      code = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      inst = "AND A,C";
      code = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      inst = "AND A,D";
      code = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      inst = "AND A,E";
      code = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      inst = "AND A,H";
      code = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      inst = "AND A,L";
      code = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      inst = "AND A,(HL)";
      code = "this.f = this.SZP_TABLE[this.a &= this.getUint8(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      inst = "AND A,A";
      code = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      inst = "XOR A,B";
      code = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      inst = "XOR A,C";
      code = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      inst = "XOR A,D";
      code = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      inst = "XOR A,E";
      code = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      inst = "XOR A,H";
      code = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      inst = "XOR A,L";
      code = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      inst = "XOR A,(HL)";
      code = "this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.getHL())];";
      break;
    case 175:
      inst = "XOR A,A";
      code = "this.a = " + toHex(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      inst = "OR A,B";
      code = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      inst = "OR A,C";
      code = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      inst = "OR A,D";
      code = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      inst = "OR A,E";
      code = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      inst = "OR A,H";
      code = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      inst = "OR A,L";
      code = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      inst = "OR A,(HL)";
      code = "this.f = this.SZP_TABLE[this.a |= this.getUint8(this.getHL())];";
      break;
    case 183:
      inst = "OR A,A";
      code = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      inst = "CP A,B";
      code = "this.cp_a(this.b);";
      break;
    case 185:
      inst = "CP A,C";
      code = "this.cp_a(this.c);";
      break;
    case 186:
      inst = "CP A,D";
      code = "this.cp_a(this.d);";
      break;
    case 187:
      inst = "CP A,E";
      code = "this.cp_a(this.e);";
      break;
    case 188:
      inst = "CP A,H";
      code = "this.cp_a(this.h);";
      break;
    case 189:
      inst = "CP A,L";
      code = "this.cp_a(this.l);";
      break;
    case 190:
      inst = "CP A,(HL)";
      code = "this.cp_a(this.getUint8(this.getHL()));";
      break;
    case 191:
      inst = "CP A,A";
      code = "this.cp_a(this.a);";
      break;
    case 192:
      inst = "RET NZ";
      code = "if ((this.f & F_ZERO) === 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 193:
      inst = "POP BC";
      code = "this.setBC(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      target = this.readRom16bit(address);
      inst = "JP NZ,(" + toHex(target) + ")";
      code = "if ((this.f & F_ZERO) === 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 195:
      target = this.readRom16bit(address);
      inst = "JP (" + toHex(target) + ")";
      code = "this.pc = " + toHex(target) + "; return;";
      address = null;
      break;
    case 196:
      target = this.readRom16bit(address);
      inst = "CALL NZ (" + toHex(target) + ")";
      code = "if ((this.f & F_ZERO) === 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 197:
      inst = "PUSH BC";
      code = "this.push2(this.b, this.c);";
      break;
    case 198:
      operand = toHex(this.readRom8bit(address));
      inst = "ADD A," + operand;
      code = "this.add_a(" + operand + ");";
      address++;
      break;
    case 199:
      target = 0;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 200:
      inst = "RET Z";
      code = "if ((this.f & F_ZERO) !== 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 201:
      inst = "RET";
      code = "this.pc = this.getUint16(this.sp); this.sp += 0x02; return;";
      address = null;
      break;
    case 202:
      target = this.readRom16bit(address);
      inst = "JP Z,(" + toHex(target) + ")";
      code = "if ((this.f & F_ZERO) !== 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 203:
      _inst = this.getCB(address);
      inst = _inst.inst;
      code = _inst.code;
      opcodesArray = opcodesArray.concat(_inst.opcodes);
      address = _inst.nextAddress;
      break;
    case 204:
      target = this.readRom16bit(address);
      inst = "CALL Z (" + toHex(target) + ")";
      code = "if ((this.f & F_ZERO) !== 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 205:
      target = this.readRom16bit(address);
      inst = "CALL (" + toHex(target) + ")";
      code = "this.push1(" + toHex(address + 2) + "); this.pc = " + toHex(target) + "; return;";
      address += 2;
      break;
    case 206:
      operand = toHex(this.readRom8bit(address));
      inst = "ADC ," + operand;
      code = "this.adc_a(" + operand + ");";
      address++;
      break;
    case 207:
      target = 8;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 208:
      inst = "RET NC";
      code = "if ((this.f & F_CARRY) === 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 209:
      inst = "POP DE";
      code = "this.setDE(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      target = this.readRom16bit(address);
      inst = "JP NC,(" + toHex(target) + ")";
      code = "if ((this.f & F_CARRY) === 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 211:
      operand = this.readRom8bit(address);
      inst = "OUT (" + toHex(operand) + "),A";
      code = this.peepholePortOut(operand);
      address++;
      break;
    case 212:
      target = this.readRom16bit(address);
      inst = "CALL NC (" + toHex(target) + ")";
      code = "if ((this.f & F_CARRY) === 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 213:
      inst = "PUSH DE";
      code = "this.push2(this.d, this.e);";
      break;
    case 214:
      operand = toHex(this.readRom8bit(address));
      inst = "SUB " + operand;
      code = "this.sub_a(" + operand + ");";
      address++;
      break;
    case 215:
      target = 16;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 216:
      inst = "RET C";
      code = "if ((this.f & F_CARRY) !== 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 217:
      inst = "EXX";
      code = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      target = this.readRom16bit(address);
      inst = "JP C,(" + toHex(target) + ")";
      code = "if ((this.f & F_CARRY) !== 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 219:
      operand = this.readRom8bit(address);
      inst = "IN A,(" + toHex(operand) + ")";
      code = this.peepholePortIn(operand);
      address++;
      break;
    case 220:
      target = this.readRom16bit(address);
      inst = "CALL C (" + toHex(target) + ")";
      code = "if ((this.f & F_CARRY) !== 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 221:
      _inst = this.getIndexOpIX(address);
      inst = _inst.inst;
      code = _inst.code;
      opcodesArray = opcodesArray.concat(_inst.opcodes);
      address = _inst.nextAddress;
      break;
    case 222:
      operand = toHex(this.readRom8bit(address));
      inst = "SBC A," + operand;
      code = "this.sbc_a(" + operand + ");";
      address++;
      break;
    case 223:
      target = 24;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 224:
      inst = "RET PO";
      code = "if ((this.f & F_PARITY) === 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 225:
      inst = "POP HL";
      code = "this.setHL(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      target = this.readRom16bit(address);
      inst = "JP PO,(" + toHex(target) + ")";
      code = "if ((this.f & F_PARITY) === 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 227:
      inst = "EX (SP),HL";
      code = "temp = this.h;" + "this.h = this.getUint8(this.sp + 0x01);" + "this.setUint8(this.sp + 0x01, temp);" + "temp = this.l;" + "this.l = this.getUint8(this.sp);" + "this.setUint8(this.sp, temp);";
      break;
    case 228:
      target = this.readRom16bit(address);
      inst = "CALL PO (" + toHex(target) + ")";
      code = "if ((this.f & F_PARITY) === 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 229:
      inst = "PUSH HL";
      code = "this.push2(this.h, this.l);";
      break;
    case 230:
      operand = toHex(this.readRom8bit(address));
      inst = "AND (" + operand + ")";
      code = "this.f = this.SZP_TABLE[this.a &= " + operand + "] | F_HALFCARRY;";
      address++;
      break;
    case 231:
      target = 32;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 232:
      inst = "RET PE";
      code = "if ((this.f & F_PARITY) !== 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 233:
      inst = "JP (HL)";
      code = "this.pc = this.getHL(); return;";
      address = null;
      break;
    case 234:
      target = this.readRom16bit(address);
      inst = "JP PE,(" + toHex(target) + ")";
      code = "if ((this.f & F_PARITY) !== 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 235:
      inst = "EX DE,HL";
      code = "temp = this.d;" + "this.d = this.h;" + "this.h = temp;" + "temp = this.e;" + "this.e = this.l;" + "this.l = temp;";
      break;
    case 236:
      target = this.readRom16bit(address);
      inst = "CALL PE (" + toHex(target) + ")";
      code = "if ((this.f & F_PARITY) !== 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 237:
      _inst = this.getED(address);
      target = _inst.target;
      inst = _inst.inst;
      code = _inst.code;
      opcodesArray = opcodesArray.concat(_inst.opcodes);
      address = _inst.nextAddress;
      break;
    case 238:
      operand = toHex(this.readRom8bit(address));
      inst = "XOR " + operand;
      code = "this.f = this.SZP_TABLE[this.a ^= " + operand + "];";
      address++;
      break;
    case 239:
      target = 40;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 240:
      inst = "RET P";
      code = "if ((this.f & F_SIGN) === 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 241:
      inst = "POP AF";
      code = "this.setAF(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      target = this.readRom16bit(address);
      inst = "JP P,(" + toHex(target) + ")";
      code = "if ((this.f & F_SIGN) === 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 243:
      inst = "DI";
      code = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      target = this.readRom16bit(address);
      inst = "CALL P (" + toHex(target) + ")";
      code = "if ((this.f & F_SIGN) === 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 245:
      inst = "PUSH AF";
      code = "this.push2(this.a, this.f);";
      break;
    case 246:
      operand = toHex(this.readRom8bit(address));
      inst = "OR " + operand;
      code = "this.f = this.SZP_TABLE[this.a |= " + operand + "];";
      address++;
      break;
    case 247:
      target = 48;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
    case 248:
      inst = "RET M";
      code = "if ((this.f & F_SIGN) !== 0x00) {" + "this.tstates -= 0x06;" + "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "return;" + "}";
      break;
    case 249:
      inst = "LD SP,HL";
      code = "this.sp = this.getHL()";
      break;
    case 250:
      target = this.readRom16bit(address);
      inst = "JP M,(" + toHex(target) + ")";
      code = "if ((this.f & F_SIGN) !== 0x00) {" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 251:
      inst = "EI";
      code = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      target = this.readRom16bit(address);
      inst = "CALL M (" + toHex(target) + ")";
      code = "if ((this.f & F_SIGN) !== 0x00) {" + "this.tstates -= 0x07;" + "this.push1(" + toHex(address + 2) + ");" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      address += 2;
      break;
    case 253:
      _inst = this.getIndexOpIY(address);
      inst = _inst.inst;
      code = _inst.code;
      opcodesArray = opcodesArray.concat(_inst.opcodes);
      address = _inst.nextAddress;
      break;
    case 254:
      operand = toHex(this.readRom8bit(address));
      inst = "CP " + operand;
      code = "this.cp_a(" + operand + ");";
      address++;
      break;
    case 255:
      target = 56;
      inst = "RST " + toHex(target);
      code = "this.push1(" + toHex(address) + "); this.pc = " + toHex(target) + "; return;";
      break;
  }
  return Instruction({opcode:opcode, opcodes:opcodesArray, inst:inst, code:code, address:currAddr, nextAddress:address, target:target});
}, getCB:function(address) {
  var opcode = this.readRom8bit(address);
  var opcodesArray = [opcode];
  var inst = "Unimplemented 0xCB prefixed opcode";
  var currAddr = address;
  var code = 'throw "Unimplemented 0xCB prefixed opcode";';
  address++;
  switch(opcode) {
    case 0:
      inst = "RLC B";
      code = "this.b = this.rlc(this.b);";
      break;
    case 1:
      inst = "RLC C";
      code = "this.c = this.rlc(this.c);";
      break;
    case 2:
      inst = "RLC D";
      code = "this.d = this.rlc(this.d);";
      break;
    case 3:
      inst = "RLC E";
      code = "this.e = this.rlc(this.e);";
      break;
    case 4:
      inst = "RLC H";
      code = "this.h = this.rlc(this.h);";
      break;
    case 5:
      inst = "RLC L";
      code = "this.l = this.rlc(this.l);";
      break;
    case 6:
      inst = "RLC (HL)";
      code = "this.setUint8(this.getHL(), this.rlc(this.getUint8(this.getHL())));";
      break;
    case 7:
      inst = "RLC A";
      code = "this.a = this.rlc(this.a);";
      break;
    case 8:
      inst = "RRC B";
      code = "this.b = this.rrc(this.b);";
      break;
    case 9:
      inst = "RRC C";
      code = "this.c = this.rrc(this.c);";
      break;
    case 10:
      inst = "RRC D";
      code = "this.d = this.rrc(this.d);";
      break;
    case 11:
      inst = "RRC E";
      code = "this.e = this.rrc(this.e);";
      break;
    case 12:
      inst = "RRC H";
      code = "this.h = this.rrc(this.h);";
      break;
    case 13:
      inst = "RRC L";
      code = "this.l = this.rrc(this.l);";
      break;
    case 14:
      inst = "RRC (HL)";
      code = "this.setUint8(this.getHL(), this.rrc(this.getUint8(this.getHL())));";
      break;
    case 15:
      inst = "RRC A";
      code = "this.a = this.rrc(this.a);";
      break;
    case 16:
      inst = "RL B";
      code = "this.b = this.rl(this.b);";
      break;
    case 17:
      inst = "RL C";
      code = "this.c = this.rl(this.c);";
      break;
    case 18:
      inst = "RL D";
      code = "this.d = this.rl(this.d);";
      break;
    case 19:
      inst = "RL E";
      code = "this.e = this.rl(this.e);";
      break;
    case 20:
      inst = "RL H";
      code = "this.h = this.rl(this.h);";
      break;
    case 21:
      inst = "RL L";
      code = "this.l = this.rl(this.l);";
      break;
    case 22:
      inst = "RL (HL)";
      code = "this.setUint8(this.getHL(), this.rl(this.getUint8(this.getHL())));";
      break;
    case 23:
      inst = "RL A";
      code = "this.a = this.rl(this.a);";
      break;
    case 24:
      inst = "RR B";
      code = "this.b = this.rr(this.b);";
      break;
    case 25:
      inst = "RR C";
      code = "this.c = this.rr(this.c);";
      break;
    case 26:
      inst = "RR D";
      code = "this.d = this.rr(this.d);";
      break;
    case 27:
      inst = "RR E";
      code = "this.e = this.rr(this.e);";
      break;
    case 28:
      inst = "RR H";
      code = "this.h = this.rr(this.h);";
      break;
    case 29:
      inst = "RR L";
      code = "this.l = this.rr(this.l);";
      break;
    case 30:
      inst = "RR (HL)";
      code = "this.setUint8(this.getHL(), this.rr(this.getUint8(this.getHL())));";
      break;
    case 31:
      inst = "RR A";
      code = "this.a = this.rr(this.a);";
      break;
    case 32:
      inst = "SLA B";
      code = "this.b = this.sla(this.b);";
      break;
    case 33:
      inst = "SLA C";
      code = "this.c = this.sla(this.c);";
      break;
    case 34:
      inst = "SLA D";
      code = "this.d = this.sla(this.d);";
      break;
    case 35:
      inst = "SLA E";
      code = "this.e = this.sla(this.e);";
      break;
    case 36:
      inst = "SLA H";
      code = "this.h = this.sla(this.h);";
      break;
    case 37:
      inst = "SLA L";
      code = "this.l = this.sla(this.l);";
      break;
    case 38:
      inst = "SLA (HL)";
      code = "this.setUint8(this.getHL(), this.sla(this.getUint8(this.getHL())));";
      break;
    case 39:
      inst = "SLA A";
      code = "this.a = this.sla(this.a);";
      break;
    case 40:
      inst = "SRA B";
      code = "this.b = this.sra(this.b);";
      break;
    case 41:
      inst = "SRA C";
      code = "this.c = this.sra(this.c);";
      break;
    case 42:
      inst = "SRA D";
      code = "this.d = this.sra(this.d);";
      break;
    case 43:
      inst = "SRA E";
      code = "this.e = this.sra(this.e);";
      break;
    case 44:
      inst = "SRA H";
      code = "this.h = this.sra(this.h);";
      break;
    case 45:
      inst = "SRA L";
      code = "this.l = this.sra(this.l);";
      break;
    case 46:
      inst = "SRA (HL)";
      code = "this.setUint8(this.getHL(), this.sra(this.getUint8(this.getHL())));";
      break;
    case 47:
      inst = "SRA A";
      code = "this.a = this.sra(this.a);";
      break;
    case 48:
      inst = "SLL B";
      code = "this.b = this.sll(this.b);";
      break;
    case 49:
      inst = "SLL C";
      code = "this.c = this.sll(this.c);";
      break;
    case 50:
      inst = "SLL D";
      code = "this.d = this.sll(this.d);";
      break;
    case 51:
      inst = "SLL E";
      code = "this.e = this.sll(this.e);";
      break;
    case 52:
      inst = "SLL H";
      code = "this.h = this.sll(this.h);";
      break;
    case 53:
      inst = "SLL L";
      code = "this.l = this.sll(this.l);";
      break;
    case 54:
      inst = "SLL (HL)";
      code = "this.setUint8(this.getHL(), this.sll(this.getUint8(this.getHL())));";
      break;
    case 55:
      inst = "SLL A";
      code = "this.a = this.sll(this.a);";
      break;
    case 56:
      inst = "SRL B";
      code = "this.b = this.srl(this.b);";
      break;
    case 57:
      inst = "SRL C";
      code = "this.c = this.srl(this.c);";
      break;
    case 58:
      inst = "SRL D";
      code = "this.d = this.srl(this.d);";
      break;
    case 59:
      inst = "SRL E";
      code = "this.e = this.srl(this.e);";
      break;
    case 60:
      inst = "SRL H";
      code = "this.h = this.srl(this.h);";
      break;
    case 61:
      inst = "SRL L";
      code = "this.l = this.srl(this.l);";
      break;
    case 62:
      inst = "SRL (HL)";
      code = "this.setUint8(this.getHL(), this.srl(this.getUint8(this.getHL())));";
      break;
    case 63:
      inst = "SRL A";
      code = "this.a = this.srl(this.a);";
      break;
    case 64:
      inst = "BIT 0,B";
      code = "this.bit(this.b & BIT_0);";
      break;
    case 65:
      inst = "BIT 0,C";
      code = "this.bit(this.c & BIT_0);";
      break;
    case 66:
      inst = "BIT 0,D";
      code = "this.bit(this.d & BIT_0);";
      break;
    case 67:
      inst = "BIT 0,E";
      code = "this.bit(this.e & BIT_0);";
      break;
    case 68:
      inst = "BIT 0,H";
      code = "this.bit(this.h & BIT_0);";
      break;
    case 69:
      inst = "BIT 0,L";
      code = "this.bit(this.l & BIT_0);";
      break;
    case 70:
      inst = "BIT 0,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_0);";
      break;
    case 71:
      inst = "BIT 0,A";
      code = "this.bit(this.a & BIT_0);";
      break;
    case 72:
      inst = "BIT 1,B";
      code = "this.bit(this.b & BIT_1);";
      break;
    case 73:
      inst = "BIT 1,C";
      code = "this.bit(this.c & BIT_1);";
      break;
    case 74:
      inst = "BIT 1,D";
      code = "this.bit(this.d & BIT_1);";
      break;
    case 75:
      inst = "BIT 1,E";
      code = "this.bit(this.e & BIT_1);";
      break;
    case 76:
      inst = "BIT 1,H";
      code = "this.bit(this.h & BIT_1);";
      break;
    case 77:
      inst = "BIT 1,L";
      code = "this.bit(this.l & BIT_1);";
      break;
    case 78:
      inst = "BIT 1,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_1);";
      break;
    case 79:
      inst = "BIT 1,A";
      code = "this.bit(this.a & BIT_1);";
      break;
    case 80:
      inst = "BIT 2,B";
      code = "this.bit(this.b & BIT_2);";
      break;
    case 81:
      inst = "BIT 2,C";
      code = "this.bit(this.c & BIT_2);";
      break;
    case 82:
      inst = "BIT 2,D";
      code = "this.bit(this.d & BIT_2);";
      break;
    case 83:
      inst = "BIT 2,E";
      code = "this.bit(this.e & BIT_2);";
      break;
    case 84:
      inst = "BIT 2,H";
      code = "this.bit(this.h & BIT_2);";
      break;
    case 85:
      inst = "BIT 2,L";
      code = "this.bit(this.l & BIT_2);";
      break;
    case 86:
      inst = "BIT 2,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_2);";
      break;
    case 87:
      inst = "BIT 2,A";
      code = "this.bit(this.a & BIT_2);";
      break;
    case 88:
      inst = "BIT 3,B";
      code = "this.bit(this.b & BIT_3);";
      break;
    case 89:
      inst = "BIT 3,C";
      code = "this.bit(this.c & BIT_3);";
      break;
    case 90:
      inst = "BIT 3,D";
      code = "this.bit(this.d & BIT_3);";
      break;
    case 91:
      inst = "BIT 3,E";
      code = "this.bit(this.e & BIT_3);";
      break;
    case 92:
      inst = "BIT 3,H";
      code = "this.bit(this.h & BIT_3);";
      break;
    case 93:
      inst = "BIT 3,L";
      code = "this.bit(this.l & BIT_3);";
      break;
    case 94:
      inst = "BIT 3,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_3);";
      break;
    case 95:
      inst = "BIT 3,A";
      code = "this.bit(this.a & BIT_3);";
      break;
    case 96:
      inst = "BIT 4,B";
      code = "this.bit(this.b & BIT_4);";
      break;
    case 97:
      inst = "BIT 4,C";
      code = "this.bit(this.c & BIT_4);";
      break;
    case 98:
      inst = "BIT 4,D";
      code = "this.bit(this.d & BIT_4);";
      break;
    case 99:
      inst = "BIT 4,E";
      code = "this.bit(this.e & BIT_4);";
      break;
    case 100:
      inst = "BIT 4,H";
      code = "this.bit(this.h & BIT_4);";
      break;
    case 101:
      inst = "BIT 4,L";
      code = "this.bit(this.l & BIT_4);";
      break;
    case 102:
      inst = "BIT 4,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_4);";
      break;
    case 103:
      inst = "BIT 4,A";
      code = "this.bit(this.a & BIT_4);";
      break;
    case 104:
      inst = "BIT 5,B";
      code = "this.bit(this.b & BIT_5);";
      break;
    case 105:
      inst = "BIT 5,C";
      code = "this.bit(this.c & BIT_5);";
      break;
    case 106:
      inst = "BIT 5,D";
      code = "this.bit(this.d & BIT_5);";
      break;
    case 107:
      inst = "BIT 5,E";
      code = "this.bit(this.e & BIT_5);";
      break;
    case 108:
      inst = "BIT 5,H";
      code = "this.bit(this.h & BIT_5);";
      break;
    case 109:
      inst = "BIT 5,L";
      code = "this.bit(this.l & BIT_5);";
      break;
    case 110:
      inst = "BIT 5,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_5);";
      break;
    case 111:
      inst = "BIT 5,A";
      code = "this.bit(this.a & BIT_5);";
      break;
    case 112:
      inst = "BIT 6,B";
      code = "this.bit(this.b & BIT_6);";
      break;
    case 113:
      inst = "BIT 6,C";
      code = "this.bit(this.c & BIT_6);";
      break;
    case 114:
      inst = "BIT 6,D";
      code = "this.bit(this.d & BIT_6);";
      break;
    case 115:
      inst = "BIT 6,E";
      code = "this.bit(this.e & BIT_6);";
      break;
    case 116:
      inst = "BIT 6,H";
      code = "this.bit(this.h & BIT_6);";
      break;
    case 117:
      inst = "BIT 6,L";
      code = "this.bit(this.l & BIT_6);";
      break;
    case 118:
      inst = "BIT 6,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_6);";
      break;
    case 119:
      inst = "BIT 6,A";
      code = "this.bit(this.a & BIT_6);";
      break;
    case 120:
      inst = "BIT 7,B";
      code = "this.bit(this.b & BIT_7);";
      break;
    case 121:
      inst = "BIT 7,C";
      code = "this.bit(this.c & BIT_7);";
      break;
    case 122:
      inst = "BIT 7,D";
      code = "this.bit(this.d & BIT_7);";
      break;
    case 123:
      inst = "BIT 7,E";
      code = "this.bit(this.e & BIT_7);";
      break;
    case 124:
      inst = "BIT 7,H";
      code = "this.bit(this.h & BIT_7);";
      break;
    case 125:
      inst = "BIT 7,L";
      code = "this.bit(this.l & BIT_7);";
      break;
    case 126:
      inst = "BIT 7,(HL)";
      code = "this.bit(this.getUint8(this.getHL()) & BIT_7);";
      break;
    case 127:
      inst = "BIT 7,A";
      code = "this.bit(this.a & BIT_7);";
      break;
    case 128:
      inst = "RES 0,B";
      code = "this.b &= ~BIT_0;";
      break;
    case 129:
      inst = "RES 0,C";
      code = "this.c &= ~BIT_0;";
      break;
    case 130:
      inst = "RES 0,D";
      code = "this.d &= ~BIT_0;";
      break;
    case 131:
      inst = "RES 0,E";
      code = "this.e &= ~BIT_0;";
      break;
    case 132:
      inst = "RES 0,H";
      code = "this.h &= ~BIT_0;";
      break;
    case 133:
      inst = "RES 0,L";
      code = "this.l &= ~BIT_0;";
      break;
    case 134:
      inst = "RES 0,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_0);";
      break;
    case 135:
      inst = "RES 0,A";
      code = "this.a &= ~BIT_0;";
      break;
    case 136:
      inst = "RES 1,B";
      break;
    case 137:
      inst = "RES 1,C";
      break;
    case 138:
      inst = "RES 1,D";
      break;
    case 139:
      inst = "RES 1,E";
      break;
    case 140:
      inst = "RES 1,H";
      break;
    case 141:
      inst = "RES 1,L";
      break;
    case 142:
      inst = "RES 1,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_1);";
      break;
    case 143:
      inst = "RES 1,A";
      break;
    case 144:
      inst = "RES 2,B";
      break;
    case 145:
      inst = "RES 2,C";
      break;
    case 146:
      inst = "RES 2,D";
      break;
    case 147:
      inst = "RES 2,E";
      break;
    case 148:
      inst = "RES 2,H";
      break;
    case 149:
      inst = "RES 2,L";
      break;
    case 150:
      inst = "RES 2,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_2);";
      break;
    case 151:
      inst = "RES 2,A";
      break;
    case 152:
      inst = "RES 3,B";
      break;
    case 153:
      inst = "RES 3,C";
      break;
    case 154:
      inst = "RES 3,D";
      break;
    case 155:
      inst = "RES 3,E";
      break;
    case 156:
      inst = "RES 3,H";
      break;
    case 157:
      inst = "RES 3,L";
      break;
    case 158:
      inst = "RES 3,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_3);";
      break;
    case 159:
      inst = "RES 3,A";
      code = "this.a &= ~BIT_3;";
      break;
    case 160:
      inst = "RES 4,B";
      break;
    case 161:
      inst = "RES 4,C";
      break;
    case 162:
      inst = "RES 4,D";
      break;
    case 163:
      inst = "RES 4,E";
      break;
    case 164:
      inst = "RES 4,H";
      break;
    case 165:
      inst = "RES 4,L";
      break;
    case 166:
      inst = "RES 4,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_4);";
      break;
    case 167:
      inst = "RES 4,A";
      code = "this.a &= ~BIT_4;";
      break;
    case 168:
      inst = "RES 5,B";
      break;
    case 169:
      inst = "RES 5,C";
      break;
    case 170:
      inst = "RES 5,D";
      break;
    case 171:
      inst = "RES 5,E";
      break;
    case 172:
      inst = "RES 5,H";
      break;
    case 173:
      inst = "RES 5,L";
      break;
    case 174:
      inst = "RES 5,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_5);";
      break;
    case 175:
      inst = "RES 5,A";
      break;
    case 176:
      inst = "RES 6,B";
      break;
    case 177:
      inst = "RES 6,C";
      break;
    case 178:
      inst = "RES 6,D";
      break;
    case 179:
      inst = "RES 6,E";
      break;
    case 180:
      inst = "RES 6,H";
      break;
    case 181:
      inst = "RES 6,L";
      break;
    case 182:
      inst = "RES 6,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_6);";
      break;
    case 183:
      inst = "RES 6,A";
      code = "this.a &= ~BIT_6;";
      break;
    case 184:
      inst = "RES 7,B";
      code = "this.b &= ~BIT_7;";
      break;
    case 185:
      inst = "RES 7,C";
      code = "this.c &= ~BIT_7;";
      break;
    case 186:
      inst = "RES 7,D";
      code = "this.d &= ~BIT_7;";
      break;
    case 187:
      inst = "RES 7,E";
      code = "this.e &= ~BIT_7;";
      break;
    case 188:
      inst = "RES 7,H";
      code = "this.h &= ~BIT_7;";
      break;
    case 189:
      inst = "RES 7,L";
      code = "this.l &= ~BIT_7;";
      break;
    case 190:
      inst = "RES 7,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_7);";
      break;
    case 191:
      inst = "RES 7,A";
      code = "this.a &= ~BIT_7;";
      break;
    case 192:
      inst = "SET 0,B";
      code = "this.b |= BIT_0;";
      break;
    case 193:
      inst = "SET 0,C";
      code = "this.c |= BIT_0;";
      break;
    case 194:
      inst = "SET 0,D";
      code = "this.d |= BIT_0;";
      break;
    case 195:
      inst = "SET 0,E";
      code = "this.e |= BIT_0;";
      break;
    case 196:
      inst = "SET 0,H";
      code = "this.h |= BIT_0;";
      break;
    case 197:
      inst = "SET 0,L";
      code = "this.l |= BIT_0;";
      break;
    case 198:
      inst = "SET 0,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_0);";
      break;
    case 199:
      inst = "SET 0,A";
      code = "this.a |= BIT_0;";
      break;
    case 200:
      inst = "SET 1,B";
      break;
    case 201:
      inst = "SET 1,C";
      break;
    case 202:
      inst = "SET 1,D";
      break;
    case 203:
      inst = "SET 1,E";
      break;
    case 204:
      inst = "SET 1,H";
      break;
    case 205:
      inst = "SET 1,L";
      break;
    case 206:
      inst = "SET 1,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_1);";
      break;
    case 207:
      inst = "SET 1,A";
      break;
    case 208:
      inst = "SET 2,B";
      break;
    case 209:
      inst = "SET 2,C";
      break;
    case 210:
      inst = "SET 2,D";
      break;
    case 211:
      inst = "SET 2,E";
      break;
    case 212:
      inst = "SET 2,H";
      break;
    case 213:
      inst = "SET 2,L";
      break;
    case 214:
      inst = "SET 2,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_2)";
      break;
    case 215:
      inst = "SET 2,A";
      break;
    case 216:
      inst = "SET 3,B";
      break;
    case 217:
      inst = "SET 3,C";
      break;
    case 218:
      inst = "SET 3,D";
      break;
    case 219:
      inst = "SET 3,E";
      break;
    case 220:
      inst = "SET 3,H";
      break;
    case 221:
      inst = "SET 3,L";
      break;
    case 222:
      inst = "SET 3,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_3);";
      break;
    case 223:
      inst = "SET 3,A";
      break;
    case 224:
      inst = "SET 4,B";
      break;
    case 225:
      inst = "SET 4,C";
      break;
    case 226:
      inst = "SET 4,D";
      break;
    case 227:
      inst = "SET 4,E";
      break;
    case 228:
      inst = "SET 4,H";
      break;
    case 229:
      inst = "SET 4,L";
      break;
    case 230:
      inst = "SET 4,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_4);";
      break;
    case 231:
      inst = "SET 4,A";
      code = "this.a |= BIT_4;";
      break;
    case 232:
      inst = "SET 5,B";
      break;
    case 233:
      inst = "SET 5,C";
      break;
    case 234:
      inst = "SET 5,D";
      break;
    case 235:
      inst = "SET 5,E";
      break;
    case 236:
      inst = "SET 5,H";
      break;
    case 237:
      inst = "SET 5,L";
      break;
    case 238:
      inst = "SET 5,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_5);";
      break;
    case 239:
      inst = "SET 5,A";
      code = "this.a |= BIT_5;";
      break;
    case 240:
      inst = "SET 6,B";
      code = "this.b |= BIT_6;";
      break;
    case 241:
      inst = "SET 6,C";
      code = "this.c |= BIT_6;";
      break;
    case 242:
      inst = "SET 6,D";
      code = "this.d |= BIT_6;";
      break;
    case 243:
      inst = "SET 6,E";
      code = "this.e |= BIT_6;";
      break;
    case 244:
      inst = "SET 6,H";
      code = "this.h |= BIT_6;";
      break;
    case 245:
      inst = "SET 6,L";
      code = "this.l |= BIT_6;";
      break;
    case 246:
      inst = "SET 6,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_6);";
      break;
    case 247:
      inst = "SET 6,A";
      code = "this.a |= BIT_6;";
      break;
    case 248:
      inst = "SET 7,B";
      code = "this.b |= BIT_7;";
      break;
    case 249:
      inst = "SET 7,C";
      code = "this.c |= BIT_7;";
      break;
    case 250:
      inst = "SET 7,D";
      code = "this.d |= BIT_7;";
      break;
    case 251:
      inst = "SET 7,E";
      code = "this.e |= BIT_7;";
      break;
    case 252:
      inst = "SET 7,H";
      code = "this.h |= BIT_7;";
      break;
    case 253:
      inst = "SET 7,L";
      code = "this.l |= BIT_7;";
      break;
    case 254:
      inst = "SET 7,(HL)";
      code = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_7);";
      break;
    case 255:
      inst = "SET 7,A";
      code = "this.a |= BIT_7;";
      break;
  }
  return {opcode:opcode, opcodes:opcodesArray, inst:inst, code:code, address:currAddr, nextAddress:address};
}, getED:function(address) {
  var toHex = JSSMS.Utils.toHex;
  var opcode = this.readRom8bit(address);
  var opcodesArray = [opcode];
  var inst = "Unimplemented 0xED prefixed opcode";
  var currAddr = address;
  var target = null;
  var code = 'throw "Unimplemented 0xED prefixed opcode";';
  var operand = "";
  var location = 0;
  address++;
  switch(opcode) {
    case 64:
      inst = "IN B,(C)";
      code = "this.b = this.port.in_(this.c);" + "this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
      break;
    case 65:
      inst = "OUT (C),B";
      code = "this.port.out(this.c, this.b);";
      break;
    case 66:
      inst = "SBC HL,BC";
      code = "this.sbc16(this.getBC());";
      break;
    case 67:
      location = this.readRom16bit(address);
      operand = toHex(location);
      inst = "LD (" + operand + "),BC";
      code = "this.setUint8(" + operand + ", this.c);" + "this.setUint8(" + toHex(location + 1) + ", this.b);";
      address += 2;
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
      inst = "NEG";
      code = "temp = this.a;" + "this.a = 0x00;" + "this.sub_a(temp);";
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
      inst = "RETN / RETI";
      code = "this.pc = this.getUint16(this.sp);" + "this.sp += 0x02;" + "this.iff1 = this.iff2;" + "return;";
      address = null;
      break;
    case 70:
    ;
    case 78:
    ;
    case 102:
    ;
    case 110:
      inst = "IM 0";
      code = "this.im = 0x00;";
      break;
    case 71:
      inst = "LD I,A";
      code = "this.i = this.a;";
      break;
    case 72:
      inst = "IN C,(C)";
      code = "this.c = this.port.in_(this.c);" + "this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
      break;
    case 73:
      inst = "OUT (C),C";
      code = "this.port.out(this.c, this.c);";
      break;
    case 74:
      inst = "ADC HL,BC";
      code = "this.adc16(this.getBC());";
      break;
    case 75:
      operand = toHex(this.readRom16bit(address));
      inst = "LD BC,(" + operand + ")";
      code = "this.setBC(this.getUint16(" + operand + "));";
      address += 2;
      break;
    case 79:
      inst = "LD R,A";
      code = "this.r = this.a;";
      break;
    case 80:
      inst = "IN D,(C)";
      code = "this.d = this.port.in_(this.c);" + "this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
      break;
    case 81:
      inst = "OUT (C),D";
      code = "this.port.out(this.c, this.d);";
      break;
    case 82:
      inst = "SBC HL,DE";
      code = "this.sbc16(this.getDE());";
      break;
    case 83:
      location = this.readRom16bit(address);
      operand = toHex(location);
      inst = "LD (" + operand + "),DE";
      code = "this.setUint8(" + operand + ", this.e);" + "this.setUint8(" + toHex(location + 1) + ", this.d);";
      address += 2;
      break;
    case 86:
    ;
    case 118:
      inst = "IM 1";
      code = "this.im = 0x01;";
      break;
    case 87:
      inst = "LD A,I";
      code = "this.a = this.i;" + "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
      break;
    case 88:
      inst = "IN E,(C)";
      code = "this.e = this.port.in_(this.c);" + "this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
      break;
    case 89:
      inst = "OUT (C),E";
      code = "this.port.out(this.c, this.e);";
      break;
    case 90:
      inst = "ADC HL,DE";
      code = "this.adc16(this.getDE());";
      break;
    case 91:
      operand = toHex(this.readRom16bit(address));
      inst = "LD DE,(" + operand + ")";
      code = "this.setDE(this.getUint16(" + operand + "));";
      address += 2;
      break;
    case 95:
      inst = "LD A,R";
      if (REFRESH_EMULATION) {
        code = "this.a = this.r;";
      } else {
        code = "this.a = JSSMS.Utils.rndInt(0xFF);";
      }
      code += "this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
      break;
    case 96:
      inst = "IN H,(C)";
      code = "this.h = this.port.in_(this.c);" + "this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
      break;
    case 97:
      inst = "OUT (C),H";
      code = "this.port.out(this.c, this.h);";
      break;
    case 98:
      inst = "SBC HL,HL";
      code = "this.sbc16(this.getHL());";
      break;
    case 99:
      location = this.readRom16bit(address);
      operand = toHex(location);
      inst = "LD (" + operand + "),HL";
      code = "this.setUint8(" + operand + ", this.l);" + "this.setUint8(" + toHex(location + 1) + ", this.h);";
      address += 2;
      break;
    case 103:
      inst = "RRD";
      code = "var location = this.getHL();" + "temp = this.getUint8(location);" + "this.setUint8(location, (temp >> 4) | ((this.a & 0x0F) << 4));" + "this.a = (this.a & 0xF0) | (temp & 0x0F);" + "this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
      break;
    case 104:
      inst = "IN L,(C)";
      code = "this.l = this.port.in_(this.c);" + "this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
      break;
    case 105:
      inst = "OUT (C),L";
      code = "this.port.out(this.c, this.l);";
      break;
    case 106:
      inst = "ADC HL,HL";
      code = "this.adc16(this.getHL());";
      break;
    case 107:
      operand = toHex(this.readRom16bit(address));
      inst = "LD HL,(" + operand + ")";
      code = "this.setHL(this.getUint16(" + operand + "));";
      address += 2;
      break;
    case 111:
      inst = "RLD";
      code = "var location = this.getHL();" + "temp = this.getUint8(location);" + "this.setUint8(location, (temp & 0x0F) << 4 | (this.a & 0x0F));" + "this.a = (this.a & 0xF0) | (temp >> 4);" + "this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
      break;
    case 113:
      inst = "OUT (C),0";
      code = "this.port.out(this.c, 0);";
      break;
    case 114:
      inst = "SBC HL,SP";
      code = "this.sbc16(this.sp);";
      break;
    case 115:
      location = this.readRom16bit(address);
      operand = toHex(location);
      inst = "LD (" + operand + "),SP";
      code = "this.setUint8(" + operand + ", this.sp & 0xFF);" + "this.setUint8(" + toHex(location + 1) + ", this.sp >> 8);";
      address += 2;
      break;
    case 120:
      inst = "IN A,(C)";
      code = "this.a = this.port.in_(this.c);" + "this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
      break;
    case 121:
      inst = "OUT (C),A";
      code = "this.port.out(this.c, this.a);";
      break;
    case 122:
      inst = "ADC HL,SP";
      code = "this.adc16(this.sp);";
      break;
    case 123:
      operand = toHex(this.readRom16bit(address));
      inst = "LD SP,(" + operand + ")";
      code = "this.sp = this.getUint16(" + operand + ");";
      address += 2;
      break;
    case 160:
      inst = "LDI";
      code = "temp = this.getUint8(this.getHL());" + "this.setUint8(this.getDE(), temp);" + "this.decBC();" + "this.incDE();" + "this.incHL();" + "temp = (temp + this.a) & 0xFF;" + "this.f = (this.f & 0xC1) | (this.getBC() ? F_PARITY : 0) | (temp & 0x08) | ((temp & 0x02) ? 0x20 : 0);";
      break;
    case 161:
      inst = "CPI";
      code = "temp = (this.f & F_CARRY) | F_NEGATIVE;" + "this.cp_a(this.getUint8(this.getHL()));" + "this.incHL();" + "this.decBC();" + "temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);" + "this.f = (this.f & 0xF8) | temp;";
      break;
    case 162:
      inst = "INI";
      code = "temp = this.port.in_(this.c);" + "this.setUint8(this.getHL(), temp);" + "this.b = this.dec8(this.b);" + "this.incHL();" + "if ((temp & 0x80) === 0x80) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 163:
      inst = "OUTI";
      code = "temp = this.getUint8(this.getHL());" + "this.port.out(this.c, temp);" + "this.incHL();" + "this.b = this.dec8(this.b);" + "if (this.l + temp > 0xFF) {" + "this.f |= F_CARRY; this.f |= F_HALFCARRY;" + "} else {" + "this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;" + "}" + "if ((temp & 0x80) === 0x80) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 168:
      inst = "LDD";
      break;
    case 169:
      inst = "CPD";
      break;
    case 170:
      inst = "IND";
      code = "temp = this.port.in_(this.c);" + "this.setUint8(this.getHL(), temp);" + "this.b = this.dec8(this.b);" + "this.decHL();" + "if ((temp & 0x80) !== 0x00) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 171:
      inst = "OUTD";
      code = "temp = this.getUint8(this.getHL());" + "this.port.out(this.c, temp);" + "this.decHL();" + "this.b = this.dec8(this.b);" + "if (this.l + temp > 0xFF) {" + "this.f |= F_CARRY; this.f |= F_HALFCARRY;" + "} else {" + "this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;" + "}" + "if ((temp & 0x80) === 0x80) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 176:
      inst = "LDIR";
      code = "this.setUint8(this.getDE(), this.getUint8(this.getHL()));" + "this.incDE();" + "this.incHL();" + "this.decBC();";
      if (ACCURATE_INTERRUPT_EMULATION) {
        target = address - 2;
        code += "if (this.getBC() !== 0x00) {" + "this.tstates -= 0x05;" + "this.f |= F_PARITY;" + "return;" + "} else {";
      } else {
        code += "for (;this.getBC() !== 0x00; this.f |= F_PARITY, this.tstates -= 5) {" + "this.setUint8(this.getDE(), this.getUint8(this.getHL()));" + "this.incDE();this.incHL();this.decBC();" + "}" + "if (!(this.getBC() !== 0x00)) {";
      }
      code += "this.f &= ~ F_PARITY;" + "}" + "this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 177:
      inst = "CPIR";
      code = "temp = (this.f & F_CARRY) | F_NEGATIVE;" + "this.cp_a(this.getUint8(this.getHL()));" + "this.incHL();" + "this.decBC();" + "temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);";
      if (ACCURATE_INTERRUPT_EMULATION) {
        target = address - 2;
        code += "if ((temp & F_PARITY) !== 0x00 && (this.f & F_ZERO) === 0x00) {" + "this.tstates -= 0x05;" + "this.pc = " + toHex(target) + ";" + "return;" + "}";
      } else {
        code += "for (;(temp & F_PARITY) !== 0x00 && (this.f & F_ZERO) === 0x00; this.tstates -= 5) {" + "temp = (this.f & F_CARRY) | F_NEGATIVE;" + "this.cp_a(this.getUint8(this.getHL()));" + "this.incHL();" + "this.decBC();" + "temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);" + "}";
      }
      code += "this.f = (this.f & 0xF8) | temp;";
      break;
    case 178:
      target = address - 2;
      inst = "INIR";
      code = "temp = this.port.in_(this.c);" + "this.setUint8(this.getHL(), temp);" + "this.b = this.dec8(this.b);" + "this.incHL();" + "if (this.b !== 0x00) {" + "this.tstates -= 0x05;" + "return;" + "}" + "if ((temp & 0x80) === 0x80) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 179:
      inst = "OTIR";
      code = "temp = this.getUint8(this.getHL());" + "this.port.out(this.c, temp);" + "this.b = this.dec8(this.b);" + "this.incHL();";
      if (ACCURATE_INTERRUPT_EMULATION) {
        target = address - 2;
        code += "if (this.b !== 0x00) {" + "this.tstates -= 0x05;" + "return;" + "}";
      } else {
        code += "for (;this.b !== 0x00; this.tstates -= 5) {" + "temp = this.getUint8(this.getHL());" + "this.port.out(this.c, temp);" + "this.b = this.dec8(this.b);" + "this.incHL();" + "}";
      }
      code += "if (this.l + temp > 0xFF) {" + "this.f |= F_CARRY; this.f |= F_HALFCARRY;" + "} else {" + "this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;" + "}" + "if ((temp & 0x80) !== 0x00) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 184:
      inst = "LDDR";
      break;
    case 185:
      inst = "CPDR";
      break;
    case 186:
      target = address - 2;
      inst = "INDR";
      code = "temp = this.port.in_(this.c);" + "this.setUint8(this.getHL(), temp);" + "this.b = this.dec8(this.b);" + "this.decHL();" + "if (this.b !== 0x00) {" + "this.tstates -= 0x05;" + "return;" + "}" + "if ((temp & 0x80) !== 0x00) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
    case 187:
      target = address - 2;
      inst = "OTDR";
      code = "temp = this.getUint8(this.getHL());" + "this.port.out(this.c, temp);" + "this.b = this.dec8(this.b);" + "this.decHL();" + "if (this.b !== 0x00) {" + "this.tstates -= 0x05;" + "return;" + "}" + "if (this.l + temp > 0xFF) {" + "this.f |= F_CARRY; this.f |= F_HALFCARRY;" + "} else {" + "this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;" + "}" + "if ((temp & 0x80) !== 0x00) {" + "this.f |= F_NEGATIVE;" + "} else {" + "this.f &= ~ F_NEGATIVE;" + "}";
      break;
  }
  return {opcode:opcode, opcodes:opcodesArray, inst:inst, code:code, address:currAddr, nextAddress:address, target:target};
}, getIndex:function(index, address) {
  var toHex = JSSMS.Utils.toHex;
  var opcode = this.readRom8bit(address);
  var opcodesArray = [opcode];
  var inst = "Unimplemented 0xDD or 0xFD prefixed opcode";
  var currAddr = address;
  var code = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";';
  var operand = "";
  var location = 0;
  address++;
  var offset = 0;
  var _inst = {};
  switch(opcode) {
    case 9:
      inst = "ADD " + index + ",BC";
      code = "this.set" + index + "(this.add16(this.get" + index + "(), this.getBC()));";
      break;
    case 25:
      inst = "ADD " + index + ",DE";
      code = "this.set" + index + "(this.add16(this.get" + index + "(), this.getDE()));";
      break;
    case 33:
      operand = toHex(this.readRom16bit(address));
      inst = "LD " + index + "," + operand;
      code = "this.set" + index + "(" + operand + ");";
      address += 2;
      break;
    case 34:
      location = this.readRom16bit(address);
      operand = toHex(location);
      inst = "LD (" + operand + ")," + index;
      code = "this.setUint8(" + operand + ", this." + index.toLowerCase() + "L);" + "this.setUint8(" + toHex(location + 1) + ", this." + index.toLowerCase() + "H);";
      address += 2;
      break;
    case 35:
      inst = "INC " + index;
      code = "this.inc" + index + "();";
      break;
    case 36:
      inst = "INC " + index + "H *";
      break;
    case 37:
      inst = "DEC " + index + "H *";
      break;
    case 38:
      inst = "LD " + index + "H," + toHex(this.readRom8bit(address)) + " *";
      address++;
      break;
    case 41:
      inst = "ADD " + index + "  " + index;
      break;
    case 42:
      location = this.readRom16bit(address);
      inst = "LD " + index + " (" + toHex(location) + ")";
      code = "this.ixL = this.getUint8(" + toHex(location) + ");" + "this.ixH = this.getUint8(" + toHex(location + 1) + ");";
      address += 2;
      break;
    case 43:
      inst = "DEC " + index;
      code = "this.dec" + index + "();";
      break;
    case 44:
      inst = "INC " + index + "L *";
      break;
    case 45:
      inst = "DEC " + index + "L *";
      break;
    case 46:
      inst = "LD " + index + "L," + toHex(this.readRom8bit(address));
      address++;
      break;
    case 52:
      offset = this.readRom8bit(address);
      inst = "INC (" + index + "+" + toHex(offset) + ")";
      code = "this.incMem(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 53:
      offset = this.readRom8bit(address);
      inst = "DEC (" + index + "+" + toHex(offset) + ")";
      code = "this.decMem(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 54:
      offset = this.readRom8bit(address);
      operand = toHex(this.readRom8bit(address + 1));
      inst = "LD (" + index + "+" + toHex(offset) + ")," + operand;
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", " + operand + ");";
      address += 2;
      break;
    case 57:
      inst = "ADD " + index + " SP";
      code = "this.set" + index + "(this.add16(this.get" + index + "(), this.sp));";
      break;
    case 68:
      inst = "LD B," + index + "H *";
      break;
    case 69:
      inst = "LD B," + index + "L *";
      break;
    case 70:
      offset = this.readRom8bit(address);
      inst = "LD B,(" + index + "+" + toHex(offset) + ")";
      code = "this.b = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 76:
      inst = "LD C," + index + "H *";
      break;
    case 77:
      inst = "LD C," + index + "L *";
      break;
    case 78:
      offset = this.readRom8bit(address);
      inst = "LD C,(" + index + "+" + toHex(offset) + ")";
      code = "this.c = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 84:
      inst = "LD D," + index + "H *";
      break;
    case 85:
      inst = "LD D," + index + "L *";
      break;
    case 86:
      offset = this.readRom8bit(address);
      inst = "LD D,(" + index + "+" + toHex(offset) + ")";
      code = "this.d = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 92:
      inst = "LD E," + index + "H *";
      break;
    case 93:
      inst = "LD E," + index + "L *";
      break;
    case 94:
      offset = this.readRom8bit(address);
      inst = "LD E,(" + index + "+" + toHex(offset) + ")";
      code = "this.e = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 96:
      inst = "LD " + index + "H,B *";
      break;
    case 97:
      inst = "LD " + index + "H,C *";
      break;
    case 98:
      inst = "LD " + index + "H,D *";
      break;
    case 99:
      inst = "LD " + index + "H,E *";
      break;
    case 100:
      inst = "LD " + index + "H," + index + "H*";
      break;
    case 101:
      inst = "LD " + index + "H," + index + "L *";
      break;
    case 102:
      offset = this.readRom8bit(address);
      inst = "LD H,(" + index + "+" + toHex(offset) + ")";
      code = "this.h = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 103:
      inst = "LD " + index + "H,A *";
      break;
    case 104:
      inst = "LD " + index + "L,B *";
      break;
    case 105:
      inst = "LD " + index + "L,C *";
      break;
    case 106:
      inst = "LD " + index + "L,D *";
      break;
    case 107:
      inst = "LD " + index + "L,E *";
      break;
    case 108:
      inst = "LD " + index + "L," + index + "H *";
      break;
    case 109:
      inst = "LD " + index + "L," + index + "L *";
      code = "";
      break;
    case 110:
      offset = this.readRom8bit(address);
      inst = "LD L,(" + index + "+" + toHex(offset) + ")";
      code = "this.l = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 111:
      inst = "LD " + index + "L,A *";
      code = "this." + index.toLowerCase() + "L = this.a;";
      break;
    case 112:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),B";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.b);";
      address++;
      break;
    case 113:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),C";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.c);";
      address++;
      break;
    case 114:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),D";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.d);";
      address++;
      break;
    case 115:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),E";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.e);";
      address++;
      break;
    case 116:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),H";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.h);";
      address++;
      break;
    case 117:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),L";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.l);";
      address++;
      break;
    case 119:
      offset = this.readRom8bit(address);
      inst = "LD (" + index + "+" + toHex(offset) + "),A";
      code = "this.setUint8(this.get" + index + "() + " + toHex(offset) + ", this.a);";
      address++;
      break;
    case 124:
      inst = "LD A," + index + "H *";
      break;
    case 125:
      inst = "LD A," + index + "L *";
      break;
    case 126:
      offset = this.readRom8bit(address);
      inst = "LD A,(" + index + "+" + toHex(offset) + ")";
      code = "this.a = this.getUint8(this.get" + index + "() + " + toHex(offset) + ");";
      address++;
      break;
    case 132:
      inst = "ADD A," + index + "H *";
      break;
    case 133:
      inst = "ADD A," + index + "L *";
      break;
    case 134:
      offset = this.readRom8bit(address);
      inst = "ADD A,(" + index + "+" + toHex(offset) + ")";
      code = "this.add_a(this.getUint8(this.get" + index + "() + " + toHex(offset) + "));";
      address++;
      break;
    case 140:
      inst = "ADC A," + index + "H *";
      break;
    case 141:
      inst = "ADC A," + index + "L *";
      break;
    case 142:
      offset = this.readRom8bit(address);
      inst = "ADC A,(" + index + "+" + toHex(offset) + ")";
      code = "this.adc_a(this.getUint8(this.get" + index + "() + " + toHex(offset) + "));";
      address++;
      break;
    case 148:
      inst = "SUB " + index + "H *";
      break;
    case 149:
      inst = "SUB " + index + "L *";
      break;
    case 150:
      offset = this.readRom8bit(address);
      inst = "SUB A,(" + index + "+" + toHex(offset) + ")";
      code = "this.sub_a(this.getUint8(this.get" + index + "() + " + toHex(offset) + "));";
      address++;
      break;
    case 156:
      inst = "SBC A," + index + "H *";
      break;
    case 157:
      inst = "SBC A," + index + "L *";
      break;
    case 158:
      offset = this.readRom8bit(address);
      inst = "SBC A,(" + index + "+" + toHex(offset) + ")";
      code = "this.sbc_a(this.getUint8(this.get" + index + "() + " + toHex(offset) + "));";
      address++;
      break;
    case 164:
      inst = "AND " + index + "H *";
      code = "this.f = this.SZP_TABLE[this.a &= this." + index.toLowerCase() + "H];";
      break;
    case 165:
      inst = "AND " + index + "L *";
      code = "this.f = this.SZP_TABLE[this.a &= this." + index.toLowerCase() + "L];";
      break;
    case 166:
      offset = this.readRom8bit(address);
      inst = "AND A,(" + index + "+" + toHex(offset) + ")";
      code = "this.f = this.SZP_TABLE[this.a &= this.getUint8(this.get" + index + "() + " + toHex(offset) + ")] | F_HALFCARRY;";
      address++;
      break;
    case 172:
      inst = "XOR A " + index + "H*";
      code = "this.f = this.SZP_TABLE[this.a |= this." + index.toLowerCase() + "H];";
      break;
    case 173:
      inst = "XOR A " + index + "L*";
      code = "this.f = this.SZP_TABLE[this.a |= this." + index.toLowerCase() + "L];";
      break;
    case 174:
      offset = this.readRom8bit(address);
      inst = "XOR A,(" + index + "+" + toHex(offset) + ")";
      code = "this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.get" + index + "() + " + toHex(offset) + ")];";
      address++;
      break;
    case 180:
      inst = "OR A " + index + "H*";
      code = "this.f = this.SZP_TABLE[this.a |= this." + index.toLowerCase() + "H];";
      break;
    case 181:
      inst = "OR A " + index + "L*";
      code = "this.f = this.SZP_TABLE[this.a |= this." + index.toLowerCase() + "L];";
      break;
    case 182:
      offset = this.readRom8bit(address);
      inst = "OR A,(" + index + "+" + toHex(offset) + ")";
      code = "this.f = this.SZP_TABLE[this.a |= this.getUint8(this.get" + index + "() + " + toHex(offset) + ")];";
      address++;
      break;
    case 188:
      inst = "CP " + index + "H *";
      code = "this.cp_a(this." + index.toLowerCase() + "H);";
      break;
    case 189:
      inst = "CP " + index + "L *";
      code = "this.cp_a(this." + index.toLowerCase() + "L);";
      break;
    case 190:
      offset = this.readRom8bit(address);
      inst = "CP (" + index + "+" + toHex(offset) + ")";
      code = "this.cp_a(this.getUint8(this.get" + index + "() + " + toHex(offset) + "));";
      address++;
      break;
    case 203:
      _inst = this.getIndexCB(index, address);
      inst = _inst.inst;
      code = _inst.code;
      opcodesArray = opcodesArray.concat(_inst.opcodes);
      address = _inst.nextAddress;
      break;
    case 225:
      inst = "POP " + index;
      code = "this.set" + index + "(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      inst = "EX SP,(" + index + ")";
      code = "temp = this.get" + index + "();" + "this.set" + index + "(this.getUint16(this.sp));" + "this.setUint8(this.sp, temp & 0xFF);" + "this.setUint8(this.sp + 1, temp >> 8);";
      break;
    case 229:
      inst = "PUSH " + index;
      code = "this.push2(this." + index.toLowerCase() + "H, this." + index.toLowerCase() + "L);";
      break;
    case 233:
      inst = "JP (" + index + ")";
      code = "this.pc = this.get" + index + "(); return;";
      address = null;
      break;
    case 249:
      inst = "LD SP," + index;
      code = "this.sp = this.get" + index + "();";
      break;
  }
  return {opcode:opcode, opcodes:opcodesArray, inst:inst, code:code, address:currAddr, nextAddress:address};
}, getIndexCB:function(index, address) {
  var toHex = JSSMS.Utils.toHex;
  var currAddr = address;
  var location = "location = this.get" + index + "() + " + toHex(this.readRom8bit(address++)) + " & 0xFFFF;";
  var opcode = this.readRom8bit(address);
  var opcodesArray = [opcode];
  var inst = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
  var code = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
  address++;
  switch(opcode) {
    case 0:
      inst = "LD B,RLC (" + index + ")";
      code = location + "this.b = this.rlc(this.getUint8(location)); this.setUint8(location, this.b);";
      break;
    case 1:
      inst = "LD C,RLC (" + index + ")";
      code = location + "this.c = this.rlc(this.getUint8(location)); this.setUint8(location, this.c);";
      break;
    case 2:
      inst = "LD D,RLC (" + index + ")";
      code = location + "this.d = this.rlc(this.getUint8(location)); this.setUint8(location, this.d);";
      break;
    case 3:
      inst = "LD E,RLC (" + index + ")";
      break;
    case 4:
      inst = "LD H,RLC (" + index + ")";
      break;
    case 5:
      inst = "LD L,RLC (" + index + ")";
      break;
    case 6:
      inst = "RLC (" + index + ")";
      code = location + "this.setUint8(location, this.rlc(this.getUint8(location)));";
      break;
    case 7:
      inst = "LD A,RLC (" + index + ")";
      code = location + "this.a = this.rlc(this.getUint8(location)); this.setUint8(location, this.a);";
      break;
    case 8:
      inst = "LD B,RRC (" + index + ")";
      break;
    case 9:
      inst = "LD C,RRC (" + index + ")";
      break;
    case 10:
      inst = "LD D,RRC (" + index + ")";
      break;
    case 11:
      inst = "LD E,RRC (" + index + ")";
      break;
    case 12:
      inst = "LD H,RRC (" + index + ")";
      break;
    case 13:
      inst = "LD L,RRC (" + index + ")";
      break;
    case 14:
      inst = "RRC (" + index + ")";
      break;
    case 15:
      inst = "LD A,RRC (" + index + ")";
      break;
    case 16:
      inst = "LD B,RL (" + index + ")";
      break;
    case 17:
      inst = "LD C,RL (" + index + ")";
      break;
    case 18:
      inst = "LD D,RL (" + index + ")";
      break;
    case 19:
      inst = "LD E,RL (" + index + ")";
      break;
    case 20:
      inst = "LD H,RL (" + index + ")";
      break;
    case 21:
      inst = "LD L,RL (" + index + ")";
      break;
    case 22:
      inst = "RL (" + index + ")";
      break;
    case 23:
      inst = "LD A,RL (" + index + ")";
      break;
    case 24:
      inst = "LD B,RR (" + index + ")";
      break;
    case 25:
      inst = "LD C,RR (" + index + ")";
      break;
    case 26:
      inst = "LD D,RR (" + index + ")";
      break;
    case 27:
      inst = "LD E,RR (" + index + ")";
      break;
    case 28:
      inst = "LD H,RR (" + index + ")";
      break;
    case 29:
      inst = "LD L,RR (" + index + ")";
      code = location + "this.l = this.rr(this.getUint8(location)); this.setUint8(location, this.l);";
      break;
    case 30:
      inst = "RR (" + index + ")";
      break;
    case 31:
      inst = "LD A,RR (" + index + ")";
      code = location + "this.a = this.rr(this.getUint8(location)); this.setUint8(location, this.a);";
      break;
    case 32:
      inst = "LD B,SLA (" + index + ")";
      break;
    case 33:
      inst = "LD C,SLA (" + index + ")";
      break;
    case 34:
      inst = "LD D,SLA (" + index + ")";
      break;
    case 35:
      inst = "LD E,SLA (" + index + ")";
      break;
    case 36:
      inst = "LD H,SLA (" + index + ")";
      break;
    case 37:
      inst = "LD L,SLA (" + index + ")";
      break;
    case 38:
      inst = "SLA (" + index + ")";
      break;
    case 39:
      inst = "LD A,SLA (" + index + ")";
      break;
    case 40:
      inst = "LD B,SRA (" + index + ")";
      break;
    case 41:
      inst = "LD C,SRA (" + index + ")";
      break;
    case 42:
      inst = "LD D,SRA (" + index + ")";
      break;
    case 43:
      inst = "LD E,SRA (" + index + ")";
      break;
    case 44:
      inst = "LD H,SRA (" + index + ")";
      break;
    case 45:
      inst = "LD L,SRA (" + index + ")";
      break;
    case 46:
      inst = "SRA (" + index + ")";
      break;
    case 47:
      inst = "LD A,SRA (" + index + ")";
      break;
    case 48:
      inst = "LD B,SLL (" + index + ")";
      break;
    case 49:
      inst = "LD C,SLL (" + index + ")";
      break;
    case 50:
      inst = "LD D,SLL (" + index + ")";
      break;
    case 51:
      inst = "LD E,SLL (" + index + ")";
      break;
    case 52:
      inst = "LD H,SLL (" + index + ")";
      break;
    case 53:
      inst = "LD L,SLL (" + index + ")";
      break;
    case 54:
      inst = "SLL (" + index + ") *";
      break;
    case 55:
      inst = "LD A,SLL (" + index + ")";
      break;
    case 56:
      inst = "LD B,SRL (" + index + ")";
      break;
    case 57:
      inst = "LD C,SRL (" + index + ")";
      break;
    case 58:
      inst = "LD D,SRL (" + index + ")";
      break;
    case 59:
      inst = "LD E,SRL (" + index + ")";
      break;
    case 60:
      inst = "LD H,SRL (" + index + ")";
      break;
    case 61:
      inst = "LD L,SRL (" + index + ")";
      break;
    case 62:
      inst = "SRL (" + index + ")";
      break;
    case 63:
      inst = "LD A,SRL (" + index + ")";
      break;
    case 64:
    ;
    case 65:
    ;
    case 66:
    ;
    case 67:
    ;
    case 68:
    ;
    case 69:
    ;
    case 70:
    ;
    case 71:
      inst = "BIT 0,(" + index + ")";
      break;
    case 72:
    ;
    case 73:
    ;
    case 74:
    ;
    case 75:
    ;
    case 76:
    ;
    case 77:
    ;
    case 78:
    ;
    case 79:
      inst = "BIT 1,(" + index + ")";
      break;
    case 80:
    ;
    case 81:
    ;
    case 82:
    ;
    case 83:
    ;
    case 84:
    ;
    case 85:
    ;
    case 86:
    ;
    case 87:
      inst = "BIT 2,(" + index + ")";
      break;
    case 88:
    ;
    case 89:
    ;
    case 90:
    ;
    case 91:
    ;
    case 92:
    ;
    case 93:
    ;
    case 94:
    ;
    case 95:
      inst = "BIT 3,(" + index + ")";
      break;
    case 96:
    ;
    case 97:
    ;
    case 98:
    ;
    case 99:
    ;
    case 100:
    ;
    case 101:
    ;
    case 102:
    ;
    case 103:
      inst = "BIT 4,(" + index + ")";
      break;
    case 104:
    ;
    case 105:
    ;
    case 106:
    ;
    case 107:
    ;
    case 108:
    ;
    case 109:
    ;
    case 110:
    ;
    case 111:
      inst = "BIT 5,(" + index + ")";
      break;
    case 112:
    ;
    case 113:
    ;
    case 114:
    ;
    case 115:
    ;
    case 116:
    ;
    case 117:
    ;
    case 118:
    ;
    case 119:
      inst = "BIT 6,(" + index + ")";
      break;
    case 120:
    ;
    case 121:
    ;
    case 122:
    ;
    case 123:
    ;
    case 124:
    ;
    case 125:
    ;
    case 126:
    ;
    case 127:
      inst = "BIT 7,(" + index + ")";
      break;
    case 128:
    ;
    case 129:
    ;
    case 130:
    ;
    case 131:
    ;
    case 132:
    ;
    case 133:
    ;
    case 134:
    ;
    case 135:
      inst = "RES 0,(" + index + ")";
      break;
    case 136:
    ;
    case 137:
    ;
    case 138:
    ;
    case 139:
    ;
    case 140:
    ;
    case 141:
    ;
    case 142:
    ;
    case 143:
      inst = "RES 1,(" + index + ")";
      break;
    case 144:
    ;
    case 145:
    ;
    case 146:
    ;
    case 147:
    ;
    case 148:
    ;
    case 149:
    ;
    case 150:
    ;
    case 151:
      inst = "RES 2,(" + index + ")";
      break;
    case 152:
    ;
    case 153:
    ;
    case 154:
    ;
    case 155:
    ;
    case 156:
    ;
    case 157:
    ;
    case 158:
    ;
    case 159:
      inst = "RES 3,(" + index + ")";
      break;
    case 160:
    ;
    case 161:
    ;
    case 162:
    ;
    case 163:
    ;
    case 164:
    ;
    case 165:
    ;
    case 166:
    ;
    case 167:
      inst = "RES 4,(" + index + ")";
      break;
    case 168:
    ;
    case 169:
    ;
    case 170:
    ;
    case 171:
    ;
    case 172:
    ;
    case 173:
    ;
    case 174:
    ;
    case 175:
      inst = "RES 5,(" + index + ")";
      break;
    case 176:
    ;
    case 177:
    ;
    case 178:
    ;
    case 179:
    ;
    case 180:
    ;
    case 181:
    ;
    case 182:
    ;
    case 183:
      inst = "RES 6,(" + index + ")";
      break;
    case 184:
    ;
    case 185:
    ;
    case 186:
    ;
    case 187:
    ;
    case 188:
    ;
    case 189:
    ;
    case 190:
    ;
    case 191:
      inst = "RES 7,(" + index + ")";
      break;
    case 192:
    ;
    case 193:
    ;
    case 194:
    ;
    case 195:
    ;
    case 196:
    ;
    case 197:
    ;
    case 198:
    ;
    case 199:
      inst = "SET 0,(" + index + ")";
      break;
    case 200:
    ;
    case 201:
    ;
    case 202:
    ;
    case 203:
    ;
    case 204:
    ;
    case 205:
    ;
    case 206:
    ;
    case 207:
      inst = "SET 1,(" + index + ")";
      break;
    case 208:
    ;
    case 209:
    ;
    case 210:
    ;
    case 211:
    ;
    case 212:
    ;
    case 213:
    ;
    case 214:
    ;
    case 215:
      inst = "SET 2,(" + index + ")";
      break;
    case 216:
    ;
    case 217:
    ;
    case 218:
    ;
    case 219:
    ;
    case 220:
    ;
    case 221:
    ;
    case 222:
    ;
    case 223:
      inst = "SET 3,(" + index + ")";
      break;
    case 224:
    ;
    case 225:
    ;
    case 226:
    ;
    case 227:
    ;
    case 228:
    ;
    case 229:
    ;
    case 230:
    ;
    case 231:
      inst = "SET 4,(" + index + ")";
      break;
    case 232:
    ;
    case 233:
    ;
    case 234:
    ;
    case 235:
    ;
    case 236:
    ;
    case 237:
    ;
    case 238:
    ;
    case 239:
      inst = "SET 5,(" + index + ")";
      break;
    case 240:
    ;
    case 241:
    ;
    case 242:
    ;
    case 243:
    ;
    case 244:
    ;
    case 245:
    ;
    case 246:
    ;
    case 247:
      inst = "SET 6,(" + index + ")";
      break;
    case 248:
    ;
    case 249:
    ;
    case 250:
    ;
    case 251:
    ;
    case 252:
    ;
    case 253:
    ;
    case 254:
    ;
    case 255:
      inst = "SET 7,(" + index + ")";
      break;
  }
  address++;
  return {opcode:opcode, opcodes:opcodesArray, inst:inst, code:code, address:currAddr, nextAddress:address};
}, getIndexOpIX:function(opcode) {
  return this.getIndex("IX", opcode);
}, getIndexOpIY:function(opcode) {
  return this.getIndex("IY", opcode);
}, readRom8bit:function(address) {
  if (SUPPORT_DATAVIEW) {
    return this.rom[address >> 14].getUint8(address & 16383);
  } else {
    return this.rom[address >> 14][address & 16383] & 255;
  }
}, readRom16bit:function(address) {
  if (SUPPORT_DATAVIEW) {
    if ((address & 16383) < 16383) {
      return this.rom[address >> 14].getUint16(address & 16383, LITTLE_ENDIAN);
    } else {
      return this.rom[address >> 14].getUint8(address & 16383) | this.rom[++address >> 14].getUint8(address & 16383) << 8;
    }
  } else {
    return this.rom[address >> 14][address & 16383] & 255 | (this.rom[++address >> 14][address & 16383] & 255) << 8;
  }
}, peepholePortOut:function(port) {
  if (this.main.is_gg && port < 7) {
    return "";
  }
  switch(port & 193) {
    case 1:
      if (LIGHTGUN) {
        return "var value = this.a;" + "this.port.oldTH = (this.port.getTH(PORT_A) !== 0x00 || this.port.getTH(PORT_B) !== 0x00);" + "this.port.writePort(PORT_A, value);" + "this.port.writePort(PORT_B, value >> 2);" + "if (!this.port.oldTH && (this.port.getTH(PORT_A) !== 0x00 || this.port.getTH(PORT_B) !== 0x00)) {" + "this.port.hCounter = this.port.getHCount();" + "}";
      } else {
        var code = "var value = this.a;" + "this.port.ioPorts[0] = (value & 0x20) << 1;" + "this.port.ioPorts[1] = (value & 0x80);";
        if (this.port.europe === 0) {
          code += "this.port.ioPorts[0] = ~this.port.ioPorts[0];" + "this.port.ioPorts[1] = ~this.port.ioPorts[1];";
        }
        return code;
      }
      break;
    case 128:
      return "this.vdp.dataWrite(this.a);";
    case 129:
      return "this.vdp.controlWrite(this.a);";
    case 64:
    ;
    case 65:
      if (this.main.soundEnabled) {
        return "this.psg.write(this.a);";
      }
      break;
  }
  return "";
}, peepholePortIn:function(port) {
  if (this.main.is_gg && port < 7) {
    switch(port) {
      case 0:
        return "this.a = (this.port.keyboard.ggstart & 0xBF) | this.port.europe;";
      case 1:
      ;
      case 2:
      ;
      case 3:
      ;
      case 4:
      ;
      case 5:
        return "this.a = 0x00;";
      case 6:
        return "this.a = 0xFF;";
    }
  }
  switch(port & 193) {
    case 64:
      return "this.a = this.vdp.getVCount();";
    case 65:
      return "this.a = this.port.hCounter;";
    case 128:
      return "this.a = this.vdp.dataRead();";
    case 129:
      return "this.a = this.vdp.controlRead();";
    case 192:
      return "this.a = this.port.keyboard.controller1;";
    case 193:
      if (LIGHTGUN) {
        return "if (this.port.keyboard.lightgunClick)" + "this.port.lightPhaserSync();" + "this.a = (this.port.keyboard.controller2 & 0x3F) | (this.port.getTH(PORT_A) !== 0x00 ? 0x40 : 0x00) | (this.port.getTH(PORT_B) !== 0x00 ? 0x80 : 0x00);";
      } else {
        return "this.a = (this.port.keyboard.controller2 & 0x3F) | this.port.ioPorts[0] | this.port.ioPorts[1];";
      }
    ;
  }
  return "this.a = 0xFF;";
}};
function Instruction(options) {
  var toHex = JSSMS.Utils.toHex;
  var defaultInstruction = {address:0, hexAddress:"", opcode:0, opcodes:[], inst:"", code:"", nextAddress:null, target:null, isJumpTarget:false, jumpTargetNb:0, label:""};
  var prop;
  var hexOpcodes = "";
  for (prop in defaultInstruction) {
    if (options[prop] !== undefined) {
      defaultInstruction[prop] = options[prop];
    }
  }
  defaultInstruction.hexAddress = toHex(defaultInstruction.address);
  if (defaultInstruction.opcodes.length) {
    hexOpcodes = defaultInstruction.opcodes.map(toHex).join(" ") + " ";
  }
  defaultInstruction.label = defaultInstruction.hexAddress + " " + hexOpcodes + defaultInstruction.inst;
  return defaultInstruction;
}
;var P1_KEY_UP = 1;
var P1_KEY_DOWN = 2;
var P1_KEY_LEFT = 4;
var P1_KEY_RIGHT = 8;
var P1_KEY_FIRE1 = 16;
var P1_KEY_FIRE2 = 32;
var P2_KEY_UP = 64;
var P2_KEY_DOWN = 128;
var P2_KEY_LEFT = 1;
var P2_KEY_RIGHT = 2;
var P2_KEY_FIRE1 = 4;
var P2_KEY_FIRE2 = 8;
var KEY_START = 64;
var GG_KEY_START = 128;
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
JSSMS.Keyboard.prototype = {reset:function() {
  this.controller1 = 255;
  this.controller2 = 255;
  this.ggstart = 255;
  if (LIGHTGUN) {
    this.lightgunClick = false;
  }
  this.pause_button = false;
}, keydown:function(evt) {
  switch(evt.keyCode) {
    case 38:
      this.controller1 &= ~P1_KEY_UP;
      break;
    case 40:
      this.controller1 &= ~P1_KEY_DOWN;
      break;
    case 37:
      this.controller1 &= ~P1_KEY_LEFT;
      break;
    case 39:
      this.controller1 &= ~P1_KEY_RIGHT;
      break;
    case 88:
      this.controller1 &= ~P1_KEY_FIRE1;
      break;
    case 90:
      this.controller1 &= ~P1_KEY_FIRE2;
      break;
    case 13:
      if (this.main.is_sms) {
        this.main.pause_button = true;
      } else {
        this.ggstart &= ~GG_KEY_START;
      }
      break;
    case 104:
      this.controller2 &= ~P2_KEY_UP;
      break;
    case 98:
      this.controller2 &= ~P2_KEY_DOWN;
      break;
    case 100:
      this.controller2 &= ~P2_KEY_LEFT;
      break;
    case 102:
      this.controller2 &= ~P2_KEY_RIGHT;
      break;
    case 103:
      this.controller2 &= ~P2_KEY_FIRE1;
      break;
    case 105:
      this.controller2 &= ~P2_KEY_FIRE2;
      break;
    default:
      return;
  }
  evt.preventDefault();
}, keyup:function(evt) {
  switch(evt.keyCode) {
    case 38:
      this.controller1 |= P1_KEY_UP;
      break;
    case 40:
      this.controller1 |= P1_KEY_DOWN;
      break;
    case 37:
      this.controller1 |= P1_KEY_LEFT;
      break;
    case 39:
      this.controller1 |= P1_KEY_RIGHT;
      break;
    case 88:
      this.controller1 |= P1_KEY_FIRE1;
      break;
    case 90:
      this.controller1 |= P1_KEY_FIRE2;
      break;
    case 13:
      if (!this.main.is_sms) {
        this.ggstart |= GG_KEY_START;
      }
      break;
    case 104:
      this.controller2 |= P2_KEY_UP;
      break;
    case 98:
      this.controller2 |= P2_KEY_DOWN;
      break;
    case 100:
      this.controller2 |= P2_KEY_LEFT;
      break;
    case 102:
      this.controller2 |= P2_KEY_RIGHT;
      break;
    case 103:
      this.controller2 |= P2_KEY_FIRE1;
      break;
    case 105:
      this.controller2 |= P2_KEY_FIRE2;
      break;
    default:
      return;
  }
  evt.preventDefault();
}};
var SCALE = 8;
var NO_ANTIALIAS = Number.MIN_VALUE;
var SHIFT_RESET = 32768;
var FEEDBACK_PATTERN = 9;
var PSG_VOLUME = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0];
JSSMS.SN76489 = function(sms) {
  this.main = sms;
  this.clock = 0;
  this.clockFrac = 0;
  this.reg = new Array(8);
  this.regLatch = 0;
  this.freqCounter = new Array(4);
  this.freqPolarity = new Array(4);
  this.freqPos = new Array(3);
  this.noiseFreq = 16;
  this.noiseShiftReg = SHIFT_RESET;
  this.outputChannel = new Array(4);
};
JSSMS.SN76489.prototype = {init:function(clockSpeed) {
  this.clock = (clockSpeed << SCALE) / 16 / SAMPLE_RATE;
  this.clockFrac = 0;
  this.regLatch = 0;
  this.noiseFreq = 16;
  this.noiseShiftReg = SHIFT_RESET;
  for (var i = 0;i < 4;i++) {
    this.reg[i << 1] = 1;
    this.reg[(i << 1) + 1] = 15;
    this.freqCounter[i] = 0;
    this.freqPolarity[i] = 1;
  }
  for (i = 0;i < 3;i++) {
    this.freqPos[i] = NO_ANTIALIAS;
  }
}, write:function(value) {
  if ((value & 128) !== 0) {
    this.regLatch = value >> 4 & 7;
    this.reg[this.regLatch] = this.reg[this.regLatch] & 1008 | value & 15;
  } else {
    if (this.regLatch === 0 || this.regLatch === 2 || this.regLatch === 4) {
      this.reg[this.regLatch] = this.reg[this.regLatch] & 15 | (value & 63) << 4;
    } else {
      this.reg[this.regLatch] = value & 15;
    }
  }
  switch(this.regLatch) {
    case 0:
    ;
    case 2:
    ;
    case 4:
      if (this.reg[this.regLatch] === 0) {
        this.reg[this.regLatch] = 1;
      }
      break;
    case 6:
      this.noiseFreq = 16 << (this.reg[6] & 3);
      this.noiseShiftReg = SHIFT_RESET;
      break;
  }
}, update:function(audioBuffer, offset, samplesToGenerate) {
  var buffer = audioBuffer.getChannelData(0);
  var sample = 0;
  var i = 0;
  for (;sample < samplesToGenerate;sample++) {
    for (i = 0;i < 3;i++) {
      if (this.freqPos[i] !== NO_ANTIALIAS) {
        this.outputChannel[i] = PSG_VOLUME[this.reg[(i << 1) + 1]] * this.freqPos[i] >> SCALE;
      } else {
        this.outputChannel[i] = PSG_VOLUME[this.reg[(i << 1) + 1]] * this.freqPolarity[i];
      }
    }
    this.outputChannel[3] = PSG_VOLUME[this.reg[7]] * (this.noiseShiftReg & 1) << 1;
    var output = this.outputChannel[0] + this.outputChannel[1] + this.outputChannel[2] + this.outputChannel[3];
    output /= 128;
    if (output > 1) {
      output = 1;
    } else {
      if (output < -1) {
        output = -1;
      }
    }
    buffer[offset + sample] = output;
    this.clockFrac += this.clock;
    var clockCycles = this.clockFrac >> SCALE;
    var clockCyclesScaled = clockCycles << SCALE;
    this.clockFrac -= clockCyclesScaled;
    this.freqCounter[0] -= clockCycles;
    this.freqCounter[1] -= clockCycles;
    this.freqCounter[2] -= clockCycles;
    if (this.noiseFreq === 128) {
      this.freqCounter[3] = this.freqCounter[2];
    } else {
      this.freqCounter[3] -= clockCycles;
    }
    for (i = 0;i < 3;i++) {
      var counter = this.freqCounter[i];
      if (counter <= 0) {
        var tone = this.reg[i << 1];
        if (tone > 6) {
          this.freqPos[i] = (clockCyclesScaled - this.clockFrac + (2 << SCALE) * counter << SCALE) * this.freqPolarity[i] / (clockCyclesScaled + this.clockFrac);
          this.freqPolarity[i] = -this.freqPolarity[i];
        } else {
          this.freqPolarity[i] = 1;
          this.freqPos[i] = NO_ANTIALIAS;
        }
        this.freqCounter[i] += tone * (clockCycles / tone + 1);
      } else {
        this.freqPos[i] = NO_ANTIALIAS;
      }
    }
    if (this.freqCounter[3] <= 0) {
      this.freqPolarity[3] = -this.freqPolarity[3];
      if (this.noiseFreq !== 128) {
        this.freqCounter[3] += this.noiseFreq * (clockCycles / this.noiseFreq + 1);
      }
      if (this.freqPolarity[3] === 1) {
        var feedback = 0;
        if ((this.reg[6] & 4) !== 0) {
          feedback = (this.noiseShiftReg & FEEDBACK_PATTERN) !== 0 && (this.noiseShiftReg & FEEDBACK_PATTERN ^ FEEDBACK_PATTERN) !== 0 ? 1 : 0;
        } else {
          feedback = this.noiseShiftReg & 1;
        }
        this.noiseShiftReg = this.noiseShiftReg >> 1 | feedback << 15;
      }
    }
  }
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
  var i = 0;
  this.videoMode = NTSC;
  this.VRAM = new JSSMS.Utils.Uint8Array(16384);
  this.CRAM = new JSSMS.Utils.Uint8Array(32 * 3);
  for (i = 0;i < 32 * 3;i++) {
    this.CRAM[i] = 255;
  }
  this.vdpreg = new JSSMS.Utils.Uint8Array(16);
  this.status = 0;
  this.firstByte = false;
  this.commandByte = 0;
  this.location = 0;
  this.operation = 0;
  this.readBuffer = 0;
  this.line = 0;
  this.counter = 0;
  this.bgPriority = new JSSMS.Utils.Uint8Array(SMS_WIDTH);
  if (VDP_SPRITE_COLLISIONS) {
    this.spriteCol = new JSSMS.Utils.Uint8Array(SMS_WIDTH);
  }
  this.bgt = 0;
  this.vScrollLatch = 0;
  this.display = (sms.ui.canvasImageData.data);
  this.main_JAVA_R = new JSSMS.Utils.Uint8Array(64);
  this.main_JAVA_G = new JSSMS.Utils.Uint8Array(64);
  this.main_JAVA_B = new JSSMS.Utils.Uint8Array(64);
  this.GG_JAVA_R = new JSSMS.Utils.Uint8Array(256);
  this.GG_JAVA_G = new JSSMS.Utils.Uint8Array(256);
  this.GG_JAVA_B = new JSSMS.Utils.Uint8Array(16);
  this.h_start = 0;
  this.h_end = 0;
  this.sat = 0;
  this.isSatDirty = false;
  this.lineSprites = new Array(SMS_HEIGHT);
  for (i = 0;i < SMS_HEIGHT;i++) {
    this.lineSprites[i] = new JSSMS.Utils.Uint8Array(1 + 3 * SPRITES_PER_LINE);
  }
  this.tiles = new Array(TOTAL_TILES);
  this.isTileDirty = new JSSMS.Utils.Uint8Array(TOTAL_TILES);
  this.minDirty = 0;
  this.maxDirty = 0;
  this.createCachedImages();
  this.generateConvertedPals();
};
JSSMS.Vdp.prototype = {reset:function() {
  var i;
  this.firstByte = true;
  this.location = 0;
  this.counter = 0;
  this.status = 0;
  this.operation = 0;
  for (i = 0;i < 16;i++) {
    this.vdpreg[i] = 0;
  }
  this.vdpreg[2] = 14;
  this.vdpreg[5] = 126;
  this.vScrollLatch = 0;
  this.main.cpu.interruptLine = false;
  this.isSatDirty = true;
  this.minDirty = TOTAL_TILES;
  this.maxDirty = -1;
  for (i = 0;i < 16384;i++) {
    this.VRAM[i] = 0;
  }
  for (i = 0;i < SMS_WIDTH * SMS_HEIGHT * 4;i = i + 4) {
    this.display[i] = 0;
    this.display[i + 1] = 0;
    this.display[i + 2] = 0;
    this.display[i + 3] = 255;
  }
}, forceFullRedraw:function() {
  this.bgt = (this.vdpreg[2] & 15 & ~1) << 10;
  this.minDirty = 0;
  this.maxDirty = TOTAL_TILES - 1;
  for (var i = 0;i < TOTAL_TILES;i++) {
    this.isTileDirty[i] = 1;
  }
  this.sat = (this.vdpreg[5] & ~1 & ~128) << 7;
  this.isSatDirty = true;
}, getVCount:function() {
  if (this.videoMode === NTSC) {
    if (this.line > 218) {
      return this.line - 6;
    }
  } else {
    if (this.line > 242) {
      return this.line - 57;
    }
  }
  return this.line;
}, controlRead:function() {
  this.firstByte = true;
  var statuscopy = this.status;
  this.status = 0;
  this.main.cpu.interruptLine = false;
  return statuscopy;
}, controlWrite:function(value) {
  if (this.firstByte) {
    this.firstByte = false;
    this.commandByte = value;
    this.location = this.location & 16128 | value;
  } else {
    this.firstByte = true;
    this.operation = value >> 6 & 3;
    this.location = this.commandByte | value << 8;
    if (this.operation === 0) {
      this.readBuffer = this.VRAM[this.location++ & 16383] & 255;
    } else {
      if (this.operation === 2) {
        var reg = value & 15;
        switch(reg) {
          case 0:
            if (ACCURATE_INTERRUPT_EMULATION && (this.status & STATUS_HINT) !== 0) {
              this.main.cpu.interruptLine = (this.commandByte & 16) !== 0;
            }
            break;
          case 1:
            if ((this.status & STATUS_VINT) !== 0 && (this.commandByte & 32) !== 0) {
              this.main.cpu.interruptLine = true;
            }
            if ((this.commandByte & 3) !== (this.vdpreg[reg] & 3)) {
              this.isSatDirty = true;
            }
            break;
          case 2:
            this.bgt = (this.commandByte & 15 & ~1) << 10;
            break;
          case 5:
            var old = this.sat;
            this.sat = (this.commandByte & ~1 & ~128) << 7;
            if (old !== this.sat) {
              this.isSatDirty = true;
            }
            break;
        }
        this.vdpreg[reg] = this.commandByte;
      }
    }
  }
}, dataRead:function() {
  this.firstByte = true;
  var value = this.readBuffer;
  this.readBuffer = this.VRAM[this.location++ & 16383] & 255;
  return value;
}, dataWrite:function(value) {
  var temp = 0;
  this.firstByte = true;
  switch(this.operation) {
    case 0:
    ;
    case 1:
    ;
    case 2:
      var address = this.location & 16383;
      if (value !== (this.VRAM[address] & 255)) {
        if (address >= this.sat && address < this.sat + 64 || address >= this.sat + 128 && address < this.sat + 256) {
          this.isSatDirty = true;
        } else {
          var tileIndex = address >> 5;
          this.isTileDirty[tileIndex] = 1;
          if (tileIndex < this.minDirty) {
            this.minDirty = tileIndex;
          }
          if (tileIndex > this.maxDirty) {
            this.maxDirty = tileIndex;
          }
        }
        this.VRAM[address] = value;
      }
      break;
    case 3:
      if (this.main.is_sms) {
        temp = (this.location & 31) * 3;
        this.CRAM[temp] = this.main_JAVA_R[value];
        this.CRAM[temp + 1] = this.main_JAVA_G[value];
        this.CRAM[temp + 2] = this.main_JAVA_B[value];
      } else {
        temp = ((this.location & 63) >> 1) * 3;
        if (!(this.location & 1)) {
          this.CRAM[temp] = this.GG_JAVA_R[value];
          this.CRAM[temp + 1] = this.GG_JAVA_G[value];
        } else {
          this.CRAM[temp + 2] = this.GG_JAVA_B[value];
        }
      }
      break;
  }
  if (ACCURATE) {
    this.readBuffer = value;
  }
  this.location++;
}, interrupts:function(lineno) {
  if (lineno <= 192) {
    if (!ACCURATE_INTERRUPT_EMULATION && lineno === 192) {
      this.status |= STATUS_VINT;
    }
    if (this.counter === 0) {
      this.counter = this.vdpreg[10];
      this.status |= STATUS_HINT;
    } else {
      this.counter--;
    }
    if ((this.status & STATUS_HINT) !== 0 && (this.vdpreg[0] & 16) !== 0) {
      this.main.cpu.interruptLine = true;
    }
  } else {
    this.counter = this.vdpreg[10];
    if ((this.status & STATUS_VINT) !== 0 && (this.vdpreg[1] & 32) !== 0 && lineno < 224) {
      this.main.cpu.interruptLine = true;
    }
    if (ACCURATE && lineno === this.main.no_of_scanlines - 1) {
      this.vScrollLatch = this.vdpreg[9];
    }
  }
}, setVBlankFlag:function() {
  this.status |= STATUS_VINT;
}, drawLine:function(lineno) {
  var x = 0;
  var location = 0;
  var colour = 0;
  if (this.main.is_gg && (lineno < GG_Y_OFFSET || lineno >= GG_Y_OFFSET + GG_HEIGHT)) {
    return;
  }
  if (VDP_SPRITE_COLLISIONS) {
    for (x = 0;x < SMS_WIDTH;x++) {
      this.spriteCol[x] = false;
    }
  }
  if ((this.vdpreg[1] & 64) !== 0) {
    if (this.maxDirty !== -1) {
      this.decodeTiles();
    }
    this.drawBg(lineno);
    if (this.isSatDirty) {
      this.decodeSat();
    }
    if (this.lineSprites[lineno][SPRITE_COUNT] !== 0) {
      this.drawSprite(lineno);
    }
    if (this.main.is_sms && this.vdpreg[0] & 32) {
      location = (lineno << 8) * 4;
      colour = ((this.vdpreg[7] & 15) + 16) * 3;
      for (x = location;x < location + 8 * 4;x = x + 4) {
        this.display[x] = this.CRAM[colour];
        this.display[x + 1] = this.CRAM[colour + 1];
        this.display[x + 2] = this.CRAM[colour + 2];
      }
    }
  } else {
    this.drawBGColour(lineno);
  }
}, drawBg:function(lineno) {
  var pixX = 0;
  var colour = 0;
  var temp = 0;
  var temp2 = 0;
  var hscroll = this.vdpreg[8];
  var vscroll = ACCURATE ? this.vScrollLatch : this.vdpreg[9];
  if (lineno < 16 && (this.vdpreg[0] & 64) !== 0) {
    hscroll = 0;
  }
  var lock = this.vdpreg[0] & 128;
  var tile_column = 32 - (hscroll >> 3) + this.h_start;
  var tile_row = lineno + vscroll >> 3;
  if (tile_row > 27) {
    tile_row -= 28;
  }
  var tile_y = (lineno + (vscroll & 7) & 7) << 3;
  var row_precal = lineno << 8;
  for (var tx = this.h_start;tx < this.h_end;tx++) {
    var tile_props = this.bgt + ((tile_column & 31) << 1) + (tile_row << 6);
    var secondbyte = this.VRAM[tile_props + 1];
    var pal = (secondbyte & 8) << 1;
    var sx = (tx << 3) + (hscroll & 7);
    var pixY = (secondbyte & 4) === 0 ? tile_y : (7 << 3) - tile_y;
    var tile = this.tiles[(this.VRAM[tile_props] & 255) + ((secondbyte & 1) << 8)];
    if (!(secondbyte & 2)) {
      for (pixX = 0;pixX < 8 && sx < SMS_WIDTH;pixX++, sx++) {
        colour = tile[pixX + pixY];
        temp = (sx + row_precal) * 4;
        temp2 = (colour + pal) * 3;
        this.bgPriority[sx] = (secondbyte & 16) !== 0 && colour !== 0;
        if (sx >= this.h_start * 8 && sx < this.h_end * 8) {
          this.display[temp] = this.CRAM[temp2];
          this.display[temp + 1] = this.CRAM[temp2 + 1];
          this.display[temp + 2] = this.CRAM[temp2 + 2];
        }
      }
    } else {
      for (pixX = 7;pixX >= 0 && sx < SMS_WIDTH;pixX--, sx++) {
        colour = tile[pixX + pixY];
        temp = (sx + row_precal) * 4;
        temp2 = (colour + pal) * 3;
        this.bgPriority[sx] = (secondbyte & 16) !== 0 && colour !== 0;
        if (sx >= this.h_start * 8 && sx < this.h_end * 8) {
          this.display[temp] = this.CRAM[temp2];
          this.display[temp + 1] = this.CRAM[temp2 + 1];
          this.display[temp + 2] = this.CRAM[temp2 + 2];
        }
      }
    }
    tile_column++;
    if (lock !== 0 && tx === 23) {
      tile_row = lineno >> 3;
      tile_y = (lineno & 7) << 3;
    }
  }
}, drawSprite:function(lineno) {
  var colour = 0;
  var temp = 0;
  var temp2 = 0;
  var i = 0;
  var sprites = this.lineSprites[lineno];
  var count = Math.min(SPRITES_PER_LINE, sprites[SPRITE_COUNT]);
  var zoomed = this.vdpreg[1] & 1;
  var row_precal = lineno << 8;
  var off = count * 3;
  for (;i < count;i++) {
    var n = sprites[off--] | (this.vdpreg[6] & 4) << 6;
    var y = sprites[off--];
    var x = sprites[off--] - (this.vdpreg[0] & 8);
    var tileRow = lineno - y >> zoomed;
    if ((this.vdpreg[1] & 2) !== 0) {
      n &= ~1;
    }
    var tile = this.tiles[n + ((tileRow & 8) >> 3)];
    var pix = 0;
    if (x < 0) {
      pix = -x;
      x = 0;
    }
    var offset = pix + ((tileRow & 7) << 3);
    if (!zoomed) {
      for (;pix < 8 && x < this.h_end * 8;pix++, x++) {
        colour = tile[offset++];
        if (x >= this.h_start * 8 && colour !== 0 && !this.bgPriority[x]) {
          temp = (x + row_precal) * 4;
          temp2 = (colour + 16) * 3;
          this.display[temp] = this.CRAM[temp2];
          this.display[temp + 1] = this.CRAM[temp2 + 1];
          this.display[temp + 2] = this.CRAM[temp2 + 2];
          if (VDP_SPRITE_COLLISIONS) {
            if (!this.spriteCol[x]) {
              this.spriteCol[x] = true;
            } else {
              this.status |= STATUS_COLLISION;
            }
          }
        }
      }
    } else {
      for (;pix < 8 && x < this.h_end * 8;pix++, x += 2) {
        colour = tile[offset++];
        if (x >= this.h_start * 8 && colour !== 0 && !this.bgPriority[x]) {
          temp = (x + row_precal) * 4;
          temp2 = (colour + 16) * 3;
          this.display[temp] = this.CRAM[temp2];
          this.display[temp + 1] = this.CRAM[temp2 + 1];
          this.display[temp + 2] = this.CRAM[temp2 + 2];
          if (VDP_SPRITE_COLLISIONS) {
            if (!this.spriteCol[x]) {
              this.spriteCol[x] = true;
            } else {
              this.status |= STATUS_COLLISION;
            }
          }
        }
        if (x + 1 >= this.h_start * 8 && colour !== 0 && !this.bgPriority[x + 1]) {
          temp = (x + row_precal + 1) * 4;
          temp2 = (colour + 16) * 3;
          this.display[temp] = this.CRAM[temp2];
          this.display[temp + 1] = this.CRAM[temp2 + 1];
          this.display[temp + 2] = this.CRAM[temp2 + 2];
          if (VDP_SPRITE_COLLISIONS) {
            if (!this.spriteCol[x + 1]) {
              this.spriteCol[x + 1] = true;
            } else {
              this.status |= STATUS_COLLISION;
            }
          }
        }
      }
    }
  }
  if (sprites[SPRITE_COUNT] >= SPRITES_PER_LINE) {
    this.status |= STATUS_OVERFLOW;
  }
}, drawBGColour:function(lineno) {
  var x = 0;
  var location = (lineno << 8) * 4;
  var colour = ((this.vdpreg[7] & 15) + 16) * 3;
  for (x = location + this.h_start * 8 * 4;x < location + this.h_end * 8 * 4;x = x + 4) {
    this.display[x] = this.CRAM[colour];
    this.display[x + 1] = this.CRAM[colour + 1];
    this.display[x + 2] = this.CRAM[colour + 2];
  }
}, decodeTiles:function() {
  for (var i = this.minDirty;i <= this.maxDirty;i++) {
    if (!this.isTileDirty[i]) {
      continue;
    }
    this.isTileDirty[i] = 0;
    var tile = this.tiles[i];
    var pixel_index = 0;
    var address = i << 5;
    for (var y = 0;y < TILE_SIZE;y++) {
      var address0 = this.VRAM[address++];
      var address1 = this.VRAM[address++];
      var address2 = this.VRAM[address++];
      var address3 = this.VRAM[address++];
      for (var bit = 128;bit !== 0;bit >>= 1) {
        var colour = 0;
        if ((address0 & bit) !== 0) {
          colour |= 1;
        }
        if ((address1 & bit) !== 0) {
          colour |= 2;
        }
        if ((address2 & bit) !== 0) {
          colour |= 4;
        }
        if ((address3 & bit) !== 0) {
          colour |= 8;
        }
        tile[pixel_index++] = colour;
      }
    }
  }
  this.minDirty = TOTAL_TILES;
  this.maxDirty = -1;
}, decodeSat:function() {
  this.isSatDirty = false;
  for (var i = 0;i < this.lineSprites.length;i++) {
    this.lineSprites[i][SPRITE_COUNT] = 0;
  }
  var height = (this.vdpreg[1] & 2) === 0 ? 8 : 16;
  if ((this.vdpreg[1] & 1) === 1) {
    height <<= 1;
  }
  for (var spriteno = 0;spriteno < 64;spriteno++) {
    var y = this.VRAM[this.sat + spriteno] & 255;
    if (y === 208) {
      return;
    }
    y++;
    if (y > 240) {
      y -= 256;
    }
    for (var lineno = y;lineno < SMS_HEIGHT;lineno++) {
      if (lineno - y < height) {
        var sprites = this.lineSprites[lineno];
        if (!sprites || sprites[SPRITE_COUNT] >= SPRITES_PER_LINE) {
          break;
        }
        var off = sprites[SPRITE_COUNT] * 3 + SPRITE_X;
        var address = this.sat + (spriteno << 1) + 128;
        sprites[off++] = this.VRAM[address++] & 255;
        sprites[off++] = y;
        sprites[off++] = this.VRAM[address] & 255;
        sprites[SPRITE_COUNT]++;
      }
    }
  }
}, createCachedImages:function() {
  for (var i = 0;i < TOTAL_TILES;i++) {
    this.tiles[i] = new JSSMS.Utils.Uint8Array(TILE_SIZE * TILE_SIZE);
  }
}, generateConvertedPals:function() {
  var i;
  var r, g, b;
  for (i = 0;i < 64;i++) {
    r = i & 3;
    g = i >> 2 & 3;
    b = i >> 4 & 3;
    this.main_JAVA_R[i] = r * 85 & 255;
    this.main_JAVA_G[i] = g * 85 & 255;
    this.main_JAVA_B[i] = b * 85 & 255;
  }
  for (i = 0;i < 256;i++) {
    g = i & 15;
    b = i >> 4 & 15;
    this.GG_JAVA_R[i] = (g << 4 | g) & 255;
    this.GG_JAVA_G[i] = (b << 4 | b) & 255;
  }
  for (i = 0;i < 16;i++) {
    this.GG_JAVA_B[i] = (i << 4 | i) & 255;
  }
}, getState:function() {
  var state = new Array(3 + 16 + 32);
  state[0] = this.videoMode | this.status << 8 | (this.firstByte ? 1 << 16 : 0) | this.commandByte << 24;
  state[1] = this.location | this.operation << 16 | this.readBuffer << 24;
  state[2] = this.counter | this.vScrollLatch << 8 | this.line << 16;
  JSSMS.Utils.copyArrayElements(this.vdpreg, 0, state, 3, 16);
  JSSMS.Utils.copyArrayElements(this.CRAM, 0, state, 3 + 16, 32 * 3);
  return state;
}, setState:function(state) {
  var temp = state[0];
  this.videoMode = temp & 255;
  this.status = temp >> 8 & 255;
  this.firstByte = (temp >> 16 & 255) !== 0;
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
  JSSMS.Utils.copyArrayElements(state, 3 + 16, this.CRAM, 0, 32 * 3);
  this.forceFullRedraw();
}};
JSSMS.DummyUI = function(sms) {
  this.main = sms;
  this.reset = function() {
  };
  this.updateStatus = function() {
  };
  this.writeAudio = function() {
  };
  this.writeFrame = function() {
  };
  this.updateDisassembly = function() {
  };
  this.canvasImageData = {data:[]};
};
if (window["$"]) {
  $.fn["JSSMSUI"] = function(roms) {
    var parent = this;
    var UI = function(sms) {
      this.main = sms;
      if (Object.prototype.toString.call(window["operamini"]) === "[object OperaMini]") {
        $(parent).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>');
        return;
      }
      var self = this;
      var root = $("<div></div>");
      var screenContainer = $('<div id="screen"></div>');
      var gamepadContainer = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>');
      var controls = $('<div id="controls"></div>');
      var fullscreenSupport = JSSMS.Utils.getPrefix(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]);
      var requestAnimationFramePrefix = JSSMS.Utils.getPrefix(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame"], window);
      var i;
      if (requestAnimationFramePrefix) {
        this.requestAnimationFrame = window[requestAnimationFramePrefix].bind(window);
      } else {
        var lastTime = 0;
        this.requestAnimationFrame = function(callback) {
          var currTime = JSSMS.Utils.getTimestamp();
          var timeToCall = Math.max(0, 1E3 / 60 - (currTime - lastTime));
          window.setTimeout(function() {
            lastTime = JSSMS.Utils.getTimestamp();
            callback();
          }, timeToCall);
        };
      }
      this.screen = $("<canvas width=" + SMS_WIDTH + " height=" + SMS_HEIGHT + " moz-opaque></canvas>");
      this.canvasContext = this.screen[0].getContext("2d", {"alpha":false});
      this.canvasContext["webkitImageSmoothingEnabled"] = false;
      this.canvasContext["mozImageSmoothingEnabled"] = false;
      this.canvasContext["imageSmoothingEnabled"] = false;
      if (!this.canvasContext.getImageData) {
        $(parent).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>');
        return;
      }
      this.canvasImageData = this.canvasContext.getImageData(0, 0, SMS_WIDTH, SMS_HEIGHT);
      this.gamepad = {up:P1_KEY_UP, down:P1_KEY_DOWN, left:P1_KEY_LEFT, right:P1_KEY_RIGHT, fire1:P1_KEY_FIRE1, fire2:P1_KEY_FIRE2};
      var startButton = $(".start", gamepadContainer);
      this.romContainer = $('<div id="romSelector"></div>');
      this.romSelect = $("<select></select>").change(function() {
        self.loadROM();
      });
      this.buttons = Object.create(null);
      this.buttons.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">').click(function() {
        if (!self.main.isRunning) {
          self.main.start();
          self.buttons.start.attr("value", "Pause");
        } else {
          self.main.stop();
          self.updateStatus("Paused");
          self.buttons.start.attr("value", "Start");
        }
      });
      this.buttons.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">').click(function() {
        if (!self.main.reloadRom()) {
          $(this).attr("disabled", "disabled");
          return;
        }
        self.main.reset();
        self.main.vdp.forceFullRedraw();
        self.main.start();
      });
      if (ENABLE_DEBUGGER) {
        this.dissambler = $('<div id="dissambler"></div>');
        $(parent).after(this.dissambler);
        this.buttons.nextStep = $('<input type="button" value="Next step" class="btn" disabled="disabled">').click(function() {
          self.main.nextStep();
        });
      }
      if (this.main.soundEnabled) {
        this.buttons.sound = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').click(function() {
          if (self.main.soundEnabled) {
            self.main.soundEnabled = false;
            self.buttons.sound.attr("value", "Enable sound");
          } else {
            self.main.soundEnabled = true;
            self.buttons.sound.attr("value", "Disable sound");
          }
        });
      }
      if (fullscreenSupport) {
        this.buttons.fullscreen = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
          var screen = (screenContainer[0]);
          if (screen.requestFullscreen) {
            screen.requestFullscreen();
          } else {
            if (screen.mozRequestFullScreen) {
              screen.mozRequestFullScreen();
            } else {
              screen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          }
        });
      } else {
        this.zoomed = false;
        this.buttons.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">').click(function() {
          if (self.zoomed) {
            self.screen.animate({width:SMS_WIDTH + "px", height:SMS_HEIGHT + "px"}, function() {
              $(this).removeAttr("style");
            });
            self.buttons.zoom.attr("value", "Zoom in");
          } else {
            self.screen.animate({width:SMS_WIDTH * 2 + "px", height:SMS_HEIGHT * 2 + "px"});
            self.buttons.zoom.attr("value", "Zoom out");
          }
          self.zoomed = !self.zoomed;
        });
      }
      gamepadContainer.on("touchstart touchmove", function(evt) {
        evt.preventDefault();
        self.main.keyboard.controller1 = 255;
        var touches = evt.originalEvent.touches;
        for (var i = 0;i < touches.length;i++) {
          var target = document.elementFromPoint(touches[i].clientX, touches[i].clientY);
          if (!target) {
            continue;
          }
          var className = target.className;
          if (!className || !self.gamepad[className]) {
            continue;
          }
          var key = self.gamepad[className];
          self.main.keyboard.controller1 &= ~key;
        }
      });
      gamepadContainer.on("touchend", function(evt) {
        evt.preventDefault();
        if (evt.originalEvent.touches.length === 0) {
          self.main.keyboard.controller1 = 255;
        }
      });
      function mouseDown(evt) {
        var className = this.className;
        var key = self.gamepad[className];
        self.main.keyboard.controller1 &= ~key;
        evt.preventDefault();
      }
      function mouseUp(evt) {
        var className = this.className;
        var key = self.gamepad[className];
        self.main.keyboard.controller1 |= key;
        evt.preventDefault();
      }
      for (i in this.gamepad) {
        $("." + i, gamepadContainer).mousedown(mouseDown).mouseup(mouseUp);
      }
      startButton.on("mousedown touchstart", function(evt) {
        if (self.main.is_sms) {
          self.main.pause_button = true;
        } else {
          self.main.keyboard.ggstart &= ~128;
        }
        evt.preventDefault();
      }).on("mouseup touchend", function(evt) {
        if (!self.main.is_sms) {
          self.main.keyboard.ggstart |= 128;
        }
        evt.preventDefault();
      });
      $(document).bind("keydown", function(evt) {
        self.main.keyboard.keydown(evt);
      }).bind("keyup", function(evt) {
        self.main.keyboard.keyup(evt);
      });
      for (i in this.buttons) {
        this.buttons[i].appendTo(controls);
      }
      this.log = $('<div id="status"></div>');
      this.screen.appendTo(screenContainer);
      gamepadContainer.appendTo(screenContainer);
      screenContainer.appendTo(root);
      this.romContainer.appendTo(root);
      controls.appendTo(root);
      this.log.appendTo(root);
      root.appendTo($(parent));
      if (roms !== undefined) {
        this.setRoms(roms);
      }
    };
    UI.prototype = {reset:function() {
      this.screen[0].width = SMS_WIDTH;
      this.screen[0].height = SMS_HEIGHT;
      this.log.empty();
      if (ENABLE_DEBUGGER) {
        this.dissambler.empty();
      }
    }, setRoms:function(roms) {
      var groupName, optgroup, length, i, count = 0;
      this.romSelect.children().remove();
      $("<option>Select a ROM...</option>").appendTo(this.romSelect);
      for (groupName in roms) {
        if (roms.hasOwnProperty(groupName)) {
          optgroup = $("<optgroup></optgroup>").attr("label", groupName);
          length = roms[groupName].length;
          i = 0;
          for (;i < length;i++) {
            $("<option>" + roms[groupName][i][0] + "</option>").attr("value", roms[groupName][i][1]).appendTo(optgroup);
          }
          optgroup.appendTo(this.romSelect);
        }
        count++;
      }
      if (count) {
        this.romSelect.appendTo(this.romContainer);
      }
    }, loadROM:function() {
      var self = this;
      this.updateStatus("Downloading...");
      $.ajax({url:encodeURI(this.romSelect.val()), xhr:function() {
        var xhr = $.ajaxSettings.xhr();
        if (xhr.overrideMimeType !== undefined) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
        self.xhr = xhr;
        return xhr;
      }, complete:function(xhr, status) {
        var data;
        if (status === "error") {
          self.updateStatus("The selected ROM file could not be loaded.");
          return;
        }
        data = xhr.responseText;
        self.main.stop();
        self.main.readRomDirectly(data, self.romSelect.val());
        self.main.reset();
        self.main.vdp.forceFullRedraw();
        self.enable();
      }});
    }, enable:function() {
      this.buttons.start.removeAttr("disabled");
      this.buttons.start.attr("value", "Start");
      this.buttons.reset.removeAttr("disabled");
      if (ENABLE_DEBUGGER) {
        this.buttons.nextStep.removeAttr("disabled");
      }
      if (this.main.soundEnabled) {
        if (this.buttons.sound) {
          this.buttons.sound.attr("value", "Disable sound");
        } else {
          this.buttons.sound.attr("value", "Enable sound");
        }
      }
    }, updateStatus:function(s) {
      this.log.text(s);
    }, writeAudio:function(buffer) {
      var source = this.main.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.main.audioContext.destination);
      source.start();
    }, writeFrame:function() {
      var hiddenPrefix = JSSMS.Utils.getPrefix(["hidden", "mozHidden", "webkitHidden", "msHidden"]);
      if (hiddenPrefix) {
        return function() {
          if (document[hiddenPrefix]) {
            return;
          }
          this.canvasContext.putImageData(this.canvasImageData, 0, 0);
        };
      } else {
        return function() {
          this.canvasContext.putImageData(this.canvasImageData, 0, 0);
        };
      }
    }(), updateDisassembly:function(currentAddress) {
      var startAddress = currentAddress < 8 ? 0 : currentAddress - 8;
      var instructions = this.main.cpu.instructions;
      var length = instructions.length;
      var html = "";
      var i = startAddress;
      var num = 0;
      for (;num < 16 && i <= length;i++) {
        if (instructions[i]) {
          html += "<div" + (instructions[i].address === currentAddress ? ' class="current"' : "") + ">" + instructions[i].hexAddress + (instructions[i].isJumpTarget ? ":" : " ") + "<code>" + instructions[i].inst + "</code></div>";
          num++;
        }
      }
      this.dissambler.html(html);
    }};
    return UI;
  };
}
;var IO_TR_DIRECTION = 0;
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
JSSMS.Ports.prototype = {reset:function() {
  if (LIGHTGUN) {
    this.ioPorts = new Array(10);
    this.ioPorts[PORT_A + IO_TH_INPUT] = 1;
    this.ioPorts[PORT_B + IO_TH_INPUT] = 1;
  } else {
    this.ioPorts = new Array(2);
  }
}, out:function(port, value) {
  if (this.main.is_gg && port < 7) {
    return;
  }
  switch(port & 193) {
    case 1:
      if (LIGHTGUN) {
        this.oldTH = this.getTH(PORT_A) !== 0 || this.getTH(PORT_B) !== 0;
        this.writePort(PORT_A, value);
        this.writePort(PORT_B, value >> 2);
        if (!this.oldTH && (this.getTH(PORT_A) !== 0 || this.getTH(PORT_B) !== 0)) {
          this.hCounter = this.getHCount();
        }
      } else {
        this.ioPorts[0] = (value & 32) << 1;
        this.ioPorts[1] = value & 128;
        if (this.europe === 0) {
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
}, in_:function(port) {
  if (this.main.is_gg && port < 7) {
    switch(port) {
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
  switch(port & 193) {
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
      if (LIGHTGUN) {
        if (this.keyboard.lightgunClick) {
          this.lightPhaserSync();
        }
        return this.keyboard.controller2 & 63 | (this.getTH(PORT_A) !== 0 ? 64 : 0) | (this.getTH(PORT_B) !== 0 ? 128 : 0);
      } else {
        return this.keyboard.controller2 & 63 | this.ioPorts[0] | this.ioPorts[1];
      }
    ;
  }
  return 255;
}, writePort:function(index, value) {
  this.ioPorts[index + IO_TR_DIRECTION] = value & 1;
  this.ioPorts[index + IO_TH_DIRECTION] = value & 2;
  this.ioPorts[index + IO_TR_OUTPUT] = value & 16;
  this.ioPorts[index + IO_TH_OUTPUT] = this.europe === 0 ? ~value & 32 : value & 32;
}, getTH:function(index) {
  return this.ioPorts[index + IO_TH_DIRECTION] === 0 ? this.ioPorts[index + IO_TH_OUTPUT] : this.ioPorts[index + IO_TH_INPUT];
}, setTH:function(index, on) {
  this.ioPorts[index + IO_TH_DIRECTION] = 1;
  this.ioPorts[index + IO_TH_INPUT] = on ? 1 : 0;
}, getHCount:function() {
  var pixels = Math.round(this.main.cpu.getCycle() * SMS_X_PIXELS / this.main.cyclesPerLine);
  var v = pixels - 8 >> 1;
  if (v > 147) {
    v += 233 - 148;
  }
  return v & 255;
}, X_RANGE:48, Y_RANGE:4, lightPhaserSync:function() {
  var oldTH = this.getTH(PORT_A);
  var hc = this.getHCount();
  var dx = this.keyboard.lightgunX - (hc << 1);
  var dy = this.keyboard.lightgunY - this.vdp.line;
  if (dy > -this.Y_RANGE && dy < this.Y_RANGE && (dx > -this.X_RANGE && dx < this.X_RANGE)) {
    this.setTH(PORT_A, false);
    if (oldTH !== this.getTH(PORT_A)) {
      this.hCounter = 20 + (this.keyboard.lightgunX >> 1);
    }
  } else {
    this.setTH(PORT_A, true);
    if (oldTH !== this.getTH(PORT_A)) {
      this.hCounter = hc;
    }
  }
}, setDomestic:function(value) {
  this.europe = value ? 64 : 0;
}, isDomestic:function() {
  return this.europe !== 0;
}};
var Bytecode = function() {
  var toHex = JSSMS.Utils.toHex;
  function Bytecode(address, page) {
    this.address = address;
    this.page = page;
    this.opcode = [];
    this.operand = null;
    this.nextAddress = null;
    this.target = null;
    this.isFunctionEnder = false;
    this.canEnd = false;
    this.changePage = false;
    this.isJumpTarget = false;
    this.jumpTargetNb = 0;
    this.ast = null;
  }
  Bytecode.prototype = {get hexOpcode() {
    if (this.opcode.length) {
      return this.opcode.map(toHex).join(" ");
    }
    return "";
  }, get label() {
    var name = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, toHex(this.target || this.operand || 0)) : "";
    return toHex(this.address + this.page * PAGE_SIZE) + " " + this.hexOpcode + " " + name;
  }};
  return Bytecode;
}();
var Parser = function() {
  var ACCURATE_INTERRUPT_EMULATION = true;
  var toHex = JSSMS.Utils.toHex;
  var parser = function(rom, frameReg) {
    this.stream = new RomStream(rom);
    this.frameReg = frameReg;
    this.addresses = Array(rom.length);
    this.entryPoints = [];
    this.bytecodes = Array(rom.length);
    for (var i = 0;i < rom.length;i++) {
      this.addresses[i] = [];
      this.bytecodes[i] = [];
    }
  };
  parser.prototype = {addEntryPoint:function(obj) {
    this.entryPoints.push(obj);
    this.addAddress(obj.address);
  }, parse:function(page) {
    JSSMS.Utils.console.time("Parsing");
    var currentPage;
    var pageStart;
    var pageEnd;
    if (page === undefined) {
      pageStart = 0;
      pageEnd = this.stream.length - 1;
    } else {
      pageStart = 0;
      pageEnd = 16384 - 1;
    }
    for (currentPage = 0;currentPage < this.addresses.length;currentPage++) {
      while (this.addresses[currentPage].length) {
        var currentObj = this.addresses[currentPage].shift();
        var currentAddress = currentObj.address % 16384;
        if (currentAddress < pageStart || currentAddress > pageEnd) {
          JSSMS.Utils.console.error("Address out of bound", toHex(currentAddress));
          continue;
        }
        if (this.bytecodes[currentPage][currentAddress]) {
          continue;
        }
        var bytecode = new Bytecode(currentAddress, currentPage);
        this.bytecodes[currentPage][currentAddress] = disassemble(bytecode, this.stream);
        if (this.bytecodes[currentPage][currentAddress].nextAddress !== null && this.bytecodes[currentPage][currentAddress].nextAddress >= pageStart && this.bytecodes[currentPage][currentAddress].nextAddress <= pageEnd) {
          this.addAddress(this.bytecodes[currentPage][currentAddress].nextAddress);
        }
        if (this.bytecodes[currentPage][currentAddress].target !== null && this.bytecodes[currentPage][currentAddress].target >= pageStart && this.bytecodes[currentPage][currentAddress].target <= pageEnd) {
          this.addAddress(this.bytecodes[currentPage][currentAddress].target);
        }
      }
    }
    if (this.bytecodes[0][1023]) {
      this.bytecodes[0][1023].isFunctionEnder = true;
    } else {
      if (this.bytecodes[0][1022]) {
        this.bytecodes[0][1022].isFunctionEnder = true;
      }
    }
    var i = 0;
    var length = 0;
    for (i = 0, length = this.entryPoints.length;i < length;i++) {
      var entryPoint = this.entryPoints[i].address;
      var romPage = this.entryPoints[i].romPage;
      this.bytecodes[romPage][entryPoint].isJumpTarget = true;
      this.bytecodes[romPage][entryPoint].jumpTargetNb++;
    }
    for (currentPage = 0;currentPage < this.bytecodes.length;currentPage++) {
      for (i = 0, length = this.bytecodes[currentPage].length;i < length;i++) {
        if (!this.bytecodes[currentPage][i]) {
          continue;
        }
        if (this.bytecodes[currentPage][i].nextAddress !== null && this.bytecodes[currentPage][this.bytecodes[currentPage][i].nextAddress]) {
          this.bytecodes[currentPage][this.bytecodes[currentPage][i].nextAddress].jumpTargetNb++;
        }
        if (this.bytecodes[currentPage][i].target !== null) {
          var targetPage = ~~(this.bytecodes[currentPage][i].target / 16384);
          var targetAddress = this.bytecodes[currentPage][i].target % 16384;
          if (this.bytecodes[targetPage] && this.bytecodes[targetPage][targetAddress]) {
            this.bytecodes[targetPage][targetAddress].isJumpTarget = true;
            this.bytecodes[targetPage][targetAddress].jumpTargetNb++;
          } else {
            JSSMS.Utils.console.log("Invalid target address", toHex(this.bytecodes[currentPage][i].target));
          }
        }
      }
    }
    JSSMS.Utils.console.timeEnd("Parsing");
  }, parseFromAddress:function(obj) {
    var address = obj.address % 16384;
    var romPage = obj.romPage;
    var pageStart = romPage * 16384;
    var pageEnd = (romPage + 1) * 16384;
    var branch = [];
    var bytecode;
    var startingBytecode = true;
    var absoluteAddress = 0;
    if (address < 1024 && romPage === 0) {
      pageStart = 0;
      pageEnd = 1024;
    }
    do {
      if (this.bytecodes[romPage][address]) {
        bytecode = this.bytecodes[romPage][address];
      } else {
        bytecode = new Bytecode(address, romPage);
        this.bytecodes[romPage][address] = disassemble(bytecode, this.stream);
      }
      if (bytecode.canEnd && !startingBytecode) {
        break;
      }
      address = bytecode.nextAddress % 16384;
      branch.push(bytecode);
      startingBytecode = false;
      absoluteAddress = address + romPage * 16384;
    } while (address !== null && absoluteAddress >= pageStart && absoluteAddress < pageEnd && !bytecode.isFunctionEnder);
    return branch;
  }, writeGraphViz:function() {
    JSSMS.Utils.console.time("DOT generation");
    var tree = this.bytecodes;
    var INDENT = " ";
    var content = ["digraph G {"];
    for (var i = 0, length = tree.length;i < length;i++) {
      if (!tree[i]) {
        continue;
      }
      content.push(INDENT + i + ' [label="' + tree[i].label + '"];');
      if (tree[i].target !== null) {
        content.push(INDENT + i + " -> " + tree[i].target + ";");
      }
      if (tree[i].nextAddress !== null) {
        content.push(INDENT + i + " -> " + tree[i].nextAddress + ";");
      }
    }
    content.push("}");
    content = content.join("\n");
    content = content.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
    JSSMS.Utils.console.timeEnd("DOT generation");
    return content;
  }, addAddress:function(address) {
    var memPage = ~~(address / 16384);
    var romPage = this.frameReg[memPage];
    address = address % 16384;
    this.addresses[romPage].push({address:address, romPage:romPage, memPage:memPage});
  }};
  function disassemble(bytecode, stream) {
    stream.page = bytecode.page;
    stream.seek(bytecode.address + stream.page * 16384);
    var opcode = stream.getUint8();
    var operand = null;
    var target = null;
    var isFunctionEnder = false;
    var canEnd = false;
    bytecode.opcode.push(opcode);
    switch(opcode) {
      case 0:
        break;
      case 1:
        operand = stream.getUint16();
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        operand = stream.getUint8();
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
      case 13:
        break;
      case 14:
        operand = stream.getUint8();
        break;
      case 15:
        break;
      case 16:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 17:
        operand = stream.getUint16();
        break;
      case 18:
        break;
      case 19:
        break;
      case 20:
        break;
      case 21:
        break;
      case 22:
        operand = stream.getUint8();
        break;
      case 23:
        break;
      case 24:
        target = stream.position + stream.getInt8();
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 25:
        break;
      case 26:
        break;
      case 27:
        break;
      case 28:
        break;
      case 29:
        break;
      case 30:
        operand = stream.getUint8();
        break;
      case 31:
        break;
      case 32:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 33:
        operand = stream.getUint16();
        break;
      case 34:
        operand = stream.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        operand = stream.getUint8();
        break;
      case 39:
        break;
      case 40:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 41:
        break;
      case 42:
        operand = stream.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        operand = stream.getUint8();
        break;
      case 47:
        break;
      case 48:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 49:
        operand = stream.getUint16();
        break;
      case 50:
        operand = stream.getUint16();
        break;
      case 51:
        break;
      case 52:
        break;
      case 53:
        break;
      case 54:
        operand = stream.getUint8();
        break;
      case 55:
        break;
      case 56:
        target = stream.position + stream.getInt8();
        canEnd = true;
        break;
      case 57:
        break;
      case 58:
        operand = stream.getUint16();
        break;
      case 59:
        break;
      case 60:
        break;
      case 61:
        break;
      case 62:
        operand = stream.getUint8();
        break;
      case 63:
        break;
      case 64:
        break;
      case 65:
        break;
      case 66:
        break;
      case 67:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        break;
      case 71:
        break;
      case 72:
        break;
      case 73:
        break;
      case 74:
        break;
      case 75:
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        break;
      case 79:
        break;
      case 80:
        break;
      case 81:
        break;
      case 82:
        break;
      case 83:
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        break;
      case 87:
        break;
      case 88:
        break;
      case 89:
        break;
      case 90:
        break;
      case 91:
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        break;
      case 95:
        break;
      case 96:
        break;
      case 97:
        break;
      case 98:
        break;
      case 99:
        break;
      case 100:
        break;
      case 101:
        break;
      case 102:
        break;
      case 103:
        break;
      case 104:
        break;
      case 105:
        break;
      case 106:
        break;
      case 107:
        break;
      case 108:
        break;
      case 109:
        break;
      case 110:
        break;
      case 111:
        break;
      case 112:
        break;
      case 113:
        break;
      case 114:
        break;
      case 115:
        break;
      case 116:
        break;
      case 117:
        break;
      case 118:
        isFunctionEnder = true;
        break;
      case 119:
        break;
      case 120:
        break;
      case 121:
        break;
      case 122:
        break;
      case 123:
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        break;
      case 127:
        break;
      case 128:
        break;
      case 129:
        break;
      case 130:
        break;
      case 131:
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        break;
      case 135:
        break;
      case 136:
        break;
      case 137:
        break;
      case 138:
        break;
      case 139:
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        break;
      case 143:
        break;
      case 144:
        break;
      case 145:
        break;
      case 146:
        break;
      case 147:
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        break;
      case 151:
        break;
      case 152:
        break;
      case 153:
        break;
      case 154:
        break;
      case 155:
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        break;
      case 159:
        break;
      case 160:
        break;
      case 161:
        break;
      case 162:
        break;
      case 163:
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        break;
      case 167:
        break;
      case 168:
        break;
      case 169:
        break;
      case 170:
        break;
      case 171:
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        break;
      case 175:
        break;
      case 176:
        break;
      case 177:
        break;
      case 178:
        break;
      case 179:
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        break;
      case 183:
        break;
      case 184:
        break;
      case 185:
        break;
      case 186:
        break;
      case 187:
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        break;
      case 191:
        break;
      case 192:
        canEnd = true;
        break;
      case 193:
        break;
      case 194:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 195:
        target = stream.getUint16();
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 196:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 197:
        break;
      case 198:
        operand = stream.getUint8();
        break;
      case 199:
        target = 0;
        isFunctionEnder = true;
        break;
      case 200:
        canEnd = true;
        break;
      case 201:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 202:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 203:
        return getCB(bytecode, stream);
      case 204:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 205:
        target = stream.getUint16();
        isFunctionEnder = true;
        break;
      case 206:
        operand = stream.getUint8();
        break;
      case 207:
        target = 8;
        isFunctionEnder = true;
        break;
      case 208:
        canEnd = true;
        break;
      case 209:
        break;
      case 210:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 211:
        operand = stream.getUint8();
        break;
      case 212:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 213:
        break;
      case 214:
        operand = stream.getUint8();
        break;
      case 215:
        target = 16;
        isFunctionEnder = true;
        break;
      case 216:
        canEnd = true;
        break;
      case 217:
        break;
      case 218:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 219:
        operand = stream.getUint8();
        break;
      case 220:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 221:
        return getIndex(bytecode, stream);
      case 222:
        operand = stream.getUint8();
        break;
      case 223:
        target = 24;
        isFunctionEnder = true;
        break;
      case 224:
        canEnd = true;
        break;
      case 225:
        break;
      case 226:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 227:
        break;
      case 228:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 229:
        break;
      case 230:
        operand = stream.getUint8();
        break;
      case 231:
        target = 32;
        isFunctionEnder = true;
        break;
      case 232:
        canEnd = true;
        break;
      case 233:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 234:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 235:
        break;
      case 236:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 237:
        return getED(bytecode, stream);
      case 238:
        operand = stream.getUint8();
        break;
      case 239:
        target = 40;
        isFunctionEnder = true;
        break;
      case 240:
        canEnd = true;
        break;
      case 241:
        break;
      case 242:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 243:
        break;
      case 244:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 245:
        break;
      case 246:
        operand = stream.getUint8();
        break;
      case 247:
        target = 48;
        isFunctionEnder = true;
        break;
      case 248:
        canEnd = true;
        break;
      case 249:
        break;
      case 250:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 251:
        break;
      case 252:
        target = stream.getUint16();
        canEnd = true;
        break;
      case 253:
        return getIndex(bytecode, stream);
      case 254:
        operand = stream.getUint8();
        break;
      case 255:
        target = 56;
        isFunctionEnder = true;
        break;
      default:
        JSSMS.Utils.console.error("Unexpected opcode", toHex(opcode));
    }
    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    bytecode.target = target;
    bytecode.isFunctionEnder = isFunctionEnder;
    bytecode.canEnd = canEnd;
    return bytecode;
  }
  function getCB(bytecode, stream) {
    var opcode = stream.getUint8();
    bytecode.opcode.push(opcode);
    bytecode.nextAddress = stream.position;
    return bytecode;
  }
  function getED(bytecode, stream) {
    var opcode = stream.getUint8();
    var operand = null;
    var target = null;
    var isFunctionEnder = false;
    var canEnd = false;
    bytecode.opcode.push(opcode);
    switch(opcode) {
      case 64:
        break;
      case 65:
        break;
      case 66:
        break;
      case 67:
        operand = stream.getUint16();
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
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 70:
      ;
      case 78:
      ;
      case 102:
      ;
      case 110:
        break;
      case 71:
        break;
      case 72:
        break;
      case 73:
        break;
      case 74:
        break;
      case 75:
        operand = stream.getUint16();
        break;
      case 79:
        break;
      case 80:
        break;
      case 81:
        break;
      case 82:
        break;
      case 83:
        operand = stream.getUint16();
        break;
      case 86:
      ;
      case 118:
        break;
      case 87:
        break;
      case 88:
        break;
      case 89:
        break;
      case 90:
        break;
      case 91:
        operand = stream.getUint16();
        break;
      case 95:
        break;
      case 96:
        break;
      case 97:
        break;
      case 98:
        break;
      case 99:
        operand = stream.getUint16();
        break;
      case 103:
        break;
      case 104:
        break;
      case 105:
        break;
      case 106:
        break;
      case 107:
        operand = stream.getUint16();
        break;
      case 111:
        break;
      case 113:
        break;
      case 114:
        break;
      case 115:
        operand = stream.getUint16();
        break;
      case 120:
        break;
      case 121:
        break;
      case 122:
        break;
      case 123:
        operand = stream.getUint16();
        break;
      case 160:
        break;
      case 161:
        break;
      case 162:
        break;
      case 163:
        break;
      case 168:
        break;
      case 169:
        break;
      case 170:
        break;
      case 171:
        break;
      case 176:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 177:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 178:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 179:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 184:
        break;
      case 185:
        break;
      case 186:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      case 187:
        if (ACCURATE_INTERRUPT_EMULATION) {
          target = stream.position - 2;
          canEnd = true;
        }
        break;
      default:
        JSSMS.Utils.console.error("Unexpected opcode", "0xED " + toHex(opcode));
    }
    if (bytecode.address >= 16383) {
      isFunctionEnder = true;
      bytecode.changePage = true;
    }
    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    bytecode.target = target;
    bytecode.isFunctionEnder = isFunctionEnder;
    bytecode.canEnd = canEnd;
    return bytecode;
  }
  function getIndex(bytecode, stream) {
    var opcode = stream.getUint8();
    var operand = null;
    var isFunctionEnder = false;
    bytecode.opcode.push(opcode);
    switch(opcode) {
      case 9:
        break;
      case 25:
        break;
      case 33:
        operand = stream.getUint16();
        break;
      case 34:
        operand = stream.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        operand = stream.getUint8();
        break;
      case 41:
        break;
      case 42:
        operand = stream.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        operand = stream.getUint8();
        break;
      case 52:
        operand = stream.getUint8();
        break;
      case 53:
        operand = stream.getUint8();
        break;
      case 54:
        operand = stream.getUint16();
        break;
      case 57:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        operand = stream.getUint8();
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        operand = stream.getUint8();
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        operand = stream.getUint8();
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        operand = stream.getUint8();
        break;
      case 96:
        break;
      case 97:
        break;
      case 98:
        break;
      case 99:
        break;
      case 100:
        break;
      case 101:
        break;
      case 102:
        operand = stream.getUint8();
        break;
      case 103:
        break;
      case 104:
        break;
      case 105:
        break;
      case 106:
        break;
      case 107:
        break;
      case 108:
        break;
      case 109:
        break;
      case 110:
        operand = stream.getUint8();
        break;
      case 111:
        break;
      case 112:
        operand = stream.getUint8();
        break;
      case 113:
        operand = stream.getUint8();
        break;
      case 114:
        operand = stream.getUint8();
        break;
      case 115:
        operand = stream.getUint8();
        break;
      case 116:
        operand = stream.getUint8();
        break;
      case 117:
        operand = stream.getUint8();
        break;
      case 119:
        operand = stream.getUint8();
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        operand = stream.getUint8();
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        operand = stream.getUint8();
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        operand = stream.getUint8();
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        operand = stream.getUint8();
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        operand = stream.getUint8();
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        operand = stream.getUint8();
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        operand = stream.getUint8();
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        operand = stream.getUint8();
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        operand = stream.getUint8();
        break;
      case 203:
        return getIndexCB(bytecode, stream);
      case 225:
        break;
      case 227:
        break;
      case 229:
        break;
      case 233:
        stream.seek(null);
        isFunctionEnder = true;
        break;
      case 249:
        break;
      default:
        JSSMS.Utils.console.error("Unexpected opcode", "0xDD/0xFD " + toHex(opcode));
    }
    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    bytecode.isFunctionEnder = isFunctionEnder;
    return bytecode;
  }
  function getIndexCB(bytecode, stream) {
    var operand = stream.getUint8();
    var opcode = stream.getUint8();
    bytecode.opcode.push(opcode);
    bytecode.nextAddress = stream.position;
    bytecode.operand = operand;
    return bytecode;
  }
  function RomStream(rom) {
    this.rom = rom;
    this.pos = null;
    this.page = 0;
  }
  RomStream.prototype = {get position() {
    return this.pos;
  }, get length() {
    return this.rom.length * PAGE_SIZE;
  }, seek:function(pos) {
    this.pos = pos;
  }, getUint8:function() {
    var value = 0;
    var page = this.page;
    var address = this.pos & 16383;
    if (SUPPORT_DATAVIEW) {
      value = this.rom[page].getUint8(address);
      this.pos++;
      if (address >= 16383) {
        this.page++;
      }
      return value;
    } else {
      value = this.rom[page][address] & 255;
      this.pos++;
      return value;
    }
  }, getInt8:function() {
    var value = 0;
    var page = this.page;
    var address = this.pos & 16383;
    if (SUPPORT_DATAVIEW) {
      value = this.rom[page].getInt8(address);
      this.pos++;
      if (address >= 16383) {
        this.page++;
      }
      return value + 1;
    } else {
      value = this.rom[page][address] & 255;
      if (value >= 128) {
        value = value - 256;
      }
      this.pos++;
      return value + 1;
    }
  }, getUint16:function() {
    var value = 0;
    var page = this.page;
    var address = this.pos & 16383;
    if (SUPPORT_DATAVIEW) {
      if (address < 16383) {
        value = this.rom[page].getUint16(address, LITTLE_ENDIAN);
        this.pos += 2;
        return value;
      } else {
        value = this.rom[page].getUint8(address) | this.rom[++page].getUint8(address) << 8;
        this.pos += 2;
        return value;
      }
    } else {
      value = this.rom[page][address] & 255 | (this.rom[page][address + 1] & 255) << 8;
      this.pos += 2;
      return value;
    }
  }};
  return parser;
}();
var BIT_TABLE = [1, 2, 4, 8, 16, 32, 64, 128];
var n = {IfStatement:function(test, consequent, alternate) {
  if (alternate === undefined) {
    alternate = null;
  }
  return {"type":"IfStatement", "test":test, "consequent":consequent, "alternate":alternate};
}, BlockStatement:function(body) {
  if (body === undefined) {
    body = [];
  }
  if (!Array.isArray(body)) {
    body = [body];
  }
  return {"type":"BlockStatement", "body":body};
}, ExpressionStatement:function(expression) {
  return {"type":"ExpressionStatement", "expression":expression};
}, ReturnStatement:function(argument) {
  if (argument === undefined) {
    argument = null;
  }
  return {"type":"ReturnStatement", "argument":argument};
}, VariableDeclaration:function(name, init) {
  return {"type":"VariableDeclaration", "declarations":[{"type":"VariableDeclarator", "id":{"type":"Identifier", "name":name}, "init":init}], "kind":"var"};
}, Identifier:function(name) {
  return {"type":"Identifier", "name":name};
}, Literal:function(value) {
  if (typeof value === "number") {
    return {"type":"Literal", "value":value, "raw":DEBUG ? JSSMS.Utils.toHex(value) : "" + value};
  } else {
    return {"type":"Literal", "value":value, "raw":"" + value};
  }
}, CallExpression:function(callee, args) {
  if (args === undefined) {
    args = [];
  }
  if (!Array.isArray(args)) {
    args = [args];
  }
  return {"type":"CallExpression", "callee":n.Identifier(callee), "arguments":args};
}, AssignmentExpression:function(operator, left, right) {
  return {"type":"AssignmentExpression", "operator":operator, "left":left, "right":right};
}, BinaryExpression:function(operator, left, right) {
  return {"type":"BinaryExpression", "operator":operator, "left":left, "right":right};
}, UnaryExpression:function(operator, argument) {
  return {"type":"UnaryExpression", "operator":operator, "argument":argument};
}, MemberExpression:function(object, property) {
  return {"type":"MemberExpression", "computed":true, "object":object, "property":property};
}, ArrayExpression:function(elements) {
  return {"type":"ArrayExpression", "elements":elements};
}, ConditionalExpression:function(test, consequent, alternate) {
  return {"type":"ConditionalExpression", "test":test, "consequent":consequent, "alternate":alternate};
}, LogicalExpression:function(operator, left, right) {
  return {"type":"LogicalExpression", "operator":operator, "left":left, "right":right};
}, Register:function(name) {
  return {"type":"Register", "name":name};
}, Bit:function(bitNumber) {
  return n.Literal(BIT_TABLE[bitNumber]);
}};
var o = {SET16:function(register1, register2, value) {
  if (value.type === "Literal") {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.BinaryExpression(">>", value, n.Literal(8)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register2), n.BinaryExpression("&", value, n.Literal(255))))];
  } else {
    return [n.VariableDeclaration("val", value), n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.BinaryExpression(">>", n.Identifier("val"), n.Literal(8)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register2), n.BinaryExpression("&", n.Identifier("val"), n.Literal(255))))];
  }
}, EX:function(register1, register2) {
  if (SUPPORT_DESTRUCTURING) {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.ArrayExpression([n.Register(register1), n.Register(register2)]), n.ArrayExpression([n.Register(register2), n.Register(register1)])))];
  } else {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register(register1))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.Register(register2))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register2), n.Identifier("temp")))];
  }
}, NOOP:function() {
  return function() {
  };
}, LD8:function(srcRegister, dstRegister1, dstRegister2) {
  if (dstRegister1 === undefined && dstRegister2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), n.Literal(value)));
    };
  }
  if (dstRegister1 === "i" && dstRegister2 === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), n.Register("i"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZ_TABLE"), n.Register(srcRegister))), n.ConditionalExpression(n.Identifier("iff2"), n.Literal(F_PARITY), n.Literal(0)))))];
    };
  }
  if (dstRegister1 === "r" && dstRegister2 === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), REFRESH_EMULATION ? n.Register("r") : n.CallExpression("JSSMS.Utils.rndInt", n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZ_TABLE"), n.Register(srcRegister))), n.ConditionalExpression(n.Identifier("iff2"), n.Literal(F_PARITY), 
      n.Literal(0)))))];
    };
  }
  if (dstRegister2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), n.Register(dstRegister1)));
    };
  }
  if (dstRegister1 === "n" && dstRegister2 === "n") {
    return function(value) {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), o.READ_MEM8(n.Literal(value))));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), o.READ_MEM8(n.CallExpression("get" + (dstRegister1 + dstRegister2).toUpperCase()))));
    };
  }
}, LD8_D:function(srcRegister, dstRegister1, dstRegister2) {
  return function(value) {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(srcRegister), o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (dstRegister1 + dstRegister2).toUpperCase()), n.Literal(value)))));
  };
}, LD16:function(srcRegister1, srcRegister2, dstRegister1, dstRegister2) {
  if (dstRegister1 === undefined && dstRegister2 === undefined) {
    return function(value) {
      return o.SET16(srcRegister1, srcRegister2, n.Literal(value));
    };
  }
  if (dstRegister1 === "n" && dstRegister2 === "n") {
    return function(value) {
      return o.SET16(srcRegister1, srcRegister2, o.READ_MEM16(n.Literal(value)));
    };
  }
  JSSMS.Utils.console.error("Wrong parameters number");
}, LD_WRITE_MEM:function(srcRegister1, srcRegister2, dstRegister1, dstRegister2) {
  if (dstRegister1 === undefined && dstRegister2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + (srcRegister1 + srcRegister2).toUpperCase()), n.Literal(value)]));
    };
  }
  if (srcRegister1 === "n" && srcRegister2 === "n" && dstRegister2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.CallExpression("setUint8", [n.Literal(value), n.Register(dstRegister1)]));
    };
  }
  if (srcRegister1 === "n" && srcRegister2 === "n") {
    return function(value) {
      return [n.ExpressionStatement(n.CallExpression("setUint8", [n.Literal(value), n.Register(dstRegister2)])), n.ExpressionStatement(n.CallExpression("setUint8", [n.Literal(value + 1), n.Register(dstRegister1)]))];
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + (srcRegister1 + srcRegister2).toUpperCase()), n.Register(dstRegister1)]));
    };
  }
}, LD_SP:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.Literal(value)));
    };
  }
  if (register1 === "n" && register2 === "n") {
    return function(value) {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), o.READ_MEM16(n.Literal(value))));
    };
  }
  return function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.CallExpression("get" + (register1 + register2).toUpperCase())));
  };
}, LD_NN:function(register1, register2) {
  if (register2 === undefined) {
    return function(value) {
      return [n.ExpressionStatement(n.CallExpression("setUint8", n.Literal(value), n.BinaryExpression("&", n.Identifier(register1), n.Literal(255)))), n.ExpressionStatement(n.CallExpression("setUint8", n.Literal(value + 1), n.BinaryExpression(">>", n.Identifier(register1), n.Literal(8))))];
    };
  } else {
    return function(value) {
      return [n.ExpressionStatement(n.CallExpression("setUint8", [n.Literal(value), n.Register(register2)])), n.ExpressionStatement(n.CallExpression("setUint8", [n.Literal(value + 1), n.Register(register1)]))];
    };
  }
}, INC8:function(register1, register2) {
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.CallExpression("inc8", n.Register(register1))));
    };
  }
  if (register1 === "s" && register2 === "p") {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1))));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("incMem", n.CallExpression("getHL")));
    };
  }
}, INC16:function(register1, register2) {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register2), n.BinaryExpression("&", n.BinaryExpression("+", n.Register(register2), n.Literal(1)), n.Literal(255)))), n.IfStatement(n.BinaryExpression("===", n.Register(register2), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.BinaryExpression("&", n.BinaryExpression("+", n.Register(register1), n.Literal(1)), n.Literal(255))))]))];
  };
}, DEC8:function(register1, register2) {
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.CallExpression("dec8", n.Register(register1))));
    };
  }
  if (register1 === "s" && register2 === "p") {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.BinaryExpression("-", n.Identifier("sp"), n.Literal(1))));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("decMem", n.CallExpression("getHL")));
    };
  }
}, DEC16:function(register1, register2) {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register2), n.BinaryExpression("&", n.BinaryExpression("-", n.Register(register2), n.Literal(1)), n.Literal(255)))), n.IfStatement(n.BinaryExpression("===", n.Register(register2), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.BinaryExpression("&", n.BinaryExpression("-", n.Register(register1), n.Literal(1)), n.Literal(255))))]))];
  };
}, ADD16:function(register1, register2, register3, register4) {
  if (register4 === undefined) {
    return function() {
      return o.SET16(register1, register2, n.CallExpression("add16", [n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Register(register3)]));
    };
  } else {
    return function() {
      return o.SET16(register1, register2, n.CallExpression("add16", [n.CallExpression("get" + (register1 + register2).toUpperCase()), n.CallExpression("get" + (register3 + register4).toUpperCase())]));
    };
  }
}, RLCA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rlca_a"));
  };
}, RRCA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rrca_a"));
  };
}, RLA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rla_a"));
  };
}, RRA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rra_a"));
  };
}, DAA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("daa"));
  };
}, CPL:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("cpl_a"));
  };
}, SCF:function() {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))];
  };
}, CCF:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("ccf"));
  };
}, ADD:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.CallExpression("add_a", n.Literal(value)));
    };
  }
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("add_a", n.Register(register1)));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("add_a", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase()))));
    };
  }
}, ADC:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.CallExpression("adc_a", n.Literal(value)));
    };
  }
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("adc_a", n.Register(register1)));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("adc_a", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase()))));
    };
  }
}, SUB:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value, target, nextAddress) {
      return n.ExpressionStatement(n.CallExpression("sub_a", n.Literal(value)));
    };
  }
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("sub_a", n.Register(register1)));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("sub_a", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase()))));
    };
  }
}, SBC:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value, target, nextAddress) {
      return n.ExpressionStatement(n.CallExpression("sbc_a", n.Literal(value)));
    };
  }
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("sbc_a", n.Register(register1)));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("sbc_a", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase()))));
    };
  }
}, AND:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), n.Literal(value))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))];
    };
  }
  if (register1 !== "a" && register2 === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), n.Register(register1))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))];
    };
  }
  if (register1 === "a" && register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))));
    };
  } else {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))];
    };
  }
}, XOR:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), n.Literal(value))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
    };
  }
  if (register1 !== "a" && register2 === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), n.Register(register1))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
    };
  }
  if (register1 === "a" && register2 === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register("a"), n.Literal(0))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Literal(0))))];
    };
  } else {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
    };
  }
}, OR:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), n.Literal(value))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
    };
  }
  if (register1 !== "a" && register2 === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), n.Register(register1))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
    };
  }
  if (register1 === "a" && register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))));
    };
  } else {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
    };
  }
}, CP:function(register1, register2) {
  if (register1 === undefined && register2 === undefined) {
    return function(value) {
      return n.ExpressionStatement(n.CallExpression("cp_a", n.Literal(value)));
    };
  }
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("cp_a", n.Register(register1)));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("cp_a", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase()))));
    };
  }
}, POP:function(register1, register2) {
  return function() {
    return [].concat(o.SET16(register1, register2, o.READ_MEM16(n.Identifier("sp"))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2))));
  };
}, PUSH:function(register1, register2) {
  return function() {
    return n.ExpressionStatement(n.CallExpression("pushUint8", [n.Register(register1), n.Register(register2)]));
  };
}, JR:function(test) {
  if (test === undefined) {
    return function(value, target, nextAddress) {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.BinaryExpression("+", n.Literal(target % 16384), n.BinaryExpression("*", n.Identifier("page"), n.Literal(16384)))));
    };
  }
  return function(value, target, nextAddress) {
    return n.IfStatement(test, n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.BinaryExpression("+", n.Literal(target % 16384), n.BinaryExpression("*", n.Identifier("page"), n.Literal(16384))))), n.ReturnStatement()]));
  };
}, DJNZ:function() {
  return function(value, target) {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register("b"), n.BinaryExpression("&", n.BinaryExpression("-", n.Register("b"), n.Literal(1)), n.Literal(255)))), o.JR(n.BinaryExpression("!==", n.Register("b"), n.Literal(0)))(undefined, target)];
  };
}, JRNZ:function() {
  return function(value, target) {
    return o.JR(n.UnaryExpression("!", n.BinaryExpression("!==", n.BinaryExpression("&", n.Register("f"), n.Literal(F_ZERO)), n.Literal(0))))(undefined, target);
  };
}, JRZ:function() {
  return function(value, target) {
    return o.JR(n.BinaryExpression("!==", n.BinaryExpression("&", n.Register("f"), n.Literal(F_ZERO)), n.Literal(0)))(undefined, target);
  };
}, JRNC:function() {
  return function(value, target) {
    return o.JR(n.UnaryExpression("!", n.BinaryExpression("!==", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(0))))(undefined, target);
  };
}, JRC:function() {
  return function(value, target) {
    return o.JR(n.BinaryExpression("!==", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(0)))(undefined, target);
  };
}, RET:function(operator, bitMask) {
  if (operator === undefined && bitMask === undefined) {
    return function() {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2)))];
    };
  } else {
    return function(value, target, nextAddress) {
      return n.IfStatement(n.BinaryExpression(operator, n.BinaryExpression("&", n.Register("f"), n.Literal(bitMask)), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(6))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2))), n.ReturnStatement()]));
    };
  }
}, JP:function(operator, bitMask) {
  if (operator === undefined && bitMask === undefined) {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal(target)))];
    };
  }
  if (operator === "h" && bitMask === "l") {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.CallExpression("get" + ("h" + "l").toUpperCase())))];
    };
  } else {
    return function(value, target) {
      return n.IfStatement(n.BinaryExpression(operator, n.BinaryExpression("&", n.Register("f"), n.Literal(bitMask)), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal(target))), n.ReturnStatement()]));
    };
  }
}, CALL:function(operator, bitMask) {
  if (operator === undefined && bitMask === undefined) {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.CallExpression("push", n.BinaryExpression("+", n.Literal(nextAddress % 16384), n.BinaryExpression("*", n.Identifier("page"), n.Literal(16384))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal(target))), n.ReturnStatement()];
    };
  } else {
    return function(value, target, nextAddress) {
      return n.IfStatement(n.BinaryExpression(operator, n.BinaryExpression("&", n.Register("f"), n.Literal(bitMask)), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(7))), n.ExpressionStatement(n.CallExpression("push", n.BinaryExpression("+", n.Literal(nextAddress % 16384), n.BinaryExpression("*", n.Identifier("page"), n.Literal(16384))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal(target))), 
      n.ReturnStatement()]));
    };
  }
}, RST:function(targetAddress) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.CallExpression("push", n.BinaryExpression("+", n.Literal(nextAddress % 16384), n.BinaryExpression("*", n.Identifier("page"), n.Literal(16384))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal(targetAddress))), n.ReturnStatement()];
  };
}, DI:function() {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff1"), n.Literal(false))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff2"), n.Literal(false))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("EI_inst"), n.Literal(true)))];
  };
}, EI:function() {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff1"), n.Literal(true))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff2"), n.Literal(true))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("EI_inst"), n.Literal(true)))];
  };
}, OUT:function(register1, register2) {
  if (register2 === undefined) {
    return function(value, target, nextAddress) {
      return n.ExpressionStatement(n.CallExpression("port.out", [n.Literal(value), n.Register(register1)]));
    };
  } else {
    return function() {
      return n.ExpressionStatement(n.CallExpression("port.out", [n.Register(register1), n.Register(register2)]));
    };
  }
}, IN:function(register1, register2) {
  if (register2 === undefined) {
    return function(value, target, nextAddress) {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.CallExpression("port.in_", n.Literal(value))));
    };
  } else {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.CallExpression("port.in_", n.Register(register2)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register(register1)))))];
    };
  }
}, EX_AF:function() {
  return function() {
    return [].concat(o.EX("a", "a2"), o.EX("f", "f2"));
  };
}, EXX:function() {
  return function() {
    return [].concat(o.EX("b", "b2"), o.EX("c", "c2"), o.EX("d", "d2"), o.EX("e", "e2"), o.EX("h", "h2"), o.EX("l", "l2"));
  };
}, EX_DE_HL:function() {
  return function() {
    return [].concat(o.EX("d", "h"), o.EX("e", "l"));
  };
}, EX_SP_HL:function() {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("h"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("h"), o.READ_MEM8(n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1))))), n.ExpressionStatement(n.CallExpression("setUint8", [n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1)), n.Identifier("temp")])), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("l"))), n.ExpressionStatement(n.AssignmentExpression("=", 
    n.Register("l"), o.READ_MEM8(n.Identifier("sp")))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("sp"), n.Identifier("temp")]))];
  };
}, HALT:function() {
  return function(value, target, nextAddress) {
    var ret = [];
    if (HALT_SPEEDUP) {
      ret.push(n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("tstates"), n.Literal(0))));
    }
    return ret.concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("halt"), n.Literal(true))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.BinaryExpression("+", n.Literal((nextAddress - 1) % 16384), n.BinaryExpression("*", n.Identifier("page"), n.Literal(16384))))), n.ReturnStatement()]);
  };
}, RLC:generateCBFunctions("rlc"), RRC:generateCBFunctions("rrc"), RL:generateCBFunctions("rl"), RR:generateCBFunctions("rr"), SLA:generateCBFunctions("sla"), SRA:generateCBFunctions("sra"), SLL:generateCBFunctions("sll"), SRL:generateCBFunctions("srl"), BIT:function(bit, register1, register2) {
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("bit", n.BinaryExpression("&", n.Register(register1), n.Bit(bit))));
    };
  } else {
    if (register1 === "h" && register2 === "l") {
      return function() {
        return n.ExpressionStatement(n.CallExpression("bit", n.BinaryExpression("&", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())), n.Bit(bit))));
      };
    } else {
      return function(value, target, nextAddress) {
        return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("bit", n.BinaryExpression("&", o.READ_MEM8(n.Identifier("location")), n.Bit(bit))))];
      };
    }
  }
}, RES:function(bit, register1, register2) {
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("&=", n.Register(register1), n.UnaryExpression("~", n.Bit(bit))));
    };
  } else {
    if (register1 === "h" && register2 === "l") {
      return function() {
        return n.ExpressionStatement(n.CallExpression("setUint8", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.BinaryExpression("&", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())), n.UnaryExpression("~", n.Bit(bit)))));
      };
    } else {
      return function(value, target, nextAddress) {
        return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("location"), n.BinaryExpression("&", o.READ_MEM8(n.Identifier("location")), n.UnaryExpression("~", n.Bit(bit)))]))];
      };
    }
  }
}, SET:function(bit, register1, register2) {
  if (register2 === undefined) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("|=", n.Register(register1), n.Bit(bit)));
    };
  } else {
    if (register1 === "h" && register2 === "l") {
      return function() {
        return n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + (register1 + register2).toUpperCase()), n.BinaryExpression("|", o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())), n.Bit(bit))]));
      };
    } else {
      return function(value, target, nextAddress) {
        return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("location"), n.BinaryExpression("|", o.READ_MEM8(n.Identifier("location")), n.Bit(bit))]))];
      };
    }
  }
}, LD_X:function(register1, register2, register3) {
  if (register3 === undefined) {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.CallExpression("setUint8", [n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value & 255)), n.Literal(value >> 8)]))];
    };
  } else {
    return function(value, target, nextAddress) {
      return [n.ExpressionStatement(n.CallExpression("setUint8", [n.BinaryExpression("+", n.CallExpression("get" + (register2 + register3).toUpperCase()), n.Literal(value)), n.Register(register1)]))];
    };
  }
}, INC_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.CallExpression("incMem", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value))))];
  };
}, DEC_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.CallExpression("decMem", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value))))];
  };
}, ADD_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return n.ExpressionStatement(n.CallExpression("add_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)))));
  };
}, ADC_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return n.ExpressionStatement(n.CallExpression("adc_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)))));
  };
}, SUB_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return n.ExpressionStatement(n.CallExpression("sub_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)))));
  };
}, SBC_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return n.ExpressionStatement(n.CallExpression("sbc_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)))));
  };
}, AND_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))];
  };
}, XOR_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
  };
}, OR_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))];
  };
}, CP_X:function(register1, register2) {
  return function(value) {
    return n.ExpressionStatement(n.CallExpression("cp_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)))));
  };
}, EX_SP_X:function(register1, register2) {
  return function() {
    return [].concat(n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.CallExpression("get" + (register1 + register2).toUpperCase()))), o.SET16(register1, register2, o.READ_MEM16(n.Identifier("sp"))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("sp"), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(255))])), n.ExpressionStatement(n.CallExpression("setUint8", [n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1)), n.BinaryExpression(">>", n.Identifier("sp"), 
    n.Literal(8))])));
  };
}, JP_X:function(register1, register2) {
  return function(value, target, nextAddress) {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.CallExpression("get" + (register1 + register2).toUpperCase())))];
  };
}, ADC16:function(register1, register2) {
  return function(value, target, nextAddress) {
    var valueAST;
    if (register2 === undefined) {
      valueAST = n.VariableDeclaration("value", n.Identifier(register1));
    } else {
      valueAST = n.VariableDeclaration("value", n.BinaryExpression("|", n.BinaryExpression("<<", n.Register(register1), n.Literal(8)), n.Register(register2)));
    }
    return [valueAST, n.VariableDeclaration("val", n.BinaryExpression("|", n.BinaryExpression("<<", n.Register("h"), n.Literal(8)), n.Register("l"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("+", n.BinaryExpression("+", n.Identifier("val"), n.Identifier("value")), n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("|", 
    n.BinaryExpression("|", n.BinaryExpression("&", n.BinaryExpression(">>", n.BinaryExpression("^", n.BinaryExpression("^", n.Identifier("val"), n.Identifier("temp")), n.Identifier("value")), n.Literal(8)), n.Literal(16)), n.BinaryExpression("&", n.BinaryExpression(">>", n.Identifier("temp"), n.Literal(16)), n.Literal(1))), n.BinaryExpression("&", n.BinaryExpression(">>", n.Identifier("temp"), n.Literal(8)), n.Literal(128))), n.ConditionalExpression(n.BinaryExpression("!==", n.BinaryExpression("&", 
    n.Identifier("temp"), n.Literal(65535)), n.Literal(0)), n.Literal(0), n.Literal(64))), n.BinaryExpression(">>", n.BinaryExpression("&", n.BinaryExpression("&", n.BinaryExpression("^", n.BinaryExpression("^", n.Identifier("value"), n.Identifier("val")), n.Literal(32768)), n.BinaryExpression("^", n.Identifier("value"), n.Identifier("temp"))), n.Literal(32768)), n.Literal(13))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("h"), n.BinaryExpression("&", n.BinaryExpression(">>", 
    n.Identifier("temp"), n.Literal(8)), n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("l"), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(255))))];
  };
}, SBC16:function(register1, register2) {
  return function(value, target, nextAddress) {
    var valueAST;
    if (register2 === undefined) {
      valueAST = n.VariableDeclaration("value", n.Identifier(register1));
    } else {
      valueAST = n.VariableDeclaration("value", n.BinaryExpression("|", n.BinaryExpression("<<", n.Register(register1), n.Literal(8)), n.Register(register2)));
    }
    return [valueAST, n.VariableDeclaration("val", n.BinaryExpression("|", n.BinaryExpression("<<", n.Register("h"), n.Literal(8)), n.Register("l"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("-", n.BinaryExpression("-", n.Identifier("val"), n.Identifier("value")), n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("|", 
    n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.BinaryExpression(">>", n.BinaryExpression("^", n.BinaryExpression("^", n.Identifier("val"), n.Identifier("temp")), n.Identifier("value")), n.Literal(8)), n.Literal(16)), n.Literal(2)), n.BinaryExpression("&", n.BinaryExpression(">>", n.Identifier("temp"), n.Literal(16)), n.Literal(1))), n.BinaryExpression("&", n.BinaryExpression(">>", n.Identifier("temp"), n.Literal(8)), n.Literal(128))), n.ConditionalExpression(n.BinaryExpression("!==", 
    n.BinaryExpression("&", n.Identifier("temp"), n.Literal(65535)), n.Literal(0)), n.Literal(0), n.Literal(64))), n.BinaryExpression(">>", n.BinaryExpression("&", n.BinaryExpression("&", n.BinaryExpression("^", n.Identifier("value"), n.Identifier("val")), n.BinaryExpression("^", n.Identifier("val"), n.Identifier("temp"))), n.Literal(32768)), n.Literal(13))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("h"), n.BinaryExpression("&", n.BinaryExpression(">>", n.Identifier("temp"), 
    n.Literal(8)), n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("l"), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(255))))];
  };
}, NEG:function() {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("a"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("a"), n.Literal(0))), n.ExpressionStatement(n.CallExpression("sub_a", n.Identifier("temp")))];
  };
}, RETN_RETI:function() {
  return function() {
    return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff1"), n.Identifier("iff2")))];
  };
}, IM:function(value) {
  return function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("im"), n.Literal(value)));
  };
}, INI:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.CallExpression("port.in_", n.Register("c")))), n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + ("h" + "l").toUpperCase()), n.Identifier("temp")])), o.DEC8("b")()], o.INC16("h", "l")(), [n.IfStatement(n.BinaryExpression("===", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(128)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), 
    n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]);
  };
}, OUTI:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), o.DEC8("b")()], o.INC16("h", "l")(), [n.IfStatement(n.BinaryExpression(">", n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), 
    n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("===", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(128)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]);
  };
}, OUTD:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), o.DEC8("b")()], o.DEC16("h", "l")(), [n.IfStatement(n.BinaryExpression(">", n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), 
    n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("===", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(128)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]);
  };
}, LDI:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + ("d" + "e").toUpperCase()), n.Identifier("temp")]))], o.DEC16("b", "c")(), o.INC16("d", "e")(), o.INC16("h", "l")(), [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("&", n.BinaryExpression("+", n.Identifier("temp"), n.Register("a")), 
    n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(193)), n.ConditionalExpression(n.CallExpression("get" + ("b" + "c").toUpperCase()), n.Literal(F_PARITY), n.Literal(0))), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_BIT3))), n.ConditionalExpression(n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_NEGATIVE)), n.Literal(32), 
    n.Literal(0)))))]);
  };
}, RRD:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.CallExpression("get" + ("h" + "l").toUpperCase()))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.Identifier("location")))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("location"), n.BinaryExpression("|", n.BinaryExpression(">>", n.Identifier("temp"), n.Literal(4)), n.BinaryExpression("<<", n.BinaryExpression("&", n.Register("a"), n.Literal(15)), 
    n.Literal(4)))])), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("a"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("a"), n.Literal(240)), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(15))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Identifier("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")))))]);
  };
}, RLD:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.CallExpression("get" + ("h" + "l").toUpperCase()))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.Identifier("location")))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("location"), n.BinaryExpression("|", n.BinaryExpression("<<", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(15)), n.Literal(4)), n.BinaryExpression("&", n.Register("a"), 
    n.Literal(15)))])), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("a"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("a"), n.Literal(240)), n.BinaryExpression(">>", n.Identifier("temp"), n.Literal(4))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Identifier("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")))))]);
  };
}, CPI:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(F_NEGATIVE)))), n.ExpressionStatement(n.CallExpression("cp_a", [o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase()))]))], o.DEC16("b", "c")(), o.INC16("h", "l")(), [n.ExpressionStatement(n.AssignmentExpression("|=", n.Identifier("temp"), n.ConditionalExpression(n.BinaryExpression("===", n.CallExpression("get" + 
    ("b" + "c").toUpperCase()), n.Literal(0)), n.Literal(0), n.Literal(F_PARITY)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(248)), n.Identifier("temp"))))]);
  };
}, LDD:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + ("d" + "e").toUpperCase()), n.Identifier("temp")]))], o.DEC16("b", "c")(), o.DEC16("d", "e")(), o.DEC16("h", "l")(), [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("&", n.BinaryExpression("+", n.Identifier("temp"), n.Register("a")), 
    n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(193)), n.ConditionalExpression(n.CallExpression("get" + ("b" + "c").toUpperCase()), n.Literal(F_PARITY), n.Literal(0))), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_BIT3))), n.ConditionalExpression(n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_NEGATIVE)), n.Literal(32), 
    n.Literal(0)))))]);
  };
}, LDIR:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + ("d" + "e").toUpperCase()), n.Identifier("temp")]))], o.DEC16("b", "c")(), o.INC16("d", "e")(), o.INC16("h", "l")(), [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("&", n.BinaryExpression("+", n.Identifier("temp"), n.Register("a")), 
    n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(193)), n.ConditionalExpression(n.CallExpression("get" + ("b" + "c").toUpperCase()), n.Literal(F_PARITY), n.Literal(0))), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_BIT3))), n.ConditionalExpression(n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_NEGATIVE)), n.Literal(32), 
    n.Literal(0))))), n.IfStatement(n.BinaryExpression("!==", n.CallExpression("get" + ("b" + "c").toUpperCase()), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ReturnStatement()]))]);
  };
}, CPIR:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(F_NEGATIVE)))), n.ExpressionStatement(n.CallExpression("cp_a", [o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase()))]))], o.DEC16("b", "c")(), o.INC16("h", "l")(), [n.ExpressionStatement(n.AssignmentExpression("|=", n.Identifier("temp"), n.ConditionalExpression(n.BinaryExpression("===", n.CallExpression("get" + 
    ("b" + "c").toUpperCase()), n.Literal(0)), n.Literal(0), n.Literal(F_PARITY)))), n.IfStatement(n.LogicalExpression("&&", n.BinaryExpression("!==", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_PARITY)), n.Literal(0)), n.BinaryExpression("===", n.BinaryExpression("&", n.Register("f"), n.Literal(F_ZERO)), n.Literal(0))), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), 
    n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(248)), n.Identifier("temp")))), n.ReturnStatement()])), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(248)), n.Identifier("temp"))))]);
  };
}, OTIR:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), o.DEC8("b")()], o.INC16("h", "l")(), [n.IfStatement(n.BinaryExpression(">", n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), 
    n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("!==", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(0)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE)))))), n.IfStatement(n.BinaryExpression("!==", n.Register("b"), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ReturnStatement()]))]);
  };
}, LDDR:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("setUint8", [n.CallExpression("get" + ("d" + "e").toUpperCase()), n.Identifier("temp")]))], o.DEC16("b", "c")(), o.DEC16("d", "e")(), o.DEC16("h", "l")(), [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("&", n.BinaryExpression("+", n.Identifier("temp"), n.Register("a")), 
    n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(193)), n.ConditionalExpression(n.CallExpression("get" + ("b" + "c").toUpperCase()), n.Literal(F_PARITY), n.Literal(0))), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_BIT3))), n.ConditionalExpression(n.BinaryExpression("&", n.Identifier("temp"), n.Literal(F_NEGATIVE)), n.Literal(32), 
    n.Literal(0))))), n.IfStatement(n.BinaryExpression("!==", n.CallExpression("get" + ("b" + "c").toUpperCase()), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ReturnStatement()]))]);
  };
}, OTDR:function() {
  return function(value, target, nextAddress) {
    return [].concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("get" + ("h" + "l").toUpperCase())))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), o.DEC8("b")()], o.DEC16("h", "l")(), [n.IfStatement(n.BinaryExpression(">", n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), 
    n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("!==", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(0)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE)))))), n.IfStatement(n.BinaryExpression("!==", n.Register("b"), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ReturnStatement()]))]);
  };
}, "LD_RLC":generateIndexCBFunctions("rlc"), "LD_RRC":generateIndexCBFunctions("rrc"), "LD_RL":generateIndexCBFunctions("rl"), "LD_RR":generateIndexCBFunctions("rr"), "LD_SLA":generateIndexCBFunctions("sla"), "LD_SRA":generateIndexCBFunctions("sra"), "LD_SLL":generateIndexCBFunctions("sll"), "LD_SRL":generateIndexCBFunctions("srl"), READ_MEM8:function(value) {
  return n.CallExpression("getUint8", value);
}, READ_MEM16:function(value) {
  return n.CallExpression("getUint16", value);
}};
function generateCBFunctions(fn) {
  return function(register1, register2) {
    if (register2 === undefined) {
      return function() {
        return n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register1), n.CallExpression(fn, n.Register(register1))));
      };
    } else {
      return function() {
        return n.ExpressionStatement(n.CallExpression("setUint8", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.CallExpression(fn, o.READ_MEM8(n.CallExpression("get" + (register1 + register2).toUpperCase())))));
      };
    }
  };
}
function generateIndexCBFunctions(fn) {
  return function(register1, register2, register3) {
    if (register3 === undefined) {
      return function(value, target, nextAddress) {
        return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("location"), n.CallExpression(fn, o.READ_MEM8(n.Identifier("location")))]))];
      };
    } else {
      return function(value, target, nextAddress) {
        return [n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + (register1 + register2).toUpperCase()), n.Literal(value)), n.Literal(65535)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register(register3), n.CallExpression(fn, o.READ_MEM8(n.Identifier("location"))))), n.ExpressionStatement(n.CallExpression("setUint8", [n.Identifier("location"), n.Register(register3)]))];
      };
    }
  };
}
;var opcodeTableCB = [];
var opcodeTableDDCB = [];
var opcodeTableFDCB = [];
var regs = {"B":["b"], "C":["c"], "D":["d"], "E":["e"], "H":["h"], "L":["l"], "(HL)":["h", "l"], "A":["a"]};
var opcodesList = {RLC:"RLC", RRC:"RRC", RL:"RL", RR:"RR", SLA:"SLA", SRA:"SRA", SLL:"SLL", SRL:"SRL"};
var op = "";
var reg = "";
for (op in opcodesList) {
  for (reg in regs) {
    opcodeTableCB.push({name:opcodesList[op] + " " + reg, ast:o[op].apply(null, regs[reg])});
    if (reg !== "(HL)") {
      opcodeTableDDCB.push({name:"LD " + reg + "," + opcodesList[op] + " (IX)", ast:o["LD_" + opcodesList[op]].apply(null, ["ixH", "ixL"].concat(regs[reg]))});
      opcodeTableFDCB.push({name:"LD " + reg + "," + opcodesList[op] + " (IY)", ast:o["LD_" + opcodesList[op]].apply(null, ["iyH", "iyL"].concat(regs[reg]))});
    } else {
      opcodeTableDDCB.push({name:opcodesList[op] + " (IX)", ast:o["LD_" + opcodesList[op]]("ixH", "ixL")});
      opcodeTableFDCB.push({name:opcodesList[op] + " (IY)", ast:o["LD_" + opcodesList[op]]("iyH", "iyL")});
    }
  }
}
opcodesList = {BIT:"BIT", RES:"RES", SET:"SET"};
var i = 0;
var j = 0;
for (op in opcodesList) {
  for (i = 0;i < 8;i++) {
    for (reg in regs) {
      opcodeTableCB.push({name:opcodesList[op] + " " + i + "," + reg, ast:o[op].apply(null, [i].concat(regs[reg]))});
    }
    for (j = 0;j < 8;j++) {
      opcodeTableDDCB.push({name:opcodesList[op] + " " + i + " (IX)", ast:o[op].apply(null, [i].concat(["ixH", "ixL"]))});
      opcodeTableFDCB.push({name:opcodesList[op] + " " + i + " (IY)", ast:o[op].apply(null, [i].concat(["iyH", "iyL"]))});
    }
  }
}
;function generateIndexTable(index) {
  var register = index.substring(1, 2).toLowerCase();
  var registerH = "i" + register + "H";
  var registerL = "i" + register + "L";
  return {9:{name:"ADD " + index + ",BC", ast:o.ADD16(registerH, registerL, "b", "c")}, 25:{name:"ADD " + index + ",DE", ast:o.ADD16(registerH, registerL, "d", "e")}, 33:{name:"LD " + index + ",nn", ast:o.LD16(registerH, registerL)}, 34:{name:"LD (nn)," + index, ast:o.LD_NN(registerH, registerL)}, 35:{name:"INC " + index, ast:o.INC16(registerH, registerL)}, 42:{name:"LD " + index + ",(nn)", ast:o.LD16(registerH, registerL, "n", "n")}, 43:{name:"DEC " + index, ast:o.DEC16(registerH, registerL)}, 52:{name:"INC (" + 
  index + "+d)", ast:o.INC_X(registerH, registerL)}, 53:{name:"DEC (" + index + "+d)", ast:o.DEC_X(registerH, registerL)}, 54:{name:"LD (" + index + "+d),n", ast:o.LD_X(registerH, registerL)}, 57:{name:"ADD " + index + ",SP", ast:o.ADD16(registerH, registerL, "sp")}, 70:{name:"LD B,(" + index + "+d)", ast:o.LD8_D("b", registerH, registerL)}, 78:{name:"LD C,(" + index + "+d)", ast:o.LD8_D("c", registerH, registerL)}, 84:{name:" LD D," + index + "H *", ast:o.LD8("d", registerH)}, 86:{name:"LD D,(" + 
  index + "+d)", ast:o.LD8_D("d", registerH, registerL)}, 93:{name:"LD E," + index + "L *", ast:o.LD8("e", registerL)}, 94:{name:"LD E,(" + index + "+d)", ast:o.LD8_D("e", registerH, registerL)}, 96:{name:"LD " + index + "H,B", ast:o.LD8(registerH, "b")}, 97:{name:"LD " + index + "H,C", ast:o.LD8(registerH, "c")}, 98:{name:"LD " + index + "H,D", ast:o.LD8(registerH, "d")}, 99:{name:"LD " + index + "H,E", ast:o.LD8(registerH, "e")}, 100:{name:"LD " + index + "H," + index + "H", ast:o.NOOP()}, 101:{name:"LD " + 
  index + "H," + index + "L *", ast:o.LD8_D(registerH, registerL)}, 102:{name:"LD H,(" + index + "+d)", ast:o.LD8_D("h", registerH, registerL)}, 103:{name:"LD " + index + "H,A", ast:o.LD8(registerH, "a")}, 104:{name:"LD " + index + "L,B", ast:o.LD8(registerL, "b")}, 105:{name:"LD " + index + "L,C", ast:o.LD8(registerL, "c")}, 106:{name:"LD " + index + "L,D", ast:o.LD8(registerL, "d")}, 107:{name:"LD " + index + "L,E", ast:o.LD8(registerL, "e")}, 108:{name:"LD " + index + "L," + index + "H", ast:o.LD8_D(registerL, 
  registerH)}, 109:{name:"LD " + index + "L," + index + "L *", ast:o.NOOP()}, 110:{name:"LD L,(" + index + "+d)", ast:o.LD8_D("l", registerH, registerL)}, 111:{name:"LD " + index + "L,A *", ast:o.LD8(registerL, "a")}, 112:{name:"LD (" + index + "+d),B", ast:o.LD_X("b", registerH, registerL)}, 113:{name:"LD (" + index + "+d),C", ast:o.LD_X("c", registerH, registerL)}, 114:{name:"LD (" + index + "+d),D", ast:o.LD_X("d", registerH, registerL)}, 115:{name:"LD (" + index + "+d),E", ast:o.LD_X("e", registerH, 
  registerL)}, 116:{name:"LD (" + index + "+d),H", ast:o.LD_X("h", registerH, registerL)}, 117:{name:"LD (" + index + "+d),L", ast:o.LD_X("l", registerH, registerL)}, 118:{name:"LD (" + index + "+d),B", ast:o.LD_X("b", registerH, registerL)}, 119:{name:"LD (" + index + "+d),A", ast:o.LD_X("a", registerH, registerL)}, 126:{name:"LD A,(" + index + "+d)", ast:o.LD8_D("a", registerH, registerL)}, 124:{name:"LD A," + index + "H", ast:o.LD8("a", registerH)}, 125:{name:"LD A," + index + "L", ast:o.LD8("a", 
  registerL)}, 132:{name:"ADD A," + index + "H", ast:o.ADD(registerL)}, 133:{name:"ADD A," + index + "L", ast:o.ADD(registerL)}, 134:{name:"ADD A,(" + index + "+d)", ast:o.ADD_X(registerH, registerL)}, 140:{name:"ADC A," + index + "H", ast:o.ADC(registerL)}, 141:{name:"ADC A," + index + "L", ast:o.ADC(registerL)}, 142:{name:"ADC A,(" + index + "+d)", ast:o.ADC_X(registerH, registerL)}, 148:{name:"SUB A," + index + "H", ast:o.SUB(registerL)}, 149:{name:"SUB A," + index + "L", ast:o.SUB(registerL)}, 
  150:{name:"SUB A,(" + index + "+d)", ast:o.SUB_X(registerH, registerL)}, 156:{name:"SBC A," + index + "H", ast:o.SBC(registerL)}, 157:{name:"SBC A," + index + "L", ast:o.SBC(registerL)}, 158:{name:"SBC A,(" + index + "+d)", ast:o.SBC_X(registerH, registerL)}, 166:{name:"AND A,(" + index + "+d)", ast:o.AND_X(registerH, registerL)}, 174:{name:"XOR A,(" + index + "+d)", ast:o.XOR_X(registerH, registerL)}, 182:{name:"OR A,(" + index + "+d)", ast:o.OR_X(registerH, registerL)}, 190:{name:"CP (" + index + 
  "+d)", ast:o.CP_X(registerH, registerL)}, 203:index === "IX" ? opcodeTableDDCB : opcodeTableFDCB, 225:{name:"POP " + index, ast:o.POP(registerH, registerL)}, 227:{name:"EX SP,(" + index + ")", ast:o.EX_SP_X(registerH, registerL)}, 229:{name:"PUSH " + index, ast:o.PUSH(registerH, registerL)}, 233:{name:"JP (" + index + ")", ast:o.JP_X(registerH, registerL)}, 249:{name:"LD SP," + index, ast:o.LD_SP(registerH, registerL)}};
}
;var opcodeTableED = {64:{name:"IN B,(C)", ast:o.IN("b", "c")}, 66:{name:"SBC HL,BC", ast:o.SBC16("b", "c")}, 65:{name:"OUT (C),B", ast:o.OUT("c", "b")}, 67:{name:"LD (nn),BC", ast:o.LD_NN("b", "c")}, 68:{name:"NEG", ast:o.NEG()}, 69:{name:"RETN / RETI", ast:o.RETN_RETI()}, 70:{name:"IM 0", ast:o.IM(0)}, 72:{name:"IN C,(C)", ast:o.IN("c", "c")}, 73:{name:"OUT (C),C", ast:o.OUT("c", "c")}, 74:{name:"ADC HL,BC", ast:o.ADC16("b", "c")}, 75:{name:"LD BC,(nn)", ast:o.LD16("b", "c", "n", "n")}, 76:{name:"NEG", 
ast:o.NEG()}, 77:{name:"RETN / RETI", ast:o.RETN_RETI()}, 78:{name:"IM 0", ast:o.IM(0)}, 79:{name:"LD R,A", ast:o.LD8("r", "a")}, 80:{name:"IN D,(C)", ast:o.IN("d", "c")}, 81:{name:"OUT (C),D", ast:o.OUT("c", "d")}, 82:{name:"SBC HL,DE", ast:o.SBC16("d", "e")}, 83:{name:"LD (nn),DE", ast:o.LD_NN("d", "e")}, 84:{name:"NEG", ast:o.NEG()}, 85:{name:"RETN / RETI", ast:o.RETN_RETI()}, 86:{name:"IM 1", ast:o.IM(1)}, 87:{name:"LD A,I", ast:o.LD8("a", "i")}, 88:{name:"IN E,(C)", ast:o.IN("e", "c")}, 89:{name:"OUT (C),E", 
ast:o.OUT("c", "e")}, 90:{name:"ADC HL,DE", ast:o.ADC16("d", "e")}, 91:{name:"LD DE,(nn)", ast:o.LD16("d", "e", "n", "n")}, 92:{name:"NEG", ast:o.NEG()}, 95:{name:"LD A,R", ast:o.LD8("a", "r")}, 96:{name:"IN H,(C)", ast:o.IN("h", "c")}, 97:{name:"OUT (C),H", ast:o.OUT("c", "h")}, 98:{name:"SBC HL,HL", ast:o.SBC16("h", "l")}, 99:{name:"LD (nn),HL", ast:o.LD_NN("h", "l")}, 100:{name:"NEG", ast:o.NEG()}, 102:{name:"IM 0", ast:o.IM(0)}, 103:{name:"RRD", ast:o.RRD()}, 104:{name:"IN L,(C)", ast:o.IN("l", 
"c")}, 105:{name:"OUT (C),L", ast:o.OUT("c", "l")}, 106:{name:"ADC HL,HL", ast:o.ADC16("h", "l")}, 107:{name:"LD HL,(nn)", ast:o.LD16("h", "l", "n", "n")}, 108:{name:"NEG", ast:o.NEG()}, 110:{name:"IM 0", ast:o.IM(0)}, 111:{name:"RLD", ast:o.RLD()}, 115:{name:"LD (nn),SP", ast:o.LD_NN("sp")}, 116:{name:"NEG", ast:o.NEG()}, 118:{name:"IM 1", ast:o.IM(1)}, 120:{name:"IN A,(C)", ast:o.IN("a", "c")}, 121:{name:"OUT (C),A", ast:o.OUT("c", "a")}, 122:{name:"ADC HL,SP", ast:o.ADC16("sp")}, 123:{name:"LD SP,(nn)", 
ast:o.LD_SP("n", "n")}, 124:{name:"NEG", ast:o.NEG()}, 160:{name:"LDI", ast:o.LDI()}, 161:{name:"CPI", ast:o.CPI()}, 162:{name:"INI", ast:o.INI()}, 163:{name:"OUTI", ast:o.OUTI()}, 168:{name:"LDD", ast:o.LDD()}, 171:{name:"OUTD", ast:o.OUTD()}, 176:{name:"LDIR", ast:o.LDIR()}, 177:{name:"CPIR", ast:o.CPIR()}, 179:{name:"OTIR", ast:o.OTIR()}, 184:{name:"LDDR", ast:o.LDDR()}, 187:{name:"OTDR", ast:o.OTDR()}};
var opcodeTable = [{name:"NOP", ast:o.NOOP()}, {name:"LD BC,nn", ast:o.LD16("b", "c")}, {name:"LD (BC),A", ast:o.LD_WRITE_MEM("b", "c", "a")}, {name:"INC BC", ast:o.INC16("b", "c")}, {name:"INC B", ast:o.INC8("b")}, {name:"DEC B", ast:o.DEC8("b")}, {name:"LD B,n", ast:o.LD8("b")}, {name:"RLCA", ast:o.RLCA()}, {name:"EX AF AF'", ast:o.EX_AF()}, {name:"ADD HL,BC", ast:o.ADD16("h", "l", "b", "c")}, {name:"LD A,(BC)", ast:o.LD8("a", "b", "c")}, {name:"DEC BC", ast:o.DEC16("b", "c")}, {name:"INC C", ast:o.INC8("c")}, 
{name:"DEC C", ast:o.DEC8("c")}, {name:"LD C,n", ast:o.LD8("c")}, {name:"RRCA", ast:o.RRCA()}, {name:"DJNZ (PC+e)", ast:o.DJNZ()}, {name:"LD DE,nn", ast:o.LD16("d", "e")}, {name:"LD (DE),A", ast:o.LD_WRITE_MEM("d", "e", "a")}, {name:"INC DE", ast:o.INC16("d", "e")}, {name:"INC D", ast:o.INC8("d")}, {name:"DEC D", ast:o.DEC8("d")}, {name:"LD D,n", ast:o.LD8("d")}, {name:"RLA", ast:o.RLA()}, {name:"JR (PC+e)", ast:o.JR()}, {name:"ADD HL,DE", ast:o.ADD16("h", "l", "d", "e")}, {name:"LD A,(DE)", ast:o.LD8("a", 
"d", "e")}, {name:"DEC DE", ast:o.DEC16("d", "e")}, {name:"INC E", ast:o.INC8("e")}, {name:"DEC E", ast:o.DEC8("e")}, {name:"LD E,n", ast:o.LD8("e")}, {name:"RRA", ast:o.RRA()}, {name:"JR NZ,(PC+e)", ast:o.JRNZ()}, {name:"LD HL,nn", ast:o.LD16("h", "l")}, {name:"LD (nn),HL", ast:o.LD_NN("h", "l")}, {name:"INC HL", ast:o.INC16("h", "l")}, {name:"INC H", ast:o.INC8("h")}, {name:"DEC H", ast:o.DEC8("h")}, {name:"LD H,n", ast:o.LD8("h")}, {name:"DAA", ast:o.DAA()}, {name:"JR Z,(PC+e)", ast:o.JRZ()}, 
{name:"ADD HL,HL", ast:o.ADD16("h", "l", "h", "l")}, {name:"LD HL,(nn)", ast:o.LD16("h", "l", "n", "n")}, {name:"DEC HL", ast:o.DEC16("h", "l")}, {name:"INC L", ast:o.INC8("l")}, {name:"DEC L", ast:o.DEC8("l")}, {name:"LD L,n", ast:o.LD8("l")}, {name:"CPL", ast:o.CPL()}, {name:"JR NC,(PC+e)", ast:o.JRNC()}, {name:"LD SP,nn", ast:o.LD_SP()}, {name:"LD (nn),A", ast:o.LD_WRITE_MEM("n", "n", "a")}, {name:"INC SP", ast:o.INC8("s", "p")}, {name:"INC (HL)", ast:o.INC8("h", "l")}, {name:"DEC (HL)", ast:o.DEC8("h", 
"l")}, {name:"LD (HL),n", ast:o.LD_WRITE_MEM("h", "l")}, {name:"SCF", ast:o.SCF()}, {name:"JR C,(PC+e)", ast:o.JRC()}, {name:"ADD HL,SP", ast:o.ADD16("h", "l", "sp")}, {name:"LD A,(nn)", ast:o.LD8("a", "n", "n")}, {name:"DEC SP", ast:o.DEC8("s", "p")}, {name:"INC A", ast:o.INC8("a")}, {name:"DEC A", ast:o.DEC8("a")}, {name:"LD A,n", ast:o.LD8("a")}, {name:"CCF", ast:o.CCF()}, {name:"LD B,B", ast:o.NOOP()}, {name:"LD B,C", ast:o.LD8("b", "c")}, {name:"LD B,D", ast:o.LD8("b", "d")}, {name:"LD B,E", 
ast:o.LD8("b", "e")}, {name:"LD B,H", ast:o.LD8("b", "h")}, {name:"LD B,L", ast:o.LD8("b", "l")}, {name:"LD B,(HL)", ast:o.LD8("b", "h", "l")}, {name:"LD B,A", ast:o.LD8("b", "a")}, {name:"LD C,B", ast:o.LD8("c", "b")}, {name:"LD C,C", ast:o.NOOP()}, {name:"LD C,D", ast:o.LD8("c", "d")}, {name:"LD C,E", ast:o.LD8("c", "e")}, {name:"LD C,H", ast:o.LD8("c", "h")}, {name:"LD C,L", ast:o.LD8("c", "l")}, {name:"LD C,(HL)", ast:o.LD8("c", "h", "l")}, {name:"LD C,A", ast:o.LD8("c", "a")}, {name:"LD D,B", 
ast:o.LD8("d", "b")}, {name:"LD D,C", ast:o.LD8("d", "c")}, {name:"LD D,D", ast:o.NOOP()}, {name:"LD D,E", ast:o.LD8("d", "e")}, {name:"LD D,H", ast:o.LD8("d", "h")}, {name:"LD D,L", ast:o.LD8("d", "l")}, {name:"LD D,(HL)", ast:o.LD8("d", "h", "l")}, {name:"LD D,A", ast:o.LD8("d", "a")}, {name:"LD E,B", ast:o.LD8("e", "b")}, {name:"LD E,C", ast:o.LD8("e", "c")}, {name:"LD E,D", ast:o.LD8("e", "d")}, {name:"LD E,E", ast:o.NOOP()}, {name:"LD E,H", ast:o.LD8("e", "h")}, {name:"LD E,L", ast:o.LD8("e", 
"l")}, {name:"LD E,(HL)", ast:o.LD8("e", "h", "l")}, {name:"LD E,A", ast:o.LD8("e", "a")}, {name:"LD H,B", ast:o.LD8("h", "b")}, {name:"LD H,C", ast:o.LD8("h", "c")}, {name:"LD H,D", ast:o.LD8("h", "d")}, {name:"LD H,E", ast:o.LD8("h", "e")}, {name:"LD H,H", ast:o.NOOP()}, {name:"LD H,L", ast:o.LD8("h", "l")}, {name:"LD H,(HL)", ast:o.LD8("h", "h", "l")}, {name:"LD H,A", ast:o.LD8("h", "a")}, {name:"LD L,B", ast:o.LD8("l", "b")}, {name:"LD L,C", ast:o.LD8("l", "c")}, {name:"LD L,D", ast:o.LD8("l", 
"d")}, {name:"LD L,E", ast:o.LD8("l", "e")}, {name:"LD L,H", ast:o.LD8("l", "h")}, {name:"LD L,L", ast:o.NOOP()}, {name:"LD L,(HL)", ast:o.LD8("l", "h", "l")}, {name:"LD L,A", ast:o.LD8("l", "a")}, {name:"LD (HL),B", ast:o.LD_WRITE_MEM("h", "l", "b")}, {name:"LD (HL),C", ast:o.LD_WRITE_MEM("h", "l", "c")}, {name:"LD (HL),D", ast:o.LD_WRITE_MEM("h", "l", "d")}, {name:"LD (HL),E", ast:o.LD_WRITE_MEM("h", "l", "e")}, {name:"LD (HL),H", ast:o.LD_WRITE_MEM("h", "l", "h")}, {name:"LD (HL),L", ast:o.LD_WRITE_MEM("h", 
"l", "l")}, {name:"HALT", ast:o.HALT()}, {name:"LD (HL),A", ast:o.LD_WRITE_MEM("h", "l", "a")}, {name:"LD A,B", ast:o.LD8("a", "b")}, {name:"LD A,C", ast:o.LD8("a", "c")}, {name:"LD A,D", ast:o.LD8("a", "d")}, {name:"LD A,E", ast:o.LD8("a", "e")}, {name:"LD A,H", ast:o.LD8("a", "h")}, {name:"LD A,L", ast:o.LD8("a", "l")}, {name:"LD A,(HL)", ast:o.LD8("a", "h", "l")}, {name:"LD A,A", ast:o.NOOP()}, {name:"ADD A,B", ast:o.ADD("b")}, {name:"ADD A,C", ast:o.ADD("c")}, {name:"ADD A,D", ast:o.ADD("d")}, 
{name:"ADD A,E", ast:o.ADD("e")}, {name:"ADD A,H", ast:o.ADD("h")}, {name:"ADD A,L", ast:o.ADD("l")}, {name:"ADD A,(HL)", ast:o.ADD("h", "l")}, {name:"ADD A,A", ast:o.ADD("a")}, {name:"ADC A,B", ast:o.ADC("b")}, {name:"ADC A,C", ast:o.ADC("c")}, {name:"ADC A,D", ast:o.ADC("d")}, {name:"ADC A,E", ast:o.ADC("e")}, {name:"ADC A,H", ast:o.ADC("h")}, {name:"ADC A,L", ast:o.ADC("l")}, {name:"ADC A,(HL)", ast:o.ADC("h", "l")}, {name:"ADC A,A", ast:o.ADC("a")}, {name:"SUB A,B", ast:o.SUB("b")}, {name:"SUB A,C", 
ast:o.SUB("c")}, {name:"SUB A,D", ast:o.SUB("d")}, {name:"SUB A,E", ast:o.SUB("e")}, {name:"SUB A,H", ast:o.SUB("h")}, {name:"SUB A,L", ast:o.SUB("l")}, {name:"SUB A,(HL)", ast:o.SUB("h", "l")}, {name:"SUB A,A", ast:o.SUB("a")}, {name:"SBC A,B", ast:o.SBC("b")}, {name:"SBC A,C", ast:o.SBC("c")}, {name:"SBC A,D", ast:o.SBC("d")}, {name:"SBC A,E", ast:o.SBC("e")}, {name:"SBC A,H", ast:o.SBC("h")}, {name:"SBC A,L", ast:o.SBC("l")}, {name:"SBC A,(HL)", ast:o.SBC("h", "l")}, {name:"SBC A,A", ast:o.SBC("a")}, 
{name:"AND A,B", ast:o.AND("b")}, {name:"AND A,C", ast:o.AND("c")}, {name:"AND A,D", ast:o.AND("d")}, {name:"AND A,E", ast:o.AND("e")}, {name:"AND A,H", ast:o.AND("h")}, {name:"AND A,L", ast:o.AND("l")}, {name:"AND A,(HL)", ast:o.AND("h", "l")}, {name:"AND A,A", ast:o.AND("a")}, {name:"XOR A,B", ast:o.XOR("b")}, {name:"XOR A,C", ast:o.XOR("c")}, {name:"XOR A,D", ast:o.XOR("d")}, {name:"XOR A,E", ast:o.XOR("e")}, {name:"XOR A,H", ast:o.XOR("h")}, {name:"XOR A,L", ast:o.XOR("l")}, {name:"XOR A,(HL)", 
ast:o.XOR("h", "l")}, {name:"XOR A,A", ast:o.XOR("a")}, {name:"OR A,B", ast:o.OR("b")}, {name:"OR A,C", ast:o.OR("c")}, {name:"OR A,D", ast:o.OR("d")}, {name:"OR A,E", ast:o.OR("e")}, {name:"OR A,H", ast:o.OR("h")}, {name:"OR A,L", ast:o.OR("l")}, {name:"OR A,(HL)", ast:o.OR("h", "l")}, {name:"OR A,A", ast:o.OR("a")}, {name:"CP A,B", ast:o.CP("b")}, {name:"CP A,C", ast:o.CP("c")}, {name:"CP A,D", ast:o.CP("d")}, {name:"CP A,E", ast:o.CP("e")}, {name:"CP A,H", ast:o.CP("h")}, {name:"CP A,L", ast:o.CP("l")}, 
{name:"CP A,(HL)", ast:o.CP("h", "l")}, {name:"CP A,A", ast:o.CP("a")}, {name:"RET NZ", ast:o.RET("===", F_ZERO)}, {name:"POP BC", ast:o.POP("b", "c")}, {name:"JP NZ,(nn)", ast:o.JP("===", F_ZERO)}, {name:"JP (nn)", ast:o.JP()}, {name:"CALL NZ (nn)", ast:o.CALL("===", F_ZERO)}, {name:"PUSH BC", ast:o.PUSH("b", "c")}, {name:"ADD A,n", ast:o.ADD()}, {name:"RST 0x00", ast:o.RST(0)}, {name:"RET Z", ast:o.RET("!==", F_ZERO)}, {name:"RET", ast:o.RET()}, {name:"JP Z,(nn)", ast:o.JP("!==", F_ZERO)}, opcodeTableCB, 
{name:"CALL Z (nn)", ast:o.CALL("!==", F_ZERO)}, {name:"CALL (nn)", ast:o.CALL()}, {name:"ADC A,n", ast:o.ADC()}, {name:"RST 0x08", ast:o.RST(8)}, {name:"RET NC", ast:o.RET("===", F_CARRY)}, {name:"POP DE", ast:o.POP("d", "e")}, {name:"JP NC,(nn)", ast:o.JP("===", F_CARRY)}, {name:"OUT (n),A", ast:o.OUT("a")}, {name:"CALL NC (nn)", ast:o.CALL("===", F_CARRY)}, {name:"PUSH DE", ast:o.PUSH("d", "e")}, {name:"SUB n", ast:o.SUB()}, {name:"RST 0x10", ast:o.RST(16)}, {name:"RET C", ast:o.RET("!==", F_CARRY)}, 
{name:"EXX", ast:o.EXX()}, {name:"JP C,(nn)", ast:o.JP("!==", F_CARRY)}, {name:"IN A,(n)", ast:o.IN("a")}, {name:"CALL C (nn)", ast:o.CALL("!==", F_CARRY)}, generateIndexTable("IX"), {name:"SBC A,n", ast:o.SBC()}, {name:"RST 0x18", ast:o.RST(24)}, {name:"RET PO", ast:o.RET("===", F_PARITY)}, {name:"POP HL", ast:o.POP("h", "l")}, {name:"JP PO,(nn)", ast:o.JP("===", F_PARITY)}, {name:"EX (SP),HL", ast:o.EX_SP_HL()}, {name:"CALL PO (nn)", ast:o.CALL("===", F_PARITY)}, {name:"PUSH HL", ast:o.PUSH("h", 
"l")}, {name:"AND (n)", ast:o.AND()}, {name:"RST 0x20", ast:o.RST(32)}, {name:"RET PE", ast:o.RET("!==", F_PARITY)}, {name:"JP (HL)", ast:o.JP("h", "l")}, {name:"JP PE,(nn)", ast:o.JP("!==", F_PARITY)}, {name:"EX DE,HL", ast:o.EX_DE_HL()}, {name:"CALL PE (nn)", ast:o.CALL("!==", F_PARITY)}, opcodeTableED, {name:"XOR n", ast:o.XOR()}, {name:"RST 0x28", ast:o.RST(40)}, {name:"RET P", ast:o.RET("===", F_SIGN)}, {name:"POP AF", ast:o.POP("a", "f")}, {name:"JP P,(nn)", ast:o.JP("===", F_SIGN)}, {name:"DI", 
ast:o.DI()}, {name:"CALL P (nn)", ast:o.CALL("===", F_SIGN)}, {name:"PUSH AF", ast:o.PUSH("a", "f")}, {name:"OR n", ast:o.OR()}, {name:"RST 0x30", ast:o.RST(48)}, {name:"RET M", ast:o.RET("!==", F_SIGN)}, {name:"LD SP,HL", ast:o.LD_SP("h", "l")}, {name:"JP M,(nn)", ast:o.JP("!==", F_SIGN)}, {name:"EI", ast:o.EI()}, {name:"CALL M (nn)", ast:o.CALL("!==", F_SIGN)}, generateIndexTable("IY"), {name:"CP n", ast:o.CP()}, {name:"RST 0x38", ast:o.RST(56)}];
var Analyzer = function() {
  var Analyzer = function() {
    this.bytecodes = {};
    this.ast = [];
    this.missingOpcodes = {};
  };
  Analyzer.prototype = {analyze:function(bytecodes) {
    var i = 0;
    this.bytecodes = bytecodes;
    this.ast = Array(this.bytecodes.length);
    JSSMS.Utils.console.time("Analyzing");
    for (i = 0;i < this.bytecodes.length;i++) {
      this.normalizeBytecode(i);
      this.restructure(i);
    }
    JSSMS.Utils.console.timeEnd("Analyzing");
    for (i in this.missingOpcodes) {
      console.error("Missing opcode", i, this.missingOpcodes[i]);
    }
  }, analyzeFromAddress:function(bytecodes) {
    this.bytecodes = [bytecodes];
    this.ast = [];
    this.missingOpcodes = {};
    this.normalizeBytecode(0);
    this.bytecodes[0][this.bytecodes[0].length - 1].isFunctionEnder = true;
    this.ast = [this.bytecodes];
    for (var i in this.missingOpcodes) {
      console.error("Missing opcode", i, this.missingOpcodes[i]);
    }
  }, normalizeBytecode:function(page) {
    var self = this;
    this.bytecodes[page] = this.bytecodes[page].map(function(bytecode) {
      var opcode;
      switch(bytecode.opcode.length) {
        case 1:
          opcode = opcodeTable[bytecode.opcode[0]];
          break;
        case 2:
          opcode = opcodeTable[bytecode.opcode[0]][bytecode.opcode[1]];
          break;
        case 3:
          opcode = opcodeTable[bytecode.opcode[0]][bytecode.opcode[1]][bytecode.opcode[2]];
          break;
        default:
          JSSMS.Utils.console.error("Something went wrong in parsing. Opcode: [" + bytecode.hexOpcode + "]");
      }
      if (opcode && opcode.ast) {
        var ast = opcode.ast(bytecode.operand, bytecode.target, bytecode.nextAddress);
        if (!Array.isArray(ast) && ast !== undefined) {
          ast = [ast];
        }
        if (bytecode.opcode.length > 1 && REFRESH_EMULATION) {
          ast = [].concat({"type":"ExpressionStatement", "expression":{"type":"CallExpression", "callee":n.Identifier("incR"), "arguments":[]}}, ast);
        }
        bytecode.ast = ast;
        if (DEBUG) {
          bytecode.name = opcode.name;
          if (opcode.opcode) {
            bytecode.opcode = opcode.opcode(bytecode.operand, bytecode.target, bytecode.nextAddress);
          }
        }
      } else {
        var i = bytecode.hexOpcode;
        self.missingOpcodes[i] = self.missingOpcodes[i] !== undefined ? self.missingOpcodes[i] + 1 : 1;
      }
      return bytecode;
    });
  }, restructure:function(page) {
    this.ast[page] = [];
    var self = this;
    var pointer = -1;
    var startNewFunction = true;
    var prevBytecode = {};
    this.bytecodes[page].forEach(function(bytecode) {
      if (bytecode.isJumpTarget || startNewFunction) {
        pointer++;
        self.ast[page][pointer] = [];
        startNewFunction = false;
        prevBytecode.isFunctionEnder = true;
      }
      self.ast[page][pointer].push(bytecode);
      if (bytecode.isFunctionEnder) {
        startNewFunction = true;
      }
      prevBytecode = bytecode;
    });
  }};
  return Analyzer;
}();
var Optimizer = function() {
  var Optimizer = function(main) {
    this.main = main;
    this.ast = [];
  };
  Optimizer.prototype = {optimize:function(functions) {
    this.ast = functions;
    for (var i = 0;i < this.ast.length;i++) {
      this.localOptimization(i);
    }
  }, localOptimization:function(page) {
    this.ast[page] = this.ast[page].map(this.portPeephole.bind(this));
    this.ast[page] = this.ast[page].map(this.evaluateBinaryExpressions);
    this.ast[page] = this.ast[page].map(this.inlineRegisters);
    this.ast[page] = this.ast[page].map(this.evaluateMemberExpressions.bind(this));
    this.ast[page] = this.ast[page].map(this.trimAfterReturn.bind(this));
  }, evaluateBinaryExpressions:function(fn) {
    return fn.map(function(_ast) {
      _ast = JSSMS.Utils.traverse(_ast, function(ast) {
        if (ast["type"] === "BinaryExpression" && ast["left"]["type"] === "Literal" && ast["right"]["type"] === "Literal") {
          var value = 0;
          switch(ast["operator"]) {
            case ">>":
              value = ast["left"]["value"] >> ast["right"]["value"];
              break;
            case "&":
              value = ast["left"]["value"] & ast["right"]["value"];
              break;
            default:
              JSSMS.Utils.console.log("Unimplemented evaluation optimization for operator", ast["operator"]);
              return ast;
          }
          ast["type"] = "Literal";
          ast["value"] = value;
          ast["raw"] = DEBUG ? JSSMS.Utils.toHex(value) : "" + value;
          delete ast["right"];
          delete ast["left"];
        }
        return ast;
      });
      return _ast;
    });
  }, evaluateMemberExpressions:function(fn) {
    var self = this;
    return fn.map(function(_ast) {
      _ast = JSSMS.Utils.traverse(_ast, function(ast) {
        if (ast["type"] === "MemberExpression" && ast["object"]["name"] === "SZP_TABLE" && ast["property"]["type"] === "Literal") {
          var value = self.main.cpu.SZP_TABLE[ast["property"]["value"]];
          ast["type"] = "Literal";
          ast["value"] = value;
          ast["raw"] = DEBUG ? JSSMS.Utils.toHex(value) : "" + value;
          delete ast["computed"];
          delete ast["object"];
          delete ast["property"];
        }
        return ast;
      });
      return _ast;
    });
  }, inlineRegisters:function(fn) {
    var definedReg = {b:false, c:false, d:false, e:false, h:false, l:false};
    var definedRegValue = {b:{}, c:{}, d:{}, e:{}, h:{}, l:{}};
    return fn.map(function(_ast) {
      _ast = JSSMS.Utils.traverse(_ast, function(ast) {
        if (ast["type"] === "AssignmentExpression" && ast["operator"] === "=" && ast["left"]["type"] === "Register" && ast["right"]["type"] === "Literal" && ast["left"]["name"] !== "a" && ast["left"]["name"] !== "f") {
          definedReg[ast["left"]["name"]] = true;
          definedRegValue[ast["left"]["name"]] = ast["right"];
        }
        if (ast["type"] === "AssignmentExpression" && ast["left"]["type"] === "Register" && ast["right"]["type"] !== "Literal" && ast["left"]["name"] !== "a" && ast["left"]["name"] !== "f") {
          definedReg[ast["left"]["name"]] = false;
          definedRegValue[ast["left"]["name"]] = {};
          return ast;
        }
        if (ast["type"] === "CallExpression") {
          if (ast["arguments"][0] && ast["arguments"][0]["type"] === "Register" && definedReg[ast["arguments"][0]["name"]] && ast["arguments"][0]["name"] !== "a" && ast["arguments"][0]["name"] !== "f") {
            ast["arguments"][0] = definedRegValue[ast["arguments"][0]["name"]];
          }
          if (ast["arguments"][1] && ast["arguments"][1]["type"] === "Register" && definedReg[ast["arguments"][1]["name"]] && ast["arguments"][1]["name"] !== "a" && ast["arguments"][1]["name"] !== "f") {
            ast["arguments"][1] = definedRegValue[ast["arguments"][1]["name"]];
          }
          return ast;
        }
        if (ast["type"] === "MemberExpression" && ast["property"]["type"] === "Register" && definedReg[ast["property"]["name"]] && ast["property"]["name"] !== "a" && ast["property"]["name"] !== "f") {
          ast["property"] = definedRegValue[ast["property"]["name"]];
          return ast;
        }
        if (ast["type"] === "BinaryExpression") {
          if (ast["right"]["type"] === "Register" && definedReg[ast["right"]["name"]] && ast["right"]["name"] !== "a" && ast["right"]["name"] !== "f") {
            ast["right"] = definedRegValue[ast["right"]["name"]];
          }
          if (ast["left"]["type"] === "Register" && definedReg[ast["left"]["name"]] && ast["left"]["name"] !== "a" && ast["left"]["name"] !== "f") {
            ast["left"] = definedRegValue[ast["left"]["name"]];
          }
          return ast;
        }
        return ast;
      });
      return _ast;
    });
  }, portPeephole:function(fn) {
    var self = this;
    return fn.map(function(_ast) {
      _ast = JSSMS.Utils.traverse(_ast, function(ast) {
        if (ast["type"] === "CallExpression") {
          if (ast["callee"]["name"] === "port.out") {
            var port = ast["arguments"][0]["value"];
            var value = ast["arguments"][1];
            if (self.main.is_gg && port < 7) {
              ast["callee"]["name"] = "nop";
              return undefined;
            }
            switch(port & 193) {
              case 1:
                break;
              case 128:
                ast["callee"]["name"] = "vdp.dataWrite";
                ast["arguments"] = [value];
                break;
              case 129:
                ast["callee"]["name"] = "vdp.controlWrite";
                ast["arguments"] = [value];
                break;
              case 64:
              ;
              case 65:
                if (self.main.soundEnabled) {
                  ast["callee"]["name"] = "psg.write";
                  ast["arguments"] = [value];
                } else {
                }
                break;
            }
            return ast;
          } else {
            if (ast["callee"]["name"] === "port.in_") {
              var port = ast["arguments"][0]["value"];
              if (self.main.is_gg && port < 7) {
                switch(port) {
                  case 0:
                    ast["type"] = "BinaryExpression";
                    ast["operator"] = "|";
                    ast["left"] = n.BinaryExpression("&", n.Identifier("port.keyboard.ggstart"), n.Literal(191));
                    ast["right"] = n.Identifier("port.europe");
                    delete ast["callee"];
                    delete ast["arguments"];
                    return ast;
                  case 1:
                  ;
                  case 2:
                  ;
                  case 3:
                  ;
                  case 4:
                  ;
                  case 5:
                    ast["type"] = "Literal";
                    ast["value"] = 0;
                    ast["raw"] = DEBUG ? JSSMS.Utils.toHex(0) : "" + 0;
                    delete ast["callee"];
                    delete ast["arguments"];
                    return ast;
                  case 6:
                    ast["type"] = "Literal";
                    ast["value"] = 255;
                    ast["raw"] = DEBUG ? JSSMS.Utils.toHex(255) : "" + 255;
                    delete ast["callee"];
                    delete ast["arguments"];
                    return ast;
                }
              }
              switch(port & 193) {
                case 64:
                  ast["callee"]["name"] = "vdp.getVCount";
                  ast["arguments"] = [];
                  return ast;
                case 65:
                  ast["type"] = "Identifier";
                  ast["name"] = "port.hCounter";
                  delete ast["callee"];
                  delete ast["arguments"];
                  return ast;
                case 128:
                  ast["callee"]["name"] = "vdp.dataRead";
                  ast["arguments"] = [];
                  return ast;
                case 129:
                  ast["callee"]["name"] = "vdp.controlRead";
                  ast["arguments"] = [];
                  return ast;
                case 192:
                  ast["type"] = "Identifier";
                  ast["name"] = "main.keyboard.controller1";
                  delete ast["callee"];
                  delete ast["arguments"];
                  return ast;
                case 193:
                  if (LIGHTGUN) {
                    return ast;
                  } else {
                    ast["type"] = "BinaryExpression";
                    ast["operator"] = "|";
                    ast["left"] = n.BinaryExpression("|", n.BinaryExpression("&", n.Identifier("main.keyboard.controller2"), n.Literal(63)), n.MemberExpression(n.Identifier("port.ioPorts"), n.Literal(0)));
                    ast["right"] = n.MemberExpression(n.Identifier("port.ioPorts"), n.Literal(1));
                    delete ast["callee"];
                    delete ast["arguments"];
                    return ast;
                  }
                  return ast;
              }
              ast["type"] = "Literal";
              ast["value"] = 255;
              ast["raw"] = DEBUG ? JSSMS.Utils.toHex(255) : "" + 255;
              delete ast["callee"];
              delete ast["arguments"];
              return ast;
            }
          }
        }
        return ast;
      });
      return _ast;
    });
  }, trimAfterReturn:function(fn) {
    var returnStatementIndex = null;
    fn.some(function(ast, index) {
      if (ast["type"] === "ReturnStatement") {
        returnStatementIndex = index;
        return true;
      }
    });
    if (returnStatementIndex) {
      fn = fn.slice(0, returnStatementIndex);
    }
    return fn;
  }};
  return Optimizer;
}();
var CodeGenerator = function() {
  var toHex = JSSMS.Utils.toHex;
  function getTotalTStates(opcodes) {
    switch(opcodes[0]) {
      case 203:
        return OP_CB_STATES[opcodes[1]];
      case 221:
      ;
      case 253:
        if (opcodes.length === 2) {
          return OP_DD_STATES[opcodes[1]];
        }
        return OP_INDEX_CB_STATES[opcodes[2]];
      case 237:
        return OP_ED_STATES[opcodes[1]];
      default:
        return OP_STATES[opcodes[0]];
    }
  }
  var CodeGenerator = function() {
    this.ast = [];
  };
  CodeGenerator.prototype = {generate:function(functions) {
    for (var page = 0;page < functions.length;page++) {
      functions[page] = functions[page].map(function(fn) {
        var name = fn[0].address;
        var body = [{"type":"ExpressionStatement", "expression":{"type":"Literal", "value":"use strict", "raw":'"use strict"'}, "_address":name}];
        var tstates = 0;
        fn = fn.map(function(bytecode) {
          if (bytecode.ast === undefined) {
            bytecode.ast = [];
          }
          if (REFRESH_EMULATION) {
            var refreshEmulationStmt = {"type":"ExpressionStatement", "expression":{"type":"CallExpression", "callee":n.Identifier("incR"), "arguments":[]}}
          }
          if (ENABLE_SERVER_LOGGER) {
            var syncServerStmt = {"type":"ExpressionStatement", "expression":{"type":"CallExpression", "callee":n.Identifier("sync"), "arguments":[]}}
          }
          tstates += getTotalTStates(bytecode.opcode);
          var decreaseTStateStmt = [{"type":"ExpressionStatement", "expression":{"type":"AssignmentExpression", "operator":"-=", "left":{"type":"Identifier", "name":"tstates"}, "right":{"type":"Literal", "value":tstates, "raw":DEBUG ? toHex(tstates) : "" + tstates}}}];
          tstates = 0;
          if (REFRESH_EMULATION) {
            decreaseTStateStmt = [].concat(refreshEmulationStmt, decreaseTStateStmt);
          }
          if (ENABLE_SERVER_LOGGER) {
            decreaseTStateStmt = [].concat(syncServerStmt, decreaseTStateStmt);
          }
          if (bytecode.changePage) {
            var updatePageStmt = {"type":"ExpressionStatement", "expression":{"type":"UpdateExpression", "operator":"++", "argument":{"type":"Identifier", "name":"page"}, "prefix":false}};
            bytecode.ast = [].concat(updatePageStmt, bytecode.ast);
          }
          bytecode.ast = [].concat(decreaseTStateStmt, bytecode.ast);
          if ((ENABLE_SERVER_LOGGER || bytecode.isFunctionEnder) && bytecode.nextAddress !== null) {
            var nextAddress = bytecode.nextAddress % 16384;
            var updatePcStmt = {"type":"ExpressionStatement", "expression":{"type":"AssignmentExpression", "operator":"=", "left":{"type":"Identifier", "name":"pc"}, "right":{"type":"BinaryExpression", "operator":"+", "left":{"type":"Literal", "value":nextAddress, "raw":DEBUG ? toHex(nextAddress) : "" + nextAddress}, "right":{"type":"BinaryExpression", "operator":"*", "left":{"type":"Identifier", "name":"page"}, "right":{"type":"Literal", "value":16384, "raw":"0x4000"}}}}};
            bytecode.ast.push(updatePcStmt);
          }
          if (DEBUG) {
            if (bytecode.ast[0]) {
              bytecode.ast[0].leadingComments = [{type:"Line", value:" " + bytecode.label}];
            }
          }
          return bytecode.ast;
        });
        fn.forEach(function(ast) {
          body = body.concat(ast);
        });
        return body;
      });
    }
    this.ast = functions;
  }};
  return CodeGenerator;
}();
var Recompiler = function() {
  var Recompiler = function(cpu) {
    this.cpu = cpu;
    this.rom = [];
    this.options = {};
    this.parser = {};
    this.analyzer = new Analyzer;
    this.optimizer = new Optimizer(cpu.main);
    this.generator = new CodeGenerator;
    this.bytecodes = {};
  };
  Recompiler.prototype = {setRom:function(rom) {
    this.rom = rom;
    this.parser = new Parser(rom, this.cpu.frameReg);
  }, reset:function() {
    var self = this;
    this.options.entryPoints = [{address:0, romPage:0, memPage:0}];
    if (this.rom.length <= 2) {
      JSSMS.Utils.console.log("Parsing full ROM");
    } else {
      this.options.pageLimit = 0;
      JSSMS.Utils.console.log("Parsing initial memory page of ROM");
    }
    var fns = this.parse().analyze().generate().optimize();
    for (var page = 0;page < this.rom.length;page++) {
      fns[page].forEach(function(body) {
        var funcName = "_" + body[0]._address;
        body = self.convertRegisters(body);
        body = self.thisifyIdentifiers(body);
        body = self.wrapFunction(funcName, body);
        self.cpu.branches[page][funcName] = (new Function("return " + self.generateCodeFromAst(body)))();
      });
    }
  }, parse:function() {
    var self = this;
    this.options.entryPoints.forEach(function(entryPoint) {
      self.parser.addEntryPoint(entryPoint);
    });
    this.parser.parse(this.options.pageLimit);
    return this;
  }, analyze:function() {
    this.analyzer.analyze(this.parser.bytecodes);
    return this;
  }, generate:function() {
    this.generator.generate(this.analyzer.ast);
    return this;
  }, optimize:function() {
    this.optimizer.optimize(this.generator.ast);
    return this.optimizer.ast;
  }, recompileFromAddress:function(address, romPage, memPage) {
    var self = this;
    var fns = this.parseFromAddress(address, romPage, memPage).analyzeFromAddress().generate().optimize();
    fns[0].forEach(function(body) {
      var funcName = "_" + address % 16384;
      body = self.convertRegisters(body);
      body = self.thisifyIdentifiers(body);
      body = self.wrapFunction(funcName, body);
      self.cpu.branches[romPage][funcName] = (new Function("return " + self.generateCodeFromAst(body)))();
    });
  }, parseFromAddress:function(address, romPage, memPage) {
    var obj = {address:address, romPage:romPage, memPage:memPage};
    this.parser.entryPoints.push(obj);
    this.bytecodes = this.parser.parseFromAddress(obj);
    return this;
  }, analyzeFromAddress:function() {
    this.analyzer.analyzeFromAddress(this.bytecodes);
    return this;
  }, generateCodeFromAst:function(fn) {
    return window["escodegen"]["generate"](fn, {comment:true, renumber:true, hexadecimal:true, parse:DEBUG ? window["esprima"]["parse"] : function(c) {
      return {"type":"Program", "body":[{"type":"ExpressionStatement", "expression":{"type":"Literal", "value":c, "raw":c}}]};
    }});
  }, thisifyIdentifiers:function(body) {
    var whitelist = ["page", "temp", "location", "val", "value", "JSSMS.Utils.rndInt"];
    return JSSMS.Utils.traverse(body, function(obj) {
      if (obj.type && obj.type === "Identifier" && whitelist.indexOf(obj.name) === -1) {
        obj.name = "this." + obj.name;
      }
      return obj;
    });
  }, convertRegisters:function(ast) {
    return JSSMS.Utils.traverse(ast, function(ast) {
      if (ast.type === "Register") {
        ast.type = "Identifier";
      }
      return ast;
    });
  }, wrapFunction:function(funcName, body) {
    return {"type":"Program", "body":[{"type":"FunctionDeclaration", "id":{"type":"Identifier", "name":funcName}, "params":[{"type":"Identifier", "name":"page"}, {"type":"Identifier", "name":"temp"}, {"type":"Identifier", "name":"location"}], "defaults":[], "body":{"type":"BlockStatement", "body":body}, "rest":null, "generator":false, "expression":false}]};
  }, dump:function() {
    var output = [];
    for (var i in this.cpu.branches) {
      output.push("// Page " + i);
      for (var j in this.cpu.branches[i]) {
        output.push(this.cpu.branches[i][j]);
      }
    }
    output = output.join("\n");
    console.log(output);
  }};
  return Recompiler;
}();
window["JSSMS"] = JSSMS;

