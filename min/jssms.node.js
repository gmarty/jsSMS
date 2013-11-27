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
  this.$i$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if (void 0 !== $opts$$) {
    for (var $key$$16$$ in this.$i$) {
      void 0 !== $opts$$[$key$$16$$] && (this.$i$[$key$$16$$] = $opts$$[$key$$16$$]);
    }
  }
  void 0 !== $opts$$.DEBUG && ($DEBUG$$ = $opts$$.DEBUG);
  void 0 !== $opts$$.ENABLE_COMPILER && ($ENABLE_COMPILER$$ = $opts$$.ENABLE_COMPILER);
  this.$j$ = new $JSSMS$Keyboard$$(this);
  this.$a$ = new this.$i$.ui(this);
  this.$f$ = new $JSSMS$Vdp$$(this);
  this.$g$ = new $JSSMS$SN76489$$(this);
  this.$k$ = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$a$.updateStatus("Ready to load a ROM.");
  this.ui = this.$a$;
}
$JSSMS$$.prototype = {$isRunning$:!1, $cyclesPerLine$:0, $no_of_scanlines$:0, $frameSkip$:0, $fps$:0, $frameskip_counter$:0, $pause_button$:!1, $is_sms$:!0, $is_gg$:!1, $soundEnabled$:!1, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $emuWidth$:0, $emuHeight$:0, $fpsFrameCount$:0, $frameCount$:0, $romData$:"", $romFileName$:"", $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ = this.$f$.$M$, $clockSpeedHz$$inline_24_v$$inline_26$$ = 0;
  0 === $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $clockSpeedHz$$inline_24_v$$inline_26$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $clockSpeedHz$$inline_24_v$$inline_26$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($clockSpeedHz$$inline_24_v$$inline_26$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$f$.$M$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$;
  if (this.$soundEnabled$) {
    this.$g$.$q$($clockSpeedHz$$inline_24_v$$inline_26$$, 44100);
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if (0 === this.$audioBuffer$.length || this.$audioBuffer$.length !== this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$);
    }
    if (0 === this.$samplesPerLine$.length || this.$samplesPerLine$.length !== this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for (var $fractional$$inline_27$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$++) {
        $clockSpeedHz$$inline_24_v$$inline_26$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_27$$, $fractional$$inline_27$$ = $clockSpeedHz$$inline_24_v$$inline_26$$ - ($clockSpeedHz$$inline_24_v$$inline_26$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$] = $clockSpeedHz$$inline_24_v$$inline_26$$ >> 16;
      }
    }
  }
  this.$frameCount$ = 0;
  this.$frameskip_counter$ = this.$frameSkip$;
  this.$j$.reset();
  this.$a$.reset();
  this.$f$.reset();
  this.$k$.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$ = this.$cpu$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$.$u$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$.$main$.$a$.updateStatus("Parsing instructions...");
  $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$);
  $JSCompiler_StaticMethods_resetDebug$self$$inline_29_i$$inline_25_mode$$inline_23$$.$main$.$a$.updateStatus("Instructions parsed");
  $DEBUG$$ && clearInterval(this.$m$);
}, $JSSMS_prototype$start$:function $$JSSMS$$$$$JSSMS_prototype$start$$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = !0, this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen), $DEBUG$$ && (this.$n$ = $JSSMS$Utils$$.$getTimestamp$(), this.$fpsFrameCount$ = 0, this.$m$ = setInterval(function() {
    var $now$$inline_34$$ = $JSSMS$Utils$$.$getTimestamp$();
    $self$$1$$.$a$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_34$$ - $self$$1$$.$n$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$n$ = $now$$inline_34$$;
  }, 500)));
  this.$a$.updateStatus("Running");
}, $JSSMS_prototype$stop$:function $$JSSMS$$$$$JSSMS_prototype$stop$$() {
  $DEBUG$$ && clearInterval(this.$m$);
  this.$isRunning$ = !1;
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  if (this.$isRunning$) {
    var $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$ = this.$cpu$;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$.$lineno$ = 0;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$.$m$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$.$main$.$cyclesPerLine$;
    for ($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$.$F$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$);;) {
      if ($ENABLE_COMPILER$$) {
        var $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$;
        1024 > $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[0][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$] || 
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$O$.$a$($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$, 0, 0), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[0][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$].call($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$, 
        0)) : 16384 > $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[0]][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$] || 
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$O$.$a$($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[0], 
        0), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[0]][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$].call($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$, 
        0)) : 32768 > $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[1]][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ - 
        16384] || $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$O$.$a$($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[1], 
        1), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[1]][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ - 
        16384].call($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$, 1)) : 49152 > $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ ? ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[2]][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ - 
        32768] || $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$O$.$a$($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[2], 
        2), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$frameReg$[2]][$JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ - 
        32768].call($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$, 2)) : $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$);
      } else {
        $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$);
      }
      if ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$.$m$) {
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_36$$;
        if ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$main$.$soundEnabled$) {
          var $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$main$, $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$;
          0 === $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$audioBufferOffset$ = 0);
          for (var $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$samplesPerLine$[$line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = 
          $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$, $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$audioBufferOffset$, $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = 
          [], $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ = 0, $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 0;$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ < $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$;$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$++) {
            for ($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 0;3 > $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$;$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$++) {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$o$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$m$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] !== 
              $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$f$[($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$m$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] >> 
              8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$f$[($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$]
              ;
            }
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$o$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$f$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$k$ & 
            1) << 1;
            $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$o$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$o$[1] + 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$o$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$o$[3];
            127 < $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ ? $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 127 : -128 > $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ && ($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 
            -128);
            $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$[$colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ + $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$] = $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$j$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$p$;
            var $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$j$ >> 8, $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ = $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ << 
            8;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$j$ -= $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[0] -= $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[1] -= $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[2] -= $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[3] = 128 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$n$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[2] : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[3] - $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$;
            for ($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 0;3 > $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$;$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$++) {
              var $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$];
              if (0 >= $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$) {
                var $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$f$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ << 1];
                6 < $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$m$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] = ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ - 
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$j$ + 512 * $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] / 
                ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$j$), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] = 
                -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] = 
                1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$m$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] = $NO_ANTIALIAS$$);
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] += $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ * ($address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ / 
                $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ + 1);
              } else {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$m$[$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$] = $NO_ANTIALIAS$$;
              }
            }
            0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[3], 
            128 !== $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$n$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$n$ * 
            ($address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$n$ + 1)), 1 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$i$[3] && 
            ($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 0, $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$f$[6] & 
            4) ? 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$k$ & 9) && 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$k$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$k$ & 
            1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$k$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$.$k$ >> 1 | $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ << 
            15));
          }
          $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$audioBuffer$ = $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$;
          $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$audioBufferOffset$ += $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$;
        }
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$U$.$s$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$;
        if (192 > $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$U$, 
        $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$, $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = 
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = 0, !$JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$main$.$is_gg$ || !(24 > $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ || 168 <= 
        $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$))) {
          if (0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[1] & 64)) {
            if (-1 !== $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$u$) {
              for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$F$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ <= 
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$u$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$++) {
                if ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$J$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$]) {
                  for ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$J$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$] = 0, $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$I$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$], $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = 0, $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ = 
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ << 5, $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 0;8 > $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$;$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$++) {
                    for (var $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$++], $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$++], $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$++], 
                    $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$++], $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ = 128;0 !== $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$;$bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ >>= 
                    1) {
                      var $colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ = 0;
                      0 !== ($address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ & $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$) && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ |= 1);
                      0 !== ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ & $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$) && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ |= 2);
                      0 !== ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$) && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ |= 4);
                      0 !== ($address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ & $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$) && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ |= 8);
                      $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$[$buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$++] = $colour$$inline_394_pixY$$inline_411_temp$$inline_422$$;
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$F$ = 512;
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$u$ = -1;
            }
            var $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = 0, $colour$$inline_396_offset$$inline_436$$ = 0, $temp$$inline_397$$ = 0, $temp2$$inline_398$$ = 0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[8], 
            $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[9];
            16 > $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[0] & 64) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = 
            0);
            $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[0] & 128;
            $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = 32 - ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$;
            $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ = $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ + $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ >> 3;
            27 < $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ && ($address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ -= 28);
            $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = ($line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ + ($feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ & 7) & 7) << 3;
            $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ = $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ << 8;
            for ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$;$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$p$;$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$++) {
              var $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$Q$ + (($buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ & 31) << 1) + ($address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ << 6), $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ = 
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 1], $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ = ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & 8) << 1, $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ = 
              ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ << 3) + ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ & 7), $colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ = 0 === ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & 4) ? $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ : 
              56 - $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$, $tile$$inline_412$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$I$[($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$] & 
              255) + (($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & 1) << 8)];
              if ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & 2) {
                for ($pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = 7;0 <= $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ && 256 > $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$;$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$--, $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$++) {
                  $colour$$inline_396_offset$$inline_436$$ = $tile$$inline_412$$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + $colour$$inline_394_pixY$$inline_411_temp$$inline_422$$], $temp$$inline_397$$ = 4 * ($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ + $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$), $temp2$$inline_398$$ = 3 * ($colour$$inline_396_offset$$inline_436$$ + $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$), 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$v$[$bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$] = 0 !== ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & 16) && 0 !== $colour$$inline_396_offset$$inline_436$$, $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ >= 8 * 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$ && $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$p$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$temp$$inline_397$$] = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$temp2$$inline_398$$], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$temp$$inline_397$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$temp2$$inline_398$$ + 
                  1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$temp$$inline_397$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$temp2$$inline_398$$ + 2]);
                }
              } else {
                for ($pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = 0;8 > $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ && 256 > $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$;$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$++, $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$++) {
                  $colour$$inline_396_offset$$inline_436$$ = $tile$$inline_412$$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + $colour$$inline_394_pixY$$inline_411_temp$$inline_422$$], $temp$$inline_397$$ = 4 * ($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ + $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$), $temp2$$inline_398$$ = 3 * ($colour$$inline_396_offset$$inline_436$$ + $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$), 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$v$[$bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$] = 0 !== ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ & 16) && 0 !== $colour$$inline_396_offset$$inline_436$$, $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ >= 8 * 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$ && $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$p$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$temp$$inline_397$$] = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$temp2$$inline_398$$], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$temp$$inline_397$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$temp2$$inline_398$$ + 
                  1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$temp$$inline_397$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$temp2$$inline_398$$ + 2]);
                }
              }
              $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$++;
              0 !== $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ && 23 === $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ && ($address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ = $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ >> 3, $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = 
              ($line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ & 7) << 3);
            }
            if ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$r$) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$r$ = !1;
              for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = 0;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$t$.length;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$t$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$][0] = 0;
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = 0 === ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[1] & 2) ? 8 : 16;
              1 === ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[1] & 1) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ <<= 1);
              for ($colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = 0;64 > $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$;$colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$++) {
                $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$n$ + $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$] & 
                255;
                if (208 === $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$) {
                  break;
                }
                $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$++;
                240 < $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ && ($buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ -= 256);
                for ($address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ = $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$;192 > $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$;$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$++) {
                  if ($address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ - $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$) {
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$t$[$address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$];
                    if (!$feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ || 8 <= $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$[0]) {
                      break;
                    }
                    $address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ = 3 * $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$[0] + 1;
                    $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$n$ + ($colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ << 1) + 128;
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$[$address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$++] & 
                    255;
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$[$address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$++] = $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$;
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$[$address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$i$[$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$] & 
                    255;
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$[0]++;
                  }
                }
              }
            }
            if (0 !== $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$t$[$line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$][0]) {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = $colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ = $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ = 0;
              $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$t$[$line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$];
              $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = Math.min(8, $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$[0]);
              $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[1] & 1;
              $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ = $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ << 8;
              for ($address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$ = 3 * $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ < $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$++) {
                if ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ = $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$[$address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[6] & 
                4) << 6, $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ = $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$[$address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$--], $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ = $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$[$address0$$inline_389_clockCycles$$inline_373_off$$inline_419_off$$inline_429_row_precal$$inline_405$$--] - 
                ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[0] & 8), $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ = $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ - $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ >> $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$, 
                0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[1] & 2) && ($address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ &= -2), $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$I$[$address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$ + 
                (($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ & 8) >> 3)], $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ = 0, 0 > $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ && ($address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ = -$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$, 
                $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ = 0), $colour$$inline_396_offset$$inline_436$$ = $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ + (($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ & 7) << 3), $address$$inline_387_lineno$$inline_417_sample$$inline_370_tile_row$$inline_403_zoomed$$inline_427$$) {
                  for (;8 > $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ && $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$p$;$address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$++, $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ += 
                  2) {
                    $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ = $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$[$colour$$inline_396_offset$$inline_436$$++], $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$ && 
                    0 !== $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$v$[$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$] && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ = 4 * ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ + 
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$), $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = 3 * ($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$] = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 
                    1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 2]), $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ + 
                    1 >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$ && 0 !== $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$v$[$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ + 
                    1] && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ = 4 * ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ + $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$ + 1), $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = 3 * ($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ + 16), 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 
                    2]);
                  }
                } else {
                  for (;8 > $address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$ && $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$p$;$address3$$inline_392_pal$$inline_409_pix$$inline_435_tone$$inline_376_y$$inline_431$$++, $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$++) {
                    $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ = $address2$$inline_391_counter$$inline_375_n$$inline_430_secondbyte$$inline_408_tile$$inline_434$$[$colour$$inline_396_offset$$inline_436$$++], $address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$ && 
                    0 !== $bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$v$[$address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$] && ($colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ = 4 * ($address$$inline_420_address1$$inline_390_clockCyclesScaled$$inline_374_tx$$inline_406_x$$inline_432$$ + 
                    $feedback$$inline_377_i$$inline_371_output$$inline_372_row_precal$$inline_428_sprites$$inline_418_tile_y$$inline_404_vscroll$$inline_400_y$$inline_388$$), $pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ = 3 * ($bit$$inline_393_colour$$inline_421_sx$$inline_410_tileRow$$inline_433$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$] = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 
                    1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$colour$$inline_394_pixY$$inline_411_temp$$inline_422$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$pixX$$inline_395_temp2$$inline_423_tile_props$$inline_407$$ + 2]);
                  }
                }
              }
              8 <= $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$k$ |= 64);
            }
            if ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$main$.$is_sms$ && $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[0] & 32) {
              for ($colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = 4 * ($line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ << 8), $buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[7] & 
              15) + 16), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ < 
              $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ + 32;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ += 4) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$], 
                $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ + 
                1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$buffer$$inline_369_colour$$inline_383_count$$inline_426_pixel_index$$inline_386_tile_column$$inline_402_y$$inline_416$$ + 
                2];
              }
            }
          } else {
            for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = 0, $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ = 4 * ($line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ << 8), $colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ = 
            3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[7] & 15) + 16), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ = $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ + 32 * 
            $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$m$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ < $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ + 32 * $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$p$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ += 
            4) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$], 
              $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ + 
              1], $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_367_height$$inline_414_hscroll$$inline_399_i$$inline_384_i$$inline_413_i$$inline_424_x$$inline_381_x$$inline_437$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$a$[$colour$$inline_439_location$$inline_382_lock$$inline_401_offset$$inline_368_spriteno$$inline_415_sprites$$inline_425_tile$$inline_385$$ + 
              2];
            }
          }
        }
        $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$U$;
        $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$;
        192 >= $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ ? (0 === $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$w$ ? ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$w$ = $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[10], 
        $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$k$ |= 4) : $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$w$--, 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$k$ & 
        4) && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[0] & 16) && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$main$.$cpu$.$F$ = !0)) : ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$w$ = 
        $JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[10], 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$k$ & 128) && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$g$[1] & 
        32) && 224 > $line$$inline_365_lineno$$inline_380_lineno$$inline_442_location$$inline_438_samplesToGenerate$$inline_366$$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_379_JSCompiler_StaticMethods_interrupts$self$$inline_441_JSCompiler_StaticMethods_updateSound$self$$inline_364$$.$main$.$cpu$.$F$ = !0));
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$F$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$);
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$++;
        $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$lineno$ >= $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$main$.$no_of_scanlines$ ? ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$main$.$pause_button$ && 
        ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$I$ = $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$G$, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$G$ = 
        !1, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$N$ && ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$++, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$N$ = 
        !1), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.push($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$f$ = 
        102, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$m$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$main$.$pause_button$ = !1), $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$ = 
        !0) : ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$m$ += $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$.$main$.$cyclesPerLine$, $JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$ = 
        !1);
      }
      if ($JSCompiler_StaticMethods_eof$self$$inline_444_JSCompiler_StaticMethods_eol$self$$inline_326_JSCompiler_StaticMethods_recompile$self$$inline_324_JSCompiler_temp$$319$$) {
        break;
      }
    }
    this.$fpsFrameCount$++;
    this.$a$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$a$.screen);
  }
}, $readRomDirectly$:function $$JSSMS$$$$$readRomDirectly$$($data$$32$$, $fileName$$) {
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$ = "gg" === $JSSMS$Utils$$.$getFileExtension$($fileName$$) ? 2 : 1, $pages$$inline_47_size$$11_size$$inline_43$$ = $data$$32$$.length;
  1 === $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$ ? (this.$is_sms$ = !0, this.$is_gg$ = !1, this.$f$.$m$ = 0, this.$f$.$p$ = 32, this.$emuWidth$ = 256, this.$emuHeight$ = 192) : 2 === $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$ && (this.$is_gg$ = !0, this.$is_sms$ = !1, this.$f$.$m$ = 6, this.$f$.$p$ = 26, this.$emuWidth$ = 160, this.$emuHeight$ = 144);
  if (16384 >= $pages$$inline_47_size$$11_size$$inline_43$$) {
    return!1;
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$ = $data$$32$$;
  0 !== $pages$$inline_47_size$$11_size$$inline_43$$ % 1024 && ($JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.substr(512), $pages$$inline_47_size$$11_size$$inline_43$$ -= 512);
  var $i$$inline_44_i$$inline_51$$, $j$$inline_45$$, $number_of_pages$$inline_46$$ = Math.round($pages$$inline_47_size$$11_size$$inline_43$$ / 16384), $pages$$inline_47_size$$11_size$$inline_43$$ = Array($number_of_pages$$inline_46$$);
  for ($i$$inline_44_i$$inline_51$$ = 0;$i$$inline_44_i$$inline_51$$ < $number_of_pages$$inline_46$$;$i$$inline_44_i$$inline_51$$++) {
    if ($pages$$inline_47_size$$11_size$$inline_43$$[$i$$inline_44_i$$inline_51$$] = $JSSMS$Utils$$.$Array$(16384), $SUPPORT_DATAVIEW$$) {
      for ($j$$inline_45$$ = 0;16384 > $j$$inline_45$$;$j$$inline_45$$++) {
        $pages$$inline_47_size$$11_size$$inline_43$$[$i$$inline_44_i$$inline_51$$].setUint8($j$$inline_45$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.charCodeAt(16384 * $i$$inline_44_i$$inline_51$$ + $j$$inline_45$$));
      }
    } else {
      for ($j$$inline_45$$ = 0;16384 > $j$$inline_45$$;$j$$inline_45$$++) {
        $pages$$inline_47_size$$11_size$$inline_43$$[$i$$inline_44_i$$inline_51$$][$j$$inline_45$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.charCodeAt(16384 * $i$$inline_44_i$$inline_51$$ + $j$$inline_45$$) & 255;
      }
    }
  }
  if (null === $pages$$inline_47_size$$11_size$$inline_43$$) {
    return!1;
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$ = this.$cpu$;
  $i$$inline_44_i$$inline_51$$ = 0;
  $pages$$inline_47_size$$11_size$$inline_43$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$rom$ = $pages$$inline_47_size$$11_size$$inline_43$$);
  if ($JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$J$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$J$ - 1;
    for ($i$$inline_44_i$$inline_51$$ = 0;3 > $i$$inline_44_i$$inline_51$$;$i$$inline_44_i$$inline_51$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$frameReg$[$i$$inline_44_i$$inline_51$$] = $i$$inline_44_i$$inline_51$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$J$;
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$frameReg$[3] = 0;
    if ($ENABLE_COMPILER$$) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$branches$ = Array($JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$J$);
      for ($i$$inline_44_i$$inline_51$$ = 0;$i$$inline_44_i$$inline_51$$ < $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$J$;$i$$inline_44_i$$inline_51$$++) {
        $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$branches$[$i$$inline_44_i$$inline_51$$] = Object.create(null);
      }
      $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$O$.$g$($JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$rom$);
    }
  } else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$J$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_49_data$$inline_42_mode$$11$$.$romPageMask$ = 0;
  }
  this.$romData$ = $data$$32$$;
  this.$romFileName$ = $fileName$$;
  return!0;
}};
"console" in window ? "bind" in window.console.log || (window.console.log = function($fn$$inline_66$$) {
  return function($msg$$inline_67$$) {
    return $fn$$inline_66$$($msg$$inline_67$$);
  };
}(window.console.log), window.console.error = function($fn$$inline_68$$) {
  return function($msg$$inline_69$$) {
    return $fn$$inline_68$$($msg$$inline_69$$);
  };
}(window.console.error)) : window.console = {log:function $window$console$log$() {
}, error:function $window$console$error$() {
}};
var $JSSMS$Utils$$ = {$rndInt$:function($range$$5$$) {
  return Math.round(Math.random() * $range$$5$$);
}, $Uint8Array$:$SUPPORT_TYPED_ARRAYS$$ ? Uint8Array : Array, $Array$:$SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  return new DataView(new ArrayBuffer($length$$12$$));
} : Array, $a$:$SUPPORT_DATAVIEW$$ ? function($src$$1$$, $srcPos$$, $dest$$, $destPos$$, $length$$13$$) {
  for (;$length$$13$$--;) {
    $dest$$.setInt8($destPos$$ + $length$$13$$, $src$$1$$.getInt8($srcPos$$ + $length$$13$$));
  }
} : function($src$$2$$, $srcPos$$1$$, $dest$$1$$, $destPos$$1$$, $length$$14$$) {
  for (;$length$$14$$--;) {
    $dest$$1$$[$destPos$$1$$ + $length$$14$$] = $src$$2$$[$srcPos$$1$$ + $length$$14$$];
  }
}, console:{log:$DEBUG$$ ? window.console.log.bind(window.console) : function() {
}, error:$DEBUG$$ ? window.console.error.bind(window.console) : function() {
}, time:$DEBUG$$ && window.console.time ? window.console.time.bind(window.console) : function() {
}, timeEnd:$DEBUG$$ && window.console.timeEnd ? window.console.timeEnd.bind(window.console) : function() {
}}, $traverse$:function($object$$, $fn$$2$$) {
  var $key$$17$$, $child$$1$$;
  $fn$$2$$.call(null, $object$$);
  for ($key$$17$$ in $object$$) {
    $object$$.hasOwnProperty($key$$17$$) && ($child$$1$$ = $object$$[$key$$17$$], Object($child$$1$$) === $child$$1$$ && ($object$$[$key$$17$$] = $JSSMS$Utils$$.$traverse$($child$$1$$, $fn$$2$$)));
  }
  return $object$$;
}, $getTimestamp$:window.performance && window.performance.now ? window.performance.now.bind(window.performance) : function() {
  return(new Date).getTime();
}, $toHex$:function($dec_hex$$) {
  $dec_hex$$ = $dec_hex$$.toString(16).toUpperCase();
  $dec_hex$$.length % 2 && ($dec_hex$$ = "0" + $dec_hex$$);
  return "0x" + $dec_hex$$;
}, $f$:function($arr$$16$$, $obj$$35$$) {
  var $prefix$$2$$ = !1;
  void 0 === $obj$$35$$ && ($obj$$35$$ = document);
  $arr$$16$$.some(function($prop$$4$$) {
    return $prop$$4$$ in $obj$$35$$ ? ($prefix$$2$$ = $prop$$4$$, !0) : !1;
  });
  return $prefix$$2$$;
}, $getFileExtension$:function($fileName$$1_parts$$) {
  if ("string" !== typeof $fileName$$1_parts$$) {
    return "";
  }
  $fileName$$1_parts$$ = $fileName$$1_parts$$.split(".");
  return $fileName$$1_parts$$[$fileName$$1_parts$$.length - 1].toLowerCase();
}, $crc32$:function($str$$9$$) {
  var $crcTable$$ = function makeCRCTable() {
    for (var $c$$ = 0, $crcTable$$1$$ = new Uint32Array(256), $n$$3$$ = 0;256 > $n$$3$$;$n$$3$$++) {
      for (var $c$$ = $n$$3$$, $k$$ = 0;8 > $k$$;$k$$++) {
        $c$$ = $c$$ & 1 ? 3988292384 ^ $c$$ >>> 1 : $c$$ >>> 1;
      }
      $crcTable$$1$$[$n$$3$$] = $c$$;
    }
    return $crcTable$$1$$;
  }();
  this.$crc32$ = function $this$$crc32$$($str$$10$$) {
    for (var $crc$$ = -1, $i$$6$$ = 0;$i$$6$$ < $str$$10$$.length;$i$$6$$++) {
      $crc$$ = $crc$$ >>> 8 ^ $crcTable$$[($crc$$ ^ $str$$10$$.charCodeAt($i$$6$$)) & 255];
    }
    return(($crc$$ ^ -1) >>> 0).toString(16).toUpperCase();
  };
  return this.$crc32$($str$$9$$);
}, $g$:function() {
  return/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}};
var $OP_STATES$$ = [4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 
4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11], $OP_CB_STATES$$ = [8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 
8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 
15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8], $OP_DD_STATES$$ = [4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 
19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4], $OP_INDEX_CB_STATES$$ = 
[23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 
20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
23, 23, 23, 23, 23], $OP_ED_STATES$$ = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
function $JSSMS$Z80$$($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$) {
  this.$main$ = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;
  this.$U$ = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$.$f$;
  this.$s$ = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$.$k$;
  this.$Q$ = this.$k$ = this.$f$ = 0;
  this.$F$ = this.$P$ = this.$N$ = this.$I$ = this.$G$ = !1;
  this.$m$ = this.$ba$ = this.$g$ = this.$T$ = this.$r$ = this.$p$ = this.$q$ = this.$o$ = this.$da$ = this.$ca$ = this.$l$ = this.$h$ = this.$aa$ = this.$Z$ = this.$e$ = this.$d$ = this.$Y$ = this.$X$ = this.$c$ = this.$b$ = this.$W$ = this.$a$ = this.$R$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$$.$Array$(32768);
  this.$frameReg$ = Array(4);
  this.$J$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$$.$Array$(8192);
  this.$ea$ = Array(2048);
  this.$V$ = Array(256);
  this.$SZP_TABLE$ = Array(256);
  this.$M$ = Array(256);
  this.$K$ = Array(256);
  this.$v$ = Array(131072);
  this.$t$ = Array(131072);
  this.$S$ = Array(256);
  var $c$$inline_88_padc$$inline_79_sf$$inline_73$$, $h$$inline_89_psub$$inline_80_zf$$inline_74$$, $n$$inline_90_psbc$$inline_81_yf$$inline_75$$, $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$, $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$, $flags$$inline_330_newval$$inline_84$$;
  for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;256 > $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++) {
    $c$$inline_88_padc$$inline_79_sf$$inline_73$$ = 0 !== ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ & 128) ? 128 : 0, $h$$inline_89_psub$$inline_80_zf$$inline_74$$ = 0 === $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ ? 64 : 0, $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ & 32, $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ & 
    8, $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$) ? 4 : 0, this.$V$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = $c$$inline_88_padc$$inline_79_sf$$inline_73$$ | $h$$inline_89_psub$$inline_80_zf$$inline_74$$ | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ | $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$, this.$SZP_TABLE$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = 
    $c$$inline_88_padc$$inline_79_sf$$inline_73$$ | $h$$inline_89_psub$$inline_80_zf$$inline_74$$ | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ | $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ | $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$, this.$M$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = $c$$inline_88_padc$$inline_79_sf$$inline_73$$ | $h$$inline_89_psub$$inline_80_zf$$inline_74$$ | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ | $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$, 
    this.$M$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 128 === $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ ? 4 : 0, this.$M$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 0 === ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ & 15) ? 16 : 0, this.$K$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = $c$$inline_88_padc$$inline_79_sf$$inline_73$$ | $h$$inline_89_psub$$inline_80_zf$$inline_74$$ | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ | 
    $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ | 2, this.$K$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 127 === $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ ? 4 : 0, this.$K$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 15 === ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ & 15) ? 16 : 0, this.$S$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = 0 !== $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ ? 
    $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ & 128 : 68, this.$S$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = this.$S$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ | $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ | 16;
  }
  $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;
  $c$$inline_88_padc$$inline_79_sf$$inline_73$$ = 65536;
  $h$$inline_89_psub$$inline_80_zf$$inline_74$$ = 0;
  $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ = 65536;
  for ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ = 0;256 > $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$;$JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$++) {
    for ($flags$$inline_330_newval$$inline_84$$ = 0;256 > $flags$$inline_330_newval$$inline_84$$;$flags$$inline_330_newval$$inline_84$$++) {
      $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ = $flags$$inline_330_newval$$inline_84$$ - $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$, this.$v$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = 0 !== $flags$$inline_330_newval$$inline_84$$ ? 0 !== ($flags$$inline_330_newval$$inline_84$$ & 128) ? 128 : 0 : 64, this.$v$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= $flags$$inline_330_newval$$inline_84$$ & 40, ($flags$$inline_330_newval$$inline_84$$ & 
      15) < ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ & 15) && (this.$v$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 16), $flags$$inline_330_newval$$inline_84$$ < $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ && (this.$v$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 1), 0 !== (($JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ ^ $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ ^ 128) & ($JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ ^ 
      $flags$$inline_330_newval$$inline_84$$) & 128) && (this.$v$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] |= 4), $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++, $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ = $flags$$inline_330_newval$$inline_84$$ - $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ - 1, this.$v$[$c$$inline_88_padc$$inline_79_sf$$inline_73$$] = 0 !== $flags$$inline_330_newval$$inline_84$$ ? 0 !== ($flags$$inline_330_newval$$inline_84$$ & 
      128) ? 128 : 0 : 64, this.$v$[$c$$inline_88_padc$$inline_79_sf$$inline_73$$] |= $flags$$inline_330_newval$$inline_84$$ & 40, ($flags$$inline_330_newval$$inline_84$$ & 15) <= ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ & 15) && (this.$v$[$c$$inline_88_padc$$inline_79_sf$$inline_73$$] |= 16), $flags$$inline_330_newval$$inline_84$$ <= $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ && (this.$v$[$c$$inline_88_padc$$inline_79_sf$$inline_73$$] |= 1), 0 !== (($JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ ^ 
      $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ ^ 128) & ($JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ ^ $flags$$inline_330_newval$$inline_84$$) & 128) && (this.$v$[$c$$inline_88_padc$$inline_79_sf$$inline_73$$] |= 4), $c$$inline_88_padc$$inline_79_sf$$inline_73$$++, $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ = $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ - $flags$$inline_330_newval$$inline_84$$, this.$t$[$h$$inline_89_psub$$inline_80_zf$$inline_74$$] = 
      0 !== $flags$$inline_330_newval$$inline_84$$ ? 0 !== ($flags$$inline_330_newval$$inline_84$$ & 128) ? 130 : 2 : 66, this.$t$[$h$$inline_89_psub$$inline_80_zf$$inline_74$$] |= $flags$$inline_330_newval$$inline_84$$ & 40, ($flags$$inline_330_newval$$inline_84$$ & 15) > ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ & 15) && (this.$t$[$h$$inline_89_psub$$inline_80_zf$$inline_74$$] |= 16), $flags$$inline_330_newval$$inline_84$$ > $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ && 
      (this.$t$[$h$$inline_89_psub$$inline_80_zf$$inline_74$$] |= 1), 0 !== (($JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ ^ $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$) & ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ ^ $flags$$inline_330_newval$$inline_84$$) & 128) && (this.$t$[$h$$inline_89_psub$$inline_80_zf$$inline_74$$] |= 4), $h$$inline_89_psub$$inline_80_zf$$inline_74$$++, $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ = $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ - 
      $flags$$inline_330_newval$$inline_84$$ - 1, this.$t$[$n$$inline_90_psbc$$inline_81_yf$$inline_75$$] = 0 !== $flags$$inline_330_newval$$inline_84$$ ? 0 !== ($flags$$inline_330_newval$$inline_84$$ & 128) ? 130 : 2 : 66, this.$t$[$n$$inline_90_psbc$$inline_81_yf$$inline_75$$] |= $flags$$inline_330_newval$$inline_84$$ & 40, ($flags$$inline_330_newval$$inline_84$$ & 15) >= ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ & 15) && (this.$t$[$n$$inline_90_psbc$$inline_81_yf$$inline_75$$] |= 
      16), $flags$$inline_330_newval$$inline_84$$ >= $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ && (this.$t$[$n$$inline_90_psbc$$inline_81_yf$$inline_75$$] |= 1), 0 !== (($JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ ^ $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$) & ($JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ ^ $flags$$inline_330_newval$$inline_84$$) & 128) && (this.$t$[$n$$inline_90_psbc$$inline_81_yf$$inline_75$$] |= 4), $n$$inline_90_psbc$$inline_81_yf$$inline_75$$++
      ;
    }
  }
  for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 256;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$--;) {
    for ($c$$inline_88_padc$$inline_79_sf$$inline_73$$ = 0;1 >= $c$$inline_88_padc$$inline_79_sf$$inline_73$$;$c$$inline_88_padc$$inline_79_sf$$inline_73$$++) {
      for ($h$$inline_89_psub$$inline_80_zf$$inline_74$$ = 0;1 >= $h$$inline_89_psub$$inline_80_zf$$inline_74$$;$h$$inline_89_psub$$inline_80_zf$$inline_74$$++) {
        for ($n$$inline_90_psbc$$inline_81_yf$$inline_75$$ = 0;1 >= $n$$inline_90_psbc$$inline_81_yf$$inline_75$$;$n$$inline_90_psbc$$inline_81_yf$$inline_75$$++) {
          $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$ = this.$ea$;
          $JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$ = $c$$inline_88_padc$$inline_79_sf$$inline_73$$ << 8 | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ << 9 | $h$$inline_89_psub$$inline_80_zf$$inline_74$$ << 10 | $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;
          $flags$$inline_330_newval$$inline_84$$ = $c$$inline_88_padc$$inline_79_sf$$inline_73$$ | $n$$inline_90_psbc$$inline_81_yf$$inline_75$$ << 1 | $h$$inline_89_psub$$inline_80_zf$$inline_74$$ << 4;
          this.$a$ = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;
          this.$g$ = $flags$$inline_330_newval$$inline_84$$;
          var $a_copy$$inline_331$$ = this.$a$, $correction$$inline_332$$ = 0, $carry$$inline_333$$ = $flags$$inline_330_newval$$inline_84$$ & 1, $carry_copy$$inline_334$$ = $carry$$inline_333$$;
          if (0 !== ($flags$$inline_330_newval$$inline_84$$ & 16) || 9 < ($a_copy$$inline_331$$ & 15)) {
            $correction$$inline_332$$ |= 6;
          }
          if (1 === $carry$$inline_333$$ || 159 < $a_copy$$inline_331$$ || 143 < $a_copy$$inline_331$$ && 9 < ($a_copy$$inline_331$$ & 15)) {
            $correction$$inline_332$$ |= 96, $carry_copy$$inline_334$$ = 1;
          }
          153 < $a_copy$$inline_331$$ && ($carry_copy$$inline_334$$ = 1);
          0 !== ($flags$$inline_330_newval$$inline_84$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_332$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_332$$);
          $flags$$inline_330_newval$$inline_84$$ = this.$g$ & 254 | $carry_copy$$inline_334$$;
          $flags$$inline_330_newval$$inline_84$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_330_newval$$inline_84$$ & 251 | 4 : $flags$$inline_330_newval$$inline_84$$ & 251;
          $JSCompiler_temp_const$$321_val$$inline_82_xf$$inline_76$$[$JSCompiler_temp_const$$320_oldval$$inline_83_pf$$inline_77$$] = this.$a$ | $flags$$inline_330_newval$$inline_84$$ << 8;
        }
      }
    }
  }
  this.$a$ = this.$g$ = 0;
  if ($SUPPORT_DATAVIEW$$) {
    for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;8192 > $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$, 0);
    }
  } else {
    for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;8192 > $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++) {
      this.$memWriteMap$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = 0;
    }
  }
  if ($SUPPORT_DATAVIEW$$) {
    for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;32768 > $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++) {
      this.$sram$.setUint8($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$, 0);
    }
  } else {
    for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;32768 > $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++) {
      this.$sram$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = 0;
    }
  }
  this.$J$ = 2;
  for ($i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ = 0;4 > $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$;$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$++) {
    this.$frameReg$[$i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$] = $i$$inline_72_i$$inline_87_i$$inline_93_padd$$inline_78_sms$$ % 3;
  }
  for (var $method$$3$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$3$$] = $JSSMS$Debugger$$.prototype[$method$$3$$];
  }
  $ENABLE_COMPILER$$ && (this.$O$ = new $Recompiler$$(this));
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$f$ = this.$ba$ = this.$g$ = this.$T$ = this.$p$ = this.$r$ = this.$o$ = this.$q$ = this.$h$ = this.$l$ = this.$ca$ = this.$da$ = this.$d$ = this.$e$ = this.$Z$ = this.$aa$ = this.$b$ = this.$c$ = this.$X$ = this.$Y$ = this.$a$ = this.$W$ = 0;
  this.$k$ = 57328;
  this.$Q$ = this.$m$ = 0;
  this.$P$ = this.$I$ = this.$G$ = !1;
  this.$R$ = 0;
  this.$N$ = !1;
  $ENABLE_COMPILER$$ && this.$O$.reset();
}, $branches$:[Object.create(null), Object.create(null), Object.create(null)], call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? (this.push(this.$f$ + 2), this.$f$ = this.$n$(this.$f$), this.$m$ -= 7) : this.$f$ += 2;
}, push:function $$JSSMS$Z80$$$$push$($value$$47$$) {
  this.$k$ -= 2;
  this.$w$(this.$k$, $value$$47$$);
}, $j$:$SUPPORT_DATAVIEW$$ ? function writeMem($address$$, $value$$74$$) {
  65535 >= $address$$ ? (this.$memWriteMap$.setUint8($address$$ & 8191, $value$$74$$), 65532 === $address$$ ? this.$frameReg$[3] = $value$$74$$ : 65533 === $address$$ ? this.$frameReg$[0] = $value$$74$$ & this.$romPageMask$ : 65534 === $address$$ ? this.$frameReg$[1] = $value$$74$$ & this.$romPageMask$ : 65535 === $address$$ && (this.$frameReg$[2] = $value$$74$$ & this.$romPageMask$)) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$));
} : function writeMem$$1($address$$1$$, $value$$75$$) {
  65535 >= $address$$1$$ ? (this.$memWriteMap$[$address$$1$$ & 8191] = $value$$75$$, 65532 === $address$$1$$ ? this.$frameReg$[3] = $value$$75$$ : 65533 === $address$$1$$ ? this.$frameReg$[0] = $value$$75$$ & this.$romPageMask$ : 65534 === $address$$1$$ ? this.$frameReg$[1] = $value$$75$$ & this.$romPageMask$ : 65535 === $address$$1$$ && (this.$frameReg$[2] = $value$$75$$ & this.$romPageMask$)) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$1$$));
}, $w$:$SUPPORT_DATAVIEW$$ ? function writeMemWord($address$$2$$, $value$$76$$) {
  65532 > $address$$2$$ ? this.$memWriteMap$.setUint16($address$$2$$ & 8191, $value$$76$$, !0) : 65532 === $address$$2$$ ? (this.$frameReg$[3] = $value$$76$$ & 255, this.$frameReg$[0] = $value$$76$$ >> 8 & this.$romPageMask$) : 65533 === $address$$2$$ ? (this.$frameReg$[0] = $value$$76$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$76$$ >> 8 & this.$romPageMask$) : 65534 === $address$$2$$ ? (this.$frameReg$[1] = $value$$76$$ & 255 & this.$romPageMask$, this.$frameReg$[2] = $value$$76$$ >> 
  8 & this.$romPageMask$) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$2$$));
} : function writeMemWord$$1($address$$3$$, $value$$77$$) {
  65532 > $address$$3$$ ? ($address$$3$$ &= 8191, this.$memWriteMap$[$address$$3$$++] = $value$$77$$ & 255, this.$memWriteMap$[$address$$3$$] = $value$$77$$ >> 8) : 65532 === $address$$3$$ ? (this.$frameReg$[3] = $value$$77$$ & 255, this.$frameReg$[0] = $value$$77$$ >> 8 & this.$romPageMask$) : 65533 === $address$$3$$ ? (this.$frameReg$[0] = $value$$77$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$77$$ >> 8 & this.$romPageMask$) : 65534 === $address$$3$$ ? (this.$frameReg$[1] = $value$$77$$ & 
  255 & this.$romPageMask$, this.$frameReg$[2] = $value$$77$$ >> 8 & this.$romPageMask$) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$3$$));
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
    return 8 === (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$4$$ - 32768) : 12 === (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$4$$ - 16384) : this.$rom$[this.$frameReg$[2]].getUint8($address$$4$$ - 32768);
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
  $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$4$$));
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
    return 8 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 32768] : 12 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 16384] : this.$rom$[this.$frameReg$[2]][$address$$5$$ - 32768];
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
  $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$5$$));
  return 0;
}, $n$:$SUPPORT_DATAVIEW$$ ? function readMemWord($address$$6$$) {
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
    return 8 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$6$$ - 32768] : 12 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$6$$ - 16384] : this.$rom$[this.$frameReg$[2]].getUint16($address$$6$$ - 32768, !0);
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
  $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$6$$));
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
    return 8 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$7$$++ - 32768] | this.$sram$[$address$$7$$ - 32768] << 8 : 12 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$7$$++ - 16384] | this.$sram$[$address$$7$$ - 16384] << 8 : this.$rom$[this.$frameReg$[2]][$address$$7$$++ - 32768] | this.$rom$[this.$frameReg$[2]][$address$$7$$ - 32768] << 8;
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
  $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$7$$));
  return 0;
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$i$($JSCompiler_StaticMethods_d_$self$$.$f$);
}
function $JSCompiler_StaticMethods_getParity$$($value$$73$$) {
  var $parity$$ = !0, $j$$2$$;
  for ($j$$2$$ = 0;8 > $j$$2$$;$j$$2$$++) {
    0 !== ($value$$73$$ & 1 << $j$$2$$) && ($parity$$ = !$parity$$);
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
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$1$$, $value$$70$$) {
  var $result$$1$$ = $reg$$1$$ + $value$$70$$;
  $JSCompiler_StaticMethods_add16$self$$.$g$ = $JSCompiler_StaticMethods_add16$self$$.$g$ & 196 | ($reg$$1$$ ^ $result$$1$$ ^ $value$$70$$) >> 8 & 16 | $result$$1$$ >> 16 & 1;
  return $result$$1$$ & 65535;
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$69$$) {
  $value$$69$$ = $value$$69$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$g$ = $JSCompiler_StaticMethods_dec8$self$$.$g$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$K$[$value$$69$$];
  return $value$$69$$;
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$68$$) {
  $value$$68$$ = $value$$68$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$g$ = $JSCompiler_StaticMethods_inc8$self$$.$g$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$M$[$value$$68$$];
  return $value$$68$$;
}
function $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_decHL$self$$) {
  $JSCompiler_StaticMethods_decHL$self$$.$l$ = $JSCompiler_StaticMethods_decHL$self$$.$l$ - 1 & 255;
  255 === $JSCompiler_StaticMethods_decHL$self$$.$l$ && ($JSCompiler_StaticMethods_decHL$self$$.$h$ = $JSCompiler_StaticMethods_decHL$self$$.$h$ - 1 & 255);
}
function $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_decDE$self$$) {
  $JSCompiler_StaticMethods_decDE$self$$.$e$ = $JSCompiler_StaticMethods_decDE$self$$.$e$ - 1 & 255;
  255 === $JSCompiler_StaticMethods_decDE$self$$.$e$ && ($JSCompiler_StaticMethods_decDE$self$$.$d$ = $JSCompiler_StaticMethods_decDE$self$$.$d$ - 1 & 255);
}
function $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_decBC$self$$) {
  $JSCompiler_StaticMethods_decBC$self$$.$c$ = $JSCompiler_StaticMethods_decBC$self$$.$c$ - 1 & 255;
  255 === $JSCompiler_StaticMethods_decBC$self$$.$c$ && ($JSCompiler_StaticMethods_decBC$self$$.$b$ = $JSCompiler_StaticMethods_decBC$self$$.$b$ - 1 & 255);
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
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$r$ = $value$$67$$ >> 8;
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$p$ = $value$$67$$ & 255;
}
function $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_setIXHIXL$self$$, $value$$66$$) {
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$q$ = $value$$66$$ >> 8;
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$o$ = $value$$66$$ & 255;
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$64$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$h$ = $value$$64$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$64$$ & 255;
}
function $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_getIYHIYL$self$$) {
  return $JSCompiler_StaticMethods_getIYHIYL$self$$.$r$ << 8 | $JSCompiler_StaticMethods_getIYHIYL$self$$.$p$;
}
function $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_getIXHIXL$self$$) {
  return $JSCompiler_StaticMethods_getIXHIXL$self$$.$q$ << 8 | $JSCompiler_StaticMethods_getIXHIXL$self$$.$o$;
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
  $JSCompiler_StaticMethods_cp_a$self$$.$g$ = $JSCompiler_StaticMethods_cp_a$self$$.$t$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$61$$ & 255];
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$60$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$g$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$60$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$g$ = $JSCompiler_StaticMethods_sbc_a$self$$.$t$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$;
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$59$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$59$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$g$ = $JSCompiler_StaticMethods_sub_a$self$$.$t$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$;
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$58$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$g$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$58$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$g$ = $JSCompiler_StaticMethods_adc_a$self$$.$v$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$;
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$57$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$57$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$g$ = $JSCompiler_StaticMethods_add_a$self$$.$v$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$;
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$46$$) {
  var $location$$21$$ = $index$$46$$ + $JSCompiler_StaticMethods_doIndexCB$self$$.$i$($JSCompiler_StaticMethods_doIndexCB$self$$.$f$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$i$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$m$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
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
      $JSSMS$Utils$$.console.log("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$$.$toHex$($opcode$$4$$));
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$f$++;
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$g$ = $JSCompiler_StaticMethods_bit$self$$.$g$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$S$[$mask$$5$$];
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$55$$) {
  var $carry$$7$$ = $value$$55$$ & 1;
  $value$$55$$ = $value$$55$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$g$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$SZP_TABLE$[$value$$55$$];
  return $value$$55$$;
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$54$$) {
  var $carry$$6$$ = $value$$54$$ & 1;
  $value$$54$$ = $value$$54$$ >> 1 | $value$$54$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$g$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$SZP_TABLE$[$value$$54$$];
  return $value$$54$$;
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$53$$) {
  var $carry$$5$$ = ($value$$53$$ & 128) >> 7;
  $value$$53$$ = ($value$$53$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$g$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$SZP_TABLE$[$value$$53$$];
  return $value$$53$$;
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$52$$) {
  var $carry$$4$$ = ($value$$52$$ & 128) >> 7;
  $value$$52$$ = $value$$52$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$g$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$SZP_TABLE$[$value$$52$$];
  return $value$$52$$;
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$51$$) {
  var $carry$$3$$ = $value$$51$$ & 1;
  $value$$51$$ = ($value$$51$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$g$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$g$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$SZP_TABLE$[$value$$51$$];
  return $value$$51$$;
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$50$$) {
  var $carry$$2$$ = ($value$$50$$ & 128) >> 7;
  $value$$50$$ = ($value$$50$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$g$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$g$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$SZP_TABLE$[$value$$50$$];
  return $value$$50$$;
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$49$$) {
  var $carry$$1$$ = $value$$49$$ & 1;
  $value$$49$$ = ($value$$49$$ >> 1 | $value$$49$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$g$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$SZP_TABLE$[$value$$49$$];
  return $value$$49$$;
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$48$$) {
  var $carry$$ = ($value$$48$$ & 128) >> 7;
  $value$$48$$ = ($value$$48$$ << 1 | $value$$48$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$g$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$SZP_TABLE$[$value$$48$$];
  return $value$$48$$;
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$16$$) {
  $JSCompiler_StaticMethods_decMem$self$$.$j$($offset$$16$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$i$($offset$$16$$)));
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$j$($offset$$15$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$i$($offset$$15$$)));
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$f$ = $JSCompiler_StaticMethods_ret$self$$.$n$($JSCompiler_StaticMethods_ret$self$$.$k$), $JSCompiler_StaticMethods_ret$self$$.$k$ += 2, $JSCompiler_StaticMethods_ret$self$$.$m$ -= 6);
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$;
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$f$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$m$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$f$++;
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$f$ = $JSCompiler_StaticMethods_jp$self$$.$n$($JSCompiler_StaticMethods_jp$self$$.$f$) : $JSCompiler_StaticMethods_jp$self$$.$f$ += 2;
}
function $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_interrupt$self$$) {
  $JSCompiler_StaticMethods_interrupt$self$$.$G$ && !$JSCompiler_StaticMethods_interrupt$self$$.$P$ && ($JSCompiler_StaticMethods_interrupt$self$$.$N$ && ($JSCompiler_StaticMethods_interrupt$self$$.$f$++, $JSCompiler_StaticMethods_interrupt$self$$.$N$ = !1), $JSCompiler_StaticMethods_interrupt$self$$.$G$ = $JSCompiler_StaticMethods_interrupt$self$$.$I$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.$F$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.push($JSCompiler_StaticMethods_interrupt$self$$.$f$), 
  0 === $JSCompiler_StaticMethods_interrupt$self$$.$Q$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 0 === $JSCompiler_StaticMethods_interrupt$self$$.$R$ || 255 === $JSCompiler_StaticMethods_interrupt$self$$.$R$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$R$, $JSCompiler_StaticMethods_interrupt$self$$.$m$ -= 13) : 1 === $JSCompiler_StaticMethods_interrupt$self$$.$Q$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$m$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 
  $JSCompiler_StaticMethods_interrupt$self$$.$n$(($JSCompiler_StaticMethods_interrupt$self$$.$T$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$R$), $JSCompiler_StaticMethods_interrupt$self$$.$m$ -= 19));
}
function $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_interpret$self$$) {
  var $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = 0, $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = 
  $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
  $JSCompiler_StaticMethods_interpret$self$$.$P$ = !1;
  $JSCompiler_StaticMethods_interpret$self$$.$m$ -= $OP_STATES$$[$carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$];
  switch($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$) {
    case 1:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 7;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ << 1 & 255 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      break;
    case 8:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$W$;
      $JSCompiler_StaticMethods_interpret$self$$.$W$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$ba$;
      $JSCompiler_StaticMethods_interpret$self$$.$ba$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 1 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ << 
      7;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      break;
    case 16:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$b$ - 1 & 255;
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 17:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 7;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = ($JSCompiler_StaticMethods_interpret$self$$.$a$ << 1 | $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = ($JSCompiler_StaticMethods_interpret$self$$.$a$ >> 1 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) << 7) & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      break;
    case 32:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 33:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 34:
      $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$ea$[$JSCompiler_StaticMethods_interpret$self$$.$a$ | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 
      1) << 8 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 2) << 8 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 16) << 6];
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 2 | $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 
      8;
      break;
    case 40:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 41:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 42:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
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
      $JSCompiler_StaticMethods_interpret$self$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 50:
      $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 51:
      $JSCompiler_StaticMethods_interpret$self$$.$k$++;
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
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$k$));
      break;
    case 58:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 59:
      $JSCompiler_StaticMethods_interpret$self$$.$k$--;
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
      $JSCompiler_StaticMethods_interpret$self$$.$m$ = 0;
      $JSCompiler_StaticMethods_interpret$self$$.$N$ = !0;
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
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$b$] | 16;
      break;
    case 161:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$c$] | 16;
      break;
    case 162:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$d$] | 16;
      break;
    case 163:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$e$] | 16;
      break;
    case 164:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$h$] | 16;
      break;
    case 165:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$l$] | 16;
      break;
    case 166:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
      break;
    case 167:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | 16;
      break;
    case 168:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$b$];
      break;
    case 169:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$c$];
      break;
    case 170:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$d$];
      break;
    case 171:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$e$];
      break;
    case 172:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$h$];
      break;
    case 173:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$l$];
      break;
    case 174:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))];
      break;
    case 175:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ = 0];
      break;
    case 176:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$b$];
      break;
    case 177:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$c$];
      break;
    case 178:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$d$];
      break;
    case 179:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$e$];
      break;
    case 180:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$h$];
      break;
    case 181:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$l$];
      break;
    case 182:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))];
      break;
    case 183:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$);
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
      break;
    case 194:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 195:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$);
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
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$);
      $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
      break;
    case 202:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 203:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$m$ -= $OP_CB_STATES$$[$carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$];
      switch($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$) {
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
          $JSSMS$Utils$$.console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$));
      }
      break;
    case 204:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 205:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$ + 2);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$);
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$);
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
      break;
    case 210:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 211:
      $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_interpret$self$$.$a$);
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$X$;
      $JSCompiler_StaticMethods_interpret$self$$.$X$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$Y$;
      $JSCompiler_StaticMethods_interpret$self$$.$Y$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$Z$;
      $JSCompiler_StaticMethods_interpret$self$$.$Z$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$aa$;
      $JSCompiler_StaticMethods_interpret$self$$.$aa$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$ca$;
      $JSCompiler_StaticMethods_interpret$self$$.$ca$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$da$;
      $JSCompiler_StaticMethods_interpret$self$$.$da$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      break;
    case 218:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 219:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 220:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 221:
      var $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $temp$$inline_133_temp$$inline_137$$ = 
      0;
      $JSCompiler_StaticMethods_interpret$self$$.$m$ -= $OP_DD_STATES$$[$carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$];
      switch($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$) {
        case 9:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 25:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 33:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$o$ + 1 & 255;
          0 === $JSCompiler_StaticMethods_interpret$self$$.$o$ && ($JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$q$ + 1 & 255);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 41:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$o$ - 1 & 255;
          255 === $JSCompiler_StaticMethods_interpret$self$$.$o$ && ($JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$q$ - 1 & 255);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
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
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$k$));
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 100:
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$.$q$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 109:
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
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
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$q$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$q$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$o$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$q$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$o$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$q$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$o$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$q$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 203:
          $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 225:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$));
          $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
          break;
        case 227:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$));
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$k$, $temp$$inline_133_temp$$inline_137$$);
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$k$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$)), $JSCompiler_StaticMethods_interpret$self$$.$f$--;
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
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$));
      $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
      break;
    case 226:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 227:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$));
      $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$k$, $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$);
      break;
    case 228:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 229:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 230:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++)] | 16;
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
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
      $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
      $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$;
      break;
    case 236:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 237:
      var $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$), $location$$inline_138$$ = 
      $temp$$inline_133_temp$$inline_137$$ = 0;
      $JSCompiler_StaticMethods_interpret$self$$.$m$ -= $OP_ED_STATES$$[$carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$];
      switch($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$) {
        case 64:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$b$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 65:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 66:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 67:
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
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
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = 0;
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $temp$$inline_133_temp$$inline_137$$);
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
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$);
          $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
          $JSCompiler_StaticMethods_interpret$self$$.$G$ = $JSCompiler_StaticMethods_interpret$self$$.$I$;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$Q$ = 0;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 71:
          $JSCompiler_StaticMethods_interpret$self$$.$T$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 72:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$c$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 73:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 74:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 75:
          $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 79:
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 80:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$d$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 81:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$d$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 82:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 83:
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 86:
        ;
        case 118:
          $JSCompiler_StaticMethods_interpret$self$$.$Q$ = 1;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 87:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$T$;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$V$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | ($JSCompiler_StaticMethods_interpret$self$$.$I$ ? 4 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 88:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$e$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 89:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$e$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 90:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 91:
          $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 95:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSSMS$Utils$$.$rndInt$(255);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$V$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | ($JSCompiler_StaticMethods_interpret$self$$.$I$ ? 4 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$h$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 97:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 98:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 103:
          $location$$inline_138$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($location$$inline_138$$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($location$$inline_138$$, $temp$$inline_133_temp$$inline_137$$ >> 4 | ($JSCompiler_StaticMethods_interpret$self$$.$a$ & 15) << 4);
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 240 | $temp$$inline_133_temp$$inline_137$$ & 15;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$l$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 105:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 106:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 107:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 111:
          $location$$inline_138$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($location$$inline_138$$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($location$$inline_138$$, ($temp$$inline_133_temp$$inline_137$$ & 15) << 4 | $JSCompiler_StaticMethods_interpret$self$$.$a$ & 15);
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 240 | $temp$$inline_133_temp$$inline_137$$ >> 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$k$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_interpret$self$$.$k$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 120:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 121:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 122:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$k$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 123:
          $JSCompiler_StaticMethods_interpret$self$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 160:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ = $temp$$inline_133_temp$$inline_137$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_133_temp$$inline_137$$ & 8 | ($temp$$inline_133_temp$$inline_137$$ & 2 ? 32 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 161:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_133_temp$$inline_137$$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 162:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 163:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_133_temp$$inline_137$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 168:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ = $temp$$inline_133_temp$$inline_137$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_133_temp$$inline_137$$ & 8 | ($temp$$inline_133_temp$$inline_137$$ & 2 ? 32 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 169:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_133_temp$$inline_137$$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 170:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 171:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_133_temp$$inline_137$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 176:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ = $temp$$inline_133_temp$$inline_137$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_133_temp$$inline_137$$ & 8 | ($temp$$inline_133_temp$$inline_137$$ & 2 ? 32 : 0);
          0 !== $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 177:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          0 !== ($temp$$inline_133_temp$$inline_137$$ & 4) && 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64) ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_133_temp$$inline_137$$;
          break;
        case 178:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 179:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_133_temp$$inline_137$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 184:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ = $temp$$inline_133_temp$$inline_137$$ + $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $temp$$inline_133_temp$$inline_137$$ & 8 | ($temp$$inline_133_temp$$inline_137$$ & 2 ? 32 : 0);
          0 !== $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 185:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $temp$$inline_133_temp$$inline_137$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 0 : 4;
          0 !== ($temp$$inline_133_temp$$inline_137$$ & 4) && 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64) ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $temp$$inline_133_temp$$inline_137$$;
          break;
        case 186:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$j$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 187:
          $temp$$inline_133_temp$$inline_137$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$s$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $temp$$inline_133_temp$$inline_137$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$m$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $temp$$inline_133_temp$$inline_137$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($temp$$inline_133_temp$$inline_137$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$)), $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      }
      break;
    case 238:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++)];
      break;
    case 239:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 40;
      break;
    case 240:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 241:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$);
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
      break;
    case 242:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 243:
      $JSCompiler_StaticMethods_interpret$self$$.$G$ = $JSCompiler_StaticMethods_interpret$self$$.$I$ = !1;
      $JSCompiler_StaticMethods_interpret$self$$.$P$ = !0;
      break;
    case 244:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 245:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$a$ << 8 | $JSCompiler_StaticMethods_interpret$self$$.$g$);
      break;
    case 246:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++)];
      break;
    case 247:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 48;
      break;
    case 248:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 249:
      $JSCompiler_StaticMethods_interpret$self$$.$k$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 250:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 251:
      $JSCompiler_StaticMethods_interpret$self$$.$G$ = $JSCompiler_StaticMethods_interpret$self$$.$I$ = $JSCompiler_StaticMethods_interpret$self$$.$P$ = !0;
      break;
    case 252:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 253:
      $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$m$ -= $OP_DD_STATES$$[$carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$];
      switch($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$) {
        case 9:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 25:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 33:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$p$ + 1 & 255;
          0 === $JSCompiler_StaticMethods_interpret$self$$.$p$ && ($JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$r$ + 1 & 255);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 41:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$p$ - 1 & 255;
          255 === $JSCompiler_StaticMethods_interpret$self$$.$p$ && ($JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$r$ - 1 & 255);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++);
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
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$k$));
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$r$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$p$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$r$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$p$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$r$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$p$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$.$d$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$r$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$p$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$.$e$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 100:
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$p$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$.$r$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$d$;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$e$;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$r$;
          break;
        case 109:
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$.$p$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
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
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$r$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$p$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$r$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$p$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$r$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$p$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$r$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$p$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$r$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$p$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 203:
          $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 225:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$));
          $JSCompiler_StaticMethods_interpret$self$$.$k$ += 2;
          break;
        case 227:
          $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$n$($JSCompiler_StaticMethods_interpret$self$$.$k$));
          $JSCompiler_StaticMethods_interpret$self$$.$w$($JSCompiler_StaticMethods_interpret$self$$.$k$, $carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$);
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$k$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_104_carry$$inline_107_carry$$inline_110_carry$$inline_98_opcode_opcode$$inline_120_opcode$$inline_132_opcode$$inline_136_opcode$$inline_144_temp_temp$$inline_101_temp$$inline_113_temp$$inline_123_temp$$inline_126_temp$$inline_129_temp$$inline_145_value$$inline_141_value$$inline_337_value$$inline_340_value$$inline_343_value$$inline_346_value$$inline_353_value$$inline_356$$)), $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      }
      break;
    case 254:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 255:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_interpret$self$$.$f$ = 56;
  }
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$u$:[]};
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
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $index$$47$$, $address$$11_address$$inline_151$$) {
  var $opcode$$inline_155_toHex$$4$$ = $JSSMS$Utils$$.$toHex$, $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_location$$inline_154_toHex$$inline_152$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$11_address$$inline_151$$, $code$$8_code$$inline_158$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $inst$$inline_157_operand$$2$$ = 
  "", $location$$25_offset$$17$$ = 0;
  $address$$11_address$$inline_151$$++;
  $location$$25_offset$$17$$ = 0;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD " + $index$$47$$ + ",BC";
      $code$$8_code$$inline_158$$ = "this.set" + $index$$47$$ + "(this.add16(this.get" + $index$$47$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD " + $index$$47$$ + ",DE";
      $code$$8_code$$inline_158$$ = "this.set" + $index$$47$$ + "(this.add16(this.get" + $index$$47$$ + "(), this.getDE()));";
      break;
    case 33:
      $inst$$inline_157_operand$$2$$ = $opcode$$inline_155_toHex$$4$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$));
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "," + $inst$$inline_157_operand$$2$$;
      $code$$8_code$$inline_158$$ = "this.set" + $index$$47$$ + "(" + $inst$$inline_157_operand$$2$$ + ");";
      $address$$11_address$$inline_151$$ += 2;
      break;
    case 34:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$inline_157_operand$$2$$ = $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $inst$$inline_157_operand$$2$$ + ")," + $index$$47$$;
      $code$$8_code$$inline_158$$ = "this.writeMem(" + $inst$$inline_157_operand$$2$$ + ", this." + $index$$47$$.toLowerCase() + "L);this.writeMem(" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$ + 1) + ", this." + $index$$47$$.toLowerCase() + "H);";
      $address$$11_address$$inline_151$$ += 2;
      break;
    case 35:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "INC " + $index$$47$$;
      $code$$8_code$$inline_158$$ = "this.inc" + $index$$47$$ + "();";
      break;
    case 36:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "INC " + $index$$47$$ + "H *";
      break;
    case 37:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "DEC " + $index$$47$$ + "H *";
      break;
    case 38:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H," + $opcode$$inline_155_toHex$$4$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$)) + " *";
      $address$$11_address$$inline_151$$++;
      break;
    case 41:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD " + $index$$47$$ + "  " + $index$$47$$;
      break;
    case 42:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + " (" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.ixL = this.readMem(" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");this.ixH = this.readMem(" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$ + 1) + ");";
      $address$$11_address$$inline_151$$ += 2;
      break;
    case 43:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "DEC " + $index$$47$$;
      $code$$8_code$$inline_158$$ = "this.dec" + $index$$47$$ + "();";
      break;
    case 44:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "INC " + $index$$47$$ + "L *";
      break;
    case 45:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "DEC " + $index$$47$$ + "L *";
      break;
    case 46:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L," + $opcode$$inline_155_toHex$$4$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$));
      $address$$11_address$$inline_151$$++;
      break;
    case 52:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "INC (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.incMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 53:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "DEC (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.decMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 54:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$inline_157_operand$$2$$ = $opcode$$inline_155_toHex$$4$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$ + 1));
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")," + $inst$$inline_157_operand$$2$$;
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", " + $inst$$inline_157_operand$$2$$ + ");";
      $address$$11_address$$inline_151$$ += 2;
      break;
    case 57:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD " + $index$$47$$ + " SP";
      $code$$8_code$$inline_158$$ = "this.set" + $index$$47$$ + "(this.add16(this.get" + $index$$47$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD B," + $index$$47$$ + "H *";
      break;
    case 69:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD B," + $index$$47$$ + "L *";
      break;
    case 70:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD B,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.b = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 76:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD C," + $index$$47$$ + "H *";
      break;
    case 77:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD C," + $index$$47$$ + "L *";
      break;
    case 78:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD C,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.c = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 84:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD D," + $index$$47$$ + "H *";
      break;
    case 85:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD D," + $index$$47$$ + "L *";
      break;
    case 86:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD D,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.d = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 92:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD E," + $index$$47$$ + "H *";
      break;
    case 93:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD E," + $index$$47$$ + "L *";
      break;
    case 94:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD E,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.e = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 96:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H,B *";
      break;
    case 97:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H,C *";
      break;
    case 98:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H,D *";
      break;
    case 99:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H,E *";
      break;
    case 100:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H," + $index$$47$$ + "H*";
      break;
    case 101:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H," + $index$$47$$ + "L *";
      break;
    case 102:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD H,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.h = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 103:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "H,A *";
      break;
    case 104:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L,B *";
      break;
    case 105:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L,C *";
      break;
    case 106:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L,D *";
      break;
    case 107:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L,E *";
      break;
    case 108:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L," + $index$$47$$ + "H *";
      break;
    case 109:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L," + $index$$47$$ + "L *";
      $code$$8_code$$inline_158$$ = "";
      break;
    case 110:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD L,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.l = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 111:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD " + $index$$47$$ + "L,A *";
      $code$$8_code$$inline_158$$ = "this." + $index$$47$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),B";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.b);";
      $address$$11_address$$inline_151$$++;
      break;
    case 113:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),C";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.c);";
      $address$$11_address$$inline_151$$++;
      break;
    case 114:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),D";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.d);";
      $address$$11_address$$inline_151$$++;
      break;
    case 115:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),E";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.e);";
      $address$$11_address$$inline_151$$++;
      break;
    case 116:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),H";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.h);";
      $address$$11_address$$inline_151$$++;
      break;
    case 117:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),L";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.l);";
      $address$$11_address$$inline_151$$++;
      break;
    case 119:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "),A";
      $code$$8_code$$inline_158$$ = "this.writeMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ", this.a);";
      $address$$11_address$$inline_151$$++;
      break;
    case 124:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD A," + $index$$47$$ + "H *";
      break;
    case 125:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD A," + $index$$47$$ + "L *";
      break;
    case 126:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.a = this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ");";
      $address$$11_address$$inline_151$$++;
      break;
    case 132:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD A," + $index$$47$$ + "H *";
      break;
    case 133:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD A," + $index$$47$$ + "L *";
      break;
    case 134:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADD A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.add_a(this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_151$$++;
      break;
    case 140:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADC A," + $index$$47$$ + "H *";
      break;
    case 141:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADC A," + $index$$47$$ + "L *";
      break;
    case 142:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "ADC A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.adc_a(this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_151$$++;
      break;
    case 148:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "SUB " + $index$$47$$ + "H *";
      break;
    case 149:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "SUB " + $index$$47$$ + "L *";
      break;
    case 150:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "SUB A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.sub_a(this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_151$$++;
      break;
    case 156:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "SBC A," + $index$$47$$ + "H *";
      break;
    case 157:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "SBC A," + $index$$47$$ + "L *";
      break;
    case 158:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "SBC A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.sbc_a(this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_151$$++;
      break;
    case 164:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "AND " + $index$$47$$ + "H *";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$47$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "AND " + $index$$47$$ + "L *";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$47$$.toLowerCase() + "L];";
      break;
    case 166:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "AND A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")] | F_HALFCARRY;";
      $address$$11_address$$inline_151$$++;
      break;
    case 172:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "XOR A " + $index$$47$$ + "H*";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "XOR A " + $index$$47$$ + "L*";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "L];";
      break;
    case 174:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "XOR A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")];";
      $address$$11_address$$inline_151$$++;
      break;
    case 180:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "OR A " + $index$$47$$ + "H*";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "OR A " + $index$$47$$ + "L*";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$47$$.toLowerCase() + "L];";
      break;
    case 182:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "OR A,(" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")];";
      $address$$11_address$$inline_151$$++;
      break;
    case 188:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "CP " + $index$$47$$ + "H *";
      $code$$8_code$$inline_158$$ = "this.cp_a(this." + $index$$47$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "CP " + $index$$47$$ + "L *";
      $code$$8_code$$inline_158$$ = "this.cp_a(this." + $index$$47$$.toLowerCase() + "L);";
      break;
    case 190:
      $location$$25_offset$$17$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "CP (" + $index$$47$$ + "+" + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + ")";
      $code$$8_code$$inline_158$$ = "this.cp_a(this.readMem(this.get" + $index$$47$$ + "() + " + $opcode$$inline_155_toHex$$4$$($location$$25_offset$$17$$) + "));";
      $address$$11_address$$inline_151$$++;
      break;
    case 203:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = $JSSMS$Utils$$.$toHex$;
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "location = this.get" + $index$$47$$ + "() + " + $inst$$3_location$$inline_154_toHex$$inline_152$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$++)) + " & 0xFFFF;";
      $opcode$$inline_155_toHex$$4$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$, $address$$11_address$$inline_151$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$ = [$opcode$$inline_155_toHex$$4$$];
      $inst$$inline_157_operand$$2$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$8_code$$inline_158$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$11_address$$inline_151$$++;
      switch($opcode$$inline_155_toHex$$4$$) {
        case 0:
          $inst$$inline_157_operand$$2$$ = "LD B,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_157_operand$$2$$ = "LD C,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_157_operand$$2$$ = "LD D,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_157_operand$$2$$ = "LD E,RLC (" + $index$$47$$ + ")";
          break;
        case 4:
          $inst$$inline_157_operand$$2$$ = "LD H,RLC (" + $index$$47$$ + ")";
          break;
        case 5:
          $inst$$inline_157_operand$$2$$ = "LD L,RLC (" + $index$$47$$ + ")";
          break;
        case 6:
          $inst$$inline_157_operand$$2$$ = "RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_157_operand$$2$$ = "LD A,RLC (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_157_operand$$2$$ = "LD B,RRC (" + $index$$47$$ + ")";
          break;
        case 9:
          $inst$$inline_157_operand$$2$$ = "LD C,RRC (" + $index$$47$$ + ")";
          break;
        case 10:
          $inst$$inline_157_operand$$2$$ = "LD D,RRC (" + $index$$47$$ + ")";
          break;
        case 11:
          $inst$$inline_157_operand$$2$$ = "LD E,RRC (" + $index$$47$$ + ")";
          break;
        case 12:
          $inst$$inline_157_operand$$2$$ = "LD H,RRC (" + $index$$47$$ + ")";
          break;
        case 13:
          $inst$$inline_157_operand$$2$$ = "LD L,RRC (" + $index$$47$$ + ")";
          break;
        case 14:
          $inst$$inline_157_operand$$2$$ = "RRC (" + $index$$47$$ + ")";
          break;
        case 15:
          $inst$$inline_157_operand$$2$$ = "LD A,RRC (" + $index$$47$$ + ")";
          break;
        case 16:
          $inst$$inline_157_operand$$2$$ = "LD B,RL (" + $index$$47$$ + ")";
          break;
        case 17:
          $inst$$inline_157_operand$$2$$ = "LD C,RL (" + $index$$47$$ + ")";
          break;
        case 18:
          $inst$$inline_157_operand$$2$$ = "LD D,RL (" + $index$$47$$ + ")";
          break;
        case 19:
          $inst$$inline_157_operand$$2$$ = "LD E,RL (" + $index$$47$$ + ")";
          break;
        case 20:
          $inst$$inline_157_operand$$2$$ = "LD H,RL (" + $index$$47$$ + ")";
          break;
        case 21:
          $inst$$inline_157_operand$$2$$ = "LD L,RL (" + $index$$47$$ + ")";
          break;
        case 22:
          $inst$$inline_157_operand$$2$$ = "RL (" + $index$$47$$ + ")";
          break;
        case 23:
          $inst$$inline_157_operand$$2$$ = "LD A,RL (" + $index$$47$$ + ")";
          break;
        case 24:
          $inst$$inline_157_operand$$2$$ = "LD B,RR (" + $index$$47$$ + ")";
          break;
        case 25:
          $inst$$inline_157_operand$$2$$ = "LD C,RR (" + $index$$47$$ + ")";
          break;
        case 26:
          $inst$$inline_157_operand$$2$$ = "LD D,RR (" + $index$$47$$ + ")";
          break;
        case 27:
          $inst$$inline_157_operand$$2$$ = "LD E,RR (" + $index$$47$$ + ")";
          break;
        case 28:
          $inst$$inline_157_operand$$2$$ = "LD H,RR (" + $index$$47$$ + ")";
          break;
        case 29:
          $inst$$inline_157_operand$$2$$ = "LD L,RR (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_157_operand$$2$$ = "RR (" + $index$$47$$ + ")";
          break;
        case 31:
          $inst$$inline_157_operand$$2$$ = "LD A,RR (" + $index$$47$$ + ")";
          $code$$8_code$$inline_158$$ = $inst$$3_location$$inline_154_toHex$$inline_152$$ + "this.a = this.rr(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 32:
          $inst$$inline_157_operand$$2$$ = "LD B,SLA (" + $index$$47$$ + ")";
          break;
        case 33:
          $inst$$inline_157_operand$$2$$ = "LD C,SLA (" + $index$$47$$ + ")";
          break;
        case 34:
          $inst$$inline_157_operand$$2$$ = "LD D,SLA (" + $index$$47$$ + ")";
          break;
        case 35:
          $inst$$inline_157_operand$$2$$ = "LD E,SLA (" + $index$$47$$ + ")";
          break;
        case 36:
          $inst$$inline_157_operand$$2$$ = "LD H,SLA (" + $index$$47$$ + ")";
          break;
        case 37:
          $inst$$inline_157_operand$$2$$ = "LD L,SLA (" + $index$$47$$ + ")";
          break;
        case 38:
          $inst$$inline_157_operand$$2$$ = "SLA (" + $index$$47$$ + ")";
          break;
        case 39:
          $inst$$inline_157_operand$$2$$ = "LD A,SLA (" + $index$$47$$ + ")";
          break;
        case 40:
          $inst$$inline_157_operand$$2$$ = "LD B,SRA (" + $index$$47$$ + ")";
          break;
        case 41:
          $inst$$inline_157_operand$$2$$ = "LD C,SRA (" + $index$$47$$ + ")";
          break;
        case 42:
          $inst$$inline_157_operand$$2$$ = "LD D,SRA (" + $index$$47$$ + ")";
          break;
        case 43:
          $inst$$inline_157_operand$$2$$ = "LD E,SRA (" + $index$$47$$ + ")";
          break;
        case 44:
          $inst$$inline_157_operand$$2$$ = "LD H,SRA (" + $index$$47$$ + ")";
          break;
        case 45:
          $inst$$inline_157_operand$$2$$ = "LD L,SRA (" + $index$$47$$ + ")";
          break;
        case 46:
          $inst$$inline_157_operand$$2$$ = "SRA (" + $index$$47$$ + ")";
          break;
        case 47:
          $inst$$inline_157_operand$$2$$ = "LD A,SRA (" + $index$$47$$ + ")";
          break;
        case 48:
          $inst$$inline_157_operand$$2$$ = "LD B,SLL (" + $index$$47$$ + ")";
          break;
        case 49:
          $inst$$inline_157_operand$$2$$ = "LD C,SLL (" + $index$$47$$ + ")";
          break;
        case 50:
          $inst$$inline_157_operand$$2$$ = "LD D,SLL (" + $index$$47$$ + ")";
          break;
        case 51:
          $inst$$inline_157_operand$$2$$ = "LD E,SLL (" + $index$$47$$ + ")";
          break;
        case 52:
          $inst$$inline_157_operand$$2$$ = "LD H,SLL (" + $index$$47$$ + ")";
          break;
        case 53:
          $inst$$inline_157_operand$$2$$ = "LD L,SLL (" + $index$$47$$ + ")";
          break;
        case 54:
          $inst$$inline_157_operand$$2$$ = "SLL (" + $index$$47$$ + ") *";
          break;
        case 55:
          $inst$$inline_157_operand$$2$$ = "LD A,SLL (" + $index$$47$$ + ")";
          break;
        case 56:
          $inst$$inline_157_operand$$2$$ = "LD B,SRL (" + $index$$47$$ + ")";
          break;
        case 57:
          $inst$$inline_157_operand$$2$$ = "LD C,SRL (" + $index$$47$$ + ")";
          break;
        case 58:
          $inst$$inline_157_operand$$2$$ = "LD D,SRL (" + $index$$47$$ + ")";
          break;
        case 59:
          $inst$$inline_157_operand$$2$$ = "LD E,SRL (" + $index$$47$$ + ")";
          break;
        case 60:
          $inst$$inline_157_operand$$2$$ = "LD H,SRL (" + $index$$47$$ + ")";
          break;
        case 61:
          $inst$$inline_157_operand$$2$$ = "LD L,SRL (" + $index$$47$$ + ")";
          break;
        case 62:
          $inst$$inline_157_operand$$2$$ = "SRL (" + $index$$47$$ + ")";
          break;
        case 63:
          $inst$$inline_157_operand$$2$$ = "LD A,SRL (" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 0,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 1,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 2,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 3,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 4,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 5,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 6,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "BIT 7,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 0,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 1,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 2,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 3,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 4,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 5,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 6,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "RES 7,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 0,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 1,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 2,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 3,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 4,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 5,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 6,(" + $index$$47$$ + ")";
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
          $inst$$inline_157_operand$$2$$ = "SET 7,(" + $index$$47$$ + ")";
      }
      $address$$11_address$$inline_151$$++;
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = $inst$$inline_157_operand$$2$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_156$$);
      break;
    case 225:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "POP " + $index$$47$$;
      $code$$8_code$$inline_158$$ = "this.set" + $index$$47$$ + "(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "EX SP,(" + $index$$47$$ + ")";
      $code$$8_code$$inline_158$$ = "temp = this.get" + $index$$47$$ + "();this.set" + $index$$47$$ + "(this.readMemWord(this.sp));this.writeMem(this.sp, temp & 0xFF);this.writeMem(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "PUSH " + $index$$47$$;
      $code$$8_code$$inline_158$$ = "this.push2(this." + $index$$47$$.toLowerCase() + "H, this." + $index$$47$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "JP (" + $index$$47$$ + ")";
      $code$$8_code$$inline_158$$ = "this.pc = this.get" + $index$$47$$ + "(); return;";
      $address$$11_address$$inline_151$$ = null;
      break;
    case 249:
      $inst$$3_location$$inline_154_toHex$$inline_152$$ = "LD SP," + $index$$47$$, $code$$8_code$$inline_158$$ = "this.sp = this.get" + $index$$47$$ + "();";
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_location$$inline_154_toHex$$inline_152$$, code:$code$$8_code$$inline_158$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$11_address$$inline_151$$};
}
function $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) {
  var $address$$inline_161_toHex$$2_toHex$$inline_170$$ = $JSSMS$Utils$$.$toHex$, $opcode$$6_options$$inline_180$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$), $opcodesArray_toHex$$inline_181$$ = [$opcode$$6_options$$inline_180$$], $inst_opcode$$inline_162_opcode$$inline_171$$ = "Unknown Opcode", $currAddr_defaultInstruction$$inline_182$$ = $address$$8$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = null, $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = 
  'throw "Unimplemented opcode ' + $address$$inline_161_toHex$$2_toHex$$inline_170$$($opcode$$6_options$$inline_180$$) + '";', $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "", $currAddr$$inline_165_currAddr$$inline_174_location$$23$$ = 0;
  $address$$8$$++;
  $_inst_inst$$inline_164_inst$$inline_173_operand$$ = {};
  switch($opcode$$6_options$$inline_180$$) {
    case 0:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "NOP";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 1:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD BC," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setBC(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 2:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (BC),A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getBC(), this.a);";
      break;
    case 3:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC BC";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.incBC();";
      break;
    case 4:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 7:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RLCA";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.rlca_a();";
      break;
    case 8:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "EX AF AF'";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.exAF();";
      break;
    case 9:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD HL,BC";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,(BC)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.readMem(this.getBC());";
      break;
    case 11:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC BC";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.decBC();";
      break;
    case 12:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 15:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RRCA";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.rrca_a();";
      break;
    case 16:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DJNZ (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b !== 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 17:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD DE," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setDE(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 18:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (DE),A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getDE(), this.a);";
      break;
    case 19:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC DE";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.incDE();";
      break;
    case 20:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 23:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RLA";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.rla_a();";
      break;
    case 24:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JR (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      $address$$8$$ = null;
      break;
    case 25:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD HL,DE";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,(DE)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.readMem(this.getDE());";
      break;
    case 27:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC DE";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.decDE();";
      break;
    case 28:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 31:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RRA";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.rra_a();";
      break;
    case 32:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JR NZ,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if (!((this.f & F_ZERO) !== 0x00)) {this.tstates -= 0x05;this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 33:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD HL," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 34:
      $currAddr$$inline_165_currAddr$$inline_174_location$$23$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($currAddr$$inline_165_currAddr$$inline_174_location$$23$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + "),HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ", this.l);this.writeMem(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($currAddr$$inline_165_currAddr$$inline_174_location$$23$$ + 1) + ", this.h);";
      $address$$8$$ += 2;
      break;
    case 35:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.incHL();";
      break;
    case 36:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 39:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DAA";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.daa();";
      break;
    case 40:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JR Z,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) !== 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 41:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD HL,HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD HL,(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(this.readMemWord(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + "));";
      $address$$8$$ += 2;
      break;
    case 43:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.decHL();";
      break;
    case 44:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 47:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CPL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cpl_a();";
      break;
    case 48:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JR NC,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if (!((this.f & F_CARRY) !== 0x00)) {this.tstates -= 0x05;this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 49:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD SP," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sp = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$ += 2;
      break;
    case 50:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + "),A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ", this.a);";
      $address$$8$$ += 2;
      break;
    case 51:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC SP";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sp++;";
      break;
    case 52:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC (HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC (HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL)," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$++;
      break;
    case 55:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SCF";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$) + 1);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JR C,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) !== 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$++;
      break;
    case 57:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD HL,SP";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.readMem(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$ += 2;
      break;
    case 59:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC SP";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sp--;";
      break;
    case 60:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "INC A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DEC A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ";";
      $address$$8$$++;
      break;
    case 63:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CCF";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.ccf();";
      break;
    case 64:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 65:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.c;";
      break;
    case 66:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.d;";
      break;
    case 67:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.e;";
      break;
    case 68:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.h;";
      break;
    case 69:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.l;";
      break;
    case 70:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.readMem(this.getHL());";
      break;
    case 71:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD B,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.b = this.a;";
      break;
    case 72:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.b;";
      break;
    case 73:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 74:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.d;";
      break;
    case 75:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.e;";
      break;
    case 76:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.h;";
      break;
    case 77:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.l;";
      break;
    case 78:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.readMem(this.getHL());";
      break;
    case 79:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD C,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.c = this.a;";
      break;
    case 80:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.b;";
      break;
    case 81:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.c;";
      break;
    case 82:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 83:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.e;";
      break;
    case 84:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.h;";
      break;
    case 85:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.l;";
      break;
    case 86:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.readMem(this.getHL());";
      break;
    case 87:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD D,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.d = this.a;";
      break;
    case 88:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.b;";
      break;
    case 89:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.c;";
      break;
    case 90:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.d;";
      break;
    case 91:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 92:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.h;";
      break;
    case 93:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.l;";
      break;
    case 94:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.readMem(this.getHL());";
      break;
    case 95:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD E,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.e = this.a;";
      break;
    case 96:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.b;";
      break;
    case 97:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.c;";
      break;
    case 98:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.d;";
      break;
    case 99:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.e;";
      break;
    case 100:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 101:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.l;";
      break;
    case 102:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.readMem(this.getHL());";
      break;
    case 103:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD H,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.h = this.a;";
      break;
    case 104:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.b;";
      break;
    case 105:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.c;";
      break;
    case 106:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.d;";
      break;
    case 107:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.e;";
      break;
    case 108:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.h;";
      break;
    case 109:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 110:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.readMem(this.getHL());";
      break;
    case 111:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD L,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.l = this.a;";
      break;
    case 112:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.b);";
      break;
    case 113:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.c);";
      break;
    case 114:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.d);";
      break;
    case 115:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.e);";
      break;
    case 116:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.h);";
      break;
    case 117:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.l);";
      break;
    case 118:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "HALT";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.tstates = 0x00;" + ("this.halt = true; this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ - 1) + "; return;");
      break;
    case 119:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD (HL),A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.writeMem(this.getHL(), this.a);";
      break;
    case 120:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.b;";
      break;
    case 121:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.c;";
      break;
    case 122:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.d;";
      break;
    case 123:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.e;";
      break;
    case 124:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.h;";
      break;
    case 125:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.l;";
      break;
    case 126:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = this.readMem(this.getHL());";
      break;
    case 127:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "";
      break;
    case 128:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.b);";
      break;
    case 129:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.c);";
      break;
    case 130:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.d);";
      break;
    case 131:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.e);";
      break;
    case 132:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.h);";
      break;
    case 133:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.l);";
      break;
    case 134:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.readMem(this.getHL()));";
      break;
    case 135:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(this.a);";
      break;
    case 136:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.readMem(this.getHL()));";
      break;
    case 143:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.readMem(this.getHL()));";
      break;
    case 151:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.readMem(this.getHL()));";
      break;
    case 159:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
      break;
    case 175:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.a = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
      break;
    case 183:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,B";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,D";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,E";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,H";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,L";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,(HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.readMem(this.getHL()));";
      break;
    case 191:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP A,A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET NZ";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "POP BC";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP NZ,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) === 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 195:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      $address$$8$$ = null;
      break;
    case 196:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL NZ (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) === 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 197:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "PUSH BC";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADD A," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.add_a(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$++;
      break;
    case 199:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 0;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 200:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET Z";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) !== 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.pc = this.readMemWord(this.sp); this.sp += 0x02; return;";
      $address$$8$$ = null;
      break;
    case 202:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP Z,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) !== 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 203:
      var $address$$inline_161_toHex$$2_toHex$$inline_170$$ = $address$$8$$, $inst_opcode$$inline_162_opcode$$inline_171$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_161_toHex$$2_toHex$$inline_170$$), $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = [$inst_opcode$$inline_162_opcode$$inline_171$$], $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "Unimplemented 0xCB prefixed opcode", $currAddr$$inline_165_currAddr$$inline_174_location$$23$$ = 
      $address$$inline_161_toHex$$2_toHex$$inline_170$$, $code$$inline_166_target$$inline_175$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
      $address$$inline_161_toHex$$2_toHex$$inline_170$$++;
      switch($inst_opcode$$inline_162_opcode$$inline_171$$) {
        case 0:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.rlc(this.b);";
          break;
        case 1:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.rlc(this.c);";
          break;
        case 2:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.rlc(this.d);";
          break;
        case 3:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.rlc(this.e);";
          break;
        case 4:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.rlc(this.h);";
          break;
        case 5:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.rlc(this.l);";
          break;
        case 6:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
          break;
        case 7:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLC A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.rlc(this.a);";
          break;
        case 8:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.rrc(this.b);";
          break;
        case 9:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.rrc(this.c);";
          break;
        case 10:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.rrc(this.d);";
          break;
        case 11:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.rrc(this.e);";
          break;
        case 12:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.rrc(this.h);";
          break;
        case 13:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.rrc(this.l);";
          break;
        case 14:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.rrc(this.readMem(this.getHL())));";
          break;
        case 15:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRC A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.rrc(this.a);";
          break;
        case 16:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.rl(this.b);";
          break;
        case 17:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.rl(this.c);";
          break;
        case 18:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.rl(this.d);";
          break;
        case 19:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.rl(this.e);";
          break;
        case 20:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.rl(this.h);";
          break;
        case 21:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.rl(this.l);";
          break;
        case 22:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.rl(this.readMem(this.getHL())));";
          break;
        case 23:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RL A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.rl(this.a);";
          break;
        case 24:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.rr(this.b);";
          break;
        case 25:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.rr(this.c);";
          break;
        case 26:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.rr(this.d);";
          break;
        case 27:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.rr(this.e);";
          break;
        case 28:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.rr(this.h);";
          break;
        case 29:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.rr(this.l);";
          break;
        case 30:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
          break;
        case 31:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RR A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.rr(this.a);";
          break;
        case 32:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.sla(this.b);";
          break;
        case 33:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.sla(this.c);";
          break;
        case 34:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.sla(this.d);";
          break;
        case 35:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.sla(this.e);";
          break;
        case 36:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.sla(this.h);";
          break;
        case 37:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.sla(this.l);";
          break;
        case 38:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.sla(this.readMem(this.getHL())));";
          break;
        case 39:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLA A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.sla(this.a);";
          break;
        case 40:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.sra(this.b);";
          break;
        case 41:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.sra(this.c);";
          break;
        case 42:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.sra(this.d);";
          break;
        case 43:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.sra(this.e);";
          break;
        case 44:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.sra(this.h);";
          break;
        case 45:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.sra(this.l);";
          break;
        case 46:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.sra(this.readMem(this.getHL())));";
          break;
        case 47:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRA A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.sra(this.a);";
          break;
        case 48:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.sll(this.b);";
          break;
        case 49:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.sll(this.c);";
          break;
        case 50:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.sll(this.d);";
          break;
        case 51:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.sll(this.e);";
          break;
        case 52:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.sll(this.h);";
          break;
        case 53:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.sll(this.l);";
          break;
        case 54:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.sll(this.readMem(this.getHL())));";
          break;
        case 55:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SLL A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.sll(this.a);";
          break;
        case 56:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL B";
          $code$$inline_166_target$$inline_175$$ = "this.b = this.srl(this.b);";
          break;
        case 57:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL C";
          $code$$inline_166_target$$inline_175$$ = "this.c = this.srl(this.c);";
          break;
        case 58:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL D";
          $code$$inline_166_target$$inline_175$$ = "this.d = this.srl(this.d);";
          break;
        case 59:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL E";
          $code$$inline_166_target$$inline_175$$ = "this.e = this.srl(this.e);";
          break;
        case 60:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL H";
          $code$$inline_166_target$$inline_175$$ = "this.h = this.srl(this.h);";
          break;
        case 61:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL L";
          $code$$inline_166_target$$inline_175$$ = "this.l = this.srl(this.l);";
          break;
        case 62:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL (HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.srl(this.readMem(this.getHL())));";
          break;
        case 63:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SRL A";
          $code$$inline_166_target$$inline_175$$ = "this.a = this.srl(this.a);";
          break;
        case 64:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_0);";
          break;
        case 65:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_0);";
          break;
        case 66:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_0);";
          break;
        case 67:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_0);";
          break;
        case 68:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_0);";
          break;
        case 69:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_0);";
          break;
        case 70:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
          break;
        case 71:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 0,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_0);";
          break;
        case 72:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_1);";
          break;
        case 73:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_1);";
          break;
        case 74:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_1);";
          break;
        case 75:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_1);";
          break;
        case 76:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_1);";
          break;
        case 77:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_1);";
          break;
        case 78:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
          break;
        case 79:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 1,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_1);";
          break;
        case 80:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_2);";
          break;
        case 81:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_2);";
          break;
        case 82:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_2);";
          break;
        case 83:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_2);";
          break;
        case 84:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_2);";
          break;
        case 85:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_2);";
          break;
        case 86:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
          break;
        case 87:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 2,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_2);";
          break;
        case 88:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_3);";
          break;
        case 89:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_3);";
          break;
        case 90:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_3);";
          break;
        case 91:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_3);";
          break;
        case 92:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_3);";
          break;
        case 93:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_3);";
          break;
        case 94:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
          break;
        case 95:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 3,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_3);";
          break;
        case 96:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_4);";
          break;
        case 97:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_4);";
          break;
        case 98:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_4);";
          break;
        case 99:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_4);";
          break;
        case 100:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_4);";
          break;
        case 101:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_4);";
          break;
        case 102:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
          break;
        case 103:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 4,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_4);";
          break;
        case 104:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_5);";
          break;
        case 105:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_5);";
          break;
        case 106:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_5);";
          break;
        case 107:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_5);";
          break;
        case 108:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_5);";
          break;
        case 109:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_5);";
          break;
        case 110:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
          break;
        case 111:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 5,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_5);";
          break;
        case 112:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_6);";
          break;
        case 113:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_6);";
          break;
        case 114:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_6);";
          break;
        case 115:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_6);";
          break;
        case 116:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_6);";
          break;
        case 117:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_6);";
          break;
        case 118:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
          break;
        case 119:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 6,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_6);";
          break;
        case 120:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,B";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.b & BIT_7);";
          break;
        case 121:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,C";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.c & BIT_7);";
          break;
        case 122:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,D";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.d & BIT_7);";
          break;
        case 123:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,E";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.e & BIT_7);";
          break;
        case 124:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,H";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.h & BIT_7);";
          break;
        case 125:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,L";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.l & BIT_7);";
          break;
        case 126:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
          break;
        case 127:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "BIT 7,A";
          $code$$inline_166_target$$inline_175$$ = "this.bit(this.a & BIT_7);";
          break;
        case 128:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,B";
          $code$$inline_166_target$$inline_175$$ = "this.b &= ~BIT_0;";
          break;
        case 129:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,C";
          $code$$inline_166_target$$inline_175$$ = "this.c &= ~BIT_0;";
          break;
        case 130:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,D";
          $code$$inline_166_target$$inline_175$$ = "this.d &= ~BIT_0;";
          break;
        case 131:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,E";
          $code$$inline_166_target$$inline_175$$ = "this.e &= ~BIT_0;";
          break;
        case 132:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,H";
          $code$$inline_166_target$$inline_175$$ = "this.h &= ~BIT_0;";
          break;
        case 133:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,L";
          $code$$inline_166_target$$inline_175$$ = "this.l &= ~BIT_0;";
          break;
        case 134:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
          break;
        case 135:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 0,A";
          $code$$inline_166_target$$inline_175$$ = "this.a &= ~BIT_0;";
          break;
        case 136:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,B";
          break;
        case 137:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,C";
          break;
        case 138:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,D";
          break;
        case 139:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,E";
          break;
        case 140:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,H";
          break;
        case 141:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,L";
          break;
        case 142:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
          break;
        case 143:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 1,A";
          break;
        case 144:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,B";
          break;
        case 145:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,C";
          break;
        case 146:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,D";
          break;
        case 147:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,E";
          break;
        case 148:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,H";
          break;
        case 149:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,L";
          break;
        case 150:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
          break;
        case 151:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 2,A";
          break;
        case 152:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,B";
          break;
        case 153:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,C";
          break;
        case 154:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,D";
          break;
        case 155:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,E";
          break;
        case 156:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,H";
          break;
        case 157:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,L";
          break;
        case 158:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
          break;
        case 159:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 3,A";
          $code$$inline_166_target$$inline_175$$ = "this.a &= ~BIT_3;";
          break;
        case 160:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,B";
          break;
        case 161:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,C";
          break;
        case 162:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,D";
          break;
        case 163:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,E";
          break;
        case 164:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,H";
          break;
        case 165:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,L";
          break;
        case 166:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
          break;
        case 167:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 4,A";
          $code$$inline_166_target$$inline_175$$ = "this.a &= ~BIT_4;";
          break;
        case 168:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,B";
          break;
        case 169:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,C";
          break;
        case 170:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,D";
          break;
        case 171:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,E";
          break;
        case 172:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,H";
          break;
        case 173:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,L";
          break;
        case 174:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
          break;
        case 175:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 5,A";
          break;
        case 176:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,B";
          break;
        case 177:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,C";
          break;
        case 178:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,D";
          break;
        case 179:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,E";
          break;
        case 180:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,H";
          break;
        case 181:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,L";
          break;
        case 182:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
          break;
        case 183:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 6,A";
          $code$$inline_166_target$$inline_175$$ = "this.a &= ~BIT_6;";
          break;
        case 184:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,B";
          $code$$inline_166_target$$inline_175$$ = "this.b &= ~BIT_7;";
          break;
        case 185:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,C";
          $code$$inline_166_target$$inline_175$$ = "this.c &= ~BIT_7;";
          break;
        case 186:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,D";
          $code$$inline_166_target$$inline_175$$ = "this.d &= ~BIT_7;";
          break;
        case 187:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,E";
          $code$$inline_166_target$$inline_175$$ = "this.e &= ~BIT_7;";
          break;
        case 188:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,H";
          $code$$inline_166_target$$inline_175$$ = "this.h &= ~BIT_7;";
          break;
        case 189:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,L";
          $code$$inline_166_target$$inline_175$$ = "this.l &= ~BIT_7;";
          break;
        case 190:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
          break;
        case 191:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RES 7,A";
          $code$$inline_166_target$$inline_175$$ = "this.a &= ~BIT_7;";
          break;
        case 192:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,B";
          $code$$inline_166_target$$inline_175$$ = "this.b |= BIT_0;";
          break;
        case 193:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,C";
          $code$$inline_166_target$$inline_175$$ = "this.c |= BIT_0;";
          break;
        case 194:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,D";
          $code$$inline_166_target$$inline_175$$ = "this.d |= BIT_0;";
          break;
        case 195:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,E";
          $code$$inline_166_target$$inline_175$$ = "this.e |= BIT_0;";
          break;
        case 196:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,H";
          $code$$inline_166_target$$inline_175$$ = "this.h |= BIT_0;";
          break;
        case 197:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,L";
          $code$$inline_166_target$$inline_175$$ = "this.l |= BIT_0;";
          break;
        case 198:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
          break;
        case 199:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 0,A";
          $code$$inline_166_target$$inline_175$$ = "this.a |= BIT_0;";
          break;
        case 200:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,B";
          break;
        case 201:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,C";
          break;
        case 202:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,D";
          break;
        case 203:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,E";
          break;
        case 204:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,H";
          break;
        case 205:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,L";
          break;
        case 206:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
          break;
        case 207:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 1,A";
          break;
        case 208:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,B";
          break;
        case 209:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,C";
          break;
        case 210:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,D";
          break;
        case 211:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,E";
          break;
        case 212:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,H";
          break;
        case 213:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,L";
          break;
        case 214:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
          break;
        case 215:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 2,A";
          break;
        case 216:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,B";
          break;
        case 217:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,C";
          break;
        case 218:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,D";
          break;
        case 219:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,E";
          break;
        case 220:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,H";
          break;
        case 221:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,L";
          break;
        case 222:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
          break;
        case 223:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 3,A";
          break;
        case 224:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,B";
          break;
        case 225:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,C";
          break;
        case 226:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,D";
          break;
        case 227:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,E";
          break;
        case 228:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,H";
          break;
        case 229:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,L";
          break;
        case 230:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
          break;
        case 231:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 4,A";
          $code$$inline_166_target$$inline_175$$ = "this.a |= BIT_4;";
          break;
        case 232:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,B";
          break;
        case 233:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,C";
          break;
        case 234:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,D";
          break;
        case 235:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,E";
          break;
        case 236:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,H";
          break;
        case 237:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,L";
          break;
        case 238:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
          break;
        case 239:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 5,A";
          $code$$inline_166_target$$inline_175$$ = "this.a |= BIT_5;";
          break;
        case 240:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,B";
          $code$$inline_166_target$$inline_175$$ = "this.b |= BIT_6;";
          break;
        case 241:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,C";
          $code$$inline_166_target$$inline_175$$ = "this.c |= BIT_6;";
          break;
        case 242:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,D";
          $code$$inline_166_target$$inline_175$$ = "this.d |= BIT_6;";
          break;
        case 243:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,E";
          $code$$inline_166_target$$inline_175$$ = "this.e |= BIT_6;";
          break;
        case 244:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,H";
          $code$$inline_166_target$$inline_175$$ = "this.h |= BIT_6;";
          break;
        case 245:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,L";
          $code$$inline_166_target$$inline_175$$ = "this.l |= BIT_6;";
          break;
        case 246:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
          break;
        case 247:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 6,A";
          $code$$inline_166_target$$inline_175$$ = "this.a |= BIT_6;";
          break;
        case 248:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,B";
          $code$$inline_166_target$$inline_175$$ = "this.b |= BIT_7;";
          break;
        case 249:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,C";
          $code$$inline_166_target$$inline_175$$ = "this.c |= BIT_7;";
          break;
        case 250:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,D";
          $code$$inline_166_target$$inline_175$$ = "this.d |= BIT_7;";
          break;
        case 251:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,E";
          $code$$inline_166_target$$inline_175$$ = "this.e |= BIT_7;";
          break;
        case 252:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,H";
          $code$$inline_166_target$$inline_175$$ = "this.h |= BIT_7;";
          break;
        case 253:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,L";
          $code$$inline_166_target$$inline_175$$ = "this.l |= BIT_7;";
          break;
        case 254:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,(HL)";
          $code$$inline_166_target$$inline_175$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
          break;
        case 255:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SET 7,A", $code$$inline_166_target$$inline_175$$ = "this.a |= BIT_7;";
      }
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = {$opcode$:$inst_opcode$$inline_162_opcode$$inline_171$$, $opcodes$:$code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$, $inst$:$_inst_inst$$inline_164_inst$$inline_173_operand$$, code:$code$$inline_166_target$$inline_175$$, $address$:$currAddr$$inline_165_currAddr$$inline_174_location$$23$$, $nextAddress$:$address$$inline_161_toHex$$2_toHex$$inline_170$$};
      $inst_opcode$$inline_162_opcode$$inline_171$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.code;
      $opcodesArray_toHex$$inline_181$$ = $opcodesArray_toHex$$inline_181$$.concat($_inst_inst$$inline_164_inst$$inline_173_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$nextAddress$;
      break;
    case 204:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL Z (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_ZERO) !== 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 205:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      $address$$8$$ += 2;
      break;
    case 206:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "ADC ," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.adc_a(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$++;
      break;
    case 207:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 8;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 208:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET NC";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "POP DE";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP NC,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) === 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 211:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OUT (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($_inst_inst$$inline_164_inst$$inline_173_operand$$) + "),A";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self$$, $_inst_inst$$inline_164_inst$$inline_173_operand$$);
      $address$$8$$++;
      break;
    case 212:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL NC (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) === 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 213:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "PUSH DE";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SUB " + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sub_a(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$++;
      break;
    case 215:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 16;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 216:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET C";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) !== 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "EXX";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP C,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) !== 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 219:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "IN A,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($_inst_inst$$inline_164_inst$$inline_173_operand$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self$$, $_inst_inst$$inline_164_inst$$inline_173_operand$$);
      $address$$8$$++;
      break;
    case 220:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL C (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_CARRY) !== 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 221:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IX", $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.code;
      $opcodesArray_toHex$$inline_181$$ = $opcodesArray_toHex$$inline_181$$.concat($_inst_inst$$inline_164_inst$$inline_173_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$nextAddress$;
      break;
    case 222:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "SBC A," + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sbc_a(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$++;
      break;
    case 223:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 24;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 224:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET PO";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_PARITY) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "POP HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP PO,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_PARITY) === 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 227:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "EX (SP),HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "temp = this.h;this.h = this.readMem(this.sp + 0x01);this.writeMem(this.sp + 0x01, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
      break;
    case 228:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL PO (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_PARITY) === 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 229:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "PUSH HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "AND (" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + "] | F_HALFCARRY;";
      $address$$8$$++;
      break;
    case 231:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 32;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 232:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET PE";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_PARITY) !== 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP (HL)";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.pc = this.getHL(); return;";
      $address$$8$$ = null;
      break;
    case 234:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP PE,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_PARITY) !== 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 235:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "EX DE,HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL PE (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_PARITY) !== 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 237:
      var $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $address$$8$$, $address$$inline_161_toHex$$2_toHex$$inline_170$$ = $JSSMS$Utils$$.$toHex$, $inst_opcode$$inline_162_opcode$$inline_171$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$), $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = [$inst_opcode$$inline_162_opcode$$inline_171$$], $_inst_inst$$inline_164_inst$$inline_173_operand$$ = 
      "Unimplemented 0xED prefixed opcode", $currAddr$$inline_165_currAddr$$inline_174_location$$23$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$, $code$$inline_166_target$$inline_175$$ = null, $code$$inline_176$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_177$$ = "", $location$$inline_178$$ = 0;
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$++;
      switch($inst_opcode$$inline_162_opcode$$inline_171$$) {
        case 64:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN B,(C)";
          $code$$inline_176$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
          break;
        case 65:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),B";
          $code$$inline_176$$ = "this.port.out(this.c, this.b);";
          break;
        case 66:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SBC HL,BC";
          $code$$inline_176$$ = "this.sbc16(this.getBC());";
          break;
        case 67:
          $location$$inline_178$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$);
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD (" + $operand$$inline_177$$ + "),BC";
          $code$$inline_176$$ = "this.writeMem(" + $operand$$inline_177$$ + ", this.c);this.writeMem(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$ + 1) + ", this.b);";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
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
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "NEG";
          $code$$inline_176$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RETN / RETI";
          $code$$inline_176$$ = "this.pc = this.readMemWord(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = null;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IM 0";
          $code$$inline_176$$ = "this.im = 0x00;";
          break;
        case 71:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD I,A";
          $code$$inline_176$$ = "this.i = this.a;";
          break;
        case 72:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN C,(C)";
          $code$$inline_176$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
          break;
        case 73:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),C";
          $code$$inline_176$$ = "this.port.out(this.c, this.c);";
          break;
        case 74:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "ADC HL,BC";
          $code$$inline_176$$ = "this.adc16(this.getBC());";
          break;
        case 75:
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$));
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD BC,(" + $operand$$inline_177$$ + ")";
          $code$$inline_176$$ = "this.setBC(this.readMemWord(" + $operand$$inline_177$$ + "));";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 79:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD R,A";
          $code$$inline_176$$ = "this.r = this.a;";
          break;
        case 80:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN D,(C)";
          $code$$inline_176$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
          break;
        case 81:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),D";
          $code$$inline_176$$ = "this.port.out(this.c, this.d);";
          break;
        case 82:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SBC HL,DE";
          $code$$inline_176$$ = "this.sbc16(this.getDE());";
          break;
        case 83:
          $location$$inline_178$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$);
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD (" + $operand$$inline_177$$ + "),DE";
          $code$$inline_176$$ = "this.writeMem(" + $operand$$inline_177$$ + ", this.e);this.writeMem(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$ + 1) + ", this.d);";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 86:
        ;
        case 118:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IM 1";
          $code$$inline_176$$ = "this.im = 0x01;";
          break;
        case 87:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD A,I";
          $code$$inline_176$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
          break;
        case 88:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN E,(C)";
          $code$$inline_176$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
          break;
        case 89:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),E";
          $code$$inline_176$$ = "this.port.out(this.c, this.e);";
          break;
        case 90:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "ADC HL,DE";
          $code$$inline_176$$ = "this.adc16(this.getDE());";
          break;
        case 91:
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$));
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD DE,(" + $operand$$inline_177$$ + ")";
          $code$$inline_176$$ = "this.setDE(this.readMemWord(" + $operand$$inline_177$$ + "));";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 95:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD A,R";
          $code$$inline_176$$ = "this.a = JSSMS.Utils.rndInt(0xFF);this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
          break;
        case 96:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN H,(C)";
          $code$$inline_176$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
          break;
        case 97:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),H";
          $code$$inline_176$$ = "this.port.out(this.c, this.h);";
          break;
        case 98:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SBC HL,HL";
          $code$$inline_176$$ = "this.sbc16(this.getHL());";
          break;
        case 99:
          $location$$inline_178$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$);
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD (" + $operand$$inline_177$$ + "),HL";
          $code$$inline_176$$ = "this.writeMem(" + $operand$$inline_177$$ + ", this.l);this.writeMem(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$ + 1) + ", this.h);";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 103:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RRD";
          $code$$inline_176$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 104:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN L,(C)";
          $code$$inline_176$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
          break;
        case 105:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),L";
          $code$$inline_176$$ = "this.port.out(this.c, this.l);";
          break;
        case 106:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "ADC HL,HL";
          $code$$inline_176$$ = "this.adc16(this.getHL());";
          break;
        case 107:
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$));
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD HL,(" + $operand$$inline_177$$ + ")";
          $code$$inline_176$$ = "this.setHL(this.readMemWord(" + $operand$$inline_177$$ + "));";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 111:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "RLD";
          $code$$inline_176$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 113:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),0";
          $code$$inline_176$$ = "this.port.out(this.c, 0);";
          break;
        case 114:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "SBC HL,SP";
          $code$$inline_176$$ = "this.sbc16(this.sp);";
          break;
        case 115:
          $location$$inline_178$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$);
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD (" + $operand$$inline_177$$ + "),SP";
          $code$$inline_176$$ = "this.writeMem(" + $operand$$inline_177$$ + ", this.sp & 0xFF);this.writeMem(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($location$$inline_178$$ + 1) + ", this.sp >> 8);";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 120:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IN A,(C)";
          $code$$inline_176$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 121:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUT (C),A";
          $code$$inline_176$$ = "this.port.out(this.c, this.a);";
          break;
        case 122:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "ADC HL,SP";
          $code$$inline_176$$ = "this.adc16(this.sp);";
          break;
        case 123:
          $operand$$inline_177$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$));
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LD SP,(" + $operand$$inline_177$$ + ")";
          $code$$inline_176$$ = "this.sp = this.readMemWord(" + $operand$$inline_177$$ + ");";
          $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ += 2;
          break;
        case 160:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LDI";
          $code$$inline_176$$ = "temp = this.readMem(this.getHL());this.writeMem(this.getDE(), temp);this.decBC();this.incDE();this.incHL();temp = (temp + this.a) & 0xFF;this.f = (this.f & 0xC1) | (this.getBC() ? F_PARITY : 0) | (temp & 0x08) | ((temp & 0x02) ? 0x20 : 0);";
          break;
        case 161:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "CPI";
          $code$$inline_176$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
          break;
        case 162:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "INI";
          $code$$inline_176$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 163:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUTI";
          $code$$inline_176$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 168:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LDD";
          break;
        case 169:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "CPD";
          break;
        case 170:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "IND";
          $code$$inline_176$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 171:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OUTD";
          $code$$inline_176$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 176:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LDIR";
          $code$$inline_166_target$$inline_175$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ - 2;
          $code$$inline_176$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();if (this.getBC() !== 0x00) {this.tstates -= 0x05;this.f |= F_PARITY;return;} else {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
          break;
        case 177:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "CPIR";
          $code$$inline_166_target$$inline_175$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ - 2;
          $code$$inline_176$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);" + ("if ((temp & F_PARITY) !== 0x00 && (this.f & F_ZERO) === 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($code$$inline_166_target$$inline_175$$) + ";return;}");
          $code$$inline_176$$ += "this.f = (this.f & 0xF8) | temp;";
          break;
        case 178:
          $code$$inline_166_target$$inline_175$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ - 2;
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "INIR";
          $code$$inline_176$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 179:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OTIR";
          $code$$inline_166_target$$inline_175$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ - 2;
          $code$$inline_176$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}";
          $code$$inline_176$$ += "if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 184:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "LDDR";
          break;
        case 185:
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "CPDR";
          break;
        case 186:
          $code$$inline_166_target$$inline_175$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ - 2;
          $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "INDR";
          $code$$inline_176$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 187:
          $code$$inline_166_target$$inline_175$$ = $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ - 2, $_inst_inst$$inline_164_inst$$inline_173_operand$$ = "OTDR", $code$$inline_176$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      }
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = {$opcode$:$inst_opcode$$inline_162_opcode$$inline_171$$, $opcodes$:$code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$, $inst$:$_inst_inst$$inline_164_inst$$inline_173_operand$$, code:$code$$inline_176$$, $address$:$currAddr$$inline_165_currAddr$$inline_174_location$$23$$, $nextAddress$:$address$$inline_169_hexOpcodes$$inline_184_target$$46$$, target:$code$$inline_166_target$$inline_175$$};
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.target;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.code;
      $opcodesArray_toHex$$inline_181$$ = $opcodesArray_toHex$$inline_181$$.concat($_inst_inst$$inline_164_inst$$inline_173_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$nextAddress$;
      break;
    case 238:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "XOR " + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + "];";
      $address$$8$$++;
      break;
    case 239:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 40;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 240:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET P";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_SIGN) === 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "POP AF";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.setAF(this.readMemWord(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP P,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_SIGN) === 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 243:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "DI";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL P (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_SIGN) === 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 245:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "PUSH AF";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "OR " + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + "];";
      $address$$8$$++;
      break;
    case 247:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 48;
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$);
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + "; return;";
      break;
    case 248:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "RET M";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_SIGN) !== 0x00) {this.tstates -= 0x06;this.pc = this.readMemWord(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "LD SP,HL";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "JP M,(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_SIGN) !== 0x00) {this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 251:
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "EI";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CALL M (" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ")";
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "if ((this.f & F_SIGN) !== 0x00) {this.tstates -= 0x07;this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$ + 2) + ");this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + ";return;}";
      $address$$8$$ += 2;
      break;
    case 253:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$, "IY", $address$$8$$);
      $inst_opcode$$inline_162_opcode$$inline_171$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$inst$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.code;
      $opcodesArray_toHex$$inline_181$$ = $opcodesArray_toHex$$inline_181$$.concat($_inst_inst$$inline_164_inst$$inline_173_operand$$.$opcodes$);
      $address$$8$$ = $_inst_inst$$inline_164_inst$$inline_173_operand$$.$nextAddress$;
      break;
    case 254:
      $_inst_inst$$inline_164_inst$$inline_173_operand$$ = $address$$inline_161_toHex$$2_toHex$$inline_170$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$, $address$$8$$));
      $inst_opcode$$inline_162_opcode$$inline_171$$ = "CP " + $_inst_inst$$inline_164_inst$$inline_173_operand$$;
      $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.cp_a(" + $_inst_inst$$inline_164_inst$$inline_173_operand$$ + ");";
      $address$$8$$++;
      break;
    case 255:
      $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = 56, $inst_opcode$$inline_162_opcode$$inline_171$$ = "RST " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$), $code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$ = "this.push1(" + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$8$$) + "); this.pc = " + $address$$inline_161_toHex$$2_toHex$$inline_170$$($address$$inline_169_hexOpcodes$$inline_184_target$$46$$) + 
      "; return;";
  }
  var $opcode$$6_options$$inline_180$$ = {$opcode$:$opcode$$6_options$$inline_180$$, $opcodes$:$opcodesArray_toHex$$inline_181$$, $inst$:$inst_opcode$$inline_162_opcode$$inline_171$$, code:$code$$5_opcodesArray$$inline_163_opcodesArray$$inline_172$$, $address$:$currAddr_defaultInstruction$$inline_182$$, $nextAddress$:$address$$8$$, target:$address$$inline_169_hexOpcodes$$inline_184_target$$46$$}, $opcodesArray_toHex$$inline_181$$ = $JSSMS$Utils$$.$toHex$, $currAddr_defaultInstruction$$inline_182$$ = 
  {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""}, $prop$$inline_183$$, $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = "";
  for ($prop$$inline_183$$ in $currAddr_defaultInstruction$$inline_182$$) {
    void 0 !== $opcode$$6_options$$inline_180$$[$prop$$inline_183$$] && ($currAddr_defaultInstruction$$inline_182$$[$prop$$inline_183$$] = $opcode$$6_options$$inline_180$$[$prop$$inline_183$$]);
  }
  $currAddr_defaultInstruction$$inline_182$$.$hexAddress$ = $opcodesArray_toHex$$inline_181$$($currAddr_defaultInstruction$$inline_182$$.$address$);
  $currAddr_defaultInstruction$$inline_182$$.$opcodes$.length && ($address$$inline_169_hexOpcodes$$inline_184_target$$46$$ = $currAddr_defaultInstruction$$inline_182$$.$opcodes$.map($opcodesArray_toHex$$inline_181$$).join(" ") + " ");
  $currAddr_defaultInstruction$$inline_182$$.label = $currAddr_defaultInstruction$$inline_182$$.$hexAddress$ + " " + $address$$inline_169_hexOpcodes$$inline_184_target$$46$$ + $currAddr_defaultInstruction$$inline_182$$.$inst$;
  return $currAddr_defaultInstruction$$inline_182$$;
}
function $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$) {
  function $getTotalTStates$$($opcodes$$) {
    var $tstates$$1$$ = 0;
    switch($opcodes$$[0]) {
      case 203:
        $tstates$$1$$ = $OP_CB_STATES$$[$opcodes$$[1]];
        break;
      case 221:
      ;
      case 253:
        $tstates$$1$$ = 2 === $opcodes$$.length ? $OP_DD_STATES$$[$opcodes$$[1]] : $OP_INDEX_CB_STATES$$[$opcodes$$[2]];
        break;
      case 237:
        $tstates$$1$$ = $OP_ED_STATES$$[$opcodes$$[1]];
        break;
      default:
        $tstates$$1$$ = $OP_STATES$$[$opcodes$$[0]];
    }
    return $tstates$$1$$;
  }
  function $insertTStates$$() {
    $tstates$$ && $code$$4$$.push("this.tstates -= " + $toHex$$1$$($tstates$$) + ";");
    $tstates$$ = 0;
  }
  $JSSMS$Utils$$.console.time("JavaScript generation");
  $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.$u$;
  for (var $toHex$$1$$ = $JSSMS$Utils$$.$toHex$, $tstates$$ = 0, $prevAddress$$ = 0, $prevNextAddress$$ = 0, $breakNeeded$$ = !1, $pageBreakPoint$$ = 1024, $pageNumber$$ = 0, $i$$17$$ = 0, $length$$17$$ = 0, $code$$4$$ = ['"": {', '"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'], $i$$17$$ = 0, $length$$17$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$17$$ < $length$$17$$;$i$$17$$++) {
    if ($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$]) {
      $prevAddress$$ <= $pageBreakPoint$$ && $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$ >= $pageBreakPoint$$ && ($code$$4$$.push("this.pc = " + $toHex$$1$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$) + ";"), $code$$4$$.push("}"), $code$$4$$.push("},"), $code$$4$$.push("" + $pageNumber$$ + ": {"), $code$$4$$.push('"": function() {'), $code$$4$$.push('throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'), 
      $breakNeeded$$ = !0, $pageNumber$$++, $pageBreakPoint$$ = 16384 * $pageNumber$$);
      if ($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$isJumpTarget$ || $prevNextAddress$$ !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevNextAddress$$ && !$breakNeeded$$ && $code$$4$$.push("this.pc = " + $toHex$$1$$($prevNextAddress$$) + ";"), $code$$4$$.push("},"), $code$$4$$.push("" + $toHex$$1$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$) + ": function(temp, location) {");
      }
      $code$$4$$.push("// " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].label);
      $breakNeeded$$ = "return;" === $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code.substr(-7);
      $tstates$$ += $getTotalTStates$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$opcodes$);
      (/return;/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code) || /this\.tstates/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code)) && $insertTStates$$();
      "" !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code && $code$$4$$.push($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code);
      $prevAddress$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$;
      $prevNextAddress$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$nextAddress$;
    }
  }
  $code$$4$$.push("}");
  $code$$4$$.push("}");
  $code$$4$$ = $code$$4$$.join("\n");
  $JSSMS$Utils$$.console.timeEnd("JavaScript generation");
  return $code$$4$$;
}
function $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_parseInstructions$self$$) {
  $JSSMS$Utils$$.console.time("Instructions parsing");
  var $romSize$$ = 16384 * $JSCompiler_StaticMethods_parseInstructions$self$$.$rom$.length, $instruction$$, $currentAddress$$, $i$$15$$ = 0, $addresses$$ = [], $entryPoints$$ = [0, 56, 102];
  for ($entryPoints$$.forEach(function($entryPoint$$) {
    $addresses$$.push($entryPoint$$);
  });$addresses$$.length;) {
    $currentAddress$$ = $addresses$$.shift(), $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$currentAddress$$] || ($currentAddress$$ >= $romSize$$ || 65 <= $currentAddress$$ >> 10 ? $JSSMS$Utils$$.console.log("Invalid address", $JSSMS$Utils$$.$toHex$($currentAddress$$)) : ($instruction$$ = $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_parseInstructions$self$$, $currentAddress$$), $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$currentAddress$$] = $instruction$$, 
    null !== $instruction$$.$nextAddress$ && $addresses$$.push($instruction$$.$nextAddress$), null !== $instruction$$.target && $addresses$$.push($instruction$$.target)));
  }
  for ($entryPoints$$.forEach(function($entryPoint$$1$$) {
    this.$u$[$entryPoint$$1$$] && (this.$u$[$entryPoint$$1$$].$isJumpTarget$ = !0);
  }, $JSCompiler_StaticMethods_parseInstructions$self$$);$i$$15$$ < $romSize$$;$i$$15$$++) {
    $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$] && (null !== $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].$nextAddress$ && $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].$nextAddress$] && $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].$nextAddress$].$jumpTargetNb$++, null !== $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].target && 
    ($JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].target] ? ($JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].target].$isJumpTarget$ = !0, $JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].target].$jumpTargetNb$++) : $JSSMS$Utils$$.console.log("Invalid target address", $JSSMS$Utils$$.$toHex$($JSCompiler_StaticMethods_parseInstructions$self$$.$u$[$i$$15$$].target))))
    ;
  }
  $JSSMS$Utils$$.console.timeEnd("Instructions parsing");
}
;function $JSSMS$Keyboard$$($sms$$1$$) {
  this.$main$ = $sms$$1$$;
  this.$g$ = this.$f$ = this.$a$ = 0;
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$g$ = this.$f$ = this.$a$ = 255;
  this.$pause_button$ = !1;
}};
var $NO_ANTIALIAS$$ = Number.MIN_VALUE, $PSG_VOLUME$$ = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0];
function $JSSMS$SN76489$$($sms$$2$$) {
  this.$main$ = $sms$$2$$;
  this.$j$ = this.$p$ = 0;
  this.$f$ = Array(8);
  this.$g$ = 0;
  this.$a$ = Array(4);
  this.$i$ = Array(4);
  this.$m$ = Array(3);
  this.$n$ = 16;
  this.$k$ = 32768;
  this.$o$ = Array(4);
}
$JSSMS$SN76489$$.prototype = {$q$:function $$JSSMS$SN76489$$$$$q$$($clockSpeed$$, $sampleRate$$) {
  this.$p$ = ($clockSpeed$$ << 8) / 16 / $sampleRate$$;
  this.$g$ = this.$j$ = 0;
  this.$n$ = 16;
  this.$k$ = 32768;
  for (var $i$$18$$ = 0;4 > $i$$18$$;$i$$18$$++) {
    this.$f$[$i$$18$$ << 1] = 1, this.$f$[($i$$18$$ << 1) + 1] = 15, this.$a$[$i$$18$$] = 0, this.$i$[$i$$18$$] = 1, 3 !== $i$$18$$ && (this.$m$[$i$$18$$] = $NO_ANTIALIAS$$);
  }
}};
function $JSSMS$Vdp$$($i$$inline_187_i$$inline_190_sms$$3$$) {
  this.$main$ = $i$$inline_187_i$$inline_190_sms$$3$$;
  var $i$$20_r$$inline_191$$ = 0;
  this.$M$ = 0;
  this.$i$ = new $JSSMS$Utils$$.$Uint8Array$(16384);
  this.$a$ = new $JSSMS$Utils$$.$Uint8Array$(96);
  for ($i$$20_r$$inline_191$$ = 0;96 > $i$$20_r$$inline_191$$;$i$$20_r$$inline_191$$++) {
    this.$a$[$i$$20_r$$inline_191$$] = 255;
  }
  this.$g$ = new $JSSMS$Utils$$.$Uint8Array$(16);
  this.$k$ = 0;
  this.$q$ = !1;
  this.$w$ = this.$s$ = this.$K$ = this.$G$ = this.$j$ = this.$o$ = 0;
  this.$v$ = new $JSSMS$Utils$$.$Uint8Array$(256);
  this.$Q$ = 0;
  this.$f$ = $i$$inline_187_i$$inline_190_sms$$3$$.$a$.$canvasImageData$.data;
  this.$T$ = new $JSSMS$Utils$$.$Uint8Array$(64);
  this.$S$ = new $JSSMS$Utils$$.$Uint8Array$(64);
  this.$R$ = new $JSSMS$Utils$$.$Uint8Array$(64);
  this.$P$ = new $JSSMS$Utils$$.$Uint8Array$(256);
  this.$O$ = new $JSSMS$Utils$$.$Uint8Array$(256);
  this.$N$ = new $JSSMS$Utils$$.$Uint8Array$(16);
  this.$n$ = this.$p$ = this.$m$ = 0;
  this.$r$ = !1;
  this.$t$ = Array(192);
  for ($i$$20_r$$inline_191$$ = 0;192 > $i$$20_r$$inline_191$$;$i$$20_r$$inline_191$$++) {
    this.$t$[$i$$20_r$$inline_191$$] = new $JSSMS$Utils$$.$Uint8Array$(25);
  }
  this.$I$ = Array(512);
  this.$J$ = new $JSSMS$Utils$$.$Uint8Array$(512);
  for ($i$$inline_187_i$$inline_190_sms$$3$$ = this.$u$ = this.$F$ = 0;512 > $i$$inline_187_i$$inline_190_sms$$3$$;$i$$inline_187_i$$inline_190_sms$$3$$++) {
    this.$I$[$i$$inline_187_i$$inline_190_sms$$3$$] = new $JSSMS$Utils$$.$Uint8Array$(64);
  }
  var $g$$inline_192$$, $b$$inline_193$$;
  for ($i$$inline_187_i$$inline_190_sms$$3$$ = 0;64 > $i$$inline_187_i$$inline_190_sms$$3$$;$i$$inline_187_i$$inline_190_sms$$3$$++) {
    $i$$20_r$$inline_191$$ = $i$$inline_187_i$$inline_190_sms$$3$$ & 3, $g$$inline_192$$ = $i$$inline_187_i$$inline_190_sms$$3$$ >> 2 & 3, $b$$inline_193$$ = $i$$inline_187_i$$inline_190_sms$$3$$ >> 4 & 3, this.$T$[$i$$inline_187_i$$inline_190_sms$$3$$] = 85 * $i$$20_r$$inline_191$$ & 255, this.$S$[$i$$inline_187_i$$inline_190_sms$$3$$] = 85 * $g$$inline_192$$ & 255, this.$R$[$i$$inline_187_i$$inline_190_sms$$3$$] = 85 * $b$$inline_193$$ & 255;
  }
  for ($i$$inline_187_i$$inline_190_sms$$3$$ = 0;256 > $i$$inline_187_i$$inline_190_sms$$3$$;$i$$inline_187_i$$inline_190_sms$$3$$++) {
    $g$$inline_192$$ = $i$$inline_187_i$$inline_190_sms$$3$$ & 15, $b$$inline_193$$ = $i$$inline_187_i$$inline_190_sms$$3$$ >> 4 & 15, this.$P$[$i$$inline_187_i$$inline_190_sms$$3$$] = ($g$$inline_192$$ << 4 | $g$$inline_192$$) & 255, this.$O$[$i$$inline_187_i$$inline_190_sms$$3$$] = ($b$$inline_193$$ << 4 | $b$$inline_193$$) & 255;
  }
  for ($i$$inline_187_i$$inline_190_sms$$3$$ = 0;16 > $i$$inline_187_i$$inline_190_sms$$3$$;$i$$inline_187_i$$inline_190_sms$$3$$++) {
    this.$N$[$i$$inline_187_i$$inline_190_sms$$3$$] = ($i$$inline_187_i$$inline_190_sms$$3$$ << 4 | $i$$inline_187_i$$inline_190_sms$$3$$) & 255;
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$21$$;
  this.$q$ = !0;
  for ($i$$21$$ = this.$G$ = this.$k$ = this.$w$ = this.$j$ = 0;16 > $i$$21$$;$i$$21$$++) {
    this.$g$[$i$$21$$] = 0;
  }
  this.$g$[2] = 14;
  this.$g$[5] = 126;
  this.$main$.$cpu$.$F$ = !1;
  this.$r$ = !0;
  this.$F$ = 512;
  this.$u$ = -1;
  for ($i$$21$$ = 0;16384 > $i$$21$$;$i$$21$$++) {
    this.$i$[$i$$21$$] = 0;
  }
  for ($i$$21$$ = 0;196608 > $i$$21$$;$i$$21$$ += 4) {
    this.$f$[$i$$21$$] = 0, this.$f$[$i$$21$$ + 1] = 0, this.$f$[$i$$21$$ + 2] = 0, this.$f$[$i$$21$$ + 3] = 255;
  }
}};
function $JSSMS$DummyUI$$($sms$$4$$) {
  this.$main$ = $sms$$4$$;
  this.reset = function $this$reset$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  };
  this.$g$ = function $this$$g$$() {
  };
  this.$i$ = function $this$$i$$() {
  };
}
function $JSSMS$NodeUI$$($sms$$5$$) {
  this.$main$ = $sms$$5$$;
  this.$canvasImageData$ = {data:[]};
}
$JSSMS$NodeUI$$.prototype = {reset:function $$JSSMS$NodeUI$$$$reset$() {
}, updateStatus:function $$JSSMS$NodeUI$$$$updateStatus$() {
}, $g$:function $$JSSMS$NodeUI$$$$$g$$() {
}, $i$:function $$JSSMS$NodeUI$$$$$i$$() {
}, $a$:function $$JSSMS$NodeUI$$$$$a$$() {
  var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$ = this.$main$.$cpu$;
  $JSSMS$Utils$$.console.time("DOT generation");
  for (var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$.$u$, $content$$inline_266$$ = ["digraph G {"], $i$$inline_267$$ = 0, $length$$inline_268$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$.length;$i$$inline_267$$ < $length$$inline_268$$;$i$$inline_267$$++) {
    $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$[$i$$inline_267$$] && ($content$$inline_266$$.push(" " + $i$$inline_267$$ + ' [label="' + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$[$i$$inline_267$$].label + '"];'), null !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$[$i$$inline_267$$].target && $content$$inline_266$$.push(" " + 
    $i$$inline_267$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$[$i$$inline_267$$].target + ";"), null !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$[$i$$inline_267$$].$nextAddress$ && $content$$inline_266$$.push(" " + $i$$inline_267$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_264_tree$$inline_265$$[$i$$inline_267$$].$nextAddress$ + 
    ";"));
  }
  $content$$inline_266$$.push("}");
  $content$$inline_266$$ = $content$$inline_266$$.join("\n");
  $content$$inline_266$$ = $content$$inline_266$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  $JSSMS$Utils$$.console.timeEnd("DOT generation");
  return $content$$inline_266$$;
}, $f$:function $$JSSMS$NodeUI$$$$$f$$() {
  return $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$$(this.$main$.$cpu$);
}};
function $JSSMS$Ports$$($sms$$6$$) {
  this.$main$ = $sms$$6$$;
  this.$a$ = $sms$$6$$.$f$;
  this.$i$ = $sms$$6$$.$g$;
  this.$g$ = $sms$$6$$.$j$;
  this.$f$ = [];
}
$JSSMS$Ports$$.prototype = {reset:function $$JSSMS$Ports$$$$reset$() {
  this.$f$ = Array(2);
}};
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_in_$self$$, $port$$3$$) {
  if ($JSCompiler_StaticMethods_in_$self$$.$main$.$is_gg$ && 7 > $port$$3$$) {
    switch($port$$3$$) {
      case 0:
        return $JSCompiler_StaticMethods_in_$self$$.$g$.$g$ & 191 | 64;
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
        if (0 === $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$M$) {
          if (218 < $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$s$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$s$ - 6;
            break a;
          }
        } else {
          if (242 < $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$s$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$s$ - 57;
            break a;
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$s$;
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$q$ = !0;
      var $statuscopy$$inline_276_value$$inline_273$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$K$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$K$ = $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$i$[$JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$j$++ & 
      16383] & 255;
      return $statuscopy$$inline_276_value$$inline_273$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$ = $JSCompiler_StaticMethods_in_$self$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$q$ = !0, $statuscopy$$inline_276_value$$inline_273$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$k$, 
      $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$k$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_275_JSCompiler_StaticMethods_dataRead$self$$inline_272_JSCompiler_StaticMethods_getVCount$self$$inline_270_JSCompiler_inline_result$$7$$.$main$.$cpu$.$F$ = !1, $statuscopy$$inline_276_value$$inline_273$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$g$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$g$.$f$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$f$[0] | $JSCompiler_StaticMethods_in_$self$$.$f$[1];
  }
  return 255;
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$, $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$, $reg$$inline_286_value$$82$$) {
  if (!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$)) {
    switch($address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[0] = ($reg$$inline_286_value$$82$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[1] = $reg$$inline_286_value$$82$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$;
        $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$q$ = !0;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$G$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ & 16383;
            if ($reg$$inline_286_value$$82$$ !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$i$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$] & 255)) {
              if ($address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ && $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ + 
              64 || $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ + 128 && $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ + 
              256) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$r$ = !0;
              } else {
                var $tileIndex$$inline_282$$ = $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ >> 5;
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$J$[$tileIndex$$inline_282$$] = 1;
                $tileIndex$$inline_282$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$F$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$F$ = $tileIndex$$inline_282$$);
                $tileIndex$$inline_282$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$u$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$u$ = $tileIndex$$inline_282$$);
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$i$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$] = $reg$$inline_286_value$$82$$;
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$T$[$reg$$inline_286_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$S$[$reg$$inline_286_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$R$[$reg$$inline_286_value$$82$$]) : 
            ($address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ & 63) >> 1), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ & 
            1 ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$N$[$reg$$inline_286_value$$82$$] : 
            ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$P$[$reg$$inline_286_value$$82$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$O$[$reg$$inline_286_value$$82$$]));
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$a$;
        if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$q$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$q$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ = $reg$$inline_286_value$$82$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ & 16128 | $reg$$inline_286_value$$82$$;
        } else {
          if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$q$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$G$ = $reg$$inline_286_value$$82$$ >> 6 & 3, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ | $reg$$inline_286_value$$82$$ << 8, 0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$G$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$K$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$i$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$j$++ & 
            16383] & 255;
          } else {
            if (2 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$G$) {
              $reg$$inline_286_value$$82$$ &= 15;
              switch($reg$$inline_286_value$$82$$) {
                case 0:
                  0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$k$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$F$ = 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ & 
                  16));
                  break;
                case 1:
                  0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$k$ & 128) && 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$F$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ & 3) !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$[$reg$$inline_286_value$$82$$] & 
                  3) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$r$ = !0);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$Q$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$ & -130) << 7, $address$$inline_281_old$$inline_287_port$$2_temp$$inline_280$$ !== $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$r$ = !0);
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$[$reg$$inline_286_value$$82$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$o$;
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$i$, 0 !== ($reg$$inline_286_value$$82$$ & 128) ? 
          ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$ = $reg$$inline_286_value$$82$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$] = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$] & 1008 | $reg$$inline_286_value$$82$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$] = 
          0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$ || 2 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$ || 4 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$] & 15 | ($reg$$inline_286_value$$82$$ & 63) << 4 : 
          $reg$$inline_286_value$$82$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$g$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$n$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$f$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_289_JSCompiler_StaticMethods_controlWrite$self$$inline_284_JSCompiler_StaticMethods_dataWrite$self$$inline_278_JSCompiler_StaticMethods_out$self$$.$k$ = 
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
  var $toHex$$7$$ = $JSSMS$Utils$$.$toHex$;
  $Bytecode$$1$$.prototype = {get $hexOpcode$() {
    return this.$opcode$.length ? this.$opcode$.map($toHex$$7$$).join(" ") : "";
  }, get label() {
    var $name$$61$$ = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, $toHex$$7$$(this.target || this.$operand$ || 0)) : "";
    return $toHex$$7$$(this.$address$ + 16384 * this.page) + " " + this.$hexOpcode$ + " " + $name$$61$$;
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
    for (var $i$$28$$ = 0;$i$$28$$ < $rom$$1$$.length;$i$$28$$++) {
      this.$a$[$i$$28$$] = [], this.$bytecodes$[$i$$28$$] = [];
    }
  }
  function $disassemble$$($bytecode$$, $stream$$) {
    $stream$$.page = $bytecode$$.page;
    $stream$$.$RomStream_prototype$seek$($bytecode$$.$address$ + 16384 * $stream$$.page);
    var $opcode$$13_opcode$$inline_294_opcode$$inline_298$$ = $stream$$.getUint8(), $operand$$3_operand$$inline_299$$ = null, $target$$48_target$$inline_300$$ = null, $isFunctionEnder_isFunctionEnder$$inline_301$$ = !1, $canEnd_canEnd$$inline_302$$ = !1;
    $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_294_opcode$$inline_298$$);
    switch($opcode$$13_opcode$$inline_294_opcode$$inline_298$$) {
      case 0:
        break;
      case 1:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
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
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 15:
        break;
      case 16:
        $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 17:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 23:
        break;
      case 24:
        $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
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
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 31:
        break;
      case 32:
        $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 33:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
        break;
      case 34:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 39:
        break;
      case 40:
        $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 41:
        break;
      case 42:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 47:
        break;
      case 48:
        $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 49:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
        break;
      case 50:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
        break;
      case 51:
        break;
      case 52:
        break;
      case 53:
        break;
      case 54:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 55:
        break;
      case 56:
        $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ + $stream$$.$RomStream_prototype$getInt8$();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 57:
        break;
      case 58:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
        break;
      case 59:
        break;
      case 60:
        break;
      case 61:
        break;
      case 62:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
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
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
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
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 193:
        break;
      case 194:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 195:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 196:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 197:
        break;
      case 198:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 199:
        $target$$48_target$$inline_300$$ = 0;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 200:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 201:
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 202:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 203:
        return $opcode$$13_opcode$$inline_294_opcode$$inline_298$$ = $stream$$.getUint8(), $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_294_opcode$$inline_298$$), $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$, $bytecode$$;
      case 204:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 205:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 206:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 207:
        $target$$48_target$$inline_300$$ = 8;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 208:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 209:
        break;
      case 210:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 211:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 212:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 213:
        break;
      case 214:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 215:
        $target$$48_target$$inline_300$$ = 16;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 216:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 217:
        break;
      case 218:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 219:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 220:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 221:
        return $getIndex$$($bytecode$$, $stream$$);
      case 222:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 223:
        $target$$48_target$$inline_300$$ = 24;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 224:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 225:
        break;
      case 226:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 227:
        break;
      case 228:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 229:
        break;
      case 230:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 231:
        $target$$48_target$$inline_300$$ = 32;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 232:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 233:
        $stream$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 234:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 235:
        break;
      case 236:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 237:
        $opcode$$13_opcode$$inline_294_opcode$$inline_298$$ = $stream$$.getUint8();
        $target$$48_target$$inline_300$$ = $operand$$3_operand$$inline_299$$ = null;
        $canEnd_canEnd$$inline_302$$ = $isFunctionEnder_isFunctionEnder$$inline_301$$ = !1;
        $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_294_opcode$$inline_298$$);
        switch($opcode$$13_opcode$$inline_294_opcode$$inline_298$$) {
          case 64:
            break;
          case 65:
            break;
          case 66:
            break;
          case 67:
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
            $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
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
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
            break;
          case 111:
            break;
          case 113:
            break;
          case 114:
            break;
          case 115:
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
            break;
          case 120:
            break;
          case 121:
            break;
          case 122:
            break;
          case 123:
            $operand$$3_operand$$inline_299$$ = $stream$$.getUint16();
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
            $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_302$$ = !0;
            break;
          case 177:
            $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_302$$ = !0;
            break;
          case 178:
            $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_302$$ = !0;
            break;
          case 179:
            $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_302$$ = !0;
            break;
          case 184:
            break;
          case 185:
            break;
          case 186:
            $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_302$$ = !0;
            break;
          case 187:
            $target$$48_target$$inline_300$$ = $stream$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_302$$ = !0;
            break;
          default:
            $JSSMS$Utils$$.console.error("Unexpected opcode", "0xED " + $toHex$$8$$($opcode$$13_opcode$$inline_294_opcode$$inline_298$$));
        }
        $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$;
        $bytecode$$.$operand$ = $operand$$3_operand$$inline_299$$;
        $bytecode$$.target = $target$$48_target$$inline_300$$;
        $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_301$$;
        $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_302$$;
        return $bytecode$$;
      case 238:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 239:
        $target$$48_target$$inline_300$$ = 40;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 240:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 241:
        break;
      case 242:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 243:
        break;
      case 244:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 245:
        break;
      case 246:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 247:
        $target$$48_target$$inline_300$$ = 48;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      case 248:
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 249:
        break;
      case 250:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 251:
        break;
      case 252:
        $target$$48_target$$inline_300$$ = $stream$$.getUint16();
        $canEnd_canEnd$$inline_302$$ = !0;
        break;
      case 253:
        return $getIndex$$($bytecode$$, $stream$$);
      case 254:
        $operand$$3_operand$$inline_299$$ = $stream$$.getUint8();
        break;
      case 255:
        $target$$48_target$$inline_300$$ = 56;
        $isFunctionEnder_isFunctionEnder$$inline_301$$ = !0;
        break;
      default:
        $JSSMS$Utils$$.console.error("Unexpected opcode", $toHex$$8$$($opcode$$13_opcode$$inline_294_opcode$$inline_298$$));
    }
    $bytecode$$.$nextAddress$ = $stream$$.$RomStream_prototype$position$;
    $bytecode$$.$operand$ = $operand$$3_operand$$inline_299$$;
    $bytecode$$.target = $target$$48_target$$inline_300$$;
    $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_301$$;
    $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_302$$;
    return $bytecode$$;
  }
  function $getIndex$$($bytecode$$3$$, $stream$$3$$) {
    var $opcode$$16_operand$$inline_306$$ = $stream$$3$$.getUint8(), $opcode$$inline_307_operand$$5$$ = null, $isFunctionEnder$$2$$ = !1;
    $bytecode$$3$$.$opcode$.push($opcode$$16_operand$$inline_306$$);
    switch($opcode$$16_operand$$inline_306$$) {
      case 9:
        break;
      case 25:
        break;
      case 33:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 34:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 41:
        break;
      case 42:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 52:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 53:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 54:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint16();
        break;
      case 57:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
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
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
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
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 111:
        break;
      case 112:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 113:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 114:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 115:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 116:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 117:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 119:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8();
        break;
      case 203:
        return $opcode$$16_operand$$inline_306$$ = $stream$$3$$.getUint8(), $opcode$$inline_307_operand$$5$$ = $stream$$3$$.getUint8(), $bytecode$$3$$.$opcode$.push($opcode$$inline_307_operand$$5$$), $bytecode$$3$$.$nextAddress$ = $stream$$3$$.$RomStream_prototype$position$, $bytecode$$3$$.$operand$ = $opcode$$16_operand$$inline_306$$, $bytecode$$3$$;
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
        $JSSMS$Utils$$.console.error("Unexpected opcode", "0xDD/0xFD " + $toHex$$8$$($opcode$$16_operand$$inline_306$$));
    }
    $bytecode$$3$$.$nextAddress$ = $stream$$3$$.$RomStream_prototype$position$;
    $bytecode$$3$$.$operand$ = $opcode$$inline_307_operand$$5$$;
    $bytecode$$3$$.$isFunctionEnder$ = $isFunctionEnder$$2$$;
    return $bytecode$$3$$;
  }
  function $RomStream$$($rom$$) {
    this.$rom$ = $rom$$;
    this.$a$ = null;
    this.page = 0;
  }
  var $toHex$$8$$ = $JSSMS$Utils$$.$toHex$;
  $parser$$.prototype = {$addEntryPoint$:function $$parser$$$$$addEntryPoint$$($obj$$36$$) {
    this.$entryPoints$.push($obj$$36$$);
    this.$f$($obj$$36$$.$address$);
  }, parse:function $$parser$$$$parse$($currentPage_entryPoint$$2_page$$1$$) {
    $JSSMS$Utils$$.console.time("Parsing");
    var $i$$29_pageStart$$, $length$$18_pageEnd$$;
    void 0 === $currentPage_entryPoint$$2_page$$1$$ ? ($i$$29_pageStart$$ = 0, $length$$18_pageEnd$$ = this.$g$.length - 1) : ($i$$29_pageStart$$ = 0, $length$$18_pageEnd$$ = 16383);
    for ($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$a$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for (;this.$a$[$currentPage_entryPoint$$2_page$$1$$].length;) {
        var $currentAddress$$1_romPage_targetPage$$ = this.$a$[$currentPage_entryPoint$$2_page$$1$$].shift().$address$ % 16384;
        if ($currentAddress$$1_romPage_targetPage$$ < $i$$29_pageStart$$ || $currentAddress$$1_romPage_targetPage$$ > $length$$18_pageEnd$$) {
          $JSSMS$Utils$$.console.error("Address out of bound", $toHex$$8$$($currentAddress$$1_romPage_targetPage$$));
        } else {
          if (!this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$]) {
            var $bytecode$$5_targetAddress$$ = new $Bytecode$$($currentAddress$$1_romPage_targetPage$$, $currentPage_entryPoint$$2_page$$1$$);
            this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$] = $disassemble$$($bytecode$$5_targetAddress$$, this.$g$);
            null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$ >= $i$$29_pageStart$$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$ <= $length$$18_pageEnd$$ && this.$f$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$);
            null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target >= $i$$29_pageStart$$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target <= $length$$18_pageEnd$$ && this.$f$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target);
          }
        }
      }
    }
    this.$bytecodes$[0][1023] ? this.$bytecodes$[0][1023].$isFunctionEnder$ = !0 : this.$bytecodes$[0][1022] && (this.$bytecodes$[0][1022].$isFunctionEnder$ = !0);
    $i$$29_pageStart$$ = $length$$18_pageEnd$$ = $i$$29_pageStart$$ = 0;
    for ($length$$18_pageEnd$$ = this.$entryPoints$.length;$i$$29_pageStart$$ < $length$$18_pageEnd$$;$i$$29_pageStart$$++) {
      $currentPage_entryPoint$$2_page$$1$$ = this.$entryPoints$[$i$$29_pageStart$$].$address$, $currentAddress$$1_romPage_targetPage$$ = this.$entryPoints$[$i$$29_pageStart$$].$romPage$, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$isJumpTarget$ = !0, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$jumpTargetNb$++;
    }
    for ($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$bytecodes$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for ($i$$29_pageStart$$ = 0, $length$$18_pageEnd$$ = this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$].length;$i$$29_pageStart$$ < $length$$18_pageEnd$$;$i$$29_pageStart$$++) {
        this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$] && (null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].$nextAddress$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].$nextAddress$] && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].$nextAddress$].$jumpTargetNb$++, null !== 
        this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target && ($currentAddress$$1_romPage_targetPage$$ = ~~(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target / 16384), $bytecode$$5_targetAddress$$ = this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target % 16384, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$] && this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$bytecode$$5_targetAddress$$] ? 
        (this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$isJumpTarget$ = !0, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$jumpTargetNb$++) : $JSSMS$Utils$$.console.log("Invalid target address", $toHex$$8$$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target))));
      }
    }
    $JSSMS$Utils$$.console.timeEnd("Parsing");
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
  return "number" === typeof $value$$88$$ ? {type:"Literal", value:$value$$88$$, raw:$DEBUG$$ ? $JSSMS$Utils$$.$toHex$($value$$88$$) : "" + $value$$88$$} : {type:"Literal", value:$value$$88$$, raw:"" + $value$$88$$};
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
  return "Literal" === $value$$89$$.type ? [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", $value$$89$$, $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $value$$89$$, $n$Literal$$(255))))] : [$n$VariableDeclaration$$("val", $value$$89$$), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", 
  $n$Identifier$$("val"), $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $n$Identifier$$("val"), $n$Literal$$(255))))];
}, $EX$:function($register1$$1$$, $register2$$1$$) {
  return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$($register1$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$1$$), $n$Register$$($register2$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$1$$), $n$Identifier$$("temp")))];
}, $NOOP$:function() {
  return function() {
  };
}, $LD8$:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function($value$$90$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Literal$$($value$$90$$)));
  } : "i" === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$("i"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), $n$Literal$$(0)))))];
  } : "r" === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$CallExpression$$("JSSMS.Utils.rndInt", $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), 
    $n$Literal$$(0)))))];
  } : void 0 === $dstRegister2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$($dstRegister1$$)));
  } : "n" === $dstRegister1$$ && "n" === $dstRegister2$$ ? function($value$$91$$) {
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
  if ("n" === $dstRegister1$$2$$ && "n" === $dstRegister2$$2$$) {
    return function($value$$94$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $o$$.$READ_MEM16$($n$Literal$$($value$$94$$)));
    };
  }
  $JSSMS$Utils$$.console.error("Wrong parameters number");
}, $LD_WRITE_MEM$:function($srcRegister1$$1$$, $srcRegister2$$1$$, $dstRegister1$$3$$, $dstRegister2$$3$$) {
  return void 0 === $dstRegister1$$3$$ && void 0 === $dstRegister2$$3$$ ? function($value$$95$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$95$$)]));
  } : "n" === $srcRegister1$$1$$ && "n" === $srcRegister2$$1$$ && void 0 === $dstRegister2$$3$$ ? function($value$$96$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Literal$$($value$$96$$), $n$Register$$($dstRegister1$$3$$)]));
  } : "n" === $srcRegister1$$1$$ && "n" === $srcRegister2$$1$$ ? function($value$$97$$) {
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
  } : "s" === $register1$$4$$ && "p" === $register2$$4$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$CallExpression$$("getHL")));
  };
}, $INC16$:function($register1$$5$$, $register2$$5$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register2$$5$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("===", $n$Register$$($register2$$5$$), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register1$$5$$), 
    $n$Literal$$(1)), $n$Literal$$(255))))]))];
  };
}, $DEC8$:function($register1$$6$$, $register2$$6$$) {
  return void 0 === $register2$$6$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$6$$), $n$CallExpression$$("dec8", $n$Register$$($register1$$6$$))));
  } : "s" === $register1$$6$$ && "p" === $register2$$6$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$BinaryExpression$$("-", $n$Identifier$$("sp"), $n$Literal$$(1))));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$CallExpression$$("getHL")));
  };
}, $DEC16$:function($register1$$7$$, $register2$$7$$) {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register2$$7$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("===", $n$Register$$($register2$$7$$), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register1$$7$$), 
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
  } : "a" !== $register1$$13$$ && void 0 === $register2$$13$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Register$$($register1$$13$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  } : "a" === $register1$$13$$ && void 0 === $register2$$13$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))));
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$13$$ + $register2$$13$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  };
}, $XOR$:function($register1$$14$$, $register2$$14$$) {
  return void 0 === $register1$$14$$ && void 0 === $register2$$14$$ ? function($value$$106$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Literal$$($value$$106$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" !== $register1$$14$$ && void 0 === $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Register$$($register1$$14$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" === $register1$$14$$ && void 0 === $register2$$14$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Literal$$(0))))];
  } : function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$14$$ + $register2$$14$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $OR$:function($register1$$15$$, $register2$$15$$) {
  return void 0 === $register1$$15$$ && void 0 === $register2$$15$$ ? function($value$$107$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Literal$$($value$$107$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" !== $register1$$15$$ && void 0 === $register2$$15$$ ? function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Register$$($register1$$15$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" === $register1$$15$$ && void 0 === $register2$$15$$ ? function() {
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
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("b"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$("b"), $n$Literal$$(1)), $n$Literal$$(255)))), $o$$.$JR$($n$BinaryExpression$$("!==", $n$Register$$("b"), $n$Literal$$(0)))(void 0, $target$$56$$)];
  };
}, $JRNZ$:function() {
  return function($value$$111$$, $target$$57$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))))(void 0, $target$$57$$);
  };
}, $JRZ$:function() {
  return function($value$$112$$, $target$$58$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0)))(void 0, $target$$58$$);
  };
}, $JRNC$:function() {
  return function($value$$113$$, $target$$59$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0))))(void 0, $target$$59$$);
  };
}, $JRC$:function() {
  return function($value$$114$$, $target$$60$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0)))(void 0, $target$$60$$);
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
  } : "h" === $operator$$5$$ && "l" === $bitMask$$1$$ ? function() {
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
}, $RLC$:$generateCBFunctions$$("rlc"), $RRC$:$generateCBFunctions$$("rrc"), $RL$:$generateCBFunctions$$("rl"), $RR$:$generateCBFunctions$$("rr"), $SLA$:$generateCBFunctions$$("sla"), $SRA$:$generateCBFunctions$$("sra"), $SLL$:$generateCBFunctions$$("sll"), $SRL$:$generateCBFunctions$$("srl"), $BIT$:function($bit$$1$$, $register1$$21$$, $register2$$21$$) {
  return void 0 === $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $n$Register$$($register1$$21$$), $n$Bit$$($bit$$1$$))));
  } : "h" === $register1$$21$$ && "l" === $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase())), $n$Bit$$($bit$$1$$))));
  } : function($value$$126$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$Literal$$($value$$126$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Bit$$($bit$$1$$))))];
  };
}, $RES$:function($bit$$2$$, $register1$$22$$, $register2$$22$$) {
  return void 0 === $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$($register1$$22$$), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$))));
  } : "h" === $register1$$22$$ && "l" === $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("writeMem", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase())), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))));
  } : function($value$$127$$) {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$Literal$$($value$$127$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$Identifier$$("location"), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$UnaryExpression$$("~", $n$Bit$$($bit$$2$$)))]))];
  };
}, $SET$:function($bit$$3$$, $register1$$23$$, $register2$$23$$) {
  return void 0 === $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$($register1$$23$$), $n$Bit$$($bit$$3$$)));
  } : "h" === $register1$$23$$ && "l" === $register2$$23$$ ? function() {
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
    $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(64))), $n$BinaryExpression$$(">>", 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$Literal$$(32768)), $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))];
  };
}, $SBC16$:function($register1$$38$$, $register2$$38$$) {
  return function() {
    return[void 0 === $register2$$38$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$38$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$38$$), $n$Literal$$(8)), $n$Register$$($register2$$38$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("-", $n$BinaryExpression$$("-", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), 
    $n$Identifier$$("temp")), $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$Literal$$(2)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), 
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
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("port.in_", $n$Register$$("c")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getHL"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))];
  };
}, $OUTI$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))];
  };
}, $OUTD$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
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
    $n$ConditionalExpression$$($n$BinaryExpression$$("===", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))];
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
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))];
  };
}, $CPIR$:function() {
  return function() {
    var $JSCompiler_temp_const$$19$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $JSCompiler_temp_const$$18$$ = $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))])), $JSCompiler_temp_const$$17$$ = $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $JSCompiler_temp_const$$16$$ = $n$ExpressionStatement$$($n$CallExpression$$("incHL")), 
    $JSCompiler_temp_const$$15$$ = $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("===", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4))));
    return[$JSCompiler_temp_const$$19$$, $JSCompiler_temp_const$$18$$, $JSCompiler_temp_const$$17$$, $JSCompiler_temp_const$$16$$, $JSCompiler_temp_const$$15$$, $n$IfStatement$$({type:"LogicalExpression", operator:"&&", left:$n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(4)), $n$Literal$$(0)), right:$n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))}, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", 
    $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp")))), $n$ReturnStatement$$()])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))];
  };
}, $OTIR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")(), $n$ExpressionStatement$$($n$CallExpression$$("incHL")), $n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ReturnStatement$$()]))];
  };
}, $LDDR$:function() {
  return function() {
    return[$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("writeMem", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$CallExpression$$("decBC")), $n$ExpressionStatement$$($n$CallExpression$$("decDE")), $n$ExpressionStatement$$($n$CallExpression$$("decHL")), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), 
    $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))];
  };
}, LD_RLC:$generateIndexCBFunctions$$("rlc"), LD_RRC:$generateIndexCBFunctions$$("rrc"), LD_RL:$generateIndexCBFunctions$$("rl"), LD_RR:$generateIndexCBFunctions$$("rr"), LD_SLA:$generateIndexCBFunctions$$("sla"), LD_SRA:$generateIndexCBFunctions$$("sra"), LD_SLL:$generateIndexCBFunctions$$("sll"), LD_SRL:$generateIndexCBFunctions$$("srl"), $READ_MEM8$:function($value$$155$$) {
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
;var $opcodeTableCB$$ = [], $opcodeTableDDCB$$ = [], $opcodeTableFDCB$$ = [], $regs$$ = {B:["b"], C:["c"], D:["d"], E:["e"], H:["h"], L:["l"], "(HL)":["h", "l"], A:["a"]}, $opcodesList$$ = {$RLC$:"RLC", $RRC$:"RRC", $RL$:"RL", $RR$:"RR", $SLA$:"SLA", $SRA$:"SRA", $SLL$:"SLL", $SRL$:"SRL"}, $op$$ = "", $reg$$ = "";
for ($op$$ in $opcodesList$$) {
  for ($reg$$ in $regs$$) {
    $opcodeTableCB$$.push({name:$opcodesList$$[$op$$] + " " + $reg$$, $ast$:$o$$[$op$$].apply(null, $regs$$[$reg$$])}), "(HL)" !== $reg$$ ? ($opcodeTableDDCB$$.push({name:"LD " + $reg$$ + "," + $opcodesList$$[$op$$] + " (IX)", $ast$:$o$$["LD_" + $opcodesList$$[$op$$]].apply(null, ["ixH", "ixL"].concat($regs$$[$reg$$]))}), $opcodeTableFDCB$$.push({name:"LD " + $reg$$ + "," + $opcodesList$$[$op$$] + " (IY)", $ast$:$o$$["LD_" + $opcodesList$$[$op$$]].apply(null, ["iyH", "iyL"].concat($regs$$[$reg$$]))})) : 
    ($opcodeTableDDCB$$.push({name:$opcodesList$$[$op$$] + " (IX)", $ast$:$o$$["LD_" + $opcodesList$$[$op$$]]("ixH", "ixL")}), $opcodeTableFDCB$$.push({name:$opcodesList$$[$op$$] + " (IY)", $ast$:$o$$["LD_" + $opcodesList$$[$op$$]]("iyH", "iyL")}));
  }
}
var $opcodesList$$ = {$BIT$:"BIT", $RES$:"RES", $SET$:"SET"}, $i$$ = 0, $j$$ = 0;
for ($op$$ in $opcodesList$$) {
  for ($i$$ = 0;8 > $i$$;$i$$++) {
    for ($reg$$ in $regs$$) {
      $opcodeTableCB$$.push({name:$opcodesList$$[$op$$] + " " + $i$$ + "," + $reg$$, $ast$:$o$$[$op$$].apply(null, [$i$$].concat($regs$$[$reg$$]))});
    }
    for ($j$$ = 0;8 > $j$$;$j$$++) {
      $opcodeTableDDCB$$.push({name:$opcodesList$$[$op$$] + " " + $i$$ + " (IX)", $ast$:$o$$[$op$$].apply(null, [$i$$].concat(["ixH", "ixL"]))}), $opcodeTableFDCB$$.push({name:$opcodesList$$[$op$$] + " " + $i$$ + " (IY)", $ast$:$o$$[$op$$].apply(null, [$i$$].concat(["iyH", "iyL"]))});
    }
  }
}
;function $generateIndexTable$$($index$$52$$) {
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
  $index$$52$$ + "+d)", $ast$:$o$$.$CP_X$($registerH$$, $register_registerL$$)}, 203:"IX" === $index$$52$$ ? $opcodeTableDDCB$$ : $opcodeTableFDCB$$, 225:{name:"POP " + $index$$52$$, $ast$:$o$$.$POP$($registerH$$, $register_registerL$$)}, 227:{name:"EX SP,(" + $index$$52$$ + ")", $ast$:$o$$.$EX_SP_X$($registerH$$, $register_registerL$$)}, 229:{name:"PUSH " + $index$$52$$, $ast$:$o$$.$PUSH$($registerH$$, $register_registerL$$)}, 233:{name:"JP (" + $index$$52$$ + ")", $ast$:$o$$.$JP_X$($registerH$$, 
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
    var $i$$31$$ = 0;
    this.$bytecodes$ = $bytecodes$$;
    this.$ast$ = Array(this.$bytecodes$.length);
    $JSSMS$Utils$$.console.time("Analyzing");
    for ($i$$31$$ = 0;$i$$31$$ < this.$bytecodes$.length;$i$$31$$++) {
      this.$a$($i$$31$$), this.$f$($i$$31$$);
    }
    $JSSMS$Utils$$.console.timeEnd("Analyzing");
    for ($i$$31$$ in this.$missingOpcodes$) {
      console.error("Missing opcode", $i$$31$$, this.$missingOpcodes$[$i$$31$$]);
    }
  }, $analyzeFromAddress$:function $$Analyzer$$1$$$$$analyzeFromAddress$$($bytecodes$$1$$) {
    this.$bytecodes$ = [$bytecodes$$1$$];
    this.$ast$ = [];
    this.$missingOpcodes$ = {};
    this.$a$(0);
    this.$bytecodes$[0][this.$bytecodes$[0].length - 1].$isFunctionEnder$ = !0;
    this.$ast$ = [this.$bytecodes$];
    for (var $i$$32$$ in this.$missingOpcodes$) {
      console.error("Missing opcode", $i$$32$$, this.$missingOpcodes$[$i$$32$$]);
    }
  }, $a$:function $$Analyzer$$1$$$$$a$$($page$$5$$) {
    var $self$$4$$ = this;
    this.$bytecodes$[$page$$5$$] = this.$bytecodes$[$page$$5$$].map(function($bytecode$$7$$) {
      var $i$$33_opcode$$18$$;
      switch($bytecode$$7$$.$opcode$.length) {
        case 1:
          $i$$33_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]];
          break;
        case 2:
          $i$$33_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]][$bytecode$$7$$.$opcode$[1]];
          break;
        case 3:
          $i$$33_opcode$$18$$ = $opcodeTable$$[$bytecode$$7$$.$opcode$[0]][$bytecode$$7$$.$opcode$[1]][$bytecode$$7$$.$opcode$[2]];
          break;
        default:
          $JSSMS$Utils$$.console.error("Something went wrong in parsing. Opcode: [" + $bytecode$$7$$.$hexOpcode$ + "]");
      }
      if ($i$$33_opcode$$18$$ && $i$$33_opcode$$18$$.$ast$) {
        var $ast$$ = $i$$33_opcode$$18$$.$ast$($bytecode$$7$$.$operand$, $bytecode$$7$$.target, $bytecode$$7$$.$nextAddress$);
        Array.isArray($ast$$) || void 0 === $ast$$ || ($ast$$ = [$ast$$]);
        $bytecode$$7$$.$ast$ = $ast$$;
        $DEBUG$$ && ($bytecode$$7$$.name = $i$$33_opcode$$18$$.name, $i$$33_opcode$$18$$.$opcode$ && ($bytecode$$7$$.$opcode$ = $i$$33_opcode$$18$$.$opcode$($bytecode$$7$$.$operand$, $bytecode$$7$$.target, $bytecode$$7$$.$nextAddress$)));
      } else {
        $i$$33_opcode$$18$$ = $bytecode$$7$$.$hexOpcode$, $self$$4$$.$missingOpcodes$[$i$$33_opcode$$18$$] = void 0 !== $self$$4$$.$missingOpcodes$[$i$$33_opcode$$18$$] ? $self$$4$$.$missingOpcodes$[$i$$33_opcode$$18$$] + 1 : 1;
      }
      return $bytecode$$7$$;
    });
  }, $f$:function $$Analyzer$$1$$$$$f$$($page$$6$$) {
    this.$ast$[$page$$6$$] = [];
    var $self$$5$$ = this, $pointer$$ = -1, $startNewFunction$$ = !0, $prevBytecode$$ = {};
    this.$bytecodes$[$page$$6$$].forEach(function($bytecode$$8$$) {
      if ($bytecode$$8$$.$isJumpTarget$ || $startNewFunction$$) {
        $pointer$$++, $self$$5$$.$ast$[$page$$6$$][$pointer$$] = [], $startNewFunction$$ = !1, $prevBytecode$$.$isFunctionEnder$ = !0;
      }
      $self$$5$$.$ast$[$page$$6$$][$pointer$$].push($bytecode$$8$$);
      $bytecode$$8$$.$isFunctionEnder$ && ($startNewFunction$$ = !0);
      $prevBytecode$$ = $bytecode$$8$$;
    });
  }};
  return $Analyzer$$1$$;
}();
var $Optimizer$$ = function() {
  function $Optimizer$$1$$($main$$) {
    this.$main$ = $main$$;
    this.$ast$ = [];
  }
  $Optimizer$$1$$.prototype = {$optimize$:function $$Optimizer$$1$$$$$optimize$$($functions_i$$34$$) {
    this.$ast$ = $functions_i$$34$$;
    for ($functions_i$$34$$ = 0;$functions_i$$34$$ < this.$ast$.length;$functions_i$$34$$++) {
      this.$i$($functions_i$$34$$);
    }
  }, $i$:function $$Optimizer$$1$$$$$i$$($page$$7$$) {
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$j$.bind(this));
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$a$);
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$g$);
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$f$.bind(this));
  }, $a$:function $$Optimizer$$1$$$$$a$$($fn$$5$$) {
    return $fn$$5$$.map(function($bytecodes$$2$$) {
      var $ast$$1$$ = $bytecodes$$2$$.$ast$;
      if (!$ast$$1$$) {
        return $bytecodes$$2$$;
      }
      $bytecodes$$2$$.$ast$ = $JSSMS$Utils$$.$traverse$($ast$$1$$, function($ast$$2$$) {
        if ("BinaryExpression" === $ast$$2$$.type && "Literal" === $ast$$2$$.left.type && "Literal" === $ast$$2$$.right.type) {
          var $value$$159$$ = 0;
          switch($ast$$2$$.operator) {
            case ">>":
              $value$$159$$ = $ast$$2$$.left.value >> $ast$$2$$.right.value;
              break;
            case "&":
              $value$$159$$ = $ast$$2$$.left.value & $ast$$2$$.right.value;
              break;
            default:
              return $JSSMS$Utils$$.console.log("Unimplemented evaluation optimization for operator", $ast$$2$$.operator), $ast$$2$$;
          }
          $ast$$2$$.type = "Literal";
          $ast$$2$$.value = $value$$159$$;
          $ast$$2$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$($value$$159$$) : "" + $value$$159$$;
          delete $ast$$2$$.right;
          delete $ast$$2$$.left;
        }
        return $ast$$2$$;
      });
      return $bytecodes$$2$$;
    });
  }, $f$:function $$Optimizer$$1$$$$$f$$($fn$$6$$) {
    var $self$$6$$ = this;
    return $fn$$6$$.map(function($bytecodes$$3$$) {
      var $ast$$3$$ = $bytecodes$$3$$.$ast$;
      if (!$ast$$3$$) {
        return $bytecodes$$3$$;
      }
      $bytecodes$$3$$.$ast$ = $JSSMS$Utils$$.$traverse$($ast$$3$$, function($ast$$4$$) {
        if ("MemberExpression" === $ast$$4$$.type && "SZP_TABLE" === $ast$$4$$.object.name && "Literal" === $ast$$4$$.property.type) {
          var $value$$160$$ = $self$$6$$.$main$.$cpu$.$SZP_TABLE$[$ast$$4$$.property.value];
          $ast$$4$$.type = "Literal";
          $ast$$4$$.value = $value$$160$$;
          $ast$$4$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$($value$$160$$) : "" + $value$$160$$;
          delete $ast$$4$$.computed;
          delete $ast$$4$$.object;
          delete $ast$$4$$.property;
        }
        return $ast$$4$$;
      });
      return $bytecodes$$3$$;
    });
  }, $g$:function $$Optimizer$$1$$$$$g$$($fn$$7$$) {
    var $definedReg$$ = {$b$:!1, $c$:!1, $d$:!1, $e$:!1, $h$:!1, $l$:!1}, $definedRegValue$$ = {$b$:{}, $c$:{}, $d$:{}, $e$:{}, $h$:{}, $l$:{}};
    return $fn$$7$$.map(function($bytecodes$$4$$) {
      var $ast$$5$$ = $bytecodes$$4$$.$ast$;
      if (!$ast$$5$$) {
        return $bytecodes$$4$$;
      }
      $bytecodes$$4$$.$ast$ = $JSSMS$Utils$$.$traverse$($ast$$5$$, function($ast$$6$$) {
        "AssignmentExpression" === $ast$$6$$.type && "=" === $ast$$6$$.operator && "Register" === $ast$$6$$.left.type && "Literal" === $ast$$6$$.right.type && "a" !== $ast$$6$$.left.name && "f" !== $ast$$6$$.left.name && ($definedReg$$[$ast$$6$$.left.name] = !0, $definedRegValue$$[$ast$$6$$.left.name] = $ast$$6$$.right);
        if ("AssignmentExpression" === $ast$$6$$.type && "Register" === $ast$$6$$.left.type && "Literal" !== $ast$$6$$.right.type && "a" !== $ast$$6$$.left.name && "f" !== $ast$$6$$.left.name) {
          return $definedReg$$[$ast$$6$$.left.name] = !1, $definedRegValue$$[$ast$$6$$.left.name] = {}, $ast$$6$$;
        }
        if ("CallExpression" === $ast$$6$$.type) {
          return $ast$$6$$.arguments[0] && "Register" === $ast$$6$$.arguments[0].type && $definedReg$$[$ast$$6$$.arguments[0].name] && "a" !== $ast$$6$$.arguments[0].name && "f" !== $ast$$6$$.arguments[0].name && ($ast$$6$$.arguments[0] = $definedRegValue$$[$ast$$6$$.arguments[0].name]), $ast$$6$$.arguments[1] && "Register" === $ast$$6$$.arguments[1].type && $definedReg$$[$ast$$6$$.arguments[1].name] && "a" !== $ast$$6$$.arguments[1].name && "f" !== $ast$$6$$.arguments[1].name && ($ast$$6$$.arguments[1] = 
          $definedRegValue$$[$ast$$6$$.arguments[1].name]), $ast$$6$$;
        }
        if ("MemberExpression" === $ast$$6$$.type && "Register" === $ast$$6$$.property.type && $definedReg$$[$ast$$6$$.property.name] && "a" !== $ast$$6$$.property.name && "f" !== $ast$$6$$.property.name) {
          return $ast$$6$$.property = $definedRegValue$$[$ast$$6$$.property.name], $ast$$6$$;
        }
        "BinaryExpression" === $ast$$6$$.type && ("Register" === $ast$$6$$.right.type && $definedReg$$[$ast$$6$$.right.name] && "a" !== $ast$$6$$.right.name && "f" !== $ast$$6$$.right.name && ($ast$$6$$.right = $definedRegValue$$[$ast$$6$$.right.name]), "Register" === $ast$$6$$.left.type && $definedReg$$[$ast$$6$$.left.name] && "a" !== $ast$$6$$.left.name && "f" !== $ast$$6$$.left.name && ($ast$$6$$.left = $definedRegValue$$[$ast$$6$$.left.name]));
        return $ast$$6$$;
      });
      return $bytecodes$$4$$;
    });
  }, $j$:function $$Optimizer$$1$$$$$j$$($fn$$8$$) {
    var $self$$7$$ = this;
    return $fn$$8$$.map(function($bytecodes$$5$$) {
      var $ast$$7$$ = $bytecodes$$5$$.$ast$;
      if (!$ast$$7$$) {
        return $bytecodes$$5$$;
      }
      $bytecodes$$5$$.$ast$ = $JSSMS$Utils$$.$traverse$($ast$$7$$, function($ast$$8$$) {
        if ("CallExpression" === $ast$$8$$.type) {
          if ("port.out" === $ast$$8$$.callee.name) {
            var $port$$4_value$$161$$ = $ast$$8$$.arguments[1];
            switch($ast$$8$$.arguments[0].value & 193) {
              case 128:
                $ast$$8$$.callee.name = "vdp.dataWrite";
                $ast$$8$$.arguments = [$port$$4_value$$161$$];
                break;
              case 129:
                $ast$$8$$.callee.name = "vdp.controlWrite";
                $ast$$8$$.arguments = [$port$$4_value$$161$$];
                break;
              case 64:
              ;
              case 65:
                $self$$7$$.$main$.$soundEnabled$ && ($ast$$8$$.callee.name = "psg.write", $ast$$8$$.arguments = [$port$$4_value$$161$$]);
            }
          } else {
            if ("port.in_" === $ast$$8$$.callee.name) {
              $port$$4_value$$161$$ = $ast$$8$$.arguments[0].value;
              if ($self$$7$$.$main$.$is_gg$ && 7 > $port$$4_value$$161$$) {
                switch($port$$4_value$$161$$) {
                  case 0:
                    return $ast$$8$$.type = "BinaryExpression", $ast$$8$$.operator = "|", $ast$$8$$.left = $n$BinaryExpression$$("&", $n$Identifier$$("port.keyboard.ggstart"), $n$Literal$$(191)), $ast$$8$$.right = $n$Identifier$$("port.europe"), delete $ast$$8$$.callee, delete $ast$$8$$.arguments, $ast$$8$$;
                  case 1:
                  ;
                  case 2:
                  ;
                  case 3:
                  ;
                  case 4:
                  ;
                  case 5:
                    return $ast$$8$$.type = "Literal", $ast$$8$$.value = 0, $ast$$8$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$(0) : "0", delete $ast$$8$$.callee, delete $ast$$8$$.arguments, $ast$$8$$;
                  case 6:
                    return $ast$$8$$.type = "Literal", $ast$$8$$.value = 255, $ast$$8$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$(255) : "255", delete $ast$$8$$.callee, delete $ast$$8$$.arguments, $ast$$8$$;
                }
              }
              switch($port$$4_value$$161$$ & 193) {
                case 64:
                  return $ast$$8$$.callee.name = "vdp.getVCount", $ast$$8$$.arguments = [], $ast$$8$$;
                case 65:
                  return $ast$$8$$.type = "Identifier", $ast$$8$$.name = "port.hCounter", delete $ast$$8$$.callee, delete $ast$$8$$.arguments, $ast$$8$$;
                case 128:
                  return $ast$$8$$.callee.name = "vdp.dataRead", $ast$$8$$.arguments = [], $ast$$8$$;
                case 129:
                  return $ast$$8$$.callee.name = "vdp.controlRead", $ast$$8$$.arguments = [], $ast$$8$$;
                case 192:
                  return $ast$$8$$.type = "Identifier", $ast$$8$$.name = "main.keyboard.controller1", delete $ast$$8$$.callee, delete $ast$$8$$.arguments, $ast$$8$$;
                case 193:
                  return $ast$$8$$.type = "BinaryExpression", $ast$$8$$.operator = "|", $ast$$8$$.left = $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Identifier$$("main.keyboard.controller2"), $n$Literal$$(63)), $n$MemberExpression$$($n$Identifier$$("port.ioPorts"), $n$Literal$$(0))), $ast$$8$$.right = $n$MemberExpression$$($n$Identifier$$("port.ioPorts"), $n$Literal$$(1)), delete $ast$$8$$.callee, delete $ast$$8$$.arguments, $ast$$8$$;
              }
              $ast$$8$$.type = "Literal";
              $ast$$8$$.value = 255;
              $ast$$8$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$(255) : "255";
              delete $ast$$8$$.callee;
              delete $ast$$8$$.arguments;
            }
          }
        }
        return $ast$$8$$;
      });
      return $bytecodes$$5$$;
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
        return 2 === $opcodes$$1$$.length ? $OP_DD_STATES$$[$opcodes$$1$$[1]] : $OP_INDEX_CB_STATES$$[$opcodes$$1$$[2]];
      case 237:
        return $OP_ED_STATES$$[$opcodes$$1$$[1]];
      default:
        return $OP_STATES$$[$opcodes$$1$$[0]];
    }
  }
  function $convertRegisters$$($ast$$9$$) {
    return $JSSMS$Utils$$.$traverse$($ast$$9$$, function($node$$4$$) {
      "Register" === $node$$4$$.type && ($node$$4$$.type = "Identifier");
      return $node$$4$$;
    });
  }
  var $toHex$$9$$ = $JSSMS$Utils$$.$toHex$, $whitelist$$ = "page temp location val value JSSMS.Utils.rndInt".split(" ");
  $Generator$$1$$.prototype = {$generate$:function $$Generator$$1$$$$$generate$$($functions$$1$$) {
    for (var $page$$8$$ = 0;$page$$8$$ < $functions$$1$$.length;$page$$8$$++) {
      $functions$$1$$[$page$$8$$] = $functions$$1$$[$page$$8$$].map(function($fn$$9$$) {
        var $body$$2$$ = [{type:"ExpressionStatement", expression:{type:"Literal", value:"use strict", raw:'"use strict"'}}], $name$$65$$ = $fn$$9$$[0].$address$, $tstates$$2$$ = 0;
        $fn$$9$$ = $fn$$9$$.map(function($bytecode$$9$$) {
          void 0 === $bytecode$$9$$.$ast$ && ($bytecode$$9$$.$ast$ = []);
          $tstates$$2$$ += $getTotalTStates$$1$$($bytecode$$9$$.$opcode$);
          var $decreaseTStateStmt_nextAddress$$44_updatePcStmt$$ = [{type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"-=", left:{type:"Identifier", name:"tstates"}, right:{type:"Literal", value:$tstates$$2$$, raw:$DEBUG$$ ? $toHex$$9$$($tstates$$2$$) : "" + $tstates$$2$$}}}];
          $tstates$$2$$ = 0;
          $bytecode$$9$$.$ast$ = [].concat($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$, $bytecode$$9$$.$ast$);
          $bytecode$$9$$.$isFunctionEnder$ && null !== $bytecode$$9$$.$nextAddress$ && ($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$ = $bytecode$$9$$.$nextAddress$ % 16384, $decreaseTStateStmt_nextAddress$$44_updatePcStmt$$ = {type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"=", left:{type:"Identifier", name:"pc"}, right:{type:"BinaryExpression", operator:"+", left:{type:"Literal", value:$decreaseTStateStmt_nextAddress$$44_updatePcStmt$$, raw:$DEBUG$$ ? $toHex$$9$$($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$) : 
          "" + $decreaseTStateStmt_nextAddress$$44_updatePcStmt$$}, right:{type:"BinaryExpression", operator:"*", left:{type:"Identifier", name:"page"}, right:{type:"Literal", value:16384, raw:"0x4000"}}}}}, $bytecode$$9$$.$ast$.push($decreaseTStateStmt_nextAddress$$44_updatePcStmt$$));
          $DEBUG$$ && $bytecode$$9$$.$ast$[0] && ($bytecode$$9$$.$ast$[0].$leadingComments$ = [{type:"Line", value:" " + $bytecode$$9$$.label}]);
          return $bytecode$$9$$.$ast$;
        });
        $fn$$9$$.forEach(function($ast$$10$$) {
          $body$$2$$ = $body$$2$$.concat($ast$$10$$);
        });
        $body$$2$$ = $convertRegisters$$($body$$2$$);
        $body$$2$$ = $JSSMS$Utils$$.$traverse$($body$$2$$, function($obj$$38$$) {
          $obj$$38$$.type && "Identifier" === $obj$$38$$.type && -1 === $whitelist$$.indexOf($obj$$38$$.name) && ($obj$$38$$.name = "this." + $obj$$38$$.name);
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
    this.$optimizer$ = new $Optimizer$$($cpu$$.$main$);
    this.$generator$ = new $Generator$$;
    this.$bytecodes$ = {};
  }
  var $toHex$$10$$ = $JSSMS$Utils$$.$toHex$;
  $Recompiler$$1$$.prototype = {$g$:function $$Recompiler$$1$$$$$g$$($rom$$2$$) {
    this.$rom$ = $rom$$2$$;
    this.$parser$ = new $Parser$$($rom$$2$$, this.$cpu$.$frameReg$);
  }, reset:function $$Recompiler$$1$$$$reset$() {
    var $self$$8$$ = this;
    this.options.$entryPoints$ = [{$address$:0, $romPage$:0, $memPage$:0}, {$address$:56, $romPage$:0, $memPage$:0}, {$address$:102, $romPage$:0, $memPage$:0}];
    2 >= this.$rom$.length ? $JSSMS$Utils$$.console.log("Parsing full ROM") : (this.options.$pageLimit$ = 0, $JSSMS$Utils$$.console.log("Parsing initial memory page of ROM"));
    for (var $fns$$ = this.parse().$analyze$().$optimize$().$generate$(), $page$$9$$ = 0;$page$$9$$ < this.$rom$.length;$page$$9$$++) {
      $fns$$[$page$$9$$].forEach(function($fn$$10$$) {
        var $funcName$$ = $fn$$10$$.body[0].id.name;
        $DEBUG$$ && ($fn$$10$$.body[0].id.name = "_" + $toHex$$10$$($funcName$$));
        $self$$8$$.$cpu$.$branches$[$page$$9$$][$funcName$$] = (new Function("return " + $self$$8$$.$f$($fn$$10$$)))();
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
    this.$parseFromAddress$($address$$24$$, $romPage$$3$$, $memPage$$1$$).$analyzeFromAddress$().$optimize$().$generate$()[0].forEach(function($fn$$11$$) {
      $DEBUG$$ && ($fn$$11$$.body[0].id.name = "_" + $toHex$$10$$($fn$$11$$.body[0].id.name));
      $self$$10$$.$cpu$.$branches$[$romPage$$3$$][$address$$24$$ % 16384] = (new Function("return " + $self$$10$$.$f$($fn$$11$$)))();
    });
  }, $parseFromAddress$:function $$Recompiler$$1$$$$$parseFromAddress$$($address$$25_obj$$39$$, $romPage$$4$$, $memPage$$2$$) {
    $address$$25_obj$$39$$ = {$address$:$address$$25_obj$$39$$, $romPage$:$romPage$$4$$, $memPage$:$memPage$$2$$};
    this.$parser$.$entryPoints$.push($address$$25_obj$$39$$);
    this.$bytecodes$ = this.$parser$.$parseFromAddress$($address$$25_obj$$39$$);
    return this;
  }, $analyzeFromAddress$:function $$Recompiler$$1$$$$$analyzeFromAddress$$() {
    this.$analyzer$.$analyzeFromAddress$(this.$bytecodes$);
    return this;
  }, $f$:function $$Recompiler$$1$$$$$f$$($fn$$12$$) {
    return window.escodegen.generate($fn$$12$$, {$comment$:!0, $renumber$:!0, $hexadecimal$:!0, parse:$DEBUG$$ ? window.esprima.parse : function($c$$2$$) {
      return{type:"Program", body:[{type:"ExpressionStatement", expression:{type:"Literal", value:$c$$2$$, raw:$c$$2$$}}]};
    }});
  }};
  return $Recompiler$$1$$;
}();
$JSSMS$$.prototype.readRomDirectly = $JSSMS$$.prototype.$readRomDirectly$;
$JSSMS$$.prototype.start = $JSSMS$$.prototype.$JSSMS_prototype$start$;
$JSSMS$$.prototype.stop = $JSSMS$$.prototype.$JSSMS_prototype$stop$;
$JSSMS$$.Utils = $JSSMS$Utils$$;
$JSSMS$$.Utils.getFileExtension = $JSSMS$Utils$$.$getFileExtension$;
$JSSMS$$.Utils.crc32 = $JSSMS$Utils$$.$crc32$;
$JSSMS$$.NodeUI = $JSSMS$NodeUI$$;
$JSSMS$$.NodeUI.prototype.writeGraphViz = $JSSMS$NodeUI$$.prototype.$a$;
$JSSMS$$.NodeUI.prototype.writeJavaScript = $JSSMS$NodeUI$$.prototype.$f$;
module.exports = $JSSMS$$;
})(global);
