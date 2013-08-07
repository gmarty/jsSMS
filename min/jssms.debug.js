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
'use strict';var $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
function $JSSMS$$($opts$$) {
  this.$h$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if(void 0 != $opts$$) {
    for(var $key$$16$$ in this.$h$) {
      void 0 != $opts$$[$key$$16$$] && (this.$h$[$key$$16$$] = $opts$$[$key$$16$$])
    }
  }
  this.$keyboard$ = new $JSSMS$Keyboard$$(this);
  this.$a$ = new $opts$$.ui(this);
  this.$vdp$ = new $JSSMS$Vdp$$(this);
  this.$b$ = new $JSSMS$SN76489$$(this);
  this.$c$ = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$a$.updateStatus("Ready to load a ROM.");
  this.ui = this.$a$
}
$JSSMS$$.prototype = {$isRunning$:!1, $cyclesPerLine$:0, $no_of_scanlines$:0, $fps$:0, $pause_button$:!1, $is_sms$:!0, $is_gg$:!1, $soundEnabled$:!1, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $fpsFrameCount$:0, $romData$:"", $romFileName$:"", $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ = this.$vdp$.$N$, $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$vdp$.$N$ = $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ = this.$b$;
    $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$n$ = ($JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$g$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$c$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$j$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$h$ = 32768;
    for($JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ = 0;4 > $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$;$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$b$[$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$b$[($JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$a$[$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$] = 
      0, $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$f$[$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$] = 1, 3 != $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ && ($JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$.$i$[$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$] = 
      $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $fractional$$inline_22$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_22$$, $fractional$$inline_22$$ = $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ - ($JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$] = 
        $JSCompiler_StaticMethods_init$self$$inline_269_mode$$inline_18_v$$inline_21$$ >> 16
      }
    }
  }
  this.$keyboard$.reset();
  this.$a$.reset();
  this.$vdp$.reset();
  this.$c$.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$ = this.$cpu$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$.$instructions$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$.$main$.$a$.updateStatus("Parsing instructions...");
  $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$);
  $JSCompiler_StaticMethods_resetDebug$self$$inline_24_clockSpeedHz$$inline_19_i$$inline_20_i$$inline_271$$.$main$.$a$.updateStatus("Instructions parsed");
  clearInterval(this.$f$)
}, start:function $$JSSMS$$$$start$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = !0, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen), this.$g$ = $JSSMS$Utils$getTimestamp$$(), this.$fpsFrameCount$ = 0, this.$f$ = setInterval(function() {
    var $now$$inline_29$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$a$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_29$$ - $self$$1$$.$g$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$g$ = $now$$inline_29$$
  }, 500));
  this.$a$.updateStatus("Running")
}, stop:function $$JSSMS$$$$stop$() {
  clearInterval(this.$f$);
  this.$isRunning$ = !1
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  this.$isRunning$ && ($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$(this.$cpu$), this.$fpsFrameCount$++, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen))
}, $nextStep$:function $$JSSMS$$$$$nextStep$$() {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$(this.$cpu$)
}, $loadROM$:function $$JSSMS$$$$$loadROM$$($data$$31$$, $size$$12$$) {
  0 != $size$$12$$ % 1024 && ($data$$31$$ = $data$$31$$.substr(512), $size$$12$$ -= 512);
  var $i$$2$$, $j$$, $number_of_pages$$ = Math.round($size$$12$$ / 16384), $pages$$1$$ = Array($number_of_pages$$);
  for($i$$2$$ = 0;$i$$2$$ < $number_of_pages$$;$i$$2$$++) {
    if($pages$$1$$[$i$$2$$] = $JSSMS$Utils$Array$$(16384), $SUPPORT_DATAVIEW$$) {
      for($j$$ = 0;16384 > $j$$;$j$$++) {
        $pages$$1$$[$i$$2$$].setUint8($j$$, $data$$31$$.charCodeAt(16384 * $i$$2$$ + $j$$))
      }
    }else {
      for($j$$ = 0;16384 > $j$$;$j$$++) {
        $pages$$1$$[$i$$2$$][$j$$] = $data$$31$$.charCodeAt(16384 * $i$$2$$ + $j$$) & 255
      }
    }
  }
  return $pages$$1$$
}};
function $JSCompiler_StaticMethods_readRomDirectly$$($JSCompiler_StaticMethods_readRomDirectly$self$$, $data$$30$$, $fileName$$) {
  var $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
  $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$ = $data$$30$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$ ? ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = !0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = !1, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$G$ = 0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$K$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$ && ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = !0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = 
  !1, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$G$ = 5, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$K$ = 27);
  if(16384 >= $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$) {
    return!1
  }
  $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$loadROM$($data$$30$$, $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$);
  if(null == $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$) {
    return!1
  }
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$cpu$, $i$$inline_37$$ = 0;
  $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$rom$ = $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$M$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$M$ - 1;
    for($i$$inline_37$$ = 0;3 > $i$$inline_37$$;$i$$inline_37$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$frameReg$[$i$$inline_37$$] = $i$$inline_37$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$M$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$frameReg$[3] = 0;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$G$ = Array($JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$M$);
    for($i$$inline_37$$ = 0;$i$$inline_37$$ < $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$M$;$i$$inline_37$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$G$[$i$$inline_37$$] = Object.create(null)
    }
    $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$Q$;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$rom$;
    $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$.$rom$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$;
    $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$.$a$ = new $Parser$$($JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$, $JSCompiler_StaticMethods_setRom$self$$inline_273_pages_size$$11$$.$cpu$.$frameReg$)
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$M$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_35_mode$$9_rom$$inline_274$$.$romPageMask$ = 0
  }
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romData$ = $data$$30$$;
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romFileName$ = $fileName$$;
  return!0
}
;var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array;
function $JSSMS$Utils$console$log$$($var_args$$36$$) {
  window.console.log.apply(window.console, arguments)
}
function $JSSMS$Utils$console$error$$($var_args$$37$$) {
  window.console.error.apply(window.console, arguments)
}
function $JSSMS$Utils$traverse$$($object$$, $fn$$) {
  var $key$$17$$, $child$$1$$;
  $fn$$.call(null, $object$$);
  for($key$$17$$ in $object$$) {
    $object$$.hasOwnProperty($key$$17$$) && ($child$$1$$ = $object$$[$key$$17$$], "object" === typeof $child$$1$$ && null !== $child$$1$$ && ($object$$[$key$$17$$] = $JSSMS$Utils$traverse$$($child$$1$$, $fn$$)))
  }
  return $object$$
}
var $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? function() {
  return window.performance.now()
} : function() {
  return(new Date).getTime()
};
function $JSSMS$Utils$toHex$$($dec_hex$$) {
  $dec_hex$$ = $dec_hex$$.toString(16).toUpperCase();
  $dec_hex$$.length % 2 && ($dec_hex$$ = "0" + $dec_hex$$);
  return"0x" + $dec_hex$$
}
function $JSSMS$Utils$getPrefix$$($arr$$16$$, $obj$$35$$) {
  var $prefix$$2$$ = !1;
  void 0 == $obj$$35$$ && ($obj$$35$$ = document);
  $arr$$16$$.some(function($prop$$4$$) {
    return $prop$$4$$ in $obj$$35$$ ? ($prefix$$2$$ = $prop$$4$$, !0) : !1
  });
  return $prefix$$2$$
}
;var $OP_STATES$$ = [4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 
4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11], $OP_CB_STATES$$ = [8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 
8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 
15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8], $OP_DD_STATES$$ = [4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 
19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4], $OP_INDEX_CB_STATES$$ = 
[23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 
20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
23, 23, 23, 23, 23], $OP_ED_STATES$$ = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
function $JSSMS$Z80$$($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$) {
  this.$main$ = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;
  this.$vdp$ = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$.$vdp$;
  this.port = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$.$c$;
  this.$R$ = this.$n$ = this.$a$ = 0;
  this.$K$ = this.$P$ = this.$J$ = this.$I$ = !1;
  this.$o$ = this.$ba$ = this.$c$ = this.$U$ = this.$v$ = this.$s$ = this.$t$ = this.$q$ = this.$da$ = this.$ca$ = this.$l$ = this.$j$ = this.$aa$ = this.$Z$ = this.$e$ = this.$d$ = this.$Y$ = this.$X$ = this.$h$ = this.$i$ = this.$W$ = this.$b$ = this.$S$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$M$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$ea$ = Array(2048);
  this.$V$ = Array(256);
  this.$m$ = Array(256);
  this.$O$ = Array(256);
  this.$N$ = Array(256);
  this.$F$ = Array(131072);
  this.$w$ = Array(131072);
  this.$T$ = Array(256);
  var $c$$inline_69_padc$$inline_60_sf$$inline_54$$, $h$$inline_70_psub$$inline_61_zf$$inline_55$$, $n$$inline_71_psbc$$inline_62_yf$$inline_56$$, $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$, $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$, $flags$$inline_278_newval$$inline_65$$;
  for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;256 > $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++) {
    $c$$inline_69_padc$$inline_60_sf$$inline_54$$ = 0 != ($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ & 128) ? 128 : 0, $h$$inline_70_psub$$inline_61_zf$$inline_55$$ = 0 == $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ ? 64 : 0, $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ & 32, $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ & 
    8, $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$) ? 4 : 0, this.$V$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = $c$$inline_69_padc$$inline_60_sf$$inline_54$$ | $h$$inline_70_psub$$inline_61_zf$$inline_55$$ | $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ | $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$, this.$m$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = 
    $c$$inline_69_padc$$inline_60_sf$$inline_54$$ | $h$$inline_70_psub$$inline_61_zf$$inline_55$$ | $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ | $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ | $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$, this.$O$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = $c$$inline_69_padc$$inline_60_sf$$inline_54$$ | $h$$inline_70_psub$$inline_61_zf$$inline_55$$ | $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ | $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$, 
    this.$O$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 128 == $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ ? 4 : 0, this.$O$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 0 == ($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ & 15) ? 16 : 0, this.$N$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = $c$$inline_69_padc$$inline_60_sf$$inline_54$$ | $h$$inline_70_psub$$inline_61_zf$$inline_55$$ | $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ | 
    $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ | 2, this.$N$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 127 == $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ ? 4 : 0, this.$N$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 15 == ($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ & 15) ? 16 : 0, this.$T$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = 0 != $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ ? 
    $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ & 128 : 68, this.$T$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ | $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ | 16
  }
  $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;
  $c$$inline_69_padc$$inline_60_sf$$inline_54$$ = 65536;
  $h$$inline_70_psub$$inline_61_zf$$inline_55$$ = 0;
  $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ = 65536;
  for($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ = 0;256 > $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$;$JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$++) {
    for($flags$$inline_278_newval$$inline_65$$ = 0;256 > $flags$$inline_278_newval$$inline_65$$;$flags$$inline_278_newval$$inline_65$$++) {
      $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ = $flags$$inline_278_newval$$inline_65$$ - $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$, this.$F$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = 0 != $flags$$inline_278_newval$$inline_65$$ ? 0 != ($flags$$inline_278_newval$$inline_65$$ & 128) ? 128 : 0 : 64, this.$F$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= $flags$$inline_278_newval$$inline_65$$ & 40, ($flags$$inline_278_newval$$inline_65$$ & 
      15) < ($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ & 15) && (this.$F$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 16), $flags$$inline_278_newval$$inline_65$$ < $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ && (this.$F$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ ^ $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ ^ 128) & ($JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ ^ 
      $flags$$inline_278_newval$$inline_65$$) & 128) && (this.$F$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] |= 4), $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++, $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ = $flags$$inline_278_newval$$inline_65$$ - $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ - 1, this.$F$[$c$$inline_69_padc$$inline_60_sf$$inline_54$$] = 0 != $flags$$inline_278_newval$$inline_65$$ ? 0 != ($flags$$inline_278_newval$$inline_65$$ & 
      128) ? 128 : 0 : 64, this.$F$[$c$$inline_69_padc$$inline_60_sf$$inline_54$$] |= $flags$$inline_278_newval$$inline_65$$ & 40, ($flags$$inline_278_newval$$inline_65$$ & 15) <= ($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ & 15) && (this.$F$[$c$$inline_69_padc$$inline_60_sf$$inline_54$$] |= 16), $flags$$inline_278_newval$$inline_65$$ <= $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ && (this.$F$[$c$$inline_69_padc$$inline_60_sf$$inline_54$$] |= 1), 0 != (($JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ ^ 
      $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ ^ 128) & ($JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ ^ $flags$$inline_278_newval$$inline_65$$) & 128) && (this.$F$[$c$$inline_69_padc$$inline_60_sf$$inline_54$$] |= 4), $c$$inline_69_padc$$inline_60_sf$$inline_54$$++, $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ = $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ - $flags$$inline_278_newval$$inline_65$$, this.$w$[$h$$inline_70_psub$$inline_61_zf$$inline_55$$] = 
      0 != $flags$$inline_278_newval$$inline_65$$ ? 0 != ($flags$$inline_278_newval$$inline_65$$ & 128) ? 130 : 2 : 66, this.$w$[$h$$inline_70_psub$$inline_61_zf$$inline_55$$] |= $flags$$inline_278_newval$$inline_65$$ & 40, ($flags$$inline_278_newval$$inline_65$$ & 15) > ($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ & 15) && (this.$w$[$h$$inline_70_psub$$inline_61_zf$$inline_55$$] |= 16), $flags$$inline_278_newval$$inline_65$$ > $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ && 
      (this.$w$[$h$$inline_70_psub$$inline_61_zf$$inline_55$$] |= 1), 0 != (($JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ ^ $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$) & ($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ ^ $flags$$inline_278_newval$$inline_65$$) & 128) && (this.$w$[$h$$inline_70_psub$$inline_61_zf$$inline_55$$] |= 4), $h$$inline_70_psub$$inline_61_zf$$inline_55$$++, $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ = $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ - 
      $flags$$inline_278_newval$$inline_65$$ - 1, this.$w$[$n$$inline_71_psbc$$inline_62_yf$$inline_56$$] = 0 != $flags$$inline_278_newval$$inline_65$$ ? 0 != ($flags$$inline_278_newval$$inline_65$$ & 128) ? 130 : 2 : 66, this.$w$[$n$$inline_71_psbc$$inline_62_yf$$inline_56$$] |= $flags$$inline_278_newval$$inline_65$$ & 40, ($flags$$inline_278_newval$$inline_65$$ & 15) >= ($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ & 15) && (this.$w$[$n$$inline_71_psbc$$inline_62_yf$$inline_56$$] |= 
      16), $flags$$inline_278_newval$$inline_65$$ >= $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ && (this.$w$[$n$$inline_71_psbc$$inline_62_yf$$inline_56$$] |= 1), 0 != (($JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ ^ $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$) & ($JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ ^ $flags$$inline_278_newval$$inline_65$$) & 128) && (this.$w$[$n$$inline_71_psbc$$inline_62_yf$$inline_56$$] |= 4), $n$$inline_71_psbc$$inline_62_yf$$inline_56$$++
    }
  }
  for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 256;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$--;) {
    for($c$$inline_69_padc$$inline_60_sf$$inline_54$$ = 0;1 >= $c$$inline_69_padc$$inline_60_sf$$inline_54$$;$c$$inline_69_padc$$inline_60_sf$$inline_54$$++) {
      for($h$$inline_70_psub$$inline_61_zf$$inline_55$$ = 0;1 >= $h$$inline_70_psub$$inline_61_zf$$inline_55$$;$h$$inline_70_psub$$inline_61_zf$$inline_55$$++) {
        for($n$$inline_71_psbc$$inline_62_yf$$inline_56$$ = 0;1 >= $n$$inline_71_psbc$$inline_62_yf$$inline_56$$;$n$$inline_71_psbc$$inline_62_yf$$inline_56$$++) {
          $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$ = this.$ea$;
          $JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$ = $c$$inline_69_padc$$inline_60_sf$$inline_54$$ << 8 | $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ << 9 | $h$$inline_70_psub$$inline_61_zf$$inline_55$$ << 10 | $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;
          $flags$$inline_278_newval$$inline_65$$ = $c$$inline_69_padc$$inline_60_sf$$inline_54$$ | $n$$inline_71_psbc$$inline_62_yf$$inline_56$$ << 1 | $h$$inline_70_psub$$inline_61_zf$$inline_55$$ << 4;
          this.$b$ = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;
          this.$c$ = $flags$$inline_278_newval$$inline_65$$;
          var $a_copy$$inline_279$$ = this.$b$, $correction$$inline_280$$ = 0, $carry$$inline_281$$ = $flags$$inline_278_newval$$inline_65$$ & 1, $carry_copy$$inline_282$$ = $carry$$inline_281$$;
          if(0 != ($flags$$inline_278_newval$$inline_65$$ & 16) || 9 < ($a_copy$$inline_279$$ & 15)) {
            $correction$$inline_280$$ |= 6
          }
          if(1 == $carry$$inline_281$$ || 159 < $a_copy$$inline_279$$ || 143 < $a_copy$$inline_279$$ && 9 < ($a_copy$$inline_279$$ & 15)) {
            $correction$$inline_280$$ |= 96, $carry_copy$$inline_282$$ = 1
          }
          153 < $a_copy$$inline_279$$ && ($carry_copy$$inline_282$$ = 1);
          0 != ($flags$$inline_278_newval$$inline_65$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_280$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_280$$);
          $flags$$inline_278_newval$$inline_65$$ = this.$c$ & 254 | $carry_copy$$inline_282$$;
          $flags$$inline_278_newval$$inline_65$$ = $JSCompiler_StaticMethods_getParity$$(this.$b$) ? $flags$$inline_278_newval$$inline_65$$ & 251 | 4 : $flags$$inline_278_newval$$inline_65$$ & 251;
          $JSCompiler_temp_const$$267_val$$inline_63_xf$$inline_57$$[$JSCompiler_temp_const$$266_oldval$$inline_64_pf$$inline_58$$] = this.$b$ | $flags$$inline_278_newval$$inline_65$$ << 8
        }
      }
    }
  }
  this.$b$ = this.$c$ = 0;
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;8192 > $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$, 0)
    }
  }else {
    for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;8192 > $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++) {
      this.$memWriteMap$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = 0
    }
  }
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;32768 > $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++) {
      this.$sram$.setUint8($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$, 0)
    }
  }else {
    for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;32768 > $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++) {
      this.$sram$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = 0
    }
  }
  this.$M$ = 2;
  for($i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ = 0;4 > $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$;$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$++) {
    this.$frameReg$[$i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$] = $i$$inline_53_i$$inline_68_i$$inline_74_padd$$inline_59_sms$$ % 3
  }
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
  this.$Q$ = new $Recompiler$$(this)
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$a$ = this.$ba$ = this.$c$ = this.$U$ = this.$s$ = this.$v$ = this.$q$ = this.$t$ = this.$j$ = this.$l$ = this.$ca$ = this.$da$ = this.$d$ = this.$e$ = this.$Z$ = this.$aa$ = this.$i$ = this.$h$ = this.$X$ = this.$Y$ = this.$b$ = this.$W$ = 0;
  this.$n$ = 57328;
  this.$R$ = this.$o$ = 0;
  this.$J$ = this.$I$ = !1;
  this.$S$ = 0;
  this.$P$ = !1;
  this.$Q$.reset()
}, $G$:[Object.create(null), Object.create(null), Object.create(null)], call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$a$ + 2), this.$a$ = this.$p$(this.$a$), this.$o$ -= 7) : this.$a$ += 2
}, $g$:$SUPPORT_DATAVIEW$$ ? function($address$$, $value$$74$$) {
  if(65535 >= $address$$) {
    this.$memWriteMap$.setInt8($address$$ & 8191, $value$$74$$), 65532 == $address$$ ? this.$frameReg$[3] = $value$$74$$ : 65533 == $address$$ ? this.$frameReg$[0] = $value$$74$$ & this.$romPageMask$ : 65534 == $address$$ ? this.$frameReg$[1] = $value$$74$$ & this.$romPageMask$ : 65535 == $address$$ && (this.$frameReg$[2] = $value$$74$$ & this.$romPageMask$)
  }else {
    $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$), $JSSMS$Utils$toHex$$($address$$ & 8191));
    debugger
  }
} : function($address$$1$$, $value$$75$$) {
  if(65535 >= $address$$1$$) {
    this.$memWriteMap$[$address$$1$$ & 8191] = $value$$75$$, 65532 == $address$$1$$ ? this.$frameReg$[3] = $value$$75$$ : 65533 == $address$$1$$ ? this.$frameReg$[0] = $value$$75$$ & this.$romPageMask$ : 65534 == $address$$1$$ ? this.$frameReg$[1] = $value$$75$$ & this.$romPageMask$ : 65535 == $address$$1$$ && (this.$frameReg$[2] = $value$$75$$ & this.$romPageMask$)
  }else {
    $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$1$$), $JSSMS$Utils$toHex$$($address$$1$$ & 8191));
    debugger
  }
}, $f$:$SUPPORT_DATAVIEW$$ ? function($address$$2$$) {
  if(1024 > $address$$2$$) {
    return this.$rom$[0].getUint8($address$$2$$)
  }
  if(16384 > $address$$2$$) {
    return this.$rom$[this.$frameReg$[0]].getUint8($address$$2$$)
  }
  if(32768 > $address$$2$$) {
    return this.$rom$[this.$frameReg$[1]].getUint8($address$$2$$ - 16384)
  }
  if(49152 > $address$$2$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$2$$ - 32768) : 12 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$2$$ - 16384) : this.$rom$[this.$frameReg$[2]].getUint8($address$$2$$ - 32768)
  }
  if(57344 > $address$$2$$) {
    return this.$memWriteMap$.getUint8($address$$2$$ - 49152)
  }
  if(65532 > $address$$2$$) {
    return this.$memWriteMap$.getUint8($address$$2$$ - 57344)
  }
  if(65532 == $address$$2$$) {
    return this.$frameReg$[3]
  }
  if(65533 == $address$$2$$) {
    return this.$frameReg$[0]
  }
  if(65534 == $address$$2$$) {
    return this.$frameReg$[1]
  }
  if(65535 == $address$$2$$) {
    return this.$frameReg$[2]
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$2$$));
  debugger;
  return 0
} : function($address$$3$$) {
  if(1024 > $address$$3$$) {
    return this.$rom$[0][$address$$3$$]
  }
  if(16384 > $address$$3$$) {
    return this.$rom$[this.$frameReg$[0]][$address$$3$$]
  }
  if(32768 > $address$$3$$) {
    return this.$rom$[this.$frameReg$[1]][$address$$3$$ - 16384]
  }
  if(49152 > $address$$3$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$3$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$3$$ - 16384] : this.$rom$[this.$frameReg$[2]][$address$$3$$ - 32768]
  }
  if(57344 > $address$$3$$) {
    return this.$memWriteMap$[$address$$3$$ - 49152]
  }
  if(65532 > $address$$3$$) {
    return this.$memWriteMap$[$address$$3$$ - 57344]
  }
  if(65532 == $address$$3$$) {
    return this.$frameReg$[3]
  }
  if(65533 == $address$$3$$) {
    return this.$frameReg$[0]
  }
  if(65534 == $address$$3$$) {
    return this.$frameReg$[1]
  }
  if(65535 == $address$$3$$) {
    return this.$frameReg$[2]
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$3$$));
  debugger;
  return 0
}, $p$:$SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
  if(1024 > $address$$4$$) {
    return this.$rom$[0].getUint16($address$$4$$, !0)
  }
  if(16384 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[0]].getUint16($address$$4$$, !0)
  }
  if(32768 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[1]].getUint16($address$$4$$ - 16384, !0)
  }
  if(49152 > $address$$4$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 16384] : this.$rom$[this.$frameReg$[2]].getUint16($address$$4$$ - 32768, !0)
  }
  if(57344 > $address$$4$$) {
    return this.$memWriteMap$.getUint16($address$$4$$ - 49152, !0)
  }
  if(65532 > $address$$4$$) {
    return this.$memWriteMap$.getUint16($address$$4$$ - 57344, !0)
  }
  if(65532 == $address$$4$$) {
    return this.$frameReg$[3]
  }
  if(65533 == $address$$4$$) {
    return this.$frameReg$[0]
  }
  if(65534 == $address$$4$$) {
    return this.$frameReg$[1]
  }
  if(65535 == $address$$4$$) {
    return this.$frameReg$[2]
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$4$$));
  debugger;
  return 0
} : function($address$$5$$) {
  if(1024 > $address$$5$$) {
    return this.$rom$[0][$address$$5$$] | this.$rom$[0][++$address$$5$$] << 8
  }
  if(16384 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[0]][$address$$5$$] | this.$rom$[this.$frameReg$[0]][++$address$$5$$] << 8
  }
  if(32768 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[1]][$address$$5$$ - 16384] | this.$rom$[this.$frameReg$[1]][++$address$$5$$ - 16384] << 8
  }
  if(49152 > $address$$5$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 32768] | this.$sram$[++$address$$5$$ - 32768] << 8 : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 16384] | this.$sram$[++$address$$5$$ - 16384] << 8 : this.$rom$[this.$frameReg$[2]][$address$$5$$ - 32768] | this.$rom$[this.$frameReg$[2]][++$address$$5$$ - 32768] << 8
  }
  if(57344 > $address$$5$$) {
    return this.$memWriteMap$[$address$$5$$ - 49152] | this.$memWriteMap$[++$address$$5$$ - 49152] << 8
  }
  if(65532 > $address$$5$$) {
    return this.$memWriteMap$[$address$$5$$ - 57344] | this.$memWriteMap$[++$address$$5$$ - 57344] << 8
  }
  if(65532 == $address$$5$$) {
    return this.$frameReg$[3]
  }
  if(65533 == $address$$5$$) {
    return this.$frameReg$[0]
  }
  if(65534 == $address$$5$$) {
    return this.$frameReg$[1]
  }
  if(65535 == $address$$5$$) {
    return this.$frameReg$[2]
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$5$$));
  debugger;
  return 0
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$f$($JSCompiler_StaticMethods_d_$self$$.$a$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$73$$) {
  var $parity$$ = !0, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$73$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$72$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$2$$ = $hl$$1$$ - $value$$72$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$c$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$72$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$72$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$j$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$71$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$1$$ = $hl$$ + $value$$71$$ + ($JSCompiler_StaticMethods_adc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$c$ = ($hl$$ ^ $result$$1$$ ^ $value$$71$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$71$$ ^ $hl$$ ^ 32768) & ($value$$71$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$j$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$70$$) {
  var $result$$ = $reg$$ + $value$$70$$;
  $JSCompiler_StaticMethods_add16$self$$.$c$ = $JSCompiler_StaticMethods_add16$self$$.$c$ & 196 | ($reg$$ ^ $result$$ ^ $value$$70$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$69$$) {
  $value$$69$$ = $value$$69$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$c$ = $JSCompiler_StaticMethods_dec8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$N$[$value$$69$$];
  return $value$$69$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$68$$) {
  $value$$68$$ = $value$$68$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$c$ = $JSCompiler_StaticMethods_inc8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$O$[$value$$68$$];
  return $value$$68$$
}
function $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_decHL$self$$) {
  $JSCompiler_StaticMethods_decHL$self$$.$l$ = $JSCompiler_StaticMethods_decHL$self$$.$l$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decHL$self$$.$l$ && ($JSCompiler_StaticMethods_decHL$self$$.$j$ = $JSCompiler_StaticMethods_decHL$self$$.$j$ - 1 & 255)
}
function $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_decDE$self$$) {
  $JSCompiler_StaticMethods_decDE$self$$.$e$ = $JSCompiler_StaticMethods_decDE$self$$.$e$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decDE$self$$.$e$ && ($JSCompiler_StaticMethods_decDE$self$$.$d$ = $JSCompiler_StaticMethods_decDE$self$$.$d$ - 1 & 255)
}
function $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_decBC$self$$) {
  $JSCompiler_StaticMethods_decBC$self$$.$h$ = $JSCompiler_StaticMethods_decBC$self$$.$h$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decBC$self$$.$h$ && ($JSCompiler_StaticMethods_decBC$self$$.$i$ = $JSCompiler_StaticMethods_decBC$self$$.$i$ - 1 & 255)
}
function $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_incHL$self$$) {
  $JSCompiler_StaticMethods_incHL$self$$.$l$ = $JSCompiler_StaticMethods_incHL$self$$.$l$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incHL$self$$.$l$ && ($JSCompiler_StaticMethods_incHL$self$$.$j$ = $JSCompiler_StaticMethods_incHL$self$$.$j$ + 1 & 255)
}
function $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_incDE$self$$) {
  $JSCompiler_StaticMethods_incDE$self$$.$e$ = $JSCompiler_StaticMethods_incDE$self$$.$e$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incDE$self$$.$e$ && ($JSCompiler_StaticMethods_incDE$self$$.$d$ = $JSCompiler_StaticMethods_incDE$self$$.$d$ + 1 & 255)
}
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$67$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$v$ = $value$$67$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$s$ = $value$$67$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$66$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$t$ = $value$$66$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$q$ = $value$$66$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$64$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$j$ = $value$$64$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$64$$ & 255
}
function $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_getIY$self$$) {
  return $JSCompiler_StaticMethods_getIY$self$$.$v$ << 8 | $JSCompiler_StaticMethods_getIY$self$$.$s$
}
function $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_getIX$self$$) {
  return $JSCompiler_StaticMethods_getIX$self$$.$t$ << 8 | $JSCompiler_StaticMethods_getIX$self$$.$q$
}
function $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_getHL$self$$) {
  return $JSCompiler_StaticMethods_getHL$self$$.$j$ << 8 | $JSCompiler_StaticMethods_getHL$self$$.$l$
}
function $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_getDE$self$$) {
  return $JSCompiler_StaticMethods_getDE$self$$.$d$ << 8 | $JSCompiler_StaticMethods_getDE$self$$.$e$
}
function $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_getBC$self$$) {
  return $JSCompiler_StaticMethods_getBC$self$$.$i$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$h$
}
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$61$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$c$ = $JSCompiler_StaticMethods_cp_a$self$$.$w$[$JSCompiler_StaticMethods_cp_a$self$$.$b$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$b$ - $value$$61$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$60$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$c$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$b$ - $value$$60$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$c$ = $JSCompiler_StaticMethods_sbc_a$self$$.$w$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$b$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$b$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$59$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$b$ - $value$$59$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$c$ = $JSCompiler_StaticMethods_sub_a$self$$.$w$[$JSCompiler_StaticMethods_sub_a$self$$.$b$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$b$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$58$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$c$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$b$ + $value$$58$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$c$ = $JSCompiler_StaticMethods_adc_a$self$$.$F$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$b$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$b$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$57$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$b$ + $value$$57$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$c$ = $JSCompiler_StaticMethods_add_a$self$$.$F$[$JSCompiler_StaticMethods_add_a$self$$.$b$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$b$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$45$$) {
  var $location$$24$$ = $index$$45$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$f$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$o$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
  switch($opcode$$4$$) {
    case 0:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 1:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 2:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 3:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 4:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 5:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 7:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 8:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 9:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 10:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 11:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 12:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 13:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 15:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 16:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 17:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 18:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 19:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 20:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 21:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 23:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 24:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 25:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 26:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 27:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 28:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 29:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 31:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 32:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 33:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 34:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 35:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 36:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 37:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 39:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 40:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 41:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 42:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 43:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 44:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 45:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 47:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 48:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 49:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 50:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 51:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 52:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 53:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 55:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 56:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 57:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 58:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 59:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 60:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 61:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 63:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 1);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 2);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 4);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 8);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 16);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 32);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 64);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & 128);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -3);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -5);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -9);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -17);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -33);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -65);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -129);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 1);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 4);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 8);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 16);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 32);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 64);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 128);
      break;
    default:
      $JSSMS$Utils$console$log$$("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$4$$))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$a$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$c$ = $JSCompiler_StaticMethods_bit$self$$.$c$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$T$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$55$$) {
  var $carry$$7$$ = $value$$55$$ & 1;
  $value$$55$$ = $value$$55$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$c$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$m$[$value$$55$$];
  return $value$$55$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$54$$) {
  var $carry$$6$$ = $value$$54$$ & 1;
  $value$$54$$ = $value$$54$$ >> 1 | $value$$54$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$c$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$m$[$value$$54$$];
  return $value$$54$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$53$$) {
  var $carry$$5$$ = ($value$$53$$ & 128) >> 7;
  $value$$53$$ = ($value$$53$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$c$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$m$[$value$$53$$];
  return $value$$53$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$52$$) {
  var $carry$$4$$ = ($value$$52$$ & 128) >> 7;
  $value$$52$$ = $value$$52$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$c$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$m$[$value$$52$$];
  return $value$$52$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$51$$) {
  var $carry$$3$$ = $value$$51$$ & 1;
  $value$$51$$ = ($value$$51$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$c$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$c$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$m$[$value$$51$$];
  return $value$$51$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$50$$) {
  var $carry$$2$$ = ($value$$50$$ & 128) >> 7;
  $value$$50$$ = ($value$$50$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$c$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$c$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$m$[$value$$50$$];
  return $value$$50$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$49$$) {
  var $carry$$1$$ = $value$$49$$ & 1;
  $value$$49$$ = ($value$$49$$ >> 1 | $value$$49$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$c$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$m$[$value$$49$$];
  return $value$$49$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$48$$) {
  var $carry$$ = ($value$$48$$ & 128) >> 7;
  $value$$48$$ = ($value$$48$$ << 1 | $value$$48$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$c$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$m$[$value$$48$$];
  return $value$$48$$
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_decMem$self$$.$g$($offset$$15$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$f$($offset$$15$$)))
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$g$($offset$$14$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$f$($offset$$14$$)))
}
function $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_push2$self$$, $hi$$, $lo$$) {
  $JSCompiler_StaticMethods_push2$self$$.$g$(--$JSCompiler_StaticMethods_push2$self$$.$n$, $hi$$);
  $JSCompiler_StaticMethods_push2$self$$.$g$(--$JSCompiler_StaticMethods_push2$self$$.$n$, $lo$$)
}
function $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_push1$self$$, $value$$47$$) {
  $JSCompiler_StaticMethods_push1$self$$.$g$(--$JSCompiler_StaticMethods_push1$self$$.$n$, $value$$47$$ >> 8);
  $JSCompiler_StaticMethods_push1$self$$.$g$(--$JSCompiler_StaticMethods_push1$self$$.$n$, $value$$47$$ & 255)
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$a$ = $JSCompiler_StaticMethods_ret$self$$.$p$($JSCompiler_StaticMethods_ret$self$$.$n$), $JSCompiler_StaticMethods_ret$self$$.$n$ += 2, $JSCompiler_StaticMethods_ret$self$$.$o$ -= 6)
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$a$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$o$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$a$++
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$a$ = $JSCompiler_StaticMethods_jp$self$$.$p$($JSCompiler_StaticMethods_jp$self$$.$a$) : $JSCompiler_StaticMethods_jp$self$$.$a$ += 2
}
function $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$) {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$lineno$ = 0;
  for($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$cyclesPerLine$;;) {
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$a$.$updateDisassembly$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$a$);
    var $JSCompiler_StaticMethods_recompile$self$$inline_80$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
    if(1024 > $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$) {
      $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[0][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$] || $JSCompiler_StaticMethods_recompileFromAddress$$($JSCompiler_StaticMethods_recompile$self$$inline_80$$.$Q$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$, 0, 0), $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[0][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$].call($JSCompiler_StaticMethods_recompile$self$$inline_80$$)
    }else {
      if(16384 > $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$) {
        $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[0]][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$] || $JSCompiler_StaticMethods_recompileFromAddress$$($JSCompiler_StaticMethods_recompile$self$$inline_80$$.$Q$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[0], 0), $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[0]][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$].call($JSCompiler_StaticMethods_recompile$self$$inline_80$$)
      }else {
        if(32768 > $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$) {
          $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[1]][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$ - 16384] || $JSCompiler_StaticMethods_recompileFromAddress$$($JSCompiler_StaticMethods_recompile$self$$inline_80$$.$Q$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[1], 1), $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[1]][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$ - 
          16384].call($JSCompiler_StaticMethods_recompile$self$$inline_80$$)
        }else {
          if(49152 > $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$) {
            $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[2]][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$ - 32768] || $JSCompiler_StaticMethods_recompileFromAddress$$($JSCompiler_StaticMethods_recompile$self$$inline_80$$.$Q$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$, $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[2], 2), $JSCompiler_StaticMethods_recompile$self$$inline_80$$.$G$[$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$frameReg$[2]][$JSCompiler_StaticMethods_recompile$self$$inline_80$$.$a$ - 
            32768].call($JSCompiler_StaticMethods_recompile$self$$inline_80$$)
          }else {
            var $JSCompiler_StaticMethods_interpret$self$$inline_284$$ = $JSCompiler_StaticMethods_recompile$self$$inline_80$$, $location$$inline_285$$ = 0, $temp$$inline_286$$ = 0, $opcode$$inline_287$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
            $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$o$ -= $OP_STATES$$[$opcode$$inline_287$$];
            switch($opcode$$inline_287$$) {
              case 1:
                var $JSCompiler_StaticMethods_setBC$self$$inline_427$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $value$$inline_428$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                $JSCompiler_StaticMethods_setBC$self$$inline_427$$.$i$ = $value$$inline_428$$ >> 8;
                $JSCompiler_StaticMethods_setBC$self$$inline_427$$.$h$ = $value$$inline_428$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++;
                break;
              case 2:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 3:
                var $JSCompiler_StaticMethods_incBC$self$$inline_373$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$;
                $JSCompiler_StaticMethods_incBC$self$$inline_373$$.$h$ = $JSCompiler_StaticMethods_incBC$self$$inline_373$$.$h$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_incBC$self$$inline_373$$.$h$ && ($JSCompiler_StaticMethods_incBC$self$$inline_373$$.$i$ = $JSCompiler_StaticMethods_incBC$self$$inline_373$$.$i$ + 1 & 255);
                break;
              case 4:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 5:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 6:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 7:
                var $JSCompiler_StaticMethods_rlca_a$self$$inline_375$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $carry$$inline_376$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_375$$.$b$ >> 7;
                $JSCompiler_StaticMethods_rlca_a$self$$inline_375$$.$b$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_375$$.$b$ << 1 & 255 | $carry$$inline_376$$;
                $JSCompiler_StaticMethods_rlca_a$self$$inline_375$$.$c$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_375$$.$c$ & 236 | $carry$$inline_376$$;
                break;
              case 8:
                var $JSCompiler_StaticMethods_exAF$self$$inline_378$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $temp$$inline_379$$ = $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$b$;
                $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$b$ = $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$W$;
                $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$W$ = $temp$$inline_379$$;
                $temp$$inline_379$$ = $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$c$;
                $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$c$ = $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$ba$;
                $JSCompiler_StaticMethods_exAF$self$$inline_378$$.$ba$ = $temp$$inline_379$$;
                break;
              case 9:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 10:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 11:
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 12:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 13:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 14:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 15:
                var $JSCompiler_StaticMethods_rrca_a$self$$inline_381$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $carry$$inline_382$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_381$$.$b$ & 1;
                $JSCompiler_StaticMethods_rrca_a$self$$inline_381$$.$b$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_381$$.$b$ >> 1 | $carry$$inline_382$$ << 7;
                $JSCompiler_StaticMethods_rrca_a$self$$inline_381$$.$c$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_381$$.$c$ & 236 | $carry$$inline_382$$;
                break;
              case 16:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ - 1 & 255;
                $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 17:
                var $JSCompiler_StaticMethods_setDE$self$$inline_430$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $value$$inline_431$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                $JSCompiler_StaticMethods_setDE$self$$inline_430$$.$d$ = $value$$inline_431$$ >> 8;
                $JSCompiler_StaticMethods_setDE$self$$inline_430$$.$e$ = $value$$inline_431$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++;
                break;
              case 18:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 19:
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 20:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 21:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 22:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 23:
                var $JSCompiler_StaticMethods_rla_a$self$$inline_384$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $carry$$inline_385$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_384$$.$b$ >> 7;
                $JSCompiler_StaticMethods_rla_a$self$$inline_384$$.$b$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_384$$.$b$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_384$$.$c$ & 1) & 255;
                $JSCompiler_StaticMethods_rla_a$self$$inline_384$$.$c$ = $JSCompiler_StaticMethods_rla_a$self$$inline_384$$.$c$ & 236 | $carry$$inline_385$$;
                break;
              case 24:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$) + 1);
                break;
              case 25:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 26:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 27:
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 28:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 29:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 30:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 31:
                var $JSCompiler_StaticMethods_rra_a$self$$inline_387$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $carry$$inline_388$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_387$$.$b$ & 1;
                $JSCompiler_StaticMethods_rra_a$self$$inline_387$$.$b$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_387$$.$b$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_387$$.$c$ & 1) << 7) & 255;
                $JSCompiler_StaticMethods_rra_a$self$$inline_387$$.$c$ = $JSCompiler_StaticMethods_rra_a$self$$inline_387$$.$c$ & 236 | $carry$$inline_388$$;
                break;
              case 32:
                $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 33:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++;
                break;
              case 34:
                $location$$inline_285$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($location$$inline_285$$++, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($location$$inline_285$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 36:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 37:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 38:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 39:
                var $JSCompiler_StaticMethods_daa$self$$inline_390$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $temp$$inline_391$$ = $JSCompiler_StaticMethods_daa$self$$inline_390$$.$ea$[$JSCompiler_StaticMethods_daa$self$$inline_390$$.$b$ | ($JSCompiler_StaticMethods_daa$self$$inline_390$$.$c$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_390$$.$c$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_390$$.$c$ & 16) << 6];
                $JSCompiler_StaticMethods_daa$self$$inline_390$$.$b$ = $temp$$inline_391$$ & 255;
                $JSCompiler_StaticMethods_daa$self$$inline_390$$.$c$ = $JSCompiler_StaticMethods_daa$self$$inline_390$$.$c$ & 2 | $temp$$inline_391$$ >> 8;
                break;
              case 40:
                $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 41:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 42:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$)));
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 44:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 45:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 46:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 47:
                var $JSCompiler_StaticMethods_cpl_a$self$$inline_393$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$;
                $JSCompiler_StaticMethods_cpl_a$self$$inline_393$$.$b$ ^= 255;
                $JSCompiler_StaticMethods_cpl_a$self$$inline_393$$.$c$ |= 18;
                break;
              case 48:
                $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 49:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ += 2;
                break;
              case 50:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ += 2;
                break;
              case 51:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$++;
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 54:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 55:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ |= 1;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ &= -3;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ &= -17;
                break;
              case 56:
                $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 57:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$));
                break;
              case 58:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$));
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ += 2;
                break;
              case 59:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$--;
                break;
              case 60:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 61:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 62:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                break;
              case 63:
                var $JSCompiler_StaticMethods_ccf$self$$inline_395$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$;
                0 != ($JSCompiler_StaticMethods_ccf$self$$inline_395$$.$c$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_395$$.$c$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_395$$.$c$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_395$$.$c$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_395$$.$c$ &= -17);
                $JSCompiler_StaticMethods_ccf$self$$inline_395$$.$c$ &= -3;
                break;
              case 65:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$;
                break;
              case 66:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                break;
              case 67:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                break;
              case 68:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                break;
              case 69:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                break;
              case 70:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 71:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$;
                break;
              case 72:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$;
                break;
              case 74:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                break;
              case 75:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                break;
              case 76:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                break;
              case 77:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                break;
              case 78:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 79:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$;
                break;
              case 80:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$;
                break;
              case 81:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$;
                break;
              case 83:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                break;
              case 84:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                break;
              case 85:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                break;
              case 86:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 87:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$;
                break;
              case 88:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$;
                break;
              case 89:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$;
                break;
              case 90:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                break;
              case 92:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                break;
              case 93:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                break;
              case 94:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 95:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$;
                break;
              case 96:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$;
                break;
              case 97:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$;
                break;
              case 98:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                break;
              case 99:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                break;
              case 101:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                break;
              case 102:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 103:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$;
                break;
              case 105:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$;
                break;
              case 106:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                break;
              case 107:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                break;
              case 108:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                break;
              case 110:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 111:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 113:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 114:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 115:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 116:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 117:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 118:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$o$ = 0;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$P$ = !0;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$--;
                break;
              case 119:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 120:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$;
                break;
              case 121:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$;
                break;
              case 122:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                break;
              case 123:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                break;
              case 124:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                break;
              case 125:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                break;
              case 126:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$));
                break;
              case 128:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 129:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 130:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 131:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 135:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 136:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 137:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 138:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 139:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 143:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 144:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 145:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 146:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 147:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 151:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 152:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 153:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 154:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 155:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 159:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 160:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$] | 16;
                break;
              case 161:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$] | 16;
                break;
              case 162:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$] | 16;
                break;
              case 163:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$] | 16;
                break;
              case 164:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$))] | 16;
                break;
              case 167:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$] | 16;
                break;
              case 168:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$];
                break;
              case 169:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$];
                break;
              case 170:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$];
                break;
              case 171:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$];
                break;
              case 172:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$];
                break;
              case 173:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$];
                break;
              case 174:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$))];
                break;
              case 175:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = 0];
                break;
              case 176:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$];
                break;
              case 177:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$];
                break;
              case 178:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$];
                break;
              case 179:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$];
                break;
              case 180:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$];
                break;
              case 181:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$];
                break;
              case 182:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$))];
                break;
              case 183:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$];
                break;
              case 184:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$);
                break;
              case 185:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 186:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$);
                break;
              case 187:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$)));
                break;
              case 191:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 192:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 193:
                var $JSCompiler_StaticMethods_setBC$self$$inline_433$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $value$$inline_434$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$);
                $JSCompiler_StaticMethods_setBC$self$$inline_433$$.$i$ = $value$$inline_434$$ >> 8;
                $JSCompiler_StaticMethods_setBC$self$$inline_433$$.$h$ = $value$$inline_434$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ += 2;
                break;
              case 194:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 195:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                break;
              case 196:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 197:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$i$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$h$);
                break;
              case 198:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 199:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 0;
                break;
              case 200:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 201:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ += 2;
                break;
              case 202:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 203:
                var $JSCompiler_StaticMethods_doCB$self$$inline_397$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $opcode$$inline_398$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++);
                $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_398$$];
                switch($opcode$$inline_398$$) {
                  case 0:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 1:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 2:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 3:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 4:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 5:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 6:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 7:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 8:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 9:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 10:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 11:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 12:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 13:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 14:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 15:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 16:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 17:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 18:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 19:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 20:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 21:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 22:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 23:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 24:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 25:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 26:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 27:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 28:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 29:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 30:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 31:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 32:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 33:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 34:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 35:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 36:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 37:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 38:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 39:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 40:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 41:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 42:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 43:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 44:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 45:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 46:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 47:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 48:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 49:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 50:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 51:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 52:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 53:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 54:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 55:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 56:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$);
                    break;
                  case 57:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$);
                    break;
                  case 58:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$);
                    break;
                  case 59:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$);
                    break;
                  case 60:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$);
                    break;
                  case 61:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$);
                    break;
                  case 62:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$))));
                    break;
                  case 63:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$);
                    break;
                  case 64:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 1);
                    break;
                  case 65:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 1);
                    break;
                  case 66:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 1);
                    break;
                  case 67:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 1);
                    break;
                  case 68:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 1);
                    break;
                  case 69:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 1);
                    break;
                  case 70:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 1);
                    break;
                  case 71:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 1);
                    break;
                  case 72:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 2);
                    break;
                  case 73:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 2);
                    break;
                  case 74:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 2);
                    break;
                  case 75:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 2);
                    break;
                  case 76:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 2);
                    break;
                  case 77:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 2);
                    break;
                  case 78:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 2);
                    break;
                  case 79:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 2);
                    break;
                  case 80:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 4);
                    break;
                  case 81:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 4);
                    break;
                  case 82:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 4);
                    break;
                  case 83:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 4);
                    break;
                  case 84:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 4);
                    break;
                  case 85:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 4);
                    break;
                  case 86:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 4);
                    break;
                  case 87:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 4);
                    break;
                  case 88:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 8);
                    break;
                  case 89:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 8);
                    break;
                  case 90:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 8);
                    break;
                  case 91:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 8);
                    break;
                  case 92:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 8);
                    break;
                  case 93:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 8);
                    break;
                  case 94:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 8);
                    break;
                  case 95:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 8);
                    break;
                  case 96:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 16);
                    break;
                  case 97:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 16);
                    break;
                  case 98:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 16);
                    break;
                  case 99:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 16);
                    break;
                  case 100:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 16);
                    break;
                  case 101:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 16);
                    break;
                  case 102:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 16);
                    break;
                  case 103:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 16);
                    break;
                  case 104:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 32);
                    break;
                  case 105:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 32);
                    break;
                  case 106:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 32);
                    break;
                  case 107:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 32);
                    break;
                  case 108:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 32);
                    break;
                  case 109:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 32);
                    break;
                  case 110:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 32);
                    break;
                  case 111:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 32);
                    break;
                  case 112:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 64);
                    break;
                  case 113:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 64);
                    break;
                  case 114:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 64);
                    break;
                  case 115:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 64);
                    break;
                  case 116:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 64);
                    break;
                  case 117:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 64);
                    break;
                  case 118:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 64);
                    break;
                  case 119:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 64);
                    break;
                  case 120:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ & 128);
                    break;
                  case 121:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ & 128);
                    break;
                  case 122:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ & 128);
                    break;
                  case 123:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ & 128);
                    break;
                  case 124:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ & 128);
                    break;
                  case 125:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ & 128);
                    break;
                  case 126:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & 128);
                    break;
                  case 127:
                    $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$, $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ & 128);
                    break;
                  case 128:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -2;
                    break;
                  case 129:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -2;
                    break;
                  case 130:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -2;
                    break;
                  case 131:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -2;
                    break;
                  case 132:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -2;
                    break;
                  case 133:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -2;
                    break;
                  case 134:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -2);
                    break;
                  case 135:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -2;
                    break;
                  case 136:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -3;
                    break;
                  case 137:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -3;
                    break;
                  case 138:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -3;
                    break;
                  case 139:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -3;
                    break;
                  case 140:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -3;
                    break;
                  case 141:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -3;
                    break;
                  case 142:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -3);
                    break;
                  case 143:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -3;
                    break;
                  case 144:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -5;
                    break;
                  case 145:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -5;
                    break;
                  case 146:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -5;
                    break;
                  case 147:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -5;
                    break;
                  case 148:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -5;
                    break;
                  case 149:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -5;
                    break;
                  case 150:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -5);
                    break;
                  case 151:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -5;
                    break;
                  case 152:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -9;
                    break;
                  case 153:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -9;
                    break;
                  case 154:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -9;
                    break;
                  case 155:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -9;
                    break;
                  case 156:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -9;
                    break;
                  case 157:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -9;
                    break;
                  case 158:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -9);
                    break;
                  case 159:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -9;
                    break;
                  case 160:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -17;
                    break;
                  case 161:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -17;
                    break;
                  case 162:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -17;
                    break;
                  case 163:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -17;
                    break;
                  case 164:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -17;
                    break;
                  case 165:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -17;
                    break;
                  case 166:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -17);
                    break;
                  case 167:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -17;
                    break;
                  case 168:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -33;
                    break;
                  case 169:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -33;
                    break;
                  case 170:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -33;
                    break;
                  case 171:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -33;
                    break;
                  case 172:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -33;
                    break;
                  case 173:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -33;
                    break;
                  case 174:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -33);
                    break;
                  case 175:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -33;
                    break;
                  case 176:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -65;
                    break;
                  case 177:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -65;
                    break;
                  case 178:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -65;
                    break;
                  case 179:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -65;
                    break;
                  case 180:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -65;
                    break;
                  case 181:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -65;
                    break;
                  case 182:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -65);
                    break;
                  case 183:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -65;
                    break;
                  case 184:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ &= -129;
                    break;
                  case 185:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ &= -129;
                    break;
                  case 186:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ &= -129;
                    break;
                  case 187:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ &= -129;
                    break;
                  case 188:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ &= -129;
                    break;
                  case 189:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ &= -129;
                    break;
                  case 190:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) & -129);
                    break;
                  case 191:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ &= -129;
                    break;
                  case 192:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 1;
                    break;
                  case 193:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 1;
                    break;
                  case 194:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 1;
                    break;
                  case 195:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 1;
                    break;
                  case 196:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 1;
                    break;
                  case 197:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 1;
                    break;
                  case 198:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 1);
                    break;
                  case 199:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 1;
                    break;
                  case 200:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 2;
                    break;
                  case 201:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 2;
                    break;
                  case 202:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 2;
                    break;
                  case 203:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 2;
                    break;
                  case 204:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 2;
                    break;
                  case 205:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 2;
                    break;
                  case 206:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 2);
                    break;
                  case 207:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 2;
                    break;
                  case 208:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 4;
                    break;
                  case 209:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 4;
                    break;
                  case 210:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 4;
                    break;
                  case 211:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 4;
                    break;
                  case 212:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 4;
                    break;
                  case 213:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 4;
                    break;
                  case 214:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 4);
                    break;
                  case 215:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 4;
                    break;
                  case 216:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 8;
                    break;
                  case 217:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 8;
                    break;
                  case 218:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 8;
                    break;
                  case 219:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 8;
                    break;
                  case 220:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 8;
                    break;
                  case 221:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 8;
                    break;
                  case 222:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 8);
                    break;
                  case 223:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 8;
                    break;
                  case 224:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 16;
                    break;
                  case 225:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 16;
                    break;
                  case 226:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 16;
                    break;
                  case 227:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 16;
                    break;
                  case 228:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 16;
                    break;
                  case 229:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 16;
                    break;
                  case 230:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 16);
                    break;
                  case 231:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 16;
                    break;
                  case 232:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 32;
                    break;
                  case 233:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 32;
                    break;
                  case 234:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 32;
                    break;
                  case 235:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 32;
                    break;
                  case 236:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 32;
                    break;
                  case 237:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 32;
                    break;
                  case 238:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 32);
                    break;
                  case 239:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 32;
                    break;
                  case 240:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 64;
                    break;
                  case 241:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 64;
                    break;
                  case 242:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 64;
                    break;
                  case 243:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 64;
                    break;
                  case 244:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 64;
                    break;
                  case 245:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 64;
                    break;
                  case 246:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 64);
                    break;
                  case 247:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 64;
                    break;
                  case 248:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$i$ |= 128;
                    break;
                  case 249:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$h$ |= 128;
                    break;
                  case 250:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$d$ |= 128;
                    break;
                  case 251:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$e$ |= 128;
                    break;
                  case 252:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$j$ |= 128;
                    break;
                  case 253:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$l$ |= 128;
                    break;
                  case 254:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$), $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_397$$)) | 128);
                    break;
                  case 255:
                    $JSCompiler_StaticMethods_doCB$self$$inline_397$$.$b$ |= 128;
                    break;
                  default:
                    $JSSMS$Utils$console$log$$("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_398$$))
                }
                break;
              case 204:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 64));
                break;
              case 205:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ + 2);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                break;
              case 206:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 207:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 8;
                break;
              case 208:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 209:
                var $JSCompiler_StaticMethods_setDE$self$$inline_436$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $value$$inline_437$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$);
                $JSCompiler_StaticMethods_setDE$self$$inline_436$$.$d$ = $value$$inline_437$$ >> 8;
                $JSCompiler_StaticMethods_setDE$self$$inline_436$$.$e$ = $value$$inline_437$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ += 2;
                break;
              case 210:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 211:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.port, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$);
                break;
              case 212:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 213:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$);
                break;
              case 214:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 215:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 16;
                break;
              case 216:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 217:
                var $JSCompiler_StaticMethods_exBC$self$$inline_400$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $temp$$inline_401$$ = $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$i$;
                $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$i$ = $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$X$;
                $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$X$ = $temp$$inline_401$$;
                $temp$$inline_401$$ = $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$h$;
                $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$h$ = $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$Y$;
                $JSCompiler_StaticMethods_exBC$self$$inline_400$$.$Y$ = $temp$$inline_401$$;
                var $JSCompiler_StaticMethods_exDE$self$$inline_403$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $temp$$inline_404$$ = $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$d$;
                $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$d$ = $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$Z$;
                $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$Z$ = $temp$$inline_404$$;
                $temp$$inline_404$$ = $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$e$;
                $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$e$ = $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$aa$;
                $JSCompiler_StaticMethods_exDE$self$$inline_403$$.$aa$ = $temp$$inline_404$$;
                var $JSCompiler_StaticMethods_exHL$self$$inline_406$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $temp$$inline_407$$ = $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$j$;
                $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$j$ = $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$ca$;
                $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$ca$ = $temp$$inline_407$$;
                $temp$$inline_407$$ = $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$l$;
                $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$l$ = $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$da$;
                $JSCompiler_StaticMethods_exHL$self$$inline_406$$.$da$ = $temp$$inline_407$$;
                break;
              case 218:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 219:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.port, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 220:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 1));
                break;
              case 221:
                var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $opcode$$inline_410$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++), $location$$inline_411$$ = 0, $temp$$inline_412$$ = 0;
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_410$$];
                switch($opcode$$inline_410$$) {
                  case 9:
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    break;
                  case 25:
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    break;
                  case 33:
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$ += 2;
                    break;
                  case 34:
                    $location$$inline_411$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($location$$inline_411$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($location$$inline_411$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$ += 2;
                    break;
                  case 35:
                    var $JSCompiler_StaticMethods_incIX$self$$inline_439$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$;
                    $JSCompiler_StaticMethods_incIX$self$$inline_439$$.$q$ = $JSCompiler_StaticMethods_incIX$self$$inline_439$$.$q$ + 1 & 255;
                    0 == $JSCompiler_StaticMethods_incIX$self$$inline_439$$.$q$ && ($JSCompiler_StaticMethods_incIX$self$$inline_439$$.$t$ = $JSCompiler_StaticMethods_incIX$self$$inline_439$$.$t$ + 1 & 255);
                    break;
                  case 36:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 37:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 38:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++);
                    break;
                  case 41:
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    break;
                  case 42:
                    $location$$inline_411$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($location$$inline_411$$++);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($location$$inline_411$$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$ += 2;
                    break;
                  case 43:
                    var $JSCompiler_StaticMethods_decIX$self$$inline_441$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$;
                    $JSCompiler_StaticMethods_decIX$self$$inline_441$$.$q$ = $JSCompiler_StaticMethods_decIX$self$$inline_441$$.$q$ - 1 & 255;
                    255 == $JSCompiler_StaticMethods_decIX$self$$inline_441$$.$q$ && ($JSCompiler_StaticMethods_decIX$self$$inline_441$$.$t$ = $JSCompiler_StaticMethods_decIX$self$$inline_441$$.$t$ - 1 & 255);
                    break;
                  case 44:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 45:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 46:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++);
                    break;
                  case 52:
                    $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 53:
                    $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 54:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 57:
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$));
                    break;
                  case 68:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$;
                    break;
                  case 69:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$;
                    break;
                  case 70:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 76:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$;
                    break;
                  case 77:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$;
                    break;
                  case 78:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 84:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$;
                    break;
                  case 85:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$;
                    break;
                  case 86:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 92:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$;
                    break;
                  case 93:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$;
                    break;
                  case 94:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 96:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$i$;
                    break;
                  case 97:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$h$;
                    break;
                  case 98:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$d$;
                    break;
                  case 99:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$e$;
                    break;
                  case 100:
                    break;
                  case 101:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$;
                    break;
                  case 102:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 103:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$;
                    break;
                  case 104:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$i$;
                    break;
                  case 105:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$h$;
                    break;
                  case 106:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$d$;
                    break;
                  case 107:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$e$;
                    break;
                  case 108:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$;
                    break;
                  case 109:
                    break;
                  case 110:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 111:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$;
                    break;
                  case 112:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$i$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 113:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$h$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 114:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$d$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 115:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$e$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 116:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$j$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 117:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$l$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 119:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 124:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$;
                    break;
                  case 125:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$;
                    break;
                  case 126:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 132:
                    $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 133:
                    $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 134:
                    $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 140:
                    $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 141:
                    $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 142:
                    $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 148:
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 149:
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 150:
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 156:
                    $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 157:
                    $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 158:
                    $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 164:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$] | 16;
                    break;
                  case 165:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$] | 16;
                    break;
                  case 166:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$))] | 16;
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 172:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$];
                    break;
                  case 173:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$];
                    break;
                  case 174:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$))];
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 180:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$];
                    break;
                  case 181:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$];
                    break;
                  case 182:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$))];
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 188:
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$);
                    break;
                  case 189:
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 190:
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$f$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$)));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$++;
                    break;
                  case 203:
                    $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$));
                    break;
                  case 225:
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$ += 2;
                    break;
                  case 227:
                    $temp$$inline_412$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$);
                    $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$));
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$, $temp$$inline_412$$ & 255);
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$g$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$ + 1, $temp$$inline_412$$ >> 8);
                    break;
                  case 229:
                    $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$t$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$q$);
                    break;
                  case 233:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$);
                    break;
                  case 249:
                    $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$n$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$);
                    break;
                  default:
                    $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_410$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_409$$.$a$--
                }
                break;
              case 222:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 223:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 24;
                break;
              case 224:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 4));
                break;
              case 225:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$));
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ += 2;
                break;
              case 226:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 4));
                break;
              case 227:
                $temp$$inline_286$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ + 1);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ + 1, $temp$$inline_286$$);
                $temp$$inline_286$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$, $temp$$inline_286$$);
                break;
              case 228:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 4));
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$);
                break;
              case 230:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ &= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++)] | 16;
                break;
              case 231:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 32;
                break;
              case 232:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 4));
                break;
              case 233:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 234:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 4));
                break;
              case 235:
                $temp$$inline_286$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$j$ = $temp$$inline_286$$;
                $temp$$inline_286$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$l$ = $temp$$inline_286$$;
                break;
              case 236:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 4));
                break;
              case 237:
                var $JSCompiler_StaticMethods_doED$self$$inline_414$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $opcode$$inline_415$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$), $temp$$inline_416$$ = 0, $location$$inline_417$$ = 0;
                $JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_415$$];
                switch($opcode$$inline_415$$) {
                  case 64:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 65:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 66:
                    $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 67:
                    $location$$inline_417$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$++, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
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
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ = 0;
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
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
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$ += 2;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$I$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$J$;
                    break;
                  case 70:
                  ;
                  case 78:
                  ;
                  case 102:
                  ;
                  case 110:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$R$ = 0;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 71:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$U$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 72:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 73:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 74:
                    $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 75:
                    var $JSCompiler_StaticMethods_setBC$self$$inline_443$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$, $value$$inline_444$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$));
                    $JSCompiler_StaticMethods_setBC$self$$inline_443$$.$i$ = $value$$inline_444$$ >> 8;
                    $JSCompiler_StaticMethods_setBC$self$$inline_443$$.$h$ = $value$$inline_444$$ & 255;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 79:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 80:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$d$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 81:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$d$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 82:
                    $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 83:
                    $location$$inline_417$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$++, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$e$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$d$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 86:
                  ;
                  case 118:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$R$ = 1;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 87:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$U$;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$V$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$] | ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$J$ ? 4 : 0);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 88:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$e$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 89:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$e$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 90:
                    $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 91:
                    var $JSCompiler_StaticMethods_setDE$self$$inline_446$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$, $value$$inline_447$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$));
                    $JSCompiler_StaticMethods_setDE$self$$inline_446$$.$d$ = $value$$inline_447$$ >> 8;
                    $JSCompiler_StaticMethods_setDE$self$$inline_446$$.$e$ = $value$$inline_447$$ & 255;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 95:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ = Math.round(255 * Math.random());
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$V$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$] | ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$J$ ? 4 : 0);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 96:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$j$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 97:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$j$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 98:
                    $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 99:
                    $location$$inline_417$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$++, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$j$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 103:
                    $location$$inline_417$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($location$$inline_417$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$, $temp$$inline_416$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ & 15) << 4);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ & 240 | $temp$$inline_416$$ & 15;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 104:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 105:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 106:
                    $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 107:
                    $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$)));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 111:
                    $location$$inline_417$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($location$$inline_417$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$, ($temp$$inline_416$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ & 15);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ & 240 | $temp$$inline_416$$ >> 4;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 113:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, 0);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 114:
                    $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 115:
                    $location$$inline_417$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$++, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$ & 255);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($location$$inline_417$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$ >> 8);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 120:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_414$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$];
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 121:
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$b$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 122:
                    $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 123:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$n$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_414$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$));
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$ += 2;
                    break;
                  case 160:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? 4 : 0);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 161:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | 2;
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $temp$$inline_416$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? 0 : 4;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 248 | $temp$$inline_416$$;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 162:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 128 == ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 163:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    255 < $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$ + $temp$$inline_416$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -17);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 128 == ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 168:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? 4 : 0);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 169:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | 2;
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $temp$$inline_416$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? 0 : 4;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 248 | $temp$$inline_416$$;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 170:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 0 != ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 171:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    255 < $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$ + $temp$$inline_416$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -17);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 128 == ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    break;
                  case 176:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -3;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -17;
                    break;
                  case 177:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | 2;
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $temp$$inline_416$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? 0 : 4;
                    0 != ($temp$$inline_416$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 248 | $temp$$inline_416$$;
                    break;
                  case 178:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    0 != $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 128 == ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    break;
                  case 179:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    0 != $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    255 < $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$ + $temp$$inline_416$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -17);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 0 != ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    break;
                  case 184:
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -3;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -17;
                    break;
                  case 185:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 1 | 2;
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$)));
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    $temp$$inline_416$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_414$$) ? 0 : 4;
                    0 != ($temp$$inline_416$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & 248 | $temp$$inline_416$$;
                    break;
                  case 186:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$), $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    0 != $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 0 != ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    break;
                  case 187:
                    $temp$$inline_416$$ = $JSCompiler_StaticMethods_doED$self$$inline_414$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$));
                    $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_414$$.port, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$h$, $temp$$inline_416$$);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_414$$, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$);
                    $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_414$$);
                    0 != $JSCompiler_StaticMethods_doED$self$$inline_414$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$--) : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++;
                    255 < $JSCompiler_StaticMethods_doED$self$$inline_414$$.$l$ + $temp$$inline_416$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ &= -17);
                    $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ = 0 != ($temp$$inline_416$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_414$$.$c$ & -3;
                    break;
                  default:
                    $JSSMS$Utils$console$log$$("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_415$$)), $JSCompiler_StaticMethods_doED$self$$inline_414$$.$a$++
                }
                break;
              case 238:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++)];
                break;
              case 239:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 40;
                break;
              case 240:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 128));
                break;
              case 241:
                var $JSCompiler_StaticMethods_setAF$self$$inline_419$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $value$$inline_420$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$);
                $JSCompiler_StaticMethods_setAF$self$$inline_419$$.$b$ = $value$$inline_420$$ >> 8;
                $JSCompiler_StaticMethods_setAF$self$$inline_419$$.$c$ = $value$$inline_420$$ & 255;
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ += 2;
                break;
              case 242:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 128));
                break;
              case 243:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$I$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$J$ = !1;
                break;
              case 244:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 128));
                break;
              case 245:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$);
                break;
              case 246:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_284$$.$b$ |= $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++)];
                break;
              case 247:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$);
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 48;
                break;
              case 248:
                $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 128));
                break;
              case 249:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$);
                break;
              case 250:
                $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 128));
                break;
              case 251:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$I$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$J$ = !0;
                break;
              case 252:
                $JSCompiler_StaticMethods_interpret$self$$inline_284$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$c$ & 128));
                break;
              case 253:
                var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$, $opcode$$inline_423$$ = $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++), $location$$inline_424$$ = void 0, $temp$$inline_425$$ = void 0;
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_423$$];
                switch($opcode$$inline_423$$) {
                  case 9:
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    break;
                  case 25:
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    break;
                  case 33:
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$ += 2;
                    break;
                  case 34:
                    $location$$inline_424$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($location$$inline_424$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($location$$inline_424$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$ += 2;
                    break;
                  case 35:
                    var $JSCompiler_StaticMethods_incIY$self$$inline_449$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$;
                    $JSCompiler_StaticMethods_incIY$self$$inline_449$$.$s$ = $JSCompiler_StaticMethods_incIY$self$$inline_449$$.$s$ + 1 & 255;
                    0 == $JSCompiler_StaticMethods_incIY$self$$inline_449$$.$s$ && ($JSCompiler_StaticMethods_incIY$self$$inline_449$$.$v$ = $JSCompiler_StaticMethods_incIY$self$$inline_449$$.$v$ + 1 & 255);
                    break;
                  case 36:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 37:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 38:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++);
                    break;
                  case 41:
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    break;
                  case 42:
                    $location$$inline_424$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($location$$inline_424$$++);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($location$$inline_424$$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$ += 2;
                    break;
                  case 43:
                    var $JSCompiler_StaticMethods_decIY$self$$inline_451$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$;
                    $JSCompiler_StaticMethods_decIY$self$$inline_451$$.$s$ = $JSCompiler_StaticMethods_decIY$self$$inline_451$$.$s$ - 1 & 255;
                    255 == $JSCompiler_StaticMethods_decIY$self$$inline_451$$.$s$ && ($JSCompiler_StaticMethods_decIY$self$$inline_451$$.$v$ = $JSCompiler_StaticMethods_decIY$self$$inline_451$$.$v$ - 1 & 255);
                    break;
                  case 44:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 45:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 46:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++);
                    break;
                  case 52:
                    $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 53:
                    $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 54:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 57:
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$));
                    break;
                  case 68:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$;
                    break;
                  case 69:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$;
                    break;
                  case 70:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 76:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$;
                    break;
                  case 77:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$;
                    break;
                  case 78:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 84:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$;
                    break;
                  case 85:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$;
                    break;
                  case 86:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 92:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$;
                    break;
                  case 93:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$;
                    break;
                  case 94:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 96:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$i$;
                    break;
                  case 97:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$h$;
                    break;
                  case 98:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$d$;
                    break;
                  case 99:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$e$;
                    break;
                  case 100:
                    break;
                  case 101:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$;
                    break;
                  case 102:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 103:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$;
                    break;
                  case 104:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$i$;
                    break;
                  case 105:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$h$;
                    break;
                  case 106:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$d$;
                    break;
                  case 107:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$e$;
                    break;
                  case 108:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$;
                    break;
                  case 109:
                    break;
                  case 110:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 111:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$;
                    break;
                  case 112:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$i$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 113:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$h$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 114:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$d$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 115:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$e$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 116:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$j$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 117:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$l$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 119:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 124:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$;
                    break;
                  case 125:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$;
                    break;
                  case 126:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 132:
                    $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 133:
                    $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 134:
                    $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 140:
                    $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 141:
                    $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 142:
                    $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 148:
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 149:
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 150:
                    $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 156:
                    $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 157:
                    $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 158:
                    $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 164:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$] | 16;
                    break;
                  case 165:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$] | 16;
                    break;
                  case 166:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$))] | 16;
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 172:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$];
                    break;
                  case 173:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$];
                    break;
                  case 174:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$))];
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 180:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$];
                    break;
                  case 181:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$];
                    break;
                  case 182:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$))];
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 188:
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$);
                    break;
                  case 189:
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 190:
                    $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$f$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$)));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$++;
                    break;
                  case 203:
                    $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$));
                    break;
                  case 225:
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$ += 2;
                    break;
                  case 227:
                    $temp$$inline_425$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$);
                    $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$));
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$, $temp$$inline_425$$ & 255);
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$g$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$ + 1, $temp$$inline_425$$ >> 8);
                    break;
                  case 229:
                    $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$v$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$s$);
                    break;
                  case 233:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$);
                    break;
                  case 249:
                    $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$n$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$);
                    break;
                  default:
                    $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_423$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_422$$.$a$--
                }
                break;
              case 254:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$++));
                break;
              case 255:
                $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_284$$, $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$), $JSCompiler_StaticMethods_interpret$self$$inline_284$$.$a$ = 56
            }
          }
        }
      }
    }
    var $JSCompiler_temp$$2$$;
    if($JSCompiler_temp$$2$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$) {
      var $JSCompiler_StaticMethods_eol$self$$inline_82$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
      if($JSCompiler_StaticMethods_eol$self$$inline_82$$.$main$.$soundEnabled$) {
        var $JSCompiler_StaticMethods_updateSound$self$$inline_289$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$main$, $line$$inline_290$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$;
        0 == $line$$inline_290$$ && ($JSCompiler_StaticMethods_updateSound$self$$inline_289$$.$audioBufferOffset$ = 0);
        for(var $samplesToGenerate$$inline_291$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_289$$.$samplesPerLine$[$line$$inline_290$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_289$$.$b$, $offset$$inline_293$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_289$$.$audioBufferOffset$, $buffer$$inline_294$$ = [], $sample$$inline_295$$ = 0, $i$$inline_296$$ = 0;$sample$$inline_295$$ < $samplesToGenerate$$inline_291$$;$sample$$inline_295$$++) {
          for($i$$inline_296$$ = 0;3 > $i$$inline_296$$;$i$$inline_296$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$m$[$i$$inline_296$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$i$[$i$$inline_296$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$b$[($i$$inline_296$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$i$[$i$$inline_296$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$b$[($i$$inline_296$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[$i$$inline_296$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$m$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$h$ & 1) << 1;
          var $output$$inline_297$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$m$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$m$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$m$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$m$[3];
          127 < $output$$inline_297$$ ? $output$$inline_297$$ = 127 : -128 > $output$$inline_297$$ && ($output$$inline_297$$ = -128);
          $buffer$$inline_294$$[$offset$$inline_293$$ + $sample$$inline_295$$] = $output$$inline_297$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$g$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$n$;
          var $clockCycles$$inline_298$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$g$ >> 8, $clockCyclesScaled$$inline_299$$ = $clockCycles$$inline_298$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$g$ -= $clockCyclesScaled$$inline_299$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[0] -= $clockCycles$$inline_298$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[1] -= $clockCycles$$inline_298$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[2] -= $clockCycles$$inline_298$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$j$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[3] - $clockCycles$$inline_298$$;
          for($i$$inline_296$$ = 0;3 > $i$$inline_296$$;$i$$inline_296$$++) {
            var $counter$$inline_300$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[$i$$inline_296$$];
            if(0 >= $counter$$inline_300$$) {
              var $tone$$inline_301$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$b$[$i$$inline_296$$ << 1];
              6 < $tone$$inline_301$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$i$[$i$$inline_296$$] = ($clockCyclesScaled$$inline_299$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$g$ + 512 * $counter$$inline_300$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[$i$$inline_296$$] / ($clockCyclesScaled$$inline_299$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$g$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[$i$$inline_296$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[$i$$inline_296$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[$i$$inline_296$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$i$[$i$$inline_296$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[$i$$inline_296$$] += $tone$$inline_301$$ * ($clockCycles$$inline_298$$ / $tone$$inline_301$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$i$[$i$$inline_296$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$j$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$j$ * 
          ($clockCycles$$inline_298$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$j$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$f$[3])) {
            var $feedback$$inline_302$$ = 0, $feedback$$inline_302$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$h$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$h$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$h$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$h$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_292$$.$h$ >> 1 | $feedback$$inline_302$$ << 15
          }
        }
        $JSCompiler_StaticMethods_updateSound$self$$inline_289$$.$audioBuffer$ = $buffer$$inline_294$$;
        $JSCompiler_StaticMethods_updateSound$self$$inline_289$$.$audioBufferOffset$ += $samplesToGenerate$$inline_291$$
      }
      $JSCompiler_StaticMethods_eol$self$$inline_82$$.$vdp$.$p$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$;
      if(192 > $JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$) {
        var $JSCompiler_StaticMethods_drawLine$self$$inline_304$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$vdp$, $lineno$$inline_305$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$, $i$$inline_306$$ = 0, $temp$$inline_307$$ = 0, $temp2$$inline_308$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$main$.$is_gg$ || !(24 > $lineno$$inline_305$$ || 168 <= $lineno$$inline_305$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$o$) {
              for(var $i$$inline_309$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$s$;$i$$inline_309$$ <= $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$o$;$i$$inline_309$$++) {
                if($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$w$[$i$$inline_309$$]) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$w$[$i$$inline_309$$] = !1;
                  for(var $tile$$inline_310$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$I$[$i$$inline_309$$], $pixel_index$$inline_311$$ = 0, $address$$inline_312$$ = $i$$inline_309$$ << 5, $y$$inline_313$$ = 0;8 > $y$$inline_313$$;$y$$inline_313$$++) {
                    for(var $address0$$inline_314$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$address$$inline_312$$++], $address1$$inline_315$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$address$$inline_312$$++], $address2$$inline_316$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$address$$inline_312$$++], $address3$$inline_317$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$address$$inline_312$$++], $bit$$inline_318$$ = 128;0 != 
                    $bit$$inline_318$$;$bit$$inline_318$$ >>= 1) {
                      var $colour$$inline_319$$ = 0;
                      0 != ($address0$$inline_314$$ & $bit$$inline_318$$) && ($colour$$inline_319$$ |= 1);
                      0 != ($address1$$inline_315$$ & $bit$$inline_318$$) && ($colour$$inline_319$$ |= 2);
                      0 != ($address2$$inline_316$$ & $bit$$inline_318$$) && ($colour$$inline_319$$ |= 4);
                      0 != ($address3$$inline_317$$ & $bit$$inline_318$$) && ($colour$$inline_319$$ |= 8);
                      $tile$$inline_310$$[$pixel_index$$inline_311$$++] = $colour$$inline_319$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$s$ = 512;
              $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$o$ = -1
            }
            var $pixX$$inline_320$$ = 0, $colour$$inline_321$$ = 0, $temp$$inline_322$$ = 0, $temp2$$inline_323$$ = 0, $hscroll$$inline_324$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[8], $vscroll$$inline_325$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[9];
            16 > $lineno$$inline_305$$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[0] & 64) && ($hscroll$$inline_324$$ = 0);
            var $lock$$inline_326$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[0] & 128, $tile_column$$inline_327$$ = 32 - ($hscroll$$inline_324$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$G$, $tile_row$$inline_328$$ = $lineno$$inline_305$$ + $vscroll$$inline_325$$ >> 3;
            27 < $tile_row$$inline_328$$ && ($tile_row$$inline_328$$ -= 28);
            for(var $tile_y$$inline_329$$ = ($lineno$$inline_305$$ + ($vscroll$$inline_325$$ & 7) & 7) << 3, $row_precal$$inline_330$$ = $lineno$$inline_305$$ << 8, $tx$$inline_331$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$G$;$tx$$inline_331$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$K$;$tx$$inline_331$$++) {
              var $tile_props$$inline_332$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$J$ + (($tile_column$$inline_327$$ & 31) << 1) + ($tile_row$$inline_328$$ << 6), $secondbyte$$inline_333$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$tile_props$$inline_332$$ + 1], $pal$$inline_334$$ = ($secondbyte$$inline_333$$ & 8) << 1, $sx$$inline_335$$ = ($tx$$inline_331$$ << 3) + ($hscroll$$inline_324$$ & 7), $pixY$$inline_336$$ = 0 == ($secondbyte$$inline_333$$ & 4) ? $tile_y$$inline_329$$ : 
              56 - $tile_y$$inline_329$$, $tile$$inline_337$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$I$[($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$tile_props$$inline_332$$] & 255) + (($secondbyte$$inline_333$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_333$$ & 2)) {
                for($pixX$$inline_320$$ = 0;8 > $pixX$$inline_320$$ && 256 > $sx$$inline_335$$;$pixX$$inline_320$$++, $sx$$inline_335$$++) {
                  $colour$$inline_321$$ = $tile$$inline_337$$[$pixX$$inline_320$$ + $pixY$$inline_336$$], $temp$$inline_322$$ = 4 * ($sx$$inline_335$$ + $row_precal$$inline_330$$), $temp2$$inline_323$$ = 3 * ($colour$$inline_321$$ + $pal$$inline_334$$), $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$t$[$sx$$inline_335$$] = 0 != ($secondbyte$$inline_333$$ & 16) && 0 != $colour$$inline_321$$, $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_322$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_323$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_322$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_323$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_322$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_323$$ + 2]
                }
              }else {
                for($pixX$$inline_320$$ = 7;0 <= $pixX$$inline_320$$ && 256 > $sx$$inline_335$$;$pixX$$inline_320$$--, $sx$$inline_335$$++) {
                  $colour$$inline_321$$ = $tile$$inline_337$$[$pixX$$inline_320$$ + $pixY$$inline_336$$], $temp$$inline_322$$ = 4 * ($sx$$inline_335$$ + $row_precal$$inline_330$$), $temp2$$inline_323$$ = 3 * ($colour$$inline_321$$ + $pal$$inline_334$$), $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$t$[$sx$$inline_335$$] = 0 != ($secondbyte$$inline_333$$ & 16) && 0 != $colour$$inline_321$$, $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_322$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_323$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_322$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_323$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_322$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_323$$ + 2]
                }
              }
              $tile_column$$inline_327$$++;
              0 != $lock$$inline_326$$ && 23 == $tx$$inline_331$$ && ($tile_row$$inline_328$$ = $lineno$$inline_305$$ >> 3, $tile_y$$inline_329$$ = ($lineno$$inline_305$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$j$) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$j$ = !1;
              for(var $i$$inline_338$$ = 0;$i$$inline_338$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$q$.length;$i$$inline_338$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$q$[$i$$inline_338$$][0] = 0
              }
              var $height$$inline_339$$ = 0 == ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[1] & 1) && ($height$$inline_339$$ <<= 1);
              for(var $spriteno$$inline_340$$ = 0;64 > $spriteno$$inline_340$$;$spriteno$$inline_340$$++) {
                var $y$$inline_341$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$i$ + $spriteno$$inline_340$$] & 255;
                if(208 == $y$$inline_341$$) {
                  break
                }
                $y$$inline_341$$++;
                240 < $y$$inline_341$$ && ($y$$inline_341$$ -= 256);
                for(var $lineno$$inline_342$$ = $y$$inline_341$$;192 > $lineno$$inline_342$$;$lineno$$inline_342$$++) {
                  if($lineno$$inline_342$$ - $y$$inline_341$$ < $height$$inline_339$$) {
                    var $sprites$$inline_343$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$q$[$lineno$$inline_342$$];
                    if(!$sprites$$inline_343$$ || 8 <= $sprites$$inline_343$$[0]) {
                      break
                    }
                    var $off$$inline_344$$ = 3 * $sprites$$inline_343$$[0] + 1, $address$$inline_345$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$i$ + ($spriteno$$inline_340$$ << 1) + 128;
                    $sprites$$inline_343$$[$off$$inline_344$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$address$$inline_345$$++] & 255;
                    $sprites$$inline_343$$[$off$$inline_344$$++] = $y$$inline_341$$;
                    $sprites$$inline_343$$[$off$$inline_344$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$f$[$address$$inline_345$$] & 255;
                    $sprites$$inline_343$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$q$[$lineno$$inline_305$$][0]) {
              for(var $colour$$inline_346$$ = 0, $temp$$inline_347$$ = 0, $temp2$$inline_348$$ = 0, $i$$inline_349$$ = 0, $sprites$$inline_350$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$q$[$lineno$$inline_305$$], $count$$inline_351$$ = Math.min(8, $sprites$$inline_350$$[0]), $zoomed$$inline_352$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[1] & 1, $row_precal$$inline_353$$ = $lineno$$inline_305$$ << 8, $off$$inline_354$$ = 3 * $count$$inline_351$$;$i$$inline_349$$ < 
              $count$$inline_351$$;$i$$inline_349$$++) {
                var $n$$inline_355$$ = $sprites$$inline_350$$[$off$$inline_354$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[6] & 4) << 6, $y$$inline_356$$ = $sprites$$inline_350$$[$off$$inline_354$$--], $x$$inline_357$$ = $sprites$$inline_350$$[$off$$inline_354$$--] - ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[0] & 8), $tileRow$$inline_358$$ = $lineno$$inline_305$$ - $y$$inline_356$$ >> $zoomed$$inline_352$$;
                0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[1] & 2) && ($n$$inline_355$$ &= -2);
                var $tile$$inline_359$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$I$[$n$$inline_355$$ + (($tileRow$$inline_358$$ & 8) >> 3)], $pix$$inline_360$$ = 0;
                0 > $x$$inline_357$$ && ($pix$$inline_360$$ = -$x$$inline_357$$, $x$$inline_357$$ = 0);
                var $offset$$inline_361$$ = $pix$$inline_360$$ + (($tileRow$$inline_358$$ & 7) << 3);
                if(0 == $zoomed$$inline_352$$) {
                  for(;8 > $pix$$inline_360$$ && 256 > $x$$inline_357$$;$pix$$inline_360$$++, $x$$inline_357$$++) {
                    $colour$$inline_346$$ = $tile$$inline_359$$[$offset$$inline_361$$++], 0 == $colour$$inline_346$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$t$[$x$$inline_357$$] || ($temp$$inline_347$$ = 4 * ($x$$inline_357$$ + $row_precal$$inline_353$$), $temp2$$inline_348$$ = 3 * ($colour$$inline_346$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_360$$ && 256 > $x$$inline_357$$;$pix$$inline_360$$++, $x$$inline_357$$ += 2) {
                    $colour$$inline_346$$ = $tile$$inline_359$$[$offset$$inline_361$$++], 0 == $colour$$inline_346$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$t$[$x$$inline_357$$] || ($temp$$inline_347$$ = 4 * ($x$$inline_357$$ + $row_precal$$inline_353$$), $temp2$$inline_348$$ = 3 * ($colour$$inline_346$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$ + 2]), 0 == $colour$$inline_346$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$t$[$x$$inline_357$$ + 1] || ($temp$$inline_347$$ = 4 * ($x$$inline_357$$ + $row_precal$$inline_353$$ + 1), $temp2$$inline_348$$ = 3 * ($colour$$inline_346$$ + 
                    16), $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_347$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_348$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_350$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$g$ |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$main$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[0] & 32)) {
              for($temp$$inline_307$$ = 4 * ($lineno$$inline_305$$ << 8), $temp2$$inline_308$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[7] & 15) + 16), $i$$inline_306$$ = 0;8 > $i$$inline_306$$;$i$$inline_306$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_307$$ + $i$$inline_306$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_308$$], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_307$$ + $i$$inline_306$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_308$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$temp$$inline_307$$ + $i$$inline_306$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp2$$inline_308$$ + 
                2]
              }
            }
          }else {
            for(var $row_precal$$inline_362$$ = $lineno$$inline_305$$ << 8, $length$$inline_363$$ = 4 * ($row_precal$$inline_362$$ + 1024), $temp$$inline_364$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$c$[7] & 15) + 16), $row_precal$$inline_362$$ = 4 * $row_precal$$inline_362$$;$row_precal$$inline_362$$ < $length$$inline_363$$;$row_precal$$inline_362$$ += 4) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$row_precal$$inline_362$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp$$inline_364$$], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$row_precal$$inline_362$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp$$inline_364$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$b$[$row_precal$$inline_362$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_304$$.$a$[$temp$$inline_364$$ + 
              2]
            }
          }
        }
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_366$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$vdp$, $lineno$$inline_367$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$;
      192 >= $lineno$$inline_367$$ ? (192 == $lineno$$inline_367$$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$g$ |= 128), 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$v$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$g$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$v$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$g$ & 
      4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$c$[0] & 16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$main$.$cpu$.$K$ = !0)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$g$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$c$[1] & 32) && 224 > $lineno$$inline_367$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_366$$.$main$.$cpu$.$K$ = 
      !0));
      if($JSCompiler_StaticMethods_eol$self$$inline_82$$.$K$) {
        var $JSCompiler_StaticMethods_interrupt$self$$inline_369$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$;
        $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$I$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$P$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$a$++, $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$P$ = !1), $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$I$ = $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$J$ = !1, $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$K$ = !1, $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$inline_369$$, 
        $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$a$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$R$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$a$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$S$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$S$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$S$, $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$o$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$R$ ? 
        ($JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$a$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$a$ = $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$p$(($JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$U$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$S$), $JSCompiler_StaticMethods_interrupt$self$$inline_369$$.$o$ -= 19))
      }
      $JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$++;
      if($JSCompiler_StaticMethods_eol$self$$inline_82$$.$lineno$ >= $JSCompiler_StaticMethods_eol$self$$inline_82$$.$main$.$no_of_scanlines$) {
        var $JSCompiler_StaticMethods_eof$self$$inline_371$$ = $JSCompiler_StaticMethods_eol$self$$inline_82$$;
        $JSCompiler_StaticMethods_eof$self$$inline_371$$.$main$.$pause_button$ && ($JSCompiler_StaticMethods_eof$self$$inline_371$$.$J$ = $JSCompiler_StaticMethods_eof$self$$inline_371$$.$I$, $JSCompiler_StaticMethods_eof$self$$inline_371$$.$I$ = !1, $JSCompiler_StaticMethods_eof$self$$inline_371$$.$P$ && ($JSCompiler_StaticMethods_eof$self$$inline_371$$.$a$++, $JSCompiler_StaticMethods_eof$self$$inline_371$$.$P$ = !1), $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_eof$self$$inline_371$$, 
        $JSCompiler_StaticMethods_eof$self$$inline_371$$.$a$), $JSCompiler_StaticMethods_eof$self$$inline_371$$.$a$ = 102, $JSCompiler_StaticMethods_eof$self$$inline_371$$.$o$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_371$$.$main$.$pause_button$ = !1);
        $JSCompiler_StaticMethods_eof$self$$inline_371$$.$main$.$a$.$writeFrame$();
        $JSCompiler_temp$$2$$ = !0
      }else {
        $JSCompiler_StaticMethods_eol$self$$inline_82$$.$o$ += $JSCompiler_StaticMethods_eol$self$$inline_82$$.$main$.$cyclesPerLine$, $JSCompiler_temp$$2$$ = !1
      }
    }
    if($JSCompiler_temp$$2$$) {
      break
    }
  }
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$instructions$:[]};
function $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_readRom16bit$self$$, $address$$12$$) {
  return $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$12$$ & 16383) ? $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14].getUint16($address$$12$$ & 16383, !0) : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14].getUint8($address$$12$$ & 16383) | $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$12$$ >> 14].getUint8($address$$12$$ & 16383) << 8 : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14][$address$$12$$ & 16383] & 
  255 | ($JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$12$$ >> 14][$address$$12$$ & 16383] & 255) << 8
}
function $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_readRom8bit$self$$, $address$$11$$) {
  return $SUPPORT_DATAVIEW$$ ? $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$11$$ >> 14].getUint8($address$$11$$ & 16383) : $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$11$$ >> 14][$address$$11$$ & 16383] & 255
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $index$$46$$, $address$$9_address$$inline_86$$) {
  var $opcodesArray$$inline_89_toHex$$3$$ = $JSSMS$Utils$toHex$$, $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_88$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_86$$, $code$$8_code$$inline_92$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $inst$$inline_90_operand$$2$$ = "", 
  $location$$28_offset$$16_toHex$$inline_87$$ = 0;
  $address$$9_address$$inline_86$$++;
  $location$$28_offset$$16_toHex$$inline_87$$ = 0;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_88$$ = "ADD " + $index$$46$$ + ",BC";
      $code$$8_code$$inline_92$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_88$$ = "ADD " + $index$$46$$ + ",DE";
      $code$$8_code$$inline_92$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getDE()));";
      break;
    case 33:
      $inst$$inline_90_operand$$2$$ = $opcodesArray$$inline_89_toHex$$3$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$));
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "," + $inst$$inline_90_operand$$2$$;
      $code$$8_code$$inline_92$$ = "this.set" + $index$$46$$ + "(" + $inst$$inline_90_operand$$2$$ + ");";
      $address$$9_address$$inline_86$$ += 2;
      break;
    case 34:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$inline_90_operand$$2$$ = $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $inst$$inline_90_operand$$2$$ + ")," + $index$$46$$;
      $code$$8_code$$inline_92$$ = "this.writeMem(" + $inst$$inline_90_operand$$2$$ + ", this." + $index$$46$$.toLowerCase() + "L);this.writeMem(" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$ + 1) + ", this." + $index$$46$$.toLowerCase() + "H);";
      $address$$9_address$$inline_86$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_88$$ = "INC " + $index$$46$$;
      $code$$8_code$$inline_92$$ = "this.inc" + $index$$46$$ + "();";
      break;
    case 36:
      $inst$$3_opcode$$inline_88$$ = "INC " + $index$$46$$ + "H *";
      break;
    case 37:
      $inst$$3_opcode$$inline_88$$ = "DEC " + $index$$46$$ + "H *";
      break;
    case 38:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H," + $opcodesArray$$inline_89_toHex$$3$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$)) + " *";
      $address$$9_address$$inline_86$$++;
      break;
    case 41:
      $inst$$3_opcode$$inline_88$$ = "ADD " + $index$$46$$ + "  " + $index$$46$$;
      break;
    case 42:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + " (" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.ixL = this.readMem(" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");this.ixH = this.readMem(" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$ + 1) + ");";
      $address$$9_address$$inline_86$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_88$$ = "DEC " + $index$$46$$;
      $code$$8_code$$inline_92$$ = "this.dec" + $index$$46$$ + "();";
      break;
    case 44:
      $inst$$3_opcode$$inline_88$$ = "INC " + $index$$46$$ + "L *";
      break;
    case 45:
      $inst$$3_opcode$$inline_88$$ = "DEC " + $index$$46$$ + "L *";
      break;
    case 46:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L," + $opcodesArray$$inline_89_toHex$$3$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$));
      $address$$9_address$$inline_86$$++;
      break;
    case 52:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "INC (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.incMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 53:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "DEC (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.decMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 54:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$inline_90_operand$$2$$ = $opcodesArray$$inline_89_toHex$$3$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$ + 1));
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")," + $inst$$inline_90_operand$$2$$;
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", " + $inst$$inline_90_operand$$2$$ + ");";
      $address$$9_address$$inline_86$$ += 2;
      break;
    case 57:
      $inst$$3_opcode$$inline_88$$ = "ADD " + $index$$46$$ + " SP";
      $code$$8_code$$inline_92$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_opcode$$inline_88$$ = "LD B," + $index$$46$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_88$$ = "LD B," + $index$$46$$ + "L *";
      break;
    case 70:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD B,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.b = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_88$$ = "LD C," + $index$$46$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_88$$ = "LD C," + $index$$46$$ + "L *";
      break;
    case 78:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD C,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.c = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_88$$ = "LD D," + $index$$46$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_88$$ = "LD D," + $index$$46$$ + "L *";
      break;
    case 86:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD D,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.d = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_88$$ = "LD E," + $index$$46$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_88$$ = "LD E," + $index$$46$$ + "L *";
      break;
    case 94:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD E,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.e = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 96:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H,B *";
      break;
    case 97:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H,C *";
      break;
    case 98:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H,D *";
      break;
    case 99:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H,E *";
      break;
    case 100:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "H*";
      break;
    case 101:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "L *";
      break;
    case 102:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD H,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.h = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 103:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "H,A *";
      break;
    case 104:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L,B *";
      break;
    case 105:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L,C *";
      break;
    case 106:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L,D *";
      break;
    case 107:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L,E *";
      break;
    case 108:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "H *";
      break;
    case 109:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "L *";
      $code$$8_code$$inline_92$$ = "";
      break;
    case 110:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD L,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.l = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_88$$ = "LD " + $index$$46$$ + "L,A *";
      $code$$8_code$$inline_92$$ = "this." + $index$$46$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),B";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.b);";
      $address$$9_address$$inline_86$$++;
      break;
    case 113:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),C";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.c);";
      $address$$9_address$$inline_86$$++;
      break;
    case 114:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),D";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.d);";
      $address$$9_address$$inline_86$$++;
      break;
    case 115:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),E";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.e);";
      $address$$9_address$$inline_86$$++;
      break;
    case 116:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),H";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.h);";
      $address$$9_address$$inline_86$$++;
      break;
    case 117:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),L";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.l);";
      $address$$9_address$$inline_86$$++;
      break;
    case 119:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "),A";
      $code$$8_code$$inline_92$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ", this.a);";
      $address$$9_address$$inline_86$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_88$$ = "LD A," + $index$$46$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_88$$ = "LD A," + $index$$46$$ + "L *";
      break;
    case 126:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "LD A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.a = this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ");";
      $address$$9_address$$inline_86$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_88$$ = "ADD A," + $index$$46$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_88$$ = "ADD A," + $index$$46$$ + "L *";
      break;
    case 134:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "ADD A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.add_a(this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "));";
      $address$$9_address$$inline_86$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_88$$ = "ADC A," + $index$$46$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_88$$ = "ADC A," + $index$$46$$ + "L *";
      break;
    case 142:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "ADC A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.adc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "));";
      $address$$9_address$$inline_86$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_88$$ = "SUB " + $index$$46$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_88$$ = "SUB " + $index$$46$$ + "L *";
      break;
    case 150:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "SUB A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.sub_a(this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "));";
      $address$$9_address$$inline_86$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_88$$ = "SBC A," + $index$$46$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_88$$ = "SBC A," + $index$$46$$ + "L *";
      break;
    case 158:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "SBC A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.sbc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "));";
      $address$$9_address$$inline_86$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_88$$ = "AND " + $index$$46$$ + "H *";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_opcode$$inline_88$$ = "AND " + $index$$46$$ + "L *";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 166:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "AND A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")] | F_HALFCARRY;";
      $address$$9_address$$inline_86$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_88$$ = "XOR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_opcode$$inline_88$$ = "XOR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 174:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "XOR A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")];";
      $address$$9_address$$inline_86$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_88$$ = "OR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_opcode$$inline_88$$ = "OR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 182:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "OR A,(" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")];";
      $address$$9_address$$inline_86$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_88$$ = "CP " + $index$$46$$ + "H *";
      $code$$8_code$$inline_92$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_opcode$$inline_88$$ = "CP " + $index$$46$$ + "L *";
      $code$$8_code$$inline_92$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 190:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $inst$$3_opcode$$inline_88$$ = "CP (" + $index$$46$$ + "+" + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + ")";
      $code$$8_code$$inline_92$$ = "this.cp_a(this.readMem(this.get" + $index$$46$$ + "() + " + $opcodesArray$$inline_89_toHex$$3$$($location$$28_offset$$16_toHex$$inline_87$$) + "));";
      $address$$9_address$$inline_86$$++;
      break;
    case 203:
      $location$$28_offset$$16_toHex$$inline_87$$ = $JSSMS$Utils$toHex$$;
      $inst$$3_opcode$$inline_88$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$);
      $opcodesArray$$inline_89_toHex$$3$$ = [$inst$$3_opcode$$inline_88$$];
      $inst$$inline_90_operand$$2$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$8_code$$inline_92$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$9_address$$inline_86$$++;
      $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ = "location = this.get" + $index$$46$$ + "() + " + $location$$28_offset$$16_toHex$$inline_87$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$, $address$$9_address$$inline_86$$)) + " & 0xFFFF;";
      switch($inst$$3_opcode$$inline_88$$) {
        case 0:
          $inst$$inline_90_operand$$2$$ = "LD B,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_90_operand$$2$$ = "LD C,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_90_operand$$2$$ = "LD D,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_90_operand$$2$$ = "LD E,RLC (" + $index$$46$$ + ")";
          break;
        case 4:
          $inst$$inline_90_operand$$2$$ = "LD H,RLC (" + $index$$46$$ + ")";
          break;
        case 5:
          $inst$$inline_90_operand$$2$$ = "LD L,RLC (" + $index$$46$$ + ")";
          break;
        case 6:
          $inst$$inline_90_operand$$2$$ = "RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_90_operand$$2$$ = "LD A,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_90_operand$$2$$ = "LD B,RRC (" + $index$$46$$ + ")";
          break;
        case 9:
          $inst$$inline_90_operand$$2$$ = "LD C,RRC (" + $index$$46$$ + ")";
          break;
        case 10:
          $inst$$inline_90_operand$$2$$ = "LD D,RRC (" + $index$$46$$ + ")";
          break;
        case 11:
          $inst$$inline_90_operand$$2$$ = "LD E,RRC (" + $index$$46$$ + ")";
          break;
        case 12:
          $inst$$inline_90_operand$$2$$ = "LD H,RRC (" + $index$$46$$ + ")";
          break;
        case 13:
          $inst$$inline_90_operand$$2$$ = "LD L,RRC (" + $index$$46$$ + ")";
          break;
        case 14:
          $inst$$inline_90_operand$$2$$ = "RRC (" + $index$$46$$ + ")";
          break;
        case 15:
          $inst$$inline_90_operand$$2$$ = "LD A,RRC (" + $index$$46$$ + ")";
          break;
        case 16:
          $inst$$inline_90_operand$$2$$ = "LD B,RL (" + $index$$46$$ + ")";
          break;
        case 17:
          $inst$$inline_90_operand$$2$$ = "LD C,RL (" + $index$$46$$ + ")";
          break;
        case 18:
          $inst$$inline_90_operand$$2$$ = "LD D,RL (" + $index$$46$$ + ")";
          break;
        case 19:
          $inst$$inline_90_operand$$2$$ = "LD E,RL (" + $index$$46$$ + ")";
          break;
        case 20:
          $inst$$inline_90_operand$$2$$ = "LD H,RL (" + $index$$46$$ + ")";
          break;
        case 21:
          $inst$$inline_90_operand$$2$$ = "LD L,RL (" + $index$$46$$ + ")";
          break;
        case 22:
          $inst$$inline_90_operand$$2$$ = "RL (" + $index$$46$$ + ")";
          break;
        case 23:
          $inst$$inline_90_operand$$2$$ = "LD A,RL (" + $index$$46$$ + ")";
          break;
        case 24:
          $inst$$inline_90_operand$$2$$ = "LD B,RR (" + $index$$46$$ + ")";
          break;
        case 25:
          $inst$$inline_90_operand$$2$$ = "LD C,RR (" + $index$$46$$ + ")";
          break;
        case 26:
          $inst$$inline_90_operand$$2$$ = "LD D,RR (" + $index$$46$$ + ")";
          break;
        case 27:
          $inst$$inline_90_operand$$2$$ = "LD E,RR (" + $index$$46$$ + ")";
          break;
        case 28:
          $inst$$inline_90_operand$$2$$ = "LD H,RR (" + $index$$46$$ + ")";
          break;
        case 29:
          $inst$$inline_90_operand$$2$$ = "LD L,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_90_operand$$2$$ = "RR (" + $index$$46$$ + ")";
          break;
        case 31:
          $inst$$inline_90_operand$$2$$ = "LD A,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_92$$ = $JSCompiler_StaticMethods_getIndex$self_location$$inline_93$$ + "this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 32:
          $inst$$inline_90_operand$$2$$ = "LD B,SLA (" + $index$$46$$ + ")";
          break;
        case 33:
          $inst$$inline_90_operand$$2$$ = "LD C,SLA (" + $index$$46$$ + ")";
          break;
        case 34:
          $inst$$inline_90_operand$$2$$ = "LD D,SLA (" + $index$$46$$ + ")";
          break;
        case 35:
          $inst$$inline_90_operand$$2$$ = "LD E,SLA (" + $index$$46$$ + ")";
          break;
        case 36:
          $inst$$inline_90_operand$$2$$ = "LD H,SLA (" + $index$$46$$ + ")";
          break;
        case 37:
          $inst$$inline_90_operand$$2$$ = "LD L,SLA (" + $index$$46$$ + ")";
          break;
        case 38:
          $inst$$inline_90_operand$$2$$ = "SLA (" + $index$$46$$ + ")";
          break;
        case 39:
          $inst$$inline_90_operand$$2$$ = "LD A,SLA (" + $index$$46$$ + ")";
          break;
        case 40:
          $inst$$inline_90_operand$$2$$ = "LD B,SRA (" + $index$$46$$ + ")";
          break;
        case 41:
          $inst$$inline_90_operand$$2$$ = "LD C,SRA (" + $index$$46$$ + ")";
          break;
        case 42:
          $inst$$inline_90_operand$$2$$ = "LD D,SRA (" + $index$$46$$ + ")";
          break;
        case 43:
          $inst$$inline_90_operand$$2$$ = "LD E,SRA (" + $index$$46$$ + ")";
          break;
        case 44:
          $inst$$inline_90_operand$$2$$ = "LD H,SRA (" + $index$$46$$ + ")";
          break;
        case 45:
          $inst$$inline_90_operand$$2$$ = "LD L,SRA (" + $index$$46$$ + ")";
          break;
        case 46:
          $inst$$inline_90_operand$$2$$ = "SRA (" + $index$$46$$ + ")";
          break;
        case 47:
          $inst$$inline_90_operand$$2$$ = "LD A,SRA (" + $index$$46$$ + ")";
          break;
        case 48:
          $inst$$inline_90_operand$$2$$ = "LD B,SLL (" + $index$$46$$ + ")";
          break;
        case 49:
          $inst$$inline_90_operand$$2$$ = "LD C,SLL (" + $index$$46$$ + ")";
          break;
        case 50:
          $inst$$inline_90_operand$$2$$ = "LD D,SLL (" + $index$$46$$ + ")";
          break;
        case 51:
          $inst$$inline_90_operand$$2$$ = "LD E,SLL (" + $index$$46$$ + ")";
          break;
        case 52:
          $inst$$inline_90_operand$$2$$ = "LD H,SLL (" + $index$$46$$ + ")";
          break;
        case 53:
          $inst$$inline_90_operand$$2$$ = "LD L,SLL (" + $index$$46$$ + ")";
          break;
        case 54:
          $inst$$inline_90_operand$$2$$ = "SLL (" + $index$$46$$ + ") *";
          break;
        case 55:
          $inst$$inline_90_operand$$2$$ = "LD A,SLL (" + $index$$46$$ + ")";
          break;
        case 56:
          $inst$$inline_90_operand$$2$$ = "LD B,SRL (" + $index$$46$$ + ")";
          break;
        case 57:
          $inst$$inline_90_operand$$2$$ = "LD C,SRL (" + $index$$46$$ + ")";
          break;
        case 58:
          $inst$$inline_90_operand$$2$$ = "LD D,SRL (" + $index$$46$$ + ")";
          break;
        case 59:
          $inst$$inline_90_operand$$2$$ = "LD E,SRL (" + $index$$46$$ + ")";
          break;
        case 60:
          $inst$$inline_90_operand$$2$$ = "LD H,SRL (" + $index$$46$$ + ")";
          break;
        case 61:
          $inst$$inline_90_operand$$2$$ = "LD L,SRL (" + $index$$46$$ + ")";
          break;
        case 62:
          $inst$$inline_90_operand$$2$$ = "SRL (" + $index$$46$$ + ")";
          break;
        case 63:
          $inst$$inline_90_operand$$2$$ = "LD A,SRL (" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "BIT 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "RES 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_90_operand$$2$$ = "SET 7,(" + $index$$46$$ + ")"
      }
      $address$$9_address$$inline_86$$++;
      $inst$$3_opcode$$inline_88$$ = $inst$$inline_90_operand$$2$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($opcodesArray$$inline_89_toHex$$3$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_88$$ = "POP " + $index$$46$$;
      $code$$8_code$$inline_92$$ = "this.set" + $index$$46$$ + "(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$3_opcode$$inline_88$$ = "EX SP,(" + $index$$46$$ + ")";
      $code$$8_code$$inline_92$$ = "temp = this.get" + $index$$46$$ + "();this.set" + $index$$46$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_opcode$$inline_88$$ = "PUSH " + $index$$46$$;
      $code$$8_code$$inline_92$$ = "this.push2(this." + $index$$46$$.toLowerCase() + "H, this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_opcode$$inline_88$$ = "JP (" + $index$$46$$ + ")";
      $code$$8_code$$inline_92$$ = "this.pc = this.get" + $index$$46$$ + "(); return;";
      $address$$9_address$$inline_86$$ = null;
      break;
    case 249:
      $inst$$3_opcode$$inline_88$$ = "LD SP," + $index$$46$$, $code$$8_code$$inline_92$$ = "this.sp = this.get" + $index$$46$$ + "();"
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_88$$, code:$code$$8_code$$inline_92$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_86$$}
}
function $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) {
  var $address$$inline_96_toHex$$1_toHex$$inline_105$$ = $JSSMS$Utils$toHex$$, $opcode$$6_options$$inline_115$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$), $opcodesArray_toHex$$inline_116$$ = [$opcode$$6_options$$inline_115$$], $inst_opcode$$inline_106_opcode$$inline_97$$ = "Unknown Opcode", $currAddr_defaultInstruction$$inline_117$$ = $address$$6$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = null, $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = 
  'throw "Unimplemented opcode ' + $address$$inline_96_toHex$$1_toHex$$inline_105$$($opcode$$6_options$$inline_115$$) + '";', $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "", $currAddr$$inline_100_currAddr$$inline_109_location$$26$$ = 0;
  $address$$6$$++;
  $_inst_inst$$inline_108_inst$$inline_99_operand$$ = {};
  switch($opcode$$6_options$$inline_115$$) {
    case 0:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "NOP";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 1:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD BC," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setBC(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 2:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (BC),A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getBC(), this.a);";
      break;
    case 3:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC BC";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.incBC();";
      break;
    case 4:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 7:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RLCA";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.rlca_a();";
      break;
    case 8:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "EX AF AF'";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.exAF();";
      break;
    case 9:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD HL,BC";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,(BC)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.readMem(this.getBC());";
      break;
    case 11:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC BC";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.decBC();";
      break;
    case 12:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 15:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RRCA";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.rrca_a();";
      break;
    case 16:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DJNZ (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b != 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 17:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD DE," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setDE(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 18:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (DE),A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getDE(), this.a);";
      break;
    case 19:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC DE";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.incDE();";
      break;
    case 20:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 23:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RLA";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.rla_a();";
      break;
    case 24:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JR (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      $address$$6$$ = null;
      break;
    case 25:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD HL,DE";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,(DE)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.readMem(this.getDE());";
      break;
    case 27:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC DE";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.decDE();";
      break;
    case 28:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 31:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RRA";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.rra_a();";
      break;
    case 32:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JR NZ,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if (!((this.f & F_ZERO) != 0x00)) {this.tstates -= 0x05;this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 33:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD HL," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 34:
      $currAddr$$inline_100_currAddr$$inline_109_location$$26$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($currAddr$$inline_100_currAddr$$inline_109_location$$26$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + "),HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ", this.l);this.writeMem(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($currAddr$$inline_100_currAddr$$inline_109_location$$26$$ + 1) + ", this.h);";
      $address$$6$$ += 2;
      break;
    case 35:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.incHL();";
      break;
    case 36:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 39:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DAA";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.daa();";
      break;
    case 40:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JR Z,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 41:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD HL,HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD HL,(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(this.readMemWord(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + "));";
      $address$$6$$ += 2;
      break;
    case 43:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.decHL();";
      break;
    case 44:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 47:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CPL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cpl_a();";
      break;
    case 48:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JR NC,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if (!((this.f & F_CARRY) != 0x00)) {this.tstates -= 0x05;this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 49:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD SP," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sp = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$ += 2;
      break;
    case 50:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + "),A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ", this.a);";
      $address$$6$$ += 2;
      break;
    case 51:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC SP";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sp++;";
      break;
    case 52:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC (HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC (HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL)," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$++;
      break;
    case 55:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SCF";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JR C,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 57:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD HL,SP";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.readMem(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 59:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC SP";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sp--;";
      break;
    case 60:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "INC A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DEC A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ";";
      $address$$6$$++;
      break;
    case 63:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CCF";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.ccf();";
      break;
    case 64:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 65:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.c;";
      break;
    case 66:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.d;";
      break;
    case 67:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.e;";
      break;
    case 68:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.h;";
      break;
    case 69:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.l;";
      break;
    case 70:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.readMem(this.getHL());";
      break;
    case 71:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD B,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.b = this.a;";
      break;
    case 72:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.b;";
      break;
    case 73:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 74:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.d;";
      break;
    case 75:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.e;";
      break;
    case 76:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.h;";
      break;
    case 77:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.l;";
      break;
    case 78:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.readMem(this.getHL());";
      break;
    case 79:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD C,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.c = this.a;";
      break;
    case 80:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.b;";
      break;
    case 81:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.c;";
      break;
    case 82:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 83:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.e;";
      break;
    case 84:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.h;";
      break;
    case 85:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.l;";
      break;
    case 86:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.readMem(this.getHL());";
      break;
    case 87:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD D,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.d = this.a;";
      break;
    case 88:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.b;";
      break;
    case 89:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.c;";
      break;
    case 90:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.d;";
      break;
    case 91:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 92:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.h;";
      break;
    case 93:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.l;";
      break;
    case 94:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.readMem(this.getHL());";
      break;
    case 95:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD E,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.e = this.a;";
      break;
    case 96:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.b;";
      break;
    case 97:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.c;";
      break;
    case 98:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.d;";
      break;
    case 99:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.e;";
      break;
    case 100:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 101:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.l;";
      break;
    case 102:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.readMem(this.getHL());";
      break;
    case 103:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD H,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.h = this.a;";
      break;
    case 104:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.b;";
      break;
    case 105:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.c;";
      break;
    case 106:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.d;";
      break;
    case 107:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.e;";
      break;
    case 108:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.h;";
      break;
    case 109:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 110:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.readMem(this.getHL());";
      break;
    case 111:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD L,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.l = this.a;";
      break;
    case 112:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.b);";
      break;
    case 113:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.c);";
      break;
    case 114:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.d);";
      break;
    case 115:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.e);";
      break;
    case 116:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.h);";
      break;
    case 117:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.l);";
      break;
    case 118:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "HALT";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.tstates = 0x00;" + ("this.halt = true; this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ - 1) + "; return;");
      break;
    case 119:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD (HL),A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.writeMem(this.getHL(), this.a);";
      break;
    case 120:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.b;";
      break;
    case 121:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.c;";
      break;
    case 122:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.d;";
      break;
    case 123:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.e;";
      break;
    case 124:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.h;";
      break;
    case 125:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.l;";
      break;
    case 126:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.readMem(this.getHL());";
      break;
    case 127:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "";
      break;
    case 128:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.b);";
      break;
    case 129:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.c);";
      break;
    case 130:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.d);";
      break;
    case 131:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.e);";
      break;
    case 132:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.h);";
      break;
    case 133:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.l);";
      break;
    case 134:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.readMem(this.getHL()));";
      break;
    case 135:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(this.a);";
      break;
    case 136:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.readMem(this.getHL()));";
      break;
    case 143:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.readMem(this.getHL()));";
      break;
    case 151:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.readMem(this.getHL()));";
      break;
    case 159:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
      break;
    case 175:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
      break;
    case 183:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,B";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,D";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,E";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,H";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,L";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,(HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.readMem(this.getHL()));";
      break;
    case 191:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP A,A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET NZ";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "POP BC";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP NZ,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) == 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 195:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      $address$$6$$ = null;
      break;
    case 196:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL NZ (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 197:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "PUSH BC";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADD A," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.add_a(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$++;
      break;
    case 199:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 0;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 200:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET Z";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.pc = this.readMemWord(this.sp); this.sp += 0x02; return;";
      $address$$6$$ = null;
      break;
    case 202:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP Z,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) != 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 203:
      var $address$$inline_96_toHex$$1_toHex$$inline_105$$ = $address$$6$$, $inst_opcode$$inline_106_opcode$$inline_97$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_96_toHex$$1_toHex$$inline_105$$), $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = [$inst_opcode$$inline_106_opcode$$inline_97$$], $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "Unimplemented 0xCB prefixed opcode", $currAddr$$inline_100_currAddr$$inline_109_location$$26$$ = 
      $address$$inline_96_toHex$$1_toHex$$inline_105$$, $code$$inline_101_target$$inline_110$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
      $address$$inline_96_toHex$$1_toHex$$inline_105$$++;
      switch($inst_opcode$$inline_106_opcode$$inline_97$$) {
        case 0:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.rlc(this.b);";
          break;
        case 1:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.rlc(this.c);";
          break;
        case 2:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.rlc(this.d);";
          break;
        case 3:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.rlc(this.e);";
          break;
        case 4:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.rlc(this.h);";
          break;
        case 5:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.rlc(this.l);";
          break;
        case 6:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
          break;
        case 7:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLC A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.rlc(this.a);";
          break;
        case 8:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.rrc(this.b);";
          break;
        case 9:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.rrc(this.c);";
          break;
        case 10:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.rrc(this.d);";
          break;
        case 11:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.rrc(this.e);";
          break;
        case 12:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.rrc(this.h);";
          break;
        case 13:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.rrc(this.l);";
          break;
        case 14:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
          break;
        case 15:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRC A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.rrc(this.a);";
          break;
        case 16:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.rl(this.b);";
          break;
        case 17:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.rl(this.c);";
          break;
        case 18:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.rl(this.d);";
          break;
        case 19:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.rl(this.e);";
          break;
        case 20:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.rl(this.h);";
          break;
        case 21:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.rl(this.l);";
          break;
        case 22:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
          break;
        case 23:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RL A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.rl(this.a);";
          break;
        case 24:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.rr(this.b);";
          break;
        case 25:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.rr(this.c);";
          break;
        case 26:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.rr(this.d);";
          break;
        case 27:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.rr(this.e);";
          break;
        case 28:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.rr(this.h);";
          break;
        case 29:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.rr(this.l);";
          break;
        case 30:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
          break;
        case 31:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RR A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.rr(this.a);";
          break;
        case 32:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.sla(this.b);";
          break;
        case 33:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.sla(this.c);";
          break;
        case 34:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.sla(this.d);";
          break;
        case 35:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.sla(this.e);";
          break;
        case 36:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.sla(this.h);";
          break;
        case 37:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.sla(this.l);";
          break;
        case 38:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
          break;
        case 39:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLA A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.sla(this.a);";
          break;
        case 40:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.sra(this.b);";
          break;
        case 41:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.sra(this.c);";
          break;
        case 42:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.sra(this.d);";
          break;
        case 43:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.sra(this.e);";
          break;
        case 44:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.sra(this.h);";
          break;
        case 45:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.sra(this.l);";
          break;
        case 46:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
          break;
        case 47:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRA A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.sra(this.a);";
          break;
        case 48:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.sll(this.b);";
          break;
        case 49:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.sll(this.c);";
          break;
        case 50:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.sll(this.d);";
          break;
        case 51:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.sll(this.e);";
          break;
        case 52:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.sll(this.h);";
          break;
        case 53:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.sll(this.l);";
          break;
        case 54:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
          break;
        case 55:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SLL A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.sll(this.a);";
          break;
        case 56:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL B";
          $code$$inline_101_target$$inline_110$$ = "this.b = this.srl(this.b);";
          break;
        case 57:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL C";
          $code$$inline_101_target$$inline_110$$ = "this.c = this.srl(this.c);";
          break;
        case 58:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL D";
          $code$$inline_101_target$$inline_110$$ = "this.d = this.srl(this.d);";
          break;
        case 59:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL E";
          $code$$inline_101_target$$inline_110$$ = "this.e = this.srl(this.e);";
          break;
        case 60:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL H";
          $code$$inline_101_target$$inline_110$$ = "this.h = this.srl(this.h);";
          break;
        case 61:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL L";
          $code$$inline_101_target$$inline_110$$ = "this.l = this.srl(this.l);";
          break;
        case 62:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL (HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
          break;
        case 63:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SRL A";
          $code$$inline_101_target$$inline_110$$ = "this.a = this.srl(this.a);";
          break;
        case 64:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_0);";
          break;
        case 65:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_0);";
          break;
        case 66:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_0);";
          break;
        case 67:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_0);";
          break;
        case 68:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_0);";
          break;
        case 69:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_0);";
          break;
        case 70:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
          break;
        case 71:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 0,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_0);";
          break;
        case 72:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_1);";
          break;
        case 73:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_1);";
          break;
        case 74:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_1);";
          break;
        case 75:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_1);";
          break;
        case 76:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_1);";
          break;
        case 77:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_1);";
          break;
        case 78:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
          break;
        case 79:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 1,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_1);";
          break;
        case 80:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_2);";
          break;
        case 81:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_2);";
          break;
        case 82:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_2);";
          break;
        case 83:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_2);";
          break;
        case 84:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_2);";
          break;
        case 85:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_2);";
          break;
        case 86:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
          break;
        case 87:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 2,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_2);";
          break;
        case 88:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_3);";
          break;
        case 89:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_3);";
          break;
        case 90:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_3);";
          break;
        case 91:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_3);";
          break;
        case 92:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_3);";
          break;
        case 93:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_3);";
          break;
        case 94:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
          break;
        case 95:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 3,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_3);";
          break;
        case 96:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_4);";
          break;
        case 97:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_4);";
          break;
        case 98:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_4);";
          break;
        case 99:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_4);";
          break;
        case 100:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_4);";
          break;
        case 101:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_4);";
          break;
        case 102:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
          break;
        case 103:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 4,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_4);";
          break;
        case 104:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_5);";
          break;
        case 105:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_5);";
          break;
        case 106:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_5);";
          break;
        case 107:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_5);";
          break;
        case 108:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_5);";
          break;
        case 109:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_5);";
          break;
        case 110:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
          break;
        case 111:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 5,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_5);";
          break;
        case 112:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_6);";
          break;
        case 113:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_6);";
          break;
        case 114:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_6);";
          break;
        case 115:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_6);";
          break;
        case 116:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_6);";
          break;
        case 117:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_6);";
          break;
        case 118:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
          break;
        case 119:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 6,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_6);";
          break;
        case 120:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,B";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.b & BIT_7);";
          break;
        case 121:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,C";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.c & BIT_7);";
          break;
        case 122:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,D";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.d & BIT_7);";
          break;
        case 123:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,E";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.e & BIT_7);";
          break;
        case 124:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,H";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.h & BIT_7);";
          break;
        case 125:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,L";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.l & BIT_7);";
          break;
        case 126:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
          break;
        case 127:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "BIT 7,A";
          $code$$inline_101_target$$inline_110$$ = "this.bit(this.a & BIT_7);";
          break;
        case 128:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,B";
          $code$$inline_101_target$$inline_110$$ = "this.b &= ~BIT_0;";
          break;
        case 129:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,C";
          $code$$inline_101_target$$inline_110$$ = "this.c &= ~BIT_0;";
          break;
        case 130:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,D";
          $code$$inline_101_target$$inline_110$$ = "this.d &= ~BIT_0;";
          break;
        case 131:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,E";
          $code$$inline_101_target$$inline_110$$ = "this.e &= ~BIT_0;";
          break;
        case 132:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,H";
          $code$$inline_101_target$$inline_110$$ = "this.h &= ~BIT_0;";
          break;
        case 133:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,L";
          $code$$inline_101_target$$inline_110$$ = "this.l &= ~BIT_0;";
          break;
        case 134:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
          break;
        case 135:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 0,A";
          $code$$inline_101_target$$inline_110$$ = "this.a &= ~BIT_0;";
          break;
        case 136:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,B";
          break;
        case 137:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,C";
          break;
        case 138:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,D";
          break;
        case 139:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,E";
          break;
        case 140:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,H";
          break;
        case 141:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,L";
          break;
        case 142:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
          break;
        case 143:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 1,A";
          break;
        case 144:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,B";
          break;
        case 145:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,C";
          break;
        case 146:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,D";
          break;
        case 147:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,E";
          break;
        case 148:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,H";
          break;
        case 149:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,L";
          break;
        case 150:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
          break;
        case 151:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 2,A";
          break;
        case 152:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,B";
          break;
        case 153:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,C";
          break;
        case 154:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,D";
          break;
        case 155:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,E";
          break;
        case 156:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,H";
          break;
        case 157:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,L";
          break;
        case 158:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
          break;
        case 159:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 3,A";
          $code$$inline_101_target$$inline_110$$ = "this.a &= ~BIT_3;";
          break;
        case 160:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,B";
          break;
        case 161:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,C";
          break;
        case 162:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,D";
          break;
        case 163:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,E";
          break;
        case 164:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,H";
          break;
        case 165:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,L";
          break;
        case 166:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
          break;
        case 167:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 4,A";
          $code$$inline_101_target$$inline_110$$ = "this.a &= ~BIT_4;";
          break;
        case 168:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,B";
          break;
        case 169:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,C";
          break;
        case 170:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,D";
          break;
        case 171:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,E";
          break;
        case 172:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,H";
          break;
        case 173:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,L";
          break;
        case 174:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
          break;
        case 175:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 5,A";
          break;
        case 176:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,B";
          break;
        case 177:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,C";
          break;
        case 178:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,D";
          break;
        case 179:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,E";
          break;
        case 180:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,H";
          break;
        case 181:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,L";
          break;
        case 182:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
          break;
        case 183:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 6,A";
          $code$$inline_101_target$$inline_110$$ = "this.a &= ~BIT_6;";
          break;
        case 184:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,B";
          $code$$inline_101_target$$inline_110$$ = "this.b &= ~BIT_7;";
          break;
        case 185:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,C";
          $code$$inline_101_target$$inline_110$$ = "this.c &= ~BIT_7;";
          break;
        case 186:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,D";
          $code$$inline_101_target$$inline_110$$ = "this.d &= ~BIT_7;";
          break;
        case 187:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,E";
          $code$$inline_101_target$$inline_110$$ = "this.e &= ~BIT_7;";
          break;
        case 188:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,H";
          $code$$inline_101_target$$inline_110$$ = "this.h &= ~BIT_7;";
          break;
        case 189:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,L";
          $code$$inline_101_target$$inline_110$$ = "this.l &= ~BIT_7;";
          break;
        case 190:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
          break;
        case 191:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RES 7,A";
          $code$$inline_101_target$$inline_110$$ = "this.a &= ~BIT_7;";
          break;
        case 192:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,B";
          $code$$inline_101_target$$inline_110$$ = "this.b |= BIT_0;";
          break;
        case 193:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,C";
          $code$$inline_101_target$$inline_110$$ = "this.c |= BIT_0;";
          break;
        case 194:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,D";
          $code$$inline_101_target$$inline_110$$ = "this.d |= BIT_0;";
          break;
        case 195:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,E";
          $code$$inline_101_target$$inline_110$$ = "this.e |= BIT_0;";
          break;
        case 196:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,H";
          $code$$inline_101_target$$inline_110$$ = "this.h |= BIT_0;";
          break;
        case 197:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,L";
          $code$$inline_101_target$$inline_110$$ = "this.l |= BIT_0;";
          break;
        case 198:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
          break;
        case 199:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 0,A";
          $code$$inline_101_target$$inline_110$$ = "this.a |= BIT_0;";
          break;
        case 200:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,B";
          break;
        case 201:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,C";
          break;
        case 202:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,D";
          break;
        case 203:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,E";
          break;
        case 204:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,H";
          break;
        case 205:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,L";
          break;
        case 206:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
          break;
        case 207:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 1,A";
          break;
        case 208:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,B";
          break;
        case 209:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,C";
          break;
        case 210:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,D";
          break;
        case 211:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,E";
          break;
        case 212:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,H";
          break;
        case 213:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,L";
          break;
        case 214:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
          break;
        case 215:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 2,A";
          break;
        case 216:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,B";
          break;
        case 217:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,C";
          break;
        case 218:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,D";
          break;
        case 219:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,E";
          break;
        case 220:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,H";
          break;
        case 221:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,L";
          break;
        case 222:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
          break;
        case 223:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 3,A";
          break;
        case 224:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,B";
          break;
        case 225:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,C";
          break;
        case 226:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,D";
          break;
        case 227:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,E";
          break;
        case 228:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,H";
          break;
        case 229:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,L";
          break;
        case 230:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
          break;
        case 231:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 4,A";
          $code$$inline_101_target$$inline_110$$ = "this.a |= BIT_4;";
          break;
        case 232:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,B";
          break;
        case 233:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,C";
          break;
        case 234:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,D";
          break;
        case 235:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,E";
          break;
        case 236:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,H";
          break;
        case 237:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,L";
          break;
        case 238:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
          break;
        case 239:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 5,A";
          $code$$inline_101_target$$inline_110$$ = "this.a |= BIT_5;";
          break;
        case 240:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,B";
          $code$$inline_101_target$$inline_110$$ = "this.b |= BIT_6;";
          break;
        case 241:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,C";
          $code$$inline_101_target$$inline_110$$ = "this.c |= BIT_6;";
          break;
        case 242:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,D";
          $code$$inline_101_target$$inline_110$$ = "this.d |= BIT_6;";
          break;
        case 243:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,E";
          $code$$inline_101_target$$inline_110$$ = "this.e |= BIT_6;";
          break;
        case 244:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,H";
          $code$$inline_101_target$$inline_110$$ = "this.h |= BIT_6;";
          break;
        case 245:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,L";
          $code$$inline_101_target$$inline_110$$ = "this.l |= BIT_6;";
          break;
        case 246:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
          break;
        case 247:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 6,A";
          $code$$inline_101_target$$inline_110$$ = "this.a |= BIT_6;";
          break;
        case 248:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,B";
          $code$$inline_101_target$$inline_110$$ = "this.b |= BIT_7;";
          break;
        case 249:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,C";
          $code$$inline_101_target$$inline_110$$ = "this.c |= BIT_7;";
          break;
        case 250:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,D";
          $code$$inline_101_target$$inline_110$$ = "this.d |= BIT_7;";
          break;
        case 251:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,E";
          $code$$inline_101_target$$inline_110$$ = "this.e |= BIT_7;";
          break;
        case 252:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,H";
          $code$$inline_101_target$$inline_110$$ = "this.h |= BIT_7;";
          break;
        case 253:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,L";
          $code$$inline_101_target$$inline_110$$ = "this.l |= BIT_7;";
          break;
        case 254:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,(HL)";
          $code$$inline_101_target$$inline_110$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
          break;
        case 255:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SET 7,A", $code$$inline_101_target$$inline_110$$ = "this.a |= BIT_7;"
      }
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = {$opcode$:$inst_opcode$$inline_106_opcode$$inline_97$$, $opcodes$:$code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$, $inst$:$_inst_inst$$inline_108_inst$$inline_99_operand$$, code:$code$$inline_101_target$$inline_110$$, $address$:$currAddr$$inline_100_currAddr$$inline_109_location$$26$$, $nextAddress$:$address$$inline_96_toHex$$1_toHex$$inline_105$$};
      $inst_opcode$$inline_106_opcode$$inline_97$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.code;
      $opcodesArray_toHex$$inline_116$$ = $opcodesArray_toHex$$inline_116$$.concat($_inst_inst$$inline_108_inst$$inline_99_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$nextAddress$;
      break;
    case 204:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL Z (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 205:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      $address$$6$$ += 2;
      break;
    case 206:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "ADC ," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.adc_a(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$++;
      break;
    case 207:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 8;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 208:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET NC";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "POP DE";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP NC,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) == 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 211:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OUT (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($_inst_inst$$inline_108_inst$$inline_99_operand$$) + "),A";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.port.out(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_108_inst$$inline_99_operand$$) + ", this.a);";
      $address$$6$$++;
      break;
    case 212:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL NC (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 213:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "PUSH DE";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SUB " + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sub_a(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$++;
      break;
    case 215:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 16;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 216:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET C";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "EXX";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP C,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) != 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 219:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "IN A,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($_inst_inst$$inline_108_inst$$inline_99_operand$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.a = this.port.in_(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_108_inst$$inline_99_operand$$) + ");";
      $address$$6$$++;
      break;
    case 220:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL C (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 221:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IX", $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.code;
      $opcodesArray_toHex$$inline_116$$ = $opcodesArray_toHex$$inline_116$$.concat($_inst_inst$$inline_108_inst$$inline_99_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$nextAddress$;
      break;
    case 222:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "SBC A," + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sbc_a(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$++;
      break;
    case 223:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 24;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 224:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET PO";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "POP HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP PO,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_PARITY) == 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 227:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "EX (SP),HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "temp = this.h;this.h = this.readMem(this.sp + 0x01);this.writeMem(this.sp + 0x01, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
      break;
    case 228:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL PO (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 229:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "PUSH HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "AND (" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + "] | F_HALFCARRY;";
      $address$$6$$++;
      break;
    case 231:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 32;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 232:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET PE";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP (HL)";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.pc = this.getHL(); return;";
      $address$$6$$ = null;
      break;
    case 234:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP PE,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_PARITY) != 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 235:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "EX DE,HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL PE (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 237:
      var $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $address$$6$$, $address$$inline_96_toHex$$1_toHex$$inline_105$$ = $JSSMS$Utils$toHex$$, $inst_opcode$$inline_106_opcode$$inline_97$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$), $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = [$inst_opcode$$inline_106_opcode$$inline_97$$], $_inst_inst$$inline_108_inst$$inline_99_operand$$ = 
      "Unimplemented 0xED prefixed opcode", $currAddr$$inline_100_currAddr$$inline_109_location$$26$$ = $address$$inline_104_hexOpcodes$$inline_119_target$$46$$, $code$$inline_101_target$$inline_110$$ = null, $code$$inline_111$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_112$$ = "", $location$$inline_113$$ = 0;
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$++;
      switch($inst_opcode$$inline_106_opcode$$inline_97$$) {
        case 64:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN B,(C)";
          $code$$inline_111$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
          break;
        case 65:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),B";
          $code$$inline_111$$ = "this.port.out(this.c, this.b);";
          break;
        case 66:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SBC HL,BC";
          $code$$inline_111$$ = "this.sbc16(this.getBC());";
          break;
        case 67:
          $location$$inline_113$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$);
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD (" + $operand$$inline_112$$ + "),BC";
          $code$$inline_111$$ = "this.writeMem(" + $operand$$inline_112$$ + ", this.c);this.writeMem(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$ + 1) + ", this.b);";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
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
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "NEG";
          $code$$inline_111$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RETN / RETI";
          $code$$inline_111$$ = "this.pc = this.readMemWord(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = null;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IM 0";
          $code$$inline_111$$ = "this.im = 0x00;";
          break;
        case 71:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD I,A";
          $code$$inline_111$$ = "this.i = this.a;";
          break;
        case 72:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN C,(C)";
          $code$$inline_111$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
          break;
        case 73:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),C";
          $code$$inline_111$$ = "this.port.out(this.c, this.c);";
          break;
        case 74:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "ADC HL,BC";
          $code$$inline_111$$ = "this.adc16(this.getBC());";
          break;
        case 75:
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$));
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD BC,(" + $operand$$inline_112$$ + ")";
          $code$$inline_111$$ = "this.setBC(this.readMemWord(" + $operand$$inline_112$$ + "));";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 79:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD R,A";
          $code$$inline_111$$ = "this.r = this.a;";
          break;
        case 80:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN D,(C)";
          $code$$inline_111$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
          break;
        case 81:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),D";
          $code$$inline_111$$ = "this.port.out(this.c, this.d);";
          break;
        case 82:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SBC HL,DE";
          $code$$inline_111$$ = "this.sbc16(this.getDE());";
          break;
        case 83:
          $location$$inline_113$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$);
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD (" + $operand$$inline_112$$ + "),DE";
          $code$$inline_111$$ = "this.writeMem(" + $operand$$inline_112$$ + ", this.e);this.writeMem(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$ + 1) + ", this.d);";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 86:
        ;
        case 118:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IM 1";
          $code$$inline_111$$ = "this.im = 0x01;";
          break;
        case 87:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD A,I";
          $code$$inline_111$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
          break;
        case 88:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN E,(C)";
          $code$$inline_111$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
          break;
        case 89:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),E";
          $code$$inline_111$$ = "this.port.out(this.c, this.e);";
          break;
        case 90:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "ADC HL,DE";
          $code$$inline_111$$ = "this.adc16(this.getDE());";
          break;
        case 91:
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$));
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD DE,(" + $operand$$inline_112$$ + ")";
          $code$$inline_111$$ = "this.setDE(this.readMemWord(" + $operand$$inline_112$$ + "));";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 95:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD A,R";
          $code$$inline_111$$ = "this.a = JSSMS.Utils.rndInt(0xFF);this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
          break;
        case 96:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN H,(C)";
          $code$$inline_111$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
          break;
        case 97:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),H";
          $code$$inline_111$$ = "this.port.out(this.c, this.h);";
          break;
        case 98:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SBC HL,HL";
          $code$$inline_111$$ = "this.sbc16(this.getHL());";
          break;
        case 99:
          $location$$inline_113$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$);
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD (" + $operand$$inline_112$$ + "),HL";
          $code$$inline_111$$ = "this.writeMem(" + $operand$$inline_112$$ + ", this.l);this.writeMem(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$ + 1) + ", this.h);";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 103:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RRD";
          $code$$inline_111$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 104:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN L,(C)";
          $code$$inline_111$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
          break;
        case 105:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),L";
          $code$$inline_111$$ = "this.port.out(this.c, this.l);";
          break;
        case 106:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "ADC HL,HL";
          $code$$inline_111$$ = "this.adc16(this.getHL());";
          break;
        case 107:
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$));
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD HL,(" + $operand$$inline_112$$ + ")";
          $code$$inline_111$$ = "this.setHL(this.readMemWord(" + $operand$$inline_112$$ + "));";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 111:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "RLD";
          $code$$inline_111$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 113:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),0";
          $code$$inline_111$$ = "this.port.out(this.c, 0);";
          break;
        case 114:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "SBC HL,SP";
          $code$$inline_111$$ = "this.sbc16(this.sp);";
          break;
        case 115:
          $location$$inline_113$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$);
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD (" + $operand$$inline_112$$ + "),SP";
          $code$$inline_111$$ = "this.writeMem(" + $operand$$inline_112$$ + ", this.sp & 0xFF);this.writeMem(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($location$$inline_113$$ + 1) + ", this.sp >> 8);";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 120:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IN A,(C)";
          $code$$inline_111$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 121:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUT (C),A";
          $code$$inline_111$$ = "this.port.out(this.c, this.a);";
          break;
        case 122:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "ADC HL,SP";
          $code$$inline_111$$ = "this.adc16(this.sp);";
          break;
        case 123:
          $operand$$inline_112$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$));
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LD SP,(" + $operand$$inline_112$$ + ")";
          $code$$inline_111$$ = "this.sp = this.readMemWord(" + $operand$$inline_112$$ + ");";
          $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ += 2;
          break;
        case 160:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LDI";
          $code$$inline_111$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();this.f = this.f & 0xC1 | (this.getBC() != 0x00 ? F_PARITY : 0x00);";
          break;
        case 161:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "CPI";
          $code$$inline_111$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
          break;
        case 162:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "INI";
          $code$$inline_111$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 163:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUTI";
          $code$$inline_111$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 168:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LDD";
          break;
        case 169:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "CPD";
          break;
        case 170:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "IND";
          $code$$inline_111$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 171:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OUTD";
          $code$$inline_111$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 176:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LDIR";
          $code$$inline_111$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();for (;this.getBC() != 0x00; this.f |= F_PARITY, this.tstates -= 5) {this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();}if (!(this.getBC() != 0x00)) {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
          break;
        case 177:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "CPIR";
          $code$$inline_111$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);for (;(temp & F_PARITY) != 0x00 && (this.f & F_ZERO) == 0x00; this.tstates -= 5) {temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);}";
          $code$$inline_111$$ += "this.f = (this.f & 0xF8) | temp;";
          break;
        case 178:
          $code$$inline_101_target$$inline_110$$ = $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ - 2;
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "INIR";
          $code$$inline_111$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 179:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OTIR";
          $code$$inline_111$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();for (;this.b != 0x00; this.tstates -= 5) {temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();}";
          $code$$inline_111$$ += "if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 184:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "LDDR";
          break;
        case 185:
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "CPDR";
          break;
        case 186:
          $code$$inline_101_target$$inline_110$$ = $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ - 2;
          $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "INDR";
          $code$$inline_111$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 187:
          $code$$inline_101_target$$inline_110$$ = $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ - 2, $_inst_inst$$inline_108_inst$$inline_99_operand$$ = "OTDR", $code$$inline_111$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}"
      }
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = {$opcode$:$inst_opcode$$inline_106_opcode$$inline_97$$, $opcodes$:$code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$, $inst$:$_inst_inst$$inline_108_inst$$inline_99_operand$$, code:$code$$inline_111$$, $address$:$currAddr$$inline_100_currAddr$$inline_109_location$$26$$, $nextAddress$:$address$$inline_104_hexOpcodes$$inline_119_target$$46$$, target:$code$$inline_101_target$$inline_110$$};
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.target;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.code;
      $opcodesArray_toHex$$inline_116$$ = $opcodesArray_toHex$$inline_116$$.concat($_inst_inst$$inline_108_inst$$inline_99_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$nextAddress$;
      break;
    case 238:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "XOR " + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + "];";
      $address$$6$$++;
      break;
    case 239:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 40;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 240:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET P";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "POP AF";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.setAF(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP P,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_SIGN) == 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 243:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "DI";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL P (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 245:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "PUSH AF";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "OR " + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + "];";
      $address$$6$$++;
      break;
    case 247:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 48;
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$);
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + "; return;";
      break;
    case 248:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "RET M";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "LD SP,HL";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "JP M,(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_SIGN) != 0x00) {this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 251:
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "EI";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CALL M (" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$ + 2) + ");this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 253:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IY", $address$$6$$);
      $inst_opcode$$inline_106_opcode$$inline_97$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.code;
      $opcodesArray_toHex$$inline_116$$ = $opcodesArray_toHex$$inline_116$$.concat($_inst_inst$$inline_108_inst$$inline_99_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_108_inst$$inline_99_operand$$.$nextAddress$;
      break;
    case 254:
      $_inst_inst$$inline_108_inst$$inline_99_operand$$ = $address$$inline_96_toHex$$1_toHex$$inline_105$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $inst_opcode$$inline_106_opcode$$inline_97$$ = "CP " + $_inst_inst$$inline_108_inst$$inline_99_operand$$;
      $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.cp_a(" + $_inst_inst$$inline_108_inst$$inline_99_operand$$ + ");";
      $address$$6$$++;
      break;
    case 255:
      $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = 56, $inst_opcode$$inline_106_opcode$$inline_97$$ = "RST " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$), $code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$ = "this.push1(" + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$6$$) + "); this.pc = " + $address$$inline_96_toHex$$1_toHex$$inline_105$$($address$$inline_104_hexOpcodes$$inline_119_target$$46$$) + 
      "; return;"
  }
  var $opcode$$6_options$$inline_115$$ = {$opcode$:$opcode$$6_options$$inline_115$$, $opcodes$:$opcodesArray_toHex$$inline_116$$, $inst$:$inst_opcode$$inline_106_opcode$$inline_97$$, code:$code$$5_opcodesArray$$inline_107_opcodesArray$$inline_98$$, $address$:$currAddr_defaultInstruction$$inline_117$$, $nextAddress$:$address$$6$$, target:$address$$inline_104_hexOpcodes$$inline_119_target$$46$$}, $opcodesArray_toHex$$inline_116$$ = $JSSMS$Utils$toHex$$, $currAddr_defaultInstruction$$inline_117$$ = 
  {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""}, $prop$$inline_118$$, $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = "";
  for($prop$$inline_118$$ in $currAddr_defaultInstruction$$inline_117$$) {
    void 0 != $opcode$$6_options$$inline_115$$[$prop$$inline_118$$] && ($currAddr_defaultInstruction$$inline_117$$[$prop$$inline_118$$] = $opcode$$6_options$$inline_115$$[$prop$$inline_118$$])
  }
  $currAddr_defaultInstruction$$inline_117$$.$hexAddress$ = $opcodesArray_toHex$$inline_116$$($currAddr_defaultInstruction$$inline_117$$.$address$);
  $currAddr_defaultInstruction$$inline_117$$.$opcodes$.length && ($address$$inline_104_hexOpcodes$$inline_119_target$$46$$ = $currAddr_defaultInstruction$$inline_117$$.$opcodes$.map($opcodesArray_toHex$$inline_116$$).join(" ") + " ");
  $currAddr_defaultInstruction$$inline_117$$.label = $currAddr_defaultInstruction$$inline_117$$.$hexAddress$ + " " + $address$$inline_104_hexOpcodes$$inline_119_target$$46$$ + $currAddr_defaultInstruction$$inline_117$$.$inst$;
  return $currAddr_defaultInstruction$$inline_117$$
}
function $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_parseInstructions$self$$) {
  window.console.time("Instructions parsing");
  var $romSize$$ = 16384 * $JSCompiler_StaticMethods_parseInstructions$self$$.$rom$.length, $instruction$$, $currentAddress$$, $i$$8$$ = 0, $addresses$$ = [], $entryPoints$$ = [0, 56, 102];
  for($entryPoints$$.forEach(function($entryPoint$$) {
    $addresses$$.push($entryPoint$$)
  });$addresses$$.length;) {
    $currentAddress$$ = $addresses$$.shift(), $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$currentAddress$$] || ($currentAddress$$ >= $romSize$$ || 65 <= $currentAddress$$ >> 10 ? $JSSMS$Utils$console$log$$("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$)) : ($instruction$$ = $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_parseInstructions$self$$, $currentAddress$$), $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$currentAddress$$] = 
    $instruction$$, null != $instruction$$.$nextAddress$ && $addresses$$.push($instruction$$.$nextAddress$), null != $instruction$$.target && $addresses$$.push($instruction$$.target)))
  }
  for($entryPoints$$.forEach(function($entryPoint$$1$$) {
    this.$instructions$[$entryPoint$$1$$] && (this.$instructions$[$entryPoint$$1$$].$isJumpTarget$ = !0)
  }, $JSCompiler_StaticMethods_parseInstructions$self$$);$i$$8$$ < $romSize$$;$i$$8$$++) {
    $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$] && (null != $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].$nextAddress$ && $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].$nextAddress$] && $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].$nextAddress$].$jumpTargetNb$++, 
    null != $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].target && ($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].target] ? ($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].target].$isJumpTarget$ = !0, $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].target].$jumpTargetNb$++) : 
    $JSSMS$Utils$console$log$$("Invalid target address", $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$8$$].target))))
  }
  window.console.timeEnd("Instructions parsing")
}
;function $JSSMS$Keyboard$$($sms$$1$$) {
  this.$main$ = $sms$$1$$;
  this.$ggstart$ = this.$a$ = this.$controller1$ = 0
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$ggstart$ = this.$a$ = this.$controller1$ = 255;
  this.$pause_button$ = !1
}, keydown:function $$JSSMS$Keyboard$$$$keydown$($evt$$16$$) {
  switch($evt$$16$$.keyCode) {
    case 38:
      this.$controller1$ &= -2;
      break;
    case 40:
      this.$controller1$ &= -3;
      break;
    case 37:
      this.$controller1$ &= -5;
      break;
    case 39:
      this.$controller1$ &= -9;
      break;
    case 88:
      this.$controller1$ &= -17;
      break;
    case 90:
      this.$controller1$ &= -33;
      break;
    case 13:
      this.$main$.$is_sms$ ? this.$main$.$pause_button$ = !0 : this.$ggstart$ &= -129;
      break;
    case 104:
      this.$a$ &= -2;
      break;
    case 98:
      this.$a$ &= -3;
      break;
    case 100:
      this.$a$ &= -5;
      break;
    case 102:
      this.$a$ &= -9;
      break;
    case 103:
      this.$a$ &= -17;
      break;
    case 105:
      this.$a$ &= -33;
      break;
    case 97:
      this.$a$ &= -65;
      break;
    default:
      return
  }
  $evt$$16$$.preventDefault()
}, keyup:function $$JSSMS$Keyboard$$$$keyup$($evt$$17$$) {
  switch($evt$$17$$.keyCode) {
    case 38:
      this.$controller1$ |= 1;
      break;
    case 40:
      this.$controller1$ |= 2;
      break;
    case 37:
      this.$controller1$ |= 4;
      break;
    case 39:
      this.$controller1$ |= 8;
      break;
    case 88:
      this.$controller1$ |= 16;
      break;
    case 90:
      this.$controller1$ |= 32;
      break;
    case 13:
      this.$main$.$is_sms$ || (this.$ggstart$ |= 128);
      break;
    case 104:
      this.$a$ |= 1;
      break;
    case 98:
      this.$a$ |= 2;
      break;
    case 100:
      this.$a$ |= 4;
      break;
    case 102:
      this.$a$ |= 8;
      break;
    case 103:
      this.$a$ |= 16;
      break;
    case 105:
      this.$a$ |= 32;
      break;
    case 97:
      this.$a$ |= 64;
      break;
    default:
      return
  }
  $evt$$17$$.preventDefault()
}};
var $NO_ANTIALIAS$$ = Number.MIN_VALUE, $PSG_VOLUME$$ = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0];
function $JSSMS$SN76489$$($sms$$2$$) {
  this.$main$ = $sms$$2$$;
  this.$g$ = this.$n$ = 0;
  this.$b$ = Array(8);
  this.$c$ = 0;
  this.$a$ = Array(4);
  this.$f$ = Array(4);
  this.$i$ = Array(3);
  this.$j$ = 16;
  this.$h$ = 32768;
  this.$m$ = Array(4)
}
$JSSMS$SN76489$$.prototype = {};
function $JSSMS$Vdp$$($i$$inline_126_i$$inline_129_sms$$3$$) {
  this.$main$ = $i$$inline_126_i$$inline_129_sms$$3$$;
  var $i$$13_r$$inline_130$$ = 0;
  this.$N$ = 0;
  this.$f$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$13_r$$inline_130$$ = 0;96 > $i$$13_r$$inline_130$$;$i$$13_r$$inline_130$$++) {
    this.$a$[$i$$13_r$$inline_130$$] = 255
  }
  this.$c$ = Array(16);
  this.$g$ = 0;
  this.$n$ = !1;
  this.$v$ = this.$p$ = this.$M$ = this.$F$ = this.$h$ = this.$m$ = 0;
  this.$t$ = Array(256);
  this.$J$ = 0;
  this.$b$ = $i$$inline_126_i$$inline_129_sms$$3$$.$a$.$canvasImageData$.data;
  this.$T$ = Array(64);
  this.$S$ = Array(64);
  this.$R$ = Array(64);
  this.$Q$ = Array(256);
  this.$P$ = Array(256);
  this.$O$ = Array(16);
  this.$i$ = this.$K$ = this.$G$ = 0;
  this.$j$ = !1;
  this.$q$ = Array(192);
  for($i$$13_r$$inline_130$$ = 0;192 > $i$$13_r$$inline_130$$;$i$$13_r$$inline_130$$++) {
    this.$q$[$i$$13_r$$inline_130$$] = Array(25)
  }
  this.$I$ = Array(512);
  this.$w$ = Array(512);
  for($i$$inline_126_i$$inline_129_sms$$3$$ = this.$o$ = this.$s$ = 0;512 > $i$$inline_126_i$$inline_129_sms$$3$$;$i$$inline_126_i$$inline_129_sms$$3$$++) {
    this.$I$[$i$$inline_126_i$$inline_129_sms$$3$$] = Array(64)
  }
  var $g$$inline_131$$, $b$$inline_132$$;
  for($i$$inline_126_i$$inline_129_sms$$3$$ = 0;64 > $i$$inline_126_i$$inline_129_sms$$3$$;$i$$inline_126_i$$inline_129_sms$$3$$++) {
    $i$$13_r$$inline_130$$ = $i$$inline_126_i$$inline_129_sms$$3$$ & 3, $g$$inline_131$$ = $i$$inline_126_i$$inline_129_sms$$3$$ >> 2 & 3, $b$$inline_132$$ = $i$$inline_126_i$$inline_129_sms$$3$$ >> 4 & 3, this.$T$[$i$$inline_126_i$$inline_129_sms$$3$$] = 85 * $i$$13_r$$inline_130$$ & 255, this.$S$[$i$$inline_126_i$$inline_129_sms$$3$$] = 85 * $g$$inline_131$$ & 255, this.$R$[$i$$inline_126_i$$inline_129_sms$$3$$] = 85 * $b$$inline_132$$ & 255
  }
  for($i$$inline_126_i$$inline_129_sms$$3$$ = 0;256 > $i$$inline_126_i$$inline_129_sms$$3$$;$i$$inline_126_i$$inline_129_sms$$3$$++) {
    $g$$inline_131$$ = $i$$inline_126_i$$inline_129_sms$$3$$ & 15, $b$$inline_132$$ = $i$$inline_126_i$$inline_129_sms$$3$$ >> 4 & 15, this.$Q$[$i$$inline_126_i$$inline_129_sms$$3$$] = ($g$$inline_131$$ << 4 | $g$$inline_131$$) & 255, this.$P$[$i$$inline_126_i$$inline_129_sms$$3$$] = ($b$$inline_132$$ << 4 | $b$$inline_132$$) & 255
  }
  for($i$$inline_126_i$$inline_129_sms$$3$$ = 0;16 > $i$$inline_126_i$$inline_129_sms$$3$$;$i$$inline_126_i$$inline_129_sms$$3$$++) {
    this.$O$[$i$$inline_126_i$$inline_129_sms$$3$$] = ($i$$inline_126_i$$inline_129_sms$$3$$ << 4 | $i$$inline_126_i$$inline_129_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$14$$;
  this.$n$ = !0;
  for($i$$14$$ = this.$F$ = this.$g$ = this.$v$ = this.$h$ = 0;16 > $i$$14$$;$i$$14$$++) {
    this.$c$[$i$$14$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$main$.$cpu$.$K$ = !1;
  this.$j$ = !0;
  this.$s$ = 512;
  this.$o$ = -1;
  for($i$$14$$ = 0;16384 > $i$$14$$;$i$$14$$++) {
    this.$f$[$i$$14$$] = 0
  }
  for($i$$14$$ = 0;196608 > $i$$14$$;$i$$14$$ += 4) {
    this.$b$[$i$$14$$] = 0, this.$b$[$i$$14$$ + 1] = 0, this.$b$[$i$$14$$ + 2] = 0, this.$b$[$i$$14$$ + 3] = 255
  }
}};
function $JSCompiler_StaticMethods_forceFullRedraw$$($JSCompiler_StaticMethods_forceFullRedraw$self$$) {
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$J$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$c$[2] & 14) << 10;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$s$ = 0;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$o$ = 511;
  for(var $i$$15$$ = 0, $l$$ = $JSCompiler_StaticMethods_forceFullRedraw$self$$.$w$.length;$i$$15$$ < $l$$;$i$$15$$++) {
    $JSCompiler_StaticMethods_forceFullRedraw$self$$.$w$[$i$$15$$] = !0
  }
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$i$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$c$[5] & -130) << 7;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$j$ = !0
}
;function $JSSMS$DummyUI$$($sms$$4$$) {
  this.$main$ = $sms$$4$$;
  this.reset = function $this$reset$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  };
  this.$canvasImageData$ = {data:[]}
}
window.$ && ($.fn.JSSMSUI = function $$$fn$JSSMSUI$($roms$$) {
  function $UI$$($root_sms$$5$$) {
    this.$main$ = $root_sms$$5$$;
    if("[object OperaMini]" == Object.prototype.toString.call(window.operamini)) {
      $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>')
    }else {
      var $self$$2$$ = this;
      $root_sms$$5$$ = $("<div></div>");
      var $screenContainer$$ = $('<div id="screen"></div>'), $gamepadContainer$$ = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>'), $controls$$ = $('<div id="controls"></div>'), $fullscreenSupport$$ = $JSSMS$Utils$getPrefix$$(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), 
      $requestAnimationFramePrefix_startButton$$ = $JSSMS$Utils$getPrefix$$(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame"], window), $i$$22$$;
      if($requestAnimationFramePrefix_startButton$$) {
        this.requestAnimationFrame = window[$requestAnimationFramePrefix_startButton$$].bind(window)
      }else {
        var $lastTime$$ = 0;
        this.requestAnimationFrame = function $this$requestAnimationFrame$($callback$$54$$) {
          var $currTime$$ = $JSSMS$Utils$getTimestamp$$(), $timeToCall$$ = Math.max(0, 16 - ($currTime$$ - $lastTime$$));
          window.setTimeout(function() {
            $callback$$54$$($currTime$$ + $timeToCall$$)
          }, $timeToCall$$);
          $lastTime$$ = $currTime$$ + $timeToCall$$
        }
      }
      this.screen = $("<canvas width=256 height=192 moz-opaque></canvas>");
      this.$canvasContext$ = this.screen[0].getContext("2d");
      this.$canvasContext$.webkitImageSmoothingEnabled = !1;
      this.$canvasContext$.mozImageSmoothingEnabled = !1;
      this.$canvasContext$.imageSmoothingEnabled = !1;
      if(this.$canvasContext$.getImageData) {
        this.$canvasImageData$ = this.$canvasContext$.getImageData(0, 0, 256, 192);
        this.$gamepad$ = {$u$:{$e$:$(".up", $gamepadContainer$$), $k$:1}, $r$:{$e$:$(".right", $gamepadContainer$$), $k$:8}, $d$:{$e$:$(".down", $gamepadContainer$$), $k$:2}, $l$:{$e$:$(".left", $gamepadContainer$$), $k$:4}, 1:{$e$:$(".fire1", $gamepadContainer$$), $k$:16}, 2:{$e$:$(".fire2", $gamepadContainer$$), $k$:32}};
        $requestAnimationFramePrefix_startButton$$ = $(".start", $gamepadContainer$$);
        this.$romContainer$ = $('<div id="romSelector"></div>');
        this.$romSelect$ = $("<select></select>").change(function() {
          $self$$2$$.$loadROM$()
        });
        this.buttons = Object.create(null);
        this.buttons.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">').click(function() {
          $self$$2$$.$main$.$isRunning$ ? ($self$$2$$.$main$.stop(), $self$$2$$.updateStatus("Paused"), $self$$2$$.buttons.start.attr("value", "Start")) : ($self$$2$$.$main$.start(), $self$$2$$.buttons.start.attr("value", "Pause"))
        });
        this.buttons.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">').click(function() {
          "" != $self$$2$$.$main$.$romData$ && "" != $self$$2$$.$main$.$romFileName$ && $JSCompiler_StaticMethods_readRomDirectly$$($self$$2$$.$main$, $self$$2$$.$main$.$romData$, $self$$2$$.$main$.$romFileName$) ? ($self$$2$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$2$$.$main$.$vdp$), $self$$2$$.$main$.start()) : $(this).attr("disabled", "disabled")
        });
        this.$dissambler$ = $('<div id="dissambler"></div>');
        $($parent$$2$$).after(this.$dissambler$);
        this.buttons.$nextStep$ = $('<input type="button" value="Next step" class="btn" disabled="disabled">').click(function() {
          $self$$2$$.$main$.$nextStep$()
        });
        this.$main$.$soundEnabled$ && (this.buttons.$sound$ = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').click(function() {
          $self$$2$$.$main$.$soundEnabled$ ? ($self$$2$$.$main$.$soundEnabled$ = !1, $self$$2$$.buttons.$sound$.attr("value", "Enable sound")) : ($self$$2$$.$main$.$soundEnabled$ = !0, $self$$2$$.buttons.$sound$.attr("value", "Disable sound"))
        }));
        $fullscreenSupport$$ ? this.buttons.$fullscreen$ = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
          var $screen$$1$$ = $screenContainer$$[0];
          $screen$$1$$.requestFullscreen ? $screen$$1$$.requestFullscreen() : $screen$$1$$.mozRequestFullScreen ? $screen$$1$$.mozRequestFullScreen() : $screen$$1$$.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }) : (this.$zoomed$ = !1, this.buttons.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">').click(function() {
          $self$$2$$.$zoomed$ ? ($self$$2$$.screen.animate({width:"256px", height:"192px"}, function() {
            $(this).removeAttr("style")
          }), $self$$2$$.buttons.zoom.attr("value", "Zoom in")) : ($self$$2$$.screen.animate({width:"512px", height:"384px"}), $self$$2$$.buttons.zoom.attr("value", "Zoom out"));
          $self$$2$$.$zoomed$ = !$self$$2$$.$zoomed$
        }));
        for($i$$22$$ in this.buttons) {
          this.buttons[$i$$22$$].appendTo($controls$$)
        }
        this.log = $('<div id="status"></div>');
        this.screen.appendTo($screenContainer$$);
        $gamepadContainer$$.appendTo($screenContainer$$);
        $screenContainer$$.appendTo($root_sms$$5$$);
        this.$romContainer$.appendTo($root_sms$$5$$);
        $controls$$.appendTo($root_sms$$5$$);
        this.log.appendTo($root_sms$$5$$);
        $root_sms$$5$$.appendTo($($parent$$2$$));
        void 0 != $roms$$ && this.$setRoms$($roms$$);
        $(document).bind("keydown", function($evt$$18$$) {
          $self$$2$$.$main$.$keyboard$.keydown($evt$$18$$)
        }).bind("keyup", function($evt$$19$$) {
          $self$$2$$.$main$.$keyboard$.keyup($evt$$19$$)
        });
        for($i$$22$$ in this.$gamepad$) {
          this.$gamepad$[$i$$22$$].$e$.on("mousedown touchstart", function($key$$18$$) {
            return function($evt$$20$$) {
              $self$$2$$.$main$.$keyboard$.$controller1$ &= ~$key$$18$$;
              $evt$$20$$.preventDefault()
            }
          }(this.$gamepad$[$i$$22$$].$k$)).on("mouseup touchend", function($key$$19$$) {
            return function($evt$$21$$) {
              $self$$2$$.$main$.$keyboard$.$controller1$ |= $key$$19$$;
              $evt$$21$$.preventDefault()
            }
          }(this.$gamepad$[$i$$22$$].$k$))
        }
        $requestAnimationFramePrefix_startButton$$.on("mousedown touchstart", function($evt$$22$$) {
          $self$$2$$.$main$.$is_sms$ ? $self$$2$$.$main$.$pause_button$ = !0 : $self$$2$$.$main$.$keyboard$.$ggstart$ &= -129;
          $evt$$22$$.preventDefault()
        }).on("mouseup touchend", function($evt$$23$$) {
          $self$$2$$.$main$.$is_sms$ || ($self$$2$$.$main$.$keyboard$.$ggstart$ |= 128);
          $evt$$23$$.preventDefault()
        })
      }else {
        $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>')
      }
    }
  }
  var $parent$$2$$ = this;
  $UI$$.prototype = {reset:function $$UI$$$$reset$() {
    this.screen[0].width = 256;
    this.screen[0].height = 192;
    this.log.empty();
    this.$dissambler$.empty()
  }, $setRoms$:function $$UI$$$$$setRoms$$($roms$$1$$) {
    var $groupName$$, $optgroup$$, $length$$19$$, $i$$23$$, $count$$7$$ = 0;
    this.$romSelect$.children().remove();
    $("<option>Select a ROM...</option>").appendTo(this.$romSelect$);
    for($groupName$$ in $roms$$1$$) {
      if($roms$$1$$.hasOwnProperty($groupName$$)) {
        $optgroup$$ = $("<optgroup></optgroup>").attr("label", $groupName$$);
        $length$$19$$ = $roms$$1$$[$groupName$$].length;
        for($i$$23$$ = 0;$i$$23$$ < $length$$19$$;$i$$23$$++) {
          $("<option>" + $roms$$1$$[$groupName$$][$i$$23$$][0] + "</option>").attr("value", $roms$$1$$[$groupName$$][$i$$23$$][1]).appendTo($optgroup$$)
        }
        $optgroup$$.appendTo(this.$romSelect$)
      }
      $count$$7$$++
    }
    $count$$7$$ && this.$romSelect$.appendTo(this.$romContainer$)
  }, $loadROM$:function $$UI$$$$$loadROM$$() {
    var $self$$3$$ = this;
    this.updateStatus("Downloading...");
    $.ajax({url:escape(this.$romSelect$.val()), xhr:function() {
      var $xhr$$ = $.ajaxSettings.xhr();
      void 0 != $xhr$$.overrideMimeType && $xhr$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$3$$.xhr = $xhr$$
    }, complete:function($xhr$$1$$, $status$$) {
      var $data$$32$$;
      "error" == $status$$ ? $self$$3$$.updateStatus("The selected ROM file could not be loaded.") : ($data$$32$$ = $xhr$$1$$.responseText, $self$$3$$.$main$.stop(), $JSCompiler_StaticMethods_readRomDirectly$$($self$$3$$.$main$, $data$$32$$, $self$$3$$.$romSelect$.val()), $self$$3$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$3$$.$main$.$vdp$), $self$$3$$.enable())
    }})
  }, enable:function $$UI$$$$enable$() {
    this.buttons.start.removeAttr("disabled");
    this.buttons.start.attr("value", "Start");
    this.buttons.reset.removeAttr("disabled");
    this.buttons.$nextStep$.removeAttr("disabled");
    this.$main$.$soundEnabled$ && (this.buttons.$sound$ ? this.buttons.$sound$.attr("value", "Disable sound") : this.buttons.$sound$.attr("value", "Enable sound"))
  }, updateStatus:function $$UI$$$$updateStatus$($s$$3$$) {
    this.log.text($s$$3$$)
  }, $writeFrame$:function() {
    var $hiddenPrefix$$ = $JSSMS$Utils$getPrefix$$(["hidden", "mozHidden", "webkitHidden", "msHidden"]);
    return $hiddenPrefix$$ ? function() {
      document[$hiddenPrefix$$] || this.$canvasContext$.putImageData(this.$canvasImageData$, 0, 0)
    } : function() {
      this.$canvasContext$.putImageData(this.$canvasImageData$, 0, 0)
    }
  }(), $updateDisassembly$:function $$UI$$$$$updateDisassembly$$($currentAddress$$1$$) {
    for(var $instructions$$ = this.$main$.$cpu$.$instructions$, $length$$20$$ = $instructions$$.length, $html$$ = "", $i$$24$$ = 8 > $currentAddress$$1$$ ? 0 : $currentAddress$$1$$ - 8, $num$$4$$ = 0;16 > $num$$4$$ && $i$$24$$ <= $length$$20$$;$i$$24$$++) {
      $instructions$$[$i$$24$$] && ($html$$ += "<div" + ($instructions$$[$i$$24$$].$address$ == $currentAddress$$1$$ ? ' class="current"' : "") + ">" + $instructions$$[$i$$24$$].$hexAddress$ + ($instructions$$[$i$$24$$].$isJumpTarget$ ? ":" : " ") + "<code>" + $instructions$$[$i$$24$$].$inst$ + "</code></div>", $num$$4$$++)
    }
    this.$dissambler$.html($html$$)
  }};
  return $UI$$
});
function $JSSMS$Ports$$($sms$$6$$) {
  this.$main$ = $sms$$6$$;
  this.$vdp$ = $sms$$6$$.$vdp$;
  this.$b$ = $sms$$6$$.$b$;
  this.$keyboard$ = $sms$$6$$.$keyboard$;
  this.$a$ = []
}
$JSSMS$Ports$$.prototype = {reset:function $$JSSMS$Ports$$$$reset$() {
  this.$a$ = Array(2)
}};
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_in_$self$$, $port$$3$$) {
  if($JSCompiler_StaticMethods_in_$self$$.$main$.$is_gg$ && 7 > $port$$3$$) {
    switch($port$$3$$) {
      case 0:
        return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$ggstart$ & 191 | 64;
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
  switch($port$$3$$ & 193) {
    case 64:
      var $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$N$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$p$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$p$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$p$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$p$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$p$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$n$ = !0;
      var $statuscopy$$inline_209_value$$inline_206$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$M$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$M$ = $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$f$[$JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$h$++ & 
      16383] & 255;
      return $statuscopy$$inline_209_value$$inline_206$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$, $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$n$ = !0, $statuscopy$$inline_209_value$$inline_206$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$g$, 
      $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$g$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_208_JSCompiler_StaticMethods_dataRead$self$$inline_205_JSCompiler_StaticMethods_getVCount$self$$inline_203_JSCompiler_inline_result$$7$$.$main$.$cpu$.$K$ = !1, $statuscopy$$inline_209_value$$inline_206$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$a$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$a$[0] | $JSCompiler_StaticMethods_in_$self$$.$a$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$, $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$, $reg$$inline_219_value$$80$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$)) {
    switch($address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[0] = ($reg$$inline_219_value$$80$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[1] = $reg$$inline_219_value$$80$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$vdp$;
        $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$n$ = !0;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$F$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ & 16383;
            if($reg$$inline_219_value$$80$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$] & 255)) {
              if($address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$ && $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$j$ = !0
              }else {
                if($address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$ + 128 && $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$j$ = !0
                }else {
                  var $tileIndex$$inline_215$$ = $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$w$[$tileIndex$$inline_215$$] = !0;
                  $tileIndex$$inline_215$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$s$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$s$ = $tileIndex$$inline_215$$);
                  $tileIndex$$inline_215$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$o$ = $tileIndex$$inline_215$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$] = $reg$$inline_219_value$$80$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$T$[$reg$$inline_219_value$$80$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$S$[$reg$$inline_219_value$$80$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$R$[$reg$$inline_219_value$$80$$]) : 
            ($address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$Q$[$reg$$inline_219_value$$80$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$P$[$reg$$inline_219_value$$80$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$O$[$reg$$inline_219_value$$80$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$n$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$n$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$ = $reg$$inline_219_value$$80$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ & 16128 | $reg$$inline_219_value$$80$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$n$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$F$ = $reg$$inline_219_value$$80$$ >> 6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$ | $reg$$inline_219_value$$80$$ << 8, 0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$F$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$M$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$F$) {
              $reg$$inline_219_value$$80$$ &= 15;
              switch($reg$$inline_219_value$$80$$) {
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$g$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$K$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_219_value$$80$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$j$ = !0);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$J$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$ & -130) << 7, $address$$inline_214_old$$inline_220_port$$2_temp$$inline_213$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$i$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$j$ = !0)
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_219_value$$80$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$m$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$, 0 != ($reg$$inline_219_value$$80$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_219_value$$80$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_219_value$$80$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_219_value$$80$$ & 63) << 4 : 
          $reg$$inline_219_value$$80$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$j$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_222_JSCompiler_StaticMethods_controlWrite$self$$inline_217_JSCompiler_StaticMethods_dataWrite$self$$inline_211_JSCompiler_StaticMethods_out$self$$.$h$ = 
              32768
          }
        }
    }
  }
}
;var $Bytecode$$ = function() {
  function $Bytecode$$1$$($address$$16$$, $page$$) {
    this.$address$ = $address$$16$$;
    this.page = $page$$;
    this.$opcode$ = [];
    this.target = this.$nextAddress$ = this.$operand$ = null;
    this.$isJumpTarget$ = this.$canEnd$ = this.$isFunctionEnder$ = !1;
    this.$ast$ = null
  }
  var $toHex$$6$$ = $JSSMS$Utils$toHex$$;
  $Bytecode$$1$$.prototype = {get $hexOpcode$() {
    return this.$opcode$.length ? this.$opcode$.map($toHex$$6$$).join(" ") : ""
  }, get label() {
    var $name$$58$$ = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, $toHex$$6$$(this.target || this.$operand$ || 0)) : "";
    return $toHex$$6$$(this.$address$ + 16384 * this.page) + " " + this.$hexOpcode$ + " " + $name$$58$$
  }};
  return $Bytecode$$1$$
}();
var $Parser$$ = function() {
  function $parser$$($rom$$1$$, $frameReg$$) {
    this.$c$ = new $RomStream$$($rom$$1$$);
    this.$frameReg$ = $frameReg$$;
    this.$a$ = Array($rom$$1$$.length);
    this.$entryPoints$ = [];
    this.$instructions$ = Array($rom$$1$$.length);
    this.$f$ = [];
    for(var $i$$25$$ = 0;$i$$25$$ < $rom$$1$$.length;$i$$25$$++) {
      this.$a$[$i$$25$$] = [], this.$instructions$[$i$$25$$] = [], this.$f$[$i$$25$$] = []
    }
  }
  function $disassemble$$($bytecode$$, $stream$$) {
    $stream$$.page = $bytecode$$.page;
    $stream$$.$RomStream_prototype$seek$($bytecode$$.$address$ + 16384 * $stream$$.page);
    var $opcode$$13_opcode$$inline_227_opcode$$inline_231$$ = $stream$$.getUint8(), $operand$$3_operand$$inline_232$$ = null, $target$$48_target$$inline_233$$ = null, $isFunctionEnder_isFunctionEnder$$inline_234$$ = !1, $canEnd_canEnd$$inline_235$$ = !1;
    $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_227_opcode$$inline_231$$);
    switch($opcode$$13_opcode$$inline_227_opcode$$inline_231$$) {
      case 0:
        break;
      case 1:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
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
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 15:
        break;
      case 16:
        $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 17:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 23:
        break;
      case 24:
        $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
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
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 31:
        break;
      case 32:
        $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 33:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
        break;
      case 34:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 39:
        break;
      case 40:
        $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 41:
        break;
      case 42:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 47:
        break;
      case 48:
        $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 49:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
        break;
      case 50:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
        break;
      case 51:
        break;
      case 52:
        break;
      case 53:
        break;
      case 54:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 55:
        break;
      case 56:
        $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 57:
        break;
      case 58:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
        break;
      case 59:
        break;
      case 60:
        break;
      case 61:
        break;
      case 62:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
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
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
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
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 193:
        break;
      case 194:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 195:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 196:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 197:
        break;
      case 198:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 199:
        $target$$48_target$$inline_233$$ = 0;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 200:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 201:
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 202:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 203:
        return $opcode$$13_opcode$$inline_227_opcode$$inline_231$$ = $stream$$.getUint8(), $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_227_opcode$$inline_231$$), $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$, $bytecode$$;
      case 204:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 205:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 206:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 207:
        $target$$48_target$$inline_233$$ = 8;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 208:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 209:
        break;
      case 210:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 211:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 212:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 213:
        break;
      case 214:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 215:
        $target$$48_target$$inline_233$$ = 16;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 216:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 217:
        break;
      case 218:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 219:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 220:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 221:
        return $getIndex$$($bytecode$$, $stream$$);
      case 222:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 223:
        $target$$48_target$$inline_233$$ = 24;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 224:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 225:
        break;
      case 226:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 227:
        break;
      case 228:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 229:
        break;
      case 230:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 231:
        $target$$48_target$$inline_233$$ = 32;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 232:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 233:
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 234:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 235:
        break;
      case 236:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 237:
        $opcode$$13_opcode$$inline_227_opcode$$inline_231$$ = $stream$$.getUint8();
        $target$$48_target$$inline_233$$ = $operand$$3_operand$$inline_232$$ = null;
        $canEnd_canEnd$$inline_235$$ = $isFunctionEnder_isFunctionEnder$$inline_234$$ = !1;
        $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_227_opcode$$inline_231$$);
        switch($opcode$$13_opcode$$inline_227_opcode$$inline_231$$) {
          case 64:
            break;
          case 65:
            break;
          case 66:
            break;
          case 67:
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
            $stream$$.$RomStream_prototype$seek$(null);
            $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
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
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
            break;
          case 111:
            break;
          case 113:
            break;
          case 114:
            break;
          case 115:
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
            break;
          case 120:
            break;
          case 121:
            break;
          case 122:
            break;
          case 123:
            $operand$$3_operand$$inline_232$$ = $stream$$.getUint16();
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
            $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_235$$ = !0;
            break;
          case 177:
            $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_235$$ = !0;
            break;
          case 178:
            $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_235$$ = !0;
            break;
          case 179:
            $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_235$$ = !0;
            break;
          case 184:
            break;
          case 185:
            break;
          case 186:
            $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_235$$ = !0;
            break;
          case 187:
            $target$$48_target$$inline_233$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_235$$ = !0;
            break;
          default:
            $JSSMS$Utils$console$error$$("Unexpected opcode", "0xED " + $JSSMS$Utils$toHex$$($opcode$$13_opcode$$inline_227_opcode$$inline_231$$))
        }
        $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$;
        $bytecode$$.$operand$ = $operand$$3_operand$$inline_232$$;
        $bytecode$$.target = $target$$48_target$$inline_233$$;
        $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_234$$;
        $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_235$$;
        return $bytecode$$;
      case 238:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 239:
        $target$$48_target$$inline_233$$ = 40;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 240:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 241:
        break;
      case 242:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 243:
        break;
      case 244:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 245:
        break;
      case 246:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 247:
        $target$$48_target$$inline_233$$ = 48;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      case 248:
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 249:
        break;
      case 250:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 251:
        break;
      case 252:
        $target$$48_target$$inline_233$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_235$$ = !0;
        break;
      case 253:
        return $getIndex$$($bytecode$$, $stream$$);
      case 254:
        $operand$$3_operand$$inline_232$$ = $stream$$.getUint8();
        break;
      case 255:
        $target$$48_target$$inline_233$$ = 56;
        $isFunctionEnder_isFunctionEnder$$inline_234$$ = !0;
        break;
      default:
        $JSSMS$Utils$console$error$$("Unexpected opcode", $JSSMS$Utils$toHex$$($opcode$$13_opcode$$inline_227_opcode$$inline_231$$))
    }
    $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$;
    $bytecode$$.$operand$ = $operand$$3_operand$$inline_232$$;
    $bytecode$$.target = $target$$48_target$$inline_233$$;
    $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_234$$;
    $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_235$$;
    return $bytecode$$
  }
  function $getIndex$$($bytecode$$3$$, $stream$$3$$) {
    var $opcode$$16_opcode$$inline_239$$ = $stream$$3$$.getUint8(), $operand$$5_operand$$inline_240$$ = null, $isFunctionEnder$$2$$ = !1;
    $bytecode$$3$$.$opcode$.push($opcode$$16_opcode$$inline_239$$);
    switch($opcode$$16_opcode$$inline_239$$) {
      case 9:
        break;
      case 25:
        break;
      case 33:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint16();
        break;
      case 34:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 41:
        break;
      case 42:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 52:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 53:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 54:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint16();
        break;
      case 57:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
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
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
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
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 111:
        break;
      case 112:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 113:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 114:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 115:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 116:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 117:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 119:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8();
        break;
      case 203:
        return $opcode$$16_opcode$$inline_239$$ = $stream$$3$$.getUint8(), $operand$$5_operand$$inline_240$$ = $stream$$3$$.getUint8(), $bytecode$$3$$.$opcode$.push($opcode$$16_opcode$$inline_239$$), $bytecode$$3$$.$nextAddress$ = $stream$$3$$.$RomStream_prototype$position$, $bytecode$$3$$.$operand$ = $operand$$5_operand$$inline_240$$, $bytecode$$3$$;
      case 225:
        break;
      case 227:
        break;
      case 229:
        break;
      case 233:
        $stream$$3$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder$$2$$ = !0;
        break;
      case 249:
        break;
      default:
        $JSSMS$Utils$console$error$$("Unexpected opcode", "0xDD/0xFD " + $JSSMS$Utils$toHex$$($opcode$$16_opcode$$inline_239$$))
    }
    $bytecode$$3$$.$nextAddress$ = $stream$$3$$.$RomStream_prototype$position$;
    $bytecode$$3$$.$operand$ = $operand$$5_operand$$inline_240$$;
    $bytecode$$3$$.$isFunctionEnder$ = $isFunctionEnder$$2$$;
    return $bytecode$$3$$
  }
  function $RomStream$$($rom$$) {
    this.$rom$ = $rom$$;
    this.$a$ = null;
    this.page = 0
  }
  $parser$$.prototype = {$addEntryPoint$:function $$parser$$$$$addEntryPoint$$($obj$$36$$) {
    this.$entryPoints$.push($obj$$36$$);
    this.$b$($obj$$36$$.$address$)
  }, parse:function $$parser$$$$parse$($currentPage_entryPoint$$2_page$$1$$) {
    window.console.time("Parsing");
    var $i$$26_pageStart$$, $length$$21_pageEnd$$;
    void 0 == $currentPage_entryPoint$$2_page$$1$$ ? ($i$$26_pageStart$$ = 0, $length$$21_pageEnd$$ = this.$c$.length - 1) : ($i$$26_pageStart$$ = 0, $length$$21_pageEnd$$ = 16383);
    for($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$a$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for(;this.$a$[$currentPage_entryPoint$$2_page$$1$$].length;) {
        var $currentAddress$$2_romPage_targetPage$$ = this.$a$[$currentPage_entryPoint$$2_page$$1$$].shift().$address$ % 16384;
        if($currentAddress$$2_romPage_targetPage$$ < $i$$26_pageStart$$ || $currentAddress$$2_romPage_targetPage$$ > $length$$21_pageEnd$$) {
          $JSSMS$Utils$console$error$$("Address out of bound", $JSSMS$Utils$toHex$$($currentAddress$$2_romPage_targetPage$$))
        }else {
          if(!this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$]) {
            var $bytecode$$5_targetAddress$$ = new $Bytecode$$($currentAddress$$2_romPage_targetPage$$, $currentPage_entryPoint$$2_page$$1$$);
            this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$] = $disassemble$$($bytecode$$5_targetAddress$$, this.$c$);
            null != this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$ && (this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$ >= $i$$26_pageStart$$ && this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$ <= $length$$21_pageEnd$$) && this.$b$(this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$);
            null != this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target && (this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target >= $i$$26_pageStart$$ && this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target <= $length$$21_pageEnd$$) && this.$b$(this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target)
          }
        }
      }
    }
    this.$instructions$[0][1023] ? this.$instructions$[0][1023].$isFunctionEnder$ = !0 : this.$instructions$[0][1022] && (this.$instructions$[0][1022].$isFunctionEnder$ = !0);
    $i$$26_pageStart$$ = 0;
    for($length$$21_pageEnd$$ = this.$entryPoints$.length;$i$$26_pageStart$$ < $length$$21_pageEnd$$;$i$$26_pageStart$$++) {
      $currentPage_entryPoint$$2_page$$1$$ = this.$entryPoints$[$i$$26_pageStart$$].$address$, $currentAddress$$2_romPage_targetPage$$ = this.$entryPoints$[$i$$26_pageStart$$].$romPage$, this.$instructions$[$currentAddress$$2_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$isJumpTarget$ = !0, this.$instructions$[$currentAddress$$2_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$jumpTargetNb$++
    }
    for($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$instructions$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for($i$$26_pageStart$$ = 0, $length$$21_pageEnd$$ = this.$instructions$[$currentPage_entryPoint$$2_page$$1$$].length;$i$$26_pageStart$$ < $length$$21_pageEnd$$;$i$$26_pageStart$$++) {
        this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$] && (null != this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].$nextAddress$ && this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].$nextAddress$] && this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].$nextAddress$].$jumpTargetNb$++, 
        null != this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].target && ($currentAddress$$2_romPage_targetPage$$ = Math.floor(this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].target / 16384), $bytecode$$5_targetAddress$$ = this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].target % 16384, this.$instructions$[$currentAddress$$2_romPage_targetPage$$] && this.$instructions$[$currentAddress$$2_romPage_targetPage$$][$bytecode$$5_targetAddress$$] ? 
        (this.$instructions$[$currentAddress$$2_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$isJumpTarget$ = !0, this.$instructions$[$currentAddress$$2_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$jumpTargetNb$++) : $JSSMS$Utils$console$log$$("Invalid target address", $JSSMS$Utils$toHex$$(this.$instructions$[$currentPage_entryPoint$$2_page$$1$$][$i$$26_pageStart$$].target))))
      }
    }
    window.console.timeEnd("Parsing")
  }, $parseFromAddress$:function $$parser$$$$$parseFromAddress$$($obj$$37_romPage$$1$$) {
    var $address$$17$$ = $obj$$37_romPage$$1$$.$address$ % 16384;
    $obj$$37_romPage$$1$$ = $obj$$37_romPage$$1$$.$romPage$;
    var $pageStart$$1$$ = 16384 * $obj$$37_romPage$$1$$, $pageEnd$$1$$ = 16384 * ($obj$$37_romPage$$1$$ + 1), $branch$$ = [], $bytecode$$6$$, $firstInstruction$$ = !0, $absoluteAddress$$ = 0;
    1024 > $address$$17$$ && 0 == $obj$$37_romPage$$1$$ && ($pageStart$$1$$ = 0, $pageEnd$$1$$ = 1024);
    do {
      this.$instructions$[$obj$$37_romPage$$1$$][$address$$17$$] ? $bytecode$$6$$ = this.$instructions$[$obj$$37_romPage$$1$$][$address$$17$$] : ($bytecode$$6$$ = new $Bytecode$$($address$$17$$, $obj$$37_romPage$$1$$), this.$instructions$[$obj$$37_romPage$$1$$][$address$$17$$] = $disassemble$$($bytecode$$6$$, this.$c$));
      if($bytecode$$6$$.$canEnd$ && !$firstInstruction$$) {
        break
      }
      $address$$17$$ = $bytecode$$6$$.$nextAddress$ % 16384;
      $branch$$.push($bytecode$$6$$);
      $firstInstruction$$ = !1;
      $absoluteAddress$$ = $address$$17$$ + 16384 * $obj$$37_romPage$$1$$
    }while(null != $address$$17$$ && $absoluteAddress$$ >= $pageStart$$1$$ && $absoluteAddress$$ < $pageEnd$$1$$ && !$bytecode$$6$$.$isFunctionEnder$);
    return $branch$$
  }, $b$:function $$parser$$$$$b$$($address$$18$$) {
    var $memPage$$ = Math.floor($address$$18$$ / 16384), $romPage$$2$$ = this.$frameReg$[$memPage$$];
    this.$a$[$romPage$$2$$].push({$address$:$address$$18$$ % 16384, $romPage$:$romPage$$2$$, $memPage$:$memPage$$})
  }};
  $RomStream$$.prototype = {get $RomStream_prototype$position$() {
    return this.$a$
  }, get length() {
    return 16384 * this.$rom$.length
  }, $RomStream_prototype$seek$:function $$RomStream$$$$$RomStream_prototype$seek$$($pos$$) {
    this.$a$ = $pos$$
  }, getUint8:function $$RomStream$$$$getUint8$() {
    var $page$$2_value$$83$$ = 0, $page$$2_value$$83$$ = this.page, $address$$19$$ = this.$a$ & 16383, $page$$2_value$$83$$ = $SUPPORT_DATAVIEW$$ ? this.$rom$[$page$$2_value$$83$$].getUint8($address$$19$$) : this.$rom$[$page$$2_value$$83$$][$address$$19$$] & 255;
    this.$a$++;
    return $page$$2_value$$83$$
  }, $RomStream_prototype$getInt8$:function $$RomStream$$$$$RomStream_prototype$getInt8$$() {
    var $page$$3_value$$84$$ = 0, $page$$3_value$$84$$ = this.page, $address$$20$$ = this.$a$ & 16383;
    $SUPPORT_DATAVIEW$$ ? $page$$3_value$$84$$ = this.$rom$[$page$$3_value$$84$$].getInt8($address$$20$$) : ($page$$3_value$$84$$ = this.$rom$[$page$$3_value$$84$$][$address$$20$$] & 255, 128 <= $page$$3_value$$84$$ && ($page$$3_value$$84$$ -= 256));
    this.$a$++;
    return $page$$3_value$$84$$ + 1
  }, getUint16:function $$RomStream$$$$getUint16$() {
    var $page$$4_value$$85$$ = 0, $page$$4_value$$85$$ = this.page, $address$$21$$ = this.$a$ & 16383, $page$$4_value$$85$$ = $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$21$$ & 16383) ? this.$rom$[$page$$4_value$$85$$].getUint16($address$$21$$, !0) : this.$rom$[$page$$4_value$$85$$].getUint8($address$$21$$) | this.$rom$[++$page$$4_value$$85$$].getUint8($address$$21$$) << 8 : this.$rom$[$page$$4_value$$85$$][$address$$21$$] & 255 | (this.$rom$[++$page$$4_value$$85$$][$address$$21$$] & 255) << 8;
    this.$a$ += 2;
    return $page$$4_value$$85$$
  }};
  return $parser$$
}();
function $n$IfStatement$$($test$$, $consequent$$, $alternate$$) {
  void 0 == $alternate$$ && ($alternate$$ = null);
  return{type:"IfStatement", test:$test$$, consequent:$consequent$$, alternate:$alternate$$}
}
function $n$BlockStatement$$($body$$1$$) {
  void 0 == $body$$1$$ && ($body$$1$$ = []);
  Array.isArray($body$$1$$) || ($body$$1$$ = [$body$$1$$]);
  return{type:"BlockStatement", body:$body$$1$$}
}
function $n$ExpressionStatement$$($expression$$2$$) {
  return{type:"ExpressionStatement", expression:$expression$$2$$}
}
function $n$ReturnStatement$$() {
  var $argument$$;
  void 0 == $argument$$ && ($argument$$ = null);
  return{type:"ReturnStatement", argument:$argument$$}
}
function $n$Register$$($name$$59$$) {
  return{type:"Register", name:$name$$59$$}
}
function $n$Identifier$$($name$$60$$) {
  return{type:"Identifier", name:$name$$60$$}
}
function $n$Literal$$($value$$86$$) {
  return{type:"Literal", value:$value$$86$$, raw:$JSSMS$Utils$toHex$$($value$$86$$)}
}
function $n$CallExpression$$($callee$$, $args$$3$$) {
  void 0 == $args$$3$$ && ($args$$3$$ = []);
  Array.isArray($args$$3$$) || ($args$$3$$ = [$args$$3$$]);
  return{type:"CallExpression", callee:$n$Identifier$$($callee$$), arguments:$args$$3$$}
}
function $n$AssignmentExpression$$($operator$$, $left$$3$$, $right$$3$$) {
  return{type:"AssignmentExpression", operator:$operator$$, left:$left$$3$$, right:$right$$3$$}
}
function $n$BinaryExpression$$($operator$$1$$, $left$$4$$, $right$$4$$) {
  return{type:"BinaryExpression", operator:$operator$$1$$, left:$left$$4$$, right:$right$$4$$}
}
function $n$UnaryExpression$$($operator$$2$$, $argument$$1$$) {
  return{type:"UnaryExpression", operator:$operator$$2$$, argument:$argument$$1$$}
}
function $n$MemberExpression$$($object$$1$$, $property$$3$$) {
  return{type:"MemberExpression", computed:!0, object:$object$$1$$, property:$property$$3$$}
}
function $n$ConditionalExpression$$($test$$1$$, $consequent$$1$$, $alternate$$1$$) {
  return{type:"ConditionalExpression", test:$test$$1$$, consequent:$consequent$$1$$, alternate:$alternate$$1$$}
}
var $o$$ = {$NOOP$:function() {
  return function() {
  }
}, $LD8$:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function($value$$87$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Literal$$($value$$87$$)))
  } : "i" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$("i"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_CARRY")), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Identifier$$("F_PARITY"), $n$Literal$$(0)))))]
  } : "r" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$CallExpression$$("JSSMS.Utils.rndInt", $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_CARRY")), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), 
    $n$Identifier$$("F_PARITY"), $n$Literal$$(0)))))]
  } : void 0 == $dstRegister2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$($dstRegister1$$)))
  } : "n" == $dstRegister1$$ && "n" == $dstRegister2$$ ? function($value$$88$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$Literal$$($value$$88$$))))
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()))))
  }
}, $LD8_D$:function($srcRegister$$1$$, $dstRegister1$$1$$, $dstRegister2$$1$$) {
  return function($value$$89$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$1$$), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($dstRegister1$$1$$ + $dstRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$89$$)))))
  }
}, $LD16$:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$2$$, $dstRegister2$$2$$) {
  if(void 0 == $dstRegister1$$2$$ && void 0 == $dstRegister2$$2$$) {
    return function($value$$90$$) {
      return $n$ExpressionStatement$$($n$CallExpression$$("set" + ($srcRegister1$$ + $srcRegister2$$).toUpperCase(), $n$Literal$$($value$$90$$)))
    }
  }
  if("n" == $dstRegister1$$2$$ && "n" == $dstRegister2$$2$$) {
    return function($value$$91$$) {
      return $n$ExpressionStatement$$($n$CallExpression$$("set" + ($srcRegister1$$ + $srcRegister2$$).toUpperCase(), $o$$.$READ_MEM16$($n$Literal$$($value$$91$$))))
    }
  }
  throw Error("Wrong parameters number");
}, $LD_WRITE_MEM$:function($srcRegister1$$1$$, $srcRegister2$$1$$, $dstRegister1$$3$$, $dstRegister2$$3$$) {
  return void 0 == $dstRegister1$$3$$ && void 0 == $dstRegister2$$3$$ ? function($value$$92$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$92$$)]))
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ && void 0 == $dstRegister2$$3$$ ? function($value$$93$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$93$$), $n$Register$$($dstRegister1$$3$$)]))
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ ? function($value$$94$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$94$$), $n$Register$$($dstRegister2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$94$$ + 1), $n$Register$$($dstRegister1$$3$$)]))]
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Register$$($dstRegister1$$3$$)]))
  }
}, $LD_SP$:function($register1$$, $register2$$) {
  return void 0 == $register1$$ && void 0 == $register2$$ ? function($value$$95$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$Literal$$($value$$95$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$CallExpression$$("get" + ($register1$$ + $register2$$).toUpperCase())))
  }
}, $LD_NN$:function($register1$$1$$, $register2$$1$$) {
  return void 0 == $register2$$1$$ ? function($value$$96$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$96$$))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$96$$ + 1)))]
  } : function($value$$97$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$97$$), $n$Register$$($register2$$1$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$97$$ + 1), $n$Register$$($register1$$1$$)]))]
  }
}, $INC8$:function($register1$$2$$, $register2$$2$$) {
  return void 0 == $register2$$2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$2$$), $n$CallExpression$$("inc8", $n$Register$$($register1$$2$$))))
  } : "s" == $register1$$2$$ && "p" == $register2$$2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$CallExpression$$("getHL")))
  }
}, $INC16$:function($register1$$3$$, $register2$$3$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("inc" + ($register1$$3$$ + $register2$$3$$).toUpperCase()))
  }
}, $DEC8$:function($register1$$4$$, $register2$$4$$) {
  return void 0 == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$4$$), $n$CallExpression$$("dec8", $n$Register$$($register1$$4$$))))
  } : "s" == $register1$$4$$ && "p" == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("-", $n$Identifier$$("sp"), $n$Literal$$(1))))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$CallExpression$$("getHL")))
  }
}, $DEC16$:function($register1$$5$$, $register2$$5$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("dec" + ($register1$$5$$ + $register2$$5$$).toUpperCase()))
  }
}, $ADD16$:function($register1$$6$$, $register2$$6$$, $register3$$, $register4$$) {
  return void 0 == $register4$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("set" + ($register1$$6$$ + $register2$$6$$).toUpperCase(), $n$CallExpression$$("add16", [$n$CallExpression$$("get" + ($register1$$6$$ + $register2$$6$$).toUpperCase()), $n$Register$$($register3$$)])))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("set" + ($register1$$6$$ + $register2$$6$$).toUpperCase(), $n$CallExpression$$("add16", [$n$CallExpression$$("get" + ($register1$$6$$ + $register2$$6$$).toUpperCase()), $n$CallExpression$$("get" + ($register3$$ + $register4$$).toUpperCase())])))
  }
}, $ADC16$:function($register1$$7$$, $register2$$7$$) {
  return void 0 == $register2$$7$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add16", $n$Identifier$$($register1$$7$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add16", $n$CallExpression$$("get" + ($register1$$7$$ + $register2$$7$$).toUpperCase())))
  }
}, $RLCA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rlca_a"))
  }
}, $RRCA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rrca_a"))
  }
}, $RLA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rla_a"))
  }
}, $RRA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rra_a"))
  }
}, $DAA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("daa"))
  }
}, $CPL$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cpl_a"))
  }
}, $SCF$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_CARRY"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_NEGATIVE")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_HALFCARRY"))))]
  }
}, $CCF$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("ccf"))
  }
}, $ADD$:function($register1$$8$$, $register2$$8$$) {
  return void 0 == $register1$$8$$ && void 0 == $register2$$8$$ ? function($value$$98$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Literal$$($value$$98$$)))
  } : void 0 == $register2$$8$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Register$$($register1$$8$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$8$$ + $register2$$8$$).toUpperCase()))))
  }
}, $ADC$:function($register1$$9$$, $register2$$9$$) {
  return void 0 == $register1$$9$$ && void 0 == $register2$$9$$ ? function($value$$99$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Literal$$($value$$99$$)))
  } : void 0 == $register2$$9$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Register$$($register1$$9$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$9$$ + $register2$$9$$).toUpperCase()))))
  }
}, $SUB$:function($register1$$10$$, $register2$$10$$) {
  return void 0 == $register1$$10$$ && void 0 == $register2$$10$$ ? function($value$$100$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Literal$$($value$$100$$)))
  } : void 0 == $register2$$10$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Register$$($register1$$10$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$10$$ + $register2$$10$$).toUpperCase()))))
  }
}, $SBC$:function($register1$$11$$, $register2$$11$$) {
  return void 0 == $register1$$11$$ && void 0 == $register2$$11$$ ? function($value$$101$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Literal$$($value$$101$$)))
  } : void 0 == $register2$$11$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Register$$($register1$$11$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$11$$ + $register2$$11$$).toUpperCase()))))
  }
}, $AND$:function($register1$$12$$, $register2$$12$$) {
  return void 0 == $register1$$12$$ && void 0 == $register2$$12$$ ? function($value$$102$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Literal$$($value$$102$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Identifier$$("F_HALFCARRY"))))]
  } : "a" != $register1$$12$$ && void 0 == $register2$$12$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Register$$($register1$$12$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Identifier$$("F_HALFCARRY"))))]
  } : "a" == $register1$$12$$ && void 0 == $register2$$12$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Identifier$$("F_HALFCARRY"))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$12$$ + $register2$$12$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Identifier$$("F_HALFCARRY"))))]
  }
}, $XOR$:function($register1$$13$$, $register2$$13$$) {
  return void 0 == $register1$$13$$ && void 0 == $register2$$13$$ ? function($value$$103$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Literal$$($value$$103$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" != $register1$$13$$ && void 0 == $register2$$13$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Register$$($register1$$13$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" == $register1$$13$$ && void 0 == $register2$$13$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Literal$$(0))))]
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$13$$ + $register2$$13$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $OR$:function($register1$$14$$, $register2$$14$$) {
  return void 0 == $register1$$14$$ && void 0 == $register2$$14$$ ? function($value$$104$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Literal$$($value$$104$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" != $register1$$14$$ && void 0 == $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Register$$($register1$$14$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" == $register1$$14$$ && void 0 == $register2$$14$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$14$$ + $register2$$14$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $CP$:function($register1$$15$$, $register2$$15$$) {
  return void 0 == $register1$$15$$ && void 0 == $register2$$15$$ ? function($value$$105$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Literal$$($value$$105$$)))
  } : void 0 == $register2$$15$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Register$$($register1$$15$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$15$$ + $register2$$15$$).toUpperCase()))))
  }
}, $POP$:function($register1$$16$$, $register2$$16$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$CallExpression$$("set" + ($register1$$16$$ + $register2$$16$$).toUpperCase(), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2)))]
  }
}, $PUSH$:function($register1$$17$$, $register2$$17$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("push2", [$n$Register$$($register1$$17$$), $n$Register$$($register2$$17$$)]))
  }
}, $JR$:function($test$$2$$) {
  return function($value$$106$$, $target$$55$$) {
    return $n$IfStatement$$($test$$2$$, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$55$$))), $n$ReturnStatement$$()]))
  }
}, $DJNZ$:function() {
  return function($value$$107$$, $target$$56$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("b"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$("b"), $n$Literal$$(1)), $n$Literal$$(255)))), $o$$.$JR$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)))(void 0, $target$$56$$)]
  }
}, $JRNZ$:function() {
  return function($value$$108$$, $target$$57$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_ZERO")), $n$Literal$$(0))))(void 0, $target$$57$$)
  }
}, $JRZ$:function() {
  return function($value$$109$$, $target$$58$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_ZERO")), $n$Literal$$(0)))(void 0, $target$$58$$)
  }
}, $JRNC$:function() {
  return function($value$$110$$, $target$$59$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_CARRY")), $n$Literal$$(0))))(void 0, $target$$59$$)
  }
}, $JRC$:function() {
  return function($value$$111$$, $target$$60$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_CARRY")), $n$Literal$$(0)))(void 0, $target$$60$$)
  }
}, $RET$:function($operator$$4$$, $bitMask$$) {
  return void 0 == $operator$$4$$ && void 0 == $bitMask$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ReturnStatement$$()]
  } : function() {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$4$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$($bitMask$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(6))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), 
    $n$ReturnStatement$$()]))
  }
}, $JP$:function($operator$$5$$, $bitMask$$1$$) {
  return void 0 == $operator$$5$$ && void 0 == $bitMask$$1$$ ? function($value$$113$$, $target$$62$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$62$$))), $n$ReturnStatement$$()]
  } : "h" == $operator$$5$$ && "l" == $bitMask$$1$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("getHL"))), $n$ReturnStatement$$()]
  } : function($value$$115$$, $target$$64$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$5$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$($bitMask$$1$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$64$$))), $n$ReturnStatement$$()]))
  }
}, $CALL$:function($operator$$6$$, $bitMask$$2$$) {
  return void 0 == $operator$$6$$ && void 0 == $bitMask$$2$$ ? function($value$$116$$, $target$$65$$, $nextAddress$$8$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push1", $n$Literal$$($nextAddress$$8$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$65$$))), $n$ReturnStatement$$()]
  } : function($value$$117$$, $target$$66$$, $nextAddress$$9$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$6$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$($bitMask$$2$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(7))), $n$ExpressionStatement$$($n$CallExpression$$("push1", $n$Literal$$($nextAddress$$9$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$66$$))), $n$ReturnStatement$$()]))
  }
}, $RST$:function($targetAddress$$1$$) {
  return function($value$$118$$, $target$$67$$, $nextAddress$$10$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push1", $n$Literal$$($nextAddress$$10$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($targetAddress$$1$$))), $n$ReturnStatement$$()]
  }
}, $DI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))]
  }
}, $EI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))]
  }
}, $OUT$:function($register1$$18$$, $register2$$18$$) {
  return void 0 == $register2$$18$$ ? function($value$$119$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Literal$$($value$$119$$), $n$Register$$($register1$$18$$)]))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$($register1$$18$$), $n$Register$$($register2$$18$$)]))
  }
}, $IN$:function($register1$$19$$, $register2$$19$$) {
  return void 0 == $register2$$19$$ ? function($value$$120$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$19$$), $n$CallExpression$$("port.in_", $n$Literal$$($value$$120$$))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$19$$), $n$CallExpression$$("port.in_", $n$Register$$($register2$$19$$)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_CARRY")), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$($register1$$19$$)))))]
  }
}, $EX_AF$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("exAF"))
  }
}, $EXX$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$CallExpression$$("exBC")), $n$ExpressionStatement$$($n$CallExpression$$("exDE")), $n$ExpressionStatement$$($n$CallExpression$$("exHL"))]
  }
}, $EX_SP_HL$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1)), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $o$$.$READ_MEM8$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$Identifier$$("temp")]))]
  }
}, $EX_DE_HL$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("d"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("d"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$Identifier$$("temp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("e"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("e"), $n$Register$$("l"))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$Identifier$$("temp")))]
  }
}, $HALT$:function() {
  return function($ret_value$$122$$, $target$$71$$, $nextAddress$$14$$) {
    $ret_value$$122$$ = [];
    $ret_value$$122$$.push($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("tstates"), $n$Literal$$(0))));
    return $ret_value$$122$$.concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("halt"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($nextAddress$$14$$ - 1))), $n$ReturnStatement$$()])
  }
}, $p$:$generateCBFunctions$$("rlc"), $s$:$generateCBFunctions$$("rrc"), $o$:$generateCBFunctions$$("rl"), $q$:$generateCBFunctions$$("rr"), $v$:$generateCBFunctions$$("sla"), $F$:$generateCBFunctions$$("sra"), $w$:$generateCBFunctions$$("sll"), $G$:$generateCBFunctions$$("srl"), $a$:function($bit$$1$$, $register1$$20$$, $register2$$20$$) {
  if(void 0 == $register2$$20$$) {
    return function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $n$Register$$($register1$$20$$), $n$Identifier$$("BIT_" + $bit$$1$$))))
    }
  }
  if("h" == $register1$$20$$ && "l" == $register2$$20$$) {
    return function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$20$$ + $register2$$20$$).toUpperCase())), $n$Identifier$$("BIT_" + $bit$$1$$))))
    }
  }
  if("i" == $register1$$20$$) {
    return function($value$$123$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$20$$ + $register2$$20$$).toUpperCase()), $n$Literal$$($value$$123$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Identifier$$("BIT_" + $bit$$1$$))))]
    }
  }
}, $n$:function($bit$$2$$, $register1$$21$$, $register2$$21$$) {
  if(void 0 == $register2$$21$$) {
    return function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$($register1$$21$$), $n$UnaryExpression$$("~", $n$Identifier$$("BIT_" + $bit$$2$$))))
    }
  }
  if("h" == $register1$$21$$ && "l" == $register2$$21$$) {
    return function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase())), $n$UnaryExpression$$("~", $n$Identifier$$("BIT_" + $bit$$2$$)))))
    }
  }
  if("i" == $register1$$21$$) {
    return function($value$$124$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$Literal$$($value$$124$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$UnaryExpression$$("~", $n$Identifier$$("BIT_" + $bit$$2$$)))]))]
    }
  }
}, $t$:function($bit$$3$$, $register1$$22$$, $register2$$22$$) {
  if(void 0 == $register2$$22$$) {
    return function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$($register1$$22$$), $n$Identifier$$("BIT_" + $bit$$3$$)))
    }
  }
  if("h" == $register1$$22$$ && "l" == $register2$$22$$) {
    return function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase())), $n$Identifier$$("BIT_" + $bit$$3$$))]))
    }
  }
  if("i" == $register1$$22$$) {
    return function($value$$125$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$Literal$$($value$$125$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Identifier$$("BIT_" + $bit$$3$$))]))]
    }
  }
}, $LD_X$:function($register1$$23$$, $register2$$23$$, $register3$$1$$) {
  return void 0 == $register3$$1$$ ? function($value$$126$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$Literal$$($value$$126$$ & 255)), $n$Literal$$($value$$126$$ >> 8)]))]
  } : function($value$$127$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register2$$23$$ + $register3$$1$$).toUpperCase()), $n$Literal$$($value$$127$$)), $n$Register$$($register1$$23$$)]))]
  }
}, $INC_X$:function($register1$$24$$, $register2$$24$$) {
  return function($value$$128$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$24$$ + $register2$$24$$).toUpperCase()), $n$Literal$$($value$$128$$))))]
  }
}, $DEC_X$:function($register1$$25$$, $register2$$25$$) {
  return function($value$$129$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$25$$ + $register2$$25$$).toUpperCase()), $n$Literal$$($value$$129$$))))]
  }
}, $ADD_X$:function($register1$$26$$, $register2$$26$$) {
  return function($value$$130$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$26$$ + $register2$$26$$).toUpperCase()), $n$Literal$$($value$$130$$)))))
  }
}, $ADC_X$:function($register1$$27$$, $register2$$27$$) {
  return function($value$$131$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$27$$ + $register2$$27$$).toUpperCase()), $n$Literal$$($value$$131$$)))))
  }
}, $SUB_X$:function($register1$$28$$, $register2$$28$$) {
  return function($value$$132$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$28$$ + $register2$$28$$).toUpperCase()), $n$Literal$$($value$$132$$)))))
  }
}, $SBC_X$:function($register1$$29$$, $register2$$29$$) {
  return function($value$$133$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$29$$ + $register2$$29$$).toUpperCase()), $n$Literal$$($value$$133$$)))))
  }
}, $OR_X$:function($register1$$30$$, $register2$$30$$) {
  return function($value$$134$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$30$$ + $register2$$30$$).toUpperCase()), $n$Literal$$($value$$134$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $CP_X$:function($register1$$31$$, $register2$$31$$) {
  return function($value$$135$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$31$$ + $register2$$31$$).toUpperCase()), $n$Literal$$($value$$135$$)))))
  }
}, $EX_SP_X$:function($register1$$32$$, $register2$$32$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("get" + ($register1$$32$$ + $register2$$32$$).toUpperCase()))), $n$ExpressionStatement$$($n$CallExpression$$("set" + ($register1$$32$$ + $register2$$32$$).toUpperCase(), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", 
    [$n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1)), $n$BinaryExpression$$(">>", $n$Identifier$$("sp"), $n$Literal$$(8))]))]
  }
}, $JP_X$:function($register1$$33$$, $register2$$33$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("get" + ($register1$$33$$ + $register2$$33$$).toUpperCase()))), $n$ReturnStatement$$()]
  }
}, $SBC16$:function($register1$$34$$, $register2$$34$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc16", $n$CallExpression$$("get" + ($register1$$34$$ + $register2$$34$$).toUpperCase())))
  }
}, $NEG$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("a"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Identifier$$("temp")))]
  }
}, $RETN_RETI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Identifier$$("iff2")))]
  }
}, $IM$:function($value$$138$$) {
  return function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("im"), $n$Literal$$($value$$138$$)))
  }
}, $INI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("port.in_", $n$Register$$("c")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getHL"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Identifier$$("F_NEGATIVE")))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_NEGATIVE"))))))]
  }
}, $OUTI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $o$$.$DEC8$("b")(), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Identifier$$("F_CARRY"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_HALFCARRY")))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_CARRY")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_HALFCARRY"))))])), $n$IfStatement$$($n$BinaryExpression$$("==", 
    $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_NEGATIVE")))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_NEGATIVE"))))))]
  }
}, $OUTD$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $o$$.$DEC8$("b")(), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Identifier$$("F_CARRY"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_HALFCARRY")))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_CARRY")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_HALFCARRY"))))])), $n$IfStatement$$($n$BinaryExpression$$("==", 
    $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_NEGATIVE")))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_NEGATIVE"))))))]
  }
}, $LDI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", 
    $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Identifier$$("F_PARITY"), $n$Literal$$(0)))))]
  }
}, $CPI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Identifier$$("F_CARRY")), $n$Identifier$$("F_NEGATIVE")))), $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Identifier$$("F_PARITY")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]
  }
}, $LDD$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", 
    $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Identifier$$("F_PARITY"), $n$Literal$$(0)))))]
  }
}, $LDIR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), 
    $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_PARITY"))), $n$ReturnStatement$$()]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_PARITY"))))])), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_NEGATIVE")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", 
    $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_HALFCARRY"))))]
  }
}, $OTIR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), 
    $n$Literal$$(5))), $n$ReturnStatement$$()])), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_CARRY"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_HALFCARRY")))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", 
    $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_CARRY")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_HALFCARRY"))))])), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Identifier$$("F_NEGATIVE")))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", 
    $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Identifier$$("F_NEGATIVE"))))))]
  }
}, $c$:$generateIndexCBFunctions$$("rlc"), $g$:$generateIndexCBFunctions$$("rrc"), $b$:$generateIndexCBFunctions$$("rl"), $f$:$generateIndexCBFunctions$$("rr"), $h$:$generateIndexCBFunctions$$("sla"), $j$:$generateIndexCBFunctions$$("sra"), $i$:$generateIndexCBFunctions$$("sll"), $m$:$generateIndexCBFunctions$$("srl"), $READ_MEM8$:function($value$$147$$) {
  return $n$CallExpression$$("readMem", $value$$147$$)
}, $READ_MEM16$:function($value$$148$$) {
  return $n$CallExpression$$("readMemWord", $value$$148$$)
}};
function $generateCBFunctions$$($fn$$1$$) {
  return function($register1$$35$$, $register2$$35$$) {
    return void 0 == $register2$$35$$ ? function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$35$$), $n$CallExpression$$($fn$$1$$, $n$Register$$($register1$$35$$))))
    } : function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$35$$ + $register2$$35$$).toUpperCase()), $n$CallExpression$$($fn$$1$$, $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$35$$ + $register2$$35$$).toUpperCase())))))
    }
  }
}
function $generateIndexCBFunctions$$($fn$$2$$) {
  return function($register1$$36$$, $register2$$36$$, $register3$$2$$) {
    return void 0 == $register3$$2$$ ? function($value$$149$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$36$$ + $register2$$36$$).toUpperCase()), $n$Literal$$($value$$149$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$CallExpression$$($fn$$2$$, $o$$.$READ_MEM8$($n$Identifier$$("location")))]))]
    } : function($value$$150$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$36$$ + $register2$$36$$).toUpperCase()), $n$Literal$$($value$$150$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register3$$2$$), $n$CallExpression$$($fn$$2$$, $o$$.$READ_MEM8$($n$Identifier$$("location"))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", 
      [$n$Identifier$$("location"), $n$Register$$($register3$$2$$)]))]
    }
  }
}
;var $opcodeTableCB$$ = [], $opcodeTableDDCB$$ = [], $opcodeTableFDCB$$ = [], $regs$$ = {B:["b"], C:["c"], D:["d"], E:["e"], H:["h"], L:["l"], "(HL)":["h", "l"], A:["a"]};
"RLC RRC RL RR SLA SRA SLL SRL".split(" ").forEach(function($op$$) {
  for(var $reg$$2$$ in $regs$$) {
    $opcodeTableCB$$.push({name:$op$$ + " " + $reg$$2$$, $ast$:$o$$[$op$$].apply(null, $regs$$[$reg$$2$$])}), "(HL)" != $reg$$2$$ ? ($opcodeTableDDCB$$.push({name:"LD " + $reg$$2$$ + "," + $op$$ + " (IX)", $ast$:$o$$["LD_" + $op$$].apply(null, ["i", "x"].concat($regs$$[$reg$$2$$]))}), $opcodeTableFDCB$$.push({name:"LD " + $reg$$2$$ + "," + $op$$ + " (IY)", $ast$:$o$$["LD_" + $op$$].apply(null, ["i", "y"].concat($regs$$[$reg$$2$$]))})) : ($opcodeTableDDCB$$.push({name:$op$$ + " (IX)", $ast$:$o$$["LD_" + 
    $op$$]("i", "x")}), $opcodeTableFDCB$$.push({name:$op$$ + " (IY)", $ast$:$o$$["LD_" + $op$$]("i", "y")}))
  }
});
["BIT", "RES", "SET"].forEach(function($op$$1$$) {
  for(var $i$$28$$ = 0;8 > $i$$28$$;$i$$28$$++) {
    for(var $reg$$3$$ in $regs$$) {
      $opcodeTableCB$$.push({name:$op$$1$$ + " " + $i$$28$$ + "," + $reg$$3$$, $ast$:$o$$[$op$$1$$].apply(null, [$i$$28$$].concat($regs$$[$reg$$3$$]))})
    }
    for(var $j$$2$$ = 0;8 > $j$$2$$;$j$$2$$++) {
      $opcodeTableDDCB$$.push({name:$op$$1$$ + " " + $i$$28$$ + " (IX)", $ast$:$o$$[$op$$1$$].apply(null, [$i$$28$$].concat(["i", "x"]))}), $opcodeTableFDCB$$.push({name:$op$$1$$ + " " + $i$$28$$ + " (IY)", $ast$:$o$$[$op$$1$$].apply(null, [$i$$28$$].concat(["i", "y"]))})
    }
  }
});
function $generateIndexTable$$($index$$51$$) {
  var $register2$$37$$ = $index$$51$$.substring(1, 2), $register2LC$$ = $index$$51$$.substring(1, 2).toLowerCase();
  return{9:{name:"ADD " + $index$$51$$ + ",BC", $ast$:$o$$.$ADD16$("i", $register2$$37$$, "b", "c")}, 25:{name:"ADD " + $index$$51$$ + ",DE", $ast$:$o$$.$ADD16$("i", $register2$$37$$, "d", "e")}, 33:{name:"LD " + $index$$51$$ + ",nn", $ast$:$o$$.$LD16$("i", $register2$$37$$)}, 34:{name:"LD (nn)," + $index$$51$$, $ast$:$o$$.$LD_NN$("i" + $register2LC$$ + "H", "i" + $register2LC$$ + "L")}, 35:{name:"INC " + $index$$51$$, $ast$:$o$$.$INC16$("i", $register2$$37$$)}, 42:{name:"LD " + $index$$51$$ + ",(nn)", 
  $ast$:$o$$.$LD16$("i", $register2$$37$$, "n", "n"), $operand$:3}, 43:{name:"DEC " + $index$$51$$, $ast$:$o$$.$DEC16$("i", $register2$$37$$)}, 52:{name:"INC (" + $index$$51$$ + "+d)", $ast$:$o$$.$INC_X$("i", $register2$$37$$)}, 53:{name:"DEC (" + $index$$51$$ + "+d)", $ast$:$o$$.$DEC_X$("i", $register2$$37$$)}, 54:{name:"LD (" + $index$$51$$ + "+d),n", $ast$:$o$$.$LD_X$("i", $register2$$37$$)}, 70:{name:"LD B,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("b", "i", $register2$$37$$)}, 78:{name:"LD C,(" + 
  $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("c", "i", $register2$$37$$)}, 84:{name:" LD D," + $index$$51$$ + "H *", $ast$:$o$$.$LD8$("d", "i" + $register2LC$$ + "H")}, 86:{name:"LD D,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("d", "i", $register2$$37$$)}, 93:{name:"LD E," + $index$$51$$ + "L *", $ast$:$o$$.$LD8$("e", "i" + $register2LC$$ + "L")}, 94:{name:"LD E,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("e", "i", $register2$$37$$)}, 96:{name:"LD " + $index$$51$$ + "H,B", $ast$:$o$$.$LD8$("i" + 
  $register2LC$$ + "H", "b")}, 97:{name:"LD " + $index$$51$$ + "H,C", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "H", "c")}, 98:{name:"LD " + $index$$51$$ + "H,D", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "H", "d")}, 99:{name:"LD " + $index$$51$$ + "H,E", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "H", "e")}, 100:{name:"LD " + $index$$51$$ + "H," + $index$$51$$ + "H", $ast$:$o$$.$NOOP$()}, 101:{name:"LD " + $index$$51$$ + "H," + $index$$51$$ + "L *", $ast$:$o$$.$LD8_D$("i" + $register2LC$$ + "H", "i" + 
  $register2LC$$ + "L")}, 102:{name:"LD H,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("h", "i", $register2$$37$$)}, 103:{name:"LD " + $index$$51$$ + "H,A", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "H", "a")}, 104:{name:"LD " + $index$$51$$ + "L,B", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "L", "b")}, 105:{name:"LD " + $index$$51$$ + "L,C", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "L", "c")}, 106:{name:"LD " + $index$$51$$ + "L,D", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "L", "d")}, 107:{name:"LD " + 
  $index$$51$$ + "L,E", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "L", "e")}, 108:{name:"LD " + $index$$51$$ + "L," + $index$$51$$ + "H", $ast$:$o$$.$LD8_D$("i" + $register2LC$$ + "L", "i" + $register2LC$$ + "H")}, 109:{name:"LD " + $index$$51$$ + "L," + $index$$51$$ + "L *", $ast$:$o$$.$NOOP$()}, 110:{name:"LD L,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("l", "i", $register2$$37$$)}, 111:{name:"LD " + $index$$51$$ + "L,A *", $ast$:$o$$.$LD8$("i" + $register2LC$$ + "L", "a")}, 112:{name:"LD (" + 
  $index$$51$$ + "+d),B", $ast$:$o$$.$LD_X$("b", "i", $register2$$37$$)}, 113:{name:"LD (" + $index$$51$$ + "+d),C", $ast$:$o$$.$LD_X$("c", "i", $register2$$37$$)}, 114:{name:"LD (" + $index$$51$$ + "+d),D", $ast$:$o$$.$LD_X$("d", "i", $register2$$37$$)}, 115:{name:"LD (" + $index$$51$$ + "+d),E", $ast$:$o$$.$LD_X$("e", "i", $register2$$37$$)}, 116:{name:"LD (" + $index$$51$$ + "+d),H", $ast$:$o$$.$LD_X$("h", "i", $register2$$37$$)}, 117:{name:"LD (" + $index$$51$$ + "+d),L", $ast$:$o$$.$LD_X$("l", 
  "i", $register2$$37$$)}, 118:{name:"LD (" + $index$$51$$ + "+d),B", $ast$:$o$$.$LD_X$("b", "i", $register2$$37$$)}, 119:{name:"LD (" + $index$$51$$ + "+d),A", $ast$:$o$$.$LD_X$("a", "i", $register2$$37$$)}, 126:{name:"LD A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("a", "i", $register2$$37$$)}, 124:{name:"LD A," + $index$$51$$ + "H", $ast$:$o$$.$LD8$("a", "i" + $register2LC$$ + "H")}, 125:{name:"LD A," + $index$$51$$ + "L", $ast$:$o$$.$LD8$("a", "i" + $register2LC$$ + "L")}, 134:{name:"ADD A,(" + 
  $index$$51$$ + "+d)", $ast$:$o$$.$ADD_X$("i", $register2$$37$$)}, 142:{name:"ADC A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$ADC_X$("i", $register2$$37$$)}, 150:{name:"SUB A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$SUB_X$("i", $register2$$37$$)}, 158:{name:"SBC A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$SBC_X$("i", $register2$$37$$)}, 203:"IX" == $index$$51$$ ? $opcodeTableDDCB$$ : $opcodeTableFDCB$$, 182:{name:"OR A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$OR_X$("i", $register2$$37$$)}, 190:{name:"CP (" + 
  $index$$51$$ + "+d)", $ast$:$o$$.$CP_X$("i", $register2$$37$$)}, 225:{name:"POP " + $index$$51$$, $ast$:$o$$.$POP$("i", $register2$$37$$)}, 227:{name:"EX SP,(" + $index$$51$$ + ")", $ast$:$o$$.$EX_SP_X$("i", $register2$$37$$)}, 229:{name:"PUSH " + $index$$51$$, $ast$:$o$$.$PUSH$("i" + $register2LC$$ + "H", "i" + $register2LC$$ + "L")}, 233:{name:"JP (" + $index$$51$$ + ")", $ast$:$o$$.$JP_X$("i", $register2$$37$$)}, 249:{name:"LD SP," + $index$$51$$, $ast$:$o$$.$LD_SP$("i", $register2$$37$$)}}
}
;var $opcodeTableED$$ = {64:{name:"IN B,(C)", $ast$:$o$$.$IN$("b", "c")}, 66:{name:"SBC HL,BC", $ast$:$o$$.$SBC16$("b", "c")}, 65:{name:"OUT (C),B", $ast$:$o$$.$OUT$("c", "b")}, 67:{name:"LD (nn),BC", $ast$:$o$$.$LD_NN$("b", "c")}, 68:{name:"NEG", $ast$:$o$$.$NEG$()}, 69:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 70:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 72:{name:"IN C,(C)", $ast$:$o$$.$IN$("c", "c")}, 73:{name:"OUT (C),C", $ast$:$o$$.$OUT$("c", "c")}, 74:{name:"ADC HL,BC", $ast$:$o$$.$ADC16$("b", 
"c")}, 75:{name:"LD BC,(nn)", $ast$:$o$$.$LD16$("b", "c", "n", "n"), $operand$:3}, 76:{name:"NEG", $ast$:$o$$.$NEG$()}, 77:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 78:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 80:{name:"IN D,(C)", $ast$:$o$$.$IN$("d", "c")}, 81:{name:"OUT (C),D", $ast$:$o$$.$OUT$("c", "d")}, 82:{name:"SBC HL,DE", $ast$:$o$$.$SBC16$("d", "e")}, 83:{name:"LD (nn),DE", $ast$:$o$$.$LD_NN$("d", "e")}, 84:{name:"NEG", $ast$:$o$$.$NEG$()}, 85:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 
86:{name:"IM 1", $ast$:$o$$.$IM$(1)}, 87:{name:"LD A,I", $ast$:$o$$.$LD8$("a", "i")}, 88:{name:"IN E,(C)", $ast$:$o$$.$IN$("e", "c")}, 89:{name:"OUT (C),E", $ast$:$o$$.$OUT$("c", "e")}, 90:{name:"ADC HL,DE", $ast$:$o$$.$ADC16$("d", "e")}, 91:{name:"LD DE,(nn)", $ast$:$o$$.$LD16$("d", "e", "n", "n"), $operand$:3}, 92:{name:"NEG", $ast$:$o$$.$NEG$()}, 95:{name:"LD A,R", $ast$:$o$$.$LD8$("a", "r")}, 96:{name:"IN H,(C)", $ast$:$o$$.$IN$("h", "c")}, 97:{name:"OUT (C),H", $ast$:$o$$.$OUT$("c", "h")}, 98:{name:"SBC HL,HL", 
$ast$:$o$$.$SBC16$("h", "l")}, 99:{name:"LD (nn),HL", $ast$:$o$$.$LD_NN$("h", "l")}, 100:{name:"NEG", $ast$:$o$$.$NEG$()}, 102:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 104:{name:"IN L,(C)", $ast$:$o$$.$IN$("l", "c")}, 105:{name:"OUT (C),L", $ast$:$o$$.$OUT$("c", "l")}, 106:{name:"ADC HL,HL", $ast$:$o$$.$ADC16$("h", "l")}, 107:{name:"LD HL,(nn)", $ast$:$o$$.$LD16$("h", "l", "n", "n"), $operand$:3}, 108:{name:"NEG", $ast$:$o$$.$NEG$()}, 110:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 115:{name:"LD (nn),SP", $ast$:$o$$.$LD_NN$("sp")}, 
116:{name:"NEG", $ast$:$o$$.$NEG$()}, 118:{name:"IM 1", $ast$:$o$$.$IM$(1)}, 120:{name:"IN A,(C)", $ast$:$o$$.$IN$("a", "c")}, 121:{name:"OUT (C),A", $ast$:$o$$.$OUT$("c", "a")}, 122:{name:"ADC HL,SP", $ast$:$o$$.$ADC16$("sp")}, 124:{name:"NEG", $ast$:$o$$.$NEG$()}, 160:{name:"LDI", $ast$:$o$$.$LDI$()}, 161:{name:"CPI", $ast$:$o$$.$CPI$()}, 162:{name:"INI", $ast$:$o$$.$INI$()}, 163:{name:"OUTI", $ast$:$o$$.$OUTI$()}, 168:{name:"LDD", $ast$:$o$$.$LDD$()}, 171:{name:"OUTD", $ast$:$o$$.$OUTD$()}, 176:{name:"LDIR", 
$ast$:$o$$.$LDIR$()}, 179:{name:"OTIR", $ast$:$o$$.$OTIR$()}};
var $opcodeTable$$ = [{name:"NOP", $ast$:$o$$.$NOOP$()}, {name:"LD BC,nn", $ast$:$o$$.$LD16$("b", "c"), $operand$:3}, {name:"LD (BC),A", $ast$:$o$$.$LD_WRITE_MEM$("b", "c", "a")}, {name:"INC BC", $ast$:$o$$.$INC16$("b", "c")}, {name:"INC B", $ast$:$o$$.$INC8$("b")}, {name:"DEC B", $ast$:$o$$.$DEC8$("b")}, {name:"LD B,n", $ast$:$o$$.$LD8$("b"), $operand$:1}, {name:"RLCA", $ast$:$o$$.$RLCA$()}, {name:"EX AF AF'", $ast$:$o$$.$EX_AF$()}, {name:"ADD HL,BC", $ast$:$o$$.$ADD16$("h", "l", "b", "c")}, {name:"LD A,(BC)", 
$ast$:$o$$.$LD8$("a", "b", "c")}, {name:"DEC BC", $ast$:$o$$.$DEC16$("b", "c")}, {name:"INC C", $ast$:$o$$.$INC8$("c")}, {name:"DEC C", $ast$:$o$$.$DEC8$("c")}, {name:"LD C,n", $ast$:$o$$.$LD8$("c"), $operand$:1}, {name:"RRCA", $ast$:$o$$.$RRCA$()}, {name:"DJNZ (PC+e)", $ast$:$o$$.$DJNZ$(), $operand$:2}, {name:"LD DE,nn", $ast$:$o$$.$LD16$("d", "e"), $operand$:3}, {name:"LD (DE),A", $ast$:$o$$.$LD_WRITE_MEM$("d", "e", "a")}, {name:"INC DE", $ast$:$o$$.$INC16$("d", "e")}, {name:"INC D", $ast$:$o$$.$INC8$("d")}, 
{name:"DEC D", $ast$:$o$$.$DEC8$("d")}, {name:"LD D,n", $ast$:$o$$.$LD8$("d"), $operand$:1}, {name:"RLA", $ast$:$o$$.$RLA$()}, {name:"JR (PC+e)", $ast$:$o$$.$JP$(), $operand$:2}, {name:"ADD HL,DE", $ast$:$o$$.$ADD16$("h", "l", "d", "e")}, {name:"LD A,(DE)", $ast$:$o$$.$LD8$("a", "d", "e")}, {name:"DEC DE", $ast$:$o$$.$DEC16$("d", "e")}, {name:"INC E", $ast$:$o$$.$INC8$("e")}, {name:"DEC E", $ast$:$o$$.$DEC8$("e")}, {name:"LD E,n", $ast$:$o$$.$LD8$("e"), $operand$:1}, {name:"RRA", $ast$:$o$$.$RRA$()}, 
{name:"JR NZ,(PC+e)", $ast$:$o$$.$JRNZ$(), $operand$:2}, {name:"LD HL,nn", $ast$:$o$$.$LD16$("h", "l"), $operand$:3}, {name:"LD (nn),HL", $ast$:$o$$.$LD_NN$("h", "l"), $operand$:3}, {name:"INC HL", $ast$:$o$$.$INC16$("h", "l")}, {name:"INC H", $ast$:$o$$.$INC8$("h")}, {name:"DEC H", $ast$:$o$$.$DEC8$("h")}, {name:"LD H,n", $ast$:$o$$.$LD8$("h"), $operand$:1}, {name:"DAA", $ast$:$o$$.$DAA$()}, {name:"JR Z,(PC+e)", $ast$:$o$$.$JRZ$(), $operand$:2}, {name:"ADD HL,HL", $ast$:$o$$.$ADD16$("h", "l", "h", 
"l")}, {name:"LD HL,(nn)", $ast$:$o$$.$LD16$("h", "l", "n", "n"), $operand$:3}, {name:"DEC HL", $ast$:$o$$.$DEC16$("h", "l")}, {name:"INC L", $ast$:$o$$.$INC8$("l")}, {name:"DEC L", $ast$:$o$$.$DEC8$("l")}, {name:"LD L,n", $ast$:$o$$.$LD8$("l"), $operand$:1}, {name:"CPL", $ast$:$o$$.$CPL$()}, {name:"JR NC,(PC+e)", $ast$:$o$$.$JRNC$(), $operand$:2}, {name:"LD SP,nn", $ast$:$o$$.$LD_SP$(), $operand$:3}, {name:"LD (nn),A", $ast$:$o$$.$LD_WRITE_MEM$("n", "n", "a"), $operand$:3}, {name:"INC SP", $ast$:$o$$.$INC8$("s", 
"p")}, {name:"INC (HL)", $ast$:$o$$.$INC8$("h", "l")}, {name:"DEC (HL)", $ast$:$o$$.$DEC8$("h", "l")}, {name:"LD (HL),n", $ast$:$o$$.$LD_WRITE_MEM$("h", "l"), $operand$:1}, {name:"SCF", $ast$:$o$$.$SCF$()}, {name:"JR C,(PC+e)", $ast$:$o$$.$JRC$(), $operand$:2}, {name:"ADD HL,SP", $ast$:$o$$.$ADD16$("h", "l", "sp")}, {name:"LD A,(nn)", $ast$:$o$$.$LD8$("a", "n", "n"), $operand$:3}, {name:"DEC SP", $ast$:$o$$.$DEC8$("s", "p")}, {name:"INC A", $ast$:$o$$.$INC8$("a")}, {name:"DEC A", $ast$:$o$$.$DEC8$("a")}, 
{name:"LD A,n", $ast$:$o$$.$LD8$("a"), $operand$:1}, {name:"CCF", $ast$:$o$$.$CCF$()}, {name:"LD B,B", $ast$:$o$$.$NOOP$(), $operand$:1}, {name:"LD B,C", $ast$:$o$$.$LD8$("b", "c")}, {name:"LD B,D", $ast$:$o$$.$LD8$("b", "d")}, {name:"LD B,E", $ast$:$o$$.$LD8$("b", "e")}, {name:"LD B,H", $ast$:$o$$.$LD8$("b", "h")}, {name:"LD B,L", $ast$:$o$$.$LD8$("b", "l")}, {name:"LD B,(HL)", $ast$:$o$$.$LD8$("b", "h", "l")}, {name:"LD B,A", $ast$:$o$$.$LD8$("b", "a")}, {name:"LD C,B", $ast$:$o$$.$LD8$("c", "b")}, 
{name:"LD C,C", $ast$:$o$$.$NOOP$()}, {name:"LD C,D", $ast$:$o$$.$LD8$("c", "d")}, {name:"LD C,E", $ast$:$o$$.$LD8$("c", "e")}, {name:"LD C,H", $ast$:$o$$.$LD8$("c", "h")}, {name:"LD C,L", $ast$:$o$$.$LD8$("c", "l")}, {name:"LD C,(HL)", $ast$:$o$$.$LD8$("c", "h", "l")}, {name:"LD C,A", $ast$:$o$$.$LD8$("c", "a")}, {name:"LD D,B", $ast$:$o$$.$LD8$("d", "b")}, {name:"LD D,C", $ast$:$o$$.$LD8$("d", "c")}, {name:"LD D,D", $ast$:$o$$.$NOOP$()}, {name:"LD D,E", $ast$:$o$$.$LD8$("d", "e")}, {name:"LD D,H", 
$ast$:$o$$.$LD8$("d", "h")}, {name:"LD D,L", $ast$:$o$$.$LD8$("d", "l")}, {name:"LD D,(HL)", $ast$:$o$$.$LD8$("d", "h", "l")}, {name:"LD D,A", $ast$:$o$$.$LD8$("d", "a")}, {name:"LD E,B", $ast$:$o$$.$LD8$("e", "b")}, {name:"LD E,C", $ast$:$o$$.$LD8$("e", "c")}, {name:"LD E,D", $ast$:$o$$.$LD8$("e", "d")}, {name:"LD E,E", $ast$:$o$$.$NOOP$()}, {name:"LD E,H", $ast$:$o$$.$LD8$("e", "h")}, {name:"LD E,L", $ast$:$o$$.$LD8$("e", "l")}, {name:"LD E,(HL)", $ast$:$o$$.$LD8$("e", "h", "l")}, {name:"LD E,A", 
$ast$:$o$$.$LD8$("e", "a")}, {name:"LD H,B", $ast$:$o$$.$LD8$("h", "b")}, {name:"LD H,C", $ast$:$o$$.$LD8$("h", "c")}, {name:"LD H,D", $ast$:$o$$.$LD8$("h", "d")}, {name:"LD H,E", $ast$:$o$$.$LD8$("h", "e")}, {name:"LD H,H", $ast$:$o$$.$NOOP$()}, {name:"LD H,L", $ast$:$o$$.$LD8$("h", "l")}, {name:"LD H,(HL)", $ast$:$o$$.$LD8$("h", "h", "l")}, {name:"LD H,A", $ast$:$o$$.$LD8$("h", "a")}, {name:"LD L,B", $ast$:$o$$.$LD8$("l", "b")}, {name:"LD L,C", $ast$:$o$$.$LD8$("l", "c")}, {name:"LD L,D", $ast$:$o$$.$LD8$("l", 
"d")}, {name:"LD L,E", $ast$:$o$$.$LD8$("l", "e")}, {name:"LD L,H", $ast$:$o$$.$LD8$("l", "h")}, {name:"LD L,L", $ast$:$o$$.$NOOP$()}, {name:"LD L,(HL)", $ast$:$o$$.$LD8$("l", "h", "l")}, {name:"LD L,A", $ast$:$o$$.$LD8$("l", "a")}, {name:"LD (HL),B", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "b")}, {name:"LD (HL),C", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "c")}, {name:"LD (HL),D", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "d")}, {name:"LD (HL),E", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "e")}, {name:"LD (HL),H", $ast$:$o$$.$LD_WRITE_MEM$("h", 
"l", "h")}, {name:"LD (HL),L", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "l")}, {name:"HALT", $ast$:$o$$.$HALT$()}, {name:"LD (HL),A", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "a")}, {name:"LD A,B", $ast$:$o$$.$LD8$("a", "b")}, {name:"LD A,C", $ast$:$o$$.$LD8$("a", "c")}, {name:"LD A,D", $ast$:$o$$.$LD8$("a", "d")}, {name:"LD A,E", $ast$:$o$$.$LD8$("a", "e")}, {name:"LD A,H", $ast$:$o$$.$LD8$("a", "h")}, {name:"LD A,L", $ast$:$o$$.$LD8$("a", "l")}, {name:"LD A,(HL)", $ast$:$o$$.$LD8$("a", "h", "l")}, {name:"LD A,A", 
$ast$:$o$$.$NOOP$()}, {name:"ADD A,B", $ast$:$o$$.$ADD$("b")}, {name:"ADD A,C", $ast$:$o$$.$ADD$("c")}, {name:"ADD A,D", $ast$:$o$$.$ADD$("d")}, {name:"ADD A,E", $ast$:$o$$.$ADD$("e")}, {name:"ADD A,H", $ast$:$o$$.$ADD$("h")}, {name:"ADD A,L", $ast$:$o$$.$ADD$("l")}, {name:"ADD A,(HL)", $ast$:$o$$.$ADD$("h", "l")}, {name:"ADD A,A", $ast$:$o$$.$ADD$("a")}, {name:"ADC A,B", $ast$:$o$$.$ADC$("b")}, {name:"ADC A,C", $ast$:$o$$.$ADC$("c")}, {name:"ADC A,D", $ast$:$o$$.$ADC$("d")}, {name:"ADC A,E", $ast$:$o$$.$ADC$("e")}, 
{name:"ADC A,H", $ast$:$o$$.$ADC$("h")}, {name:"ADC A,L", $ast$:$o$$.$ADC$("l")}, {name:"ADC A,(HL)", $ast$:$o$$.$ADC$("h", "l")}, {name:"ADC A,A", $ast$:$o$$.$ADC$("a")}, {name:"SUB A,B", $ast$:$o$$.$SUB$("b")}, {name:"SUB A,C", $ast$:$o$$.$SUB$("c")}, {name:"SUB A,D", $ast$:$o$$.$SUB$("d")}, {name:"SUB A,E", $ast$:$o$$.$SUB$("e")}, {name:"SUB A,H", $ast$:$o$$.$SUB$("h")}, {name:"SUB A,L", $ast$:$o$$.$SUB$("l")}, {name:"SUB A,(HL)", $ast$:$o$$.$SUB$("h", "l")}, {name:"SUB A,A", $ast$:$o$$.$SUB$("a")}, 
{name:"SBC A,B", $ast$:$o$$.$SBC$("b")}, {name:"SBC A,C", $ast$:$o$$.$SBC$("c")}, {name:"SBC A,D", $ast$:$o$$.$SBC$("d")}, {name:"SBC A,E", $ast$:$o$$.$SBC$("e")}, {name:"SBC A,H", $ast$:$o$$.$SBC$("h")}, {name:"SBC A,L", $ast$:$o$$.$SBC$("l")}, {name:"SBC A,(HL)", $ast$:$o$$.$SBC$("h", "l")}, {name:"SBC A,A", $ast$:$o$$.$SBC$("a")}, {name:"AND A,B", $ast$:$o$$.$AND$("b")}, {name:"AND A,C", $ast$:$o$$.$AND$("c")}, {name:"AND A,D", $ast$:$o$$.$AND$("d")}, {name:"AND A,E", $ast$:$o$$.$AND$("e")}, {name:"AND A,H", 
$ast$:$o$$.$AND$("h")}, {name:"AND A,L", $ast$:$o$$.$AND$("l")}, {name:"AND A,(HL)", $ast$:$o$$.$AND$("h", "l")}, {name:"AND A,A", $ast$:$o$$.$AND$("a")}, {name:"XOR A,B", $ast$:$o$$.$XOR$("b")}, {name:"XOR A,C", $ast$:$o$$.$XOR$("c")}, {name:"XOR A,D", $ast$:$o$$.$XOR$("d")}, {name:"XOR A,E", $ast$:$o$$.$XOR$("e")}, {name:"XOR A,H", $ast$:$o$$.$XOR$("h")}, {name:"XOR A,L", $ast$:$o$$.$XOR$("l")}, {name:"XOR A,(HL)", $ast$:$o$$.$XOR$("h", "l")}, {name:"XOR A,A", $ast$:$o$$.$XOR$("a")}, {name:"OR A,B", 
$ast$:$o$$.$OR$("b")}, {name:"OR A,C", $ast$:$o$$.$OR$("c")}, {name:"OR A,D", $ast$:$o$$.$OR$("d")}, {name:"OR A,E", $ast$:$o$$.$OR$("e")}, {name:"OR A,H", $ast$:$o$$.$OR$("h")}, {name:"OR A,L", $ast$:$o$$.$OR$("l")}, {name:"OR A,(HL)", $ast$:$o$$.$OR$("h", "l")}, {name:"OR A,A", $ast$:$o$$.$OR$("a")}, {name:"CP A,B", $ast$:$o$$.$CP$("b")}, {name:"CP A,C", $ast$:$o$$.$CP$("c")}, {name:"CP A,D", $ast$:$o$$.$CP$("d")}, {name:"CP A,E", $ast$:$o$$.$CP$("e")}, {name:"CP A,H", $ast$:$o$$.$CP$("h")}, {name:"CP A,L", 
$ast$:$o$$.$CP$("l")}, {name:"CP A,(HL)", $ast$:$o$$.$CP$("h", "l")}, {name:"CP A,A", $ast$:$o$$.$CP$("a")}, {name:"RET NZ", $ast$:$o$$.$RET$("==", "F_ZERO")}, {name:"POP BC", $ast$:$o$$.$POP$("b", "c")}, {name:"JP NZ,(nn)", $ast$:$o$$.$JP$("==", "F_ZERO")}, {name:"JP (nn)", $ast$:$o$$.$JP$()}, {name:"CALL NZ (nn)", $ast$:$o$$.$CALL$("==", "F_ZERO")}, {name:"PUSH BC", $ast$:$o$$.$PUSH$("b", "c")}, {name:"ADD A,n", $ast$:$o$$.$ADD$()}, {name:"RST 0x00", $ast$:$o$$.$RST$(0)}, {name:"RET Z", $ast$:$o$$.$RET$("!=", 
"F_ZERO")}, {name:"RET", $ast$:$o$$.$RET$()}, {name:"JP Z,(nn)", $ast$:$o$$.$JP$("!=", "F_ZERO")}, $opcodeTableCB$$, {name:"CALL Z (nn)", $ast$:$o$$.$CALL$("!=", "F_ZERO")}, {name:"CALL (nn)", $ast$:$o$$.$CALL$()}, {name:"ADC A,n", $ast$:$o$$.$ADC$()}, {name:"RST 0x08", $ast$:$o$$.$RST$(8)}, {name:"RET NC", $ast$:$o$$.$RET$("==", "F_CARRY")}, {name:"POP DE", $ast$:$o$$.$POP$("d", "e")}, {name:"JP NC,(nn)", $ast$:$o$$.$JP$("==", "F_CARRY")}, {name:"OUT (n),A", $ast$:$o$$.$OUT$("a")}, {name:"CALL NC (nn)", 
$ast$:$o$$.$CALL$("==", "F_CARRY")}, {name:"PUSH DE", $ast$:$o$$.$PUSH$("d", "e")}, {name:"SUB n", $ast$:$o$$.$SUB$()}, {name:"RST 0x10", $ast$:$o$$.$RST$(16)}, {name:"RET C", $ast$:$o$$.$RET$("!=", "F_CARRY")}, {name:"EXX", $ast$:$o$$.$EXX$()}, {name:"JP C,(nn)", $ast$:$o$$.$JP$("!=", "F_CARRY")}, {name:"IN A,(n)", $ast$:$o$$.$IN$("a")}, {name:"CALL C (nn)", $ast$:$o$$.$CALL$("!=", "F_CARRY")}, $generateIndexTable$$("IX"), {name:"SBC A,n", $ast$:$o$$.$SBC$()}, {name:"RST 0x18", $ast$:$o$$.$RST$(24)}, 
{name:"RET PO", $ast$:$o$$.$RET$("==", "F_PARITY")}, {name:"POP HL", $ast$:$o$$.$POP$("h", "l")}, {name:"JP PO,(nn)", $ast$:$o$$.$JP$("==", "F_PARITY")}, {name:"EX (SP),HL", $ast$:$o$$.$EX_SP_HL$()}, {name:"CALL PO (nn)", $ast$:$o$$.$CALL$("==", "F_PARITY")}, {name:"PUSH HL", $ast$:$o$$.$PUSH$("h", "l")}, {name:"AND (n)", $ast$:$o$$.$AND$()}, {name:"RST 0x20", $ast$:$o$$.$RST$(32)}, {name:"RET PE", $ast$:$o$$.$RET$("!=", "F_PARITY")}, {name:"JP (HL)", $ast$:$o$$.$JP$("h", "l")}, {name:"JP PE,(nn)", 
$ast$:$o$$.$JP$("!=", "F_PARITY")}, {name:"EX DE,HL", $ast$:$o$$.$EX_DE_HL$()}, {name:"CALL PE (nn)", $ast$:$o$$.$CALL$("!=", "F_PARITY")}, $opcodeTableED$$, {name:"XOR n", $ast$:$o$$.$XOR$()}, {name:"RST 0x28", $ast$:$o$$.$RST$(40)}, {name:"RET P", $ast$:$o$$.$RET$("==", "F_SIGN")}, {name:"POP AF", $ast$:$o$$.$POP$("a", "f")}, {name:"JP P,(nn)", $ast$:$o$$.$JP$("==", "F_SIGN")}, {name:"DI", $ast$:$o$$.$DI$()}, {name:"CALL P (nn)", $ast$:$o$$.$CALL$("==", "F_SIGN")}, {name:"PUSH AF", $ast$:$o$$.$PUSH$("a", 
"f")}, {name:"OR n", $ast$:$o$$.$OR$()}, {name:"RST 0x30", $ast$:$o$$.$RST$(48)}, {name:"RET M", $ast$:$o$$.$RET$("!=", "F_SIGN")}, {name:"LD SP,HL", $ast$:$o$$.$LD_SP$("h", "l")}, {name:"JP M,(nn)", $ast$:$o$$.$JP$("!=", "F_SIGN")}, {name:"EI", $ast$:$o$$.$EI$()}, {name:"CALL M (nn)", $ast$:$o$$.$CALL$("!=", "F_SIGN")}, $generateIndexTable$$("IY"), {name:"CP n", $ast$:$o$$.$CP$()}, {name:"RST 0x38", $ast$:$o$$.$RST$(56)}];
function $Analyzer$$() {
  this.$a$ = {};
  this.$ast$ = [];
  this.$b$ = {}
}
$Analyzer$$.prototype = {$analyze$:function $$Analyzer$$$$$analyze$$($bytecodes_i$$29$$) {
  this.$a$ = $bytecodes_i$$29$$;
  this.$ast$ = Array(this.$a$.length);
  window.console.time("Analyzing");
  for($bytecodes_i$$29$$ = 0;$bytecodes_i$$29$$ < this.$a$.length;$bytecodes_i$$29$$++) {
    $JSCompiler_StaticMethods_normalizeBytecode$$(this, $bytecodes_i$$29$$), $JSCompiler_StaticMethods_restructure$$(this, $bytecodes_i$$29$$)
  }
  window.console.timeEnd("Analyzing");
  for($bytecodes_i$$29$$ in this.$b$) {
    console.error("Missing opcode", $bytecodes_i$$29$$, this.$b$[$bytecodes_i$$29$$])
  }
}, $analyzeFromAddress$:function $$Analyzer$$$$$analyzeFromAddress$$($bytecodes$$1$$) {
  this.$a$ = [$bytecodes$$1$$];
  this.$ast$ = [];
  this.$b$ = {};
  $JSCompiler_StaticMethods_normalizeBytecode$$(this, 0);
  this.$a$[0][this.$a$[0].length - 1].$isFunctionEnder$ = !0;
  this.$ast$ = [this.$a$];
  for(var $i$$30$$ in this.$b$) {
    console.error("Missing opcode", $i$$30$$, this.$b$[$i$$30$$])
  }
}};
function $JSCompiler_StaticMethods_restructure$$($JSCompiler_StaticMethods_restructure$self$$, $page$$6$$) {
  $JSCompiler_StaticMethods_restructure$self$$.$ast$[$page$$6$$] = [];
  var $pointer$$ = -1, $startNewFunction$$ = !0, $prevBytecode$$ = {};
  $JSCompiler_StaticMethods_restructure$self$$.$a$[$page$$6$$].forEach(function($bytecode$$8$$) {
    if($bytecode$$8$$.$isJumpTarget$ || $startNewFunction$$) {
      $pointer$$++, $JSCompiler_StaticMethods_restructure$self$$.$ast$[$page$$6$$][$pointer$$] = [], $startNewFunction$$ = !1, $prevBytecode$$.$isFunctionEnder$ = !0
    }
    $JSCompiler_StaticMethods_restructure$self$$.$ast$[$page$$6$$][$pointer$$].push($bytecode$$8$$);
    $bytecode$$8$$.$isFunctionEnder$ && ($startNewFunction$$ = !0);
    $prevBytecode$$ = $bytecode$$8$$
  })
}
function $JSCompiler_StaticMethods_normalizeBytecode$$($JSCompiler_StaticMethods_normalizeBytecode$self$$, $page$$5$$) {
  $JSCompiler_StaticMethods_normalizeBytecode$self$$.$a$[$page$$5$$] = $JSCompiler_StaticMethods_normalizeBytecode$self$$.$a$[$page$$5$$].map(function($bytecode$$7$$) {
    switch($bytecode$$7$$.$opcode$.length) {
      case 1:
        var $i$$31_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]];
        break;
      case 2:
        $i$$31_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]][$bytecode$$7$$.$opcode$[1]];
        break;
      case 3:
        $i$$31_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]][$bytecode$$7$$.$opcode$[1]][$bytecode$$7$$.$opcode$[2]];
        break;
      default:
        throw Error("Something went wrong in parsing. Opcode: [" + $bytecode$$7$$.$opcode$.join(",") + "]");
    }
    if($i$$31_opcode$$18$$ && $i$$31_opcode$$18$$.$ast$) {
      var $ast$$ = $i$$31_opcode$$18$$.$ast$($bytecode$$7$$.$operand$, $bytecode$$7$$.target, $bytecode$$7$$.$nextAddress$);
      Array.isArray($ast$$) || void 0 == $ast$$ || ($ast$$ = [$ast$$]);
      $bytecode$$7$$.$ast$ = $ast$$;
      $bytecode$$7$$.name = $i$$31_opcode$$18$$.name;
      $i$$31_opcode$$18$$.$opcode$ && ($bytecode$$7$$.$opcode$ = $i$$31_opcode$$18$$.$opcode$($bytecode$$7$$.$operand$, $bytecode$$7$$.target, $bytecode$$7$$.$nextAddress$))
    }else {
      $i$$31_opcode$$18$$ = $bytecode$$7$$.$hexOpcode$, $JSCompiler_StaticMethods_normalizeBytecode$self$$.$b$[$i$$31_opcode$$18$$] = void 0 != $JSCompiler_StaticMethods_normalizeBytecode$self$$.$b$[$i$$31_opcode$$18$$] ? $JSCompiler_StaticMethods_normalizeBytecode$self$$.$b$[$i$$31_opcode$$18$$] + 1 : 1
    }
    return $bytecode$$7$$
  })
}
;function $Optimizer$$() {
  this.$ast$ = []
}
$Optimizer$$.prototype = {$optimize$:function $$Optimizer$$$$$optimize$$($functions_i$$32$$) {
  this.$ast$ = $functions_i$$32$$;
  for($functions_i$$32$$ = 0;$functions_i$$32$$ < this.$ast$.length;$functions_i$$32$$++) {
  }
}};
var $whitelist$$ = "F_CARRY F_NEGATIVE F_PARITY F_OVERFLOW F_BIT3 F_HALFCARRY F_BIT5 F_ZERO F_SIGN BIT_0 BIT_1 BIT_2 BIT_3 BIT_4 BIT_5 BIT_6 BIT_7 temp location JSSMS.Utils.rndInt".split(" ");
function $Generator$$() {
  this.$ast$ = []
}
$Generator$$.prototype = {$generate$:function $$Generator$$$$$generate$$($functions$$1$$) {
  var $toHex$$7$$ = $JSSMS$Utils$toHex$$;
  window.console.time("Generating");
  for(var $page$$8$$ = 0;$page$$8$$ < $functions$$1$$.length;$page$$8$$++) {
    $functions$$1$$[$page$$8$$] = $functions$$1$$[$page$$8$$].map(function($fn$$4$$) {
      var $body$$2$$ = [], $name$$61$$ = $fn$$4$$[0].$address$, $tstates$$2$$ = 0;
      $fn$$4$$ = $fn$$4$$.map(function($bytecode$$9$$) {
        null == $bytecode$$9$$.$ast$ && ($bytecode$$9$$.$ast$ = []);
        var $decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$ = $bytecode$$9$$.$opcode$, $tstates$$inline_253$$ = 0;
        switch($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[0]) {
          case 203:
            $tstates$$inline_253$$ = $OP_CB_STATES$$[$decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[1]];
            break;
          case 221:
          ;
          case 253:
            $tstates$$inline_253$$ = 2 == $decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$.length ? $OP_DD_STATES$$[$decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[1]] : $OP_INDEX_CB_STATES$$[$decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[2]];
            break;
          case 237:
            $tstates$$inline_253$$ = $OP_ED_STATES$$[$decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[1]];
            break;
          default:
            $tstates$$inline_253$$ = $OP_STATES$$[$decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[0]]
        }
        $tstates$$2$$ += $tstates$$inline_253$$;
        if($bytecode$$9$$.$isFunctionEnder$ || $bytecode$$9$$.$canEnd$ || null != $bytecode$$9$$.target) {
          $decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$ = [{type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"-=", left:{type:"Identifier", name:"tstates"}, right:{type:"Literal", value:$tstates$$2$$}}}], $decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[0].expression.right.value && ($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[0].expression.right.raw = $toHex$$7$$($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$[0].expression.right.value)), 
          $bytecode$$9$$.$ast$ = [].concat($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$, $bytecode$$9$$.$ast$), $tstates$$2$$ = 0
        }
        null != $bytecode$$9$$.$nextAddress$ && ($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$ = {type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"=", left:{type:"Identifier", name:"pc"}, right:{type:"Literal", value:$bytecode$$9$$.$nextAddress$}}}, $decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$.expression.right.raw = $toHex$$7$$($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$.expression.right.value), $bytecode$$9$$.$ast$.push($decreaseTStateStmt_opcodes$$inline_252_updatePcStmt$$));
        $bytecode$$9$$.$ast$[0] && ($bytecode$$9$$.$ast$[0].$leadingComments$ = [{type:"Line", value:" " + $bytecode$$9$$.label}]);
        return $bytecode$$9$$.$ast$
      });
      $fn$$4$$.forEach(function($ast$$3$$) {
        $body$$2$$ = $body$$2$$.concat($ast$$3$$)
      });
      $body$$2$$ = $JSCompiler_StaticMethods_convertRegisters$$($body$$2$$);
      $body$$2$$ = $JSSMS$Utils$traverse$$($body$$2$$, function($obj$$38$$) {
        $obj$$38$$.type && ("Identifier" == $obj$$38$$.type && -1 == $whitelist$$.indexOf($obj$$38$$.name)) && ($obj$$38$$.name = "this." + $obj$$38$$.name);
        return $obj$$38$$
      });
      return{type:"Program", body:[{type:"FunctionDeclaration", id:{type:"Identifier", name:$name$$61$$}, params:[{type:"Identifier", name:"temp"}, {type:"Identifier", name:"location"}], defaults:[], body:{type:"BlockStatement", body:$body$$2$$}, rest:null, generator:!1, expression:!1}]}
    })
  }
  window.console.timeEnd("Generating");
  this.$ast$ = $functions$$1$$
}};
function $JSCompiler_StaticMethods_convertRegisters$$($ast$$4$$) {
  return $JSSMS$Utils$traverse$$($ast$$4$$, function($node$$4$$) {
    "Register" == $node$$4$$.type && ($node$$4$$.type = "Identifier");
    return $node$$4$$
  })
}
;function $Recompiler$$($cpu$$) {
  this.$cpu$ = $cpu$$;
  this.$rom$ = [];
  this.$b$ = {};
  this.$a$ = {};
  this.$c$ = new $Analyzer$$;
  this.$h$ = new $Optimizer$$;
  this.$g$ = new $Generator$$;
  this.$f$ = {}
}
$Recompiler$$.prototype = {reset:function $$Recompiler$$$$reset$() {
  var $self$$7$$ = this;
  this.$b$.$entryPoints$ = [{$address$:0, $romPage$:0, $memPage$:0}, {$address$:56, $romPage$:0, $memPage$:0}, {$address$:102, $romPage$:0, $memPage$:0}];
  2 >= this.$rom$.length ? $JSSMS$Utils$console$log$$("Parsing full ROM") : (this.$b$.$pageLimit$ = 0, $JSSMS$Utils$console$log$$("Parsing initial memory page of ROM"));
  for(var $fns$$ = this.parse().$analyze$().$optimize$().$generate$(), $page$$9$$ = 0;$page$$9$$ < this.$rom$.length;$page$$9$$++) {
    $fns$$[$page$$9$$].forEach(function($code$$11_fn$$5$$) {
      var $funcName$$ = $code$$11_fn$$5$$.body[0].id.name;
      $code$$11_fn$$5$$.body[0].id.name = "_" + $JSSMS$Utils$toHex$$($funcName$$);
      $code$$11_fn$$5$$ = $JSCompiler_StaticMethods_generateCodeFromAst$$($code$$11_fn$$5$$);
      $self$$7$$.$cpu$.$G$[$page$$9$$][$funcName$$] = (new Function("return " + $code$$11_fn$$5$$))()
    })
  }
}, parse:function $$Recompiler$$$$parse$() {
  var $self$$8$$ = this;
  this.$b$.$entryPoints$.forEach(function($entryPoint$$3$$) {
    $self$$8$$.$a$.$addEntryPoint$($entryPoint$$3$$)
  });
  this.$a$.parse(this.$b$.$pageLimit$);
  return this
}, $analyze$:function $$Recompiler$$$$$analyze$$() {
  this.$c$.$analyze$(this.$a$.$instructions$);
  return this
}, $optimize$:function $$Recompiler$$$$$optimize$$() {
  this.$h$.$optimize$(this.$c$.$ast$);
  return this
}, $generate$:function $$Recompiler$$$$$generate$$() {
  this.$g$.$generate$(this.$h$.$ast$);
  return this.$g$.$ast$
}, $parseFromAddress$:function $$Recompiler$$$$$parseFromAddress$$($address$$23_obj$$39$$, $romPage$$4$$, $memPage$$2$$) {
  $address$$23_obj$$39$$ = {$address$:$address$$23_obj$$39$$, $romPage$:$romPage$$4$$, $memPage$:$memPage$$2$$};
  this.$a$.$entryPoints$.push($address$$23_obj$$39$$);
  this.$f$ = this.$a$.$parseFromAddress$($address$$23_obj$$39$$);
  return this
}, $analyzeFromAddress$:function $$Recompiler$$$$$analyzeFromAddress$$() {
  this.$c$.$analyzeFromAddress$(this.$f$);
  return this
}};
function $JSCompiler_StaticMethods_generateCodeFromAst$$($fn$$7$$) {
  return window.escodegen.generate($fn$$7$$, {$comment$:!0, $renumber$:!0, $hexadecimal$:!0, parse:window.esprima.parse})
}
function $JSCompiler_StaticMethods_recompileFromAddress$$($JSCompiler_StaticMethods_recompileFromAddress$self$$, $address$$22$$, $romPage$$3$$, $memPage$$1$$) {
  $JSCompiler_StaticMethods_recompileFromAddress$self$$.$parseFromAddress$($address$$22$$, $romPage$$3$$, $memPage$$1$$).$analyzeFromAddress$().$optimize$().$generate$()[0].forEach(function($code$$12_fn$$6$$) {
    $code$$12_fn$$6$$.body[0].id.name = "_" + $JSSMS$Utils$toHex$$($code$$12_fn$$6$$.body[0].id.name);
    $code$$12_fn$$6$$ = $JSCompiler_StaticMethods_generateCodeFromAst$$($code$$12_fn$$6$$);
    $JSCompiler_StaticMethods_recompileFromAddress$self$$.$cpu$.$G$[$romPage$$3$$][$address$$22$$ % 16384] = (new Function("return " + $code$$12_fn$$6$$))()
  })
}
;window.JSSMS = $JSSMS$$;

