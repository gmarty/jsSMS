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
(function(window){'use strict';var $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
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
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$R$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$R$ - 1;
    for($i$$inline_42$$ = 0;3 > $i$$inline_42$$;$i$$inline_42$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$frameReg$[$i$$inline_42$$] = $i$$inline_42$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$R$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$R$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_size$$11$$.$romPageMask$ = 0
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
var $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? window.performance.now.bind(window.performance) : function() {
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
function $JSSMS$Z80$$($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$) {
  this.$main$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
  this.$vdp$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$.$vdp$;
  this.port = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$.$f$;
  this.$P$ = this.$n$ = this.$b$ = 0;
  this.$G$ = this.$O$ = this.$N$ = this.$J$ = this.$I$ = !1;
  this.$o$ = this.$aa$ = this.$c$ = this.$T$ = this.$v$ = this.$s$ = this.$t$ = this.$q$ = this.$ca$ = this.$ba$ = this.$l$ = this.$j$ = this.$Z$ = this.$Y$ = this.$e$ = this.$d$ = this.$X$ = this.$W$ = this.$h$ = this.$i$ = this.$V$ = this.$a$ = this.$Q$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$R$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$da$ = Array(2048);
  this.$U$ = Array(256);
  this.$m$ = Array(256);
  this.$M$ = Array(256);
  this.$K$ = Array(256);
  this.$F$ = Array(131072);
  this.$w$ = Array(131072);
  this.$S$ = Array(256);
  var $c$$inline_74_padc$$inline_65_sf$$inline_59$$, $h$$inline_75_psub$$inline_66_zf$$inline_60$$, $n$$inline_76_psbc$$inline_67_yf$$inline_61$$, $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$, $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$, $flags$$inline_270_newval$$inline_70$$;
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;256 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
    $c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 0 != ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 128) ? 128 : 0, $h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 64 : 0, $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 32, $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 
    8, $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$) ? 4 : 0, this.$U$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$, this.$m$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 
    $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ | $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$, this.$M$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$, 
    this.$M$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 128 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 4 : 0, this.$M$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 0 == ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 15) ? 16 : 0, this.$K$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | 
    $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ | 2, this.$K$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 127 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 4 : 0, this.$K$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 15 == ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 15) ? 16 : 0, this.$S$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0 != $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 
    $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 128 : 68, this.$S$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ | 16
  }
  $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;
  $c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 65536;
  $h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0;
  $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = 65536;
  for($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ = 0;256 > $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$;$JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$++) {
    for($flags$$inline_270_newval$$inline_70$$ = 0;256 > $flags$$inline_270_newval$$inline_70$$;$flags$$inline_270_newval$$inline_70$$++) {
      $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ = $flags$$inline_270_newval$$inline_70$$ - $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0 != $flags$$inline_270_newval$$inline_70$$ ? 0 != ($flags$$inline_270_newval$$inline_70$$ & 128) ? 128 : 0 : 64, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= $flags$$inline_270_newval$$inline_70$$ & 40, ($flags$$inline_270_newval$$inline_70$$ & 
      15) < ($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 16), $flags$$inline_270_newval$$inline_70$$ < $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ && (this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ ^ 128) & ($JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ ^ 
      $flags$$inline_270_newval$$inline_70$$) & 128) && (this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 4), $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++, $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ = $flags$$inline_270_newval$$inline_70$$ - $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ - 1, this.$F$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] = 0 != $flags$$inline_270_newval$$inline_70$$ ? 0 != ($flags$$inline_270_newval$$inline_70$$ & 
      128) ? 128 : 0 : 64, this.$F$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= $flags$$inline_270_newval$$inline_70$$ & 40, ($flags$$inline_270_newval$$inline_70$$ & 15) <= ($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$F$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 16), $flags$$inline_270_newval$$inline_70$$ <= $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ && (this.$F$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 1), 0 != (($JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ ^ 
      $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ ^ 128) & ($JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ ^ $flags$$inline_270_newval$$inline_70$$) & 128) && (this.$F$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 4), $c$$inline_74_padc$$inline_65_sf$$inline_59$$++, $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ = $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ - $flags$$inline_270_newval$$inline_70$$, this.$w$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] = 
      0 != $flags$$inline_270_newval$$inline_70$$ ? 0 != ($flags$$inline_270_newval$$inline_70$$ & 128) ? 130 : 2 : 66, this.$w$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= $flags$$inline_270_newval$$inline_70$$ & 40, ($flags$$inline_270_newval$$inline_70$$ & 15) > ($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$w$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 16), $flags$$inline_270_newval$$inline_70$$ > $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ && 
      (this.$w$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 1), 0 != (($JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$) & ($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ ^ $flags$$inline_270_newval$$inline_70$$) & 128) && (this.$w$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 4), $h$$inline_75_psub$$inline_66_zf$$inline_60$$++, $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ = $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ - 
      $flags$$inline_270_newval$$inline_70$$ - 1, this.$w$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] = 0 != $flags$$inline_270_newval$$inline_70$$ ? 0 != ($flags$$inline_270_newval$$inline_70$$ & 128) ? 130 : 2 : 66, this.$w$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= $flags$$inline_270_newval$$inline_70$$ & 40, ($flags$$inline_270_newval$$inline_70$$ & 15) >= ($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$w$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 
      16), $flags$$inline_270_newval$$inline_70$$ >= $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ && (this.$w$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 1), 0 != (($JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$) & ($JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ ^ $flags$$inline_270_newval$$inline_70$$) & 128) && (this.$w$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 4), $n$$inline_76_psbc$$inline_67_yf$$inline_61$$++
    }
  }
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 256;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$--;) {
    for($c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 0;1 >= $c$$inline_74_padc$$inline_65_sf$$inline_59$$;$c$$inline_74_padc$$inline_65_sf$$inline_59$$++) {
      for($h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0;1 >= $h$$inline_75_psub$$inline_66_zf$$inline_60$$;$h$$inline_75_psub$$inline_66_zf$$inline_60$$++) {
        for($n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = 0;1 >= $n$$inline_76_psbc$$inline_67_yf$$inline_61$$;$n$$inline_76_psbc$$inline_67_yf$$inline_61$$++) {
          $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$ = this.$da$;
          $JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$ = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ << 8 | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ << 9 | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ << 10 | $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
          $flags$$inline_270_newval$$inline_70$$ = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ << 1 | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ << 4;
          this.$a$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
          this.$c$ = $flags$$inline_270_newval$$inline_70$$;
          var $a_copy$$inline_271$$ = this.$a$, $correction$$inline_272$$ = 0, $carry$$inline_273$$ = $flags$$inline_270_newval$$inline_70$$ & 1, $carry_copy$$inline_274$$ = $carry$$inline_273$$;
          if(0 != ($flags$$inline_270_newval$$inline_70$$ & 16) || 9 < ($a_copy$$inline_271$$ & 15)) {
            $correction$$inline_272$$ |= 6
          }
          if(1 == $carry$$inline_273$$ || 159 < $a_copy$$inline_271$$ || 143 < $a_copy$$inline_271$$ && 9 < ($a_copy$$inline_271$$ & 15)) {
            $correction$$inline_272$$ |= 96, $carry_copy$$inline_274$$ = 1
          }
          153 < $a_copy$$inline_271$$ && ($carry_copy$$inline_274$$ = 1);
          0 != ($flags$$inline_270_newval$$inline_70$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_272$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_272$$);
          $flags$$inline_270_newval$$inline_70$$ = this.$c$ & 254 | $carry_copy$$inline_274$$;
          $flags$$inline_270_newval$$inline_70$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_270_newval$$inline_70$$ & 251 | 4 : $flags$$inline_270_newval$$inline_70$$ & 251;
          $JSCompiler_temp_const$$266_val$$inline_68_xf$$inline_62$$[$JSCompiler_temp_const$$265_oldval$$inline_69_pf$$inline_63$$] = this.$a$ | $flags$$inline_270_newval$$inline_70$$ << 8
        }
      }
    }
  }
  this.$a$ = this.$c$ = 0;
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;8192 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$, 0)
    }
  }else {
    for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;8192 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
      this.$memWriteMap$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0
    }
  }
  if($SUPPORT_DATAVIEW$$) {
    for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;32768 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
      this.$sram$.setUint8($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$, 0)
    }
  }else {
    for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;32768 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
      this.$sram$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0
    }
  }
  this.$R$ = 2;
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;4 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
    this.$frameReg$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ % 3
  }
  for(var $method$$3$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$3$$] = $JSSMS$Debugger$$.prototype[$method$$3$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$b$ = this.$aa$ = this.$c$ = this.$T$ = this.$s$ = this.$v$ = this.$q$ = this.$t$ = this.$j$ = this.$l$ = this.$ba$ = this.$ca$ = this.$d$ = this.$e$ = this.$Y$ = this.$Z$ = this.$i$ = this.$h$ = this.$W$ = this.$X$ = this.$a$ = this.$V$ = 0;
  this.$n$ = 57328;
  this.$P$ = this.$o$ = 0;
  this.$O$ = this.$J$ = this.$I$ = !1;
  this.$Q$ = 0;
  this.$N$ = !1
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$b$ + 2), this.$b$ = this.$p$(this.$b$), this.$o$ -= 7) : this.$b$ += 2
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
  $JSCompiler_StaticMethods_dec8$self$$.$c$ = $JSCompiler_StaticMethods_dec8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$K$[$value$$69$$];
  return $value$$69$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$68$$) {
  $value$$68$$ = $value$$68$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$c$ = $JSCompiler_StaticMethods_inc8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$M$[$value$$68$$];
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
  return $JSCompiler_StaticMethods_getBC$self$$.$i$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$h$
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
  var $location$$24$$ = $index$$45$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$f$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
  $JSCompiler_StaticMethods_doIndexCB$self$$.$b$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$c$ = $JSCompiler_StaticMethods_bit$self$$.$c$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$S$[$mask$$5$$]
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
  $JSCompiler_StaticMethods_interrupt$self$$.$I$ && !$JSCompiler_StaticMethods_interrupt$self$$.$O$ && ($JSCompiler_StaticMethods_interrupt$self$$.$N$ && ($JSCompiler_StaticMethods_interrupt$self$$.$b$++, $JSCompiler_StaticMethods_interrupt$self$$.$N$ = !1), $JSCompiler_StaticMethods_interrupt$self$$.$I$ = $JSCompiler_StaticMethods_interrupt$self$$.$J$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.$G$ = !1, $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$, $JSCompiler_StaticMethods_interrupt$self$$.$b$), 
  0 == $JSCompiler_StaticMethods_interrupt$self$$.$P$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$b$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$.$Q$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$.$Q$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$Q$, $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$.$P$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$b$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$.$b$ = 
  $JSCompiler_StaticMethods_interrupt$self$$.$p$(($JSCompiler_StaticMethods_interrupt$self$$.$T$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$Q$), $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 19))
}
function $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$) {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$lineno$ = 0;
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$cyclesPerLine$;
  for($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$G$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$);;) {
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$a$.$updateDisassembly$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$b$);
    var $JSCompiler_StaticMethods_interpret$self$$inline_85$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$, $location$$inline_86$$ = 0, $temp$$inline_87$$ = 0, $opcode$$inline_88$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
    $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$O$ = !1;
    $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$o$ -= $OP_STATES$$[$opcode$$inline_88$$];
    switch($opcode$$inline_88$$) {
      case 1:
        var $JSCompiler_StaticMethods_setBC$self$$inline_412$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $value$$inline_413$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        $JSCompiler_StaticMethods_setBC$self$$inline_412$$.$i$ = $value$$inline_413$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_412$$.$h$ = $value$$inline_413$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++;
        break;
      case 2:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 3:
        var $JSCompiler_StaticMethods_incBC$self$$inline_276$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$;
        $JSCompiler_StaticMethods_incBC$self$$inline_276$$.$h$ = $JSCompiler_StaticMethods_incBC$self$$inline_276$$.$h$ + 1 & 255;
        0 == $JSCompiler_StaticMethods_incBC$self$$inline_276$$.$h$ && ($JSCompiler_StaticMethods_incBC$self$$inline_276$$.$i$ = $JSCompiler_StaticMethods_incBC$self$$inline_276$$.$i$ + 1 & 255);
        break;
      case 4:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 5:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 6:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 7:
        var $JSCompiler_StaticMethods_rlca_a$self$$inline_278$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $carry$$inline_279$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_278$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_278$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_278$$.$a$ << 1 & 255 | $carry$$inline_279$$;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_278$$.$c$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_278$$.$c$ & 236 | $carry$$inline_279$$;
        break;
      case 8:
        var $JSCompiler_StaticMethods_exAF$self$$inline_281$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $temp$$inline_282$$ = $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$a$;
        $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$V$;
        $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$V$ = $temp$$inline_282$$;
        $temp$$inline_282$$ = $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$c$;
        $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$c$ = $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$aa$;
        $JSCompiler_StaticMethods_exAF$self$$inline_281$$.$aa$ = $temp$$inline_282$$;
        break;
      case 9:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 10:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 11:
        $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 12:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 13:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 14:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 15:
        var $JSCompiler_StaticMethods_rrca_a$self$$inline_284$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $carry$$inline_285$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_284$$.$a$ & 1;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_284$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_284$$.$a$ >> 1 | $carry$$inline_285$$ << 7;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_284$$.$c$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_284$$.$c$ & 236 | $carry$$inline_285$$;
        break;
      case 16:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ - 1 & 255;
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 17:
        var $JSCompiler_StaticMethods_setDE$self$$inline_415$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $value$$inline_416$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        $JSCompiler_StaticMethods_setDE$self$$inline_415$$.$d$ = $value$$inline_416$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_415$$.$e$ = $value$$inline_416$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++;
        break;
      case 18:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 19:
        $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 20:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 21:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 22:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 23:
        var $JSCompiler_StaticMethods_rla_a$self$$inline_287$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $carry$$inline_288$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_287$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rla_a$self$$inline_287$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_287$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_287$$.$c$ & 1) & 255;
        $JSCompiler_StaticMethods_rla_a$self$$inline_287$$.$c$ = $JSCompiler_StaticMethods_rla_a$self$$inline_287$$.$c$ & 236 | $carry$$inline_288$$;
        break;
      case 24:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$) + 1);
        break;
      case 25:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 26:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 27:
        $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 28:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 29:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 30:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 31:
        var $JSCompiler_StaticMethods_rra_a$self$$inline_290$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $carry$$inline_291$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_290$$.$a$ & 1;
        $JSCompiler_StaticMethods_rra_a$self$$inline_290$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_290$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_290$$.$c$ & 1) << 7) & 255;
        $JSCompiler_StaticMethods_rra_a$self$$inline_290$$.$c$ = $JSCompiler_StaticMethods_rra_a$self$$inline_290$$.$c$ & 236 | $carry$$inline_291$$;
        break;
      case 32:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 33:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++;
        break;
      case 34:
        $location$$inline_86$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($location$$inline_86$$++, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($location$$inline_86$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ += 2;
        break;
      case 35:
        $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 36:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 37:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 38:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 39:
        var $JSCompiler_StaticMethods_daa$self$$inline_293$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $temp$$inline_294$$ = $JSCompiler_StaticMethods_daa$self$$inline_293$$.$da$[$JSCompiler_StaticMethods_daa$self$$inline_293$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_293$$.$c$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_293$$.$c$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_293$$.$c$ & 16) << 6];
        $JSCompiler_StaticMethods_daa$self$$inline_293$$.$a$ = $temp$$inline_294$$ & 255;
        $JSCompiler_StaticMethods_daa$self$$inline_293$$.$c$ = $JSCompiler_StaticMethods_daa$self$$inline_293$$.$c$ & 2 | $temp$$inline_294$$ >> 8;
        break;
      case 40:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 41:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 42:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$)));
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ += 2;
        break;
      case 43:
        $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 44:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 45:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 46:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 47:
        var $JSCompiler_StaticMethods_cpl_a$self$$inline_296$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_296$$.$a$ ^= 255;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_296$$.$c$ |= 18;
        break;
      case 48:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 49:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ += 2;
        break;
      case 50:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ += 2;
        break;
      case 51:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$++;
        break;
      case 52:
        $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 53:
        $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 54:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 55:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ |= 1;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ &= -3;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ &= -17;
        break;
      case 56:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 57:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$));
        break;
      case 58:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$));
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ += 2;
        break;
      case 59:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$--;
        break;
      case 60:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 61:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 62:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        break;
      case 63:
        var $JSCompiler_StaticMethods_ccf$self$$inline_298$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$;
        0 != ($JSCompiler_StaticMethods_ccf$self$$inline_298$$.$c$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_298$$.$c$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_298$$.$c$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_298$$.$c$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_298$$.$c$ &= -17);
        $JSCompiler_StaticMethods_ccf$self$$inline_298$$.$c$ &= -3;
        break;
      case 65:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$;
        break;
      case 66:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        break;
      case 67:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        break;
      case 68:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        break;
      case 69:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        break;
      case 70:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 71:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$;
        break;
      case 72:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$;
        break;
      case 74:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        break;
      case 75:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        break;
      case 76:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        break;
      case 77:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        break;
      case 78:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 79:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$;
        break;
      case 80:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$;
        break;
      case 81:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$;
        break;
      case 83:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        break;
      case 84:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        break;
      case 85:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        break;
      case 86:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 87:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$;
        break;
      case 88:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$;
        break;
      case 89:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$;
        break;
      case 90:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        break;
      case 92:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        break;
      case 93:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        break;
      case 94:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 95:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$;
        break;
      case 96:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$;
        break;
      case 97:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$;
        break;
      case 98:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        break;
      case 99:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        break;
      case 101:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        break;
      case 102:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 103:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$;
        break;
      case 104:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$;
        break;
      case 105:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$;
        break;
      case 106:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        break;
      case 107:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        break;
      case 108:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        break;
      case 110:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 111:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$;
        break;
      case 112:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 113:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 114:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 115:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 116:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 117:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 118:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$o$ = 0;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$N$ = !0;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$--;
        break;
      case 119:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 120:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$;
        break;
      case 121:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$;
        break;
      case 122:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        break;
      case 123:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        break;
      case 124:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        break;
      case 125:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        break;
      case 126:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$));
        break;
      case 128:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 129:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 130:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 131:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 132:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 133:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 134:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 135:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 136:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 137:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 138:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 139:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 140:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 141:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 142:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 143:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 144:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 145:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 146:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 147:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 148:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 149:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 150:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 151:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 152:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 153:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 154:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 155:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 156:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 157:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 158:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 159:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 160:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$] | 16;
        break;
      case 161:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$] | 16;
        break;
      case 162:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$] | 16;
        break;
      case 163:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$] | 16;
        break;
      case 164:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$] | 16;
        break;
      case 165:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$] | 16;
        break;
      case 166:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$))] | 16;
        break;
      case 167:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$] | 16;
        break;
      case 168:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$];
        break;
      case 169:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$];
        break;
      case 170:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$];
        break;
      case 171:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$];
        break;
      case 172:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$];
        break;
      case 173:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$];
        break;
      case 174:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$))];
        break;
      case 175:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = 0];
        break;
      case 176:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$];
        break;
      case 177:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$];
        break;
      case 178:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$];
        break;
      case 179:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$];
        break;
      case 180:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$];
        break;
      case 181:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$];
        break;
      case 182:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$))];
        break;
      case 183:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$];
        break;
      case 184:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$);
        break;
      case 185:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 186:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$);
        break;
      case 187:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 188:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$);
        break;
      case 189:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 190:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$)));
        break;
      case 191:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 192:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 193:
        var $JSCompiler_StaticMethods_setBC$self$$inline_418$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $value$$inline_419$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$);
        $JSCompiler_StaticMethods_setBC$self$$inline_418$$.$i$ = $value$$inline_419$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_418$$.$h$ = $value$$inline_419$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ += 2;
        break;
      case 194:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 195:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        break;
      case 196:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 197:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$i$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$h$);
        break;
      case 198:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 199:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 0;
        break;
      case 200:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 201:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ += 2;
        break;
      case 202:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 203:
        var $JSCompiler_StaticMethods_doCB$self$$inline_300$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $opcode$$inline_301$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++);
        $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_301$$];
        switch($opcode$$inline_301$$) {
          case 0:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 1:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 2:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 3:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 4:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 5:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 6:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 7:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 8:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 9:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 10:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 11:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 12:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 13:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 14:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 15:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 16:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 17:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 18:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 19:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 20:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 21:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 22:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 23:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 24:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 25:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 26:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 27:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 28:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 29:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 30:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 31:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 32:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 33:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 34:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 35:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 36:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 39:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 40:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 41:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 42:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 43:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 44:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 47:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 48:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 49:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 50:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 51:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 52:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 53:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 54:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 55:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 56:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$);
            break;
          case 57:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$);
            break;
          case 58:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$);
            break;
          case 59:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$);
            break;
          case 60:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$);
            break;
          case 61:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$);
            break;
          case 62:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$))));
            break;
          case 63:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$);
            break;
          case 64:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 1);
            break;
          case 65:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 1);
            break;
          case 66:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 1);
            break;
          case 67:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 1);
            break;
          case 68:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 1);
            break;
          case 69:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 1);
            break;
          case 70:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 1);
            break;
          case 71:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 1);
            break;
          case 72:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 2);
            break;
          case 73:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 2);
            break;
          case 74:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 2);
            break;
          case 75:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 2);
            break;
          case 76:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 2);
            break;
          case 77:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 2);
            break;
          case 78:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 2);
            break;
          case 79:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 2);
            break;
          case 80:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 4);
            break;
          case 81:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 4);
            break;
          case 82:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 4);
            break;
          case 83:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 4);
            break;
          case 84:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 4);
            break;
          case 85:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 4);
            break;
          case 86:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 4);
            break;
          case 87:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 4);
            break;
          case 88:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 8);
            break;
          case 89:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 8);
            break;
          case 90:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 8);
            break;
          case 91:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 8);
            break;
          case 92:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 8);
            break;
          case 93:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 8);
            break;
          case 94:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 8);
            break;
          case 95:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 8);
            break;
          case 96:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 16);
            break;
          case 97:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 16);
            break;
          case 98:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 16);
            break;
          case 99:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 16);
            break;
          case 100:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 16);
            break;
          case 101:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 16);
            break;
          case 102:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 16);
            break;
          case 103:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 16);
            break;
          case 104:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 32);
            break;
          case 105:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 32);
            break;
          case 106:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 32);
            break;
          case 107:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 32);
            break;
          case 108:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 32);
            break;
          case 109:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 32);
            break;
          case 110:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 32);
            break;
          case 111:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 32);
            break;
          case 112:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 64);
            break;
          case 113:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 64);
            break;
          case 114:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 64);
            break;
          case 115:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 64);
            break;
          case 116:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 64);
            break;
          case 117:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 64);
            break;
          case 118:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 64);
            break;
          case 119:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 64);
            break;
          case 120:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ & 128);
            break;
          case 121:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ & 128);
            break;
          case 122:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ & 128);
            break;
          case 123:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ & 128);
            break;
          case 124:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ & 128);
            break;
          case 125:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ & 128);
            break;
          case 126:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & 128);
            break;
          case 127:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$, $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ & 128);
            break;
          case 128:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -2;
            break;
          case 129:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -2;
            break;
          case 130:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -2;
            break;
          case 131:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -2;
            break;
          case 132:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -2;
            break;
          case 133:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -2;
            break;
          case 134:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -2);
            break;
          case 135:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -2;
            break;
          case 136:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -3;
            break;
          case 137:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -3;
            break;
          case 138:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -3;
            break;
          case 139:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -3;
            break;
          case 140:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -3;
            break;
          case 141:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -3;
            break;
          case 142:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -3);
            break;
          case 143:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -3;
            break;
          case 144:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -5;
            break;
          case 145:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -5;
            break;
          case 146:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -5;
            break;
          case 147:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -5;
            break;
          case 148:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -5;
            break;
          case 149:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -5;
            break;
          case 150:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -5);
            break;
          case 151:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -5;
            break;
          case 152:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -9;
            break;
          case 153:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -9;
            break;
          case 154:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -9;
            break;
          case 155:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -9;
            break;
          case 156:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -9;
            break;
          case 157:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -9;
            break;
          case 158:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -9);
            break;
          case 159:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -9;
            break;
          case 160:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -17;
            break;
          case 161:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -17;
            break;
          case 162:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -17;
            break;
          case 163:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -17;
            break;
          case 164:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -17;
            break;
          case 165:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -17;
            break;
          case 166:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -17);
            break;
          case 167:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -17;
            break;
          case 168:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -33;
            break;
          case 169:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -33;
            break;
          case 170:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -33;
            break;
          case 171:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -33;
            break;
          case 172:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -33;
            break;
          case 173:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -33;
            break;
          case 174:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -33);
            break;
          case 175:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -33;
            break;
          case 176:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -65;
            break;
          case 177:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -65;
            break;
          case 178:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -65;
            break;
          case 179:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -65;
            break;
          case 180:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -65;
            break;
          case 181:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -65;
            break;
          case 182:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -65);
            break;
          case 183:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -65;
            break;
          case 184:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ &= -129;
            break;
          case 185:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ &= -129;
            break;
          case 186:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ &= -129;
            break;
          case 187:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ &= -129;
            break;
          case 188:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ &= -129;
            break;
          case 189:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ &= -129;
            break;
          case 190:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) & -129);
            break;
          case 191:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ &= -129;
            break;
          case 192:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 1;
            break;
          case 193:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 1;
            break;
          case 194:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 1;
            break;
          case 195:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 1;
            break;
          case 196:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 1;
            break;
          case 197:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 1;
            break;
          case 198:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 1);
            break;
          case 199:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 1;
            break;
          case 200:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 2;
            break;
          case 201:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 2;
            break;
          case 203:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 2;
            break;
          case 204:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 2;
            break;
          case 205:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 2;
            break;
          case 206:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 2);
            break;
          case 207:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 2;
            break;
          case 208:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 4;
            break;
          case 209:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 4;
            break;
          case 210:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 4;
            break;
          case 211:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 4;
            break;
          case 212:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 4;
            break;
          case 213:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 4;
            break;
          case 214:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 4);
            break;
          case 215:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 4;
            break;
          case 216:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 8;
            break;
          case 217:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 8;
            break;
          case 218:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 8;
            break;
          case 219:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 8;
            break;
          case 220:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 8;
            break;
          case 221:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 8;
            break;
          case 222:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 8);
            break;
          case 223:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 8;
            break;
          case 224:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 16;
            break;
          case 225:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 16;
            break;
          case 226:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 16;
            break;
          case 227:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 16;
            break;
          case 228:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 16;
            break;
          case 229:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 16;
            break;
          case 230:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 16);
            break;
          case 231:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 16;
            break;
          case 232:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 32;
            break;
          case 233:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 32;
            break;
          case 234:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 32;
            break;
          case 235:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 32;
            break;
          case 236:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 32;
            break;
          case 237:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 32;
            break;
          case 238:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 32);
            break;
          case 239:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 32;
            break;
          case 240:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 64;
            break;
          case 241:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 64;
            break;
          case 242:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 64;
            break;
          case 243:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 64;
            break;
          case 244:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 64;
            break;
          case 245:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 64;
            break;
          case 246:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 64);
            break;
          case 247:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 64;
            break;
          case 248:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$i$ |= 128;
            break;
          case 249:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$h$ |= 128;
            break;
          case 250:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$d$ |= 128;
            break;
          case 251:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$e$ |= 128;
            break;
          case 252:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$j$ |= 128;
            break;
          case 253:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$l$ |= 128;
            break;
          case 254:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$), $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_300$$)) | 128);
            break;
          case 255:
            $JSCompiler_StaticMethods_doCB$self$$inline_300$$.$a$ |= 128;
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_301$$))
        }
        break;
      case 204:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 64));
        break;
      case 205:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ + 2);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        break;
      case 206:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 207:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 8;
        break;
      case 208:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 209:
        var $JSCompiler_StaticMethods_setDE$self$$inline_421$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $value$$inline_422$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$);
        $JSCompiler_StaticMethods_setDE$self$$inline_421$$.$d$ = $value$$inline_422$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_421$$.$e$ = $value$$inline_422$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ += 2;
        break;
      case 210:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 211:
        $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.port, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$);
        break;
      case 212:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 213:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$);
        break;
      case 214:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 215:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 16;
        break;
      case 216:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 217:
        var $JSCompiler_StaticMethods_exBC$self$$inline_303$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $temp$$inline_304$$ = $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$i$;
        $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$i$ = $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$W$;
        $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$W$ = $temp$$inline_304$$;
        $temp$$inline_304$$ = $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$h$;
        $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$h$ = $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$X$;
        $JSCompiler_StaticMethods_exBC$self$$inline_303$$.$X$ = $temp$$inline_304$$;
        var $JSCompiler_StaticMethods_exDE$self$$inline_306$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $temp$$inline_307$$ = $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$d$;
        $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$d$ = $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$Y$;
        $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$Y$ = $temp$$inline_307$$;
        $temp$$inline_307$$ = $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$e$;
        $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$e$ = $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$Z$;
        $JSCompiler_StaticMethods_exDE$self$$inline_306$$.$Z$ = $temp$$inline_307$$;
        var $JSCompiler_StaticMethods_exHL$self$$inline_309$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $temp$$inline_310$$ = $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$j$;
        $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$j$ = $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$ba$;
        $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$ba$ = $temp$$inline_310$$;
        $temp$$inline_310$$ = $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$l$;
        $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$l$ = $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$ca$;
        $JSCompiler_StaticMethods_exHL$self$$inline_309$$.$ca$ = $temp$$inline_310$$;
        break;
      case 218:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 219:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.port, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 220:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 1));
        break;
      case 221:
        var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $opcode$$inline_313$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++), $location$$inline_314$$ = 0, $temp$$inline_315$$ = 0;
        $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_313$$];
        switch($opcode$$inline_313$$) {
          case 9:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$ += 2;
            break;
          case 34:
            $location$$inline_314$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($location$$inline_314$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($location$$inline_314$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$ += 2;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIXHIXL$self$$inline_424$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$;
            $JSCompiler_StaticMethods_incIXHIXL$self$$inline_424$$.$q$ = $JSCompiler_StaticMethods_incIXHIXL$self$$inline_424$$.$q$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIXHIXL$self$$inline_424$$.$q$ && ($JSCompiler_StaticMethods_incIXHIXL$self$$inline_424$$.$t$ = $JSCompiler_StaticMethods_incIXHIXL$self$$inline_424$$.$t$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            break;
          case 42:
            $location$$inline_314$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($location$$inline_314$$++);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($location$$inline_314$$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$ += 2;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIXHIXL$self$$inline_426$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$;
            $JSCompiler_StaticMethods_decIXHIXL$self$$inline_426$$.$q$ = $JSCompiler_StaticMethods_decIXHIXL$self$$inline_426$$.$q$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIXHIXL$self$$inline_426$$.$q$ && ($JSCompiler_StaticMethods_decIXHIXL$self$$inline_426$$.$t$ = $JSCompiler_StaticMethods_decIXHIXL$self$$inline_426$$.$t$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 54:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$i$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$h$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$i$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$h$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$i$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 116:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$j$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 117:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 119:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$f$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$ += 2;
            break;
          case 227:
            $temp$$inline_315$$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$);
            $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$p$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$, $temp$$inline_315$$ & 255);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$g$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$ + 1, $temp$$inline_315$$ >> 8);
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$t$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$q$);
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$n$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$);
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_313$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_312$$.$b$--
        }
        break;
      case 222:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 223:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 24;
        break;
      case 224:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 4));
        break;
      case 225:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$));
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ += 2;
        break;
      case 226:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 4));
        break;
      case 227:
        $temp$$inline_87$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ + 1);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ + 1, $temp$$inline_87$$);
        $temp$$inline_87$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$g$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$, $temp$$inline_87$$);
        break;
      case 228:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 4));
        break;
      case 229:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$);
        break;
      case 230:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++)] | 16;
        break;
      case 231:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 32;
        break;
      case 232:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 4));
        break;
      case 233:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 234:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 4));
        break;
      case 235:
        $temp$$inline_87$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$j$ = $temp$$inline_87$$;
        $temp$$inline_87$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$l$ = $temp$$inline_87$$;
        break;
      case 236:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 4));
        break;
      case 237:
        var $JSCompiler_StaticMethods_doED$self$$inline_317$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $opcode$$inline_318$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$), $temp$$inline_319$$ = 0, $location$$inline_320$$ = 0;
        $JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_318$$];
        switch($opcode$$inline_318$$) {
          case 64:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 65:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 66:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 67:
            $location$$inline_320$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$++, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
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
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ = 0;
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
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
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$ += 2;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$I$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$J$;
            break;
          case 70:
          ;
          case 78:
          ;
          case 102:
          ;
          case 110:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$P$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 71:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$T$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 72:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 73:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 74:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 75:
            var $JSCompiler_StaticMethods_setBC$self$$inline_428$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$, $value$$inline_429$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$));
            $JSCompiler_StaticMethods_setBC$self$$inline_428$$.$i$ = $value$$inline_429$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_428$$.$h$ = $value$$inline_429$$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 79:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 80:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$d$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 81:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 82:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 83:
            $location$$inline_320$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$++, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$e$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 86:
          ;
          case 118:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$P$ = 1;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 87:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$T$;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$U$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$J$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 88:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$e$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 89:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$e$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 90:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 91:
            var $JSCompiler_StaticMethods_setDE$self$$inline_431$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$, $value$$inline_432$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$));
            $JSCompiler_StaticMethods_setDE$self$$inline_431$$.$d$ = $value$$inline_432$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_431$$.$e$ = $value$$inline_432$$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 95:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ = Math.round(255 * Math.random());
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$U$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$J$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$j$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 97:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$j$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 98:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 99:
            $location$$inline_320$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$++, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$j$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 103:
            $location$$inline_320$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($location$$inline_320$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$, $temp$$inline_319$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 15) << 4);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 240 | $temp$$inline_319$$ & 15;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 104:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 105:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 106:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 107:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$)));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 111:
            $location$$inline_320$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($location$$inline_320$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$, ($temp$$inline_319$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 15);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 240 | $temp$$inline_319$$ >> 4;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, 0);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 115:
            $location$$inline_320$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$++, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$ & 255);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($location$$inline_320$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$ >> 8);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 120:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_317$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 121:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 122:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 123:
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$n$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$($JSCompiler_StaticMethods_doED$self$$inline_317$$.$p$(++$JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$ += 2;
            break;
          case 160:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ = $temp$$inline_319$$ + $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 4 : 0) | $temp$$inline_319$$ & 8 | ($temp$$inline_319$$ & 2 ? 32 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 161:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 248 | $temp$$inline_319$$;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 162:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 163:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 168:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ = $temp$$inline_319$$ + $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 4 : 0) | $temp$$inline_319$$ & 8 | ($temp$$inline_319$$ & 2 ? 32 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 169:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 248 | $temp$$inline_319$$;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 170:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 171:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 176:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ = $temp$$inline_319$$ + $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 4 : 0) | $temp$$inline_319$$ & 8 | ($temp$$inline_319$$ & 2 ? 32 : 0);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 177:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 0 : 4;
            0 != ($temp$$inline_319$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 248 | $temp$$inline_319$$;
            break;
          case 178:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 128 == ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            break;
          case 179:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            break;
          case 184:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ = $temp$$inline_319$$ + $JSCompiler_StaticMethods_doED$self$$inline_317$$.$a$ & 255;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 4 : 0) | $temp$$inline_319$$ & 8 | ($temp$$inline_319$$ & 2 ? 32 : 0);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            break;
          case 185:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$)));
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            $temp$$inline_319$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_317$$) ? 0 : 4;
            0 != ($temp$$inline_319$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & 248 | $temp$$inline_319$$;
            break;
          case 186:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$g$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$), $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            break;
          case 187:
            $temp$$inline_319$$ = $JSCompiler_StaticMethods_doED$self$$inline_317$$.$f$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_317$$.port, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$h$, $temp$$inline_319$$);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_317$$, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_317$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_317$$.$i$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$--) : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_317$$.$l$ + $temp$$inline_319$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ = 0 != ($temp$$inline_319$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_317$$.$c$ & -3;
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_318$$)), $JSCompiler_StaticMethods_doED$self$$inline_317$$.$b$++
        }
        break;
      case 238:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++)];
        break;
      case 239:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 40;
        break;
      case 240:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 128));
        break;
      case 241:
        var $JSCompiler_StaticMethods_setAF$self$$inline_322$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $value$$inline_323$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$p$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$);
        $JSCompiler_StaticMethods_setAF$self$$inline_322$$.$a$ = $value$$inline_323$$ >> 8;
        $JSCompiler_StaticMethods_setAF$self$$inline_322$$.$c$ = $value$$inline_323$$ & 255;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ += 2;
        break;
      case 242:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 128));
        break;
      case 243:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$I$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$J$ = !1;
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$O$ = !0;
        break;
      case 244:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 128));
        break;
      case 245:
        $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$);
        break;
      case 246:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$m$[$JSCompiler_StaticMethods_interpret$self$$inline_85$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++)];
        break;
      case 247:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$);
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 48;
        break;
      case 248:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 128));
        break;
      case 249:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$);
        break;
      case 250:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 128));
        break;
      case 251:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$I$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$J$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$O$ = !0;
        break;
      case 252:
        $JSCompiler_StaticMethods_interpret$self$$inline_85$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$c$ & 128));
        break;
      case 253:
        var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$, $opcode$$inline_326$$ = $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++), $location$$inline_327$$ = void 0, $temp$$inline_328$$ = void 0;
        $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_326$$];
        switch($opcode$$inline_326$$) {
          case 9:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$ += 2;
            break;
          case 34:
            $location$$inline_327$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($location$$inline_327$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($location$$inline_327$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$ += 2;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIYHIYL$self$$inline_434$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$;
            $JSCompiler_StaticMethods_incIYHIYL$self$$inline_434$$.$s$ = $JSCompiler_StaticMethods_incIYHIYL$self$$inline_434$$.$s$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIYHIYL$self$$inline_434$$.$s$ && ($JSCompiler_StaticMethods_incIYHIYL$self$$inline_434$$.$v$ = $JSCompiler_StaticMethods_incIYHIYL$self$$inline_434$$.$v$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            break;
          case 42:
            $location$$inline_327$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($location$$inline_327$$++);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($location$$inline_327$$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$ += 2;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIYHIYL$self$$inline_436$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$;
            $JSCompiler_StaticMethods_decIYHIYL$self$$inline_436$$.$s$ = $JSCompiler_StaticMethods_decIYHIYL$self$$inline_436$$.$s$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIYHIYL$self$$inline_436$$.$s$ && ($JSCompiler_StaticMethods_decIYHIYL$self$$inline_436$$.$v$ = $JSCompiler_StaticMethods_decIYHIYL$self$$inline_436$$.$v$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 54:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$i$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$h$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$i$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$h$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$i$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 115:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 116:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$j$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 117:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 119:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$f$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$ += 2;
            break;
          case 227:
            $temp$$inline_328$$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$);
            $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$p$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$, $temp$$inline_328$$ & 255);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$g$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$ + 1, $temp$$inline_328$$ >> 8);
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$v$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$s$);
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$n$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$);
            break;
          default:
            $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_326$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_325$$.$b$--
        }
        break;
      case 254:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$f$($JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$++));
        break;
      case 255:
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_85$$, $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$), $JSCompiler_StaticMethods_interpret$self$$inline_85$$.$b$ = 56
    }
    var $JSCompiler_temp$$2$$;
    if($JSCompiler_temp$$2$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$) {
      var $JSCompiler_StaticMethods_eol$self$$inline_90$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
      if($JSCompiler_StaticMethods_eol$self$$inline_90$$.$main$.$soundEnabled$) {
        var $JSCompiler_StaticMethods_updateSound$self$$inline_330$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$main$, $line$$inline_331$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$;
        0 == $line$$inline_331$$ && ($JSCompiler_StaticMethods_updateSound$self$$inline_330$$.$audioBufferOffset$ = 0);
        for(var $samplesToGenerate$$inline_332$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_330$$.$samplesPerLine$[$line$$inline_331$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_330$$.$b$, $offset$$inline_334$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_330$$.$audioBufferOffset$, $buffer$$inline_335$$ = [], $sample$$inline_336$$ = 0, $i$$inline_337$$ = 0;$sample$$inline_336$$ < $samplesToGenerate$$inline_332$$;$sample$$inline_336$$++) {
          for($i$$inline_337$$ = 0;3 > $i$$inline_337$$;$i$$inline_337$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$m$[$i$$inline_337$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$i$[$i$$inline_337$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$b$[($i$$inline_337$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$i$[$i$$inline_337$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$b$[($i$$inline_337$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[$i$$inline_337$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$m$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$h$ & 1) << 1;
          var $output$$inline_338$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$m$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$m$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$m$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$m$[3];
          127 < $output$$inline_338$$ ? $output$$inline_338$$ = 127 : -128 > $output$$inline_338$$ && ($output$$inline_338$$ = -128);
          $buffer$$inline_335$$[$offset$$inline_334$$ + $sample$$inline_336$$] = $output$$inline_338$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$g$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$n$;
          var $clockCycles$$inline_339$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$g$ >> 8, $clockCyclesScaled$$inline_340$$ = $clockCycles$$inline_339$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$g$ -= $clockCyclesScaled$$inline_340$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[0] -= $clockCycles$$inline_339$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[1] -= $clockCycles$$inline_339$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[2] -= $clockCycles$$inline_339$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$j$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[3] - $clockCycles$$inline_339$$;
          for($i$$inline_337$$ = 0;3 > $i$$inline_337$$;$i$$inline_337$$++) {
            var $counter$$inline_341$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[$i$$inline_337$$];
            if(0 >= $counter$$inline_341$$) {
              var $tone$$inline_342$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$b$[$i$$inline_337$$ << 1];
              6 < $tone$$inline_342$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$i$[$i$$inline_337$$] = ($clockCyclesScaled$$inline_340$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$g$ + 512 * $counter$$inline_341$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[$i$$inline_337$$] / ($clockCyclesScaled$$inline_340$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$g$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[$i$$inline_337$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[$i$$inline_337$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[$i$$inline_337$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$i$[$i$$inline_337$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[$i$$inline_337$$] += $tone$$inline_342$$ * ($clockCycles$$inline_339$$ / $tone$$inline_342$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$i$[$i$$inline_337$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$j$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$j$ * 
          ($clockCycles$$inline_339$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$j$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$f$[3])) {
            var $feedback$$inline_343$$ = 0, $feedback$$inline_343$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$h$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$h$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$h$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$h$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_333$$.$h$ >> 1 | $feedback$$inline_343$$ << 15
          }
        }
        $JSCompiler_StaticMethods_updateSound$self$$inline_330$$.$audioBuffer$ = $buffer$$inline_335$$;
        $JSCompiler_StaticMethods_updateSound$self$$inline_330$$.$audioBufferOffset$ += $samplesToGenerate$$inline_332$$
      }
      $JSCompiler_StaticMethods_eol$self$$inline_90$$.$vdp$.$p$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$;
      if(192 > $JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$) {
        var $JSCompiler_StaticMethods_drawLine$self$$inline_345$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$vdp$, $lineno$$inline_346$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$, $i$$inline_347$$ = 0, $temp$$inline_348$$ = 0, $temp2$$inline_349$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$main$.$is_gg$ || !(24 > $lineno$$inline_346$$ || 168 <= $lineno$$inline_346$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$o$) {
              for(var $i$$inline_350$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$s$;$i$$inline_350$$ <= $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$o$;$i$$inline_350$$++) {
                if($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$G$[$i$$inline_350$$]) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$G$[$i$$inline_350$$] = 0;
                  for(var $tile$$inline_351$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$I$[$i$$inline_350$$], $pixel_index$$inline_352$$ = 0, $address$$inline_353$$ = $i$$inline_350$$ << 5, $y$$inline_354$$ = 0;8 > $y$$inline_354$$;$y$$inline_354$$++) {
                    for(var $address0$$inline_355$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$address$$inline_353$$++], $address1$$inline_356$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$address$$inline_353$$++], $address2$$inline_357$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$address$$inline_353$$++], $address3$$inline_358$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$address$$inline_353$$++], $bit$$inline_359$$ = 128;0 != 
                    $bit$$inline_359$$;$bit$$inline_359$$ >>= 1) {
                      var $colour$$inline_360$$ = 0;
                      0 != ($address0$$inline_355$$ & $bit$$inline_359$$) && ($colour$$inline_360$$ |= 1);
                      0 != ($address1$$inline_356$$ & $bit$$inline_359$$) && ($colour$$inline_360$$ |= 2);
                      0 != ($address2$$inline_357$$ & $bit$$inline_359$$) && ($colour$$inline_360$$ |= 4);
                      0 != ($address3$$inline_358$$ & $bit$$inline_359$$) && ($colour$$inline_360$$ |= 8);
                      $tile$$inline_351$$[$pixel_index$$inline_352$$++] = $colour$$inline_360$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$s$ = 512;
              $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$o$ = -1
            }
            var $pixX$$inline_361$$ = 0, $colour$$inline_362$$ = 0, $temp$$inline_363$$ = 0, $temp2$$inline_364$$ = 0, $hscroll$$inline_365$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[8], $vscroll$$inline_366$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[9];
            16 > $lineno$$inline_346$$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[0] & 64) && ($hscroll$$inline_365$$ = 0);
            var $lock$$inline_367$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[0] & 128, $tile_column$$inline_368$$ = 32 - ($hscroll$$inline_365$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$F$, $tile_row$$inline_369$$ = $lineno$$inline_346$$ + $vscroll$$inline_366$$ >> 3;
            27 < $tile_row$$inline_369$$ && ($tile_row$$inline_369$$ -= 28);
            for(var $tile_y$$inline_370$$ = ($lineno$$inline_346$$ + ($vscroll$$inline_366$$ & 7) & 7) << 3, $row_precal$$inline_371$$ = $lineno$$inline_346$$ << 8, $tx$$inline_372$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$F$;$tx$$inline_372$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$K$;$tx$$inline_372$$++) {
              var $tile_props$$inline_373$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$J$ + (($tile_column$$inline_368$$ & 31) << 1) + ($tile_row$$inline_369$$ << 6), $secondbyte$$inline_374$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$tile_props$$inline_373$$ + 1], $pal$$inline_375$$ = ($secondbyte$$inline_374$$ & 8) << 1, $sx$$inline_376$$ = ($tx$$inline_372$$ << 3) + ($hscroll$$inline_365$$ & 7), $pixY$$inline_377$$ = 0 == ($secondbyte$$inline_374$$ & 4) ? $tile_y$$inline_370$$ : 
              56 - $tile_y$$inline_370$$, $tile$$inline_378$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$I$[($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$tile_props$$inline_373$$] & 255) + (($secondbyte$$inline_374$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_374$$ & 2)) {
                for($pixX$$inline_361$$ = 0;8 > $pixX$$inline_361$$ && 256 > $sx$$inline_376$$;$pixX$$inline_361$$++, $sx$$inline_376$$++) {
                  $colour$$inline_362$$ = $tile$$inline_378$$[$pixX$$inline_361$$ + $pixY$$inline_377$$], $temp$$inline_363$$ = 4 * ($sx$$inline_376$$ + $row_precal$$inline_371$$), $temp2$$inline_364$$ = 3 * ($colour$$inline_362$$ + $pal$$inline_375$$), $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$t$[$sx$$inline_376$$] = 0 != ($secondbyte$$inline_374$$ & 16) && 0 != $colour$$inline_362$$, $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_363$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_364$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_363$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_364$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_363$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_364$$ + 2]
                }
              }else {
                for($pixX$$inline_361$$ = 7;0 <= $pixX$$inline_361$$ && 256 > $sx$$inline_376$$;$pixX$$inline_361$$--, $sx$$inline_376$$++) {
                  $colour$$inline_362$$ = $tile$$inline_378$$[$pixX$$inline_361$$ + $pixY$$inline_377$$], $temp$$inline_363$$ = 4 * ($sx$$inline_376$$ + $row_precal$$inline_371$$), $temp2$$inline_364$$ = 3 * ($colour$$inline_362$$ + $pal$$inline_375$$), $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$t$[$sx$$inline_376$$] = 0 != ($secondbyte$$inline_374$$ & 16) && 0 != $colour$$inline_362$$, $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_363$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_364$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_363$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_364$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_363$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_364$$ + 2]
                }
              }
              $tile_column$$inline_368$$++;
              0 != $lock$$inline_367$$ && 23 == $tx$$inline_372$$ && ($tile_row$$inline_369$$ = $lineno$$inline_346$$ >> 3, $tile_y$$inline_370$$ = ($lineno$$inline_346$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$m$) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$m$ = !1;
              for(var $i$$inline_379$$ = 0;$i$$inline_379$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$q$.length;$i$$inline_379$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$q$[$i$$inline_379$$][0] = 0
              }
              var $height$$inline_380$$ = 0 == ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[1] & 1) && ($height$$inline_380$$ <<= 1);
              for(var $spriteno$$inline_381$$ = 0;64 > $spriteno$$inline_381$$;$spriteno$$inline_381$$++) {
                var $y$$inline_382$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$i$ + $spriteno$$inline_381$$] & 255;
                if(208 == $y$$inline_382$$) {
                  break
                }
                $y$$inline_382$$++;
                240 < $y$$inline_382$$ && ($y$$inline_382$$ -= 256);
                for(var $lineno$$inline_383$$ = $y$$inline_382$$;192 > $lineno$$inline_383$$;$lineno$$inline_383$$++) {
                  if($lineno$$inline_383$$ - $y$$inline_382$$ < $height$$inline_380$$) {
                    var $sprites$$inline_384$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$q$[$lineno$$inline_383$$];
                    if(!$sprites$$inline_384$$ || 8 <= $sprites$$inline_384$$[0]) {
                      break
                    }
                    var $off$$inline_385$$ = 3 * $sprites$$inline_384$$[0] + 1, $address$$inline_386$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$i$ + ($spriteno$$inline_381$$ << 1) + 128;
                    $sprites$$inline_384$$[$off$$inline_385$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$address$$inline_386$$++] & 255;
                    $sprites$$inline_384$$[$off$$inline_385$$++] = $y$$inline_382$$;
                    $sprites$$inline_384$$[$off$$inline_385$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$f$[$address$$inline_386$$] & 255;
                    $sprites$$inline_384$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$q$[$lineno$$inline_346$$][0]) {
              for(var $colour$$inline_387$$ = 0, $temp$$inline_388$$ = 0, $temp2$$inline_389$$ = 0, $i$$inline_390$$ = 0, $sprites$$inline_391$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$q$[$lineno$$inline_346$$], $count$$inline_392$$ = Math.min(8, $sprites$$inline_391$$[0]), $zoomed$$inline_393$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[1] & 1, $row_precal$$inline_394$$ = $lineno$$inline_346$$ << 8, $off$$inline_395$$ = 3 * $count$$inline_392$$;$i$$inline_390$$ < 
              $count$$inline_392$$;$i$$inline_390$$++) {
                var $n$$inline_396$$ = $sprites$$inline_391$$[$off$$inline_395$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[6] & 4) << 6, $y$$inline_397$$ = $sprites$$inline_391$$[$off$$inline_395$$--], $x$$inline_398$$ = $sprites$$inline_391$$[$off$$inline_395$$--] - ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[0] & 8), $tileRow$$inline_399$$ = $lineno$$inline_346$$ - $y$$inline_397$$ >> $zoomed$$inline_393$$;
                0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[1] & 2) && ($n$$inline_396$$ &= -2);
                var $tile$$inline_400$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$I$[$n$$inline_396$$ + (($tileRow$$inline_399$$ & 8) >> 3)], $pix$$inline_401$$ = 0;
                0 > $x$$inline_398$$ && ($pix$$inline_401$$ = -$x$$inline_398$$, $x$$inline_398$$ = 0);
                var $offset$$inline_402$$ = $pix$$inline_401$$ + (($tileRow$$inline_399$$ & 7) << 3);
                if(0 == $zoomed$$inline_393$$) {
                  for(;8 > $pix$$inline_401$$ && 256 > $x$$inline_398$$;$pix$$inline_401$$++, $x$$inline_398$$++) {
                    $colour$$inline_387$$ = $tile$$inline_400$$[$offset$$inline_402$$++], 0 == $colour$$inline_387$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$t$[$x$$inline_398$$] || ($temp$$inline_388$$ = 4 * ($x$$inline_398$$ + $row_precal$$inline_394$$), $temp2$$inline_389$$ = 3 * ($colour$$inline_387$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_401$$ && 256 > $x$$inline_398$$;$pix$$inline_401$$++, $x$$inline_398$$ += 2) {
                    $colour$$inline_387$$ = $tile$$inline_400$$[$offset$$inline_402$$++], 0 == $colour$$inline_387$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$t$[$x$$inline_398$$] || ($temp$$inline_388$$ = 4 * ($x$$inline_398$$ + $row_precal$$inline_394$$), $temp2$$inline_389$$ = 3 * ($colour$$inline_387$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$ + 2]), 0 == $colour$$inline_387$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$t$[$x$$inline_398$$ + 1] || ($temp$$inline_388$$ = 4 * ($x$$inline_398$$ + $row_precal$$inline_394$$ + 1), $temp2$$inline_389$$ = 3 * ($colour$$inline_387$$ + 
                    16), $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_388$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_389$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_391$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$h$ |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$main$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[0] & 32)) {
              for($temp$$inline_348$$ = 4 * ($lineno$$inline_346$$ << 8), $temp2$$inline_349$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[7] & 15) + 16), $i$$inline_347$$ = 0;8 > $i$$inline_347$$;$i$$inline_347$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_348$$ + $i$$inline_347$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_349$$], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_348$$ + $i$$inline_347$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_349$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$temp$$inline_348$$ + $i$$inline_347$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp2$$inline_349$$ + 
                2]
              }
            }
          }else {
            for(var $row_precal$$inline_403$$ = $lineno$$inline_346$$ << 8, $length$$inline_404$$ = 4 * ($row_precal$$inline_403$$ + 1024), $temp$$inline_405$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$c$[7] & 15) + 16), $row_precal$$inline_403$$ = 4 * $row_precal$$inline_403$$;$row_precal$$inline_403$$ < $length$$inline_404$$;$row_precal$$inline_403$$ += 4) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$row_precal$$inline_403$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp$$inline_405$$], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$row_precal$$inline_403$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp$$inline_405$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$b$[$row_precal$$inline_403$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_345$$.$a$[$temp$$inline_405$$ + 
              2]
            }
          }
        }
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_407$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$vdp$, $lineno$$inline_408$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$;
      192 >= $lineno$$inline_408$$ ? (0 == $JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$v$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$h$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$v$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$h$ & 4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$c$[0] & 
      16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$main$.$cpu$.$G$ = !0)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$v$ = $JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$h$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$c$[1] & 32) && 224 > $lineno$$inline_408$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_407$$.$main$.$cpu$.$G$ = !0));
      $JSCompiler_StaticMethods_eol$self$$inline_90$$.$G$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eol$self$$inline_90$$);
      $JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$++;
      if($JSCompiler_StaticMethods_eol$self$$inline_90$$.$lineno$ >= $JSCompiler_StaticMethods_eol$self$$inline_90$$.$main$.$no_of_scanlines$) {
        var $JSCompiler_StaticMethods_eof$self$$inline_410$$ = $JSCompiler_StaticMethods_eol$self$$inline_90$$;
        $JSCompiler_StaticMethods_eof$self$$inline_410$$.$main$.$pause_button$ && ($JSCompiler_StaticMethods_eof$self$$inline_410$$.$J$ = $JSCompiler_StaticMethods_eof$self$$inline_410$$.$I$, $JSCompiler_StaticMethods_eof$self$$inline_410$$.$I$ = !1, $JSCompiler_StaticMethods_eof$self$$inline_410$$.$N$ && ($JSCompiler_StaticMethods_eof$self$$inline_410$$.$b$++, $JSCompiler_StaticMethods_eof$self$$inline_410$$.$N$ = !1), $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_eof$self$$inline_410$$, 
        $JSCompiler_StaticMethods_eof$self$$inline_410$$.$b$), $JSCompiler_StaticMethods_eof$self$$inline_410$$.$b$ = 102, $JSCompiler_StaticMethods_eof$self$$inline_410$$.$o$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_410$$.$main$.$pause_button$ = !1);
        $JSCompiler_StaticMethods_eof$self$$inline_410$$.$main$.$a$.$writeFrame$();
        $JSCompiler_temp$$2$$ = !0
      }else {
        $JSCompiler_StaticMethods_eol$self$$inline_90$$.$o$ += $JSCompiler_StaticMethods_eol$self$$inline_90$$.$main$.$cyclesPerLine$, $JSCompiler_temp$$2$$ = !1
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
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $index$$46$$, $address$$9_address$$inline_94$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_location$$inline_96$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_94$$, $code$$8_code$$inline_100$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcode$$inline_97_operand$$2$$ = "", $inst$$inline_99_location$$28_offset$$16$$ = 0;
  $address$$9_address$$inline_94$$++;
  $inst$$inline_99_location$$28_offset$$16$$ = 0;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_location$$inline_96$$ = "ADD " + $index$$46$$ + ",BC";
      $code$$8_code$$inline_100$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_location$$inline_96$$ = "ADD " + $index$$46$$ + ",DE";
      $code$$8_code$$inline_100$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcode$$inline_97_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$));
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "," + $opcode$$inline_97_operand$$2$$;
      $code$$8_code$$inline_100$$ = "this.set" + $index$$46$$ + "(" + $opcode$$inline_97_operand$$2$$ + ");";
      $address$$9_address$$inline_94$$ += 2;
      break;
    case 34:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $opcode$$inline_97_operand$$2$$ = $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $opcode$$inline_97_operand$$2$$ + ")," + $index$$46$$;
      $code$$8_code$$inline_100$$ = "this.writeMem(" + $opcode$$inline_97_operand$$2$$ + ", this." + $index$$46$$.toLowerCase() + "L);this.writeMem(" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$ + 1) + ", this." + $index$$46$$.toLowerCase() + "H);";
      $address$$9_address$$inline_94$$ += 2;
      break;
    case 35:
      $inst$$3_location$$inline_96$$ = "INC " + $index$$46$$;
      $code$$8_code$$inline_100$$ = "this.inc" + $index$$46$$ + "();";
      break;
    case 36:
      $inst$$3_location$$inline_96$$ = "INC " + $index$$46$$ + "H *";
      break;
    case 37:
      $inst$$3_location$$inline_96$$ = "DEC " + $index$$46$$ + "H *";
      break;
    case 38:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$)) + " *";
      $address$$9_address$$inline_94$$++;
      break;
    case 41:
      $inst$$3_location$$inline_96$$ = "ADD " + $index$$46$$ + "  " + $index$$46$$;
      break;
    case 42:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + " (" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.ixL = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");this.ixH = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$ + 1) + ");";
      $address$$9_address$$inline_94$$ += 2;
      break;
    case 43:
      $inst$$3_location$$inline_96$$ = "DEC " + $index$$46$$;
      $code$$8_code$$inline_100$$ = "this.dec" + $index$$46$$ + "();";
      break;
    case 44:
      $inst$$3_location$$inline_96$$ = "INC " + $index$$46$$ + "L *";
      break;
    case 45:
      $inst$$3_location$$inline_96$$ = "DEC " + $index$$46$$ + "L *";
      break;
    case 46:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$));
      $address$$9_address$$inline_94$$++;
      break;
    case 52:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "INC (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.incMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 53:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "DEC (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.decMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 54:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $opcode$$inline_97_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$ + 1));
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")," + $opcode$$inline_97_operand$$2$$;
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", " + $opcode$$inline_97_operand$$2$$ + ");";
      $address$$9_address$$inline_94$$ += 2;
      break;
    case 57:
      $inst$$3_location$$inline_96$$ = "ADD " + $index$$46$$ + " SP";
      $code$$8_code$$inline_100$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_location$$inline_96$$ = "LD B," + $index$$46$$ + "H *";
      break;
    case 69:
      $inst$$3_location$$inline_96$$ = "LD B," + $index$$46$$ + "L *";
      break;
    case 70:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD B,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.b = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 76:
      $inst$$3_location$$inline_96$$ = "LD C," + $index$$46$$ + "H *";
      break;
    case 77:
      $inst$$3_location$$inline_96$$ = "LD C," + $index$$46$$ + "L *";
      break;
    case 78:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD C,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.c = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 84:
      $inst$$3_location$$inline_96$$ = "LD D," + $index$$46$$ + "H *";
      break;
    case 85:
      $inst$$3_location$$inline_96$$ = "LD D," + $index$$46$$ + "L *";
      break;
    case 86:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD D,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.d = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 92:
      $inst$$3_location$$inline_96$$ = "LD E," + $index$$46$$ + "H *";
      break;
    case 93:
      $inst$$3_location$$inline_96$$ = "LD E," + $index$$46$$ + "L *";
      break;
    case 94:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD E,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.e = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 96:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H,B *";
      break;
    case 97:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H,C *";
      break;
    case 98:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H,D *";
      break;
    case 99:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H,E *";
      break;
    case 100:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "H*";
      break;
    case 101:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "L *";
      break;
    case 102:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD H,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.h = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 103:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "H,A *";
      break;
    case 104:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L,B *";
      break;
    case 105:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L,C *";
      break;
    case 106:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L,D *";
      break;
    case 107:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L,E *";
      break;
    case 108:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "H *";
      break;
    case 109:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "L *";
      $code$$8_code$$inline_100$$ = "";
      break;
    case 110:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD L,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.l = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 111:
      $inst$$3_location$$inline_96$$ = "LD " + $index$$46$$ + "L,A *";
      $code$$8_code$$inline_100$$ = "this." + $index$$46$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),B";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.b);";
      $address$$9_address$$inline_94$$++;
      break;
    case 113:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),C";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.c);";
      $address$$9_address$$inline_94$$++;
      break;
    case 114:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),D";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.d);";
      $address$$9_address$$inline_94$$++;
      break;
    case 115:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),E";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.e);";
      $address$$9_address$$inline_94$$++;
      break;
    case 116:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),H";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.h);";
      $address$$9_address$$inline_94$$++;
      break;
    case 117:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),L";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.l);";
      $address$$9_address$$inline_94$$++;
      break;
    case 119:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "),A";
      $code$$8_code$$inline_100$$ = "this.writeMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ", this.a);";
      $address$$9_address$$inline_94$$++;
      break;
    case 124:
      $inst$$3_location$$inline_96$$ = "LD A," + $index$$46$$ + "H *";
      break;
    case 125:
      $inst$$3_location$$inline_96$$ = "LD A," + $index$$46$$ + "L *";
      break;
    case 126:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "LD A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.a = this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ");";
      $address$$9_address$$inline_94$$++;
      break;
    case 132:
      $inst$$3_location$$inline_96$$ = "ADD A," + $index$$46$$ + "H *";
      break;
    case 133:
      $inst$$3_location$$inline_96$$ = "ADD A," + $index$$46$$ + "L *";
      break;
    case 134:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "ADD A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.add_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "));";
      $address$$9_address$$inline_94$$++;
      break;
    case 140:
      $inst$$3_location$$inline_96$$ = "ADC A," + $index$$46$$ + "H *";
      break;
    case 141:
      $inst$$3_location$$inline_96$$ = "ADC A," + $index$$46$$ + "L *";
      break;
    case 142:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "ADC A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.adc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "));";
      $address$$9_address$$inline_94$$++;
      break;
    case 148:
      $inst$$3_location$$inline_96$$ = "SUB " + $index$$46$$ + "H *";
      break;
    case 149:
      $inst$$3_location$$inline_96$$ = "SUB " + $index$$46$$ + "L *";
      break;
    case 150:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "SUB A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.sub_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "));";
      $address$$9_address$$inline_94$$++;
      break;
    case 156:
      $inst$$3_location$$inline_96$$ = "SBC A," + $index$$46$$ + "H *";
      break;
    case 157:
      $inst$$3_location$$inline_96$$ = "SBC A," + $index$$46$$ + "L *";
      break;
    case 158:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "SBC A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.sbc_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "));";
      $address$$9_address$$inline_94$$++;
      break;
    case 164:
      $inst$$3_location$$inline_96$$ = "AND " + $index$$46$$ + "H *";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_location$$inline_96$$ = "AND " + $index$$46$$ + "L *";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 166:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "AND A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")] | F_HALFCARRY;";
      $address$$9_address$$inline_94$$++;
      break;
    case 172:
      $inst$$3_location$$inline_96$$ = "XOR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_location$$inline_96$$ = "XOR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 174:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "XOR A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")];";
      $address$$9_address$$inline_94$$++;
      break;
    case 180:
      $inst$$3_location$$inline_96$$ = "OR A " + $index$$46$$ + "H*";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_location$$inline_96$$ = "OR A " + $index$$46$$ + "L*";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 182:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "OR A,(" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")];";
      $address$$9_address$$inline_94$$++;
      break;
    case 188:
      $inst$$3_location$$inline_96$$ = "CP " + $index$$46$$ + "H *";
      $code$$8_code$$inline_100$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_location$$inline_96$$ = "CP " + $index$$46$$ + "L *";
      $code$$8_code$$inline_100$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 190:
      $inst$$inline_99_location$$28_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $inst$$3_location$$inline_96$$ = "CP (" + $index$$46$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + ")";
      $code$$8_code$$inline_100$$ = "this.cp_a(this.readMem(this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_99_location$$28_offset$$16$$) + "));";
      $address$$9_address$$inline_94$$++;
      break;
    case 203:
      $inst$$3_location$$inline_96$$ = "location = this.get" + $index$$46$$ + "() + " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$++)) + " & 0xFFFF;";
      $opcode$$inline_97_operand$$2$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$, $address$$9_address$$inline_94$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$ = [$opcode$$inline_97_operand$$2$$];
      $inst$$inline_99_location$$28_offset$$16$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$8_code$$inline_100$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$9_address$$inline_94$$++;
      switch($opcode$$inline_97_operand$$2$$) {
        case 0:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,RLC (" + $index$$46$$ + ")";
          break;
        case 4:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,RLC (" + $index$$46$$ + ")";
          break;
        case 5:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,RLC (" + $index$$46$$ + ")";
          break;
        case 6:
          $inst$$inline_99_location$$28_offset$$16$$ = "RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,RLC (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,RRC (" + $index$$46$$ + ")";
          break;
        case 9:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,RRC (" + $index$$46$$ + ")";
          break;
        case 10:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,RRC (" + $index$$46$$ + ")";
          break;
        case 11:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,RRC (" + $index$$46$$ + ")";
          break;
        case 12:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,RRC (" + $index$$46$$ + ")";
          break;
        case 13:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,RRC (" + $index$$46$$ + ")";
          break;
        case 14:
          $inst$$inline_99_location$$28_offset$$16$$ = "RRC (" + $index$$46$$ + ")";
          break;
        case 15:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,RRC (" + $index$$46$$ + ")";
          break;
        case 16:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,RL (" + $index$$46$$ + ")";
          break;
        case 17:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,RL (" + $index$$46$$ + ")";
          break;
        case 18:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,RL (" + $index$$46$$ + ")";
          break;
        case 19:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,RL (" + $index$$46$$ + ")";
          break;
        case 20:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,RL (" + $index$$46$$ + ")";
          break;
        case 21:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,RL (" + $index$$46$$ + ")";
          break;
        case 22:
          $inst$$inline_99_location$$28_offset$$16$$ = "RL (" + $index$$46$$ + ")";
          break;
        case 23:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,RL (" + $index$$46$$ + ")";
          break;
        case 24:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,RR (" + $index$$46$$ + ")";
          break;
        case 25:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,RR (" + $index$$46$$ + ")";
          break;
        case 26:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,RR (" + $index$$46$$ + ")";
          break;
        case 27:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,RR (" + $index$$46$$ + ")";
          break;
        case 28:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,RR (" + $index$$46$$ + ")";
          break;
        case 29:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_99_location$$28_offset$$16$$ = "RR (" + $index$$46$$ + ")";
          break;
        case 31:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,RR (" + $index$$46$$ + ")";
          $code$$8_code$$inline_100$$ = $inst$$3_location$$inline_96$$ + "this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 32:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,SLA (" + $index$$46$$ + ")";
          break;
        case 33:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,SLA (" + $index$$46$$ + ")";
          break;
        case 34:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,SLA (" + $index$$46$$ + ")";
          break;
        case 35:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,SLA (" + $index$$46$$ + ")";
          break;
        case 36:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,SLA (" + $index$$46$$ + ")";
          break;
        case 37:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,SLA (" + $index$$46$$ + ")";
          break;
        case 38:
          $inst$$inline_99_location$$28_offset$$16$$ = "SLA (" + $index$$46$$ + ")";
          break;
        case 39:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,SLA (" + $index$$46$$ + ")";
          break;
        case 40:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,SRA (" + $index$$46$$ + ")";
          break;
        case 41:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,SRA (" + $index$$46$$ + ")";
          break;
        case 42:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,SRA (" + $index$$46$$ + ")";
          break;
        case 43:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,SRA (" + $index$$46$$ + ")";
          break;
        case 44:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,SRA (" + $index$$46$$ + ")";
          break;
        case 45:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,SRA (" + $index$$46$$ + ")";
          break;
        case 46:
          $inst$$inline_99_location$$28_offset$$16$$ = "SRA (" + $index$$46$$ + ")";
          break;
        case 47:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,SRA (" + $index$$46$$ + ")";
          break;
        case 48:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,SLL (" + $index$$46$$ + ")";
          break;
        case 49:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,SLL (" + $index$$46$$ + ")";
          break;
        case 50:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,SLL (" + $index$$46$$ + ")";
          break;
        case 51:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,SLL (" + $index$$46$$ + ")";
          break;
        case 52:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,SLL (" + $index$$46$$ + ")";
          break;
        case 53:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,SLL (" + $index$$46$$ + ")";
          break;
        case 54:
          $inst$$inline_99_location$$28_offset$$16$$ = "SLL (" + $index$$46$$ + ") *";
          break;
        case 55:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,SLL (" + $index$$46$$ + ")";
          break;
        case 56:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD B,SRL (" + $index$$46$$ + ")";
          break;
        case 57:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD C,SRL (" + $index$$46$$ + ")";
          break;
        case 58:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD D,SRL (" + $index$$46$$ + ")";
          break;
        case 59:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD E,SRL (" + $index$$46$$ + ")";
          break;
        case 60:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD H,SRL (" + $index$$46$$ + ")";
          break;
        case 61:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD L,SRL (" + $index$$46$$ + ")";
          break;
        case 62:
          $inst$$inline_99_location$$28_offset$$16$$ = "SRL (" + $index$$46$$ + ")";
          break;
        case 63:
          $inst$$inline_99_location$$28_offset$$16$$ = "LD A,SRL (" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "BIT 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "RES 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_99_location$$28_offset$$16$$ = "SET 7,(" + $index$$46$$ + ")"
      }
      $address$$9_address$$inline_94$$++;
      $inst$$3_location$$inline_96$$ = $inst$$inline_99_location$$28_offset$$16$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_98$$);
      break;
    case 225:
      $inst$$3_location$$inline_96$$ = "POP " + $index$$46$$;
      $code$$8_code$$inline_100$$ = "this.set" + $index$$46$$ + "(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$3_location$$inline_96$$ = "EX SP,(" + $index$$46$$ + ")";
      $code$$8_code$$inline_100$$ = "temp = this.get" + $index$$46$$ + "();this.set" + $index$$46$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_location$$inline_96$$ = "PUSH " + $index$$46$$;
      $code$$8_code$$inline_100$$ = "this.push2(this." + $index$$46$$.toLowerCase() + "H, this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_location$$inline_96$$ = "JP (" + $index$$46$$ + ")";
      $code$$8_code$$inline_100$$ = "this.pc = this.get" + $index$$46$$ + "(); return;";
      $address$$9_address$$inline_94$$ = null;
      break;
    case 249:
      $inst$$3_location$$inline_96$$ = "LD SP," + $index$$46$$, $code$$8_code$$inline_100$$ = "this.sp = this.get" + $index$$46$$ + "();"
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_location$$inline_96$$, code:$code$$8_code$$inline_100$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_94$$}
}
function $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) {
  var $opcode$$6_options$$inline_122$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$), $defaultInstruction$$inline_124_opcodesArray$$ = [$opcode$$6_options$$inline_122$$], $address$$inline_103_inst_opcode$$inline_113$$ = "Unknown Opcode", $currAddr_hexOpcodes$$inline_126$$ = $address$$6$$, $address$$inline_111_target$$46$$ = null, $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($opcode$$6_options$$inline_122$$) + 
  '";', $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "", $currAddr$$inline_116_inst$$inline_106_location$$26$$ = 0;
  $address$$6$$++;
  $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = {};
  switch($opcode$$6_options$$inline_122$$) {
    case 0:
      $address$$inline_103_inst_opcode$$inline_113$$ = "NOP";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 1:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD BC," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setBC(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 2:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (BC),A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getBC(), this.a);";
      break;
    case 3:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC BC";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.incBC();";
      break;
    case 4:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 7:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RLCA";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.rlca_a();";
      break;
    case 8:
      $address$$inline_103_inst_opcode$$inline_113$$ = "EX AF AF'";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.exAF();";
      break;
    case 9:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD HL,BC";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,(BC)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.readMem(this.getBC());";
      break;
    case 11:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC BC";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.decBC();";
      break;
    case 12:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 15:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RRCA";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.rrca_a();";
      break;
    case 16:
      $address$$inline_111_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $address$$inline_103_inst_opcode$$inline_113$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 17:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD DE," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setDE(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 18:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (DE),A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getDE(), this.a);";
      break;
    case 19:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC DE";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.incDE();";
      break;
    case 20:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 23:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RLA";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.rla_a();";
      break;
    case 24:
      $address$$inline_111_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      $address$$6$$ = null;
      break;
    case 25:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD HL,DE";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,(DE)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.readMem(this.getDE());";
      break;
    case 27:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC DE";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.decDE();";
      break;
    case 28:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 31:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RRA";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.rra_a();";
      break;
    case 32:
      $address$$inline_111_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if (!((this.f & F_ZERO) != 0x00)) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 33:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD HL," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 34:
      $currAddr$$inline_116_inst$$inline_106_location$$26$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($currAddr$$inline_116_inst$$inline_106_location$$26$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + "),HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($currAddr$$inline_116_inst$$inline_106_location$$26$$ + 1) + ", this.h);";
      $address$$6$$ += 2;
      break;
    case 35:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.incHL();";
      break;
    case 36:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 39:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DAA";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.daa();";
      break;
    case 40:
      $address$$inline_111_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 41:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD HL,HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD HL,(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(this.readMemWord(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + "));";
      $address$$6$$ += 2;
      break;
    case 43:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.decHL();";
      break;
    case 44:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 47:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CPL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cpl_a();";
      break;
    case 48:
      $address$$inline_111_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if (!((this.f & F_CARRY) != 0x00)) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 49:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD SP," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sp = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$ += 2;
      break;
    case 50:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + "),A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ", this.a);";
      $address$$6$$ += 2;
      break;
    case 51:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC SP";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sp++;";
      break;
    case 52:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC (HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC (HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL)," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$++;
      break;
    case 55:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SCF";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $address$$inline_111_target$$46$$ = $address$$6$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$) + 1);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$++;
      break;
    case 57:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD HL,SP";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.readMem(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$ += 2;
      break;
    case 59:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC SP";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sp--;";
      break;
    case 60:
      $address$$inline_103_inst_opcode$$inline_113$$ = "INC A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DEC A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ";";
      $address$$6$$++;
      break;
    case 63:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CCF";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.ccf();";
      break;
    case 64:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 65:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.c;";
      break;
    case 66:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.d;";
      break;
    case 67:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.e;";
      break;
    case 68:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.h;";
      break;
    case 69:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.l;";
      break;
    case 70:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.readMem(this.getHL());";
      break;
    case 71:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD B,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.b = this.a;";
      break;
    case 72:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.b;";
      break;
    case 73:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 74:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.d;";
      break;
    case 75:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.e;";
      break;
    case 76:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.h;";
      break;
    case 77:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.l;";
      break;
    case 78:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.readMem(this.getHL());";
      break;
    case 79:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD C,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.c = this.a;";
      break;
    case 80:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.b;";
      break;
    case 81:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.c;";
      break;
    case 82:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 83:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.e;";
      break;
    case 84:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.h;";
      break;
    case 85:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.l;";
      break;
    case 86:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.readMem(this.getHL());";
      break;
    case 87:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD D,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.d = this.a;";
      break;
    case 88:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.b;";
      break;
    case 89:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.c;";
      break;
    case 90:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.d;";
      break;
    case 91:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 92:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.h;";
      break;
    case 93:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.l;";
      break;
    case 94:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.readMem(this.getHL());";
      break;
    case 95:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD E,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.e = this.a;";
      break;
    case 96:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.b;";
      break;
    case 97:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.c;";
      break;
    case 98:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.d;";
      break;
    case 99:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.e;";
      break;
    case 100:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 101:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.l;";
      break;
    case 102:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.readMem(this.getHL());";
      break;
    case 103:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD H,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.h = this.a;";
      break;
    case 104:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.b;";
      break;
    case 105:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.c;";
      break;
    case 106:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.d;";
      break;
    case 107:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.e;";
      break;
    case 108:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.h;";
      break;
    case 109:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 110:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.readMem(this.getHL());";
      break;
    case 111:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD L,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.l = this.a;";
      break;
    case 112:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.b);";
      break;
    case 113:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.c);";
      break;
    case 114:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.d);";
      break;
    case 115:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.e);";
      break;
    case 116:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.h);";
      break;
    case 117:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.l);";
      break;
    case 118:
      $address$$inline_103_inst_opcode$$inline_113$$ = "HALT";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.tstates = 0x00;" + ("this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$6$$ - 1) + "; return;");
      break;
    case 119:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD (HL),A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.writeMem(this.getHL(), this.a);";
      break;
    case 120:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.b;";
      break;
    case 121:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.c;";
      break;
    case 122:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.d;";
      break;
    case 123:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.e;";
      break;
    case 124:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.h;";
      break;
    case 125:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.l;";
      break;
    case 126:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.readMem(this.getHL());";
      break;
    case 127:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "";
      break;
    case 128:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.b);";
      break;
    case 129:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.c);";
      break;
    case 130:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.d);";
      break;
    case 131:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.e);";
      break;
    case 132:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.h);";
      break;
    case 133:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.l);";
      break;
    case 134:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.readMem(this.getHL()));";
      break;
    case 135:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(this.a);";
      break;
    case 136:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.readMem(this.getHL()));";
      break;
    case 143:
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.readMem(this.getHL()));";
      break;
    case 151:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.readMem(this.getHL()));";
      break;
    case 159:
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
      break;
    case 175:
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = " + $JSSMS$Utils$toHex$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
      break;
    case 183:
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,B";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,D";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,E";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,H";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,L";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,(HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.readMem(this.getHL()));";
      break;
    case 191:
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP A,A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET NZ";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $address$$inline_103_inst_opcode$$inline_113$$ = "POP BC";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 195:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      $address$$6$$ = null;
      break;
    case 196:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 197:
      $address$$inline_103_inst_opcode$$inline_113$$ = "PUSH BC";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADD A," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.add_a(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$++;
      break;
    case 199:
      $address$$inline_111_target$$46$$ = 0;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 200:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET Z";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.pc = this.readMemWord(this.sp); this.sp += 0x02; return;";
      $address$$6$$ = null;
      break;
    case 202:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 203:
      var $address$$inline_103_inst_opcode$$inline_113$$ = $address$$6$$, $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_103_inst_opcode$$inline_113$$), $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = [$code$$5_opcode$$inline_104_opcodesArray$$inline_114$$], $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "Unimplemented 0xCB prefixed opcode", $currAddr$$inline_107_target$$inline_117$$ = 
      $address$$inline_103_inst_opcode$$inline_113$$, $code$$inline_108_code$$inline_118$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
      $address$$inline_103_inst_opcode$$inline_113$$++;
      switch($code$$5_opcode$$inline_104_opcodesArray$$inline_114$$) {
        case 0:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.rlc(this.b);";
          break;
        case 1:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.rlc(this.c);";
          break;
        case 2:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.rlc(this.d);";
          break;
        case 3:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.rlc(this.e);";
          break;
        case 4:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.rlc(this.h);";
          break;
        case 5:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.rlc(this.l);";
          break;
        case 6:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
          break;
        case 7:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RLC A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.rlc(this.a);";
          break;
        case 8:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.rrc(this.b);";
          break;
        case 9:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.rrc(this.c);";
          break;
        case 10:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.rrc(this.d);";
          break;
        case 11:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.rrc(this.e);";
          break;
        case 12:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.rrc(this.h);";
          break;
        case 13:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.rrc(this.l);";
          break;
        case 14:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
          break;
        case 15:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RRC A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.rrc(this.a);";
          break;
        case 16:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.rl(this.b);";
          break;
        case 17:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.rl(this.c);";
          break;
        case 18:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.rl(this.d);";
          break;
        case 19:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.rl(this.e);";
          break;
        case 20:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.rl(this.h);";
          break;
        case 21:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.rl(this.l);";
          break;
        case 22:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
          break;
        case 23:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RL A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.rl(this.a);";
          break;
        case 24:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.rr(this.b);";
          break;
        case 25:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.rr(this.c);";
          break;
        case 26:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.rr(this.d);";
          break;
        case 27:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.rr(this.e);";
          break;
        case 28:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.rr(this.h);";
          break;
        case 29:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.rr(this.l);";
          break;
        case 30:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
          break;
        case 31:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RR A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.rr(this.a);";
          break;
        case 32:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.sla(this.b);";
          break;
        case 33:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.sla(this.c);";
          break;
        case 34:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.sla(this.d);";
          break;
        case 35:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.sla(this.e);";
          break;
        case 36:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.sla(this.h);";
          break;
        case 37:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.sla(this.l);";
          break;
        case 38:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
          break;
        case 39:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLA A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.sla(this.a);";
          break;
        case 40:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.sra(this.b);";
          break;
        case 41:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.sra(this.c);";
          break;
        case 42:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.sra(this.d);";
          break;
        case 43:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.sra(this.e);";
          break;
        case 44:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.sra(this.h);";
          break;
        case 45:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.sra(this.l);";
          break;
        case 46:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
          break;
        case 47:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRA A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.sra(this.a);";
          break;
        case 48:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.sll(this.b);";
          break;
        case 49:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.sll(this.c);";
          break;
        case 50:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.sll(this.d);";
          break;
        case 51:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.sll(this.e);";
          break;
        case 52:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.sll(this.h);";
          break;
        case 53:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.sll(this.l);";
          break;
        case 54:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
          break;
        case 55:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SLL A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.sll(this.a);";
          break;
        case 56:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL B";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.srl(this.b);";
          break;
        case 57:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL C";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.srl(this.c);";
          break;
        case 58:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL D";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.srl(this.d);";
          break;
        case 59:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL E";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.srl(this.e);";
          break;
        case 60:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL H";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.srl(this.h);";
          break;
        case 61:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL L";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.srl(this.l);";
          break;
        case 62:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL (HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
          break;
        case 63:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SRL A";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.srl(this.a);";
          break;
        case 64:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_0);";
          break;
        case 65:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_0);";
          break;
        case 66:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_0);";
          break;
        case 67:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_0);";
          break;
        case 68:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_0);";
          break;
        case 69:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_0);";
          break;
        case 70:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
          break;
        case 71:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 0,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_0);";
          break;
        case 72:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_1);";
          break;
        case 73:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_1);";
          break;
        case 74:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_1);";
          break;
        case 75:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_1);";
          break;
        case 76:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_1);";
          break;
        case 77:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_1);";
          break;
        case 78:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
          break;
        case 79:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 1,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_1);";
          break;
        case 80:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_2);";
          break;
        case 81:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_2);";
          break;
        case 82:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_2);";
          break;
        case 83:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_2);";
          break;
        case 84:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_2);";
          break;
        case 85:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_2);";
          break;
        case 86:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
          break;
        case 87:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 2,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_2);";
          break;
        case 88:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_3);";
          break;
        case 89:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_3);";
          break;
        case 90:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_3);";
          break;
        case 91:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_3);";
          break;
        case 92:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_3);";
          break;
        case 93:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_3);";
          break;
        case 94:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
          break;
        case 95:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 3,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_3);";
          break;
        case 96:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_4);";
          break;
        case 97:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_4);";
          break;
        case 98:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_4);";
          break;
        case 99:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_4);";
          break;
        case 100:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_4);";
          break;
        case 101:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_4);";
          break;
        case 102:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
          break;
        case 103:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 4,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_4);";
          break;
        case 104:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_5);";
          break;
        case 105:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_5);";
          break;
        case 106:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_5);";
          break;
        case 107:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_5);";
          break;
        case 108:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_5);";
          break;
        case 109:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_5);";
          break;
        case 110:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
          break;
        case 111:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 5,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_5);";
          break;
        case 112:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_6);";
          break;
        case 113:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_6);";
          break;
        case 114:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_6);";
          break;
        case 115:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_6);";
          break;
        case 116:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_6);";
          break;
        case 117:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_6);";
          break;
        case 118:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
          break;
        case 119:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 6,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_6);";
          break;
        case 120:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,B";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.b & BIT_7);";
          break;
        case 121:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,C";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.c & BIT_7);";
          break;
        case 122:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,D";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.d & BIT_7);";
          break;
        case 123:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,E";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.e & BIT_7);";
          break;
        case 124:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,H";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.h & BIT_7);";
          break;
        case 125:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,L";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.l & BIT_7);";
          break;
        case 126:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
          break;
        case 127:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "BIT 7,A";
          $code$$inline_108_code$$inline_118$$ = "this.bit(this.a & BIT_7);";
          break;
        case 128:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,B";
          $code$$inline_108_code$$inline_118$$ = "this.b &= ~BIT_0;";
          break;
        case 129:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,C";
          $code$$inline_108_code$$inline_118$$ = "this.c &= ~BIT_0;";
          break;
        case 130:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,D";
          $code$$inline_108_code$$inline_118$$ = "this.d &= ~BIT_0;";
          break;
        case 131:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,E";
          $code$$inline_108_code$$inline_118$$ = "this.e &= ~BIT_0;";
          break;
        case 132:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,H";
          $code$$inline_108_code$$inline_118$$ = "this.h &= ~BIT_0;";
          break;
        case 133:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,L";
          $code$$inline_108_code$$inline_118$$ = "this.l &= ~BIT_0;";
          break;
        case 134:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
          break;
        case 135:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 0,A";
          $code$$inline_108_code$$inline_118$$ = "this.a &= ~BIT_0;";
          break;
        case 136:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,B";
          break;
        case 137:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,C";
          break;
        case 138:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,D";
          break;
        case 139:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,E";
          break;
        case 140:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,H";
          break;
        case 141:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,L";
          break;
        case 142:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
          break;
        case 143:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 1,A";
          break;
        case 144:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,B";
          break;
        case 145:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,C";
          break;
        case 146:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,D";
          break;
        case 147:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,E";
          break;
        case 148:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,H";
          break;
        case 149:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,L";
          break;
        case 150:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
          break;
        case 151:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 2,A";
          break;
        case 152:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,B";
          break;
        case 153:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,C";
          break;
        case 154:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,D";
          break;
        case 155:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,E";
          break;
        case 156:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,H";
          break;
        case 157:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,L";
          break;
        case 158:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
          break;
        case 159:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 3,A";
          $code$$inline_108_code$$inline_118$$ = "this.a &= ~BIT_3;";
          break;
        case 160:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,B";
          break;
        case 161:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,C";
          break;
        case 162:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,D";
          break;
        case 163:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,E";
          break;
        case 164:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,H";
          break;
        case 165:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,L";
          break;
        case 166:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
          break;
        case 167:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 4,A";
          $code$$inline_108_code$$inline_118$$ = "this.a &= ~BIT_4;";
          break;
        case 168:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,B";
          break;
        case 169:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,C";
          break;
        case 170:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,D";
          break;
        case 171:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,E";
          break;
        case 172:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,H";
          break;
        case 173:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,L";
          break;
        case 174:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
          break;
        case 175:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 5,A";
          break;
        case 176:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,B";
          break;
        case 177:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,C";
          break;
        case 178:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,D";
          break;
        case 179:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,E";
          break;
        case 180:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,H";
          break;
        case 181:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,L";
          break;
        case 182:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
          break;
        case 183:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 6,A";
          $code$$inline_108_code$$inline_118$$ = "this.a &= ~BIT_6;";
          break;
        case 184:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,B";
          $code$$inline_108_code$$inline_118$$ = "this.b &= ~BIT_7;";
          break;
        case 185:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,C";
          $code$$inline_108_code$$inline_118$$ = "this.c &= ~BIT_7;";
          break;
        case 186:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,D";
          $code$$inline_108_code$$inline_118$$ = "this.d &= ~BIT_7;";
          break;
        case 187:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,E";
          $code$$inline_108_code$$inline_118$$ = "this.e &= ~BIT_7;";
          break;
        case 188:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,H";
          $code$$inline_108_code$$inline_118$$ = "this.h &= ~BIT_7;";
          break;
        case 189:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,L";
          $code$$inline_108_code$$inline_118$$ = "this.l &= ~BIT_7;";
          break;
        case 190:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
          break;
        case 191:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "RES 7,A";
          $code$$inline_108_code$$inline_118$$ = "this.a &= ~BIT_7;";
          break;
        case 192:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,B";
          $code$$inline_108_code$$inline_118$$ = "this.b |= BIT_0;";
          break;
        case 193:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,C";
          $code$$inline_108_code$$inline_118$$ = "this.c |= BIT_0;";
          break;
        case 194:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,D";
          $code$$inline_108_code$$inline_118$$ = "this.d |= BIT_0;";
          break;
        case 195:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,E";
          $code$$inline_108_code$$inline_118$$ = "this.e |= BIT_0;";
          break;
        case 196:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,H";
          $code$$inline_108_code$$inline_118$$ = "this.h |= BIT_0;";
          break;
        case 197:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,L";
          $code$$inline_108_code$$inline_118$$ = "this.l |= BIT_0;";
          break;
        case 198:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
          break;
        case 199:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 0,A";
          $code$$inline_108_code$$inline_118$$ = "this.a |= BIT_0;";
          break;
        case 200:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,B";
          break;
        case 201:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,C";
          break;
        case 202:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,D";
          break;
        case 203:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,E";
          break;
        case 204:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,H";
          break;
        case 205:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,L";
          break;
        case 206:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
          break;
        case 207:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 1,A";
          break;
        case 208:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,B";
          break;
        case 209:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,C";
          break;
        case 210:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,D";
          break;
        case 211:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,E";
          break;
        case 212:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,H";
          break;
        case 213:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,L";
          break;
        case 214:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
          break;
        case 215:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 2,A";
          break;
        case 216:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,B";
          break;
        case 217:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,C";
          break;
        case 218:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,D";
          break;
        case 219:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,E";
          break;
        case 220:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,H";
          break;
        case 221:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,L";
          break;
        case 222:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
          break;
        case 223:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 3,A";
          break;
        case 224:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,B";
          break;
        case 225:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,C";
          break;
        case 226:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,D";
          break;
        case 227:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,E";
          break;
        case 228:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,H";
          break;
        case 229:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,L";
          break;
        case 230:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
          break;
        case 231:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 4,A";
          $code$$inline_108_code$$inline_118$$ = "this.a |= BIT_4;";
          break;
        case 232:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,B";
          break;
        case 233:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,C";
          break;
        case 234:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,D";
          break;
        case 235:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,E";
          break;
        case 236:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,H";
          break;
        case 237:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,L";
          break;
        case 238:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
          break;
        case 239:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 5,A";
          $code$$inline_108_code$$inline_118$$ = "this.a |= BIT_5;";
          break;
        case 240:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,B";
          $code$$inline_108_code$$inline_118$$ = "this.b |= BIT_6;";
          break;
        case 241:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,C";
          $code$$inline_108_code$$inline_118$$ = "this.c |= BIT_6;";
          break;
        case 242:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,D";
          $code$$inline_108_code$$inline_118$$ = "this.d |= BIT_6;";
          break;
        case 243:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,E";
          $code$$inline_108_code$$inline_118$$ = "this.e |= BIT_6;";
          break;
        case 244:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,H";
          $code$$inline_108_code$$inline_118$$ = "this.h |= BIT_6;";
          break;
        case 245:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,L";
          $code$$inline_108_code$$inline_118$$ = "this.l |= BIT_6;";
          break;
        case 246:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
          break;
        case 247:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 6,A";
          $code$$inline_108_code$$inline_118$$ = "this.a |= BIT_6;";
          break;
        case 248:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,B";
          $code$$inline_108_code$$inline_118$$ = "this.b |= BIT_7;";
          break;
        case 249:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,C";
          $code$$inline_108_code$$inline_118$$ = "this.c |= BIT_7;";
          break;
        case 250:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,D";
          $code$$inline_108_code$$inline_118$$ = "this.d |= BIT_7;";
          break;
        case 251:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,E";
          $code$$inline_108_code$$inline_118$$ = "this.e |= BIT_7;";
          break;
        case 252:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,H";
          $code$$inline_108_code$$inline_118$$ = "this.h |= BIT_7;";
          break;
        case 253:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,L";
          $code$$inline_108_code$$inline_118$$ = "this.l |= BIT_7;";
          break;
        case 254:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,(HL)";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
          break;
        case 255:
          $currAddr$$inline_116_inst$$inline_106_location$$26$$ = "SET 7,A", $code$$inline_108_code$$inline_118$$ = "this.a |= BIT_7;"
      }
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = {$opcode$:$code$$5_opcode$$inline_104_opcodesArray$$inline_114$$, $opcodes$:$_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$, $inst$:$currAddr$$inline_116_inst$$inline_106_location$$26$$, code:$code$$inline_108_code$$inline_118$$, $address$:$currAddr$$inline_107_target$$inline_117$$, $nextAddress$:$address$$inline_103_inst_opcode$$inline_113$$};
      $address$$inline_103_inst_opcode$$inline_113$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$inst$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.code;
      $defaultInstruction$$inline_124_opcodesArray$$ = $defaultInstruction$$inline_124_opcodesArray$$.concat($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$nextAddress$;
      break;
    case 204:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 205:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      $address$$6$$ += 2;
      break;
    case 206:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "ADC ," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.adc_a(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$++;
      break;
    case 207:
      $address$$inline_111_target$$46$$ = 8;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 208:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET NC";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $address$$inline_103_inst_opcode$$inline_113$$ = "POP DE";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 211:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$) + "),A";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.port.out(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$) + ", this.a);";
      $address$$6$$++;
      break;
    case 212:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 213:
      $address$$inline_103_inst_opcode$$inline_113$$ = "PUSH DE";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "SUB " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sub_a(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$++;
      break;
    case 215:
      $address$$inline_111_target$$46$$ = 16;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 216:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET C";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $address$$inline_103_inst_opcode$$inline_113$$ = "EXX";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 219:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.a = this.port.in_(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$) + ");";
      $address$$6$$++;
      break;
    case 220:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 221:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IX", $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$inst$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.code;
      $defaultInstruction$$inline_124_opcodesArray$$ = $defaultInstruction$$inline_124_opcodesArray$$.concat($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$nextAddress$;
      break;
    case 222:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "SBC A," + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sbc_a(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$++;
      break;
    case 223:
      $address$$inline_111_target$$46$$ = 24;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 224:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET PO";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $address$$inline_103_inst_opcode$$inline_113$$ = "POP HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_PARITY) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 227:
      $address$$inline_103_inst_opcode$$inline_113$$ = "EX (SP),HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "temp = this.h;this.h = this.readMem(this.sp + 0x01);this.writeMem(this.sp + 0x01, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
      break;
    case 228:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_PARITY) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 229:
      $address$$inline_103_inst_opcode$$inline_113$$ = "PUSH HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "AND (" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + "] | F_HALFCARRY;";
      $address$$6$$++;
      break;
    case 231:
      $address$$inline_111_target$$46$$ = 32;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 232:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET PE";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP (HL)";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.pc = this.getHL(); return;";
      $address$$6$$ = null;
      break;
    case 234:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_PARITY) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 235:
      $address$$inline_103_inst_opcode$$inline_113$$ = "EX DE,HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 237:
      var $address$$inline_111_target$$46$$ = $address$$6$$, $address$$inline_103_inst_opcode$$inline_113$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$), $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = [$address$$inline_103_inst_opcode$$inline_113$$], $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "Unimplemented 0xED prefixed opcode", $currAddr$$inline_116_inst$$inline_106_location$$26$$ = $address$$inline_111_target$$46$$, 
      $currAddr$$inline_107_target$$inline_117$$ = null, $code$$inline_108_code$$inline_118$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_119$$ = "", $location$$inline_120$$ = 0;
      $address$$inline_111_target$$46$$++;
      switch($address$$inline_103_inst_opcode$$inline_113$$) {
        case 64:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN B,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
          break;
        case 65:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),B";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.b);";
          break;
        case 66:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "SBC HL,BC";
          $code$$inline_108_code$$inline_118$$ = "this.sbc16(this.getBC());";
          break;
        case 67:
          $location$$inline_120$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$);
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($location$$inline_120$$);
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD (" + $operand$$inline_119$$ + "),BC";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(" + $operand$$inline_119$$ + ", this.c);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_120$$ + 1) + ", this.b);";
          $address$$inline_111_target$$46$$ += 2;
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
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "NEG";
          $code$$inline_108_code$$inline_118$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "RETN / RETI";
          $code$$inline_108_code$$inline_118$$ = "this.pc = this.readMemWord(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
          $address$$inline_111_target$$46$$ = null;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IM 0";
          $code$$inline_108_code$$inline_118$$ = "this.im = 0x00;";
          break;
        case 71:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD I,A";
          $code$$inline_108_code$$inline_118$$ = "this.i = this.a;";
          break;
        case 72:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN C,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
          break;
        case 73:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),C";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.c);";
          break;
        case 74:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "ADC HL,BC";
          $code$$inline_108_code$$inline_118$$ = "this.adc16(this.getBC());";
          break;
        case 75:
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$));
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD BC,(" + $operand$$inline_119$$ + ")";
          $code$$inline_108_code$$inline_118$$ = "this.setBC(this.readMemWord(" + $operand$$inline_119$$ + "));";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 79:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD R,A";
          $code$$inline_108_code$$inline_118$$ = "this.r = this.a;";
          break;
        case 80:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN D,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
          break;
        case 81:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),D";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.d);";
          break;
        case 82:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "SBC HL,DE";
          $code$$inline_108_code$$inline_118$$ = "this.sbc16(this.getDE());";
          break;
        case 83:
          $location$$inline_120$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$);
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($location$$inline_120$$);
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD (" + $operand$$inline_119$$ + "),DE";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(" + $operand$$inline_119$$ + ", this.e);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_120$$ + 1) + ", this.d);";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 86:
        ;
        case 118:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IM 1";
          $code$$inline_108_code$$inline_118$$ = "this.im = 0x01;";
          break;
        case 87:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD A,I";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
          break;
        case 88:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN E,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
          break;
        case 89:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),E";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.e);";
          break;
        case 90:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "ADC HL,DE";
          $code$$inline_108_code$$inline_118$$ = "this.adc16(this.getDE());";
          break;
        case 91:
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$));
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD DE,(" + $operand$$inline_119$$ + ")";
          $code$$inline_108_code$$inline_118$$ = "this.setDE(this.readMemWord(" + $operand$$inline_119$$ + "));";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 95:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD A,R";
          $code$$inline_108_code$$inline_118$$ = "this.a = JSSMS.Utils.rndInt(0xFF);this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
          break;
        case 96:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN H,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
          break;
        case 97:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),H";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.h);";
          break;
        case 98:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "SBC HL,HL";
          $code$$inline_108_code$$inline_118$$ = "this.sbc16(this.getHL());";
          break;
        case 99:
          $location$$inline_120$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$);
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($location$$inline_120$$);
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD (" + $operand$$inline_119$$ + "),HL";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(" + $operand$$inline_119$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_120$$ + 1) + ", this.h);";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 103:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "RRD";
          $code$$inline_108_code$$inline_118$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 104:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN L,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
          break;
        case 105:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),L";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.l);";
          break;
        case 106:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "ADC HL,HL";
          $code$$inline_108_code$$inline_118$$ = "this.adc16(this.getHL());";
          break;
        case 107:
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$));
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD HL,(" + $operand$$inline_119$$ + ")";
          $code$$inline_108_code$$inline_118$$ = "this.setHL(this.readMemWord(" + $operand$$inline_119$$ + "));";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 111:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "RLD";
          $code$$inline_108_code$$inline_118$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 113:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),0";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, 0);";
          break;
        case 114:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "SBC HL,SP";
          $code$$inline_108_code$$inline_118$$ = "this.sbc16(this.sp);";
          break;
        case 115:
          $location$$inline_120$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$);
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($location$$inline_120$$);
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD (" + $operand$$inline_119$$ + "),SP";
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(" + $operand$$inline_119$$ + ", this.sp & 0xFF);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_120$$ + 1) + ", this.sp >> 8);";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 120:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IN A,(C)";
          $code$$inline_108_code$$inline_118$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 121:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUT (C),A";
          $code$$inline_108_code$$inline_118$$ = "this.port.out(this.c, this.a);";
          break;
        case 122:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "ADC HL,SP";
          $code$$inline_108_code$$inline_118$$ = "this.adc16(this.sp);";
          break;
        case 123:
          $operand$$inline_119$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_111_target$$46$$));
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LD SP,(" + $operand$$inline_119$$ + ")";
          $code$$inline_108_code$$inline_118$$ = "this.sp = this.readMemWord(" + $operand$$inline_119$$ + ");";
          $address$$inline_111_target$$46$$ += 2;
          break;
        case 160:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LDI";
          $code$$inline_108_code$$inline_118$$ = "temp = this.readMem(this.getHL());this.writeMem(this.getDE(), temp);this.decBC();this.incDE();this.incHL();temp = (temp + this.a) & 0xFF;this.f = (this.f & 0xC1) | (this.getBC() ? F_PARITY : 0) | (temp & 0x08) | ((temp & 0x02) ? 0x20 : 0);";
          break;
        case 161:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "CPI";
          $code$$inline_108_code$$inline_118$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
          break;
        case 162:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "INI";
          $code$$inline_108_code$$inline_118$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 163:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUTI";
          $code$$inline_108_code$$inline_118$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 168:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LDD";
          break;
        case 169:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "CPD";
          break;
        case 170:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "IND";
          $code$$inline_108_code$$inline_118$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 171:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OUTD";
          $code$$inline_108_code$$inline_118$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 176:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LDIR";
          $currAddr$$inline_107_target$$inline_117$$ = $address$$inline_111_target$$46$$ - 2;
          $code$$inline_108_code$$inline_118$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();if (this.getBC() != 0x00) {this.tstates -= 0x05;this.f |= F_PARITY;return;} else {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
          break;
        case 177:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "CPIR";
          $currAddr$$inline_107_target$$inline_117$$ = $address$$inline_111_target$$46$$ - 2;
          $code$$inline_108_code$$inline_118$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0x00 ? 0x00 : F_PARITY);" + ("if ((temp & F_PARITY) != 0x00 && (this.f & F_ZERO) == 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($currAddr$$inline_107_target$$inline_117$$) + ";return;}");
          $code$$inline_108_code$$inline_118$$ += "this.f = (this.f & 0xF8) | temp;";
          break;
        case 178:
          $currAddr$$inline_107_target$$inline_117$$ = $address$$inline_111_target$$46$$ - 2;
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "INIR";
          $code$$inline_108_code$$inline_118$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) == 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 179:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OTIR";
          $currAddr$$inline_107_target$$inline_117$$ = $address$$inline_111_target$$46$$ - 2;
          $code$$inline_108_code$$inline_118$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}";
          $code$$inline_108_code$$inline_118$$ += "if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 184:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "LDDR";
          break;
        case 185:
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "CPDR";
          break;
        case 186:
          $currAddr$$inline_107_target$$inline_117$$ = $address$$inline_111_target$$46$$ - 2;
          $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "INDR";
          $code$$inline_108_code$$inline_118$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 187:
          $currAddr$$inline_107_target$$inline_117$$ = $address$$inline_111_target$$46$$ - 2, $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = "OTDR", $code$$inline_108_code$$inline_118$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}"
      }
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = {$opcode$:$address$$inline_103_inst_opcode$$inline_113$$, $opcodes$:$code$$5_opcode$$inline_104_opcodesArray$$inline_114$$, $inst$:$_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$, code:$code$$inline_108_code$$inline_118$$, $address$:$currAddr$$inline_116_inst$$inline_106_location$$26$$, $nextAddress$:$address$$inline_111_target$$46$$, target:$currAddr$$inline_107_target$$inline_117$$};
      $address$$inline_111_target$$46$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.target;
      $address$$inline_103_inst_opcode$$inline_113$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$inst$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.code;
      $defaultInstruction$$inline_124_opcodesArray$$ = $defaultInstruction$$inline_124_opcodesArray$$.concat($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$nextAddress$;
      break;
    case 238:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "XOR " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + "];";
      $address$$6$$++;
      break;
    case 239:
      $address$$inline_111_target$$46$$ = 40;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 240:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET P";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $address$$inline_103_inst_opcode$$inline_113$$ = "POP AF";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.setAF(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_SIGN) == 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 243:
      $address$$inline_103_inst_opcode$$inline_113$$ = "DI";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_SIGN) == 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 245:
      $address$$inline_103_inst_opcode$$inline_113$$ = "PUSH AF";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "OR " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + "];";
      $address$$6$$++;
      break;
    case 247:
      $address$$inline_111_target$$46$$ = 48;
      $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$);
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;";
      break;
    case 248:
      $address$$inline_103_inst_opcode$$inline_113$$ = "RET M";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $address$$inline_103_inst_opcode$$inline_113$$ = "LD SP,HL";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_SIGN) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 251:
      $address$$inline_103_inst_opcode$$inline_113$$ = "EI";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $address$$inline_111_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ")";
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + ";return;}";
      $address$$6$$ += 2;
      break;
    case 253:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IY", $address$$6$$);
      $address$$inline_103_inst_opcode$$inline_113$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$inst$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.code;
      $defaultInstruction$$inline_124_opcodesArray$$ = $defaultInstruction$$inline_124_opcodesArray$$.concat($_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$opcodes$);
      $address$$6$$ = $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$.$nextAddress$;
      break;
    case 254:
      $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$6$$));
      $address$$inline_103_inst_opcode$$inline_113$$ = "CP " + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$;
      $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.cp_a(" + $_inst_inst$$inline_115_opcodesArray$$inline_105_operand$$ + ");";
      $address$$6$$++;
      break;
    case 255:
      $address$$inline_111_target$$46$$ = 56, $address$$inline_103_inst_opcode$$inline_113$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$), $code$$5_opcode$$inline_104_opcodesArray$$inline_114$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$6$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_111_target$$46$$) + "; return;"
  }
  var $opcode$$6_options$$inline_122$$ = {$opcode$:$opcode$$6_options$$inline_122$$, $opcodes$:$defaultInstruction$$inline_124_opcodesArray$$, $inst$:$address$$inline_103_inst_opcode$$inline_113$$, code:$code$$5_opcode$$inline_104_opcodesArray$$inline_114$$, $address$:$currAddr_hexOpcodes$$inline_126$$, $nextAddress$:$address$$6$$, target:$address$$inline_111_target$$46$$}, $defaultInstruction$$inline_124_opcodesArray$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", 
  $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""}, $prop$$inline_125$$, $currAddr_hexOpcodes$$inline_126$$ = "";
  for($prop$$inline_125$$ in $defaultInstruction$$inline_124_opcodesArray$$) {
    void 0 != $opcode$$6_options$$inline_122$$[$prop$$inline_125$$] && ($defaultInstruction$$inline_124_opcodesArray$$[$prop$$inline_125$$] = $opcode$$6_options$$inline_122$$[$prop$$inline_125$$])
  }
  $defaultInstruction$$inline_124_opcodesArray$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_124_opcodesArray$$.$address$);
  $defaultInstruction$$inline_124_opcodesArray$$.$opcodes$.length && ($currAddr_hexOpcodes$$inline_126$$ = $defaultInstruction$$inline_124_opcodesArray$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
  $defaultInstruction$$inline_124_opcodesArray$$.label = $defaultInstruction$$inline_124_opcodesArray$$.$hexAddress$ + " " + $currAddr_hexOpcodes$$inline_126$$ + $defaultInstruction$$inline_124_opcodesArray$$.$inst$;
  return $defaultInstruction$$inline_124_opcodesArray$$
}
function $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_parseInstructions$self$$) {
  window.console.time("Instructions parsing");
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
  this.$f$ = new Uint8Array(16384);
  this.$a$ = new Uint8Array(96);
  for($i$$16_r$$inline_137$$ = 0;96 > $i$$16_r$$inline_137$$;$i$$16_r$$inline_137$$++) {
    this.$a$[$i$$16_r$$inline_137$$] = 255
  }
  this.$c$ = new Uint8Array(16);
  this.$h$ = 0;
  this.$n$ = !1;
  this.$v$ = this.$p$ = this.$M$ = this.$w$ = this.$g$ = this.$j$ = 0;
  this.$t$ = new Uint8Array(256);
  this.$J$ = 0;
  this.$b$ = $i$$inline_133_i$$inline_136_sms$$3$$.$a$.$canvasImageData$.data;
  this.$T$ = new Uint8Array(64);
  this.$S$ = new Uint8Array(64);
  this.$R$ = new Uint8Array(64);
  this.$Q$ = new Uint8Array(256);
  this.$P$ = new Uint8Array(256);
  this.$O$ = new Uint8Array(16);
  this.$i$ = this.$K$ = this.$F$ = 0;
  this.$m$ = !1;
  this.$q$ = Array(192);
  for($i$$16_r$$inline_137$$ = 0;192 > $i$$16_r$$inline_137$$;$i$$16_r$$inline_137$$++) {
    this.$q$[$i$$16_r$$inline_137$$] = new Uint8Array(25)
  }
  this.$I$ = Array(512);
  this.$G$ = new Uint8Array(512);
  for($i$$inline_133_i$$inline_136_sms$$3$$ = this.$o$ = this.$s$ = 0;512 > $i$$inline_133_i$$inline_136_sms$$3$$;$i$$inline_133_i$$inline_136_sms$$3$$++) {
    this.$I$[$i$$inline_133_i$$inline_136_sms$$3$$] = new Uint8Array(64)
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
  this.$main$.$cpu$.$G$ = !1;
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
  this.reset = function $this$reset$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  };
  this.$writeFrame$ = function $this$$writeFrame$$() {
  };
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
      $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$h$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_215_JSCompiler_StaticMethods_dataRead$self$$inline_212_JSCompiler_StaticMethods_getVCount$self$$inline_210_JSCompiler_inline_result$$7$$.$main$.$cpu$.$G$ = !1, $statuscopy$$inline_216_value$$inline_213$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$a$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$a$[0] | $JSCompiler_StaticMethods_in_$self$$.$a$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$, $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$, $reg$$inline_226_value$$80$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$)) {
    switch($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[0] = ($reg$$inline_226_value$$80$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[1] = $reg$$inline_226_value$$80$$ & 128;
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
            if($reg$$inline_226_value$$80$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] & 255)) {
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
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$f$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] = $reg$$inline_226_value$$80$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$T$[$reg$$inline_226_value$$80$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$S$[$reg$$inline_226_value$$80$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$R$[$reg$$inline_226_value$$80$$]) : 
            ($address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$Q$[$reg$$inline_226_value$$80$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$P$[$reg$$inline_226_value$$80$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_221_old$$inline_227_port$$2_temp$$inline_220$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$O$[$reg$$inline_226_value$$80$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ = $reg$$inline_226_value$$80$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ & 16128 | $reg$$inline_226_value$$80$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$n$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$ = $reg$$inline_226_value$$80$$ >> 6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ | $reg$$inline_226_value$$80$$ << 8, 0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$M$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$g$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$w$) {
              $reg$$inline_226_value$$80$$ &= 15;
              switch($reg$$inline_226_value$$80$$) {
                case 0:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$h$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$G$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 
                  16));
                  break;
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$h$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$G$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_226_value$$80$$] & 3) && 
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
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_226_value$$80$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$j$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$, 0 != ($reg$$inline_226_value$$80$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_226_value$$80$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_226_value$$80$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_226_value$$80$$ & 63) << 4 : 
          $reg$$inline_226_value$$80$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_229_JSCompiler_StaticMethods_controlWrite$self$$inline_224_JSCompiler_StaticMethods_dataWrite$self$$inline_218_JSCompiler_StaticMethods_out$self$$.$c$) {
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
  function $Bytecode$$1$$($address$$16$$, $page$$) {
    this.$address$ = $address$$16$$;
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
    this.$instructions$ = Array($rom$$1$$.length);
    this.$b$ = [];
    for(var $i$$28$$ = 0;$i$$28$$ < $rom$$1$$.length;$i$$28$$++) {
      this.$a$[$i$$28$$] = [], this.$instructions$[$i$$28$$] = [], this.$b$[$i$$28$$] = []
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
function $n$Literal$$($value$$86$$) {
  return"number" == typeof $value$$86$$ ? {type:"Literal", value:$value$$86$$, raw:$JSSMS$Utils$toHex$$($value$$86$$)} : {type:"Literal", value:$value$$86$$}
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
var $o$$ = {$SET16$:function($register1$$, $register2$$, $value$$87$$) {
  return"Literal" == $value$$87$$.type ? [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $evaluate$$($n$BinaryExpression$$(">>", $value$$87$$, $n$Literal$$(8))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $evaluate$$($n$BinaryExpression$$("&", $value$$87$$, $n$Literal$$(255)))))] : [$n$VariableDeclaration$$("val", $value$$87$$), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", 
  $n$Identifier$$("val"), $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $n$Identifier$$("val"), $n$Literal$$(255))))]
}, $EX$:function($register1$$1$$, $register2$$1$$) {
  return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$($register1$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$1$$), $n$Identifier$$($register1$$1$$ + "2"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$($register1$$1$$ + "2"), $n$Identifier$$("temp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$($register2$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", 
  $n$Register$$($register2$$1$$), $n$Identifier$$($register2$$1$$ + "2"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$($register2$$1$$ + "2"), $n$Identifier$$("temp")))]
}, $wa$:function() {
  return function() {
  }
}, $da$:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function($value$$88$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Literal$$($value$$88$$)))
  } : "i" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$("i"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), $n$Literal$$(0)))))]
  } : "r" == $dstRegister1$$ && void 0 == $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$CallExpression$$("JSSMS.Utils.rndInt", $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), 
    $n$Literal$$(0)))))]
  } : void 0 == $dstRegister2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$($dstRegister1$$)))
  } : "n" == $dstRegister1$$ && "n" == $dstRegister2$$ ? function($value$$89$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$Literal$$($value$$89$$))))
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()))))
  }
}, $ea$:function($srcRegister$$1$$, $dstRegister1$$1$$, $dstRegister2$$1$$) {
  return function($value$$90$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$1$$), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($dstRegister1$$1$$ + $dstRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$90$$)))))
  }
}, $LD16$:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$2$$, $dstRegister2$$2$$) {
  if(void 0 == $dstRegister1$$2$$ && void 0 == $dstRegister2$$2$$) {
    return function($value$$91$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $n$Literal$$($value$$91$$))
    }
  }
  if("n" == $dstRegister1$$2$$ && "n" == $dstRegister2$$2$$) {
    return function($value$$92$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $o$$.$READ_MEM16$($n$Literal$$($value$$92$$)))
    }
  }
  throw Error("Wrong parameters number");
}, $ta$:function($srcRegister1$$1$$, $srcRegister2$$1$$, $dstRegister1$$3$$, $dstRegister2$$3$$) {
  return void 0 == $dstRegister1$$3$$ && void 0 == $dstRegister2$$3$$ ? function($value$$93$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$93$$)]))
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ && void 0 == $dstRegister2$$3$$ ? function($value$$94$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$94$$), $n$Register$$($dstRegister1$$3$$)]))
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ ? function($value$$95$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$95$$), $n$Register$$($dstRegister2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$95$$ + 1), $n$Register$$($dstRegister1$$3$$)]))]
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Register$$($dstRegister1$$3$$)]))
  }
}, $qa$:function($register1$$2$$, $register2$$2$$) {
  return void 0 == $register1$$2$$ && void 0 == $register2$$2$$ ? function($value$$96$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$Literal$$($value$$96$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$CallExpression$$("get" + ($register1$$2$$ + $register2$$2$$).toUpperCase())))
  }
}, $ja$:function($register1$$3$$, $register2$$3$$) {
  return void 0 == $register2$$3$$ ? function($value$$97$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$97$$))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$97$$ + 1)))]
  } : function($value$$98$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$98$$), $n$Register$$($register2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$98$$ + 1), $n$Register$$($register1$$3$$)]))]
  }
}, $U$:function($register1$$4$$, $register2$$4$$) {
  return void 0 == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$4$$), $n$CallExpression$$("inc8", $n$Register$$($register1$$4$$))))
  } : "s" == $register1$$4$$ && "p" == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$CallExpression$$("getHL")))
  }
}, $T$:function($register1$$5$$, $register2$$5$$) {
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
}, $w$:function($register1$$7$$, $register2$$7$$) {
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
}, $La$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rlca_a"))
  }
}, $Pa$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rrca_a"))
  }
}, $Ja$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rla_a"))
  }
}, $Na$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rra_a"))
  }
}, $v$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("daa"))
  }
}, $s$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cpl_a"))
  }
}, $Ua$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))]
  }
}, $n$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("ccf"))
  }
}, $f$:function($register1$$9$$, $register2$$9$$) {
  return void 0 == $register1$$9$$ && void 0 == $register2$$9$$ ? function($value$$99$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Literal$$($value$$99$$)))
  } : void 0 == $register2$$9$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Register$$($register1$$9$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$9$$ + $register2$$9$$).toUpperCase()))))
  }
}, $a$:function($register1$$10$$, $register2$$10$$) {
  return void 0 == $register1$$10$$ && void 0 == $register2$$10$$ ? function($value$$100$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Literal$$($value$$100$$)))
  } : void 0 == $register2$$10$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Register$$($register1$$10$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$10$$ + $register2$$10$$).toUpperCase()))))
  }
}, $ab$:function($register1$$11$$, $register2$$11$$) {
  return void 0 == $register1$$11$$ && void 0 == $register2$$11$$ ? function($value$$101$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Literal$$($value$$101$$)))
  } : void 0 == $register2$$11$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Register$$($register1$$11$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$11$$ + $register2$$11$$).toUpperCase()))))
  }
}, $Ra$:function($register1$$12$$, $register2$$12$$) {
  return void 0 == $register1$$12$$ && void 0 == $register2$$12$$ ? function($value$$102$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Literal$$($value$$102$$)))
  } : void 0 == $register2$$12$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Register$$($register1$$12$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$12$$ + $register2$$12$$).toUpperCase()))))
  }
}, $i$:function($register1$$13$$, $register2$$13$$) {
  return void 0 == $register1$$13$$ && void 0 == $register2$$13$$ ? function($value$$103$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Literal$$($value$$103$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  } : "a" != $register1$$13$$ && void 0 == $register2$$13$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Register$$($register1$$13$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  } : "a" == $register1$$13$$ && void 0 == $register2$$13$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$13$$ + $register2$$13$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))]
  }
}, $cb$:function($register1$$14$$, $register2$$14$$) {
  return void 0 == $register1$$14$$ && void 0 == $register2$$14$$ ? function($value$$104$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Literal$$($value$$104$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" != $register1$$14$$ && void 0 == $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Register$$($register1$$14$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" == $register1$$14$$ && void 0 == $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Literal$$(0))))]
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$14$$ + $register2$$14$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $xa$:function($register1$$15$$, $register2$$15$$) {
  return void 0 == $register1$$15$$ && void 0 == $register2$$15$$ ? function($value$$105$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Literal$$($value$$105$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" != $register1$$15$$ && void 0 == $register2$$15$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Register$$($register1$$15$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  } : "a" == $register1$$15$$ && void 0 == $register2$$15$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$15$$ + $register2$$15$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $o$:function($register1$$16$$, $register2$$16$$) {
  return void 0 == $register1$$16$$ && void 0 == $register2$$16$$ ? function($value$$106$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Literal$$($value$$106$$)))
  } : void 0 == $register2$$16$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Register$$($register1$$16$$)))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$16$$ + $register2$$16$$).toUpperCase()))))
  }
}, $Da$:function($register1$$17$$, $register2$$17$$) {
  return function() {
    return[].concat($o$$.$SET16$($register1$$17$$, $register2$$17$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))))
  }
}, $Ea$:function($register1$$18$$, $register2$$18$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("push2", [$n$Register$$($register1$$18$$), $n$Register$$($register2$$18$$)]))
  }
}, $JR$:function($test$$2$$) {
  return function($value$$107$$, $target$$55$$) {
    return $n$IfStatement$$($test$$2$$, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$($target$$55$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()]))
  }
}, $I$:function() {
  return function($value$$108$$, $target$$56$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("b"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$("b"), $n$Literal$$(1)), $n$Literal$$(255)))), $o$$.$JR$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)))(void 0, $target$$56$$)]
  }
}, $ba$:function() {
  return function($value$$109$$, $target$$57$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))))(void 0, $target$$57$$)
  }
}, $ca$:function() {
  return function($value$$110$$, $target$$58$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0)))(void 0, $target$$58$$)
  }
}, $aa$:function() {
  return function($value$$111$$, $target$$59$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0))))(void 0, $target$$59$$)
  }
}, $Z$:function() {
  return function($value$$112$$, $target$$60$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0)))(void 0, $target$$60$$)
  }
}, $Ga$:function($operator$$4$$, $bitMask$$) {
  return void 0 == $operator$$4$$ && void 0 == $bitMask$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ReturnStatement$$()]
  } : function() {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$4$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(6))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), 
    $n$ReturnStatement$$()]))
  }
}, $X$:function($operator$$5$$, $bitMask$$1$$) {
  return void 0 == $operator$$5$$ && void 0 == $bitMask$$1$$ ? function($value$$114$$, $target$$62$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$62$$))), $n$ReturnStatement$$()]
  } : "h" == $operator$$5$$ && "l" == $bitMask$$1$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("getHL"))), $n$ReturnStatement$$()]
  } : function($value$$116$$, $target$$64$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$5$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$1$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$64$$))), $n$ReturnStatement$$()]))
  }
}, $m$:function($operator$$6$$, $bitMask$$2$$) {
  return void 0 == $operator$$6$$ && void 0 == $bitMask$$2$$ ? function($value$$117$$, $target$$65$$, $nextAddress$$8$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push1", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$8$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$65$$))), $n$ReturnStatement$$()]
  } : function($value$$118$$, $target$$66$$, $nextAddress$$9$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$6$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$2$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(7))), $n$ExpressionStatement$$($n$CallExpression$$("push1", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$9$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", 
    $n$Identifier$$("pc"), $n$Literal$$($target$$66$$))), $n$ReturnStatement$$()]))
  }
}, $Qa$:function($targetAddress$$1$$) {
  return function($value$$119$$, $target$$67$$, $nextAddress$$10$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push1", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$10$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($targetAddress$$1$$))), $n$ReturnStatement$$()]
  }
}, $G$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))]
  }
}, $J$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))]
  }
}, $Aa$:function($register1$$19$$, $register2$$19$$) {
  return void 0 == $register2$$19$$ ? function($value$$120$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Literal$$($value$$120$$), $n$Register$$($register1$$19$$)]))
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$($register1$$19$$), $n$Register$$($register2$$19$$)]))
  }
}, $S$:function($register1$$20$$, $register2$$20$$) {
  return void 0 == $register2$$20$$ ? function($value$$121$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Literal$$($value$$121$$))))
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Register$$($register2$$20$$)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$($register1$$20$$)))))]
  }
}, $M$:function() {
  return function() {
    return $o$$.$EX$("a", "f")
  }
}, $K$:function() {
  return function() {
    return[].concat($o$$.$EX$("b", "c"), $o$$.$EX$("d", "e"), $o$$.$EX$("h", "l"))
  }
}, $O$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1)), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $o$$.$READ_MEM8$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$Identifier$$("temp")]))]
  }
}, $N$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("d"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("d"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$Identifier$$("temp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("e"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("e"), $n$Register$$("l"))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$Identifier$$("temp")))]
  }
}, $Q$:function() {
  return function($ret_value$$123$$, $target$$71$$, $nextAddress$$14$$) {
    $ret_value$$123$$ = [];
    $ret_value$$123$$.push($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("tstates"), $n$Literal$$(0))));
    return $ret_value$$123$$.concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("halt"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$(($nextAddress$$14$$ - 1) % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()])
  }
}, $Ka$:$generateCBFunctions$$("rlc"), $Oa$:$generateCBFunctions$$("rrc"), $Ia$:$generateCBFunctions$$("rl"), $Ma$:$generateCBFunctions$$("rr"), $Wa$:$generateCBFunctions$$("sla"), $Ya$:$generateCBFunctions$$("sra"), $Xa$:$generateCBFunctions$$("sll"), $Za$:$generateCBFunctions$$("srl"), $j$:function($bit$$1$$, $register1$$21$$, $register2$$21$$) {
  return void 0 == $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $n$Register$$($register1$$21$$), $n$Bit$$($bit$$1$$))))
  } : "h" == $register1$$21$$ && "l" == $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase())), $n$Bit$$($bit$$1$$))))
  } : function($value$$124$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$Literal$$($value$$124$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$1$$))))]
  }
}, $Fa$:function($bit$$2$$, $register1$$22$$, $register2$$22$$) {
  return void 0 == $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$($register1$$22$$), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$))))
  } : "h" == $register1$$22$$ && "l" == $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase())), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))))
  } : function($value$$125$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$Literal$$($value$$125$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))]))]
  }
}, $Va$:function($bit$$3$$, $register1$$23$$, $register2$$23$$) {
  return void 0 == $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$($register1$$23$$), $n$Bit$$($bit$$3$$)))
  } : "h" == $register1$$23$$ && "l" == $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase())), $n$Bit$$($bit$$3$$))]))
  } : function($value$$126$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$Literal$$($value$$126$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$3$$))]))]
  }
}, $ua$:function($register1$$24$$, $register2$$24$$, $register3$$1$$) {
  return void 0 == $register3$$1$$ ? function($value$$127$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$24$$ + $register2$$24$$).toUpperCase()), $n$Literal$$($value$$127$$ & 255)), $n$Literal$$($value$$127$$ >> 8)]))]
  } : function($value$$128$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register2$$24$$ + $register3$$1$$).toUpperCase()), $n$Literal$$($value$$128$$)), $n$Register$$($register1$$24$$)]))]
  }
}, $V$:function($register1$$25$$, $register2$$25$$) {
  return function($value$$129$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$25$$ + $register2$$25$$).toUpperCase()), $n$Literal$$($value$$129$$))))]
  }
}, $F$:function($register1$$26$$, $register2$$26$$) {
  return function($value$$130$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$26$$ + $register2$$26$$).toUpperCase()), $n$Literal$$($value$$130$$))))]
  }
}, $h$:function($register1$$27$$, $register2$$27$$) {
  return function($value$$131$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$27$$ + $register2$$27$$).toUpperCase()), $n$Literal$$($value$$131$$)))))
  }
}, $c$:function($register1$$28$$, $register2$$28$$) {
  return function($value$$132$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$28$$ + $register2$$28$$).toUpperCase()), $n$Literal$$($value$$132$$)))))
  }
}, $bb$:function($register1$$29$$, $register2$$29$$) {
  return function($value$$133$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$29$$ + $register2$$29$$).toUpperCase()), $n$Literal$$($value$$133$$)))))
  }
}, $Ta$:function($register1$$30$$, $register2$$30$$) {
  return function($value$$134$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$30$$ + $register2$$30$$).toUpperCase()), $n$Literal$$($value$$134$$)))))
  }
}, $ya$:function($register1$$31$$, $register2$$31$$) {
  return function($value$$135$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$31$$ + $register2$$31$$).toUpperCase()), $n$Literal$$($value$$135$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $eb$:function($register1$$32$$, $register2$$32$$) {
  return function($value$$136$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$32$$ + $register2$$32$$).toUpperCase()), $n$Literal$$($value$$136$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))]
  }
}, $t$:function($register1$$33$$, $register2$$33$$) {
  return function($value$$137$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$33$$ + $register2$$33$$).toUpperCase()), $n$Literal$$($value$$137$$)))))
  }
}, $P$:function($register1$$34$$, $register2$$34$$) {
  return function() {
    return[].concat($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("get" + ($register1$$34$$ + $register2$$34$$).toUpperCase()))), $o$$.$SET16$($register1$$34$$, $register2$$34$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", 
    $n$Identifier$$("sp"), $n$Literal$$(1)), $n$BinaryExpression$$(">>", $n$Identifier$$("sp"), $n$Literal$$(8))])))
  }
}, $Y$:function($register1$$35$$, $register2$$35$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("get" + ($register1$$35$$ + $register2$$35$$).toUpperCase()))), $n$ReturnStatement$$()]
  }
}, $b$:function($register1$$36$$, $register2$$36$$) {
  return function() {
    return[void 0 == $register2$$36$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$36$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$36$$), $n$Literal$$(8)), $n$Register$$($register2$$36$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("+", $n$BinaryExpression$$("+", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp")), 
    $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(64))), $n$BinaryExpression$$(">>", 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$Literal$$(32768)), $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))]
  }
}, $Sa$:function($register1$$37$$, $register2$$37$$) {
  return function() {
    return[void 0 == $register2$$37$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$37$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$37$$), $n$Literal$$(8)), $n$Register$$($register2$$37$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("-", $n$BinaryExpression$$("-", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), 
    $n$Identifier$$("temp")), $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$Literal$$(2)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), 
    $n$Literal$$(64))), $n$BinaryExpression$$(">>", $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))]
  }
}, $va$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("a"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Identifier$$("temp")))]
  }
}, $Ha$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Identifier$$("iff2")))]
  }
}, $R$:function($value$$141$$) {
  return function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("im"), $n$Literal$$($value$$141$$)))
  }
}, $W$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("port.in_", $n$Register$$("c")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getHL"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]
  }
}, $Ca$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]
  }
}, $Ba$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]
  }
}, $ha$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))]
  }
}, $p$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]
  }
}, $fa$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))]
  }
}, $ia$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))]
  }
}, $q$:function() {
  return function() {
    var $JSCompiler_temp_const$$19$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $JSCompiler_temp_const$$18$$ = $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $JSCompiler_temp_const$$17$$ = $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $JSCompiler_temp_const$$16$$ = $n$ExpressionStatement$$($n$CallExpression$$("incHL")), 
    $JSCompiler_temp_const$$15$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4))));
    return[$JSCompiler_temp_const$$19$$, $JSCompiler_temp_const$$18$$, $JSCompiler_temp_const$$17$$, $JSCompiler_temp_const$$16$$, $JSCompiler_temp_const$$15$$, $n$IfStatement$$({type:"LogicalExpression", operator:"&&", left:$n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(4)), $n$Literal$$(0)), right:$n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))}, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", 
    $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp")))), $n$ReturnStatement$$()])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]
  }
}, $za$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ReturnStatement$$()]))]
  }
}, $ga$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))]
  }
}, $la$:$generateIndexCBFunctions$$("rlc"), $na$:$generateIndexCBFunctions$$("rrc"), $ka$:$generateIndexCBFunctions$$("rl"), $ma$:$generateIndexCBFunctions$$("rr"), $oa$:$generateIndexCBFunctions$$("sla"), $ra$:$generateIndexCBFunctions$$("sra"), $pa$:$generateIndexCBFunctions$$("sll"), $sa$:$generateIndexCBFunctions$$("srl"), $READ_MEM8$:function($value$$152$$) {
  return $n$CallExpression$$("readMem", $value$$152$$)
}, $READ_MEM16$:function($value$$153$$) {
  return $n$CallExpression$$("readMemWord", $value$$153$$)
}};
function $generateCBFunctions$$($fn$$1$$) {
  return function($register1$$38$$, $register2$$38$$) {
    return void 0 == $register2$$38$$ ? function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$38$$), $n$CallExpression$$($fn$$1$$, $n$Register$$($register1$$38$$))))
    } : function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$38$$ + $register2$$38$$).toUpperCase()), $n$CallExpression$$($fn$$1$$, $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$38$$ + $register2$$38$$).toUpperCase())))))
    }
  }
}
function $generateIndexCBFunctions$$($fn$$2$$) {
  return function($register1$$39$$, $register2$$39$$, $register3$$2$$) {
    return void 0 == $register3$$2$$ ? function($value$$154$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase()), $n$Literal$$($value$$154$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$CallExpression$$($fn$$2$$, $o$$.$READ_MEM8$($n$Identifier$$("location")))]))]
    } : function($value$$155$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase()), $n$Literal$$($value$$155$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register3$$2$$), $n$CallExpression$$($fn$$2$$, $o$$.$READ_MEM8$($n$Identifier$$("location"))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", 
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
