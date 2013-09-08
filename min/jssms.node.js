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
(function(window){'use strict';function $JSCompiler_emptyFn$$() {
  return function() {
  }
}
var $SUPPORT_TYPED_ARRAYS$$ = "Uint8Array" in window, $SUPPORT_DATAVIEW$$ = "ArrayBuffer" in window && "DataView" in window;
function $JSSMS$$($opts$$) {
  this.$c$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if(void 0 != $opts$$) {
    for(var $key$$16$$ in this.$c$) {
      void 0 != $opts$$[$key$$16$$] && (this.$c$[$key$$16$$] = $opts$$[$key$$16$$])
    }
  }
  this.$keyboard$ = new $JSSMS$Keyboard$$(this);
  this.$a$ = new this.$c$.ui(this);
  this.$vdp$ = new $JSSMS$Vdp$$(this);
  this.$b$ = new $JSSMS$SN76489$$(this);
  this.$f$ = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$a$.updateStatus("Ready to load a ROM.");
  this.ui = this.$a$
}
$JSSMS$$.prototype = {$isRunning$:!1, $cyclesPerLine$:0, $no_of_scanlines$:0, $fps$:0, $pause_button$:!1, $is_sms$:!0, $is_gg$:!1, $soundEnabled$:!1, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $fpsFrameCount$:0, $romData$:"", $romFileName$:"", $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ = this.$vdp$.$N$, $clockSpeedHz$$inline_24_v$$inline_26$$ = 0;
  0 == $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $clockSpeedHz$$inline_24_v$$inline_26$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $clockSpeedHz$$inline_24_v$$inline_26$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($clockSpeedHz$$inline_24_v$$inline_26$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$vdp$.$N$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$;
  if(this.$soundEnabled$) {
    this.$b$.$o$($clockSpeedHz$$inline_24_v$$inline_26$$, 44100);
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $fractional$$inline_27$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$++) {
        $clockSpeedHz$$inline_24_v$$inline_26$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_27$$, $fractional$$inline_27$$ = $clockSpeedHz$$inline_24_v$$inline_26$$ - ($clockSpeedHz$$inline_24_v$$inline_26$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$] = $clockSpeedHz$$inline_24_v$$inline_26$$ >> 16
      }
    }
  }
  this.$keyboard$.reset();
  this.$a$.reset();
  this.$vdp$.reset();
  this.$f$.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ = this.$cpu$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$.$instructions$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$.$main$.$a$.updateStatus("Parsing instructions...");
  $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$);
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$.$main$.$a$.updateStatus("Instructions parsed");
  clearInterval(this.$g$)
}, start:function $$JSSMS$$$$start$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = !0, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen), this.$h$ = $JSSMS$Utils$getTimestamp$$(), this.$fpsFrameCount$ = 0, this.$g$ = setInterval(function() {
    var $now$$inline_34$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$a$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_34$$ - $self$$1$$.$h$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$h$ = $now$$inline_34$$
  }, 500));
  this.$a$.updateStatus("Running")
}, stop:function $$JSSMS$$$$stop$() {
  clearInterval(this.$g$);
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
  var $mode$$9_pages$$;
  $mode$$9_pages$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$ = $data$$30$$.length;
  1 == $mode$$9_pages$$ ? ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = !0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = !1, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$F$ = 0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$K$ = 32) : 2 == $mode$$9_pages$$ && ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = !0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = !1, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$F$ = 5, 
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$K$ = 27);
  if(16384 >= $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$) {
    return!1
  }
  $mode$$9_pages$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$loadROM$($data$$30$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$);
  if(null == $mode$$9_pages$$) {
    return!1
  }
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$cpu$, $i$$inline_42$$ = 0;
  $mode$$9_pages$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$rom$ = $mode$$9_pages$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$S$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$S$ - 1;
    for($i$$inline_42$$ = 0;3 > $i$$inline_42$$;$i$$inline_42$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$frameReg$[$i$$inline_42$$] = $i$$inline_42$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$S$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$S$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$romPageMask$ = 0
  }
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romData$ = $data$$30$$;
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romFileName$ = $fileName$$;
  return!0
}
;"console" in window ? "bind" in window.console.log || (window.console.log = function($fn$$inline_57$$) {
  return function($msg$$inline_58$$) {
    return $fn$$inline_57$$($msg$$inline_58$$)
  }
}(window.console.log), window.console.error = function($fn$$inline_59$$) {
  return function($msg$$inline_60$$) {
    return $fn$$inline_59$$($msg$$inline_60$$)
  }
}(window.console.error)) : window.console = {log:$JSCompiler_emptyFn$$(), error:$JSCompiler_emptyFn$$()};
var $JSSMS$Utils$Uint8Array$$ = $SUPPORT_TYPED_ARRAYS$$ ? Uint8Array : Array, $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array, $JSSMS$Utils$console$log$$ = window.console.log.bind(window.console), $JSSMS$Utils$console$error$$ = window.console.error.bind(window.console), $JSSMS$Utils$console$time$$ = window.console.time ? window.console.time.bind(window.console) : $JSCompiler_emptyFn$$(), $JSSMS$Utils$console$timeEnd$$ = window.console.timeEnd ? window.console.timeEnd.bind(window.console) : $JSCompiler_emptyFn$$(), $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? window.performance.now.bind(window.performance) : 
function() {
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
function $JSSMS$Z80$$($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$) {
  this.$main$ = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;
  this.$vdp$ = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$.$vdp$;
  this.port = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$.$f$;
  this.$Q$ = this.$n$ = this.$b$ = 0;
  this.$I$ = this.$P$ = this.$O$ = this.$K$ = this.$J$ = !1;
  this.$o$ = this.$ba$ = this.$c$ = this.$U$ = this.$v$ = this.$s$ = this.$t$ = this.$q$ = this.$da$ = this.$ca$ = this.$l$ = this.$j$ = this.$aa$ = this.$Z$ = this.$e$ = this.$d$ = this.$Y$ = this.$X$ = this.$g$ = this.$h$ = this.$W$ = this.$a$ = this.$R$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$S$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$ea$ = Array(2048);
  this.$V$ = Array(256);
  this.$m$ = Array(256);
  this.$N$ = Array(256);
  this.$M$ = Array(256);
  this.$F$ = Array(131072);
  this.$w$ = Array(131072);
  this.$T$ = Array(256);
  var $c$$inline_79_padc$$inline_70_sf$$inline_64$$, $h$$inline_80_psub$$inline_71_zf$$inline_65$$, $n$$inline_81_psbc$$inline_72_yf$$inline_66$$, $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$, $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$, $flags$$inline_266_newval$$inline_75$$;
  for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;256 > $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++) {
    $c$$inline_79_padc$$inline_70_sf$$inline_64$$ = 0 != ($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ & 128) ? 128 : 0, $h$$inline_80_psub$$inline_71_zf$$inline_65$$ = 0 == $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ ? 64 : 0, $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ & 32, $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ & 
    8, $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$) ? 4 : 0, this.$V$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = $c$$inline_79_padc$$inline_70_sf$$inline_64$$ | $h$$inline_80_psub$$inline_71_zf$$inline_65$$ | $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ | $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$, this.$m$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = 
    $c$$inline_79_padc$$inline_70_sf$$inline_64$$ | $h$$inline_80_psub$$inline_71_zf$$inline_65$$ | $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ | $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ | $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$, this.$N$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = $c$$inline_79_padc$$inline_70_sf$$inline_64$$ | $h$$inline_80_psub$$inline_71_zf$$inline_65$$ | $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ | $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$, 
    this.$N$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 128 == $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ ? 4 : 0, this.$N$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 0 == ($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ & 15) ? 16 : 0, this.$M$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = $c$$inline_79_padc$$inline_70_sf$$inline_64$$ | $h$$inline_80_psub$$inline_71_zf$$inline_65$$ | $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ | 
    $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ | 2, this.$M$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 127 == $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ ? 4 : 0, this.$M$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 15 == ($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ & 15) ? 16 : 0, this.$T$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = 0 != $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ ? 
    $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ & 128 : 68, this.$T$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ | $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ | 16
  }
  $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;
  $c$$inline_79_padc$$inline_70_sf$$inline_64$$ = 65536;
  $h$$inline_80_psub$$inline_71_zf$$inline_65$$ = 0;
  $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ = 65536;
  for($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ = 0;256 > $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$;$JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$++) {
    for($flags$$inline_266_newval$$inline_75$$ = 0;256 > $flags$$inline_266_newval$$inline_75$$;$flags$$inline_266_newval$$inline_75$$++) {
      $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ = $flags$$inline_266_newval$$inline_75$$ - $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$, this.$F$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = 0 != $flags$$inline_266_newval$$inline_75$$ ? 0 != ($flags$$inline_266_newval$$inline_75$$ & 128) ? 128 : 0 : 64, this.$F$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= $flags$$inline_266_newval$$inline_75$$ & 40, ($flags$$inline_266_newval$$inline_75$$ & 
      15) < ($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ & 15) && (this.$F$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 16), $flags$$inline_266_newval$$inline_75$$ < $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ && (this.$F$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ ^ $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ ^ 128) & ($JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ ^ 
      $flags$$inline_266_newval$$inline_75$$) & 128) && (this.$F$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] |= 4), $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++, $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ = $flags$$inline_266_newval$$inline_75$$ - $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ - 1, this.$F$[$c$$inline_79_padc$$inline_70_sf$$inline_64$$] = 0 != $flags$$inline_266_newval$$inline_75$$ ? 0 != ($flags$$inline_266_newval$$inline_75$$ & 
      128) ? 128 : 0 : 64, this.$F$[$c$$inline_79_padc$$inline_70_sf$$inline_64$$] |= $flags$$inline_266_newval$$inline_75$$ & 40, ($flags$$inline_266_newval$$inline_75$$ & 15) <= ($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ & 15) && (this.$F$[$c$$inline_79_padc$$inline_70_sf$$inline_64$$] |= 16), $flags$$inline_266_newval$$inline_75$$ <= $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ && (this.$F$[$c$$inline_79_padc$$inline_70_sf$$inline_64$$] |= 1), 0 != (($JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ ^ 
      $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ ^ 128) & ($JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ ^ $flags$$inline_266_newval$$inline_75$$) & 128) && (this.$F$[$c$$inline_79_padc$$inline_70_sf$$inline_64$$] |= 4), $c$$inline_79_padc$$inline_70_sf$$inline_64$$++, $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ = $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ - $flags$$inline_266_newval$$inline_75$$, this.$w$[$h$$inline_80_psub$$inline_71_zf$$inline_65$$] = 
      0 != $flags$$inline_266_newval$$inline_75$$ ? 0 != ($flags$$inline_266_newval$$inline_75$$ & 128) ? 130 : 2 : 66, this.$w$[$h$$inline_80_psub$$inline_71_zf$$inline_65$$] |= $flags$$inline_266_newval$$inline_75$$ & 40, ($flags$$inline_266_newval$$inline_75$$ & 15) > ($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ & 15) && (this.$w$[$h$$inline_80_psub$$inline_71_zf$$inline_65$$] |= 16), $flags$$inline_266_newval$$inline_75$$ > $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ && 
      (this.$w$[$h$$inline_80_psub$$inline_71_zf$$inline_65$$] |= 1), 0 != (($JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ ^ $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$) & ($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ ^ $flags$$inline_266_newval$$inline_75$$) & 128) && (this.$w$[$h$$inline_80_psub$$inline_71_zf$$inline_65$$] |= 4), $h$$inline_80_psub$$inline_71_zf$$inline_65$$++, $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ = $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ - 
      $flags$$inline_266_newval$$inline_75$$ - 1, this.$w$[$n$$inline_81_psbc$$inline_72_yf$$inline_66$$] = 0 != $flags$$inline_266_newval$$inline_75$$ ? 0 != ($flags$$inline_266_newval$$inline_75$$ & 128) ? 130 : 2 : 66, this.$w$[$n$$inline_81_psbc$$inline_72_yf$$inline_66$$] |= $flags$$inline_266_newval$$inline_75$$ & 40, ($flags$$inline_266_newval$$inline_75$$ & 15) >= ($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ & 15) && (this.$w$[$n$$inline_81_psbc$$inline_72_yf$$inline_66$$] |= 
      16), $flags$$inline_266_newval$$inline_75$$ >= $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ && (this.$w$[$n$$inline_81_psbc$$inline_72_yf$$inline_66$$] |= 1), 0 != (($JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ ^ $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$) & ($JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ ^ $flags$$inline_266_newval$$inline_75$$) & 128) && (this.$w$[$n$$inline_81_psbc$$inline_72_yf$$inline_66$$] |= 4), $n$$inline_81_psbc$$inline_72_yf$$inline_66$$++
    }
  }
  for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 256;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$--;) {
    for($c$$inline_79_padc$$inline_70_sf$$inline_64$$ = 0;1 >= $c$$inline_79_padc$$inline_70_sf$$inline_64$$;$c$$inline_79_padc$$inline_70_sf$$inline_64$$++) {
      for($h$$inline_80_psub$$inline_71_zf$$inline_65$$ = 0;1 >= $h$$inline_80_psub$$inline_71_zf$$inline_65$$;$h$$inline_80_psub$$inline_71_zf$$inline_65$$++) {
        for($n$$inline_81_psbc$$inline_72_yf$$inline_66$$ = 0;1 >= $n$$inline_81_psbc$$inline_72_yf$$inline_66$$;$n$$inline_81_psbc$$inline_72_yf$$inline_66$$++) {
          $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$ = this.$ea$;
          $JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$ = $c$$inline_79_padc$$inline_70_sf$$inline_64$$ << 8 | $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ << 9 | $h$$inline_80_psub$$inline_71_zf$$inline_65$$ << 10 | $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;
          $flags$$inline_266_newval$$inline_75$$ = $c$$inline_79_padc$$inline_70_sf$$inline_64$$ | $n$$inline_81_psbc$$inline_72_yf$$inline_66$$ << 1 | $h$$inline_80_psub$$inline_71_zf$$inline_65$$ << 4;
          this.$a$ = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;
          this.$c$ = $flags$$inline_266_newval$$inline_75$$;
          var $a_copy$$inline_267$$ = this.$a$, $correction$$inline_268$$ = 0, $carry$$inline_269$$ = $flags$$inline_266_newval$$inline_75$$ & 1, $carry_copy$$inline_270$$ = $carry$$inline_269$$;
          if(0 != ($flags$$inline_266_newval$$inline_75$$ & 16) || 9 < ($a_copy$$inline_267$$ & 15)) {
            $correction$$inline_268$$ |= 6
          }
          if(1 == $carry$$inline_269$$ || 159 < $a_copy$$inline_267$$ || 143 < $a_copy$$inline_267$$ && 9 < ($a_copy$$inline_267$$ & 15)) {
            $correction$$inline_268$$ |= 96, $carry_copy$$inline_270$$ = 1
          }
          153 < $a_copy$$inline_267$$ && ($carry_copy$$inline_270$$ = 1);
          0 != ($flags$$inline_266_newval$$inline_75$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_268$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_268$$);
          $flags$$inline_266_newval$$inline_75$$ = this.$c$ & 254 | $carry_copy$$inline_270$$;
          $flags$$inline_266_newval$$inline_75$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_266_newval$$inline_75$$ & 251 | 4 : $flags$$inline_266_newval$$inline_75$$ & 251;
          $JSCompiler_temp_const$$262_val$$inline_73_xf$$inline_67$$[$JSCompiler_temp_const$$261_oldval$$inline_74_pf$$inline_68$$] = this.$a$ | $flags$$inline_266_newval$$inline_75$$ << 8
        }
      }
    }
  }
  this.$a$ = this.$c$ = 0;
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;8192 > $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$, 0)
    }
  }else {
    for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;8192 > $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++) {
      this.$memWriteMap$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = 0
    }
  }
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;32768 > $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++) {
      this.$sram$.setUint8($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$, 0)
    }
  }else {
    for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;32768 > $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++) {
      this.$sram$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = 0
    }
  }
  this.$S$ = 2;
  for($i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ = 0;4 > $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$;$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$++) {
    this.$frameReg$[$i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$] = $i$$inline_63_i$$inline_78_i$$inline_84_padd$$inline_69_sms$$ % 3
  }
  for(var $method$$3$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$3$$] = $JSSMS$Debugger$$.prototype[$method$$3$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$b$ = this.$ba$ = this.$c$ = this.$U$ = this.$s$ = this.$v$ = this.$q$ = this.$t$ = this.$j$ = this.$l$ = this.$ca$ = this.$da$ = this.$d$ = this.$e$ = this.$Z$ = this.$aa$ = this.$h$ = this.$g$ = this.$X$ = this.$Y$ = this.$a$ = this.$W$ = 0;
  this.$n$ = 57328;
  this.$Q$ = this.$o$ = 0;
  this.$P$ = this.$K$ = this.$J$ = !1;
  this.$R$ = 0;
  this.$O$ = !1
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? (this.push(this.$b$ + 2), this.$b$ = this.$p$(this.$b$), this.$o$ -= 7) : this.$b$ += 2
}, push:function $$JSSMS$Z80$$$$push$($value$$47$$) {
  this.$n$ -= 2;
  this.$G$(this.$n$, $value$$47$$)
}, $i$:$SUPPORT_DATAVIEW$$ ? function($address$$, $value$$74$$) {
  if(65535 >= $address$$) {
    this.$memWriteMap$.setUint8($address$$ & 8191, $value$$74$$), 65532 == $address$$ ? this.$frameReg$[3] = $value$$74$$ : 65533 == $address$$ ? this.$frameReg$[0] = $value$$74$$ & this.$romPageMask$ : 65534 == $address$$ ? this.$frameReg$[1] = $value$$74$$ & this.$romPageMask$ : 65535 == $address$$ && (this.$frameReg$[2] = $value$$74$$ & this.$romPageMask$)
  }else {
    $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$));
    debugger
  }
} : function($address$$1$$, $value$$75$$) {
  if(65535 >= $address$$1$$) {
    this.$memWriteMap$[$address$$1$$ & 8191] = $value$$75$$, 65532 == $address$$1$$ ? this.$frameReg$[3] = $value$$75$$ : 65533 == $address$$1$$ ? this.$frameReg$[0] = $value$$75$$ & this.$romPageMask$ : 65534 == $address$$1$$ ? this.$frameReg$[1] = $value$$75$$ & this.$romPageMask$ : 65535 == $address$$1$$ && (this.$frameReg$[2] = $value$$75$$ & this.$romPageMask$)
  }else {
    $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$1$$));
    debugger
  }
}, $G$:$SUPPORT_DATAVIEW$$ ? function($address$$2$$, $value$$76$$) {
  if(65532 > $address$$2$$) {
    this.$memWriteMap$.setUint16($address$$2$$ & 8191, $value$$76$$, !0)
  }else {
    if(65532 == $address$$2$$) {
      this.$frameReg$[3] = $value$$76$$ & 255, this.$frameReg$[0] = $value$$76$$ >> 8 & this.$romPageMask$
    }else {
      if(65533 == $address$$2$$) {
        this.$frameReg$[0] = $value$$76$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$76$$ >> 8 & this.$romPageMask$
      }else {
        if(65534 == $address$$2$$) {
          this.$frameReg$[1] = $value$$76$$ & 255 & this.$romPageMask$, this.$frameReg$[2] = $value$$76$$ >> 8 & this.$romPageMask$
        }else {
          $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$2$$));
          debugger
        }
      }
    }
  }
} : function($address$$3$$, $value$$77$$) {
  if(65532 > $address$$3$$) {
    $address$$3$$ &= 8191, this.$memWriteMap$[$address$$3$$++] = $value$$77$$ & 255, this.$memWriteMap$[$address$$3$$] = $value$$77$$ >> 8
  }else {
    if(65532 == $address$$3$$) {
      this.$frameReg$[3] = $value$$77$$ & 255, this.$frameReg$[0] = $value$$77$$ >> 8 & this.$romPageMask$
    }else {
      if(65533 == $address$$3$$) {
        this.$frameReg$[0] = $value$$77$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$77$$ >> 8 & this.$romPageMask$
      }else {
        if(65534 == $address$$3$$) {
          this.$frameReg$[1] = $value$$77$$ & 255 & this.$romPageMask$, this.$frameReg$[2] = $value$$77$$ >> 8 & this.$romPageMask$
        }else {
          $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$3$$));
          debugger
        }
      }
    }
  }
}, $f$:$SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
  if(1024 > $address$$4$$) {
    return this.$rom$[0].getUint8($address$$4$$)
  }
  if(16384 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[0]].getUint8($address$$4$$)
  }
  if(32768 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[1]].getUint8($address$$4$$ - 16384)
  }
  if(49152 > $address$$4$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$4$$ - 32768) : 12 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$4$$ - 16384) : this.$rom$[this.$frameReg$[2]].getUint8($address$$4$$ - 32768)
  }
  if(57344 > $address$$4$$) {
    return this.$memWriteMap$.getUint8($address$$4$$ - 49152)
  }
  if(65532 > $address$$4$$) {
    return this.$memWriteMap$.getUint8($address$$4$$ - 57344)
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
    return this.$rom$[0][$address$$5$$]
  }
  if(16384 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[0]][$address$$5$$]
  }
  if(32768 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[1]][$address$$5$$ - 16384]
  }
  if(49152 > $address$$5$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 16384] : this.$rom$[this.$frameReg$[2]][$address$$5$$ - 32768]
  }
  if(57344 > $address$$5$$) {
    return this.$memWriteMap$[$address$$5$$ - 49152]
  }
  if(65532 > $address$$5$$) {
    return this.$memWriteMap$[$address$$5$$ - 57344]
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
}, $p$:$SUPPORT_DATAVIEW$$ ? function($address$$6$$) {
  if(1024 > $address$$6$$) {
    return this.$rom$[0].getUint16($address$$6$$, !0)
  }
  if(16384 > $address$$6$$) {
    return this.$rom$[this.$frameReg$[0]].getUint16($address$$6$$, !0)
  }
  if(32768 > $address$$6$$) {
    return this.$rom$[this.$frameReg$[1]].getUint16($address$$6$$ - 16384, !0)
  }
  if(49152 > $address$$6$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$6$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$6$$ - 16384] : this.$rom$[this.$frameReg$[2]].getUint16($address$$6$$ - 32768, !0)
  }
  if(57344 > $address$$6$$) {
    return this.$memWriteMap$.getUint16($address$$6$$ - 49152, !0)
  }
  if(65532 > $address$$6$$) {
    return this.$memWriteMap$.getUint16($address$$6$$ - 57344, !0)
  }
  if(65532 == $address$$6$$) {
    return this.$frameReg$[3]
  }
  if(65533 == $address$$6$$) {
    return this.$frameReg$[0]
  }
  if(65534 == $address$$6$$) {
    return this.$frameReg$[1]
  }
  if(65535 == $address$$6$$) {
    return this.$frameReg$[2]
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$6$$));
  debugger;
  return 0
} : function($address$$7$$) {
  if(1024 > $address$$7$$) {
    return this.$rom$[0][$address$$7$$++] | this.$rom$[0][$address$$7$$] << 8
  }
  if(16384 > $address$$7$$) {
    return this.$rom$[this.$frameReg$[0]][$address$$7$$++] | this.$rom$[this.$frameReg$[0]][$address$$7$$] << 8
  }
  if(32768 > $address$$7$$) {
    return this.$rom$[this.$frameReg$[1]][$address$$7$$++ - 16384] | this.$rom$[this.$frameReg$[1]][$address$$7$$ - 16384] << 8
  }
  if(49152 > $address$$7$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$7$$++ - 32768] | this.$sram$[$address$$7$$ - 32768] << 8 : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$7$$++ - 16384] | this.$sram$[$address$$7$$ - 16384] << 8 : this.$rom$[this.$frameReg$[2]][$address$$7$$++ - 32768] | this.$rom$[this.$frameReg$[2]][$address$$7$$ - 32768] << 8
  }
  if(57344 > $address$$7$$) {
    return this.$memWriteMap$[$address$$7$$++ - 49152] | this.$memWriteMap$[$address$$7$$ - 49152] << 8
  }
  if(65532 > $address$$7$$) {
    return this.$memWriteMap$[$address$$7$$++ - 57344] | this.$memWriteMap$[$address$$7$$ - 57344] << 8
  }
  if(65532 == $address$$7$$) {
    return this.$frameReg$[3]
  }
  if(65533 == $address$$7$$) {
    return this.$frameReg$[0]
  }
  if(65534 == $address$$7$$) {
    return this.$frameReg$[1]
  }
  if(65535 == $address$$7$$) {
    return this.$frameReg$[2]
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$7$$));
  debugger;
  return 0
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$f$($JSCompiler_StaticMethods_d_$self$$.$b$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$73$$) {
  var $parity$$ = !0, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$73$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$72$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$3$$ = $hl$$1$$ - $value$$72$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$c$ = ($hl$$1$$ ^ $result$$3$$ ^ $value$$72$$) >> 8 & 16 | 2 | $result$$3$$ >> 16 & 1 | $result$$3$$ >> 8 & 128 | (0 != ($result$$3$$ & 65535) ? 0 : 64) | (($value$$72$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$3$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$j$ = $result$$3$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$3$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$71$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$2$$ = $hl$$ + $value$$71$$ + ($JSCompiler_StaticMethods_adc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$c$ = ($hl$$ ^ $result$$2$$ ^ $value$$71$$) >> 8 & 16 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$71$$ ^ $hl$$ ^ 32768) & ($value$$71$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$j$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$70$$) {
  var $result$$1$$ = $reg$$ + $value$$70$$;
  $JSCompiler_StaticMethods_add16$self$$.$c$ = $JSCompiler_StaticMethods_add16$self$$.$c$ & 196 | ($reg$$ ^ $result$$1$$ ^ $value$$70$$) >> 8 & 16 | $result$$1$$ >> 16 & 1;
  return $result$$1$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$69$$) {
  $value$$69$$ = $value$$69$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$c$ = $JSCompiler_StaticMethods_dec8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$M$[$value$$69$$];
  return $value$$69$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$68$$) {
  $value$$68$$ = $value$$68$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$c$ = $JSCompiler_StaticMethods_inc8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$N$[$value$$68$$];
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
  $JSCompiler_StaticMethods_decBC$self$$.$g$ = $JSCompiler_StaticMethods_decBC$self$$.$g$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decBC$self$$.$g$ && ($JSCompiler_StaticMethods_decBC$self$$.$h$ = $JSCompiler_StaticMethods_decBC$self$$.$h$ - 1 & 255)
}
function $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_incHL$self$$) {
  $JSCompiler_StaticMethods_incHL$self$$.$l$ = $JSCompiler_StaticMethods_incHL$self$$.$l$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incHL$self$$.$l$ && ($JSCompiler_StaticMethods_incHL$self$$.$j$ = $JSCompiler_StaticMethods_incHL$self$$.$j$ + 1 & 255)
}
function $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_incDE$self$$) {
  $JSCompiler_StaticMethods_incDE$self$$.$e$ = $JSCompiler_StaticMethods_incDE$self$$.$e$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incDE$self$$.$e$ && ($JSCompiler_StaticMethods_incDE$self$$.$d$ = $JSCompiler_StaticMethods_incDE$self$$.$d$ + 1 & 255)
}
function $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_setIYHIYL$self$$, $value$$67$$) {
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$v$ = $value$$67$$ >> 8;
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$s$ = $value$$67$$ & 255
}
function $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_setIXHIXL$self$$, $value$$66$$) {
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$t$ = $value$$66$$ >> 8;
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$q$ = $value$$66$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$64$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$j$ = $value$$64$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$64$$ & 255
}
function $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_getIYHIYL$self$$) {
  return $JSCompiler_StaticMethods_getIYHIYL$self$$.$v$ << 8 | $JSCompiler_StaticMethods_getIYHIYL$self$$.$s$
}
function $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_getIXHIXL$self$$) {
  return $JSCompiler_StaticMethods_getIXHIXL$self$$.$t$ << 8 | $JSCompiler_StaticMethods_getIXHIXL$self$$.$q$
}
function $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_getHL$self$$) {
  return $JSCompiler_StaticMethods_getHL$self$$.$j$ << 8 | $JSCompiler_StaticMethods_getHL$self$$.$l$
}
function $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_getDE$self$$) {
  return $JSCompiler_StaticMethods_getDE$self$$.$d$ << 8 | $JSCompiler_StaticMethods_getDE$self$$.$e$
}
function $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_getBC$self$$) {
  return $JSCompiler_StaticMethods_getBC$self$$.$h$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$g$
}
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$61$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$c$ = $JSCompiler_StaticMethods_cp_a$self$$.$w$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$61$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$60$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$c$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$60$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$c$ = $JSCompiler_StaticMethods_sbc_a$self$$.$w$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$59$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$59$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$c$ = $JSCompiler_StaticMethods_sub_a$self$$.$w$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$58$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$c$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$58$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$c$ = $JSCompiler_StaticMethods_adc_a$self$$.$F$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$57$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$57$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$c$ = $JSCompiler_StaticMethods_add_a$self$$.$F$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$45$$) {
  var $location$$24$$ = $index$$45$$ + $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($JSCompiler_StaticMethods_doIndexCB$self$$.$b$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$f$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$o$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
  switch($opcode$$4$$) {
    case 0:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 1:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 2:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 3:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 4:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 5:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 7:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 8:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 9:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 10:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 11:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 12:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 13:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 15:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 16:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 17:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 18:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 19:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 20:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 21:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 23:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 24:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 25:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 26:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 27:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 28:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 29:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 31:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 32:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 33:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 34:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 35:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 36:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 37:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 39:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 40:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 41:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 42:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 43:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 44:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 45:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 47:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 48:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 49:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 50:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 51:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 52:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 53:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 55:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 56:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 57:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 58:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 59:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 60:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 61:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$)));
      break;
    case 63:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -3);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -5);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -9);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -17);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -33);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -65);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) & -129);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 1);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 4);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 8);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 16);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 32);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 64);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$) | 128);
      break;
    default:
      $JSSMS$Utils$console$log$$("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$4$$))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$b$++
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
  $JSCompiler_StaticMethods_decMem$self$$.$i$($offset$$15$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$f$($offset$$15$$)))
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$i$($offset$$14$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$f$($offset$$14$$)))
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$b$ = $JSCompiler_StaticMethods_ret$self$$.$p$($JSCompiler_StaticMethods_ret$self$$.$n$), $JSCompiler_StaticMethods_ret$self$$.$n$ += 2, $JSCompiler_StaticMethods_ret$self$$.$o$ -= 6)
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$b$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$o$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$b$++
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$b$ = $JSCompiler_StaticMethods_jp$self$$.$p$($JSCompiler_StaticMethods_jp$self$$.$b$) : $JSCompiler_StaticMethods_jp$self$$.$b$ += 2
}
function $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_interrupt$self$$) {
  $JSCompiler_StaticMethods_interrupt$self$$.$J$ && !$JSCompiler_StaticMethods_interrupt$self$$.$P$ && ($JSCompiler_StaticMethods_interrupt$self$$.$O$ && ($JSCompiler_StaticMethods_interrupt$self$$.$b$++, $JSCompiler_StaticMethods_interrupt$self$$.$O$ = !1), $JSCompiler_StaticMethods_interrupt$self$$.$J$ = $JSCompiler_StaticMethods_interrupt$self$$.$K$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.$I$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.push($JSCompiler_StaticMethods_interrupt$self$$.$b$), 
  0 == $JSCompiler_StaticMethods_interrupt$self$$.$Q$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$b$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$.$R$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$.$R$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$R$, $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$.$Q$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$b$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$.$b$ = 
  $JSCompiler_StaticMethods_interrupt$self$$.$p$(($JSCompiler_StaticMethods_interrupt$self$$.$U$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$R$), $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 19))
}
function $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$) {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$lineno$ = 0;
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$cyclesPerLine$;
  for($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$I$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$);;) {
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$a$.$updateDisassembly$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$b$);
    var $JSCompiler_StaticMethods_interpret$self$$inline_90$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$, $temp$$inline_91$$ = 0, $opcode$$inline_92$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
    $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$P$ = !1;
    $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$o$ -= $OP_STATES$$[$opcode$$inline_92$$];
    switch($opcode$$inline_92$$) {
      case 1:
        var $JSCompiler_StaticMethods_setBC$self$$inline_406$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $value$$inline_407$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        $JSCompiler_StaticMethods_setBC$self$$inline_406$$.$h$ = $value$$inline_407$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_406$$.$g$ = $value$$inline_407$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 2:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 3:
        var $JSCompiler_StaticMethods_incBC$self$$inline_272$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$;
        $JSCompiler_StaticMethods_incBC$self$$inline_272$$.$g$ = $JSCompiler_StaticMethods_incBC$self$$inline_272$$.$g$ + 1 & 255;
        0 == $JSCompiler_StaticMethods_incBC$self$$inline_272$$.$g$ && ($JSCompiler_StaticMethods_incBC$self$$inline_272$$.$h$ = $JSCompiler_StaticMethods_incBC$self$$inline_272$$.$h$ + 1 & 255);
        break;
      case 4:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 5:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 6:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 7:
        var $JSCompiler_StaticMethods_rlca_a$self$$inline_274$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $carry$$inline_275$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_274$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_274$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_274$$.$a$ << 1 & 255 | $carry$$inline_275$$;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_274$$.$c$ & 236 | $carry$$inline_275$$;
        break;
      case 8:
        var $JSCompiler_StaticMethods_exAF$self$$inline_277$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $temp$$inline_278$$ = $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$a$;
        $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$W$;
        $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$W$ = $temp$$inline_278$$;
        $temp$$inline_278$$ = $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$c$;
        $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$c$ = $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$ba$;
        $JSCompiler_StaticMethods_exAF$self$$inline_277$$.$ba$ = $temp$$inline_278$$;
        break;
      case 9:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 10:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 11:
        $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 12:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 13:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 14:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 15:
        var $JSCompiler_StaticMethods_rrca_a$self$$inline_280$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $carry$$inline_281$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_280$$.$a$ & 1;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_280$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_280$$.$a$ >> 1 | $carry$$inline_281$$ << 7;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_280$$.$c$ & 236 | $carry$$inline_281$$;
        break;
      case 16:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ - 1 & 255;
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 17:
        var $JSCompiler_StaticMethods_setDE$self$$inline_409$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $value$$inline_410$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        $JSCompiler_StaticMethods_setDE$self$$inline_409$$.$d$ = $value$$inline_410$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_409$$.$e$ = $value$$inline_410$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 18:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 19:
        $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 20:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 21:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 22:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 23:
        var $JSCompiler_StaticMethods_rla_a$self$$inline_283$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $carry$$inline_284$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_283$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rla_a$self$$inline_283$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_283$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_283$$.$c$ & 1) & 255;
        $JSCompiler_StaticMethods_rla_a$self$$inline_283$$.$c$ = $JSCompiler_StaticMethods_rla_a$self$$inline_283$$.$c$ & 236 | $carry$$inline_284$$;
        break;
      case 24:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$) + 1);
        break;
      case 25:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 26:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 27:
        $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 28:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 29:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 30:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 31:
        var $JSCompiler_StaticMethods_rra_a$self$$inline_286$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $carry$$inline_287$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_286$$.$a$ & 1;
        $JSCompiler_StaticMethods_rra_a$self$$inline_286$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_286$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_286$$.$c$ & 1) << 7) & 255;
        $JSCompiler_StaticMethods_rra_a$self$$inline_286$$.$c$ = $JSCompiler_StaticMethods_rra_a$self$$inline_286$$.$c$ & 236 | $carry$$inline_287$$;
        break;
      case 32:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 33:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 34:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$G$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 35:
        $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 36:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 37:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 38:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 39:
        var $JSCompiler_StaticMethods_daa$self$$inline_289$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $temp$$inline_290$$ = $JSCompiler_StaticMethods_daa$self$$inline_289$$.$ea$[$JSCompiler_StaticMethods_daa$self$$inline_289$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_289$$.$c$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_289$$.$c$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_289$$.$c$ & 16) << 6];
        $JSCompiler_StaticMethods_daa$self$$inline_289$$.$a$ = $temp$$inline_290$$ & 255;
        $JSCompiler_StaticMethods_daa$self$$inline_289$$.$c$ = $JSCompiler_StaticMethods_daa$self$$inline_289$$.$c$ & 2 | $temp$$inline_290$$ >> 8;
        break;
      case 40:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 41:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 42:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++)));
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 43:
        $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 44:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 45:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 46:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 47:
        var $JSCompiler_StaticMethods_cpl_a$self$$inline_292$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_292$$.$a$ ^= 255;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_292$$.$c$ |= 18;
        break;
      case 48:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 49:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 50:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 51:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$++;
        break;
      case 52:
        $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 53:
        $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 54:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 55:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ |= 1;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ &= -3;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ &= -17;
        break;
      case 56:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 57:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$));
        break;
      case 58:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++;
        break;
      case 59:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$--;
        break;
      case 60:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 61:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 62:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        break;
      case 63:
        var $JSCompiler_StaticMethods_ccf$self$$inline_294$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$;
        0 != ($JSCompiler_StaticMethods_ccf$self$$inline_294$$.$c$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_294$$.$c$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_294$$.$c$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_294$$.$c$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_294$$.$c$ &= -17);
        $JSCompiler_StaticMethods_ccf$self$$inline_294$$.$c$ &= -3;
        break;
      case 65:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$;
        break;
      case 66:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        break;
      case 67:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        break;
      case 68:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        break;
      case 69:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        break;
      case 70:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 71:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$;
        break;
      case 72:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$;
        break;
      case 74:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        break;
      case 75:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        break;
      case 76:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        break;
      case 77:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        break;
      case 78:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 79:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$;
        break;
      case 80:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$;
        break;
      case 81:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$;
        break;
      case 83:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        break;
      case 84:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        break;
      case 85:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        break;
      case 86:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 87:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$;
        break;
      case 88:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$;
        break;
      case 89:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$;
        break;
      case 90:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        break;
      case 92:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        break;
      case 93:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        break;
      case 94:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 95:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$;
        break;
      case 96:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$;
        break;
      case 97:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$;
        break;
      case 98:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        break;
      case 99:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        break;
      case 101:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        break;
      case 102:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 103:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$;
        break;
      case 104:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$;
        break;
      case 105:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$;
        break;
      case 106:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        break;
      case 107:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        break;
      case 108:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        break;
      case 110:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 111:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$;
        break;
      case 112:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 113:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 114:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 115:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 116:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 117:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 118:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$o$ = 0;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$O$ = !0;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$--;
        break;
      case 119:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 120:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$;
        break;
      case 121:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$;
        break;
      case 122:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        break;
      case 123:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        break;
      case 124:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        break;
      case 125:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        break;
      case 126:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 128:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 129:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 130:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 131:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 132:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 133:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 134:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 135:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 136:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 137:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 138:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 139:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 140:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 141:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 142:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 143:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 144:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 145:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 146:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 147:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 148:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 149:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 150:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 151:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 152:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 153:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 154:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 155:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 156:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 157:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 158:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 159:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 160:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$] | 16;
        break;
      case 161:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$] | 16;
        break;
      case 162:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$] | 16;
        break;
      case 163:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$] | 16;
        break;
      case 164:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$] | 16;
        break;
      case 165:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$] | 16;
        break;
      case 166:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$))] | 16;
        break;
      case 167:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$] | 16;
        break;
      case 168:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$];
        break;
      case 169:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$];
        break;
      case 170:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$];
        break;
      case 171:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$];
        break;
      case 172:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$];
        break;
      case 173:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$];
        break;
      case 174:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$))];
        break;
      case 175:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = 0];
        break;
      case 176:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$];
        break;
      case 177:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$];
        break;
      case 178:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$];
        break;
      case 179:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$];
        break;
      case 180:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$];
        break;
      case 181:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$];
        break;
      case 182:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$))];
        break;
      case 183:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$];
        break;
      case 184:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$h$);
        break;
      case 185:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$g$);
        break;
      case 186:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$);
        break;
      case 187:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$);
        break;
      case 188:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$);
        break;
      case 189:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$);
        break;
      case 190:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$)));
        break;
      case 191:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 192:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 193:
        var $JSCompiler_StaticMethods_setBC$self$$inline_412$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $value$$inline_413$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$);
        $JSCompiler_StaticMethods_setBC$self$$inline_412$$.$h$ = $value$$inline_413$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_412$$.$g$ = $value$$inline_413$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ += 2;
        break;
      case 194:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 195:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        break;
      case 196:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 197:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 198:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 199:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 0;
        break;
      case 200:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 201:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ += 2;
        break;
      case 202:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 203:
        var $JSCompiler_StaticMethods_doCB$self$$inline_296$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $opcode$$inline_297$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++);
        $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_297$$];
        switch($opcode$$inline_297$$) {
          case 0:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 1:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 2:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 3:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 4:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 5:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 6:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 7:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 8:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 9:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 10:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 11:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 12:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 13:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 14:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 15:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 16:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 17:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 18:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 19:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 20:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 21:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 22:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 23:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 24:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 25:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 26:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 27:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 28:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 29:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 30:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 31:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 32:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 33:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 34:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 35:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 36:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 39:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 40:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 41:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 42:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 43:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 44:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 47:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 48:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 49:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 50:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 51:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 52:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 53:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 54:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 55:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 56:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$);
            break;
          case 57:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$);
            break;
          case 58:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$);
            break;
          case 59:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$);
            break;
          case 60:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$);
            break;
          case 61:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$);
            break;
          case 62:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$))));
            break;
          case 63:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$);
            break;
          case 64:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 1);
            break;
          case 65:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 1);
            break;
          case 66:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 1);
            break;
          case 67:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 1);
            break;
          case 68:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 1);
            break;
          case 69:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 1);
            break;
          case 70:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 1);
            break;
          case 71:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 1);
            break;
          case 72:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 2);
            break;
          case 73:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 2);
            break;
          case 74:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 2);
            break;
          case 75:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 2);
            break;
          case 76:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 2);
            break;
          case 77:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 2);
            break;
          case 78:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 2);
            break;
          case 79:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 2);
            break;
          case 80:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 4);
            break;
          case 81:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 4);
            break;
          case 82:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 4);
            break;
          case 83:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 4);
            break;
          case 84:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 4);
            break;
          case 85:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 4);
            break;
          case 86:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 4);
            break;
          case 87:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 4);
            break;
          case 88:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 8);
            break;
          case 89:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 8);
            break;
          case 90:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 8);
            break;
          case 91:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 8);
            break;
          case 92:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 8);
            break;
          case 93:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 8);
            break;
          case 94:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 8);
            break;
          case 95:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 8);
            break;
          case 96:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 16);
            break;
          case 97:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 16);
            break;
          case 98:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 16);
            break;
          case 99:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 16);
            break;
          case 100:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 16);
            break;
          case 101:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 16);
            break;
          case 102:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 16);
            break;
          case 103:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 16);
            break;
          case 104:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 32);
            break;
          case 105:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 32);
            break;
          case 106:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 32);
            break;
          case 107:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 32);
            break;
          case 108:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 32);
            break;
          case 109:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 32);
            break;
          case 110:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 32);
            break;
          case 111:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 32);
            break;
          case 112:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 64);
            break;
          case 113:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 64);
            break;
          case 114:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 64);
            break;
          case 115:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 64);
            break;
          case 116:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 64);
            break;
          case 117:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 64);
            break;
          case 118:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 64);
            break;
          case 119:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 64);
            break;
          case 120:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ & 128);
            break;
          case 121:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ & 128);
            break;
          case 122:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ & 128);
            break;
          case 123:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ & 128);
            break;
          case 124:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ & 128);
            break;
          case 125:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ & 128);
            break;
          case 126:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & 128);
            break;
          case 127:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$, $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ & 128);
            break;
          case 128:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -2;
            break;
          case 129:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -2;
            break;
          case 130:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -2;
            break;
          case 131:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -2;
            break;
          case 132:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -2;
            break;
          case 133:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -2;
            break;
          case 134:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -2);
            break;
          case 135:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -2;
            break;
          case 136:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -3;
            break;
          case 137:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -3;
            break;
          case 138:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -3;
            break;
          case 139:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -3;
            break;
          case 140:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -3;
            break;
          case 141:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -3;
            break;
          case 142:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -3);
            break;
          case 143:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -3;
            break;
          case 144:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -5;
            break;
          case 145:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -5;
            break;
          case 146:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -5;
            break;
          case 147:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -5;
            break;
          case 148:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -5;
            break;
          case 149:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -5;
            break;
          case 150:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -5);
            break;
          case 151:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -5;
            break;
          case 152:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -9;
            break;
          case 153:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -9;
            break;
          case 154:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -9;
            break;
          case 155:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -9;
            break;
          case 156:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -9;
            break;
          case 157:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -9;
            break;
          case 158:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -9);
            break;
          case 159:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -9;
            break;
          case 160:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -17;
            break;
          case 161:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -17;
            break;
          case 162:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -17;
            break;
          case 163:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -17;
            break;
          case 164:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -17;
            break;
          case 165:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -17;
            break;
          case 166:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -17);
            break;
          case 167:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -17;
            break;
          case 168:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -33;
            break;
          case 169:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -33;
            break;
          case 170:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -33;
            break;
          case 171:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -33;
            break;
          case 172:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -33;
            break;
          case 173:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -33;
            break;
          case 174:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -33);
            break;
          case 175:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -33;
            break;
          case 176:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -65;
            break;
          case 177:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -65;
            break;
          case 178:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -65;
            break;
          case 179:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -65;
            break;
          case 180:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -65;
            break;
          case 181:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -65;
            break;
          case 182:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -65);
            break;
          case 183:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -65;
            break;
          case 184:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ &= -129;
            break;
          case 185:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ &= -129;
            break;
          case 186:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ &= -129;
            break;
          case 187:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ &= -129;
            break;
          case 188:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ &= -129;
            break;
          case 189:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ &= -129;
            break;
          case 190:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) & -129);
            break;
          case 191:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ &= -129;
            break;
          case 192:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 1;
            break;
          case 193:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 1;
            break;
          case 194:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 1;
            break;
          case 195:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 1;
            break;
          case 196:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 1;
            break;
          case 197:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 1;
            break;
          case 198:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 1);
            break;
          case 199:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 1;
            break;
          case 200:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 2;
            break;
          case 201:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 2;
            break;
          case 203:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 2;
            break;
          case 204:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 2;
            break;
          case 205:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 2;
            break;
          case 206:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 2);
            break;
          case 207:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 2;
            break;
          case 208:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 4;
            break;
          case 209:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 4;
            break;
          case 210:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 4;
            break;
          case 211:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 4;
            break;
          case 212:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 4;
            break;
          case 213:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 4;
            break;
          case 214:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 4);
            break;
          case 215:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 4;
            break;
          case 216:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 8;
            break;
          case 217:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 8;
            break;
          case 218:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 8;
            break;
          case 219:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 8;
            break;
          case 220:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 8;
            break;
          case 221:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 8;
            break;
          case 222:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 8);
            break;
          case 223:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 8;
            break;
          case 224:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 16;
            break;
          case 225:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 16;
            break;
          case 226:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 16;
            break;
          case 227:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 16;
            break;
          case 228:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 16;
            break;
          case 229:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 16;
            break;
          case 230:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 16);
            break;
          case 231:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 16;
            break;
          case 232:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 32;
            break;
          case 233:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 32;
            break;
          case 234:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 32;
            break;
          case 235:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 32;
            break;
          case 236:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 32;
            break;
          case 237:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 32;
            break;
          case 238:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 32);
            break;
          case 239:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 32;
            break;
          case 240:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 64;
            break;
          case 241:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 64;
            break;
          case 242:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 64;
            break;
          case 243:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 64;
            break;
          case 244:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 64;
            break;
          case 245:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 64;
            break;
          case 246:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 64);
            break;
          case 247:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 64;
            break;
          case 248:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$h$ |= 128;
            break;
          case 249:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$g$ |= 128;
            break;
          case 250:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$d$ |= 128;
            break;
          case 251:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$e$ |= 128;
            break;
          case 252:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$j$ |= 128;
            break;
          case 253:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$l$ |= 128;
            break;
          case 254:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$), $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_296$$)) | 128);
            break;
          case 255:
            $JSCompiler_StaticMethods_doCB$self$$inline_296$$.$a$ |= 128;
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_297$$))
        }
        break;
      case 204:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 64));
        break;
      case 205:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ + 2);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        break;
      case 206:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 207:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 8;
        break;
      case 208:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 209:
        var $JSCompiler_StaticMethods_setDE$self$$inline_415$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $value$$inline_416$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$);
        $JSCompiler_StaticMethods_setDE$self$$inline_415$$.$d$ = $value$$inline_416$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_415$$.$e$ = $value$$inline_416$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ += 2;
        break;
      case 210:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 211:
        $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.port, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$);
        break;
      case 212:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 213:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 214:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 215:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 16;
        break;
      case 216:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 217:
        var $JSCompiler_StaticMethods_exBC$self$$inline_299$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $temp$$inline_300$$ = $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$h$;
        $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$h$ = $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$X$;
        $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$X$ = $temp$$inline_300$$;
        $temp$$inline_300$$ = $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$g$;
        $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$g$ = $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$Y$;
        $JSCompiler_StaticMethods_exBC$self$$inline_299$$.$Y$ = $temp$$inline_300$$;
        var $JSCompiler_StaticMethods_exDE$self$$inline_302$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $temp$$inline_303$$ = $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$d$;
        $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$d$ = $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$Z$;
        $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$Z$ = $temp$$inline_303$$;
        $temp$$inline_303$$ = $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$e$;
        $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$e$ = $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$aa$;
        $JSCompiler_StaticMethods_exDE$self$$inline_302$$.$aa$ = $temp$$inline_303$$;
        var $JSCompiler_StaticMethods_exHL$self$$inline_305$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $temp$$inline_306$$ = $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$j$;
        $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$j$ = $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$ca$;
        $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$ca$ = $temp$$inline_306$$;
        $temp$$inline_306$$ = $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$l$;
        $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$l$ = $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$da$;
        $JSCompiler_StaticMethods_exHL$self$$inline_305$$.$da$ = $temp$$inline_306$$;
        break;
      case 218:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 219:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.port, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 220:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 1));
        break;
      case 221:
        var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $opcode$$inline_309$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++), $temp$$inline_310$$ = 0;
        $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_309$$];
        switch($opcode$$inline_309$$) {
          case 9:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 34:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$G$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIXHIXL$self$$inline_418$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$;
            $JSCompiler_StaticMethods_incIXHIXL$self$$inline_418$$.$q$ = $JSCompiler_StaticMethods_incIXHIXL$self$$inline_418$$.$q$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIXHIXL$self$$inline_418$$.$q$ && ($JSCompiler_StaticMethods_incIXHIXL$self$$inline_418$$.$t$ = $JSCompiler_StaticMethods_incIXHIXL$self$$inline_418$$.$t$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            break;
          case 42:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIXHIXL$self$$inline_420$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$;
            $JSCompiler_StaticMethods_decIXHIXL$self$$inline_420$$.$q$ = $JSCompiler_StaticMethods_decIXHIXL$self$$inline_420$$.$q$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIXHIXL$self$$inline_420$$.$q$ && ($JSCompiler_StaticMethods_decIXHIXL$self$$inline_420$$.$t$ = $JSCompiler_StaticMethods_decIXHIXL$self$$inline_420$$.$t$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 54:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$n$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$h$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$g$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$h$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$g$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$g$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 116:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$j$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 117:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 119:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$t$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$q$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$n$ += 2;
            break;
          case 227:
            $temp$$inline_310$$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$);
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$G$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$n$, $temp$$inline_310$$);
            break;
          case 229:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.push($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$));
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$n$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$);
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_309$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_308$$.$b$--
        }
        break;
      case 222:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 223:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 24;
        break;
      case 224:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 4));
        break;
      case 225:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$));
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ += 2;
        break;
      case 226:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 4));
        break;
      case 227:
        $temp$$inline_91$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$));
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$G$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$, $temp$$inline_91$$);
        break;
      case 228:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 4));
        break;
      case 229:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$));
        break;
      case 230:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++)] | 16;
        break;
      case 231:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 32;
        break;
      case 232:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 4));
        break;
      case 233:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 234:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 4));
        break;
      case 235:
        $temp$$inline_91$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$j$ = $temp$$inline_91$$;
        $temp$$inline_91$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$l$ = $temp$$inline_91$$;
        break;
      case 236:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 4));
        break;
      case 237:
        var $JSCompiler_StaticMethods_doED$self$$inline_312$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $opcode$$inline_313$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$), $temp$$inline_314$$ = 0, $location$$inline_315$$ = 0;
        $JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_313$$];
        switch($opcode$$inline_313$$) {
          case 64:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 65:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 66:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 67:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$G$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
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
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ = 0;
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
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
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$n$ += 2;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$J$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$K$;
            break;
          case 70:
          ;
          case 78:
          ;
          case 102:
          ;
          case 110:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$Q$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 71:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$U$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 72:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 73:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 74:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 75:
            var $JSCompiler_StaticMethods_setBC$self$$inline_422$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$, $value$$inline_423$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$));
            $JSCompiler_StaticMethods_setBC$self$$inline_422$$.$h$ = $value$$inline_423$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_422$$.$g$ = $value$$inline_423$$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 79:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 80:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$d$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 81:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 82:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 83:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$G$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 86:
          ;
          case 118:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$Q$ = 1;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 87:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$U$;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$V$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$K$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 88:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$e$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 89:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$e$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 90:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 91:
            var $JSCompiler_StaticMethods_setDE$self$$inline_425$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$, $value$$inline_426$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$));
            $JSCompiler_StaticMethods_setDE$self$$inline_425$$.$d$ = $value$$inline_426$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_425$$.$e$ = $value$$inline_426$$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 95:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ = Math.round(255 * Math.random());
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$V$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$K$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$j$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 97:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$j$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 98:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 99:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$G$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 103:
            $location$$inline_315$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($location$$inline_315$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($location$$inline_315$$, $temp$$inline_314$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 15) << 4);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 240 | $temp$$inline_314$$ & 15;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 104:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 105:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 106:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 107:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$)));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 111:
            $location$$inline_315$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($location$$inline_315$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($location$$inline_315$$, ($temp$$inline_314$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 15);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 240 | $temp$$inline_314$$ >> 4;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, 0);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$G$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$), $JSCompiler_StaticMethods_doED$self$$inline_312$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 120:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 121:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 122:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 123:
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$n$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_312$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$ += 2;
            break;
          case 160:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ = $temp$$inline_314$$ + $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 4 : 0) | $temp$$inline_314$$ & 8 | ($temp$$inline_314$$ & 2 ? 32 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 161:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 248 | $temp$$inline_314$$;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 162:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 128 == ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 163:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$ + $temp$$inline_314$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 128 == ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 168:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ = $temp$$inline_314$$ + $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 4 : 0) | $temp$$inline_314$$ & 8 | ($temp$$inline_314$$ & 2 ? 32 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 169:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 248 | $temp$$inline_314$$;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 170:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 0 != ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 171:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$ + $temp$$inline_314$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 128 == ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 176:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ = $temp$$inline_314$$ + $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 4 : 0) | $temp$$inline_314$$ & 8 | ($temp$$inline_314$$ & 2 ? 32 : 0);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 177:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 0 : 4;
            0 != ($temp$$inline_314$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 248 | $temp$$inline_314$$;
            break;
          case 178:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 128 == ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            break;
          case 179:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$ + $temp$$inline_314$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 0 != ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            break;
          case 184:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ = $temp$$inline_314$$ + $JSCompiler_StaticMethods_doED$self$$inline_312$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 4 : 0) | $temp$$inline_314$$ & 8 | ($temp$$inline_314$$ & 2 ? 32 : 0);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            break;
          case 185:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            $temp$$inline_314$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_312$$) ? 0 : 4;
            0 != ($temp$$inline_314$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & 248 | $temp$$inline_314$$;
            break;
          case 186:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$), $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 0 != ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            break;
          case 187:
            $temp$$inline_314$$ = $JSCompiler_StaticMethods_doED$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_312$$.port, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$g$, $temp$$inline_314$$);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_312$$, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_312$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_312$$.$h$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_312$$.$l$ + $temp$$inline_314$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ = 0 != ($temp$$inline_314$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_312$$.$c$ & -3;
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_313$$)), $JSCompiler_StaticMethods_doED$self$$inline_312$$.$b$++
        }
        break;
      case 238:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++)];
        break;
      case 239:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 40;
        break;
      case 240:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 128));
        break;
      case 241:
        var $JSCompiler_StaticMethods_setAF$self$$inline_317$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $value$$inline_318$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$);
        $JSCompiler_StaticMethods_setAF$self$$inline_317$$.$a$ = $value$$inline_318$$ >> 8;
        $JSCompiler_StaticMethods_setAF$self$$inline_317$$.$c$ = $value$$inline_318$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ += 2;
        break;
      case 242:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 128));
        break;
      case 243:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$J$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$K$ = !1;
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$P$ = !0;
        break;
      case 244:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 128));
        break;
      case 245:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ << 8 | $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$);
        break;
      case 246:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_90$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++)];
        break;
      case 247:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 48;
        break;
      case 248:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 128));
        break;
      case 249:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$);
        break;
      case 250:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 128));
        break;
      case 251:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$J$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$K$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$P$ = !0;
        break;
      case 252:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$c$ & 128));
        break;
      case 253:
        var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$, $opcode$$inline_321$$ = $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++), $temp$$inline_322$$ = void 0;
        $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_321$$];
        switch($opcode$$inline_321$$) {
          case 9:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 34:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$G$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIYHIYL$self$$inline_428$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$;
            $JSCompiler_StaticMethods_incIYHIYL$self$$inline_428$$.$s$ = $JSCompiler_StaticMethods_incIYHIYL$self$$inline_428$$.$s$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIYHIYL$self$$inline_428$$.$s$ && ($JSCompiler_StaticMethods_incIYHIYL$self$$inline_428$$.$v$ = $JSCompiler_StaticMethods_incIYHIYL$self$$inline_428$$.$v$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            break;
          case 42:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIYHIYL$self$$inline_430$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$;
            $JSCompiler_StaticMethods_decIYHIYL$self$$inline_430$$.$s$ = $JSCompiler_StaticMethods_decIYHIYL$self$$inline_430$$.$s$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIYHIYL$self$$inline_430$$.$s$ && ($JSCompiler_StaticMethods_decIYHIYL$self$$inline_430$$.$v$ = $JSCompiler_StaticMethods_decIYHIYL$self$$inline_430$$.$v$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 54:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$n$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$h$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$g$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$h$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$g$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$g$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 116:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$j$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 117:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 119:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$v$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$s$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$n$ += 2;
            break;
          case 227:
            $temp$$inline_322$$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$);
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$G$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$n$, $temp$$inline_322$$);
            break;
          case 229:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.push($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$));
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$n$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$);
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_321$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_320$$.$b$--
        }
        break;
      case 254:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_90$$, $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$++));
        break;
      case 255:
        $JSCompiler_StaticMethods_interpret$self$$inline_90$$.push($JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$), $JSCompiler_StaticMethods_interpret$self$$inline_90$$.$b$ = 56
    }
    var $JSCompiler_temp$$2$$;
    if($JSCompiler_temp$$2$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$) {
      var $JSCompiler_StaticMethods_eol$self$$inline_94$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
      if($JSCompiler_StaticMethods_eol$self$$inline_94$$.$main$.$soundEnabled$) {
        var $JSCompiler_StaticMethods_updateSound$self$$inline_324$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$main$, $line$$inline_325$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$;
        0 == $line$$inline_325$$ && ($JSCompiler_StaticMethods_updateSound$self$$inline_324$$.$audioBufferOffset$ = 0);
        for(var $samplesToGenerate$$inline_326$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_324$$.$samplesPerLine$[$line$$inline_325$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_324$$.$b$, $offset$$inline_328$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_324$$.$audioBufferOffset$, $buffer$$inline_329$$ = [], $sample$$inline_330$$ = 0, $i$$inline_331$$ = 0;$sample$$inline_330$$ < $samplesToGenerate$$inline_326$$;$sample$$inline_330$$++) {
          for($i$$inline_331$$ = 0;3 > $i$$inline_331$$;$i$$inline_331$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$m$[$i$$inline_331$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[$i$$inline_331$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[($i$$inline_331$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[$i$$inline_331$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[($i$$inline_331$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[$i$$inline_331$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$m$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ & 1) << 1;
          var $output$$inline_332$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$m$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$m$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$m$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$m$[3];
          127 < $output$$inline_332$$ ? $output$$inline_332$$ = 127 : -128 > $output$$inline_332$$ && ($output$$inline_332$$ = -128);
          $buffer$$inline_329$$[$offset$$inline_328$$ + $sample$$inline_330$$] = $output$$inline_332$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$n$;
          var $clockCycles$$inline_333$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$ >> 8, $clockCyclesScaled$$inline_334$$ = $clockCycles$$inline_333$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$ -= $clockCyclesScaled$$inline_334$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[0] -= $clockCycles$$inline_333$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[1] -= $clockCycles$$inline_333$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[2] -= $clockCycles$$inline_333$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$j$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] - $clockCycles$$inline_333$$;
          for($i$$inline_331$$ = 0;3 > $i$$inline_331$$;$i$$inline_331$$++) {
            var $counter$$inline_335$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[$i$$inline_331$$];
            if(0 >= $counter$$inline_335$$) {
              var $tone$$inline_336$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[$i$$inline_331$$ << 1];
              6 < $tone$$inline_336$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[$i$$inline_331$$] = ($clockCyclesScaled$$inline_334$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$ + 512 * $counter$$inline_335$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[$i$$inline_331$$] / ($clockCyclesScaled$$inline_334$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$g$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[$i$$inline_331$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[$i$$inline_331$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[$i$$inline_331$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[$i$$inline_331$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[$i$$inline_331$$] += $tone$$inline_336$$ * ($clockCycles$$inline_333$$ / $tone$$inline_336$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$i$[$i$$inline_331$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$j$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$j$ * 
          ($clockCycles$$inline_333$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$j$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$f$[3])) {
            var $feedback$$inline_337$$ = 0, $feedback$$inline_337$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_327$$.$h$ >> 1 | $feedback$$inline_337$$ << 15
          }
        }
        $JSCompiler_StaticMethods_updateSound$self$$inline_324$$.$audioBuffer$ = $buffer$$inline_329$$;
        $JSCompiler_StaticMethods_updateSound$self$$inline_324$$.$audioBufferOffset$ += $samplesToGenerate$$inline_326$$
      }
      $JSCompiler_StaticMethods_eol$self$$inline_94$$.$vdp$.$p$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$;
      if(192 > $JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$) {
        var $JSCompiler_StaticMethods_drawLine$self$$inline_339$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$vdp$, $lineno$$inline_340$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$, $i$$inline_341$$ = 0, $temp$$inline_342$$ = 0, $temp2$$inline_343$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$main$.$is_gg$ || !(24 > $lineno$$inline_340$$ || 168 <= $lineno$$inline_340$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$o$) {
              for(var $i$$inline_344$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$s$;$i$$inline_344$$ <= $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$o$;$i$$inline_344$$++) {
                if($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$G$[$i$$inline_344$$]) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$G$[$i$$inline_344$$] = 0;
                  for(var $tile$$inline_345$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$I$[$i$$inline_344$$], $pixel_index$$inline_346$$ = 0, $address$$inline_347$$ = $i$$inline_344$$ << 5, $y$$inline_348$$ = 0;8 > $y$$inline_348$$;$y$$inline_348$$++) {
                    for(var $address0$$inline_349$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$address$$inline_347$$++], $address1$$inline_350$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$address$$inline_347$$++], $address2$$inline_351$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$address$$inline_347$$++], $address3$$inline_352$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$address$$inline_347$$++], $bit$$inline_353$$ = 128;0 != 
                    $bit$$inline_353$$;$bit$$inline_353$$ >>= 1) {
                      var $colour$$inline_354$$ = 0;
                      0 != ($address0$$inline_349$$ & $bit$$inline_353$$) && ($colour$$inline_354$$ |= 1);
                      0 != ($address1$$inline_350$$ & $bit$$inline_353$$) && ($colour$$inline_354$$ |= 2);
                      0 != ($address2$$inline_351$$ & $bit$$inline_353$$) && ($colour$$inline_354$$ |= 4);
                      0 != ($address3$$inline_352$$ & $bit$$inline_353$$) && ($colour$$inline_354$$ |= 8);
                      $tile$$inline_345$$[$pixel_index$$inline_346$$++] = $colour$$inline_354$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$s$ = 512;
              $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$o$ = -1
            }
            var $pixX$$inline_355$$ = 0, $colour$$inline_356$$ = 0, $temp$$inline_357$$ = 0, $temp2$$inline_358$$ = 0, $hscroll$$inline_359$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[8], $vscroll$$inline_360$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[9];
            16 > $lineno$$inline_340$$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[0] & 64) && ($hscroll$$inline_359$$ = 0);
            var $lock$$inline_361$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[0] & 128, $tile_column$$inline_362$$ = 32 - ($hscroll$$inline_359$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$F$, $tile_row$$inline_363$$ = $lineno$$inline_340$$ + $vscroll$$inline_360$$ >> 3;
            27 < $tile_row$$inline_363$$ && ($tile_row$$inline_363$$ -= 28);
            for(var $tile_y$$inline_364$$ = ($lineno$$inline_340$$ + ($vscroll$$inline_360$$ & 7) & 7) << 3, $row_precal$$inline_365$$ = $lineno$$inline_340$$ << 8, $tx$$inline_366$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$F$;$tx$$inline_366$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$K$;$tx$$inline_366$$++) {
              var $tile_props$$inline_367$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$J$ + (($tile_column$$inline_362$$ & 31) << 1) + ($tile_row$$inline_363$$ << 6), $secondbyte$$inline_368$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$tile_props$$inline_367$$ + 1], $pal$$inline_369$$ = ($secondbyte$$inline_368$$ & 8) << 1, $sx$$inline_370$$ = ($tx$$inline_366$$ << 3) + ($hscroll$$inline_359$$ & 7), $pixY$$inline_371$$ = 0 == ($secondbyte$$inline_368$$ & 4) ? $tile_y$$inline_364$$ : 
              56 - $tile_y$$inline_364$$, $tile$$inline_372$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$I$[($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$tile_props$$inline_367$$] & 255) + (($secondbyte$$inline_368$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_368$$ & 2)) {
                for($pixX$$inline_355$$ = 0;8 > $pixX$$inline_355$$ && 256 > $sx$$inline_370$$;$pixX$$inline_355$$++, $sx$$inline_370$$++) {
                  $colour$$inline_356$$ = $tile$$inline_372$$[$pixX$$inline_355$$ + $pixY$$inline_371$$], $temp$$inline_357$$ = 4 * ($sx$$inline_370$$ + $row_precal$$inline_365$$), $temp2$$inline_358$$ = 3 * ($colour$$inline_356$$ + $pal$$inline_369$$), $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$t$[$sx$$inline_370$$] = 0 != ($secondbyte$$inline_368$$ & 16) && 0 != $colour$$inline_356$$, $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_358$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_357$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_358$$ + 2]
                }
              }else {
                for($pixX$$inline_355$$ = 7;0 <= $pixX$$inline_355$$ && 256 > $sx$$inline_370$$;$pixX$$inline_355$$--, $sx$$inline_370$$++) {
                  $colour$$inline_356$$ = $tile$$inline_372$$[$pixX$$inline_355$$ + $pixY$$inline_371$$], $temp$$inline_357$$ = 4 * ($sx$$inline_370$$ + $row_precal$$inline_365$$), $temp2$$inline_358$$ = 3 * ($colour$$inline_356$$ + $pal$$inline_369$$), $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$t$[$sx$$inline_370$$] = 0 != ($secondbyte$$inline_368$$ & 16) && 0 != $colour$$inline_356$$, $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_357$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_358$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_357$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_358$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_357$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_358$$ + 2]
                }
              }
              $tile_column$$inline_362$$++;
              0 != $lock$$inline_361$$ && 23 == $tx$$inline_366$$ && ($tile_row$$inline_363$$ = $lineno$$inline_340$$ >> 3, $tile_y$$inline_364$$ = ($lineno$$inline_340$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$m$) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$m$ = !1;
              for(var $i$$inline_373$$ = 0;$i$$inline_373$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$q$.length;$i$$inline_373$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$q$[$i$$inline_373$$][0] = 0
              }
              var $height$$inline_374$$ = 0 == ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[1] & 1) && ($height$$inline_374$$ <<= 1);
              for(var $spriteno$$inline_375$$ = 0;64 > $spriteno$$inline_375$$;$spriteno$$inline_375$$++) {
                var $y$$inline_376$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$i$ + $spriteno$$inline_375$$] & 255;
                if(208 == $y$$inline_376$$) {
                  break
                }
                $y$$inline_376$$++;
                240 < $y$$inline_376$$ && ($y$$inline_376$$ -= 256);
                for(var $lineno$$inline_377$$ = $y$$inline_376$$;192 > $lineno$$inline_377$$;$lineno$$inline_377$$++) {
                  if($lineno$$inline_377$$ - $y$$inline_376$$ < $height$$inline_374$$) {
                    var $sprites$$inline_378$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$q$[$lineno$$inline_377$$];
                    if(!$sprites$$inline_378$$ || 8 <= $sprites$$inline_378$$[0]) {
                      break
                    }
                    var $off$$inline_379$$ = 3 * $sprites$$inline_378$$[0] + 1, $address$$inline_380$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$i$ + ($spriteno$$inline_375$$ << 1) + 128;
                    $sprites$$inline_378$$[$off$$inline_379$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$address$$inline_380$$++] & 255;
                    $sprites$$inline_378$$[$off$$inline_379$$++] = $y$$inline_376$$;
                    $sprites$$inline_378$$[$off$$inline_379$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$f$[$address$$inline_380$$] & 255;
                    $sprites$$inline_378$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$q$[$lineno$$inline_340$$][0]) {
              for(var $colour$$inline_381$$ = 0, $temp$$inline_382$$ = 0, $temp2$$inline_383$$ = 0, $i$$inline_384$$ = 0, $sprites$$inline_385$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$q$[$lineno$$inline_340$$], $count$$inline_386$$ = Math.min(8, $sprites$$inline_385$$[0]), $zoomed$$inline_387$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[1] & 1, $row_precal$$inline_388$$ = $lineno$$inline_340$$ << 8, $off$$inline_389$$ = 3 * $count$$inline_386$$;$i$$inline_384$$ < 
              $count$$inline_386$$;$i$$inline_384$$++) {
                var $n$$inline_390$$ = $sprites$$inline_385$$[$off$$inline_389$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[6] & 4) << 6, $y$$inline_391$$ = $sprites$$inline_385$$[$off$$inline_389$$--], $x$$inline_392$$ = $sprites$$inline_385$$[$off$$inline_389$$--] - ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[0] & 8), $tileRow$$inline_393$$ = $lineno$$inline_340$$ - $y$$inline_391$$ >> $zoomed$$inline_387$$;
                0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[1] & 2) && ($n$$inline_390$$ &= -2);
                var $tile$$inline_394$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$I$[$n$$inline_390$$ + (($tileRow$$inline_393$$ & 8) >> 3)], $pix$$inline_395$$ = 0;
                0 > $x$$inline_392$$ && ($pix$$inline_395$$ = -$x$$inline_392$$, $x$$inline_392$$ = 0);
                var $offset$$inline_396$$ = $pix$$inline_395$$ + (($tileRow$$inline_393$$ & 7) << 3);
                if(0 == $zoomed$$inline_387$$) {
                  for(;8 > $pix$$inline_395$$ && 256 > $x$$inline_392$$;$pix$$inline_395$$++, $x$$inline_392$$++) {
                    $colour$$inline_381$$ = $tile$$inline_394$$[$offset$$inline_396$$++], 0 == $colour$$inline_381$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$t$[$x$$inline_392$$] || ($temp$$inline_382$$ = 4 * ($x$$inline_392$$ + $row_precal$$inline_388$$), $temp2$$inline_383$$ = 3 * ($colour$$inline_381$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_395$$ && 256 > $x$$inline_392$$;$pix$$inline_395$$++, $x$$inline_392$$ += 2) {
                    $colour$$inline_381$$ = $tile$$inline_394$$[$offset$$inline_396$$++], 0 == $colour$$inline_381$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$t$[$x$$inline_392$$] || ($temp$$inline_382$$ = 4 * ($x$$inline_392$$ + $row_precal$$inline_388$$), $temp2$$inline_383$$ = 3 * ($colour$$inline_381$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$ + 2]), 0 == $colour$$inline_381$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$t$[$x$$inline_392$$ + 1] || ($temp$$inline_382$$ = 4 * ($x$$inline_392$$ + $row_precal$$inline_388$$ + 1), $temp2$$inline_383$$ = 3 * ($colour$$inline_381$$ + 
                    16), $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_382$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_383$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_385$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$h$ |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$main$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[0] & 32)) {
              for($temp$$inline_342$$ = 4 * ($lineno$$inline_340$$ << 8), $temp2$$inline_343$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[7] & 15) + 16), $i$$inline_341$$ = 0;8 > $i$$inline_341$$;$i$$inline_341$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_342$$ + $i$$inline_341$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_343$$], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_342$$ + $i$$inline_341$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_343$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$temp$$inline_342$$ + $i$$inline_341$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp2$$inline_343$$ + 
                2]
              }
            }
          }else {
            for(var $row_precal$$inline_397$$ = $lineno$$inline_340$$ << 8, $length$$inline_398$$ = 4 * ($row_precal$$inline_397$$ + 1024), $temp$$inline_399$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$c$[7] & 15) + 16), $row_precal$$inline_397$$ = 4 * $row_precal$$inline_397$$;$row_precal$$inline_397$$ < $length$$inline_398$$;$row_precal$$inline_397$$ += 4) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$row_precal$$inline_397$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp$$inline_399$$], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$row_precal$$inline_397$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp$$inline_399$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$b$[$row_precal$$inline_397$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_339$$.$a$[$temp$$inline_399$$ + 
              2]
            }
          }
        }
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_401$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$vdp$, $lineno$$inline_402$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$;
      192 >= $lineno$$inline_402$$ ? (0 == $JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$v$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$h$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$v$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$h$ & 4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$c$[0] & 
      16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$main$.$cpu$.$I$ = !0)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$h$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$c$[1] & 32) && 224 > $lineno$$inline_402$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_401$$.$main$.$cpu$.$I$ = !0));
      $JSCompiler_StaticMethods_eol$self$$inline_94$$.$I$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eol$self$$inline_94$$);
      $JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$++;
      if($JSCompiler_StaticMethods_eol$self$$inline_94$$.$lineno$ >= $JSCompiler_StaticMethods_eol$self$$inline_94$$.$main$.$no_of_scanlines$) {
        var $JSCompiler_StaticMethods_eof$self$$inline_404$$ = $JSCompiler_StaticMethods_eol$self$$inline_94$$;
        $JSCompiler_StaticMethods_eof$self$$inline_404$$.$main$.$pause_button$ && ($JSCompiler_StaticMethods_eof$self$$inline_404$$.$K$ = $JSCompiler_StaticMethods_eof$self$$inline_404$$.$J$, $JSCompiler_StaticMethods_eof$self$$inline_404$$.$J$ = !1, $JSCompiler_StaticMethods_eof$self$$inline_404$$.$O$ && ($JSCompiler_StaticMethods_eof$self$$inline_404$$.$b$++, $JSCompiler_StaticMethods_eof$self$$inline_404$$.$O$ = !1), $JSCompiler_StaticMethods_eof$self$$inline_404$$.push($JSCompiler_StaticMethods_eof$self$$inline_404$$.$b$), 
        $JSCompiler_StaticMethods_eof$self$$inline_404$$.$b$ = 102, $JSCompiler_StaticMethods_eof$self$$inline_404$$.$o$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_404$$.$main$.$pause_button$ = !1);
        $JSCompiler_StaticMethods_eof$self$$inline_404$$.$main$.$a$.$writeFrame$();
        $JSCompiler_temp$$2$$ = !0
      }else {
        $JSCompiler_StaticMethods_eol$self$$inline_94$$.$o$ += $JSCompiler_StaticMethods_eol$self$$inline_94$$.$main$.$cyclesPerLine$, $JSCompiler_temp$$2$$ = !1
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
function $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_readRom16bit$self$$, $address$$14$$) {
  return $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$14$$ & 16383) ? $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$14$$ >> 14].getUint16($address$$14$$ & 16383, !0) : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$14$$ >> 14].getUint8($address$$14$$ & 16383) | $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$14$$ >> 14].getUint8($address$$14$$ & 16383) << 8 : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$14$$ >> 14][$address$$14$$ & 16383] & 
  255 | ($JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$14$$ >> 14][$address$$14$$ & 16383] & 255) << 8
}
function $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_readRom8bit$self$$, $address$$13$$) {
  return $SUPPORT_DATAVIEW$$ ? $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$13$$ >> 14].getUint8($address$$13$$ & 16383) : $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$13$$ >> 14][$address$$13$$ & 16383] & 255
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $index$$46$$, $address$$11_address$$inline_98$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_location$$inline_100$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$11_address$$inline_98$$, $code$$8_code$$inline_104$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcode$$inline_101_operand$$2$$ = "", $inst$$inline_103_location$$28_offset$$16$$ = 
  0;
  $address$$11_address$$inline_98$$++;
  $inst$$inline_103_location$$28_offset$$16$$ = 0;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_location$$inline_100$$ = "ADD " + $index$$46$$ + ",BC";
      $code$$8_code$$inline_104$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_location$$inline_100$$ = "ADD " + $index$$46$$ + ",DE";
      $code$$8_code$$inline_104$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcode$$inline_101_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$));
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "," + $opcode$$inline_101_operand$$2$$;
      $code$$8_code$$inline_104$$ = "this.set" + $index$$46$$ + "(" + $opcode$$inline_101_operand$$2$$ + ");";
      $address$$11_address$$inline_98$$ += 2;
      break;
    case 34:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $opcode$$inline_101_operand$$2$$ = $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $opcode$$inline_101_operand$$2$$ + ")," + $index$$46$$;
      $code$$8_code$$inline_104$$ = "this.writeMem(" + $opcode$$inline_101_operand$$2$$ + ", this." + $index$$46$$.toLowerCase() + "L);this.writeMem(" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$ + 1) + ", this." + $index$$46$$.toLowerCase() + "H);";
      $address$$11_address$$inline_98$$ += 2;
      break;
    case 35:
      $inst$$3_location$$inline_100$$ = "INC " + $index$$46$$;
      $code$$8_code$$inline_104$$ = "this.inc" + $index$$46$$ + "();";
      break;
    case 36:
      $inst$$3_location$$inline_100$$ = "INC " + $index$$46$$ + "H *";
      break;
    case 37:
      $inst$$3_location$$inline_100$$ = "DEC " + $index$$46$$ + "H *";
      break;
    case 38:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$)) + " *";
      $address$$11_address$$inline_98$$++;
      break;
    case 41:
      $inst$$3_location$$inline_100$$ = "ADD " + $index$$46$$ + "  " + $index$$46$$;
      break;
    case 42:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + " (" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.ixL = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");this.ixH = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$ + 1) + ");";
      $address$$11_address$$inline_98$$ += 2;
      break;
    case 43:
      $inst$$3_location$$inline_100$$ = "DEC " + $index$$46$$;
      $code$$8_code$$inline_104$$ = "this.dec" + $index$$46$$ + "();";
      break;
    case 44:
      $inst$$3_location$$inline_100$$ = "INC " + $index$$46$$ + "L *";
      break;
    case 45:
      $inst$$3_location$$inline_100$$ = "DEC " + $index$$46$$ + "L *";
      break;
    case 46:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$));
      $address$$11_address$$inline_98$$++;
      break;
    case 52:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "INC (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.incMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 53:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "DEC (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.decMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 54:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $opcode$$inline_101_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$ + 1));
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")," + $opcode$$inline_101_operand$$2$$;
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", " + $opcode$$inline_101_operand$$2$$ + ");";
      $address$$11_address$$inline_98$$ += 2;
      break;
    case 57:
      $inst$$3_location$$inline_100$$ = "ADD " + $index$$46$$ + " SP";
      $code$$8_code$$inline_104$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_location$$inline_100$$ = "LD B," + $index$$46$$ + "H *";
      break;
    case 69:
      $inst$$3_location$$inline_100$$ = "LD B," + $index$$46$$ + "L *";
      break;
    case 70:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD B,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.b = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 76:
      $inst$$3_location$$inline_100$$ = "LD C," + $index$$46$$ + "H *";
      break;
    case 77:
      $inst$$3_location$$inline_100$$ = "LD C," + $index$$46$$ + "L *";
      break;
    case 78:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD C,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.c = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 84:
      $inst$$3_location$$inline_100$$ = "LD D," + $index$$46$$ + "H *";
      break;
    case 85:
      $inst$$3_location$$inline_100$$ = "LD D," + $index$$46$$ + "L *";
      break;
    case 86:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD D,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.d = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 92:
      $inst$$3_location$$inline_100$$ = "LD E," + $index$$46$$ + "H *";
      break;
    case 93:
      $inst$$3_location$$inline_100$$ = "LD E," + $index$$46$$ + "L *";
      break;
    case 94:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD E,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.e = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 96:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H,B *";
      break;
    case 97:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H,C *";
      break;
    case 98:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H,D *";
      break;
    case 99:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H,E *";
      break;
    case 100:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "H*";
      break;
    case 101:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "L *";
      break;
    case 102:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD H,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.h = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 103:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "H,A *";
      break;
    case 104:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L,B *";
      break;
    case 105:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L,C *";
      break;
    case 106:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L,D *";
      break;
    case 107:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L,E *";
      break;
    case 108:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "H *";
      break;
    case 109:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "L *";
      $code$$8_code$$inline_104$$ = "";
      break;
    case 110:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD L,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.l = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 111:
      $inst$$3_location$$inline_100$$ = "LD " + $index$$46$$ + "L,A *";
      $code$$8_code$$inline_104$$ = "this." + $index$$46$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),B";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.b);";
      $address$$11_address$$inline_98$$++;
      break;
    case 113:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),C";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.c);";
      $address$$11_address$$inline_98$$++;
      break;
    case 114:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),D";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.d);";
      $address$$11_address$$inline_98$$++;
      break;
    case 115:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),E";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.e);";
      $address$$11_address$$inline_98$$++;
      break;
    case 116:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),H";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.h);";
      $address$$11_address$$inline_98$$++;
      break;
    case 117:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),L";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.l);";
      $address$$11_address$$inline_98$$++;
      break;
    case 119:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "),A";
      $code$$8_code$$inline_104$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ", this.a);";
      $address$$11_address$$inline_98$$++;
      break;
    case 124:
      $inst$$3_location$$inline_100$$ = "LD A," + $index$$46$$ + "H *";
      break;
    case 125:
      $inst$$3_location$$inline_100$$ = "LD A," + $index$$46$$ + "L *";
      break;
    case 126:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "LD A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.a = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ");";
      $address$$11_address$$inline_98$$++;
      break;
    case 132:
      $inst$$3_location$$inline_100$$ = "ADD A," + $index$$46$$ + "H *";
      break;
    case 133:
      $inst$$3_location$$inline_100$$ = "ADD A," + $index$$46$$ + "L *";
      break;
    case 134:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "ADD A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.add_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "));";
      $address$$11_address$$inline_98$$++;
      break;
    case 140:
      $inst$$3_location$$inline_100$$ = "ADC A," + $index$$46$$ + "H *";
      break;
    case 141:
      $inst$$3_location$$inline_100$$ = "ADC A," + $index$$46$$ + "L *";
      break;
    case 142:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "ADC A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.adc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "));";
      $address$$11_address$$inline_98$$++;
      break;
    case 148:
      $inst$$3_location$$inline_100$$ = "SUB " + $index$$46$$ + "H *";
      break;
    case 149:
      $inst$$3_location$$inline_100$$ = "SUB " + $index$$46$$ + "L *";
      break;
    case 150:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "SUB A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.sub_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "));";
      $address$$11_address$$inline_98$$++;
      break;
    case 156:
      $inst$$3_location$$inline_100$$ = "SBC A," + $index$$46$$ + "H *";
      break;
    case 157:
      $inst$$3_location$$inline_100$$ = "SBC A," + $index$$46$$ + "L *";
      break;
    case 158:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "SBC A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.sbc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "));";
      $address$$11_address$$inline_98$$++;
      break;
    case 164:
      $inst$$3_location$$inline_100$$ = "AND " + $index$$46$$ + "H *";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_location$$inline_100$$ = "AND " + $index$$46$$ + "L *";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 166:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "AND A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")] | F_HALFCARRY;";
      $address$$11_address$$inline_98$$++;
      break;
    case 172:
      $inst$$3_location$$inline_100$$ = "XOR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_location$$inline_100$$ = "XOR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 174:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "XOR A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")];";
      $address$$11_address$$inline_98$$++;
      break;
    case 180:
      $inst$$3_location$$inline_100$$ = "OR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_location$$inline_100$$ = "OR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 182:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "OR A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")];";
      $address$$11_address$$inline_98$$++;
      break;
    case 188:
      $inst$$3_location$$inline_100$$ = "CP " + $index$$46$$ + "H *";
      $code$$8_code$$inline_104$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_location$$inline_100$$ = "CP " + $index$$46$$ + "L *";
      $code$$8_code$$inline_104$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 190:
      $inst$$inline_103_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $inst$$3_location$$inline_100$$ = "CP (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_104$$ = "this.cp_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_103_location$$28_offset$$16$$) + "));";
      $address$$11_address$$inline_98$$++;
      break;
    case 203:
      $inst$$3_location$$inline_100$$ = "location = this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$++)) + " & 0xFFFF;";
      $opcode$$inline_101_operand$$2$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$, $address$$11_address$$inline_98$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$ = [$opcode$$inline_101_operand$$2$$];
      $inst$$inline_103_location$$28_offset$$16$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$8_code$$inline_104$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$11_address$$inline_98$$++;
      switch($opcode$$inline_101_operand$$2$$) {
        case 0:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,RLC (" + $index$$46$$ + ")";
          break;
        case 4:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,RLC (" + $index$$46$$ + ")";
          break;
        case 5:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,RLC (" + $index$$46$$ + ")";
          break;
        case 6:
          $inst$$inline_103_location$$28_offset$$16$$ = "RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,RRC (" + $index$$46$$ + ")";
          break;
        case 9:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,RRC (" + $index$$46$$ + ")";
          break;
        case 10:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,RRC (" + $index$$46$$ + ")";
          break;
        case 11:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,RRC (" + $index$$46$$ + ")";
          break;
        case 12:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,RRC (" + $index$$46$$ + ")";
          break;
        case 13:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,RRC (" + $index$$46$$ + ")";
          break;
        case 14:
          $inst$$inline_103_location$$28_offset$$16$$ = "RRC (" + $index$$46$$ + ")";
          break;
        case 15:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,RRC (" + $index$$46$$ + ")";
          break;
        case 16:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,RL (" + $index$$46$$ + ")";
          break;
        case 17:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,RL (" + $index$$46$$ + ")";
          break;
        case 18:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,RL (" + $index$$46$$ + ")";
          break;
        case 19:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,RL (" + $index$$46$$ + ")";
          break;
        case 20:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,RL (" + $index$$46$$ + ")";
          break;
        case 21:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,RL (" + $index$$46$$ + ")";
          break;
        case 22:
          $inst$$inline_103_location$$28_offset$$16$$ = "RL (" + $index$$46$$ + ")";
          break;
        case 23:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,RL (" + $index$$46$$ + ")";
          break;
        case 24:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,RR (" + $index$$46$$ + ")";
          break;
        case 25:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,RR (" + $index$$46$$ + ")";
          break;
        case 26:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,RR (" + $index$$46$$ + ")";
          break;
        case 27:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,RR (" + $index$$46$$ + ")";
          break;
        case 28:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,RR (" + $index$$46$$ + ")";
          break;
        case 29:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_103_location$$28_offset$$16$$ = "RR (" + $index$$46$$ + ")";
          break;
        case 31:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_104$$ = $inst$$3_location$$inline_100$$ + "this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 32:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,SLA (" + $index$$46$$ + ")";
          break;
        case 33:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,SLA (" + $index$$46$$ + ")";
          break;
        case 34:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,SLA (" + $index$$46$$ + ")";
          break;
        case 35:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,SLA (" + $index$$46$$ + ")";
          break;
        case 36:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,SLA (" + $index$$46$$ + ")";
          break;
        case 37:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,SLA (" + $index$$46$$ + ")";
          break;
        case 38:
          $inst$$inline_103_location$$28_offset$$16$$ = "SLA (" + $index$$46$$ + ")";
          break;
        case 39:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,SLA (" + $index$$46$$ + ")";
          break;
        case 40:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,SRA (" + $index$$46$$ + ")";
          break;
        case 41:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,SRA (" + $index$$46$$ + ")";
          break;
        case 42:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,SRA (" + $index$$46$$ + ")";
          break;
        case 43:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,SRA (" + $index$$46$$ + ")";
          break;
        case 44:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,SRA (" + $index$$46$$ + ")";
          break;
        case 45:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,SRA (" + $index$$46$$ + ")";
          break;
        case 46:
          $inst$$inline_103_location$$28_offset$$16$$ = "SRA (" + $index$$46$$ + ")";
          break;
        case 47:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,SRA (" + $index$$46$$ + ")";
          break;
        case 48:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,SLL (" + $index$$46$$ + ")";
          break;
        case 49:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,SLL (" + $index$$46$$ + ")";
          break;
        case 50:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,SLL (" + $index$$46$$ + ")";
          break;
        case 51:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,SLL (" + $index$$46$$ + ")";
          break;
        case 52:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,SLL (" + $index$$46$$ + ")";
          break;
        case 53:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,SLL (" + $index$$46$$ + ")";
          break;
        case 54:
          $inst$$inline_103_location$$28_offset$$16$$ = "SLL (" + $index$$46$$ + ") *";
          break;
        case 55:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,SLL (" + $index$$46$$ + ")";
          break;
        case 56:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD B,SRL (" + $index$$46$$ + ")";
          break;
        case 57:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD C,SRL (" + $index$$46$$ + ")";
          break;
        case 58:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD D,SRL (" + $index$$46$$ + ")";
          break;
        case 59:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD E,SRL (" + $index$$46$$ + ")";
          break;
        case 60:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD H,SRL (" + $index$$46$$ + ")";
          break;
        case 61:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD L,SRL (" + $index$$46$$ + ")";
          break;
        case 62:
          $inst$$inline_103_location$$28_offset$$16$$ = "SRL (" + $index$$46$$ + ")";
          break;
        case 63:
          $inst$$inline_103_location$$28_offset$$16$$ = "LD A,SRL (" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "BIT 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "RES 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_103_location$$28_offset$$16$$ = "SET 7,(" + $index$$46$$ + ")"
      }
      $address$$11_address$$inline_98$$++;
      $inst$$3_location$$inline_100$$ = $inst$$inline_103_location$$28_offset$$16$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_102$$);
      break;
    case 225:
      $inst$$3_location$$inline_100$$ = "POP " + $index$$46$$;
      $code$$8_code$$inline_104$$ = "this.set" + $index$$46$$ + "(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$3_location$$inline_100$$ = "EX SP,(" + $index$$46$$ + ")";
      $code$$8_code$$inline_104$$ = "temp = this.get" + $index$$46$$ + "();this.set" + $index$$46$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_location$$inline_100$$ = "PUSH " + $index$$46$$;
      $code$$8_code$$inline_104$$ = "this.push2(this." + $index$$46$$.toLowerCase() + "H, this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_location$$inline_100$$ = "JP (" + $index$$46$$ + ")";
      $code$$8_code$$inline_104$$ = "this.pc = this.get" + $index$$46$$ + "(); return;";
      $address$$11_address$$inline_98$$ = null;
      break;
    case 249:
      $inst$$3_location$$inline_100$$ = "LD SP," + $index$$46$$, $code$$8_code$$inline_104$$ = "this.sp = this.get" + $index$$46$$ + "();"
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_location$$inline_100$$, code:$code$$8_code$$inline_104$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$11_address$$inline_98$$}
}
function $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) {
  var $opcode$$6_options$$inline_126$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$), $defaultInstruction$$inline_128_opcodesArray$$ = [$opcode$$6_options$$inline_126$$], $address$$inline_107_inst_opcode$$inline_117$$ = "Unknown Opcode", $currAddr_hexOpcodes$$inline_130$$ = $address$$8$$, $address$$inline_115_target$$46$$ = null, $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($opcode$$6_options$$inline_126$$) + 
  '";', $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "", $currAddr$$inline_120_inst$$inline_110_location$$26$$ = 0;
  $address$$8$$++;
  $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = {};
  switch($opcode$$6_options$$inline_126$$) {
    case 0:
      $address$$inline_107_inst_opcode$$inline_117$$ = "NOP";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 1:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD BC," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setBC(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 2:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (BC),A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getBC(), this.a);";
      break;
    case 3:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC BC";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.incBC();";
      break;
    case 4:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 7:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RLCA";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.rlca_a();";
      break;
    case 8:
      $address$$inline_107_inst_opcode$$inline_117$$ = "EX AF AF'";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.exAF();";
      break;
    case 9:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD HL,BC";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,(BC)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.readMem(this.getBC());";
      break;
    case 11:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC BC";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.decBC();";
      break;
    case 12:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 15:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RRCA";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.rrca_a();";
      break;
    case 16:
      $address$$inline_115_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_107_inst_opcode$$inline_117$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 17:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD DE," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setDE(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 18:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (DE),A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getDE(), this.a);";
      break;
    case 19:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC DE";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.incDE();";
      break;
    case 20:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 23:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RLA";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.rla_a();";
      break;
    case 24:
      $address$$inline_115_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      $address$$8$$ = null;
      break;
    case 25:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD HL,DE";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,(DE)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.readMem(this.getDE());";
      break;
    case 27:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC DE";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.decDE();";
      break;
    case 28:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 31:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RRA";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.rra_a();";
      break;
    case 32:
      $address$$inline_115_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if (!((this.f & F_ZERO) != 0x00)) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 33:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD HL," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 34:
      $currAddr$$inline_120_inst$$inline_110_location$$26$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($currAddr$$inline_120_inst$$inline_110_location$$26$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + "),HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($currAddr$$inline_120_inst$$inline_110_location$$26$$ + 1) + ", this.h);";
      $address$$8$$ += 2;
      break;
    case 35:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.incHL();";
      break;
    case 36:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 39:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DAA";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.daa();";
      break;
    case 40:
      $address$$inline_115_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 41:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD HL,HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD HL,(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(this.readMemWord(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + "));";
      $address$$8$$ += 2;
      break;
    case 43:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.decHL();";
      break;
    case 44:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 47:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CPL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cpl_a();";
      break;
    case 48:
      $address$$inline_115_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if (!((this.f & F_CARRY) != 0x00)) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 49:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD SP," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sp = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$ += 2;
      break;
    case 50:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + "),A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ", this.a);";
      $address$$8$$ += 2;
      break;
    case 51:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC SP";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sp++;";
      break;
    case 52:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC (HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC (HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL)," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$++;
      break;
    case 55:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SCF";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $address$$inline_115_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 57:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD HL,SP";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.readMem(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 59:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC SP";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sp--;";
      break;
    case 60:
      $address$$inline_107_inst_opcode$$inline_117$$ = "INC A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DEC A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ";";
      $address$$8$$++;
      break;
    case 63:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CCF";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.ccf();";
      break;
    case 64:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 65:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.c;";
      break;
    case 66:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.d;";
      break;
    case 67:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.e;";
      break;
    case 68:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.h;";
      break;
    case 69:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.l;";
      break;
    case 70:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.readMem(this.getHL());";
      break;
    case 71:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD B,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.b = this.a;";
      break;
    case 72:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.b;";
      break;
    case 73:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 74:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.d;";
      break;
    case 75:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.e;";
      break;
    case 76:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.h;";
      break;
    case 77:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.l;";
      break;
    case 78:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.readMem(this.getHL());";
      break;
    case 79:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD C,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.c = this.a;";
      break;
    case 80:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.b;";
      break;
    case 81:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.c;";
      break;
    case 82:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 83:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.e;";
      break;
    case 84:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.h;";
      break;
    case 85:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.l;";
      break;
    case 86:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.readMem(this.getHL());";
      break;
    case 87:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD D,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.d = this.a;";
      break;
    case 88:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.b;";
      break;
    case 89:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.c;";
      break;
    case 90:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.d;";
      break;
    case 91:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 92:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.h;";
      break;
    case 93:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.l;";
      break;
    case 94:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.readMem(this.getHL());";
      break;
    case 95:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD E,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.e = this.a;";
      break;
    case 96:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.b;";
      break;
    case 97:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.c;";
      break;
    case 98:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.d;";
      break;
    case 99:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.e;";
      break;
    case 100:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 101:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.l;";
      break;
    case 102:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.readMem(this.getHL());";
      break;
    case 103:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD H,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.h = this.a;";
      break;
    case 104:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.b;";
      break;
    case 105:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.c;";
      break;
    case 106:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.d;";
      break;
    case 107:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.e;";
      break;
    case 108:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.h;";
      break;
    case 109:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 110:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.readMem(this.getHL());";
      break;
    case 111:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD L,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.l = this.a;";
      break;
    case 112:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.b);";
      break;
    case 113:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.c);";
      break;
    case 114:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.d);";
      break;
    case 115:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.e);";
      break;
    case 116:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.h);";
      break;
    case 117:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.l);";
      break;
    case 118:
      $address$$inline_107_inst_opcode$$inline_117$$ = "HALT";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.tstates = 0x00;" + ("this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$8$$ - 1) + "; return;");
      break;
    case 119:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD (HL),A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.writeMem(this.getHL(), this.a);";
      break;
    case 120:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.b;";
      break;
    case 121:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.c;";
      break;
    case 122:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.d;";
      break;
    case 123:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.e;";
      break;
    case 124:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.h;";
      break;
    case 125:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.l;";
      break;
    case 126:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.readMem(this.getHL());";
      break;
    case 127:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "";
      break;
    case 128:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.b);";
      break;
    case 129:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.c);";
      break;
    case 130:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.d);";
      break;
    case 131:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.e);";
      break;
    case 132:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.h);";
      break;
    case 133:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.l);";
      break;
    case 134:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.readMem(this.getHL()));";
      break;
    case 135:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(this.a);";
      break;
    case 136:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.readMem(this.getHL()));";
      break;
    case 143:
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.readMem(this.getHL()));";
      break;
    case 151:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.readMem(this.getHL()));";
      break;
    case 159:
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
      break;
    case 175:
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = " + $JSSMS$Utils$toHex$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
      break;
    case 183:
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,B";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,D";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,E";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,H";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,L";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,(HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.readMem(this.getHL()));";
      break;
    case 191:
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP A,A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET NZ";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $address$$inline_107_inst_opcode$$inline_117$$ = "POP BC";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 195:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      $address$$8$$ = null;
      break;
    case 196:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 197:
      $address$$inline_107_inst_opcode$$inline_117$$ = "PUSH BC";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADD A," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.add_a(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$++;
      break;
    case 199:
      $address$$inline_115_target$$46$$ = 0;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 200:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET Z";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.pc = this.readMemWord(this.sp); this.sp += 0x02; return;";
      $address$$8$$ = null;
      break;
    case 202:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 203:
      var $address$$inline_107_inst_opcode$$inline_117$$ = $address$$8$$, $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_107_inst_opcode$$inline_117$$), $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = [$code$$5_opcode$$inline_108_opcodesArray$$inline_118$$], $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "Unimplemented 0xCB prefixed opcode", $currAddr$$inline_111_target$$inline_121$$ = 
      $address$$inline_107_inst_opcode$$inline_117$$, $code$$inline_112_code$$inline_122$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
      $address$$inline_107_inst_opcode$$inline_117$$++;
      switch($code$$5_opcode$$inline_108_opcodesArray$$inline_118$$) {
        case 0:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.rlc(this.b);";
          break;
        case 1:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.rlc(this.c);";
          break;
        case 2:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.rlc(this.d);";
          break;
        case 3:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.rlc(this.e);";
          break;
        case 4:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.rlc(this.h);";
          break;
        case 5:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.rlc(this.l);";
          break;
        case 6:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
          break;
        case 7:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RLC A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.rlc(this.a);";
          break;
        case 8:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.rrc(this.b);";
          break;
        case 9:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.rrc(this.c);";
          break;
        case 10:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.rrc(this.d);";
          break;
        case 11:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.rrc(this.e);";
          break;
        case 12:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.rrc(this.h);";
          break;
        case 13:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.rrc(this.l);";
          break;
        case 14:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
          break;
        case 15:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RRC A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.rrc(this.a);";
          break;
        case 16:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.rl(this.b);";
          break;
        case 17:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.rl(this.c);";
          break;
        case 18:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.rl(this.d);";
          break;
        case 19:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.rl(this.e);";
          break;
        case 20:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.rl(this.h);";
          break;
        case 21:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.rl(this.l);";
          break;
        case 22:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
          break;
        case 23:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RL A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.rl(this.a);";
          break;
        case 24:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.rr(this.b);";
          break;
        case 25:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.rr(this.c);";
          break;
        case 26:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.rr(this.d);";
          break;
        case 27:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.rr(this.e);";
          break;
        case 28:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.rr(this.h);";
          break;
        case 29:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.rr(this.l);";
          break;
        case 30:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
          break;
        case 31:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RR A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.rr(this.a);";
          break;
        case 32:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.sla(this.b);";
          break;
        case 33:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.sla(this.c);";
          break;
        case 34:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.sla(this.d);";
          break;
        case 35:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.sla(this.e);";
          break;
        case 36:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.sla(this.h);";
          break;
        case 37:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.sla(this.l);";
          break;
        case 38:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
          break;
        case 39:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLA A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.sla(this.a);";
          break;
        case 40:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.sra(this.b);";
          break;
        case 41:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.sra(this.c);";
          break;
        case 42:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.sra(this.d);";
          break;
        case 43:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.sra(this.e);";
          break;
        case 44:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.sra(this.h);";
          break;
        case 45:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.sra(this.l);";
          break;
        case 46:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
          break;
        case 47:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRA A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.sra(this.a);";
          break;
        case 48:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.sll(this.b);";
          break;
        case 49:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.sll(this.c);";
          break;
        case 50:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.sll(this.d);";
          break;
        case 51:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.sll(this.e);";
          break;
        case 52:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.sll(this.h);";
          break;
        case 53:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.sll(this.l);";
          break;
        case 54:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
          break;
        case 55:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SLL A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.sll(this.a);";
          break;
        case 56:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL B";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.srl(this.b);";
          break;
        case 57:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL C";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.srl(this.c);";
          break;
        case 58:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL D";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.srl(this.d);";
          break;
        case 59:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL E";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.srl(this.e);";
          break;
        case 60:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL H";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.srl(this.h);";
          break;
        case 61:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL L";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.srl(this.l);";
          break;
        case 62:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL (HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
          break;
        case 63:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SRL A";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.srl(this.a);";
          break;
        case 64:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_0);";
          break;
        case 65:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_0);";
          break;
        case 66:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_0);";
          break;
        case 67:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_0);";
          break;
        case 68:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_0);";
          break;
        case 69:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_0);";
          break;
        case 70:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
          break;
        case 71:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 0,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_0);";
          break;
        case 72:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_1);";
          break;
        case 73:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_1);";
          break;
        case 74:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_1);";
          break;
        case 75:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_1);";
          break;
        case 76:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_1);";
          break;
        case 77:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_1);";
          break;
        case 78:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
          break;
        case 79:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 1,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_1);";
          break;
        case 80:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_2);";
          break;
        case 81:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_2);";
          break;
        case 82:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_2);";
          break;
        case 83:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_2);";
          break;
        case 84:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_2);";
          break;
        case 85:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_2);";
          break;
        case 86:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
          break;
        case 87:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 2,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_2);";
          break;
        case 88:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_3);";
          break;
        case 89:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_3);";
          break;
        case 90:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_3);";
          break;
        case 91:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_3);";
          break;
        case 92:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_3);";
          break;
        case 93:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_3);";
          break;
        case 94:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
          break;
        case 95:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 3,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_3);";
          break;
        case 96:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_4);";
          break;
        case 97:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_4);";
          break;
        case 98:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_4);";
          break;
        case 99:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_4);";
          break;
        case 100:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_4);";
          break;
        case 101:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_4);";
          break;
        case 102:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
          break;
        case 103:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 4,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_4);";
          break;
        case 104:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_5);";
          break;
        case 105:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_5);";
          break;
        case 106:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_5);";
          break;
        case 107:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_5);";
          break;
        case 108:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_5);";
          break;
        case 109:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_5);";
          break;
        case 110:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
          break;
        case 111:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 5,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_5);";
          break;
        case 112:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_6);";
          break;
        case 113:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_6);";
          break;
        case 114:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_6);";
          break;
        case 115:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_6);";
          break;
        case 116:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_6);";
          break;
        case 117:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_6);";
          break;
        case 118:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
          break;
        case 119:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 6,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_6);";
          break;
        case 120:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,B";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.b & BIT_7);";
          break;
        case 121:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,C";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.c & BIT_7);";
          break;
        case 122:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,D";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.d & BIT_7);";
          break;
        case 123:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,E";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.e & BIT_7);";
          break;
        case 124:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,H";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.h & BIT_7);";
          break;
        case 125:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,L";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.l & BIT_7);";
          break;
        case 126:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
          break;
        case 127:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "BIT 7,A";
          $code$$inline_112_code$$inline_122$$ = "this.bit(this.a & BIT_7);";
          break;
        case 128:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,B";
          $code$$inline_112_code$$inline_122$$ = "this.b &= ~BIT_0;";
          break;
        case 129:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,C";
          $code$$inline_112_code$$inline_122$$ = "this.c &= ~BIT_0;";
          break;
        case 130:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,D";
          $code$$inline_112_code$$inline_122$$ = "this.d &= ~BIT_0;";
          break;
        case 131:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,E";
          $code$$inline_112_code$$inline_122$$ = "this.e &= ~BIT_0;";
          break;
        case 132:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,H";
          $code$$inline_112_code$$inline_122$$ = "this.h &= ~BIT_0;";
          break;
        case 133:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,L";
          $code$$inline_112_code$$inline_122$$ = "this.l &= ~BIT_0;";
          break;
        case 134:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
          break;
        case 135:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 0,A";
          $code$$inline_112_code$$inline_122$$ = "this.a &= ~BIT_0;";
          break;
        case 136:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,B";
          break;
        case 137:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,C";
          break;
        case 138:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,D";
          break;
        case 139:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,E";
          break;
        case 140:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,H";
          break;
        case 141:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,L";
          break;
        case 142:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
          break;
        case 143:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 1,A";
          break;
        case 144:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,B";
          break;
        case 145:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,C";
          break;
        case 146:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,D";
          break;
        case 147:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,E";
          break;
        case 148:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,H";
          break;
        case 149:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,L";
          break;
        case 150:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
          break;
        case 151:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 2,A";
          break;
        case 152:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,B";
          break;
        case 153:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,C";
          break;
        case 154:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,D";
          break;
        case 155:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,E";
          break;
        case 156:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,H";
          break;
        case 157:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,L";
          break;
        case 158:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
          break;
        case 159:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 3,A";
          $code$$inline_112_code$$inline_122$$ = "this.a &= ~BIT_3;";
          break;
        case 160:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,B";
          break;
        case 161:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,C";
          break;
        case 162:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,D";
          break;
        case 163:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,E";
          break;
        case 164:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,H";
          break;
        case 165:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,L";
          break;
        case 166:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
          break;
        case 167:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 4,A";
          $code$$inline_112_code$$inline_122$$ = "this.a &= ~BIT_4;";
          break;
        case 168:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,B";
          break;
        case 169:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,C";
          break;
        case 170:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,D";
          break;
        case 171:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,E";
          break;
        case 172:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,H";
          break;
        case 173:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,L";
          break;
        case 174:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
          break;
        case 175:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 5,A";
          break;
        case 176:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,B";
          break;
        case 177:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,C";
          break;
        case 178:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,D";
          break;
        case 179:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,E";
          break;
        case 180:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,H";
          break;
        case 181:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,L";
          break;
        case 182:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
          break;
        case 183:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 6,A";
          $code$$inline_112_code$$inline_122$$ = "this.a &= ~BIT_6;";
          break;
        case 184:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,B";
          $code$$inline_112_code$$inline_122$$ = "this.b &= ~BIT_7;";
          break;
        case 185:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,C";
          $code$$inline_112_code$$inline_122$$ = "this.c &= ~BIT_7;";
          break;
        case 186:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,D";
          $code$$inline_112_code$$inline_122$$ = "this.d &= ~BIT_7;";
          break;
        case 187:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,E";
          $code$$inline_112_code$$inline_122$$ = "this.e &= ~BIT_7;";
          break;
        case 188:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,H";
          $code$$inline_112_code$$inline_122$$ = "this.h &= ~BIT_7;";
          break;
        case 189:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,L";
          $code$$inline_112_code$$inline_122$$ = "this.l &= ~BIT_7;";
          break;
        case 190:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
          break;
        case 191:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "RES 7,A";
          $code$$inline_112_code$$inline_122$$ = "this.a &= ~BIT_7;";
          break;
        case 192:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,B";
          $code$$inline_112_code$$inline_122$$ = "this.b |= BIT_0;";
          break;
        case 193:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,C";
          $code$$inline_112_code$$inline_122$$ = "this.c |= BIT_0;";
          break;
        case 194:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,D";
          $code$$inline_112_code$$inline_122$$ = "this.d |= BIT_0;";
          break;
        case 195:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,E";
          $code$$inline_112_code$$inline_122$$ = "this.e |= BIT_0;";
          break;
        case 196:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,H";
          $code$$inline_112_code$$inline_122$$ = "this.h |= BIT_0;";
          break;
        case 197:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,L";
          $code$$inline_112_code$$inline_122$$ = "this.l |= BIT_0;";
          break;
        case 198:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
          break;
        case 199:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 0,A";
          $code$$inline_112_code$$inline_122$$ = "this.a |= BIT_0;";
          break;
        case 200:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,B";
          break;
        case 201:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,C";
          break;
        case 202:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,D";
          break;
        case 203:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,E";
          break;
        case 204:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,H";
          break;
        case 205:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,L";
          break;
        case 206:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
          break;
        case 207:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 1,A";
          break;
        case 208:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,B";
          break;
        case 209:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,C";
          break;
        case 210:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,D";
          break;
        case 211:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,E";
          break;
        case 212:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,H";
          break;
        case 213:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,L";
          break;
        case 214:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
          break;
        case 215:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 2,A";
          break;
        case 216:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,B";
          break;
        case 217:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,C";
          break;
        case 218:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,D";
          break;
        case 219:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,E";
          break;
        case 220:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,H";
          break;
        case 221:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,L";
          break;
        case 222:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
          break;
        case 223:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 3,A";
          break;
        case 224:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,B";
          break;
        case 225:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,C";
          break;
        case 226:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,D";
          break;
        case 227:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,E";
          break;
        case 228:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,H";
          break;
        case 229:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,L";
          break;
        case 230:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
          break;
        case 231:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 4,A";
          $code$$inline_112_code$$inline_122$$ = "this.a |= BIT_4;";
          break;
        case 232:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,B";
          break;
        case 233:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,C";
          break;
        case 234:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,D";
          break;
        case 235:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,E";
          break;
        case 236:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,H";
          break;
        case 237:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,L";
          break;
        case 238:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
          break;
        case 239:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 5,A";
          $code$$inline_112_code$$inline_122$$ = "this.a |= BIT_5;";
          break;
        case 240:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,B";
          $code$$inline_112_code$$inline_122$$ = "this.b |= BIT_6;";
          break;
        case 241:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,C";
          $code$$inline_112_code$$inline_122$$ = "this.c |= BIT_6;";
          break;
        case 242:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,D";
          $code$$inline_112_code$$inline_122$$ = "this.d |= BIT_6;";
          break;
        case 243:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,E";
          $code$$inline_112_code$$inline_122$$ = "this.e |= BIT_6;";
          break;
        case 244:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,H";
          $code$$inline_112_code$$inline_122$$ = "this.h |= BIT_6;";
          break;
        case 245:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,L";
          $code$$inline_112_code$$inline_122$$ = "this.l |= BIT_6;";
          break;
        case 246:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
          break;
        case 247:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 6,A";
          $code$$inline_112_code$$inline_122$$ = "this.a |= BIT_6;";
          break;
        case 248:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,B";
          $code$$inline_112_code$$inline_122$$ = "this.b |= BIT_7;";
          break;
        case 249:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,C";
          $code$$inline_112_code$$inline_122$$ = "this.c |= BIT_7;";
          break;
        case 250:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,D";
          $code$$inline_112_code$$inline_122$$ = "this.d |= BIT_7;";
          break;
        case 251:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,E";
          $code$$inline_112_code$$inline_122$$ = "this.e |= BIT_7;";
          break;
        case 252:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,H";
          $code$$inline_112_code$$inline_122$$ = "this.h |= BIT_7;";
          break;
        case 253:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,L";
          $code$$inline_112_code$$inline_122$$ = "this.l |= BIT_7;";
          break;
        case 254:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,(HL)";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
          break;
        case 255:
          $currAddr$$inline_120_inst$$inline_110_location$$26$$ = "SET 7,A", $code$$inline_112_code$$inline_122$$ = "this.a |= BIT_7;"
      }
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = {$opcode$:$code$$5_opcode$$inline_108_opcodesArray$$inline_118$$, $opcodes$:$_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$, $inst$:$currAddr$$inline_120_inst$$inline_110_location$$26$$, code:$code$$inline_112_code$$inline_122$$, $address$:$currAddr$$inline_111_target$$inline_121$$, $nextAddress$:$address$$inline_107_inst_opcode$$inline_117$$};
      $address$$inline_107_inst_opcode$$inline_117$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$inst$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.code;
      $defaultInstruction$$inline_128_opcodesArray$$ = $defaultInstruction$$inline_128_opcodesArray$$.concat($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$nextAddress$;
      break;
    case 204:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 205:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      $address$$8$$ += 2;
      break;
    case 206:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "ADC ," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.adc_a(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$++;
      break;
    case 207:
      $address$$inline_115_target$$46$$ = 8;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 208:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET NC";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $address$$inline_107_inst_opcode$$inline_117$$ = "POP DE";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 211:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$) + "),A";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.port.out(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$) + ", this.a);";
      $address$$8$$++;
      break;
    case 212:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 213:
      $address$$inline_107_inst_opcode$$inline_117$$ = "PUSH DE";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "SUB " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sub_a(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$++;
      break;
    case 215:
      $address$$inline_115_target$$46$$ = 16;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 216:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET C";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $address$$inline_107_inst_opcode$$inline_117$$ = "EXX";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 219:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.a = this.port.in_(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$) + ");";
      $address$$8$$++;
      break;
    case 220:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 221:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IX", $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$inst$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.code;
      $defaultInstruction$$inline_128_opcodesArray$$ = $defaultInstruction$$inline_128_opcodesArray$$.concat($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$nextAddress$;
      break;
    case 222:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "SBC A," + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sbc_a(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$++;
      break;
    case 223:
      $address$$inline_115_target$$46$$ = 24;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 224:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET PO";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $address$$inline_107_inst_opcode$$inline_117$$ = "POP HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_PARITY) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 227:
      $address$$inline_107_inst_opcode$$inline_117$$ = "EX (SP),HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "temp = this.h;this.h = this.readMem(this.sp + 0x01);this.writeMem(this.sp + 0x01, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
      break;
    case 228:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 229:
      $address$$inline_107_inst_opcode$$inline_117$$ = "PUSH HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "AND (" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + "] | F_HALFCARRY;";
      $address$$8$$++;
      break;
    case 231:
      $address$$inline_115_target$$46$$ = 32;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 232:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET PE";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP (HL)";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.pc = this.getHL(); return;";
      $address$$8$$ = null;
      break;
    case 234:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_PARITY) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 235:
      $address$$inline_107_inst_opcode$$inline_117$$ = "EX DE,HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 237:
      var $address$$inline_115_target$$46$$ = $address$$8$$, $address$$inline_107_inst_opcode$$inline_117$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$), $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = [$address$$inline_107_inst_opcode$$inline_117$$], $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "Unimplemented 0xED prefixed opcode", $currAddr$$inline_120_inst$$inline_110_location$$26$$ = $address$$inline_115_target$$46$$, 
      $currAddr$$inline_111_target$$inline_121$$ = null, $code$$inline_112_code$$inline_122$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_123$$ = "", $location$$inline_124$$ = 0;
      $address$$inline_115_target$$46$$++;
      switch($address$$inline_107_inst_opcode$$inline_117$$) {
        case 64:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN B,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
          break;
        case 65:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),B";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.b);";
          break;
        case 66:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "SBC HL,BC";
          $code$$inline_112_code$$inline_122$$ = "this.sbc16(this.getBC());";
          break;
        case 67:
          $location$$inline_124$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$);
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($location$$inline_124$$);
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD (" + $operand$$inline_123$$ + "),BC";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(" + $operand$$inline_123$$ + ", this.c);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_124$$ + 1) + ", this.b);";
          $address$$inline_115_target$$46$$ += 2;
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
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "NEG";
          $code$$inline_112_code$$inline_122$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "RETN / RETI";
          $code$$inline_112_code$$inline_122$$ = "this.pc = this.readMemWord(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
          $address$$inline_115_target$$46$$ = null;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IM 0";
          $code$$inline_112_code$$inline_122$$ = "this.im = 0x00;";
          break;
        case 71:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD I,A";
          $code$$inline_112_code$$inline_122$$ = "this.i = this.a;";
          break;
        case 72:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN C,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
          break;
        case 73:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),C";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.c);";
          break;
        case 74:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "ADC HL,BC";
          $code$$inline_112_code$$inline_122$$ = "this.adc16(this.getBC());";
          break;
        case 75:
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$));
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD BC,(" + $operand$$inline_123$$ + ")";
          $code$$inline_112_code$$inline_122$$ = "this.setBC(this.readMemWord(" + $operand$$inline_123$$ + "));";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 79:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD R,A";
          $code$$inline_112_code$$inline_122$$ = "this.r = this.a;";
          break;
        case 80:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN D,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
          break;
        case 81:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),D";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.d);";
          break;
        case 82:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "SBC HL,DE";
          $code$$inline_112_code$$inline_122$$ = "this.sbc16(this.getDE());";
          break;
        case 83:
          $location$$inline_124$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$);
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($location$$inline_124$$);
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD (" + $operand$$inline_123$$ + "),DE";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(" + $operand$$inline_123$$ + ", this.e);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_124$$ + 1) + ", this.d);";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 86:
        ;
        case 118:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IM 1";
          $code$$inline_112_code$$inline_122$$ = "this.im = 0x01;";
          break;
        case 87:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD A,I";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
          break;
        case 88:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN E,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
          break;
        case 89:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),E";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.e);";
          break;
        case 90:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "ADC HL,DE";
          $code$$inline_112_code$$inline_122$$ = "this.adc16(this.getDE());";
          break;
        case 91:
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$));
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD DE,(" + $operand$$inline_123$$ + ")";
          $code$$inline_112_code$$inline_122$$ = "this.setDE(this.readMemWord(" + $operand$$inline_123$$ + "));";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 95:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD A,R";
          $code$$inline_112_code$$inline_122$$ = "this.a = JSSMS.Utils.rndInt(0xFF);this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
          break;
        case 96:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN H,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
          break;
        case 97:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),H";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.h);";
          break;
        case 98:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "SBC HL,HL";
          $code$$inline_112_code$$inline_122$$ = "this.sbc16(this.getHL());";
          break;
        case 99:
          $location$$inline_124$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$);
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($location$$inline_124$$);
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD (" + $operand$$inline_123$$ + "),HL";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(" + $operand$$inline_123$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_124$$ + 1) + ", this.h);";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 103:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "RRD";
          $code$$inline_112_code$$inline_122$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 104:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN L,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
          break;
        case 105:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),L";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.l);";
          break;
        case 106:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "ADC HL,HL";
          $code$$inline_112_code$$inline_122$$ = "this.adc16(this.getHL());";
          break;
        case 107:
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$));
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD HL,(" + $operand$$inline_123$$ + ")";
          $code$$inline_112_code$$inline_122$$ = "this.setHL(this.readMemWord(" + $operand$$inline_123$$ + "));";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 111:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "RLD";
          $code$$inline_112_code$$inline_122$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 113:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),0";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, 0);";
          break;
        case 114:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "SBC HL,SP";
          $code$$inline_112_code$$inline_122$$ = "this.sbc16(this.sp);";
          break;
        case 115:
          $location$$inline_124$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$);
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($location$$inline_124$$);
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD (" + $operand$$inline_123$$ + "),SP";
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(" + $operand$$inline_123$$ + ", this.sp & 0xFF);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_124$$ + 1) + ", this.sp >> 8);";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 120:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IN A,(C)";
          $code$$inline_112_code$$inline_122$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 121:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUT (C),A";
          $code$$inline_112_code$$inline_122$$ = "this.port.out(this.c, this.a);";
          break;
        case 122:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "ADC HL,SP";
          $code$$inline_112_code$$inline_122$$ = "this.adc16(this.sp);";
          break;
        case 123:
          $operand$$inline_123$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_115_target$$46$$));
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LD SP,(" + $operand$$inline_123$$ + ")";
          $code$$inline_112_code$$inline_122$$ = "this.sp = this.readMemWord(" + $operand$$inline_123$$ + ");";
          $address$$inline_115_target$$46$$ += 2;
          break;
        case 160:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LDI";
          $code$$inline_112_code$$inline_122$$ = "temp = this.readMem(this.getHL());this.writeMem(this.getDE(), temp);this.decBC();this.incDE();this.incHL();temp = (temp + this.a) & 0xFF;this.f = (this.f & 0xC1) | (this.getBC() ? F_PARITY : 0) | (temp & 0x08) | ((temp & 0x02) ? 0x20 : 0);";
          break;
        case 161:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "CPI";
          $code$$inline_112_code$$inline_122$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
          break;
        case 162:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "INI";
          $code$$inline_112_code$$inline_122$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 163:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUTI";
          $code$$inline_112_code$$inline_122$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 168:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LDD";
          break;
        case 169:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "CPD";
          break;
        case 170:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "IND";
          $code$$inline_112_code$$inline_122$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 171:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OUTD";
          $code$$inline_112_code$$inline_122$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 176:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LDIR";
          $currAddr$$inline_111_target$$inline_121$$ = $address$$inline_115_target$$46$$ - 2;
          $code$$inline_112_code$$inline_122$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();if (this.getBC() != 0x00) {this.tstates -= 0x05;this.f |= F_PARITY;return;} else {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
          break;
        case 177:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "CPIR";
          $currAddr$$inline_111_target$$inline_121$$ = $address$$inline_115_target$$46$$ - 2;
          $code$$inline_112_code$$inline_122$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);" + ("if ((temp & F_PARITY) != 0x00 && (this.f & F_ZERO) == 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($currAddr$$inline_111_target$$inline_121$$) + ";return;}");
          $code$$inline_112_code$$inline_122$$ += "this.f = (this.f & 0xF8) | temp;";
          break;
        case 178:
          $currAddr$$inline_111_target$$inline_121$$ = $address$$inline_115_target$$46$$ - 2;
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "INIR";
          $code$$inline_112_code$$inline_122$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 179:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OTIR";
          $currAddr$$inline_111_target$$inline_121$$ = $address$$inline_115_target$$46$$ - 2;
          $code$$inline_112_code$$inline_122$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}";
          $code$$inline_112_code$$inline_122$$ += "if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 184:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "LDDR";
          break;
        case 185:
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "CPDR";
          break;
        case 186:
          $currAddr$$inline_111_target$$inline_121$$ = $address$$inline_115_target$$46$$ - 2;
          $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "INDR";
          $code$$inline_112_code$$inline_122$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 187:
          $currAddr$$inline_111_target$$inline_121$$ = $address$$inline_115_target$$46$$ - 2, $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = "OTDR", $code$$inline_112_code$$inline_122$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}"
      }
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = {$opcode$:$address$$inline_107_inst_opcode$$inline_117$$, $opcodes$:$code$$5_opcode$$inline_108_opcodesArray$$inline_118$$, $inst$:$_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$, code:$code$$inline_112_code$$inline_122$$, $address$:$currAddr$$inline_120_inst$$inline_110_location$$26$$, $nextAddress$:$address$$inline_115_target$$46$$, target:$currAddr$$inline_111_target$$inline_121$$};
      $address$$inline_115_target$$46$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.target;
      $address$$inline_107_inst_opcode$$inline_117$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$inst$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.code;
      $defaultInstruction$$inline_128_opcodesArray$$ = $defaultInstruction$$inline_128_opcodesArray$$.concat($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$nextAddress$;
      break;
    case 238:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "XOR " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + "];";
      $address$$8$$++;
      break;
    case 239:
      $address$$inline_115_target$$46$$ = 40;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 240:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET P";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $address$$inline_107_inst_opcode$$inline_117$$ = "POP AF";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.setAF(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_SIGN) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 243:
      $address$$inline_107_inst_opcode$$inline_117$$ = "DI";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 245:
      $address$$inline_107_inst_opcode$$inline_117$$ = "PUSH AF";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "OR " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + "];";
      $address$$8$$++;
      break;
    case 247:
      $address$$inline_115_target$$46$$ = 48;
      $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$);
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;";
      break;
    case 248:
      $address$$inline_107_inst_opcode$$inline_117$$ = "RET M";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $address$$inline_107_inst_opcode$$inline_117$$ = "LD SP,HL";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_SIGN) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 251:
      $address$$inline_107_inst_opcode$$inline_117$$ = "EI";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $address$$inline_115_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ")";
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 253:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IY", $address$$8$$);
      $address$$inline_107_inst_opcode$$inline_117$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$inst$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.code;
      $defaultInstruction$$inline_128_opcodesArray$$ = $defaultInstruction$$inline_128_opcodesArray$$.concat($_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$.$nextAddress$;
      break;
    case 254:
      $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_107_inst_opcode$$inline_117$$ = "CP " + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$;
      $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.cp_a(" + $_inst_inst$$inline_119_opcodesArray$$inline_109_operand$$ + ");";
      $address$$8$$++;
      break;
    case 255:
      $address$$inline_115_target$$46$$ = 56, $address$$inline_107_inst_opcode$$inline_117$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$), $code$$5_opcode$$inline_108_opcodesArray$$inline_118$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_115_target$$46$$) + "; return;"
  }
  var $opcode$$6_options$$inline_126$$ = {$opcode$:$opcode$$6_options$$inline_126$$, $opcodes$:$defaultInstruction$$inline_128_opcodesArray$$, $inst$:$address$$inline_107_inst_opcode$$inline_117$$, code:$code$$5_opcode$$inline_108_opcodesArray$$inline_118$$, $address$:$currAddr_hexOpcodes$$inline_130$$, $nextAddress$:$address$$8$$, target:$address$$inline_115_target$$46$$}, $defaultInstruction$$inline_128_opcodesArray$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", 
  $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""}, $prop$$inline_129$$, $currAddr_hexOpcodes$$inline_130$$ = "";
  for($prop$$inline_129$$ in $defaultInstruction$$inline_128_opcodesArray$$) {
    void 0 != $opcode$$6_options$$inline_126$$[$prop$$inline_129$$] && ($defaultInstruction$$inline_128_opcodesArray$$[$prop$$inline_129$$] = $opcode$$6_options$$inline_126$$[$prop$$inline_129$$])
  }
  $defaultInstruction$$inline_128_opcodesArray$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_128_opcodesArray$$.$address$);
  $defaultInstruction$$inline_128_opcodesArray$$.$opcodes$.length && ($currAddr_hexOpcodes$$inline_130$$ = $defaultInstruction$$inline_128_opcodesArray$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
  $defaultInstruction$$inline_128_opcodesArray$$.label = $defaultInstruction$$inline_128_opcodesArray$$.$hexAddress$ + " " + $currAddr_hexOpcodes$$inline_130$$ + $defaultInstruction$$inline_128_opcodesArray$$.$inst$;
  return $defaultInstruction$$inline_128_opcodesArray$$
}
function $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_parseInstructions$self$$) {
  $JSSMS$Utils$console$time$$("Instructions parsing");
  var $romSize$$ = 16384 * $JSCompiler_StaticMethods_parseInstructions$self$$.$rom$.length, $instruction$$, $currentAddress$$, $i$$11$$ = 0, $addresses$$ = [], $entryPoints$$ = [0, 56, 102];
  for($entryPoints$$.forEach(function($entryPoint$$) {
    $addresses$$.push($entryPoint$$)
  });$addresses$$.length;) {
    $currentAddress$$ = $addresses$$.shift(), $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$currentAddress$$] || ($currentAddress$$ >= $romSize$$ || 65 <= $currentAddress$$ >> 10 ? $JSSMS$Utils$console$log$$("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$)) : ($instruction$$ = $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_parseInstructions$self$$, $currentAddress$$), $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$currentAddress$$] = 
    $instruction$$, null != $instruction$$.$nextAddress$ && $addresses$$.push($instruction$$.$nextAddress$), null != $instruction$$.target && $addresses$$.push($instruction$$.target)))
  }
  for($entryPoints$$.forEach(function($entryPoint$$1$$) {
    this.$instructions$[$entryPoint$$1$$] && (this.$instructions$[$entryPoint$$1$$].$isJumpTarget$ = !0)
  }, $JSCompiler_StaticMethods_parseInstructions$self$$);$i$$11$$ < $romSize$$;$i$$11$$++) {
    $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$] && (null != $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].$nextAddress$ && $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].$nextAddress$] && $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].$nextAddress$].$jumpTargetNb$++, 
    null != $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].target && ($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].target] ? ($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].target].$isJumpTarget$ = !0, $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].target].$jumpTargetNb$++) : 
    $JSSMS$Utils$console$log$$("Invalid target address", $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$11$$].target))))
  }
  $JSSMS$Utils$console$timeEnd$$("Instructions parsing")
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
$JSSMS$SN76489$$.prototype = {$o$:function $$JSSMS$SN76489$$$$$o$$($clockSpeed$$, $sampleRate$$) {
  this.$n$ = ($clockSpeed$$ << 8) / 16 / $sampleRate$$;
  this.$c$ = this.$g$ = 0;
  this.$j$ = 16;
  this.$h$ = 32768;
  for(var $i$$14$$ = 0;4 > $i$$14$$;$i$$14$$++) {
    this.$b$[$i$$14$$ << 1] = 1, this.$b$[($i$$14$$ << 1) + 1] = 15, this.$a$[$i$$14$$] = 0, this.$f$[$i$$14$$] = 1, 3 != $i$$14$$ && (this.$i$[$i$$14$$] = $NO_ANTIALIAS$$)
  }
}};
function $JSSMS$Vdp$$($i$$inline_133_i$$inline_136_sms$$3$$) {
  this.$main$ = $i$$inline_133_i$$inline_136_sms$$3$$;
  var $i$$16_r$$inline_137$$ = 0;
  this.$N$ = 0;
  this.$f$ = new $JSSMS$Utils$Uint8Array$$(16384);
  this.$a$ = new $JSSMS$Utils$Uint8Array$$(96);
  for($i$$16_r$$inline_137$$ = 0;96 > $i$$16_r$$inline_137$$;$i$$16_r$$inline_137$$++) {
    this.$a$[$i$$16_r$$inline_137$$] = 255
  }
  this.$c$ = new $JSSMS$Utils$Uint8Array$$(16);
  this.$h$ = 0;
  this.$n$ = !1;
  this.$v$ = this.$p$ = this.$M$ = this.$w$ = this.$g$ = this.$j$ = 0;
  this.$t$ = new $JSSMS$Utils$Uint8Array$$(256);
  this.$J$ = 0;
  this.$b$ = $i$$inline_133_i$$inline_136_sms$$3$$.$a$.$canvasImageData$.data;
  this.$T$ = new $JSSMS$Utils$Uint8Array$$(64);
  this.$S$ = new $JSSMS$Utils$Uint8Array$$(64);
  this.$R$ = new $JSSMS$Utils$Uint8Array$$(64);
  this.$Q$ = new $JSSMS$Utils$Uint8Array$$(256);
  this.$P$ = new $JSSMS$Utils$Uint8Array$$(256);
  this.$O$ = new $JSSMS$Utils$Uint8Array$$(16);
  this.$i$ = this.$K$ = this.$F$ = 0;
  this.$m$ = !1;
  this.$q$ = Array(192);
  for($i$$16_r$$inline_137$$ = 0;192 > $i$$16_r$$inline_137$$;$i$$16_r$$inline_137$$++) {
    this.$q$[$i$$16_r$$inline_137$$] = new $JSSMS$Utils$Uint8Array$$(25)
  }
  this.$I$ = Array(512);
  this.$G$ = new $JSSMS$Utils$Uint8Array$$(512);
  for($i$$inline_133_i$$inline_136_sms$$3$$ = this.$o$ = this.$s$ = 0;512 > $i$$inline_133_i$$inline_136_sms$$3$$;$i$$inline_133_i$$inline_136_sms$$3$$++) {
    this.$I$[$i$$inline_133_i$$inline_136_sms$$3$$] = new $JSSMS$Utils$Uint8Array$$(64)
  }
  var $g$$inline_138$$, $b$$inline_139$$;
  for($i$$inline_133_i$$inline_136_sms$$3$$ = 0;64 > $i$$inline_133_i$$inline_136_sms$$3$$;$i$$inline_133_i$$inline_136_sms$$3$$++) {
    $i$$16_r$$inline_137$$ = $i$$inline_133_i$$inline_136_sms$$3$$ & 3, $g$$inline_138$$ = $i$$inline_133_i$$inline_136_sms$$3$$ >> 2 & 3, $b$$inline_139$$ = $i$$inline_133_i$$inline_136_sms$$3$$ >> 4 & 3, this.$T$[$i$$inline_133_i$$inline_136_sms$$3$$] = 85 * $i$$16_r$$inline_137$$ & 255, this.$S$[$i$$inline_133_i$$inline_136_sms$$3$$] = 85 * $g$$inline_138$$ & 255, this.$R$[$i$$inline_133_i$$inline_136_sms$$3$$] = 85 * $b$$inline_139$$ & 255
  }
  for($i$$inline_133_i$$inline_136_sms$$3$$ = 0;256 > $i$$inline_133_i$$inline_136_sms$$3$$;$i$$inline_133_i$$inline_136_sms$$3$$++) {
    $g$$inline_138$$ = $i$$inline_133_i$$inline_136_sms$$3$$ & 15, $b$$inline_139$$ = $i$$inline_133_i$$inline_136_sms$$3$$ >> 4 & 15, this.$Q$[$i$$inline_133_i$$inline_136_sms$$3$$] = ($g$$inline_138$$ << 4 | $g$$inline_138$$) & 255, this.$P$[$i$$inline_133_i$$inline_136_sms$$3$$] = ($b$$inline_139$$ << 4 | $b$$inline_139$$) & 255
  }
  for($i$$inline_133_i$$inline_136_sms$$3$$ = 0;16 > $i$$inline_133_i$$inline_136_sms$$3$$;$i$$inline_133_i$$inline_136_sms$$3$$++) {
    this.$O$[$i$$inline_133_i$$inline_136_sms$$3$$] = ($i$$inline_133_i$$inline_136_sms$$3$$ << 4 | $i$$inline_133_i$$inline_136_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$17$$;
  this.$n$ = !0;
  for($i$$17$$ = this.$w$ = this.$h$ = this.$v$ = this.$g$ = 0;16 > $i$$17$$;$i$$17$$++) {
    this.$c$[$i$$17$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$main$.$cpu$.$I$ = !1;
  this.$m$ = !0;
  this.$s$ = 512;
  this.$o$ = -1;
  for($i$$17$$ = 0;16384 > $i$$17$$;$i$$17$$++) {
    this.$f$[$i$$17$$] = 0
  }
  for($i$$17$$ = 0;196608 > $i$$17$$;$i$$17$$ += 4) {
    this.$b$[$i$$17$$] = 0, this.$b$[$i$$17$$ + 1] = 0, this.$b$[$i$$17$$ + 2] = 0, this.$b$[$i$$17$$ + 3] = 255
  }
}};
function $JSCompiler_StaticMethods_forceFullRedraw$$($JSCompiler_StaticMethods_forceFullRedraw$self$$) {
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$J$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$c$[2] & 14) << 10;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$s$ = 0;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$o$ = 511;
  for(var $i$$18$$ = 0;512 > $i$$18$$;$i$$18$$++) {
    $JSCompiler_StaticMethods_forceFullRedraw$self$$.$G$[$i$$18$$] = 1
  }
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$i$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$c$[5] & -130) << 7;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$m$ = !0
}
;function $JSSMS$DummyUI$$($sms$$4$$) {
  this.$main$ = $sms$$4$$;
  this.reset = $JSCompiler_emptyFn$$();
  this.updateStatus = $JSCompiler_emptyFn$$();
  this.$writeFrame$ = $JSCompiler_emptyFn$$();
  this.$canvasImageData$ = {data:[]}
}
window.$ && ($.fn.JSSMSUI = function $$$fn$JSSMSUI$($roms$$) {
  function $UI$$($root_sms$$5$$) {
    this.$main$ = $root_sms$$5$$;
    if("[object OperaMini]" == Object.prototype.toString.call(window.operamini)) {
      $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>')
    }else {
      var $self$$4$$ = this;
      $root_sms$$5$$ = $("<div></div>");
      var $screenContainer$$ = $('<div id="screen"></div>'), $gamepadContainer$$ = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>'), $controls$$ = $('<div id="controls"></div>'), $fullscreenSupport$$ = $JSSMS$Utils$getPrefix$$(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), 
      $requestAnimationFramePrefix_startButton$$ = $JSSMS$Utils$getPrefix$$(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame"], window), $i$$25$$;
      if($requestAnimationFramePrefix_startButton$$) {
        this.requestAnimationFrame = window[$requestAnimationFramePrefix_startButton$$].bind(window)
      }else {
        var $lastTime$$ = 0;
        this.requestAnimationFrame = function $this$requestAnimationFrame$($callback$$54$$) {
          var $currTime_timeToCall$$ = $JSSMS$Utils$getTimestamp$$(), $currTime_timeToCall$$ = Math.max(0, 1E3 / 60 - ($currTime_timeToCall$$ - $lastTime$$));
          window.setTimeout(function() {
            $lastTime$$ = $JSSMS$Utils$getTimestamp$$();
            $callback$$54$$()
          }, $currTime_timeToCall$$)
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
          $self$$4$$.$loadROM$()
        });
        this.buttons = Object.create(null);
        this.buttons.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">').click(function() {
          $self$$4$$.$main$.$isRunning$ ? ($self$$4$$.$main$.stop(), $self$$4$$.updateStatus("Paused"), $self$$4$$.buttons.start.attr("value", "Start")) : ($self$$4$$.$main$.start(), $self$$4$$.buttons.start.attr("value", "Pause"))
        });
        this.buttons.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">').click(function() {
          "" != $self$$4$$.$main$.$romData$ && "" != $self$$4$$.$main$.$romFileName$ && $JSCompiler_StaticMethods_readRomDirectly$$($self$$4$$.$main$, $self$$4$$.$main$.$romData$, $self$$4$$.$main$.$romFileName$) ? ($self$$4$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$4$$.$main$.$vdp$), $self$$4$$.$main$.start()) : $(this).attr("disabled", "disabled")
        });
        this.$dissambler$ = $('<div id="dissambler"></div>');
        $($parent$$2$$).after(this.$dissambler$);
        this.buttons.$nextStep$ = $('<input type="button" value="Next step" class="btn" disabled="disabled">').click(function() {
          $self$$4$$.$main$.$nextStep$()
        });
        this.$main$.$soundEnabled$ && (this.buttons.$sound$ = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').click(function() {
          $self$$4$$.$main$.$soundEnabled$ ? ($self$$4$$.$main$.$soundEnabled$ = !1, $self$$4$$.buttons.$sound$.attr("value", "Enable sound")) : ($self$$4$$.$main$.$soundEnabled$ = !0, $self$$4$$.buttons.$sound$.attr("value", "Disable sound"))
        }));
        $fullscreenSupport$$ ? this.buttons.$fullscreen$ = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
          var $screen$$1$$ = $screenContainer$$[0];
          $screen$$1$$.requestFullscreen ? $screen$$1$$.requestFullscreen() : $screen$$1$$.mozRequestFullScreen ? $screen$$1$$.mozRequestFullScreen() : $screen$$1$$.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }) : (this.$zoomed$ = !1, this.buttons.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">').click(function() {
          $self$$4$$.$zoomed$ ? ($self$$4$$.screen.animate({width:"256px", height:"192px"}, function() {
            $(this).removeAttr("style")
          }), $self$$4$$.buttons.zoom.attr("value", "Zoom in")) : ($self$$4$$.screen.animate({width:"512px", height:"384px"}), $self$$4$$.buttons.zoom.attr("value", "Zoom out"));
          $self$$4$$.$zoomed$ = !$self$$4$$.$zoomed$
        }));
        for($i$$25$$ in this.buttons) {
          this.buttons[$i$$25$$].appendTo($controls$$)
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
          $self$$4$$.$main$.$keyboard$.keydown($evt$$18$$)
        }).bind("keyup", function($evt$$19$$) {
          $self$$4$$.$main$.$keyboard$.keyup($evt$$19$$)
        });
        for($i$$25$$ in this.$gamepad$) {
          this.$gamepad$[$i$$25$$].$e$.on("mousedown touchstart", function($key$$18$$) {
            return function($evt$$20$$) {
              $self$$4$$.$main$.$keyboard$.$controller1$ &= ~$key$$18$$;
              $evt$$20$$.preventDefault()
            }
          }(this.$gamepad$[$i$$25$$].$k$)).on("mouseup touchend", function($key$$19$$) {
            return function($evt$$21$$) {
              $self$$4$$.$main$.$keyboard$.$controller1$ |= $key$$19$$;
              $evt$$21$$.preventDefault()
            }
          }(this.$gamepad$[$i$$25$$].$k$))
        }
        $requestAnimationFramePrefix_startButton$$.on("mousedown touchstart", function($evt$$22$$) {
          $self$$4$$.$main$.$is_sms$ ? $self$$4$$.$main$.$pause_button$ = !0 : $self$$4$$.$main$.$keyboard$.$ggstart$ &= -129;
          $evt$$22$$.preventDefault()
        }).on("mouseup touchend", function($evt$$23$$) {
          $self$$4$$.$main$.$is_sms$ || ($self$$4$$.$main$.$keyboard$.$ggstart$ |= 128);
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
    var $groupName$$, $optgroup$$, $length$$19$$, $i$$26$$, $count$$7$$ = 0;
    this.$romSelect$.children().remove();
    $("<option>Select a ROM...</option>").appendTo(this.$romSelect$);
    for($groupName$$ in $roms$$1$$) {
      if($roms$$1$$.hasOwnProperty($groupName$$)) {
        $optgroup$$ = $("<optgroup></optgroup>").attr("label", $groupName$$);
        $length$$19$$ = $roms$$1$$[$groupName$$].length;
        for($i$$26$$ = 0;$i$$26$$ < $length$$19$$;$i$$26$$++) {
          $("<option>" + $roms$$1$$[$groupName$$][$i$$26$$][0] + "</option>").attr("value", $roms$$1$$[$groupName$$][$i$$26$$][1]).appendTo($optgroup$$)
        }
        $optgroup$$.appendTo(this.$romSelect$)
      }
      $count$$7$$++
    }
    $count$$7$$ && this.$romSelect$.appendTo(this.$romContainer$)
  }, $loadROM$:function $$UI$$$$$loadROM$$() {
    var $self$$5$$ = this;
    this.updateStatus("Downloading...");
    $.ajax({url:escape(this.$romSelect$.val()), xhr:function() {
      var $xhr$$1$$ = $.ajaxSettings.xhr();
      void 0 != $xhr$$1$$.overrideMimeType && $xhr$$1$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$5$$.xhr = $xhr$$1$$
    }, complete:function($xhr$$2$$, $status$$) {
      var $data$$33$$;
      "error" == $status$$ ? $self$$5$$.updateStatus("The selected ROM file could not be loaded.") : ($data$$33$$ = $xhr$$2$$.responseText, $self$$5$$.$main$.stop(), $JSCompiler_StaticMethods_readRomDirectly$$($self$$5$$.$main$, $data$$33$$, $self$$5$$.$romSelect$.val()), $self$$5$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$5$$.$main$.$vdp$), $self$$5$$.enable())
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
    for(var $instructions$$ = this.$main$.$cpu$.$instructions$, $length$$20$$ = $instructions$$.length, $html$$ = "", $i$$27$$ = 8 > $currentAddress$$1$$ ? 0 : $currentAddress$$1$$ - 8, $num$$4$$ = 0;16 > $num$$4$$ && $i$$27$$ <= $length$$20$$;$i$$27$$++) {
      $instructions$$[$i$$27$$] && ($html$$ += "<div" + ($instructions$$[$i$$27$$].$address$ == $currentAddress$$1$$ ? ' class="current"' : "") + ">" + $instructions$$[$i$$27$$].$hexAddress$ + ($instructions$$[$i$$27$$].$isJumpTarget$ ? ":" : " ") + "<code>" + $instructions$$[$i$$27$$].$inst$ + "</code></div>", $num$$4$$++)
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$N$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$p$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$p$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$p$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$p$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$p$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$n$ = !0;
      var $statuscopy$$inline_216_value$$inline_213$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$M$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$M$ = $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$f$[$JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$g$++ & 
      16383] & 255;
      return $statuscopy$$inline_216_value$$inline_213$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$, $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$n$ = !0, $statuscopy$$inline_216_value$$inline_213$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$h$, 
      $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$h$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$main$.$cpu$.$I$ = !1, $statuscopy$$inline_216_value$$inline_213$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$a$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$a$[0] | $JSCompiler_StaticMethods_in_$self$$.$a$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$, $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$, $reg$$inline_226_value$$82$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$)) {
    switch($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[0] = ($reg$$inline_226_value$$82$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[1] = $reg$$inline_226_value$$82$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$vdp$;
        $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$ = !0;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 16383;
            if($reg$$inline_226_value$$82$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] & 255)) {
              if($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$ && $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$m$ = !0
              }else {
                if($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$ + 128 && $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$m$ = !0
                }else {
                  var $tileIndex$$inline_222$$ = $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$G$[$tileIndex$$inline_222$$] = 1;
                  $tileIndex$$inline_222$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$s$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$s$ = $tileIndex$$inline_222$$);
                  $tileIndex$$inline_222$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$o$ = $tileIndex$$inline_222$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] = $reg$$inline_226_value$$82$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$T$[$reg$$inline_226_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$S$[$reg$$inline_226_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$R$[$reg$$inline_226_value$$82$$]) : 
            ($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$Q$[$reg$$inline_226_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$P$[$reg$$inline_226_value$$82$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$O$[$reg$$inline_226_value$$82$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ = $reg$$inline_226_value$$82$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 16128 | $reg$$inline_226_value$$82$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$ = $reg$$inline_226_value$$82$$ >> 6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ | $reg$$inline_226_value$$82$$ << 8, 0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$M$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$) {
              $reg$$inline_226_value$$82$$ &= 15;
              switch($reg$$inline_226_value$$82$$) {
                case 0:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$h$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$I$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 
                  16));
                  break;
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$h$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$I$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_226_value$$82$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$m$ = !0);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$J$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & -130) << 7, $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$i$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$m$ = !0)
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_226_value$$82$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$, 0 != ($reg$$inline_226_value$$82$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_226_value$$82$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_226_value$$82$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_226_value$$82$$ & 63) << 4 : 
          $reg$$inline_226_value$$82$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$h$ = 
              32768
          }
        }
    }
  }
}
;(function() {
  function $Bytecode$$1$$($address$$18$$, $page$$) {
    this.$address$ = $address$$18$$;
    this.page = $page$$;
    this.$opcode$ = [];
    this.target = this.$nextAddress$ = this.$operand$ = null;
    this.$isJumpTarget$ = !1
  }
  $Bytecode$$1$$.prototype = {get $hexOpcode$() {
    return this.$opcode$.length ? this.$opcode$.map($JSSMS$Utils$toHex$$).join(" ") : ""
  }, get label() {
    var $name$$61$$ = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, $JSSMS$Utils$toHex$$(this.target || this.$operand$ || 0)) : "";
    return $JSSMS$Utils$toHex$$(this.$address$ + 16384 * this.page) + " " + this.$hexOpcode$ + " " + $name$$61$$
  }};
  return $Bytecode$$1$$
})();
(function() {
  function $parser$$($rom$$1$$, $frameReg$$) {
    this.$frameReg$ = $frameReg$$;
    this.$a$ = Array($rom$$1$$.length);
    this.$b$ = Array($rom$$1$$.length);
    for(var $i$$28$$ = 0;$i$$28$$ < $rom$$1$$.length;$i$$28$$++) {
      this.$a$[$i$$28$$] = [], this.$b$[$i$$28$$] = []
    }
  }
  $parser$$.prototype = {};
  return $parser$$
})();
var $BIT_TABLE$$ = [1, 2, 4, 8, 16, 32, 64, 128];
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
function $n$VariableDeclaration$$($name$$62$$, $init$$) {
  return{type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", id:{type:"Identifier", name:$name$$62$$}, init:$init$$}], kind:"var"}
}
function $n$Identifier$$($name$$63$$) {
  return{type:"Identifier", name:$name$$63$$}
}
function $n$Literal$$($value$$88$$) {
  return"number" == typeof $value$$88$$ ? {type:"Literal", value:$value$$88$$, raw:$JSSMS$Utils$toHex$$($value$$88$$)} : {type:"Literal", value:$value$$88$$, raw:"" + $value$$88$$}
}
function $n$CallExpression$$($callee$$, $args$$4$$) {
  void 0 == $args$$4$$ && ($args$$4$$ = []);
  Array.isArray($args$$4$$) || ($args$$4$$ = [$args$$4$$]);
  return{type:"CallExpression", callee:$n$Identifier$$($callee$$), arguments:$args$$4$$}
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
function $n$Register$$($name$$64$$) {
  return{type:"Register", name:$name$$64$$}
}
function $n$Bit$$($bitNumber$$) {
  return $n$Literal$$($BIT_TABLE$$[$bitNumber$$])
}
var $o$$ = {$SET16$:function($register1$$, $register2$$, $value$$89$$) {
  return"Literal" == $value$$89$$.type ? [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $evaluate$$($n$BinaryExpression$$(">>", $value$$89$$, $n$Literal$$(8))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $evaluate$$($n$BinaryExpression$$("&", $value$$89$$, $n$Literal$$(255)))))] : [$n$VariableDeclaration$$("val", $value$$89$$), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", 
  $n$Identifier$$("val"), $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $n$Identifier$$("val"), $n$Literal$$(255))))]
}, $EX$:function($register1$$1$$, $register2$$1$$) {
  return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$($register1$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$1$$), $n$Register$$($register2$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$1$$), $n$Identifier$$("temp")))]
}, $xa$:function() {
  return $JSCompiler_emptyFn$$()
}, $ea$:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function($value$$90$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Literal$$($value$$90$$)))
  } : "i" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$("i"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), $n$Literal$$(0)))))]
  } : "r" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$CallExpression$$("JSSMS.Utils.rndInt", $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), 
    $n$Literal$$(0)))))]
  } : void 0 == $dstRegister2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$($dstRegister1$$)))
  } : "n" == $dstRegister1$$ && "n" == $dstRegister2$$ ? function($value$$91$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$Literal$$($value$$91$$))))
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()))))
  }
}, $fa$:function($srcRegister$$1$$, $dstRegister1$$1$$, $dstRegister2$$1$$) {
  return function($value$$92$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$1$$), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($dstRegister1$$1$$ + $dstRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$92$$)))))
  }
}, $LD16$:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$2$$, $dstRegister2$$2$$) {
  if(void 0 == $dstRegister1$$2$$ && void 0 == $dstRegister2$$2$$) {
    return function($value$$93$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $n$Literal$$($value$$93$$))
    }
  }
  if("n" == $dstRegister1$$2$$ && "n" == $dstRegister2$$2$$) {
    return function($value$$94$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $o$$.$READ_MEM16$($n$Literal$$($value$$94$$)))
    }
  }
  $JSSMS$Utils$console$error$$("Wrong parameters number")
}, $ua$:function($srcRegister1$$1$$, $srcRegister2$$1$$, $dstRegister1$$3$$, $dstRegister2$$3$$) {
  return void 0 == $dstRegister1$$3$$ && void 0 == $dstRegister2$$3$$ ? function($value$$95$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$95$$)]))
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ && void 0 == $dstRegister2$$3$$ ? function($value$$96$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$96$$), $n$Register$$($dstRegister1$$3$$)]))
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ ? function($value$$97$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$97$$), $n$Register$$($dstRegister2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$97$$ + 1), $n$Register$$($dstRegister1$$3$$)]))]
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Register$$($dstRegister1$$3$$)]))
  }
}, $ra$:function($register1$$2$$, $register2$$2$$) {
  return void 0 == $register1$$2$$ && void 0 == $register2$$2$$ ? function($value$$98$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$Literal$$($value$$98$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$CallExpression$$("get" + ($register1$$2$$ + $register2$$2$$).toUpperCase())))
  }
}, $ka$:function($register1$$3$$, $register2$$3$$) {
  return void 0 == $register2$$3$$ ? function($value$$99$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$99$$))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$99$$ + 1)))]
  } : function($value$$100$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$100$$), $n$Register$$($register2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$100$$ + 1), $n$Register$$($register1$$3$$)]))]
  }
}, $V$:function($register1$$4$$, $register2$$4$$) {
  return void 0 == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$4$$), $n$CallExpression$$("inc8", $n$Register$$($register1$$4$$))))
  } : "s" == $register1$$4$$ && "p" == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$CallExpression$$("getHL")))
  }
}, $U$:function($register1$$5$$, $register2$$5$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register2$$5$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("==", $n$Register$$($register2$$5$$), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register1$$5$$), 
    $n$Literal$$(1)), $n$Literal$$(255))))]))]
  }
}, $DEC8$:function($register1$$6$$, $register2$$6$$) {
  return void 0 == $register2$$6$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$6$$), $n$CallExpression$$("dec8", $n$Register$$($register1$$6$$))))
  } : "s" == $register1$$6$$ && "p" == $register2$$6$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("-", $n$Identifier$$("sp"), $n$Literal$$(1))))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$CallExpression$$("getHL")))
  }
}, $F$:function($register1$$7$$, $register2$$7$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register2$$7$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("==", $n$Register$$($register2$$7$$), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register1$$7$$), 
    $n$Literal$$(1)), $n$Literal$$(255))))]))]
  }
}, $g$:function($register1$$8$$, $register2$$8$$, $register3$$, $register4$$) {
  return void 0 == $register4$$ ? function() {
    return $o$$.$SET16$($register1$$8$$, $register2$$8$$, $n$CallExpression$$("add16", [$n$CallExpression$$("get" + ($register1$$8$$ + $register2$$8$$).toUpperCase()), $n$Register$$($register3$$)]))
  } : function() {
    return $o$$.$SET16$($register1$$8$$, $register2$$8$$, $n$CallExpression$$("add16", [$n$CallExpression$$("get" + ($register1$$8$$ + $register2$$8$$).toUpperCase()), $n$CallExpression$$("get" + ($register3$$ + $register4$$).toUpperCase())]))
  }
}, $Ma$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rlca_a"))
  }
}, $Qa$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rrca_a"))
  }
}, $Ka$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rla_a"))
  }
}, $Oa$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rra_a"))
  }
}, $w$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("daa"))
  }
}, $t$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cpl_a"))
  }
}, $Va$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))]
  }
}, $o$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("ccf"))
  }
}, $f$:function($register1$$9$$, $register2$$9$$) {
  return void 0 == $register1$$9$$ && void 0 == $register2$$9$$ ? function($value$$101$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Literal$$($value$$101$$)))
  } : void 0 == $register2$$9$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Register$$($register1$$9$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$9$$ + $register2$$9$$).toUpperCase()))))
  }
}, $a$:function($register1$$10$$, $register2$$10$$) {
  return void 0 == $register1$$10$$ && void 0 == $register2$$10$$ ? function($value$$102$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Literal$$($value$$102$$)))
  } : void 0 == $register2$$10$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Register$$($register1$$10$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$10$$ + $register2$$10$$).toUpperCase()))))
  }
}, $bb$:function($register1$$11$$, $register2$$11$$) {
  return void 0 == $register1$$11$$ && void 0 == $register2$$11$$ ? function($value$$103$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Literal$$($value$$103$$)))
  } : void 0 == $register2$$11$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Register$$($register1$$11$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$11$$ + $register2$$11$$).toUpperCase()))))
  }
}, $Sa$:function($register1$$12$$, $register2$$12$$) {
  return void 0 == $register1$$12$$ && void 0 == $register2$$12$$ ? function($value$$104$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Literal$$($value$$104$$)))
  } : void 0 == $register2$$12$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Register$$($register1$$12$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$12$$ + $register2$$12$$).toUpperCase()))))
  }
}, $i$:function($register1$$13$$, $register2$$13$$) {
  return void 0 == $register1$$13$$ && void 0 == $register2$$13$$ ? function($value$$105$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Literal$$($value$$105$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  } : "a" != $register1$$13$$ && void 0 == $register2$$13$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Register$$($register1$$13$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  } : "a" == $register1$$13$$ && void 0 == $register2$$13$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$13$$ + $register2$$13$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  }
}, $eb$:function($register1$$14$$, $register2$$14$$) {
  return void 0 == $register1$$14$$ && void 0 == $register2$$14$$ ? function($value$$106$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Literal$$($value$$106$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" != $register1$$14$$ && void 0 == $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Register$$($register1$$14$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" == $register1$$14$$ && void 0 == $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Literal$$(0))))]
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$14$$ + $register2$$14$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $ya$:function($register1$$15$$, $register2$$15$$) {
  return void 0 == $register1$$15$$ && void 0 == $register2$$15$$ ? function($value$$107$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Literal$$($value$$107$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" != $register1$$15$$ && void 0 == $register2$$15$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Register$$($register1$$15$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" == $register1$$15$$ && void 0 == $register2$$15$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$15$$ + $register2$$15$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $p$:function($register1$$16$$, $register2$$16$$) {
  return void 0 == $register1$$16$$ && void 0 == $register2$$16$$ ? function($value$$108$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Literal$$($value$$108$$)))
  } : void 0 == $register2$$16$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Register$$($register1$$16$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$16$$ + $register2$$16$$).toUpperCase()))))
  }
}, $Ea$:function($register1$$17$$, $register2$$17$$) {
  return function() {
    return[].concat($o$$.$SET16$($register1$$17$$, $register2$$17$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))))
  }
}, $Fa$:function($register1$$18$$, $register2$$18$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("pushUint8", [$n$Register$$($register1$$18$$), $n$Register$$($register2$$18$$)]))
  }
}, $JR$:function($test$$2$$) {
  return function($value$$109$$, $target$$55$$) {
    return $n$IfStatement$$($test$$2$$, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$($target$$55$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()]))
  }
}, $J$:function() {
  return function($value$$110$$, $target$$56$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("b"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$("b"), $n$Literal$$(1)), $n$Literal$$(255)))), $o$$.$JR$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)))(void 0, $target$$56$$)]
  }
}, $ca$:function() {
  return function($value$$111$$, $target$$57$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))))(void 0, $target$$57$$)
  }
}, $da$:function() {
  return function($value$$112$$, $target$$58$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0)))(void 0, $target$$58$$)
  }
}, $ba$:function() {
  return function($value$$113$$, $target$$59$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0))))(void 0, $target$$59$$)
  }
}, $aa$:function() {
  return function($value$$114$$, $target$$60$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0)))(void 0, $target$$60$$)
  }
}, $Ha$:function($operator$$4$$, $bitMask$$) {
  return void 0 == $operator$$4$$ && void 0 == $bitMask$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ReturnStatement$$()]
  } : function() {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$4$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(6))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), 
    $n$ReturnStatement$$()]))
  }
}, $Y$:function($operator$$5$$, $bitMask$$1$$) {
  return void 0 == $operator$$5$$ && void 0 == $bitMask$$1$$ ? function($value$$116$$, $target$$62$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$62$$))), $n$ReturnStatement$$()]
  } : "h" == $operator$$5$$ && "l" == $bitMask$$1$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("getHL"))), $n$ReturnStatement$$()]
  } : function($value$$118$$, $target$$64$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$5$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$1$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$64$$))), $n$ReturnStatement$$()]))
  }
}, $n$:function($operator$$6$$, $bitMask$$2$$) {
  return void 0 == $operator$$6$$ && void 0 == $bitMask$$2$$ ? function($value$$119$$, $target$$65$$, $nextAddress$$8$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$8$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$65$$))), $n$ReturnStatement$$()]
  } : function($value$$120$$, $target$$66$$, $nextAddress$$9$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$6$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$2$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(7))), $n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$9$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", 
    $n$Identifier$$("pc"), $n$Literal$$($target$$66$$))), $n$ReturnStatement$$()]))
  }
}, $Ra$:function($targetAddress$$1$$) {
  return function($value$$121$$, $target$$67$$, $nextAddress$$10$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$10$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($targetAddress$$1$$))), $n$ReturnStatement$$()]
  }
}, $I$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))]
  }
}, $K$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))]
  }
}, $Ba$:function($register1$$19$$, $register2$$19$$) {
  return void 0 == $register2$$19$$ ? function($value$$122$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Literal$$($value$$122$$), $n$Register$$($register1$$19$$)]))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$($register1$$19$$), $n$Register$$($register2$$19$$)]))
  }
}, $T$:function($register1$$20$$, $register2$$20$$) {
  return void 0 == $register2$$20$$ ? function($value$$123$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Literal$$($value$$123$$))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Register$$($register2$$20$$)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$($register1$$20$$)))))]
  }
}, $N$:function() {
  return function() {
    return[].concat($o$$.$EX$("a", "a2"), $o$$.$EX$("f", "f2"))
  }
}, $M$:function() {
  return function() {
    return[].concat($o$$.$EX$("b", "b2"), $o$$.$EX$("c", "c2"), $o$$.$EX$("d", "d2"), $o$$.$EX$("e", "e2"), $o$$.$EX$("h", "h2"), $o$$.$EX$("l", "l2"))
  }
}, $O$:function() {
  return function() {
    return[].concat($o$$.$EX$("d", "h"), $o$$.$EX$("e", "l"))
  }
}, $P$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1)), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $o$$.$READ_MEM8$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$Identifier$$("temp")]))]
  }
}, $R$:function() {
  return function($ret_value$$125$$, $target$$71$$, $nextAddress$$14$$) {
    $ret_value$$125$$ = [];
    $ret_value$$125$$.push($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("tstates"), $n$Literal$$(0))));
    return $ret_value$$125$$.concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("halt"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$(($nextAddress$$14$$ - 1) % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()])
  }
}, $La$:$generateCBFunctions$$("rlc"), $Pa$:$generateCBFunctions$$("rrc"), $Ja$:$generateCBFunctions$$("rl"), $Na$:$generateCBFunctions$$("rr"), $Xa$:$generateCBFunctions$$("sla"), $Za$:$generateCBFunctions$$("sra"), $Ya$:$generateCBFunctions$$("sll"), $ab$:$generateCBFunctions$$("srl"), $m$:function($bit$$1$$, $register1$$21$$, $register2$$21$$) {
  return void 0 == $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $n$Register$$($register1$$21$$), $n$Bit$$($bit$$1$$))))
  } : "h" == $register1$$21$$ && "l" == $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase())), $n$Bit$$($bit$$1$$))))
  } : function($value$$126$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$Literal$$($value$$126$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$1$$))))]
  }
}, $Ga$:function($bit$$2$$, $register1$$22$$, $register2$$22$$) {
  return void 0 == $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$($register1$$22$$), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$))))
  } : "h" == $register1$$22$$ && "l" == $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase())), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))))
  } : function($value$$127$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$Literal$$($value$$127$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))]))]
  }
}, $Wa$:function($bit$$3$$, $register1$$23$$, $register2$$23$$) {
  return void 0 == $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$($register1$$23$$), $n$Bit$$($bit$$3$$)))
  } : "h" == $register1$$23$$ && "l" == $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase())), $n$Bit$$($bit$$3$$))]))
  } : function($value$$128$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$Literal$$($value$$128$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$3$$))]))]
  }
}, $va$:function($register1$$24$$, $register2$$24$$, $register3$$1$$) {
  return void 0 == $register3$$1$$ ? function($value$$129$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$24$$ + $register2$$24$$).toUpperCase()), $n$Literal$$($value$$129$$ & 255)), $n$Literal$$($value$$129$$ >> 8)]))]
  } : function($value$$130$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register2$$24$$ + $register3$$1$$).toUpperCase()), $n$Literal$$($value$$130$$)), $n$Register$$($register1$$24$$)]))]
  }
}, $W$:function($register1$$25$$, $register2$$25$$) {
  return function($value$$131$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$25$$ + $register2$$25$$).toUpperCase()), $n$Literal$$($value$$131$$))))]
  }
}, $G$:function($register1$$26$$, $register2$$26$$) {
  return function($value$$132$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$26$$ + $register2$$26$$).toUpperCase()), $n$Literal$$($value$$132$$))))]
  }
}, $h$:function($register1$$27$$, $register2$$27$$) {
  return function($value$$133$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$27$$ + $register2$$27$$).toUpperCase()), $n$Literal$$($value$$133$$)))))
  }
}, $c$:function($register1$$28$$, $register2$$28$$) {
  return function($value$$134$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$28$$ + $register2$$28$$).toUpperCase()), $n$Literal$$($value$$134$$)))))
  }
}, $cb$:function($register1$$29$$, $register2$$29$$) {
  return function($value$$135$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$29$$ + $register2$$29$$).toUpperCase()), $n$Literal$$($value$$135$$)))))
  }
}, $Ua$:function($register1$$30$$, $register2$$30$$) {
  return function($value$$136$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$30$$ + $register2$$30$$).toUpperCase()), $n$Literal$$($value$$136$$)))))
  }
}, $j$:function($register1$$31$$, $register2$$31$$) {
  return function($value$$137$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$31$$ + $register2$$31$$).toUpperCase()), $n$Literal$$($value$$137$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  }
}, $fb$:function($register1$$32$$, $register2$$32$$) {
  return function($value$$138$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$32$$ + $register2$$32$$).toUpperCase()), $n$Literal$$($value$$138$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $za$:function($register1$$33$$, $register2$$33$$) {
  return function($value$$139$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$33$$ + $register2$$33$$).toUpperCase()), $n$Literal$$($value$$139$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $v$:function($register1$$34$$, $register2$$34$$) {
  return function($value$$140$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$34$$ + $register2$$34$$).toUpperCase()), $n$Literal$$($value$$140$$)))))
  }
}, $Q$:function($register1$$35$$, $register2$$35$$) {
  return function() {
    return[].concat($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("get" + ($register1$$35$$ + $register2$$35$$).toUpperCase()))), $o$$.$SET16$($register1$$35$$, $register2$$35$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", 
    $n$Identifier$$("sp"), $n$Literal$$(1)), $n$BinaryExpression$$(">>", $n$Identifier$$("sp"), $n$Literal$$(8))])))
  }
}, $Z$:function($register1$$36$$, $register2$$36$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("get" + ($register1$$36$$ + $register2$$36$$).toUpperCase()))), $n$ReturnStatement$$()]
  }
}, $b$:function($register1$$37$$, $register2$$37$$) {
  return function() {
    return[void 0 == $register2$$37$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$37$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$37$$), $n$Literal$$(8)), $n$Register$$($register2$$37$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("+", $n$BinaryExpression$$("+", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp")), 
    $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(64))), $n$BinaryExpression$$(">>", 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$Literal$$(32768)), $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))]
  }
}, $Ta$:function($register1$$38$$, $register2$$38$$) {
  return function() {
    return[void 0 == $register2$$38$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$38$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$38$$), $n$Literal$$(8)), $n$Register$$($register2$$38$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("-", $n$BinaryExpression$$("-", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), 
    $n$Identifier$$("temp")), $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$Literal$$(2)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), 
    $n$Literal$$(64))), $n$BinaryExpression$$(">>", $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))]
  }
}, $wa$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("a"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Identifier$$("temp")))]
  }
}, $Ia$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Identifier$$("iff2")))]
  }
}, $S$:function($value$$144$$) {
  return function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("im"), $n$Literal$$($value$$144$$)))
  }
}, $X$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("port.in_", $n$Register$$("c")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getHL"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]
  }
}, $Da$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]
  }
}, $Ca$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]
  }
}, $ia$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))]
  }
}, $q$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]
  }
}, $ga$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))]
  }
}, $ja$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))]
  }
}, $s$:function() {
  return function() {
    var $JSCompiler_temp_const$$19$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $JSCompiler_temp_const$$18$$ = $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $JSCompiler_temp_const$$17$$ = $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $JSCompiler_temp_const$$16$$ = $n$ExpressionStatement$$($n$CallExpression$$("incHL")), 
    $JSCompiler_temp_const$$15$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4))));
    return[$JSCompiler_temp_const$$19$$, $JSCompiler_temp_const$$18$$, $JSCompiler_temp_const$$17$$, $JSCompiler_temp_const$$16$$, $JSCompiler_temp_const$$15$$, $n$IfStatement$$({type:"LogicalExpression", operator:"&&", left:$n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(4)), $n$Literal$$(0)), right:$n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))}, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", 
    $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp")))), $n$ReturnStatement$$()])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]
  }
}, $Aa$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ReturnStatement$$()]))]
  }
}, $ha$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))]
  }
}, $ma$:$generateIndexCBFunctions$$("rlc"), $oa$:$generateIndexCBFunctions$$("rrc"), $la$:$generateIndexCBFunctions$$("rl"), $na$:$generateIndexCBFunctions$$("rr"), $pa$:$generateIndexCBFunctions$$("sla"), $sa$:$generateIndexCBFunctions$$("sra"), $qa$:$generateIndexCBFunctions$$("sll"), $ta$:$generateIndexCBFunctions$$("srl"), $READ_MEM8$:function($value$$155$$) {
  return $n$CallExpression$$("readMem", $value$$155$$)
}, $READ_MEM16$:function($value$$156$$) {
  return $n$CallExpression$$("readMemWord", $value$$156$$)
}};
function $generateCBFunctions$$($fn$$3$$) {
  return function($register1$$39$$, $register2$$39$$) {
    return void 0 == $register2$$39$$ ? function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$39$$), $n$CallExpression$$($fn$$3$$, $n$Register$$($register1$$39$$))))
    } : function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase()), $n$CallExpression$$($fn$$3$$, $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase())))))
    }
  }
}
function $generateIndexCBFunctions$$($fn$$4$$) {
  return function($register1$$40$$, $register2$$40$$, $register3$$2$$) {
    return void 0 == $register3$$2$$ ? function($value$$157$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$40$$ + $register2$$40$$).toUpperCase()), $n$Literal$$($value$$157$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$CallExpression$$($fn$$4$$, $o$$.$READ_MEM8$($n$Identifier$$("location")))]))]
    } : function($value$$158$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$40$$ + $register2$$40$$).toUpperCase()), $n$Literal$$($value$$158$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register3$$2$$), $n$CallExpression$$($fn$$4$$, $o$$.$READ_MEM8$($n$Identifier$$("location"))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", 
      [$n$Identifier$$("location"), $n$Register$$($register3$$2$$)]))]
    }
  }
}
function $evaluate$$($expression$$3$$) {
  switch($expression$$3$$.type) {
    case "BinaryExpression":
      if("Literal" != $expression$$3$$.left.type && "Literal" != $expression$$3$$.right.type) {
        break
      }
      switch($expression$$3$$.$operator$) {
        case ">>":
          return $n$Literal$$($expression$$3$$.left.value >> $expression$$3$$.right.value);
        case "&":
          return $n$Literal$$($expression$$3$$.left.value & $expression$$3$$.right.value)
      }
  }
  return $expression$$3$$
}
;var $opcodeTableCB$$ = [], $opcodeTableDDCB$$ = [], $opcodeTableFDCB$$ = [], $regs$$ = {B:["b"], C:["c"], D:["d"], E:["e"], H:["h"], L:["l"], "(HL)":["h", "l"], A:["a"]};
"RLC RRC RL RR SLA SRA SLL SRL".split(" ").forEach(function($op$$) {
  for(var $reg$$2$$ in $regs$$) {
    $opcodeTableCB$$.push({name:$op$$ + " " + $reg$$2$$, $ast$:$o$$[$op$$].apply(null, $regs$$[$reg$$2$$])}), "(HL)" != $reg$$2$$ ? ($opcodeTableDDCB$$.push({name:"LD " + $reg$$2$$ + "," + $op$$ + " (IX)", $ast$:$o$$["LD_" + $op$$].apply(null, ["ixH", "ixL"].concat($regs$$[$reg$$2$$]))}), $opcodeTableFDCB$$.push({name:"LD " + $reg$$2$$ + "," + $op$$ + " (IY)", $ast$:$o$$["LD_" + $op$$].apply(null, ["iyH", "iyL"].concat($regs$$[$reg$$2$$]))})) : ($opcodeTableDDCB$$.push({name:$op$$ + " (IX)", $ast$:$o$$["LD_" + 
    $op$$]("ixH", "ixL")}), $opcodeTableFDCB$$.push({name:$op$$ + " (IY)", $ast$:$o$$["LD_" + $op$$]("iyH", "iyL")}))
  }
});
["BIT", "RES", "SET"].forEach(function($op$$1$$) {
  for(var $i$$31$$ = 0;8 > $i$$31$$;$i$$31$$++) {
    for(var $reg$$3$$ in $regs$$) {
      $opcodeTableCB$$.push({name:$op$$1$$ + " " + $i$$31$$ + "," + $reg$$3$$, $ast$:$o$$[$op$$1$$].apply(null, [$i$$31$$].concat($regs$$[$reg$$3$$]))})
    }
    for(var $j$$2$$ = 0;8 > $j$$2$$;$j$$2$$++) {
      $opcodeTableDDCB$$.push({name:$op$$1$$ + " " + $i$$31$$ + " (IX)", $ast$:$o$$[$op$$1$$].apply(null, [$i$$31$$].concat(["ixH", "ixL"]))}), $opcodeTableFDCB$$.push({name:$op$$1$$ + " " + $i$$31$$ + " (IY)", $ast$:$o$$[$op$$1$$].apply(null, [$i$$31$$].concat(["iyH", "iyL"]))})
    }
  }
});
function $generateIndexTable$$($index$$51_registerH$$) {
  var $register_registerL$$ = $index$$51_registerH$$.substring(1, 2).toLowerCase();
  $index$$51_registerH$$ = "i" + $register_registerL$$ + "H";
  $register_registerL$$ = "i" + $register_registerL$$ + "L";
  $o$$.$LD16$($index$$51_registerH$$, $register_registerL$$);
  $o$$.$LD16$($index$$51_registerH$$, $register_registerL$$, "n", "n")
}
;$o$$.$LD16$("b", "c", "n", "n");
$o$$.$LD16$("d", "e", "n", "n");
$o$$.$LD16$("h", "l", "n", "n");
$o$$.$LD16$("b", "c");
$o$$.$LD16$("d", "e");
$o$$.$LD16$("h", "l");
$o$$.$LD16$("h", "l", "n", "n");
$generateIndexTable$$("IX");
$generateIndexTable$$("IY");
window.JSSMS = $JSSMS$$;
})(global);
