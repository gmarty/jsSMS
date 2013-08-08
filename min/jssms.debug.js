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
'use strict';var DEBUG = !0, ENABLE_DEBUGGER = !0, ENABLE_COMPILER = !0, ACCURATE = !1, LITTLE_ENDIAN = !0, FORCE_DATAVIEW = !1, SUPPORT_DATAVIEW = FORCE_DATAVIEW || !(!window.DataView || !window.ArrayBuffer), SAMPLE_RATE = 44100, DEBUG_TIMING = DEBUG, REFRESH_EMULATION = !1, ACCURATE_INTERRUPT_EMULATION = !1, LIGHTGUN = !1, VDP_SPRITE_COLLISIONS = ACCURATE, PAGE_SIZE = 16384;
var fpsInterval = 500, CLOCK_NTSC = 3579545, CLOCK_PAL = 3546893;
function JSSMS($opts$$) {
  this.opts = {ui:JSSMS.DummyUI, swfPath:"lib/"};
  if(void 0 != $opts$$) {
    for(var $key$$ in this.opts) {
      void 0 != $opts$$[$key$$] && (this.opts[$key$$] = $opts$$[$key$$])
    }
  }
  this.keyboard = new JSSMS.Keyboard(this);
  this.ui = new $opts$$.ui(this);
  this.vdp = new JSSMS.Vdp(this);
  this.psg = new JSSMS.SN76489(this);
  this.ports = new JSSMS.Ports(this);
  this.cpu = new JSSMS.Z80(this);
  this.ui.updateStatus("Ready to load a ROM.");
  this.ui = this.ui
}
JSSMS.prototype = {isRunning:!1, cyclesPerLine:0, no_of_scanlines:0, frameSkip:0, throttle:!0, fps:0, frameskip_counter:0, pause_button:!1, is_sms:!0, is_gg:!1, soundEnabled:!1, audioBuffer:[], audioBufferOffset:0, samplesPerFrame:0, samplesPerLine:[], emuWidth:0, emuHeight:0, fpsFrameCount:0, z80Time:0, drawTime:0, z80TimeCounter:0, drawTimeCounter:0, frameCount:0, romData:"", romFileName:"", lineno:0, reset:function $JSSMS$$reset$() {
  this.setVideoTiming(this.vdp.videoMode);
  this.frameCount = 0;
  this.frameskip_counter = this.frameSkip;
  this.keyboard.reset();
  this.ui.reset();
  this.vdp.reset();
  this.ports.reset();
  this.cpu.reset();
  ENABLE_DEBUGGER && this.cpu.resetDebug();
  DEBUG && clearInterval(this.fpsInterval)
}, start:function $JSSMS$$start$() {
  var $self$$ = this;
  this.isRunning || (this.isRunning = !0, this.ui.requestAnimationFrame(this.frame.bind(this), this.ui.screen), DEBUG && (this.resetFps(), this.fpsInterval = setInterval(function() {
    $self$$.printFps()
  }, fpsInterval)));
  this.ui.updateStatus("Running")
}, stop:function $JSSMS$$stop$() {
  DEBUG && clearInterval(this.fpsInterval);
  this.isRunning = !1
}, frame:function $JSSMS$$frame$() {
  this.isRunning && (this.cpu.frame(), this.fpsFrameCount++, this.ui.requestAnimationFrame(this.frame.bind(this), this.ui.screen))
}, nextStep:function $JSSMS$$nextStep$() {
  this.cpu.frame()
}, setSMS:function $JSSMS$$setSMS$() {
  this.is_sms = !0;
  this.is_gg = !1;
  this.vdp.h_start = 0;
  this.vdp.h_end = 32;
  this.emuWidth = SMS_WIDTH;
  this.emuHeight = SMS_HEIGHT
}, setGG:function $JSSMS$$setGG$() {
  this.is_gg = !0;
  this.is_sms = !1;
  this.vdp.h_start = 5;
  this.vdp.h_end = 27;
  this.emuWidth = GG_WIDTH;
  this.emuHeight = GG_HEIGHT
}, setVideoTiming:function $JSSMS$$setVideoTiming$($i$$1_mode$$) {
  var $clockSpeedHz_v$$ = 0;
  $i$$1_mode$$ == NTSC || this.is_gg ? (this.fps = 60, this.no_of_scanlines = SMS_Y_PIXELS_NTSC, $clockSpeedHz_v$$ = CLOCK_NTSC) : (this.fps = 50, this.no_of_scanlines = SMS_Y_PIXELS_PAL, $clockSpeedHz_v$$ = CLOCK_PAL);
  this.cyclesPerLine = Math.round($clockSpeedHz_v$$ / this.fps / this.no_of_scanlines + 1);
  this.vdp.videoMode = $i$$1_mode$$;
  if(this.soundEnabled) {
    this.psg.init($clockSpeedHz_v$$, SAMPLE_RATE);
    this.samplesPerFrame = Math.round(SAMPLE_RATE / this.fps);
    if(0 == this.audioBuffer.length || this.audioBuffer.length != this.samplesPerFrame) {
      this.audioBuffer = Array(this.samplesPerFrame)
    }
    if(0 == this.samplesPerLine.length || this.samplesPerLine.length != this.no_of_scanlines) {
      this.samplesPerLine = Array(this.no_of_scanlines);
      var $fractional$$ = 0;
      for($i$$1_mode$$ = 0;$i$$1_mode$$ < this.no_of_scanlines;$i$$1_mode$$++) {
        $clockSpeedHz_v$$ = (this.samplesPerFrame << 16) / this.no_of_scanlines + $fractional$$, $fractional$$ = $clockSpeedHz_v$$ - ($clockSpeedHz_v$$ >> 16 << 16), this.samplesPerLine[$i$$1_mode$$] = $clockSpeedHz_v$$ >> 16
      }
    }
  }
}, audioOutput:function $JSSMS$$audioOutput$($buffer$$) {
  this.ui.writeAudio($buffer$$)
}, doRepaint:function $JSSMS$$doRepaint$() {
  this.ui.writeFrame()
}, printFps:function $JSSMS$$printFps$() {
  var $now$$ = JSSMS.Utils.getTimestamp(), $s$$ = "Running: " + (this.fpsFrameCount / (($now$$ - this.lastFpsTime) / 1E3)).toFixed(2) + " FPS";
  this.ui.updateStatus($s$$);
  this.fpsFrameCount = 0;
  this.lastFpsTime = $now$$
}, resetFps:function $JSSMS$$resetFps$() {
  this.lastFpsTime = JSSMS.Utils.getTimestamp();
  this.fpsFrameCount = 0
}, updateSound:function $JSSMS$$updateSound$($line_samplesToGenerate$$) {
  0 == $line_samplesToGenerate$$ && (this.audioBufferOffset = 0);
  $line_samplesToGenerate$$ = this.samplesPerLine[$line_samplesToGenerate$$];
  this.audioBuffer = this.psg.update(this.audioBufferOffset, $line_samplesToGenerate$$);
  this.audioBufferOffset += $line_samplesToGenerate$$
}, readRomDirectly:function $JSSMS$$readRomDirectly$($data$$, $fileName$$) {
  var $mode$$;
  $mode$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
  var $size$$ = $data$$.length;
  1 == $mode$$ ? this.setSMS() : 2 == $mode$$ && this.setGG();
  if($size$$ <= PAGE_SIZE) {
    return!1
  }
  $mode$$ = this.loadROM($data$$, $size$$);
  if(null == $mode$$) {
    return!1
  }
  this.cpu.resetMemory($mode$$);
  this.romData = $data$$;
  this.romFileName = $fileName$$;
  return!0
}, loadROM:function $JSSMS$$loadROM$($data$$, $size$$) {
  0 != $size$$ % 1024 && ($data$$ = $data$$.substr(512), $size$$ -= 512);
  var $i$$, $j$$, $number_of_pages$$ = Math.round($size$$ / PAGE_SIZE), $pages$$ = Array($number_of_pages$$);
  for($i$$ = 0;$i$$ < $number_of_pages$$;$i$$++) {
    if($pages$$[$i$$] = JSSMS.Utils.Array(PAGE_SIZE), SUPPORT_DATAVIEW) {
      for($j$$ = 0;$j$$ < PAGE_SIZE;$j$$++) {
        $pages$$[$i$$].setUint8($j$$, $data$$.charCodeAt($i$$ * PAGE_SIZE + $j$$))
      }
    }else {
      for($j$$ = 0;$j$$ < PAGE_SIZE;$j$$++) {
        $pages$$[$i$$][$j$$] = $data$$.charCodeAt($i$$ * PAGE_SIZE + $j$$) & 255
      }
    }
  }
  return $pages$$
}, reloadRom:function $JSSMS$$reloadRom$() {
  return"" != this.romData && "" != this.romFileName ? this.readRomDirectly(this.romData, this.romFileName) : !1
}};
JSSMS.Utils = {rndInt:function $JSSMS$Utils$rndInt$($range$$) {
  return Math.round(Math.random() * $range$$)
}, Array:function() {
  return SUPPORT_DATAVIEW ? function($length$$) {
    return new DataView(new ArrayBuffer($length$$))
  } : Array
}(), copyArrayElements:function() {
  return SUPPORT_DATAVIEW ? function($src$$, $srcPos$$, $dest$$, $destPos$$, $length$$) {
    for(;$length$$--;) {
      $dest$$.setInt8($destPos$$ + $length$$, $src$$.getInt8($srcPos$$ + $length$$))
    }
  } : function($src$$, $srcPos$$, $dest$$, $destPos$$, $length$$) {
    for(;$length$$--;) {
      $dest$$[$destPos$$ + $length$$] = $src$$[$srcPos$$ + $length$$]
    }
  }
}(), console:{log:function $JSSMS$Utils$console$log$($var_args$$) {
  DEBUG && window.console.log.apply(window.console, arguments)
}, error:function $JSSMS$Utils$console$error$($var_args$$) {
  DEBUG && window.console.error.apply(window.console, arguments)
}, time:function $JSSMS$Utils$console$time$($label$$) {
  DEBUG && window.console.time($label$$)
}, timeEnd:function $JSSMS$Utils$console$timeEnd$($label$$) {
  DEBUG && window.console.timeEnd($label$$)
}}, traverse:function $JSSMS$Utils$traverse$($object$$, $fn$$) {
  var $key$$, $child$$;
  $fn$$.call(null, $object$$);
  for($key$$ in $object$$) {
    $object$$.hasOwnProperty($key$$) && ($child$$ = $object$$[$key$$], "object" === typeof $child$$ && null !== $child$$ && ($object$$[$key$$] = JSSMS.Utils.traverse($child$$, $fn$$)))
  }
  return $object$$
}, getTimestamp:function() {
  return window.performance && window.performance.now ? function() {
    return window.performance.now()
  } : function() {
    return(new Date).getTime()
  }
}(), toHex:function $JSSMS$Utils$toHex$($dec_hex$$) {
  $dec_hex$$ = $dec_hex$$.toString(16).toUpperCase();
  $dec_hex$$.length % 2 && ($dec_hex$$ = "0" + $dec_hex$$);
  return"0x" + $dec_hex$$
}, getPrefix:function $JSSMS$Utils$getPrefix$($arr$$, $obj$$) {
  var $prefix$$ = !1;
  void 0 == $obj$$ && ($obj$$ = document);
  $arr$$.some(function($prop$$) {
    return $prop$$ in $obj$$ ? ($prefix$$ = $prop$$, !0) : !1
  });
  return $prefix$$
}, isIE:function $JSSMS$Utils$isIE$() {
  return/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)
}};
var HALT_SPEEDUP = !0, F_CARRY = 1, F_NEGATIVE = 2, F_PARITY = 4, F_OVERFLOW = 4, F_BIT3 = 8, F_HALFCARRY = 16, F_BIT5 = 32, F_ZERO = 64, F_SIGN = 128, BIT_0 = 1, BIT_1 = 2, BIT_2 = 4, BIT_3 = 8, BIT_4 = 16, BIT_5 = 32, BIT_6 = 64, BIT_7 = 128, OP_STATES = [4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 
4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 
10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11], OP_CB_STATES = [8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 
8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8], OP_DD_STATES = [4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 
4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 
4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4], OP_INDEX_CB_STATES = [23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 
20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23], OP_ED_STATES = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 
20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
JSSMS.Z80 = function $JSSMS$Z80$($sms$$) {
  this.main = $sms$$;
  this.vdp = $sms$$.vdp;
  this.psg = $sms$$.psg;
  this.port = $sms$$.ports;
  this.im = this.sp = this.pc = 0;
  this.interruptLine = this.EI_inst = this.halt = this.iff2 = this.iff1 = !1;
  this.tstates = this.totalCycles = this.f2 = this.f = this.i = this.r = this.iyH = this.iyL = this.ixH = this.ixL = this.l2 = this.h2 = this.l = this.h = this.e2 = this.d2 = this.e = this.d = this.c2 = this.b2 = this.c = this.b = this.a2 = this.a = this.interruptVector = 0;
  this.rom = [];
  this.sram = JSSMS.Utils.Array(32768);
  this.useSRAM = !1;
  this.frameReg = Array(4);
  this.number_of_pages = this.romPageMask = 0;
  this.memWriteMap = JSSMS.Utils.Array(8192);
  this.DAA_TABLE = Array(2048);
  this.SZ_TABLE = Array(256);
  this.SZP_TABLE = Array(256);
  this.SZHV_INC_TABLE = Array(256);
  this.SZHV_DEC_TABLE = Array(256);
  this.SZHVC_ADD_TABLE = Array(131072);
  this.SZHVC_SUB_TABLE = Array(131072);
  this.SZ_BIT_TABLE = Array(256);
  this.generateFlagTables();
  this.generateDAATable();
  this.generateMemory();
  if(ENABLE_DEBUGGER) {
    for(var $method$$ in JSSMS.Debugger.prototype) {
      this[$method$$] = JSSMS.Debugger.prototype[$method$$]
    }
  }
  ENABLE_COMPILER && (this.recompiler = new Recompiler(this))
};
JSSMS.Z80.prototype = {reset:function $JSSMS$Z80$$reset$() {
  this.pc = this.f2 = this.f = this.i = this.r = this.iyL = this.iyH = this.ixL = this.ixH = this.h = this.l = this.h2 = this.l2 = this.d = this.e = this.d2 = this.e2 = this.b = this.c = this.b2 = this.c2 = this.a = this.a2 = 0;
  this.sp = 57328;
  this.im = this.tstates = this.totalCycles = 0;
  this.EI_inst = this.iff2 = this.iff1 = !1;
  this.interruptVector = 0;
  this.halt = !1;
  ENABLE_COMPILER && this.recompiler.reset()
}, frame:function $JSSMS$Z80$$frame$() {
  this.lineno = 0;
  this.tstates += this.main.cyclesPerLine;
  this.totalCycles = this.main.cyclesPerLine;
  for(ACCURATE_INTERRUPT_EMULATION && this.interruptLine && this.interrupt();!(ENABLE_DEBUGGER && this.main.ui.updateDisassembly(this.pc), ENABLE_COMPILER ? this.recompile() : this.interpret(), 0 >= this.tstates && this.eol());) {
  }
}, recompile:function $JSSMS$Z80$$recompile$() {
  1024 > this.pc ? (this.branches[0][this.pc] || this.recompiler.recompileFromAddress(this.pc, 0, 0), this.branches[0][this.pc].call(this)) : 16384 > this.pc ? (this.branches[this.frameReg[0]][this.pc] || this.recompiler.recompileFromAddress(this.pc, this.frameReg[0], 0), this.branches[this.frameReg[0]][this.pc].call(this)) : 32768 > this.pc ? (this.branches[this.frameReg[1]][this.pc - 16384] || this.recompiler.recompileFromAddress(this.pc, this.frameReg[1], 1), this.branches[this.frameReg[1]][this.pc - 
  16384].call(this)) : 49152 > this.pc ? (this.branches[this.frameReg[2]][this.pc - 32768] || this.recompiler.recompileFromAddress(this.pc, this.frameReg[2], 2), this.branches[this.frameReg[2]][this.pc - 32768].call(this)) : this.interpret()
}, eol:function $JSSMS$Z80$$eol$() {
  this.main.soundEnabled && this.main.updateSound(this.lineno);
  this.vdp.line = this.lineno;
  192 > this.lineno && this.vdp.drawLine(this.lineno);
  this.vdp.interrupts(this.lineno);
  this.interruptLine && this.interrupt();
  this.lineno++;
  if(this.lineno >= this.main.no_of_scanlines) {
    return this.eof(), !0
  }
  this.tstates += this.main.cyclesPerLine;
  this.totalCycles = this.main.cyclesPerLine;
  return!1
}, eof:function $JSSMS$Z80$$eof$() {
  this.main.soundEnabled && this.main.audioOutput(this.main.audioBuffer);
  this.main.pause_button && (this.nmi(), this.main.pause_button = !1);
  this.main.doRepaint()
}, branches:[Object.create(null), Object.create(null), Object.create(null)], interpret:function $JSSMS$Z80$$interpret$() {
  var $location$$ = 0, $location$$ = 0, $location$$ = this.readMem(this.pc++);
  ACCURATE_INTERRUPT_EMULATION && (this.EI_inst = !1);
  this.tstates -= OP_STATES[$location$$];
  REFRESH_EMULATION && this.incR();
  switch($location$$) {
    case 1:
      this.setBC(this.readMemWord(this.pc++));
      this.pc++;
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
      this.jr(0 != this.b);
      break;
    case 17:
      this.setDE(this.readMemWord(this.pc++));
      this.pc++;
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
      this.pc += this.signExtend(this.d_() + 1);
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
      this.jr(0 == (this.f & F_ZERO));
      break;
    case 33:
      this.setHL(this.readMemWord(this.pc++));
      this.pc++;
      break;
    case 34:
      $location$$ = this.readMemWord(this.pc);
      this.writeMem($location$$++, this.l);
      this.writeMem($location$$, this.h);
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
      this.jr(0 != (this.f & F_ZERO));
      break;
    case 41:
      this.setHL(this.add16(this.getHL(), this.getHL()));
      break;
    case 42:
      this.setHL(this.readMemWord(this.readMemWord(this.pc)));
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
      this.jr(0 == (this.f & F_CARRY));
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
      this.jr(0 != (this.f & F_CARRY));
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
      HALT_SPEEDUP && (this.tstates = 0);
      this.halt = !0;
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
      this.ret(0 == (this.f & F_ZERO));
      break;
    case 193:
      this.setBC(this.readMemWord(this.sp));
      this.sp += 2;
      break;
    case 194:
      this.jp(0 == (this.f & F_ZERO));
      break;
    case 195:
      this.pc = this.readMemWord(this.pc);
      break;
    case 196:
      this.call(0 == (this.f & F_ZERO));
      break;
    case 197:
      this.push2(this.b, this.c);
      break;
    case 198:
      this.add_a(this.readMem(this.pc++));
      break;
    case 199:
      this.push1(this.pc);
      this.pc = 0;
      break;
    case 200:
      this.ret(0 != (this.f & F_ZERO));
      break;
    case 201:
      this.pc = this.readMemWord(this.sp);
      this.sp += 2;
      break;
    case 202:
      this.jp(0 != (this.f & F_ZERO));
      break;
    case 203:
      this.doCB(this.readMem(this.pc++));
      break;
    case 204:
      this.call(0 != (this.f & F_ZERO));
      break;
    case 205:
      this.push1(this.pc + 2);
      this.pc = this.readMemWord(this.pc);
      break;
    case 206:
      this.adc_a(this.readMem(this.pc++));
      break;
    case 207:
      this.push1(this.pc);
      this.pc = 8;
      break;
    case 208:
      this.ret(0 == (this.f & F_CARRY));
      break;
    case 209:
      this.setDE(this.readMemWord(this.sp));
      this.sp += 2;
      break;
    case 210:
      this.jp(0 == (this.f & F_CARRY));
      break;
    case 211:
      this.port.out(this.readMem(this.pc++), this.a);
      break;
    case 212:
      this.call(0 == (this.f & F_CARRY));
      break;
    case 213:
      this.push2(this.d, this.e);
      break;
    case 214:
      this.sub_a(this.readMem(this.pc++));
      break;
    case 215:
      this.push1(this.pc);
      this.pc = 16;
      break;
    case 216:
      this.ret(0 != (this.f & F_CARRY));
      break;
    case 217:
      this.exBC();
      this.exDE();
      this.exHL();
      break;
    case 218:
      this.jp(0 != (this.f & F_CARRY));
      break;
    case 219:
      this.a = this.port.in_(this.readMem(this.pc++));
      break;
    case 220:
      this.call(0 != (this.f & F_CARRY));
      break;
    case 221:
      this.doIndexOpIX(this.readMem(this.pc++));
      break;
    case 222:
      this.sbc_a(this.readMem(this.pc++));
      break;
    case 223:
      this.push1(this.pc);
      this.pc = 24;
      break;
    case 224:
      this.ret(0 == (this.f & F_PARITY));
      break;
    case 225:
      this.setHL(this.readMemWord(this.sp));
      this.sp += 2;
      break;
    case 226:
      this.jp(0 == (this.f & F_PARITY));
      break;
    case 227:
      $location$$ = this.h;
      this.h = this.readMem(this.sp + 1);
      this.writeMem(this.sp + 1, $location$$);
      $location$$ = this.l;
      this.l = this.readMem(this.sp);
      this.writeMem(this.sp, $location$$);
      break;
    case 228:
      this.call(0 == (this.f & F_PARITY));
      break;
    case 229:
      this.push2(this.h, this.l);
      break;
    case 230:
      this.f = this.SZP_TABLE[this.a &= this.readMem(this.pc++)] | F_HALFCARRY;
      break;
    case 231:
      this.push1(this.pc);
      this.pc = 32;
      break;
    case 232:
      this.ret(0 != (this.f & F_PARITY));
      break;
    case 233:
      this.pc = this.getHL();
      break;
    case 234:
      this.jp(0 != (this.f & F_PARITY));
      break;
    case 235:
      $location$$ = this.d;
      this.d = this.h;
      this.h = $location$$;
      $location$$ = this.e;
      this.e = this.l;
      this.l = $location$$;
      break;
    case 236:
      this.call(0 != (this.f & F_PARITY));
      break;
    case 237:
      this.doED(this.d_());
      break;
    case 238:
      this.f = this.SZP_TABLE[this.a ^= this.readMem(this.pc++)];
      break;
    case 239:
      this.push1(this.pc);
      this.pc = 40;
      break;
    case 240:
      this.ret(0 == (this.f & F_SIGN));
      break;
    case 241:
      this.setAF(this.readMemWord(this.sp));
      this.sp += 2;
      break;
    case 242:
      this.jp(0 == (this.f & F_SIGN));
      break;
    case 243:
      this.iff1 = this.iff2 = !1;
      this.EI_inst = !0;
      break;
    case 244:
      this.call(0 == (this.f & F_SIGN));
      break;
    case 245:
      this.push2(this.a, this.f);
      break;
    case 246:
      this.f = this.SZP_TABLE[this.a |= this.readMem(this.pc++)];
      break;
    case 247:
      this.push1(this.pc);
      this.pc = 48;
      break;
    case 248:
      this.ret(0 != (this.f & F_SIGN));
      break;
    case 249:
      this.sp = this.getHL();
      break;
    case 250:
      this.jp(0 != (this.f & F_SIGN));
      break;
    case 251:
      this.iff1 = this.iff2 = this.EI_inst = !0;
      break;
    case 252:
      this.call(0 != (this.f & F_SIGN));
      break;
    case 253:
      this.doIndexOpIY(this.readMem(this.pc++));
      break;
    case 254:
      this.cp_a(this.readMem(this.pc++));
      break;
    case 255:
      this.push1(this.pc), this.pc = 56
  }
}, getCycle:function $JSSMS$Z80$$getCycle$() {
  return this.totalCycles - this.tstates
}, nmi:function $JSSMS$Z80$$nmi$() {
  this.iff2 = this.iff1;
  this.iff1 = !1;
  REFRESH_EMULATION && this.incR();
  this.halt && (this.pc++, this.halt = !1);
  this.push1(this.pc);
  this.pc = 102;
  this.tstates -= 11
}, interrupt:function $JSSMS$Z80$$interrupt$() {
  !this.iff1 || ACCURATE_INTERRUPT_EMULATION && this.EI_inst || (this.halt && (this.pc++, this.halt = !1), REFRESH_EMULATION && this.incR(), this.interruptLine = this.iff1 = this.iff2 = !1, this.push1(this.pc), 0 == this.im ? (this.pc = 0 == this.interruptVector || 255 == this.interruptVector ? 56 : this.interruptVector, this.tstates -= 13) : 1 == this.im ? (this.pc = 56, this.tstates -= 13) : (this.pc = this.readMemWord((this.i << 8) + this.interruptVector), this.tstates -= 19))
}, jp:function $JSSMS$Z80$$jp$($condition$$) {
  this.pc = $condition$$ ? this.readMemWord(this.pc) : this.pc + 2
}, jr:function $JSSMS$Z80$$jr$($condition$$) {
  $condition$$ ? (this.pc += this.signExtend(this.d_() + 1), this.tstates -= 5) : this.pc++
}, signExtend:function $JSSMS$Z80$$signExtend$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$
}, call:function $JSSMS$Z80$$call$($condition$$) {
  $condition$$ ? (this.push1(this.pc + 2), this.pc = this.readMemWord(this.pc), this.tstates -= 7) : this.pc += 2
}, ret:function $JSSMS$Z80$$ret$($condition$$) {
  $condition$$ && (this.pc = this.readMemWord(this.sp), this.sp += 2, this.tstates -= 6)
}, push1:function $JSSMS$Z80$$push1$($value$$) {
  this.writeMem(--this.sp, $value$$ >> 8);
  this.writeMem(--this.sp, $value$$ & 255)
}, push2:function $JSSMS$Z80$$push2$($hi$$, $lo$$) {
  this.writeMem(--this.sp, $hi$$);
  this.writeMem(--this.sp, $lo$$)
}, incMem:function $JSSMS$Z80$$incMem$($offset$$) {
  this.writeMem($offset$$, this.inc8(this.readMem($offset$$)))
}, decMem:function $JSSMS$Z80$$decMem$($offset$$) {
  this.writeMem($offset$$, this.dec8(this.readMem($offset$$)))
}, ccf:function $JSSMS$Z80$$ccf$() {
  0 != (this.f & F_CARRY) ? (this.f &= ~F_CARRY, this.f |= F_HALFCARRY) : (this.f |= F_CARRY, this.f &= ~F_HALFCARRY);
  this.f &= ~F_NEGATIVE
}, daa:function $JSSMS$Z80$$daa$() {
  var $temp$$ = this.DAA_TABLE[this.a | (this.f & F_CARRY) << 8 | (this.f & F_NEGATIVE) << 8 | (this.f & F_HALFCARRY) << 6];
  this.a = $temp$$ & 255;
  this.f = this.f & F_NEGATIVE | $temp$$ >> 8
}, doCB:function $JSSMS$Z80$$doCB$($opcode$$) {
  this.tstates -= OP_CB_STATES[$opcode$$];
  REFRESH_EMULATION && this.incR();
  switch($opcode$$) {
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
      this.l = this.srl(this.l);
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
      JSSMS.Utils.console.log("Unimplemented CB Opcode: " + JSSMS.Utils.toHex($opcode$$))
  }
}, rlc:function $JSSMS$Z80$$rlc$($value$$) {
  var $carry$$ = ($value$$ & 128) >> 7;
  $value$$ = ($value$$ << 1 | $value$$ >> 7) & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, rrc:function $JSSMS$Z80$$rrc$($value$$) {
  var $carry$$ = $value$$ & 1;
  $value$$ = ($value$$ >> 1 | $value$$ << 7) & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, rl:function $JSSMS$Z80$$rl$($value$$) {
  var $carry$$ = ($value$$ & 128) >> 7;
  $value$$ = ($value$$ << 1 | this.f & F_CARRY) & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, rr:function $JSSMS$Z80$$rr$($value$$) {
  var $carry$$ = $value$$ & 1;
  $value$$ = ($value$$ >> 1 | this.f << 7) & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, sla:function $JSSMS$Z80$$sla$($value$$) {
  var $carry$$ = ($value$$ & 128) >> 7;
  $value$$ = $value$$ << 1 & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, sll:function $JSSMS$Z80$$sll$($value$$) {
  var $carry$$ = ($value$$ & 128) >> 7;
  $value$$ = ($value$$ << 1 | 1) & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, sra:function $JSSMS$Z80$$sra$($value$$) {
  var $carry$$ = $value$$ & 1;
  $value$$ = $value$$ >> 1 | $value$$ & 128;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, srl:function $JSSMS$Z80$$srl$($value$$) {
  var $carry$$ = $value$$ & 1;
  $value$$ = $value$$ >> 1 & 255;
  this.f = $carry$$ | this.SZP_TABLE[$value$$];
  return $value$$
}, bit:function $JSSMS$Z80$$bit$($mask$$) {
  this.f = this.f & F_CARRY | this.SZ_BIT_TABLE[$mask$$]
}, doIndexOpIX:function $JSSMS$Z80$$doIndexOpIX$($opcode$$) {
  var $location$$22_temp$$ = 0, $location$$22_temp$$ = 0;
  this.tstates -= OP_DD_STATES[$opcode$$];
  REFRESH_EMULATION && this.incR();
  switch($opcode$$) {
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
      $location$$22_temp$$ = this.readMemWord(this.pc);
      this.writeMem($location$$22_temp$$++, this.ixL);
      this.writeMem($location$$22_temp$$, this.ixH);
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
      $location$$22_temp$$ = this.readMemWord(this.pc);
      this.ixL = this.readMem($location$$22_temp$$++);
      this.ixH = this.readMem($location$$22_temp$$);
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
      $location$$22_temp$$ = this.getIX();
      this.setIX(this.readMemWord(this.sp));
      this.writeMem(this.sp, $location$$22_temp$$ & 255);
      this.writeMem(this.sp + 1, $location$$22_temp$$ >> 8);
      break;
    case 229:
      this.push2(this.ixH, this.ixL);
      break;
    case 233:
      this.pc = this.getIX();
      break;
    case 249:
      this.sp = this.getIX();
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented DD/FD Opcode: " + JSSMS.Utils.toHex($opcode$$)), this.pc--
  }
}, doIndexOpIY:function $JSSMS$Z80$$doIndexOpIY$($location$$23_opcode$$3_temp$$) {
  this.tstates -= OP_DD_STATES[$location$$23_opcode$$3_temp$$];
  REFRESH_EMULATION && this.incR();
  switch($location$$23_opcode$$3_temp$$) {
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
      $location$$23_opcode$$3_temp$$ = this.readMemWord(this.pc);
      this.writeMem($location$$23_opcode$$3_temp$$++, this.iyL);
      this.writeMem($location$$23_opcode$$3_temp$$, this.iyH);
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
      $location$$23_opcode$$3_temp$$ = this.readMemWord(this.pc);
      this.iyL = this.readMem($location$$23_opcode$$3_temp$$++);
      this.iyH = this.readMem($location$$23_opcode$$3_temp$$);
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
      $location$$23_opcode$$3_temp$$ = this.getIY();
      this.setIY(this.readMemWord(this.sp));
      this.writeMem(this.sp, $location$$23_opcode$$3_temp$$ & 255);
      this.writeMem(this.sp + 1, $location$$23_opcode$$3_temp$$ >> 8);
      break;
    case 229:
      this.push2(this.iyH, this.iyL);
      break;
    case 233:
      this.pc = this.getIY();
      break;
    case 249:
      this.sp = this.getIY();
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented DD/FD Opcode: " + JSSMS.Utils.toHex($location$$23_opcode$$3_temp$$)), this.pc--
  }
}, doIndexCB:function $JSSMS$Z80$$doIndexCB$($index$$45_location$$) {
  $index$$45_location$$ = $index$$45_location$$ + this.d_() & 65535;
  var $opcode$$ = this.readMem(++this.pc);
  this.tstates -= OP_INDEX_CB_STATES[$opcode$$];
  switch($opcode$$) {
    case 0:
      this.b = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 1:
      this.c = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 2:
      this.d = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 3:
      this.e = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 4:
      this.h = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 5:
      this.l = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 6:
      this.writeMem($index$$45_location$$, this.rlc(this.readMem($index$$45_location$$)));
      break;
    case 7:
      this.a = this.rlc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 8:
      this.b = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 9:
      this.c = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 10:
      this.d = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 11:
      this.e = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 12:
      this.h = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 13:
      this.l = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 14:
      this.writeMem($index$$45_location$$, this.rrc(this.readMem($index$$45_location$$)));
      break;
    case 15:
      this.a = this.rrc(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 16:
      this.b = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 17:
      this.c = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 18:
      this.d = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 19:
      this.e = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 20:
      this.h = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 21:
      this.l = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 22:
      this.writeMem($index$$45_location$$, this.rl(this.readMem($index$$45_location$$)));
      break;
    case 23:
      this.a = this.rl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 24:
      this.b = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 25:
      this.c = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 26:
      this.d = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 27:
      this.e = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 28:
      this.h = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 29:
      this.l = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 30:
      this.writeMem($index$$45_location$$, this.rr(this.readMem($index$$45_location$$)));
      break;
    case 31:
      this.a = this.rr(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 32:
      this.b = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 33:
      this.c = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 34:
      this.d = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 35:
      this.e = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 36:
      this.h = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 37:
      this.l = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 38:
      this.writeMem($index$$45_location$$, this.sla(this.readMem($index$$45_location$$)));
      break;
    case 39:
      this.a = this.sla(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 40:
      this.b = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 41:
      this.c = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 42:
      this.d = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 43:
      this.e = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 44:
      this.h = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 45:
      this.l = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 46:
      this.writeMem($index$$45_location$$, this.sra(this.readMem($index$$45_location$$)));
      break;
    case 47:
      this.a = this.sra(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 48:
      this.b = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 49:
      this.c = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 50:
      this.d = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 51:
      this.e = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 52:
      this.h = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 53:
      this.l = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 54:
      this.writeMem($index$$45_location$$, this.sll(this.readMem($index$$45_location$$)));
      break;
    case 55:
      this.a = this.sll(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
      break;
    case 56:
      this.b = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.b);
      break;
    case 57:
      this.c = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.c);
      break;
    case 58:
      this.d = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.d);
      break;
    case 59:
      this.e = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.e);
      break;
    case 60:
      this.h = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.h);
      break;
    case 61:
      this.l = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.l);
      break;
    case 62:
      this.writeMem($index$$45_location$$, this.srl(this.readMem($index$$45_location$$)));
      break;
    case 63:
      this.a = this.srl(this.readMem($index$$45_location$$));
      this.writeMem($index$$45_location$$, this.a);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_0);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_1);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_2);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_3);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_4);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_5);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_6);
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
      this.bit(this.readMem($index$$45_location$$) & BIT_7);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_0);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_1);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_2);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_3);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_4);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_5);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_6);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) & ~BIT_7);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_0);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_1);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_2);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_3);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_4);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_5);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_6);
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
      this.writeMem($index$$45_location$$, this.readMem($index$$45_location$$) | BIT_7);
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented DDCB/FDCB Opcode: " + JSSMS.Utils.toHex($opcode$$))
  }
  this.pc++
}, doED:function $JSSMS$Z80$$doED$($opcode$$) {
  var $temp$$ = 0, $location$$ = 0;
  this.tstates -= OP_ED_STATES[$opcode$$];
  REFRESH_EMULATION && this.incR();
  switch($opcode$$) {
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
      $location$$ = this.readMemWord(++this.pc);
      this.writeMem($location$$++, this.c);
      this.writeMem($location$$, this.b);
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
      $temp$$ = this.a;
      this.a = 0;
      this.sub_a($temp$$);
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
      this.setBC(this.readMemWord(this.readMemWord(++this.pc)));
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
      $location$$ = this.readMemWord(++this.pc);
      this.writeMem($location$$++, this.e);
      this.writeMem($location$$, this.d);
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
      this.setDE(this.readMemWord(this.readMemWord(++this.pc)));
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
      $location$$ = this.readMemWord(++this.pc);
      this.writeMem($location$$++, this.l);
      this.writeMem($location$$, this.h);
      this.pc += 2;
      break;
    case 103:
      $location$$ = this.getHL();
      $temp$$ = this.readMem($location$$);
      this.writeMem($location$$, $temp$$ >> 4 | (this.a & 15) << 4);
      this.a = this.a & 240 | $temp$$ & 15;
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
      this.setHL(this.readMemWord(this.readMemWord(++this.pc)));
      this.pc += 2;
      break;
    case 111:
      $location$$ = this.getHL();
      $temp$$ = this.readMem($location$$);
      this.writeMem($location$$, ($temp$$ & 15) << 4 | this.a & 15);
      this.a = this.a & 240 | $temp$$ >> 4;
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
      $location$$ = this.readMemWord(++this.pc);
      this.writeMem($location$$++, this.sp & 255);
      this.writeMem($location$$, this.sp >> 8);
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
      this.sp = this.readMemWord(this.readMemWord(++this.pc));
      this.pc += 2;
      break;
    case 160:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.incDE();
      this.incHL();
      this.decBC();
      this.f = this.f & 193 | (0 != this.getBC() ? F_PARITY : 0);
      this.pc++;
      break;
    case 161:
      $temp$$ = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.incHL();
      this.decBC();
      $temp$$ |= 0 == this.getBC() ? 0 : F_PARITY;
      this.f = this.f & 248 | $temp$$;
      this.pc++;
      break;
    case 162:
      $temp$$ = this.port.in_(this.c);
      this.writeMem(this.getHL(), $temp$$);
      this.b = this.dec8(this.b);
      this.incHL();
      this.f = 128 == ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      this.pc++;
      break;
    case 163:
      $temp$$ = this.readMem(this.getHL());
      this.port.out(this.c, $temp$$);
      this.incHL();
      this.b = this.dec8(this.b);
      255 < this.l + $temp$$ ? (this.f |= F_CARRY, this.f |= F_HALFCARRY) : (this.f &= ~F_CARRY, this.f &= ~F_HALFCARRY);
      this.f = 128 == ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      this.pc++;
      break;
    case 168:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.decDE();
      this.decHL();
      this.decBC();
      this.f = this.f & 193 | (0 != this.getBC() ? F_PARITY : 0);
      this.pc++;
      break;
    case 169:
      $temp$$ = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.decHL();
      this.decBC();
      $temp$$ |= 0 == this.getBC() ? 0 : F_PARITY;
      this.f = this.f & 248 | $temp$$;
      this.pc++;
      break;
    case 170:
      $temp$$ = this.port.in_(this.c);
      this.writeMem(this.getHL(), $temp$$);
      this.b = this.dec8(this.b);
      this.decHL();
      this.f = 0 != ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      this.pc++;
      break;
    case 171:
      $temp$$ = this.readMem(this.getHL());
      this.port.out(this.c, $temp$$);
      this.decHL();
      this.b = this.dec8(this.b);
      255 < this.l + $temp$$ ? (this.f |= F_CARRY, this.f |= F_HALFCARRY) : (this.f &= ~F_CARRY, this.f &= ~F_HALFCARRY);
      this.f = 128 == ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      this.pc++;
      break;
    case 176:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.incDE();
      this.incHL();
      this.decBC();
      0 != this.getBC() ? (this.f |= F_PARITY, this.tstates -= 5, this.pc--) : (this.f &= ~F_PARITY, this.pc++);
      this.f &= ~F_NEGATIVE;
      this.f &= ~F_HALFCARRY;
      break;
    case 177:
      $temp$$ = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.incHL();
      this.decBC();
      $temp$$ |= 0 == this.getBC() ? 0 : F_PARITY;
      0 != ($temp$$ & F_PARITY) && 0 == (this.f & F_ZERO) ? (this.tstates -= 5, this.pc--) : this.pc++;
      this.f = this.f & 248 | $temp$$;
      break;
    case 178:
      $temp$$ = this.port.in_(this.c);
      this.writeMem(this.getHL(), $temp$$);
      this.b = this.dec8(this.b);
      this.incHL();
      0 != this.b ? (this.tstates -= 5, this.pc--) : this.pc++;
      this.f = 128 == ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      break;
    case 179:
      $temp$$ = this.readMem(this.getHL());
      this.port.out(this.c, $temp$$);
      this.b = this.dec8(this.b);
      this.incHL();
      0 != this.b ? (this.tstates -= 5, this.pc--) : this.pc++;
      255 < this.l + $temp$$ ? (this.f |= F_CARRY, this.f |= F_HALFCARRY) : (this.f &= ~F_CARRY, this.f &= ~F_HALFCARRY);
      this.f = 0 != ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      break;
    case 184:
      this.writeMem(this.getDE(), this.readMem(this.getHL()));
      this.decDE();
      this.decHL();
      this.decBC();
      0 != this.getBC() ? (this.f |= F_PARITY, this.tstates -= 5, this.pc--) : (this.f &= ~F_PARITY, this.pc++);
      this.f &= ~F_NEGATIVE;
      this.f &= ~F_HALFCARRY;
      break;
    case 185:
      $temp$$ = this.f & F_CARRY | F_NEGATIVE;
      this.cp_a(this.readMem(this.getHL()));
      this.decHL();
      this.decBC();
      $temp$$ |= 0 == this.getBC() ? 0 : F_PARITY;
      0 != ($temp$$ & F_PARITY) && 0 == (this.f & F_ZERO) ? (this.tstates -= 5, this.pc--) : this.pc++;
      this.f = this.f & 248 | $temp$$;
      break;
    case 186:
      $temp$$ = this.port.in_(this.c);
      this.writeMem(this.getHL(), $temp$$);
      this.b = this.dec8(this.b);
      this.decHL();
      0 != this.b ? (this.tstates -= 5, this.pc--) : this.pc++;
      this.f = 0 != ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      break;
    case 187:
      $temp$$ = this.readMem(this.getHL());
      this.port.out(this.c, $temp$$);
      this.b = this.dec8(this.b);
      this.decHL();
      0 != this.b ? (this.tstates -= 5, this.pc--) : this.pc++;
      255 < this.l + $temp$$ ? (this.f |= F_CARRY, this.f |= F_HALFCARRY) : (this.f &= ~F_CARRY, this.f &= ~F_HALFCARRY);
      this.f = 0 != ($temp$$ & 128) ? this.f | F_NEGATIVE : this.f & ~F_NEGATIVE;
      break;
    default:
      JSSMS.Utils.console.log("Unimplemented ED Opcode: " + JSSMS.Utils.toHex($opcode$$)), this.pc++
  }
}, generateDAATable:function $JSSMS$Z80$$generateDAATable$() {
  var $i$$, $c$$, $h$$, $n$$;
  for($i$$ = 256;$i$$--;) {
    for($c$$ = 0;1 >= $c$$;$c$$++) {
      for($h$$ = 0;1 >= $h$$;$h$$++) {
        for($n$$ = 0;1 >= $n$$;$n$$++) {
          this.DAA_TABLE[$c$$ << 8 | $n$$ << 9 | $h$$ << 10 | $i$$] = this.getDAAResult($i$$, $c$$ | $n$$ << 1 | $h$$ << 4)
        }
      }
    }
  }
  this.a = this.f = 0
}, getDAAResult:function $JSSMS$Z80$$getDAAResult$($value$$, $flags$$) {
  this.a = $value$$;
  this.f = $flags$$;
  var $a_copy$$ = this.a, $correction$$ = 0, $carry$$ = $flags$$ & F_CARRY, $carry_copy$$ = $carry$$;
  if(0 != ($flags$$ & F_HALFCARRY) || 9 < ($a_copy$$ & 15)) {
    $correction$$ |= 6
  }
  if(1 == $carry$$ || 159 < $a_copy$$ || 143 < $a_copy$$ && 9 < ($a_copy$$ & 15)) {
    $correction$$ |= 96, $carry_copy$$ = 1
  }
  153 < $a_copy$$ && ($carry_copy$$ = 1);
  0 != ($flags$$ & F_NEGATIVE) ? this.sub_a($correction$$) : this.add_a($correction$$);
  $flags$$ = this.f & 254 | $carry_copy$$;
  $flags$$ = this.getParity(this.a) ? $flags$$ & 251 | F_PARITY : $flags$$ & 251;
  return this.a | $flags$$ << 8
}, add_a:function $JSSMS$Z80$$add_a$($temp$$5_value$$) {
  $temp$$5_value$$ = this.a + $temp$$5_value$$ & 255;
  this.f = this.SZHVC_ADD_TABLE[this.a << 8 | $temp$$5_value$$];
  this.a = $temp$$5_value$$
}, adc_a:function $JSSMS$Z80$$adc_a$($temp$$6_value$$) {
  var $carry$$ = this.f & F_CARRY;
  $temp$$6_value$$ = this.a + $temp$$6_value$$ + $carry$$ & 255;
  this.f = this.SZHVC_ADD_TABLE[$carry$$ << 16 | this.a << 8 | $temp$$6_value$$];
  this.a = $temp$$6_value$$
}, sub_a:function $JSSMS$Z80$$sub_a$($temp$$7_value$$) {
  $temp$$7_value$$ = this.a - $temp$$7_value$$ & 255;
  this.f = this.SZHVC_SUB_TABLE[this.a << 8 | $temp$$7_value$$];
  this.a = $temp$$7_value$$
}, sbc_a:function $JSSMS$Z80$$sbc_a$($temp$$8_value$$) {
  var $carry$$ = this.f & F_CARRY;
  $temp$$8_value$$ = this.a - $temp$$8_value$$ - $carry$$ & 255;
  this.f = this.SZHVC_SUB_TABLE[$carry$$ << 16 | this.a << 8 | $temp$$8_value$$];
  this.a = $temp$$8_value$$
}, cp_a:function $JSSMS$Z80$$cp_a$($value$$) {
  this.f = this.SZHVC_SUB_TABLE[this.a << 8 | this.a - $value$$ & 255]
}, cpl_a:function $JSSMS$Z80$$cpl_a$() {
  this.a ^= 255;
  this.f |= F_NEGATIVE | F_HALFCARRY
}, rra_a:function $JSSMS$Z80$$rra_a$() {
  var $carry$$ = this.a & 1;
  this.a = (this.a >> 1 | (this.f & F_CARRY) << 7) & 255;
  this.f = this.f & 236 | $carry$$
}, rla_a:function $JSSMS$Z80$$rla_a$() {
  var $carry$$ = this.a >> 7;
  this.a = (this.a << 1 | this.f & F_CARRY) & 255;
  this.f = this.f & 236 | $carry$$
}, rlca_a:function $JSSMS$Z80$$rlca_a$() {
  var $carry$$ = this.a >> 7;
  this.a = this.a << 1 & 255 | $carry$$;
  this.f = this.f & 236 | $carry$$
}, rrca_a:function $JSSMS$Z80$$rrca_a$() {
  var $carry$$ = this.a & 1;
  this.a = this.a >> 1 | $carry$$ << 7;
  this.f = this.f & 236 | $carry$$
}, getBC:function $JSSMS$Z80$$getBC$() {
  return this.b << 8 | this.c
}, getDE:function $JSSMS$Z80$$getDE$() {
  return this.d << 8 | this.e
}, getHL:function $JSSMS$Z80$$getHL$() {
  return this.h << 8 | this.l
}, getIX:function $JSSMS$Z80$$getIX$() {
  return this.ixH << 8 | this.ixL
}, getIY:function $JSSMS$Z80$$getIY$() {
  return this.iyH << 8 | this.iyL
}, setBC:function $JSSMS$Z80$$setBC$($value$$) {
  this.b = $value$$ >> 8;
  this.c = $value$$ & 255
}, setDE:function $JSSMS$Z80$$setDE$($value$$) {
  this.d = $value$$ >> 8;
  this.e = $value$$ & 255
}, setHL:function $JSSMS$Z80$$setHL$($value$$) {
  this.h = $value$$ >> 8;
  this.l = $value$$ & 255
}, setAF:function $JSSMS$Z80$$setAF$($value$$) {
  this.a = $value$$ >> 8;
  this.f = $value$$ & 255
}, setIX:function $JSSMS$Z80$$setIX$($value$$) {
  this.ixH = $value$$ >> 8;
  this.ixL = $value$$ & 255
}, setIY:function $JSSMS$Z80$$setIY$($value$$) {
  this.iyH = $value$$ >> 8;
  this.iyL = $value$$ & 255
}, incBC:function $JSSMS$Z80$$incBC$() {
  this.c = this.c + 1 & 255;
  0 == this.c && (this.b = this.b + 1 & 255)
}, incDE:function $JSSMS$Z80$$incDE$() {
  this.e = this.e + 1 & 255;
  0 == this.e && (this.d = this.d + 1 & 255)
}, incHL:function $JSSMS$Z80$$incHL$() {
  this.l = this.l + 1 & 255;
  0 == this.l && (this.h = this.h + 1 & 255)
}, incIX:function $JSSMS$Z80$$incIX$() {
  this.ixL = this.ixL + 1 & 255;
  0 == this.ixL && (this.ixH = this.ixH + 1 & 255)
}, incIY:function $JSSMS$Z80$$incIY$() {
  this.iyL = this.iyL + 1 & 255;
  0 == this.iyL && (this.iyH = this.iyH + 1 & 255)
}, decBC:function $JSSMS$Z80$$decBC$() {
  this.c = this.c - 1 & 255;
  255 == this.c && (this.b = this.b - 1 & 255)
}, decDE:function $JSSMS$Z80$$decDE$() {
  this.e = this.e - 1 & 255;
  255 == this.e && (this.d = this.d - 1 & 255)
}, decHL:function $JSSMS$Z80$$decHL$() {
  this.l = this.l - 1 & 255;
  255 == this.l && (this.h = this.h - 1 & 255)
}, decIX:function $JSSMS$Z80$$decIX$() {
  this.ixL = this.ixL - 1 & 255;
  255 == this.ixL && (this.ixH = this.ixH - 1 & 255)
}, decIY:function $JSSMS$Z80$$decIY$() {
  this.iyL = this.iyL - 1 & 255;
  255 == this.iyL && (this.iyH = this.iyH - 1 & 255)
}, inc8:function $JSSMS$Z80$$inc8$($value$$) {
  $value$$ = $value$$ + 1 & 255;
  this.f = this.f & F_CARRY | this.SZHV_INC_TABLE[$value$$];
  return $value$$
}, dec8:function $JSSMS$Z80$$dec8$($value$$) {
  $value$$ = $value$$ - 1 & 255;
  this.f = this.f & F_CARRY | this.SZHV_DEC_TABLE[$value$$];
  return $value$$
}, exAF:function $JSSMS$Z80$$exAF$() {
  var $temp$$ = this.a;
  this.a = this.a2;
  this.a2 = $temp$$;
  $temp$$ = this.f;
  this.f = this.f2;
  this.f2 = $temp$$
}, exBC:function $JSSMS$Z80$$exBC$() {
  var $temp$$ = this.b;
  this.b = this.b2;
  this.b2 = $temp$$;
  $temp$$ = this.c;
  this.c = this.c2;
  this.c2 = $temp$$
}, exDE:function $JSSMS$Z80$$exDE$() {
  var $temp$$ = this.d;
  this.d = this.d2;
  this.d2 = $temp$$;
  $temp$$ = this.e;
  this.e = this.e2;
  this.e2 = $temp$$
}, exHL:function $JSSMS$Z80$$exHL$() {
  var $temp$$ = this.h;
  this.h = this.h2;
  this.h2 = $temp$$;
  $temp$$ = this.l;
  this.l = this.l2;
  this.l2 = $temp$$
}, add16:function $JSSMS$Z80$$add16$($reg$$, $value$$) {
  var $result$$ = $reg$$ + $value$$;
  this.f = this.f & 196 | ($reg$$ ^ $result$$ ^ $value$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}, adc16:function $JSSMS$Z80$$adc16$($value$$) {
  var $hl$$ = this.getHL(), $result$$ = $hl$$ + $value$$ + (this.f & F_CARRY);
  this.f = ($hl$$ ^ $result$$ ^ $value$$) >> 8 & 16 | $result$$ >> 16 & 1 | $result$$ >> 8 & 128 | (0 != ($result$$ & 65535) ? 0 : 64) | (($value$$ ^ $hl$$ ^ 32768) & ($value$$ ^ $result$$) & 32768) >> 13;
  this.h = $result$$ >> 8 & 255;
  this.l = $result$$ & 255
}, sbc16:function $JSSMS$Z80$$sbc16$($value$$) {
  var $hl$$ = this.getHL(), $result$$ = $hl$$ - $value$$ - (this.f & F_CARRY);
  this.f = ($hl$$ ^ $result$$ ^ $value$$) >> 8 & 16 | 2 | $result$$ >> 16 & 1 | $result$$ >> 8 & 128 | (0 != ($result$$ & 65535) ? 0 : 64) | (($value$$ ^ $hl$$) & ($hl$$ ^ $result$$) & 32768) >> 13;
  this.h = $result$$ >> 8 & 255;
  this.l = $result$$ & 255
}, incR:function $JSSMS$Z80$$incR$() {
  this.r = this.r & 128 | this.r + 1 & 127
}, generateFlagTables:function $JSSMS$Z80$$generateFlagTables$() {
  var $i$$, $padc_sf$$, $psub_zf$$, $psbc_yf$$, $val_xf$$, $oldval_pf$$, $newval$$;
  for($i$$ = 0;256 > $i$$;$i$$++) {
    $padc_sf$$ = 0 != ($i$$ & 128) ? F_SIGN : 0, $psub_zf$$ = 0 == $i$$ ? F_ZERO : 0, $psbc_yf$$ = $i$$ & 32, $val_xf$$ = $i$$ & 8, $oldval_pf$$ = this.getParity($i$$) ? F_PARITY : 0, this.SZ_TABLE[$i$$] = $padc_sf$$ | $psub_zf$$ | $psbc_yf$$ | $val_xf$$, this.SZP_TABLE[$i$$] = $padc_sf$$ | $psub_zf$$ | $psbc_yf$$ | $val_xf$$ | $oldval_pf$$, this.SZHV_INC_TABLE[$i$$] = $padc_sf$$ | $psub_zf$$ | $psbc_yf$$ | $val_xf$$, this.SZHV_INC_TABLE[$i$$] |= 128 == $i$$ ? F_OVERFLOW : 0, this.SZHV_INC_TABLE[$i$$] |= 
    0 == ($i$$ & 15) ? F_HALFCARRY : 0, this.SZHV_DEC_TABLE[$i$$] = $padc_sf$$ | $psub_zf$$ | $psbc_yf$$ | $val_xf$$ | F_NEGATIVE, this.SZHV_DEC_TABLE[$i$$] |= 127 == $i$$ ? F_OVERFLOW : 0, this.SZHV_DEC_TABLE[$i$$] |= 15 == ($i$$ & 15) ? F_HALFCARRY : 0, this.SZ_BIT_TABLE[$i$$] = 0 != $i$$ ? $i$$ & 128 : F_ZERO | F_PARITY, this.SZ_BIT_TABLE[$i$$] |= $psbc_yf$$ | $val_xf$$ | F_HALFCARRY
  }
  $i$$ = 0;
  $padc_sf$$ = 65536;
  $psub_zf$$ = 0;
  $psbc_yf$$ = 65536;
  for($oldval_pf$$ = 0;256 > $oldval_pf$$;$oldval_pf$$++) {
    for($newval$$ = 0;256 > $newval$$;$newval$$++) {
      $val_xf$$ = $newval$$ - $oldval_pf$$, this.SZHVC_ADD_TABLE[$i$$] = 0 != $newval$$ ? 0 != ($newval$$ & 128) ? F_SIGN : 0 : F_ZERO, this.SZHVC_ADD_TABLE[$i$$] |= $newval$$ & (F_BIT5 | F_BIT3), ($newval$$ & 15) < ($oldval_pf$$ & 15) && (this.SZHVC_ADD_TABLE[$i$$] |= F_HALFCARRY), $newval$$ < $oldval_pf$$ && (this.SZHVC_ADD_TABLE[$i$$] |= F_CARRY), 0 != (($val_xf$$ ^ $oldval_pf$$ ^ 128) & ($val_xf$$ ^ $newval$$) & 128) && (this.SZHVC_ADD_TABLE[$i$$] |= F_OVERFLOW), $i$$++, $val_xf$$ = $newval$$ - 
      $oldval_pf$$ - 1, this.SZHVC_ADD_TABLE[$padc_sf$$] = 0 != $newval$$ ? 0 != ($newval$$ & 128) ? F_SIGN : 0 : F_ZERO, this.SZHVC_ADD_TABLE[$padc_sf$$] |= $newval$$ & (F_BIT5 | F_BIT3), ($newval$$ & 15) <= ($oldval_pf$$ & 15) && (this.SZHVC_ADD_TABLE[$padc_sf$$] |= F_HALFCARRY), $newval$$ <= $oldval_pf$$ && (this.SZHVC_ADD_TABLE[$padc_sf$$] |= F_CARRY), 0 != (($val_xf$$ ^ $oldval_pf$$ ^ 128) & ($val_xf$$ ^ $newval$$) & 128) && (this.SZHVC_ADD_TABLE[$padc_sf$$] |= F_OVERFLOW), $padc_sf$$++, $val_xf$$ = 
      $oldval_pf$$ - $newval$$, this.SZHVC_SUB_TABLE[$psub_zf$$] = 0 != $newval$$ ? 0 != ($newval$$ & 128) ? F_NEGATIVE | F_SIGN : F_NEGATIVE : F_NEGATIVE | F_ZERO, this.SZHVC_SUB_TABLE[$psub_zf$$] |= $newval$$ & (F_BIT5 | F_BIT3), ($newval$$ & 15) > ($oldval_pf$$ & 15) && (this.SZHVC_SUB_TABLE[$psub_zf$$] |= F_HALFCARRY), $newval$$ > $oldval_pf$$ && (this.SZHVC_SUB_TABLE[$psub_zf$$] |= F_CARRY), 0 != (($val_xf$$ ^ $oldval_pf$$) & ($oldval_pf$$ ^ $newval$$) & 128) && (this.SZHVC_SUB_TABLE[$psub_zf$$] |= 
      F_OVERFLOW), $psub_zf$$++, $val_xf$$ = $oldval_pf$$ - $newval$$ - 1, this.SZHVC_SUB_TABLE[$psbc_yf$$] = 0 != $newval$$ ? 0 != ($newval$$ & 128) ? F_NEGATIVE | F_SIGN : F_NEGATIVE : F_NEGATIVE | F_ZERO, this.SZHVC_SUB_TABLE[$psbc_yf$$] |= $newval$$ & (F_BIT5 | F_BIT3), ($newval$$ & 15) >= ($oldval_pf$$ & 15) && (this.SZHVC_SUB_TABLE[$psbc_yf$$] |= F_HALFCARRY), $newval$$ >= $oldval_pf$$ && (this.SZHVC_SUB_TABLE[$psbc_yf$$] |= F_CARRY), 0 != (($val_xf$$ ^ $oldval_pf$$) & ($oldval_pf$$ ^ $newval$$) & 
      128) && (this.SZHVC_SUB_TABLE[$psbc_yf$$] |= F_OVERFLOW), $psbc_yf$$++
    }
  }
}, getParity:function $JSSMS$Z80$$getParity$($value$$) {
  var $parity$$ = !0, $j$$;
  for($j$$ = 0;8 > $j$$;$j$$++) {
    0 != ($value$$ & 1 << $j$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}, generateMemory:function $JSSMS$Z80$$generateMemory$() {
  if(SUPPORT_DATAVIEW) {
    for(var $i$$ = 0;8192 > $i$$;$i$$++) {
      this.memWriteMap.setUint8($i$$, 0)
    }
  }else {
    for($i$$ = 0;8192 > $i$$;$i$$++) {
      this.memWriteMap[$i$$] = 0
    }
  }
  if(SUPPORT_DATAVIEW) {
    for($i$$ = 0;32768 > $i$$;$i$$++) {
      this.sram.setUint8($i$$, 0)
    }
  }else {
    for($i$$ = 0;32768 > $i$$;$i$$++) {
      this.sram[$i$$] = 0
    }
  }
  this.useSRAM = !1;
  this.number_of_pages = 2;
  for($i$$ = 0;4 > $i$$;$i$$++) {
    this.frameReg[$i$$] = $i$$ % 3
  }
}, resetMemory:function $JSSMS$Z80$$resetMemory$($pages$$) {
  var $i$$ = 0;
  $pages$$ && (this.rom = $pages$$);
  if(this.rom.length) {
    this.number_of_pages = this.rom.length;
    this.romPageMask = this.number_of_pages - 1;
    for($i$$ = 0;3 > $i$$;$i$$++) {
      this.frameReg[$i$$] = $i$$ % this.number_of_pages
    }
    this.frameReg[3] = 0;
    if(ENABLE_COMPILER) {
      this.branches = Array(this.number_of_pages);
      for($i$$ = 0;$i$$ < this.number_of_pages;$i$$++) {
        this.branches[$i$$] = Object.create(null)
      }
      this.recompiler.setRom(this.rom)
    }
  }else {
    this.romPageMask = this.number_of_pages = 0
  }
}, d_:function $JSSMS$Z80$$d_$() {
  return this.readMem(this.pc)
}, writeMem:function() {
  return SUPPORT_DATAVIEW ? function($address$$, $value$$) {
    if(65535 >= $address$$) {
      this.memWriteMap.setInt8($address$$ & 8191, $value$$), 65532 == $address$$ ? this.frameReg[3] = $value$$ : 65533 == $address$$ ? this.frameReg[0] = $value$$ & this.romPageMask : 65534 == $address$$ ? this.frameReg[1] = $value$$ & this.romPageMask : 65535 == $address$$ && (this.frameReg[2] = $value$$ & this.romPageMask)
    }else {
      if(JSSMS.Utils.console.error(JSSMS.Utils.toHex($address$$), JSSMS.Utils.toHex($address$$ & 8191)), DEBUG) {
        debugger
      }
    }
  } : function($address$$, $value$$) {
    if(65535 >= $address$$) {
      this.memWriteMap[$address$$ & 8191] = $value$$, 65532 == $address$$ ? this.frameReg[3] = $value$$ : 65533 == $address$$ ? this.frameReg[0] = $value$$ & this.romPageMask : 65534 == $address$$ ? this.frameReg[1] = $value$$ & this.romPageMask : 65535 == $address$$ && (this.frameReg[2] = $value$$ & this.romPageMask)
    }else {
      if(JSSMS.Utils.console.error(JSSMS.Utils.toHex($address$$), JSSMS.Utils.toHex($address$$ & 8191)), DEBUG) {
        debugger
      }
    }
  }
}(), readMem:function() {
  return SUPPORT_DATAVIEW ? function($address$$) {
    if(1024 > $address$$) {
      return this.rom[0].getUint8($address$$)
    }
    if(16384 > $address$$) {
      return this.rom[this.frameReg[0]].getUint8($address$$)
    }
    if(32768 > $address$$) {
      return this.rom[this.frameReg[1]].getUint8($address$$ - 16384)
    }
    if(49152 > $address$$) {
      return 8 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram.getUint8($address$$ - 32768)) : 12 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram.getUint8($address$$ - 16384)) : this.rom[this.frameReg[2]].getUint8($address$$ - 32768)
    }
    if(57344 > $address$$) {
      return this.memWriteMap.getUint8($address$$ - 49152)
    }
    if(65532 > $address$$) {
      return this.memWriteMap.getUint8($address$$ - 57344)
    }
    if(65532 == $address$$) {
      return this.frameReg[3]
    }
    if(65533 == $address$$) {
      return this.frameReg[0]
    }
    if(65534 == $address$$) {
      return this.frameReg[1]
    }
    if(65535 == $address$$) {
      return this.frameReg[2]
    }
    JSSMS.Utils.console.error(JSSMS.Utils.toHex($address$$));
    if(DEBUG) {
      debugger
    }
    return 0
  } : function($address$$) {
    if(1024 > $address$$) {
      return this.rom[0][$address$$]
    }
    if(16384 > $address$$) {
      return this.rom[this.frameReg[0]][$address$$]
    }
    if(32768 > $address$$) {
      return this.rom[this.frameReg[1]][$address$$ - 16384]
    }
    if(49152 > $address$$) {
      return 8 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram[$address$$ - 32768]) : 12 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram[$address$$ - 16384]) : this.rom[this.frameReg[2]][$address$$ - 32768]
    }
    if(57344 > $address$$) {
      return this.memWriteMap[$address$$ - 49152]
    }
    if(65532 > $address$$) {
      return this.memWriteMap[$address$$ - 57344]
    }
    if(65532 == $address$$) {
      return this.frameReg[3]
    }
    if(65533 == $address$$) {
      return this.frameReg[0]
    }
    if(65534 == $address$$) {
      return this.frameReg[1]
    }
    if(65535 == $address$$) {
      return this.frameReg[2]
    }
    JSSMS.Utils.console.error(JSSMS.Utils.toHex($address$$));
    if(DEBUG) {
      debugger
    }
    return 0
  }
}(), readMemWord:function() {
  return SUPPORT_DATAVIEW ? function($address$$) {
    if(1024 > $address$$) {
      return this.rom[0].getUint16($address$$, LITTLE_ENDIAN)
    }
    if(16384 > $address$$) {
      return this.rom[this.frameReg[0]].getUint16($address$$, LITTLE_ENDIAN)
    }
    if(32768 > $address$$) {
      return this.rom[this.frameReg[1]].getUint16($address$$ - 16384, LITTLE_ENDIAN)
    }
    if(49152 > $address$$) {
      return 8 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram[$address$$ - 32768]) : 12 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram[$address$$ - 16384]) : this.rom[this.frameReg[2]].getUint16($address$$ - 32768, LITTLE_ENDIAN)
    }
    if(57344 > $address$$) {
      return this.memWriteMap.getUint16($address$$ - 49152, LITTLE_ENDIAN)
    }
    if(65532 > $address$$) {
      return this.memWriteMap.getUint16($address$$ - 57344, LITTLE_ENDIAN)
    }
    if(65532 == $address$$) {
      return this.frameReg[3]
    }
    if(65533 == $address$$) {
      return this.frameReg[0]
    }
    if(65534 == $address$$) {
      return this.frameReg[1]
    }
    if(65535 == $address$$) {
      return this.frameReg[2]
    }
    JSSMS.Utils.console.error(JSSMS.Utils.toHex($address$$));
    if(DEBUG) {
      debugger
    }
    return 0
  } : function($address$$) {
    if(1024 > $address$$) {
      return this.rom[0][$address$$] | this.rom[0][++$address$$] << 8
    }
    if(16384 > $address$$) {
      return this.rom[this.frameReg[0]][$address$$] | this.rom[this.frameReg[0]][++$address$$] << 8
    }
    if(32768 > $address$$) {
      return this.rom[this.frameReg[1]][$address$$ - 16384] | this.rom[this.frameReg[1]][++$address$$ - 16384] << 8
    }
    if(49152 > $address$$) {
      return 8 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram[$address$$ - 32768] | this.sram[++$address$$ - 32768] << 8) : 12 == (this.frameReg[3] & 12) ? (this.useSRAM = !0, this.sram[$address$$ - 16384] | this.sram[++$address$$ - 16384] << 8) : this.rom[this.frameReg[2]][$address$$ - 32768] | this.rom[this.frameReg[2]][++$address$$ - 32768] << 8
    }
    if(57344 > $address$$) {
      return this.memWriteMap[$address$$ - 49152] | this.memWriteMap[++$address$$ - 49152] << 8
    }
    if(65532 > $address$$) {
      return this.memWriteMap[$address$$ - 57344] | this.memWriteMap[++$address$$ - 57344] << 8
    }
    if(65532 == $address$$) {
      return this.frameReg[3]
    }
    if(65533 == $address$$) {
      return this.frameReg[0]
    }
    if(65534 == $address$$) {
      return this.frameReg[1]
    }
    if(65535 == $address$$) {
      return this.frameReg[2]
    }
    JSSMS.Utils.console.error(JSSMS.Utils.toHex($address$$));
    if(DEBUG) {
      debugger
    }
    return 0
  }
}(), hasUsedSRAM:function $JSSMS$Z80$$hasUsedSRAM$() {
  return this.useSRAM
}, setSRAM:function $JSSMS$Z80$$setSRAM$($bytes$$) {
  var $length$$ = $bytes$$.length / PAGE_SIZE, $i$$;
  for($i$$ = 0;$i$$ < $length$$;$i$$++) {
    JSSMS.Utils.copyArrayElements($bytes$$, $i$$ * PAGE_SIZE, this.sram[$i$$], 0, PAGE_SIZE)
  }
}, setStateMem:function $JSSMS$Z80$$setStateMem$($state$$) {
  this.frameReg = $state$$
}, getState:function $JSSMS$Z80$$getState$() {
  var $state$$ = Array(8);
  $state$$[0] = this.pc | this.sp << 16;
  $state$$[1] = (this.iff1 ? 1 : 0) | (this.iff2 ? 2 : 0) | (this.halt ? 4 : 0) | (this.EI_inst ? 8 : 0) | (this.interruptLine ? 16 : 0);
  $state$$[2] = this.a | this.a2 << 8 | this.f << 16 | this.f2 << 24;
  $state$$[3] = this.getBC() | this.getDE() << 16;
  $state$$[4] = this.getHL() | this.r << 16 | this.i << 24;
  $state$$[5] = this.getIX() | this.getIY() << 16;
  this.exBC();
  this.exDE();
  this.exHL();
  $state$$[6] = this.getBC() | this.getDE() << 16;
  $state$$[7] = this.getHL() | this.im << 16 | this.interruptVector << 24;
  this.exBC();
  this.exDE();
  this.exHL();
  return $state$$
}, setState:function $JSSMS$Z80$$setState$($state$$) {
  var $temp$$ = $state$$[0];
  this.pc = $temp$$ & 65535;
  this.sp = $temp$$ >> 16 & 65535;
  $temp$$ = $state$$[1];
  this.iff1 = 0 != ($temp$$ & 1);
  this.iff2 = 0 != ($temp$$ & 2);
  this.halt = 0 != ($temp$$ & 4);
  this.EI_inst = 0 != ($temp$$ & 8);
  this.interruptLine = 0 != ($temp$$ & 16);
  $temp$$ = $state$$[2];
  this.a = $temp$$ & 255;
  this.a2 = $temp$$ >> 8 & 255;
  this.f = $temp$$ >> 16 & 255;
  this.f2 = $temp$$ >> 24 & 255;
  $temp$$ = $state$$[3];
  this.setBC($temp$$ & 65535);
  this.setDE($temp$$ >> 16 & 65535);
  $temp$$ = $state$$[4];
  this.setHL($temp$$ & 65535);
  this.r = $temp$$ >> 16 & 255;
  this.i = $temp$$ >> 24 & 255;
  $temp$$ = $state$$[5];
  this.setIX($temp$$ & 65535);
  this.setIY($temp$$ >> 16 & 65535);
  this.exBC();
  this.exDE();
  this.exHL();
  $temp$$ = $state$$[6];
  this.setBC($temp$$ & 65535);
  this.setDE($temp$$ >> 16 & 65535);
  $temp$$ = $state$$[7];
  this.setHL($temp$$ & 65535);
  this.im = $temp$$ >> 16 & 255;
  this.interruptVector = $temp$$ >> 24 & 255;
  this.exBC();
  this.exDE();
  this.exHL()
}};
JSSMS.Debugger = function $JSSMS$Debugger$() {
};
JSSMS.Debugger.prototype = {instructions:[], resetDebug:function $JSSMS$Debugger$$resetDebug$() {
  this.instructions = [];
  this.main.ui.updateStatus("Parsing instructions...");
  this.parseInstructions();
  this.main.ui.updateStatus("Instructions parsed")
}, parseInstructions:function $JSSMS$Debugger$$parseInstructions$() {
  JSSMS.Utils.console.time("Instructions parsing");
  var $romSize$$ = PAGE_SIZE * this.rom.length, $instruction$$, $currentAddress$$, $i$$ = 0, $addresses$$ = [], $entryPoints$$ = [0, 56, 102];
  for($entryPoints$$.forEach(function($entryPoint$$) {
    $addresses$$.push($entryPoint$$)
  });$addresses$$.length;) {
    $currentAddress$$ = $addresses$$.shift(), this.instructions[$currentAddress$$] || ($currentAddress$$ >= $romSize$$ || 65 <= $currentAddress$$ >> 10 ? JSSMS.Utils.console.log("Invalid address", JSSMS.Utils.toHex($currentAddress$$)) : ($instruction$$ = this.disassemble($currentAddress$$), this.instructions[$currentAddress$$] = $instruction$$, null != $instruction$$.nextAddress && $addresses$$.push($instruction$$.nextAddress), null != $instruction$$.target && $addresses$$.push($instruction$$.target)))
  }
  for($entryPoints$$.forEach(function($entryPoint$$) {
    this.instructions[$entryPoint$$] && (this.instructions[$entryPoint$$].isJumpTarget = !0)
  }, this);$i$$ < $romSize$$;$i$$++) {
    this.instructions[$i$$] && (null != this.instructions[$i$$].nextAddress && this.instructions[this.instructions[$i$$].nextAddress] && this.instructions[this.instructions[$i$$].nextAddress].jumpTargetNb++, null != this.instructions[$i$$].target && (this.instructions[this.instructions[$i$$].target] ? (this.instructions[this.instructions[$i$$].target].isJumpTarget = !0, this.instructions[this.instructions[$i$$].target].jumpTargetNb++) : JSSMS.Utils.console.log("Invalid target address", JSSMS.Utils.toHex(this.instructions[$i$$].target))))
  }
  JSSMS.Utils.console.timeEnd("Instructions parsing")
}, writeGraphViz:function $JSSMS$Debugger$$writeGraphViz$() {
  JSSMS.Utils.console.time("DOT generation");
  for(var $tree$$ = this.instructions, $content$$ = ["digraph G {"], $i$$ = 0, $length$$ = $tree$$.length;$i$$ < $length$$;$i$$++) {
    $tree$$[$i$$] && ($content$$.push(" " + $i$$ + ' [label="' + $tree$$[$i$$].label + '"];'), null != $tree$$[$i$$].target && $content$$.push(" " + $i$$ + " -> " + $tree$$[$i$$].target + ";"), null != $tree$$[$i$$].nextAddress && $content$$.push(" " + $i$$ + " -> " + $tree$$[$i$$].nextAddress + ";"))
  }
  $content$$.push("}");
  $content$$ = $content$$.join("\n");
  $content$$ = $content$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  JSSMS.Utils.console.timeEnd("DOT generation");
  return $content$$
}, writeJavaScript:function $JSSMS$Debugger$$writeJavaScript$() {
  function $getTotalTStates$$($opcodes$$) {
    var $tstates$$ = 0;
    switch($opcodes$$[0]) {
      case 203:
        $tstates$$ = OP_CB_STATES[$opcodes$$[1]];
        break;
      case 221:
      ;
      case 253:
        $tstates$$ = 2 == $opcodes$$.length ? OP_DD_STATES[$opcodes$$[1]] : OP_INDEX_CB_STATES[$opcodes$$[2]];
        break;
      case 237:
        $tstates$$ = OP_ED_STATES[$opcodes$$[1]];
        break;
      default:
        $tstates$$ = OP_STATES[$opcodes$$[0]]
    }
    return $tstates$$
  }
  function $insertTStates$$() {
    $tstates$$ && $code$$.push("this.tstates -= " + $toHex$$($tstates$$) + ";");
    $tstates$$ = 0
  }
  JSSMS.Utils.console.time("JavaScript generation");
  for(var $tree$$ = this.instructions, $toHex$$ = JSSMS.Utils.toHex, $tstates$$ = 0, $prevAddress$$ = 0, $prevNextAddress$$ = 0, $breakNeeded$$ = !1, $pageBreakPoint$$ = 1024, $pageNumber$$ = 0, $i$$ = 0, $length$$ = 0, $code$$ = ['"": {', '"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'], $i$$ = 0, $length$$ = $tree$$.length;$i$$ < $length$$;$i$$++) {
    if($tree$$[$i$$]) {
      $prevAddress$$ <= $pageBreakPoint$$ && $tree$$[$i$$].address >= $pageBreakPoint$$ && ($code$$.push("this.pc = " + $toHex$$($tree$$[$i$$].address) + ";"), $code$$.push("}"), $code$$.push("},"), $code$$.push("" + $pageNumber$$ + ": {"), $code$$.push('"": function() {'), $code$$.push('throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'), $breakNeeded$$ = !0, $pageNumber$$++, $pageBreakPoint$$ = $pageNumber$$ * PAGE_SIZE);
      if($tree$$[$i$$].isJumpTarget || $prevNextAddress$$ != $tree$$[$i$$].address || $breakNeeded$$) {
        $insertTStates$$(), $prevNextAddress$$ && !$breakNeeded$$ && $code$$.push("this.pc = " + $toHex$$($prevNextAddress$$) + ";"), $code$$.push("},"), $code$$.push("" + $toHex$$($tree$$[$i$$].address) + ": function(temp, location) {")
      }
      $code$$.push("// " + $tree$$[$i$$].label);
      $breakNeeded$$ = "return;" == $tree$$[$i$$].code.substr(-7);
      $tstates$$ += $getTotalTStates$$($tree$$[$i$$].opcodes);
      (/return;/.test($tree$$[$i$$].code) || /this\.tstates/.test($tree$$[$i$$].code)) && $insertTStates$$();
      "" != $tree$$[$i$$].code && $code$$.push($tree$$[$i$$].code);
      $prevAddress$$ = $tree$$[$i$$].address;
      $prevNextAddress$$ = $tree$$[$i$$].nextAddress
    }
  }
  $code$$.push("}");
  $code$$.push("}");
  $code$$ = $code$$.join("\n");
  JSSMS.Utils.console.timeEnd("JavaScript generation");
  return $code$$
}, disassemble:function $JSSMS$Debugger$$disassemble$($address$$) {
  var $toHex$$ = JSSMS.Utils.toHex, $opcode$$ = this.readRom8bit($address$$), $opcodesArray$$ = [$opcode$$], $inst$$ = "Unknown Opcode", $currAddr$$ = $address$$, $target$$ = null, $code$$ = 'throw "Unimplemented opcode ' + $toHex$$($opcode$$) + '";', $_inst_operand$$ = "", $location$$ = 0;
  $address$$++;
  $_inst_operand$$ = {};
  switch($opcode$$) {
    case 0:
      $inst$$ = "NOP";
      $code$$ = "";
      break;
    case 1:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD BC," + $_inst_operand$$;
      $code$$ = "this.setBC(" + $_inst_operand$$ + ");";
      $address$$ += 2;
      break;
    case 2:
      $inst$$ = "LD (BC),A";
      $code$$ = "this.writeMem(this.getBC(), this.a);";
      break;
    case 3:
      $inst$$ = "INC BC";
      $code$$ = "this.incBC();";
      break;
    case 4:
      $inst$$ = "INC B";
      $code$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $inst$$ = "DEC B";
      $code$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD B," + $_inst_operand$$;
      $code$$ = "this.b = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 7:
      $inst$$ = "RLCA";
      $code$$ = "this.rlca_a();";
      break;
    case 8:
      $inst$$ = "EX AF AF'";
      $code$$ = "this.exAF();";
      break;
    case 9:
      $inst$$ = "ADD HL,BC";
      $code$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $inst$$ = "LD A,(BC)";
      $code$$ = "this.a = this.readMem(this.getBC());";
      break;
    case 11:
      $inst$$ = "DEC BC";
      $code$$ = "this.decBC();";
      break;
    case 12:
      $inst$$ = "INC C";
      $code$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $inst$$ = "DEC C";
      $code$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD C," + $_inst_operand$$;
      $code$$ = "this.c = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 15:
      $inst$$ = "RRCA";
      $code$$ = "this.rrca_a();";
      break;
    case 16:
      $target$$ = $address$$ + this.signExtend(this.readRom8bit($address$$) + 1);
      $inst$$ = "DJNZ (" + $toHex$$($target$$) + ")";
      $code$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b != 0x00) {this.tstates -= 0x05;this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$++;
      break;
    case 17:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD DE," + $_inst_operand$$;
      $code$$ = "this.setDE(" + $_inst_operand$$ + ");";
      $address$$ += 2;
      break;
    case 18:
      $inst$$ = "LD (DE),A";
      $code$$ = "this.writeMem(this.getDE(), this.a);";
      break;
    case 19:
      $inst$$ = "INC DE";
      $code$$ = "this.incDE();";
      break;
    case 20:
      $inst$$ = "INC D";
      $code$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $inst$$ = "DEC D";
      $code$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD D," + $_inst_operand$$;
      $code$$ = "this.d = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 23:
      $inst$$ = "RLA";
      $code$$ = "this.rla_a();";
      break;
    case 24:
      $target$$ = $address$$ + this.signExtend(this.readRom8bit($address$$) + 1);
      $inst$$ = "JR (" + $toHex$$($target$$) + ")";
      $code$$ = "this.pc = " + $toHex$$($target$$) + "; return;";
      $address$$ = null;
      break;
    case 25:
      $inst$$ = "ADD HL,DE";
      $code$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $inst$$ = "LD A,(DE)";
      $code$$ = "this.a = this.readMem(this.getDE());";
      break;
    case 27:
      $inst$$ = "DEC DE";
      $code$$ = "this.decDE();";
      break;
    case 28:
      $inst$$ = "INC E";
      $code$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $inst$$ = "DEC E";
      $code$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD E," + $_inst_operand$$;
      $code$$ = "this.e = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 31:
      $inst$$ = "RRA";
      $code$$ = "this.rra_a();";
      break;
    case 32:
      $target$$ = $address$$ + this.signExtend(this.readRom8bit($address$$) + 1);
      $inst$$ = "JR NZ,(" + $toHex$$($target$$) + ")";
      $code$$ = "if (!((this.f & F_ZERO) != 0x00)) {this.tstates -= 0x05;this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$++;
      break;
    case 33:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD HL," + $_inst_operand$$;
      $code$$ = "this.setHL(" + $_inst_operand$$ + ");";
      $address$$ += 2;
      break;
    case 34:
      $location$$ = this.readRom16bit($address$$);
      $_inst_operand$$ = $toHex$$($location$$);
      $inst$$ = "LD (" + $_inst_operand$$ + "),HL";
      $code$$ = "this.writeMem(" + $_inst_operand$$ + ", this.l);this.writeMem(" + $toHex$$($location$$ + 1) + ", this.h);";
      $address$$ += 2;
      break;
    case 35:
      $inst$$ = "INC HL";
      $code$$ = "this.incHL();";
      break;
    case 36:
      $inst$$ = "INC H";
      $code$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $inst$$ = "DEC H";
      $code$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD H," + $_inst_operand$$;
      $code$$ = "this.h = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 39:
      $inst$$ = "DAA";
      $code$$ = "this.daa();";
      break;
    case 40:
      $target$$ = $address$$ + this.signExtend(this.readRom8bit($address$$) + 1);
      $inst$$ = "JR Z,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x05;this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$++;
      break;
    case 41:
      $inst$$ = "ADD HL,HL";
      $code$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD HL,(" + $_inst_operand$$ + ")";
      $code$$ = "this.setHL(this.readMemWord(" + $_inst_operand$$ + "));";
      $address$$ += 2;
      break;
    case 43:
      $inst$$ = "DEC HL";
      $code$$ = "this.decHL();";
      break;
    case 44:
      $inst$$ = "INC L";
      $code$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $inst$$ = "DEC L";
      $code$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD L," + $_inst_operand$$;
      $code$$ = "this.l = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 47:
      $inst$$ = "CPL";
      $code$$ = "this.cpl_a();";
      break;
    case 48:
      $target$$ = $address$$ + this.signExtend(this.readRom8bit($address$$) + 1);
      $inst$$ = "JR NC,(" + $toHex$$($target$$) + ")";
      $code$$ = "if (!((this.f & F_CARRY) != 0x00)) {this.tstates -= 0x05;this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$++;
      break;
    case 49:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD SP," + $_inst_operand$$;
      $code$$ = "this.sp = " + $_inst_operand$$ + ";";
      $address$$ += 2;
      break;
    case 50:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD (" + $_inst_operand$$ + "),A";
      $code$$ = "this.writeMem(" + $_inst_operand$$ + ", this.a);";
      $address$$ += 2;
      break;
    case 51:
      $inst$$ = "INC SP";
      $code$$ = "this.sp++;";
      break;
    case 52:
      $inst$$ = "INC (HL)";
      $code$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $inst$$ = "DEC (HL)";
      $code$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD (HL)," + $_inst_operand$$;
      $code$$ = "this.writeMem(this.getHL(), " + $_inst_operand$$ + ");";
      $address$$++;
      break;
    case 55:
      $inst$$ = "SCF";
      $code$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $target$$ = $address$$ + this.signExtend(this.readRom8bit($address$$) + 1);
      $inst$$ = "JR C,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x05;this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$++;
      break;
    case 57:
      $inst$$ = "ADD HL,SP";
      $code$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $_inst_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD A,(" + $_inst_operand$$ + ")";
      $code$$ = "this.a = this.readMem(" + $_inst_operand$$ + ");";
      $address$$ += 2;
      break;
    case 59:
      $inst$$ = "DEC SP";
      $code$$ = "this.sp--;";
      break;
    case 60:
      $inst$$ = "INC A";
      $code$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $inst$$ = "DEC A";
      $code$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "LD A," + $_inst_operand$$;
      $code$$ = "this.a = " + $_inst_operand$$ + ";";
      $address$$++;
      break;
    case 63:
      $inst$$ = "CCF";
      $code$$ = "this.ccf();";
      break;
    case 64:
      $inst$$ = "LD B,B";
      $code$$ = "";
      break;
    case 65:
      $inst$$ = "LD B,C";
      $code$$ = "this.b = this.c;";
      break;
    case 66:
      $inst$$ = "LD B,D";
      $code$$ = "this.b = this.d;";
      break;
    case 67:
      $inst$$ = "LD B,E";
      $code$$ = "this.b = this.e;";
      break;
    case 68:
      $inst$$ = "LD B,H";
      $code$$ = "this.b = this.h;";
      break;
    case 69:
      $inst$$ = "LD B,L";
      $code$$ = "this.b = this.l;";
      break;
    case 70:
      $inst$$ = "LD B,(HL)";
      $code$$ = "this.b = this.readMem(this.getHL());";
      break;
    case 71:
      $inst$$ = "LD B,A";
      $code$$ = "this.b = this.a;";
      break;
    case 72:
      $inst$$ = "LD C,B";
      $code$$ = "this.c = this.b;";
      break;
    case 73:
      $inst$$ = "LD C,C";
      $code$$ = "";
      break;
    case 74:
      $inst$$ = "LD C,D";
      $code$$ = "this.c = this.d;";
      break;
    case 75:
      $inst$$ = "LD C,E";
      $code$$ = "this.c = this.e;";
      break;
    case 76:
      $inst$$ = "LD C,H";
      $code$$ = "this.c = this.h;";
      break;
    case 77:
      $inst$$ = "LD C,L";
      $code$$ = "this.c = this.l;";
      break;
    case 78:
      $inst$$ = "LD C,(HL)";
      $code$$ = "this.c = this.readMem(this.getHL());";
      break;
    case 79:
      $inst$$ = "LD C,A";
      $code$$ = "this.c = this.a;";
      break;
    case 80:
      $inst$$ = "LD D,B";
      $code$$ = "this.d = this.b;";
      break;
    case 81:
      $inst$$ = "LD D,C";
      $code$$ = "this.d = this.c;";
      break;
    case 82:
      $inst$$ = "LD D,D";
      $code$$ = "";
      break;
    case 83:
      $inst$$ = "LD D,E";
      $code$$ = "this.d = this.e;";
      break;
    case 84:
      $inst$$ = "LD D,H";
      $code$$ = "this.d = this.h;";
      break;
    case 85:
      $inst$$ = "LD D,L";
      $code$$ = "this.d = this.l;";
      break;
    case 86:
      $inst$$ = "LD D,(HL)";
      $code$$ = "this.d = this.readMem(this.getHL());";
      break;
    case 87:
      $inst$$ = "LD D,A";
      $code$$ = "this.d = this.a;";
      break;
    case 88:
      $inst$$ = "LD E,B";
      $code$$ = "this.e = this.b;";
      break;
    case 89:
      $inst$$ = "LD E,C";
      $code$$ = "this.e = this.c;";
      break;
    case 90:
      $inst$$ = "LD E,D";
      $code$$ = "this.e = this.d;";
      break;
    case 91:
      $inst$$ = "LD E,E";
      $code$$ = "";
      break;
    case 92:
      $inst$$ = "LD E,H";
      $code$$ = "this.e = this.h;";
      break;
    case 93:
      $inst$$ = "LD E,L";
      $code$$ = "this.e = this.l;";
      break;
    case 94:
      $inst$$ = "LD E,(HL)";
      $code$$ = "this.e = this.readMem(this.getHL());";
      break;
    case 95:
      $inst$$ = "LD E,A";
      $code$$ = "this.e = this.a;";
      break;
    case 96:
      $inst$$ = "LD H,B";
      $code$$ = "this.h = this.b;";
      break;
    case 97:
      $inst$$ = "LD H,C";
      $code$$ = "this.h = this.c;";
      break;
    case 98:
      $inst$$ = "LD H,D";
      $code$$ = "this.h = this.d;";
      break;
    case 99:
      $inst$$ = "LD H,E";
      $code$$ = "this.h = this.e;";
      break;
    case 100:
      $inst$$ = "LD H,H";
      $code$$ = "";
      break;
    case 101:
      $inst$$ = "LD H,L";
      $code$$ = "this.h = this.l;";
      break;
    case 102:
      $inst$$ = "LD H,(HL)";
      $code$$ = "this.h = this.readMem(this.getHL());";
      break;
    case 103:
      $inst$$ = "LD H,A";
      $code$$ = "this.h = this.a;";
      break;
    case 104:
      $inst$$ = "LD L,B";
      $code$$ = "this.l = this.b;";
      break;
    case 105:
      $inst$$ = "LD L,C";
      $code$$ = "this.l = this.c;";
      break;
    case 106:
      $inst$$ = "LD L,D";
      $code$$ = "this.l = this.d;";
      break;
    case 107:
      $inst$$ = "LD L,E";
      $code$$ = "this.l = this.e;";
      break;
    case 108:
      $inst$$ = "LD L,H";
      $code$$ = "this.l = this.h;";
      break;
    case 109:
      $inst$$ = "LD L,L";
      $code$$ = "";
      break;
    case 110:
      $inst$$ = "LD L,(HL)";
      $code$$ = "this.l = this.readMem(this.getHL());";
      break;
    case 111:
      $inst$$ = "LD L,A";
      $code$$ = "this.l = this.a;";
      break;
    case 112:
      $inst$$ = "LD (HL),B";
      $code$$ = "this.writeMem(this.getHL(), this.b);";
      break;
    case 113:
      $inst$$ = "LD (HL),C";
      $code$$ = "this.writeMem(this.getHL(), this.c);";
      break;
    case 114:
      $inst$$ = "LD (HL),D";
      $code$$ = "this.writeMem(this.getHL(), this.d);";
      break;
    case 115:
      $inst$$ = "LD (HL),E";
      $code$$ = "this.writeMem(this.getHL(), this.e);";
      break;
    case 116:
      $inst$$ = "LD (HL),H";
      $code$$ = "this.writeMem(this.getHL(), this.h);";
      break;
    case 117:
      $inst$$ = "LD (HL),L";
      $code$$ = "this.writeMem(this.getHL(), this.l);";
      break;
    case 118:
      $inst$$ = "HALT";
      $code$$ = HALT_SPEEDUP ? "this.tstates = 0x00;" : "";
      $code$$ += "this.halt = true; this.pc = " + $toHex$$($address$$ - 1) + "; return;";
      break;
    case 119:
      $inst$$ = "LD (HL),A";
      $code$$ = "this.writeMem(this.getHL(), this.a);";
      break;
    case 120:
      $inst$$ = "LD A,B";
      $code$$ = "this.a = this.b;";
      break;
    case 121:
      $inst$$ = "LD A,C";
      $code$$ = "this.a = this.c;";
      break;
    case 122:
      $inst$$ = "LD A,D";
      $code$$ = "this.a = this.d;";
      break;
    case 123:
      $inst$$ = "LD A,E";
      $code$$ = "this.a = this.e;";
      break;
    case 124:
      $inst$$ = "LD A,H";
      $code$$ = "this.a = this.h;";
      break;
    case 125:
      $inst$$ = "LD A,L";
      $code$$ = "this.a = this.l;";
      break;
    case 126:
      $inst$$ = "LD A,(HL)";
      $code$$ = "this.a = this.readMem(this.getHL());";
      break;
    case 127:
      $inst$$ = "LD A,A";
      $code$$ = "";
      break;
    case 128:
      $inst$$ = "ADD A,B";
      $code$$ = "this.add_a(this.b);";
      break;
    case 129:
      $inst$$ = "ADD A,C";
      $code$$ = "this.add_a(this.c);";
      break;
    case 130:
      $inst$$ = "ADD A,D";
      $code$$ = "this.add_a(this.d);";
      break;
    case 131:
      $inst$$ = "ADD A,E";
      $code$$ = "this.add_a(this.e);";
      break;
    case 132:
      $inst$$ = "ADD A,H";
      $code$$ = "this.add_a(this.h);";
      break;
    case 133:
      $inst$$ = "ADD A,L";
      $code$$ = "this.add_a(this.l);";
      break;
    case 134:
      $inst$$ = "ADD A,(HL)";
      $code$$ = "this.add_a(this.readMem(this.getHL()));";
      break;
    case 135:
      $inst$$ = "ADD A,A";
      $code$$ = "this.add_a(this.a);";
      break;
    case 136:
      $inst$$ = "ADC A,B";
      $code$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $inst$$ = "ADC A,C";
      $code$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $inst$$ = "ADC A,D";
      $code$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $inst$$ = "ADC A,E";
      $code$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $inst$$ = "ADC A,H";
      $code$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $inst$$ = "ADC A,L";
      $code$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $inst$$ = "ADC A,(HL)";
      $code$$ = "this.adc_a(this.readMem(this.getHL()));";
      break;
    case 143:
      $inst$$ = "ADC A,A";
      $code$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $inst$$ = "SUB A,B";
      $code$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $inst$$ = "SUB A,C";
      $code$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $inst$$ = "SUB A,D";
      $code$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $inst$$ = "SUB A,E";
      $code$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $inst$$ = "SUB A,H";
      $code$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $inst$$ = "SUB A,L";
      $code$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $inst$$ = "SUB A,(HL)";
      $code$$ = "this.sub_a(this.readMem(this.getHL()));";
      break;
    case 151:
      $inst$$ = "SUB A,A";
      $code$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $inst$$ = "SBC A,B";
      $code$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $inst$$ = "SBC A,C";
      $code$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $inst$$ = "SBC A,D";
      $code$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $inst$$ = "SBC A,E";
      $code$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $inst$$ = "SBC A,H";
      $code$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $inst$$ = "SBC A,L";
      $code$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $inst$$ = "SBC A,(HL)";
      $code$$ = "this.sbc_a(this.readMem(this.getHL()));";
      break;
    case 159:
      $inst$$ = "SBC A,A";
      $code$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $inst$$ = "AND A,B";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $inst$$ = "AND A,C";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $inst$$ = "AND A,D";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $inst$$ = "AND A,E";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $inst$$ = "AND A,H";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $inst$$ = "AND A,L";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $inst$$ = "AND A,(HL)";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $inst$$ = "AND A,A";
      $code$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $inst$$ = "XOR A,B";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $inst$$ = "XOR A,C";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $inst$$ = "XOR A,D";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $inst$$ = "XOR A,E";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $inst$$ = "XOR A,H";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $inst$$ = "XOR A,L";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $inst$$ = "XOR A,(HL)";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
      break;
    case 175:
      $inst$$ = "XOR A,A";
      $code$$ = "this.a = " + $toHex$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $inst$$ = "OR A,B";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $inst$$ = "OR A,C";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $inst$$ = "OR A,D";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $inst$$ = "OR A,E";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $inst$$ = "OR A,H";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $inst$$ = "OR A,L";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $inst$$ = "OR A,(HL)";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
      break;
    case 183:
      $inst$$ = "OR A,A";
      $code$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $inst$$ = "CP A,B";
      $code$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $inst$$ = "CP A,C";
      $code$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $inst$$ = "CP A,D";
      $code$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $inst$$ = "CP A,E";
      $code$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $inst$$ = "CP A,H";
      $code$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $inst$$ = "CP A,L";
      $code$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $inst$$ = "CP A,(HL)";
      $code$$ = "this.cp_a(this.readMem(this.getHL()));";
      break;
    case 191:
      $inst$$ = "CP A,A";
      $code$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $inst$$ = "RET NZ";
      $code$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $inst$$ = "POP BC";
      $code$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP NZ,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_ZERO) == 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 195:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP (" + $toHex$$($target$$) + ")";
      $code$$ = "this.pc = " + $toHex$$($target$$) + "; return;";
      $address$$ = null;
      break;
    case 196:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL NZ (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 197:
      $inst$$ = "PUSH BC";
      $code$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "ADD A," + $_inst_operand$$;
      $code$$ = "this.add_a(" + $_inst_operand$$ + ");";
      $address$$++;
      break;
    case 199:
      $target$$ = 0;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 200:
      $inst$$ = "RET Z";
      $code$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $inst$$ = "RET";
      $code$$ = "this.pc = this.readMemWord(this.sp); this.sp += 0x02; return;";
      $address$$ = null;
      break;
    case 202:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP Z,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_ZERO) != 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 203:
      $_inst_operand$$ = this.getCB($address$$);
      $inst$$ = $_inst_operand$$.inst;
      $code$$ = $_inst_operand$$.code;
      $opcodesArray$$ = $opcodesArray$$.concat($_inst_operand$$.opcodes);
      $address$$ = $_inst_operand$$.nextAddress;
      break;
    case 204:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL Z (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 205:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL (" + $toHex$$($target$$) + ")";
      $code$$ = "this.push1(" + $toHex$$($address$$ + 2) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      $address$$ += 2;
      break;
    case 206:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "ADC ," + $_inst_operand$$;
      $code$$ = "this.adc_a(" + $_inst_operand$$ + ");";
      $address$$++;
      break;
    case 207:
      $target$$ = 8;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 208:
      $inst$$ = "RET NC";
      $code$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $inst$$ = "POP DE";
      $code$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP NC,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_CARRY) == 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 211:
      $_inst_operand$$ = this.readRom8bit($address$$);
      $inst$$ = "OUT (" + $toHex$$($_inst_operand$$) + "),A";
      $code$$ = this.peepholePortOut($_inst_operand$$);
      $address$$++;
      break;
    case 212:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL NC (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 213:
      $inst$$ = "PUSH DE";
      $code$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "SUB " + $_inst_operand$$;
      $code$$ = "this.sub_a(" + $_inst_operand$$ + ");";
      $address$$++;
      break;
    case 215:
      $target$$ = 16;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 216:
      $inst$$ = "RET C";
      $code$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $inst$$ = "EXX";
      $code$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP C,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_CARRY) != 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 219:
      $_inst_operand$$ = this.readRom8bit($address$$);
      $inst$$ = "IN A,(" + $toHex$$($_inst_operand$$) + ")";
      $code$$ = this.peepholePortIn($_inst_operand$$);
      $address$$++;
      break;
    case 220:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL C (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 221:
      $_inst_operand$$ = this.getIndexOpIX($address$$);
      $inst$$ = $_inst_operand$$.inst;
      $code$$ = $_inst_operand$$.code;
      $opcodesArray$$ = $opcodesArray$$.concat($_inst_operand$$.opcodes);
      $address$$ = $_inst_operand$$.nextAddress;
      break;
    case 222:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "SBC A," + $_inst_operand$$;
      $code$$ = "this.sbc_a(" + $_inst_operand$$ + ");";
      $address$$++;
      break;
    case 223:
      $target$$ = 24;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 224:
      $inst$$ = "RET PO";
      $code$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $inst$$ = "POP HL";
      $code$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP PO,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_PARITY) == 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 227:
      $inst$$ = "EX (SP),HL";
      $code$$ = "temp = this.h;this.h = this.readMem(this.sp + 0x01);this.writeMem(this.sp + 0x01, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
      break;
    case 228:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL PO (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 229:
      $inst$$ = "PUSH HL";
      $code$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "AND (" + $_inst_operand$$ + ")";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst_operand$$ + "] | F_HALFCARRY;";
      $address$$++;
      break;
    case 231:
      $target$$ = 32;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 232:
      $inst$$ = "RET PE";
      $code$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $inst$$ = "JP (HL)";
      $code$$ = "this.pc = this.getHL(); return;";
      $address$$ = null;
      break;
    case 234:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP PE,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_PARITY) != 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 235:
      $inst$$ = "EX DE,HL";
      $code$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL PE (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 237:
      $_inst_operand$$ = this.getED($address$$);
      $target$$ = $_inst_operand$$.target;
      $inst$$ = $_inst_operand$$.inst;
      $code$$ = $_inst_operand$$.code;
      $opcodesArray$$ = $opcodesArray$$.concat($_inst_operand$$.opcodes);
      $address$$ = $_inst_operand$$.nextAddress;
      break;
    case 238:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "XOR " + $_inst_operand$$;
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst_operand$$ + "];";
      $address$$++;
      break;
    case 239:
      $target$$ = 40;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 240:
      $inst$$ = "RET P";
      $code$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $inst$$ = "POP AF";
      $code$$ = "this.setAF(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP P,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_SIGN) == 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 243:
      $inst$$ = "DI";
      $code$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL P (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 245:
      $inst$$ = "PUSH AF";
      $code$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "OR " + $_inst_operand$$;
      $code$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst_operand$$ + "];";
      $address$$++;
      break;
    case 247:
      $target$$ = 48;
      $inst$$ = "RST " + $toHex$$($target$$);
      $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;";
      break;
    case 248:
      $inst$$ = "RET M";
      $code$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $inst$$ = "LD SP,HL";
      $code$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "JP M,(" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_SIGN) != 0x00) {this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 251:
      $inst$$ = "EI";
      $code$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $target$$ = this.readRom16bit($address$$);
      $inst$$ = "CALL M (" + $toHex$$($target$$) + ")";
      $code$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x07;this.push1(" + $toHex$$($address$$ + 2) + ");this.pc = " + $toHex$$($target$$) + ";return;}";
      $address$$ += 2;
      break;
    case 253:
      $_inst_operand$$ = this.getIndexOpIY($address$$);
      $inst$$ = $_inst_operand$$.inst;
      $code$$ = $_inst_operand$$.code;
      $opcodesArray$$ = $opcodesArray$$.concat($_inst_operand$$.opcodes);
      $address$$ = $_inst_operand$$.nextAddress;
      break;
    case 254:
      $_inst_operand$$ = $toHex$$(this.readRom8bit($address$$));
      $inst$$ = "CP " + $_inst_operand$$;
      $code$$ = "this.cp_a(" + $_inst_operand$$ + ");";
      $address$$++;
      break;
    case 255:
      $target$$ = 56, $inst$$ = "RST " + $toHex$$($target$$), $code$$ = "this.push1(" + $toHex$$($address$$) + "); this.pc = " + $toHex$$($target$$) + "; return;"
  }
  return Instruction({opcode:$opcode$$, opcodes:$opcodesArray$$, inst:$inst$$, code:$code$$, address:$currAddr$$, nextAddress:$address$$, target:$target$$})
}, getCB:function $JSSMS$Debugger$$getCB$($address$$) {
  var $opcode$$ = this.readRom8bit($address$$), $opcodesArray$$ = [$opcode$$], $inst$$ = "Unimplemented 0xCB prefixed opcode", $currAddr$$ = $address$$, $code$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
  $address$$++;
  switch($opcode$$) {
    case 0:
      $inst$$ = "RLC B";
      $code$$ = "this.b = this.rlc(this.b);";
      break;
    case 1:
      $inst$$ = "RLC C";
      $code$$ = "this.c = this.rlc(this.c);";
      break;
    case 2:
      $inst$$ = "RLC D";
      $code$$ = "this.d = this.rlc(this.d);";
      break;
    case 3:
      $inst$$ = "RLC E";
      $code$$ = "this.e = this.rlc(this.e);";
      break;
    case 4:
      $inst$$ = "RLC H";
      $code$$ = "this.h = this.rlc(this.h);";
      break;
    case 5:
      $inst$$ = "RLC L";
      $code$$ = "this.l = this.rlc(this.l);";
      break;
    case 6:
      $inst$$ = "RLC (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
      break;
    case 7:
      $inst$$ = "RLC A";
      $code$$ = "this.a = this.rlc(this.a);";
      break;
    case 8:
      $inst$$ = "RRC B";
      $code$$ = "this.b = this.rrc(this.b);";
      break;
    case 9:
      $inst$$ = "RRC C";
      $code$$ = "this.c = this.rrc(this.c);";
      break;
    case 10:
      $inst$$ = "RRC D";
      $code$$ = "this.d = this.rrc(this.d);";
      break;
    case 11:
      $inst$$ = "RRC E";
      $code$$ = "this.e = this.rrc(this.e);";
      break;
    case 12:
      $inst$$ = "RRC H";
      $code$$ = "this.h = this.rrc(this.h);";
      break;
    case 13:
      $inst$$ = "RRC L";
      $code$$ = "this.l = this.rrc(this.l);";
      break;
    case 14:
      $inst$$ = "RRC (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
      break;
    case 15:
      $inst$$ = "RRC A";
      $code$$ = "this.a = this.rrc(this.a);";
      break;
    case 16:
      $inst$$ = "RL B";
      $code$$ = "this.b = this.rl(this.b);";
      break;
    case 17:
      $inst$$ = "RL C";
      $code$$ = "this.c = this.rl(this.c);";
      break;
    case 18:
      $inst$$ = "RL D";
      $code$$ = "this.d = this.rl(this.d);";
      break;
    case 19:
      $inst$$ = "RL E";
      $code$$ = "this.e = this.rl(this.e);";
      break;
    case 20:
      $inst$$ = "RL H";
      $code$$ = "this.h = this.rl(this.h);";
      break;
    case 21:
      $inst$$ = "RL L";
      $code$$ = "this.l = this.rl(this.l);";
      break;
    case 22:
      $inst$$ = "RL (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
      break;
    case 23:
      $inst$$ = "RL A";
      $code$$ = "this.a = this.rl(this.a);";
      break;
    case 24:
      $inst$$ = "RR B";
      $code$$ = "this.b = this.rr(this.b);";
      break;
    case 25:
      $inst$$ = "RR C";
      $code$$ = "this.c = this.rr(this.c);";
      break;
    case 26:
      $inst$$ = "RR D";
      $code$$ = "this.d = this.rr(this.d);";
      break;
    case 27:
      $inst$$ = "RR E";
      $code$$ = "this.e = this.rr(this.e);";
      break;
    case 28:
      $inst$$ = "RR H";
      $code$$ = "this.h = this.rr(this.h);";
      break;
    case 29:
      $inst$$ = "RR L";
      $code$$ = "this.l = this.rr(this.l);";
      break;
    case 30:
      $inst$$ = "RR (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
      break;
    case 31:
      $inst$$ = "RR A";
      $code$$ = "this.a = this.rr(this.a);";
      break;
    case 32:
      $inst$$ = "SLA B";
      $code$$ = "this.b = this.sla(this.b);";
      break;
    case 33:
      $inst$$ = "SLA C";
      $code$$ = "this.c = this.sla(this.c);";
      break;
    case 34:
      $inst$$ = "SLA D";
      $code$$ = "this.d = this.sla(this.d);";
      break;
    case 35:
      $inst$$ = "SLA E";
      $code$$ = "this.e = this.sla(this.e);";
      break;
    case 36:
      $inst$$ = "SLA H";
      $code$$ = "this.h = this.sla(this.h);";
      break;
    case 37:
      $inst$$ = "SLA L";
      $code$$ = "this.l = this.sla(this.l);";
      break;
    case 38:
      $inst$$ = "SLA (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
      break;
    case 39:
      $inst$$ = "SLA A";
      $code$$ = "this.a = this.sla(this.a);";
      break;
    case 40:
      $inst$$ = "SRA B";
      $code$$ = "this.b = this.sra(this.b);";
      break;
    case 41:
      $inst$$ = "SRA C";
      $code$$ = "this.c = this.sra(this.c);";
      break;
    case 42:
      $inst$$ = "SRA D";
      $code$$ = "this.d = this.sra(this.d);";
      break;
    case 43:
      $inst$$ = "SRA E";
      $code$$ = "this.e = this.sra(this.e);";
      break;
    case 44:
      $inst$$ = "SRA H";
      $code$$ = "this.h = this.sra(this.h);";
      break;
    case 45:
      $inst$$ = "SRA L";
      $code$$ = "this.l = this.sra(this.l);";
      break;
    case 46:
      $inst$$ = "SRA (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
      break;
    case 47:
      $inst$$ = "SRA A";
      $code$$ = "this.a = this.sra(this.a);";
      break;
    case 48:
      $inst$$ = "SLL B";
      $code$$ = "this.b = this.sll(this.b);";
      break;
    case 49:
      $inst$$ = "SLL C";
      $code$$ = "this.c = this.sll(this.c);";
      break;
    case 50:
      $inst$$ = "SLL D";
      $code$$ = "this.d = this.sll(this.d);";
      break;
    case 51:
      $inst$$ = "SLL E";
      $code$$ = "this.e = this.sll(this.e);";
      break;
    case 52:
      $inst$$ = "SLL H";
      $code$$ = "this.h = this.sll(this.h);";
      break;
    case 53:
      $inst$$ = "SLL L";
      $code$$ = "this.l = this.sll(this.l);";
      break;
    case 54:
      $inst$$ = "SLL (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
      break;
    case 55:
      $inst$$ = "SLL A";
      $code$$ = "this.a = this.sll(this.a);";
      break;
    case 56:
      $inst$$ = "SRL B";
      $code$$ = "this.b = this.srl(this.b);";
      break;
    case 57:
      $inst$$ = "SRL C";
      $code$$ = "this.c = this.srl(this.c);";
      break;
    case 58:
      $inst$$ = "SRL D";
      $code$$ = "this.d = this.srl(this.d);";
      break;
    case 59:
      $inst$$ = "SRL E";
      $code$$ = "this.e = this.srl(this.e);";
      break;
    case 60:
      $inst$$ = "SRL H";
      $code$$ = "this.h = this.srl(this.h);";
      break;
    case 61:
      $inst$$ = "SRL L";
      $code$$ = "this.l = this.srl(this.l);";
      break;
    case 62:
      $inst$$ = "SRL (HL)";
      $code$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
      break;
    case 63:
      $inst$$ = "SRL A";
      $code$$ = "this.a = this.srl(this.a);";
      break;
    case 64:
      $inst$$ = "BIT 0,B";
      $code$$ = "this.bit(this.b & BIT_0);";
      break;
    case 65:
      $inst$$ = "BIT 0,C";
      $code$$ = "this.bit(this.c & BIT_0);";
      break;
    case 66:
      $inst$$ = "BIT 0,D";
      $code$$ = "this.bit(this.d & BIT_0);";
      break;
    case 67:
      $inst$$ = "BIT 0,E";
      $code$$ = "this.bit(this.e & BIT_0);";
      break;
    case 68:
      $inst$$ = "BIT 0,H";
      $code$$ = "this.bit(this.h & BIT_0);";
      break;
    case 69:
      $inst$$ = "BIT 0,L";
      $code$$ = "this.bit(this.l & BIT_0);";
      break;
    case 70:
      $inst$$ = "BIT 0,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
      break;
    case 71:
      $inst$$ = "BIT 0,A";
      $code$$ = "this.bit(this.a & BIT_0);";
      break;
    case 72:
      $inst$$ = "BIT 1,B";
      $code$$ = "this.bit(this.b & BIT_1);";
      break;
    case 73:
      $inst$$ = "BIT 1,C";
      $code$$ = "this.bit(this.c & BIT_1);";
      break;
    case 74:
      $inst$$ = "BIT 1,D";
      $code$$ = "this.bit(this.d & BIT_1);";
      break;
    case 75:
      $inst$$ = "BIT 1,E";
      $code$$ = "this.bit(this.e & BIT_1);";
      break;
    case 76:
      $inst$$ = "BIT 1,H";
      $code$$ = "this.bit(this.h & BIT_1);";
      break;
    case 77:
      $inst$$ = "BIT 1,L";
      $code$$ = "this.bit(this.l & BIT_1);";
      break;
    case 78:
      $inst$$ = "BIT 1,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
      break;
    case 79:
      $inst$$ = "BIT 1,A";
      $code$$ = "this.bit(this.a & BIT_1);";
      break;
    case 80:
      $inst$$ = "BIT 2,B";
      $code$$ = "this.bit(this.b & BIT_2);";
      break;
    case 81:
      $inst$$ = "BIT 2,C";
      $code$$ = "this.bit(this.c & BIT_2);";
      break;
    case 82:
      $inst$$ = "BIT 2,D";
      $code$$ = "this.bit(this.d & BIT_2);";
      break;
    case 83:
      $inst$$ = "BIT 2,E";
      $code$$ = "this.bit(this.e & BIT_2);";
      break;
    case 84:
      $inst$$ = "BIT 2,H";
      $code$$ = "this.bit(this.h & BIT_2);";
      break;
    case 85:
      $inst$$ = "BIT 2,L";
      $code$$ = "this.bit(this.l & BIT_2);";
      break;
    case 86:
      $inst$$ = "BIT 2,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
      break;
    case 87:
      $inst$$ = "BIT 2,A";
      $code$$ = "this.bit(this.a & BIT_2);";
      break;
    case 88:
      $inst$$ = "BIT 3,B";
      $code$$ = "this.bit(this.b & BIT_3);";
      break;
    case 89:
      $inst$$ = "BIT 3,C";
      $code$$ = "this.bit(this.c & BIT_3);";
      break;
    case 90:
      $inst$$ = "BIT 3,D";
      $code$$ = "this.bit(this.d & BIT_3);";
      break;
    case 91:
      $inst$$ = "BIT 3,E";
      $code$$ = "this.bit(this.e & BIT_3);";
      break;
    case 92:
      $inst$$ = "BIT 3,H";
      $code$$ = "this.bit(this.h & BIT_3);";
      break;
    case 93:
      $inst$$ = "BIT 3,L";
      $code$$ = "this.bit(this.l & BIT_3);";
      break;
    case 94:
      $inst$$ = "BIT 3,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
      break;
    case 95:
      $inst$$ = "BIT 3,A";
      $code$$ = "this.bit(this.a & BIT_3);";
      break;
    case 96:
      $inst$$ = "BIT 4,B";
      $code$$ = "this.bit(this.b & BIT_4);";
      break;
    case 97:
      $inst$$ = "BIT 4,C";
      $code$$ = "this.bit(this.c & BIT_4);";
      break;
    case 98:
      $inst$$ = "BIT 4,D";
      $code$$ = "this.bit(this.d & BIT_4);";
      break;
    case 99:
      $inst$$ = "BIT 4,E";
      $code$$ = "this.bit(this.e & BIT_4);";
      break;
    case 100:
      $inst$$ = "BIT 4,H";
      $code$$ = "this.bit(this.h & BIT_4);";
      break;
    case 101:
      $inst$$ = "BIT 4,L";
      $code$$ = "this.bit(this.l & BIT_4);";
      break;
    case 102:
      $inst$$ = "BIT 4,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
      break;
    case 103:
      $inst$$ = "BIT 4,A";
      $code$$ = "this.bit(this.a & BIT_4);";
      break;
    case 104:
      $inst$$ = "BIT 5,B";
      $code$$ = "this.bit(this.b & BIT_5);";
      break;
    case 105:
      $inst$$ = "BIT 5,C";
      $code$$ = "this.bit(this.c & BIT_5);";
      break;
    case 106:
      $inst$$ = "BIT 5,D";
      $code$$ = "this.bit(this.d & BIT_5);";
      break;
    case 107:
      $inst$$ = "BIT 5,E";
      $code$$ = "this.bit(this.e & BIT_5);";
      break;
    case 108:
      $inst$$ = "BIT 5,H";
      $code$$ = "this.bit(this.h & BIT_5);";
      break;
    case 109:
      $inst$$ = "BIT 5,L";
      $code$$ = "this.bit(this.l & BIT_5);";
      break;
    case 110:
      $inst$$ = "BIT 5,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
      break;
    case 111:
      $inst$$ = "BIT 5,A";
      $code$$ = "this.bit(this.a & BIT_5);";
      break;
    case 112:
      $inst$$ = "BIT 6,B";
      $code$$ = "this.bit(this.b & BIT_6);";
      break;
    case 113:
      $inst$$ = "BIT 6,C";
      $code$$ = "this.bit(this.c & BIT_6);";
      break;
    case 114:
      $inst$$ = "BIT 6,D";
      $code$$ = "this.bit(this.d & BIT_6);";
      break;
    case 115:
      $inst$$ = "BIT 6,E";
      $code$$ = "this.bit(this.e & BIT_6);";
      break;
    case 116:
      $inst$$ = "BIT 6,H";
      $code$$ = "this.bit(this.h & BIT_6);";
      break;
    case 117:
      $inst$$ = "BIT 6,L";
      $code$$ = "this.bit(this.l & BIT_6);";
      break;
    case 118:
      $inst$$ = "BIT 6,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
      break;
    case 119:
      $inst$$ = "BIT 6,A";
      $code$$ = "this.bit(this.a & BIT_6);";
      break;
    case 120:
      $inst$$ = "BIT 7,B";
      $code$$ = "this.bit(this.b & BIT_7);";
      break;
    case 121:
      $inst$$ = "BIT 7,C";
      $code$$ = "this.bit(this.c & BIT_7);";
      break;
    case 122:
      $inst$$ = "BIT 7,D";
      $code$$ = "this.bit(this.d & BIT_7);";
      break;
    case 123:
      $inst$$ = "BIT 7,E";
      $code$$ = "this.bit(this.e & BIT_7);";
      break;
    case 124:
      $inst$$ = "BIT 7,H";
      $code$$ = "this.bit(this.h & BIT_7);";
      break;
    case 125:
      $inst$$ = "BIT 7,L";
      $code$$ = "this.bit(this.l & BIT_7);";
      break;
    case 126:
      $inst$$ = "BIT 7,(HL)";
      $code$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
      break;
    case 127:
      $inst$$ = "BIT 7,A";
      $code$$ = "this.bit(this.a & BIT_7);";
      break;
    case 128:
      $inst$$ = "RES 0,B";
      $code$$ = "this.b &= ~BIT_0;";
      break;
    case 129:
      $inst$$ = "RES 0,C";
      $code$$ = "this.c &= ~BIT_0;";
      break;
    case 130:
      $inst$$ = "RES 0,D";
      $code$$ = "this.d &= ~BIT_0;";
      break;
    case 131:
      $inst$$ = "RES 0,E";
      $code$$ = "this.e &= ~BIT_0;";
      break;
    case 132:
      $inst$$ = "RES 0,H";
      $code$$ = "this.h &= ~BIT_0;";
      break;
    case 133:
      $inst$$ = "RES 0,L";
      $code$$ = "this.l &= ~BIT_0;";
      break;
    case 134:
      $inst$$ = "RES 0,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
      break;
    case 135:
      $inst$$ = "RES 0,A";
      $code$$ = "this.a &= ~BIT_0;";
      break;
    case 136:
      $inst$$ = "RES 1,B";
      break;
    case 137:
      $inst$$ = "RES 1,C";
      break;
    case 138:
      $inst$$ = "RES 1,D";
      break;
    case 139:
      $inst$$ = "RES 1,E";
      break;
    case 140:
      $inst$$ = "RES 1,H";
      break;
    case 141:
      $inst$$ = "RES 1,L";
      break;
    case 142:
      $inst$$ = "RES 1,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
      break;
    case 143:
      $inst$$ = "RES 1,A";
      break;
    case 144:
      $inst$$ = "RES 2,B";
      break;
    case 145:
      $inst$$ = "RES 2,C";
      break;
    case 146:
      $inst$$ = "RES 2,D";
      break;
    case 147:
      $inst$$ = "RES 2,E";
      break;
    case 148:
      $inst$$ = "RES 2,H";
      break;
    case 149:
      $inst$$ = "RES 2,L";
      break;
    case 150:
      $inst$$ = "RES 2,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
      break;
    case 151:
      $inst$$ = "RES 2,A";
      break;
    case 152:
      $inst$$ = "RES 3,B";
      break;
    case 153:
      $inst$$ = "RES 3,C";
      break;
    case 154:
      $inst$$ = "RES 3,D";
      break;
    case 155:
      $inst$$ = "RES 3,E";
      break;
    case 156:
      $inst$$ = "RES 3,H";
      break;
    case 157:
      $inst$$ = "RES 3,L";
      break;
    case 158:
      $inst$$ = "RES 3,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
      break;
    case 159:
      $inst$$ = "RES 3,A";
      $code$$ = "this.a &= ~BIT_3;";
      break;
    case 160:
      $inst$$ = "RES 4,B";
      break;
    case 161:
      $inst$$ = "RES 4,C";
      break;
    case 162:
      $inst$$ = "RES 4,D";
      break;
    case 163:
      $inst$$ = "RES 4,E";
      break;
    case 164:
      $inst$$ = "RES 4,H";
      break;
    case 165:
      $inst$$ = "RES 4,L";
      break;
    case 166:
      $inst$$ = "RES 4,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
      break;
    case 167:
      $inst$$ = "RES 4,A";
      $code$$ = "this.a &= ~BIT_4;";
      break;
    case 168:
      $inst$$ = "RES 5,B";
      break;
    case 169:
      $inst$$ = "RES 5,C";
      break;
    case 170:
      $inst$$ = "RES 5,D";
      break;
    case 171:
      $inst$$ = "RES 5,E";
      break;
    case 172:
      $inst$$ = "RES 5,H";
      break;
    case 173:
      $inst$$ = "RES 5,L";
      break;
    case 174:
      $inst$$ = "RES 5,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
      break;
    case 175:
      $inst$$ = "RES 5,A";
      break;
    case 176:
      $inst$$ = "RES 6,B";
      break;
    case 177:
      $inst$$ = "RES 6,C";
      break;
    case 178:
      $inst$$ = "RES 6,D";
      break;
    case 179:
      $inst$$ = "RES 6,E";
      break;
    case 180:
      $inst$$ = "RES 6,H";
      break;
    case 181:
      $inst$$ = "RES 6,L";
      break;
    case 182:
      $inst$$ = "RES 6,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
      break;
    case 183:
      $inst$$ = "RES 6,A";
      $code$$ = "this.a &= ~BIT_6;";
      break;
    case 184:
      $inst$$ = "RES 7,B";
      $code$$ = "this.b &= ~BIT_7;";
      break;
    case 185:
      $inst$$ = "RES 7,C";
      $code$$ = "this.c &= ~BIT_7;";
      break;
    case 186:
      $inst$$ = "RES 7,D";
      $code$$ = "this.d &= ~BIT_7;";
      break;
    case 187:
      $inst$$ = "RES 7,E";
      $code$$ = "this.e &= ~BIT_7;";
      break;
    case 188:
      $inst$$ = "RES 7,H";
      $code$$ = "this.h &= ~BIT_7;";
      break;
    case 189:
      $inst$$ = "RES 7,L";
      $code$$ = "this.l &= ~BIT_7;";
      break;
    case 190:
      $inst$$ = "RES 7,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
      break;
    case 191:
      $inst$$ = "RES 7,A";
      $code$$ = "this.a &= ~BIT_7;";
      break;
    case 192:
      $inst$$ = "SET 0,B";
      $code$$ = "this.b |= BIT_0;";
      break;
    case 193:
      $inst$$ = "SET 0,C";
      $code$$ = "this.c |= BIT_0;";
      break;
    case 194:
      $inst$$ = "SET 0,D";
      $code$$ = "this.d |= BIT_0;";
      break;
    case 195:
      $inst$$ = "SET 0,E";
      $code$$ = "this.e |= BIT_0;";
      break;
    case 196:
      $inst$$ = "SET 0,H";
      $code$$ = "this.h |= BIT_0;";
      break;
    case 197:
      $inst$$ = "SET 0,L";
      $code$$ = "this.l |= BIT_0;";
      break;
    case 198:
      $inst$$ = "SET 0,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
      break;
    case 199:
      $inst$$ = "SET 0,A";
      $code$$ = "this.a |= BIT_0;";
      break;
    case 200:
      $inst$$ = "SET 1,B";
      break;
    case 201:
      $inst$$ = "SET 1,C";
      break;
    case 202:
      $inst$$ = "SET 1,D";
      break;
    case 203:
      $inst$$ = "SET 1,E";
      break;
    case 204:
      $inst$$ = "SET 1,H";
      break;
    case 205:
      $inst$$ = "SET 1,L";
      break;
    case 206:
      $inst$$ = "SET 1,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
      break;
    case 207:
      $inst$$ = "SET 1,A";
      break;
    case 208:
      $inst$$ = "SET 2,B";
      break;
    case 209:
      $inst$$ = "SET 2,C";
      break;
    case 210:
      $inst$$ = "SET 2,D";
      break;
    case 211:
      $inst$$ = "SET 2,E";
      break;
    case 212:
      $inst$$ = "SET 2,H";
      break;
    case 213:
      $inst$$ = "SET 2,L";
      break;
    case 214:
      $inst$$ = "SET 2,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
      break;
    case 215:
      $inst$$ = "SET 2,A";
      break;
    case 216:
      $inst$$ = "SET 3,B";
      break;
    case 217:
      $inst$$ = "SET 3,C";
      break;
    case 218:
      $inst$$ = "SET 3,D";
      break;
    case 219:
      $inst$$ = "SET 3,E";
      break;
    case 220:
      $inst$$ = "SET 3,H";
      break;
    case 221:
      $inst$$ = "SET 3,L";
      break;
    case 222:
      $inst$$ = "SET 3,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
      break;
    case 223:
      $inst$$ = "SET 3,A";
      break;
    case 224:
      $inst$$ = "SET 4,B";
      break;
    case 225:
      $inst$$ = "SET 4,C";
      break;
    case 226:
      $inst$$ = "SET 4,D";
      break;
    case 227:
      $inst$$ = "SET 4,E";
      break;
    case 228:
      $inst$$ = "SET 4,H";
      break;
    case 229:
      $inst$$ = "SET 4,L";
      break;
    case 230:
      $inst$$ = "SET 4,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
      break;
    case 231:
      $inst$$ = "SET 4,A";
      $code$$ = "this.a |= BIT_4;";
      break;
    case 232:
      $inst$$ = "SET 5,B";
      break;
    case 233:
      $inst$$ = "SET 5,C";
      break;
    case 234:
      $inst$$ = "SET 5,D";
      break;
    case 235:
      $inst$$ = "SET 5,E";
      break;
    case 236:
      $inst$$ = "SET 5,H";
      break;
    case 237:
      $inst$$ = "SET 5,L";
      break;
    case 238:
      $inst$$ = "SET 5,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
      break;
    case 239:
      $inst$$ = "SET 5,A";
      $code$$ = "this.a |= BIT_5;";
      break;
    case 240:
      $inst$$ = "SET 6,B";
      $code$$ = "this.b |= BIT_6;";
      break;
    case 241:
      $inst$$ = "SET 6,C";
      $code$$ = "this.c |= BIT_6;";
      break;
    case 242:
      $inst$$ = "SET 6,D";
      $code$$ = "this.d |= BIT_6;";
      break;
    case 243:
      $inst$$ = "SET 6,E";
      $code$$ = "this.e |= BIT_6;";
      break;
    case 244:
      $inst$$ = "SET 6,H";
      $code$$ = "this.h |= BIT_6;";
      break;
    case 245:
      $inst$$ = "SET 6,L";
      $code$$ = "this.l |= BIT_6;";
      break;
    case 246:
      $inst$$ = "SET 6,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
      break;
    case 247:
      $inst$$ = "SET 6,A";
      $code$$ = "this.a |= BIT_6;";
      break;
    case 248:
      $inst$$ = "SET 7,B";
      $code$$ = "this.b |= BIT_7;";
      break;
    case 249:
      $inst$$ = "SET 7,C";
      $code$$ = "this.c |= BIT_7;";
      break;
    case 250:
      $inst$$ = "SET 7,D";
      $code$$ = "this.d |= BIT_7;";
      break;
    case 251:
      $inst$$ = "SET 7,E";
      $code$$ = "this.e |= BIT_7;";
      break;
    case 252:
      $inst$$ = "SET 7,H";
      $code$$ = "this.h |= BIT_7;";
      break;
    case 253:
      $inst$$ = "SET 7,L";
      $code$$ = "this.l |= BIT_7;";
      break;
    case 254:
      $inst$$ = "SET 7,(HL)";
      $code$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
      break;
    case 255:
      $inst$$ = "SET 7,A", $code$$ = "this.a |= BIT_7;"
  }
  return{opcode:$opcode$$, opcodes:$opcodesArray$$, inst:$inst$$, code:$code$$, address:$currAddr$$, nextAddress:$address$$}
}, getED:function $JSSMS$Debugger$$getED$($address$$) {
  var $toHex$$ = JSSMS.Utils.toHex, $opcode$$ = this.readRom8bit($address$$), $opcodesArray$$ = [$opcode$$], $inst$$ = "Unimplemented 0xED prefixed opcode", $currAddr$$ = $address$$, $target$$ = null, $code$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$ = "", $location$$ = 0;
  $address$$++;
  switch($opcode$$) {
    case 64:
      $inst$$ = "IN B,(C)";
      $code$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
      break;
    case 65:
      $inst$$ = "OUT (C),B";
      $code$$ = "this.port.out(this.c, this.b);";
      break;
    case 66:
      $inst$$ = "SBC HL,BC";
      $code$$ = "this.sbc16(this.getBC());";
      break;
    case 67:
      $location$$ = this.readRom16bit($address$$);
      $operand$$ = $toHex$$($location$$);
      $inst$$ = "LD (" + $operand$$ + "),BC";
      $code$$ = "this.writeMem(" + $operand$$ + ", this.c);this.writeMem(" + $toHex$$($location$$ + 1) + ", this.b);";
      $address$$ += 2;
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
      $inst$$ = "NEG";
      $code$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
      $inst$$ = "RETN / RETI";
      $code$$ = "this.pc = this.readMemWord(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
      $address$$ = null;
      break;
    case 70:
    ;
    case 78:
    ;
    case 102:
    ;
    case 110:
      $inst$$ = "IM 0";
      $code$$ = "this.im = 0x00;";
      break;
    case 71:
      $inst$$ = "LD I,A";
      $code$$ = "this.i = this.a;";
      break;
    case 72:
      $inst$$ = "IN C,(C)";
      $code$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
      break;
    case 73:
      $inst$$ = "OUT (C),C";
      $code$$ = "this.port.out(this.c, this.c);";
      break;
    case 74:
      $inst$$ = "ADC HL,BC";
      $code$$ = "this.adc16(this.getBC());";
      break;
    case 75:
      $operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD BC,(" + $operand$$ + ")";
      $code$$ = "this.setBC(this.readMemWord(" + $operand$$ + "));";
      $address$$ += 2;
      break;
    case 79:
      $inst$$ = "LD R,A";
      $code$$ = "this.r = this.a;";
      break;
    case 80:
      $inst$$ = "IN D,(C)";
      $code$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
      break;
    case 81:
      $inst$$ = "OUT (C),D";
      $code$$ = "this.port.out(this.c, this.d);";
      break;
    case 82:
      $inst$$ = "SBC HL,DE";
      $code$$ = "this.sbc16(this.getDE());";
      break;
    case 83:
      $location$$ = this.readRom16bit($address$$);
      $operand$$ = $toHex$$($location$$);
      $inst$$ = "LD (" + $operand$$ + "),DE";
      $code$$ = "this.writeMem(" + $operand$$ + ", this.e);this.writeMem(" + $toHex$$($location$$ + 1) + ", this.d);";
      $address$$ += 2;
      break;
    case 86:
    ;
    case 118:
      $inst$$ = "IM 1";
      $code$$ = "this.im = 0x01;";
      break;
    case 87:
      $inst$$ = "LD A,I";
      $code$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
      break;
    case 88:
      $inst$$ = "IN E,(C)";
      $code$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
      break;
    case 89:
      $inst$$ = "OUT (C),E";
      $code$$ = "this.port.out(this.c, this.e);";
      break;
    case 90:
      $inst$$ = "ADC HL,DE";
      $code$$ = "this.adc16(this.getDE());";
      break;
    case 91:
      $operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD DE,(" + $operand$$ + ")";
      $code$$ = "this.setDE(this.readMemWord(" + $operand$$ + "));";
      $address$$ += 2;
      break;
    case 95:
      $inst$$ = "LD A,R";
      $code$$ = REFRESH_EMULATION ? "this.a = this.r;" : "this.a = JSSMS.Utils.rndInt(0xFF);";
      $code$$ += "this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
      break;
    case 96:
      $inst$$ = "IN H,(C)";
      $code$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
      break;
    case 97:
      $inst$$ = "OUT (C),H";
      $code$$ = "this.port.out(this.c, this.h);";
      break;
    case 98:
      $inst$$ = "SBC HL,HL";
      $code$$ = "this.sbc16(this.getHL());";
      break;
    case 99:
      $location$$ = this.readRom16bit($address$$);
      $operand$$ = $toHex$$($location$$);
      $inst$$ = "LD (" + $operand$$ + "),HL";
      $code$$ = "this.writeMem(" + $operand$$ + ", this.l);this.writeMem(" + $toHex$$($location$$ + 1) + ", this.h);";
      $address$$ += 2;
      break;
    case 103:
      $inst$$ = "RRD";
      $code$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
      break;
    case 104:
      $inst$$ = "IN L,(C)";
      $code$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
      break;
    case 105:
      $inst$$ = "OUT (C),L";
      $code$$ = "this.port.out(this.c, this.l);";
      break;
    case 106:
      $inst$$ = "ADC HL,HL";
      $code$$ = "this.adc16(this.getHL());";
      break;
    case 107:
      $operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD HL,(" + $operand$$ + ")";
      $code$$ = "this.setHL(this.readMemWord(" + $operand$$ + "));";
      $address$$ += 2;
      break;
    case 111:
      $inst$$ = "RLD";
      $code$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
      break;
    case 113:
      $inst$$ = "OUT (C),0";
      $code$$ = "this.port.out(this.c, 0);";
      break;
    case 114:
      $inst$$ = "SBC HL,SP";
      $code$$ = "this.sbc16(this.sp);";
      break;
    case 115:
      $location$$ = this.readRom16bit($address$$);
      $operand$$ = $toHex$$($location$$);
      $inst$$ = "LD (" + $operand$$ + "),SP";
      $code$$ = "this.writeMem(" + $operand$$ + ", this.sp & 0xFF);this.writeMem(" + $toHex$$($location$$ + 1) + ", this.sp >> 8);";
      $address$$ += 2;
      break;
    case 120:
      $inst$$ = "IN A,(C)";
      $code$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
      break;
    case 121:
      $inst$$ = "OUT (C),A";
      $code$$ = "this.port.out(this.c, this.a);";
      break;
    case 122:
      $inst$$ = "ADC HL,SP";
      $code$$ = "this.adc16(this.sp);";
      break;
    case 123:
      $operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD SP,(" + $operand$$ + ")";
      $code$$ = "this.sp = this.readMemWord(" + $operand$$ + ");";
      $address$$ += 2;
      break;
    case 160:
      $inst$$ = "LDI";
      $code$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();this.f = this.f & 0xC1 | (this.getBC() != 0x00 ? F_PARITY : 0x00);";
      break;
    case 161:
      $inst$$ = "CPI";
      $code$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
      break;
    case 162:
      $inst$$ = "INI";
      $code$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 163:
      $inst$$ = "OUTI";
      $code$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 168:
      $inst$$ = "LDD";
      break;
    case 169:
      $inst$$ = "CPD";
      break;
    case 170:
      $inst$$ = "IND";
      $code$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 171:
      $inst$$ = "OUTD";
      $code$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 176:
      $inst$$ = "LDIR";
      $code$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();";
      ACCURATE_INTERRUPT_EMULATION ? ($target$$ = $address$$ - 2, $code$$ += "if (this.getBC() != 0x00) {this.tstates -= 0x05;this.f |= F_PARITY;return;} else {") : $code$$ += "for (;this.getBC() != 0x00; this.f |= F_PARITY, this.tstates -= 5) {this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();}if (!(this.getBC() != 0x00)) {";
      $code$$ += "this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 177:
      $inst$$ = "CPIR";
      $code$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);";
      ACCURATE_INTERRUPT_EMULATION ? ($target$$ = $address$$ - 2, $code$$ += "if ((temp & F_PARITY) != 0x00 && (this.f & F_ZERO) == 0x00) {this.tstates -= 0x05;this.pc = " + $toHex$$($target$$) + ";return;}") : $code$$ += "for (;(temp & F_PARITY) != 0x00 && (this.f & F_ZERO) == 0x00; this.tstates -= 5) {temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);}";
      $code$$ += "this.f = (this.f & 0xF8) | temp;";
      break;
    case 178:
      $target$$ = $address$$ - 2;
      $inst$$ = "INIR";
      $code$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 179:
      $inst$$ = "OTIR";
      $code$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();";
      ACCURATE_INTERRUPT_EMULATION ? ($target$$ = $address$$ - 2, $code$$ += "if (this.b != 0x00) {this.tstates -= 0x05;return;}") : $code$$ += "for (;this.b != 0x00; this.tstates -= 5) {temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();}";
      $code$$ += "if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 184:
      $inst$$ = "LDDR";
      break;
    case 185:
      $inst$$ = "CPDR";
      break;
    case 186:
      $target$$ = $address$$ - 2;
      $inst$$ = "INDR";
      $code$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      break;
    case 187:
      $target$$ = $address$$ - 2, $inst$$ = "OTDR", $code$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}"
  }
  return{opcode:$opcode$$, opcodes:$opcodesArray$$, inst:$inst$$, code:$code$$, address:$currAddr$$, nextAddress:$address$$, target:$target$$}
}, getIndex:function $JSSMS$Debugger$$getIndex$($index$$, $address$$) {
  var $toHex$$ = JSSMS.Utils.toHex, $opcode$$ = this.readRom8bit($address$$), $opcodesArray$$ = [$opcode$$], $inst$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$ = $address$$, $code$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $_inst$$1_operand$$ = "", $location$$28_offset$$ = 0;
  $address$$++;
  $location$$28_offset$$ = 0;
  $_inst$$1_operand$$ = {};
  switch($opcode$$) {
    case 9:
      $inst$$ = "ADD " + $index$$ + ",BC";
      $code$$ = "this.set" + $index$$ + "(this.add16(this.get" + $index$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$ = "ADD " + $index$$ + ",DE";
      $code$$ = "this.set" + $index$$ + "(this.add16(this.get" + $index$$ + "(), this.getDE()));";
      break;
    case 33:
      $_inst$$1_operand$$ = $toHex$$(this.readRom16bit($address$$));
      $inst$$ = "LD " + $index$$ + "," + $_inst$$1_operand$$;
      $code$$ = "this.set" + $index$$ + "(" + $_inst$$1_operand$$ + ");";
      $address$$ += 2;
      break;
    case 34:
      $location$$28_offset$$ = this.readRom16bit($address$$);
      $_inst$$1_operand$$ = $toHex$$($location$$28_offset$$);
      $inst$$ = "LD (" + $_inst$$1_operand$$ + ")," + $index$$;
      $code$$ = "this.writeMem(" + $_inst$$1_operand$$ + ", this." + $index$$.toLowerCase() + "L);this.writeMem(" + $toHex$$($location$$28_offset$$ + 1) + ", this." + $index$$.toLowerCase() + "H);";
      $address$$ += 2;
      break;
    case 35:
      $inst$$ = "INC " + $index$$;
      $code$$ = "this.inc" + $index$$ + "();";
      break;
    case 36:
      $inst$$ = "INC " + $index$$ + "H *";
      break;
    case 37:
      $inst$$ = "DEC " + $index$$ + "H *";
      break;
    case 38:
      $inst$$ = "LD " + $index$$ + "H," + $toHex$$(this.readRom8bit($address$$)) + " *";
      $address$$++;
      break;
    case 41:
      $inst$$ = "ADD " + $index$$ + "  " + $index$$;
      break;
    case 42:
      $location$$28_offset$$ = this.readRom16bit($address$$);
      $inst$$ = "LD " + $index$$ + " (" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.ixL = this.readMem(" + $toHex$$($location$$28_offset$$) + ");this.ixH = this.readMem(" + $toHex$$($location$$28_offset$$ + 1) + ");";
      $address$$ += 2;
      break;
    case 43:
      $inst$$ = "DEC " + $index$$;
      $code$$ = "this.dec" + $index$$ + "();";
      break;
    case 44:
      $inst$$ = "INC " + $index$$ + "L *";
      break;
    case 45:
      $inst$$ = "DEC " + $index$$ + "L *";
      break;
    case 46:
      $inst$$ = "LD " + $index$$ + "L," + $toHex$$(this.readRom8bit($address$$));
      $address$$++;
      break;
    case 52:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "INC (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.incMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 53:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "DEC (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.decMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 54:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $_inst$$1_operand$$ = $toHex$$(this.readRom8bit($address$$ + 1));
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")," + $_inst$$1_operand$$;
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", " + $_inst$$1_operand$$ + ");";
      $address$$ += 2;
      break;
    case 57:
      $inst$$ = "ADD " + $index$$ + " SP";
      $code$$ = "this.set" + $index$$ + "(this.add16(this.get" + $index$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$ = "LD B," + $index$$ + "H *";
      break;
    case 69:
      $inst$$ = "LD B," + $index$$ + "L *";
      break;
    case 70:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD B,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.b = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 76:
      $inst$$ = "LD C," + $index$$ + "H *";
      break;
    case 77:
      $inst$$ = "LD C," + $index$$ + "L *";
      break;
    case 78:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD C,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.c = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 84:
      $inst$$ = "LD D," + $index$$ + "H *";
      break;
    case 85:
      $inst$$ = "LD D," + $index$$ + "L *";
      break;
    case 86:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD D,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.d = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 92:
      $inst$$ = "LD E," + $index$$ + "H *";
      break;
    case 93:
      $inst$$ = "LD E," + $index$$ + "L *";
      break;
    case 94:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD E,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.e = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 96:
      $inst$$ = "LD " + $index$$ + "H,B *";
      break;
    case 97:
      $inst$$ = "LD " + $index$$ + "H,C *";
      break;
    case 98:
      $inst$$ = "LD " + $index$$ + "H,D *";
      break;
    case 99:
      $inst$$ = "LD " + $index$$ + "H,E *";
      break;
    case 100:
      $inst$$ = "LD " + $index$$ + "H," + $index$$ + "H*";
      break;
    case 101:
      $inst$$ = "LD " + $index$$ + "H," + $index$$ + "L *";
      break;
    case 102:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD H,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.h = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 103:
      $inst$$ = "LD " + $index$$ + "H,A *";
      break;
    case 104:
      $inst$$ = "LD " + $index$$ + "L,B *";
      break;
    case 105:
      $inst$$ = "LD " + $index$$ + "L,C *";
      break;
    case 106:
      $inst$$ = "LD " + $index$$ + "L,D *";
      break;
    case 107:
      $inst$$ = "LD " + $index$$ + "L,E *";
      break;
    case 108:
      $inst$$ = "LD " + $index$$ + "L," + $index$$ + "H *";
      break;
    case 109:
      $inst$$ = "LD " + $index$$ + "L," + $index$$ + "L *";
      $code$$ = "";
      break;
    case 110:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD L,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.l = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 111:
      $inst$$ = "LD " + $index$$ + "L,A *";
      $code$$ = "this." + $index$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),B";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.b);";
      $address$$++;
      break;
    case 113:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),C";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.c);";
      $address$$++;
      break;
    case 114:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),D";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.d);";
      $address$$++;
      break;
    case 115:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),E";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.e);";
      $address$$++;
      break;
    case 116:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),H";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.h);";
      $address$$++;
      break;
    case 117:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),L";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.l);";
      $address$$++;
      break;
    case 119:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + "),A";
      $code$$ = "this.writeMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ", this.a);";
      $address$$++;
      break;
    case 124:
      $inst$$ = "LD A," + $index$$ + "H *";
      break;
    case 125:
      $inst$$ = "LD A," + $index$$ + "L *";
      break;
    case 126:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "LD A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.a = this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ");";
      $address$$++;
      break;
    case 132:
      $inst$$ = "ADD A," + $index$$ + "H *";
      break;
    case 133:
      $inst$$ = "ADD A," + $index$$ + "L *";
      break;
    case 134:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "ADD A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.add_a(this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + "));";
      $address$$++;
      break;
    case 140:
      $inst$$ = "ADC A," + $index$$ + "H *";
      break;
    case 141:
      $inst$$ = "ADC A," + $index$$ + "L *";
      break;
    case 142:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "ADC A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.adc_a(this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + "));";
      $address$$++;
      break;
    case 148:
      $inst$$ = "SUB " + $index$$ + "H *";
      break;
    case 149:
      $inst$$ = "SUB " + $index$$ + "L *";
      break;
    case 150:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "SUB A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.sub_a(this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + "));";
      $address$$++;
      break;
    case 156:
      $inst$$ = "SBC A," + $index$$ + "H *";
      break;
    case 157:
      $inst$$ = "SBC A," + $index$$ + "L *";
      break;
    case 158:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "SBC A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.sbc_a(this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + "));";
      $address$$++;
      break;
    case 164:
      $inst$$ = "AND " + $index$$ + "H *";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$ = "AND " + $index$$ + "L *";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$.toLowerCase() + "L];";
      break;
    case 166:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "AND A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ")] | F_HALFCARRY;";
      $address$$++;
      break;
    case 172:
      $inst$$ = "XOR A " + $index$$ + "H*";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$ = "XOR A " + $index$$ + "L*";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$.toLowerCase() + "L];";
      break;
    case 174:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "XOR A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ")];";
      $address$$++;
      break;
    case 180:
      $inst$$ = "OR A " + $index$$ + "H*";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$ = "OR A " + $index$$ + "L*";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$.toLowerCase() + "L];";
      break;
    case 182:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "OR A,(" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + ")];";
      $address$$++;
      break;
    case 188:
      $inst$$ = "CP " + $index$$ + "H *";
      $code$$ = "this.cp_a(this." + $index$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$ = "CP " + $index$$ + "L *";
      $code$$ = "this.cp_a(this." + $index$$.toLowerCase() + "L);";
      break;
    case 190:
      $location$$28_offset$$ = this.readRom8bit($address$$);
      $inst$$ = "CP (" + $index$$ + "+" + $toHex$$($location$$28_offset$$) + ")";
      $code$$ = "this.cp_a(this.readMem(this.get" + $index$$ + "() + " + $toHex$$($location$$28_offset$$) + "));";
      $address$$++;
      break;
    case 203:
      $_inst$$1_operand$$ = this.getIndexCB($index$$, $address$$);
      $inst$$ = $_inst$$1_operand$$.inst;
      $code$$ = $_inst$$1_operand$$.code;
      $opcodesArray$$ = $opcodesArray$$.concat($_inst$$1_operand$$.opcodes);
      $address$$ = $_inst$$1_operand$$.nextAddress;
      break;
    case 225:
      $inst$$ = "POP " + $index$$;
      $code$$ = "this.set" + $index$$ + "(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$ = "EX SP,(" + $index$$ + ")";
      $code$$ = "temp = this.get" + $index$$ + "();this.set" + $index$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$ = "PUSH " + $index$$;
      $code$$ = "this.push2(this." + $index$$.toLowerCase() + "H, this." + $index$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$ = "JP (" + $index$$ + ")";
      $code$$ = "this.pc = this.get" + $index$$ + "(); return;";
      $address$$ = null;
      break;
    case 249:
      $inst$$ = "LD SP," + $index$$, $code$$ = "this.sp = this.get" + $index$$ + "();"
  }
  return{opcode:$opcode$$, opcodes:$opcodesArray$$, inst:$inst$$, code:$code$$, address:$currAddr$$, nextAddress:$address$$}
}, getIndexCB:function $JSSMS$Debugger$$getIndexCB$($index$$, $address$$) {
  var $location$$29_toHex$$ = JSSMS.Utils.toHex, $opcode$$ = this.readRom8bit($address$$), $opcodesArray$$ = [$opcode$$], $inst$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode", $currAddr$$ = $address$$, $code$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
  $address$$++;
  $location$$29_toHex$$ = "location = this.get" + $index$$ + "() + " + $location$$29_toHex$$(this.readRom8bit($address$$)) + " & 0xFFFF;";
  switch($opcode$$) {
    case 0:
      $inst$$ = "LD B,RLC (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
      break;
    case 1:
      $inst$$ = "LD C,RLC (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
      break;
    case 2:
      $inst$$ = "LD D,RLC (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
      break;
    case 3:
      $inst$$ = "LD E,RLC (" + $index$$ + ")";
      break;
    case 4:
      $inst$$ = "LD H,RLC (" + $index$$ + ")";
      break;
    case 5:
      $inst$$ = "LD L,RLC (" + $index$$ + ")";
      break;
    case 6:
      $inst$$ = "RLC (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.writeMem(location, this.rlc(this.readMem(location)));";
      break;
    case 7:
      $inst$$ = "LD A,RLC (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
      break;
    case 8:
      $inst$$ = "LD B,RRC (" + $index$$ + ")";
      break;
    case 9:
      $inst$$ = "LD C,RRC (" + $index$$ + ")";
      break;
    case 10:
      $inst$$ = "LD D,RRC (" + $index$$ + ")";
      break;
    case 11:
      $inst$$ = "LD E,RRC (" + $index$$ + ")";
      break;
    case 12:
      $inst$$ = "LD H,RRC (" + $index$$ + ")";
      break;
    case 13:
      $inst$$ = "LD L,RRC (" + $index$$ + ")";
      break;
    case 14:
      $inst$$ = "RRC (" + $index$$ + ")";
      break;
    case 15:
      $inst$$ = "LD A,RRC (" + $index$$ + ")";
      break;
    case 16:
      $inst$$ = "LD B,RL (" + $index$$ + ")";
      break;
    case 17:
      $inst$$ = "LD C,RL (" + $index$$ + ")";
      break;
    case 18:
      $inst$$ = "LD D,RL (" + $index$$ + ")";
      break;
    case 19:
      $inst$$ = "LD E,RL (" + $index$$ + ")";
      break;
    case 20:
      $inst$$ = "LD H,RL (" + $index$$ + ")";
      break;
    case 21:
      $inst$$ = "LD L,RL (" + $index$$ + ")";
      break;
    case 22:
      $inst$$ = "RL (" + $index$$ + ")";
      break;
    case 23:
      $inst$$ = "LD A,RL (" + $index$$ + ")";
      break;
    case 24:
      $inst$$ = "LD B,RR (" + $index$$ + ")";
      break;
    case 25:
      $inst$$ = "LD C,RR (" + $index$$ + ")";
      break;
    case 26:
      $inst$$ = "LD D,RR (" + $index$$ + ")";
      break;
    case 27:
      $inst$$ = "LD E,RR (" + $index$$ + ")";
      break;
    case 28:
      $inst$$ = "LD H,RR (" + $index$$ + ")";
      break;
    case 29:
      $inst$$ = "LD L,RR (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
      break;
    case 30:
      $inst$$ = "RR (" + $index$$ + ")";
      break;
    case 31:
      $inst$$ = "LD A,RR (" + $index$$ + ")";
      $code$$ = $location$$29_toHex$$ + "this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a);";
      break;
    case 32:
      $inst$$ = "LD B,SLA (" + $index$$ + ")";
      break;
    case 33:
      $inst$$ = "LD C,SLA (" + $index$$ + ")";
      break;
    case 34:
      $inst$$ = "LD D,SLA (" + $index$$ + ")";
      break;
    case 35:
      $inst$$ = "LD E,SLA (" + $index$$ + ")";
      break;
    case 36:
      $inst$$ = "LD H,SLA (" + $index$$ + ")";
      break;
    case 37:
      $inst$$ = "LD L,SLA (" + $index$$ + ")";
      break;
    case 38:
      $inst$$ = "SLA (" + $index$$ + ")";
      break;
    case 39:
      $inst$$ = "LD A,SLA (" + $index$$ + ")";
      break;
    case 40:
      $inst$$ = "LD B,SRA (" + $index$$ + ")";
      break;
    case 41:
      $inst$$ = "LD C,SRA (" + $index$$ + ")";
      break;
    case 42:
      $inst$$ = "LD D,SRA (" + $index$$ + ")";
      break;
    case 43:
      $inst$$ = "LD E,SRA (" + $index$$ + ")";
      break;
    case 44:
      $inst$$ = "LD H,SRA (" + $index$$ + ")";
      break;
    case 45:
      $inst$$ = "LD L,SRA (" + $index$$ + ")";
      break;
    case 46:
      $inst$$ = "SRA (" + $index$$ + ")";
      break;
    case 47:
      $inst$$ = "LD A,SRA (" + $index$$ + ")";
      break;
    case 48:
      $inst$$ = "LD B,SLL (" + $index$$ + ")";
      break;
    case 49:
      $inst$$ = "LD C,SLL (" + $index$$ + ")";
      break;
    case 50:
      $inst$$ = "LD D,SLL (" + $index$$ + ")";
      break;
    case 51:
      $inst$$ = "LD E,SLL (" + $index$$ + ")";
      break;
    case 52:
      $inst$$ = "LD H,SLL (" + $index$$ + ")";
      break;
    case 53:
      $inst$$ = "LD L,SLL (" + $index$$ + ")";
      break;
    case 54:
      $inst$$ = "SLL (" + $index$$ + ") *";
      break;
    case 55:
      $inst$$ = "LD A,SLL (" + $index$$ + ")";
      break;
    case 56:
      $inst$$ = "LD B,SRL (" + $index$$ + ")";
      break;
    case 57:
      $inst$$ = "LD C,SRL (" + $index$$ + ")";
      break;
    case 58:
      $inst$$ = "LD D,SRL (" + $index$$ + ")";
      break;
    case 59:
      $inst$$ = "LD E,SRL (" + $index$$ + ")";
      break;
    case 60:
      $inst$$ = "LD H,SRL (" + $index$$ + ")";
      break;
    case 61:
      $inst$$ = "LD L,SRL (" + $index$$ + ")";
      break;
    case 62:
      $inst$$ = "SRL (" + $index$$ + ")";
      break;
    case 63:
      $inst$$ = "LD A,SRL (" + $index$$ + ")";
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
      $inst$$ = "BIT 0,(" + $index$$ + ")";
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
      $inst$$ = "BIT 1,(" + $index$$ + ")";
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
      $inst$$ = "BIT 2,(" + $index$$ + ")";
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
      $inst$$ = "BIT 3,(" + $index$$ + ")";
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
      $inst$$ = "BIT 4,(" + $index$$ + ")";
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
      $inst$$ = "BIT 5,(" + $index$$ + ")";
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
      $inst$$ = "BIT 6,(" + $index$$ + ")";
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
      $inst$$ = "BIT 7,(" + $index$$ + ")";
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
      $inst$$ = "RES 0,(" + $index$$ + ")";
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
      $inst$$ = "RES 1,(" + $index$$ + ")";
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
      $inst$$ = "RES 2,(" + $index$$ + ")";
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
      $inst$$ = "RES 3,(" + $index$$ + ")";
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
      $inst$$ = "RES 4,(" + $index$$ + ")";
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
      $inst$$ = "RES 5,(" + $index$$ + ")";
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
      $inst$$ = "RES 6,(" + $index$$ + ")";
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
      $inst$$ = "RES 7,(" + $index$$ + ")";
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
      $inst$$ = "SET 0,(" + $index$$ + ")";
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
      $inst$$ = "SET 1,(" + $index$$ + ")";
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
      $inst$$ = "SET 2,(" + $index$$ + ")";
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
      $inst$$ = "SET 3,(" + $index$$ + ")";
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
      $inst$$ = "SET 4,(" + $index$$ + ")";
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
      $inst$$ = "SET 5,(" + $index$$ + ")";
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
      $inst$$ = "SET 6,(" + $index$$ + ")";
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
      $inst$$ = "SET 7,(" + $index$$ + ")"
  }
  $address$$++;
  return{opcode:$opcode$$, opcodes:$opcodesArray$$, inst:$inst$$, code:$code$$, address:$currAddr$$, nextAddress:$address$$}
}, getIndexOpIX:function $JSSMS$Debugger$$getIndexOpIX$($opcode$$) {
  return this.getIndex("IX", $opcode$$)
}, getIndexOpIY:function $JSSMS$Debugger$$getIndexOpIY$($opcode$$) {
  return this.getIndex("IY", $opcode$$)
}, readRom8bit:function $JSSMS$Debugger$$readRom8bit$($address$$) {
  return SUPPORT_DATAVIEW ? this.rom[$address$$ >> 14].getUint8($address$$ & 16383) : this.rom[$address$$ >> 14][$address$$ & 16383] & 255
}, readRom16bit:function $JSSMS$Debugger$$readRom16bit$($address$$) {
  return SUPPORT_DATAVIEW ? 16383 > ($address$$ & 16383) ? this.rom[$address$$ >> 14].getUint16($address$$ & 16383, LITTLE_ENDIAN) : this.rom[$address$$ >> 14].getUint8($address$$ & 16383) | this.rom[++$address$$ >> 14].getUint8($address$$ & 16383) << 8 : this.rom[$address$$ >> 14][$address$$ & 16383] & 255 | (this.rom[++$address$$ >> 14][$address$$ & 16383] & 255) << 8
}, peepholePortOut:function $JSSMS$Debugger$$peepholePortOut$($port$$) {
  return"this.port.out(" + JSSMS.Utils.toHex($port$$) + ", this.a);"
}, peepholePortIn:function $JSSMS$Debugger$$peepholePortIn$($port$$) {
  return"this.a = this.port.in_(" + JSSMS.Utils.toHex($port$$) + ");"
}};
function Instruction($options$$) {
  var $toHex$$ = JSSMS.Utils.toHex, $defaultInstruction$$ = {address:0, hexAddress:"", opcode:0, opcodes:[], inst:"", code:"", nextAddress:null, target:null, isJumpTarget:!1, jumpTargetNb:0, label:""}, $prop$$, $hexOpcodes$$ = "";
  for($prop$$ in $defaultInstruction$$) {
    void 0 != $options$$[$prop$$] && ($defaultInstruction$$[$prop$$] = $options$$[$prop$$])
  }
  $defaultInstruction$$.hexAddress = $toHex$$($defaultInstruction$$.address);
  $defaultInstruction$$.opcodes.length && ($hexOpcodes$$ = $defaultInstruction$$.opcodes.map($toHex$$).join(" ") + " ");
  $defaultInstruction$$.label = $defaultInstruction$$.hexAddress + " " + $hexOpcodes$$ + $defaultInstruction$$.inst;
  return $defaultInstruction$$
}
;var KEY_UP = 1, KEY_DOWN = 2, KEY_LEFT = 4, KEY_RIGHT = 8, KEY_FIRE1 = 16, KEY_FIRE2 = 32, KEY_START = 64;
JSSMS.Keyboard = function $JSSMS$Keyboard$($sms$$) {
  this.main = $sms$$;
  this.lightgunY = this.lightgunX = this.ggstart = this.controller2 = this.controller1 = 0;
  this.lightgunEnabled = this.lightgunClick = !1
};
JSSMS.Keyboard.prototype = {reset:function $JSSMS$Keyboard$$reset$() {
  this.ggstart = this.controller2 = this.controller1 = 255;
  LIGHTGUN && (this.lightgunClick = !1);
  this.pause_button = !1
}, keydown:function $JSSMS$Keyboard$$keydown$($evt$$) {
  switch($evt$$.keyCode) {
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
      this.main.is_sms ? this.main.pause_button = !0 : this.ggstart &= -129;
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
      return
  }
  $evt$$.preventDefault()
}, keyup:function $JSSMS$Keyboard$$keyup$($evt$$) {
  switch($evt$$.keyCode) {
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
      this.main.is_sms || (this.ggstart |= 128);
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
      return
  }
  $evt$$.preventDefault()
}};
var SCALE = 8, NO_ANTIALIAS = Number.MIN_VALUE, SHIFT_RESET = 32768, FEEDBACK_PATTERN = 9, PSG_VOLUME = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0], HI_BOUNDARY = 127, LO_BOUNDARY = -128;
JSSMS.SN76489 = function $JSSMS$SN76489$($sms$$) {
  this.main = $sms$$;
  this.clockFrac = this.clock = 0;
  this.reg = Array(8);
  this.regLatch = 0;
  this.freqCounter = Array(4);
  this.freqPolarity = Array(4);
  this.freqPos = Array(3);
  this.noiseFreq = 16;
  this.noiseShiftReg = SHIFT_RESET;
  this.outputChannel = Array(4)
};
JSSMS.SN76489.prototype = {init:function $JSSMS$SN76489$$init$($clockSpeed$$, $sampleRate$$) {
  this.clock = ($clockSpeed$$ << SCALE) / 16 / $sampleRate$$;
  this.regLatch = this.clockFrac = 0;
  this.noiseFreq = 16;
  this.noiseShiftReg = SHIFT_RESET;
  for(var $i$$ = 0;4 > $i$$;$i$$++) {
    this.reg[$i$$ << 1] = 1, this.reg[($i$$ << 1) + 1] = 15, this.freqCounter[$i$$] = 0, this.freqPolarity[$i$$] = 1, 3 != $i$$ && (this.freqPos[$i$$] = NO_ANTIALIAS)
  }
}, write:function $JSSMS$SN76489$$write$($value$$) {
  0 != ($value$$ & 128) ? (this.regLatch = $value$$ >> 4 & 7, this.reg[this.regLatch] = this.reg[this.regLatch] & 1008 | $value$$ & 15) : this.reg[this.regLatch] = 0 == this.regLatch || 2 == this.regLatch || 4 == this.regLatch ? this.reg[this.regLatch] & 15 | ($value$$ & 63) << 4 : $value$$ & 15;
  switch(this.regLatch) {
    case 0:
    ;
    case 2:
    ;
    case 4:
      0 == this.reg[this.regLatch] && (this.reg[this.regLatch] = 1);
      break;
    case 6:
      this.noiseFreq = 16 << (this.reg[6] & 3), this.noiseShiftReg = SHIFT_RESET
  }
}, update:function $JSSMS$SN76489$$update$($offset$$, $samplesToGenerate$$) {
  for(var $buffer$$ = [], $sample$$ = 0, $feedback_i$$ = 0;$sample$$ < $samplesToGenerate$$;$sample$$++) {
    for($feedback_i$$ = 0;3 > $feedback_i$$;$feedback_i$$++) {
      this.outputChannel[$feedback_i$$] = this.freqPos[$feedback_i$$] != NO_ANTIALIAS ? PSG_VOLUME[this.reg[($feedback_i$$ << 1) + 1]] * this.freqPos[$feedback_i$$] >> SCALE : PSG_VOLUME[this.reg[($feedback_i$$ << 1) + 1]] * this.freqPolarity[$feedback_i$$]
    }
    this.outputChannel[3] = PSG_VOLUME[this.reg[7]] * (this.noiseShiftReg & 1) << 1;
    $feedback_i$$ = this.outputChannel[0] + this.outputChannel[1] + this.outputChannel[2] + this.outputChannel[3];
    $feedback_i$$ > HI_BOUNDARY ? $feedback_i$$ = HI_BOUNDARY : $feedback_i$$ < LO_BOUNDARY && ($feedback_i$$ = LO_BOUNDARY);
    $buffer$$[$offset$$ + $sample$$] = $feedback_i$$;
    this.clockFrac += this.clock;
    var $clockCycles$$ = this.clockFrac >> SCALE, $clockCyclesScaled$$ = $clockCycles$$ << SCALE;
    this.clockFrac -= $clockCyclesScaled$$;
    this.freqCounter[0] -= $clockCycles$$;
    this.freqCounter[1] -= $clockCycles$$;
    this.freqCounter[2] -= $clockCycles$$;
    this.freqCounter[3] = 128 == this.noiseFreq ? this.freqCounter[2] : this.freqCounter[3] - $clockCycles$$;
    for($feedback_i$$ = 0;3 > $feedback_i$$;$feedback_i$$++) {
      var $counter$$ = this.freqCounter[$feedback_i$$];
      if(0 >= $counter$$) {
        var $tone$$ = this.reg[$feedback_i$$ << 1];
        6 < $tone$$ ? (this.freqPos[$feedback_i$$] = ($clockCyclesScaled$$ - this.clockFrac + (2 << SCALE) * $counter$$ << SCALE) * this.freqPolarity[$feedback_i$$] / ($clockCyclesScaled$$ + this.clockFrac), this.freqPolarity[$feedback_i$$] = -this.freqPolarity[$feedback_i$$]) : (this.freqPolarity[$feedback_i$$] = 1, this.freqPos[$feedback_i$$] = NO_ANTIALIAS);
        this.freqCounter[$feedback_i$$] += $tone$$ * ($clockCycles$$ / $tone$$ + 1)
      }else {
        this.freqPos[$feedback_i$$] = NO_ANTIALIAS
      }
    }
    0 >= this.freqCounter[3] && (this.freqPolarity[3] = -this.freqPolarity[3], 128 != this.noiseFreq && (this.freqCounter[3] += this.noiseFreq * ($clockCycles$$ / this.noiseFreq + 1)), 1 == this.freqPolarity[3] && ($feedback_i$$ = 0, $feedback_i$$ = 0 != (this.reg[6] & 4) ? 0 != (this.noiseShiftReg & FEEDBACK_PATTERN) && 0 != (this.noiseShiftReg & FEEDBACK_PATTERN ^ FEEDBACK_PATTERN) ? 1 : 0 : this.noiseShiftReg & 1, this.noiseShiftReg = this.noiseShiftReg >> 1 | $feedback_i$$ << 15))
  }
  return $buffer$$
}};
var NTSC = 0, PAL = 1, SMS_X_PIXELS = 342, SMS_Y_PIXELS_NTSC = 262, SMS_Y_PIXELS_PAL = 313, SMS_WIDTH = 256, SMS_HEIGHT = 192, GG_WIDTH = 160, GG_HEIGHT = 144, GG_X_OFFSET = 48, GG_Y_OFFSET = 24, STATUS_VINT = 128, STATUS_OVERFLOW = 64, STATUS_COLLISION = 32, STATUS_HINT = 4, BGT_LENGTH = 1792, SPRITES_PER_LINE = 8, SPRITE_COUNT = 0, SPRITE_X = 1, SPRITE_Y = 2, SPRITE_N = 3, TOTAL_TILES = 512, TILE_SIZE = 8;
JSSMS.Vdp = function $JSSMS$Vdp$($sms$$) {
  this.main = $sms$$;
  var $i$$ = 0;
  this.videoMode = NTSC;
  this.VRAM = Array(16384);
  this.CRAM = Array(96);
  for($i$$ = 0;96 > $i$$;$i$$++) {
    this.CRAM[$i$$] = 255
  }
  this.vdpreg = Array(16);
  this.status = 0;
  this.firstByte = !1;
  this.counter = this.line = this.readBuffer = this.operation = this.location = this.commandByte = 0;
  this.bgPriority = Array(SMS_WIDTH);
  VDP_SPRITE_COLLISIONS && (this.spriteCol = Array(SMS_WIDTH));
  this.vScrollLatch = this.bgt = 0;
  this.display = $sms$$.ui.canvasImageData.data;
  this.main_JAVA_R = Array(64);
  this.main_JAVA_G = Array(64);
  this.main_JAVA_B = Array(64);
  this.GG_JAVA_R = Array(256);
  this.GG_JAVA_G = Array(256);
  this.GG_JAVA_B = Array(16);
  this.sat = this.h_end = this.h_start = 0;
  this.isSatDirty = !1;
  this.lineSprites = Array(SMS_HEIGHT);
  for($i$$ = 0;$i$$ < SMS_HEIGHT;$i$$++) {
    this.lineSprites[$i$$] = Array(1 + 3 * SPRITES_PER_LINE)
  }
  this.tiles = Array(TOTAL_TILES);
  this.isTileDirty = Array(TOTAL_TILES);
  this.maxDirty = this.minDirty = 0;
  this.createCachedImages();
  this.generateConvertedPals()
};
JSSMS.Vdp.prototype = {reset:function $JSSMS$Vdp$$reset$() {
  var $i$$;
  this.firstByte = !0;
  for($i$$ = this.operation = this.status = this.counter = this.location = 0;16 > $i$$;$i$$++) {
    this.vdpreg[$i$$] = 0
  }
  this.vdpreg[2] = 14;
  this.vdpreg[5] = 126;
  this.vScrollLatch = 0;
  this.main.cpu.interruptLine = !1;
  this.isSatDirty = !0;
  this.minDirty = TOTAL_TILES;
  this.maxDirty = -1;
  for($i$$ = 0;16384 > $i$$;$i$$++) {
    this.VRAM[$i$$] = 0
  }
  for($i$$ = 0;$i$$ < 4 * SMS_WIDTH * SMS_HEIGHT;$i$$ += 4) {
    this.display[$i$$] = 0, this.display[$i$$ + 1] = 0, this.display[$i$$ + 2] = 0, this.display[$i$$ + 3] = 255
  }
}, forceFullRedraw:function $JSSMS$Vdp$$forceFullRedraw$() {
  this.bgt = (this.vdpreg[2] & 14) << 10;
  this.minDirty = 0;
  this.maxDirty = TOTAL_TILES - 1;
  for(var $i$$ = 0, $l$$ = this.isTileDirty.length;$i$$ < $l$$;$i$$++) {
    this.isTileDirty[$i$$] = !0
  }
  this.sat = (this.vdpreg[5] & -130) << 7;
  this.isSatDirty = !0
}, getVCount:function $JSSMS$Vdp$$getVCount$() {
  if(this.videoMode == NTSC) {
    if(218 < this.line) {
      return this.line - 6
    }
  }else {
    if(242 < this.line) {
      return this.line - 57
    }
  }
  return this.line
}, controlRead:function $JSSMS$Vdp$$controlRead$() {
  this.firstByte = !0;
  var $statuscopy$$ = this.status;
  this.status = 0;
  this.main.cpu.interruptLine = !1;
  return $statuscopy$$
}, controlWrite:function $JSSMS$Vdp$$controlWrite$($reg$$1_value$$) {
  if(this.firstByte) {
    this.firstByte = !1, this.commandByte = $reg$$1_value$$, this.location = this.location & 16128 | $reg$$1_value$$
  }else {
    if(this.firstByte = !0, this.operation = $reg$$1_value$$ >> 6 & 3, this.location = this.commandByte | $reg$$1_value$$ << 8, 0 == this.operation) {
      this.readBuffer = this.VRAM[this.location++ & 16383] & 255
    }else {
      if(2 == this.operation) {
        $reg$$1_value$$ &= 15;
        switch($reg$$1_value$$) {
          case 0:
            ACCURATE_INTERRUPT_EMULATION && 0 != (this.status & STATUS_HINT) && (this.main.cpu.interruptLine = 0 != (this.commandByte & 16));
            break;
          case 1:
            0 != (this.status & STATUS_VINT) && 0 != (this.commandByte & 32) && (this.main.cpu.interruptLine = !0);
            (this.commandByte & 3) != (this.vdpreg[$reg$$1_value$$] & 3) && (this.isSatDirty = !0);
            break;
          case 2:
            this.bgt = (this.commandByte & 14) << 10;
            break;
          case 5:
            var $old$$ = this.sat;
            this.sat = (this.commandByte & -130) << 7;
            $old$$ != this.sat && (this.isSatDirty = !0)
        }
        this.vdpreg[$reg$$1_value$$] = this.commandByte
      }
    }
  }
}, dataRead:function $JSSMS$Vdp$$dataRead$() {
  this.firstByte = !0;
  var $value$$ = this.readBuffer;
  this.readBuffer = this.VRAM[this.location++ & 16383] & 255;
  return $value$$
}, dataWrite:function $JSSMS$Vdp$$dataWrite$($value$$) {
  var $address$$13_temp$$ = 0;
  this.firstByte = !0;
  switch(this.operation) {
    case 0:
    ;
    case 1:
    ;
    case 2:
      $address$$13_temp$$ = this.location & 16383;
      if($value$$ != (this.VRAM[$address$$13_temp$$] & 255)) {
        if($address$$13_temp$$ >= this.sat && $address$$13_temp$$ < this.sat + 64) {
          this.isSatDirty = !0
        }else {
          if($address$$13_temp$$ >= this.sat + 128 && $address$$13_temp$$ < this.sat + 256) {
            this.isSatDirty = !0
          }else {
            var $tileIndex$$ = $address$$13_temp$$ >> 5;
            this.isTileDirty[$tileIndex$$] = !0;
            $tileIndex$$ < this.minDirty && (this.minDirty = $tileIndex$$);
            $tileIndex$$ > this.maxDirty && (this.maxDirty = $tileIndex$$)
          }
        }
        this.VRAM[$address$$13_temp$$] = $value$$
      }
      break;
    case 3:
      this.main.is_sms ? ($address$$13_temp$$ = 3 * (this.location & 31), this.CRAM[$address$$13_temp$$] = this.main_JAVA_R[$value$$], this.CRAM[$address$$13_temp$$ + 1] = this.main_JAVA_G[$value$$], this.CRAM[$address$$13_temp$$ + 2] = this.main_JAVA_B[$value$$]) : ($address$$13_temp$$ = 3 * ((this.location & 63) >> 1), 0 == (this.location & 1) ? (this.CRAM[$address$$13_temp$$] = this.GG_JAVA_R[$value$$], this.CRAM[$address$$13_temp$$ + 1] = this.GG_JAVA_G[$value$$]) : this.CRAM[$address$$13_temp$$ + 
      2] = this.GG_JAVA_B[$value$$])
  }
  ACCURATE && (this.readBuffer = $value$$);
  this.location++
}, interrupts:function $JSSMS$Vdp$$interrupts$($lineno$$) {
  192 >= $lineno$$ ? (ACCURATE_INTERRUPT_EMULATION || 192 != $lineno$$ || (this.status |= STATUS_VINT), 0 == this.counter ? (this.counter = this.vdpreg[10], this.status |= STATUS_HINT) : this.counter--, 0 != (this.status & STATUS_HINT) && 0 != (this.vdpreg[0] & 16) && (this.main.cpu.interruptLine = !0)) : (this.counter = this.vdpreg[10], 0 != (this.status & STATUS_VINT) && (0 != (this.vdpreg[1] & 32) && 224 > $lineno$$) && (this.main.cpu.interruptLine = !0), ACCURATE && $lineno$$ == this.main.no_of_scanlines - 
  1 && (this.vScrollLatch = this.vdpreg[9]))
}, setVBlankFlag:function $JSSMS$Vdp$$setVBlankFlag$() {
  this.status |= STATUS_VINT
}, drawLine:function $JSSMS$Vdp$$drawLine$($lineno$$) {
  var $i$$ = 0, $temp$$ = 0, $temp2$$ = 0;
  if(!this.main.is_gg || !($lineno$$ < GG_Y_OFFSET || $lineno$$ >= GG_Y_OFFSET + GG_HEIGHT)) {
    if(VDP_SPRITE_COLLISIONS) {
      for($i$$ = 0;$i$$ < SMS_WIDTH;$i$$++) {
        this.spriteCol[$i$$] = !1
      }
    }
    if(0 != (this.vdpreg[1] & 64)) {
      if(-1 != this.maxDirty && this.decodeTiles(), this.drawBg($lineno$$), this.isSatDirty && this.decodeSat(), 0 != this.lineSprites[$lineno$$][SPRITE_COUNT] && this.drawSprite($lineno$$), this.main.is_sms && 0 != (this.vdpreg[0] & 32)) {
        for($temp$$ = 4 * ($lineno$$ << 8), $temp2$$ = 3 * ((this.vdpreg[7] & 15) + 16), $i$$ = 0;8 > $i$$;$i$$++) {
          this.display[$temp$$ + $i$$] = this.CRAM[$temp2$$], this.display[$temp$$ + $i$$ + 1] = this.CRAM[$temp2$$ + 1], this.display[$temp$$ + $i$$ + 2] = this.CRAM[$temp2$$ + 2]
        }
      }
    }else {
      this.drawBGColour($lineno$$)
    }
  }
}, drawBg:function $JSSMS$Vdp$$drawBg$($lineno$$) {
  var $pixX_tile_props$$ = 0, $colour$$ = 0, $temp$$ = 0, $temp2$$ = 0, $hscroll$$ = this.vdpreg[8], $tile_y_vscroll$$ = ACCURATE ? this.vScrollLatch : this.vdpreg[9];
  16 > $lineno$$ && 0 != (this.vdpreg[0] & 64) && ($hscroll$$ = 0);
  var $lock$$ = this.vdpreg[0] & 128, $tile_column$$ = 32 - ($hscroll$$ >> 3) + this.h_start, $tile_row$$ = $lineno$$ + $tile_y_vscroll$$ >> 3;
  27 < $tile_row$$ && ($tile_row$$ -= 28);
  for(var $tile_y_vscroll$$ = ($lineno$$ + ($tile_y_vscroll$$ & 7) & 7) << 3, $row_precal$$ = $lineno$$ << 8, $tx$$ = this.h_start;$tx$$ < this.h_end;$tx$$++) {
    var $pixX_tile_props$$ = this.bgt + (($tile_column$$ & 31) << 1) + ($tile_row$$ << 6), $secondbyte$$ = this.VRAM[$pixX_tile_props$$ + 1], $pal$$ = ($secondbyte$$ & 8) << 1, $sx$$ = ($tx$$ << 3) + ($hscroll$$ & 7), $pixY$$ = 0 == ($secondbyte$$ & 4) ? $tile_y_vscroll$$ : 56 - $tile_y_vscroll$$, $tile$$ = this.tiles[(this.VRAM[$pixX_tile_props$$] & 255) + (($secondbyte$$ & 1) << 8)];
    if(0 == ($secondbyte$$ & 2)) {
      for($pixX_tile_props$$ = 0;8 > $pixX_tile_props$$ && $sx$$ < SMS_WIDTH;$pixX_tile_props$$++, $sx$$++) {
        $colour$$ = $tile$$[$pixX_tile_props$$ + $pixY$$], $temp$$ = 4 * ($sx$$ + $row_precal$$), $temp2$$ = 3 * ($colour$$ + $pal$$), this.bgPriority[$sx$$] = 0 != ($secondbyte$$ & 16) && 0 != $colour$$, this.display[$temp$$] = this.CRAM[$temp2$$], this.display[$temp$$ + 1] = this.CRAM[$temp2$$ + 1], this.display[$temp$$ + 2] = this.CRAM[$temp2$$ + 2]
      }
    }else {
      for($pixX_tile_props$$ = 7;0 <= $pixX_tile_props$$ && $sx$$ < SMS_WIDTH;$pixX_tile_props$$--, $sx$$++) {
        $colour$$ = $tile$$[$pixX_tile_props$$ + $pixY$$], $temp$$ = 4 * ($sx$$ + $row_precal$$), $temp2$$ = 3 * ($colour$$ + $pal$$), this.bgPriority[$sx$$] = 0 != ($secondbyte$$ & 16) && 0 != $colour$$, this.display[$temp$$] = this.CRAM[$temp2$$], this.display[$temp$$ + 1] = this.CRAM[$temp2$$ + 1], this.display[$temp$$ + 2] = this.CRAM[$temp2$$ + 2]
      }
    }
    $tile_column$$++;
    0 != $lock$$ && 23 == $tx$$ && ($tile_row$$ = $lineno$$ >> 3, $tile_y_vscroll$$ = ($lineno$$ & 7) << 3)
  }
}, drawSprite:function $JSSMS$Vdp$$drawSprite$($lineno$$) {
  for(var $colour$$ = 0, $temp$$ = 0, $temp2$$ = 0, $i$$ = 0, $sprites$$ = this.lineSprites[$lineno$$], $count$$ = Math.min(SPRITES_PER_LINE, $sprites$$[SPRITE_COUNT]), $zoomed$$ = this.vdpreg[1] & 1, $row_precal$$ = $lineno$$ << 8, $off$$ = 3 * $count$$;$i$$ < $count$$;$i$$++) {
    var $n$$3_tile$$ = $sprites$$[$off$$--] | (this.vdpreg[6] & 4) << 6, $pix_y$$ = $sprites$$[$off$$--], $x$$ = $sprites$$[$off$$--] - (this.vdpreg[0] & 8), $colour$$ = $lineno$$ - $pix_y$$ >> $zoomed$$;
    0 != (this.vdpreg[1] & 2) && ($n$$3_tile$$ &= -2);
    $n$$3_tile$$ = this.tiles[$n$$3_tile$$ + (($colour$$ & 8) >> 3)];
    $pix_y$$ = 0;
    0 > $x$$ && ($pix_y$$ = -$x$$, $x$$ = 0);
    var $offset$$ = $pix_y$$ + (($colour$$ & 7) << 3);
    if(0 == $zoomed$$) {
      for(;8 > $pix_y$$ && $x$$ < SMS_WIDTH;$pix_y$$++, $x$$++) {
        $colour$$ = $n$$3_tile$$[$offset$$++], 0 == $colour$$ || this.bgPriority[$x$$] || ($temp$$ = 4 * ($x$$ + $row_precal$$), $temp2$$ = 3 * ($colour$$ + 16), this.display[$temp$$] = this.CRAM[$temp2$$], this.display[$temp$$ + 1] = this.CRAM[$temp2$$ + 1], this.display[$temp$$ + 2] = this.CRAM[$temp2$$ + 2], VDP_SPRITE_COLLISIONS && (this.spriteCol[$x$$] ? this.status |= STATUS_COLLISION : this.spriteCol[$x$$] = !0))
      }
    }else {
      for(;8 > $pix_y$$ && $x$$ < SMS_WIDTH;$pix_y$$++, $x$$ += 2) {
        $colour$$ = $n$$3_tile$$[$offset$$++], 0 == $colour$$ || this.bgPriority[$x$$] || ($temp$$ = 4 * ($x$$ + $row_precal$$), $temp2$$ = 3 * ($colour$$ + 16), this.display[$temp$$] = this.CRAM[$temp2$$], this.display[$temp$$ + 1] = this.CRAM[$temp2$$ + 1], this.display[$temp$$ + 2] = this.CRAM[$temp2$$ + 2], VDP_SPRITE_COLLISIONS && (this.spriteCol[$x$$] ? this.status |= STATUS_COLLISION : this.spriteCol[$x$$] = !0)), 0 == $colour$$ || this.bgPriority[$x$$ + 1] || ($temp$$ = 4 * ($x$$ + $row_precal$$ + 
        1), $temp2$$ = 3 * ($colour$$ + 16), this.display[$temp$$] = this.CRAM[$temp2$$], this.display[$temp$$ + 1] = this.CRAM[$temp2$$ + 1], this.display[$temp$$ + 2] = this.CRAM[$temp2$$ + 2], VDP_SPRITE_COLLISIONS && (this.spriteCol[$x$$ + 1] ? this.status |= STATUS_COLLISION : this.spriteCol[$x$$ + 1] = !0))
      }
    }
  }
  $sprites$$[SPRITE_COUNT] >= SPRITES_PER_LINE && (this.status |= STATUS_OVERFLOW)
}, drawBGColour:function $JSSMS$Vdp$$drawBGColour$($lineno$$4_row_precal$$) {
  $lineno$$4_row_precal$$ <<= 8;
  var $length$$ = 4 * ($lineno$$4_row_precal$$ + 4 * SMS_WIDTH), $temp$$ = 3 * ((this.vdpreg[7] & 15) + 16);
  for($lineno$$4_row_precal$$ *= 4;$lineno$$4_row_precal$$ < $length$$;$lineno$$4_row_precal$$ += 4) {
    this.display[$lineno$$4_row_precal$$] = this.CRAM[$temp$$], this.display[$lineno$$4_row_precal$$ + 1] = this.CRAM[$temp$$ + 1], this.display[$lineno$$4_row_precal$$ + 2] = this.CRAM[$temp$$ + 2]
  }
}, decodeTiles:function $JSSMS$Vdp$$decodeTiles$() {
  for(var $i$$ = this.minDirty;$i$$ <= this.maxDirty;$i$$++) {
    if(this.isTileDirty[$i$$]) {
      this.isTileDirty[$i$$] = !1;
      for(var $tile$$ = this.tiles[$i$$], $pixel_index$$ = 0, $address$$ = $i$$ << 5, $y$$ = 0;$y$$ < TILE_SIZE;$y$$++) {
        for(var $address0$$ = this.VRAM[$address$$++], $address1$$ = this.VRAM[$address$$++], $address2$$ = this.VRAM[$address$$++], $address3$$ = this.VRAM[$address$$++], $bit$$ = 128;0 != $bit$$;$bit$$ >>= 1) {
          var $colour$$ = 0;
          0 != ($address0$$ & $bit$$) && ($colour$$ |= 1);
          0 != ($address1$$ & $bit$$) && ($colour$$ |= 2);
          0 != ($address2$$ & $bit$$) && ($colour$$ |= 4);
          0 != ($address3$$ & $bit$$) && ($colour$$ |= 8);
          $tile$$[$pixel_index$$++] = $colour$$
        }
      }
    }
  }
  this.minDirty = TOTAL_TILES;
  this.maxDirty = -1
}, decodeSat:function $JSSMS$Vdp$$decodeSat$() {
  this.isSatDirty = !1;
  for(var $height$$11_i$$ = 0;$height$$11_i$$ < this.lineSprites.length;$height$$11_i$$++) {
    this.lineSprites[$height$$11_i$$][SPRITE_COUNT] = 0
  }
  $height$$11_i$$ = 0 == (this.vdpreg[1] & 2) ? 8 : 16;
  1 == (this.vdpreg[1] & 1) && ($height$$11_i$$ <<= 1);
  for(var $spriteno$$ = 0;64 > $spriteno$$;$spriteno$$++) {
    var $y$$ = this.VRAM[this.sat + $spriteno$$] & 255;
    if(208 == $y$$) {
      break
    }
    $y$$++;
    240 < $y$$ && ($y$$ -= 256);
    for(var $lineno$$ = $y$$;$lineno$$ < SMS_HEIGHT;$lineno$$++) {
      if($lineno$$ - $y$$ < $height$$11_i$$) {
        var $sprites$$ = this.lineSprites[$lineno$$];
        if(!$sprites$$ || $sprites$$[SPRITE_COUNT] >= SPRITES_PER_LINE) {
          break
        }
        var $off$$ = 3 * $sprites$$[SPRITE_COUNT] + SPRITE_X, $address$$ = this.sat + ($spriteno$$ << 1) + 128;
        $sprites$$[$off$$++] = this.VRAM[$address$$++] & 255;
        $sprites$$[$off$$++] = $y$$;
        $sprites$$[$off$$++] = this.VRAM[$address$$] & 255;
        $sprites$$[SPRITE_COUNT]++
      }
    }
  }
}, createCachedImages:function $JSSMS$Vdp$$createCachedImages$() {
  for(var $i$$ = 0;$i$$ < TOTAL_TILES;$i$$++) {
    this.tiles[$i$$] = Array(TILE_SIZE * TILE_SIZE)
  }
}, generateConvertedPals:function $JSSMS$Vdp$$generateConvertedPals$() {
  var $i$$, $r$$, $g$$, $b$$;
  for($i$$ = 0;64 > $i$$;$i$$++) {
    $r$$ = $i$$ & 3, $g$$ = $i$$ >> 2 & 3, $b$$ = $i$$ >> 4 & 3, this.main_JAVA_R[$i$$] = 85 * $r$$ & 255, this.main_JAVA_G[$i$$] = 85 * $g$$ & 255, this.main_JAVA_B[$i$$] = 85 * $b$$ & 255
  }
  for($i$$ = 0;256 > $i$$;$i$$++) {
    $g$$ = $i$$ & 15, $b$$ = $i$$ >> 4 & 15, this.GG_JAVA_R[$i$$] = ($g$$ << 4 | $g$$) & 255, this.GG_JAVA_G[$i$$] = ($b$$ << 4 | $b$$) & 255
  }
  for($i$$ = 0;16 > $i$$;$i$$++) {
    this.GG_JAVA_B[$i$$] = ($i$$ << 4 | $i$$) & 255
  }
}, getState:function $JSSMS$Vdp$$getState$() {
  var $state$$ = Array(51);
  $state$$[0] = this.videoMode | this.status << 8 | (this.firstByte ? 65536 : 0) | this.commandByte << 24;
  $state$$[1] = this.location | this.operation << 16 | this.readBuffer << 24;
  $state$$[2] = this.counter | this.vScrollLatch << 8 | this.line << 16;
  JSSMS.Utils.copyArrayElements(this.vdpreg, 0, $state$$, 3, 16);
  JSSMS.Utils.copyArrayElements(this.CRAM, 0, $state$$, 19, 96);
  return $state$$
}, setState:function $JSSMS$Vdp$$setState$($state$$) {
  var $temp$$ = $state$$[0];
  this.videoMode = $temp$$ & 255;
  this.status = $temp$$ >> 8 & 255;
  this.firstByte = 0 != ($temp$$ >> 16 & 255);
  this.commandByte = $temp$$ >> 24 & 255;
  $temp$$ = $state$$[1];
  this.location = $temp$$ & 65535;
  this.operation = $temp$$ >> 16 & 255;
  this.readBuffer = $temp$$ >> 24 & 255;
  $temp$$ = $state$$[2];
  this.counter = $temp$$ & 255;
  this.vScrollLatch = $temp$$ >> 8 & 255;
  this.line = $temp$$ >> 16 & 65535;
  JSSMS.Utils.copyArrayElements($state$$, 3, this.vdpreg, 0, 16);
  JSSMS.Utils.copyArrayElements($state$$, 19, this.CRAM, 0, 96);
  this.forceFullRedraw()
}};
JSSMS.DummyUI = function $JSSMS$DummyUI$($sms$$) {
  this.main = $sms$$;
  this.reset = function $this$reset$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  };
  this.canvasImageData = {data:[]}
};
window.$ && ($.fn.JSSMSUI = function $$$fn$JSSMSUI$($roms$$) {
  var $parent$$ = this, $UI$$ = function $$UI$$$($root_sms$$) {
    this.main = $root_sms$$;
    if("[object OperaMini]" == Object.prototype.toString.call(window.operamini)) {
      $($parent$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>')
    }else {
      var $self$$ = this;
      $root_sms$$ = $("<div></div>");
      var $screenContainer$$ = $('<div id="screen"></div>'), $gamepadContainer$$ = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>'), $controls$$ = $('<div id="controls"></div>'), $fullscreenSupport$$ = JSSMS.Utils.getPrefix(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), 
      $requestAnimationFramePrefix_startButton$$ = JSSMS.Utils.getPrefix(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame"], window), $i$$;
      if($requestAnimationFramePrefix_startButton$$) {
        this.requestAnimationFrame = window[$requestAnimationFramePrefix_startButton$$].bind(window)
      }else {
        var $lastTime$$ = 0;
        this.requestAnimationFrame = function $this$requestAnimationFrame$($callback$$) {
          var $currTime$$ = JSSMS.Utils.getTimestamp(), $timeToCall$$ = Math.max(0, 16 - ($currTime$$ - $lastTime$$));
          window.setTimeout(function() {
            $callback$$($currTime$$ + $timeToCall$$)
          }, $timeToCall$$);
          $lastTime$$ = $currTime$$ + $timeToCall$$
        }
      }
      this.screen = $("<canvas width=" + SMS_WIDTH + " height=" + SMS_HEIGHT + " moz-opaque></canvas>");
      this.canvasContext = this.screen[0].getContext("2d");
      this.canvasContext.webkitImageSmoothingEnabled = !1;
      this.canvasContext.mozImageSmoothingEnabled = !1;
      this.canvasContext.imageSmoothingEnabled = !1;
      if(this.canvasContext.getImageData) {
        this.canvasImageData = this.canvasContext.getImageData(0, 0, SMS_WIDTH, SMS_HEIGHT);
        this.gamepad = {u:{e:$(".up", $gamepadContainer$$), k:KEY_UP}, r:{e:$(".right", $gamepadContainer$$), k:KEY_RIGHT}, d:{e:$(".down", $gamepadContainer$$), k:KEY_DOWN}, l:{e:$(".left", $gamepadContainer$$), k:KEY_LEFT}, 1:{e:$(".fire1", $gamepadContainer$$), k:KEY_FIRE1}, 2:{e:$(".fire2", $gamepadContainer$$), k:KEY_FIRE2}};
        $requestAnimationFramePrefix_startButton$$ = $(".start", $gamepadContainer$$);
        this.romContainer = $('<div id="romSelector"></div>');
        this.romSelect = $("<select></select>").change(function() {
          $self$$.loadROM()
        });
        this.buttons = Object.create(null);
        this.buttons.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">').click(function() {
          $self$$.main.isRunning ? ($self$$.main.stop(), $self$$.updateStatus("Paused"), $self$$.buttons.start.attr("value", "Start")) : ($self$$.main.start(), $self$$.buttons.start.attr("value", "Pause"))
        });
        this.buttons.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">').click(function() {
          $self$$.main.reloadRom() ? ($self$$.main.reset(), $self$$.main.vdp.forceFullRedraw(), $self$$.main.start()) : $(this).attr("disabled", "disabled")
        });
        ENABLE_DEBUGGER && (this.dissambler = $('<div id="dissambler"></div>'), $($parent$$).after(this.dissambler), this.buttons.nextStep = $('<input type="button" value="Next step" class="btn" disabled="disabled">').click(function() {
          $self$$.main.nextStep()
        }));
        this.main.soundEnabled && (this.buttons.sound = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').click(function() {
          $self$$.main.soundEnabled ? ($self$$.main.soundEnabled = !1, $self$$.buttons.sound.attr("value", "Enable sound")) : ($self$$.main.soundEnabled = !0, $self$$.buttons.sound.attr("value", "Disable sound"))
        }));
        $fullscreenSupport$$ ? this.buttons.fullscreen = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
          var $screen$$ = $screenContainer$$[0];
          $screen$$.requestFullscreen ? $screen$$.requestFullscreen() : $screen$$.mozRequestFullScreen ? $screen$$.mozRequestFullScreen() : $screen$$.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }) : (this.zoomed = !1, this.buttons.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">').click(function() {
          $self$$.zoomed ? ($self$$.screen.animate({width:SMS_WIDTH + "px", height:SMS_HEIGHT + "px"}, function() {
            $(this).removeAttr("style")
          }), $self$$.buttons.zoom.attr("value", "Zoom in")) : ($self$$.screen.animate({width:2 * SMS_WIDTH + "px", height:2 * SMS_HEIGHT + "px"}), $self$$.buttons.zoom.attr("value", "Zoom out"));
          $self$$.zoomed = !$self$$.zoomed
        }));
        for($i$$ in this.buttons) {
          this.buttons[$i$$].appendTo($controls$$)
        }
        this.log = $('<div id="status"></div>');
        this.screen.appendTo($screenContainer$$);
        $gamepadContainer$$.appendTo($screenContainer$$);
        $screenContainer$$.appendTo($root_sms$$);
        this.romContainer.appendTo($root_sms$$);
        $controls$$.appendTo($root_sms$$);
        this.log.appendTo($root_sms$$);
        $root_sms$$.appendTo($($parent$$));
        void 0 != $roms$$ && this.setRoms($roms$$);
        $(document).bind("keydown", function($evt$$) {
          $self$$.main.keyboard.keydown($evt$$)
        }).bind("keyup", function($evt$$) {
          $self$$.main.keyboard.keyup($evt$$)
        });
        for($i$$ in this.gamepad) {
          this.gamepad[$i$$].e.on("mousedown touchstart", function($key$$) {
            return function($evt$$) {
              $self$$.main.keyboard.controller1 &= ~$key$$;
              $evt$$.preventDefault()
            }
          }(this.gamepad[$i$$].k)).on("mouseup touchend", function($key$$) {
            return function($evt$$) {
              $self$$.main.keyboard.controller1 |= $key$$;
              $evt$$.preventDefault()
            }
          }(this.gamepad[$i$$].k))
        }
        $requestAnimationFramePrefix_startButton$$.on("mousedown touchstart", function($evt$$) {
          $self$$.main.is_sms ? $self$$.main.pause_button = !0 : $self$$.main.keyboard.ggstart &= -129;
          $evt$$.preventDefault()
        }).on("mouseup touchend", function($evt$$) {
          $self$$.main.is_sms || ($self$$.main.keyboard.ggstart |= 128);
          $evt$$.preventDefault()
        })
      }else {
        $($parent$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>')
      }
    }
  };
  $UI$$.prototype = {reset:function $$UI$$$$reset$() {
    this.screen[0].width = SMS_WIDTH;
    this.screen[0].height = SMS_HEIGHT;
    this.log.empty();
    ENABLE_DEBUGGER && this.dissambler.empty()
  }, setRoms:function $$UI$$$$setRoms$($roms$$) {
    var $groupName$$, $optgroup$$, $length$$, $i$$, $count$$ = 0;
    this.romSelect.children().remove();
    $("<option>Select a ROM...</option>").appendTo(this.romSelect);
    for($groupName$$ in $roms$$) {
      if($roms$$.hasOwnProperty($groupName$$)) {
        $optgroup$$ = $("<optgroup></optgroup>").attr("label", $groupName$$);
        $length$$ = $roms$$[$groupName$$].length;
        for($i$$ = 0;$i$$ < $length$$;$i$$++) {
          $("<option>" + $roms$$[$groupName$$][$i$$][0] + "</option>").attr("value", $roms$$[$groupName$$][$i$$][1]).appendTo($optgroup$$)
        }
        $optgroup$$.appendTo(this.romSelect)
      }
      $count$$++
    }
    $count$$ && this.romSelect.appendTo(this.romContainer)
  }, loadROM:function $$UI$$$$loadROM$() {
    var $self$$ = this;
    this.updateStatus("Downloading...");
    $.ajax({url:escape(this.romSelect.val()), xhr:function() {
      var $xhr$$ = $.ajaxSettings.xhr();
      void 0 != $xhr$$.overrideMimeType && $xhr$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$.xhr = $xhr$$
    }, complete:function($xhr$$, $status$$) {
      var $data$$;
      "error" == $status$$ ? $self$$.updateStatus("The selected ROM file could not be loaded.") : ($data$$ = $xhr$$.responseText, $self$$.main.stop(), $self$$.main.readRomDirectly($data$$, $self$$.romSelect.val()), $self$$.main.reset(), $self$$.main.vdp.forceFullRedraw(), $self$$.enable())
    }})
  }, enable:function $$UI$$$$enable$() {
    this.buttons.start.removeAttr("disabled");
    this.buttons.start.attr("value", "Start");
    this.buttons.reset.removeAttr("disabled");
    ENABLE_DEBUGGER && this.buttons.nextStep.removeAttr("disabled");
    this.main.soundEnabled && (this.buttons.sound ? this.buttons.sound.attr("value", "Disable sound") : this.buttons.sound.attr("value", "Enable sound"))
  }, updateStatus:function $$UI$$$$updateStatus$($s$$) {
    this.log.text($s$$)
  }, writeAudio:function $$UI$$$$writeAudio$($buffer$$) {
  }, writeFrame:function() {
    var $hiddenPrefix$$ = JSSMS.Utils.getPrefix(["hidden", "mozHidden", "webkitHidden", "msHidden"]);
    return $hiddenPrefix$$ ? function() {
      document[$hiddenPrefix$$] || this.canvasContext.putImageData(this.canvasImageData, 0, 0)
    } : function() {
      this.canvasContext.putImageData(this.canvasImageData, 0, 0)
    }
  }(), updateDisassembly:function $$UI$$$$updateDisassembly$($currentAddress$$) {
    for(var $instructions$$ = this.main.cpu.instructions, $length$$ = $instructions$$.length, $html$$ = "", $i$$ = 8 > $currentAddress$$ ? 0 : $currentAddress$$ - 8, $num$$ = 0;16 > $num$$ && $i$$ <= $length$$;$i$$++) {
      $instructions$$[$i$$] && ($html$$ += "<div" + ($instructions$$[$i$$].address == $currentAddress$$ ? ' class="current"' : "") + ">" + $instructions$$[$i$$].hexAddress + ($instructions$$[$i$$].isJumpTarget ? ":" : " ") + "<code>" + $instructions$$[$i$$].inst + "</code></div>", $num$$++)
    }
    this.dissambler.html($html$$)
  }};
  return $UI$$
});
var IO_TR_DIRECTION = 0, IO_TH_DIRECTION = 1, IO_TR_OUTPUT = 2, IO_TH_OUTPUT = 3, IO_TH_INPUT = 4, PORT_A = 0, PORT_B = 5;
JSSMS.Ports = function $JSSMS$Ports$($sms$$) {
  this.main = $sms$$;
  this.vdp = $sms$$.vdp;
  this.psg = $sms$$.psg;
  this.keyboard = $sms$$.keyboard;
  this.europe = 64;
  this.hCounter = 0;
  this.ioPorts = []
};
JSSMS.Ports.prototype = {reset:function $JSSMS$Ports$$reset$() {
  LIGHTGUN ? (this.ioPorts = Array(10), this.ioPorts[PORT_A + IO_TH_INPUT] = 1, this.ioPorts[PORT_B + IO_TH_INPUT] = 1) : this.ioPorts = Array(2)
}, out:function $JSSMS$Ports$$out$($port$$, $value$$) {
  if(!(this.main.is_gg && 7 > $port$$)) {
    switch($port$$ & 193) {
      case 1:
        LIGHTGUN ? (this.oldTH = 0 != this.getTH(PORT_A) || 0 != this.getTH(PORT_B), this.writePort(PORT_A, $value$$), this.writePort(PORT_B, $value$$ >> 2), this.oldTH || 0 == this.getTH(PORT_A) && 0 == this.getTH(PORT_B) || (this.hCounter = this.getHCount())) : (this.ioPorts[0] = ($value$$ & 32) << 1, this.ioPorts[1] = $value$$ & 128, 0 == this.europe && (this.ioPorts[0] = ~this.ioPorts[0], this.ioPorts[1] = ~this.ioPorts[1]));
        break;
      case 128:
        this.vdp.dataWrite($value$$);
        break;
      case 129:
        this.vdp.controlWrite($value$$);
        break;
      case 64:
      ;
      case 65:
        this.main.soundEnabled && this.psg.write($value$$)
    }
  }
}, in_:function $JSSMS$Ports$$in_$($port$$) {
  if(this.main.is_gg && 7 > $port$$) {
    switch($port$$) {
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
        return 255
    }
  }
  switch($port$$ & 193) {
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
      return LIGHTGUN ? (this.keyboard.lightgunClick && this.lightPhaserSync(), this.keyboard.controller2 & 63 | (0 != this.getTH(PORT_A) ? 64 : 0) | (0 != this.getTH(PORT_B) ? 128 : 0)) : this.keyboard.controller2 & 63 | this.ioPorts[0] | this.ioPorts[1]
  }
  return 255
}, writePort:function $JSSMS$Ports$$writePort$($index$$, $value$$) {
  this.ioPorts[$index$$ + IO_TR_DIRECTION] = $value$$ & 1;
  this.ioPorts[$index$$ + IO_TH_DIRECTION] = $value$$ & 2;
  this.ioPorts[$index$$ + IO_TR_OUTPUT] = $value$$ & 16;
  this.ioPorts[$index$$ + IO_TH_OUTPUT] = 0 == this.europe ? ~$value$$ & 32 : $value$$ & 32
}, getTH:function $JSSMS$Ports$$getTH$($index$$) {
  return 0 == this.ioPorts[$index$$ + IO_TH_DIRECTION] ? this.ioPorts[$index$$ + IO_TH_OUTPUT] : this.ioPorts[$index$$ + IO_TH_INPUT]
}, setTH:function $JSSMS$Ports$$setTH$($index$$, $on$$) {
  this.ioPorts[$index$$ + IO_TH_DIRECTION] = 1;
  this.ioPorts[$index$$ + IO_TH_INPUT] = $on$$ ? 1 : 0
}, getHCount:function $JSSMS$Ports$$getHCount$() {
  var $v$$ = Math.round(this.main.cpu.getCycle() * SMS_X_PIXELS / this.main.cyclesPerLine) - 8 >> 1;
  147 < $v$$ && ($v$$ += 85);
  return $v$$ & 255
}, X_RANGE:48, Y_RANGE:4, lightPhaserSync:function $JSSMS$Ports$$lightPhaserSync$() {
  var $oldTH$$ = this.getTH(PORT_A), $hc$$ = this.getHCount(), $dx$$ = this.keyboard.lightgunX - ($hc$$ << 1), $dy$$ = this.keyboard.lightgunY - this.vdp.line;
  $dy$$ > -this.Y_RANGE && $dy$$ < this.Y_RANGE && $dx$$ > -this.X_RANGE && $dx$$ < this.X_RANGE ? (this.setTH(PORT_A, !1), $oldTH$$ != this.getTH(PORT_A) && (this.hCounter = 20 + (this.keyboard.lightgunX >> 1))) : (this.setTH(PORT_A, !0), $oldTH$$ != this.getTH(PORT_A) && (this.hCounter = $hc$$))
}, setDomestic:function $JSSMS$Ports$$setDomestic$($value$$) {
  this.europe = $value$$ ? 64 : 0
}, isDomestic:function $JSSMS$Ports$$isDomestic$() {
  return 0 != this.europe
}};
var Bytecode = function() {
  function $Bytecode$$($address$$, $page$$) {
    this.address = $address$$;
    this.page = $page$$;
    this.opcode = [];
    this.target = this.nextAddress = this.operand = null;
    this.isJumpTarget = this.canEnd = this.isFunctionEnder = !1;
    this.jumpTargetNb = 0;
    this.ast = null
  }
  var $toHex$$ = function() {
    return DEBUG ? JSSMS.Utils.toHex : function($dec$$) {
      return $dec$$
    }
  }();
  $Bytecode$$.prototype = {get hexOpcode() {
    return this.opcode.length ? this.opcode.map($toHex$$).join(" ") : ""
  }, get label() {
    var $name$$ = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, $toHex$$(this.target || this.operand || 0)) : "";
    return $toHex$$(this.address + this.page * PAGE_SIZE) + " " + this.hexOpcode + " " + $name$$
  }};
  return $Bytecode$$
}();
var Parser = function() {
  function $disassemble$$($bytecode$$, $stream$$) {
    $stream$$.page = $bytecode$$.page;
    $stream$$.seek($bytecode$$.address + 16384 * $stream$$.page);
    var $opcode$$13_opcode$$inline_5_opcode$$ = $stream$$.getUint8(), $operand$$3_operand$$ = null, $target$$48_target$$ = null, $isFunctionEnder_isFunctionEnder$$ = !1, $canEnd_canEnd$$ = !1;
    $bytecode$$.opcode.push($opcode$$13_opcode$$inline_5_opcode$$);
    switch($opcode$$13_opcode$$inline_5_opcode$$) {
      case 0:
        break;
      case 1:
        $operand$$3_operand$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$ = $stream$$.getUint8();
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
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 15:
        break;
      case 16:
        $target$$48_target$$ = $stream$$.position + $stream$$.getInt8();
        $canEnd_canEnd$$ = !0;
        break;
      case 17:
        $operand$$3_operand$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 23:
        break;
      case 24:
        $target$$48_target$$ = $stream$$.position + $stream$$.getInt8();
        $stream$$.seek(null);
        $isFunctionEnder_isFunctionEnder$$ = !0;
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
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 31:
        break;
      case 32:
        $target$$48_target$$ = $stream$$.position + $stream$$.getInt8();
        $canEnd_canEnd$$ = !0;
        break;
      case 33:
        $operand$$3_operand$$ = $stream$$.getUint16();
        break;
      case 34:
        $operand$$3_operand$$ = $stream$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 39:
        break;
      case 40:
        $target$$48_target$$ = $stream$$.position + $stream$$.getInt8();
        $canEnd_canEnd$$ = !0;
        break;
      case 41:
        break;
      case 42:
        $operand$$3_operand$$ = $stream$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 47:
        break;
      case 48:
        $target$$48_target$$ = $stream$$.position + $stream$$.getInt8();
        $canEnd_canEnd$$ = !0;
        break;
      case 49:
        $operand$$3_operand$$ = $stream$$.getUint16();
        break;
      case 50:
        $operand$$3_operand$$ = $stream$$.getUint16();
        break;
      case 51:
        break;
      case 52:
        break;
      case 53:
        break;
      case 54:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 55:
        break;
      case 56:
        $target$$48_target$$ = $stream$$.position + $stream$$.getInt8();
        $canEnd_canEnd$$ = !0;
        break;
      case 57:
        break;
      case 58:
        $operand$$3_operand$$ = $stream$$.getUint16();
        break;
      case 59:
        break;
      case 60:
        break;
      case 61:
        break;
      case 62:
        $operand$$3_operand$$ = $stream$$.getUint8();
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
        $isFunctionEnder_isFunctionEnder$$ = !0;
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
        $canEnd_canEnd$$ = !0;
        break;
      case 193:
        break;
      case 194:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 195:
        $target$$48_target$$ = $stream$$.getUint16();
        $stream$$.seek(null);
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 196:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 197:
        break;
      case 198:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 199:
        $target$$48_target$$ = 0;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 200:
        $canEnd_canEnd$$ = !0;
        break;
      case 201:
        $stream$$.seek(null);
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 202:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 203:
        return $opcode$$13_opcode$$inline_5_opcode$$ = $stream$$.getUint8(), $bytecode$$.opcode.push($opcode$$13_opcode$$inline_5_opcode$$), $bytecode$$.nextAddress = $stream$$.position, $bytecode$$;
      case 204:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 205:
        $target$$48_target$$ = $stream$$.getUint16();
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 206:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 207:
        $target$$48_target$$ = 8;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 208:
        $canEnd_canEnd$$ = !0;
        break;
      case 209:
        break;
      case 210:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 211:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 212:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 213:
        break;
      case 214:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 215:
        $target$$48_target$$ = 16;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 216:
        $canEnd_canEnd$$ = !0;
        break;
      case 217:
        break;
      case 218:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 219:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 220:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 221:
        return $getIndex$$($bytecode$$, $stream$$);
      case 222:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 223:
        $target$$48_target$$ = 24;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 224:
        $canEnd_canEnd$$ = !0;
        break;
      case 225:
        break;
      case 226:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 227:
        break;
      case 228:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 229:
        break;
      case 230:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 231:
        $target$$48_target$$ = 32;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 232:
        $canEnd_canEnd$$ = !0;
        break;
      case 233:
        $stream$$.seek(null);
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 234:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 235:
        break;
      case 236:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 237:
        $opcode$$13_opcode$$inline_5_opcode$$ = $stream$$.getUint8();
        $target$$48_target$$ = $operand$$3_operand$$ = null;
        $canEnd_canEnd$$ = $isFunctionEnder_isFunctionEnder$$ = !1;
        $bytecode$$.opcode.push($opcode$$13_opcode$$inline_5_opcode$$);
        switch($opcode$$13_opcode$$inline_5_opcode$$) {
          case 64:
            break;
          case 65:
            break;
          case 66:
            break;
          case 67:
            $operand$$3_operand$$ = $stream$$.getUint16();
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
            $stream$$.seek(null);
            $isFunctionEnder_isFunctionEnder$$ = !0;
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
            $operand$$3_operand$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$ = $stream$$.getUint16();
            break;
          case 111:
            break;
          case 113:
            break;
          case 114:
            break;
          case 115:
            $operand$$3_operand$$ = $stream$$.getUint16();
            break;
          case 120:
            break;
          case 121:
            break;
          case 122:
            break;
          case 123:
            $operand$$3_operand$$ = $stream$$.getUint16();
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
            $target$$48_target$$ = $stream$$.position - 2;
            $canEnd_canEnd$$ = !0;
            break;
          case 177:
            $target$$48_target$$ = $stream$$.position - 2;
            $canEnd_canEnd$$ = !0;
            break;
          case 178:
            $target$$48_target$$ = $stream$$.position - 2;
            $canEnd_canEnd$$ = !0;
            break;
          case 179:
            $target$$48_target$$ = $stream$$.position - 2;
            $canEnd_canEnd$$ = !0;
            break;
          case 184:
            break;
          case 185:
            break;
          case 186:
            $target$$48_target$$ = $stream$$.position - 2;
            $canEnd_canEnd$$ = !0;
            break;
          case 187:
            $target$$48_target$$ = $stream$$.position - 2;
            $canEnd_canEnd$$ = !0;
            break;
          default:
            JSSMS.Utils.console.error("Unexpected opcode", "0xED " + JSSMS.Utils.toHex($opcode$$13_opcode$$inline_5_opcode$$))
        }
        $bytecode$$.nextAddress = $stream$$.position;
        $bytecode$$.operand = $operand$$3_operand$$;
        $bytecode$$.target = $target$$48_target$$;
        $bytecode$$.isFunctionEnder = $isFunctionEnder_isFunctionEnder$$;
        $bytecode$$.canEnd = $canEnd_canEnd$$;
        return $bytecode$$;
      case 238:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 239:
        $target$$48_target$$ = 40;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 240:
        $canEnd_canEnd$$ = !0;
        break;
      case 241:
        break;
      case 242:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 243:
        break;
      case 244:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 245:
        break;
      case 246:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 247:
        $target$$48_target$$ = 48;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      case 248:
        $canEnd_canEnd$$ = !0;
        break;
      case 249:
        break;
      case 250:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 251:
        break;
      case 252:
        $target$$48_target$$ = $stream$$.getUint16();
        $canEnd_canEnd$$ = !0;
        break;
      case 253:
        return $getIndex$$($bytecode$$, $stream$$);
      case 254:
        $operand$$3_operand$$ = $stream$$.getUint8();
        break;
      case 255:
        $target$$48_target$$ = 56;
        $isFunctionEnder_isFunctionEnder$$ = !0;
        break;
      default:
        JSSMS.Utils.console.error("Unexpected opcode", JSSMS.Utils.toHex($opcode$$13_opcode$$inline_5_opcode$$))
    }
    $bytecode$$.nextAddress = $stream$$.position;
    $bytecode$$.operand = $operand$$3_operand$$;
    $bytecode$$.target = $target$$48_target$$;
    $bytecode$$.isFunctionEnder = $isFunctionEnder_isFunctionEnder$$;
    $bytecode$$.canEnd = $canEnd_canEnd$$;
    return $bytecode$$
  }
  function $getIndex$$($bytecode$$, $stream$$) {
    var $opcode$$16_opcode$$ = $stream$$.getUint8(), $operand$$5_operand$$ = null, $isFunctionEnder$$ = !1;
    $bytecode$$.opcode.push($opcode$$16_opcode$$);
    switch($opcode$$16_opcode$$) {
      case 9:
        break;
      case 25:
        break;
      case 33:
        $operand$$5_operand$$ = $stream$$.getUint16();
        break;
      case 34:
        $operand$$5_operand$$ = $stream$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 41:
        break;
      case 42:
        $operand$$5_operand$$ = $stream$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 52:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 53:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 54:
        $operand$$5_operand$$ = $stream$$.getUint16();
        break;
      case 57:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        $operand$$5_operand$$ = $stream$$.getUint8();
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
        $operand$$5_operand$$ = $stream$$.getUint8();
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
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 111:
        break;
      case 112:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 113:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 114:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 115:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 116:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 117:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 119:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        $operand$$5_operand$$ = $stream$$.getUint8();
        break;
      case 203:
        return $opcode$$16_opcode$$ = $stream$$.getUint8(), $operand$$5_operand$$ = $stream$$.getUint8(), $bytecode$$.opcode.push($opcode$$16_opcode$$), $bytecode$$.nextAddress = $stream$$.position, $bytecode$$.operand = $operand$$5_operand$$, $bytecode$$;
      case 225:
        break;
      case 227:
        break;
      case 229:
        break;
      case 233:
        $stream$$.seek(null);
        $isFunctionEnder$$ = !0;
        break;
      case 249:
        break;
      default:
        JSSMS.Utils.console.error("Unexpected opcode", "0xDD/0xFD " + JSSMS.Utils.toHex($opcode$$16_opcode$$))
    }
    $bytecode$$.nextAddress = $stream$$.position;
    $bytecode$$.operand = $operand$$5_operand$$;
    $bytecode$$.isFunctionEnder = $isFunctionEnder$$;
    return $bytecode$$
  }
  function $RomStream$$($rom$$) {
    this.rom = $rom$$;
    this.pos = null;
    this.page = 0
  }
  var $parser$$ = function $$parser$$$($rom$$, $frameReg$$) {
    this.stream = new $RomStream$$($rom$$);
    this.frameReg = $frameReg$$;
    this.addresses = Array($rom$$.length);
    this.entryPoints = [];
    this.instructions = Array($rom$$.length);
    DEBUG && (this.instructionTypes = []);
    for(var $i$$ = 0;$i$$ < $rom$$.length;$i$$++) {
      this.addresses[$i$$] = [], this.instructions[$i$$] = [], DEBUG && (this.instructionTypes[$i$$] = [])
    }
  };
  $parser$$.prototype = {addEntryPoint:function $$parser$$$$addEntryPoint$($obj$$) {
    this.entryPoints.push($obj$$);
    this.addAddress($obj$$.address)
  }, parse:function $$parser$$$$parse$($currentPage_entryPoint$$2_page$$) {
    JSSMS.Utils.console.time("Parsing");
    var $i$$, $length$$;
    void 0 == $currentPage_entryPoint$$2_page$$ ? ($i$$ = 0, $length$$ = this.stream.length - 1) : ($i$$ = 0, $length$$ = 16383);
    for($currentPage_entryPoint$$2_page$$ = 0;$currentPage_entryPoint$$2_page$$ < this.addresses.length;$currentPage_entryPoint$$2_page$$++) {
      for(;this.addresses[$currentPage_entryPoint$$2_page$$].length;) {
        var $currentAddress$$ = this.addresses[$currentPage_entryPoint$$2_page$$].shift().address % 16384;
        if($currentAddress$$ < $i$$ || $currentAddress$$ > $length$$) {
          JSSMS.Utils.console.error("Address out of bound", JSSMS.Utils.toHex($currentAddress$$))
        }else {
          if(!this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$]) {
            var $bytecode$$ = new Bytecode($currentAddress$$, $currentPage_entryPoint$$2_page$$);
            this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$] = $disassemble$$($bytecode$$, this.stream);
            null != this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].nextAddress && (this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].nextAddress >= $i$$ && this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].nextAddress <= $length$$) && this.addAddress(this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].nextAddress);
            null != this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].target && (this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].target >= $i$$ && this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].target <= $length$$) && this.addAddress(this.instructions[$currentPage_entryPoint$$2_page$$][$currentAddress$$].target)
          }
        }
      }
    }
    this.instructions[0][1023] ? this.instructions[0][1023].isFunctionEnder = !0 : this.instructions[0][1022] && (this.instructions[0][1022].isFunctionEnder = !0);
    $i$$ = 0;
    for($length$$ = this.entryPoints.length;$i$$ < $length$$;$i$$++) {
      $currentPage_entryPoint$$2_page$$ = this.entryPoints[$i$$].address, $currentAddress$$ = this.entryPoints[$i$$].romPage, this.instructions[$currentAddress$$][$currentPage_entryPoint$$2_page$$].isJumpTarget = !0, this.instructions[$currentAddress$$][$currentPage_entryPoint$$2_page$$].jumpTargetNb++
    }
    for($currentPage_entryPoint$$2_page$$ = 0;$currentPage_entryPoint$$2_page$$ < this.instructions.length;$currentPage_entryPoint$$2_page$$++) {
      for($i$$ = 0, $length$$ = this.instructions[$currentPage_entryPoint$$2_page$$].length;$i$$ < $length$$;$i$$++) {
        this.instructions[$currentPage_entryPoint$$2_page$$][$i$$] && (null != this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].nextAddress && this.instructions[$currentPage_entryPoint$$2_page$$][this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].nextAddress] && this.instructions[$currentPage_entryPoint$$2_page$$][this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].nextAddress].jumpTargetNb++, null != this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].target && ($currentAddress$$ = 
        Math.floor(this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].target / 16384), $bytecode$$ = this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].target % 16384, this.instructions[$currentAddress$$] && this.instructions[$currentAddress$$][$bytecode$$] ? (this.instructions[$currentAddress$$][$bytecode$$].isJumpTarget = !0, this.instructions[$currentAddress$$][$bytecode$$].jumpTargetNb++) : JSSMS.Utils.console.log("Invalid target address", JSSMS.Utils.toHex(this.instructions[$currentPage_entryPoint$$2_page$$][$i$$].target))))
      }
    }
    JSSMS.Utils.console.timeEnd("Parsing")
  }, parseFromAddress:function $$parser$$$$parseFromAddress$($obj$$37_romPage$$) {
    var $address$$ = $obj$$37_romPage$$.address % 16384;
    $obj$$37_romPage$$ = $obj$$37_romPage$$.romPage;
    var $pageStart$$ = 16384 * $obj$$37_romPage$$, $pageEnd$$ = 16384 * ($obj$$37_romPage$$ + 1), $branch$$ = [], $bytecode$$, $firstInstruction$$ = !0, $absoluteAddress$$ = 0;
    1024 > $address$$ && 0 == $obj$$37_romPage$$ && ($pageStart$$ = 0, $pageEnd$$ = 1024);
    do {
      this.instructions[$obj$$37_romPage$$][$address$$] ? $bytecode$$ = this.instructions[$obj$$37_romPage$$][$address$$] : ($bytecode$$ = new Bytecode($address$$, $obj$$37_romPage$$), this.instructions[$obj$$37_romPage$$][$address$$] = $disassemble$$($bytecode$$, this.stream));
      if($bytecode$$.canEnd && !$firstInstruction$$) {
        break
      }
      $address$$ = $bytecode$$.nextAddress % 16384;
      $branch$$.push($bytecode$$);
      $firstInstruction$$ = !1;
      $absoluteAddress$$ = $address$$ + 16384 * $obj$$37_romPage$$
    }while(null != $address$$ && $absoluteAddress$$ >= $pageStart$$ && $absoluteAddress$$ < $pageEnd$$ && !$bytecode$$.isFunctionEnder);
    return $branch$$
  }, writeGraphViz:function $$parser$$$$writeGraphViz$() {
    JSSMS.Utils.console.time("DOT generation");
    for(var $tree$$ = this.instructions, $content$$ = ["digraph G {"], $i$$ = 0, $length$$ = $tree$$.length;$i$$ < $length$$;$i$$++) {
      $tree$$[$i$$] && ($content$$.push(" " + $i$$ + ' [label="' + $tree$$[$i$$].label + '"];'), null != $tree$$[$i$$].target && $content$$.push(" " + $i$$ + " -> " + $tree$$[$i$$].target + ";"), null != $tree$$[$i$$].nextAddress && $content$$.push(" " + $i$$ + " -> " + $tree$$[$i$$].nextAddress + ";"))
    }
    $content$$.push("}");
    $content$$ = $content$$.join("\n");
    $content$$ = $content$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
    JSSMS.Utils.console.timeEnd("DOT generation");
    return $content$$
  }, addAddress:function $$parser$$$$addAddress$($address$$) {
    var $memPage$$ = Math.floor($address$$ / 16384), $romPage$$ = this.frameReg[$memPage$$];
    this.addresses[$romPage$$].push({address:$address$$ % 16384, romPage:$romPage$$, memPage:$memPage$$})
  }};
  $RomStream$$.prototype = {get position() {
    return this.pos
  }, get length() {
    return this.rom.length * PAGE_SIZE
  }, seek:function $$RomStream$$$$seek$($pos$$) {
    this.pos = $pos$$
  }, getUint8:function $$RomStream$$$$getUint8$() {
    var $page$$2_value$$ = 0, $page$$2_value$$ = this.page, $address$$ = this.pos & 16383, $page$$2_value$$ = SUPPORT_DATAVIEW ? this.rom[$page$$2_value$$].getUint8($address$$) : this.rom[$page$$2_value$$][$address$$] & 255;
    this.pos++;
    return $page$$2_value$$
  }, getInt8:function $$RomStream$$$$getInt8$() {
    var $page$$3_value$$ = 0, $page$$3_value$$ = this.page, $address$$ = this.pos & 16383;
    SUPPORT_DATAVIEW ? $page$$3_value$$ = this.rom[$page$$3_value$$].getInt8($address$$) : ($page$$3_value$$ = this.rom[$page$$3_value$$][$address$$] & 255, 128 <= $page$$3_value$$ && ($page$$3_value$$ -= 256));
    this.pos++;
    return $page$$3_value$$ + 1
  }, getUint16:function $$RomStream$$$$getUint16$() {
    var $page$$4_value$$ = 0, $page$$4_value$$ = this.page, $address$$ = this.pos & 16383, $page$$4_value$$ = SUPPORT_DATAVIEW ? 16383 > ($address$$ & 16383) ? this.rom[$page$$4_value$$].getUint16($address$$, LITTLE_ENDIAN) : this.rom[$page$$4_value$$].getUint8($address$$) | this.rom[++$page$$4_value$$].getUint8($address$$) << 8 : this.rom[$page$$4_value$$][$address$$] & 255 | (this.rom[++$page$$4_value$$][$address$$] & 255) << 8;
    this.pos += 2;
    return $page$$4_value$$
  }};
  return $parser$$
}();
var UINT8 = 1, INT8 = 2, UINT16 = 3, BIT_TABLE = [1, 2, 4, 8, 16, 32, 64, 128], n = {IfStatement:function($test$$, $consequent$$, $alternate$$) {
  void 0 == $alternate$$ && ($alternate$$ = null);
  return{type:"IfStatement", test:$test$$, consequent:$consequent$$, alternate:$alternate$$}
}, BlockStatement:function($body$$) {
  void 0 == $body$$ && ($body$$ = []);
  Array.isArray($body$$) || ($body$$ = [$body$$]);
  return{type:"BlockStatement", body:$body$$}
}, ExpressionStatement:function($expression$$) {
  return{type:"ExpressionStatement", expression:$expression$$}
}, ReturnStatement:function($argument$$) {
  void 0 == $argument$$ && ($argument$$ = null);
  return{type:"ReturnStatement", argument:$argument$$}
}, Identifier:function($name$$) {
  return{type:"Identifier", name:$name$$}
}, Literal:function($value$$) {
  return{type:"Literal", value:$value$$, raw:JSSMS.Utils.toHex($value$$)}
}, CallExpression:function($callee$$, $args$$) {
  void 0 == $args$$ && ($args$$ = []);
  Array.isArray($args$$) || ($args$$ = [$args$$]);
  return{type:"CallExpression", callee:n.Identifier($callee$$), arguments:$args$$}
}, AssignmentExpression:function($operator$$, $left$$, $right$$) {
  return{type:"AssignmentExpression", operator:$operator$$, left:$left$$, right:$right$$}
}, BinaryExpression:function($operator$$, $left$$, $right$$) {
  return{type:"BinaryExpression", operator:$operator$$, left:$left$$, right:$right$$}
}, UnaryExpression:function($operator$$, $argument$$) {
  return{type:"UnaryExpression", operator:$operator$$, argument:$argument$$}
}, UpdateExpression:function($operator$$, $argument$$, $prefix$$) {
  void 0 == $prefix$$ && ($prefix$$ = !1);
  return{type:"UpdateExpression", operator:$operator$$, argument:$argument$$, prefix:$prefix$$}
}, MemberExpression:function($object$$, $property$$) {
  return{type:"MemberExpression", computed:!0, object:$object$$, property:$property$$}
}, ConditionalExpression:function($test$$, $consequent$$, $alternate$$) {
  return{type:"ConditionalExpression", test:$test$$, consequent:$consequent$$, alternate:$alternate$$}
}, Register:function($name$$) {
  return{type:"Register", name:$name$$}
}, Bit:function($bitNumber$$) {
  return n.Literal(BIT_TABLE[$bitNumber$$])
}}, o = {NOOP:function() {
  return function() {
  }
}, LD8:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function($value$$) {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), n.Literal($value$$)))
  } : "i" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), n.Register("i"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZ_TABLE"), n.Register($srcRegister$$))), n.ConditionalExpression(n.Identifier("iff2"), n.Literal(F_PARITY), n.Literal(0)))))]
  } : "r" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), REFRESH_EMULATION ? n.Register("r") : n.CallExpression("JSSMS.Utils.rndInt", n.Literal(255)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("f"), n.BinaryExpression("|", n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZ_TABLE"), n.Register($srcRegister$$))), n.ConditionalExpression(n.Identifier("iff2"), n.Literal(F_PARITY), 
    n.Literal(0)))))]
  } : void 0 == $dstRegister2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), n.Register($dstRegister1$$)))
  } : "n" == $dstRegister1$$ && "n" == $dstRegister2$$ ? function($value$$) {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), o.READ_MEM8(n.Literal($value$$))))
  } : function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), o.READ_MEM8(n.CallExpression("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()))))
  }
}, LD8_D:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return function($value$$) {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($srcRegister$$), o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()), n.Literal($value$$)))))
  }
}, LD16:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$, $dstRegister2$$) {
  if(void 0 == $dstRegister1$$ && void 0 == $dstRegister2$$) {
    return function($value$$) {
      return n.ExpressionStatement(n.CallExpression("set" + ($srcRegister1$$ + $srcRegister2$$).toUpperCase(), n.Literal($value$$)))
    }
  }
  if("n" == $dstRegister1$$ && "n" == $dstRegister2$$) {
    return function($value$$) {
      return n.ExpressionStatement(n.CallExpression("set" + ($srcRegister1$$ + $srcRegister2$$).toUpperCase(), o.READ_MEM16(n.Literal($value$$))))
    }
  }
  throw Error("Wrong parameters number");
}, LD_WRITE_MEM:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function($value$$) {
    return n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("get" + ($srcRegister1$$ + $srcRegister2$$).toUpperCase()), n.Literal($value$$)]))
  } : "n" == $srcRegister1$$ && "n" == $srcRegister2$$ && void 0 == $dstRegister2$$ ? function($value$$) {
    return n.ExpressionStatement(n.CallExpression("writeMem", [n.Literal($value$$), n.Register($dstRegister1$$)]))
  } : "n" == $srcRegister1$$ && "n" == $srcRegister2$$ ? function($value$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.Literal($value$$), n.Register($dstRegister2$$)])), n.ExpressionStatement(n.CallExpression("writeMem", [n.Literal($value$$ + 1), n.Register($dstRegister1$$)]))]
  } : function() {
    return n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("get" + ($srcRegister1$$ + $srcRegister2$$).toUpperCase()), n.Register($dstRegister1$$)]))
  }
}, LD_SP:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$) {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.Literal($value$$)))
  } : function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))
  }
}, LD_NN:function($register1$$, $register2$$) {
  return void 0 == $register2$$ ? function($value$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", n.Literal($value$$), n.BinaryExpression("&", n.Identifier($register1$$), n.Literal(255)))), n.ExpressionStatement(n.CallExpression("writeMem", n.Literal($value$$ + 1), n.BinaryExpression(">>", n.Identifier($register1$$), n.Literal(8))))]
  } : function($value$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.Literal($value$$), n.Register($register2$$)])), n.ExpressionStatement(n.CallExpression("writeMem", [n.Literal($value$$ + 1), n.Register($register1$$)]))]
  }
}, INC8:function($register1$$, $register2$$) {
  return void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($register1$$), n.CallExpression("inc8", n.Register($register1$$))))
  } : "s" == $register1$$ && "p" == $register2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1))))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("incMem", n.CallExpression("getHL")))
  }
}, INC16:function($register1$$, $register2$$) {
  return function() {
    return n.ExpressionStatement(n.CallExpression("inc" + ($register1$$ + $register2$$).toUpperCase()))
  }
}, DEC8:function($register1$$, $register2$$) {
  return void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($register1$$), n.CallExpression("dec8", n.Register($register1$$))))
  } : "s" == $register1$$ && "p" == $register2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("sp"), n.BinaryExpression("-", n.Identifier("sp"), n.Literal(1))))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("decMem", n.CallExpression("getHL")))
  }
}, DEC16:function($register1$$, $register2$$) {
  return function() {
    return n.ExpressionStatement(n.CallExpression("dec" + ($register1$$ + $register2$$).toUpperCase()))
  }
}, ADD16:function($register1$$, $register2$$, $register3$$, $register4$$) {
  return void 0 == $register4$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("set" + ($register1$$ + $register2$$).toUpperCase(), n.CallExpression("add16", [n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Register($register3$$)])))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("set" + ($register1$$ + $register2$$).toUpperCase(), n.CallExpression("add16", [n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.CallExpression("get" + ($register3$$ + $register4$$).toUpperCase())])))
  }
}, ADC16:function($register1$$, $register2$$) {
  return void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("add16", n.Identifier($register1$$)))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("add16", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))
  }
}, RLCA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rlca_a"))
  }
}, RRCA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rrca_a"))
  }
}, RLA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rla_a"))
  }
}, RRA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("rra_a"))
  }
}, DAA:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("daa"))
  }
}, CPL:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("cpl_a"))
  }
}, SCF:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))]
  }
}, CCF:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("ccf"))
  }
}, ADD:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$) {
    return n.ExpressionStatement(n.CallExpression("add_a", n.Literal($value$$)))
  } : void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("add_a", n.Register($register1$$)))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("add_a", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))))
  }
}, ADC:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$) {
    return n.ExpressionStatement(n.CallExpression("adc_a", n.Literal($value$$)))
  } : void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("adc_a", n.Register($register1$$)))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("adc_a", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))))
  }
}, SUB:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("sub_a", n.Literal($value$$)))
  } : void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("sub_a", n.Register($register1$$)))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("sub_a", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))))
  }
}, SBC:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("sbc_a", n.Literal($value$$)))
  } : void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("sbc_a", n.Register($register1$$)))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("sbc_a", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))))
  }
}, AND:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), n.Literal($value$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))]
  } : "a" != $register1$$ && void 0 == $register2$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), n.Register($register1$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))]
  } : "a" == $register1$$ && void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))
  } : function() {
    return[n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("a"), o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a")), n.Literal(F_HALFCARRY))))]
  }
}, XOR:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), n.Literal($value$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  } : "a" != $register1$$ && void 0 == $register2$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), n.Register($register1$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  } : "a" == $register1$$ && void 0 == $register2$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Register("a"), n.Literal(0))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Literal(0))))]
  } : function() {
    return[n.ExpressionStatement(n.AssignmentExpression("^=", n.Register("a"), o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  }
}, OR:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), n.Literal($value$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  } : "a" != $register1$$ && void 0 == $register2$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), n.Register($register1$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  } : "a" == $register1$$ && void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))
  } : function() {
    return[n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  }
}, CP:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$) {
    return n.ExpressionStatement(n.CallExpression("cp_a", n.Literal($value$$)))
  } : void 0 == $register2$$ ? function() {
    return n.ExpressionStatement(n.CallExpression("cp_a", n.Register($register1$$)))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("cp_a", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))))
  }
}, POP:function($register1$$, $register2$$) {
  return function() {
    return[n.ExpressionStatement(n.CallExpression("set" + ($register1$$ + $register2$$).toUpperCase(), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2)))]
  }
}, PUSH:function($register1$$, $register2$$) {
  return function() {
    return n.ExpressionStatement(n.CallExpression("push2", [n.Register($register1$$), n.Register($register2$$)]))
  }
}, JR:function($test$$) {
  return function($value$$, $target$$) {
    return n.IfStatement($test$$, n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($target$$))), n.ReturnStatement()]))
  }
}, DJNZ:function() {
  return function($value$$, $target$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Register("b"), n.BinaryExpression("&", n.BinaryExpression("-", n.Register("b"), n.Literal(1)), n.Literal(255)))), o.JR(n.BinaryExpression("!=", n.Register("b"), n.Literal(0)))(void 0, $target$$)]
  }
}, JRNZ:function() {
  return function($value$$, $target$$) {
    return o.JR(n.UnaryExpression("!", n.BinaryExpression("!=", n.BinaryExpression("&", n.Register("f"), n.Literal(F_ZERO)), n.Literal(0))))(void 0, $target$$)
  }
}, JRZ:function() {
  return function($value$$, $target$$) {
    return o.JR(n.BinaryExpression("!=", n.BinaryExpression("&", n.Register("f"), n.Literal(F_ZERO)), n.Literal(0)))(void 0, $target$$)
  }
}, JRNC:function() {
  return function($value$$, $target$$) {
    return o.JR(n.UnaryExpression("!", n.BinaryExpression("!=", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(0))))(void 0, $target$$)
  }
}, JRC:function() {
  return function($value$$, $target$$) {
    return o.JR(n.BinaryExpression("!=", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(0)))(void 0, $target$$)
  }
}, RET:function($operator$$, $bitMask$$) {
  return void 0 == $operator$$ && void 0 == $bitMask$$ ? function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2))), n.ReturnStatement()]
  } : function($value$$, $target$$, $nextAddress$$) {
    return n.IfStatement(n.BinaryExpression($operator$$, n.BinaryExpression("&", n.Register("f"), n.Literal($bitMask$$)), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(6))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2))), n.ReturnStatement()]))
  }
}, JP:function($operator$$, $bitMask$$) {
  return void 0 == $operator$$ && void 0 == $bitMask$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($target$$))), n.ReturnStatement()]
  } : "h" == $operator$$ && "l" == $bitMask$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.CallExpression("getHL"))), n.ReturnStatement()]
  } : function($value$$, $target$$) {
    return n.IfStatement(n.BinaryExpression($operator$$, n.BinaryExpression("&", n.Register("f"), n.Literal($bitMask$$)), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($target$$))), n.ReturnStatement()]))
  }
}, CALL:function($operator$$, $bitMask$$) {
  return void 0 == $operator$$ && void 0 == $bitMask$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("push1", n.Literal($nextAddress$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($target$$))), n.ReturnStatement()]
  } : function($value$$, $target$$, $nextAddress$$) {
    return n.IfStatement(n.BinaryExpression($operator$$, n.BinaryExpression("&", n.Register("f"), n.Literal($bitMask$$)), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(7))), n.ExpressionStatement(n.CallExpression("push1", n.Literal($nextAddress$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($target$$))), n.ReturnStatement()]))
  }
}, RST:function($targetAddress$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("push1", n.Literal($nextAddress$$))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($targetAddress$$))), n.ReturnStatement()]
  }
}, DI:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff1"), n.Literal(!1))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff2"), n.Literal(!1))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("EI_inst"), n.Literal(!0)))]
  }
}, EI:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff1"), n.Literal(!0))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff2"), n.Literal(!0))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("EI_inst"), n.Literal(!0)))]
  }
}, OUT:function($register1$$, $register2$$) {
  return void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("port.out", [n.Literal($value$$), n.Register($register1$$)]))
  } : function() {
    return n.ExpressionStatement(n.CallExpression("port.out", [n.Register($register1$$), n.Register($register2$$)]))
  }
}, IN:function($register1$$, $register2$$) {
  return void 0 == $register2$$ ? function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($register1$$), n.CallExpression("port.in_", n.Literal($value$$))))
  } : function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Register($register1$$), n.CallExpression("port.in_", n.Register($register2$$)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register($register1$$)))))]
  }
}, EX_AF:function() {
  return function() {
    return n.ExpressionStatement(n.CallExpression("exAF"))
  }
}, EXX:function() {
  return function() {
    return[n.ExpressionStatement(n.CallExpression("exBC")), n.ExpressionStatement(n.CallExpression("exDE")), n.ExpressionStatement(n.CallExpression("exHL"))]
  }
}, EX_SP_HL:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("h"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("h"), o.READ_MEM8(n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1))))), n.ExpressionStatement(n.CallExpression("writeMem", [n.BinaryExpression("+", n.Identifier("sp"), n.Literal(1)), n.Identifier("temp")])), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("l"))), n.ExpressionStatement(n.AssignmentExpression("=", 
    n.Register("l"), o.READ_MEM8(n.Identifier("sp")))), n.ExpressionStatement(n.CallExpression("writeMem", [n.Identifier("sp"), n.Identifier("temp")]))]
  }
}, EX_DE_HL:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("d"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("d"), n.Register("h"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("h"), n.Identifier("temp"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("e"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("e"), n.Register("l"))), n.ExpressionStatement(n.AssignmentExpression("=", 
    n.Register("l"), n.Identifier("temp")))]
  }
}, HALT:function() {
  return function($ret_value$$, $target$$, $nextAddress$$) {
    $ret_value$$ = [];
    HALT_SPEEDUP && $ret_value$$.push(n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("tstates"), n.Literal(0))));
    return $ret_value$$.concat([n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("halt"), n.Literal(!0))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.Literal($nextAddress$$ - 1))), n.ReturnStatement()])
  }
}, RLC:generateCBFunctions("rlc"), RRC:generateCBFunctions("rrc"), RL:generateCBFunctions("rl"), RR:generateCBFunctions("rr"), SLA:generateCBFunctions("sla"), SRA:generateCBFunctions("sra"), SLL:generateCBFunctions("sll"), SRL:generateCBFunctions("srl"), BIT:function($bit$$, $register1$$, $register2$$) {
  if(void 0 == $register2$$) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("bit", n.BinaryExpression("&", n.Register($register1$$), n.Bit($bit$$))))
    }
  }
  if("h" == $register1$$ && "l" == $register2$$) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("bit", n.BinaryExpression("&", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())), n.Bit($bit$$))))
    }
  }
  if("i" == $register1$$) {
    return function($value$$, $target$$, $nextAddress$$) {
      return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("bit", n.BinaryExpression("&", o.READ_MEM8(n.Identifier("location")), n.Bit($bit$$))))]
    }
  }
}, RES:function($bit$$, $register1$$, $register2$$) {
  if(void 0 == $register2$$) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("&=", n.Register($register1$$), n.UnaryExpression("~", n.Bit($bit$$))))
    }
  }
  if("h" == $register1$$ && "l" == $register2$$) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("writeMem", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.BinaryExpression("&", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())), n.UnaryExpression("~", n.Bit($bit$$)))))
    }
  }
  if("i" == $register1$$) {
    return function($value$$, $target$$, $nextAddress$$) {
      return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("writeMem", [n.Identifier("location"), n.BinaryExpression("&", o.READ_MEM8(n.Identifier("location")), n.UnaryExpression("~", n.Bit($bit$$)))]))]
    }
  }
}, SET:function($bit$$, $register1$$, $register2$$) {
  if(void 0 == $register2$$) {
    return function() {
      return n.ExpressionStatement(n.AssignmentExpression("|=", n.Register($register1$$), n.Bit($bit$$)))
    }
  }
  if("h" == $register1$$ && "l" == $register2$$) {
    return function() {
      return n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.BinaryExpression("|", o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())), n.Bit($bit$$))]))
    }
  }
  if("i" == $register1$$) {
    return function($value$$, $target$$, $nextAddress$$) {
      return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("writeMem", [n.Identifier("location"), n.BinaryExpression("|", o.READ_MEM8(n.Identifier("location")), n.Bit($bit$$))]))]
    }
  }
}, LD_X:function($register1$$, $register2$$, $register3$$) {
  return void 0 == $register3$$ ? function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$ & 255)), n.Literal($value$$ >> 8)]))]
  } : function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.BinaryExpression("+", n.CallExpression("get" + ($register2$$ + $register3$$).toUpperCase()), n.Literal($value$$)), n.Register($register1$$)]))]
  }
}, INC_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("incMem", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$))))]
  }
}, DEC_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("decMem", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$))))]
  }
}, ADD_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("add_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)))))
  }
}, ADC_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("adc_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)))))
  }
}, SUB_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("sub_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)))))
  }
}, SBC_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("sbc_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)))))
  }
}, OR_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("a"), o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$))))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.MemberExpression(n.Identifier("SZP_TABLE"), n.Register("a"))))]
  }
}, CP_X:function($register1$$, $register2$$) {
  return function($value$$) {
    return n.ExpressionStatement(n.CallExpression("cp_a", o.READ_MEM8(n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)))))
  }
}, EX_SP_X:function($register1$$, $register2$$) {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))), n.ExpressionStatement(n.CallExpression("set" + ($register1$$ + $register2$$).toUpperCase(), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.CallExpression("writeMem", [n.Identifier("sp"), n.BinaryExpression("&", n.Identifier("temp"), n.Literal(255))])), n.ExpressionStatement(n.CallExpression("writeMem", [n.BinaryExpression("+", n.Identifier("sp"), 
    n.Literal(1)), n.BinaryExpression(">>", n.Identifier("sp"), n.Literal(8))]))]
  }
}, JP_X:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()))), n.ReturnStatement()]
  }
}, SBC16:function($register1$$, $register2$$) {
  return function($value$$, $target$$, $nextAddress$$) {
    return n.ExpressionStatement(n.CallExpression("sbc16", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))
  }
}, NEG:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.Register("a"))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("a"), n.Literal(0))), n.ExpressionStatement(n.CallExpression("sub_a", n.Identifier("temp")))]
  }
}, RETN_RETI:function() {
  return function() {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("pc"), o.READ_MEM16(n.Identifier("sp")))), n.ExpressionStatement(n.AssignmentExpression("+=", n.Identifier("sp"), n.Literal(2))), n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("iff1"), n.Identifier("iff2")))]
  }
}, IM:function($value$$) {
  return function() {
    return n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("im"), n.Literal($value$$)))
  }
}, INI:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.CallExpression("port.in_", n.Register("c")))), n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("getHL"), n.Identifier("temp")])), o.DEC8("b")(), n.ExpressionStatement(n.CallExpression("incHL")), n.IfStatement(n.BinaryExpression("==", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(128)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), 
    n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]
  }
}, OUTI:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("getHL")))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), n.ExpressionStatement(n.CallExpression("incHL")), o.DEC8("b")(), n.IfStatement(n.BinaryExpression(">", n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), 
    n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("==", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(128)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]
  }
}, OUTD:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("getHL")))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), n.ExpressionStatement(n.CallExpression("decHL")), o.DEC8("b")(), n.IfStatement(n.BinaryExpression(">", n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), 
    n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("==", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(128)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]
  }
}, LDI:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("getDE"), o.READ_MEM8(n.CallExpression("getHL"))])), n.ExpressionStatement(n.CallExpression("incDE")), n.ExpressionStatement(n.CallExpression("incHL")), n.ExpressionStatement(n.CallExpression("decBC")), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(193)), n.ConditionalExpression(n.BinaryExpression("!=", n.CallExpression("getBC"), 
    n.Literal(0)), n.Literal(F_PARITY), n.Literal(0)))))]
  }
}, CPI:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(F_CARRY)), n.Literal(F_NEGATIVE)))), n.ExpressionStatement(n.CallExpression("cp_a", [o.READ_MEM8(n.CallExpression("getHL"))])), n.ExpressionStatement(n.CallExpression("incHL")), n.ExpressionStatement(n.CallExpression("decBC")), n.ExpressionStatement(n.AssignmentExpression("|=", n.Identifier("temp"), n.ConditionalExpression(n.BinaryExpression("==", 
    n.CallExpression("getBC"), n.Literal(0)), n.Literal(0), n.Literal(F_PARITY)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(248)), n.Identifier("temp"))))]
  }
}, LDD:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("getDE"), o.READ_MEM8(n.CallExpression("getHL"))])), n.ExpressionStatement(n.CallExpression("decDE")), n.ExpressionStatement(n.CallExpression("decHL")), n.ExpressionStatement(n.CallExpression("decBC")), n.ExpressionStatement(n.AssignmentExpression("=", n.Register("f"), n.BinaryExpression("|", n.BinaryExpression("&", n.Register("f"), n.Literal(193)), n.ConditionalExpression(n.BinaryExpression("!=", n.CallExpression("getBC"), 
    n.Literal(0)), n.Literal(F_PARITY), n.Literal(0)))))]
  }
}, LDIR:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.CallExpression("writeMem", [n.CallExpression("getDE"), o.READ_MEM8(n.CallExpression("getHL"))])), n.ExpressionStatement(n.CallExpression("incDE")), n.ExpressionStatement(n.CallExpression("incHL")), n.ExpressionStatement(n.CallExpression("decBC")), n.IfStatement(n.BinaryExpression("!=", n.CallExpression("getBC"), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ExpressionStatement(n.AssignmentExpression("|=", 
    n.Register("f"), n.Literal(F_PARITY))), n.ReturnStatement()]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_PARITY))))])), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_HALFCARRY))))]
  }
}, OTIR:function() {
  return function($value$$, $target$$, $nextAddress$$) {
    return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("temp"), o.READ_MEM8(n.CallExpression("getHL")))), n.ExpressionStatement(n.CallExpression("port.out", [n.Register("c"), n.Identifier("temp")])), o.DEC8("b")(), n.ExpressionStatement(n.CallExpression("incHL")), n.IfStatement(n.BinaryExpression("!=", n.Register("b"), n.Literal(0)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("-=", n.Identifier("tstates"), n.Literal(5))), n.ReturnStatement()])), n.IfStatement(n.BinaryExpression(">", 
    n.BinaryExpression("+", n.Register("l"), n.Identifier("temp")), n.Literal(255)), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_CARRY))), n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_HALFCARRY)))]), n.BlockStatement([n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_CARRY)))), n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", 
    n.Literal(F_HALFCARRY))))])), n.IfStatement(n.BinaryExpression("!=", n.BinaryExpression("&", n.Identifier("temp"), n.Literal(128)), n.Literal(0)), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("|=", n.Register("f"), n.Literal(F_NEGATIVE)))), n.BlockStatement(n.ExpressionStatement(n.AssignmentExpression("&=", n.Register("f"), n.UnaryExpression("~", n.Literal(F_NEGATIVE))))))]
  }
}, LD_RLC:generateIndexCBFunctions("rlc"), LD_RRC:generateIndexCBFunctions("rrc"), LD_RL:generateIndexCBFunctions("rl"), LD_RR:generateIndexCBFunctions("rr"), LD_SLA:generateIndexCBFunctions("sla"), LD_SRA:generateIndexCBFunctions("sra"), LD_SLL:generateIndexCBFunctions("sll"), LD_SRL:generateIndexCBFunctions("srl"), READ_MEM8:function($value$$) {
  return n.CallExpression("readMem", $value$$)
}, READ_MEM16:function($value$$) {
  return n.CallExpression("readMemWord", $value$$)
}};
function generateCBFunctions($fn$$) {
  return function($register1$$, $register2$$) {
    return void 0 == $register2$$ ? function() {
      return n.ExpressionStatement(n.AssignmentExpression("=", n.Register($register1$$), n.CallExpression($fn$$, n.Register($register1$$))))
    } : function() {
      return n.ExpressionStatement(n.CallExpression("writeMem", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.CallExpression($fn$$, o.READ_MEM8(n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase())))))
    }
  }
}
function generateIndexCBFunctions($fn$$) {
  return function($register1$$, $register2$$, $register3$$) {
    return void 0 == $register3$$ ? function($value$$, $target$$, $nextAddress$$) {
      return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)), n.Literal(65535)))), n.ExpressionStatement(n.CallExpression("writeMem", [n.Identifier("location"), n.CallExpression($fn$$, o.READ_MEM8(n.Identifier("location")))]))]
    } : function($value$$, $target$$, $nextAddress$$) {
      return[n.ExpressionStatement(n.AssignmentExpression("=", n.Identifier("location"), n.BinaryExpression("&", n.BinaryExpression("+", n.CallExpression("get" + ($register1$$ + $register2$$).toUpperCase()), n.Literal($value$$)), n.Literal(65535)))), n.ExpressionStatement(n.AssignmentExpression("=", n.Register($register3$$), n.CallExpression($fn$$, o.READ_MEM8(n.Identifier("location"))))), n.ExpressionStatement(n.CallExpression("writeMem", [n.Identifier("location"), n.Register($register3$$)]))]
    }
  }
}
;var opcodeTableCB = [], opcodeTableDDCB = [], opcodeTableFDCB = [], regs = {B:["b"], C:["c"], D:["d"], E:["e"], H:["h"], L:["l"], "(HL)":["h", "l"], A:["a"]};
"RLC RRC RL RR SLA SRA SLL SRL".split(" ").forEach(function($op$$) {
  for(var $reg$$ in regs) {
    opcodeTableCB.push({name:$op$$ + " " + $reg$$, ast:o[$op$$].apply(null, regs[$reg$$])}), "(HL)" != $reg$$ ? (opcodeTableDDCB.push({name:"LD " + $reg$$ + "," + $op$$ + " (IX)", ast:o["LD_" + $op$$].apply(null, ["i", "x"].concat(regs[$reg$$]))}), opcodeTableFDCB.push({name:"LD " + $reg$$ + "," + $op$$ + " (IY)", ast:o["LD_" + $op$$].apply(null, ["i", "y"].concat(regs[$reg$$]))})) : (opcodeTableDDCB.push({name:$op$$ + " (IX)", ast:o["LD_" + $op$$]("i", "x")}), opcodeTableFDCB.push({name:$op$$ + 
    " (IY)", ast:o["LD_" + $op$$]("i", "y")}))
  }
});
["BIT", "RES", "SET"].forEach(function($op$$) {
  for(var $i$$ = 0;8 > $i$$;$i$$++) {
    for(var $reg$$ in regs) {
      opcodeTableCB.push({name:$op$$ + " " + $i$$ + "," + $reg$$, ast:o[$op$$].apply(null, [$i$$].concat(regs[$reg$$]))})
    }
    for(var $j$$ = 0;8 > $j$$;$j$$++) {
      opcodeTableDDCB.push({name:$op$$ + " " + $i$$ + " (IX)", ast:o[$op$$].apply(null, [$i$$].concat(["i", "x"]))}), opcodeTableFDCB.push({name:$op$$ + " " + $i$$ + " (IY)", ast:o[$op$$].apply(null, [$i$$].concat(["i", "y"]))})
    }
  }
});
function generateIndexTable($index$$) {
  var $register2$$ = $index$$.substring(1, 2), $register2LC$$ = $index$$.substring(1, 2).toLowerCase();
  return{9:{name:"ADD " + $index$$ + ",BC", ast:o.ADD16("i", $register2$$, "b", "c")}, 25:{name:"ADD " + $index$$ + ",DE", ast:o.ADD16("i", $register2$$, "d", "e")}, 33:{name:"LD " + $index$$ + ",nn", ast:o.LD16("i", $register2$$)}, 34:{name:"LD (nn)," + $index$$, ast:o.LD_NN("i" + $register2LC$$ + "H", "i" + $register2LC$$ + "L")}, 35:{name:"INC " + $index$$, ast:o.INC16("i", $register2$$)}, 42:{name:"LD " + $index$$ + ",(nn)", ast:o.LD16("i", $register2$$, "n", "n"), operand:UINT16}, 43:{name:"DEC " + 
  $index$$, ast:o.DEC16("i", $register2$$)}, 52:{name:"INC (" + $index$$ + "+d)", ast:o.INC_X("i", $register2$$)}, 53:{name:"DEC (" + $index$$ + "+d)", ast:o.DEC_X("i", $register2$$)}, 54:{name:"LD (" + $index$$ + "+d),n", ast:o.LD_X("i", $register2$$)}, 70:{name:"LD B,(" + $index$$ + "+d)", ast:o.LD8_D("b", "i", $register2$$)}, 78:{name:"LD C,(" + $index$$ + "+d)", ast:o.LD8_D("c", "i", $register2$$)}, 84:{name:" LD D," + $index$$ + "H *", ast:o.LD8("d", "i" + $register2LC$$ + "H")}, 86:{name:"LD D,(" + 
  $index$$ + "+d)", ast:o.LD8_D("d", "i", $register2$$)}, 93:{name:"LD E," + $index$$ + "L *", ast:o.LD8("e", "i" + $register2LC$$ + "L")}, 94:{name:"LD E,(" + $index$$ + "+d)", ast:o.LD8_D("e", "i", $register2$$)}, 96:{name:"LD " + $index$$ + "H,B", ast:o.LD8("i" + $register2LC$$ + "H", "b")}, 97:{name:"LD " + $index$$ + "H,C", ast:o.LD8("i" + $register2LC$$ + "H", "c")}, 98:{name:"LD " + $index$$ + "H,D", ast:o.LD8("i" + $register2LC$$ + "H", "d")}, 99:{name:"LD " + $index$$ + "H,E", ast:o.LD8("i" + 
  $register2LC$$ + "H", "e")}, 100:{name:"LD " + $index$$ + "H," + $index$$ + "H", ast:o.NOOP()}, 101:{name:"LD " + $index$$ + "H," + $index$$ + "L *", ast:o.LD8_D("i" + $register2LC$$ + "H", "i" + $register2LC$$ + "L")}, 102:{name:"LD H,(" + $index$$ + "+d)", ast:o.LD8_D("h", "i", $register2$$)}, 103:{name:"LD " + $index$$ + "H,A", ast:o.LD8("i" + $register2LC$$ + "H", "a")}, 104:{name:"LD " + $index$$ + "L,B", ast:o.LD8("i" + $register2LC$$ + "L", "b")}, 105:{name:"LD " + $index$$ + "L,C", ast:o.LD8("i" + 
  $register2LC$$ + "L", "c")}, 106:{name:"LD " + $index$$ + "L,D", ast:o.LD8("i" + $register2LC$$ + "L", "d")}, 107:{name:"LD " + $index$$ + "L,E", ast:o.LD8("i" + $register2LC$$ + "L", "e")}, 108:{name:"LD " + $index$$ + "L," + $index$$ + "H", ast:o.LD8_D("i" + $register2LC$$ + "L", "i" + $register2LC$$ + "H")}, 109:{name:"LD " + $index$$ + "L," + $index$$ + "L *", ast:o.NOOP()}, 110:{name:"LD L,(" + $index$$ + "+d)", ast:o.LD8_D("l", "i", $register2$$)}, 111:{name:"LD " + $index$$ + "L,A *", ast:o.LD8("i" + 
  $register2LC$$ + "L", "a")}, 112:{name:"LD (" + $index$$ + "+d),B", ast:o.LD_X("b", "i", $register2$$)}, 113:{name:"LD (" + $index$$ + "+d),C", ast:o.LD_X("c", "i", $register2$$)}, 114:{name:"LD (" + $index$$ + "+d),D", ast:o.LD_X("d", "i", $register2$$)}, 115:{name:"LD (" + $index$$ + "+d),E", ast:o.LD_X("e", "i", $register2$$)}, 116:{name:"LD (" + $index$$ + "+d),H", ast:o.LD_X("h", "i", $register2$$)}, 117:{name:"LD (" + $index$$ + "+d),L", ast:o.LD_X("l", "i", $register2$$)}, 118:{name:"LD (" + 
  $index$$ + "+d),B", ast:o.LD_X("b", "i", $register2$$)}, 119:{name:"LD (" + $index$$ + "+d),A", ast:o.LD_X("a", "i", $register2$$)}, 126:{name:"LD A,(" + $index$$ + "+d)", ast:o.LD8_D("a", "i", $register2$$)}, 124:{name:"LD A," + $index$$ + "H", ast:o.LD8("a", "i" + $register2LC$$ + "H")}, 125:{name:"LD A," + $index$$ + "L", ast:o.LD8("a", "i" + $register2LC$$ + "L")}, 134:{name:"ADD A,(" + $index$$ + "+d)", ast:o.ADD_X("i", $register2$$)}, 142:{name:"ADC A,(" + $index$$ + "+d)", ast:o.ADC_X("i", 
  $register2$$)}, 150:{name:"SUB A,(" + $index$$ + "+d)", ast:o.SUB_X("i", $register2$$)}, 158:{name:"SBC A,(" + $index$$ + "+d)", ast:o.SBC_X("i", $register2$$)}, 203:"IX" == $index$$ ? opcodeTableDDCB : opcodeTableFDCB, 182:{name:"OR A,(" + $index$$ + "+d)", ast:o.OR_X("i", $register2$$)}, 190:{name:"CP (" + $index$$ + "+d)", ast:o.CP_X("i", $register2$$)}, 225:{name:"POP " + $index$$, ast:o.POP("i", $register2$$)}, 227:{name:"EX SP,(" + $index$$ + ")", ast:o.EX_SP_X("i", $register2$$)}, 229:{name:"PUSH " + 
  $index$$, ast:o.PUSH("i" + $register2LC$$ + "H", "i" + $register2LC$$ + "L")}, 233:{name:"JP (" + $index$$ + ")", ast:o.JP_X("i", $register2$$)}, 249:{name:"LD SP," + $index$$, ast:o.LD_SP("i", $register2$$)}}
}
;var opcodeTableED = {64:{name:"IN B,(C)", ast:o.IN("b", "c")}, 66:{name:"SBC HL,BC", ast:o.SBC16("b", "c")}, 65:{name:"OUT (C),B", ast:o.OUT("c", "b")}, 67:{name:"LD (nn),BC", ast:o.LD_NN("b", "c")}, 68:{name:"NEG", ast:o.NEG()}, 69:{name:"RETN / RETI", ast:o.RETN_RETI()}, 70:{name:"IM 0", ast:o.IM(0)}, 72:{name:"IN C,(C)", ast:o.IN("c", "c")}, 73:{name:"OUT (C),C", ast:o.OUT("c", "c")}, 74:{name:"ADC HL,BC", ast:o.ADC16("b", "c")}, 75:{name:"LD BC,(nn)", ast:o.LD16("b", "c", "n", "n"), operand:UINT16}, 
76:{name:"NEG", ast:o.NEG()}, 77:{name:"RETN / RETI", ast:o.RETN_RETI()}, 78:{name:"IM 0", ast:o.IM(0)}, 80:{name:"IN D,(C)", ast:o.IN("d", "c")}, 81:{name:"OUT (C),D", ast:o.OUT("c", "d")}, 82:{name:"SBC HL,DE", ast:o.SBC16("d", "e")}, 83:{name:"LD (nn),DE", ast:o.LD_NN("d", "e")}, 84:{name:"NEG", ast:o.NEG()}, 85:{name:"RETN / RETI", ast:o.RETN_RETI()}, 86:{name:"IM 1", ast:o.IM(1)}, 87:{name:"LD A,I", ast:o.LD8("a", "i")}, 88:{name:"IN E,(C)", ast:o.IN("e", "c")}, 89:{name:"OUT (C),E", ast:o.OUT("c", 
"e")}, 90:{name:"ADC HL,DE", ast:o.ADC16("d", "e")}, 91:{name:"LD DE,(nn)", ast:o.LD16("d", "e", "n", "n"), operand:UINT16}, 92:{name:"NEG", ast:o.NEG()}, 95:{name:"LD A,R", ast:o.LD8("a", "r")}, 96:{name:"IN H,(C)", ast:o.IN("h", "c")}, 97:{name:"OUT (C),H", ast:o.OUT("c", "h")}, 98:{name:"SBC HL,HL", ast:o.SBC16("h", "l")}, 99:{name:"LD (nn),HL", ast:o.LD_NN("h", "l")}, 100:{name:"NEG", ast:o.NEG()}, 102:{name:"IM 0", ast:o.IM(0)}, 104:{name:"IN L,(C)", ast:o.IN("l", "c")}, 105:{name:"OUT (C),L", 
ast:o.OUT("c", "l")}, 106:{name:"ADC HL,HL", ast:o.ADC16("h", "l")}, 107:{name:"LD HL,(nn)", ast:o.LD16("h", "l", "n", "n"), operand:UINT16}, 108:{name:"NEG", ast:o.NEG()}, 110:{name:"IM 0", ast:o.IM(0)}, 115:{name:"LD (nn),SP", ast:o.LD_NN("sp")}, 116:{name:"NEG", ast:o.NEG()}, 118:{name:"IM 1", ast:o.IM(1)}, 120:{name:"IN A,(C)", ast:o.IN("a", "c")}, 121:{name:"OUT (C),A", ast:o.OUT("c", "a")}, 122:{name:"ADC HL,SP", ast:o.ADC16("sp")}, 124:{name:"NEG", ast:o.NEG()}, 160:{name:"LDI", ast:o.LDI()}, 
161:{name:"CPI", ast:o.CPI()}, 162:{name:"INI", ast:o.INI()}, 163:{name:"OUTI", ast:o.OUTI()}, 168:{name:"LDD", ast:o.LDD()}, 171:{name:"OUTD", ast:o.OUTD()}, 176:{name:"LDIR", ast:o.LDIR()}, 179:{name:"OTIR", ast:o.OTIR()}};
var opcodeTable = [{name:"NOP", ast:o.NOOP()}, {name:"LD BC,nn", ast:o.LD16("b", "c"), operand:UINT16}, {name:"LD (BC),A", ast:o.LD_WRITE_MEM("b", "c", "a")}, {name:"INC BC", ast:o.INC16("b", "c")}, {name:"INC B", ast:o.INC8("b")}, {name:"DEC B", ast:o.DEC8("b")}, {name:"LD B,n", ast:o.LD8("b"), operand:UINT8}, {name:"RLCA", ast:o.RLCA()}, {name:"EX AF AF'", ast:o.EX_AF()}, {name:"ADD HL,BC", ast:o.ADD16("h", "l", "b", "c")}, {name:"LD A,(BC)", ast:o.LD8("a", "b", "c")}, {name:"DEC BC", ast:o.DEC16("b", 
"c")}, {name:"INC C", ast:o.INC8("c")}, {name:"DEC C", ast:o.DEC8("c")}, {name:"LD C,n", ast:o.LD8("c"), operand:UINT8}, {name:"RRCA", ast:o.RRCA()}, {name:"DJNZ (PC+e)", ast:o.DJNZ(), operand:INT8}, {name:"LD DE,nn", ast:o.LD16("d", "e"), operand:UINT16}, {name:"LD (DE),A", ast:o.LD_WRITE_MEM("d", "e", "a")}, {name:"INC DE", ast:o.INC16("d", "e")}, {name:"INC D", ast:o.INC8("d")}, {name:"DEC D", ast:o.DEC8("d")}, {name:"LD D,n", ast:o.LD8("d"), operand:UINT8}, {name:"RLA", ast:o.RLA()}, {name:"JR (PC+e)", 
ast:o.JP(), operand:INT8}, {name:"ADD HL,DE", ast:o.ADD16("h", "l", "d", "e")}, {name:"LD A,(DE)", ast:o.LD8("a", "d", "e")}, {name:"DEC DE", ast:o.DEC16("d", "e")}, {name:"INC E", ast:o.INC8("e")}, {name:"DEC E", ast:o.DEC8("e")}, {name:"LD E,n", ast:o.LD8("e"), operand:UINT8}, {name:"RRA", ast:o.RRA()}, {name:"JR NZ,(PC+e)", ast:o.JRNZ(), operand:INT8}, {name:"LD HL,nn", ast:o.LD16("h", "l"), operand:UINT16}, {name:"LD (nn),HL", ast:o.LD_NN("h", "l"), operand:UINT16}, {name:"INC HL", ast:o.INC16("h", 
"l")}, {name:"INC H", ast:o.INC8("h")}, {name:"DEC H", ast:o.DEC8("h")}, {name:"LD H,n", ast:o.LD8("h"), operand:UINT8}, {name:"DAA", ast:o.DAA()}, {name:"JR Z,(PC+e)", ast:o.JRZ(), operand:INT8}, {name:"ADD HL,HL", ast:o.ADD16("h", "l", "h", "l")}, {name:"LD HL,(nn)", ast:o.LD16("h", "l", "n", "n"), operand:UINT16}, {name:"DEC HL", ast:o.DEC16("h", "l")}, {name:"INC L", ast:o.INC8("l")}, {name:"DEC L", ast:o.DEC8("l")}, {name:"LD L,n", ast:o.LD8("l"), operand:UINT8}, {name:"CPL", ast:o.CPL()}, {name:"JR NC,(PC+e)", 
ast:o.JRNC(), operand:INT8}, {name:"LD SP,nn", ast:o.LD_SP(), operand:UINT16}, {name:"LD (nn),A", ast:o.LD_WRITE_MEM("n", "n", "a"), operand:UINT16}, {name:"INC SP", ast:o.INC8("s", "p")}, {name:"INC (HL)", ast:o.INC8("h", "l")}, {name:"DEC (HL)", ast:o.DEC8("h", "l")}, {name:"LD (HL),n", ast:o.LD_WRITE_MEM("h", "l"), operand:UINT8}, {name:"SCF", ast:o.SCF()}, {name:"JR C,(PC+e)", ast:o.JRC(), operand:INT8}, {name:"ADD HL,SP", ast:o.ADD16("h", "l", "sp")}, {name:"LD A,(nn)", ast:o.LD8("a", "n", "n"), 
operand:UINT16}, {name:"DEC SP", ast:o.DEC8("s", "p")}, {name:"INC A", ast:o.INC8("a")}, {name:"DEC A", ast:o.DEC8("a")}, {name:"LD A,n", ast:o.LD8("a"), operand:UINT8}, {name:"CCF", ast:o.CCF()}, {name:"LD B,B", ast:o.NOOP(), operand:UINT8}, {name:"LD B,C", ast:o.LD8("b", "c")}, {name:"LD B,D", ast:o.LD8("b", "d")}, {name:"LD B,E", ast:o.LD8("b", "e")}, {name:"LD B,H", ast:o.LD8("b", "h")}, {name:"LD B,L", ast:o.LD8("b", "l")}, {name:"LD B,(HL)", ast:o.LD8("b", "h", "l")}, {name:"LD B,A", ast:o.LD8("b", 
"a")}, {name:"LD C,B", ast:o.LD8("c", "b")}, {name:"LD C,C", ast:o.NOOP()}, {name:"LD C,D", ast:o.LD8("c", "d")}, {name:"LD C,E", ast:o.LD8("c", "e")}, {name:"LD C,H", ast:o.LD8("c", "h")}, {name:"LD C,L", ast:o.LD8("c", "l")}, {name:"LD C,(HL)", ast:o.LD8("c", "h", "l")}, {name:"LD C,A", ast:o.LD8("c", "a")}, {name:"LD D,B", ast:o.LD8("d", "b")}, {name:"LD D,C", ast:o.LD8("d", "c")}, {name:"LD D,D", ast:o.NOOP()}, {name:"LD D,E", ast:o.LD8("d", "e")}, {name:"LD D,H", ast:o.LD8("d", "h")}, {name:"LD D,L", 
ast:o.LD8("d", "l")}, {name:"LD D,(HL)", ast:o.LD8("d", "h", "l")}, {name:"LD D,A", ast:o.LD8("d", "a")}, {name:"LD E,B", ast:o.LD8("e", "b")}, {name:"LD E,C", ast:o.LD8("e", "c")}, {name:"LD E,D", ast:o.LD8("e", "d")}, {name:"LD E,E", ast:o.NOOP()}, {name:"LD E,H", ast:o.LD8("e", "h")}, {name:"LD E,L", ast:o.LD8("e", "l")}, {name:"LD E,(HL)", ast:o.LD8("e", "h", "l")}, {name:"LD E,A", ast:o.LD8("e", "a")}, {name:"LD H,B", ast:o.LD8("h", "b")}, {name:"LD H,C", ast:o.LD8("h", "c")}, {name:"LD H,D", 
ast:o.LD8("h", "d")}, {name:"LD H,E", ast:o.LD8("h", "e")}, {name:"LD H,H", ast:o.NOOP()}, {name:"LD H,L", ast:o.LD8("h", "l")}, {name:"LD H,(HL)", ast:o.LD8("h", "h", "l")}, {name:"LD H,A", ast:o.LD8("h", "a")}, {name:"LD L,B", ast:o.LD8("l", "b")}, {name:"LD L,C", ast:o.LD8("l", "c")}, {name:"LD L,D", ast:o.LD8("l", "d")}, {name:"LD L,E", ast:o.LD8("l", "e")}, {name:"LD L,H", ast:o.LD8("l", "h")}, {name:"LD L,L", ast:o.NOOP()}, {name:"LD L,(HL)", ast:o.LD8("l", "h", "l")}, {name:"LD L,A", ast:o.LD8("l", 
"a")}, {name:"LD (HL),B", ast:o.LD_WRITE_MEM("h", "l", "b")}, {name:"LD (HL),C", ast:o.LD_WRITE_MEM("h", "l", "c")}, {name:"LD (HL),D", ast:o.LD_WRITE_MEM("h", "l", "d")}, {name:"LD (HL),E", ast:o.LD_WRITE_MEM("h", "l", "e")}, {name:"LD (HL),H", ast:o.LD_WRITE_MEM("h", "l", "h")}, {name:"LD (HL),L", ast:o.LD_WRITE_MEM("h", "l", "l")}, {name:"HALT", ast:o.HALT()}, {name:"LD (HL),A", ast:o.LD_WRITE_MEM("h", "l", "a")}, {name:"LD A,B", ast:o.LD8("a", "b")}, {name:"LD A,C", ast:o.LD8("a", "c")}, {name:"LD A,D", 
ast:o.LD8("a", "d")}, {name:"LD A,E", ast:o.LD8("a", "e")}, {name:"LD A,H", ast:o.LD8("a", "h")}, {name:"LD A,L", ast:o.LD8("a", "l")}, {name:"LD A,(HL)", ast:o.LD8("a", "h", "l")}, {name:"LD A,A", ast:o.NOOP()}, {name:"ADD A,B", ast:o.ADD("b")}, {name:"ADD A,C", ast:o.ADD("c")}, {name:"ADD A,D", ast:o.ADD("d")}, {name:"ADD A,E", ast:o.ADD("e")}, {name:"ADD A,H", ast:o.ADD("h")}, {name:"ADD A,L", ast:o.ADD("l")}, {name:"ADD A,(HL)", ast:o.ADD("h", "l")}, {name:"ADD A,A", ast:o.ADD("a")}, {name:"ADC A,B", 
ast:o.ADC("b")}, {name:"ADC A,C", ast:o.ADC("c")}, {name:"ADC A,D", ast:o.ADC("d")}, {name:"ADC A,E", ast:o.ADC("e")}, {name:"ADC A,H", ast:o.ADC("h")}, {name:"ADC A,L", ast:o.ADC("l")}, {name:"ADC A,(HL)", ast:o.ADC("h", "l")}, {name:"ADC A,A", ast:o.ADC("a")}, {name:"SUB A,B", ast:o.SUB("b")}, {name:"SUB A,C", ast:o.SUB("c")}, {name:"SUB A,D", ast:o.SUB("d")}, {name:"SUB A,E", ast:o.SUB("e")}, {name:"SUB A,H", ast:o.SUB("h")}, {name:"SUB A,L", ast:o.SUB("l")}, {name:"SUB A,(HL)", ast:o.SUB("h", 
"l")}, {name:"SUB A,A", ast:o.SUB("a")}, {name:"SBC A,B", ast:o.SBC("b")}, {name:"SBC A,C", ast:o.SBC("c")}, {name:"SBC A,D", ast:o.SBC("d")}, {name:"SBC A,E", ast:o.SBC("e")}, {name:"SBC A,H", ast:o.SBC("h")}, {name:"SBC A,L", ast:o.SBC("l")}, {name:"SBC A,(HL)", ast:o.SBC("h", "l")}, {name:"SBC A,A", ast:o.SBC("a")}, {name:"AND A,B", ast:o.AND("b")}, {name:"AND A,C", ast:o.AND("c")}, {name:"AND A,D", ast:o.AND("d")}, {name:"AND A,E", ast:o.AND("e")}, {name:"AND A,H", ast:o.AND("h")}, {name:"AND A,L", 
ast:o.AND("l")}, {name:"AND A,(HL)", ast:o.AND("h", "l")}, {name:"AND A,A", ast:o.AND("a")}, {name:"XOR A,B", ast:o.XOR("b")}, {name:"XOR A,C", ast:o.XOR("c")}, {name:"XOR A,D", ast:o.XOR("d")}, {name:"XOR A,E", ast:o.XOR("e")}, {name:"XOR A,H", ast:o.XOR("h")}, {name:"XOR A,L", ast:o.XOR("l")}, {name:"XOR A,(HL)", ast:o.XOR("h", "l")}, {name:"XOR A,A", ast:o.XOR("a")}, {name:"OR A,B", ast:o.OR("b")}, {name:"OR A,C", ast:o.OR("c")}, {name:"OR A,D", ast:o.OR("d")}, {name:"OR A,E", ast:o.OR("e")}, 
{name:"OR A,H", ast:o.OR("h")}, {name:"OR A,L", ast:o.OR("l")}, {name:"OR A,(HL)", ast:o.OR("h", "l")}, {name:"OR A,A", ast:o.OR("a")}, {name:"CP A,B", ast:o.CP("b")}, {name:"CP A,C", ast:o.CP("c")}, {name:"CP A,D", ast:o.CP("d")}, {name:"CP A,E", ast:o.CP("e")}, {name:"CP A,H", ast:o.CP("h")}, {name:"CP A,L", ast:o.CP("l")}, {name:"CP A,(HL)", ast:o.CP("h", "l")}, {name:"CP A,A", ast:o.CP("a")}, {name:"RET NZ", ast:o.RET("==", F_ZERO)}, {name:"POP BC", ast:o.POP("b", "c")}, {name:"JP NZ,(nn)", ast:o.JP("==", 
F_ZERO)}, {name:"JP (nn)", ast:o.JP()}, {name:"CALL NZ (nn)", ast:o.CALL("==", F_ZERO)}, {name:"PUSH BC", ast:o.PUSH("b", "c")}, {name:"ADD A,n", ast:o.ADD()}, {name:"RST 0x00", ast:o.RST(0)}, {name:"RET Z", ast:o.RET("!=", F_ZERO)}, {name:"RET", ast:o.RET()}, {name:"JP Z,(nn)", ast:o.JP("!=", F_ZERO)}, opcodeTableCB, {name:"CALL Z (nn)", ast:o.CALL("!=", F_ZERO)}, {name:"CALL (nn)", ast:o.CALL()}, {name:"ADC A,n", ast:o.ADC()}, {name:"RST 0x08", ast:o.RST(8)}, {name:"RET NC", ast:o.RET("==", F_CARRY)}, 
{name:"POP DE", ast:o.POP("d", "e")}, {name:"JP NC,(nn)", ast:o.JP("==", F_CARRY)}, {name:"OUT (n),A", ast:o.OUT("a")}, {name:"CALL NC (nn)", ast:o.CALL("==", F_CARRY)}, {name:"PUSH DE", ast:o.PUSH("d", "e")}, {name:"SUB n", ast:o.SUB()}, {name:"RST 0x10", ast:o.RST(16)}, {name:"RET C", ast:o.RET("!=", F_CARRY)}, {name:"EXX", ast:o.EXX()}, {name:"JP C,(nn)", ast:o.JP("!=", F_CARRY)}, {name:"IN A,(n)", ast:o.IN("a")}, {name:"CALL C (nn)", ast:o.CALL("!=", F_CARRY)}, generateIndexTable("IX"), {name:"SBC A,n", 
ast:o.SBC()}, {name:"RST 0x18", ast:o.RST(24)}, {name:"RET PO", ast:o.RET("==", F_PARITY)}, {name:"POP HL", ast:o.POP("h", "l")}, {name:"JP PO,(nn)", ast:o.JP("==", F_PARITY)}, {name:"EX (SP),HL", ast:o.EX_SP_HL()}, {name:"CALL PO (nn)", ast:o.CALL("==", F_PARITY)}, {name:"PUSH HL", ast:o.PUSH("h", "l")}, {name:"AND (n)", ast:o.AND()}, {name:"RST 0x20", ast:o.RST(32)}, {name:"RET PE", ast:o.RET("!=", F_PARITY)}, {name:"JP (HL)", ast:o.JP("h", "l")}, {name:"JP PE,(nn)", ast:o.JP("!=", F_PARITY)}, 
{name:"EX DE,HL", ast:o.EX_DE_HL()}, {name:"CALL PE (nn)", ast:o.CALL("!=", F_PARITY)}, opcodeTableED, {name:"XOR n", ast:o.XOR()}, {name:"RST 0x28", ast:o.RST(40)}, {name:"RET P", ast:o.RET("==", F_SIGN)}, {name:"POP AF", ast:o.POP("a", "f")}, {name:"JP P,(nn)", ast:o.JP("==", F_SIGN)}, {name:"DI", ast:o.DI()}, {name:"CALL P (nn)", ast:o.CALL("==", F_SIGN)}, {name:"PUSH AF", ast:o.PUSH("a", "f")}, {name:"OR n", ast:o.OR()}, {name:"RST 0x30", ast:o.RST(48)}, {name:"RET M", ast:o.RET("!=", F_SIGN)}, 
{name:"LD SP,HL", ast:o.LD_SP("h", "l")}, {name:"JP M,(nn)", ast:o.JP("!=", F_SIGN)}, {name:"EI", ast:o.EI()}, {name:"CALL M (nn)", ast:o.CALL("!=", F_SIGN)}, generateIndexTable("IY"), {name:"CP n", ast:o.CP()}, {name:"RST 0x38", ast:o.RST(56)}];
var Analyzer = function $Analyzer$() {
  this.bytecodes = {};
  this.ast = [];
  this.missingOpcodes = {}
};
Analyzer.prototype = {analyze:function $Analyzer$$analyze$($bytecodes_i$$) {
  this.bytecodes = $bytecodes_i$$;
  this.ast = Array(this.bytecodes.length);
  JSSMS.Utils.console.time("Analyzing");
  for($bytecodes_i$$ = 0;$bytecodes_i$$ < this.bytecodes.length;$bytecodes_i$$++) {
    this.normalizeBytecode($bytecodes_i$$), this.restructure($bytecodes_i$$)
  }
  JSSMS.Utils.console.timeEnd("Analyzing");
  for($bytecodes_i$$ in this.missingOpcodes) {
    console.error("Missing opcode", $bytecodes_i$$, this.missingOpcodes[$bytecodes_i$$])
  }
}, analyzeFromAddress:function $Analyzer$$analyzeFromAddress$($bytecodes$$) {
  this.bytecodes = [$bytecodes$$];
  this.ast = [];
  this.missingOpcodes = {};
  this.normalizeBytecode(0);
  this.bytecodes[0][this.bytecodes[0].length - 1].isFunctionEnder = !0;
  this.ast = [this.bytecodes];
  for(var $i$$ in this.missingOpcodes) {
    console.error("Missing opcode", $i$$, this.missingOpcodes[$i$$])
  }
}, normalizeBytecode:function $Analyzer$$normalizeBytecode$($page$$) {
  var $self$$ = this;
  this.bytecodes[$page$$] = this.bytecodes[$page$$].map(function($bytecode$$) {
    switch($bytecode$$.opcode.length) {
      case 1:
        var $i$$31_opcode$$ = opcodeTable[$bytecode$$.opcode[0]];
        break;
      case 2:
        $i$$31_opcode$$ = opcodeTable[$bytecode$$.opcode[0]][$bytecode$$.opcode[1]];
        break;
      case 3:
        $i$$31_opcode$$ = opcodeTable[$bytecode$$.opcode[0]][$bytecode$$.opcode[1]][$bytecode$$.opcode[2]];
        break;
      default:
        throw Error("Something went wrong in parsing. Opcode: [" + $bytecode$$.opcode.join(",") + "]");
    }
    if($i$$31_opcode$$ && $i$$31_opcode$$.ast) {
      var $ast$$ = $i$$31_opcode$$.ast($bytecode$$.operand, $bytecode$$.target, $bytecode$$.nextAddress);
      Array.isArray($ast$$) || void 0 == $ast$$ || ($ast$$ = [$ast$$]);
      $bytecode$$.ast = $ast$$;
      DEBUG && ($bytecode$$.name = $i$$31_opcode$$.name, $i$$31_opcode$$.opcode && ($bytecode$$.opcode = $i$$31_opcode$$.opcode($bytecode$$.operand, $bytecode$$.target, $bytecode$$.nextAddress)))
    }else {
      $i$$31_opcode$$ = $bytecode$$.hexOpcode, $self$$.missingOpcodes[$i$$31_opcode$$] = void 0 != $self$$.missingOpcodes[$i$$31_opcode$$] ? $self$$.missingOpcodes[$i$$31_opcode$$] + 1 : 1
    }
    return $bytecode$$
  })
}, restructure:function $Analyzer$$restructure$($page$$) {
  this.ast[$page$$] = [];
  var $self$$ = this, $pointer$$ = -1, $startNewFunction$$ = !0, $prevBytecode$$ = {};
  this.bytecodes[$page$$].forEach(function($bytecode$$) {
    if($bytecode$$.isJumpTarget || $startNewFunction$$) {
      $pointer$$++, $self$$.ast[$page$$][$pointer$$] = [], $startNewFunction$$ = !1, $prevBytecode$$.isFunctionEnder = !0
    }
    $self$$.ast[$page$$][$pointer$$].push($bytecode$$);
    $bytecode$$.isFunctionEnder && ($startNewFunction$$ = !0);
    $prevBytecode$$ = $bytecode$$
  })
}};
var Optimizer = function $Optimizer$() {
  this.ast = []
};
Optimizer.prototype = {optimize:function $Optimizer$$optimize$($functions_i$$) {
  this.ast = $functions_i$$;
  for($functions_i$$ = 0;$functions_i$$ < this.ast.length;$functions_i$$++) {
  }
}, localOptimization:function $Optimizer$$localOptimization$($page$$) {
  this.ast[$page$$] = this.ast[$page$$].map(this.inlineRegisters)
}, inlineRegisters:function $Optimizer$$inlineRegisters$($fn$$) {
  var $definedReg$$ = {a:!1}, $definedRegValue$$ = {a:{}};
  return $fn$$.map(function($bytecodes$$) {
    var $ast$$0$$ = $bytecodes$$.ast;
    if(!$ast$$0$$) {
      return $bytecodes$$
    }
    $bytecodes$$.ast = JSSMS.Utils.traverse($ast$$0$$, function($ast$$) {
      "AssignmentExpression" == $ast$$.type && ("=" == $ast$$.operator && "Register" == $ast$$.left.type && "Literal" == $ast$$.right.type && "a" == $ast$$.left.name) && ($definedReg$$[$ast$$.left.name] = !0, $definedRegValue$$[$ast$$.left.name] = $ast$$.right);
      if("AssignmentExpression" == $ast$$.type && "Register" == $ast$$.left.type && "Literal" != $ast$$.right.type && "a" == $ast$$.left.name) {
        return $definedReg$$[$ast$$.left.name] = !1, $definedRegValue$$[$ast$$.left.name] = {}, $ast$$
      }
      if("CallExpression" == $ast$$.type && $ast$$.arguments[0] && "Register" == $ast$$.arguments[0].type && $definedReg$$[$ast$$.arguments[0].name] && "a" == $ast$$.arguments[0].name) {
        return $ast$$.arguments[0] = $definedRegValue$$[$ast$$.arguments[0].name], $ast$$
      }
      if("CallExpression" == $ast$$.type && $ast$$.arguments[1] && "Register" == $ast$$.arguments[1].type && $definedReg$$[$ast$$.arguments[1].name] && "a" == $ast$$.arguments[1].name) {
        return $ast$$.arguments[1] = $definedRegValue$$[$ast$$.arguments[1].name], $ast$$
      }
      "MemberExpression" == $ast$$.type && ("Register" == $ast$$.property.type && $definedReg$$[$ast$$.property.name] && "a" == $ast$$.property.name) && ($ast$$.property = $definedRegValue$$[$ast$$.property.name]);
      return $ast$$
    });
    return $bytecodes$$
  })
}};
var whitelist = ["temp", "location", "JSSMS.Utils.rndInt"], Generator = function $Generator$() {
  this.ast = []
};
Generator.prototype = {generate:function $Generator$$generate$($functions$$) {
  var $self$$ = this, $toHex$$ = JSSMS.Utils.toHex;
  JSSMS.Utils.console.time("Generating");
  for(var $page$$ = 0;$page$$ < $functions$$.length;$page$$++) {
    $functions$$[$page$$] = $functions$$[$page$$].map(function($fn$$) {
      var $body$$ = [], $name$$ = $fn$$[0].address, $tstates$$ = 0;
      $fn$$ = $fn$$.map(function($bytecode$$) {
        null == $bytecode$$.ast && ($bytecode$$.ast = []);
        $tstates$$ += $self$$.getTotalTStates($bytecode$$.opcode);
        if($bytecode$$.isFunctionEnder || $bytecode$$.canEnd || null != $bytecode$$.target) {
          var $decreaseTStateStmt_updatePcStmt$$ = [{type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"-=", left:{type:"Identifier", name:"tstates"}, right:{type:"Literal", value:$tstates$$}}}];
          DEBUG && $decreaseTStateStmt_updatePcStmt$$[0].expression.right.value && ($decreaseTStateStmt_updatePcStmt$$[0].expression.right.raw = $toHex$$($decreaseTStateStmt_updatePcStmt$$[0].expression.right.value));
          $bytecode$$.ast = [].concat($decreaseTStateStmt_updatePcStmt$$, $bytecode$$.ast);
          $tstates$$ = 0
        }
        null != $bytecode$$.nextAddress && ($decreaseTStateStmt_updatePcStmt$$ = {type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"=", left:{type:"Identifier", name:"pc"}, right:{type:"Literal", value:$bytecode$$.nextAddress}}}, DEBUG && ($decreaseTStateStmt_updatePcStmt$$.expression.right.raw = $toHex$$($decreaseTStateStmt_updatePcStmt$$.expression.right.value)), $bytecode$$.ast.push($decreaseTStateStmt_updatePcStmt$$));
        DEBUG && $bytecode$$.ast[0] && ($bytecode$$.ast[0].leadingComments = [{type:"Line", value:" " + $bytecode$$.label}]);
        return $bytecode$$.ast
      });
      $fn$$.forEach(function($ast$$) {
        $body$$ = $body$$.concat($ast$$)
      });
      $body$$ = $self$$.convertRegisters($body$$);
      $body$$ = JSSMS.Utils.traverse($body$$, function($obj$$) {
        $obj$$.type && ("Identifier" == $obj$$.type && -1 == whitelist.indexOf($obj$$.name)) && ($obj$$.name = "this." + $obj$$.name);
        return $obj$$
      });
      return{type:"Program", body:[{type:"FunctionDeclaration", id:{type:"Identifier", name:$name$$}, params:[{type:"Identifier", name:"temp"}, {type:"Identifier", name:"location"}], defaults:[], body:{type:"BlockStatement", body:$body$$}, rest:null, generator:!1, expression:!1}]}
    })
  }
  JSSMS.Utils.console.timeEnd("Generating");
  this.ast = $functions$$
}, getTotalTStates:function $Generator$$getTotalTStates$($opcodes$$) {
  var $tstates$$ = 0;
  switch($opcodes$$[0]) {
    case 203:
      $tstates$$ = OP_CB_STATES[$opcodes$$[1]];
      break;
    case 221:
    ;
    case 253:
      $tstates$$ = 2 == $opcodes$$.length ? OP_DD_STATES[$opcodes$$[1]] : OP_INDEX_CB_STATES[$opcodes$$[2]];
      break;
    case 237:
      $tstates$$ = OP_ED_STATES[$opcodes$$[1]];
      break;
    default:
      $tstates$$ = OP_STATES[$opcodes$$[0]]
  }
  return $tstates$$
}, convertRegisters:function $Generator$$convertRegisters$($ast$$) {
  return JSSMS.Utils.traverse($ast$$, function($node$$) {
    "Register" == $node$$.type && ($node$$.type = "Identifier");
    return $node$$
  })
}};
var Recompiler = function $Recompiler$($cpu$$) {
  this.cpu = $cpu$$;
  this.rom = [];
  this.options = {};
  this.parser = {};
  this.analyzer = new Analyzer;
  this.optimizer = new Optimizer;
  this.generator = new Generator;
  this.bytecodes = {}
};
Recompiler.prototype = {setRom:function $Recompiler$$setRom$($rom$$) {
  this.rom = $rom$$;
  this.parser = new Parser($rom$$, this.cpu.frameReg)
}, reset:function $Recompiler$$reset$() {
  var $self$$ = this;
  this.options.entryPoints = [{address:0, romPage:0, memPage:0}, {address:56, romPage:0, memPage:0}, {address:102, romPage:0, memPage:0}];
  2 >= this.rom.length ? JSSMS.Utils.console.log("Parsing full ROM") : (this.options.pageLimit = 0, JSSMS.Utils.console.log("Parsing initial memory page of ROM"));
  for(var $fns$$ = this.parse().analyze().optimize().generate(), $page$$ = 0;$page$$ < this.rom.length;$page$$++) {
    $fns$$[$page$$].forEach(function($code$$11_fn$$) {
      var $funcName$$ = $code$$11_fn$$.body[0].id.name;
      $code$$11_fn$$.body[0].id.name = "_" + JSSMS.Utils.toHex($funcName$$);
      $code$$11_fn$$ = $self$$.generateCodeFromAst($code$$11_fn$$);
      $self$$.cpu.branches[$page$$][$funcName$$] = (new Function("return " + $code$$11_fn$$))()
    })
  }
}, parse:function $Recompiler$$parse$() {
  var $self$$ = this;
  this.options.entryPoints.forEach(function($entryPoint$$) {
    $self$$.parser.addEntryPoint($entryPoint$$)
  });
  this.parser.parse(this.options.pageLimit);
  return this
}, analyze:function $Recompiler$$analyze$() {
  this.analyzer.analyze(this.parser.instructions);
  return this
}, optimize:function $Recompiler$$optimize$() {
  this.optimizer.optimize(this.analyzer.ast);
  return this
}, generate:function $Recompiler$$generate$() {
  this.generator.generate(this.optimizer.ast);
  return this.generator.ast
}, recompileFromAddress:function $Recompiler$$recompileFromAddress$($address$$, $romPage$$, $memPage$$) {
  var $self$$ = this;
  this.parseFromAddress($address$$, $romPage$$, $memPage$$).analyzeFromAddress().optimize().generate()[0].forEach(function($code$$12_fn$$) {
    $code$$12_fn$$.body[0].id.name = "_" + JSSMS.Utils.toHex($code$$12_fn$$.body[0].id.name);
    $code$$12_fn$$ = $self$$.generateCodeFromAst($code$$12_fn$$);
    $self$$.cpu.branches[$romPage$$][$address$$ % 16384] = (new Function("return " + $code$$12_fn$$))()
  })
}, parseFromAddress:function $Recompiler$$parseFromAddress$($address$$23_obj$$, $romPage$$, $memPage$$) {
  $address$$23_obj$$ = {address:$address$$23_obj$$, romPage:$romPage$$, memPage:$memPage$$};
  this.parser.entryPoints.push($address$$23_obj$$);
  this.bytecodes = this.parser.parseFromAddress($address$$23_obj$$);
  return this
}, analyzeFromAddress:function $Recompiler$$analyzeFromAddress$() {
  this.analyzer.analyzeFromAddress(this.bytecodes);
  return this
}, generateCodeFromAst:function $Recompiler$$generateCodeFromAst$($fn$$) {
  return window.escodegen.generate($fn$$, {comment:!0, renumber:!0, hexadecimal:!0, parse:DEBUG ? window.esprima.parse : function() {
  }})
}, dump:function $Recompiler$$dump$() {
  var $output$$ = [], $i$$;
  for($i$$ in this.cpu.branches) {
    $output$$.push("// Page " + $i$$);
    for(var $j$$ in this.cpu.branches[$i$$]) {
      $output$$.push(this.cpu.branches[$i$$][$j$$])
    }
  }
  $output$$ = $output$$.join("\n");
  console.log($output$$)
}};
window.JSSMS = JSSMS;

