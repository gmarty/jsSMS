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
(function(window){'use strict';var $DEBUG$$ = !1, $ENABLE_COMPILER$$ = !0, $SUPPORT_TYPED_ARRAYS$$ = "Uint8Array" in window, $SUPPORT_DATAVIEW$$ = "ArrayBuffer" in window && "DataView" in window;
function $JSSMS$$($opts$$) {
  this.$g$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if (void 0 !== $opts$$) {
    for (var $key$$16$$ in this.$g$) {
      void 0 !== $opts$$[$key$$16$$] && (this.$g$[$key$$16$$] = $opts$$[$key$$16$$]);
    }
  }
  void 0 !== $opts$$.DEBUG && ($DEBUG$$ = $opts$$.DEBUG);
  void 0 !== $opts$$.ENABLE_COMPILER && ($ENABLE_COMPILER$$ = $opts$$.ENABLE_COMPILER);
  this.$keyboard$ = new $JSSMS$Keyboard$$(this);
  this.$a$ = new this.$g$.ui(this);
  this.$vdp$ = new $JSSMS$Vdp$$(this);
  this.$f$ = new $JSSMS$SN76489$$(this);
  this.$i$ = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$a$.updateStatus("Ready to load a ROM.");
  this.ui = this.$a$;
}
$JSSMS$$.prototype = {$isRunning$:!1, $cyclesPerLine$:0, $no_of_scanlines$:0, $frameSkip$:0, $fps$:0, $frameskip_counter$:0, $pause_button$:!1, $is_sms$:!0, $is_gg$:!1, $soundEnabled$:!1, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $emuWidth$:0, $emuHeight$:0, $fpsFrameCount$:0, $frameCount$:0, $romData$:"", $romFileName$:"", $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$ = this.$vdp$.$Q$, $clockSpeedHz$$inline_25_v$$inline_27$$ = 0;
  0 == $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $clockSpeedHz$$inline_25_v$$inline_27$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $clockSpeedHz$$inline_25_v$$inline_27$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($clockSpeedHz$$inline_25_v$$inline_27$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$vdp$.$Q$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$;
  if (this.$soundEnabled$) {
    this.$f$.$s$($clockSpeedHz$$inline_25_v$$inline_27$$, 44100);
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if (0 === this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$);
    }
    if (0 === this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for (var $fractional$$inline_28$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$++) {
        $clockSpeedHz$$inline_25_v$$inline_27$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_28$$, $fractional$$inline_28$$ = $clockSpeedHz$$inline_25_v$$inline_27$$ - ($clockSpeedHz$$inline_25_v$$inline_27$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$] = $clockSpeedHz$$inline_25_v$$inline_27$$ >> 16;
      }
    }
  }
  this.$frameCount$ = 0;
  this.$frameskip_counter$ = this.$frameSkip$;
  this.$keyboard$.reset();
  this.$a$.reset();
  this.$vdp$.reset();
  this.$i$.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$ = this.$cpu$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$.$instructions$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$.$main$.$a$.updateStatus("Parsing instructions...");
  $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$);
  $JSCompiler_StaticMethods_resetDebug$self$$inline_30_i$$inline_26_mode$$inline_24$$.$main$.$a$.updateStatus("Instructions parsed");
  $DEBUG$$ && clearInterval(this.$j$);
}, start:function $$JSSMS$$$$start$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = !0, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen), $DEBUG$$ && (this.$m$ = $JSSMS$Utils$getTimestamp$$(), this.$fpsFrameCount$ = 0, this.$j$ = setInterval(function() {
    var $now$$inline_35$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$a$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_35$$ - $self$$1$$.$m$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$m$ = $now$$inline_35$$;
  }, 500)));
  this.$a$.updateStatus("Running");
}, stop:function $$JSSMS$$$$stop$() {
  $DEBUG$$ && clearInterval(this.$j$);
  this.$isRunning$ = !1;
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  this.$isRunning$ && ($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$(this.$cpu$), this.$fpsFrameCount$++, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen));
}, $nextStep$:function $$JSSMS$$$$$nextStep$$() {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$(this.$cpu$);
}, $loadROM$:function $$JSSMS$$$$$loadROM$$($data$$33$$, $size$$12$$) {
  0 !== $size$$12$$ % 1024 && ($data$$33$$ = $data$$33$$.substr(512), $size$$12$$ -= 512);
  var $i$$4$$, $j$$, $number_of_pages$$ = Math.round($size$$12$$ / 16384), $pages$$1$$ = Array($number_of_pages$$);
  for ($i$$4$$ = 0;$i$$4$$ < $number_of_pages$$;$i$$4$$++) {
    if ($pages$$1$$[$i$$4$$] = $JSSMS$Utils$Array$$(16384), $SUPPORT_DATAVIEW$$) {
      for ($j$$ = 0;16384 > $j$$;$j$$++) {
        $pages$$1$$[$i$$4$$].setUint8($j$$, $data$$33$$.charCodeAt(16384 * $i$$4$$ + $j$$));
      }
    } else {
      for ($j$$ = 0;16384 > $j$$;$j$$++) {
        $pages$$1$$[$i$$4$$][$j$$] = $data$$33$$.charCodeAt(16384 * $i$$4$$ + $j$$) & 255;
      }
    }
  }
  return $pages$$1$$;
}};
function $JSCompiler_StaticMethods_readRomDirectly$$($JSCompiler_StaticMethods_readRomDirectly$self$$, $data$$32$$, $fileName$$) {
  var $mode$$11_pages$$;
  $mode$$11_pages$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$ = $data$$32$$.length;
  1 == $mode$$11_pages$$ ? ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = !0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = !1, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$J$ = 0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$O$ = 32, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuWidth$ = 256, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuHeight$ = 192) : 2 == $mode$$11_pages$$ && ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = 
  !0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = !1, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$J$ = 5, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$O$ = 27, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuWidth$ = 160, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuHeight$ = 144);
  if (16384 >= $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$) {
    return!1;
  }
  $mode$$11_pages$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$loadROM$($data$$32$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$);
  if (null === $mode$$11_pages$$) {
    return!1;
  }
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$cpu$, $i$$inline_43$$ = 0;
  $mode$$11_pages$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$rom$ = $mode$$11_pages$$);
  if ($JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$N$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$N$ - 1;
    for ($i$$inline_43$$ = 0;3 > $i$$inline_43$$;$i$$inline_43$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$frameReg$[$i$$inline_43$$] = $i$$inline_43$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$N$;
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$frameReg$[3] = 0;
    if ($ENABLE_COMPILER$$) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$branches$ = Array($JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$N$);
      for ($i$$inline_43$$ = 0;$i$$inline_43$$ < $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$N$;$i$$inline_43$$++) {
        $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$branches$[$i$$inline_43$$] = Object.create(null);
      }
      $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$R$.$g$($JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$rom$);
    }
  } else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$N$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_41_size$$11$$.$romPageMask$ = 0;
  }
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romData$ = $data$$32$$;
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romFileName$ = $fileName$$;
  return!0;
}
;"console" in window ? "bind" in window.console.log || (window.console.log = function($fn$$inline_58$$) {
  return function($msg$$inline_59$$) {
    return $fn$$inline_58$$($msg$$inline_59$$);
  };
}(window.console.log), window.console.error = function($fn$$inline_60$$) {
  return function($msg$$inline_61$$) {
    return $fn$$inline_60$$($msg$$inline_61$$);
  };
}(window.console.error)) : window.console = {log:function $window$console$log$() {
}, error:function $window$console$error$() {
}};
var $JSSMS$Utils$Uint8Array$$ = $SUPPORT_TYPED_ARRAYS$$ ? Uint8Array : Array, $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  return new DataView(new ArrayBuffer($length$$12$$));
} : Array, $JSSMS$Utils$console$log$$ = $DEBUG$$ ? window.console.log.bind(window.console) : function() {
}, $JSSMS$Utils$console$error$$ = $DEBUG$$ ? window.console.error.bind(window.console) : function() {
}, $JSSMS$Utils$console$time$$ = $DEBUG$$ && window.console.time ? window.console.time.bind(window.console) : function() {
}, $JSSMS$Utils$console$timeEnd$$ = $DEBUG$$ && window.console.timeEnd ? window.console.timeEnd.bind(window.console) : function() {
};
function $JSSMS$Utils$traverse$$($object$$, $fn$$2$$) {
  var $key$$17$$, $child$$1$$;
  $fn$$2$$.call(null, $object$$);
  for ($key$$17$$ in $object$$) {
    $object$$.hasOwnProperty($key$$17$$) && ($child$$1$$ = $object$$[$key$$17$$], Object($child$$1$$) === $child$$1$$ && ($object$$[$key$$17$$] = $JSSMS$Utils$traverse$$($child$$1$$, $fn$$2$$)));
  }
  return $object$$;
}
var $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? window.performance.now.bind(window.performance) : function() {
  return(new Date).getTime();
};
function $JSSMS$Utils$toHex$$($dec_hex$$) {
  $dec_hex$$ = $dec_hex$$.toString(16).toUpperCase();
  $dec_hex$$.length % 2 && ($dec_hex$$ = "0" + $dec_hex$$);
  return "0x" + $dec_hex$$;
}
function $JSSMS$Utils$getPrefix$$($arr$$16$$, $obj$$35$$) {
  var $prefix$$2$$ = !1;
  void 0 === $obj$$35$$ && ($obj$$35$$ = document);
  $arr$$16$$.some(function($prop$$4$$) {
    return $prop$$4$$ in $obj$$35$$ ? ($prefix$$2$$ = $prop$$4$$, !0) : !1;
  });
  return $prefix$$2$$;
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
function $JSSMS$Z80$$($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$) {
  this.$main$ = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;
  this.$vdp$ = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$.$vdp$;
  this.$w$ = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$.$i$;
  this.$T$ = this.$n$ = this.$f$ = 0;
  this.$J$ = this.$S$ = this.$Q$ = this.$M$ = this.$K$ = !1;
  this.$o$ = this.$da$ = this.$g$ = this.$W$ = this.$r$ = this.$v$ = this.$s$ = this.$t$ = this.$q$ = this.$fa$ = this.$ea$ = this.$l$ = this.$h$ = this.$ca$ = this.$ba$ = this.$e$ = this.$d$ = this.$aa$ = this.$Z$ = this.$c$ = this.$b$ = this.$Y$ = this.$a$ = this.$U$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$N$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$ga$ = Array(2048);
  this.$X$ = Array(256);
  this.$m$ = Array(256);
  this.$P$ = Array(256);
  this.$O$ = Array(256);
  this.$G$ = Array(131072);
  this.$F$ = Array(131072);
  this.$V$ = Array(256);
  var $c$$inline_80_padc$$inline_71_sf$$inline_65$$, $h$$inline_81_psub$$inline_72_zf$$inline_66$$, $n$$inline_82_psbc$$inline_73_yf$$inline_67$$, $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$, $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$, $flags$$inline_317_newval$$inline_76$$;
  for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;256 > $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++) {
    $c$$inline_80_padc$$inline_71_sf$$inline_65$$ = 0 !== ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ & 128) ? 128 : 0, $h$$inline_81_psub$$inline_72_zf$$inline_66$$ = 0 === $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ ? 64 : 0, $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ & 32, $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ & 
    8, $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$) ? 4 : 0, this.$X$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = $c$$inline_80_padc$$inline_71_sf$$inline_65$$ | $h$$inline_81_psub$$inline_72_zf$$inline_66$$ | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ | $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$, this.$m$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = 
    $c$$inline_80_padc$$inline_71_sf$$inline_65$$ | $h$$inline_81_psub$$inline_72_zf$$inline_66$$ | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ | $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ | $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$, this.$P$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = $c$$inline_80_padc$$inline_71_sf$$inline_65$$ | $h$$inline_81_psub$$inline_72_zf$$inline_66$$ | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ | $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$, 
    this.$P$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 128 === $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ ? 4 : 0, this.$P$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 0 === ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ & 15) ? 16 : 0, this.$O$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = $c$$inline_80_padc$$inline_71_sf$$inline_65$$ | $h$$inline_81_psub$$inline_72_zf$$inline_66$$ | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ | 
    $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ | 2, this.$O$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 127 === $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ ? 4 : 0, this.$O$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 15 === ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ & 15) ? 16 : 0, this.$V$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = 0 !== $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ ? 
    $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ & 128 : 68, this.$V$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = this.$V$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ | $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ | 16;
  }
  $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;
  $c$$inline_80_padc$$inline_71_sf$$inline_65$$ = 65536;
  $h$$inline_81_psub$$inline_72_zf$$inline_66$$ = 0;
  $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ = 65536;
  for ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ = 0;256 > $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$;$JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$++) {
    for ($flags$$inline_317_newval$$inline_76$$ = 0;256 > $flags$$inline_317_newval$$inline_76$$;$flags$$inline_317_newval$$inline_76$$++) {
      $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ = $flags$$inline_317_newval$$inline_76$$ - $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$, this.$G$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = 0 !== $flags$$inline_317_newval$$inline_76$$ ? 0 !== ($flags$$inline_317_newval$$inline_76$$ & 128) ? 128 : 0 : 64, this.$G$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= $flags$$inline_317_newval$$inline_76$$ & 40, ($flags$$inline_317_newval$$inline_76$$ & 
      15) < ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ & 15) && (this.$G$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 16), $flags$$inline_317_newval$$inline_76$$ < $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ && (this.$G$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 1), 0 !== (($JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ ^ $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ ^ 128) & ($JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ ^ 
      $flags$$inline_317_newval$$inline_76$$) & 128) && (this.$G$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] |= 4), $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++, $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ = $flags$$inline_317_newval$$inline_76$$ - $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ - 1, this.$G$[$c$$inline_80_padc$$inline_71_sf$$inline_65$$] = 0 !== $flags$$inline_317_newval$$inline_76$$ ? 0 !== ($flags$$inline_317_newval$$inline_76$$ & 
      128) ? 128 : 0 : 64, this.$G$[$c$$inline_80_padc$$inline_71_sf$$inline_65$$] |= $flags$$inline_317_newval$$inline_76$$ & 40, ($flags$$inline_317_newval$$inline_76$$ & 15) <= ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ & 15) && (this.$G$[$c$$inline_80_padc$$inline_71_sf$$inline_65$$] |= 16), $flags$$inline_317_newval$$inline_76$$ <= $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ && (this.$G$[$c$$inline_80_padc$$inline_71_sf$$inline_65$$] |= 1), 0 !== (($JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ ^ 
      $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ ^ 128) & ($JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ ^ $flags$$inline_317_newval$$inline_76$$) & 128) && (this.$G$[$c$$inline_80_padc$$inline_71_sf$$inline_65$$] |= 4), $c$$inline_80_padc$$inline_71_sf$$inline_65$$++, $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ = $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ - $flags$$inline_317_newval$$inline_76$$, this.$F$[$h$$inline_81_psub$$inline_72_zf$$inline_66$$] = 
      0 !== $flags$$inline_317_newval$$inline_76$$ ? 0 !== ($flags$$inline_317_newval$$inline_76$$ & 128) ? 130 : 2 : 66, this.$F$[$h$$inline_81_psub$$inline_72_zf$$inline_66$$] |= $flags$$inline_317_newval$$inline_76$$ & 40, ($flags$$inline_317_newval$$inline_76$$ & 15) > ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ & 15) && (this.$F$[$h$$inline_81_psub$$inline_72_zf$$inline_66$$] |= 16), $flags$$inline_317_newval$$inline_76$$ > $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ && 
      (this.$F$[$h$$inline_81_psub$$inline_72_zf$$inline_66$$] |= 1), 0 !== (($JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ ^ $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$) & ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ ^ $flags$$inline_317_newval$$inline_76$$) & 128) && (this.$F$[$h$$inline_81_psub$$inline_72_zf$$inline_66$$] |= 4), $h$$inline_81_psub$$inline_72_zf$$inline_66$$++, $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ = $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ - 
      $flags$$inline_317_newval$$inline_76$$ - 1, this.$F$[$n$$inline_82_psbc$$inline_73_yf$$inline_67$$] = 0 !== $flags$$inline_317_newval$$inline_76$$ ? 0 !== ($flags$$inline_317_newval$$inline_76$$ & 128) ? 130 : 2 : 66, this.$F$[$n$$inline_82_psbc$$inline_73_yf$$inline_67$$] |= $flags$$inline_317_newval$$inline_76$$ & 40, ($flags$$inline_317_newval$$inline_76$$ & 15) >= ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ & 15) && (this.$F$[$n$$inline_82_psbc$$inline_73_yf$$inline_67$$] |= 
      16), $flags$$inline_317_newval$$inline_76$$ >= $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ && (this.$F$[$n$$inline_82_psbc$$inline_73_yf$$inline_67$$] |= 1), 0 !== (($JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ ^ $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$) & ($JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ ^ $flags$$inline_317_newval$$inline_76$$) & 128) && (this.$F$[$n$$inline_82_psbc$$inline_73_yf$$inline_67$$] |= 4), $n$$inline_82_psbc$$inline_73_yf$$inline_67$$++
      ;
    }
  }
  for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 256;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$--;) {
    for ($c$$inline_80_padc$$inline_71_sf$$inline_65$$ = 0;1 >= $c$$inline_80_padc$$inline_71_sf$$inline_65$$;$c$$inline_80_padc$$inline_71_sf$$inline_65$$++) {
      for ($h$$inline_81_psub$$inline_72_zf$$inline_66$$ = 0;1 >= $h$$inline_81_psub$$inline_72_zf$$inline_66$$;$h$$inline_81_psub$$inline_72_zf$$inline_66$$++) {
        for ($n$$inline_82_psbc$$inline_73_yf$$inline_67$$ = 0;1 >= $n$$inline_82_psbc$$inline_73_yf$$inline_67$$;$n$$inline_82_psbc$$inline_73_yf$$inline_67$$++) {
          $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$ = this.$ga$;
          $JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$ = $c$$inline_80_padc$$inline_71_sf$$inline_65$$ << 8 | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ << 9 | $h$$inline_81_psub$$inline_72_zf$$inline_66$$ << 10 | $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;
          $flags$$inline_317_newval$$inline_76$$ = $c$$inline_80_padc$$inline_71_sf$$inline_65$$ | $n$$inline_82_psbc$$inline_73_yf$$inline_67$$ << 1 | $h$$inline_81_psub$$inline_72_zf$$inline_66$$ << 4;
          this.$a$ = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;
          this.$g$ = $flags$$inline_317_newval$$inline_76$$;
          var $a_copy$$inline_318$$ = this.$a$, $correction$$inline_319$$ = 0, $carry$$inline_320$$ = $flags$$inline_317_newval$$inline_76$$ & 1, $carry_copy$$inline_321$$ = $carry$$inline_320$$;
          if (0 !== ($flags$$inline_317_newval$$inline_76$$ & 16) || 9 < ($a_copy$$inline_318$$ & 15)) {
            $correction$$inline_319$$ |= 6;
          }
          if (1 == $carry$$inline_320$$ || 159 < $a_copy$$inline_318$$ || 143 < $a_copy$$inline_318$$ && 9 < ($a_copy$$inline_318$$ & 15)) {
            $correction$$inline_319$$ |= 96, $carry_copy$$inline_321$$ = 1;
          }
          153 < $a_copy$$inline_318$$ && ($carry_copy$$inline_321$$ = 1);
          0 !== ($flags$$inline_317_newval$$inline_76$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_319$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_319$$);
          $flags$$inline_317_newval$$inline_76$$ = this.$g$ & 254 | $carry_copy$$inline_321$$;
          $flags$$inline_317_newval$$inline_76$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_317_newval$$inline_76$$ & 251 | 4 : $flags$$inline_317_newval$$inline_76$$ & 251;
          $JSCompiler_temp_const$$313_val$$inline_74_xf$$inline_68$$[$JSCompiler_temp_const$$312_oldval$$inline_75_pf$$inline_69$$] = this.$a$ | $flags$$inline_317_newval$$inline_76$$ << 8;
        }
      }
    }
  }
  this.$a$ = this.$g$ = 0;
  if ($SUPPORT_DATAVIEW$$) {
    for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;8192 > $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$, 0);
    }
  } else {
    for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;8192 > $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++) {
      this.$memWriteMap$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = 0;
    }
  }
  if ($SUPPORT_DATAVIEW$$) {
    for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;32768 > $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++) {
      this.$sram$.setUint8($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$, 0);
    }
  } else {
    for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;32768 > $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++) {
      this.$sram$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = 0;
    }
  }
  this.$N$ = 2;
  for ($i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ = 0;4 > $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$;$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$++) {
    this.$frameReg$[$i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$] = $i$$inline_64_i$$inline_79_i$$inline_85_padd$$inline_70_sms$$ % 3;
  }
  for (var $method$$3$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$3$$] = $JSSMS$Debugger$$.prototype[$method$$3$$];
  }
  $ENABLE_COMPILER$$ && (this.$R$ = new $Recompiler$$(this));
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$f$ = this.$da$ = this.$g$ = this.$W$ = this.$r$ = this.$s$ = this.$v$ = this.$q$ = this.$t$ = this.$h$ = this.$l$ = this.$ea$ = this.$fa$ = this.$d$ = this.$e$ = this.$ba$ = this.$ca$ = this.$b$ = this.$c$ = this.$Z$ = this.$aa$ = this.$a$ = this.$Y$ = 0;
  this.$n$ = 57328;
  this.$T$ = this.$o$ = 0;
  this.$S$ = this.$M$ = this.$K$ = !1;
  this.$U$ = 0;
  this.$Q$ = !1;
  $ENABLE_COMPILER$$ && this.$R$.reset();
}, $branches$:[Object.create(null), Object.create(null), Object.create(null)], call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? (this.push(this.$f$ + 2), this.$f$ = this.$p$(this.$f$), this.$o$ -= 7) : this.$f$ += 2;
}, push:function $$JSSMS$Z80$$$$push$($value$$47$$) {
  this.$n$ -= 2;
  this.$I$(this.$n$, $value$$47$$);
}, $j$:$SUPPORT_DATAVIEW$$ ? function writeMem($address$$, $value$$74$$) {
  65535 >= $address$$ ? (this.$memWriteMap$.setUint8($address$$ & 8191, $value$$74$$), 65532 === $address$$ ? this.$frameReg$[3] = $value$$74$$ : 65533 === $address$$ ? this.$frameReg$[0] = $value$$74$$ & this.$romPageMask$ : 65534 === $address$$ ? this.$frameReg$[1] = $value$$74$$ & this.$romPageMask$ : 65535 === $address$$ && (this.$frameReg$[2] = $value$$74$$ & this.$romPageMask$)) : $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$));
} : function writeMem$$1($address$$1$$, $value$$75$$) {
  65535 >= $address$$1$$ ? (this.$memWriteMap$[$address$$1$$ & 8191] = $value$$75$$, 65532 === $address$$1$$ ? this.$frameReg$[3] = $value$$75$$ : 65533 === $address$$1$$ ? this.$frameReg$[0] = $value$$75$$ & this.$romPageMask$ : 65534 === $address$$1$$ ? this.$frameReg$[1] = $value$$75$$ & this.$romPageMask$ : 65535 === $address$$1$$ && (this.$frameReg$[2] = $value$$75$$ & this.$romPageMask$)) : $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$1$$));
}, $I$:$SUPPORT_DATAVIEW$$ ? function writeMemWord($address$$2$$, $value$$76$$) {
  65532 > $address$$2$$ ? this.$memWriteMap$.setUint16($address$$2$$ & 8191, $value$$76$$, !0) : 65532 === $address$$2$$ ? (this.$frameReg$[3] = $value$$76$$ & 255, this.$frameReg$[0] = $value$$76$$ >> 8 & this.$romPageMask$) : 65533 === $address$$2$$ ? (this.$frameReg$[0] = $value$$76$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$76$$ >> 8 & this.$romPageMask$) : 65534 === $address$$2$$ ? (this.$frameReg$[1] = $value$$76$$ & 255 & this.$romPageMask$, this.$frameReg$[2] = $value$$76$$ >> 
  8 & this.$romPageMask$) : $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$2$$));
} : function writeMemWord$$1($address$$3$$, $value$$77$$) {
  65532 > $address$$3$$ ? ($address$$3$$ &= 8191, this.$memWriteMap$[$address$$3$$++] = $value$$77$$ & 255, this.$memWriteMap$[$address$$3$$] = $value$$77$$ >> 8) : 65532 === $address$$3$$ ? (this.$frameReg$[3] = $value$$77$$ & 255, this.$frameReg$[0] = $value$$77$$ >> 8 & this.$romPageMask$) : 65533 === $address$$3$$ ? (this.$frameReg$[0] = $value$$77$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$77$$ >> 8 & this.$romPageMask$) : 65534 === $address$$3$$ ? (this.$frameReg$[1] = $value$$77$$ & 
  255 & this.$romPageMask$, this.$frameReg$[2] = $value$$77$$ >> 8 & this.$romPageMask$) : $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$3$$));
}, $i$:$SUPPORT_DATAVIEW$$ ? function readMem($address$$4$$) {
  if (1024 > $address$$4$$) {
    return this.$rom$[0].getUint8($address$$4$$);
  }
  if (16384 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[0]].getUint8($address$$4$$);
  }
  if (32768 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[1]].getUint8($address$$4$$ - 16384);
  }
  if (49152 > $address$$4$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$4$$ - 32768) : 12 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$4$$ - 16384) : this.$rom$[this.$frameReg$[2]].getUint8($address$$4$$ - 32768);
  }
  if (57344 > $address$$4$$) {
    return this.$memWriteMap$.getUint8($address$$4$$ - 49152);
  }
  if (65532 > $address$$4$$) {
    return this.$memWriteMap$.getUint8($address$$4$$ - 57344);
  }
  if (65532 === $address$$4$$) {
    return this.$frameReg$[3];
  }
  if (65533 === $address$$4$$) {
    return this.$frameReg$[0];
  }
  if (65534 === $address$$4$$) {
    return this.$frameReg$[1];
  }
  if (65535 === $address$$4$$) {
    return this.$frameReg$[2];
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$4$$));
  return 0;
} : function readMem$$1($address$$5$$) {
  if (1024 > $address$$5$$) {
    return this.$rom$[0][$address$$5$$];
  }
  if (16384 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[0]][$address$$5$$];
  }
  if (32768 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[1]][$address$$5$$ - 16384];
  }
  if (49152 > $address$$5$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 16384] : this.$rom$[this.$frameReg$[2]][$address$$5$$ - 32768];
  }
  if (57344 > $address$$5$$) {
    return this.$memWriteMap$[$address$$5$$ - 49152];
  }
  if (65532 > $address$$5$$) {
    return this.$memWriteMap$[$address$$5$$ - 57344];
  }
  if (65532 === $address$$5$$) {
    return this.$frameReg$[3];
  }
  if (65533 === $address$$5$$) {
    return this.$frameReg$[0];
  }
  if (65534 === $address$$5$$) {
    return this.$frameReg$[1];
  }
  if (65535 === $address$$5$$) {
    return this.$frameReg$[2];
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$5$$));
  return 0;
}, $p$:$SUPPORT_DATAVIEW$$ ? function readMemWord($address$$6$$) {
  if (1024 > $address$$6$$) {
    return this.$rom$[0].getUint16($address$$6$$, !0);
  }
  if (16384 > $address$$6$$) {
    return this.$rom$[this.$frameReg$[0]].getUint16($address$$6$$, !0);
  }
  if (32768 > $address$$6$$) {
    return this.$rom$[this.$frameReg$[1]].getUint16($address$$6$$ - 16384, !0);
  }
  if (49152 > $address$$6$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$6$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$6$$ - 16384] : this.$rom$[this.$frameReg$[2]].getUint16($address$$6$$ - 32768, !0);
  }
  if (57344 > $address$$6$$) {
    return this.$memWriteMap$.getUint16($address$$6$$ - 49152, !0);
  }
  if (65532 > $address$$6$$) {
    return this.$memWriteMap$.getUint16($address$$6$$ - 57344, !0);
  }
  if (65532 === $address$$6$$) {
    return this.$frameReg$[3];
  }
  if (65533 === $address$$6$$) {
    return this.$frameReg$[0];
  }
  if (65534 === $address$$6$$) {
    return this.$frameReg$[1];
  }
  if (65535 === $address$$6$$) {
    return this.$frameReg$[2];
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$6$$));
  return 0;
} : function readMemWord$$1($address$$7$$) {
  if (1024 > $address$$7$$) {
    return this.$rom$[0][$address$$7$$++] | this.$rom$[0][$address$$7$$] << 8;
  }
  if (16384 > $address$$7$$) {
    return this.$rom$[this.$frameReg$[0]][$address$$7$$++] | this.$rom$[this.$frameReg$[0]][$address$$7$$] << 8;
  }
  if (32768 > $address$$7$$) {
    return this.$rom$[this.$frameReg$[1]][$address$$7$$++ - 16384] | this.$rom$[this.$frameReg$[1]][$address$$7$$ - 16384] << 8;
  }
  if (49152 > $address$$7$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$7$$++ - 32768] | this.$sram$[$address$$7$$ - 32768] << 8 : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$7$$++ - 16384] | this.$sram$[$address$$7$$ - 16384] << 8 : this.$rom$[this.$frameReg$[2]][$address$$7$$++ - 32768] | this.$rom$[this.$frameReg$[2]][$address$$7$$ - 32768] << 8;
  }
  if (57344 > $address$$7$$) {
    return this.$memWriteMap$[$address$$7$$++ - 49152] | this.$memWriteMap$[$address$$7$$ - 49152] << 8;
  }
  if (65532 > $address$$7$$) {
    return this.$memWriteMap$[$address$$7$$++ - 57344] | this.$memWriteMap$[$address$$7$$ - 57344] << 8;
  }
  if (65532 === $address$$7$$) {
    return this.$frameReg$[3];
  }
  if (65533 === $address$$7$$) {
    return this.$frameReg$[0];
  }
  if (65534 === $address$$7$$) {
    return this.$frameReg$[1];
  }
  if (65535 === $address$$7$$) {
    return this.$frameReg$[2];
  }
  $JSSMS$Utils$console$error$$($JSSMS$Utils$toHex$$($address$$7$$));
  return 0;
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$i$($JSCompiler_StaticMethods_d_$self$$.$f$);
}
function $JSCompiler_StaticMethods_getParity$$($value$$73$$) {
  var $parity$$ = !0, $j$$1$$;
  for ($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 !== ($value$$73$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$);
  }
  return $parity$$;
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$72$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$3$$ = $hl$$1$$ - $value$$72$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$g$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$g$ = ($hl$$1$$ ^ $result$$3$$ ^ $value$$72$$) >> 8 & 16 | 2 | $result$$3$$ >> 16 & 1 | $result$$3$$ >> 8 & 128 | (0 !== ($result$$3$$ & 65535) ? 0 : 64) | (($value$$72$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$3$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$h$ = $result$$3$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$3$$ & 255;
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$71$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$2$$ = $hl$$ + $value$$71$$ + ($JSCompiler_StaticMethods_adc16$self$$.$g$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$g$ = ($hl$$ ^ $result$$2$$ ^ $value$$71$$) >> 8 & 16 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 !== ($result$$2$$ & 65535) ? 0 : 64) | (($value$$71$$ ^ $hl$$ ^ 32768) & ($value$$71$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$h$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$2$$ & 255;
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$70$$) {
  var $result$$1$$ = $reg$$ + $value$$70$$;
  $JSCompiler_StaticMethods_add16$self$$.$g$ = $JSCompiler_StaticMethods_add16$self$$.$g$ & 196 | ($reg$$ ^ $result$$1$$ ^ $value$$70$$) >> 8 & 16 | $result$$1$$ >> 16 & 1;
  return $result$$1$$ & 65535;
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$69$$) {
  $value$$69$$ = $value$$69$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$g$ = $JSCompiler_StaticMethods_dec8$self$$.$g$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$O$[$value$$69$$];
  return $value$$69$$;
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$68$$) {
  $value$$68$$ = $value$$68$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$g$ = $JSCompiler_StaticMethods_inc8$self$$.$g$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$P$[$value$$68$$];
  return $value$$68$$;
}
function $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_decHL$self$$) {
  $JSCompiler_StaticMethods_decHL$self$$.$l$ = $JSCompiler_StaticMethods_decHL$self$$.$l$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decHL$self$$.$l$ && ($JSCompiler_StaticMethods_decHL$self$$.$h$ = $JSCompiler_StaticMethods_decHL$self$$.$h$ - 1 & 255);
}
function $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_decDE$self$$) {
  $JSCompiler_StaticMethods_decDE$self$$.$e$ = $JSCompiler_StaticMethods_decDE$self$$.$e$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decDE$self$$.$e$ && ($JSCompiler_StaticMethods_decDE$self$$.$d$ = $JSCompiler_StaticMethods_decDE$self$$.$d$ - 1 & 255);
}
function $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_decBC$self$$) {
  $JSCompiler_StaticMethods_decBC$self$$.$c$ = $JSCompiler_StaticMethods_decBC$self$$.$c$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decBC$self$$.$c$ && ($JSCompiler_StaticMethods_decBC$self$$.$b$ = $JSCompiler_StaticMethods_decBC$self$$.$b$ - 1 & 255);
}
function $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_incHL$self$$) {
  $JSCompiler_StaticMethods_incHL$self$$.$l$ = $JSCompiler_StaticMethods_incHL$self$$.$l$ + 1 & 255;
  0 === $JSCompiler_StaticMethods_incHL$self$$.$l$ && ($JSCompiler_StaticMethods_incHL$self$$.$h$ = $JSCompiler_StaticMethods_incHL$self$$.$h$ + 1 & 255);
}
function $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_incDE$self$$) {
  $JSCompiler_StaticMethods_incDE$self$$.$e$ = $JSCompiler_StaticMethods_incDE$self$$.$e$ + 1 & 255;
  0 === $JSCompiler_StaticMethods_incDE$self$$.$e$ && ($JSCompiler_StaticMethods_incDE$self$$.$d$ = $JSCompiler_StaticMethods_incDE$self$$.$d$ + 1 & 255);
}
function $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_setIYHIYL$self$$, $value$$67$$) {
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$v$ = $value$$67$$ >> 8;
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$s$ = $value$$67$$ & 255;
}
function $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_setIXHIXL$self$$, $value$$66$$) {
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$t$ = $value$$66$$ >> 8;
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$q$ = $value$$66$$ & 255;
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$64$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$h$ = $value$$64$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$64$$ & 255;
}
function $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_getIYHIYL$self$$) {
  return $JSCompiler_StaticMethods_getIYHIYL$self$$.$v$ << 8 | $JSCompiler_StaticMethods_getIYHIYL$self$$.$s$;
}
function $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_getIXHIXL$self$$) {
  return $JSCompiler_StaticMethods_getIXHIXL$self$$.$t$ << 8 | $JSCompiler_StaticMethods_getIXHIXL$self$$.$q$;
}
function $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_getHL$self$$) {
  return $JSCompiler_StaticMethods_getHL$self$$.$h$ << 8 | $JSCompiler_StaticMethods_getHL$self$$.$l$;
}
function $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_getDE$self$$) {
  return $JSCompiler_StaticMethods_getDE$self$$.$d$ << 8 | $JSCompiler_StaticMethods_getDE$self$$.$e$;
}
function $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_getBC$self$$) {
  return $JSCompiler_StaticMethods_getBC$self$$.$b$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$c$;
}
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$61$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$g$ = $JSCompiler_StaticMethods_cp_a$self$$.$F$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$61$$ & 255];
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$60$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$g$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$60$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$g$ = $JSCompiler_StaticMethods_sbc_a$self$$.$F$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$;
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$59$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$59$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$g$ = $JSCompiler_StaticMethods_sub_a$self$$.$F$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$;
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$58$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$g$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$58$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$g$ = $JSCompiler_StaticMethods_adc_a$self$$.$G$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$;
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$57$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$57$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$g$ = $JSCompiler_StaticMethods_add_a$self$$.$G$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$;
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$46$$) {
  var $location$$21$$ = $index$$46$$ + $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($JSCompiler_StaticMethods_doIndexCB$self$$.$f$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$i$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$o$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
  switch($opcode$$4$$) {
    case 0:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 1:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 2:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 3:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 4:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 5:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 7:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 8:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 9:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 10:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 11:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 12:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 13:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 15:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 16:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 17:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 18:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 19:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 20:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 21:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 23:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 24:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 25:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 26:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 27:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 28:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 29:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 31:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 32:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 33:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 34:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 35:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 36:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 37:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 39:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 40:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 41:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 42:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 43:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 44:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 45:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 47:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 48:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 49:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 50:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 51:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 52:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 53:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 55:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 56:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 57:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 58:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
      break;
    case 59:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$e$);
      break;
    case 60:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 61:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$)));
      break;
    case 63:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 1);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 2);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 4);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 8);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 16);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 32);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 64);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & 128);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -3);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -5);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -9);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -17);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -33);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -65);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) & -129);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 1);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 4);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 8);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 16);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 32);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 64);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$($location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($location$$21$$) | 128);
      break;
    default:
      $JSSMS$Utils$console$log$$("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$4$$));
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$f$++;
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$g$ = $JSCompiler_StaticMethods_bit$self$$.$g$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$V$[$mask$$5$$];
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$55$$) {
  var $carry$$7$$ = $value$$55$$ & 1;
  $value$$55$$ = $value$$55$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$g$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$m$[$value$$55$$];
  return $value$$55$$;
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$54$$) {
  var $carry$$6$$ = $value$$54$$ & 1;
  $value$$54$$ = $value$$54$$ >> 1 | $value$$54$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$g$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$m$[$value$$54$$];
  return $value$$54$$;
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$53$$) {
  var $carry$$5$$ = ($value$$53$$ & 128) >> 7;
  $value$$53$$ = ($value$$53$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$g$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$m$[$value$$53$$];
  return $value$$53$$;
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$52$$) {
  var $carry$$4$$ = ($value$$52$$ & 128) >> 7;
  $value$$52$$ = $value$$52$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$g$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$m$[$value$$52$$];
  return $value$$52$$;
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$51$$) {
  var $carry$$3$$ = $value$$51$$ & 1;
  $value$$51$$ = ($value$$51$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$g$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$g$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$m$[$value$$51$$];
  return $value$$51$$;
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$50$$) {
  var $carry$$2$$ = ($value$$50$$ & 128) >> 7;
  $value$$50$$ = ($value$$50$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$g$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$g$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$m$[$value$$50$$];
  return $value$$50$$;
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$49$$) {
  var $carry$$1$$ = $value$$49$$ & 1;
  $value$$49$$ = ($value$$49$$ >> 1 | $value$$49$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$g$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$m$[$value$$49$$];
  return $value$$49$$;
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$48$$) {
  var $carry$$ = ($value$$48$$ & 128) >> 7;
  $value$$48$$ = ($value$$48$$ << 1 | $value$$48$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$g$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$m$[$value$$48$$];
  return $value$$48$$;
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$16$$) {
  $JSCompiler_StaticMethods_decMem$self$$.$j$($offset$$16$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$i$($offset$$16$$)));
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$j$($offset$$15$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$i$($offset$$15$$)));
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$f$ = $JSCompiler_StaticMethods_ret$self$$.$p$($JSCompiler_StaticMethods_ret$self$$.$n$), $JSCompiler_StaticMethods_ret$self$$.$n$ += 2, $JSCompiler_StaticMethods_ret$self$$.$o$ -= 6);
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$;
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$f$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$o$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$f$++;
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$f$ = $JSCompiler_StaticMethods_jp$self$$.$p$($JSCompiler_StaticMethods_jp$self$$.$f$) : $JSCompiler_StaticMethods_jp$self$$.$f$ += 2;
}
function $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_interrupt$self$$) {
  $JSCompiler_StaticMethods_interrupt$self$$.$K$ && !$JSCompiler_StaticMethods_interrupt$self$$.$S$ && ($JSCompiler_StaticMethods_interrupt$self$$.$Q$ && ($JSCompiler_StaticMethods_interrupt$self$$.$f$++, $JSCompiler_StaticMethods_interrupt$self$$.$Q$ = !1), $JSCompiler_StaticMethods_interrupt$self$$.$K$ = $JSCompiler_StaticMethods_interrupt$self$$.$M$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.$J$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.push($JSCompiler_StaticMethods_interrupt$self$$.$f$), 
  0 === $JSCompiler_StaticMethods_interrupt$self$$.$T$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 0 === $JSCompiler_StaticMethods_interrupt$self$$.$U$ || 255 === $JSCompiler_StaticMethods_interrupt$self$$.$U$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$U$, $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$.$T$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 
  $JSCompiler_StaticMethods_interrupt$self$$.$p$(($JSCompiler_StaticMethods_interrupt$self$$.$W$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$U$), $JSCompiler_StaticMethods_interrupt$self$$.$o$ -= 19));
}
function $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_interpret$self$$) {
  var $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = 0, $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = 
  $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
  $JSCompiler_StaticMethods_interpret$self$$.$S$ = !1;
  $JSCompiler_StaticMethods_interpret$self$$.$o$ -= $OP_STATES$$[$carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$];
  switch($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$) {
    case 1:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 2:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 3:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$c$ + 1 & 255;
      0 === $JSCompiler_StaticMethods_interpret$self$$.$c$ && ($JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$b$ + 1 & 255);
      break;
    case 4:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 5:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 6:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 7:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 7;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ << 1 & 255 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 8:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$Y$;
      $JSCompiler_StaticMethods_interpret$self$$.$Y$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$da$;
      $JSCompiler_StaticMethods_interpret$self$$.$da$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 9:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 10:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 11:
      $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 12:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 13:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 14:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 15:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 1 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ << 7;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 16:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$b$ - 1 & 255;
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 17:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 18:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 19:
      $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 20:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 21:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 22:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 23:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 7;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = ($JSCompiler_StaticMethods_interpret$self$$.$a$ << 1 | $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 24:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$) + 1);
      break;
    case 25:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 26:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 27:
      $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 28:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 29:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 30:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 31:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = ($JSCompiler_StaticMethods_interpret$self$$.$a$ >> 1 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) << 7) & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 32:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 33:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 34:
      $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 35:
      $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 36:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 37:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 38:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 39:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$ga$[$JSCompiler_StaticMethods_interpret$self$$.$a$ | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 
      1) << 8 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 2) << 8 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 16) << 6];
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 2 | $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
      break;
    case 40:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 41:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 42:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 43:
      $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 44:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 45:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 46:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 47:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ ^= 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 18;
      break;
    case 48:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 49:
      $JSCompiler_StaticMethods_interpret$self$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 50:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 51:
      $JSCompiler_StaticMethods_interpret$self$$.$n$++;
      break;
    case 52:
      $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 53:
      $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 54:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 55:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -3;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17;
      break;
    case 56:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 57:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$n$));
      break;
    case 58:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 59:
      $JSCompiler_StaticMethods_interpret$self$$.$n$--;
      break;
    case 60:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 61:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 62:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 63:
      0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
      $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -3;
      break;
    case 65:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 66:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      break;
    case 67:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      break;
    case 68:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 69:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 70:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 71:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 72:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 74:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      break;
    case 75:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      break;
    case 76:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 77:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 78:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 79:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 80:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 81:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 83:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      break;
    case 84:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 85:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 86:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 87:
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 88:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 89:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 90:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      break;
    case 92:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 93:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 94:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 95:
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 96:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 97:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 98:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      break;
    case 99:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      break;
    case 101:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 102:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 103:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 104:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 105:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 106:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      break;
    case 107:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      break;
    case 108:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 110:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 111:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 112:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 113:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 114:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 115:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 116:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 117:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 118:
      $JSCompiler_StaticMethods_interpret$self$$.$o$ = 0;
      $JSCompiler_StaticMethods_interpret$self$$.$Q$ = !0;
      $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      break;
    case 119:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 120:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 121:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 122:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      break;
    case 123:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      break;
    case 124:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 125:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 126:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 128:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 129:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 130:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 131:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 132:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 133:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 134:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 135:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 136:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 137:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 138:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 139:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 140:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 141:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 142:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 143:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 144:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 145:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 146:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 147:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 148:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 149:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 150:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 151:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 152:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 153:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 154:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 155:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 156:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 157:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 158:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 159:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 160:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$b$] | 16;
      break;
    case 161:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$c$] | 16;
      break;
    case 162:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$d$] | 16;
      break;
    case 163:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$e$] | 16;
      break;
    case 164:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$h$] | 16;
      break;
    case 165:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$l$] | 16;
      break;
    case 166:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
      break;
    case 167:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | 16;
      break;
    case 168:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$b$];
      break;
    case 169:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$c$];
      break;
    case 170:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$d$];
      break;
    case 171:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$e$];
      break;
    case 172:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$h$];
      break;
    case 173:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$l$];
      break;
    case 174:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))];
      break;
    case 175:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ = 0];
      break;
    case 176:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$b$];
      break;
    case 177:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$c$];
      break;
    case 178:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$d$];
      break;
    case 179:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$e$];
      break;
    case 180:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$h$];
      break;
    case 181:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$l$];
      break;
    case 182:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))];
      break;
    case 183:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
      break;
    case 184:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 185:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 186:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
      break;
    case 187:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
      break;
    case 188:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 189:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 190:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 191:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 192:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 193:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$);
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
      break;
    case 194:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 195:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$);
      break;
    case 196:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 197:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 198:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 199:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 0;
      break;
    case 200:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 201:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$);
      $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
      break;
    case 202:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 203:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$o$ -= $OP_CB_STATES$$[$carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$];
      switch($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$) {
        case 0:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 1:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 2:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 3:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 4:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 5:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 6:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 7:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 8:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 9:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 10:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 11:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 12:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 13:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 14:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 15:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 16:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 17:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 18:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 19:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 20:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 21:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 22:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 23:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 24:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 25:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 26:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 27:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 28:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 29:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 30:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 31:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 32:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 33:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 39:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 40:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 41:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 42:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 47:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 48:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 49:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 50:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 51:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 52:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 53:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 54:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 55:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 56:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 57:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 58:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          break;
        case 59:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          break;
        case 60:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 61:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 62:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
          break;
        case 63:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          break;
        case 64:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 1);
          break;
        case 65:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 1);
          break;
        case 66:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 1);
          break;
        case 67:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 1);
          break;
        case 68:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 1);
          break;
        case 69:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 1);
          break;
        case 70:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 1);
          break;
        case 71:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1);
          break;
        case 72:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 2);
          break;
        case 73:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 2);
          break;
        case 74:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 2);
          break;
        case 75:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 2);
          break;
        case 76:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 2);
          break;
        case 77:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 2);
          break;
        case 78:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 2);
          break;
        case 79:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 2);
          break;
        case 80:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 4);
          break;
        case 81:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 4);
          break;
        case 82:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 4);
          break;
        case 83:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 4);
          break;
        case 84:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 4);
          break;
        case 85:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 4);
          break;
        case 86:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 4);
          break;
        case 87:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 4);
          break;
        case 88:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 8);
          break;
        case 89:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 8);
          break;
        case 90:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 8);
          break;
        case 91:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 8);
          break;
        case 92:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 8);
          break;
        case 93:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 8);
          break;
        case 94:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 8);
          break;
        case 95:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 8);
          break;
        case 96:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 16);
          break;
        case 97:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 16);
          break;
        case 98:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 16);
          break;
        case 99:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 16);
          break;
        case 100:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 16);
          break;
        case 101:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 16);
          break;
        case 102:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 16);
          break;
        case 103:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 16);
          break;
        case 104:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 32);
          break;
        case 105:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 32);
          break;
        case 106:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 32);
          break;
        case 107:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 32);
          break;
        case 108:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 32);
          break;
        case 109:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 32);
          break;
        case 110:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 32);
          break;
        case 111:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 32);
          break;
        case 112:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 64);
          break;
        case 113:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 64);
          break;
        case 114:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 64);
          break;
        case 115:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 64);
          break;
        case 116:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 64);
          break;
        case 117:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 64);
          break;
        case 118:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 64);
          break;
        case 119:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 64);
          break;
        case 120:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$ & 128);
          break;
        case 121:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$ & 128);
          break;
        case 122:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$d$ & 128);
          break;
        case 123:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$e$ & 128);
          break;
        case 124:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 128);
          break;
        case 125:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 128);
          break;
        case 126:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 128);
          break;
        case 127:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$ & 128);
          break;
        case 128:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -2;
          break;
        case 129:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -2;
          break;
        case 130:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -2;
          break;
        case 131:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -2;
          break;
        case 132:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -2;
          break;
        case 133:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -2;
          break;
        case 134:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -2);
          break;
        case 135:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -2;
          break;
        case 136:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -3;
          break;
        case 137:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -3;
          break;
        case 138:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -3;
          break;
        case 139:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -3;
          break;
        case 140:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -3;
          break;
        case 141:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -3;
          break;
        case 142:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -3);
          break;
        case 143:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -3;
          break;
        case 144:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -5;
          break;
        case 145:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -5;
          break;
        case 146:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -5;
          break;
        case 147:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -5;
          break;
        case 148:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -5;
          break;
        case 149:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -5;
          break;
        case 150:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -5);
          break;
        case 151:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -5;
          break;
        case 152:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -9;
          break;
        case 153:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -9;
          break;
        case 154:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -9;
          break;
        case 155:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -9;
          break;
        case 156:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -9;
          break;
        case 157:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -9;
          break;
        case 158:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -9);
          break;
        case 159:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -9;
          break;
        case 160:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -17;
          break;
        case 161:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -17;
          break;
        case 162:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -17;
          break;
        case 163:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -17;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -17;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -17;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -17);
          break;
        case 167:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -17;
          break;
        case 168:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -33;
          break;
        case 169:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -33;
          break;
        case 170:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -33;
          break;
        case 171:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -33;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -33;
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -33;
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -33);
          break;
        case 175:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -33;
          break;
        case 176:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -65;
          break;
        case 177:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -65;
          break;
        case 178:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -65;
          break;
        case 179:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -65;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -65;
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -65;
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -65);
          break;
        case 183:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -65;
          break;
        case 184:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ &= -129;
          break;
        case 185:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ &= -129;
          break;
        case 186:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ &= -129;
          break;
        case 187:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ &= -129;
          break;
        case 188:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -129;
          break;
        case 189:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -129;
          break;
        case 190:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -129);
          break;
        case 191:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ &= -129;
          break;
        case 192:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 1;
          break;
        case 193:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 1;
          break;
        case 194:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 1;
          break;
        case 195:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 1;
          break;
        case 196:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 1;
          break;
        case 197:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 1;
          break;
        case 198:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 1);
          break;
        case 199:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 1;
          break;
        case 200:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 2;
          break;
        case 201:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 2;
          break;
        case 202:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 2;
          break;
        case 203:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 2;
          break;
        case 204:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 2;
          break;
        case 205:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 2;
          break;
        case 206:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 2);
          break;
        case 207:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 2;
          break;
        case 208:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 4;
          break;
        case 209:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 4;
          break;
        case 210:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 4;
          break;
        case 211:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 4;
          break;
        case 212:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 4;
          break;
        case 213:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 4;
          break;
        case 214:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 4);
          break;
        case 215:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 4;
          break;
        case 216:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 8;
          break;
        case 217:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 8;
          break;
        case 218:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 8;
          break;
        case 219:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 8;
          break;
        case 220:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 8;
          break;
        case 221:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 8;
          break;
        case 222:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 8);
          break;
        case 223:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 8;
          break;
        case 224:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 16;
          break;
        case 225:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 16;
          break;
        case 226:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 16;
          break;
        case 227:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 16;
          break;
        case 228:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 16;
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 16;
          break;
        case 230:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 16);
          break;
        case 231:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 16;
          break;
        case 232:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 32;
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 32;
          break;
        case 234:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 32;
          break;
        case 235:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 32;
          break;
        case 236:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 32;
          break;
        case 237:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 32;
          break;
        case 238:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 32);
          break;
        case 239:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 32;
          break;
        case 240:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 64;
          break;
        case 241:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 64;
          break;
        case 242:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 64;
          break;
        case 243:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 64;
          break;
        case 244:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 64;
          break;
        case 245:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 64;
          break;
        case 246:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 64);
          break;
        case 247:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 64;
          break;
        case 248:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ |= 128;
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ |= 128;
          break;
        case 250:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ |= 128;
          break;
        case 251:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ |= 128;
          break;
        case 252:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 128;
          break;
        case 253:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 128;
          break;
        case 254:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 128);
          break;
        case 255:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 128;
          break;
        default:
          $JSSMS$Utils$console$log$$("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$));
      }
      break;
    case 204:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 205:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$ + 2);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$);
      break;
    case 206:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 207:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 8;
      break;
    case 208:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 209:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$);
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
      break;
    case 210:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 211:
      $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 212:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 213:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 214:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 215:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 16;
      break;
    case 216:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 217:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$Z$;
      $JSCompiler_StaticMethods_interpret$self$$.$Z$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$aa$;
      $JSCompiler_StaticMethods_interpret$self$$.$aa$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$ba$;
      $JSCompiler_StaticMethods_interpret$self$$.$ba$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$ca$;
      $JSCompiler_StaticMethods_interpret$self$$.$ca$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$ea$;
      $JSCompiler_StaticMethods_interpret$self$$.$ea$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$fa$;
      $JSCompiler_StaticMethods_interpret$self$$.$fa$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 218:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 219:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 220:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 221:
      var $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $temp$$inline_125_temp$$inline_129$$ = 
      0;
      $JSCompiler_StaticMethods_interpret$self$$.$o$ -= $OP_DD_STATES$$[$carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$];
      switch($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$) {
        case 9:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 25:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 33:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$q$ + 1 & 255;
          0 === $JSCompiler_StaticMethods_interpret$self$$.$q$ && ($JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$t$ + 1 & 255);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 41:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$q$ - 1 & 255;
          255 == $JSCompiler_StaticMethods_interpret$self$$.$q$ && ($JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$t$ - 1 & 255);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 52:
          $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 53:
          $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 54:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 57:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$n$));
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$t$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$t$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$t$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$t$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 100:
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$.$t$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$t$;
          break;
        case 109:
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 112:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$d$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$e$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 116:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 117:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 119:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 124:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$t$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$t$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$q$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$t$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$q$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$t$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$q$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$t$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 203:
          $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 225:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$));
          $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
          break;
        case 227:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$));
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$n$, $temp$$inline_125_temp$$inline_129$$);
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$n$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        default:
          $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$)), $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      }
      break;
    case 222:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 223:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 24;
      break;
    case 224:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 225:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$));
      $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
      break;
    case 226:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 227:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$));
      $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$n$, $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$);
      break;
    case 228:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 229:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 230:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++)] | 16;
      break;
    case 231:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 32;
      break;
    case 232:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 233:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 234:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 235:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$;
      break;
    case 236:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 237:
      var $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$), $location$$inline_130$$ = 
      $temp$$inline_125_temp$$inline_129$$ = 0;
      $JSCompiler_StaticMethods_interpret$self$$.$o$ -= $OP_ED_STATES$$[$carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$];
      switch($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$) {
        case 64:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$b$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 65:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 66:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 67:
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
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
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = 0;
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
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
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$);
          $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
          $JSCompiler_StaticMethods_interpret$self$$.$K$ = $JSCompiler_StaticMethods_interpret$self$$.$M$;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$T$ = 0;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 71:
          $JSCompiler_StaticMethods_interpret$self$$.$W$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 72:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$c$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 73:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 74:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 75:
          $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 79:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 80:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$d$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 81:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 82:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 83:
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 86:
        ;
        case 118:
          $JSCompiler_StaticMethods_interpret$self$$.$T$ = 1;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 87:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$W$;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$X$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | ($JSCompiler_StaticMethods_interpret$self$$.$M$ ? 4 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 88:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$e$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 89:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 90:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 91:
          $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 95:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = Math.round(255 * Math.random());
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$X$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | ($JSCompiler_StaticMethods_interpret$self$$.$M$ ? 4 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$h$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 97:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 98:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 103:
          $location$$inline_130$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($location$$inline_130$$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($location$$inline_130$$, $temp$$inline_125_temp$$inline_129$$ >> 4 | ($JSCompiler_StaticMethods_interpret$self$$.$a$ & 15) << 4);
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 240 | $temp$$inline_125_temp$$inline_129$$ & 15;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$l$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 105:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 106:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 107:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 111:
          $location$$inline_130$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($location$$inline_130$$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($location$$inline_130$$, ($temp$$inline_125_temp$$inline_129$$ & 15) << 4 | $JSCompiler_StaticMethods_interpret$self$$.$a$ & 15);
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 240 | $temp$$inline_125_temp$$inline_129$$ >> 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_interpret$self$$.$n$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 120:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 121:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 122:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 123:
          $JSCompiler_StaticMethods_interpret$self$$.$n$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 160:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ = $temp$$inline_125_temp$$inline_129$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_125_temp$$inline_129$$ & 8 | ($temp$$inline_125_temp$$inline_129$$ & 2 ? 32 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 161:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_125_temp$$inline_129$$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 162:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 163:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_125_temp$$inline_129$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 168:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ = $temp$$inline_125_temp$$inline_129$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_125_temp$$inline_129$$ & 8 | ($temp$$inline_125_temp$$inline_129$$ & 2 ? 32 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 169:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_125_temp$$inline_129$$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 170:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 171:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_125_temp$$inline_129$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 176:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ = $temp$$inline_125_temp$$inline_129$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_125_temp$$inline_129$$ & 8 | ($temp$$inline_125_temp$$inline_129$$ & 2 ? 32 : 0);
          0 !== $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 177:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          0 !== ($temp$$inline_125_temp$$inline_129$$ & 4) && 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64) ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_125_temp$$inline_129$$;
          break;
        case 178:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 179:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_125_temp$$inline_129$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 184:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ = $temp$$inline_125_temp$$inline_129$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_125_temp$$inline_129$$ & 8 | ($temp$$inline_125_temp$$inline_129$$ & 2 ? 32 : 0);
          0 !== $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 185:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_125_temp$$inline_129$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          0 !== ($temp$$inline_125_temp$$inline_129$$ & 4) && 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64) ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_125_temp$$inline_129$$;
          break;
        case 186:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 187:
          $temp$$inline_125_temp$$inline_129$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$w$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_125_temp$$inline_129$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$o$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_125_temp$$inline_129$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_125_temp$$inline_129$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        default:
          $JSSMS$Utils$console$log$$("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$)), $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      }
      break;
    case 238:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++)];
      break;
    case 239:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 40;
      break;
    case 240:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 241:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$);
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
      break;
    case 242:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 243:
      $JSCompiler_StaticMethods_interpret$self$$.$K$ = $JSCompiler_StaticMethods_interpret$self$$.$M$ = !1;
      $JSCompiler_StaticMethods_interpret$self$$.$S$ = !0;
      break;
    case 244:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 245:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$a$ << 8 | $JSCompiler_StaticMethods_interpret$self$$.$g$);
      break;
    case 246:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++)];
      break;
    case 247:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 48;
      break;
    case 248:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 249:
      $JSCompiler_StaticMethods_interpret$self$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 250:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 251:
      $JSCompiler_StaticMethods_interpret$self$$.$K$ = $JSCompiler_StaticMethods_interpret$self$$.$M$ = $JSCompiler_StaticMethods_interpret$self$$.$S$ = !0;
      break;
    case 252:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 253:
      $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$o$ -= $OP_DD_STATES$$[$carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$];
      switch($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$) {
        case 9:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 25:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 33:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$s$ + 1 & 255;
          0 === $JSCompiler_StaticMethods_interpret$self$$.$s$ && ($JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$v$ + 1 & 255);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 41:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$s$ - 1 & 255;
          255 == $JSCompiler_StaticMethods_interpret$self$$.$s$ && ($JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$v$ - 1 & 255);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 52:
          $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 53:
          $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 54:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 57:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$n$));
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$v$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$v$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$v$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$v$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 100:
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$.$v$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$v$;
          break;
        case 109:
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 112:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$d$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$e$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 116:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 117:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 119:
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 124:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$v$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$v$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$s$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$v$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$s$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$v$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$s$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$m$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$v$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 203:
          $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 225:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$));
          $JSCompiler_StaticMethods_interpret$self$$.$n$ += 2;
          break;
        case 227:
          $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$($JSCompiler_StaticMethods_interpret$self$$.$n$));
          $JSCompiler_StaticMethods_interpret$self$$.$I$($JSCompiler_StaticMethods_interpret$self$$.$n$, $carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$);
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$n$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        default:
          $JSSMS$Utils$console$log$$("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($carry$$inline_102_carry$$inline_90_carry$$inline_96_carry$$inline_99_opcode_opcode$$inline_112_opcode$$inline_124_opcode$$inline_128_opcode$$inline_136_temp_temp$$inline_105_temp$$inline_115_temp$$inline_118_temp$$inline_121_temp$$inline_137_temp$$inline_93_value$$inline_133_value$$inline_324_value$$inline_327_value$$inline_330_value$$inline_333_value$$inline_340_value$$inline_343$$)), $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      }
      break;
    case 254:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 255:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_interpret$self$$.$f$ = 56;
  }
}
function $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$) {
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$lineno$ = 0;
  $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$cyclesPerLine$;
  for ($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$J$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$);;) {
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$main$.$a$.$updateDisassembly$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$f$);
    if ($ENABLE_COMPILER$$) {
      var $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
      1024 > $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[0][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$] || 
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$R$.$a$($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$, 0, 0), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[0][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$].call($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$, 
      0)) : 16384 > $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[0]][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$] || 
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$R$.$a$($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[0], 
      0), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[0]][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$].call($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$, 
      0)) : 32768 > $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[1]][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ - 
      16384] || $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$R$.$a$($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[1], 
      1), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[1]][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ - 
      16384].call($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$, 1)) : 49152 > $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[2]][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ - 
      32768] || $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$R$.$a$($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[2], 
      2), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$frameReg$[2]][$JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ - 
      32768].call($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$, 2)) : $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$);
    } else {
      $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$);
    }
    if ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$.$o$) {
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$;
      if ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$.$soundEnabled$) {
        var $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$, $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$;
        0 === $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$audioBufferOffset$ = 0);
        for (var $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$samplesPerLine$[$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 
        $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$, $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$audioBufferOffset$, $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = 
        [], $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ = 0, $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 0;$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ < $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$;$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$++) {
          for ($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 0;3 > $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$;$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$p$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$n$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] != 
            $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$f$[($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$n$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] >> 
            8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$f$[($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$]
            ;
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$p$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$f$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$m$ & 
          1) << 1;
          $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$p$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$p$[1] + 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$p$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$p$[3];
          127 < $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ ? $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 127 : -128 > $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ && ($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 
          -128);
          $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ + $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$] = $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$j$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$q$;
          var $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$j$ >> 8, $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ = $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ << 
          8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$j$ -= $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[0] -= $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[1] -= $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[2] -= $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$o$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[2] : 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[3] - $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$;
          for ($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 0;3 > $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$;$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$++) {
            var $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$];
            if (0 >= $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$) {
              var $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$f$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ << 1];
              6 < $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$n$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] = ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ - 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$j$ + 512 * $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] / 
              ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$j$), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] = 
              -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] = 
              1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$n$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] += $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ * ($address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ / 
              $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ + 1);
            } else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$n$[$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$] = $NO_ANTIALIAS$$;
            }
          }
          0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[3], 
          128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$o$ * 
          ($address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$o$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$i$[3] && 
          ($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 0, $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$f$[6] & 
          4) ? 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$m$ & 9) && 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$m$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$m$ & 
          1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$m$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$.$m$ >> 1 | $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ << 
          15));
        }
        $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$audioBuffer$ = $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$;
        $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$audioBufferOffset$ += $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$;
      }
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$vdp$.$t$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$;
      if (192 > $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$vdp$, 
      $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$, $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = 
      $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 0, !$JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$main$.$is_gg$ || !(24 > $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ || 
      168 <= $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$))) {
        if (0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[1] & 64)) {
          if (-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$s$) {
            for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$w$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ <= 
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$s$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$++) {
              if ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$K$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$]) {
                for ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$K$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$] = 0, $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = 
                $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$M$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$], $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = 0, $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ = 
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ << 5, $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 0;8 > $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$;$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$++) {
                  for (var $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$++], $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$++], $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$++], 
                  $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$++], $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ = 128;0 !== $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$;$bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ >>= 
                  1) {
                    var $colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ = 0;
                    0 !== ($address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ & $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$) && ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ |= 1);
                    0 !== ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ & $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$) && ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ |= 2);
                    0 !== ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$) && ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ |= 4);
                    0 !== ($address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ & $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$) && ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ |= 8);
                    $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$[$buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$++] = $colour$$inline_379_pixY$$inline_396_temp$$inline_407$$;
                  }
                }
              }
            }
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$w$ = 512;
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$s$ = -1;
          }
          var $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = 0, $colour$$inline_381_offset$$inline_421$$ = 0, $temp$$inline_382$$ = 0, $temp2$$inline_383$$ = 0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[8], 
          $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[9];
          16 > $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[0] & 64) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 
          0);
          $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[0] & 128;
          $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = 32 - ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$J$;
          $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ = $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ + $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ >> 3;
          27 < $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ && ($address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ -= 28);
          $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = ($line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ + ($feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ & 7) & 7) << 3;
          $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ = $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ << 8;
          for ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$J$;$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$O$;$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$++) {
            var $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$N$ + (($buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ & 31) << 1) + ($address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ << 6), $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ = 
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 1], $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ = ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & 8) << 1, $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ = 
            ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ << 3) + ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ & 7), $colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ = 0 === ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & 4) ? $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ : 
            56 - $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$, $tile$$inline_397$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$M$[($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$] & 
            255) + (($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & 1) << 8)];
            if (0 === ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & 2)) {
              for ($pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = 0;8 > $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ && 256 > $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$;$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$++, $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$++) {
                $colour$$inline_381_offset$$inline_421$$ = $tile$$inline_397$$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + $colour$$inline_379_pixY$$inline_396_temp$$inline_407$$], $temp$$inline_382$$ = 4 * ($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ + $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$), $temp2$$inline_383$$ = 3 * ($colour$$inline_381_offset$$inline_421$$ + $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$), 
                $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$F$[$bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$] = 0 !== ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & 16) && 0 !== $colour$$inline_381_offset$$inline_421$$, $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$temp$$inline_382$$] = 
                $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$temp2$$inline_383$$], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$temp$$inline_382$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$temp2$$inline_383$$ + 
                1], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$temp$$inline_382$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$temp2$$inline_383$$ + 2];
              }
            } else {
              for ($pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = 7;0 <= $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ && 256 > $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$;$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$--, $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$++) {
                $colour$$inline_381_offset$$inline_421$$ = $tile$$inline_397$$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + $colour$$inline_379_pixY$$inline_396_temp$$inline_407$$], $temp$$inline_382$$ = 4 * ($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ + $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$), $temp2$$inline_383$$ = 3 * ($colour$$inline_381_offset$$inline_421$$ + $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$), 
                $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$F$[$bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$] = 0 !== ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ & 16) && 0 !== $colour$$inline_381_offset$$inline_421$$, $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$temp$$inline_382$$] = 
                $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$temp2$$inline_383$$], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$temp$$inline_382$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$temp2$$inline_383$$ + 
                1], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$temp$$inline_382$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$temp2$$inline_383$$ + 2];
              }
            }
            $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$++;
            0 !== $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ && 23 == $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ && ($address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ = $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ >> 3, $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = 
            ($line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ & 7) << 3);
          }
          if ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$p$) {
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$p$ = !1;
            for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 0;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$v$.length;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$++) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$v$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$][0] = 0;
            }
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 0 === ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[1] & 2) ? 8 : 16;
            1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[1] & 1) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ <<= 1);
            for ($lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = 0;64 > $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$;$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$++) {
              $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$n$ + $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$] & 
              255;
              if (208 == $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$) {
                break;
              }
              $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$++;
              240 < $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ && ($buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ -= 256);
              for ($address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ = $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$;192 > $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$;$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$++) {
                if ($address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ - $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$) {
                  $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$v$[$address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$];
                  if (!$feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ || 8 <= $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$[0]) {
                    break;
                  }
                  $address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ = 3 * $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$[0] + 1;
                  $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$n$ + ($lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ << 1) + 128;
                  $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$[$address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$++] & 
                  255;
                  $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$[$address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$++] = $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$;
                  $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$[$address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$i$[$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$] & 
                  255;
                  $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$[0]++;
                }
              }
            }
          }
          if (0 !== $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$v$[$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$][0]) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = $colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ = $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ = 0;
            $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$v$[$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$];
            $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = Math.min(8, $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$[0]);
            $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[1] & 1;
            $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ = $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ << 8;
            for ($address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$ = 3 * $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ < $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$++) {
              if ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ = $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$[$address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[6] & 
              4) << 6, $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ = $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$[$address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$--], $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ = $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$[$address0$$inline_374_clockCycles$$inline_358_off$$inline_404_off$$inline_414_row_precal$$inline_390$$--] - 
              ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[0] & 8), $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ = $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ - $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ >> $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$, 
              0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[1] & 2) && ($address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ &= -2), $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$M$[$address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$ + 
              (($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ & 8) >> 3)], $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ = 0, 0 > $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ && ($address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ = -$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$, $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ = 
              0), $colour$$inline_381_offset$$inline_421$$ = $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ + (($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ & 7) << 3), 0 === $address$$inline_372_lineno$$inline_402_sample$$inline_355_tile_row$$inline_388_zoomed$$inline_412$$) {
                for (;8 > $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ && 256 > $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$;$address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$++, $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$++) {
                  $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ = $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$[$colour$$inline_381_offset$$inline_421$$++], 0 === $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$F$[$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$] || 
                  ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ = 4 * ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ + $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$), $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = 3 * ($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$] = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 
                  1], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 2]);
                }
              } else {
                for (;8 > $address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$ && 256 > $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$;$address3$$inline_377_pal$$inline_394_pix$$inline_420_tone$$inline_361_y$$inline_416$$++, $address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ += 2) {
                  $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ = $address2$$inline_376_counter$$inline_360_n$$inline_415_secondbyte$$inline_393_tile$$inline_419$$[$colour$$inline_381_offset$$inline_421$$++], 0 === $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ || $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$F$[$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$] || 
                  ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ = 4 * ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ + $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$), $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = 3 * ($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$] = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 
                  1], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 2]), 0 === $bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ || 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$F$[$address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ + 1] || ($colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ = 4 * ($address$$inline_405_address1$$inline_375_clockCyclesScaled$$inline_359_tx$$inline_391_x$$inline_417$$ + $feedback$$inline_362_i$$inline_356_output$$inline_357_row_precal$$inline_413_sprites$$inline_403_tile_y$$inline_389_vscroll$$inline_385_y$$inline_373$$ + 
                  1), $pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ = 3 * ($bit$$inline_378_colour$$inline_406_sx$$inline_395_tileRow$$inline_418$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$colour$$inline_379_pixY$$inline_396_temp$$inline_407$$ + 
                  2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$pixX$$inline_380_temp2$$inline_408_tile_props$$inline_392$$ + 2]);
                }
              }
            }
            8 <= $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$m$ |= 64);
          }
          if ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$main$.$is_sms$ && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[0] & 32)) {
            for ($lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = 4 * ($line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ << 8), $buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[7] & 
            15) + 16), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 0;8 > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$++) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$] = 
              $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ + 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ + 1], 
              $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ + 
              2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$buffer$$inline_354_count$$inline_411_pixel_index$$inline_371_temp2$$inline_368_tile_column$$inline_387_y$$inline_401$$ + 2];
            }
          }
        } else {
          for ($line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ <<= 8, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$ = 4 * ($line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ + 1024), $lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ = 
          3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[7] & 15) + 16), $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ *= 4;$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_352_height$$inline_399_hscroll$$inline_384_i$$inline_366_i$$inline_369_i$$inline_398_i$$inline_409_length$$inline_423$$;$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ += 
          4) {
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$], 
            $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ + 
            1], $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$f$[$line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$a$[$lock$$inline_386_offset$$inline_353_spriteno$$inline_400_sprites$$inline_410_temp$$inline_367_temp$$inline_424_tile$$inline_370$$ + 
            2];
          }
        }
      }
      $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$vdp$;
      $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$;
      192 >= $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ ? (0 === $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$G$ ? ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$G$ = $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[10], 
      $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$m$ |= 4) : $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$G$--, 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$m$ & 
      4) && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[0] & 16) && ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$main$.$cpu$.$J$ = !0)) : ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$G$ = 
      $JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[10], 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$m$ & 128) && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$g$[1] & 
      32) && 224 > $line$$inline_350_lineno$$inline_365_lineno$$inline_427_row_precal$$inline_422_samplesToGenerate$$inline_351$$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_364_JSCompiler_StaticMethods_interrupts$self$$inline_426_JSCompiler_StaticMethods_updateSound$self$$inline_349$$.$main$.$cpu$.$J$ = !0));
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$J$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$);
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$++;
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$lineno$ >= $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$.$no_of_scanlines$ ? ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$.$pause_button$ && 
      ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$M$ = $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$K$, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$K$ = 
      !1, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$Q$ && ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$++, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$Q$ = 
      !1), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.push($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$f$ = 
      102, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$o$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$.$pause_button$ = !1), $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$.$a$.$writeFrame$(), 
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$ = !0) : ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$o$ += $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$.$main$.$cyclesPerLine$, 
      $JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$ = !1);
    }
    if ($JSCompiler_StaticMethods_eof$self$$inline_429_JSCompiler_StaticMethods_eol$self$$inline_145_JSCompiler_StaticMethods_recompile$self$$inline_143_JSCompiler_temp$$2$$) {
      break;
    }
  }
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$instructions$:[]};
function $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_peepholePortIn$self$$, $port$$1$$) {
  if ($JSCompiler_StaticMethods_peepholePortIn$self$$.$main$.$is_gg$ && 7 > $port$$1$$) {
    switch($port$$1$$) {
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
  switch($port$$1$$ & 193) {
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
      return "this.a = (this.port.keyboard.controller2 & 0x3F) | this.port.ioPorts[0] | this.port.ioPorts[1];";
  }
  return "this.a = 0xFF;";
}
function $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_peepholePortOut$self$$, $port$$) {
  if ($JSCompiler_StaticMethods_peepholePortOut$self$$.$main$.$is_gg$ && 7 > $port$$) {
    return "";
  }
  switch($port$$ & 193) {
    case 1:
      return "var value = this.a;this.port.ioPorts[0] = (value & 0x20) << 1;this.port.ioPorts[1] = (value & 0x80);";
    case 128:
      return "this.vdp.dataWrite(this.a);";
    case 129:
      return "this.vdp.controlWrite(this.a);";
    case 64:
    ;
    case 65:
      if ($JSCompiler_StaticMethods_peepholePortOut$self$$.$main$.$soundEnabled$) {
        return "this.psg.write(this.a);";
      }
    ;
  }
  return "";
}
function $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_readRom16bit$self$$, $address$$14$$) {
  return $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$14$$ & 16383) ? $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$14$$ >> 14].getUint16($address$$14$$ & 16383, !0) : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$14$$ >> 14].getUint8($address$$14$$ & 16383) | $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$14$$ >> 14].getUint8($address$$14$$ & 16383) << 8 : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$14$$ >> 14][$address$$14$$ & 16383] & 
  255 | ($JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$14$$ >> 14][$address$$14$$ & 16383] & 255) << 8;
}
function $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_readRom8bit$self$$, $address$$13$$) {
  return $SUPPORT_DATAVIEW$$ ? $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$13$$ >> 14].getUint8($address$$13$$ & 16383) : $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$13$$ >> 14][$address$$13$$ & 16383] & 255;
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $index$$47$$, $address$$11_address$$inline_149$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_location$$inline_151$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$11_address$$inline_149$$, $code$$8_code$$inline_155$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcode$$inline_152_operand$$2$$ = "", $inst$$inline_154_location$$25_offset$$17$$ = 
  0;
  $address$$11_address$$inline_149$$++;
  $inst$$inline_154_location$$25_offset$$17$$ = 0;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_location$$inline_151$$ = "ADD " + $index$$47$$ + ",BC";
      $code$$8_code$$inline_155$$ = "this.set" + $index$$47$$ + "(this.add16(this.get" + $index$$47$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_location$$inline_151$$ = "ADD " + $index$$47$$ + ",DE";
      $code$$8_code$$inline_155$$ = "this.set" + $index$$47$$ + "(this.add16(this.get" + $index$$47$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcode$$inline_152_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$));
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "," + $opcode$$inline_152_operand$$2$$;
      $code$$8_code$$inline_155$$ = "this.set" + $index$$47$$ + "(" + $opcode$$inline_152_operand$$2$$ + ");";
      $address$$11_address$$inline_149$$ += 2;
      break;
    case 34:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $opcode$$inline_152_operand$$2$$ = $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $opcode$$inline_152_operand$$2$$ + ")," + $index$$47$$;
      $code$$8_code$$inline_155$$ = "this.writeMem(" + $opcode$$inline_152_operand$$2$$ + ", this." + $index$$47$$.toLowerCase() + "L);this.writeMem(" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$ + 1) + ", this." + $index$$47$$.toLowerCase() + "H);";
      $address$$11_address$$inline_149$$ += 2;
      break;
    case 35:
      $inst$$3_location$$inline_151$$ = "INC " + $index$$47$$;
      $code$$8_code$$inline_155$$ = "this.inc" + $index$$47$$ + "();";
      break;
    case 36:
      $inst$$3_location$$inline_151$$ = "INC " + $index$$47$$ + "H *";
      break;
    case 37:
      $inst$$3_location$$inline_151$$ = "DEC " + $index$$47$$ + "H *";
      break;
    case 38:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$)) + " *";
      $address$$11_address$$inline_149$$++;
      break;
    case 41:
      $inst$$3_location$$inline_151$$ = "ADD " + $index$$47$$ + "  " + $index$$47$$;
      break;
    case 42:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + " (" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.ixL = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");this.ixH = this.readMem(" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$ + 1) + ");";
      $address$$11_address$$inline_149$$ += 2;
      break;
    case 43:
      $inst$$3_location$$inline_151$$ = "DEC " + $index$$47$$;
      $code$$8_code$$inline_155$$ = "this.dec" + $index$$47$$ + "();";
      break;
    case 44:
      $inst$$3_location$$inline_151$$ = "INC " + $index$$47$$ + "L *";
      break;
    case 45:
      $inst$$3_location$$inline_151$$ = "DEC " + $index$$47$$ + "L *";
      break;
    case 46:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$));
      $address$$11_address$$inline_149$$++;
      break;
    case 52:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "INC (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.incMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 53:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "DEC (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.decMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 54:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $opcode$$inline_152_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$ + 1));
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")," + $opcode$$inline_152_operand$$2$$;
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", " + $opcode$$inline_152_operand$$2$$ + ");";
      $address$$11_address$$inline_149$$ += 2;
      break;
    case 57:
      $inst$$3_location$$inline_151$$ = "ADD " + $index$$47$$ + " SP";
      $code$$8_code$$inline_155$$ = "this.set" + $index$$47$$ + "(this.add16(this.get" + $index$$47$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_location$$inline_151$$ = "LD B," + $index$$47$$ + "H *";
      break;
    case 69:
      $inst$$3_location$$inline_151$$ = "LD B," + $index$$47$$ + "L *";
      break;
    case 70:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD B,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.b = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 76:
      $inst$$3_location$$inline_151$$ = "LD C," + $index$$47$$ + "H *";
      break;
    case 77:
      $inst$$3_location$$inline_151$$ = "LD C," + $index$$47$$ + "L *";
      break;
    case 78:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD C,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.c = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 84:
      $inst$$3_location$$inline_151$$ = "LD D," + $index$$47$$ + "H *";
      break;
    case 85:
      $inst$$3_location$$inline_151$$ = "LD D," + $index$$47$$ + "L *";
      break;
    case 86:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD D,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.d = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 92:
      $inst$$3_location$$inline_151$$ = "LD E," + $index$$47$$ + "H *";
      break;
    case 93:
      $inst$$3_location$$inline_151$$ = "LD E," + $index$$47$$ + "L *";
      break;
    case 94:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD E,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.e = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 96:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H,B *";
      break;
    case 97:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H,C *";
      break;
    case 98:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H,D *";
      break;
    case 99:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H,E *";
      break;
    case 100:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H," + $index$$47$$ + "H*";
      break;
    case 101:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H," + $index$$47$$ + "L *";
      break;
    case 102:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD H,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.h = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 103:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "H,A *";
      break;
    case 104:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L,B *";
      break;
    case 105:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L,C *";
      break;
    case 106:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L,D *";
      break;
    case 107:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L,E *";
      break;
    case 108:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L," + $index$$47$$ + "H *";
      break;
    case 109:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L," + $index$$47$$ + "L *";
      $code$$8_code$$inline_155$$ = "";
      break;
    case 110:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD L,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.l = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 111:
      $inst$$3_location$$inline_151$$ = "LD " + $index$$47$$ + "L,A *";
      $code$$8_code$$inline_155$$ = "this." + $index$$47$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),B";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.b);";
      $address$$11_address$$inline_149$$++;
      break;
    case 113:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),C";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.c);";
      $address$$11_address$$inline_149$$++;
      break;
    case 114:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),D";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.d);";
      $address$$11_address$$inline_149$$++;
      break;
    case 115:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),E";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.e);";
      $address$$11_address$$inline_149$$++;
      break;
    case 116:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),H";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.h);";
      $address$$11_address$$inline_149$$++;
      break;
    case 117:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),L";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.l);";
      $address$$11_address$$inline_149$$++;
      break;
    case 119:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "),A";
      $code$$8_code$$inline_155$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ", this.a);";
      $address$$11_address$$inline_149$$++;
      break;
    case 124:
      $inst$$3_location$$inline_151$$ = "LD A," + $index$$47$$ + "H *";
      break;
    case 125:
      $inst$$3_location$$inline_151$$ = "LD A," + $index$$47$$ + "L *";
      break;
    case 126:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "LD A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.a = this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_149$$++;
      break;
    case 132:
      $inst$$3_location$$inline_151$$ = "ADD A," + $index$$47$$ + "H *";
      break;
    case 133:
      $inst$$3_location$$inline_151$$ = "ADD A," + $index$$47$$ + "L *";
      break;
    case 134:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "ADD A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.add_a(this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_149$$++;
      break;
    case 140:
      $inst$$3_location$$inline_151$$ = "ADC A," + $index$$47$$ + "H *";
      break;
    case 141:
      $inst$$3_location$$inline_151$$ = "ADC A," + $index$$47$$ + "L *";
      break;
    case 142:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "ADC A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.adc_a(this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_149$$++;
      break;
    case 148:
      $inst$$3_location$$inline_151$$ = "SUB " + $index$$47$$ + "H *";
      break;
    case 149:
      $inst$$3_location$$inline_151$$ = "SUB " + $index$$47$$ + "L *";
      break;
    case 150:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "SUB A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.sub_a(this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_149$$++;
      break;
    case 156:
      $inst$$3_location$$inline_151$$ = "SBC A," + $index$$47$$ + "H *";
      break;
    case 157:
      $inst$$3_location$$inline_151$$ = "SBC A," + $index$$47$$ + "L *";
      break;
    case 158:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "SBC A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.sbc_a(this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_149$$++;
      break;
    case 164:
      $inst$$3_location$$inline_151$$ = "AND " + $index$$47$$ + "H *";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$47$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_location$$inline_151$$ = "AND " + $index$$47$$ + "L *";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$47$$.toLowerCase() + "L];";
      break;
    case 166:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "AND A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")] | F_HALFCARRY;";
      $address$$11_address$$inline_149$$++;
      break;
    case 172:
      $inst$$3_location$$inline_151$$ = "XOR A " + $index$$47$$ + "H*";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_location$$inline_151$$ = "XOR A " + $index$$47$$ + "L*";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "L];";
      break;
    case 174:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "XOR A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")];";
      $address$$11_address$$inline_149$$++;
      break;
    case 180:
      $inst$$3_location$$inline_151$$ = "OR A " + $index$$47$$ + "H*";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_location$$inline_151$$ = "OR A " + $index$$47$$ + "L*";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "L];";
      break;
    case 182:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "OR A,(" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")];";
      $address$$11_address$$inline_149$$++;
      break;
    case 188:
      $inst$$3_location$$inline_151$$ = "CP " + $index$$47$$ + "H *";
      $code$$8_code$$inline_155$$ = "this.cp_a(this." + $index$$47$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_location$$inline_151$$ = "CP " + $index$$47$$ + "L *";
      $code$$8_code$$inline_155$$ = "this.cp_a(this." + $index$$47$$.toLowerCase() + "L);";
      break;
    case 190:
      $inst$$inline_154_location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $inst$$3_location$$inline_151$$ = "CP (" + $index$$47$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_155$$ = "this.cp_a(this.readMem(this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_154_location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_149$$++;
      break;
    case 203:
      $inst$$3_location$$inline_151$$ = "location = this.get" + $index$$47$$ + "() + " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$++)) + " & 0xFFFF;";
      $opcode$$inline_152_operand$$2$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$, $address$$11_address$$inline_149$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$ = [$opcode$$inline_152_operand$$2$$];
      $inst$$inline_154_location$$25_offset$$17$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$8_code$$inline_155$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$11_address$$inline_149$$++;
      switch($opcode$$inline_152_operand$$2$$) {
        case 0:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,RLC (" + $index$$47$$ + ")";
          break;
        case 4:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,RLC (" + $index$$47$$ + ")";
          break;
        case 5:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,RLC (" + $index$$47$$ + ")";
          break;
        case 6:
          $inst$$inline_154_location$$25_offset$$17$$ = "RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,RRC (" + $index$$47$$ + ")";
          break;
        case 9:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,RRC (" + $index$$47$$ + ")";
          break;
        case 10:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,RRC (" + $index$$47$$ + ")";
          break;
        case 11:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,RRC (" + $index$$47$$ + ")";
          break;
        case 12:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,RRC (" + $index$$47$$ + ")";
          break;
        case 13:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,RRC (" + $index$$47$$ + ")";
          break;
        case 14:
          $inst$$inline_154_location$$25_offset$$17$$ = "RRC (" + $index$$47$$ + ")";
          break;
        case 15:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,RRC (" + $index$$47$$ + ")";
          break;
        case 16:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,RL (" + $index$$47$$ + ")";
          break;
        case 17:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,RL (" + $index$$47$$ + ")";
          break;
        case 18:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,RL (" + $index$$47$$ + ")";
          break;
        case 19:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,RL (" + $index$$47$$ + ")";
          break;
        case 20:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,RL (" + $index$$47$$ + ")";
          break;
        case 21:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,RL (" + $index$$47$$ + ")";
          break;
        case 22:
          $inst$$inline_154_location$$25_offset$$17$$ = "RL (" + $index$$47$$ + ")";
          break;
        case 23:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,RL (" + $index$$47$$ + ")";
          break;
        case 24:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,RR (" + $index$$47$$ + ")";
          break;
        case 25:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,RR (" + $index$$47$$ + ")";
          break;
        case 26:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,RR (" + $index$$47$$ + ")";
          break;
        case 27:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,RR (" + $index$$47$$ + ")";
          break;
        case 28:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,RR (" + $index$$47$$ + ")";
          break;
        case 29:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,RR (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_154_location$$25_offset$$17$$ = "RR (" + $index$$47$$ + ")";
          break;
        case 31:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,RR (" + $index$$47$$ + ")";
          $code$$8_code$$inline_155$$ = $inst$$3_location$$inline_151$$ + "this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 32:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,SLA (" + $index$$47$$ + ")";
          break;
        case 33:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,SLA (" + $index$$47$$ + ")";
          break;
        case 34:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,SLA (" + $index$$47$$ + ")";
          break;
        case 35:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,SLA (" + $index$$47$$ + ")";
          break;
        case 36:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,SLA (" + $index$$47$$ + ")";
          break;
        case 37:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,SLA (" + $index$$47$$ + ")";
          break;
        case 38:
          $inst$$inline_154_location$$25_offset$$17$$ = "SLA (" + $index$$47$$ + ")";
          break;
        case 39:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,SLA (" + $index$$47$$ + ")";
          break;
        case 40:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,SRA (" + $index$$47$$ + ")";
          break;
        case 41:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,SRA (" + $index$$47$$ + ")";
          break;
        case 42:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,SRA (" + $index$$47$$ + ")";
          break;
        case 43:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,SRA (" + $index$$47$$ + ")";
          break;
        case 44:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,SRA (" + $index$$47$$ + ")";
          break;
        case 45:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,SRA (" + $index$$47$$ + ")";
          break;
        case 46:
          $inst$$inline_154_location$$25_offset$$17$$ = "SRA (" + $index$$47$$ + ")";
          break;
        case 47:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,SRA (" + $index$$47$$ + ")";
          break;
        case 48:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,SLL (" + $index$$47$$ + ")";
          break;
        case 49:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,SLL (" + $index$$47$$ + ")";
          break;
        case 50:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,SLL (" + $index$$47$$ + ")";
          break;
        case 51:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,SLL (" + $index$$47$$ + ")";
          break;
        case 52:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,SLL (" + $index$$47$$ + ")";
          break;
        case 53:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,SLL (" + $index$$47$$ + ")";
          break;
        case 54:
          $inst$$inline_154_location$$25_offset$$17$$ = "SLL (" + $index$$47$$ + ") *";
          break;
        case 55:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,SLL (" + $index$$47$$ + ")";
          break;
        case 56:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD B,SRL (" + $index$$47$$ + ")";
          break;
        case 57:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD C,SRL (" + $index$$47$$ + ")";
          break;
        case 58:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD D,SRL (" + $index$$47$$ + ")";
          break;
        case 59:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD E,SRL (" + $index$$47$$ + ")";
          break;
        case 60:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD H,SRL (" + $index$$47$$ + ")";
          break;
        case 61:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD L,SRL (" + $index$$47$$ + ")";
          break;
        case 62:
          $inst$$inline_154_location$$25_offset$$17$$ = "SRL (" + $index$$47$$ + ")";
          break;
        case 63:
          $inst$$inline_154_location$$25_offset$$17$$ = "LD A,SRL (" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 0,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 1,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 2,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 3,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 4,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 5,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 6,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "BIT 7,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 0,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 1,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 2,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 3,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 4,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 5,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 6,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "RES 7,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 0,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 1,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 2,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 3,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 4,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 5,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 6,(" + $index$$47$$ + ")";
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
          $inst$$inline_154_location$$25_offset$$17$$ = "SET 7,(" + $index$$47$$ + ")";
      }
      $address$$11_address$$inline_149$$++;
      $inst$$3_location$$inline_151$$ = $inst$$inline_154_location$$25_offset$$17$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_153$$);
      break;
    case 225:
      $inst$$3_location$$inline_151$$ = "POP " + $index$$47$$;
      $code$$8_code$$inline_155$$ = "this.set" + $index$$47$$ + "(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$3_location$$inline_151$$ = "EX SP,(" + $index$$47$$ + ")";
      $code$$8_code$$inline_155$$ = "temp = this.get" + $index$$47$$ + "();this.set" + $index$$47$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_location$$inline_151$$ = "PUSH " + $index$$47$$;
      $code$$8_code$$inline_155$$ = "this.push2(this." + $index$$47$$.toLowerCase() + "H, this." + $index$$47$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_location$$inline_151$$ = "JP (" + $index$$47$$ + ")";
      $code$$8_code$$inline_155$$ = "this.pc = this.get" + $index$$47$$ + "(); return;";
      $address$$11_address$$inline_149$$ = null;
      break;
    case 249:
      $inst$$3_location$$inline_151$$ = "LD SP," + $index$$47$$, $code$$8_code$$inline_155$$ = "this.sp = this.get" + $index$$47$$ + "();";
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_location$$inline_151$$, code:$code$$8_code$$inline_155$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$11_address$$inline_149$$};
}
function $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) {
  var $opcode$$6_options$$inline_177$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$), $defaultInstruction$$inline_179_opcodesArray$$ = [$opcode$$6_options$$inline_177$$], $address$$inline_158_inst_opcode$$inline_168$$ = "Unknown Opcode", $currAddr_hexOpcodes$$inline_181$$ = $address$$8$$, $address$$inline_166_target$$46$$ = null, $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($opcode$$6_options$$inline_177$$) + 
  '";', $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "", $currAddr$$inline_171_inst$$inline_161_location$$23$$ = 0;
  $address$$8$$++;
  $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = {};
  switch($opcode$$6_options$$inline_177$$) {
    case 0:
      $address$$inline_158_inst_opcode$$inline_168$$ = "NOP";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 1:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD BC," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setBC(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 2:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (BC),A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getBC(), this.a);";
      break;
    case 3:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC BC";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.incBC();";
      break;
    case 4:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 7:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RLCA";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.rlca_a();";
      break;
    case 8:
      $address$$inline_158_inst_opcode$$inline_168$$ = "EX AF AF'";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.exAF();";
      break;
    case 9:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD HL,BC";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,(BC)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.readMem(this.getBC());";
      break;
    case 11:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC BC";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.decBC();";
      break;
    case 12:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 15:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RRCA";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.rrca_a();";
      break;
    case 16:
      $address$$inline_166_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_158_inst_opcode$$inline_168$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 17:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD DE," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setDE(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 18:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (DE),A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getDE(), this.a);";
      break;
    case 19:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC DE";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.incDE();";
      break;
    case 20:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 23:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RLA";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.rla_a();";
      break;
    case 24:
      $address$$inline_166_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      $address$$8$$ = null;
      break;
    case 25:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD HL,DE";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,(DE)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.readMem(this.getDE());";
      break;
    case 27:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC DE";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.decDE();";
      break;
    case 28:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 31:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RRA";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.rra_a();";
      break;
    case 32:
      $address$$inline_166_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if (!((this.f & F_ZERO) != 0x00)) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 33:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD HL," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 34:
      $currAddr$$inline_171_inst$$inline_161_location$$23$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($currAddr$$inline_171_inst$$inline_161_location$$23$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + "),HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($currAddr$$inline_171_inst$$inline_161_location$$23$$ + 1) + ", this.h);";
      $address$$8$$ += 2;
      break;
    case 35:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.incHL();";
      break;
    case 36:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 39:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DAA";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.daa();";
      break;
    case 40:
      $address$$inline_166_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 41:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD HL,HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD HL,(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(this.readMemWord(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + "));";
      $address$$8$$ += 2;
      break;
    case 43:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.decHL();";
      break;
    case 44:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 47:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CPL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cpl_a();";
      break;
    case 48:
      $address$$inline_166_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if (!((this.f & F_CARRY) != 0x00)) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 49:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD SP," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sp = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$ += 2;
      break;
    case 50:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + "),A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ", this.a);";
      $address$$8$$ += 2;
      break;
    case 51:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC SP";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sp++;";
      break;
    case 52:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC (HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC (HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL)," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$++;
      break;
    case 55:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SCF";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $address$$inline_166_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 57:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD HL,SP";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.readMem(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 59:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC SP";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sp--;";
      break;
    case 60:
      $address$$inline_158_inst_opcode$$inline_168$$ = "INC A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DEC A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ";";
      $address$$8$$++;
      break;
    case 63:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CCF";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.ccf();";
      break;
    case 64:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 65:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.c;";
      break;
    case 66:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.d;";
      break;
    case 67:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.e;";
      break;
    case 68:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.h;";
      break;
    case 69:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.l;";
      break;
    case 70:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.readMem(this.getHL());";
      break;
    case 71:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD B,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.b = this.a;";
      break;
    case 72:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.b;";
      break;
    case 73:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 74:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.d;";
      break;
    case 75:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.e;";
      break;
    case 76:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.h;";
      break;
    case 77:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.l;";
      break;
    case 78:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.readMem(this.getHL());";
      break;
    case 79:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD C,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.c = this.a;";
      break;
    case 80:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.b;";
      break;
    case 81:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.c;";
      break;
    case 82:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 83:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.e;";
      break;
    case 84:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.h;";
      break;
    case 85:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.l;";
      break;
    case 86:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.readMem(this.getHL());";
      break;
    case 87:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD D,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.d = this.a;";
      break;
    case 88:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.b;";
      break;
    case 89:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.c;";
      break;
    case 90:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.d;";
      break;
    case 91:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 92:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.h;";
      break;
    case 93:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.l;";
      break;
    case 94:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.readMem(this.getHL());";
      break;
    case 95:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD E,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.e = this.a;";
      break;
    case 96:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.b;";
      break;
    case 97:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.c;";
      break;
    case 98:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.d;";
      break;
    case 99:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.e;";
      break;
    case 100:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 101:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.l;";
      break;
    case 102:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.readMem(this.getHL());";
      break;
    case 103:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD H,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.h = this.a;";
      break;
    case 104:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.b;";
      break;
    case 105:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.c;";
      break;
    case 106:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.d;";
      break;
    case 107:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.e;";
      break;
    case 108:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.h;";
      break;
    case 109:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 110:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.readMem(this.getHL());";
      break;
    case 111:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD L,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.l = this.a;";
      break;
    case 112:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.b);";
      break;
    case 113:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.c);";
      break;
    case 114:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.d);";
      break;
    case 115:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.e);";
      break;
    case 116:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.h);";
      break;
    case 117:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.l);";
      break;
    case 118:
      $address$$inline_158_inst_opcode$$inline_168$$ = "HALT";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.tstates = 0x00;" + ("this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$8$$ - 1) + "; return;");
      break;
    case 119:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD (HL),A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.writeMem(this.getHL(), this.a);";
      break;
    case 120:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.b;";
      break;
    case 121:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.c;";
      break;
    case 122:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.d;";
      break;
    case 123:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.e;";
      break;
    case 124:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.h;";
      break;
    case 125:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.l;";
      break;
    case 126:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = this.readMem(this.getHL());";
      break;
    case 127:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "";
      break;
    case 128:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.b);";
      break;
    case 129:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.c);";
      break;
    case 130:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.d);";
      break;
    case 131:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.e);";
      break;
    case 132:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.h);";
      break;
    case 133:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.l);";
      break;
    case 134:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.readMem(this.getHL()));";
      break;
    case 135:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(this.a);";
      break;
    case 136:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.readMem(this.getHL()));";
      break;
    case 143:
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.readMem(this.getHL()));";
      break;
    case 151:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.readMem(this.getHL()));";
      break;
    case 159:
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
      break;
    case 175:
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.a = " + $JSSMS$Utils$toHex$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
      break;
    case 183:
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,B";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,D";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,E";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,H";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,L";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,(HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.readMem(this.getHL()));";
      break;
    case 191:
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP A,A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET NZ";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $address$$inline_158_inst_opcode$$inline_168$$ = "POP BC";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) === 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 195:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      $address$$8$$ = null;
      break;
    case 196:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) === 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 197:
      $address$$inline_158_inst_opcode$$inline_168$$ = "PUSH BC";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADD A," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.add_a(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$++;
      break;
    case 199:
      $address$$inline_166_target$$46$$ = 0;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 200:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET Z";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.pc = this.readMemWord(this.sp); this.sp += 0x02; return;";
      $address$$8$$ = null;
      break;
    case 202:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 203:
      var $address$$inline_158_inst_opcode$$inline_168$$ = $address$$8$$, $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_158_inst_opcode$$inline_168$$), $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = [$code$$5_opcode$$inline_159_opcodesArray$$inline_169$$], $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "Unimplemented 0xCB prefixed opcode", $currAddr$$inline_162_target$$inline_172$$ = 
      $address$$inline_158_inst_opcode$$inline_168$$, $code$$inline_163_code$$inline_173$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
      $address$$inline_158_inst_opcode$$inline_168$$++;
      switch($code$$5_opcode$$inline_159_opcodesArray$$inline_169$$) {
        case 0:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.rlc(this.b);";
          break;
        case 1:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.rlc(this.c);";
          break;
        case 2:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.rlc(this.d);";
          break;
        case 3:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.rlc(this.e);";
          break;
        case 4:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.rlc(this.h);";
          break;
        case 5:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.rlc(this.l);";
          break;
        case 6:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
          break;
        case 7:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RLC A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.rlc(this.a);";
          break;
        case 8:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.rrc(this.b);";
          break;
        case 9:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.rrc(this.c);";
          break;
        case 10:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.rrc(this.d);";
          break;
        case 11:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.rrc(this.e);";
          break;
        case 12:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.rrc(this.h);";
          break;
        case 13:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.rrc(this.l);";
          break;
        case 14:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
          break;
        case 15:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RRC A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.rrc(this.a);";
          break;
        case 16:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.rl(this.b);";
          break;
        case 17:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.rl(this.c);";
          break;
        case 18:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.rl(this.d);";
          break;
        case 19:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.rl(this.e);";
          break;
        case 20:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.rl(this.h);";
          break;
        case 21:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.rl(this.l);";
          break;
        case 22:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
          break;
        case 23:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RL A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.rl(this.a);";
          break;
        case 24:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.rr(this.b);";
          break;
        case 25:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.rr(this.c);";
          break;
        case 26:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.rr(this.d);";
          break;
        case 27:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.rr(this.e);";
          break;
        case 28:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.rr(this.h);";
          break;
        case 29:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.rr(this.l);";
          break;
        case 30:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
          break;
        case 31:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RR A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.rr(this.a);";
          break;
        case 32:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.sla(this.b);";
          break;
        case 33:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.sla(this.c);";
          break;
        case 34:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.sla(this.d);";
          break;
        case 35:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.sla(this.e);";
          break;
        case 36:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.sla(this.h);";
          break;
        case 37:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.sla(this.l);";
          break;
        case 38:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
          break;
        case 39:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLA A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.sla(this.a);";
          break;
        case 40:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.sra(this.b);";
          break;
        case 41:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.sra(this.c);";
          break;
        case 42:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.sra(this.d);";
          break;
        case 43:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.sra(this.e);";
          break;
        case 44:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.sra(this.h);";
          break;
        case 45:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.sra(this.l);";
          break;
        case 46:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
          break;
        case 47:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRA A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.sra(this.a);";
          break;
        case 48:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.sll(this.b);";
          break;
        case 49:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.sll(this.c);";
          break;
        case 50:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.sll(this.d);";
          break;
        case 51:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.sll(this.e);";
          break;
        case 52:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.sll(this.h);";
          break;
        case 53:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.sll(this.l);";
          break;
        case 54:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
          break;
        case 55:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SLL A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.sll(this.a);";
          break;
        case 56:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL B";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.srl(this.b);";
          break;
        case 57:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL C";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.srl(this.c);";
          break;
        case 58:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL D";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.srl(this.d);";
          break;
        case 59:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL E";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.srl(this.e);";
          break;
        case 60:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL H";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.srl(this.h);";
          break;
        case 61:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL L";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.srl(this.l);";
          break;
        case 62:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL (HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
          break;
        case 63:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SRL A";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.srl(this.a);";
          break;
        case 64:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_0);";
          break;
        case 65:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_0);";
          break;
        case 66:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_0);";
          break;
        case 67:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_0);";
          break;
        case 68:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_0);";
          break;
        case 69:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_0);";
          break;
        case 70:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
          break;
        case 71:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 0,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_0);";
          break;
        case 72:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_1);";
          break;
        case 73:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_1);";
          break;
        case 74:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_1);";
          break;
        case 75:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_1);";
          break;
        case 76:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_1);";
          break;
        case 77:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_1);";
          break;
        case 78:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
          break;
        case 79:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 1,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_1);";
          break;
        case 80:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_2);";
          break;
        case 81:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_2);";
          break;
        case 82:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_2);";
          break;
        case 83:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_2);";
          break;
        case 84:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_2);";
          break;
        case 85:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_2);";
          break;
        case 86:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
          break;
        case 87:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 2,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_2);";
          break;
        case 88:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_3);";
          break;
        case 89:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_3);";
          break;
        case 90:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_3);";
          break;
        case 91:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_3);";
          break;
        case 92:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_3);";
          break;
        case 93:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_3);";
          break;
        case 94:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
          break;
        case 95:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 3,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_3);";
          break;
        case 96:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_4);";
          break;
        case 97:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_4);";
          break;
        case 98:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_4);";
          break;
        case 99:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_4);";
          break;
        case 100:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_4);";
          break;
        case 101:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_4);";
          break;
        case 102:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
          break;
        case 103:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 4,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_4);";
          break;
        case 104:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_5);";
          break;
        case 105:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_5);";
          break;
        case 106:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_5);";
          break;
        case 107:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_5);";
          break;
        case 108:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_5);";
          break;
        case 109:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_5);";
          break;
        case 110:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
          break;
        case 111:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 5,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_5);";
          break;
        case 112:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_6);";
          break;
        case 113:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_6);";
          break;
        case 114:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_6);";
          break;
        case 115:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_6);";
          break;
        case 116:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_6);";
          break;
        case 117:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_6);";
          break;
        case 118:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
          break;
        case 119:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 6,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_6);";
          break;
        case 120:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,B";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.b & BIT_7);";
          break;
        case 121:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,C";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.c & BIT_7);";
          break;
        case 122:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,D";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.d & BIT_7);";
          break;
        case 123:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,E";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.e & BIT_7);";
          break;
        case 124:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,H";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.h & BIT_7);";
          break;
        case 125:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,L";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.l & BIT_7);";
          break;
        case 126:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
          break;
        case 127:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "BIT 7,A";
          $code$$inline_163_code$$inline_173$$ = "this.bit(this.a & BIT_7);";
          break;
        case 128:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,B";
          $code$$inline_163_code$$inline_173$$ = "this.b &= ~BIT_0;";
          break;
        case 129:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,C";
          $code$$inline_163_code$$inline_173$$ = "this.c &= ~BIT_0;";
          break;
        case 130:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,D";
          $code$$inline_163_code$$inline_173$$ = "this.d &= ~BIT_0;";
          break;
        case 131:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,E";
          $code$$inline_163_code$$inline_173$$ = "this.e &= ~BIT_0;";
          break;
        case 132:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,H";
          $code$$inline_163_code$$inline_173$$ = "this.h &= ~BIT_0;";
          break;
        case 133:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,L";
          $code$$inline_163_code$$inline_173$$ = "this.l &= ~BIT_0;";
          break;
        case 134:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
          break;
        case 135:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 0,A";
          $code$$inline_163_code$$inline_173$$ = "this.a &= ~BIT_0;";
          break;
        case 136:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,B";
          break;
        case 137:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,C";
          break;
        case 138:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,D";
          break;
        case 139:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,E";
          break;
        case 140:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,H";
          break;
        case 141:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,L";
          break;
        case 142:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
          break;
        case 143:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 1,A";
          break;
        case 144:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,B";
          break;
        case 145:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,C";
          break;
        case 146:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,D";
          break;
        case 147:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,E";
          break;
        case 148:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,H";
          break;
        case 149:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,L";
          break;
        case 150:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
          break;
        case 151:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 2,A";
          break;
        case 152:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,B";
          break;
        case 153:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,C";
          break;
        case 154:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,D";
          break;
        case 155:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,E";
          break;
        case 156:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,H";
          break;
        case 157:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,L";
          break;
        case 158:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
          break;
        case 159:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 3,A";
          $code$$inline_163_code$$inline_173$$ = "this.a &= ~BIT_3;";
          break;
        case 160:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,B";
          break;
        case 161:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,C";
          break;
        case 162:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,D";
          break;
        case 163:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,E";
          break;
        case 164:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,H";
          break;
        case 165:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,L";
          break;
        case 166:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
          break;
        case 167:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 4,A";
          $code$$inline_163_code$$inline_173$$ = "this.a &= ~BIT_4;";
          break;
        case 168:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,B";
          break;
        case 169:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,C";
          break;
        case 170:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,D";
          break;
        case 171:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,E";
          break;
        case 172:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,H";
          break;
        case 173:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,L";
          break;
        case 174:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
          break;
        case 175:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 5,A";
          break;
        case 176:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,B";
          break;
        case 177:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,C";
          break;
        case 178:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,D";
          break;
        case 179:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,E";
          break;
        case 180:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,H";
          break;
        case 181:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,L";
          break;
        case 182:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
          break;
        case 183:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 6,A";
          $code$$inline_163_code$$inline_173$$ = "this.a &= ~BIT_6;";
          break;
        case 184:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,B";
          $code$$inline_163_code$$inline_173$$ = "this.b &= ~BIT_7;";
          break;
        case 185:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,C";
          $code$$inline_163_code$$inline_173$$ = "this.c &= ~BIT_7;";
          break;
        case 186:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,D";
          $code$$inline_163_code$$inline_173$$ = "this.d &= ~BIT_7;";
          break;
        case 187:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,E";
          $code$$inline_163_code$$inline_173$$ = "this.e &= ~BIT_7;";
          break;
        case 188:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,H";
          $code$$inline_163_code$$inline_173$$ = "this.h &= ~BIT_7;";
          break;
        case 189:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,L";
          $code$$inline_163_code$$inline_173$$ = "this.l &= ~BIT_7;";
          break;
        case 190:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
          break;
        case 191:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "RES 7,A";
          $code$$inline_163_code$$inline_173$$ = "this.a &= ~BIT_7;";
          break;
        case 192:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,B";
          $code$$inline_163_code$$inline_173$$ = "this.b |= BIT_0;";
          break;
        case 193:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,C";
          $code$$inline_163_code$$inline_173$$ = "this.c |= BIT_0;";
          break;
        case 194:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,D";
          $code$$inline_163_code$$inline_173$$ = "this.d |= BIT_0;";
          break;
        case 195:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,E";
          $code$$inline_163_code$$inline_173$$ = "this.e |= BIT_0;";
          break;
        case 196:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,H";
          $code$$inline_163_code$$inline_173$$ = "this.h |= BIT_0;";
          break;
        case 197:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,L";
          $code$$inline_163_code$$inline_173$$ = "this.l |= BIT_0;";
          break;
        case 198:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
          break;
        case 199:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 0,A";
          $code$$inline_163_code$$inline_173$$ = "this.a |= BIT_0;";
          break;
        case 200:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,B";
          break;
        case 201:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,C";
          break;
        case 202:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,D";
          break;
        case 203:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,E";
          break;
        case 204:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,H";
          break;
        case 205:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,L";
          break;
        case 206:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
          break;
        case 207:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 1,A";
          break;
        case 208:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,B";
          break;
        case 209:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,C";
          break;
        case 210:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,D";
          break;
        case 211:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,E";
          break;
        case 212:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,H";
          break;
        case 213:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,L";
          break;
        case 214:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
          break;
        case 215:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 2,A";
          break;
        case 216:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,B";
          break;
        case 217:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,C";
          break;
        case 218:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,D";
          break;
        case 219:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,E";
          break;
        case 220:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,H";
          break;
        case 221:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,L";
          break;
        case 222:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
          break;
        case 223:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 3,A";
          break;
        case 224:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,B";
          break;
        case 225:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,C";
          break;
        case 226:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,D";
          break;
        case 227:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,E";
          break;
        case 228:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,H";
          break;
        case 229:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,L";
          break;
        case 230:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
          break;
        case 231:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 4,A";
          $code$$inline_163_code$$inline_173$$ = "this.a |= BIT_4;";
          break;
        case 232:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,B";
          break;
        case 233:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,C";
          break;
        case 234:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,D";
          break;
        case 235:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,E";
          break;
        case 236:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,H";
          break;
        case 237:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,L";
          break;
        case 238:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
          break;
        case 239:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 5,A";
          $code$$inline_163_code$$inline_173$$ = "this.a |= BIT_5;";
          break;
        case 240:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,B";
          $code$$inline_163_code$$inline_173$$ = "this.b |= BIT_6;";
          break;
        case 241:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,C";
          $code$$inline_163_code$$inline_173$$ = "this.c |= BIT_6;";
          break;
        case 242:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,D";
          $code$$inline_163_code$$inline_173$$ = "this.d |= BIT_6;";
          break;
        case 243:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,E";
          $code$$inline_163_code$$inline_173$$ = "this.e |= BIT_6;";
          break;
        case 244:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,H";
          $code$$inline_163_code$$inline_173$$ = "this.h |= BIT_6;";
          break;
        case 245:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,L";
          $code$$inline_163_code$$inline_173$$ = "this.l |= BIT_6;";
          break;
        case 246:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
          break;
        case 247:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 6,A";
          $code$$inline_163_code$$inline_173$$ = "this.a |= BIT_6;";
          break;
        case 248:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,B";
          $code$$inline_163_code$$inline_173$$ = "this.b |= BIT_7;";
          break;
        case 249:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,C";
          $code$$inline_163_code$$inline_173$$ = "this.c |= BIT_7;";
          break;
        case 250:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,D";
          $code$$inline_163_code$$inline_173$$ = "this.d |= BIT_7;";
          break;
        case 251:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,E";
          $code$$inline_163_code$$inline_173$$ = "this.e |= BIT_7;";
          break;
        case 252:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,H";
          $code$$inline_163_code$$inline_173$$ = "this.h |= BIT_7;";
          break;
        case 253:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,L";
          $code$$inline_163_code$$inline_173$$ = "this.l |= BIT_7;";
          break;
        case 254:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,(HL)";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
          break;
        case 255:
          $currAddr$$inline_171_inst$$inline_161_location$$23$$ = "SET 7,A", $code$$inline_163_code$$inline_173$$ = "this.a |= BIT_7;";
      }
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = {$opcode$:$code$$5_opcode$$inline_159_opcodesArray$$inline_169$$, $opcodes$:$_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$, $inst$:$currAddr$$inline_171_inst$$inline_161_location$$23$$, code:$code$$inline_163_code$$inline_173$$, $address$:$currAddr$$inline_162_target$$inline_172$$, $nextAddress$:$address$$inline_158_inst_opcode$$inline_168$$};
      $address$$inline_158_inst_opcode$$inline_168$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$inst$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.code;
      $defaultInstruction$$inline_179_opcodesArray$$ = $defaultInstruction$$inline_179_opcodesArray$$.concat($_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$nextAddress$;
      break;
    case 204:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_ZERO) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 205:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      $address$$8$$ += 2;
      break;
    case 206:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "ADC ," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.adc_a(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$++;
      break;
    case 207:
      $address$$inline_166_target$$46$$ = 8;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 208:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET NC";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $address$$inline_158_inst_opcode$$inline_168$$ = "POP DE";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) === 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 211:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$) + "),A";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self$$, $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$);
      $address$$8$$++;
      break;
    case 212:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) === 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 213:
      $address$$inline_158_inst_opcode$$inline_168$$ = "PUSH DE";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "SUB " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sub_a(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$++;
      break;
    case 215:
      $address$$inline_166_target$$46$$ = 16;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 216:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET C";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $address$$inline_158_inst_opcode$$inline_168$$ = "EXX";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 219:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self$$, $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$);
      $address$$8$$++;
      break;
    case 220:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_CARRY) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 221:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IX", $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$inst$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.code;
      $defaultInstruction$$inline_179_opcodesArray$$ = $defaultInstruction$$inline_179_opcodesArray$$.concat($_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$nextAddress$;
      break;
    case 222:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "SBC A," + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sbc_a(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$++;
      break;
    case 223:
      $address$$inline_166_target$$46$$ = 24;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 224:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET PO";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_PARITY) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $address$$inline_158_inst_opcode$$inline_168$$ = "POP HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_PARITY) === 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 227:
      $address$$inline_158_inst_opcode$$inline_168$$ = "EX (SP),HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "temp = this.h;this.h = this.readMem(this.sp + 0x01);this.writeMem(this.sp + 0x01, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
      break;
    case 228:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_PARITY) === 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 229:
      $address$$inline_158_inst_opcode$$inline_168$$ = "PUSH HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "AND (" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + "] | F_HALFCARRY;";
      $address$$8$$++;
      break;
    case 231:
      $address$$inline_166_target$$46$$ = 32;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 232:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET PE";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP (HL)";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.pc = this.getHL(); return;";
      $address$$8$$ = null;
      break;
    case 234:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_PARITY) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 235:
      $address$$inline_158_inst_opcode$$inline_168$$ = "EX DE,HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_PARITY) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 237:
      var $address$$inline_166_target$$46$$ = $address$$8$$, $address$$inline_158_inst_opcode$$inline_168$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$), $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = [$address$$inline_158_inst_opcode$$inline_168$$], $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "Unimplemented 0xED prefixed opcode", $currAddr$$inline_171_inst$$inline_161_location$$23$$ = $address$$inline_166_target$$46$$, 
      $currAddr$$inline_162_target$$inline_172$$ = null, $code$$inline_163_code$$inline_173$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_174$$ = "", $location$$inline_175$$ = 0;
      $address$$inline_166_target$$46$$++;
      switch($address$$inline_158_inst_opcode$$inline_168$$) {
        case 64:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN B,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
          break;
        case 65:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),B";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.b);";
          break;
        case 66:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "SBC HL,BC";
          $code$$inline_163_code$$inline_173$$ = "this.sbc16(this.getBC());";
          break;
        case 67:
          $location$$inline_175$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$);
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($location$$inline_175$$);
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD (" + $operand$$inline_174$$ + "),BC";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(" + $operand$$inline_174$$ + ", this.c);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_175$$ + 1) + ", this.b);";
          $address$$inline_166_target$$46$$ += 2;
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
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "NEG";
          $code$$inline_163_code$$inline_173$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "RETN / RETI";
          $code$$inline_163_code$$inline_173$$ = "this.pc = this.readMemWord(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
          $address$$inline_166_target$$46$$ = null;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IM 0";
          $code$$inline_163_code$$inline_173$$ = "this.im = 0x00;";
          break;
        case 71:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD I,A";
          $code$$inline_163_code$$inline_173$$ = "this.i = this.a;";
          break;
        case 72:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN C,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
          break;
        case 73:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),C";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.c);";
          break;
        case 74:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "ADC HL,BC";
          $code$$inline_163_code$$inline_173$$ = "this.adc16(this.getBC());";
          break;
        case 75:
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$));
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD BC,(" + $operand$$inline_174$$ + ")";
          $code$$inline_163_code$$inline_173$$ = "this.setBC(this.readMemWord(" + $operand$$inline_174$$ + "));";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 79:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD R,A";
          $code$$inline_163_code$$inline_173$$ = "this.r = this.a;";
          break;
        case 80:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN D,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
          break;
        case 81:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),D";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.d);";
          break;
        case 82:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "SBC HL,DE";
          $code$$inline_163_code$$inline_173$$ = "this.sbc16(this.getDE());";
          break;
        case 83:
          $location$$inline_175$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$);
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($location$$inline_175$$);
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD (" + $operand$$inline_174$$ + "),DE";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(" + $operand$$inline_174$$ + ", this.e);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_175$$ + 1) + ", this.d);";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 86:
        ;
        case 118:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IM 1";
          $code$$inline_163_code$$inline_173$$ = "this.im = 0x01;";
          break;
        case 87:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD A,I";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
          break;
        case 88:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN E,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
          break;
        case 89:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),E";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.e);";
          break;
        case 90:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "ADC HL,DE";
          $code$$inline_163_code$$inline_173$$ = "this.adc16(this.getDE());";
          break;
        case 91:
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$));
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD DE,(" + $operand$$inline_174$$ + ")";
          $code$$inline_163_code$$inline_173$$ = "this.setDE(this.readMemWord(" + $operand$$inline_174$$ + "));";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 95:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD A,R";
          $code$$inline_163_code$$inline_173$$ = "this.a = JSSMS.Utils.rndInt(0xFF);this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
          break;
        case 96:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN H,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
          break;
        case 97:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),H";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.h);";
          break;
        case 98:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "SBC HL,HL";
          $code$$inline_163_code$$inline_173$$ = "this.sbc16(this.getHL());";
          break;
        case 99:
          $location$$inline_175$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$);
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($location$$inline_175$$);
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD (" + $operand$$inline_174$$ + "),HL";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(" + $operand$$inline_174$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_175$$ + 1) + ", this.h);";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 103:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "RRD";
          $code$$inline_163_code$$inline_173$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 104:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN L,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
          break;
        case 105:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),L";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.l);";
          break;
        case 106:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "ADC HL,HL";
          $code$$inline_163_code$$inline_173$$ = "this.adc16(this.getHL());";
          break;
        case 107:
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$));
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD HL,(" + $operand$$inline_174$$ + ")";
          $code$$inline_163_code$$inline_173$$ = "this.setHL(this.readMemWord(" + $operand$$inline_174$$ + "));";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 111:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "RLD";
          $code$$inline_163_code$$inline_173$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 113:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),0";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, 0);";
          break;
        case 114:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "SBC HL,SP";
          $code$$inline_163_code$$inline_173$$ = "this.sbc16(this.sp);";
          break;
        case 115:
          $location$$inline_175$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$);
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($location$$inline_175$$);
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD (" + $operand$$inline_174$$ + "),SP";
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(" + $operand$$inline_174$$ + ", this.sp & 0xFF);this.writeMem(" + $JSSMS$Utils$toHex$$($location$$inline_175$$ + 1) + ", this.sp >> 8);";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 120:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IN A,(C)";
          $code$$inline_163_code$$inline_173$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 121:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUT (C),A";
          $code$$inline_163_code$$inline_173$$ = "this.port.out(this.c, this.a);";
          break;
        case 122:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "ADC HL,SP";
          $code$$inline_163_code$$inline_173$$ = "this.adc16(this.sp);";
          break;
        case 123:
          $operand$$inline_174$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_166_target$$46$$));
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LD SP,(" + $operand$$inline_174$$ + ")";
          $code$$inline_163_code$$inline_173$$ = "this.sp = this.readMemWord(" + $operand$$inline_174$$ + ");";
          $address$$inline_166_target$$46$$ += 2;
          break;
        case 160:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LDI";
          $code$$inline_163_code$$inline_173$$ = "temp = this.readMem(this.getHL());this.writeMem(this.getDE(), temp);this.decBC();this.incDE();this.incHL();temp = (temp + this.a) & 0xFF;this.f = (this.f & 0xC1) | (this.getBC() ? F_PARITY : 0) | (temp & 0x08) | ((temp & 0x02) ? 0x20 : 0);";
          break;
        case 161:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "CPI";
          $code$$inline_163_code$$inline_173$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
          break;
        case 162:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "INI";
          $code$$inline_163_code$$inline_173$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 163:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUTI";
          $code$$inline_163_code$$inline_173$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 168:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LDD";
          break;
        case 169:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "CPD";
          break;
        case 170:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "IND";
          $code$$inline_163_code$$inline_173$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 171:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OUTD";
          $code$$inline_163_code$$inline_173$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 176:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LDIR";
          $currAddr$$inline_162_target$$inline_172$$ = $address$$inline_166_target$$46$$ - 2;
          $code$$inline_163_code$$inline_173$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();if (this.getBC() != 0x00) {this.tstates -= 0x05;this.f |= F_PARITY;return;} else {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
          break;
        case 177:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "CPIR";
          $currAddr$$inline_162_target$$inline_172$$ = $address$$inline_166_target$$46$$ - 2;
          $code$$inline_163_code$$inline_173$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);" + ("if ((temp & F_PARITY) != 0x00 && (this.f & F_ZERO) === 0x00) {this.tstates -= 0x05;this.pc = " + $JSSMS$Utils$toHex$$($currAddr$$inline_162_target$$inline_172$$) + ";return;}");
          $code$$inline_163_code$$inline_173$$ += "this.f = (this.f & 0xF8) | temp;";
          break;
        case 178:
          $currAddr$$inline_162_target$$inline_172$$ = $address$$inline_166_target$$46$$ - 2;
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "INIR";
          $code$$inline_163_code$$inline_173$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 179:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OTIR";
          $currAddr$$inline_162_target$$inline_172$$ = $address$$inline_166_target$$46$$ - 2;
          $code$$inline_163_code$$inline_173$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}";
          $code$$inline_163_code$$inline_173$$ += "if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 184:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "LDDR";
          break;
        case 185:
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "CPDR";
          break;
        case 186:
          $currAddr$$inline_162_target$$inline_172$$ = $address$$inline_166_target$$46$$ - 2;
          $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "INDR";
          $code$$inline_163_code$$inline_173$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 187:
          $currAddr$$inline_162_target$$inline_172$$ = $address$$inline_166_target$$46$$ - 2, $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = "OTDR", $code$$inline_163_code$$inline_173$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      }
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = {$opcode$:$address$$inline_158_inst_opcode$$inline_168$$, $opcodes$:$code$$5_opcode$$inline_159_opcodesArray$$inline_169$$, $inst$:$_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$, code:$code$$inline_163_code$$inline_173$$, $address$:$currAddr$$inline_171_inst$$inline_161_location$$23$$, $nextAddress$:$address$$inline_166_target$$46$$, target:$currAddr$$inline_162_target$$inline_172$$};
      $address$$inline_166_target$$46$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.target;
      $address$$inline_158_inst_opcode$$inline_168$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$inst$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.code;
      $defaultInstruction$$inline_179_opcodesArray$$ = $defaultInstruction$$inline_179_opcodesArray$$.concat($_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$nextAddress$;
      break;
    case 238:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "XOR " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + "];";
      $address$$8$$++;
      break;
    case 239:
      $address$$inline_166_target$$46$$ = 40;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 240:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET P";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_SIGN) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $address$$inline_158_inst_opcode$$inline_168$$ = "POP AF";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.setAF(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_SIGN) === 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 243:
      $address$$inline_158_inst_opcode$$inline_168$$ = "DI";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_SIGN) === 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 245:
      $address$$inline_158_inst_opcode$$inline_168$$ = "PUSH AF";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "OR " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + "];";
      $address$$8$$++;
      break;
    case 247:
      $address$$inline_166_target$$46$$ = 48;
      $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$);
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
      break;
    case 248:
      $address$$inline_158_inst_opcode$$inline_168$$ = "RET M";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $address$$inline_158_inst_opcode$$inline_168$$ = "LD SP,HL";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_SIGN) != 0x00) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 251:
      $address$$inline_158_inst_opcode$$inline_168$$ = "EI";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $address$$inline_166_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ")";
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "if ((this.f & F_SIGN) != 0x00) {this.tstates -= 0x07;this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 253:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IY", $address$$8$$);
      $address$$inline_158_inst_opcode$$inline_168$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$inst$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.code;
      $defaultInstruction$$inline_179_opcodesArray$$ = $defaultInstruction$$inline_179_opcodesArray$$.concat($_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$.$nextAddress$;
      break;
    case 254:
      $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $address$$inline_158_inst_opcode$$inline_168$$ = "CP " + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$;
      $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.cp_a(" + $_inst_inst$$inline_170_opcodesArray$$inline_160_operand$$ + ");";
      $address$$8$$++;
      break;
    case 255:
      $address$$inline_166_target$$46$$ = 56, $address$$inline_158_inst_opcode$$inline_168$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$), $code$$5_opcode$$inline_159_opcodesArray$$inline_169$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$8$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_166_target$$46$$) + "; return;";
  }
  var $opcode$$6_options$$inline_177$$ = {$opcode$:$opcode$$6_options$$inline_177$$, $opcodes$:$defaultInstruction$$inline_179_opcodesArray$$, $inst$:$address$$inline_158_inst_opcode$$inline_168$$, code:$code$$5_opcode$$inline_159_opcodesArray$$inline_169$$, $address$:$currAddr_hexOpcodes$$inline_181$$, $nextAddress$:$address$$8$$, target:$address$$inline_166_target$$46$$}, $defaultInstruction$$inline_179_opcodesArray$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", 
  $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""}, $prop$$inline_180$$, $currAddr_hexOpcodes$$inline_181$$ = "";
  for ($prop$$inline_180$$ in $defaultInstruction$$inline_179_opcodesArray$$) {
    void 0 !== $opcode$$6_options$$inline_177$$[$prop$$inline_180$$] && ($defaultInstruction$$inline_179_opcodesArray$$[$prop$$inline_180$$] = $opcode$$6_options$$inline_177$$[$prop$$inline_180$$]);
  }
  $defaultInstruction$$inline_179_opcodesArray$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_179_opcodesArray$$.$address$);
  $defaultInstruction$$inline_179_opcodesArray$$.$opcodes$.length && ($currAddr_hexOpcodes$$inline_181$$ = $defaultInstruction$$inline_179_opcodesArray$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
  $defaultInstruction$$inline_179_opcodesArray$$.label = $defaultInstruction$$inline_179_opcodesArray$$.$hexAddress$ + " " + $currAddr_hexOpcodes$$inline_181$$ + $defaultInstruction$$inline_179_opcodesArray$$.$inst$;
  return $defaultInstruction$$inline_179_opcodesArray$$;
}
function $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_parseInstructions$self$$) {
  $JSSMS$Utils$console$time$$("Instructions parsing");
  var $romSize$$ = 16384 * $JSCompiler_StaticMethods_parseInstructions$self$$.$rom$.length, $instruction$$, $currentAddress$$, $i$$13$$ = 0, $addresses$$ = [], $entryPoints$$ = [0, 56, 102];
  for ($entryPoints$$.forEach(function($entryPoint$$) {
    $addresses$$.push($entryPoint$$);
  });$addresses$$.length;) {
    $currentAddress$$ = $addresses$$.shift(), $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$currentAddress$$] || ($currentAddress$$ >= $romSize$$ || 65 <= $currentAddress$$ >> 10 ? $JSSMS$Utils$console$log$$("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$)) : ($instruction$$ = $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_parseInstructions$self$$, $currentAddress$$), $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$currentAddress$$] = 
    $instruction$$, null !== $instruction$$.$nextAddress$ && $addresses$$.push($instruction$$.$nextAddress$), null !== $instruction$$.target && $addresses$$.push($instruction$$.target)));
  }
  for ($entryPoints$$.forEach(function($entryPoint$$1$$) {
    this.$instructions$[$entryPoint$$1$$] && (this.$instructions$[$entryPoint$$1$$].$isJumpTarget$ = !0);
  }, $JSCompiler_StaticMethods_parseInstructions$self$$);$i$$13$$ < $romSize$$;$i$$13$$++) {
    $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$] && (null !== $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].$nextAddress$ && $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].$nextAddress$] && $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].$nextAddress$].$jumpTargetNb$++, 
    null !== $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].target && ($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].target] ? ($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].target].$isJumpTarget$ = !0, $JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].target].$jumpTargetNb$++) : 
    $JSSMS$Utils$console$log$$("Invalid target address", $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_parseInstructions$self$$.$instructions$[$i$$13$$].target))));
  }
  $JSSMS$Utils$console$timeEnd$$("Instructions parsing");
}
;function $JSSMS$Keyboard$$($sms$$1$$) {
  this.$main$ = $sms$$1$$;
  this.$ggstart$ = this.$a$ = this.$controller1$ = 0;
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$ggstart$ = this.$a$ = this.$controller1$ = 255;
  this.$pause_button$ = !1;
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
      return;
  }
  $evt$$16$$.preventDefault();
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
      return;
  }
  $evt$$17$$.preventDefault();
}};
var $NO_ANTIALIAS$$ = Number.MIN_VALUE, $PSG_VOLUME$$ = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0];
function $JSSMS$SN76489$$($sms$$2$$) {
  this.$main$ = $sms$$2$$;
  this.$j$ = this.$q$ = 0;
  this.$f$ = Array(8);
  this.$g$ = 0;
  this.$a$ = Array(4);
  this.$i$ = Array(4);
  this.$n$ = Array(3);
  this.$o$ = 16;
  this.$m$ = 32768;
  this.$p$ = Array(4);
}
$JSSMS$SN76489$$.prototype = {$s$:function $$JSSMS$SN76489$$$$$s$$($clockSpeed$$, $sampleRate$$) {
  this.$q$ = ($clockSpeed$$ << 8) / 16 / $sampleRate$$;
  this.$g$ = this.$j$ = 0;
  this.$o$ = 16;
  this.$m$ = 32768;
  for (var $i$$16$$ = 0;4 > $i$$16$$;$i$$16$$++) {
    this.$f$[$i$$16$$ << 1] = 1, this.$f$[($i$$16$$ << 1) + 1] = 15, this.$a$[$i$$16$$] = 0, this.$i$[$i$$16$$] = 1, 3 != $i$$16$$ && (this.$n$[$i$$16$$] = $NO_ANTIALIAS$$);
  }
}};
function $JSSMS$Vdp$$($i$$inline_184_i$$inline_187_sms$$3$$) {
  this.$main$ = $i$$inline_184_i$$inline_187_sms$$3$$;
  var $i$$18_r$$inline_188$$ = 0;
  this.$Q$ = 0;
  this.$i$ = new $JSSMS$Utils$Uint8Array$$(16384);
  this.$a$ = new $JSSMS$Utils$Uint8Array$$(96);
  for ($i$$18_r$$inline_188$$ = 0;96 > $i$$18_r$$inline_188$$;$i$$18_r$$inline_188$$++) {
    this.$a$[$i$$18_r$$inline_188$$] = 255;
  }
  this.$g$ = new $JSSMS$Utils$Uint8Array$$(16);
  this.$m$ = 0;
  this.$q$ = !1;
  this.$G$ = this.$t$ = this.$P$ = this.$I$ = this.$j$ = this.$o$ = 0;
  this.$F$ = new $JSSMS$Utils$Uint8Array$$(256);
  this.$N$ = 0;
  this.$f$ = $i$$inline_184_i$$inline_187_sms$$3$$.$a$.$canvasImageData$.data;
  this.$W$ = new $JSSMS$Utils$Uint8Array$$(64);
  this.$V$ = new $JSSMS$Utils$Uint8Array$$(64);
  this.$U$ = new $JSSMS$Utils$Uint8Array$$(64);
  this.$T$ = new $JSSMS$Utils$Uint8Array$$(256);
  this.$S$ = new $JSSMS$Utils$Uint8Array$$(256);
  this.$R$ = new $JSSMS$Utils$Uint8Array$$(16);
  this.$n$ = this.$O$ = this.$J$ = 0;
  this.$p$ = !1;
  this.$v$ = Array(192);
  for ($i$$18_r$$inline_188$$ = 0;192 > $i$$18_r$$inline_188$$;$i$$18_r$$inline_188$$++) {
    this.$v$[$i$$18_r$$inline_188$$] = new $JSSMS$Utils$Uint8Array$$(25);
  }
  this.$M$ = Array(512);
  this.$K$ = new $JSSMS$Utils$Uint8Array$$(512);
  for ($i$$inline_184_i$$inline_187_sms$$3$$ = this.$s$ = this.$w$ = 0;512 > $i$$inline_184_i$$inline_187_sms$$3$$;$i$$inline_184_i$$inline_187_sms$$3$$++) {
    this.$M$[$i$$inline_184_i$$inline_187_sms$$3$$] = new $JSSMS$Utils$Uint8Array$$(64);
  }
  var $g$$inline_189$$, $b$$inline_190$$;
  for ($i$$inline_184_i$$inline_187_sms$$3$$ = 0;64 > $i$$inline_184_i$$inline_187_sms$$3$$;$i$$inline_184_i$$inline_187_sms$$3$$++) {
    $i$$18_r$$inline_188$$ = $i$$inline_184_i$$inline_187_sms$$3$$ & 3, $g$$inline_189$$ = $i$$inline_184_i$$inline_187_sms$$3$$ >> 2 & 3, $b$$inline_190$$ = $i$$inline_184_i$$inline_187_sms$$3$$ >> 4 & 3, this.$W$[$i$$inline_184_i$$inline_187_sms$$3$$] = 85 * $i$$18_r$$inline_188$$ & 255, this.$V$[$i$$inline_184_i$$inline_187_sms$$3$$] = 85 * $g$$inline_189$$ & 255, this.$U$[$i$$inline_184_i$$inline_187_sms$$3$$] = 85 * $b$$inline_190$$ & 255;
  }
  for ($i$$inline_184_i$$inline_187_sms$$3$$ = 0;256 > $i$$inline_184_i$$inline_187_sms$$3$$;$i$$inline_184_i$$inline_187_sms$$3$$++) {
    $g$$inline_189$$ = $i$$inline_184_i$$inline_187_sms$$3$$ & 15, $b$$inline_190$$ = $i$$inline_184_i$$inline_187_sms$$3$$ >> 4 & 15, this.$T$[$i$$inline_184_i$$inline_187_sms$$3$$] = ($g$$inline_189$$ << 4 | $g$$inline_189$$) & 255, this.$S$[$i$$inline_184_i$$inline_187_sms$$3$$] = ($b$$inline_190$$ << 4 | $b$$inline_190$$) & 255;
  }
  for ($i$$inline_184_i$$inline_187_sms$$3$$ = 0;16 > $i$$inline_184_i$$inline_187_sms$$3$$;$i$$inline_184_i$$inline_187_sms$$3$$++) {
    this.$R$[$i$$inline_184_i$$inline_187_sms$$3$$] = ($i$$inline_184_i$$inline_187_sms$$3$$ << 4 | $i$$inline_184_i$$inline_187_sms$$3$$) & 255;
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$19$$;
  this.$q$ = !0;
  for ($i$$19$$ = this.$I$ = this.$m$ = this.$G$ = this.$j$ = 0;16 > $i$$19$$;$i$$19$$++) {
    this.$g$[$i$$19$$] = 0;
  }
  this.$g$[2] = 14;
  this.$g$[5] = 126;
  this.$main$.$cpu$.$J$ = !1;
  this.$p$ = !0;
  this.$w$ = 512;
  this.$s$ = -1;
  for ($i$$19$$ = 0;16384 > $i$$19$$;$i$$19$$++) {
    this.$i$[$i$$19$$] = 0;
  }
  for ($i$$19$$ = 0;196608 > $i$$19$$;$i$$19$$ += 4) {
    this.$f$[$i$$19$$] = 0, this.$f$[$i$$19$$ + 1] = 0, this.$f$[$i$$19$$ + 2] = 0, this.$f$[$i$$19$$ + 3] = 255;
  }
}};
function $JSCompiler_StaticMethods_forceFullRedraw$$($JSCompiler_StaticMethods_forceFullRedraw$self$$) {
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$N$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$g$[2] & 14) << 10;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$w$ = 0;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$s$ = 511;
  for (var $i$$20$$ = 0;512 > $i$$20$$;$i$$20$$++) {
    $JSCompiler_StaticMethods_forceFullRedraw$self$$.$K$[$i$$20$$] = 1;
  }
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$n$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$g$[5] & -130) << 7;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$p$ = !0;
}
;function $JSSMS$DummyUI$$($sms$$4$$) {
  this.$main$ = $sms$$4$$;
  this.reset = function $this$reset$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  };
  this.$writeFrame$ = function $this$$writeFrame$$() {
  };
  this.$updateDisassembly$ = function $this$$updateDisassembly$$() {
  };
  this.$canvasImageData$ = {data:[]};
}
window.$ && ($.fn.JSSMSUI = function $$$fn$JSSMSUI$($roms$$) {
  function $UI$$($root$$2_sms$$5$$) {
    function $touchStart$$($key$$18$$) {
      return function($evt$$18$$) {
        $self$$4$$.$main$.$keyboard$.$controller1$ &= ~$key$$18$$;
        $evt$$18$$.preventDefault();
      };
    }
    function $touchEnd$$($key$$19$$) {
      return function($evt$$19$$) {
        $self$$4$$.$main$.$keyboard$.$controller1$ |= $key$$19$$;
        $evt$$19$$.preventDefault();
      };
    }
    this.$main$ = $root$$2_sms$$5$$;
    if ("[object OperaMini]" == Object.prototype.toString.call(window.operamini)) {
      $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser can\'t run this emulator. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>');
    } else {
      var $self$$4$$ = this;
      $root$$2_sms$$5$$ = $("<div></div>");
      var $screenContainer$$ = $('<div id="screen"></div>'), $gamepadContainer$$ = $('<div class="gamepad"><div class="direction"><div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div></div><div class="buttons"><div class="start"></div><div class="fire1"></div><div class="fire2"></div></div></div>'), $controls$$ = $('<div id="controls"></div>'), $fullscreenSupport$$ = $JSSMS$Utils$getPrefix$$(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), 
      $requestAnimationFramePrefix_startButton$$ = $JSSMS$Utils$getPrefix$$(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame"], window), $i$$27$$;
      if ($requestAnimationFramePrefix_startButton$$) {
        this.requestAnimationFrame = window[$requestAnimationFramePrefix_startButton$$].bind(window);
      } else {
        var $lastTime$$ = 0;
        this.requestAnimationFrame = function $this$requestAnimationFrame$($callback$$55$$) {
          var $currTime_timeToCall$$ = $JSSMS$Utils$getTimestamp$$(), $currTime_timeToCall$$ = Math.max(0, 1E3 / 60 - ($currTime_timeToCall$$ - $lastTime$$));
          window.setTimeout(function() {
            $lastTime$$ = $JSSMS$Utils$getTimestamp$$();
            $callback$$55$$();
          }, $currTime_timeToCall$$);
        };
      }
      this.screen = $("<canvas width=256 height=192 moz-opaque></canvas>");
      this.$canvasContext$ = this.screen[0].getContext("2d");
      this.$canvasContext$.webkitImageSmoothingEnabled = !1;
      this.$canvasContext$.mozImageSmoothingEnabled = !1;
      this.$canvasContext$.imageSmoothingEnabled = !1;
      if (this.$canvasContext$.getImageData) {
        this.$canvasImageData$ = this.$canvasContext$.getImageData(0, 0, 256, 192);
        this.$gamepad$ = {$u$:{$e$:$(".up", $gamepadContainer$$), $k$:1}, $r$:{$e$:$(".right", $gamepadContainer$$), $k$:8}, $d$:{$e$:$(".down", $gamepadContainer$$), $k$:2}, $l$:{$e$:$(".left", $gamepadContainer$$), $k$:4}, 1:{$e$:$(".fire1", $gamepadContainer$$), $k$:16}, 2:{$e$:$(".fire2", $gamepadContainer$$), $k$:32}};
        $requestAnimationFramePrefix_startButton$$ = $(".start", $gamepadContainer$$);
        this.$romContainer$ = $('<div id="romSelector"></div>');
        this.$romSelect$ = $("<select></select>").change(function() {
          $self$$4$$.$loadROM$();
        });
        this.buttons = Object.create(null);
        this.buttons.start = $('<input type="button" value="Start" class="btn btn-primary" disabled="disabled">').click(function() {
          $self$$4$$.$main$.$isRunning$ ? ($self$$4$$.$main$.stop(), $self$$4$$.updateStatus("Paused"), $self$$4$$.buttons.start.attr("value", "Start")) : ($self$$4$$.$main$.start(), $self$$4$$.buttons.start.attr("value", "Pause"));
        });
        this.buttons.reset = $('<input type="button" value="Reset" class="btn" disabled="disabled">').click(function() {
          "" !== $self$$4$$.$main$.$romData$ && "" !== $self$$4$$.$main$.$romFileName$ && $JSCompiler_StaticMethods_readRomDirectly$$($self$$4$$.$main$, $self$$4$$.$main$.$romData$, $self$$4$$.$main$.$romFileName$) ? ($self$$4$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$4$$.$main$.$vdp$), $self$$4$$.$main$.start()) : $(this).attr("disabled", "disabled");
        });
        this.$dissambler$ = $('<div id="dissambler"></div>');
        $($parent$$2$$).after(this.$dissambler$);
        this.buttons.$nextStep$ = $('<input type="button" value="Next step" class="btn" disabled="disabled">').click(function() {
          $self$$4$$.$main$.$nextStep$();
        });
        this.$main$.$soundEnabled$ && (this.buttons.$sound$ = $('<input type="button" value="Enable sound" class="btn" disabled="disabled">').click(function() {
          $self$$4$$.$main$.$soundEnabled$ ? ($self$$4$$.$main$.$soundEnabled$ = !1, $self$$4$$.buttons.$sound$.attr("value", "Enable sound")) : ($self$$4$$.$main$.$soundEnabled$ = !0, $self$$4$$.buttons.$sound$.attr("value", "Disable sound"));
        }));
        $fullscreenSupport$$ ? this.buttons.$fullscreen$ = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
          var $screen$$1$$ = $screenContainer$$[0];
          $screen$$1$$.requestFullscreen ? $screen$$1$$.requestFullscreen() : $screen$$1$$.mozRequestFullScreen ? $screen$$1$$.mozRequestFullScreen() : $screen$$1$$.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }) : (this.$zoomed$ = !1, this.buttons.zoom = $('<input type="button" value="Zoom in" class="btn hidden-phone">').click(function() {
          $self$$4$$.$zoomed$ ? ($self$$4$$.screen.animate({width:"256px", height:"192px"}, function() {
            $(this).removeAttr("style");
          }), $self$$4$$.buttons.zoom.attr("value", "Zoom in")) : ($self$$4$$.screen.animate({width:"512px", height:"384px"}), $self$$4$$.buttons.zoom.attr("value", "Zoom out"));
          $self$$4$$.$zoomed$ = !$self$$4$$.$zoomed$;
        }));
        for ($i$$27$$ in this.buttons) {
          this.buttons[$i$$27$$].appendTo($controls$$);
        }
        this.log = $('<div id="status"></div>');
        this.screen.appendTo($screenContainer$$);
        $gamepadContainer$$.appendTo($screenContainer$$);
        $screenContainer$$.appendTo($root$$2_sms$$5$$);
        this.$romContainer$.appendTo($root$$2_sms$$5$$);
        $controls$$.appendTo($root$$2_sms$$5$$);
        this.log.appendTo($root$$2_sms$$5$$);
        $root$$2_sms$$5$$.appendTo($($parent$$2$$));
        void 0 !== $roms$$ && this.$setRoms$($roms$$);
        $(document).bind("keydown", function($evt$$20$$) {
          $self$$4$$.$main$.$keyboard$.keydown($evt$$20$$);
        }).bind("keyup", function($evt$$21$$) {
          $self$$4$$.$main$.$keyboard$.keyup($evt$$21$$);
        });
        for ($i$$27$$ in this.$gamepad$) {
          this.$gamepad$[$i$$27$$].$e$.on("mousedown touchstart", $touchStart$$(this.$gamepad$[$i$$27$$].$k$)).on("mouseup touchend", $touchEnd$$(this.$gamepad$[$i$$27$$].$k$));
        }
        $requestAnimationFramePrefix_startButton$$.on("mousedown touchstart", function($evt$$22$$) {
          $self$$4$$.$main$.$is_sms$ ? $self$$4$$.$main$.$pause_button$ = !0 : $self$$4$$.$main$.$keyboard$.$ggstart$ &= -129;
          $evt$$22$$.preventDefault();
        }).on("mouseup touchend", function($evt$$23$$) {
          $self$$4$$.$main$.$is_sms$ || ($self$$4$$.$main$.$keyboard$.$ggstart$ |= 128);
          $evt$$23$$.preventDefault();
        });
      } else {
        $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest version of Firefox, Google Chrome, Opera or Safari!</div>');
      }
    }
  }
  var $parent$$2$$ = this;
  $UI$$.prototype = {reset:function $$UI$$$$reset$() {
    this.screen[0].width = 256;
    this.screen[0].height = 192;
    this.log.empty();
    this.$dissambler$.empty();
  }, $setRoms$:function $$UI$$$$$setRoms$$($roms$$1$$) {
    var $groupName$$, $optgroup$$, $length$$19$$, $i$$28$$, $count$$9$$ = 0;
    this.$romSelect$.children().remove();
    $("<option>Select a ROM...</option>").appendTo(this.$romSelect$);
    for ($groupName$$ in $roms$$1$$) {
      if ($roms$$1$$.hasOwnProperty($groupName$$)) {
        $optgroup$$ = $("<optgroup></optgroup>").attr("label", $groupName$$);
        $length$$19$$ = $roms$$1$$[$groupName$$].length;
        for ($i$$28$$ = 0;$i$$28$$ < $length$$19$$;$i$$28$$++) {
          $("<option>" + $roms$$1$$[$groupName$$][$i$$28$$][0] + "</option>").attr("value", $roms$$1$$[$groupName$$][$i$$28$$][1]).appendTo($optgroup$$);
        }
        $optgroup$$.appendTo(this.$romSelect$);
      }
      $count$$9$$++;
    }
    $count$$9$$ && this.$romSelect$.appendTo(this.$romContainer$);
  }, $loadROM$:function $$UI$$$$$loadROM$$() {
    var $self$$5$$ = this;
    this.updateStatus("Downloading...");
    $.ajax({url:encodeURI(this.$romSelect$.val()), xhr:function() {
      var $xhr$$1$$ = $.ajaxSettings.xhr();
      void 0 !== $xhr$$1$$.overrideMimeType && $xhr$$1$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$5$$.xhr = $xhr$$1$$;
    }, complete:function($xhr$$2$$, $status$$) {
      var $data$$35$$;
      "error" == $status$$ ? $self$$5$$.updateStatus("The selected ROM file could not be loaded.") : ($data$$35$$ = $xhr$$2$$.responseText, $self$$5$$.$main$.stop(), $JSCompiler_StaticMethods_readRomDirectly$$($self$$5$$.$main$, $data$$35$$, $self$$5$$.$romSelect$.val()), $self$$5$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$5$$.$main$.$vdp$), $self$$5$$.enable());
    }});
  }, enable:function $$UI$$$$enable$() {
    this.buttons.start.removeAttr("disabled");
    this.buttons.start.attr("value", "Start");
    this.buttons.reset.removeAttr("disabled");
    this.buttons.$nextStep$.removeAttr("disabled");
    this.$main$.$soundEnabled$ && (this.buttons.$sound$ ? this.buttons.$sound$.attr("value", "Disable sound") : this.buttons.$sound$.attr("value", "Enable sound"));
  }, updateStatus:function $$UI$$$$updateStatus$($s$$3$$) {
    this.log.text($s$$3$$);
  }, $writeFrame$:function() {
    var $hiddenPrefix$$ = $JSSMS$Utils$getPrefix$$(["hidden", "mozHidden", "webkitHidden", "msHidden"]);
    return $hiddenPrefix$$ ? function() {
      document[$hiddenPrefix$$] || this.$canvasContext$.putImageData(this.$canvasImageData$, 0, 0);
    } : function() {
      this.$canvasContext$.putImageData(this.$canvasImageData$, 0, 0);
    };
  }(), $updateDisassembly$:function $$UI$$$$$updateDisassembly$$($currentAddress$$1$$) {
    for (var $instructions$$ = this.$main$.$cpu$.$instructions$, $length$$20$$ = $instructions$$.length, $html$$ = "", $i$$29$$ = 8 > $currentAddress$$1$$ ? 0 : $currentAddress$$1$$ - 8, $num$$4$$ = 0;16 > $num$$4$$ && $i$$29$$ <= $length$$20$$;$i$$29$$++) {
      $instructions$$[$i$$29$$] && ($html$$ += "<div" + ($instructions$$[$i$$29$$].$address$ == $currentAddress$$1$$ ? ' class="current"' : "") + ">" + $instructions$$[$i$$29$$].$hexAddress$ + ($instructions$$[$i$$29$$].$isJumpTarget$ ? ":" : " ") + "<code>" + $instructions$$[$i$$29$$].$inst$ + "</code></div>", $num$$4$$++);
    }
    this.$dissambler$.html($html$$);
  }};
  return $UI$$;
});
function $JSSMS$Ports$$($sms$$6$$) {
  this.$main$ = $sms$$6$$;
  this.$vdp$ = $sms$$6$$.$vdp$;
  this.$f$ = $sms$$6$$.$f$;
  this.$keyboard$ = $sms$$6$$.$keyboard$;
  this.$a$ = [];
}
$JSSMS$Ports$$.prototype = {reset:function $$JSSMS$Ports$$$$reset$() {
  this.$a$ = Array(2);
}};
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_in_$self$$, $port$$3$$) {
  if ($JSCompiler_StaticMethods_in_$self$$.$main$.$is_gg$ && 7 > $port$$3$$) {
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
        return 255;
    }
  }
  switch($port$$3$$ & 193) {
    case 64:
      var $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
        if (0 == $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$Q$) {
          if (218 < $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$t$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$t$ - 6;
            break a;
          }
        } else {
          if (242 < $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$t$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$t$ - 57;
            break a;
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$t$;
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$q$ = !0;
      var $statuscopy$$inline_267_value$$inline_264$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$P$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$P$ = $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$i$[$JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$j$++ & 
      16383] & 255;
      return $statuscopy$$inline_267_value$$inline_264$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$, $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$q$ = !0, $statuscopy$$inline_267_value$$inline_264$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$m$, 
      $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$m$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_266_JSCompiler_StaticMethods_dataRead$self$$inline_263_JSCompiler_StaticMethods_getVCount$self$$inline_261_JSCompiler_inline_result$$7$$.$main$.$cpu$.$J$ = !1, $statuscopy$$inline_267_value$$inline_264$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$a$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$a$[0] | $JSCompiler_StaticMethods_in_$self$$.$a$[1];
  }
  return 255;
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$, $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$, $reg$$inline_277_value$$82$$) {
  if (!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$)) {
    switch($address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[0] = ($reg$$inline_277_value$$82$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[1] = $reg$$inline_277_value$$82$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$vdp$;
        $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$q$ = !0;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$I$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ & 16383;
            if ($reg$$inline_277_value$$82$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$i$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$] & 255)) {
              if ($address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$ && $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$p$ = !0;
              } else {
                if ($address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$ + 128 && $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$p$ = !0;
                } else {
                  var $tileIndex$$inline_273$$ = $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$K$[$tileIndex$$inline_273$$] = 1;
                  $tileIndex$$inline_273$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$w$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$w$ = $tileIndex$$inline_273$$);
                  $tileIndex$$inline_273$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$s$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$s$ = $tileIndex$$inline_273$$);
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$i$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$] = $reg$$inline_277_value$$82$$;
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$W$[$reg$$inline_277_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$V$[$reg$$inline_277_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$U$[$reg$$inline_277_value$$82$$]) : 
            ($address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ & 63) >> 1), 0 === ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$T$[$reg$$inline_277_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$S$[$reg$$inline_277_value$$82$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$R$[$reg$$inline_277_value$$82$$]);
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$q$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$q$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ = $reg$$inline_277_value$$82$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ & 16128 | $reg$$inline_277_value$$82$$;
        } else {
          if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$q$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$I$ = $reg$$inline_277_value$$82$$ >> 6 & 3, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ | $reg$$inline_277_value$$82$$ << 8, 0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$I$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$P$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$i$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$j$++ & 
            16383] & 255;
          } else {
            if (2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$I$) {
              $reg$$inline_277_value$$82$$ &= 15;
              switch($reg$$inline_277_value$$82$$) {
                case 0:
                  0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$m$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$J$ = 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ & 
                  16));
                  break;
                case 1:
                  0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$m$ & 128) && 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$J$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$[$reg$$inline_277_value$$82$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$p$ = !0);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$N$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ & -130) << 7, $address$$inline_272_old$$inline_278_port$$2_temp$$inline_271$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$n$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$p$ = !0);
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$[$reg$$inline_277_value$$82$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$;
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$, 0 !== ($reg$$inline_277_value$$82$$ & 128) ? 
          ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$ = $reg$$inline_277_value$$82$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$] = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$] & 1008 | $reg$$inline_277_value$$82$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$] = 
          0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$] & 15 | ($reg$$inline_277_value$$82$$ & 63) << 4 : 
          $reg$$inline_277_value$$82$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$g$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$o$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$f$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_280_JSCompiler_StaticMethods_controlWrite$self$$inline_275_JSCompiler_StaticMethods_dataWrite$self$$inline_269_JSCompiler_StaticMethods_out$self$$.$m$ = 
              32768;
          }
        }
      ;
    }
  }
}
;var $Bytecode$$ = function() {
  function $Bytecode$$1$$($address$$18$$, $page$$) {
    this.$address$ = $address$$18$$;
    this.page = $page$$;
    this.$opcode$ = [];
    this.target = this.$nextAddress$ = this.$operand$ = null;
    this.$isJumpTarget$ = this.$canEnd$ = this.$isFunctionEnder$ = !1;
    this.$jumpTargetNb$ = 0;
    this.$ast$ = null;
  }
  $Bytecode$$1$$.prototype = {get $hexOpcode$() {
    return this.$opcode$.length ? this.$opcode$.map($JSSMS$Utils$toHex$$).join(" ") : "";
  }, get label() {
    var $name$$61$$ = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, $JSSMS$Utils$toHex$$(this.target || this.$operand$ || 0)) : "";
    return $JSSMS$Utils$toHex$$(this.$address$ + 16384 * this.page) + " " + this.$hexOpcode$ + " " + $name$$61$$;
  }};
  return $Bytecode$$1$$;
}();
var $Parser$$ = function() {
  function $parser$$($rom$$1$$, $frameReg$$) {
    this.$g$ = new $RomStream$$($rom$$1$$);
    this.$frameReg$ = $frameReg$$;
    this.$a$ = Array($rom$$1$$.length);
    this.$entryPoints$ = [];
    this.$bytecodes$ = Array($rom$$1$$.length);
    for (var $i$$30$$ = 0;$i$$30$$ < $rom$$1$$.length;$i$$30$$++) {
      this.$a$[$i$$30$$] = [], this.$bytecodes$[$i$$30$$] = [];
    }
  }
  function $disassemble$$($bytecode$$, $stream$$) {
    $stream$$.page = $bytecode$$.page;
    $stream$$.$RomStream_prototype$seek$($bytecode$$.$address$ + 16384 * $stream$$.page);
    var $opcode$$13_opcode$$inline_285_opcode$$inline_289$$ = $stream$$.getUint8(), $operand$$3_operand$$inline_290$$ = null, $target$$48_target$$inline_291$$ = null, $isFunctionEnder_isFunctionEnder$$inline_292$$ = !1, $canEnd_canEnd$$inline_293$$ = !1;
    $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_285_opcode$$inline_289$$);
    switch($opcode$$13_opcode$$inline_285_opcode$$inline_289$$) {
      case 0:
        break;
      case 1:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
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
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 15:
        break;
      case 16:
        $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 17:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 23:
        break;
      case 24:
        $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
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
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 31:
        break;
      case 32:
        $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 33:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
        break;
      case 34:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 39:
        break;
      case 40:
        $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 41:
        break;
      case 42:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 47:
        break;
      case 48:
        $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 49:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
        break;
      case 50:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
        break;
      case 51:
        break;
      case 52:
        break;
      case 53:
        break;
      case 54:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 55:
        break;
      case 56:
        $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 57:
        break;
      case 58:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
        break;
      case 59:
        break;
      case 60:
        break;
      case 61:
        break;
      case 62:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
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
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
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
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 193:
        break;
      case 194:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 195:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 196:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 197:
        break;
      case 198:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 199:
        $target$$48_target$$inline_291$$ = 0;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 200:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 201:
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 202:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 203:
        return $opcode$$13_opcode$$inline_285_opcode$$inline_289$$ = $stream$$.getUint8(), $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_285_opcode$$inline_289$$), $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$, $bytecode$$;
      case 204:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 205:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 206:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 207:
        $target$$48_target$$inline_291$$ = 8;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 208:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 209:
        break;
      case 210:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 211:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 212:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 213:
        break;
      case 214:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 215:
        $target$$48_target$$inline_291$$ = 16;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 216:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 217:
        break;
      case 218:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 219:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 220:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 221:
        return $getIndex$$($bytecode$$, $stream$$);
      case 222:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 223:
        $target$$48_target$$inline_291$$ = 24;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 224:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 225:
        break;
      case 226:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 227:
        break;
      case 228:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 229:
        break;
      case 230:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 231:
        $target$$48_target$$inline_291$$ = 32;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 232:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 233:
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 234:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 235:
        break;
      case 236:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 237:
        $opcode$$13_opcode$$inline_285_opcode$$inline_289$$ = $stream$$.getUint8();
        $target$$48_target$$inline_291$$ = $operand$$3_operand$$inline_290$$ = null;
        $canEnd_canEnd$$inline_293$$ = $isFunctionEnder_isFunctionEnder$$inline_292$$ = !1;
        $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_285_opcode$$inline_289$$);
        switch($opcode$$13_opcode$$inline_285_opcode$$inline_289$$) {
          case 64:
            break;
          case 65:
            break;
          case 66:
            break;
          case 67:
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
            $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
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
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
            break;
          case 111:
            break;
          case 113:
            break;
          case 114:
            break;
          case 115:
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
            break;
          case 120:
            break;
          case 121:
            break;
          case 122:
            break;
          case 123:
            $operand$$3_operand$$inline_290$$ = $stream$$.getUint16();
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
            $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_293$$ = !0;
            break;
          case 177:
            $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_293$$ = !0;
            break;
          case 178:
            $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_293$$ = !0;
            break;
          case 179:
            $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_293$$ = !0;
            break;
          case 184:
            break;
          case 185:
            break;
          case 186:
            $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_293$$ = !0;
            break;
          case 187:
            $target$$48_target$$inline_291$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_293$$ = !0;
            break;
          default:
            $JSSMS$Utils$console$error$$("Unexpected opcode", "0xED " + $toHex$$8$$($opcode$$13_opcode$$inline_285_opcode$$inline_289$$));
        }
        $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$;
        $bytecode$$.$operand$ = $operand$$3_operand$$inline_290$$;
        $bytecode$$.target = $target$$48_target$$inline_291$$;
        $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_292$$;
        $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_293$$;
        return $bytecode$$;
      case 238:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 239:
        $target$$48_target$$inline_291$$ = 40;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 240:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 241:
        break;
      case 242:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 243:
        break;
      case 244:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 245:
        break;
      case 246:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 247:
        $target$$48_target$$inline_291$$ = 48;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      case 248:
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 249:
        break;
      case 250:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 251:
        break;
      case 252:
        $target$$48_target$$inline_291$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_293$$ = !0;
        break;
      case 253:
        return $getIndex$$($bytecode$$, $stream$$);
      case 254:
        $operand$$3_operand$$inline_290$$ = $stream$$.getUint8();
        break;
      case 255:
        $target$$48_target$$inline_291$$ = 56;
        $isFunctionEnder_isFunctionEnder$$inline_292$$ = !0;
        break;
      default:
        $JSSMS$Utils$console$error$$("Unexpected opcode", $toHex$$8$$($opcode$$13_opcode$$inline_285_opcode$$inline_289$$));
    }
    $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$;
    $bytecode$$.$operand$ = $operand$$3_operand$$inline_290$$;
    $bytecode$$.target = $target$$48_target$$inline_291$$;
    $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_292$$;
    $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_293$$;
    return $bytecode$$;
  }
  function $getIndex$$($bytecode$$3$$, $stream$$3$$) {
    var $opcode$$16_operand$$inline_297$$ = $stream$$3$$.getUint8(), $opcode$$inline_298_operand$$5$$ = null, $isFunctionEnder$$2$$ = !1;
    $bytecode$$3$$.$opcode$.push($opcode$$16_operand$$inline_297$$);
    switch($opcode$$16_operand$$inline_297$$) {
      case 9:
        break;
      case 25:
        break;
      case 33:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 34:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 41:
        break;
      case 42:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 52:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 53:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 54:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 57:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
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
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
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
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 111:
        break;
      case 112:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 113:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 114:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 115:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 116:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 117:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 119:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 203:
        return $opcode$$16_operand$$inline_297$$ = $stream$$3$$.getUint8(), $opcode$$inline_298_operand$$5$$ = $stream$$3$$.getUint8(), $bytecode$$3$$.$opcode$.push($opcode$$inline_298_operand$$5$$), $bytecode$$3$$.$nextAddress$ = $stream$$3$$.$RomStream_prototype$position$, $bytecode$$3$$.$operand$ = $opcode$$16_operand$$inline_297$$, $bytecode$$3$$;
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
        $JSSMS$Utils$console$error$$("Unexpected opcode", "0xDD/0xFD " + $toHex$$8$$($opcode$$16_operand$$inline_297$$));
    }
    $bytecode$$3$$.$nextAddress$ = $stream$$3$$.$RomStream_prototype$position$;
    $bytecode$$3$$.$operand$ = $opcode$$inline_298_operand$$5$$;
    $bytecode$$3$$.$isFunctionEnder$ = $isFunctionEnder$$2$$;
    return $bytecode$$3$$;
  }
  function $RomStream$$($rom$$) {
    this.$rom$ = $rom$$;
    this.$a$ = null;
    this.page = 0;
  }
  var $toHex$$8$$ = $JSSMS$Utils$toHex$$;
  $parser$$.prototype = {$addEntryPoint$:function $$parser$$$$$addEntryPoint$$($obj$$36$$) {
    this.$entryPoints$.push($obj$$36$$);
    this.$f$($obj$$36$$.$address$);
  }, parse:function $$parser$$$$parse$($currentPage_entryPoint$$2_page$$1$$) {
    $JSSMS$Utils$console$time$$("Parsing");
    var $i$$31_pageStart$$, $length$$21_pageEnd$$;
    void 0 === $currentPage_entryPoint$$2_page$$1$$ ? ($i$$31_pageStart$$ = 0, $length$$21_pageEnd$$ = this.$g$.length - 1) : ($i$$31_pageStart$$ = 0, $length$$21_pageEnd$$ = 16383);
    for ($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$a$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for (;this.$a$[$currentPage_entryPoint$$2_page$$1$$].length;) {
        var $currentAddress$$2_romPage_targetPage$$ = this.$a$[$currentPage_entryPoint$$2_page$$1$$].shift().$address$ % 16384;
        if ($currentAddress$$2_romPage_targetPage$$ < $i$$31_pageStart$$ || $currentAddress$$2_romPage_targetPage$$ > $length$$21_pageEnd$$) {
          $JSSMS$Utils$console$error$$("Address out of bound", $toHex$$8$$($currentAddress$$2_romPage_targetPage$$));
        } else {
          if (!this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$]) {
            var $bytecode$$5_targetAddress$$ = new $Bytecode$$($currentAddress$$2_romPage_targetPage$$, $currentPage_entryPoint$$2_page$$1$$);
            this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$] = $disassemble$$($bytecode$$5_targetAddress$$, this.$g$);
            null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$ >= $i$$31_pageStart$$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$ <= $length$$21_pageEnd$$ && this.$f$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].$nextAddress$);
            null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target >= $i$$31_pageStart$$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target <= $length$$21_pageEnd$$ && this.$f$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$2_romPage_targetPage$$].target);
          }
        }
      }
    }
    this.$bytecodes$[0][1023] ? this.$bytecodes$[0][1023].$isFunctionEnder$ = !0 : this.$bytecodes$[0][1022] && (this.$bytecodes$[0][1022].$isFunctionEnder$ = !0);
    $i$$31_pageStart$$ = $length$$21_pageEnd$$ = $i$$31_pageStart$$ = 0;
    for ($length$$21_pageEnd$$ = this.$entryPoints$.length;$i$$31_pageStart$$ < $length$$21_pageEnd$$;$i$$31_pageStart$$++) {
      $currentPage_entryPoint$$2_page$$1$$ = this.$entryPoints$[$i$$31_pageStart$$].$address$, $currentAddress$$2_romPage_targetPage$$ = this.$entryPoints$[$i$$31_pageStart$$].$romPage$, this.$bytecodes$[$currentAddress$$2_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$isJumpTarget$ = !0, this.$bytecodes$[$currentAddress$$2_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$jumpTargetNb$++;
    }
    for ($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$bytecodes$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for ($i$$31_pageStart$$ = 0, $length$$21_pageEnd$$ = this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$].length;$i$$31_pageStart$$ < $length$$21_pageEnd$$;$i$$31_pageStart$$++) {
        this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$] && (null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].$nextAddress$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].$nextAddress$] && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].$nextAddress$].$jumpTargetNb$++, null !== 
        this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].target && ($currentAddress$$2_romPage_targetPage$$ = ~~(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].target / 16384), $bytecode$$5_targetAddress$$ = this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].target % 16384, this.$bytecodes$[$currentAddress$$2_romPage_targetPage$$] && this.$bytecodes$[$currentAddress$$2_romPage_targetPage$$][$bytecode$$5_targetAddress$$] ? 
        (this.$bytecodes$[$currentAddress$$2_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$isJumpTarget$ = !0, this.$bytecodes$[$currentAddress$$2_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$jumpTargetNb$++) : $JSSMS$Utils$console$log$$("Invalid target address", $toHex$$8$$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$31_pageStart$$].target))));
      }
    }
    $JSSMS$Utils$console$timeEnd$$("Parsing");
  }, $parseFromAddress$:function $$parser$$$$$parseFromAddress$$($obj$$37_romPage$$1$$) {
    var $address$$19$$ = $obj$$37_romPage$$1$$.$address$ % 16384;
    $obj$$37_romPage$$1$$ = $obj$$37_romPage$$1$$.$romPage$;
    var $pageStart$$1$$ = 16384 * $obj$$37_romPage$$1$$, $pageEnd$$1$$ = 16384 * ($obj$$37_romPage$$1$$ + 1), $branch$$ = [], $bytecode$$6$$, $startingBytecode$$ = !0, $absoluteAddress$$ = 0;
    1024 > $address$$19$$ && 0 === $obj$$37_romPage$$1$$ && ($pageStart$$1$$ = 0, $pageEnd$$1$$ = 1024);
    do {
      this.$bytecodes$[$obj$$37_romPage$$1$$][$address$$19$$] ? $bytecode$$6$$ = this.$bytecodes$[$obj$$37_romPage$$1$$][$address$$19$$] : ($bytecode$$6$$ = new $Bytecode$$($address$$19$$, $obj$$37_romPage$$1$$), this.$bytecodes$[$obj$$37_romPage$$1$$][$address$$19$$] = $disassemble$$($bytecode$$6$$, this.$g$));
      if ($bytecode$$6$$.$canEnd$ && !$startingBytecode$$) {
        break;
      }
      $address$$19$$ = $bytecode$$6$$.$nextAddress$ % 16384;
      $branch$$.push($bytecode$$6$$);
      $startingBytecode$$ = !1;
      $absoluteAddress$$ = $address$$19$$ + 16384 * $obj$$37_romPage$$1$$;
    } while (null !== $address$$19$$ && $absoluteAddress$$ >= $pageStart$$1$$ && $absoluteAddress$$ < $pageEnd$$1$$ && !$bytecode$$6$$.$isFunctionEnder$);
    return $branch$$;
  }, $f$:function $$parser$$$$$f$$($address$$20$$) {
    var $memPage$$ = ~~($address$$20$$ / 16384), $romPage$$2$$ = this.$frameReg$[$memPage$$];
    this.$a$[$romPage$$2$$].push({$address$:$address$$20$$ % 16384, $romPage$:$romPage$$2$$, $memPage$:$memPage$$});
  }};
  $RomStream$$.prototype = {get $RomStream_prototype$position$() {
    return this.$a$;
  }, get length() {
    return 16384 * this.$rom$.length;
  }, $RomStream_prototype$seek$:function $$RomStream$$$$$RomStream_prototype$seek$$($pos$$) {
    this.$a$ = $pos$$;
  }, getUint8:function $$RomStream$$$$getUint8$() {
    var $page$$2_value$$85$$ = 0, $page$$2_value$$85$$ = this.page, $address$$21$$ = this.$a$ & 16383, $page$$2_value$$85$$ = $SUPPORT_DATAVIEW$$ ? this.$rom$[$page$$2_value$$85$$].getUint8($address$$21$$) : this.$rom$[$page$$2_value$$85$$][$address$$21$$] & 255;
    this.$a$++;
    return $page$$2_value$$85$$;
  }, $RomStream_prototype$getInt8$:function $$RomStream$$$$$RomStream_prototype$getInt8$$() {
    var $page$$3_value$$86$$ = 0, $page$$3_value$$86$$ = this.page, $address$$22$$ = this.$a$ & 16383;
    $SUPPORT_DATAVIEW$$ ? $page$$3_value$$86$$ = this.$rom$[$page$$3_value$$86$$].getInt8($address$$22$$) : ($page$$3_value$$86$$ = this.$rom$[$page$$3_value$$86$$][$address$$22$$] & 255, 128 <= $page$$3_value$$86$$ && ($page$$3_value$$86$$ -= 256));
    this.$a$++;
    return $page$$3_value$$86$$ + 1;
  }, getUint16:function $$RomStream$$$$getUint16$() {
    var $page$$4_value$$87$$ = 0, $page$$4_value$$87$$ = this.page, $address$$23$$ = this.$a$ & 16383, $page$$4_value$$87$$ = $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$23$$ & 16383) ? this.$rom$[$page$$4_value$$87$$].getUint16($address$$23$$, !0) : this.$rom$[$page$$4_value$$87$$].getUint8($address$$23$$) | this.$rom$[++$page$$4_value$$87$$].getUint8($address$$23$$) << 8 : this.$rom$[$page$$4_value$$87$$][$address$$23$$] & 255 | (this.$rom$[++$page$$4_value$$87$$][$address$$23$$] & 255) << 8;
    this.$a$ += 2;
    return $page$$4_value$$87$$;
  }};
  return $parser$$;
}();
var $BIT_TABLE$$ = [1, 2, 4, 8, 16, 32, 64, 128];
function $n$IfStatement$$($test$$, $consequent$$, $alternate$$) {
  void 0 === $alternate$$ && ($alternate$$ = null);
  return{type:"IfStatement", test:$test$$, consequent:$consequent$$, alternate:$alternate$$};
}
function $n$BlockStatement$$($body$$1$$) {
  void 0 === $body$$1$$ && ($body$$1$$ = []);
  Array.isArray($body$$1$$) || ($body$$1$$ = [$body$$1$$]);
  return{type:"BlockStatement", body:$body$$1$$};
}
function $n$ExpressionStatement$$($expression$$2$$) {
  return{type:"ExpressionStatement", expression:$expression$$2$$};
}
function $n$ReturnStatement$$() {
  var $argument$$;
  void 0 === $argument$$ && ($argument$$ = null);
  return{type:"ReturnStatement", argument:$argument$$};
}
function $n$VariableDeclaration$$($name$$62$$, $init$$) {
  return{type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", id:{type:"Identifier", name:$name$$62$$}, init:$init$$}], kind:"var"};
}
function $n$Identifier$$($name$$63$$) {
  return{type:"Identifier", name:$name$$63$$};
}
function $n$Literal$$($value$$88$$) {
  return "number" == typeof $value$$88$$ ? {type:"Literal", value:$value$$88$$, raw:$DEBUG$$ ? $JSSMS$Utils$toHex$$($value$$88$$) : "" + $value$$88$$} : {type:"Literal", value:$value$$88$$, raw:"" + $value$$88$$};
}
function $n$CallExpression$$($callee$$, $args$$4$$) {
  void 0 === $args$$4$$ && ($args$$4$$ = []);
  Array.isArray($args$$4$$) || ($args$$4$$ = [$args$$4$$]);
  return{type:"CallExpression", callee:$n$Identifier$$($callee$$), arguments:$args$$4$$};
}
function $n$AssignmentExpression$$($operator$$, $left$$3$$, $right$$3$$) {
  return{type:"AssignmentExpression", operator:$operator$$, left:$left$$3$$, right:$right$$3$$};
}
function $n$BinaryExpression$$($operator$$1$$, $left$$4$$, $right$$4$$) {
  return{type:"BinaryExpression", operator:$operator$$1$$, left:$left$$4$$, right:$right$$4$$};
}
function $n$UnaryExpression$$($operator$$2$$, $argument$$1$$) {
  return{type:"UnaryExpression", operator:$operator$$2$$, argument:$argument$$1$$};
}
function $n$MemberExpression$$($object$$1$$, $property$$4$$) {
  return{type:"MemberExpression", computed:!0, object:$object$$1$$, property:$property$$4$$};
}
function $n$ConditionalExpression$$($test$$1$$, $consequent$$1$$, $alternate$$1$$) {
  return{type:"ConditionalExpression", test:$test$$1$$, consequent:$consequent$$1$$, alternate:$alternate$$1$$};
}
function $n$Register$$($name$$64$$) {
  return{type:"Register", name:$name$$64$$};
}
function $n$Bit$$($bitNumber$$) {
  return $n$Literal$$($BIT_TABLE$$[$bitNumber$$]);
}
var $o$$ = {$SET16$:function($register1$$, $register2$$, $value$$89$$) {
  return "Literal" == $value$$89$$.type ? [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", $value$$89$$, $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $value$$89$$, $n$Literal$$(255))))] : [$n$VariableDeclaration$$("val", $value$$89$$), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", 
  $n$Identifier$$("val"), $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $n$Identifier$$("val"), $n$Literal$$(255))))];
}, $EX$:function($register1$$1$$, $register2$$1$$) {
  return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$($register1$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$1$$), $n$Register$$($register2$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$1$$), $n$Identifier$$("temp")))];
}, $NOOP$:function() {
  return function() {
  };
}, $LD8$:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function($value$$90$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Literal$$($value$$90$$)));
  } : "i" == $dstRegister1$$ && void 0 === $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$("i"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), $n$Literal$$(0)))))];
  } : "r" == $dstRegister1$$ && void 0 === $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$CallExpression$$("JSSMS.Utils.rndInt", $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), 
    $n$Literal$$(0)))))];
  } : void 0 === $dstRegister2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$($dstRegister1$$)));
  } : "n" == $dstRegister1$$ && "n" == $dstRegister2$$ ? function($value$$91$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$Literal$$($value$$91$$))));
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()))));
  };
}, $LD8_D$:function($srcRegister$$1$$, $dstRegister1$$1$$, $dstRegister2$$1$$) {
  return function($value$$92$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$1$$), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($dstRegister1$$1$$ + $dstRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$92$$)))));
  };
}, $LD16$:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$2$$, $dstRegister2$$2$$) {
  if (void 0 === $dstRegister1$$2$$ && void 0 === $dstRegister2$$2$$) {
    return function($value$$93$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $n$Literal$$($value$$93$$));
    };
  }
  if ("n" == $dstRegister1$$2$$ && "n" == $dstRegister2$$2$$) {
    return function($value$$94$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $o$$.$READ_MEM16$($n$Literal$$($value$$94$$)));
    };
  }
  $JSSMS$Utils$console$error$$("Wrong parameters number");
}, $LD_WRITE_MEM$:function($srcRegister1$$1$$, $srcRegister2$$1$$, $dstRegister1$$3$$, $dstRegister2$$3$$) {
  return void 0 === $dstRegister1$$3$$ && void 0 === $dstRegister2$$3$$ ? function($value$$95$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$95$$)]));
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ && void 0 === $dstRegister2$$3$$ ? function($value$$96$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$96$$), $n$Register$$($dstRegister1$$3$$)]));
  } : "n" == $srcRegister1$$1$$ && "n" == $srcRegister2$$1$$ ? function($value$$97$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$97$$), $n$Register$$($dstRegister2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$97$$ + 1), $n$Register$$($dstRegister1$$3$$)]))];
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Register$$($dstRegister1$$3$$)]));
  };
}, $LD_SP$:function($register1$$2$$, $register2$$2$$) {
  return void 0 === $register1$$2$$ && void 0 === $register2$$2$$ ? function($value$$98$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$Literal$$($value$$98$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$CallExpression$$("get" + ($register1$$2$$ + $register2$$2$$).toUpperCase())));
  };
}, $LD_NN$:function($register1$$3$$, $register2$$3$$) {
  return void 0 === $register2$$3$$ ? function($value$$99$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$99$$))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$Literal$$($value$$99$$ + 1)))];
  } : function($value$$100$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$100$$), $n$Register$$($register2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$100$$ + 1), $n$Register$$($register1$$3$$)]))];
  };
}, $INC8$:function($register1$$4$$, $register2$$4$$) {
  return void 0 === $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$4$$), $n$CallExpression$$("inc8", $n$Register$$($register1$$4$$))));
  } : "s" == $register1$$4$$ && "p" == $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$CallExpression$$("getHL")));
  };
}, $INC16$:function($register1$$5$$, $register2$$5$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register2$$5$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("==", $n$Register$$($register2$$5$$), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register1$$5$$), 
    $n$Literal$$(1)), $n$Literal$$(255))))]))];
  };
}, $DEC8$:function($register1$$6$$, $register2$$6$$) {
  return void 0 === $register2$$6$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$6$$), $n$CallExpression$$("dec8", $n$Register$$($register1$$6$$))));
  } : "s" == $register1$$6$$ && "p" == $register2$$6$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("-", $n$Identifier$$("sp"), $n$Literal$$(1))));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$CallExpression$$("getHL")));
  };
}, $DEC16$:function($register1$$7$$, $register2$$7$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register2$$7$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("==", $n$Register$$($register2$$7$$), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register1$$7$$), 
    $n$Literal$$(1)), $n$Literal$$(255))))]))];
  };
}, $ADD16$:function($register1$$8$$, $register2$$8$$, $register3$$, $register4$$) {
  return void 0 === $register4$$ ? function() {
    return $o$$.$SET16$($register1$$8$$, $register2$$8$$, $n$CallExpression$$("add16", [$n$CallExpression$$("get" + ($register1$$8$$ + $register2$$8$$).toUpperCase()), $n$Register$$($register3$$)]));
  } : function() {
    return $o$$.$SET16$($register1$$8$$, $register2$$8$$, $n$CallExpression$$("add16", [$n$CallExpression$$("get" + ($register1$$8$$ + $register2$$8$$).toUpperCase()), $n$CallExpression$$("get" + ($register3$$ + $register4$$).toUpperCase())]));
  };
}, $RLCA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rlca_a"));
  };
}, $RRCA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rrca_a"));
  };
}, $RLA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rla_a"));
  };
}, $RRA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("rra_a"));
  };
}, $DAA$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("daa"));
  };
}, $CPL$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cpl_a"));
  };
}, $SCF$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))];
  };
}, $CCF$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("ccf"));
  };
}, $ADD$:function($register1$$9$$, $register2$$9$$) {
  return void 0 === $register1$$9$$ && void 0 === $register2$$9$$ ? function($value$$101$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Literal$$($value$$101$$)));
  } : void 0 === $register2$$9$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Register$$($register1$$9$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$9$$ + $register2$$9$$).toUpperCase()))));
  };
}, $ADC$:function($register1$$10$$, $register2$$10$$) {
  return void 0 === $register1$$10$$ && void 0 === $register2$$10$$ ? function($value$$102$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Literal$$($value$$102$$)));
  } : void 0 === $register2$$10$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Register$$($register1$$10$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$10$$ + $register2$$10$$).toUpperCase()))));
  };
}, $SUB$:function($register1$$11$$, $register2$$11$$) {
  return void 0 === $register1$$11$$ && void 0 === $register2$$11$$ ? function($value$$103$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Literal$$($value$$103$$)));
  } : void 0 === $register2$$11$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Register$$($register1$$11$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$11$$ + $register2$$11$$).toUpperCase()))));
  };
}, $SBC$:function($register1$$12$$, $register2$$12$$) {
  return void 0 === $register1$$12$$ && void 0 === $register2$$12$$ ? function($value$$104$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Literal$$($value$$104$$)));
  } : void 0 === $register2$$12$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Register$$($register1$$12$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$12$$ + $register2$$12$$).toUpperCase()))));
  };
}, $AND$:function($register1$$13$$, $register2$$13$$) {
  return void 0 === $register1$$13$$ && void 0 === $register2$$13$$ ? function($value$$105$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Literal$$($value$$105$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  } : "a" != $register1$$13$$ && void 0 === $register2$$13$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Register$$($register1$$13$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  } : "a" == $register1$$13$$ && void 0 === $register2$$13$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))));
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$13$$ + $register2$$13$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  };
}, $XOR$:function($register1$$14$$, $register2$$14$$) {
  return void 0 === $register1$$14$$ && void 0 === $register2$$14$$ ? function($value$$106$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Literal$$($value$$106$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" != $register1$$14$$ && void 0 === $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Register$$($register1$$14$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" == $register1$$14$$ && void 0 === $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Literal$$(0))))];
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$14$$ + $register2$$14$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $OR$:function($register1$$15$$, $register2$$15$$) {
  return void 0 === $register1$$15$$ && void 0 === $register2$$15$$ ? function($value$$107$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Literal$$($value$$107$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" != $register1$$15$$ && void 0 === $register2$$15$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Register$$($register1$$15$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" == $register1$$15$$ && void 0 === $register2$$15$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))));
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$15$$ + $register2$$15$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $CP$:function($register1$$16$$, $register2$$16$$) {
  return void 0 === $register1$$16$$ && void 0 === $register2$$16$$ ? function($value$$108$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Literal$$($value$$108$$)));
  } : void 0 === $register2$$16$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Register$$($register1$$16$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$16$$ + $register2$$16$$).toUpperCase()))));
  };
}, $POP$:function($register1$$17$$, $register2$$17$$) {
  return function() {
    return[].concat($o$$.$SET16$($register1$$17$$, $register2$$17$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))));
  };
}, $PUSH$:function($register1$$18$$, $register2$$18$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("pushUint8", [$n$Register$$($register1$$18$$), $n$Register$$($register2$$18$$)]));
  };
}, $JR$:function($test$$2$$) {
  return function($value$$109$$, $target$$55$$) {
    return $n$IfStatement$$($test$$2$$, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$($target$$55$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()]));
  };
}, $DJNZ$:function() {
  return function($value$$110$$, $target$$56$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("b"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$("b"), $n$Literal$$(1)), $n$Literal$$(255)))), $o$$.$JR$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)))(void 0, $target$$56$$)];
  };
}, $JRNZ$:function() {
  return function($value$$111$$, $target$$57$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))))(void 0, $target$$57$$);
  };
}, $JRZ$:function() {
  return function($value$$112$$, $target$$58$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0)))(void 0, $target$$58$$);
  };
}, $JRNC$:function() {
  return function($value$$113$$, $target$$59$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0))))(void 0, $target$$59$$);
  };
}, $JRC$:function() {
  return function($value$$114$$, $target$$60$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0)))(void 0, $target$$60$$);
  };
}, $RET$:function($operator$$4$$, $bitMask$$) {
  return void 0 === $operator$$4$$ && void 0 === $bitMask$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2)))];
  } : function() {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$4$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(6))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), 
    $n$ReturnStatement$$()]));
  };
}, $JP$:function($operator$$5$$, $bitMask$$1$$) {
  return void 0 === $operator$$5$$ && void 0 === $bitMask$$1$$ ? function($value$$116$$, $target$$62$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$62$$)))];
  } : "h" == $operator$$5$$ && "l" == $bitMask$$1$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("getHL")))];
  } : function($value$$118$$, $target$$64$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$5$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$1$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$64$$))), $n$ReturnStatement$$()]));
  };
}, $CALL$:function($operator$$6$$, $bitMask$$2$$) {
  return void 0 === $operator$$6$$ && void 0 === $bitMask$$2$$ ? function($value$$119$$, $target$$65$$, $nextAddress$$8$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$8$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$65$$))), $n$ReturnStatement$$()];
  } : function($value$$120$$, $target$$66$$, $nextAddress$$9$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$6$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$2$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(7))), $n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$9$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", 
    $n$Identifier$$("pc"), $n$Literal$$($target$$66$$))), $n$ReturnStatement$$()]));
  };
}, $RST$:function($targetAddress$$1$$) {
  return function($value$$121$$, $target$$67$$, $nextAddress$$10$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$10$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($targetAddress$$1$$))), $n$ReturnStatement$$()];
  };
}, $DI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))];
  };
}, $EI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))];
  };
}, $OUT$:function($register1$$19$$, $register2$$19$$) {
  return void 0 === $register2$$19$$ ? function($value$$122$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Literal$$($value$$122$$), $n$Register$$($register1$$19$$)]));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$($register1$$19$$), $n$Register$$($register2$$19$$)]));
  };
}, $IN$:function($register1$$20$$, $register2$$20$$) {
  return void 0 === $register2$$20$$ ? function($value$$123$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Literal$$($value$$123$$))));
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Register$$($register2$$20$$)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$($register1$$20$$)))))];
  };
}, $EX_AF$:function() {
  return function() {
    return[].concat($o$$.$EX$("a", "a2"), $o$$.$EX$("f", "f2"));
  };
}, $EXX$:function() {
  return function() {
    return[].concat($o$$.$EX$("b", "b2"), $o$$.$EX$("c", "c2"), $o$$.$EX$("d", "d2"), $o$$.$EX$("e", "e2"), $o$$.$EX$("h", "h2"), $o$$.$EX$("l", "l2"));
  };
}, $EX_DE_HL$:function() {
  return function() {
    return[].concat($o$$.$EX$("d", "h"), $o$$.$EX$("e", "l"));
  };
}, $EX_SP_HL$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1)), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $o$$.$READ_MEM8$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$Identifier$$("temp")]))];
  };
}, $HALT$:function() {
  return function($ret_value$$125$$, $target$$71$$, $nextAddress$$14$$) {
    $ret_value$$125$$ = [];
    $ret_value$$125$$.push($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("tstates"), $n$Literal$$(0))));
    return $ret_value$$125$$.concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("halt"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$(($nextAddress$$14$$ - 1) % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()]);
  };
}, $t$:$generateCBFunctions$$("rlc"), $w$:$generateCBFunctions$$("rrc"), $s$:$generateCBFunctions$$("rl"), $v$:$generateCBFunctions$$("rr"), $G$:$generateCBFunctions$$("sla"), $J$:$generateCBFunctions$$("sra"), $I$:$generateCBFunctions$$("sll"), $K$:$generateCBFunctions$$("srl"), $a$:function($bit$$1$$, $register1$$21$$, $register2$$21$$) {
  return void 0 === $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $n$Register$$($register1$$21$$), $n$Bit$$($bit$$1$$))));
  } : "h" == $register1$$21$$ && "l" == $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase())), $n$Bit$$($bit$$1$$))));
  } : function($value$$126$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$Literal$$($value$$126$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$1$$))))];
  };
}, $q$:function($bit$$2$$, $register1$$22$$, $register2$$22$$) {
  return void 0 === $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$($register1$$22$$), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$))));
  } : "h" == $register1$$22$$ && "l" == $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase())), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))));
  } : function($value$$127$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$Literal$$($value$$127$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))]))];
  };
}, $F$:function($bit$$3$$, $register1$$23$$, $register2$$23$$) {
  return void 0 === $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$($register1$$23$$), $n$Bit$$($bit$$3$$)));
  } : "h" == $register1$$23$$ && "l" == $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase())), $n$Bit$$($bit$$3$$))]));
  } : function($value$$128$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$Literal$$($value$$128$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$3$$))]))];
  };
}, $LD_X$:function($register1$$24$$, $register2$$24$$, $register3$$1$$) {
  return void 0 === $register3$$1$$ ? function($value$$129$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$24$$ + $register2$$24$$).toUpperCase()), $n$Literal$$($value$$129$$ & 255)), $n$Literal$$($value$$129$$ >> 8)]))];
  } : function($value$$130$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register2$$24$$ + $register3$$1$$).toUpperCase()), $n$Literal$$($value$$130$$)), $n$Register$$($register1$$24$$)]))];
  };
}, $INC_X$:function($register1$$25$$, $register2$$25$$) {
  return function($value$$131$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$25$$ + $register2$$25$$).toUpperCase()), $n$Literal$$($value$$131$$))))];
  };
}, $DEC_X$:function($register1$$26$$, $register2$$26$$) {
  return function($value$$132$$) {
    return[$n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$26$$ + $register2$$26$$).toUpperCase()), $n$Literal$$($value$$132$$))))];
  };
}, $ADD_X$:function($register1$$27$$, $register2$$27$$) {
  return function($value$$133$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$27$$ + $register2$$27$$).toUpperCase()), $n$Literal$$($value$$133$$)))));
  };
}, $ADC_X$:function($register1$$28$$, $register2$$28$$) {
  return function($value$$134$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$28$$ + $register2$$28$$).toUpperCase()), $n$Literal$$($value$$134$$)))));
  };
}, $SUB_X$:function($register1$$29$$, $register2$$29$$) {
  return function($value$$135$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$29$$ + $register2$$29$$).toUpperCase()), $n$Literal$$($value$$135$$)))));
  };
}, $SBC_X$:function($register1$$30$$, $register2$$30$$) {
  return function($value$$136$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$30$$ + $register2$$30$$).toUpperCase()), $n$Literal$$($value$$136$$)))));
  };
}, $AND_X$:function($register1$$31$$, $register2$$31$$) {
  return function($value$$137$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$31$$ + $register2$$31$$).toUpperCase()), $n$Literal$$($value$$137$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  };
}, $XOR_X$:function($register1$$32$$, $register2$$32$$) {
  return function($value$$138$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$32$$ + $register2$$32$$).toUpperCase()), $n$Literal$$($value$$138$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $OR_X$:function($register1$$33$$, $register2$$33$$) {
  return function($value$$139$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$33$$ + $register2$$33$$).toUpperCase()), $n$Literal$$($value$$139$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $CP_X$:function($register1$$34$$, $register2$$34$$) {
  return function($value$$140$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$34$$ + $register2$$34$$).toUpperCase()), $n$Literal$$($value$$140$$)))));
  };
}, $EX_SP_X$:function($register1$$35$$, $register2$$35$$) {
  return function() {
    return[].concat($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("get" + ($register1$$35$$ + $register2$$35$$).toUpperCase()))), $o$$.$SET16$($register1$$35$$, $register2$$35$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("sp"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))])), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$BinaryExpression$$("+", 
    $n$Identifier$$("sp"), $n$Literal$$(1)), $n$BinaryExpression$$(">>", $n$Identifier$$("sp"), $n$Literal$$(8))])));
  };
}, $JP_X$:function($register1$$36$$, $register2$$36$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("get" + ($register1$$36$$ + $register2$$36$$).toUpperCase())))];
  };
}, $ADC16$:function($register1$$37$$, $register2$$37$$) {
  return function() {
    return[void 0 === $register2$$37$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$37$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$37$$), $n$Literal$$(8)), $n$Register$$($register2$$37$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("+", $n$BinaryExpression$$("+", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp")), 
    $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(64))), $n$BinaryExpression$$(">>", 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$Literal$$(32768)), $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))];
  };
}, $SBC16$:function($register1$$38$$, $register2$$38$$) {
  return function() {
    return[void 0 === $register2$$38$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$38$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$38$$), $n$Literal$$(8)), $n$Register$$($register2$$38$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("-", $n$BinaryExpression$$("-", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), 
    $n$Identifier$$("temp")), $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$Literal$$(2)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), 
    $n$Literal$$(64))), $n$BinaryExpression$$(">>", $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))];
  };
}, $NEG$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("a"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Identifier$$("temp")))];
  };
}, $RETN_RETI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Identifier$$("iff2")))];
  };
}, $IM$:function($value$$144$$) {
  return function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("im"), $n$Literal$$($value$$144$$)));
  };
}, $INI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("port.in_", $n$Register$$("c")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getHL"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))];
  };
}, $OUTI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))];
  };
}, $OUTD$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))];
  };
}, $LDI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))];
  };
}, $CPI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))];
  };
}, $LDD$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))];
  };
}, $LDIR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("incDE")), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))];
  };
}, $CPIR$:function() {
  return function() {
    var $JSCompiler_temp_const$$19$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $JSCompiler_temp_const$$18$$ = $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $JSCompiler_temp_const$$17$$ = $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $JSCompiler_temp_const$$16$$ = $n$ExpressionStatement$$($n$CallExpression$$("incHL")), 
    $JSCompiler_temp_const$$15$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4))));
    return[$JSCompiler_temp_const$$19$$, $JSCompiler_temp_const$$18$$, $JSCompiler_temp_const$$17$$, $JSCompiler_temp_const$$16$$, $JSCompiler_temp_const$$15$$, $n$IfStatement$$({type:"LogicalExpression", operator:"&&", left:$n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(4)), $n$Literal$$(0)), right:$n$BinaryExpression$$("==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))}, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", 
    $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp")))), $n$ReturnStatement$$()])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))];
  };
}, $OTIR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ReturnStatement$$()]))];
  };
}, $LDDR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!=", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))];
  };
}, $g$:$generateIndexCBFunctions$$("rlc"), $j$:$generateIndexCBFunctions$$("rrc"), $f$:$generateIndexCBFunctions$$("rl"), $i$:$generateIndexCBFunctions$$("rr"), $m$:$generateIndexCBFunctions$$("sla"), $o$:$generateIndexCBFunctions$$("sra"), $n$:$generateIndexCBFunctions$$("sll"), $p$:$generateIndexCBFunctions$$("srl"), $READ_MEM8$:function($value$$155$$) {
  return $n$CallExpression$$("readMem", $value$$155$$);
}, $READ_MEM16$:function($value$$156$$) {
  return $n$CallExpression$$("readMemWord", $value$$156$$);
}};
function $generateCBFunctions$$($fn$$3$$) {
  return function($register1$$39$$, $register2$$39$$) {
    return void 0 === $register2$$39$$ ? function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$39$$), $n$CallExpression$$($fn$$3$$, $n$Register$$($register1$$39$$))));
    } : function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase()), $n$CallExpression$$($fn$$3$$, $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase())))));
    };
  };
}
function $generateIndexCBFunctions$$($fn$$4$$) {
  return function($register1$$40$$, $register2$$40$$, $register3$$2$$) {
    return void 0 === $register3$$2$$ ? function($value$$157$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$40$$ + $register2$$40$$).toUpperCase()), $n$Literal$$($value$$157$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$CallExpression$$($fn$$4$$, $o$$.$READ_MEM8$($n$Identifier$$("location")))]))];
    } : function($value$$158$$) {
      return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$40$$ + $register2$$40$$).toUpperCase()), $n$Literal$$($value$$158$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register3$$2$$), $n$CallExpression$$($fn$$4$$, $o$$.$READ_MEM8$($n$Identifier$$("location"))))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", 
      [$n$Identifier$$("location"), $n$Register$$($register3$$2$$)]))];
    };
  };
}
;var $opcodeTableCB$$ = [], $opcodeTableDDCB$$ = [], $opcodeTableFDCB$$ = [], $regs$$ = {B:["b"], C:["c"], D:["d"], E:["e"], H:["h"], L:["l"], "(HL)":["h", "l"], A:["a"]};
"RLC RRC RL RR SLA SRA SLL SRL".split(" ").forEach(function($op$$) {
  for (var $reg$$2$$ in $regs$$) {
    $opcodeTableCB$$.push({name:$op$$ + " " + $reg$$2$$, $ast$:$o$$[$op$$].apply(null, $regs$$[$reg$$2$$])}), "(HL)" != $reg$$2$$ ? ($opcodeTableDDCB$$.push({name:"LD " + $reg$$2$$ + "," + $op$$ + " (IX)", $ast$:$o$$["LD_" + $op$$].apply(null, ["ixH", "ixL"].concat($regs$$[$reg$$2$$]))}), $opcodeTableFDCB$$.push({name:"LD " + $reg$$2$$ + "," + $op$$ + " (IY)", $ast$:$o$$["LD_" + $op$$].apply(null, ["iyH", "iyL"].concat($regs$$[$reg$$2$$]))})) : ($opcodeTableDDCB$$.push({name:$op$$ + " (IX)", $ast$:$o$$["LD_" + 
    $op$$]("ixH", "ixL")}), $opcodeTableFDCB$$.push({name:$op$$ + " (IY)", $ast$:$o$$["LD_" + $op$$]("iyH", "iyL")}));
  }
});
["BIT", "RES", "SET"].forEach(function($op$$1$$) {
  for (var $i$$33$$ = 0;8 > $i$$33$$;$i$$33$$++) {
    for (var $reg$$3$$ in $regs$$) {
      $opcodeTableCB$$.push({name:$op$$1$$ + " " + $i$$33$$ + "," + $reg$$3$$, $ast$:$o$$[$op$$1$$].apply(null, [$i$$33$$].concat($regs$$[$reg$$3$$]))});
    }
    for (var $j$$2$$ = 0;8 > $j$$2$$;$j$$2$$++) {
      $opcodeTableDDCB$$.push({name:$op$$1$$ + " " + $i$$33$$ + " (IX)", $ast$:$o$$[$op$$1$$].apply(null, [$i$$33$$].concat(["ixH", "ixL"]))}), $opcodeTableFDCB$$.push({name:$op$$1$$ + " " + $i$$33$$ + " (IY)", $ast$:$o$$[$op$$1$$].apply(null, [$i$$33$$].concat(["iyH", "iyL"]))});
    }
  }
});
function $generateIndexTable$$($index$$52$$) {
  var $register_registerL$$ = $index$$52$$.substring(1, 2).toLowerCase(), $registerH$$ = "i" + $register_registerL$$ + "H", $register_registerL$$ = "i" + $register_registerL$$ + "L";
  return{9:{name:"ADD " + $index$$52$$ + ",BC", $ast$:$o$$.$ADD16$($registerH$$, $register_registerL$$, "b", "c")}, 25:{name:"ADD " + $index$$52$$ + ",DE", $ast$:$o$$.$ADD16$($registerH$$, $register_registerL$$, "d", "e")}, 33:{name:"LD " + $index$$52$$ + ",nn", $ast$:$o$$.$LD16$($registerH$$, $register_registerL$$)}, 34:{name:"LD (nn)," + $index$$52$$, $ast$:$o$$.$LD_NN$($registerH$$, $register_registerL$$)}, 35:{name:"INC " + $index$$52$$, $ast$:$o$$.$INC16$($registerH$$, $register_registerL$$)}, 
  42:{name:"LD " + $index$$52$$ + ",(nn)", $ast$:$o$$.$LD16$($registerH$$, $register_registerL$$, "n", "n")}, 43:{name:"DEC " + $index$$52$$, $ast$:$o$$.$DEC16$($registerH$$, $register_registerL$$)}, 52:{name:"INC (" + $index$$52$$ + "+d)", $ast$:$o$$.$INC_X$($registerH$$, $register_registerL$$)}, 53:{name:"DEC (" + $index$$52$$ + "+d)", $ast$:$o$$.$DEC_X$($registerH$$, $register_registerL$$)}, 54:{name:"LD (" + $index$$52$$ + "+d),n", $ast$:$o$$.$LD_X$($registerH$$, $register_registerL$$)}, 57:{name:"ADD " + 
  $index$$52$$ + ",SP", $ast$:$o$$.$ADD16$($registerH$$, $register_registerL$$, "sp")}, 70:{name:"LD B,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("b", $registerH$$, $register_registerL$$)}, 78:{name:"LD C,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("c", $registerH$$, $register_registerL$$)}, 84:{name:" LD D," + $index$$52$$ + "H *", $ast$:$o$$.$LD8$("d", $registerH$$)}, 86:{name:"LD D,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("d", $registerH$$, $register_registerL$$)}, 93:{name:"LD E," + 
  $index$$52$$ + "L *", $ast$:$o$$.$LD8$("e", $register_registerL$$)}, 94:{name:"LD E,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("e", $registerH$$, $register_registerL$$)}, 96:{name:"LD " + $index$$52$$ + "H,B", $ast$:$o$$.$LD8$($registerH$$, "b")}, 97:{name:"LD " + $index$$52$$ + "H,C", $ast$:$o$$.$LD8$($registerH$$, "c")}, 98:{name:"LD " + $index$$52$$ + "H,D", $ast$:$o$$.$LD8$($registerH$$, "d")}, 99:{name:"LD " + $index$$52$$ + "H,E", $ast$:$o$$.$LD8$($registerH$$, "e")}, 100:{name:"LD " + 
  $index$$52$$ + "H," + $index$$52$$ + "H", $ast$:$o$$.$NOOP$()}, 101:{name:"LD " + $index$$52$$ + "H," + $index$$52$$ + "L *", $ast$:$o$$.$LD8_D$($registerH$$, $register_registerL$$)}, 102:{name:"LD H,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("h", $registerH$$, $register_registerL$$)}, 103:{name:"LD " + $index$$52$$ + "H,A", $ast$:$o$$.$LD8$($registerH$$, "a")}, 104:{name:"LD " + $index$$52$$ + "L,B", $ast$:$o$$.$LD8$($register_registerL$$, "b")}, 105:{name:"LD " + $index$$52$$ + "L,C", $ast$:$o$$.$LD8$($register_registerL$$, 
  "c")}, 106:{name:"LD " + $index$$52$$ + "L,D", $ast$:$o$$.$LD8$($register_registerL$$, "d")}, 107:{name:"LD " + $index$$52$$ + "L,E", $ast$:$o$$.$LD8$($register_registerL$$, "e")}, 108:{name:"LD " + $index$$52$$ + "L," + $index$$52$$ + "H", $ast$:$o$$.$LD8_D$($register_registerL$$, $registerH$$)}, 109:{name:"LD " + $index$$52$$ + "L," + $index$$52$$ + "L *", $ast$:$o$$.$NOOP$()}, 110:{name:"LD L,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("l", $registerH$$, $register_registerL$$)}, 111:{name:"LD " + 
  $index$$52$$ + "L,A *", $ast$:$o$$.$LD8$($register_registerL$$, "a")}, 112:{name:"LD (" + $index$$52$$ + "+d),B", $ast$:$o$$.$LD_X$("b", $registerH$$, $register_registerL$$)}, 113:{name:"LD (" + $index$$52$$ + "+d),C", $ast$:$o$$.$LD_X$("c", $registerH$$, $register_registerL$$)}, 114:{name:"LD (" + $index$$52$$ + "+d),D", $ast$:$o$$.$LD_X$("d", $registerH$$, $register_registerL$$)}, 115:{name:"LD (" + $index$$52$$ + "+d),E", $ast$:$o$$.$LD_X$("e", $registerH$$, $register_registerL$$)}, 116:{name:"LD (" + 
  $index$$52$$ + "+d),H", $ast$:$o$$.$LD_X$("h", $registerH$$, $register_registerL$$)}, 117:{name:"LD (" + $index$$52$$ + "+d),L", $ast$:$o$$.$LD_X$("l", $registerH$$, $register_registerL$$)}, 118:{name:"LD (" + $index$$52$$ + "+d),B", $ast$:$o$$.$LD_X$("b", $registerH$$, $register_registerL$$)}, 119:{name:"LD (" + $index$$52$$ + "+d),A", $ast$:$o$$.$LD_X$("a", $registerH$$, $register_registerL$$)}, 126:{name:"LD A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$LD8_D$("a", $registerH$$, $register_registerL$$)}, 
  124:{name:"LD A," + $index$$52$$ + "H", $ast$:$o$$.$LD8$("a", $registerH$$)}, 125:{name:"LD A," + $index$$52$$ + "L", $ast$:$o$$.$LD8$("a", $register_registerL$$)}, 132:{name:"ADD A," + $index$$52$$ + "H", $ast$:$o$$.$ADD$($register_registerL$$)}, 133:{name:"ADD A," + $index$$52$$ + "L", $ast$:$o$$.$ADD$($register_registerL$$)}, 134:{name:"ADD A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$ADD_X$($registerH$$, $register_registerL$$)}, 140:{name:"ADC A," + $index$$52$$ + "H", $ast$:$o$$.$ADC$($register_registerL$$)}, 
  141:{name:"ADC A," + $index$$52$$ + "L", $ast$:$o$$.$ADC$($register_registerL$$)}, 142:{name:"ADC A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$ADC_X$($registerH$$, $register_registerL$$)}, 148:{name:"SUB A," + $index$$52$$ + "H", $ast$:$o$$.$SUB$($register_registerL$$)}, 149:{name:"SUB A," + $index$$52$$ + "L", $ast$:$o$$.$SUB$($register_registerL$$)}, 150:{name:"SUB A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$SUB_X$($registerH$$, $register_registerL$$)}, 156:{name:"SBC A," + $index$$52$$ + "H", $ast$:$o$$.$SBC$($register_registerL$$)}, 
  157:{name:"SBC A," + $index$$52$$ + "L", $ast$:$o$$.$SBC$($register_registerL$$)}, 158:{name:"SBC A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$SBC_X$($registerH$$, $register_registerL$$)}, 166:{name:"AND A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$AND_X$($registerH$$, $register_registerL$$)}, 174:{name:"XOR A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$XOR_X$($registerH$$, $register_registerL$$)}, 182:{name:"OR A,(" + $index$$52$$ + "+d)", $ast$:$o$$.$OR_X$($registerH$$, $register_registerL$$)}, 190:{name:"CP (" + 
  $index$$52$$ + "+d)", $ast$:$o$$.$CP_X$($registerH$$, $register_registerL$$)}, 203:"IX" == $index$$52$$ ? $opcodeTableDDCB$$ : $opcodeTableFDCB$$, 225:{name:"POP " + $index$$52$$, $ast$:$o$$.$POP$($registerH$$, $register_registerL$$)}, 227:{name:"EX SP,(" + $index$$52$$ + ")", $ast$:$o$$.$EX_SP_X$($registerH$$, $register_registerL$$)}, 229:{name:"PUSH " + $index$$52$$, $ast$:$o$$.$PUSH$($registerH$$, $register_registerL$$)}, 233:{name:"JP (" + $index$$52$$ + ")", $ast$:$o$$.$JP_X$($registerH$$, 
  $register_registerL$$)}, 249:{name:"LD SP," + $index$$52$$, $ast$:$o$$.$LD_SP$($registerH$$, $register_registerL$$)}};
}
;var $opcodeTableED$$ = {64:{name:"IN B,(C)", $ast$:$o$$.$IN$("b", "c")}, 66:{name:"SBC HL,BC", $ast$:$o$$.$SBC16$("b", "c")}, 65:{name:"OUT (C),B", $ast$:$o$$.$OUT$("c", "b")}, 67:{name:"LD (nn),BC", $ast$:$o$$.$LD_NN$("b", "c")}, 68:{name:"NEG", $ast$:$o$$.$NEG$()}, 69:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 70:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 72:{name:"IN C,(C)", $ast$:$o$$.$IN$("c", "c")}, 73:{name:"OUT (C),C", $ast$:$o$$.$OUT$("c", "c")}, 74:{name:"ADC HL,BC", $ast$:$o$$.$ADC16$("b", 
"c")}, 75:{name:"LD BC,(nn)", $ast$:$o$$.$LD16$("b", "c", "n", "n")}, 76:{name:"NEG", $ast$:$o$$.$NEG$()}, 77:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 78:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 79:{name:"LD R,A", $ast$:$o$$.$LD8$("r", "a")}, 80:{name:"IN D,(C)", $ast$:$o$$.$IN$("d", "c")}, 81:{name:"OUT (C),D", $ast$:$o$$.$OUT$("c", "d")}, 82:{name:"SBC HL,DE", $ast$:$o$$.$SBC16$("d", "e")}, 83:{name:"LD (nn),DE", $ast$:$o$$.$LD_NN$("d", "e")}, 84:{name:"NEG", $ast$:$o$$.$NEG$()}, 85:{name:"RETN / RETI", 
$ast$:$o$$.$RETN_RETI$()}, 86:{name:"IM 1", $ast$:$o$$.$IM$(1)}, 87:{name:"LD A,I", $ast$:$o$$.$LD8$("a", "i")}, 88:{name:"IN E,(C)", $ast$:$o$$.$IN$("e", "c")}, 89:{name:"OUT (C),E", $ast$:$o$$.$OUT$("c", "e")}, 90:{name:"ADC HL,DE", $ast$:$o$$.$ADC16$("d", "e")}, 91:{name:"LD DE,(nn)", $ast$:$o$$.$LD16$("d", "e", "n", "n")}, 92:{name:"NEG", $ast$:$o$$.$NEG$()}, 95:{name:"LD A,R", $ast$:$o$$.$LD8$("a", "r")}, 96:{name:"IN H,(C)", $ast$:$o$$.$IN$("h", "c")}, 97:{name:"OUT (C),H", $ast$:$o$$.$OUT$("c", 
"h")}, 98:{name:"SBC HL,HL", $ast$:$o$$.$SBC16$("h", "l")}, 99:{name:"LD (nn),HL", $ast$:$o$$.$LD_NN$("h", "l")}, 100:{name:"NEG", $ast$:$o$$.$NEG$()}, 102:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 104:{name:"IN L,(C)", $ast$:$o$$.$IN$("l", "c")}, 105:{name:"OUT (C),L", $ast$:$o$$.$OUT$("c", "l")}, 106:{name:"ADC HL,HL", $ast$:$o$$.$ADC16$("h", "l")}, 107:{name:"LD HL,(nn)", $ast$:$o$$.$LD16$("h", "l", "n", "n")}, 108:{name:"NEG", $ast$:$o$$.$NEG$()}, 110:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 115:{name:"LD (nn),SP", 
$ast$:$o$$.$LD_NN$("sp")}, 116:{name:"NEG", $ast$:$o$$.$NEG$()}, 118:{name:"IM 1", $ast$:$o$$.$IM$(1)}, 120:{name:"IN A,(C)", $ast$:$o$$.$IN$("a", "c")}, 121:{name:"OUT (C),A", $ast$:$o$$.$OUT$("c", "a")}, 122:{name:"ADC HL,SP", $ast$:$o$$.$ADC16$("sp")}, 124:{name:"NEG", $ast$:$o$$.$NEG$()}, 160:{name:"LDI", $ast$:$o$$.$LDI$()}, 161:{name:"CPI", $ast$:$o$$.$CPI$()}, 162:{name:"INI", $ast$:$o$$.$INI$()}, 163:{name:"OUTI", $ast$:$o$$.$OUTI$()}, 168:{name:"LDD", $ast$:$o$$.$LDD$()}, 171:{name:"OUTD", 
$ast$:$o$$.$OUTD$()}, 176:{name:"LDIR", $ast$:$o$$.$LDIR$()}, 177:{name:"CPIR", $ast$:$o$$.$CPIR$()}, 179:{name:"OTIR", $ast$:$o$$.$OTIR$()}, 184:{name:"LDDR", $ast$:$o$$.$LDDR$()}};
var $opcodeTable$$ = [{name:"NOP", $ast$:$o$$.$NOOP$()}, {name:"LD BC,nn", $ast$:$o$$.$LD16$("b", "c")}, {name:"LD (BC),A", $ast$:$o$$.$LD_WRITE_MEM$("b", "c", "a")}, {name:"INC BC", $ast$:$o$$.$INC16$("b", "c")}, {name:"INC B", $ast$:$o$$.$INC8$("b")}, {name:"DEC B", $ast$:$o$$.$DEC8$("b")}, {name:"LD B,n", $ast$:$o$$.$LD8$("b")}, {name:"RLCA", $ast$:$o$$.$RLCA$()}, {name:"EX AF AF'", $ast$:$o$$.$EX_AF$()}, {name:"ADD HL,BC", $ast$:$o$$.$ADD16$("h", "l", "b", "c")}, {name:"LD A,(BC)", $ast$:$o$$.$LD8$("a", 
"b", "c")}, {name:"DEC BC", $ast$:$o$$.$DEC16$("b", "c")}, {name:"INC C", $ast$:$o$$.$INC8$("c")}, {name:"DEC C", $ast$:$o$$.$DEC8$("c")}, {name:"LD C,n", $ast$:$o$$.$LD8$("c")}, {name:"RRCA", $ast$:$o$$.$RRCA$()}, {name:"DJNZ (PC+e)", $ast$:$o$$.$DJNZ$()}, {name:"LD DE,nn", $ast$:$o$$.$LD16$("d", "e")}, {name:"LD (DE),A", $ast$:$o$$.$LD_WRITE_MEM$("d", "e", "a")}, {name:"INC DE", $ast$:$o$$.$INC16$("d", "e")}, {name:"INC D", $ast$:$o$$.$INC8$("d")}, {name:"DEC D", $ast$:$o$$.$DEC8$("d")}, {name:"LD D,n", 
$ast$:$o$$.$LD8$("d")}, {name:"RLA", $ast$:$o$$.$RLA$()}, {name:"JR (PC+e)", $ast$:$o$$.$JP$()}, {name:"ADD HL,DE", $ast$:$o$$.$ADD16$("h", "l", "d", "e")}, {name:"LD A,(DE)", $ast$:$o$$.$LD8$("a", "d", "e")}, {name:"DEC DE", $ast$:$o$$.$DEC16$("d", "e")}, {name:"INC E", $ast$:$o$$.$INC8$("e")}, {name:"DEC E", $ast$:$o$$.$DEC8$("e")}, {name:"LD E,n", $ast$:$o$$.$LD8$("e")}, {name:"RRA", $ast$:$o$$.$RRA$()}, {name:"JR NZ,(PC+e)", $ast$:$o$$.$JRNZ$()}, {name:"LD HL,nn", $ast$:$o$$.$LD16$("h", "l")}, 
{name:"LD (nn),HL", $ast$:$o$$.$LD_NN$("h", "l")}, {name:"INC HL", $ast$:$o$$.$INC16$("h", "l")}, {name:"INC H", $ast$:$o$$.$INC8$("h")}, {name:"DEC H", $ast$:$o$$.$DEC8$("h")}, {name:"LD H,n", $ast$:$o$$.$LD8$("h")}, {name:"DAA", $ast$:$o$$.$DAA$()}, {name:"JR Z,(PC+e)", $ast$:$o$$.$JRZ$()}, {name:"ADD HL,HL", $ast$:$o$$.$ADD16$("h", "l", "h", "l")}, {name:"LD HL,(nn)", $ast$:$o$$.$LD16$("h", "l", "n", "n")}, {name:"DEC HL", $ast$:$o$$.$DEC16$("h", "l")}, {name:"INC L", $ast$:$o$$.$INC8$("l")}, 
{name:"DEC L", $ast$:$o$$.$DEC8$("l")}, {name:"LD L,n", $ast$:$o$$.$LD8$("l")}, {name:"CPL", $ast$:$o$$.$CPL$()}, {name:"JR NC,(PC+e)", $ast$:$o$$.$JRNC$()}, {name:"LD SP,nn", $ast$:$o$$.$LD_SP$()}, {name:"LD (nn),A", $ast$:$o$$.$LD_WRITE_MEM$("n", "n", "a")}, {name:"INC SP", $ast$:$o$$.$INC8$("s", "p")}, {name:"INC (HL)", $ast$:$o$$.$INC8$("h", "l")}, {name:"DEC (HL)", $ast$:$o$$.$DEC8$("h", "l")}, {name:"LD (HL),n", $ast$:$o$$.$LD_WRITE_MEM$("h", "l")}, {name:"SCF", $ast$:$o$$.$SCF$()}, {name:"JR C,(PC+e)", 
$ast$:$o$$.$JRC$()}, {name:"ADD HL,SP", $ast$:$o$$.$ADD16$("h", "l", "sp")}, {name:"LD A,(nn)", $ast$:$o$$.$LD8$("a", "n", "n")}, {name:"DEC SP", $ast$:$o$$.$DEC8$("s", "p")}, {name:"INC A", $ast$:$o$$.$INC8$("a")}, {name:"DEC A", $ast$:$o$$.$DEC8$("a")}, {name:"LD A,n", $ast$:$o$$.$LD8$("a")}, {name:"CCF", $ast$:$o$$.$CCF$()}, {name:"LD B,B", $ast$:$o$$.$NOOP$()}, {name:"LD B,C", $ast$:$o$$.$LD8$("b", "c")}, {name:"LD B,D", $ast$:$o$$.$LD8$("b", "d")}, {name:"LD B,E", $ast$:$o$$.$LD8$("b", "e")}, 
{name:"LD B,H", $ast$:$o$$.$LD8$("b", "h")}, {name:"LD B,L", $ast$:$o$$.$LD8$("b", "l")}, {name:"LD B,(HL)", $ast$:$o$$.$LD8$("b", "h", "l")}, {name:"LD B,A", $ast$:$o$$.$LD8$("b", "a")}, {name:"LD C,B", $ast$:$o$$.$LD8$("c", "b")}, {name:"LD C,C", $ast$:$o$$.$NOOP$()}, {name:"LD C,D", $ast$:$o$$.$LD8$("c", "d")}, {name:"LD C,E", $ast$:$o$$.$LD8$("c", "e")}, {name:"LD C,H", $ast$:$o$$.$LD8$("c", "h")}, {name:"LD C,L", $ast$:$o$$.$LD8$("c", "l")}, {name:"LD C,(HL)", $ast$:$o$$.$LD8$("c", "h", "l")}, 
{name:"LD C,A", $ast$:$o$$.$LD8$("c", "a")}, {name:"LD D,B", $ast$:$o$$.$LD8$("d", "b")}, {name:"LD D,C", $ast$:$o$$.$LD8$("d", "c")}, {name:"LD D,D", $ast$:$o$$.$NOOP$()}, {name:"LD D,E", $ast$:$o$$.$LD8$("d", "e")}, {name:"LD D,H", $ast$:$o$$.$LD8$("d", "h")}, {name:"LD D,L", $ast$:$o$$.$LD8$("d", "l")}, {name:"LD D,(HL)", $ast$:$o$$.$LD8$("d", "h", "l")}, {name:"LD D,A", $ast$:$o$$.$LD8$("d", "a")}, {name:"LD E,B", $ast$:$o$$.$LD8$("e", "b")}, {name:"LD E,C", $ast$:$o$$.$LD8$("e", "c")}, {name:"LD E,D", 
$ast$:$o$$.$LD8$("e", "d")}, {name:"LD E,E", $ast$:$o$$.$NOOP$()}, {name:"LD E,H", $ast$:$o$$.$LD8$("e", "h")}, {name:"LD E,L", $ast$:$o$$.$LD8$("e", "l")}, {name:"LD E,(HL)", $ast$:$o$$.$LD8$("e", "h", "l")}, {name:"LD E,A", $ast$:$o$$.$LD8$("e", "a")}, {name:"LD H,B", $ast$:$o$$.$LD8$("h", "b")}, {name:"LD H,C", $ast$:$o$$.$LD8$("h", "c")}, {name:"LD H,D", $ast$:$o$$.$LD8$("h", "d")}, {name:"LD H,E", $ast$:$o$$.$LD8$("h", "e")}, {name:"LD H,H", $ast$:$o$$.$NOOP$()}, {name:"LD H,L", $ast$:$o$$.$LD8$("h", 
"l")}, {name:"LD H,(HL)", $ast$:$o$$.$LD8$("h", "h", "l")}, {name:"LD H,A", $ast$:$o$$.$LD8$("h", "a")}, {name:"LD L,B", $ast$:$o$$.$LD8$("l", "b")}, {name:"LD L,C", $ast$:$o$$.$LD8$("l", "c")}, {name:"LD L,D", $ast$:$o$$.$LD8$("l", "d")}, {name:"LD L,E", $ast$:$o$$.$LD8$("l", "e")}, {name:"LD L,H", $ast$:$o$$.$LD8$("l", "h")}, {name:"LD L,L", $ast$:$o$$.$NOOP$()}, {name:"LD L,(HL)", $ast$:$o$$.$LD8$("l", "h", "l")}, {name:"LD L,A", $ast$:$o$$.$LD8$("l", "a")}, {name:"LD (HL),B", $ast$:$o$$.$LD_WRITE_MEM$("h", 
"l", "b")}, {name:"LD (HL),C", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "c")}, {name:"LD (HL),D", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "d")}, {name:"LD (HL),E", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "e")}, {name:"LD (HL),H", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "h")}, {name:"LD (HL),L", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "l")}, {name:"HALT", $ast$:$o$$.$HALT$()}, {name:"LD (HL),A", $ast$:$o$$.$LD_WRITE_MEM$("h", "l", "a")}, {name:"LD A,B", $ast$:$o$$.$LD8$("a", "b")}, {name:"LD A,C", $ast$:$o$$.$LD8$("a", 
"c")}, {name:"LD A,D", $ast$:$o$$.$LD8$("a", "d")}, {name:"LD A,E", $ast$:$o$$.$LD8$("a", "e")}, {name:"LD A,H", $ast$:$o$$.$LD8$("a", "h")}, {name:"LD A,L", $ast$:$o$$.$LD8$("a", "l")}, {name:"LD A,(HL)", $ast$:$o$$.$LD8$("a", "h", "l")}, {name:"LD A,A", $ast$:$o$$.$NOOP$()}, {name:"ADD A,B", $ast$:$o$$.$ADD$("b")}, {name:"ADD A,C", $ast$:$o$$.$ADD$("c")}, {name:"ADD A,D", $ast$:$o$$.$ADD$("d")}, {name:"ADD A,E", $ast$:$o$$.$ADD$("e")}, {name:"ADD A,H", $ast$:$o$$.$ADD$("h")}, {name:"ADD A,L", $ast$:$o$$.$ADD$("l")}, 
{name:"ADD A,(HL)", $ast$:$o$$.$ADD$("h", "l")}, {name:"ADD A,A", $ast$:$o$$.$ADD$("a")}, {name:"ADC A,B", $ast$:$o$$.$ADC$("b")}, {name:"ADC A,C", $ast$:$o$$.$ADC$("c")}, {name:"ADC A,D", $ast$:$o$$.$ADC$("d")}, {name:"ADC A,E", $ast$:$o$$.$ADC$("e")}, {name:"ADC A,H", $ast$:$o$$.$ADC$("h")}, {name:"ADC A,L", $ast$:$o$$.$ADC$("l")}, {name:"ADC A,(HL)", $ast$:$o$$.$ADC$("h", "l")}, {name:"ADC A,A", $ast$:$o$$.$ADC$("a")}, {name:"SUB A,B", $ast$:$o$$.$SUB$("b")}, {name:"SUB A,C", $ast$:$o$$.$SUB$("c")}, 
{name:"SUB A,D", $ast$:$o$$.$SUB$("d")}, {name:"SUB A,E", $ast$:$o$$.$SUB$("e")}, {name:"SUB A,H", $ast$:$o$$.$SUB$("h")}, {name:"SUB A,L", $ast$:$o$$.$SUB$("l")}, {name:"SUB A,(HL)", $ast$:$o$$.$SUB$("h", "l")}, {name:"SUB A,A", $ast$:$o$$.$SUB$("a")}, {name:"SBC A,B", $ast$:$o$$.$SBC$("b")}, {name:"SBC A,C", $ast$:$o$$.$SBC$("c")}, {name:"SBC A,D", $ast$:$o$$.$SBC$("d")}, {name:"SBC A,E", $ast$:$o$$.$SBC$("e")}, {name:"SBC A,H", $ast$:$o$$.$SBC$("h")}, {name:"SBC A,L", $ast$:$o$$.$SBC$("l")}, {name:"SBC A,(HL)", 
$ast$:$o$$.$SBC$("h", "l")}, {name:"SBC A,A", $ast$:$o$$.$SBC$("a")}, {name:"AND A,B", $ast$:$o$$.$AND$("b")}, {name:"AND A,C", $ast$:$o$$.$AND$("c")}, {name:"AND A,D", $ast$:$o$$.$AND$("d")}, {name:"AND A,E", $ast$:$o$$.$AND$("e")}, {name:"AND A,H", $ast$:$o$$.$AND$("h")}, {name:"AND A,L", $ast$:$o$$.$AND$("l")}, {name:"AND A,(HL)", $ast$:$o$$.$AND$("h", "l")}, {name:"AND A,A", $ast$:$o$$.$AND$("a")}, {name:"XOR A,B", $ast$:$o$$.$XOR$("b")}, {name:"XOR A,C", $ast$:$o$$.$XOR$("c")}, {name:"XOR A,D", 
$ast$:$o$$.$XOR$("d")}, {name:"XOR A,E", $ast$:$o$$.$XOR$("e")}, {name:"XOR A,H", $ast$:$o$$.$XOR$("h")}, {name:"XOR A,L", $ast$:$o$$.$XOR$("l")}, {name:"XOR A,(HL)", $ast$:$o$$.$XOR$("h", "l")}, {name:"XOR A,A", $ast$:$o$$.$XOR$("a")}, {name:"OR A,B", $ast$:$o$$.$OR$("b")}, {name:"OR A,C", $ast$:$o$$.$OR$("c")}, {name:"OR A,D", $ast$:$o$$.$OR$("d")}, {name:"OR A,E", $ast$:$o$$.$OR$("e")}, {name:"OR A,H", $ast$:$o$$.$OR$("h")}, {name:"OR A,L", $ast$:$o$$.$OR$("l")}, {name:"OR A,(HL)", $ast$:$o$$.$OR$("h", 
"l")}, {name:"OR A,A", $ast$:$o$$.$OR$("a")}, {name:"CP A,B", $ast$:$o$$.$CP$("b")}, {name:"CP A,C", $ast$:$o$$.$CP$("c")}, {name:"CP A,D", $ast$:$o$$.$CP$("d")}, {name:"CP A,E", $ast$:$o$$.$CP$("e")}, {name:"CP A,H", $ast$:$o$$.$CP$("h")}, {name:"CP A,L", $ast$:$o$$.$CP$("l")}, {name:"CP A,(HL)", $ast$:$o$$.$CP$("h", "l")}, {name:"CP A,A", $ast$:$o$$.$CP$("a")}, {name:"RET NZ", $ast$:$o$$.$RET$("==", 64)}, {name:"POP BC", $ast$:$o$$.$POP$("b", "c")}, {name:"JP NZ,(nn)", $ast$:$o$$.$JP$("==", 64)}, 
{name:"JP (nn)", $ast$:$o$$.$JP$()}, {name:"CALL NZ (nn)", $ast$:$o$$.$CALL$("==", 64)}, {name:"PUSH BC", $ast$:$o$$.$PUSH$("b", "c")}, {name:"ADD A,n", $ast$:$o$$.$ADD$()}, {name:"RST 0x00", $ast$:$o$$.$RST$(0)}, {name:"RET Z", $ast$:$o$$.$RET$("!=", 64)}, {name:"RET", $ast$:$o$$.$RET$()}, {name:"JP Z,(nn)", $ast$:$o$$.$JP$("!=", 64)}, $opcodeTableCB$$, {name:"CALL Z (nn)", $ast$:$o$$.$CALL$("!=", 64)}, {name:"CALL (nn)", $ast$:$o$$.$CALL$()}, {name:"ADC A,n", $ast$:$o$$.$ADC$()}, {name:"RST 0x08", 
$ast$:$o$$.$RST$(8)}, {name:"RET NC", $ast$:$o$$.$RET$("==", 1)}, {name:"POP DE", $ast$:$o$$.$POP$("d", "e")}, {name:"JP NC,(nn)", $ast$:$o$$.$JP$("==", 1)}, {name:"OUT (n),A", $ast$:$o$$.$OUT$("a")}, {name:"CALL NC (nn)", $ast$:$o$$.$CALL$("==", 1)}, {name:"PUSH DE", $ast$:$o$$.$PUSH$("d", "e")}, {name:"SUB n", $ast$:$o$$.$SUB$()}, {name:"RST 0x10", $ast$:$o$$.$RST$(16)}, {name:"RET C", $ast$:$o$$.$RET$("!=", 1)}, {name:"EXX", $ast$:$o$$.$EXX$()}, {name:"JP C,(nn)", $ast$:$o$$.$JP$("!=", 1)}, {name:"IN A,(n)", 
$ast$:$o$$.$IN$("a")}, {name:"CALL C (nn)", $ast$:$o$$.$CALL$("!=", 1)}, $generateIndexTable$$("IX"), {name:"SBC A,n", $ast$:$o$$.$SBC$()}, {name:"RST 0x18", $ast$:$o$$.$RST$(24)}, {name:"RET PO", $ast$:$o$$.$RET$("==", 4)}, {name:"POP HL", $ast$:$o$$.$POP$("h", "l")}, {name:"JP PO,(nn)", $ast$:$o$$.$JP$("==", 4)}, {name:"EX (SP),HL", $ast$:$o$$.$EX_SP_HL$()}, {name:"CALL PO (nn)", $ast$:$o$$.$CALL$("==", 4)}, {name:"PUSH HL", $ast$:$o$$.$PUSH$("h", "l")}, {name:"AND (n)", $ast$:$o$$.$AND$()}, {name:"RST 0x20", 
$ast$:$o$$.$RST$(32)}, {name:"RET PE", $ast$:$o$$.$RET$("!=", 4)}, {name:"JP (HL)", $ast$:$o$$.$JP$("h", "l")}, {name:"JP PE,(nn)", $ast$:$o$$.$JP$("!=", 4)}, {name:"EX DE,HL", $ast$:$o$$.$EX_DE_HL$()}, {name:"CALL PE (nn)", $ast$:$o$$.$CALL$("!=", 4)}, $opcodeTableED$$, {name:"XOR n", $ast$:$o$$.$XOR$()}, {name:"RST 0x28", $ast$:$o$$.$RST$(40)}, {name:"RET P", $ast$:$o$$.$RET$("==", 128)}, {name:"POP AF", $ast$:$o$$.$POP$("a", "f")}, {name:"JP P,(nn)", $ast$:$o$$.$JP$("==", 128)}, {name:"DI", $ast$:$o$$.$DI$()}, 
{name:"CALL P (nn)", $ast$:$o$$.$CALL$("==", 128)}, {name:"PUSH AF", $ast$:$o$$.$PUSH$("a", "f")}, {name:"OR n", $ast$:$o$$.$OR$()}, {name:"RST 0x30", $ast$:$o$$.$RST$(48)}, {name:"RET M", $ast$:$o$$.$RET$("!=", 128)}, {name:"LD SP,HL", $ast$:$o$$.$LD_SP$("h", "l")}, {name:"JP M,(nn)", $ast$:$o$$.$JP$("!=", 128)}, {name:"EI", $ast$:$o$$.$EI$()}, {name:"CALL M (nn)", $ast$:$o$$.$CALL$("!=", 128)}, $generateIndexTable$$("IY"), {name:"CP n", $ast$:$o$$.$CP$()}, {name:"RST 0x38", $ast$:$o$$.$RST$(56)}];
var $Analyzer$$ = function() {
  function $Analyzer$$1$$() {
    this.$bytecodes$ = {};
    this.$ast$ = [];
    this.$missingOpcodes$ = {};
  }
  $Analyzer$$1$$.prototype = {$analyze$:function $$Analyzer$$1$$$$$analyze$$($bytecodes$$) {
    var $i$$34$$ = 0;
    this.$bytecodes$ = $bytecodes$$;
    this.$ast$ = Array(this.$bytecodes$.length);
    $JSSMS$Utils$console$time$$("Analyzing");
    for ($i$$34$$ = 0;$i$$34$$ < this.$bytecodes$.length;$i$$34$$++) {
      this.$a$($i$$34$$), this.$f$($i$$34$$);
    }
    $JSSMS$Utils$console$timeEnd$$("Analyzing");
    for ($i$$34$$ in this.$missingOpcodes$) {
      console.error("Missing opcode", $i$$34$$, this.$missingOpcodes$[$i$$34$$]);
    }
  }, $analyzeFromAddress$:function $$Analyzer$$1$$$$$analyzeFromAddress$$($bytecodes$$1$$) {
    this.$bytecodes$ = [$bytecodes$$1$$];
    this.$ast$ = [];
    this.$missingOpcodes$ = {};
    this.$a$(0);
    this.$bytecodes$[0][this.$bytecodes$[0].length - 1].$isFunctionEnder$ = !0;
    this.$ast$ = [this.$bytecodes$];
    for (var $i$$35$$ in this.$missingOpcodes$) {
      console.error("Missing opcode", $i$$35$$, this.$missingOpcodes$[$i$$35$$]);
    }
  }, $a$:function $$Analyzer$$1$$$$$a$$($page$$5$$) {
    var $self$$6$$ = this;
    this.$bytecodes$[$page$$5$$] = this.$bytecodes$[$page$$5$$].map(function($bytecode$$7$$) {
      var $i$$36_opcode$$18$$;
      switch($bytecode$$7$$.$opcode$.length) {
        case 1:
          $i$$36_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]];
          break;
        case 2:
          $i$$36_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]][$bytecode$$7$$.$opcode$[1]];
          break;
        case 3:
          $i$$36_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]][$bytecode$$7$$.$opcode$[1]][$bytecode$$7$$.$opcode$[2]];
          break;
        default:
          $JSSMS$Utils$console$error$$("Something went wrong in parsing. Opcode: [" + $bytecode$$7$$.$opcode$.join(" ") + "]");
      }
      if ($i$$36_opcode$$18$$ && $i$$36_opcode$$18$$.$ast$) {
        var $ast$$ = $i$$36_opcode$$18$$.$ast$($bytecode$$7$$.$operand$, $bytecode$$7$$.target, $bytecode$$7$$.$nextAddress$);
        Array.isArray($ast$$) || void 0 === $ast$$ || ($ast$$ = [$ast$$]);
        $bytecode$$7$$.$ast$ = $ast$$;
        $DEBUG$$ && ($bytecode$$7$$.name = $i$$36_opcode$$18$$.name, $i$$36_opcode$$18$$.$opcode$ && ($bytecode$$7$$.$opcode$ = $i$$36_opcode$$18$$.$opcode$($bytecode$$7$$.$operand$, $bytecode$$7$$.target, $bytecode$$7$$.$nextAddress$)));
      } else {
        $i$$36_opcode$$18$$ = $bytecode$$7$$.$hexOpcode$, $self$$6$$.$missingOpcodes$[$i$$36_opcode$$18$$] = void 0 !== $self$$6$$.$missingOpcodes$[$i$$36_opcode$$18$$] ? $self$$6$$.$missingOpcodes$[$i$$36_opcode$$18$$] + 1 : 1;
      }
      return $bytecode$$7$$;
    });
  }, $f$:function $$Analyzer$$1$$$$$f$$($page$$6$$) {
    this.$ast$[$page$$6$$] = [];
    var $self$$7$$ = this, $pointer$$ = -1, $startNewFunction$$ = !0, $prevBytecode$$ = {};
    this.$bytecodes$[$page$$6$$].forEach(function($bytecode$$8$$) {
      if ($bytecode$$8$$.$isJumpTarget$ || $startNewFunction$$) {
        $pointer$$++, $self$$7$$.$ast$[$page$$6$$][$pointer$$] = [], $startNewFunction$$ = !1, $prevBytecode$$.$isFunctionEnder$ = !0;
      }
      $self$$7$$.$ast$[$page$$6$$][$pointer$$].push($bytecode$$8$$);
      $bytecode$$8$$.$isFunctionEnder$ && ($startNewFunction$$ = !0);
      $prevBytecode$$ = $bytecode$$8$$;
    });
  }};
  return $Analyzer$$1$$;
}();
var $Optimizer$$ = function() {
  function $Optimizer$$1$$() {
    this.$ast$ = [];
  }
  $Optimizer$$1$$.prototype = {$optimize$:function $$Optimizer$$1$$$$$optimize$$($functions_i$$37$$) {
    this.$ast$ = $functions_i$$37$$;
    for ($functions_i$$37$$ = 0;$functions_i$$37$$ < this.$ast$.length;$functions_i$$37$$++) {
      this.$g$($functions_i$$37$$);
    }
  }, $g$:function $$Optimizer$$1$$$$$g$$($page$$7$$) {
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$a$);
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$f$);
  }, $a$:function $$Optimizer$$1$$$$$a$$($fn$$5$$) {
    return $fn$$5$$.map(function($bytecodes$$2$$) {
      var $ast$$1$$ = $bytecodes$$2$$.$ast$;
      if (!$ast$$1$$) {
        return $bytecodes$$2$$;
      }
      $bytecodes$$2$$.$ast$ = $JSSMS$Utils$traverse$$($ast$$1$$, function($ast$$2$$) {
        if ("BinaryExpression" == $ast$$2$$.type && "Literal" == $ast$$2$$.left.type && "Literal" == $ast$$2$$.right.type) {
          var $value$$159$$ = 0;
          switch($ast$$2$$.$operator$) {
            case ">>":
              $value$$159$$ = $ast$$2$$.left.value >> $ast$$2$$.right.value;
              break;
            case "&":
              $value$$159$$ = $ast$$2$$.left.value & $ast$$2$$.right.value;
              break;
            default:
              return $JSSMS$Utils$console$log$$("Unimplemented evaluation optimization for operator", $ast$$2$$.$operator$), $ast$$2$$;
          }
          $ast$$2$$.type = "Literal";
          $ast$$2$$.value = $value$$159$$;
          $ast$$2$$.$raw$ = $DEBUG$$ ? $JSSMS$Utils$toHex$$($value$$159$$) : "" + $value$$159$$;
          delete $ast$$2$$.right;
          delete $ast$$2$$.left;
        }
        return $ast$$2$$;
      });
      return $bytecodes$$2$$;
    });
  }, $f$:function $$Optimizer$$1$$$$$f$$($fn$$6$$) {
    var $definedReg$$ = {$b$:!1, $c$:!1, $d$:!1, $e$:!1, $h$:!1, $l$:!1}, $definedRegValue$$ = {$b$:{}, $c$:{}, $d$:{}, $e$:{}, $h$:{}, $l$:{}};
    return $fn$$6$$.map(function($bytecodes$$3$$) {
      var $ast$$3$$ = $bytecodes$$3$$.$ast$;
      if (!$ast$$3$$) {
        return $bytecodes$$3$$;
      }
      $bytecodes$$3$$.$ast$ = $JSSMS$Utils$traverse$$($ast$$3$$, function($ast$$4$$) {
        "AssignmentExpression" == $ast$$4$$.type && "=" == $ast$$4$$.$operator$ && "Register" == $ast$$4$$.left.type && "Literal" == $ast$$4$$.right.type && "a" != $ast$$4$$.left.name && "f" != $ast$$4$$.left.name && ($definedReg$$[$ast$$4$$.left.name] = !0, $definedRegValue$$[$ast$$4$$.left.name] = $ast$$4$$.right);
        if ("AssignmentExpression" == $ast$$4$$.type && "Register" == $ast$$4$$.left.type && "Literal" != $ast$$4$$.right.type && "a" != $ast$$4$$.left.name && "f" != $ast$$4$$.left.name) {
          return $definedReg$$[$ast$$4$$.left.name] = !1, $definedRegValue$$[$ast$$4$$.left.name] = {}, $ast$$4$$;
        }
        if ("CallExpression" == $ast$$4$$.type) {
          return $ast$$4$$.arguments[0] && "Register" == $ast$$4$$.arguments[0].type && $definedReg$$[$ast$$4$$.arguments[0].name] && "a" != $ast$$4$$.arguments[0].name && "f" != $ast$$4$$.arguments[0].name && ($ast$$4$$.arguments[0] = $definedRegValue$$[$ast$$4$$.arguments[0].name]), $ast$$4$$.arguments[1] && "Register" == $ast$$4$$.arguments[1].type && $definedReg$$[$ast$$4$$.arguments[1].name] && "a" != $ast$$4$$.arguments[1].name && "f" != $ast$$4$$.arguments[1].name && ($ast$$4$$.arguments[1] = 
          $definedRegValue$$[$ast$$4$$.arguments[1].name]), $ast$$4$$;
        }
        if ("MemberExpression" == $ast$$4$$.type && "Register" == $ast$$4$$.$property$.type && $definedReg$$[$ast$$4$$.$property$.name] && "a" != $ast$$4$$.$property$.name && "f" != $ast$$4$$.$property$.name) {
          return $ast$$4$$.$property$ = $definedRegValue$$[$ast$$4$$.$property$.name], $ast$$4$$;
        }
        "BinaryExpression" == $ast$$4$$.type && ("Register" == $ast$$4$$.right.type && $definedReg$$[$ast$$4$$.right.name] && "a" != $ast$$4$$.right.name && "f" != $ast$$4$$.right.name && ($ast$$4$$.right = $definedRegValue$$[$ast$$4$$.right.name]), "Register" == $ast$$4$$.left.type && $definedReg$$[$ast$$4$$.left.name] && "a" != $ast$$4$$.left.name && "f" != $ast$$4$$.left.name && ($ast$$4$$.left = $definedRegValue$$[$ast$$4$$.left.name]));
        return $ast$$4$$;
      });
      return $bytecodes$$3$$;
    });
  }};
  return $Optimizer$$1$$;
}();
var $Generator$$ = function() {
  function $Generator$$1$$() {
    this.$ast$ = [];
  }
  function $getTotalTStates$$1$$($opcodes$$1$$) {
    switch($opcodes$$1$$[0]) {
      case 203:
        return $OP_CB_STATES$$[$opcodes$$1$$[1]];
      case 221:
      ;
      case 253:
        return 2 == $opcodes$$1$$.length ? $OP_DD_STATES$$[$opcodes$$1$$[1]] : $OP_INDEX_CB_STATES$$[$opcodes$$1$$[2]];
      case 237:
        return $OP_ED_STATES$$[$opcodes$$1$$[1]];
      default:
        return $OP_STATES$$[$opcodes$$1$$[0]];
    }
  }
  function $convertRegisters$$($ast$$5$$) {
    return $JSSMS$Utils$traverse$$($ast$$5$$, function($node$$4$$) {
      "Register" == $node$$4$$.type && ($node$$4$$.type = "Identifier");
      return $node$$4$$;
    });
  }
  var $whitelist$$ = "page temp location val value JSSMS.Utils.rndInt".split(" ");
  $Generator$$1$$.prototype = {$generate$:function $$Generator$$1$$$$$generate$$($functions$$1$$) {
    for (var $page$$8$$ = 0;$page$$8$$ < $functions$$1$$.length;$page$$8$$++) {
      $functions$$1$$[$page$$8$$] = $functions$$1$$[$page$$8$$].map(function($fn$$7$$) {
        var $body$$2$$ = [{type:"ExpressionStatement", expression:{type:"Literal", value:"use strict", raw:'"use strict"'}}], $name$$65$$ = $fn$$7$$[0].$address$, $tstates$$2$$ = 0;
        $fn$$7$$ = $fn$$7$$.map(function($bytecode$$9$$) {
          void 0 === $bytecode$$9$$.$ast$ && ($bytecode$$9$$.$ast$ = []);
          $tstates$$2$$ += $getTotalTStates$$1$$($bytecode$$9$$.$opcode$);
          var $decreaseTStateStmt_nextAddress$$44_updatePcStmt$$ = [{type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"-=", left:{type:"Identifier", name:"tstates"}, right:{type:"Literal", value:$tstates$$2$$, raw:$DEBUG$$ ? $JSSMS$Utils$toHex$$($tstates$$2$$) : "" + $tstates$$2$$}}}];
          $tstates$$2$$ = 0;
          $bytecode$$9$$.$ast$ = [].concat($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$, $bytecode$$9$$.$ast$);
          $bytecode$$9$$.$isFunctionEnder$ && null !== $bytecode$$9$$.$nextAddress$ && ($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$ = $bytecode$$9$$.$nextAddress$ % 16384, $decreaseTStateStmt_nextAddress$$44_updatePcStmt$$ = {type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"=", left:{type:"Identifier", name:"pc"}, right:{type:"BinaryExpression", operator:"+", left:{type:"Literal", value:$decreaseTStateStmt_nextAddress$$44_updatePcStmt$$, raw:$DEBUG$$ ? $JSSMS$Utils$toHex$$($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$) : 
          "" + $decreaseTStateStmt_nextAddress$$44_updatePcStmt$$}, right:{type:"BinaryExpression", operator:"*", left:{type:"Identifier", name:"page"}, right:{type:"Literal", value:16384, raw:"0x4000"}}}}}, $bytecode$$9$$.$ast$.push($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$));
          $DEBUG$$ && $bytecode$$9$$.$ast$[0] && ($bytecode$$9$$.$ast$[0].$leadingComments$ = [{type:"Line", value:" " + $bytecode$$9$$.label}]);
          return $bytecode$$9$$.$ast$;
        });
        $fn$$7$$.forEach(function($ast$$6$$) {
          $body$$2$$ = $body$$2$$.concat($ast$$6$$);
        });
        $body$$2$$ = $convertRegisters$$($body$$2$$);
        $body$$2$$ = $JSSMS$Utils$traverse$$($body$$2$$, function($obj$$38$$) {
          $obj$$38$$.type && "Identifier" == $obj$$38$$.type && -1 == $whitelist$$.indexOf($obj$$38$$.name) && ($obj$$38$$.name = "this." + $obj$$38$$.name);
          return $obj$$38$$;
        });
        return{type:"Program", body:[{type:"FunctionDeclaration", id:{type:"Identifier", name:$name$$65$$}, params:[{type:"Identifier", name:"page"}, {type:"Identifier", name:"temp"}, {type:"Identifier", name:"location"}], defaults:[], body:{type:"BlockStatement", body:$body$$2$$}, rest:null, generator:!1, expression:!1}]};
      });
    }
    this.$ast$ = $functions$$1$$;
  }};
  return $Generator$$1$$;
}();
var $Recompiler$$ = function() {
  function $Recompiler$$1$$($cpu$$) {
    this.$cpu$ = $cpu$$;
    this.$rom$ = [];
    this.options = {};
    this.$parser$ = {};
    this.$analyzer$ = new $Analyzer$$;
    this.$optimizer$ = new $Optimizer$$;
    this.$generator$ = new $Generator$$;
    this.$bytecodes$ = {};
  }
  $Recompiler$$1$$.prototype = {$g$:function $$Recompiler$$1$$$$$g$$($rom$$2$$) {
    this.$rom$ = $rom$$2$$;
    this.$parser$ = new $Parser$$($rom$$2$$, this.$cpu$.$frameReg$);
  }, reset:function $$Recompiler$$1$$$$reset$() {
    var $self$$8$$ = this;
    this.options.$entryPoints$ = [{$address$:0, $romPage$:0, $memPage$:0}, {$address$:56, $romPage$:0, $memPage$:0}, {$address$:102, $romPage$:0, $memPage$:0}];
    2 >= this.$rom$.length ? $JSSMS$Utils$console$log$$("Parsing full ROM") : (this.options.$pageLimit$ = 0, $JSSMS$Utils$console$log$$("Parsing initial memory page of ROM"));
    for (var $fns$$ = this.parse().$analyze$().$optimize$().$generate$(), $page$$9$$ = 0;$page$$9$$ < this.$rom$.length;$page$$9$$++) {
      $fns$$[$page$$9$$].forEach(function($fn$$8$$) {
        var $funcName$$ = $fn$$8$$.body[0].id.name;
        $DEBUG$$ && ($fn$$8$$.body[0].id.name = "_" + $JSSMS$Utils$toHex$$($funcName$$));
        $self$$8$$.$cpu$.$branches$[$page$$9$$][$funcName$$] = (new Function("return " + $self$$8$$.$f$($fn$$8$$)))();
      });
    }
  }, parse:function $$Recompiler$$1$$$$parse$() {
    var $self$$9$$ = this;
    this.options.$entryPoints$.forEach(function($entryPoint$$3$$) {
      $self$$9$$.$parser$.$addEntryPoint$($entryPoint$$3$$);
    });
    this.$parser$.parse(this.options.$pageLimit$);
    return this;
  }, $analyze$:function $$Recompiler$$1$$$$$analyze$$() {
    this.$analyzer$.$analyze$(this.$parser$.$bytecodes$);
    return this;
  }, $optimize$:function $$Recompiler$$1$$$$$optimize$$() {
    this.$optimizer$.$optimize$(this.$analyzer$.$ast$);
    return this;
  }, $generate$:function $$Recompiler$$1$$$$$generate$$() {
    this.$generator$.$generate$(this.$optimizer$.$ast$);
    return this.$generator$.$ast$;
  }, $a$:function $$Recompiler$$1$$$$$a$$($address$$24$$, $romPage$$3$$, $memPage$$1$$) {
    var $self$$10$$ = this;
    this.$parseFromAddress$($address$$24$$, $romPage$$3$$, $memPage$$1$$).$analyzeFromAddress$().$optimize$().$generate$()[0].forEach(function($fn$$9$$) {
      $DEBUG$$ && ($fn$$9$$.body[0].id.name = "_" + $JSSMS$Utils$toHex$$($fn$$9$$.body[0].id.name));
      $self$$10$$.$cpu$.$branches$[$romPage$$3$$][$address$$24$$ % 16384] = (new Function("return " + $self$$10$$.$f$($fn$$9$$)))();
    });
  }, $parseFromAddress$:function $$Recompiler$$1$$$$$parseFromAddress$$($address$$25_obj$$39$$, $romPage$$4$$, $memPage$$2$$) {
    $address$$25_obj$$39$$ = {$address$:$address$$25_obj$$39$$, $romPage$:$romPage$$4$$, $memPage$:$memPage$$2$$};
    this.$parser$.$entryPoints$.push($address$$25_obj$$39$$);
    this.$bytecodes$ = this.$parser$.$parseFromAddress$($address$$25_obj$$39$$);
    return this;
  }, $analyzeFromAddress$:function $$Recompiler$$1$$$$$analyzeFromAddress$$() {
    this.$analyzer$.$analyzeFromAddress$(this.$bytecodes$);
    return this;
  }, $f$:function $$Recompiler$$1$$$$$f$$($fn$$10$$) {
    return window.escodegen.generate($fn$$10$$, {$comment$:!0, $renumber$:!0, $hexadecimal$:!0, parse:$DEBUG$$ ? window.esprima.parse : function($c$$1$$) {
      return{type:"Program", body:[{type:"ExpressionStatement", expression:{type:"Literal", value:$c$$1$$, raw:$c$$1$$}}]};
    }});
  }};
  return $Recompiler$$1$$;
}();
window.JSSMS = $JSSMS$$;
})(global);
