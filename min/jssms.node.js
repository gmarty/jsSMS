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
  this.$i$ = {ui:$JSSMS$DummyUI$$};
  if (void 0 !== $opts$$) {
    for (var $key$$20$$ in this.$i$) {
      void 0 !== $opts$$[$key$$20$$] && (this.$i$[$key$$20$$] = $opts$$[$key$$20$$]);
    }
  }
  void 0 !== $opts$$.DEBUG && ($DEBUG$$ = $opts$$.DEBUG);
  void 0 !== $opts$$.ENABLE_COMPILER && ($ENABLE_COMPILER$$ = $opts$$.ENABLE_COMPILER);
  this.$j$ = new $JSSMS$Keyboard$$(this);
  this.$f$ = new this.$i$.ui(this);
  this.$a$ = new $JSSMS$Vdp$$(this);
  this.$g$ = new $JSSMS$SN76489$$(this);
  this.$m$ = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$soundEnabled$ && (this.$audioContext$ = new (window.AudioContext || window.webkitAudioContext), this.$audioBuffer$ = this.$audioContext$.createBuffer(1, 1, 44100));
  this.ui = this.$f$;
}
$JSSMS$$.prototype = {$isRunning$:!1, $cyclesPerLine$:0, $no_of_scanlines$:0, $frameSkip$:0, $fps$:0, $frameskip_counter$:0, $pause_button$:!1, $is_sms$:!0, $is_gg$:!1, $soundEnabled$:!0, $audioContext$:null, $audioBuffer$:null, $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $emuWidth$:0, $emuHeight$:0, $fpsFrameCount$:0, $frameCount$:0, $romData$:"", $romFileName$:"", lineno:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$ = this.$a$.$T$, $clockSpeedHz$$inline_15_v$$inline_17$$;
  0 === $JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $clockSpeedHz$$inline_15_v$$inline_17$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $clockSpeedHz$$inline_15_v$$inline_17$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($clockSpeedHz$$inline_15_v$$inline_17$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$a$.$T$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$;
  if (this.$soundEnabled$ && (this.$g$.$w$($clockSpeedHz$$inline_15_v$$inline_17$$), this.$samplesPerFrame$ = Math.round(44100 / this.$fps$), this.$audioBuffer$.length !== this.$samplesPerFrame$ && (this.$audioBuffer$ = this.$audioContext$.createBuffer(1, this.$samplesPerFrame$, 44100)), 0 === this.$samplesPerLine$.length || this.$samplesPerLine$.length !== this.$no_of_scanlines$)) {
    this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
    for (var $fractional$$inline_18$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$++) {
      $clockSpeedHz$$inline_15_v$$inline_17$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_18$$, $fractional$$inline_18$$ = $clockSpeedHz$$inline_15_v$$inline_17$$ - ($clockSpeedHz$$inline_15_v$$inline_17$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$] = $clockSpeedHz$$inline_15_v$$inline_17$$ >> 16;
    }
  }
  this.$frameCount$ = 0;
  this.$frameskip_counter$ = this.$frameSkip$;
  this.$j$.reset();
  this.$f$.reset();
  this.$a$.reset();
  this.$m$.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$ = this.$cpu$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$.$F$ = [];
  $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_resetDebug$self$$inline_20_i$$inline_16_mode$$inline_14$$);
  $DEBUG$$ && clearInterval(this.$o$);
}, $JSSMS_prototype$start$:function $$JSSMS$$$$$JSSMS_prototype$start$$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = !0, this.$f$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$f$.screen), $DEBUG$$ && (this.$s$ = $JSSMS$Utils$$.$getTimestamp$(), this.$fpsFrameCount$ = 0, this.$o$ = setInterval(function() {
    var $now$$inline_25$$ = $JSSMS$Utils$$.$getTimestamp$();
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$s$ = $now$$inline_25$$;
  }, 500)));
}, $JSSMS_prototype$stop$:function $$JSSMS$$$$$JSSMS_prototype$stop$$() {
  $DEBUG$$ && clearInterval(this.$o$);
  this.$isRunning$ = !1;
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  if (this.$isRunning$) {
    var $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$ = this.$cpu$;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.lineno = 0;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$j$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$main$.$cyclesPerLine$;
    for ($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$I$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$);;) {
      if ($ENABLE_COMPILER$$) {
        var $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$;
        if (1024 > $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$) {
          $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$branches$[0]["_" + $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$] || $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$X$.$g$($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$, 
          0, 0), $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$branches$[0]["_" + $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$].call($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$, 
          0);
        } else {
          if (49152 > $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$) {
            var $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$ % 16384, $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = 
            Math.floor($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$ / 16384);
            $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$frameReg$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$]]["_" + 
            $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$] || $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$X$.$g$($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$f$, 
            $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$frameReg$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$], $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$);
            $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$branches$[$JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$frameReg$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$]]["_" + 
            $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$].call($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$, $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$);
          } else {
            $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$);
          }
        }
      } else {
        $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$);
      }
      if ($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$j$) {
        $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$;
        if ($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$main$.$soundEnabled$) {
          $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$main$;
          $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno;
          0 === $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$audioBufferOffset$ = 0);
          for (var $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$samplesPerLine$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$], 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$, $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = 
          $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$audioBufferOffset$, $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ = $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$, 
          $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$audioBuffer$.getChannelData(0), $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = 0, $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$;$row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ < 
          $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$;$row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$++) {
            for ($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = 0;3 > $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$;$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$++) {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$u$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$o$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] !== 
              $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$f$[($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$o$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] >> 
              8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$f$[($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$]
              ;
            }
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$u$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$f$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$m$ & 
            1) << 1;
            $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$u$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$u$[1] + 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$u$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$u$[3];
            $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ /= 128;
            1 < $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ ? $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = 1 : -1 > $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ && ($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = -1);
            $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ + $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$] = $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$j$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$v$;
            var $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$j$ >> 8, $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ = $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ << 
            8;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$j$ -= $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[0] -= $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[1] -= $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[2] -= $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[3] = 128 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$s$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[2] : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[3] - $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$;
            for ($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = 0;3 > $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$;$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$++) {
              var $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$];
              if (0 >= $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$) {
                var $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$f$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ << 1];
                6 < $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$o$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] = ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ - 
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$j$ + 512 * $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] / 
                ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$j$), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] = 
                -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] = 
                1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$o$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] = $NO_ANTIALIAS$$);
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] += $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ * ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ / 
                $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ + 1);
              } else {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$o$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$] = $NO_ANTIALIAS$$;
              }
            }
            0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[3], 
            128 !== $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$s$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$s$ * 
            ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$s$ + 1)), 1 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$i$[3] && 
            ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$m$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$m$ >> 1 | (0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$f$[6] & 
            4) ? 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$m$ & 9) && 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$m$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$.$m$ & 
            1) << 15));
          }
          $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$audioBufferOffset$ += $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$;
        }
        $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$Y$.$G$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno;
        if (192 > $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno && ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$Y$, 
        $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno, !$JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$main$.$is_gg$ || 
        !(24 > $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ || 168 <= $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$))) {
          if (0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[1] & 64)) {
            if (-1 !== $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$J$) {
              for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$N$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ <= 
              $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$J$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$++) {
                if ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$R$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$]) {
                  for ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$R$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$] = 0, $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$P$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$], $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ = 
                  0, $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ << 5, $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = 0;8 > $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$;$row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$++) {
                    for ($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$++], $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$++], $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$++], 
                    $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$++], $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ = 
                    128;0 !== $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$;$bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ >>= 1) {
                      var $colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ = 0;
                      0 !== ($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ & $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$) && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ |= 1);
                      0 !== ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ & $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$) && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ |= 2);
                      0 !== ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$) && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ |= 4);
                      0 !== ($address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ & $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$) && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ |= 8);
                      $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$[$count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$++] = $colour$$inline_357_pixY$$inline_374_temp$$inline_385$$;
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$N$ = 512;
              $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$J$ = -1;
            }
            var $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$, $colour$$inline_359_offset$$inline_399$$, $temp$$inline_360$$, $temp2$$inline_361$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[8], 
            $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[9];
            16 > $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[0] & 64) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = 
            0);
            $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[0] & 128;
            $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ = 32 - ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$;
            $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ = $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ + $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ >> 3;
            27 < $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ && ($address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ -= 28);
            $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = ($frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ + ($row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ & 7) & 7) << 3;
            $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ << 8;
            for ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$;$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$v$;$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$++) {
              $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$X$ + (($count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ & 31) << 1) + ($address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ << 
              6);
              var $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 1], $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ = 
              ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & 8) << 1, $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ = ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ << 3) + ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ & 
              7), $colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ = 0 === ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & 4) ? $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ : 56 - $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$, $tile$$inline_375$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$P$[($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$] & 
              255) + (($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & 1) << 8)];
              if ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & 2) {
                for ($pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ = 7;0 <= $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ && 256 > $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$;$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$--, $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$++) {
                  $colour$$inline_359_offset$$inline_399$$ = $tile$$inline_375$$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + $colour$$inline_357_pixY$$inline_374_temp$$inline_385$$], $temp$$inline_360$$ = 4 * ($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ + $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$), $temp2$$inline_361$$ = 3 * ($colour$$inline_359_offset$$inline_399$$ + 
                  $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$), $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$K$[$bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$] = 0 !== ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & 
                  16) && 0 !== $colour$$inline_359_offset$$inline_399$$, $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$ && $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$v$ && 
                  ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$temp$$inline_360$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$temp2$$inline_361$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$temp$$inline_360$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$temp2$$inline_361$$ + 
                  1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$temp$$inline_360$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$temp2$$inline_361$$ + 
                  2]);
                }
              } else {
                for ($pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ = 0;8 > $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ && 256 > $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$;$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$++, $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$++) {
                  $colour$$inline_359_offset$$inline_399$$ = $tile$$inline_375$$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + $colour$$inline_357_pixY$$inline_374_temp$$inline_385$$], $temp$$inline_360$$ = 4 * ($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ + $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$), $temp2$$inline_361$$ = 3 * ($colour$$inline_359_offset$$inline_399$$ + 
                  $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$), $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$K$[$bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$] = 0 !== ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ & 
                  16) && 0 !== $colour$$inline_359_offset$$inline_399$$, $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$ && $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$v$ && 
                  ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$temp$$inline_360$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$temp2$$inline_361$$], 
                  $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$temp$$inline_360$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$temp2$$inline_361$$ + 
                  1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$temp$$inline_360$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$temp2$$inline_361$$ + 
                  2]);
                }
              }
              $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$++;
              0 !== $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ && 23 === $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ && ($address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ = $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ >> 
              3, $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = ($frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ & 7) << 3);
            }
            if ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$F$) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$F$ = !1;
              for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = 0;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$I$.length;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$I$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$][0] = 0;
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = 0 === ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[1] & 2) ? 8 : 16;
              1 === ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[1] & 1) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ <<= 1);
              for ($colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = 0;64 > $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$;$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$++) {
                $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$s$ + 
                $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$] & 255;
                if (208 === $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$) {
                  break;
                }
                $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$++;
                240 < $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ && ($count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ -= 256);
                for ($address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ = $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$;192 > $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$;$address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$++) {
                  if ($address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ - $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$) {
                    $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$I$[$address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$];
                    if (!$row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ || 8 <= $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$[0]) {
                      break;
                    }
                    $address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = 3 * $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$[0] + 1;
                    $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$s$ + ($colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ << 1) + 128;
                    $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$++] & 
                    255;
                    $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$++] = $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$;
                    $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$i$[$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$] & 
                    255;
                    $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$[0]++;
                  }
                }
              }
            }
            if (0 !== $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$I$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$][0]) {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = 0;
              $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$I$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$];
              $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$ = Math.min(8, $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$[0]);
              $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[1] & 1;
              $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ = $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ << 8;
              for ($address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$ = 3 * $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ < $count$$inline_389_pixel_index$$inline_349_samplesToGenerate$$inline_412_tile_column$$inline_365_y$$inline_379$$;$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$++) {
                if ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ = $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[6] & 
                4) << 6, $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ = $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$--], $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ = $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$[$address0$$inline_352_i$$inline_415_off$$inline_382_off$$inline_392_output$$inline_416_row_precal$$inline_368$$--] - 
                ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[0] & 8), $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ = $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ - $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ >> 
                $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$, 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[1] & 2) && ($address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ &= -2), $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ = 
                $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$P$[$address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$ + (($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ & 8) >> 3)], $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ = 
                0, 0 > $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ && ($address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ = -$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$, $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ = 0), $colour$$inline_359_offset$$inline_399$$ = $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ + 
                (($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ & 7) << 3), $address$$inline_350_buffer$$inline_413_lineno$$inline_380_tile_row$$inline_366_zoomed$$inline_390$$) {
                  for (;8 > $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ && $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$v$;$address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$++, 
                  $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ += 2) {
                    $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ = $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$[$colour$$inline_359_offset$$inline_399$$++], $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$ && 
                    0 !== $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$K$[$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$] && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ = 
                    4 * ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ + $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$), $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ = 3 * ($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$] = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ + 
                    2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 2]), $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ + 1 >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$ && 
                    0 !== $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$K$[$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ + 1] && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ = 
                    4 * ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ + $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$ + 1), $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ = 3 * ($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$] = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ + 
                    2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 2]);
                  }
                } else {
                  for (;8 > $address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$ && $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ < 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$v$;$address3$$inline_355_counter$$inline_419_pal$$inline_372_pix$$inline_398_y$$inline_394$$++, 
                  $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$++) {
                    $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ = $address2$$inline_354_clockCyclesScaled$$inline_418_n$$inline_393_secondbyte$$inline_371_tile$$inline_397$$[$colour$$inline_359_offset$$inline_399$$++], $address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ >= 8 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$ && 
                    0 !== $bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$K$[$address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$] && ($colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ = 
                    4 * ($address$$inline_383_address1$$inline_353_clockCycles$$inline_417_tx$$inline_369_x$$inline_395$$ + $row_precal$$inline_391_sample$$inline_414_sprites$$inline_381_tile_y$$inline_367_vscroll$$inline_363_y$$inline_351$$), $pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ = 3 * ($bit$$inline_356_colour$$inline_384_sx$$inline_373_tileRow$$inline_396_tone$$inline_420$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$] = 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ + 
                    1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$colour$$inline_357_pixY$$inline_374_temp$$inline_385$$ + 
                    2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$pixX$$inline_358_temp2$$inline_386_tile_props$$inline_370$$ + 2]);
                  }
                }
              }
              8 <= $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$m$ |= 64);
            }
            if ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$main$.$is_sms$ && $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[0] & 32) {
              for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = 4 * ($frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ << 8), $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = 
              3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[7] & 15) + 16), $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$;$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ < 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ + 32;$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ += 4) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$], 
                $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ + 
                1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ + 
                2];
              }
            }
          } else {
            for ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ = 4 * ($frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ << 8), $colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ = 
            3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[7] & 15) + 16), $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ + 
            32 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$o$;$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_409_height$$inline_377_hscroll$$inline_362_i$$inline_347_i$$inline_376_i$$inline_387_location$$inline_345_location$$inline_401$$ + 
            32 * $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$v$;$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ += 4) {
              $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$], 
              $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ + 
              1], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$[$frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$a$[$colour$$inline_346_colour$$inline_402_lock$$inline_364_offset$$inline_411_spriteno$$inline_378_sprites$$inline_388_tile$$inline_348$$ + 
              2];
            }
          }
        }
        $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$Y$;
        $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno;
        192 >= $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ ? (0 === $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$M$ ? ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$M$ = 
        $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[10], $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$m$ |= 4) : $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$M$--, 
        0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$m$ & 4) && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[0] & 16) && 
        ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$main$.$cpu$.$I$ = !0)) : ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$M$ = $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[10], 
        0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$m$ & 128) && 0 !== ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$g$[1] & 32) && 
        224 > $frameReg$$inline_298_line$$inline_339_lineno$$inline_343_lineno$$inline_405_samplesToGenerate$$inline_340_x$$inline_344_x$$inline_400$$ && ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$main$.$cpu$.$I$ = !0));
        $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$I$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$);
        $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno++;
        $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.lineno >= $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$main$.$no_of_scanlines$ ? ($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$main$.$pause_button$ && 
        ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$ = $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$, $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$K$ = 
        $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$J$, $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$J$ = !1, $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$P$ && 
        ($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$++, $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$P$ = !1), $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.push($JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$), 
        $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$f$ = 102, $JSCompiler_StaticMethods_drawLine$self$$inline_342_JSCompiler_StaticMethods_interrupts$self$$inline_404_JSCompiler_StaticMethods_nmi$self$$inline_422_JSCompiler_StaticMethods_updateSound$self$$inline_338_frameId$$inline_297$$.$j$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$main$.$pause_button$ = 
        !1), $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$ = !0) : ($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$j$ += $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$.$main$.$cyclesPerLine$, 
        $JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$ = !1);
      }
      if ($JSCompiler_StaticMethods_eof$self$$inline_407_JSCompiler_StaticMethods_eol$self$$inline_300_JSCompiler_StaticMethods_recompile$self$$inline_296_JSCompiler_temp$$294$$) {
        break;
      }
    }
    this.$fpsFrameCount$++;
    this.$f$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$f$.screen);
  }
}, $readRomDirectly$:function $$JSSMS$$$$$readRomDirectly$$($data$$31$$, $fileName$$) {
  var $extension_i$$inline_42_pages$$inline_38$$ = $JSSMS$Utils$$.$getFileExtension$($fileName$$), $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ = $data$$31$$.length;
  "gg" === $extension_i$$inline_42_pages$$inline_38$$ ? (this.$is_gg$ = !0, this.$is_sms$ = !1, this.$a$.$o$ = 6, this.$a$.$v$ = 26, this.$emuWidth$ = 160, this.$emuHeight$ = 144) : (this.$is_sms$ = !0, this.$is_gg$ = !1, this.$a$.$o$ = 0, this.$a$.$v$ = 32, this.$emuWidth$ = 256, this.$emuHeight$ = 192);
  for (var $j$$inline_36$$, $number_of_pages$$inline_37$$ = Math.ceil($JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ / 16384), $extension_i$$inline_42_pages$$inline_38$$ = Array($number_of_pages$$inline_37$$), $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ = 0;$JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ < $number_of_pages$$inline_37$$;$JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$++) {
    if ($extension_i$$inline_42_pages$$inline_38$$[$JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$] = $JSSMS$Utils$$.Array(16384), $SUPPORT_DATAVIEW$$) {
      for ($j$$inline_36$$ = 0;16384 > $j$$inline_36$$;$j$$inline_36$$++) {
        $extension_i$$inline_42_pages$$inline_38$$[$JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$].setUint8($j$$inline_36$$, $data$$31$$.charCodeAt(16384 * $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ + $j$$inline_36$$));
      }
    } else {
      for ($j$$inline_36$$ = 0;16384 > $j$$inline_36$$;$j$$inline_36$$++) {
        $extension_i$$inline_42_pages$$inline_38$$[$JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$][$j$$inline_36$$] = $data$$31$$.charCodeAt(16384 * $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ + $j$$inline_36$$) & 255;
      }
    }
  }
  if (null === $extension_i$$inline_42_pages$$inline_38$$) {
    return !1;
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$ = this.$cpu$;
  $extension_i$$inline_42_pages$$inline_38$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$rom$ = $extension_i$$inline_42_pages$$inline_38$$);
  if ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$M$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$M$ - 1;
    for ($extension_i$$inline_42_pages$$inline_38$$ = 0;3 > $extension_i$$inline_42_pages$$inline_38$$;$extension_i$$inline_42_pages$$inline_38$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$frameReg$[$extension_i$$inline_42_pages$$inline_38$$] = $extension_i$$inline_42_pages$$inline_38$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$M$;
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$frameReg$[3] = 0;
    if ($ENABLE_COMPILER$$) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$branches$ = Array($JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$M$);
      for ($extension_i$$inline_42_pages$$inline_38$$ = 0;$extension_i$$inline_42_pages$$inline_38$$ < $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$M$;$extension_i$$inline_42_pages$$inline_38$$++) {
        $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$branches$[$extension_i$$inline_42_pages$$inline_38$$] = Object.create(null);
      }
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$X$.$m$($JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$rom$);
    }
  } else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$M$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_i$$inline_35_size$$11$$.$romPageMask$ = 0;
  }
  this.$romData$ = $data$$31$$;
  this.$romFileName$ = $fileName$$;
  return !0;
}};
"console" in window ? "bind" in window.console.log || (window.console.log = function($fn$$inline_44$$) {
  return function($msg$$inline_45$$) {
    return $fn$$inline_44$$($msg$$inline_45$$);
  };
}(window.console.log), window.console.error = function($fn$$inline_46$$) {
  return function($msg$$inline_47$$) {
    return $fn$$inline_46$$($msg$$inline_47$$);
  };
}(window.console.error)) : window.console = {log:function $window$console$log$() {
}, error:function $window$console$error$() {
}};
var $JSSMS$Utils$$ = {$rndInt$:function($range$$5$$) {
  return Math.round(Math.random() * $range$$5$$);
}, Uint8Array:$SUPPORT_TYPED_ARRAYS$$ ? Uint8Array : Array, Uint16Array:$SUPPORT_TYPED_ARRAYS$$ ? Uint16Array : Array, Array:$SUPPORT_DATAVIEW$$ ? function($length$$15$$) {
  return new DataView(new ArrayBuffer($length$$15$$));
} : Array, $a$:$SUPPORT_DATAVIEW$$ ? function($src$$2$$, $srcPos$$, $dest$$2$$, $destPos$$, $length$$16$$) {
  for (;$length$$16$$--;) {
    $dest$$2$$.setInt8($destPos$$ + $length$$16$$, $src$$2$$.getInt8($srcPos$$ + $length$$16$$));
  }
} : function($src$$3$$, $srcPos$$1$$, $dest$$3$$, $destPos$$1$$, $length$$17$$) {
  for (;$length$$17$$--;) {
    $dest$$3$$[$destPos$$1$$ + $length$$17$$] = $src$$3$$[$srcPos$$1$$ + $length$$17$$];
  }
}, console:{log:$DEBUG$$ ? window.console.log.bind(window.console) : function() {
}, error:$DEBUG$$ ? window.console.error.bind(window.console) : function() {
}, time:$DEBUG$$ && window.console.time ? window.console.time.bind(window.console) : function() {
}, timeEnd:$DEBUG$$ && window.console.timeEnd ? window.console.timeEnd.bind(window.console) : function() {
}}, $traverse$:function($object$$, $fn$$2$$) {
  var $key$$21$$, $child$$;
  $fn$$2$$.call(null, $object$$);
  for ($key$$21$$ in $object$$) {
    $object$$.hasOwnProperty($key$$21$$) && ($child$$ = $object$$[$key$$21$$], Object($child$$) === $child$$ && ($object$$[$key$$21$$] = $JSSMS$Utils$$.$traverse$($child$$, $fn$$2$$)));
  }
  return $object$$;
}, $getTimestamp$:window.performance && window.performance.now ? window.performance.now.bind(window.performance) : function() {
  return (new Date).getTime();
}, $toHex$:function($dec$$) {
  var $hex$$ = Math.abs($dec$$).toString(16).toUpperCase();
  $hex$$.length % 2 && ($hex$$ = "0" + $hex$$);
  return 0 > $dec$$ ? "-0x" + $hex$$ : "0x" + $hex$$;
}, $f$:function($arr$$8$$, $obj$$23$$) {
  var $prefix$$2$$ = !1;
  void 0 === $obj$$23$$ && ($obj$$23$$ = document);
  $arr$$8$$.some(function($prop$$4$$) {
    return $prop$$4$$ in $obj$$23$$ ? ($prefix$$2$$ = $prop$$4$$, !0) : !1;
  });
  return $prefix$$2$$;
}, $getFileExtension$:function($fileName$$1$$) {
  return "string" !== typeof $fileName$$1$$ ? "" : $fileName$$1$$.split(".").pop().toLowerCase();
}, getFileName:function($fileName$$2_parts$$) {
  if ("string" !== typeof $fileName$$2_parts$$) {
    return "";
  }
  $fileName$$2_parts$$ = $fileName$$2_parts$$.split(".");
  $fileName$$2_parts$$.pop();
  return $fileName$$2_parts$$.join(".").split("/").pop();
}, $crc32$:function($str$$7$$) {
  var $crcTable$$ = function makeCRCTable() {
    for (var $c$$, $crcTable$$1$$ = new Uint32Array(256), $n$$4$$ = 0;256 > $n$$4$$;$n$$4$$++) {
      $c$$ = $n$$4$$;
      for (var $k$$ = 0;8 > $k$$;$k$$++) {
        $c$$ = $c$$ & 1 ? 3988292384 ^ $c$$ >>> 1 : $c$$ >>> 1;
      }
      $crcTable$$1$$[$n$$4$$] = $c$$;
    }
    return $crcTable$$1$$;
  }();
  this.$crc32$ = function $this$$crc32$$($str$$8$$) {
    for (var $crc$$ = -1, $i$$6$$ = 0;$i$$6$$ < $str$$8$$.length;$i$$6$$++) {
      $crc$$ = $crc$$ >>> 8 ^ $crcTable$$[($crc$$ ^ $str$$8$$.charCodeAt($i$$6$$)) & 255];
    }
    return ($crc$$ ^ -1) >>> 0;
  };
  return this.$crc32$($str$$7$$);
}, $g$:function() {
  return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}};
var $OP_STATES$$ = new $JSSMS$Utils$$.Uint8Array([4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 
4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11]), $OP_CB_STATES$$ = new $JSSMS$Utils$$.Uint8Array([8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 
8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 
8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8]), $OP_DD_STATES$$ = new $JSSMS$Utils$$.Uint8Array([4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 
4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 
4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4]), $OP_INDEX_CB_STATES$$ = new $JSSMS$Utils$$.Uint8Array([23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 
20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23]), $OP_ED_STATES$$ = new $JSSMS$Utils$$.Uint8Array([8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 
8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8]);
function $JSSMS$Z80$$($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$) {
  this.$main$ = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;
  this.$Y$ = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$.$a$;
  this.$v$ = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$.$m$;
  this.$S$ = this.$i$ = this.$f$ = 0;
  this.$I$ = this.$R$ = this.$P$ = this.$K$ = this.$J$ = !1;
  this.$j$ = this.$fa$ = this.$g$ = this.$W$ = this.$u$ = this.$o$ = this.$s$ = this.$m$ = this.$ha$ = this.$ga$ = this.$l$ = this.$h$ = this.$ea$ = this.$da$ = this.e = this.d = this.$ca$ = this.$ba$ = this.$c$ = this.$b$ = this.$aa$ = this.$a$ = this.$T$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$$.Array(32768);
  this.$frameReg$ = Array(4);
  this.$M$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$$.Array(8192);
  this.$ia$ = new $JSSMS$Utils$$.Uint16Array(2048);
  this.$Z$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$SZP_TABLE$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$O$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$N$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$G$ = new $JSSMS$Utils$$.Uint8Array(131072);
  this.$w$ = new $JSSMS$Utils$$.Uint8Array(131072);
  this.$V$ = new $JSSMS$Utils$$.Uint8Array(256);
  var $c$$inline_66_padc$$inline_57_sf$$inline_51$$, $h$$inline_67_psub$$inline_58_zf$$inline_52$$, $n$$inline_68_psbc$$inline_59_yf$$inline_53$$, $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$, $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$, $flags$$inline_304_newval$$inline_62$$;
  for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;256 > $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++) {
    $c$$inline_66_padc$$inline_57_sf$$inline_51$$ = 0 !== ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ & 128) ? 128 : 0, $h$$inline_67_psub$$inline_58_zf$$inline_52$$ = 0 === $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ ? 64 : 0, $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ & 32, $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ & 
    8, $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$) ? 4 : 0, this.$Z$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = $c$$inline_66_padc$$inline_57_sf$$inline_51$$ | $h$$inline_67_psub$$inline_58_zf$$inline_52$$ | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ | $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$, this.$SZP_TABLE$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = 
    $c$$inline_66_padc$$inline_57_sf$$inline_51$$ | $h$$inline_67_psub$$inline_58_zf$$inline_52$$ | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ | $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ | $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$, this.$O$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = $c$$inline_66_padc$$inline_57_sf$$inline_51$$ | $h$$inline_67_psub$$inline_58_zf$$inline_52$$ | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ | $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$, 
    this.$O$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 128 === $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ ? 4 : 0, this.$O$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 0 === ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ & 15) ? 16 : 0, this.$N$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = $c$$inline_66_padc$$inline_57_sf$$inline_51$$ | $h$$inline_67_psub$$inline_58_zf$$inline_52$$ | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ | 
    $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ | 2, this.$N$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 127 === $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ ? 4 : 0, this.$N$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 15 === ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ & 15) ? 16 : 0, this.$V$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = 0 !== $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ ? 
    $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ & 128 : 68, this.$V$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = this.$V$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ | $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ | 16;
  }
  $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;
  $c$$inline_66_padc$$inline_57_sf$$inline_51$$ = 65536;
  $h$$inline_67_psub$$inline_58_zf$$inline_52$$ = 0;
  $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ = 65536;
  for ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ = 0;256 > $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$;$JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$++) {
    for ($flags$$inline_304_newval$$inline_62$$ = 0;256 > $flags$$inline_304_newval$$inline_62$$;$flags$$inline_304_newval$$inline_62$$++) {
      $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ = $flags$$inline_304_newval$$inline_62$$ - $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$, this.$G$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = 0 !== $flags$$inline_304_newval$$inline_62$$ ? 0 !== ($flags$$inline_304_newval$$inline_62$$ & 128) ? 128 : 0 : 64, this.$G$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= $flags$$inline_304_newval$$inline_62$$ & 40, ($flags$$inline_304_newval$$inline_62$$ & 
      15) < ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ & 15) && (this.$G$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 16), $flags$$inline_304_newval$$inline_62$$ < $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ && (this.$G$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 1), 0 !== (($JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ ^ $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ ^ 128) & ($JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ ^ 
      $flags$$inline_304_newval$$inline_62$$) & 128) && (this.$G$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] |= 4), $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++, $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ = $flags$$inline_304_newval$$inline_62$$ - $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ - 1, this.$G$[$c$$inline_66_padc$$inline_57_sf$$inline_51$$] = 0 !== $flags$$inline_304_newval$$inline_62$$ ? 0 !== ($flags$$inline_304_newval$$inline_62$$ & 
      128) ? 128 : 0 : 64, this.$G$[$c$$inline_66_padc$$inline_57_sf$$inline_51$$] |= $flags$$inline_304_newval$$inline_62$$ & 40, ($flags$$inline_304_newval$$inline_62$$ & 15) <= ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ & 15) && (this.$G$[$c$$inline_66_padc$$inline_57_sf$$inline_51$$] |= 16), $flags$$inline_304_newval$$inline_62$$ <= $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ && (this.$G$[$c$$inline_66_padc$$inline_57_sf$$inline_51$$] |= 1), 0 !== (($JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ ^ 
      $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ ^ 128) & ($JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ ^ $flags$$inline_304_newval$$inline_62$$) & 128) && (this.$G$[$c$$inline_66_padc$$inline_57_sf$$inline_51$$] |= 4), $c$$inline_66_padc$$inline_57_sf$$inline_51$$++, $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ = $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ - $flags$$inline_304_newval$$inline_62$$, this.$w$[$h$$inline_67_psub$$inline_58_zf$$inline_52$$] = 
      0 !== $flags$$inline_304_newval$$inline_62$$ ? 0 !== ($flags$$inline_304_newval$$inline_62$$ & 128) ? 130 : 2 : 66, this.$w$[$h$$inline_67_psub$$inline_58_zf$$inline_52$$] |= $flags$$inline_304_newval$$inline_62$$ & 40, ($flags$$inline_304_newval$$inline_62$$ & 15) > ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ & 15) && (this.$w$[$h$$inline_67_psub$$inline_58_zf$$inline_52$$] |= 16), $flags$$inline_304_newval$$inline_62$$ > $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ && 
      (this.$w$[$h$$inline_67_psub$$inline_58_zf$$inline_52$$] |= 1), 0 !== (($JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ ^ $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$) & ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ ^ $flags$$inline_304_newval$$inline_62$$) & 128) && (this.$w$[$h$$inline_67_psub$$inline_58_zf$$inline_52$$] |= 4), $h$$inline_67_psub$$inline_58_zf$$inline_52$$++, $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ = $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ - 
      $flags$$inline_304_newval$$inline_62$$ - 1, this.$w$[$n$$inline_68_psbc$$inline_59_yf$$inline_53$$] = 0 !== $flags$$inline_304_newval$$inline_62$$ ? 0 !== ($flags$$inline_304_newval$$inline_62$$ & 128) ? 130 : 2 : 66, this.$w$[$n$$inline_68_psbc$$inline_59_yf$$inline_53$$] |= $flags$$inline_304_newval$$inline_62$$ & 40, ($flags$$inline_304_newval$$inline_62$$ & 15) >= ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ & 15) && (this.$w$[$n$$inline_68_psbc$$inline_59_yf$$inline_53$$] |= 
      16), $flags$$inline_304_newval$$inline_62$$ >= $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ && (this.$w$[$n$$inline_68_psbc$$inline_59_yf$$inline_53$$] |= 1), 0 !== (($JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ ^ $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$) & ($JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ ^ $flags$$inline_304_newval$$inline_62$$) & 128) && (this.$w$[$n$$inline_68_psbc$$inline_59_yf$$inline_53$$] |= 4), $n$$inline_68_psbc$$inline_59_yf$$inline_53$$++
      ;
    }
  }
  for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 256;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$--;) {
    for ($c$$inline_66_padc$$inline_57_sf$$inline_51$$ = 0;1 >= $c$$inline_66_padc$$inline_57_sf$$inline_51$$;$c$$inline_66_padc$$inline_57_sf$$inline_51$$++) {
      for ($h$$inline_67_psub$$inline_58_zf$$inline_52$$ = 0;1 >= $h$$inline_67_psub$$inline_58_zf$$inline_52$$;$h$$inline_67_psub$$inline_58_zf$$inline_52$$++) {
        for ($n$$inline_68_psbc$$inline_59_yf$$inline_53$$ = 0;1 >= $n$$inline_68_psbc$$inline_59_yf$$inline_53$$;$n$$inline_68_psbc$$inline_59_yf$$inline_53$$++) {
          $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$ = this.$ia$;
          $JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$ = $c$$inline_66_padc$$inline_57_sf$$inline_51$$ << 8 | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ << 9 | $h$$inline_67_psub$$inline_58_zf$$inline_52$$ << 10 | $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;
          $flags$$inline_304_newval$$inline_62$$ = $c$$inline_66_padc$$inline_57_sf$$inline_51$$ | $n$$inline_68_psbc$$inline_59_yf$$inline_53$$ << 1 | $h$$inline_67_psub$$inline_58_zf$$inline_52$$ << 4;
          this.$a$ = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;
          this.$g$ = $flags$$inline_304_newval$$inline_62$$;
          var $a_copy$$inline_305$$ = this.$a$, $correction$$inline_306$$ = 0, $carry$$inline_307$$ = $flags$$inline_304_newval$$inline_62$$ & 1, $carry_copy$$inline_308$$ = $carry$$inline_307$$;
          if (0 !== ($flags$$inline_304_newval$$inline_62$$ & 16) || 9 < ($a_copy$$inline_305$$ & 15)) {
            $correction$$inline_306$$ |= 6;
          }
          if (1 === $carry$$inline_307$$ || 159 < $a_copy$$inline_305$$ || 143 < $a_copy$$inline_305$$ && 9 < ($a_copy$$inline_305$$ & 15)) {
            $correction$$inline_306$$ |= 96, $carry_copy$$inline_308$$ = 1;
          }
          153 < $a_copy$$inline_305$$ && ($carry_copy$$inline_308$$ = 1);
          0 !== ($flags$$inline_304_newval$$inline_62$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_306$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_306$$);
          $flags$$inline_304_newval$$inline_62$$ = this.$g$ & 254 | $carry_copy$$inline_308$$;
          $flags$$inline_304_newval$$inline_62$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_304_newval$$inline_62$$ & 251 | 4 : $flags$$inline_304_newval$$inline_62$$ & 251;
          $JSCompiler_temp_const$$292_val$$inline_60_xf$$inline_54$$[$JSCompiler_temp_const$$291_oldval$$inline_61_pf$$inline_55$$] = this.$a$ | $flags$$inline_304_newval$$inline_62$$ << 8;
        }
      }
    }
  }
  this.$a$ = this.$g$ = 0;
  if ($SUPPORT_DATAVIEW$$) {
    for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;8192 > $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++) {
      this.$memWriteMap$.setUint8($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$, 0);
    }
  } else {
    for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;8192 > $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++) {
      this.$memWriteMap$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = 0;
    }
  }
  if ($SUPPORT_DATAVIEW$$) {
    for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;32768 > $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++) {
      this.$sram$.setUint8($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$, 0);
    }
  } else {
    for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;32768 > $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++) {
      this.$sram$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = 0;
    }
  }
  this.$M$ = 2;
  for ($i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ = 0;4 > $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$;$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$++) {
    this.$frameReg$[$i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$] = $i$$inline_50_i$$inline_65_i$$inline_71_padd$$inline_56_sms$$ % 3;
  }
  for (var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$];
  }
  $ENABLE_COMPILER$$ && (this.$X$ = new $Recompiler$$(this));
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$f$ = this.$fa$ = this.$g$ = this.$W$ = this.$o$ = this.$u$ = this.$m$ = this.$s$ = this.$h$ = this.$l$ = this.$ga$ = this.$ha$ = this.d = this.e = this.$da$ = this.$ea$ = this.$b$ = this.$c$ = this.$ba$ = this.$ca$ = this.$a$ = this.$aa$ = 0;
  this.$i$ = 57328;
  this.$S$ = this.$j$ = 0;
  this.$R$ = this.$K$ = this.$J$ = !1;
  this.$T$ = 0;
  this.$P$ = !1;
  $ENABLE_COMPILER$$ && this.$X$.reset();
}, $branches$:[Object.create(null), Object.create(null), Object.create(null)], call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? (this.push(this.$f$ + 2), this.$f$ = this.getUint16(this.$f$), this.$j$ -= 7) : this.$f$ += 2;
}, push:function $$JSSMS$Z80$$$$push$($value$$74$$) {
  this.$i$ -= 2;
  this.setUint16(this.$i$, $value$$74$$);
}, setUint8:$SUPPORT_DATAVIEW$$ ? function setUint8($address$$, $value$$101$$) {
  65535 >= $address$$ ? (this.$memWriteMap$.setUint8($address$$ & 8191, $value$$101$$), 65532 === $address$$ ? this.$frameReg$[3] = $value$$101$$ : 65533 === $address$$ ? this.$frameReg$[0] = $value$$101$$ & this.$romPageMask$ : 65534 === $address$$ ? this.$frameReg$[1] = $value$$101$$ & this.$romPageMask$ : 65535 === $address$$ && (this.$frameReg$[2] = $value$$101$$ & this.$romPageMask$)) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$));
} : function setUint8$$1($address$$1$$, $value$$102$$) {
  65535 >= $address$$1$$ ? (this.$memWriteMap$[$address$$1$$ & 8191] = $value$$102$$, 65532 === $address$$1$$ ? this.$frameReg$[3] = $value$$102$$ : 65533 === $address$$1$$ ? this.$frameReg$[0] = $value$$102$$ & this.$romPageMask$ : 65534 === $address$$1$$ ? this.$frameReg$[1] = $value$$102$$ & this.$romPageMask$ : 65535 === $address$$1$$ && (this.$frameReg$[2] = $value$$102$$ & this.$romPageMask$)) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$1$$));
}, setUint16:$SUPPORT_DATAVIEW$$ ? function setUint16($address$$2$$, $value$$103$$) {
  65532 > $address$$2$$ ? this.$memWriteMap$.setUint16($address$$2$$ & 8191, $value$$103$$, !0) : 65532 === $address$$2$$ ? (this.$frameReg$[3] = $value$$103$$ & 255, this.$frameReg$[0] = $value$$103$$ >> 8 & this.$romPageMask$) : 65533 === $address$$2$$ ? (this.$frameReg$[0] = $value$$103$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$103$$ >> 8 & this.$romPageMask$) : 65534 === $address$$2$$ ? (this.$frameReg$[1] = $value$$103$$ & 255 & this.$romPageMask$, this.$frameReg$[2] = $value$$103$$ >> 
  8 & this.$romPageMask$) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$2$$));
} : function setUint16$$1($address$$3$$, $value$$104$$) {
  65532 > $address$$3$$ ? ($address$$3$$ &= 8191, this.$memWriteMap$[$address$$3$$++] = $value$$104$$ & 255, this.$memWriteMap$[$address$$3$$] = $value$$104$$ >> 8) : 65532 === $address$$3$$ ? (this.$frameReg$[3] = $value$$104$$ & 255, this.$frameReg$[0] = $value$$104$$ >> 8 & this.$romPageMask$) : 65533 === $address$$3$$ ? (this.$frameReg$[0] = $value$$104$$ & 255 & this.$romPageMask$, this.$frameReg$[1] = $value$$104$$ >> 8 & this.$romPageMask$) : 65534 === $address$$3$$ ? (this.$frameReg$[1] = 
  $value$$104$$ & 255 & this.$romPageMask$, this.$frameReg$[2] = $value$$104$$ >> 8 & this.$romPageMask$) : $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$3$$));
}, getUint8:$SUPPORT_DATAVIEW$$ ? function getUint8($address$$4$$) {
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
} : function getUint8$$1($address$$5$$) {
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
}, getUint16:$SUPPORT_DATAVIEW$$ ? function getUint16($address$$6$$) {
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
} : function getUint16$$1($address$$7$$) {
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
}, getInt8:$SUPPORT_DATAVIEW$$ ? function getInt8($address$$8$$) {
  var $value$$105$$ = 0;
  if (1024 > $address$$8$$) {
    $value$$105$$ = this.$rom$[0].getInt8($address$$8$$);
  } else {
    if (16384 > $address$$8$$) {
      $value$$105$$ = this.$rom$[this.$frameReg$[0]].getInt8($address$$8$$);
    } else {
      if (32768 > $address$$8$$) {
        $value$$105$$ = this.$rom$[this.$frameReg$[1]].getInt8($address$$8$$ - 16384);
      } else {
        if (49152 > $address$$8$$) {
          $value$$105$$ = 8 === (this.$frameReg$[3] & 12) ? this.$sram$.getInt8($address$$8$$ - 32768) : 12 === (this.$frameReg$[3] & 12) ? this.$sram$.getInt8($address$$8$$ - 16384) : this.$rom$[this.$frameReg$[2]].getInt8($address$$8$$ - 32768);
        } else {
          if (57344 > $address$$8$$) {
            $value$$105$$ = this.$memWriteMap$.getInt8($address$$8$$ - 49152);
          } else {
            if (65532 > $address$$8$$) {
              $value$$105$$ = this.$memWriteMap$.getInt8($address$$8$$ - 57344);
            } else {
              if (65532 === $address$$8$$) {
                return this.$frameReg$[3];
              }
              if (65533 === $address$$8$$) {
                return this.$frameReg$[0];
              }
              if (65534 === $address$$8$$) {
                return this.$frameReg$[1];
              }
              if (65535 === $address$$8$$) {
                return this.$frameReg$[2];
              }
              $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$8$$));
            }
          }
        }
      }
    }
  }
  return $value$$105$$ + 1;
} : function getInt8$$1($address$$9$$) {
  var $value$$106$$ = 0;
  if (1024 > $address$$9$$) {
    $value$$106$$ = this.$rom$[0][$address$$9$$];
  } else {
    if (16384 > $address$$9$$) {
      $value$$106$$ = this.$rom$[this.$frameReg$[0]][$address$$9$$];
    } else {
      if (32768 > $address$$9$$) {
        $value$$106$$ = this.$rom$[this.$frameReg$[1]][$address$$9$$ - 16384];
      } else {
        if (49152 > $address$$9$$) {
          $value$$106$$ = 8 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$9$$ - 32768] : 12 === (this.$frameReg$[3] & 12) ? this.$sram$[$address$$9$$ - 16384] : this.$rom$[this.$frameReg$[2]][$address$$9$$ - 32768];
        } else {
          if (57344 > $address$$9$$) {
            $value$$106$$ = this.$memWriteMap$[$address$$9$$ - 49152];
          } else {
            if (65532 > $address$$9$$) {
              $value$$106$$ = this.$memWriteMap$[$address$$9$$ - 57344];
            } else {
              if (65532 === $address$$9$$) {
                return this.$frameReg$[3];
              }
              if (65533 === $address$$9$$) {
                return this.$frameReg$[0];
              }
              if (65534 === $address$$9$$) {
                return this.$frameReg$[1];
              }
              if (65535 === $address$$9$$) {
                return this.$frameReg$[2];
              }
              $JSSMS$Utils$$.console.error($JSSMS$Utils$$.$toHex$($address$$9$$));
            }
          }
        }
      }
    }
  }
  $value$$106$$ += 1;
  128 <= $value$$106$$ && ($value$$106$$ -= 256);
  return $value$$106$$;
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.getUint8($JSCompiler_StaticMethods_d_$self$$.$f$);
}
function $JSCompiler_StaticMethods_getParity$$($value$$100$$) {
  var $parity$$ = !0, $j$$2$$;
  for ($j$$2$$ = 0;8 > $j$$2$$;$j$$2$$++) {
    0 !== ($value$$100$$ & 1 << $j$$2$$) && ($parity$$ = !$parity$$);
  }
  return $parity$$;
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$99$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$3$$ = $hl$$1$$ - $value$$99$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$g$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$g$ = ($hl$$1$$ ^ $result$$3$$ ^ $value$$99$$) >> 8 & 16 | 2 | $result$$3$$ >> 16 & 1 | $result$$3$$ >> 8 & 128 | (0 !== ($result$$3$$ & 65535) ? 0 : 64) | (($value$$99$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$3$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$h$ = $result$$3$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$3$$ & 255;
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$98$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$2$$ = $hl$$ + $value$$98$$ + ($JSCompiler_StaticMethods_adc16$self$$.$g$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$g$ = ($hl$$ ^ $result$$2$$ ^ $value$$98$$) >> 8 & 16 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 !== ($result$$2$$ & 65535) ? 0 : 64) | (($value$$98$$ ^ $hl$$ ^ 32768) & ($value$$98$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$h$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$2$$ & 255;
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$1$$, $value$$97$$) {
  var $result$$1$$ = $reg$$1$$ + $value$$97$$;
  $JSCompiler_StaticMethods_add16$self$$.$g$ = $JSCompiler_StaticMethods_add16$self$$.$g$ & 196 | ($reg$$1$$ ^ $result$$1$$ ^ $value$$97$$) >> 8 & 16 | $result$$1$$ >> 16 & 1;
  return $result$$1$$ & 65535;
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$96$$) {
  $value$$96$$ = $value$$96$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$g$ = $JSCompiler_StaticMethods_dec8$self$$.$g$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$N$[$value$$96$$];
  return $value$$96$$;
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$95$$) {
  $value$$95$$ = $value$$95$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$g$ = $JSCompiler_StaticMethods_inc8$self$$.$g$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$O$[$value$$95$$];
  return $value$$95$$;
}
function $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_decHL$self$$) {
  $JSCompiler_StaticMethods_decHL$self$$.$l$ = $JSCompiler_StaticMethods_decHL$self$$.$l$ - 1 & 255;
  255 === $JSCompiler_StaticMethods_decHL$self$$.$l$ && ($JSCompiler_StaticMethods_decHL$self$$.$h$ = $JSCompiler_StaticMethods_decHL$self$$.$h$ - 1 & 255);
}
function $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_decDE$self$$) {
  $JSCompiler_StaticMethods_decDE$self$$.e = $JSCompiler_StaticMethods_decDE$self$$.e - 1 & 255;
  255 === $JSCompiler_StaticMethods_decDE$self$$.e && ($JSCompiler_StaticMethods_decDE$self$$.d = $JSCompiler_StaticMethods_decDE$self$$.d - 1 & 255);
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
  $JSCompiler_StaticMethods_incDE$self$$.e = $JSCompiler_StaticMethods_incDE$self$$.e + 1 & 255;
  0 === $JSCompiler_StaticMethods_incDE$self$$.e && ($JSCompiler_StaticMethods_incDE$self$$.d = $JSCompiler_StaticMethods_incDE$self$$.d + 1 & 255);
}
function $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_setIYHIYL$self$$, $value$$94$$) {
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$u$ = $value$$94$$ >> 8;
  $JSCompiler_StaticMethods_setIYHIYL$self$$.$o$ = $value$$94$$ & 255;
}
function $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_setIXHIXL$self$$, $value$$93$$) {
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$s$ = $value$$93$$ >> 8;
  $JSCompiler_StaticMethods_setIXHIXL$self$$.$m$ = $value$$93$$ & 255;
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$91$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$h$ = $value$$91$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$91$$ & 255;
}
function $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_getIYHIYL$self$$) {
  return $JSCompiler_StaticMethods_getIYHIYL$self$$.$u$ << 8 | $JSCompiler_StaticMethods_getIYHIYL$self$$.$o$;
}
function $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_getIXHIXL$self$$) {
  return $JSCompiler_StaticMethods_getIXHIXL$self$$.$s$ << 8 | $JSCompiler_StaticMethods_getIXHIXL$self$$.$m$;
}
function $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_getHL$self$$) {
  return $JSCompiler_StaticMethods_getHL$self$$.$h$ << 8 | $JSCompiler_StaticMethods_getHL$self$$.$l$;
}
function $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_getDE$self$$) {
  return $JSCompiler_StaticMethods_getDE$self$$.d << 8 | $JSCompiler_StaticMethods_getDE$self$$.e;
}
function $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_getBC$self$$) {
  return $JSCompiler_StaticMethods_getBC$self$$.$b$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$c$;
}
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$88$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$g$ = $JSCompiler_StaticMethods_cp_a$self$$.$w$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$88$$ & 255];
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $temp$$8_value$$87$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$g$ & 1;
  $temp$$8_value$$87$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $temp$$8_value$$87$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$g$ = $JSCompiler_StaticMethods_sbc_a$self$$.$w$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8_value$$87$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8_value$$87$$;
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $temp$$7_value$$86$$) {
  $temp$$7_value$$86$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $temp$$7_value$$86$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$g$ = $JSCompiler_StaticMethods_sub_a$self$$.$w$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7_value$$86$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7_value$$86$$;
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $temp$$6_value$$85$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$g$ & 1;
  $temp$$6_value$$85$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $temp$$6_value$$85$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$g$ = $JSCompiler_StaticMethods_adc_a$self$$.$G$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6_value$$85$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6_value$$85$$;
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $temp$$5_value$$84$$) {
  $temp$$5_value$$84$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $temp$$5_value$$84$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$g$ = $JSCompiler_StaticMethods_add_a$self$$.$G$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5_value$$84$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5_value$$84$$;
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$45_location$$21$$) {
  $index$$45_location$$21$$ = $index$$45_location$$21$$ + $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($JSCompiler_StaticMethods_doIndexCB$self$$.$f$) & 65535;
  var $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8(++$JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
  switch($opcode$$4$$) {
    case 0:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 1:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 2:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 3:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 4:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 5:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 7:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 8:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 9:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 10:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 11:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 12:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 13:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 15:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 16:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 17:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 18:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 19:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 20:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 21:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 23:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 24:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 25:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 26:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 27:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 28:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 29:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 31:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 32:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 33:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 34:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 35:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 36:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 37:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 39:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 40:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 41:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 42:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 43:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 44:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 45:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 47:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 48:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 49:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 50:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 51:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 52:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 53:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 55:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 56:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 57:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$c$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
      break;
    case 58:
      $JSCompiler_StaticMethods_doIndexCB$self$$.d = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.d);
      break;
    case 59:
      $JSCompiler_StaticMethods_doIndexCB$self$$.e = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.e);
      break;
    case 60:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 61:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$l$);
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$)));
      break;
    case 63:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 1);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 2);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 4);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 8);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 16);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 32);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 64);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & 128);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -3);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -5);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -9);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -17);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -33);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -65);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) & -129);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 1);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 4);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 8);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 16);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 32);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 64);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.setUint8($index$$45_location$$21$$, $JSCompiler_StaticMethods_doIndexCB$self$$.getUint8($index$$45_location$$21$$) | 128);
      break;
    default:
      $JSSMS$Utils$$.console.log("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$$.$toHex$($opcode$$4$$));
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$f$++;
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$g$ = $JSCompiler_StaticMethods_bit$self$$.$g$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$V$[$mask$$5$$];
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$82$$) {
  var $carry$$7$$ = $value$$82$$ & 1;
  $value$$82$$ = $value$$82$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$g$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$SZP_TABLE$[$value$$82$$];
  return $value$$82$$;
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$81$$) {
  var $carry$$6$$ = $value$$81$$ & 1;
  $value$$81$$ = $value$$81$$ >> 1 | $value$$81$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$g$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$SZP_TABLE$[$value$$81$$];
  return $value$$81$$;
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$80$$) {
  var $carry$$5$$ = ($value$$80$$ & 128) >> 7;
  $value$$80$$ = ($value$$80$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$g$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$SZP_TABLE$[$value$$80$$];
  return $value$$80$$;
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$79$$) {
  var $carry$$4$$ = ($value$$79$$ & 128) >> 7;
  $value$$79$$ = $value$$79$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$g$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$SZP_TABLE$[$value$$79$$];
  return $value$$79$$;
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$78$$) {
  var $carry$$3$$ = $value$$78$$ & 1;
  $value$$78$$ = ($value$$78$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$g$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$g$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$SZP_TABLE$[$value$$78$$];
  return $value$$78$$;
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$77$$) {
  var $carry$$2$$ = ($value$$77$$ & 128) >> 7;
  $value$$77$$ = ($value$$77$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$g$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$g$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$SZP_TABLE$[$value$$77$$];
  return $value$$77$$;
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$76$$) {
  var $carry$$1$$ = $value$$76$$ & 1;
  $value$$76$$ = ($value$$76$$ >> 1 | $value$$76$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$g$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$SZP_TABLE$[$value$$76$$];
  return $value$$76$$;
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$75$$) {
  var $carry$$ = ($value$$75$$ & 128) >> 7;
  $value$$75$$ = ($value$$75$$ << 1 | $value$$75$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$g$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$SZP_TABLE$[$value$$75$$];
  return $value$$75$$;
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_decMem$self$$.setUint8($offset$$15$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.getUint8($offset$$15$$)));
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  $JSCompiler_StaticMethods_incMem$self$$.setUint8($offset$$14$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.getUint8($offset$$14$$)));
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$f$ = $JSCompiler_StaticMethods_ret$self$$.getUint16($JSCompiler_StaticMethods_ret$self$$.$i$), $JSCompiler_StaticMethods_ret$self$$.$i$ += 2, $JSCompiler_StaticMethods_ret$self$$.$j$ -= 6);
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$f$ += $JSCompiler_StaticMethods_jr$self$$.getInt8($JSCompiler_StaticMethods_jr$self$$.$f$), $JSCompiler_StaticMethods_jr$self$$.$j$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$f$++;
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$f$ = $JSCompiler_StaticMethods_jp$self$$.getUint16($JSCompiler_StaticMethods_jp$self$$.$f$) : $JSCompiler_StaticMethods_jp$self$$.$f$ += 2;
}
function $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_interrupt$self$$) {
  $JSCompiler_StaticMethods_interrupt$self$$.$J$ && !$JSCompiler_StaticMethods_interrupt$self$$.$R$ && ($JSCompiler_StaticMethods_interrupt$self$$.$P$ && ($JSCompiler_StaticMethods_interrupt$self$$.$f$++, $JSCompiler_StaticMethods_interrupt$self$$.$P$ = !1), $JSCompiler_StaticMethods_interrupt$self$$.$J$ = $JSCompiler_StaticMethods_interrupt$self$$.$K$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.$I$ = !1, $JSCompiler_StaticMethods_interrupt$self$$.push($JSCompiler_StaticMethods_interrupt$self$$.$f$), 
  0 === $JSCompiler_StaticMethods_interrupt$self$$.$S$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 0 === $JSCompiler_StaticMethods_interrupt$self$$.$T$ || 255 === $JSCompiler_StaticMethods_interrupt$self$$.$T$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$T$, $JSCompiler_StaticMethods_interrupt$self$$.$j$ -= 13) : 1 === $JSCompiler_StaticMethods_interrupt$self$$.$S$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$j$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$.$f$ = 
  $JSCompiler_StaticMethods_interrupt$self$$.getUint16(($JSCompiler_StaticMethods_interrupt$self$$.$W$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$T$), $JSCompiler_StaticMethods_interrupt$self$$.$j$ -= 19));
}
function $JSCompiler_StaticMethods_interpret$$($JSCompiler_StaticMethods_interpret$self$$) {
  var $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
  $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
  $JSCompiler_StaticMethods_interpret$self$$.$R$ = !1;
  $JSCompiler_StaticMethods_interpret$self$$.$j$ -= $OP_STATES$$[$carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$];
  switch($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$) {
    case 1:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 2:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
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
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 7:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 7;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ << 1 & 255 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 8:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$aa$;
      $JSCompiler_StaticMethods_interpret$self$$.$aa$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$fa$;
      $JSCompiler_StaticMethods_interpret$self$$.$fa$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 9:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 10:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
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
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 15:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 1 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ << 
      7;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 16:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$b$ - 1 & 255;
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 17:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.d = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.e = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 18:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 19:
      $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 20:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 21:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 22:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 23:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ >> 7;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = ($JSCompiler_StaticMethods_interpret$self$$.$a$ << 1 | $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 24:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ += $JSCompiler_StaticMethods_interpret$self$$.getInt8($JSCompiler_StaticMethods_interpret$self$$.$f$);
      break;
    case 25:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 26:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 27:
      $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 28:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 29:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 30:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 31:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 1;
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = ($JSCompiler_StaticMethods_interpret$self$$.$a$ >> 1 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) << 7) & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 236 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 32:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 33:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 34:
      $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
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
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 39:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$ia$[$JSCompiler_StaticMethods_interpret$self$$.$a$ | 
      ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) << 8 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 2) << 8 | ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 16) << 6];
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 2 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 
      8;
      break;
    case 40:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 41:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 42:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
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
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 47:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ ^= 255;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 18;
      break;
    case 48:
      $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 49:
      $JSCompiler_StaticMethods_interpret$self$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 50:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 51:
      $JSCompiler_StaticMethods_interpret$self$$.$i$++;
      break;
    case 52:
      $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 53:
      $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 54:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
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
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$));
      break;
    case 58:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      break;
    case 59:
      $JSCompiler_StaticMethods_interpret$self$$.$i$--;
      break;
    case 60:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 61:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 62:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      break;
    case 63:
      0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1) ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 1, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
      $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -3;
      break;
    case 65:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 66:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      break;
    case 67:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      break;
    case 68:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 69:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 70:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 71:
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 72:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 74:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      break;
    case 75:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      break;
    case 76:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 77:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 78:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 79:
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 80:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 81:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 83:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.e;
      break;
    case 84:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 85:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 86:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 87:
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 88:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 89:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 90:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.d;
      break;
    case 92:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 93:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 94:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 95:
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 96:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 97:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 98:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      break;
    case 99:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      break;
    case 101:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 102:
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
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
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      break;
    case 107:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      break;
    case 108:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 110:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 111:
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
      break;
    case 112:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 113:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 114:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 115:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 116:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 117:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 118:
      $JSCompiler_StaticMethods_interpret$self$$.$j$ = 0;
      $JSCompiler_StaticMethods_interpret$self$$.$P$ = !0;
      $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      break;
    case 119:
      $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 120:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      break;
    case 121:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      break;
    case 122:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      break;
    case 123:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      break;
    case 124:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      break;
    case 125:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      break;
    case 126:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 128:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
      break;
    case 129:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
      break;
    case 130:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 131:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 132:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 133:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 134:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
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
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 139:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 140:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 141:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 142:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
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
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 147:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 148:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 149:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 150:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
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
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 155:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 156:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 157:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 158:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
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
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.d] | 16;
      break;
    case 163:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.e] | 16;
      break;
    case 164:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$h$] | 16;
      break;
    case 165:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$l$] | 16;
      break;
    case 166:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
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
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.d];
      break;
    case 171:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.e];
      break;
    case 172:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$h$];
      break;
    case 173:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$l$];
      break;
    case 174:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))];
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
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.d];
      break;
    case 179:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.e];
      break;
    case 180:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$h$];
      break;
    case 181:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$l$];
      break;
    case 182:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))];
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
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
      break;
    case 187:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
      break;
    case 188:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
      break;
    case 189:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
      break;
    case 190:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
      break;
    case 191:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 192:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 193:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$);
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
      break;
    case 194:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 195:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$);
      break;
    case 196:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 197:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 198:
      $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 199:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 0;
      break;
    case 200:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 201:
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$);
      $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
      break;
    case 202:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 203:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$j$ -= $OP_CB_STATES$$[$carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$];
      switch($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$) {
        case 0:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          break;
        case 1:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          break;
        case 2:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 3:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 4:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 5:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 6:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 11:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 12:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 13:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 14:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 19:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 20:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 21:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 22:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 27:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 28:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 29:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 30:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 51:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 52:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 53:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 54:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d);
          break;
        case 59:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e);
          break;
        case 60:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          break;
        case 61:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          break;
        case 62:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$))));
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 1);
          break;
        case 67:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 1);
          break;
        case 68:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 1);
          break;
        case 69:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 1);
          break;
        case 70:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 1);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 2);
          break;
        case 75:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 2);
          break;
        case 76:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 2);
          break;
        case 77:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 2);
          break;
        case 78:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 2);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 4);
          break;
        case 83:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 4);
          break;
        case 84:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 4);
          break;
        case 85:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 4);
          break;
        case 86:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 4);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 8);
          break;
        case 91:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 8);
          break;
        case 92:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 8);
          break;
        case 93:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 8);
          break;
        case 94:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 8);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 16);
          break;
        case 99:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 16);
          break;
        case 100:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 16);
          break;
        case 101:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 16);
          break;
        case 102:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 16);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 32);
          break;
        case 107:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 32);
          break;
        case 108:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 32);
          break;
        case 109:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 32);
          break;
        case 110:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 32);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 64);
          break;
        case 115:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 64);
          break;
        case 116:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 64);
          break;
        case 117:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 64);
          break;
        case 118:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 64);
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
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.d & 128);
          break;
        case 123:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.e & 128);
          break;
        case 124:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$h$ & 128);
          break;
        case 125:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$l$ & 128);
          break;
        case 126:
          $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & 128);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -2;
          break;
        case 131:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -2;
          break;
        case 132:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -2;
          break;
        case 133:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -2;
          break;
        case 134:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -2);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -3;
          break;
        case 139:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -3;
          break;
        case 140:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -3;
          break;
        case 141:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -3;
          break;
        case 142:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -3);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -5;
          break;
        case 147:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -5;
          break;
        case 148:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -5;
          break;
        case 149:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -5;
          break;
        case 150:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -5);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -9;
          break;
        case 155:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -9;
          break;
        case 156:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -9;
          break;
        case 157:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -9;
          break;
        case 158:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -9);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -17;
          break;
        case 163:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -17;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -17;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -17;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -17);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -33;
          break;
        case 171:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -33;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -33;
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -33;
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -33);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -65;
          break;
        case 179:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -65;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -65;
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -65;
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -65);
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
          $JSCompiler_StaticMethods_interpret$self$$.d &= -129;
          break;
        case 187:
          $JSCompiler_StaticMethods_interpret$self$$.e &= -129;
          break;
        case 188:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ &= -129;
          break;
        case 189:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ &= -129;
          break;
        case 190:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) & -129);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 1;
          break;
        case 195:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 1;
          break;
        case 196:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 1;
          break;
        case 197:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 1;
          break;
        case 198:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 1);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 2;
          break;
        case 203:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 2;
          break;
        case 204:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 2;
          break;
        case 205:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 2;
          break;
        case 206:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 2);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 4;
          break;
        case 211:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 4;
          break;
        case 212:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 4;
          break;
        case 213:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 4;
          break;
        case 214:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 4);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 8;
          break;
        case 219:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 8;
          break;
        case 220:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 8;
          break;
        case 221:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 8;
          break;
        case 222:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 8);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 16;
          break;
        case 227:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 16;
          break;
        case 228:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 16;
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 16;
          break;
        case 230:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 16);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 32;
          break;
        case 235:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 32;
          break;
        case 236:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 32;
          break;
        case 237:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 32;
          break;
        case 238:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 32);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 64;
          break;
        case 243:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 64;
          break;
        case 244:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 64;
          break;
        case 245:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 64;
          break;
        case 246:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 64);
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
          $JSCompiler_StaticMethods_interpret$self$$.d |= 128;
          break;
        case 251:
          $JSCompiler_StaticMethods_interpret$self$$.e |= 128;
          break;
        case 252:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ |= 128;
          break;
        case 253:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ |= 128;
          break;
        case 254:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)) | 128);
          break;
        case 255:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ |= 128;
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$));
      }
      break;
    case 204:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64));
      break;
    case 205:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$ + 2);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$);
      break;
    case 206:
      $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 207:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 8;
      break;
    case 208:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 209:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$);
      $JSCompiler_StaticMethods_interpret$self$$.d = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.e = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
      break;
    case 210:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 211:
      $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_interpret$self$$.$a$);
      break;
    case 212:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 213:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 214:
      $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 215:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 16;
      break;
    case 216:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 217:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
      $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$ba$;
      $JSCompiler_StaticMethods_interpret$self$$.$ba$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
      $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$ca$;
      $JSCompiler_StaticMethods_interpret$self$$.$ca$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$da$;
      $JSCompiler_StaticMethods_interpret$self$$.$da$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$ea$;
      $JSCompiler_StaticMethods_interpret$self$$.$ea$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.$ga$;
      $JSCompiler_StaticMethods_interpret$self$$.$ga$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.$ha$;
      $JSCompiler_StaticMethods_interpret$self$$.$ha$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 218:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 219:
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 220:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 1));
      break;
    case 221:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$j$ -= $OP_DD_STATES$$[$carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$];
      switch($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$) {
        case 9:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 25:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 33:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.$m$ + 1 & 255;
          0 === $JSCompiler_StaticMethods_interpret$self$$.$m$ && ($JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$s$ + 1 & 255);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 41:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.$m$ - 1 & 255;
          255 === $JSCompiler_StaticMethods_interpret$self$$.$m$ && ($JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$s$ - 1 & 255);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
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
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 57:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$));
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$m$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$m$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$m$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$m$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.d;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.e;
          break;
        case 100:
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$m$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$.$s$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.d;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.e;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 109:
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 112:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.d);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.e);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 116:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 117:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 119:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 124:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$s$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$m$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$s$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$m$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$s$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$m$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$s$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$m$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$s$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$m$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 203:
          $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 225:
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$));
          $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
          break;
        case 227:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_setIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$));
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.$i$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$i$ = $JSCompiler_StaticMethods_getIXHIXL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$)), 
          $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      }
      break;
    case 222:
      $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 223:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 24;
      break;
    case 224:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 225:
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$));
      $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
      break;
    case 226:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 227:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$));
      $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.$i$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
      break;
    case 228:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 229:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
      break;
    case 230:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++)] | 16;
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
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.d;
      $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$h$;
      $JSCompiler_StaticMethods_interpret$self$$.$h$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.e;
      $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$l$;
      $JSCompiler_StaticMethods_interpret$self$$.$l$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
      break;
    case 236:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 4));
      break;
    case 237:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$);
      var $location$$inline_116$$;
      $JSCompiler_StaticMethods_interpret$self$$.$j$ -= $OP_ED_STATES$$[$carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$];
      switch($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$) {
        case 64:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$b$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 65:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 66:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 67:
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
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
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = 0;
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
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
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$);
          $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
          $JSCompiler_StaticMethods_interpret$self$$.$J$ = $JSCompiler_StaticMethods_interpret$self$$.$K$;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$S$ = 0;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 71:
          $JSCompiler_StaticMethods_interpret$self$$.$W$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 72:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$c$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 73:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 74:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 75:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 79:
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 80:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.d];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 81:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.d);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 82:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 83:
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 86:
        ;
        case 118:
          $JSCompiler_StaticMethods_interpret$self$$.$S$ = 1;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 87:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$W$;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$Z$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | ($JSCompiler_StaticMethods_interpret$self$$.$K$ ? 4 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 88:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.e];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 89:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.e);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 90:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 91:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.d = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
          $JSCompiler_StaticMethods_interpret$self$$.e = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 95:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSSMS$Utils$$.$rndInt$(255);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$Z$[$JSCompiler_StaticMethods_interpret$self$$.$a$] | ($JSCompiler_StaticMethods_interpret$self$$.$K$ ? 4 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$h$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 97:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 98:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 103:
          $location$$inline_116$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($location$$inline_116$$);
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($location$$inline_116$$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 
          4 | ($JSCompiler_StaticMethods_interpret$self$$.$a$ & 15) << 4);
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 240 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 
          15;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$l$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 105:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 106:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 107:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 111:
          $location$$inline_116$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($location$$inline_116$$);
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($location$$inline_116$$, ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 
          15) << 4 | $JSCompiler_StaticMethods_interpret$self$$.$a$ & 15);
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$a$ & 240 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 
          4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_interpret$self$$.$i$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 120:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 121:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 122:
          $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$i$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 123:
          $JSCompiler_StaticMethods_interpret$self$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$ += 2;
          break;
        case 160:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ + 
          $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 
          8 | ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 2 ? 32 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 161:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 
          0 : 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 162:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, 
          $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 163:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 
          1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 168:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ + 
          $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 
          8 | ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 2 ? 32 : 0);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 169:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 
          0 : 4;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 170:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, 
          $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 171:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 
          1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 176:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ + 
          $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 
          8 | ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 2 ? 32 : 0);
          0 !== $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 177:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 
          0 : 4;
          0 !== ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 4) && 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64) ? 
          ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
          break;
        case 178:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, 
          $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 128 === ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 179:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 
          1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 184:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ + 
          $JSCompiler_StaticMethods_interpret$self$$.$a$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 193 | ($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 4 : 0) | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 
          8 | ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 2 ? 32 : 0);
          0 !== $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 185:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 1 | 2;
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ |= 0 === $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$) ? 
          0 : 4;
          0 !== ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 4) && 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 64) ? 
          ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$g$ & 248 | $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$;
          break;
        case 186:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$.$v$, 
          $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$), $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        case 187:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$.$v$, $JSCompiler_StaticMethods_interpret$self$$.$c$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$);
          0 !== $JSCompiler_StaticMethods_interpret$self$$.$b$ ? ($JSCompiler_StaticMethods_interpret$self$$.$j$ -= 5, $JSCompiler_StaticMethods_interpret$self$$.$f$--) : $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          255 < $JSCompiler_StaticMethods_interpret$self$$.$l$ + $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ ? ($JSCompiler_StaticMethods_interpret$self$$.$g$ |= 
          1, $JSCompiler_StaticMethods_interpret$self$$.$g$ |= 16) : ($JSCompiler_StaticMethods_interpret$self$$.$g$ &= -2, $JSCompiler_StaticMethods_interpret$self$$.$g$ &= -17);
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = 0 !== ($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 128) ? $JSCompiler_StaticMethods_interpret$self$$.$g$ | 
          2 : $JSCompiler_StaticMethods_interpret$self$$.$g$ & -3;
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$)), 
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
      }
      break;
    case 238:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++)];
      break;
    case 239:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 40;
      break;
    case 240:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 241:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$);
      $JSCompiler_StaticMethods_interpret$self$$.$a$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ >> 8;
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ & 255;
      $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
      break;
    case 242:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 243:
      $JSCompiler_StaticMethods_interpret$self$$.$J$ = $JSCompiler_StaticMethods_interpret$self$$.$K$ = !1;
      $JSCompiler_StaticMethods_interpret$self$$.$R$ = !0;
      break;
    case 244:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 === ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 245:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$a$ << 8 | $JSCompiler_StaticMethods_interpret$self$$.$g$);
      break;
    case 246:
      $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++)];
      break;
    case 247:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$);
      $JSCompiler_StaticMethods_interpret$self$$.$f$ = 48;
      break;
    case 248:
      $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 249:
      $JSCompiler_StaticMethods_interpret$self$$.$i$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$);
      break;
    case 250:
      $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$, 0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 251:
      $JSCompiler_StaticMethods_interpret$self$$.$J$ = $JSCompiler_StaticMethods_interpret$self$$.$K$ = $JSCompiler_StaticMethods_interpret$self$$.$R$ = !0;
      break;
    case 252:
      $JSCompiler_StaticMethods_interpret$self$$.call(0 !== ($JSCompiler_StaticMethods_interpret$self$$.$g$ & 128));
      break;
    case 253:
      $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
      $JSCompiler_StaticMethods_interpret$self$$.$j$ -= $OP_DD_STATES$$[$carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$];
      switch($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$) {
        case 9:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 25:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 33:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 34:
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 35:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$o$ + 1 & 255;
          0 === $JSCompiler_StaticMethods_interpret$self$$.$o$ && ($JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.$u$ + 1 & 255);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
          break;
        case 41:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$f$++)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 43:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$o$ - 1 & 255;
          255 === $JSCompiler_StaticMethods_interpret$self$$.$o$ && ($JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.$u$ - 1 & 255);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++);
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
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.getUint8(++$JSCompiler_StaticMethods_interpret$self$$.$f$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 57:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$i$));
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$u$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$u$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$u$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$.d = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$u$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$.e = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.d;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.e;
          break;
        case 100:
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$.$u$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$b$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$c$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.d;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.e;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$u$;
          break;
        case 109:
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$.$l$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$.$o$ = $JSCompiler_StaticMethods_interpret$self$$.$a$;
          break;
        case 112:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$b$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 113:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 114:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.d);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.e);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 116:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$h$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 117:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$l$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 119:
          $JSCompiler_StaticMethods_interpret$self$$.setUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$), $JSCompiler_StaticMethods_interpret$self$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 124:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$u$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.$o$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$u$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.$o$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))] | 16;
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$u$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.$o$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$u$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.$o$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_interpret$self$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$))];
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$u$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.$o$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$)));
          $JSCompiler_StaticMethods_interpret$self$$.$f$++;
          break;
        case 203:
          $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 225:
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$));
          $JSCompiler_StaticMethods_interpret$self$$.$i$ += 2;
          break;
        case 227:
          $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          $JSCompiler_StaticMethods_setIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint16($JSCompiler_StaticMethods_interpret$self$$.$i$));
          $JSCompiler_StaticMethods_interpret$self$$.setUint16($JSCompiler_StaticMethods_interpret$self$$.$i$, $carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$);
          break;
        case 229:
          $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$.$f$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$.$i$ = $JSCompiler_StaticMethods_getIYHIYL$$($JSCompiler_StaticMethods_interpret$self$$);
          break;
        default:
          $JSSMS$Utils$$.console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$$.$toHex$($carry$$inline_76_carry$$inline_82_carry$$inline_85_carry$$inline_88_opcode_opcode$$inline_110_opcode$$inline_114_opcode$$inline_122_opcode$$inline_98_temp_temp$$inline_101_temp$$inline_104_temp$$inline_107_temp$$inline_111_temp$$inline_115_temp$$inline_123_temp$$inline_79_temp$$inline_91_value$$inline_119_value$$inline_311_value$$inline_314_value$$inline_317_value$$inline_320_value$$inline_327_value$$inline_330$$)), 
          $JSCompiler_StaticMethods_interpret$self$$.$f$--;
      }
      break;
    case 254:
      $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$, $JSCompiler_StaticMethods_interpret$self$$.getUint8($JSCompiler_StaticMethods_interpret$self$$.$f$++));
      break;
    case 255:
      $JSCompiler_StaticMethods_interpret$self$$.push($JSCompiler_StaticMethods_interpret$self$$.$f$), $JSCompiler_StaticMethods_interpret$self$$.$f$ = 56;
  }
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$F$:[]};
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
function $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_readRom16bit$self$$, $address$$16$$) {
  return $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$16$$ & 16383) ? $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$16$$ >> 14].getUint16($address$$16$$ & 16383, !0) : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$16$$ >> 14].getUint8($address$$16$$ & 16383) | $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$16$$ >> 14].getUint8($address$$16$$ & 16383) << 8 : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$16$$ >> 14][$address$$16$$ & 16383] & 
  255 | ($JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$16$$ >> 14][$address$$16$$ & 16383] & 255) << 8;
}
function $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_readRom8bit$self$$, $address$$15$$) {
  return $SUPPORT_DATAVIEW$$ ? $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$15$$ >> 14].getUint8($address$$15$$ & 16383) : $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$15$$ >> 14][$address$$15$$ & 16383] & 255;
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $index$$46$$, $address$$13_address$$inline_127$$) {
  var $code$$inline_134_toHex$$4$$ = $JSSMS$Utils$$.$toHex$, $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_location$$inline_130_toHex$$inline_128$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$13_address$$inline_127$$, $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";';
  $address$$13_address$$inline_127$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD " + $index$$46$$ + ",BC";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD " + $index$$46$$ + ",DE";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.getDE()));";
      break;
    case 33:
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ = $code$$inline_134_toHex$$4$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$));
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "," + $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.set" + $index$$46$$ + "(" + $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ + ");";
      $address$$13_address$$inline_127$$ += 2;
      break;
    case 34:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ = $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ + ")," + $index$$46$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(" + $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ + ", this." + $index$$46$$.toLowerCase() + "L);this.setUint8(" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$ + 1) + ", this." + $index$$46$$.toLowerCase() + "H);";
      $address$$13_address$$inline_127$$ += 2;
      break;
    case 35:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "INC " + $index$$46$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.inc" + $index$$46$$ + "();";
      break;
    case 36:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "INC " + $index$$46$$ + "H *";
      break;
    case 37:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "DEC " + $index$$46$$ + "H *";
      break;
    case 38:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H," + $code$$inline_134_toHex$$4$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$)) + " *";
      $address$$13_address$$inline_127$$++;
      break;
    case 41:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD " + $index$$46$$ + "  " + $index$$46$$;
      break;
    case 42:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + " (" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.ixL = this.getUint8(" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");this.ixH = this.getUint8(" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$ + 1) + ");";
      $address$$13_address$$inline_127$$ += 2;
      break;
    case 43:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "DEC " + $index$$46$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.dec" + $index$$46$$ + "();";
      break;
    case 44:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "INC " + $index$$46$$ + "L *";
      break;
    case 45:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "DEC " + $index$$46$$ + "L *";
      break;
    case 46:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L," + $code$$inline_134_toHex$$4$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$));
      $address$$13_address$$inline_127$$++;
      break;
    case 52:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "INC (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.incMem(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 53:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "DEC (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.decMem(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 54:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ = $code$$inline_134_toHex$$4$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$ + 1));
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")," + $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", " + $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ + ");";
      $address$$13_address$$inline_127$$ += 2;
      break;
    case 57:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD " + $index$$46$$ + " SP";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.set" + $index$$46$$ + "(this.add16(this.get" + $index$$46$$ + "(), this.sp));";
      break;
    case 68:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD B," + $index$$46$$ + "H *";
      break;
    case 69:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD B," + $index$$46$$ + "L *";
      break;
    case 70:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD B,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.b = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 76:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD C," + $index$$46$$ + "H *";
      break;
    case 77:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD C," + $index$$46$$ + "L *";
      break;
    case 78:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD C,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.c = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 84:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD D," + $index$$46$$ + "H *";
      break;
    case 85:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD D," + $index$$46$$ + "L *";
      break;
    case 86:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD D,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.d = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 92:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD E," + $index$$46$$ + "H *";
      break;
    case 93:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD E," + $index$$46$$ + "L *";
      break;
    case 94:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD E,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.e = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 96:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H,B *";
      break;
    case 97:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H,C *";
      break;
    case 98:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H,D *";
      break;
    case 99:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H,E *";
      break;
    case 100:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "H*";
      break;
    case 101:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H," + $index$$46$$ + "L *";
      break;
    case 102:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD H,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.h = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 103:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "H,A *";
      break;
    case 104:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L,B *";
      break;
    case 105:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L,C *";
      break;
    case 106:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L,D *";
      break;
    case 107:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L,E *";
      break;
    case 108:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "H *";
      break;
    case 109:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L," + $index$$46$$ + "L *";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "";
      break;
    case 110:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD L,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.l = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 111:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD " + $index$$46$$ + "L,A *";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this." + $index$$46$$.toLowerCase() + "L = this.a;";
      break;
    case 112:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),B";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.b);";
      $address$$13_address$$inline_127$$++;
      break;
    case 113:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),C";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.c);";
      $address$$13_address$$inline_127$$++;
      break;
    case 114:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),D";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.d);";
      $address$$13_address$$inline_127$$++;
      break;
    case 115:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),E";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.e);";
      $address$$13_address$$inline_127$$++;
      break;
    case 116:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),H";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.h);";
      $address$$13_address$$inline_127$$++;
      break;
    case 117:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),L";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.l);";
      $address$$13_address$$inline_127$$++;
      break;
    case 119:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "),A";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.setUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ", this.a);";
      $address$$13_address$$inline_127$$++;
      break;
    case 124:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD A," + $index$$46$$ + "H *";
      break;
    case 125:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD A," + $index$$46$$ + "L *";
      break;
    case 126:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.a = this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ");";
      $address$$13_address$$inline_127$$++;
      break;
    case 132:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD A," + $index$$46$$ + "H *";
      break;
    case 133:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD A," + $index$$46$$ + "L *";
      break;
    case 134:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADD A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.add_a(this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "));";
      $address$$13_address$$inline_127$$++;
      break;
    case 140:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADC A," + $index$$46$$ + "H *";
      break;
    case 141:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADC A," + $index$$46$$ + "L *";
      break;
    case 142:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "ADC A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.adc_a(this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "));";
      $address$$13_address$$inline_127$$++;
      break;
    case 148:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "SUB " + $index$$46$$ + "H *";
      break;
    case 149:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "SUB " + $index$$46$$ + "L *";
      break;
    case 150:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "SUB A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.sub_a(this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "));";
      $address$$13_address$$inline_127$$++;
      break;
    case 156:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "SBC A," + $index$$46$$ + "H *";
      break;
    case 157:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "SBC A," + $index$$46$$ + "L *";
      break;
    case 158:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "SBC A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.sbc_a(this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "));";
      $address$$13_address$$inline_127$$++;
      break;
    case 164:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "AND " + $index$$46$$ + "H *";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 165:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "AND " + $index$$46$$ + "L *";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a &= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 166:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "AND A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a &= this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")] | F_HALFCARRY;";
      $address$$13_address$$inline_127$$++;
      break;
    case 172:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "XOR A " + $index$$46$$ + "H*";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 173:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "XOR A " + $index$$46$$ + "L*";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 174:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "XOR A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")];";
      $address$$13_address$$inline_127$$++;
      break;
    case 180:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "OR A " + $index$$46$$ + "H*";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "H];";
      break;
    case 181:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "OR A " + $index$$46$$ + "L*";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a |= this." + $index$$46$$.toLowerCase() + "L];";
      break;
    case 182:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "OR A,(" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.f = this.SZP_TABLE[this.a |= this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")];";
      $address$$13_address$$inline_127$$++;
      break;
    case 188:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "CP " + $index$$46$$ + "H *";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "H);";
      break;
    case 189:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "CP " + $index$$46$$ + "L *";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.cp_a(this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 190:
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "CP (" + $index$$46$$ + "+" + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.cp_a(this.getUint8(this.get" + $index$$46$$ + "() + " + $code$$inline_134_toHex$$4$$($code$$5_location$$25_offset$$16_opcode$$inline_131$$) + "));";
      $address$$13_address$$inline_127$$++;
      break;
    case 203:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = $JSSMS$Utils$$.$toHex$;
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "location = this.get" + $index$$46$$ + "() + " + $inst$$3_location$$inline_130_toHex$$inline_128$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$++)) + " & 0xFFFF;";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$, $address$$13_address$$inline_127$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$ = [$code$$5_location$$25_offset$$16_opcode$$inline_131$$];
      var $inst$$inline_133$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode", $code$$inline_134_toHex$$4$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$13_address$$inline_127$$++;
      switch($code$$5_location$$25_offset$$16_opcode$$inline_131$$) {
        case 0:
          $inst$$inline_133$$ = "LD B,RLC (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.b = this.rlc(this.getUint8(location)); this.setUint8(location, this.b);";
          break;
        case 1:
          $inst$$inline_133$$ = "LD C,RLC (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.c = this.rlc(this.getUint8(location)); this.setUint8(location, this.c);";
          break;
        case 2:
          $inst$$inline_133$$ = "LD D,RLC (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.d = this.rlc(this.getUint8(location)); this.setUint8(location, this.d);";
          break;
        case 3:
          $inst$$inline_133$$ = "LD E,RLC (" + $index$$46$$ + ")";
          break;
        case 4:
          $inst$$inline_133$$ = "LD H,RLC (" + $index$$46$$ + ")";
          break;
        case 5:
          $inst$$inline_133$$ = "LD L,RLC (" + $index$$46$$ + ")";
          break;
        case 6:
          $inst$$inline_133$$ = "RLC (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.setUint8(location, this.rlc(this.getUint8(location)));";
          break;
        case 7:
          $inst$$inline_133$$ = "LD A,RLC (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.a = this.rlc(this.getUint8(location)); this.setUint8(location, this.a);";
          break;
        case 8:
          $inst$$inline_133$$ = "LD B,RRC (" + $index$$46$$ + ")";
          break;
        case 9:
          $inst$$inline_133$$ = "LD C,RRC (" + $index$$46$$ + ")";
          break;
        case 10:
          $inst$$inline_133$$ = "LD D,RRC (" + $index$$46$$ + ")";
          break;
        case 11:
          $inst$$inline_133$$ = "LD E,RRC (" + $index$$46$$ + ")";
          break;
        case 12:
          $inst$$inline_133$$ = "LD H,RRC (" + $index$$46$$ + ")";
          break;
        case 13:
          $inst$$inline_133$$ = "LD L,RRC (" + $index$$46$$ + ")";
          break;
        case 14:
          $inst$$inline_133$$ = "RRC (" + $index$$46$$ + ")";
          break;
        case 15:
          $inst$$inline_133$$ = "LD A,RRC (" + $index$$46$$ + ")";
          break;
        case 16:
          $inst$$inline_133$$ = "LD B,RL (" + $index$$46$$ + ")";
          break;
        case 17:
          $inst$$inline_133$$ = "LD C,RL (" + $index$$46$$ + ")";
          break;
        case 18:
          $inst$$inline_133$$ = "LD D,RL (" + $index$$46$$ + ")";
          break;
        case 19:
          $inst$$inline_133$$ = "LD E,RL (" + $index$$46$$ + ")";
          break;
        case 20:
          $inst$$inline_133$$ = "LD H,RL (" + $index$$46$$ + ")";
          break;
        case 21:
          $inst$$inline_133$$ = "LD L,RL (" + $index$$46$$ + ")";
          break;
        case 22:
          $inst$$inline_133$$ = "RL (" + $index$$46$$ + ")";
          break;
        case 23:
          $inst$$inline_133$$ = "LD A,RL (" + $index$$46$$ + ")";
          break;
        case 24:
          $inst$$inline_133$$ = "LD B,RR (" + $index$$46$$ + ")";
          break;
        case 25:
          $inst$$inline_133$$ = "LD C,RR (" + $index$$46$$ + ")";
          break;
        case 26:
          $inst$$inline_133$$ = "LD D,RR (" + $index$$46$$ + ")";
          break;
        case 27:
          $inst$$inline_133$$ = "LD E,RR (" + $index$$46$$ + ")";
          break;
        case 28:
          $inst$$inline_133$$ = "LD H,RR (" + $index$$46$$ + ")";
          break;
        case 29:
          $inst$$inline_133$$ = "LD L,RR (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.l = this.rr(this.getUint8(location)); this.setUint8(location, this.l);";
          break;
        case 30:
          $inst$$inline_133$$ = "RR (" + $index$$46$$ + ")";
          break;
        case 31:
          $inst$$inline_133$$ = "LD A,RR (" + $index$$46$$ + ")";
          $code$$inline_134_toHex$$4$$ = $inst$$3_location$$inline_130_toHex$$inline_128$$ + "this.a = this.rr(this.getUint8(location)); this.setUint8(location, this.a);";
          break;
        case 32:
          $inst$$inline_133$$ = "LD B,SLA (" + $index$$46$$ + ")";
          break;
        case 33:
          $inst$$inline_133$$ = "LD C,SLA (" + $index$$46$$ + ")";
          break;
        case 34:
          $inst$$inline_133$$ = "LD D,SLA (" + $index$$46$$ + ")";
          break;
        case 35:
          $inst$$inline_133$$ = "LD E,SLA (" + $index$$46$$ + ")";
          break;
        case 36:
          $inst$$inline_133$$ = "LD H,SLA (" + $index$$46$$ + ")";
          break;
        case 37:
          $inst$$inline_133$$ = "LD L,SLA (" + $index$$46$$ + ")";
          break;
        case 38:
          $inst$$inline_133$$ = "SLA (" + $index$$46$$ + ")";
          break;
        case 39:
          $inst$$inline_133$$ = "LD A,SLA (" + $index$$46$$ + ")";
          break;
        case 40:
          $inst$$inline_133$$ = "LD B,SRA (" + $index$$46$$ + ")";
          break;
        case 41:
          $inst$$inline_133$$ = "LD C,SRA (" + $index$$46$$ + ")";
          break;
        case 42:
          $inst$$inline_133$$ = "LD D,SRA (" + $index$$46$$ + ")";
          break;
        case 43:
          $inst$$inline_133$$ = "LD E,SRA (" + $index$$46$$ + ")";
          break;
        case 44:
          $inst$$inline_133$$ = "LD H,SRA (" + $index$$46$$ + ")";
          break;
        case 45:
          $inst$$inline_133$$ = "LD L,SRA (" + $index$$46$$ + ")";
          break;
        case 46:
          $inst$$inline_133$$ = "SRA (" + $index$$46$$ + ")";
          break;
        case 47:
          $inst$$inline_133$$ = "LD A,SRA (" + $index$$46$$ + ")";
          break;
        case 48:
          $inst$$inline_133$$ = "LD B,SLL (" + $index$$46$$ + ")";
          break;
        case 49:
          $inst$$inline_133$$ = "LD C,SLL (" + $index$$46$$ + ")";
          break;
        case 50:
          $inst$$inline_133$$ = "LD D,SLL (" + $index$$46$$ + ")";
          break;
        case 51:
          $inst$$inline_133$$ = "LD E,SLL (" + $index$$46$$ + ")";
          break;
        case 52:
          $inst$$inline_133$$ = "LD H,SLL (" + $index$$46$$ + ")";
          break;
        case 53:
          $inst$$inline_133$$ = "LD L,SLL (" + $index$$46$$ + ")";
          break;
        case 54:
          $inst$$inline_133$$ = "SLL (" + $index$$46$$ + ") *";
          break;
        case 55:
          $inst$$inline_133$$ = "LD A,SLL (" + $index$$46$$ + ")";
          break;
        case 56:
          $inst$$inline_133$$ = "LD B,SRL (" + $index$$46$$ + ")";
          break;
        case 57:
          $inst$$inline_133$$ = "LD C,SRL (" + $index$$46$$ + ")";
          break;
        case 58:
          $inst$$inline_133$$ = "LD D,SRL (" + $index$$46$$ + ")";
          break;
        case 59:
          $inst$$inline_133$$ = "LD E,SRL (" + $index$$46$$ + ")";
          break;
        case 60:
          $inst$$inline_133$$ = "LD H,SRL (" + $index$$46$$ + ")";
          break;
        case 61:
          $inst$$inline_133$$ = "LD L,SRL (" + $index$$46$$ + ")";
          break;
        case 62:
          $inst$$inline_133$$ = "SRL (" + $index$$46$$ + ")";
          break;
        case 63:
          $inst$$inline_133$$ = "LD A,SRL (" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "BIT 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "RES 7,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 0,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 1,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 2,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 3,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 4,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 5,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 6,(" + $index$$46$$ + ")";
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
          $inst$$inline_133$$ = "SET 7,(" + $index$$46$$ + ")";
      }
      $address$$13_address$$inline_127$$++;
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = $inst$$inline_133$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = $code$$inline_134_toHex$$4$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_132_operand$$2$$);
      break;
    case 225:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "POP " + $index$$46$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.set" + $index$$46$$ + "(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 227:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "EX SP,(" + $index$$46$$ + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "temp = this.get" + $index$$46$$ + "();this.set" + $index$$46$$ + "(this.getUint16(this.sp));this.setUint8(this.sp, temp & 0xFF);this.setUint8(this.sp + 1, temp >> 8);";
      break;
    case 229:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "PUSH " + $index$$46$$;
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.push2(this." + $index$$46$$.toLowerCase() + "H, this." + $index$$46$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "JP (" + $index$$46$$ + ")";
      $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.pc = this.get" + $index$$46$$ + "(); return;";
      $address$$13_address$$inline_127$$ = null;
      break;
    case 249:
      $inst$$3_location$$inline_130_toHex$$inline_128$$ = "LD SP," + $index$$46$$, $code$$5_location$$25_offset$$16_opcode$$inline_131$$ = "this.sp = this.get" + $index$$46$$ + "();";
  }
  return {$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_location$$inline_130_toHex$$inline_128$$, code:$code$$5_location$$25_offset$$16_opcode$$inline_131$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$13_address$$inline_127$$};
}
function $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) {
  var $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = $JSSMS$Utils$$.$toHex$, $opcode$$6_options$$inline_156$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$), $opcodesArray_toHex$$inline_157$$ = [$opcode$$6_options$$inline_156$$], $address$$inline_137_inst_toHex$$inline_146$$ = "Unknown Opcode", $currAddr_defaultInstruction$$inline_158$$ = 
  $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$, $address$$inline_145_target$$51$$ = null, $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = 'throw "Unimplemented opcode ' + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($opcode$$6_options$$inline_156$$) + '";';
  $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
  switch($opcode$$6_options$$inline_156$$) {
    case 0:
      $address$$inline_137_inst_toHex$$inline_146$$ = "NOP";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 1:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD BC," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setBC(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 2:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (BC),A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getBC(), this.a);";
      break;
    case 3:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC BC";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.incBC();";
      break;
    case 4:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.inc8(this.b);";
      break;
    case 5:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.dec8(this.b);";
      break;
    case 6:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 7:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RLCA";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.rlca_a();";
      break;
    case 8:
      $address$$inline_137_inst_toHex$$inline_146$$ = "EX AF AF'";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.exAF();";
      break;
    case 9:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD HL,BC";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
      break;
    case 10:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,(BC)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.getUint8(this.getBC());";
      break;
    case 11:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC BC";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.decBC();";
      break;
    case 12:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.inc8(this.c);";
      break;
    case 13:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.dec8(this.c);";
      break;
    case 14:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 15:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RRCA";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.rrca_a();";
      break;
    case 16:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$U$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + 1);
      $address$$inline_137_inst_toHex$$inline_146$$ = "DJNZ (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.b - 0x01 & 0xFF;if (this.b !== 0x00) {this.tstates -= 0x05;this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 17:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD DE," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setDE(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 18:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (DE),A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getDE(), this.a);";
      break;
    case 19:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC DE";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.incDE();";
      break;
    case 20:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.inc8(this.d);";
      break;
    case 21:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.dec8(this.d);";
      break;
    case 22:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 23:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RLA";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.rla_a();";
      break;
    case 24:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$U$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + 1);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JR (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = null;
      break;
    case 25:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD HL,DE";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
      break;
    case 26:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,(DE)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.getUint8(this.getDE());";
      break;
    case 27:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC DE";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.decDE();";
      break;
    case 28:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.inc8(this.e);";
      break;
    case 29:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.dec8(this.e);";
      break;
    case 30:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 31:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RRA";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.rra_a();";
      break;
    case 32:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$U$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + 1);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JR NZ,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if (!((this.f & F_ZERO) !== 0x00)) {this.tstates -= 0x05;this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 33:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD HL," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 34:
      $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + "),HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ", this.l);this.setUint8(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + 1) + ", this.h);";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 35:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.incHL();";
      break;
    case 36:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.inc8(this.h);";
      break;
    case 37:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.dec8(this.h);";
      break;
    case 38:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 39:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DAA";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.daa();";
      break;
    case 40:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$U$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + 1);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JR Z,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) !== 0x00) {this.tstates -= 0x05;this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 41:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD HL,HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
      break;
    case 42:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD HL,(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(this.getUint16(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + "));";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 43:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.decHL();";
      break;
    case 44:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.inc8(this.l);";
      break;
    case 45:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.dec8(this.l);";
      break;
    case 46:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 47:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CPL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cpl_a();";
      break;
    case 48:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$U$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + 1);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JR NC,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if (!((this.f & F_CARRY) !== 0x00)) {this.tstates -= 0x05;this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 49:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD SP," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sp = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 50:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + "),A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ", this.a);";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 51:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC SP";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sp++;";
      break;
    case 52:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC (HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.incMem(this.getHL());";
      break;
    case 53:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC (HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.decMem(this.getHL());";
      break;
    case 54:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL)," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 55:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SCF";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
      break;
    case 56:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$U$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + 1);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JR C,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) !== 0x00) {this.tstates -= 0x05;this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 57:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD HL,SP";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
      break;
    case 58:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.getUint8(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 59:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC SP";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sp--;";
      break;
    case 60:
      $address$$inline_137_inst_toHex$$inline_146$$ = "INC A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.inc8(this.a);";
      break;
    case 61:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DEC A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.dec8(this.a);";
      break;
    case 62:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ";";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 63:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CCF";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.ccf();";
      break;
    case 64:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 65:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.c;";
      break;
    case 66:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.d;";
      break;
    case 67:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.e;";
      break;
    case 68:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.h;";
      break;
    case 69:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.l;";
      break;
    case 70:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.getUint8(this.getHL());";
      break;
    case 71:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD B,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.b = this.a;";
      break;
    case 72:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.b;";
      break;
    case 73:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 74:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.d;";
      break;
    case 75:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.e;";
      break;
    case 76:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.h;";
      break;
    case 77:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.l;";
      break;
    case 78:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.getUint8(this.getHL());";
      break;
    case 79:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD C,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.c = this.a;";
      break;
    case 80:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.b;";
      break;
    case 81:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.c;";
      break;
    case 82:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 83:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.e;";
      break;
    case 84:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.h;";
      break;
    case 85:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.l;";
      break;
    case 86:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.getUint8(this.getHL());";
      break;
    case 87:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD D,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.d = this.a;";
      break;
    case 88:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.b;";
      break;
    case 89:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.c;";
      break;
    case 90:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.d;";
      break;
    case 91:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 92:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.h;";
      break;
    case 93:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.l;";
      break;
    case 94:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.getUint8(this.getHL());";
      break;
    case 95:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD E,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.e = this.a;";
      break;
    case 96:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.b;";
      break;
    case 97:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.c;";
      break;
    case 98:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.d;";
      break;
    case 99:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.e;";
      break;
    case 100:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 101:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.l;";
      break;
    case 102:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.getUint8(this.getHL());";
      break;
    case 103:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD H,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.h = this.a;";
      break;
    case 104:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.b;";
      break;
    case 105:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.c;";
      break;
    case 106:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.d;";
      break;
    case 107:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.e;";
      break;
    case 108:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.h;";
      break;
    case 109:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 110:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.getUint8(this.getHL());";
      break;
    case 111:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD L,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.l = this.a;";
      break;
    case 112:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.b);";
      break;
    case 113:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.c);";
      break;
    case 114:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.d);";
      break;
    case 115:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.e);";
      break;
    case 116:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.h);";
      break;
    case 117:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.l);";
      break;
    case 118:
      $address$$inline_137_inst_toHex$$inline_146$$ = "HALT";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.tstates = 0x00;" + ("this.halt = true; this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ - 1) + "; return;");
      break;
    case 119:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD (HL),A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setUint8(this.getHL(), this.a);";
      break;
    case 120:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.b;";
      break;
    case 121:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.c;";
      break;
    case 122:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.d;";
      break;
    case 123:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.e;";
      break;
    case 124:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.h;";
      break;
    case 125:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.l;";
      break;
    case 126:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = this.getUint8(this.getHL());";
      break;
    case 127:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "";
      break;
    case 128:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.b);";
      break;
    case 129:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.c);";
      break;
    case 130:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.d);";
      break;
    case 131:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.e);";
      break;
    case 132:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.h);";
      break;
    case 133:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.l);";
      break;
    case 134:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.getUint8(this.getHL()));";
      break;
    case 135:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(this.a);";
      break;
    case 136:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.b);";
      break;
    case 137:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.c);";
      break;
    case 138:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.d);";
      break;
    case 139:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.e);";
      break;
    case 140:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.h);";
      break;
    case 141:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.l);";
      break;
    case 142:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.getUint8(this.getHL()));";
      break;
    case 143:
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(this.a);";
      break;
    case 144:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.b);";
      break;
    case 145:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.c);";
      break;
    case 146:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.d);";
      break;
    case 147:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.e);";
      break;
    case 148:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.h);";
      break;
    case 149:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.l);";
      break;
    case 150:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.getUint8(this.getHL()));";
      break;
    case 151:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(this.a);";
      break;
    case 152:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.b);";
      break;
    case 153:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.c);";
      break;
    case 154:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.d);";
      break;
    case 155:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.e);";
      break;
    case 156:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.h);";
      break;
    case 157:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.l);";
      break;
    case 158:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.getUint8(this.getHL()));";
      break;
    case 159:
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(this.a);";
      break;
    case 160:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
      break;
    case 161:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
      break;
    case 162:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
      break;
    case 163:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
      break;
    case 164:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
      break;
    case 165:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
      break;
    case 166:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= this.getUint8(this.getHL())] | F_HALFCARRY;";
      break;
    case 167:
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
      break;
    case 168:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
      break;
    case 169:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
      break;
    case 170:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
      break;
    case 171:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
      break;
    case 172:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
      break;
    case 173:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
      break;
    case 174:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= this.getUint8(this.getHL())];";
      break;
    case 175:
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.a = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$(0) + "; this.f = this.SZP_TABLE[0x00];";
      break;
    case 176:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
      break;
    case 177:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
      break;
    case 178:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
      break;
    case 179:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
      break;
    case 180:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
      break;
    case 181:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
      break;
    case 182:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= this.getUint8(this.getHL())];";
      break;
    case 183:
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a];";
      break;
    case 184:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,B";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.b);";
      break;
    case 185:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.c);";
      break;
    case 186:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,D";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.d);";
      break;
    case 187:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,E";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.e);";
      break;
    case 188:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,H";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.h);";
      break;
    case 189:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,L";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.l);";
      break;
    case 190:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,(HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.getUint8(this.getHL()));";
      break;
    case 191:
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP A,A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(this.a);";
      break;
    case 192:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET NZ";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) === 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 193:
      $address$$inline_137_inst_toHex$$inline_146$$ = "POP BC";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setBC(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 194:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP NZ,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) === 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 195:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = null;
      break;
    case 196:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL NZ (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) === 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 197:
      $address$$inline_137_inst_toHex$$inline_146$$ = "PUSH BC";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push2(this.b, this.c);";
      break;
    case 198:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADD A," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.add_a(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 199:
      $address$$inline_145_target$$51$$ = 0;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 200:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET Z";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) !== 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 201:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.pc = this.getUint16(this.sp); this.sp += 0x02; return;";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = null;
      break;
    case 202:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP Z,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) !== 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 203:
      $address$$inline_137_inst_toHex$$inline_146$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$;
      $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_137_inst_toHex$$inline_146$$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = [$JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$];
      var $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "Unimplemented 0xCB prefixed opcode", $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $address$$inline_137_inst_toHex$$inline_146$$, $code$$inline_142_currAddr$$inline_150$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
      $address$$inline_137_inst_toHex$$inline_146$$++;
      switch($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$) {
        case 0:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.rlc(this.b);";
          break;
        case 1:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.rlc(this.c);";
          break;
        case 2:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.rlc(this.d);";
          break;
        case 3:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.rlc(this.e);";
          break;
        case 4:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.rlc(this.h);";
          break;
        case 5:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.rlc(this.l);";
          break;
        case 6:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.rlc(this.getUint8(this.getHL())));";
          break;
        case 7:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RLC A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.rlc(this.a);";
          break;
        case 8:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.rrc(this.b);";
          break;
        case 9:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.rrc(this.c);";
          break;
        case 10:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.rrc(this.d);";
          break;
        case 11:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.rrc(this.e);";
          break;
        case 12:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.rrc(this.h);";
          break;
        case 13:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.rrc(this.l);";
          break;
        case 14:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.rrc(this.getUint8(this.getHL())));";
          break;
        case 15:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RRC A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.rrc(this.a);";
          break;
        case 16:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.rl(this.b);";
          break;
        case 17:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.rl(this.c);";
          break;
        case 18:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.rl(this.d);";
          break;
        case 19:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.rl(this.e);";
          break;
        case 20:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.rl(this.h);";
          break;
        case 21:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.rl(this.l);";
          break;
        case 22:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.rl(this.getUint8(this.getHL())));";
          break;
        case 23:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RL A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.rl(this.a);";
          break;
        case 24:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.rr(this.b);";
          break;
        case 25:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.rr(this.c);";
          break;
        case 26:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.rr(this.d);";
          break;
        case 27:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.rr(this.e);";
          break;
        case 28:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.rr(this.h);";
          break;
        case 29:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.rr(this.l);";
          break;
        case 30:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.rr(this.getUint8(this.getHL())));";
          break;
        case 31:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RR A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.rr(this.a);";
          break;
        case 32:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.sla(this.b);";
          break;
        case 33:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.sla(this.c);";
          break;
        case 34:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.sla(this.d);";
          break;
        case 35:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.sla(this.e);";
          break;
        case 36:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.sla(this.h);";
          break;
        case 37:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.sla(this.l);";
          break;
        case 38:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.sla(this.getUint8(this.getHL())));";
          break;
        case 39:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLA A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.sla(this.a);";
          break;
        case 40:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.sra(this.b);";
          break;
        case 41:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.sra(this.c);";
          break;
        case 42:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.sra(this.d);";
          break;
        case 43:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.sra(this.e);";
          break;
        case 44:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.sra(this.h);";
          break;
        case 45:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.sra(this.l);";
          break;
        case 46:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.sra(this.getUint8(this.getHL())));";
          break;
        case 47:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRA A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.sra(this.a);";
          break;
        case 48:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.sll(this.b);";
          break;
        case 49:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.sll(this.c);";
          break;
        case 50:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.sll(this.d);";
          break;
        case 51:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.sll(this.e);";
          break;
        case 52:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.sll(this.h);";
          break;
        case 53:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.sll(this.l);";
          break;
        case 54:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.sll(this.getUint8(this.getHL())));";
          break;
        case 55:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SLL A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.sll(this.a);";
          break;
        case 56:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b = this.srl(this.b);";
          break;
        case 57:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c = this.srl(this.c);";
          break;
        case 58:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d = this.srl(this.d);";
          break;
        case 59:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e = this.srl(this.e);";
          break;
        case 60:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h = this.srl(this.h);";
          break;
        case 61:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l = this.srl(this.l);";
          break;
        case 62:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL (HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.srl(this.getUint8(this.getHL())));";
          break;
        case 63:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SRL A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a = this.srl(this.a);";
          break;
        case 64:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_0);";
          break;
        case 65:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_0);";
          break;
        case 66:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_0);";
          break;
        case 67:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_0);";
          break;
        case 68:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_0);";
          break;
        case 69:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_0);";
          break;
        case 70:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_0);";
          break;
        case 71:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 0,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_0);";
          break;
        case 72:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_1);";
          break;
        case 73:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_1);";
          break;
        case 74:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_1);";
          break;
        case 75:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_1);";
          break;
        case 76:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_1);";
          break;
        case 77:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_1);";
          break;
        case 78:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_1);";
          break;
        case 79:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 1,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_1);";
          break;
        case 80:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_2);";
          break;
        case 81:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_2);";
          break;
        case 82:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_2);";
          break;
        case 83:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_2);";
          break;
        case 84:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_2);";
          break;
        case 85:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_2);";
          break;
        case 86:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_2);";
          break;
        case 87:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 2,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_2);";
          break;
        case 88:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_3);";
          break;
        case 89:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_3);";
          break;
        case 90:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_3);";
          break;
        case 91:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_3);";
          break;
        case 92:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_3);";
          break;
        case 93:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_3);";
          break;
        case 94:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_3);";
          break;
        case 95:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 3,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_3);";
          break;
        case 96:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_4);";
          break;
        case 97:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_4);";
          break;
        case 98:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_4);";
          break;
        case 99:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_4);";
          break;
        case 100:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_4);";
          break;
        case 101:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_4);";
          break;
        case 102:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_4);";
          break;
        case 103:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 4,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_4);";
          break;
        case 104:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_5);";
          break;
        case 105:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_5);";
          break;
        case 106:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_5);";
          break;
        case 107:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_5);";
          break;
        case 108:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_5);";
          break;
        case 109:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_5);";
          break;
        case 110:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_5);";
          break;
        case 111:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 5,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_5);";
          break;
        case 112:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_6);";
          break;
        case 113:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_6);";
          break;
        case 114:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_6);";
          break;
        case 115:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_6);";
          break;
        case 116:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_6);";
          break;
        case 117:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_6);";
          break;
        case 118:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_6);";
          break;
        case 119:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 6,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_6);";
          break;
        case 120:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.b & BIT_7);";
          break;
        case 121:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.c & BIT_7);";
          break;
        case 122:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.d & BIT_7);";
          break;
        case 123:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.e & BIT_7);";
          break;
        case 124:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.h & BIT_7);";
          break;
        case 125:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.l & BIT_7);";
          break;
        case 126:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.getUint8(this.getHL()) & BIT_7);";
          break;
        case 127:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "BIT 7,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.bit(this.a & BIT_7);";
          break;
        case 128:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b &= ~BIT_0;";
          break;
        case 129:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c &= ~BIT_0;";
          break;
        case 130:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d &= ~BIT_0;";
          break;
        case 131:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e &= ~BIT_0;";
          break;
        case 132:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h &= ~BIT_0;";
          break;
        case 133:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l &= ~BIT_0;";
          break;
        case 134:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_0);";
          break;
        case 135:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 0,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a &= ~BIT_0;";
          break;
        case 136:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,B";
          break;
        case 137:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,C";
          break;
        case 138:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,D";
          break;
        case 139:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,E";
          break;
        case 140:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,H";
          break;
        case 141:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,L";
          break;
        case 142:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_1);";
          break;
        case 143:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 1,A";
          break;
        case 144:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,B";
          break;
        case 145:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,C";
          break;
        case 146:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,D";
          break;
        case 147:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,E";
          break;
        case 148:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,H";
          break;
        case 149:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,L";
          break;
        case 150:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_2);";
          break;
        case 151:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 2,A";
          break;
        case 152:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,B";
          break;
        case 153:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,C";
          break;
        case 154:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,D";
          break;
        case 155:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,E";
          break;
        case 156:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,H";
          break;
        case 157:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,L";
          break;
        case 158:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_3);";
          break;
        case 159:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 3,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a &= ~BIT_3;";
          break;
        case 160:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,B";
          break;
        case 161:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,C";
          break;
        case 162:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,D";
          break;
        case 163:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,E";
          break;
        case 164:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,H";
          break;
        case 165:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,L";
          break;
        case 166:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_4);";
          break;
        case 167:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 4,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a &= ~BIT_4;";
          break;
        case 168:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,B";
          break;
        case 169:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,C";
          break;
        case 170:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,D";
          break;
        case 171:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,E";
          break;
        case 172:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,H";
          break;
        case 173:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,L";
          break;
        case 174:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_5);";
          break;
        case 175:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 5,A";
          break;
        case 176:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,B";
          break;
        case 177:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,C";
          break;
        case 178:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,D";
          break;
        case 179:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,E";
          break;
        case 180:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,H";
          break;
        case 181:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,L";
          break;
        case 182:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_6);";
          break;
        case 183:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 6,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a &= ~BIT_6;";
          break;
        case 184:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b &= ~BIT_7;";
          break;
        case 185:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c &= ~BIT_7;";
          break;
        case 186:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d &= ~BIT_7;";
          break;
        case 187:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e &= ~BIT_7;";
          break;
        case 188:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h &= ~BIT_7;";
          break;
        case 189:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l &= ~BIT_7;";
          break;
        case 190:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) & ~BIT_7);";
          break;
        case 191:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "RES 7,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a &= ~BIT_7;";
          break;
        case 192:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b |= BIT_0;";
          break;
        case 193:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c |= BIT_0;";
          break;
        case 194:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d |= BIT_0;";
          break;
        case 195:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e |= BIT_0;";
          break;
        case 196:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h |= BIT_0;";
          break;
        case 197:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l |= BIT_0;";
          break;
        case 198:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_0);";
          break;
        case 199:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 0,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a |= BIT_0;";
          break;
        case 200:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,B";
          break;
        case 201:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,C";
          break;
        case 202:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,D";
          break;
        case 203:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,E";
          break;
        case 204:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,H";
          break;
        case 205:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,L";
          break;
        case 206:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_1);";
          break;
        case 207:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 1,A";
          break;
        case 208:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,B";
          break;
        case 209:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,C";
          break;
        case 210:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,D";
          break;
        case 211:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,E";
          break;
        case 212:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,H";
          break;
        case 213:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,L";
          break;
        case 214:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_2)";
          break;
        case 215:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 2,A";
          break;
        case 216:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,B";
          break;
        case 217:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,C";
          break;
        case 218:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,D";
          break;
        case 219:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,E";
          break;
        case 220:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,H";
          break;
        case 221:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,L";
          break;
        case 222:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_3);";
          break;
        case 223:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 3,A";
          break;
        case 224:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,B";
          break;
        case 225:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,C";
          break;
        case 226:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,D";
          break;
        case 227:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,E";
          break;
        case 228:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,H";
          break;
        case 229:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,L";
          break;
        case 230:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_4);";
          break;
        case 231:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 4,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a |= BIT_4;";
          break;
        case 232:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,B";
          break;
        case 233:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,C";
          break;
        case 234:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,D";
          break;
        case 235:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,E";
          break;
        case 236:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,H";
          break;
        case 237:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,L";
          break;
        case 238:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_5);";
          break;
        case 239:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 5,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a |= BIT_5;";
          break;
        case 240:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b |= BIT_6;";
          break;
        case 241:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c |= BIT_6;";
          break;
        case 242:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d |= BIT_6;";
          break;
        case 243:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e |= BIT_6;";
          break;
        case 244:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h |= BIT_6;";
          break;
        case 245:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l |= BIT_6;";
          break;
        case 246:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_6);";
          break;
        case 247:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 6,A";
          $code$$inline_142_currAddr$$inline_150$$ = "this.a |= BIT_6;";
          break;
        case 248:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,B";
          $code$$inline_142_currAddr$$inline_150$$ = "this.b |= BIT_7;";
          break;
        case 249:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,C";
          $code$$inline_142_currAddr$$inline_150$$ = "this.c |= BIT_7;";
          break;
        case 250:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,D";
          $code$$inline_142_currAddr$$inline_150$$ = "this.d |= BIT_7;";
          break;
        case 251:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,E";
          $code$$inline_142_currAddr$$inline_150$$ = "this.e |= BIT_7;";
          break;
        case 252:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,H";
          $code$$inline_142_currAddr$$inline_150$$ = "this.h |= BIT_7;";
          break;
        case 253:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,L";
          $code$$inline_142_currAddr$$inline_150$$ = "this.l |= BIT_7;";
          break;
        case 254:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,(HL)";
          $code$$inline_142_currAddr$$inline_150$$ = "this.setUint8(this.getHL(), this.getUint8(this.getHL()) | BIT_7);";
          break;
        case 255:
          $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = "SET 7,A", $code$$inline_142_currAddr$$inline_150$$ = "this.a |= BIT_7;";
      }
      $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $opcodes$:$address$$10_opcode$$inline_147_opcodesArray$$inline_139$$, $inst$:$inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$, code:$code$$inline_142_currAddr$$inline_150$$, $address$:$code$$2_currAddr$$inline_141_inst$$inline_149_operand$$, 
      $nextAddress$:$address$$inline_137_inst_toHex$$inline_146$$};
      $address$$inline_137_inst_toHex$$inline_146$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$inst$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.code;
      $opcodesArray_toHex$$inline_157$$ = $opcodesArray_toHex$$inline_157$$.concat($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$opcodes$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$nextAddress$;
      break;
    case 204:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL Z (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_ZERO) !== 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 205:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 206:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "ADC ," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.adc_a(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 207:
      $address$$inline_145_target$$51$$ = 8;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 208:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET NC";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) === 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 209:
      $address$$inline_137_inst_toHex$$inline_146$$ = "POP DE";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setDE(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 210:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP NC,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) === 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 211:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "OUT (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($code$$2_currAddr$$inline_141_inst$$inline_149_operand$$) + "),A";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 212:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL NC (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) === 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 213:
      $address$$inline_137_inst_toHex$$inline_146$$ = "PUSH DE";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push2(this.d, this.e);";
      break;
    case 214:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "SUB " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sub_a(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 215:
      $address$$inline_145_target$$51$$ = 16;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 216:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET C";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) !== 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 217:
      $address$$inline_137_inst_toHex$$inline_146$$ = "EXX";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.exBC(); this.exDE(); this.exHL();";
      break;
    case 218:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP C,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) !== 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 219:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "IN A,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($code$$2_currAddr$$inline_141_inst$$inline_149_operand$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 220:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL C (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_CARRY) !== 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 221:
      $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, "IX", $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$inst$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.code;
      $opcodesArray_toHex$$inline_157$$ = $opcodesArray_toHex$$inline_157$$.concat($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$opcodes$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$nextAddress$;
      break;
    case 222:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "SBC A," + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sbc_a(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 223:
      $address$$inline_145_target$$51$$ = 24;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 224:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET PO";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_PARITY) === 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 225:
      $address$$inline_137_inst_toHex$$inline_146$$ = "POP HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setHL(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 226:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP PO,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_PARITY) === 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 227:
      $address$$inline_137_inst_toHex$$inline_146$$ = "EX (SP),HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "temp = this.h;this.h = this.getUint8(this.sp + 0x01);this.setUint8(this.sp + 0x01, temp);temp = this.l;this.l = this.getUint8(this.sp);this.setUint8(this.sp, temp);";
      break;
    case 228:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL PO (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_PARITY) === 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 229:
      $address$$inline_137_inst_toHex$$inline_146$$ = "PUSH HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push2(this.h, this.l);";
      break;
    case 230:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "AND (" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a &= " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + "] | F_HALFCARRY;";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 231:
      $address$$inline_145_target$$51$$ = 32;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 232:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET PE";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_PARITY) !== 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 233:
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP (HL)";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.pc = this.getHL(); return;";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = null;
      break;
    case 234:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP PE,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_PARITY) !== 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 235:
      $address$$inline_137_inst_toHex$$inline_146$$ = "EX DE,HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
      break;
    case 236:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL PE (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_PARITY) !== 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 237:
      $address$$inline_145_target$$51$$ = $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$;
      $address$$inline_137_inst_toHex$$inline_146$$ = $JSSMS$Utils$$.$toHex$;
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$);
      var $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$ = [$address$$10_opcode$$inline_147_opcodesArray$$inline_139$$], $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "Unimplemented 0xED prefixed opcode", $code$$inline_142_currAddr$$inline_150$$ = $address$$inline_145_target$$51$$, $target$$inline_151$$ = null, $code$$inline_152_location$$inline_154$$ = 'throw "Unimplemented 0xED prefixed opcode";';
      $address$$inline_145_target$$51$$++;
      switch($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) {
        case 64:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN B,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
          break;
        case 65:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),B";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.b);";
          break;
        case 66:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "SBC HL,BC";
          $code$$inline_152_location$$inline_154$$ = "this.sbc16(this.getBC());";
          break;
        case 67:
          $code$$inline_152_location$$inline_154$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$);
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$);
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD (" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "),BC";
          $code$$inline_152_location$$inline_154$$ = "this.setUint8(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ", this.c);this.setUint8(" + $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$ + 1) + ", this.b);";
          $address$$inline_145_target$$51$$ += 2;
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
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "NEG";
          $code$$inline_152_location$$inline_154$$ = "temp = this.a;this.a = 0x00;this.sub_a(temp);";
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
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "RETN / RETI";
          $code$$inline_152_location$$inline_154$$ = "this.pc = this.getUint16(this.sp);this.sp += 0x02;this.iff1 = this.iff2;return;";
          $address$$inline_145_target$$51$$ = null;
          break;
        case 70:
        ;
        case 78:
        ;
        case 102:
        ;
        case 110:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IM 0";
          $code$$inline_152_location$$inline_154$$ = "this.im = 0x00;";
          break;
        case 71:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD I,A";
          $code$$inline_152_location$$inline_154$$ = "this.i = this.a;";
          break;
        case 72:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN C,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
          break;
        case 73:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),C";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.c);";
          break;
        case 74:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "ADC HL,BC";
          $code$$inline_152_location$$inline_154$$ = "this.adc16(this.getBC());";
          break;
        case 75:
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$));
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD BC,(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ")";
          $code$$inline_152_location$$inline_154$$ = "this.setBC(this.getUint16(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "));";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 79:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD R,A";
          $code$$inline_152_location$$inline_154$$ = "this.r = this.a;";
          break;
        case 80:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN D,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
          break;
        case 81:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),D";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.d);";
          break;
        case 82:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "SBC HL,DE";
          $code$$inline_152_location$$inline_154$$ = "this.sbc16(this.getDE());";
          break;
        case 83:
          $code$$inline_152_location$$inline_154$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$);
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$);
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD (" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "),DE";
          $code$$inline_152_location$$inline_154$$ = "this.setUint8(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ", this.e);this.setUint8(" + $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$ + 1) + ", this.d);";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 86:
        ;
        case 118:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IM 1";
          $code$$inline_152_location$$inline_154$$ = "this.im = 0x01;";
          break;
        case 87:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD A,I";
          $code$$inline_152_location$$inline_154$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
          break;
        case 88:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN E,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
          break;
        case 89:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),E";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.e);";
          break;
        case 90:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "ADC HL,DE";
          $code$$inline_152_location$$inline_154$$ = "this.adc16(this.getDE());";
          break;
        case 91:
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$));
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD DE,(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ")";
          $code$$inline_152_location$$inline_154$$ = "this.setDE(this.getUint16(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "));";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 95:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD A,R";
          $code$$inline_152_location$$inline_154$$ = "this.a = JSSMS.Utils.rndInt(0xFF);this.f = this.f & F_CARRY | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0x00);";
          break;
        case 96:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN H,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
          break;
        case 97:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),H";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.h);";
          break;
        case 98:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "SBC HL,HL";
          $code$$inline_152_location$$inline_154$$ = "this.sbc16(this.getHL());";
          break;
        case 99:
          $code$$inline_152_location$$inline_154$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$);
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$);
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD (" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "),HL";
          $code$$inline_152_location$$inline_154$$ = "this.setUint8(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ", this.l);this.setUint8(" + $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$ + 1) + ", this.h);";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 103:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "RRD";
          $code$$inline_152_location$$inline_154$$ = "var location = this.getHL();temp = this.getUint8(location);this.setUint8(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 104:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN L,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
          break;
        case 105:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),L";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.l);";
          break;
        case 106:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "ADC HL,HL";
          $code$$inline_152_location$$inline_154$$ = "this.adc16(this.getHL());";
          break;
        case 107:
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$));
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD HL,(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ")";
          $code$$inline_152_location$$inline_154$$ = "this.setHL(this.getUint16(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "));";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 111:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "RLD";
          $code$$inline_152_location$$inline_154$$ = "var location = this.getHL();temp = this.getUint8(location);this.setUint8(location, (temp & 0x0F) << 4 | (this.a & 0x0F));this.a = (this.a & 0xF0) | (temp >> 4);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 113:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),0";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, 0);";
          break;
        case 114:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "SBC HL,SP";
          $code$$inline_152_location$$inline_154$$ = "this.sbc16(this.sp);";
          break;
        case 115:
          $code$$inline_152_location$$inline_154$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$);
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$);
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD (" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + "),SP";
          $code$$inline_152_location$$inline_154$$ = "this.setUint8(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ", this.sp & 0xFF);this.setUint8(" + $address$$inline_137_inst_toHex$$inline_146$$($code$$inline_152_location$$inline_154$$ + 1) + ", this.sp >> 8);";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 120:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IN A,(C)";
          $code$$inline_152_location$$inline_154$$ = "this.a = this.port.in_(this.c);this.f = this.f & F_CARRY | this.SZP_TABLE[this.a];";
          break;
        case 121:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUT (C),A";
          $code$$inline_152_location$$inline_154$$ = "this.port.out(this.c, this.a);";
          break;
        case 122:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "ADC HL,SP";
          $code$$inline_152_location$$inline_154$$ = "this.adc16(this.sp);";
          break;
        case 123:
          $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $address$$inline_137_inst_toHex$$inline_146$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$inline_145_target$$51$$));
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LD SP,(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ")";
          $code$$inline_152_location$$inline_154$$ = "this.sp = this.getUint16(" + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + ");";
          $address$$inline_145_target$$51$$ += 2;
          break;
        case 160:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LDI";
          $code$$inline_152_location$$inline_154$$ = "temp = this.getUint8(this.getHL());this.setUint8(this.getDE(), temp);this.decBC();this.incDE();this.incHL();temp = (temp + this.a) & 0xFF;this.f = (this.f & 0xC1) | (this.getBC() ? F_PARITY : 0) | (temp & 0x08) | ((temp & 0x02) ? 0x20 : 0);";
          break;
        case 161:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "CPI";
          $code$$inline_152_location$$inline_154$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.getUint8(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);this.f = (this.f & 0xF8) | temp;";
          break;
        case 162:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "INI";
          $code$$inline_152_location$$inline_154$$ = "temp = this.port.in_(this.c);this.setUint8(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 163:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUTI";
          $code$$inline_152_location$$inline_154$$ = "temp = this.getUint8(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 168:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LDD";
          break;
        case 169:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "CPD";
          break;
        case 170:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "IND";
          $code$$inline_152_location$$inline_154$$ = "temp = this.port.in_(this.c);this.setUint8(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 171:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OUTD";
          $code$$inline_152_location$$inline_154$$ = "temp = this.getUint8(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 176:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LDIR";
          $target$$inline_151$$ = $address$$inline_145_target$$51$$ - 2;
          $code$$inline_152_location$$inline_154$$ = "this.setUint8(this.getDE(), this.getUint8(this.getHL()));this.incDE();this.incHL();this.decBC();if (this.getBC() !== 0x00) {this.tstates -= 0x05;this.f |= F_PARITY;return;} else {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
          break;
        case 177:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "CPIR";
          $target$$inline_151$$ = $address$$inline_145_target$$51$$ - 2;
          $code$$inline_152_location$$inline_154$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.getUint8(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() === 0x00 ? 0x00 : F_PARITY);" + ("if ((temp & F_PARITY) !== 0x00 && (this.f & F_ZERO) === 0x00) {this.tstates -= 0x05;this.pc = " + $address$$inline_137_inst_toHex$$inline_146$$($target$$inline_151$$) + ";return;}");
          $code$$inline_152_location$$inline_154$$ += "this.f = (this.f & 0xF8) | temp;";
          break;
        case 178:
          $target$$inline_151$$ = $address$$inline_145_target$$51$$ - 2;
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "INIR";
          $code$$inline_152_location$$inline_154$$ = "temp = this.port.in_(this.c);this.setUint8(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) === 0x80) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 179:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OTIR";
          $target$$inline_151$$ = $address$$inline_145_target$$51$$ - 2;
          $code$$inline_152_location$$inline_154$$ = "temp = this.getUint8(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 184:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "LDDR";
          break;
        case 185:
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "CPDR";
          break;
        case 186:
          $target$$inline_151$$ = $address$$inline_145_target$$51$$ - 2;
          $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "INDR";
          $code$$inline_152_location$$inline_154$$ = "temp = this.port.in_(this.c);this.setUint8(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
          break;
        case 187:
          $target$$inline_151$$ = $address$$inline_145_target$$51$$ - 2, $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "OTDR", $code$$inline_152_location$$inline_154$$ = "temp = this.getUint8(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b !== 0x00) {this.tstates -= 0x05;return;}if (this.l + temp > 0xFF) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) !== 0x00) {this.f |= F_NEGATIVE;} else {this.f &= ~ F_NEGATIVE;}";
      }
      $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = {$opcode$:$address$$10_opcode$$inline_147_opcodesArray$$inline_139$$, $opcodes$:$inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$, $inst$:$code$$2_currAddr$$inline_141_inst$$inline_149_operand$$, code:$code$$inline_152_location$$inline_154$$, $address$:$code$$inline_142_currAddr$$inline_150$$, $nextAddress$:$address$$inline_145_target$$51$$, target:$target$$inline_151$$};
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.target;
      $address$$inline_137_inst_toHex$$inline_146$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$inst$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.code;
      $opcodesArray_toHex$$inline_157$$ = $opcodesArray_toHex$$inline_157$$.concat($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$opcodes$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$nextAddress$;
      break;
    case 238:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "XOR " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a ^= " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + "];";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 239:
      $address$$inline_145_target$$51$$ = 40;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 240:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET P";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_SIGN) === 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 241:
      $address$$inline_137_inst_toHex$$inline_146$$ = "POP AF";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.setAF(this.getUint16(this.sp)); this.sp += 0x02;";
      break;
    case 242:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP P,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_SIGN) === 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 243:
      $address$$inline_137_inst_toHex$$inline_146$$ = "DI";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.iff1 = false; this.iff2 = false; this.EI_inst = true;";
      break;
    case 244:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL P (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_SIGN) === 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 245:
      $address$$inline_137_inst_toHex$$inline_146$$ = "PUSH AF";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push2(this.a, this.f);";
      break;
    case 246:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "OR " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.f = this.SZP_TABLE[this.a |= " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + "];";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 247:
      $address$$inline_145_target$$51$$ = 48;
      $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$);
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
      break;
    case 248:
      $address$$inline_137_inst_toHex$$inline_146$$ = "RET M";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_SIGN) !== 0x00) {this.tstates -= 0x06;this.pc = this.getUint16(this.sp);this.sp += 0x02;return;}";
      break;
    case 249:
      $address$$inline_137_inst_toHex$$inline_146$$ = "LD SP,HL";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.sp = this.getHL()";
      break;
    case 250:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "JP M,(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_SIGN) !== 0x00) {this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 251:
      $address$$inline_137_inst_toHex$$inline_146$$ = "EI";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.iff1 = true; this.iff2 = true; this.EI_inst = true;";
      break;
    case 252:
      $address$$inline_145_target$$51$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = "CALL M (" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ")";
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "if ((this.f & F_SIGN) !== 0x00) {this.tstates -= 0x07;this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ + 2) + ");this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + ";return;}";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ += 2;
      break;
    case 253:
      $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, "IY", $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$);
      $address$$inline_137_inst_toHex$$inline_146$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$inst$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.code;
      $opcodesArray_toHex$$inline_157$$ = $opcodesArray_toHex$$inline_157$$.concat($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$opcodes$);
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$ = $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$.$nextAddress$;
      break;
    case 254:
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$, $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$));
      $address$$inline_137_inst_toHex$$inline_146$$ = "CP " + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$;
      $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.cp_a(" + $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ + ");";
      $address$$10_opcode$$inline_147_opcodesArray$$inline_139$$++;
      break;
    case 255:
      $address$$inline_145_target$$51$$ = 56, $address$$inline_137_inst_toHex$$inline_146$$ = "RST " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$), $code$$2_currAddr$$inline_141_inst$$inline_149_operand$$ = "this.push1(" + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$10_opcode$$inline_147_opcodesArray$$inline_139$$) + "); this.pc = " + $inst$$inline_140_opcodesArray$$inline_148_toHex$$2$$($address$$inline_145_target$$51$$) + "; return;";
  }
  var $opcode$$6_options$$inline_156$$ = {$opcode$:$opcode$$6_options$$inline_156$$, $opcodes$:$opcodesArray_toHex$$inline_157$$, $inst$:$address$$inline_137_inst_toHex$$inline_146$$, code:$code$$2_currAddr$$inline_141_inst$$inline_149_operand$$, $address$:$currAddr_defaultInstruction$$inline_158$$, $nextAddress$:$address$$10_opcode$$inline_147_opcodesArray$$inline_139$$, target:$address$$inline_145_target$$51$$}, $opcodesArray_toHex$$inline_157$$ = $JSSMS$Utils$$.$toHex$, $currAddr_defaultInstruction$$inline_158$$ = 
  {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:null, target:null, $isJumpTarget$:!1, $jumpTargetNb$:0, label:""}, $prop$$inline_159$$;
  $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = "";
  for ($prop$$inline_159$$ in $currAddr_defaultInstruction$$inline_158$$) {
    void 0 !== $opcode$$6_options$$inline_156$$[$prop$$inline_159$$] && ($currAddr_defaultInstruction$$inline_158$$[$prop$$inline_159$$] = $opcode$$6_options$$inline_156$$[$prop$$inline_159$$]);
  }
  $currAddr_defaultInstruction$$inline_158$$.$hexAddress$ = $opcodesArray_toHex$$inline_157$$($currAddr_defaultInstruction$$inline_158$$.$address$);
  $currAddr_defaultInstruction$$inline_158$$.$opcodes$.length && ($JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ = $currAddr_defaultInstruction$$inline_158$$.$opcodes$.map($opcodesArray_toHex$$inline_157$$).join(" ") + " ");
  $currAddr_defaultInstruction$$inline_158$$.label = $currAddr_defaultInstruction$$inline_158$$.$hexAddress$ + " " + $JSCompiler_StaticMethods_disassemble$self__inst_hexOpcodes$$inline_160_location$$23_opcode$$inline_138_operand$$inline_153$$ + $currAddr_defaultInstruction$$inline_158$$.$inst$;
  return $currAddr_defaultInstruction$$inline_158$$;
}
function $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$) {
  function $getTotalTStates$$($opcodes_tstates$$1$$) {
    switch($opcodes_tstates$$1$$[0]) {
      case 203:
        $opcodes_tstates$$1$$ = $OP_CB_STATES$$[$opcodes_tstates$$1$$[1]];
        break;
      case 221:
      ;
      case 253:
        $opcodes_tstates$$1$$ = 2 === $opcodes_tstates$$1$$.length ? $OP_DD_STATES$$[$opcodes_tstates$$1$$[1]] : $OP_INDEX_CB_STATES$$[$opcodes_tstates$$1$$[2]];
        break;
      case 237:
        $opcodes_tstates$$1$$ = $OP_ED_STATES$$[$opcodes_tstates$$1$$[1]];
        break;
      default:
        $opcodes_tstates$$1$$ = $OP_STATES$$[$opcodes_tstates$$1$$[0]];
    }
    return $opcodes_tstates$$1$$;
  }
  function $insertTStates$$() {
    $tstates$$ && $code$$1$$.push("this.tstates -= " + $toHex$$1$$($tstates$$) + ";");
    $tstates$$ = 0;
  }
  $JSSMS$Utils$$.console.time("JavaScript generation");
  $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.$F$;
  for (var $toHex$$1$$ = $JSSMS$Utils$$.$toHex$, $tstates$$ = 0, $prevAddress$$ = 0, $prevNextAddress$$ = 0, $breakNeeded$$ = !1, $pageBreakPoint$$ = 1024, $pageNumber$$ = 0, $i$$17$$ = 0, $length$$20$$ = 0, $code$$1$$ = ['"": {', '"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'], $i$$17$$ = 0, $length$$20$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$17$$ < $length$$20$$;$i$$17$$++) {
    if ($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$]) {
      $prevAddress$$ <= $pageBreakPoint$$ && $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$ >= $pageBreakPoint$$ && ($code$$1$$.push("this.pc = " + $toHex$$1$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$) + ";"), $code$$1$$.push("}"), $code$$1$$.push("},"), $code$$1$$.push("" + $pageNumber$$ + ": {"), $code$$1$$.push('"": function() {'), $code$$1$$.push('throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'), 
      $breakNeeded$$ = !0, $pageNumber$$++, $pageBreakPoint$$ = 16384 * $pageNumber$$);
      if ($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$isJumpTarget$ || $prevNextAddress$$ !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevNextAddress$$ && !$breakNeeded$$ && $code$$1$$.push("this.pc = " + $toHex$$1$$($prevNextAddress$$) + ";"), $code$$1$$.push("},"), $code$$1$$.push("" + $toHex$$1$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$) + ": function(temp, location) {");
      }
      $code$$1$$.push("// " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].label);
      $breakNeeded$$ = "return;" === $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code.substr(-7);
      $tstates$$ += $getTotalTStates$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$opcodes$);
      (/return;/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code) || /this\.tstates/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code)) && $insertTStates$$();
      "" !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code && $code$$1$$.push($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].code);
      $prevAddress$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$address$;
      $prevNextAddress$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$17$$].$nextAddress$;
    }
  }
  $code$$1$$.push("}");
  $code$$1$$.push("}");
  $code$$1$$ = $code$$1$$.join("\n");
  $JSSMS$Utils$$.console.timeEnd("JavaScript generation");
  return $code$$1$$;
}
function $JSCompiler_StaticMethods_parseInstructions$$($JSCompiler_StaticMethods_parseInstructions$self$$) {
  $JSSMS$Utils$$.console.time("Instructions parsing");
  var $romSize$$ = 16384 * $JSCompiler_StaticMethods_parseInstructions$self$$.$rom$.length, $instruction$$, $currentAddress$$, $i$$15$$ = 0, $addresses$$ = [], $entryPoints$$ = [0, 56, 102];
  for ($entryPoints$$.forEach(function($entryPoint$$) {
    $addresses$$.push($entryPoint$$);
  });$addresses$$.length;) {
    $currentAddress$$ = $addresses$$.shift(), $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$currentAddress$$] || ($currentAddress$$ >= $romSize$$ || 65 <= $currentAddress$$ >> 10 ? $JSSMS$Utils$$.console.log("Invalid address", $JSSMS$Utils$$.$toHex$($currentAddress$$)) : ($instruction$$ = $JSCompiler_StaticMethods_disassemble$$($JSCompiler_StaticMethods_parseInstructions$self$$, $currentAddress$$), $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$currentAddress$$] = $instruction$$, 
    null !== $instruction$$.$nextAddress$ && $addresses$$.push($instruction$$.$nextAddress$), null !== $instruction$$.target && $addresses$$.push($instruction$$.target)));
  }
  for ($entryPoints$$.forEach(function($entryPoint$$1$$) {
    this.$F$[$entryPoint$$1$$] && (this.$F$[$entryPoint$$1$$].$isJumpTarget$ = !0);
  }, $JSCompiler_StaticMethods_parseInstructions$self$$);$i$$15$$ < $romSize$$;$i$$15$$++) {
    $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$] && (null !== $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].$nextAddress$ && $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].$nextAddress$] && $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].$nextAddress$].$jumpTargetNb$++, null !== $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].target && 
    ($JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].target] ? ($JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].target].$isJumpTarget$ = !0, $JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].target].$jumpTargetNb$++) : $JSSMS$Utils$$.console.log("Invalid target address", $JSSMS$Utils$$.$toHex$($JSCompiler_StaticMethods_parseInstructions$self$$.$F$[$i$$15$$].target))))
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
  this.$j$ = this.$v$ = 0;
  this.$f$ = Array(8);
  this.$g$ = 0;
  this.$a$ = Array(4);
  this.$i$ = Array(4);
  this.$o$ = Array(3);
  this.$s$ = 16;
  this.$m$ = 32768;
  this.$u$ = Array(4);
}
$JSSMS$SN76489$$.prototype = {$w$:function $$JSSMS$SN76489$$$$$w$$($clockSpeed_i$$18$$) {
  this.$v$ = ($clockSpeed_i$$18$$ << 8) / 16 / 44100;
  this.$g$ = this.$j$ = 0;
  this.$s$ = 16;
  this.$m$ = 32768;
  for ($clockSpeed_i$$18$$ = 0;4 > $clockSpeed_i$$18$$;$clockSpeed_i$$18$$++) {
    this.$f$[$clockSpeed_i$$18$$ << 1] = 1, this.$f$[($clockSpeed_i$$18$$ << 1) + 1] = 15, this.$a$[$clockSpeed_i$$18$$] = 0, this.$i$[$clockSpeed_i$$18$$] = 1;
  }
  for ($clockSpeed_i$$18$$ = 0;3 > $clockSpeed_i$$18$$;$clockSpeed_i$$18$$++) {
    this.$o$[$clockSpeed_i$$18$$] = $NO_ANTIALIAS$$;
  }
}};
function $JSSMS$Vdp$$($i$$inline_163_i$$inline_166_sms$$3$$) {
  this.$main$ = $i$$inline_163_i$$inline_166_sms$$3$$;
  var $i$$20_r$$inline_167$$;
  this.$T$ = 0;
  this.$i$ = new $JSSMS$Utils$$.Uint8Array(16384);
  this.$a$ = new $JSSMS$Utils$$.Uint8Array(96);
  for ($i$$20_r$$inline_167$$ = 0;96 > $i$$20_r$$inline_167$$;$i$$20_r$$inline_167$$++) {
    this.$a$[$i$$20_r$$inline_167$$] = 255;
  }
  this.$g$ = new $JSSMS$Utils$$.Uint8Array(16);
  this.$m$ = 0;
  this.$w$ = !1;
  this.$M$ = this.$G$ = this.$S$ = this.$O$ = this.$j$ = this.$u$ = 0;
  this.$K$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$X$ = 0;
  this.$f$ = $i$$inline_163_i$$inline_166_sms$$3$$.$f$.$canvasImageData$.data;
  this.$aa$ = new $JSSMS$Utils$$.Uint8Array(64);
  this.$Z$ = new $JSSMS$Utils$$.Uint8Array(64);
  this.$Y$ = new $JSSMS$Utils$$.Uint8Array(64);
  this.$W$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$V$ = new $JSSMS$Utils$$.Uint8Array(256);
  this.$U$ = new $JSSMS$Utils$$.Uint8Array(16);
  this.$s$ = this.$v$ = this.$o$ = 0;
  this.$F$ = !1;
  this.$I$ = Array(192);
  for ($i$$20_r$$inline_167$$ = 0;192 > $i$$20_r$$inline_167$$;$i$$20_r$$inline_167$$++) {
    this.$I$[$i$$20_r$$inline_167$$] = new $JSSMS$Utils$$.Uint8Array(25);
  }
  this.$P$ = Array(512);
  this.$R$ = new $JSSMS$Utils$$.Uint8Array(512);
  for ($i$$inline_163_i$$inline_166_sms$$3$$ = this.$J$ = this.$N$ = 0;512 > $i$$inline_163_i$$inline_166_sms$$3$$;$i$$inline_163_i$$inline_166_sms$$3$$++) {
    this.$P$[$i$$inline_163_i$$inline_166_sms$$3$$] = new $JSSMS$Utils$$.Uint8Array(64);
  }
  var $g$$inline_168$$, $b$$inline_169$$;
  for ($i$$inline_163_i$$inline_166_sms$$3$$ = 0;64 > $i$$inline_163_i$$inline_166_sms$$3$$;$i$$inline_163_i$$inline_166_sms$$3$$++) {
    $i$$20_r$$inline_167$$ = $i$$inline_163_i$$inline_166_sms$$3$$ & 3, $g$$inline_168$$ = $i$$inline_163_i$$inline_166_sms$$3$$ >> 2 & 3, $b$$inline_169$$ = $i$$inline_163_i$$inline_166_sms$$3$$ >> 4 & 3, this.$aa$[$i$$inline_163_i$$inline_166_sms$$3$$] = 85 * $i$$20_r$$inline_167$$ & 255, this.$Z$[$i$$inline_163_i$$inline_166_sms$$3$$] = 85 * $g$$inline_168$$ & 255, this.$Y$[$i$$inline_163_i$$inline_166_sms$$3$$] = 85 * $b$$inline_169$$ & 255;
  }
  for ($i$$inline_163_i$$inline_166_sms$$3$$ = 0;256 > $i$$inline_163_i$$inline_166_sms$$3$$;$i$$inline_163_i$$inline_166_sms$$3$$++) {
    $g$$inline_168$$ = $i$$inline_163_i$$inline_166_sms$$3$$ & 15, $b$$inline_169$$ = $i$$inline_163_i$$inline_166_sms$$3$$ >> 4 & 15, this.$W$[$i$$inline_163_i$$inline_166_sms$$3$$] = ($g$$inline_168$$ << 4 | $g$$inline_168$$) & 255, this.$V$[$i$$inline_163_i$$inline_166_sms$$3$$] = ($b$$inline_169$$ << 4 | $b$$inline_169$$) & 255;
  }
  for ($i$$inline_163_i$$inline_166_sms$$3$$ = 0;16 > $i$$inline_163_i$$inline_166_sms$$3$$;$i$$inline_163_i$$inline_166_sms$$3$$++) {
    this.$U$[$i$$inline_163_i$$inline_166_sms$$3$$] = ($i$$inline_163_i$$inline_166_sms$$3$$ << 4 | $i$$inline_163_i$$inline_166_sms$$3$$) & 255;
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$21$$;
  this.$w$ = !0;
  for ($i$$21$$ = this.$O$ = this.$m$ = this.$M$ = this.$j$ = 0;16 > $i$$21$$;$i$$21$$++) {
    this.$g$[$i$$21$$] = 0;
  }
  this.$g$[2] = 14;
  this.$g$[5] = 126;
  this.$main$.$cpu$.$I$ = !1;
  this.$F$ = !0;
  this.$N$ = 512;
  this.$J$ = -1;
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
  this.$g$ = function $this$$g$$() {
  };
  this.$i$ = function $this$$i$$() {
  };
  this.$j$ = function $this$$j$$() {
  };
}
function $JSSMS$NodeUI$$($sms$$5$$) {
  this.$main$ = $sms$$5$$;
  this.$canvasImageData$ = {data:[]};
}
$JSSMS$NodeUI$$.prototype = {reset:function $$JSSMS$NodeUI$$$$reset$() {
}, $g$:function $$JSSMS$NodeUI$$$$$g$$() {
}, $i$:function $$JSSMS$NodeUI$$$$$i$$() {
}, $j$:function $$JSSMS$NodeUI$$$$$j$$() {
}, $a$:function $$JSSMS$NodeUI$$$$$a$$() {
  var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$ = this.$main$.$cpu$;
  $JSSMS$Utils$$.console.time("DOT generation");
  for (var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$.$F$, $content$$inline_242$$ = ["digraph G {"], $i$$inline_243$$ = 0, $length$$inline_244$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$.length;$i$$inline_243$$ < $length$$inline_244$$;$i$$inline_243$$++) {
    $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$[$i$$inline_243$$] && ($content$$inline_242$$.push(" " + $i$$inline_243$$ + ' [label="' + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$[$i$$inline_243$$].label + '"];'), null !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$[$i$$inline_243$$].target && $content$$inline_242$$.push(" " + 
    $i$$inline_243$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$[$i$$inline_243$$].target + ";"), null !== $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$[$i$$inline_243$$].$nextAddress$ && $content$$inline_242$$.push(" " + $i$$inline_243$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_240_tree$$inline_241$$[$i$$inline_243$$].$nextAddress$ + 
    ";"));
  }
  $content$$inline_242$$.push("}");
  $content$$inline_242$$ = $content$$inline_242$$.join("\n");
  $content$$inline_242$$ = $content$$inline_242$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  $JSSMS$Utils$$.console.timeEnd("DOT generation");
  return $content$$inline_242$$;
}, $f$:function $$JSSMS$NodeUI$$$$$f$$() {
  return $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$$(this.$main$.$cpu$);
}};
function $JSSMS$Ports$$($sms$$6$$) {
  this.$main$ = $sms$$6$$;
  this.$a$ = $sms$$6$$.$a$;
  this.$i$ = $sms$$6$$.$g$;
  this.$g$ = $sms$$6$$.$j$;
  this.$f$ = [];
}
$JSSMS$Ports$$.prototype = {reset:function $$JSSMS$Ports$$$$reset$() {
  this.$f$ = Array(2);
}};
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$, $port$$3_statuscopy$$inline_252_value$$inline_249$$) {
  if ($JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$main$.$is_gg$ && 7 > $port$$3_statuscopy$$inline_252_value$$inline_249$$) {
    switch($port$$3_statuscopy$$inline_252_value$$inline_249$$) {
      case 0:
        return $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$g$.$g$ & 191 | 64;
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
  switch($port$$3_statuscopy$$inline_252_value$$inline_249$$ & 193) {
    case 64:
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$a$;
        if (0 === $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$T$) {
          if (218 < $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$G$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$G$ - 6;
            break a;
          }
        } else {
          if (242 < $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$G$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$G$ - 57;
            break a;
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$G$;
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$;
    case 65:
      return 0;
    case 128:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$w$ = 
      !0, $port$$3_statuscopy$$inline_252_value$$inline_249$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$S$, $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$S$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$i$[$JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$j$++ & 16383] & 255, $port$$3_statuscopy$$inline_252_value$$inline_249$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$w$ = 
      !0, $port$$3_statuscopy$$inline_252_value$$inline_249$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$m$, $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$m$ = 
      0, $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$main$.$cpu$.$I$ = !1, $port$$3_statuscopy$$inline_252_value$$inline_249$$;
    case 192:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$g$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$g$.$f$ & 63 | $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$f$[0] | $JSCompiler_StaticMethods_controlRead$self$$inline_251_JSCompiler_StaticMethods_dataRead$self$$inline_248_JSCompiler_StaticMethods_getVCount$self$$inline_246_JSCompiler_StaticMethods_in_$self_JSCompiler_inline_result$$9$$.$f$[1];
  }
  return 255;
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$, $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$, $reg$$inline_262_value$$111$$) {
  if (!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$)) {
    switch($address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[0] = ($reg$$inline_262_value$$111$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[1] = $reg$$inline_262_value$$111$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$w$ = !0;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$O$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ & 16383;
            if ($reg$$inline_262_value$$111$$ !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$i$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$] & 255)) {
              if ($address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ && $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ + 
              64 || $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ + 128 && $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ + 
              256) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$F$ = !0;
              } else {
                var $tileIndex$$inline_258$$ = $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ >> 5;
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$R$[$tileIndex$$inline_258$$] = 1;
                $tileIndex$$inline_258$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$N$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$N$ = $tileIndex$$inline_258$$);
                $tileIndex$$inline_258$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$J$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$J$ = $tileIndex$$inline_258$$);
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$i$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$] = $reg$$inline_262_value$$111$$;
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$aa$[$reg$$inline_262_value$$111$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$Z$[$reg$$inline_262_value$$111$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$Y$[$reg$$inline_262_value$$111$$]) : 
            ($address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ & 63) >> 1), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ & 
            1 ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$U$[$reg$$inline_262_value$$111$$] : 
            ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$W$[$reg$$inline_262_value$$111$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$V$[$reg$$inline_262_value$$111$$]));
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$a$;
        if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$w$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$w$ = !1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ = $reg$$inline_262_value$$111$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ & 16128 | $reg$$inline_262_value$$111$$;
        } else {
          if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$w$ = !0, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$O$ = $reg$$inline_262_value$$111$$ >> 6 & 3, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ | $reg$$inline_262_value$$111$$ << 8, 0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$O$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$S$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$i$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$j$++ & 
            16383] & 255;
          } else {
            if (2 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$O$) {
              $reg$$inline_262_value$$111$$ &= 15;
              switch($reg$$inline_262_value$$111$$) {
                case 0:
                  0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$m$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$I$ = 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ & 
                  16));
                  break;
                case 1:
                  0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$m$ & 128) && 0 !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$I$ = 
                  !0);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ & 3) !== ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$[$reg$$inline_262_value$$111$$] & 
                  3) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$F$ = !0);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$X$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$ & -130) << 7, $address$$inline_257_old$$inline_263_port$$2_temp$$inline_256$$ !== $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$F$ = !0);
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$[$reg$$inline_262_value$$111$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$u$;
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$i$, 0 !== ($reg$$inline_262_value$$111$$ & 128) ? 
          ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$ = $reg$$inline_262_value$$111$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$] = 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$] & 1008 | $reg$$inline_262_value$$111$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$] = 
          0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$ || 2 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$ || 4 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$] & 15 | ($reg$$inline_262_value$$111$$ & 63) << 4 : 
          $reg$$inline_262_value$$111$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 === $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$g$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$s$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$f$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_265_JSCompiler_StaticMethods_controlWrite$self$$inline_260_JSCompiler_StaticMethods_dataWrite$self$$inline_254_JSCompiler_StaticMethods_out$self$$.$m$ = 
              32768;
          }
        }
      ;
    }
  }
}
;var $Bytecode$$ = function() {
  function $Bytecode$$1$$($address$$20$$, $page$$) {
    this.$address$ = $address$$20$$;
    this.page = $page$$;
    this.$opcode$ = [];
    this.target = this.$nextAddress$ = this.$operand$ = null;
    this.$isJumpTarget$ = this.$changePage$ = this.$canEnd$ = this.$isFunctionEnder$ = !1;
    this.$jumpTargetNb$ = 0;
    this.$ast$ = null;
  }
  var $toHex$$7$$ = $JSSMS$Utils$$.$toHex$;
  $Bytecode$$1$$.prototype = {get $hexOpcode$() {
    return this.$opcode$.length ? this.$opcode$.map($toHex$$7$$).join(" ") : "";
  }, get label() {
    var $name$$62$$ = this.name ? this.name.replace(/(nn|n|PC\+e|d)/, $toHex$$7$$(this.target || this.$operand$ || 0)) : "";
    return $toHex$$7$$(this.$address$ + 16384 * this.page) + " " + this.$hexOpcode$ + " " + $name$$62$$;
  }};
  return $Bytecode$$1$$;
}();
var $Parser$$ = function() {
  function $parser$$($rom$$1$$, $frameReg$$1_i$$28$$) {
    this.$g$ = new $RomStream$$($rom$$1$$);
    this.$frameReg$ = $frameReg$$1_i$$28$$;
    this.$a$ = Array($rom$$1$$.length);
    this.$entryPoints$ = [];
    this.$bytecodes$ = Array($rom$$1$$.length);
    for ($frameReg$$1_i$$28$$ = 0;$frameReg$$1_i$$28$$ < $rom$$1$$.length;$frameReg$$1_i$$28$$++) {
      this.$a$[$frameReg$$1_i$$28$$] = [], this.$bytecodes$[$frameReg$$1_i$$28$$] = [];
    }
  }
  function $disassemble$$($bytecode$$, $stream$$6$$) {
    $stream$$6$$.page = $bytecode$$.page;
    $stream$$6$$.$RomStream_prototype$seek$($bytecode$$.$address$ + 16384 * $stream$$6$$.page);
    var $opcode$$13_opcode$$inline_270_opcode$$inline_274$$ = $stream$$6$$.getUint8(), $operand$$3_operand$$inline_275$$ = null, $target$$53_target$$inline_276$$ = null, $isFunctionEnder_isFunctionEnder$$inline_277$$ = !1, $canEnd_canEnd$$inline_278$$ = !1;
    $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_270_opcode$$inline_274$$);
    switch($opcode$$13_opcode$$inline_270_opcode$$inline_274$$) {
      case 0:
        break;
      case 1:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
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
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 15:
        break;
      case 16:
        $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ + $stream$$6$$.getInt8();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 17:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 23:
        break;
      case 24:
        $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ + $stream$$6$$.getInt8();
        $stream$$6$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
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
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 31:
        break;
      case 32:
        $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ + $stream$$6$$.getInt8();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 33:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
        break;
      case 34:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 39:
        break;
      case 40:
        $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ + $stream$$6$$.getInt8();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 41:
        break;
      case 42:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 47:
        break;
      case 48:
        $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ + $stream$$6$$.getInt8();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 49:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
        break;
      case 50:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
        break;
      case 51:
        break;
      case 52:
        break;
      case 53:
        break;
      case 54:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 55:
        break;
      case 56:
        $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ + $stream$$6$$.getInt8();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 57:
        break;
      case 58:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
        break;
      case 59:
        break;
      case 60:
        break;
      case 61:
        break;
      case 62:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
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
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
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
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 193:
        break;
      case 194:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 195:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $stream$$6$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 196:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 197:
        break;
      case 198:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 199:
        $target$$53_target$$inline_276$$ = 0;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 200:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 201:
        $stream$$6$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 202:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 203:
        return $opcode$$13_opcode$$inline_270_opcode$$inline_274$$ = $stream$$6$$.getUint8(), $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_270_opcode$$inline_274$$), $bytecode$$.$nextAddress$ = $stream$$6$$.$RomStream_prototype$position$, $bytecode$$;
      case 204:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 205:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 206:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 207:
        $target$$53_target$$inline_276$$ = 8;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 208:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 209:
        break;
      case 210:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 211:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 212:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 213:
        break;
      case 214:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 215:
        $target$$53_target$$inline_276$$ = 16;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 216:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 217:
        break;
      case 218:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 219:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 220:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 221:
        return $getIndex$$($bytecode$$, $stream$$6$$);
      case 222:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 223:
        $target$$53_target$$inline_276$$ = 24;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 224:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 225:
        break;
      case 226:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 227:
        break;
      case 228:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 229:
        break;
      case 230:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 231:
        $target$$53_target$$inline_276$$ = 32;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 232:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 233:
        $stream$$6$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 234:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 235:
        break;
      case 236:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 237:
        $opcode$$13_opcode$$inline_270_opcode$$inline_274$$ = $stream$$6$$.getUint8();
        $target$$53_target$$inline_276$$ = $operand$$3_operand$$inline_275$$ = null;
        $canEnd_canEnd$$inline_278$$ = $isFunctionEnder_isFunctionEnder$$inline_277$$ = !1;
        $bytecode$$.$opcode$.push($opcode$$13_opcode$$inline_270_opcode$$inline_274$$);
        switch($opcode$$13_opcode$$inline_270_opcode$$inline_274$$) {
          case 64:
            break;
          case 65:
            break;
          case 66:
            break;
          case 67:
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
            $stream$$6$$.$RomStream_prototype$seek$(null);
            $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
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
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
            break;
          case 111:
            break;
          case 113:
            break;
          case 114:
            break;
          case 115:
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
            break;
          case 120:
            break;
          case 121:
            break;
          case 122:
            break;
          case 123:
            $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint16();
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
            $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_278$$ = !0;
            break;
          case 177:
            $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_278$$ = !0;
            break;
          case 178:
            $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_278$$ = !0;
            break;
          case 179:
            $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_278$$ = !0;
            break;
          case 184:
            break;
          case 185:
            break;
          case 186:
            $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_278$$ = !0;
            break;
          case 187:
            $target$$53_target$$inline_276$$ = $stream$$6$$.$RomStream_prototype$position$ - 2;
            $canEnd_canEnd$$inline_278$$ = !0;
            break;
          default:
            $JSSMS$Utils$$.console.error("Unexpected opcode", "0xED " + $toHex$$8$$($opcode$$13_opcode$$inline_270_opcode$$inline_274$$));
        }
        16383 <= $bytecode$$.$address$ && ($isFunctionEnder_isFunctionEnder$$inline_277$$ = !0, $bytecode$$.$changePage$ = !0);
        $bytecode$$.$nextAddress$ = $stream$$6$$.$RomStream_prototype$position$;
        $bytecode$$.$operand$ = $operand$$3_operand$$inline_275$$;
        $bytecode$$.target = $target$$53_target$$inline_276$$;
        $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_277$$;
        $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_278$$;
        return $bytecode$$;
      case 238:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 239:
        $target$$53_target$$inline_276$$ = 40;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 240:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 241:
        break;
      case 242:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 243:
        break;
      case 244:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 245:
        break;
      case 246:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 247:
        $target$$53_target$$inline_276$$ = 48;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      case 248:
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 249:
        break;
      case 250:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 251:
        break;
      case 252:
        $target$$53_target$$inline_276$$ = $stream$$6$$.getUint16();
        $canEnd_canEnd$$inline_278$$ = !0;
        break;
      case 253:
        return $getIndex$$($bytecode$$, $stream$$6$$);
      case 254:
        $operand$$3_operand$$inline_275$$ = $stream$$6$$.getUint8();
        break;
      case 255:
        $target$$53_target$$inline_276$$ = 56;
        $isFunctionEnder_isFunctionEnder$$inline_277$$ = !0;
        break;
      default:
        $JSSMS$Utils$$.console.error("Unexpected opcode", $toHex$$8$$($opcode$$13_opcode$$inline_270_opcode$$inline_274$$));
    }
    $bytecode$$.$nextAddress$ = $stream$$6$$.$RomStream_prototype$position$;
    $bytecode$$.$operand$ = $operand$$3_operand$$inline_275$$;
    $bytecode$$.target = $target$$53_target$$inline_276$$;
    $bytecode$$.$isFunctionEnder$ = $isFunctionEnder_isFunctionEnder$$inline_277$$;
    $bytecode$$.$canEnd$ = $canEnd_canEnd$$inline_278$$;
    return $bytecode$$;
  }
  function $getIndex$$($bytecode$$3$$, $stream$$9$$) {
    var $opcode$$16_operand$$inline_282$$ = $stream$$9$$.getUint8(), $opcode$$inline_283_operand$$5$$ = null, $isFunctionEnder$$2$$ = !1;
    $bytecode$$3$$.$opcode$.push($opcode$$16_operand$$inline_282$$);
    switch($opcode$$16_operand$$inline_282$$) {
      case 9:
        break;
      case 25:
        break;
      case 33:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint16();
        break;
      case 34:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint16();
        break;
      case 35:
        break;
      case 36:
        break;
      case 37:
        break;
      case 38:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 41:
        break;
      case 42:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint16();
        break;
      case 43:
        break;
      case 44:
        break;
      case 45:
        break;
      case 46:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 52:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 53:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 54:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint16();
        break;
      case 57:
        break;
      case 68:
        break;
      case 69:
        break;
      case 70:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 76:
        break;
      case 77:
        break;
      case 78:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 84:
        break;
      case 85:
        break;
      case 86:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 92:
        break;
      case 93:
        break;
      case 94:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
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
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
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
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 111:
        break;
      case 112:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 113:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 114:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 115:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 116:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 117:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 119:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 124:
        break;
      case 125:
        break;
      case 126:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 132:
        break;
      case 133:
        break;
      case 134:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 140:
        break;
      case 141:
        break;
      case 142:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 148:
        break;
      case 149:
        break;
      case 150:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 156:
        break;
      case 157:
        break;
      case 158:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 164:
        break;
      case 165:
        break;
      case 166:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 172:
        break;
      case 173:
        break;
      case 174:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 180:
        break;
      case 181:
        break;
      case 182:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 188:
        break;
      case 189:
        break;
      case 190:
        $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8();
        break;
      case 203:
        return $opcode$$16_operand$$inline_282$$ = $stream$$9$$.getUint8(), $opcode$$inline_283_operand$$5$$ = $stream$$9$$.getUint8(), $bytecode$$3$$.$opcode$.push($opcode$$inline_283_operand$$5$$), $bytecode$$3$$.$nextAddress$ = $stream$$9$$.$RomStream_prototype$position$, $bytecode$$3$$.$operand$ = $opcode$$16_operand$$inline_282$$, $bytecode$$3$$;
      case 225:
        break;
      case 227:
        break;
      case 229:
        break;
      case 233:
        $stream$$9$$.$RomStream_prototype$seek$(null);
        $isFunctionEnder$$2$$ = !0;
        break;
      case 249:
        break;
      default:
        $JSSMS$Utils$$.console.error("Unexpected opcode", "0xDD/0xFD " + $toHex$$8$$($opcode$$16_operand$$inline_282$$));
    }
    $bytecode$$3$$.$nextAddress$ = $stream$$9$$.$RomStream_prototype$position$;
    $bytecode$$3$$.$operand$ = $opcode$$inline_283_operand$$5$$;
    $bytecode$$3$$.$isFunctionEnder$ = $isFunctionEnder$$2$$;
    return $bytecode$$3$$;
  }
  function $RomStream$$($rom$$) {
    this.$rom$ = $rom$$;
    this.$a$ = null;
    this.page = 0;
  }
  var $toHex$$8$$ = $JSSMS$Utils$$.$toHex$;
  $parser$$.prototype = {$addEntryPoint$:function $$parser$$$$$addEntryPoint$$($obj$$24$$) {
    this.$entryPoints$.push($obj$$24$$);
    this.$f$($obj$$24$$.$address$);
  }, parse:function $$parser$$$$parse$($currentPage_entryPoint$$2_page$$1$$) {
    $JSSMS$Utils$$.console.time("Parsing");
    var $i$$29_pageStart$$, $length$$21_pageEnd$$;
    void 0 === $currentPage_entryPoint$$2_page$$1$$ ? ($i$$29_pageStart$$ = 0, $length$$21_pageEnd$$ = this.$g$.length - 1) : ($i$$29_pageStart$$ = 0, $length$$21_pageEnd$$ = 16383);
    for ($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$a$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for (;this.$a$[$currentPage_entryPoint$$2_page$$1$$].length;) {
        var $currentAddress$$1_romPage_targetPage$$ = this.$a$[$currentPage_entryPoint$$2_page$$1$$].shift().$address$ % 16384;
        if ($currentAddress$$1_romPage_targetPage$$ < $i$$29_pageStart$$ || $currentAddress$$1_romPage_targetPage$$ > $length$$21_pageEnd$$) {
          $JSSMS$Utils$$.console.error("Address out of bound", $toHex$$8$$($currentAddress$$1_romPage_targetPage$$));
        } else {
          if (!this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$]) {
            var $bytecode$$5_targetAddress$$ = new $Bytecode$$($currentAddress$$1_romPage_targetPage$$, $currentPage_entryPoint$$2_page$$1$$);
            this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$] = $disassemble$$($bytecode$$5_targetAddress$$, this.$g$);
            null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$ >= $i$$29_pageStart$$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$ <= $length$$21_pageEnd$$ && this.$f$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].$nextAddress$);
            null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target >= $i$$29_pageStart$$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target <= $length$$21_pageEnd$$ && this.$f$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$currentAddress$$1_romPage_targetPage$$].target);
          }
        }
      }
    }
    this.$bytecodes$[0][1023] ? this.$bytecodes$[0][1023].$isFunctionEnder$ = !0 : this.$bytecodes$[0][1022] && (this.$bytecodes$[0][1022].$isFunctionEnder$ = !0);
    $i$$29_pageStart$$ = 0;
    for ($length$$21_pageEnd$$ = this.$entryPoints$.length;$i$$29_pageStart$$ < $length$$21_pageEnd$$;$i$$29_pageStart$$++) {
      $currentPage_entryPoint$$2_page$$1$$ = this.$entryPoints$[$i$$29_pageStart$$].$address$, $currentAddress$$1_romPage_targetPage$$ = this.$entryPoints$[$i$$29_pageStart$$].$romPage$, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$isJumpTarget$ = !0, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$currentPage_entryPoint$$2_page$$1$$].$jumpTargetNb$++;
    }
    for ($currentPage_entryPoint$$2_page$$1$$ = 0;$currentPage_entryPoint$$2_page$$1$$ < this.$bytecodes$.length;$currentPage_entryPoint$$2_page$$1$$++) {
      for ($i$$29_pageStart$$ = 0, $length$$21_pageEnd$$ = this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$].length;$i$$29_pageStart$$ < $length$$21_pageEnd$$;$i$$29_pageStart$$++) {
        this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$] && (null !== this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].$nextAddress$ && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].$nextAddress$] && this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].$nextAddress$].$jumpTargetNb$++, null !== 
        this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target && ($currentAddress$$1_romPage_targetPage$$ = ~~(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target / 16384), $bytecode$$5_targetAddress$$ = this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target % 16384, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$] && this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$bytecode$$5_targetAddress$$] ? 
        (this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$isJumpTarget$ = !0, this.$bytecodes$[$currentAddress$$1_romPage_targetPage$$][$bytecode$$5_targetAddress$$].$jumpTargetNb$++) : $JSSMS$Utils$$.console.log("Invalid target address", $toHex$$8$$(this.$bytecodes$[$currentPage_entryPoint$$2_page$$1$$][$i$$29_pageStart$$].target))));
      }
    }
    $JSSMS$Utils$$.console.timeEnd("Parsing");
  }, $parseFromAddress$:function $$parser$$$$$parseFromAddress$$($obj$$25_romPage$$1$$) {
    var $address$$21$$ = $obj$$25_romPage$$1$$.$address$ % 16384;
    $obj$$25_romPage$$1$$ = $obj$$25_romPage$$1$$.$romPage$;
    var $pageStart$$1$$ = 16384 * $obj$$25_romPage$$1$$, $pageEnd$$1$$ = 16384 * ($obj$$25_romPage$$1$$ + 1), $branch$$ = [], $bytecode$$6$$, $startingBytecode$$ = !0, $absoluteAddress$$;
    1024 > $address$$21$$ && 0 === $obj$$25_romPage$$1$$ && ($pageStart$$1$$ = 0, $pageEnd$$1$$ = 1024);
    do {
      this.$bytecodes$[$obj$$25_romPage$$1$$][$address$$21$$] ? $bytecode$$6$$ = this.$bytecodes$[$obj$$25_romPage$$1$$][$address$$21$$] : ($bytecode$$6$$ = new $Bytecode$$($address$$21$$, $obj$$25_romPage$$1$$), this.$bytecodes$[$obj$$25_romPage$$1$$][$address$$21$$] = $disassemble$$($bytecode$$6$$, this.$g$));
      if ($bytecode$$6$$.$canEnd$ && !$startingBytecode$$) {
        break;
      }
      $address$$21$$ = $bytecode$$6$$.$nextAddress$ % 16384;
      $branch$$.push($bytecode$$6$$);
      $startingBytecode$$ = !1;
      $absoluteAddress$$ = $address$$21$$ + 16384 * $obj$$25_romPage$$1$$;
    } while (null !== $address$$21$$ && $absoluteAddress$$ >= $pageStart$$1$$ && $absoluteAddress$$ < $pageEnd$$1$$ && !$bytecode$$6$$.$isFunctionEnder$);
    return $branch$$;
  }, $f$:function $$parser$$$$$f$$($address$$22$$) {
    var $memPage$$ = ~~($address$$22$$ / 16384), $romPage$$2$$ = this.$frameReg$[$memPage$$];
    this.$a$[$romPage$$2$$].push({$address$:$address$$22$$ % 16384, $romPage$:$romPage$$2$$, $memPage$:$memPage$$});
  }};
  $RomStream$$.prototype = {get $RomStream_prototype$position$() {
    return this.$a$;
  }, get length() {
    return 16384 * this.$rom$.length;
  }, $RomStream_prototype$seek$:function $$RomStream$$$$$RomStream_prototype$seek$$($pos$$) {
    this.$a$ = $pos$$;
  }, getUint8:function $$RomStream$$$$getUint8$() {
    var $page$$2_value$$114$$;
    $page$$2_value$$114$$ = this.page;
    var $address$$23$$ = this.$a$ & 16383;
    $SUPPORT_DATAVIEW$$ ? ($page$$2_value$$114$$ = this.$rom$[$page$$2_value$$114$$].getUint8($address$$23$$), this.$a$++, 16383 <= $address$$23$$ && this.page++) : ($page$$2_value$$114$$ = this.$rom$[$page$$2_value$$114$$][$address$$23$$] & 255, this.$a$++);
    return $page$$2_value$$114$$;
  }, getInt8:function $$RomStream$$$$getInt8$() {
    var $page$$3_value$$115$$;
    $page$$3_value$$115$$ = this.page;
    var $address$$24$$ = this.$a$ & 16383;
    $SUPPORT_DATAVIEW$$ ? ($page$$3_value$$115$$ = this.$rom$[$page$$3_value$$115$$].getInt8($address$$24$$), this.$a$++, 16383 <= $address$$24$$ && this.page++) : ($page$$3_value$$115$$ = this.$rom$[$page$$3_value$$115$$][$address$$24$$] & 255, 128 <= $page$$3_value$$115$$ && ($page$$3_value$$115$$ -= 256), this.$a$++);
    return $page$$3_value$$115$$ + 1;
  }, getUint16:function $$RomStream$$$$getUint16$() {
    var $page$$4_value$$116$$;
    $page$$4_value$$116$$ = this.page;
    var $address$$25$$ = this.$a$ & 16383;
    $page$$4_value$$116$$ = $SUPPORT_DATAVIEW$$ ? 16383 > $address$$25$$ ? this.$rom$[$page$$4_value$$116$$].getUint16($address$$25$$, !0) : this.$rom$[$page$$4_value$$116$$].getUint8($address$$25$$) | this.$rom$[++$page$$4_value$$116$$].getUint8($address$$25$$) << 8 : this.$rom$[$page$$4_value$$116$$][$address$$25$$] & 255 | (this.$rom$[$page$$4_value$$116$$][$address$$25$$ + 1] & 255) << 8;
    this.$a$ += 2;
    return $page$$4_value$$116$$;
  }};
  return $parser$$;
}();
var $BIT_TABLE$$ = [1, 2, 4, 8, 16, 32, 64, 128];
function $n$IfStatement$$($test$$, $consequent$$, $alternate$$) {
  void 0 === $alternate$$ && ($alternate$$ = null);
  return {type:"IfStatement", test:$test$$, consequent:$consequent$$, alternate:$alternate$$};
}
function $n$BlockStatement$$($body$$1$$) {
  void 0 === $body$$1$$ && ($body$$1$$ = []);
  Array.isArray($body$$1$$) || ($body$$1$$ = [$body$$1$$]);
  return {type:"BlockStatement", body:$body$$1$$};
}
function $n$ExpressionStatement$$($expression$$2$$) {
  return {type:"ExpressionStatement", expression:$expression$$2$$};
}
function $n$ReturnStatement$$() {
  var $argument$$;
  void 0 === $argument$$ && ($argument$$ = null);
  return {type:"ReturnStatement", argument:$argument$$};
}
function $n$VariableDeclaration$$($name$$63$$, $init$$1$$) {
  return {type:"VariableDeclaration", declarations:[{type:"VariableDeclarator", id:{type:"Identifier", name:$name$$63$$}, init:$init$$1$$}], kind:"var"};
}
function $n$Identifier$$($name$$64$$) {
  return {type:"Identifier", name:$name$$64$$};
}
function $n$Literal$$($value$$117$$) {
  return "number" === typeof $value$$117$$ ? {type:"Literal", value:$value$$117$$, raw:$DEBUG$$ ? $JSSMS$Utils$$.$toHex$($value$$117$$) : "" + $value$$117$$} : {type:"Literal", value:$value$$117$$, raw:"" + $value$$117$$};
}
function $n$CallExpression$$($callee$$, $args$$1$$) {
  void 0 === $args$$1$$ && ($args$$1$$ = []);
  Array.isArray($args$$1$$) || ($args$$1$$ = [$args$$1$$]);
  return {type:"CallExpression", callee:$n$Identifier$$($callee$$), arguments:$args$$1$$};
}
function $n$AssignmentExpression$$($operator$$, $left$$3$$, $right$$3$$) {
  return {type:"AssignmentExpression", operator:$operator$$, left:$left$$3$$, right:$right$$3$$};
}
function $n$BinaryExpression$$($operator$$1$$, $left$$4$$, $right$$4$$) {
  return {type:"BinaryExpression", operator:$operator$$1$$, left:$left$$4$$, right:$right$$4$$};
}
function $n$UnaryExpression$$($operator$$2$$, $argument$$1$$) {
  return {type:"UnaryExpression", operator:$operator$$2$$, argument:$argument$$1$$};
}
function $n$MemberExpression$$($object$$1$$, $property$$4$$) {
  return {type:"MemberExpression", computed:!0, object:$object$$1$$, property:$property$$4$$};
}
function $n$ConditionalExpression$$($test$$1$$, $consequent$$1$$, $alternate$$1$$) {
  return {type:"ConditionalExpression", test:$test$$1$$, consequent:$consequent$$1$$, alternate:$alternate$$1$$};
}
function $n$Register$$($name$$65$$) {
  return {type:"Register", name:$name$$65$$};
}
var $o$$ = {$SET16$:function($register1$$, $register2$$, $value$$118$$) {
  return "Literal" === $value$$118$$.type ? [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", $value$$118$$, $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $value$$118$$, $n$Literal$$(255))))] : [$n$VariableDeclaration$$("val", $value$$118$$), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$), $n$BinaryExpression$$(">>", 
  $n$Identifier$$("val"), $n$Literal$$(8)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$), $n$BinaryExpression$$("&", $n$Identifier$$("val"), $n$Literal$$(255))))];
}, $EX$:function($register1$$1$$, $register2$$1$$) {
  return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$($register1$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$1$$), $n$Register$$($register2$$1$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$1$$), $n$Identifier$$("temp")))];
}, $NOOP$:function() {
  return function() {
  };
}, $LD8$:function($srcRegister$$, $dstRegister1$$, $dstRegister2$$) {
  return void 0 === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function($value$$119$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Literal$$($value$$119$$)));
  } : "i" === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$("i"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), $n$Literal$$(0)))))];
  } : "r" === $dstRegister1$$ && void 0 === $dstRegister2$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$CallExpression$$("JSSMS.Utils.rndInt", $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZ_TABLE"), $n$Register$$($srcRegister$$))), $n$ConditionalExpression$$($n$Identifier$$("iff2"), $n$Literal$$(4), 
    $n$Literal$$(0)))))];
  } : void 0 === $dstRegister2$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $n$Register$$($dstRegister1$$)));
  } : "n" === $dstRegister1$$ && "n" === $dstRegister2$$ ? function($value$$120$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$Literal$$($value$$120$$))));
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($dstRegister1$$ + $dstRegister2$$).toUpperCase()))));
  };
}, $LD8_D$:function($srcRegister$$1$$, $dstRegister1$$1$$, $dstRegister2$$1$$) {
  return function($value$$121$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($srcRegister$$1$$), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($dstRegister1$$1$$ + $dstRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$121$$)))));
  };
}, $LD16$:function($srcRegister1$$, $srcRegister2$$, $dstRegister1$$2$$, $dstRegister2$$2$$) {
  if (void 0 === $dstRegister1$$2$$ && void 0 === $dstRegister2$$2$$) {
    return function($value$$122$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $n$Literal$$($value$$122$$));
    };
  }
  if ("n" === $dstRegister1$$2$$ && "n" === $dstRegister2$$2$$) {
    return function($value$$123$$) {
      return $o$$.$SET16$($srcRegister1$$, $srcRegister2$$, $o$$.$READ_MEM16$($n$Literal$$($value$$123$$)));
    };
  }
  $JSSMS$Utils$$.console.error("Wrong parameters number");
}, $LD_WRITE_MEM$:function($srcRegister1$$1$$, $srcRegister2$$1$$, $dstRegister1$$3$$, $dstRegister2$$3$$) {
  return void 0 === $dstRegister1$$3$$ && void 0 === $dstRegister2$$3$$ ? function($value$$124$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Literal$$($value$$124$$)]));
  } : "n" === $srcRegister1$$1$$ && "n" === $srcRegister2$$1$$ && void 0 === $dstRegister2$$3$$ ? function($value$$125$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Literal$$($value$$125$$), $n$Register$$($dstRegister1$$3$$)]));
  } : "n" === $srcRegister1$$1$$ && "n" === $srcRegister2$$1$$ ? function($value$$126$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Literal$$($value$$126$$), $n$Register$$($dstRegister2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Literal$$($value$$126$$ + 1), $n$Register$$($dstRegister1$$3$$)]))];
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("get" + ($srcRegister1$$1$$ + $srcRegister2$$1$$).toUpperCase()), $n$Register$$($dstRegister1$$3$$)]));
  };
}, $LD_SP$:function($register1$$2$$, $register2$$2$$) {
  return void 0 === $register1$$2$$ && void 0 === $register2$$2$$ ? function($value$$127$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$Literal$$($value$$127$$)));
  } : "n" === $register1$$2$$ && "n" === $register2$$2$$ ? function($value$$128$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $o$$.$READ_MEM16$($n$Literal$$($value$$128$$))));
  } : function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("sp"), $n$CallExpression$$("get" + ($register1$$2$$ + $register2$$2$$).toUpperCase())));
  };
}, $LD_NN$:function($register1$$3$$, $register2$$3$$) {
  return void 0 === $register2$$3$$ ? function($value$$129$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("setUint8", $n$Literal$$($value$$129$$))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", $n$Literal$$($value$$129$$ + 1)))];
  } : function($value$$130$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Literal$$($value$$130$$), $n$Register$$($register2$$3$$)])), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Literal$$($value$$130$$ + 1), $n$Register$$($register1$$3$$)]))];
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
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register2$$5$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("===", $n$Register$$($register2$$5$$), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$5$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Register$$($register1$$5$$), 
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
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register2$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register2$$7$$), $n$Literal$$(1)), $n$Literal$$(255)))), $n$IfStatement$$($n$BinaryExpression$$("===", $n$Register$$($register2$$7$$), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$7$$), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$($register1$$7$$), 
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
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))];
  };
}, $CCF$:function() {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("ccf"));
  };
}, $ADD$:function($register1$$9$$, $register2$$9$$) {
  return void 0 === $register1$$9$$ && void 0 === $register2$$9$$ ? function($value$$131$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Literal$$($value$$131$$)));
  } : void 0 === $register2$$9$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $n$Register$$($register1$$9$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$9$$ + $register2$$9$$).toUpperCase()))));
  };
}, $ADC$:function($register1$$10$$, $register2$$10$$) {
  return void 0 === $register1$$10$$ && void 0 === $register2$$10$$ ? function($value$$132$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Literal$$($value$$132$$)));
  } : void 0 === $register2$$10$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $n$Register$$($register1$$10$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$10$$ + $register2$$10$$).toUpperCase()))));
  };
}, $SUB$:function($register1$$11$$, $register2$$11$$) {
  return void 0 === $register1$$11$$ && void 0 === $register2$$11$$ ? function($value$$133$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Literal$$($value$$133$$)));
  } : void 0 === $register2$$11$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Register$$($register1$$11$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$11$$ + $register2$$11$$).toUpperCase()))));
  };
}, $SBC$:function($register1$$12$$, $register2$$12$$) {
  return void 0 === $register1$$12$$ && void 0 === $register2$$12$$ ? function($value$$134$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Literal$$($value$$134$$)));
  } : void 0 === $register2$$12$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $n$Register$$($register1$$12$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$12$$ + $register2$$12$$).toUpperCase()))));
  };
}, $AND$:function($register1$$13$$, $register2$$13$$) {
  return void 0 === $register1$$13$$ && void 0 === $register2$$13$$ ? function($value$$135$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Literal$$($value$$135$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  } : "a" !== $register1$$13$$ && void 0 === $register2$$13$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $n$Register$$($register1$$13$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  } : "a" === $register1$$13$$ && void 0 === $register2$$13$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))));
  } : function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$13$$ + $register2$$13$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  };
}, $XOR$:function($register1$$14$$, $register2$$14$$) {
  return void 0 === $register1$$14$$ && void 0 === $register2$$14$$ ? function($value$$136$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Literal$$($value$$136$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" !== $register1$$14$$ && void 0 === $register2$$14$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $n$Register$$($register1$$14$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" === $register1$$14$$ && void 0 === $register2$$14$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Literal$$(0))))];
  } : function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$14$$ + $register2$$14$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $OR$:function($register1$$15$$, $register2$$15$$) {
  return void 0 === $register1$$15$$ && void 0 === $register2$$15$$ ? function($value$$137$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Literal$$($value$$137$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" !== $register1$$15$$ && void 0 === $register2$$15$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $n$Register$$($register1$$15$$))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  } : "a" === $register1$$15$$ && void 0 === $register2$$15$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))));
  } : function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$15$$ + $register2$$15$$).toUpperCase())))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $CP$:function($register1$$16$$, $register2$$16$$) {
  return void 0 === $register1$$16$$ && void 0 === $register2$$16$$ ? function($value$$138$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Literal$$($value$$138$$)));
  } : void 0 === $register2$$16$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $n$Register$$($register1$$16$$)));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$16$$ + $register2$$16$$).toUpperCase()))));
  };
}, $POP$:function($register1$$17$$, $register2$$17$$) {
  return function() {
    return [].concat($o$$.$SET16$($register1$$17$$, $register2$$17$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))));
  };
}, PUSH:function($register1$$18$$, $register2$$18$$) {
  return function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("pushUint8", [$n$Register$$($register1$$18$$), $n$Register$$($register2$$18$$)]));
  };
}, $JR$:function($test$$2$$) {
  return void 0 === $test$$2$$ ? function($value$$139$$, $target$$60$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$($target$$60$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384)))));
  } : function($value$$140$$, $target$$61$$) {
    return $n$IfStatement$$($test$$2$$, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$($target$$61$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()]));
  };
}, $DJNZ$:function() {
  return function($value$$141$$, $target$$62$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("b"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("-", $n$Register$$("b"), $n$Literal$$(1)), $n$Literal$$(255)))), $o$$.$JR$($n$BinaryExpression$$("!==", $n$Register$$("b"), $n$Literal$$(0)))(void 0, $target$$62$$)];
  };
}, $JRNZ$:function() {
  return function($value$$142$$, $target$$63$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))))(void 0, $target$$63$$);
  };
}, $JRZ$:function() {
  return function($value$$143$$, $target$$64$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0)))(void 0, $target$$64$$);
  };
}, $JRNC$:function() {
  return function($value$$144$$, $target$$65$$) {
    return $o$$.$JR$($n$UnaryExpression$$("!", $n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0))))(void 0, $target$$65$$);
  };
}, $JRC$:function() {
  return function($value$$145$$, $target$$66$$) {
    return $o$$.$JR$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(0)))(void 0, $target$$66$$);
  };
}, $RET$:function($operator$$4$$, $bitMask$$) {
  return void 0 === $operator$$4$$ && void 0 === $bitMask$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2)))];
  } : function() {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$4$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(6))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), 
    $n$ReturnStatement$$()]));
  };
}, $JP$:function($operator$$5$$, $bitMask$$1$$) {
  return void 0 === $operator$$5$$ && void 0 === $bitMask$$1$$ ? function($value$$147$$, $target$$68$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$68$$)))];
  } : "h" === $operator$$5$$ && "l" === $bitMask$$1$$ ? function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("getHL")))];
  } : function($value$$149$$, $target$$70$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$5$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$1$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$70$$))), $n$ReturnStatement$$()]));
  };
}, $CALL$:function($operator$$6$$, $bitMask$$2$$) {
  return void 0 === $operator$$6$$ && void 0 === $bitMask$$2$$ ? function($value$$150$$, $target$$71$$, $nextAddress$$10$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$10$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($target$$71$$))), $n$ReturnStatement$$()];
  } : function($value$$151$$, $target$$72$$, $nextAddress$$11$$) {
    return $n$IfStatement$$($n$BinaryExpression$$($operator$$6$$, $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$($bitMask$$2$$)), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(7))), $n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$11$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", 
    $n$Identifier$$("pc"), $n$Literal$$($target$$72$$))), $n$ReturnStatement$$()]));
  };
}, $RST$:function($targetAddress$$1$$) {
  return function($value$$152$$, $target$$73$$, $nextAddress$$12$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("push", $n$BinaryExpression$$("+", $n$Literal$$($nextAddress$$12$$ % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$Literal$$($targetAddress$$1$$))), $n$ReturnStatement$$()];
  };
}, $DI$:function() {
  return function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))];
  };
}, $EI$:function() {
  return function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff2"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("EI_inst"), $n$Literal$$(!0)))];
  };
}, $OUT$:function($register1$$19$$, $register2$$19$$) {
  return void 0 === $register2$$19$$ ? function($value$$153$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Literal$$($value$$153$$), $n$Register$$($register1$$19$$)]));
  } : function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$($register1$$19$$), $n$Register$$($register2$$19$$)]));
  };
}, $IN$:function($register1$$20$$, $register2$$20$$) {
  return void 0 === $register2$$20$$ ? function($value$$154$$) {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Literal$$($value$$154$$))));
  } : function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$20$$), $n$CallExpression$$("port.in_", $n$Register$$($register2$$20$$)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$($register1$$20$$)))))];
  };
}, $EX_AF$:function() {
  return function() {
    return [].concat($o$$.$EX$("a", "a2"), $o$$.$EX$("f", "f2"));
  };
}, $EXX$:function() {
  return function() {
    return [].concat($o$$.$EX$("b", "b2"), $o$$.$EX$("c", "c2"), $o$$.$EX$("d", "d2"), $o$$.$EX$("e", "e2"), $o$$.$EX$("h", "h2"), $o$$.$EX$("l", "l2"));
  };
}, $EX_DE_HL$:function() {
  return function() {
    return [].concat($o$$.$EX$("d", "h"), $o$$.$EX$("e", "l"));
  };
}, $EX_SP_HL$:function() {
  return function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("h"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$BinaryExpression$$("+", $n$Identifier$$("sp"), $n$Literal$$(1)), $n$Identifier$$("temp")])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $o$$.$READ_MEM8$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("sp"), $n$Identifier$$("temp")]))];
  };
}, $HALT$:function() {
  return function($ret_value$$156$$, $target$$77$$, $nextAddress$$16$$) {
    $ret_value$$156$$ = [];
    $ret_value$$156$$.push($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("tstates"), $n$Literal$$(0))));
    return $ret_value$$156$$.concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("halt"), $n$Literal$$(!0))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$BinaryExpression$$("+", $n$Literal$$(($nextAddress$$16$$ - 1) % 16384), $n$BinaryExpression$$("*", $n$Identifier$$("page"), $n$Literal$$(16384))))), $n$ReturnStatement$$()]);
  };
}, $RLC$:$generateCBFunctions$$("rlc"), $RRC$:$generateCBFunctions$$("rrc"), $RL$:$generateCBFunctions$$("rl"), $RR$:$generateCBFunctions$$("rr"), $SLA$:$generateCBFunctions$$("sla"), $SRA$:$generateCBFunctions$$("sra"), $SLL$:$generateCBFunctions$$("sll"), $SRL$:$generateCBFunctions$$("srl"), $BIT$:function($bit$$1$$, $register1$$21$$, $register2$$21$$) {
  return void 0 === $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $n$Register$$($register1$$21$$), $n$Literal$$($BIT_TABLE$$[$bit$$1$$]))));
  } : "h" === $register1$$21$$ && "l" === $register2$$21$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase())), $n$Literal$$($BIT_TABLE$$[$bit$$1$$]))));
  } : function($value$$157$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$21$$ + $register2$$21$$).toUpperCase()), $n$Literal$$($value$$157$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("bit", $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Literal$$($BIT_TABLE$$[$bit$$1$$]))))];
  };
}, $RES$:function($bit$$2$$, $register1$$22$$, $register2$$22$$) {
  return void 0 === $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$($register1$$22$$), $n$UnaryExpression$$("~", $n$Literal$$($BIT_TABLE$$[$bit$$2$$]))));
  } : "h" === $register1$$22$$ && "l" === $register2$$22$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("setUint8", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase())));
  } : function($value$$158$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$22$$ + $register2$$22$$).toUpperCase()), $n$Literal$$($value$$158$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("location"), $n$BinaryExpression$$("&", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$UnaryExpression$$("~", $n$Literal$$($BIT_TABLE$$[$bit$$2$$])))]))];
  };
}, $SET$:function($bit$$3$$, $register1$$23$$, $register2$$23$$) {
  return void 0 === $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$($register1$$23$$), $n$Literal$$($BIT_TABLE$$[$bit$$3$$])));
  } : "h" === $register1$$23$$ && "l" === $register2$$23$$ ? function() {
    return $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase())), $n$Literal$$($BIT_TABLE$$[$bit$$3$$]))]));
  } : function($value$$159$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$23$$ + $register2$$23$$).toUpperCase()), $n$Literal$$($value$$159$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $o$$.$READ_MEM8$($n$Identifier$$("location")), $n$Literal$$($BIT_TABLE$$[$bit$$3$$]))]))];
  };
}, $LD_X$:function($register1$$24$$, $register2$$24$$, $register3$$1$$) {
  return void 0 === $register3$$1$$ ? function($value$$160$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$24$$ + $register2$$24$$).toUpperCase()), $n$Literal$$($value$$160$$ & 255)), $n$Literal$$($value$$160$$ >> 8)]))];
  } : function($value$$161$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register2$$24$$ + $register3$$1$$).toUpperCase()), $n$Literal$$($value$$161$$)), $n$Register$$($register1$$24$$)]))];
  };
}, $INC_X$:function($register1$$25$$, $register2$$25$$) {
  return function($value$$162$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("incMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$25$$ + $register2$$25$$).toUpperCase()), $n$Literal$$($value$$162$$))))];
  };
}, $DEC_X$:function($register1$$26$$, $register2$$26$$) {
  return function($value$$163$$) {
    return [$n$ExpressionStatement$$($n$CallExpression$$("decMem", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$26$$ + $register2$$26$$).toUpperCase()), $n$Literal$$($value$$163$$))))];
  };
}, $ADD_X$:function($register1$$27$$, $register2$$27$$) {
  return function($value$$164$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("add_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$27$$ + $register2$$27$$).toUpperCase()), $n$Literal$$($value$$164$$)))));
  };
}, $ADC_X$:function($register1$$28$$, $register2$$28$$) {
  return function($value$$165$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("adc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$28$$ + $register2$$28$$).toUpperCase()), $n$Literal$$($value$$165$$)))));
  };
}, $SUB_X$:function($register1$$29$$, $register2$$29$$) {
  return function($value$$166$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$29$$ + $register2$$29$$).toUpperCase()), $n$Literal$$($value$$166$$)))));
  };
}, $SBC_X$:function($register1$$30$$, $register2$$30$$) {
  return function($value$$167$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("sbc_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$30$$ + $register2$$30$$).toUpperCase()), $n$Literal$$($value$$167$$)))));
  };
}, $AND_X$:function($register1$$31$$, $register2$$31$$) {
  return function($value$$168$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$31$$ + $register2$$31$$).toUpperCase()), $n$Literal$$($value$$168$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a")), $n$Literal$$(16))))];
  };
}, $XOR_X$:function($register1$$32$$, $register2$$32$$) {
  return function($value$$169$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("^=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$32$$ + $register2$$32$$).toUpperCase()), $n$Literal$$($value$$169$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $OR_X$:function($register1$$33$$, $register2$$33$$) {
  return function($value$$170$$) {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("a"), $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$33$$ + $register2$$33$$).toUpperCase()), $n$Literal$$($value$$170$$))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), $n$Register$$("a"))))];
  };
}, $CP_X$:function($register1$$34$$, $register2$$34$$) {
  return function($value$$171$$) {
    return $n$ExpressionStatement$$($n$CallExpression$$("cp_a", $o$$.$READ_MEM8$($n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$34$$ + $register2$$34$$).toUpperCase()), $n$Literal$$($value$$171$$)))));
  };
}, $EX_SP_X$:function($register1$$35$$, $register2$$35$$) {
  return function() {
    return [].concat($n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("get" + ($register1$$35$$ + $register2$$35$$).toUpperCase()))), $o$$.$SET16$($register1$$35$$, $register2$$35$$, $o$$.$READ_MEM16$($n$Identifier$$("sp"))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("sp"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))])), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$BinaryExpression$$("+", 
    $n$Identifier$$("sp"), $n$Literal$$(1)), $n$BinaryExpression$$(">>", $n$Identifier$$("sp"), $n$Literal$$(8))])));
  };
}, $JP_X$:function($register1$$36$$, $register2$$36$$) {
  return function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $n$CallExpression$$("get" + ($register1$$36$$ + $register2$$36$$).toUpperCase())))];
  };
}, $ADC16$:function($register1$$37$$, $register2$$37$$) {
  return function() {
    return [void 0 === $register2$$37$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$37$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$37$$), $n$Literal$$(8)), $n$Register$$($register2$$37$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("+", $n$BinaryExpression$$("+", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp")), 
    $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(64))), $n$BinaryExpression$$(">>", 
    $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$Literal$$(32768)), $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))];
  };
}, $SBC16$:function($register1$$38$$, $register2$$38$$) {
  return function() {
    return [void 0 === $register2$$38$$ ? $n$VariableDeclaration$$("value", $n$Identifier$$($register1$$38$$)) : $n$VariableDeclaration$$("value", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$($register1$$38$$), $n$Literal$$(8)), $n$Register$$($register2$$38$$))), $n$VariableDeclaration$$("val", $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$Register$$("h"), $n$Literal$$(8)), $n$Register$$("l"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), 
    $n$BinaryExpression$$("-", $n$BinaryExpression$$("-", $n$Identifier$$("val"), $n$Identifier$$("value")), $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$BinaryExpression$$("^", $n$BinaryExpression$$("^", $n$Identifier$$("val"), 
    $n$Identifier$$("temp")), $n$Identifier$$("value")), $n$Literal$$(8)), $n$Literal$$(16)), $n$Literal$$(2)), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(16)), $n$Literal$$(1))), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(128))), $n$ConditionalExpression$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(65535)), $n$Literal$$(0)), $n$Literal$$(0), 
    $n$Literal$$(64))), $n$BinaryExpression$$(">>", $n$BinaryExpression$$("&", $n$BinaryExpression$$("&", $n$BinaryExpression$$("^", $n$Identifier$$("value"), $n$Identifier$$("val")), $n$BinaryExpression$$("^", $n$Identifier$$("val"), $n$Identifier$$("temp"))), $n$Literal$$(32768)), $n$Literal$$(13))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("h"), $n$BinaryExpression$$("&", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(8)), $n$Literal$$(255)))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("l"), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(255))))];
  };
}, $NEG$:function() {
  return function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$Register$$("a"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$Literal$$(0))), $n$ExpressionStatement$$($n$CallExpression$$("sub_a", $n$Identifier$$("temp")))];
  };
}, $RETN_RETI$:function() {
  return function() {
    return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("pc"), $o$$.$READ_MEM16$($n$Identifier$$("sp")))), $n$ExpressionStatement$$($n$AssignmentExpression$$("+=", $n$Identifier$$("sp"), $n$Literal$$(2))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("iff1"), $n$Identifier$$("iff2")))];
  };
}, $IM$:function($value$$175$$) {
  return function() {
    return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("im"), $n$Literal$$($value$$175$$)));
  };
}, $INI$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$CallExpression$$("port.in_", $n$Register$$("c")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("getHL"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")()], $o$$.$INC16$("h", "l")(), [$n$IfStatement$$($n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]);
  };
}, $OUTI$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")()], $o$$.$INC16$("h", "l")(), [$n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]);
  };
}, $OUTD$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")()], $o$$.$DEC16$("h", "l")(), [$n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(128)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2))))))]);
  };
}, $LDI$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")]))], $o$$.$DEC16$("b", "c")(), $o$$.$INC16$("d", "e")(), $o$$.$INC16$("h", "l")(), [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), 
    $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))]);
  };
}, $RRD$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$CallExpression$$("getHL"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$Identifier$$("location")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(4)), $n$BinaryExpression$$("<<", $n$BinaryExpression$$("&", 
    $n$Register$$("a"), $n$Literal$$(15)), $n$Literal$$(4)))])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("a"), $n$Literal$$(240)), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(15))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Identifier$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), 
    $n$Register$$("a")))))]);
  };
}, $RLD$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$CallExpression$$("getHL"))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$Identifier$$("location")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("location"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("<<", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(15)), $n$Literal$$(4)), $n$BinaryExpression$$("&", 
    $n$Register$$("a"), $n$Literal$$(15)))])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("a"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("a"), $n$Literal$$(240)), $n$BinaryExpression$$(">>", $n$Identifier$$("temp"), $n$Literal$$(4))))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Identifier$$("f"), $n$Literal$$(1)), $n$MemberExpression$$($n$Identifier$$("SZP_TABLE"), 
    $n$Register$$("a")))))]);
  };
}, $CPI$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))]))], $o$$.$DEC16$("b", "c")(), $o$$.$INC16$("h", "l")(), [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("===", 
    $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]);
  };
}, $LDD$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")]))], $o$$.$DEC16$("b", "c")(), $o$$.$DEC16$("d", "e")(), $o$$.$DEC16$("h", "l")(), [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), 
    $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0)))))]);
  };
}, $LDIR$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")]))], $o$$.$DEC16$("b", "c")(), $o$$.$INC16$("d", "e")(), $o$$.$INC16$("h", "l")(), [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), 
    $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))]);
  };
}, $CPIR$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(1)), $n$Literal$$(2)))), $n$ExpressionStatement$$($n$CallExpression$$("cp_a", [$o$$.$READ_MEM8$($n$CallExpression$$("getHL"))]))], $o$$.$DEC16$("b", "c")(), $o$$.$INC16$("h", "l")(), [$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Identifier$$("temp"), $n$ConditionalExpression$$($n$BinaryExpression$$("===", 
    $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$Literal$$(0), $n$Literal$$(4)))), $n$IfStatement$$({type:"LogicalExpression", operator:"&&", left:$n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(4)), $n$Literal$$(0)), right:$n$BinaryExpression$$("===", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(64)), $n$Literal$$(0))}, $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp")))), $n$ReturnStatement$$()])), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(248)), $n$Identifier$$("temp"))))]);
  };
}, $OTIR$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")()], $o$$.$INC16$("h", "l")(), [$n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ReturnStatement$$()]))]);
  };
}, $LDDR$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$CallExpression$$("getDE"), $n$Identifier$$("temp")]))], $o$$.$DEC16$("b", "c")(), $o$$.$DEC16$("d", "e")(), $o$$.$DEC16$("h", "l")(), [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$Identifier$$("temp"), 
    $n$Register$$("a")), $n$Literal$$(255)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$("f"), $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Register$$("f"), $n$Literal$$(193)), $n$ConditionalExpression$$($n$CallExpression$$("getBC"), $n$Literal$$(4), $n$Literal$$(0))), $n$BinaryExpression$$("&", $n$Identifier$$("temp"), $n$Literal$$(8))), $n$ConditionalExpression$$($n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(2)), $n$Literal$$(32), $n$Literal$$(0))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$CallExpression$$("getBC"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), $n$ReturnStatement$$()]))]);
  };
}, $OTDR$:function() {
  return function() {
    return [].concat([$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("temp"), $o$$.$READ_MEM8$($n$CallExpression$$("getHL")))), $n$ExpressionStatement$$($n$CallExpression$$("port.out", [$n$Register$$("c"), $n$Identifier$$("temp")])), $o$$.$DEC8$("b")()], $o$$.$DEC16$("h", "l")(), [$n$IfStatement$$($n$BinaryExpression$$(">", $n$BinaryExpression$$("+", $n$Register$$("l"), $n$Identifier$$("temp")), $n$Literal$$(255)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("|=", 
    $n$Register$$("f"), $n$Literal$$(1))), $n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(16)))]), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(1)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(16))))])), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$BinaryExpression$$("&", $n$Identifier$$("temp"), 
    $n$Literal$$(128)), $n$Literal$$(0)), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("|=", $n$Register$$("f"), $n$Literal$$(2)))), $n$BlockStatement$$($n$ExpressionStatement$$($n$AssignmentExpression$$("&=", $n$Register$$("f"), $n$UnaryExpression$$("~", $n$Literal$$(2)))))), $n$IfStatement$$($n$BinaryExpression$$("!==", $n$Register$$("b"), $n$Literal$$(0)), $n$BlockStatement$$([$n$ExpressionStatement$$($n$AssignmentExpression$$("-=", $n$Identifier$$("tstates"), $n$Literal$$(5))), 
    $n$ReturnStatement$$()]))]);
  };
}, LD_RLC:$generateIndexCBFunctions$$("rlc"), LD_RRC:$generateIndexCBFunctions$$("rrc"), LD_RL:$generateIndexCBFunctions$$("rl"), LD_RR:$generateIndexCBFunctions$$("rr"), LD_SLA:$generateIndexCBFunctions$$("sla"), LD_SRA:$generateIndexCBFunctions$$("sra"), LD_SLL:$generateIndexCBFunctions$$("sll"), LD_SRL:$generateIndexCBFunctions$$("srl"), $READ_MEM8$:function($value$$189$$) {
  return $n$CallExpression$$("getUint8", $value$$189$$);
}, $READ_MEM16$:function($value$$190$$) {
  return $n$CallExpression$$("getUint16", $value$$190$$);
}};
function $generateCBFunctions$$($fn$$3$$) {
  return function($register1$$39$$, $register2$$39$$) {
    return void 0 === $register2$$39$$ ? function() {
      return $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register1$$39$$), $n$CallExpression$$($fn$$3$$, $n$Register$$($register1$$39$$))));
    } : function() {
      return $n$ExpressionStatement$$($n$CallExpression$$("setUint8", $n$CallExpression$$("get" + ($register1$$39$$ + $register2$$39$$).toUpperCase())));
    };
  };
}
function $generateIndexCBFunctions$$($fn$$4$$) {
  return function($register1$$40$$, $register2$$40$$, $register3$$2$$) {
    return void 0 === $register3$$2$$ ? function($value$$191$$) {
      return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$40$$ + $register2$$40$$).toUpperCase()), $n$Literal$$($value$$191$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", [$n$Identifier$$("location"), $n$CallExpression$$($fn$$4$$, $o$$.$READ_MEM8$($n$Identifier$$("location")))]))];
    } : function($value$$192$$) {
      return [$n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Identifier$$("location"), $n$BinaryExpression$$("&", $n$BinaryExpression$$("+", $n$CallExpression$$("get" + ($register1$$40$$ + $register2$$40$$).toUpperCase()), $n$Literal$$($value$$192$$)), $n$Literal$$(65535)))), $n$ExpressionStatement$$($n$AssignmentExpression$$("=", $n$Register$$($register3$$2$$), $n$CallExpression$$($fn$$4$$, $o$$.$READ_MEM8$($n$Identifier$$("location"))))), $n$ExpressionStatement$$($n$CallExpression$$("setUint8", 
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
;function $generateIndexTable$$($index$$51$$) {
  var $register_registerL$$ = $index$$51$$.substring(1, 2).toLowerCase(), $registerH$$ = "i" + $register_registerL$$ + "H", $register_registerL$$ = "i" + $register_registerL$$ + "L";
  return {9:{name:"ADD " + $index$$51$$ + ",BC", $ast$:$o$$.$ADD16$($registerH$$, $register_registerL$$, "b", "c")}, 25:{name:"ADD " + $index$$51$$ + ",DE", $ast$:$o$$.$ADD16$($registerH$$, $register_registerL$$, "d", "e")}, 33:{name:"LD " + $index$$51$$ + ",nn", $ast$:$o$$.$LD16$($registerH$$, $register_registerL$$)}, 34:{name:"LD (nn)," + $index$$51$$, $ast$:$o$$.$LD_NN$($registerH$$, $register_registerL$$)}, 35:{name:"INC " + $index$$51$$, $ast$:$o$$.$INC16$($registerH$$, $register_registerL$$)}, 
  42:{name:"LD " + $index$$51$$ + ",(nn)", $ast$:$o$$.$LD16$($registerH$$, $register_registerL$$, "n", "n")}, 43:{name:"DEC " + $index$$51$$, $ast$:$o$$.$DEC16$($registerH$$, $register_registerL$$)}, 52:{name:"INC (" + $index$$51$$ + "+d)", $ast$:$o$$.$INC_X$($registerH$$, $register_registerL$$)}, 53:{name:"DEC (" + $index$$51$$ + "+d)", $ast$:$o$$.$DEC_X$($registerH$$, $register_registerL$$)}, 54:{name:"LD (" + $index$$51$$ + "+d),n", $ast$:$o$$.$LD_X$($registerH$$, $register_registerL$$)}, 57:{name:"ADD " + 
  $index$$51$$ + ",SP", $ast$:$o$$.$ADD16$($registerH$$, $register_registerL$$, "sp")}, 70:{name:"LD B,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("b", $registerH$$, $register_registerL$$)}, 78:{name:"LD C,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("c", $registerH$$, $register_registerL$$)}, 84:{name:" LD D," + $index$$51$$ + "H *", $ast$:$o$$.$LD8$("d", $registerH$$)}, 86:{name:"LD D,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("d", $registerH$$, $register_registerL$$)}, 93:{name:"LD E," + 
  $index$$51$$ + "L *", $ast$:$o$$.$LD8$("e", $register_registerL$$)}, 94:{name:"LD E,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("e", $registerH$$, $register_registerL$$)}, 96:{name:"LD " + $index$$51$$ + "H,B", $ast$:$o$$.$LD8$($registerH$$, "b")}, 97:{name:"LD " + $index$$51$$ + "H,C", $ast$:$o$$.$LD8$($registerH$$, "c")}, 98:{name:"LD " + $index$$51$$ + "H,D", $ast$:$o$$.$LD8$($registerH$$, "d")}, 99:{name:"LD " + $index$$51$$ + "H,E", $ast$:$o$$.$LD8$($registerH$$, "e")}, 100:{name:"LD " + 
  $index$$51$$ + "H," + $index$$51$$ + "H", $ast$:$o$$.$NOOP$()}, 101:{name:"LD " + $index$$51$$ + "H," + $index$$51$$ + "L *", $ast$:$o$$.$LD8_D$($registerH$$, $register_registerL$$)}, 102:{name:"LD H,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("h", $registerH$$, $register_registerL$$)}, 103:{name:"LD " + $index$$51$$ + "H,A", $ast$:$o$$.$LD8$($registerH$$, "a")}, 104:{name:"LD " + $index$$51$$ + "L,B", $ast$:$o$$.$LD8$($register_registerL$$, "b")}, 105:{name:"LD " + $index$$51$$ + "L,C", $ast$:$o$$.$LD8$($register_registerL$$, 
  "c")}, 106:{name:"LD " + $index$$51$$ + "L,D", $ast$:$o$$.$LD8$($register_registerL$$, "d")}, 107:{name:"LD " + $index$$51$$ + "L,E", $ast$:$o$$.$LD8$($register_registerL$$, "e")}, 108:{name:"LD " + $index$$51$$ + "L," + $index$$51$$ + "H", $ast$:$o$$.$LD8_D$($register_registerL$$, $registerH$$)}, 109:{name:"LD " + $index$$51$$ + "L," + $index$$51$$ + "L *", $ast$:$o$$.$NOOP$()}, 110:{name:"LD L,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("l", $registerH$$, $register_registerL$$)}, 111:{name:"LD " + 
  $index$$51$$ + "L,A *", $ast$:$o$$.$LD8$($register_registerL$$, "a")}, 112:{name:"LD (" + $index$$51$$ + "+d),B", $ast$:$o$$.$LD_X$("b", $registerH$$, $register_registerL$$)}, 113:{name:"LD (" + $index$$51$$ + "+d),C", $ast$:$o$$.$LD_X$("c", $registerH$$, $register_registerL$$)}, 114:{name:"LD (" + $index$$51$$ + "+d),D", $ast$:$o$$.$LD_X$("d", $registerH$$, $register_registerL$$)}, 115:{name:"LD (" + $index$$51$$ + "+d),E", $ast$:$o$$.$LD_X$("e", $registerH$$, $register_registerL$$)}, 116:{name:"LD (" + 
  $index$$51$$ + "+d),H", $ast$:$o$$.$LD_X$("h", $registerH$$, $register_registerL$$)}, 117:{name:"LD (" + $index$$51$$ + "+d),L", $ast$:$o$$.$LD_X$("l", $registerH$$, $register_registerL$$)}, 118:{name:"LD (" + $index$$51$$ + "+d),B", $ast$:$o$$.$LD_X$("b", $registerH$$, $register_registerL$$)}, 119:{name:"LD (" + $index$$51$$ + "+d),A", $ast$:$o$$.$LD_X$("a", $registerH$$, $register_registerL$$)}, 126:{name:"LD A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$LD8_D$("a", $registerH$$, $register_registerL$$)}, 
  124:{name:"LD A," + $index$$51$$ + "H", $ast$:$o$$.$LD8$("a", $registerH$$)}, 125:{name:"LD A," + $index$$51$$ + "L", $ast$:$o$$.$LD8$("a", $register_registerL$$)}, 132:{name:"ADD A," + $index$$51$$ + "H", $ast$:$o$$.$ADD$($register_registerL$$)}, 133:{name:"ADD A," + $index$$51$$ + "L", $ast$:$o$$.$ADD$($register_registerL$$)}, 134:{name:"ADD A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$ADD_X$($registerH$$, $register_registerL$$)}, 140:{name:"ADC A," + $index$$51$$ + "H", $ast$:$o$$.$ADC$($register_registerL$$)}, 
  141:{name:"ADC A," + $index$$51$$ + "L", $ast$:$o$$.$ADC$($register_registerL$$)}, 142:{name:"ADC A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$ADC_X$($registerH$$, $register_registerL$$)}, 148:{name:"SUB A," + $index$$51$$ + "H", $ast$:$o$$.$SUB$($register_registerL$$)}, 149:{name:"SUB A," + $index$$51$$ + "L", $ast$:$o$$.$SUB$($register_registerL$$)}, 150:{name:"SUB A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$SUB_X$($registerH$$, $register_registerL$$)}, 156:{name:"SBC A," + $index$$51$$ + "H", $ast$:$o$$.$SBC$($register_registerL$$)}, 
  157:{name:"SBC A," + $index$$51$$ + "L", $ast$:$o$$.$SBC$($register_registerL$$)}, 158:{name:"SBC A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$SBC_X$($registerH$$, $register_registerL$$)}, 166:{name:"AND A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$AND_X$($registerH$$, $register_registerL$$)}, 174:{name:"XOR A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$XOR_X$($registerH$$, $register_registerL$$)}, 182:{name:"OR A,(" + $index$$51$$ + "+d)", $ast$:$o$$.$OR_X$($registerH$$, $register_registerL$$)}, 190:{name:"CP (" + 
  $index$$51$$ + "+d)", $ast$:$o$$.$CP_X$($registerH$$, $register_registerL$$)}, 203:"IX" === $index$$51$$ ? $opcodeTableDDCB$$ : $opcodeTableFDCB$$, 225:{name:"POP " + $index$$51$$, $ast$:$o$$.$POP$($registerH$$, $register_registerL$$)}, 227:{name:"EX SP,(" + $index$$51$$ + ")", $ast$:$o$$.$EX_SP_X$($registerH$$, $register_registerL$$)}, 229:{name:"PUSH " + $index$$51$$, $ast$:$o$$.PUSH($registerH$$, $register_registerL$$)}, 233:{name:"JP (" + $index$$51$$ + ")", $ast$:$o$$.$JP_X$($registerH$$, 
  $register_registerL$$)}, 249:{name:"LD SP," + $index$$51$$, $ast$:$o$$.$LD_SP$($registerH$$, $register_registerL$$)}};
}
;var $opcodeTableED$$ = {64:{name:"IN B,(C)", $ast$:$o$$.$IN$("b", "c")}, 66:{name:"SBC HL,BC", $ast$:$o$$.$SBC16$("b", "c")}, 65:{name:"OUT (C),B", $ast$:$o$$.$OUT$("c", "b")}, 67:{name:"LD (nn),BC", $ast$:$o$$.$LD_NN$("b", "c")}, 68:{name:"NEG", $ast$:$o$$.$NEG$()}, 69:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 70:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 72:{name:"IN C,(C)", $ast$:$o$$.$IN$("c", "c")}, 73:{name:"OUT (C),C", $ast$:$o$$.$OUT$("c", "c")}, 74:{name:"ADC HL,BC", $ast$:$o$$.$ADC16$("b", 
"c")}, 75:{name:"LD BC,(nn)", $ast$:$o$$.$LD16$("b", "c", "n", "n")}, 76:{name:"NEG", $ast$:$o$$.$NEG$()}, 77:{name:"RETN / RETI", $ast$:$o$$.$RETN_RETI$()}, 78:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 79:{name:"LD R,A", $ast$:$o$$.$LD8$("r", "a")}, 80:{name:"IN D,(C)", $ast$:$o$$.$IN$("d", "c")}, 81:{name:"OUT (C),D", $ast$:$o$$.$OUT$("c", "d")}, 82:{name:"SBC HL,DE", $ast$:$o$$.$SBC16$("d", "e")}, 83:{name:"LD (nn),DE", $ast$:$o$$.$LD_NN$("d", "e")}, 84:{name:"NEG", $ast$:$o$$.$NEG$()}, 85:{name:"RETN / RETI", 
$ast$:$o$$.$RETN_RETI$()}, 86:{name:"IM 1", $ast$:$o$$.$IM$(1)}, 87:{name:"LD A,I", $ast$:$o$$.$LD8$("a", "i")}, 88:{name:"IN E,(C)", $ast$:$o$$.$IN$("e", "c")}, 89:{name:"OUT (C),E", $ast$:$o$$.$OUT$("c", "e")}, 90:{name:"ADC HL,DE", $ast$:$o$$.$ADC16$("d", "e")}, 91:{name:"LD DE,(nn)", $ast$:$o$$.$LD16$("d", "e", "n", "n")}, 92:{name:"NEG", $ast$:$o$$.$NEG$()}, 95:{name:"LD A,R", $ast$:$o$$.$LD8$("a", "r")}, 96:{name:"IN H,(C)", $ast$:$o$$.$IN$("h", "c")}, 97:{name:"OUT (C),H", $ast$:$o$$.$OUT$("c", 
"h")}, 98:{name:"SBC HL,HL", $ast$:$o$$.$SBC16$("h", "l")}, 99:{name:"LD (nn),HL", $ast$:$o$$.$LD_NN$("h", "l")}, 100:{name:"NEG", $ast$:$o$$.$NEG$()}, 102:{name:"IM 0", $ast$:$o$$.$IM$(0)}, 103:{name:"RRD", $ast$:$o$$.$RRD$()}, 104:{name:"IN L,(C)", $ast$:$o$$.$IN$("l", "c")}, 105:{name:"OUT (C),L", $ast$:$o$$.$OUT$("c", "l")}, 106:{name:"ADC HL,HL", $ast$:$o$$.$ADC16$("h", "l")}, 107:{name:"LD HL,(nn)", $ast$:$o$$.$LD16$("h", "l", "n", "n")}, 108:{name:"NEG", $ast$:$o$$.$NEG$()}, 110:{name:"IM 0", 
$ast$:$o$$.$IM$(0)}, 111:{name:"RLD", $ast$:$o$$.$RLD$()}, 115:{name:"LD (nn),SP", $ast$:$o$$.$LD_NN$("sp")}, 116:{name:"NEG", $ast$:$o$$.$NEG$()}, 118:{name:"IM 1", $ast$:$o$$.$IM$(1)}, 120:{name:"IN A,(C)", $ast$:$o$$.$IN$("a", "c")}, 121:{name:"OUT (C),A", $ast$:$o$$.$OUT$("c", "a")}, 122:{name:"ADC HL,SP", $ast$:$o$$.$ADC16$("sp")}, 123:{name:"LD SP,(nn)", $ast$:$o$$.$LD_SP$("n", "n")}, 124:{name:"NEG", $ast$:$o$$.$NEG$()}, 160:{name:"LDI", $ast$:$o$$.$LDI$()}, 161:{name:"CPI", $ast$:$o$$.$CPI$()}, 
162:{name:"INI", $ast$:$o$$.$INI$()}, 163:{name:"OUTI", $ast$:$o$$.$OUTI$()}, 168:{name:"LDD", $ast$:$o$$.$LDD$()}, 171:{name:"OUTD", $ast$:$o$$.$OUTD$()}, 176:{name:"LDIR", $ast$:$o$$.$LDIR$()}, 177:{name:"CPIR", $ast$:$o$$.$CPIR$()}, 179:{name:"OTIR", $ast$:$o$$.$OTIR$()}, 184:{name:"LDDR", $ast$:$o$$.$LDDR$()}, 187:{name:"OTDR", $ast$:$o$$.$OTDR$()}};
var $opcodeTable$$ = [{name:"NOP", $ast$:$o$$.$NOOP$()}, {name:"LD BC,nn", $ast$:$o$$.$LD16$("b", "c")}, {name:"LD (BC),A", $ast$:$o$$.$LD_WRITE_MEM$("b", "c", "a")}, {name:"INC BC", $ast$:$o$$.$INC16$("b", "c")}, {name:"INC B", $ast$:$o$$.$INC8$("b")}, {name:"DEC B", $ast$:$o$$.$DEC8$("b")}, {name:"LD B,n", $ast$:$o$$.$LD8$("b")}, {name:"RLCA", $ast$:$o$$.$RLCA$()}, {name:"EX AF AF'", $ast$:$o$$.$EX_AF$()}, {name:"ADD HL,BC", $ast$:$o$$.$ADD16$("h", "l", "b", "c")}, {name:"LD A,(BC)", $ast$:$o$$.$LD8$("a", 
"b", "c")}, {name:"DEC BC", $ast$:$o$$.$DEC16$("b", "c")}, {name:"INC C", $ast$:$o$$.$INC8$("c")}, {name:"DEC C", $ast$:$o$$.$DEC8$("c")}, {name:"LD C,n", $ast$:$o$$.$LD8$("c")}, {name:"RRCA", $ast$:$o$$.$RRCA$()}, {name:"DJNZ (PC+e)", $ast$:$o$$.$DJNZ$()}, {name:"LD DE,nn", $ast$:$o$$.$LD16$("d", "e")}, {name:"LD (DE),A", $ast$:$o$$.$LD_WRITE_MEM$("d", "e", "a")}, {name:"INC DE", $ast$:$o$$.$INC16$("d", "e")}, {name:"INC D", $ast$:$o$$.$INC8$("d")}, {name:"DEC D", $ast$:$o$$.$DEC8$("d")}, {name:"LD D,n", 
$ast$:$o$$.$LD8$("d")}, {name:"RLA", $ast$:$o$$.$RLA$()}, {name:"JR (PC+e)", $ast$:$o$$.$JR$()}, {name:"ADD HL,DE", $ast$:$o$$.$ADD16$("h", "l", "d", "e")}, {name:"LD A,(DE)", $ast$:$o$$.$LD8$("a", "d", "e")}, {name:"DEC DE", $ast$:$o$$.$DEC16$("d", "e")}, {name:"INC E", $ast$:$o$$.$INC8$("e")}, {name:"DEC E", $ast$:$o$$.$DEC8$("e")}, {name:"LD E,n", $ast$:$o$$.$LD8$("e")}, {name:"RRA", $ast$:$o$$.$RRA$()}, {name:"JR NZ,(PC+e)", $ast$:$o$$.$JRNZ$()}, {name:"LD HL,nn", $ast$:$o$$.$LD16$("h", "l")}, 
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
"l")}, {name:"OR A,A", $ast$:$o$$.$OR$("a")}, {name:"CP A,B", $ast$:$o$$.$CP$("b")}, {name:"CP A,C", $ast$:$o$$.$CP$("c")}, {name:"CP A,D", $ast$:$o$$.$CP$("d")}, {name:"CP A,E", $ast$:$o$$.$CP$("e")}, {name:"CP A,H", $ast$:$o$$.$CP$("h")}, {name:"CP A,L", $ast$:$o$$.$CP$("l")}, {name:"CP A,(HL)", $ast$:$o$$.$CP$("h", "l")}, {name:"CP A,A", $ast$:$o$$.$CP$("a")}, {name:"RET NZ", $ast$:$o$$.$RET$("===", 64)}, {name:"POP BC", $ast$:$o$$.$POP$("b", "c")}, {name:"JP NZ,(nn)", $ast$:$o$$.$JP$("===", 64)}, 
{name:"JP (nn)", $ast$:$o$$.$JP$()}, {name:"CALL NZ (nn)", $ast$:$o$$.$CALL$("===", 64)}, {name:"PUSH BC", $ast$:$o$$.PUSH("b", "c")}, {name:"ADD A,n", $ast$:$o$$.$ADD$()}, {name:"RST 0x00", $ast$:$o$$.$RST$(0)}, {name:"RET Z", $ast$:$o$$.$RET$("!==", 64)}, {name:"RET", $ast$:$o$$.$RET$()}, {name:"JP Z,(nn)", $ast$:$o$$.$JP$("!==", 64)}, $opcodeTableCB$$, {name:"CALL Z (nn)", $ast$:$o$$.$CALL$("!==", 64)}, {name:"CALL (nn)", $ast$:$o$$.$CALL$()}, {name:"ADC A,n", $ast$:$o$$.$ADC$()}, {name:"RST 0x08", 
$ast$:$o$$.$RST$(8)}, {name:"RET NC", $ast$:$o$$.$RET$("===", 1)}, {name:"POP DE", $ast$:$o$$.$POP$("d", "e")}, {name:"JP NC,(nn)", $ast$:$o$$.$JP$("===", 1)}, {name:"OUT (n),A", $ast$:$o$$.$OUT$("a")}, {name:"CALL NC (nn)", $ast$:$o$$.$CALL$("===", 1)}, {name:"PUSH DE", $ast$:$o$$.PUSH("d", "e")}, {name:"SUB n", $ast$:$o$$.$SUB$()}, {name:"RST 0x10", $ast$:$o$$.$RST$(16)}, {name:"RET C", $ast$:$o$$.$RET$("!==", 1)}, {name:"EXX", $ast$:$o$$.$EXX$()}, {name:"JP C,(nn)", $ast$:$o$$.$JP$("!==", 1)}, 
{name:"IN A,(n)", $ast$:$o$$.$IN$("a")}, {name:"CALL C (nn)", $ast$:$o$$.$CALL$("!==", 1)}, $generateIndexTable$$("IX"), {name:"SBC A,n", $ast$:$o$$.$SBC$()}, {name:"RST 0x18", $ast$:$o$$.$RST$(24)}, {name:"RET PO", $ast$:$o$$.$RET$("===", 4)}, {name:"POP HL", $ast$:$o$$.$POP$("h", "l")}, {name:"JP PO,(nn)", $ast$:$o$$.$JP$("===", 4)}, {name:"EX (SP),HL", $ast$:$o$$.$EX_SP_HL$()}, {name:"CALL PO (nn)", $ast$:$o$$.$CALL$("===", 4)}, {name:"PUSH HL", $ast$:$o$$.PUSH("h", "l")}, {name:"AND (n)", $ast$:$o$$.$AND$()}, 
{name:"RST 0x20", $ast$:$o$$.$RST$(32)}, {name:"RET PE", $ast$:$o$$.$RET$("!==", 4)}, {name:"JP (HL)", $ast$:$o$$.$JP$("h", "l")}, {name:"JP PE,(nn)", $ast$:$o$$.$JP$("!==", 4)}, {name:"EX DE,HL", $ast$:$o$$.$EX_DE_HL$()}, {name:"CALL PE (nn)", $ast$:$o$$.$CALL$("!==", 4)}, $opcodeTableED$$, {name:"XOR n", $ast$:$o$$.$XOR$()}, {name:"RST 0x28", $ast$:$o$$.$RST$(40)}, {name:"RET P", $ast$:$o$$.$RET$("===", 128)}, {name:"POP AF", $ast$:$o$$.$POP$("a", "f")}, {name:"JP P,(nn)", $ast$:$o$$.$JP$("===", 
128)}, {name:"DI", $ast$:$o$$.$DI$()}, {name:"CALL P (nn)", $ast$:$o$$.$CALL$("===", 128)}, {name:"PUSH AF", $ast$:$o$$.PUSH("a", "f")}, {name:"OR n", $ast$:$o$$.$OR$()}, {name:"RST 0x30", $ast$:$o$$.$RST$(48)}, {name:"RET M", $ast$:$o$$.$RET$("!==", 128)}, {name:"LD SP,HL", $ast$:$o$$.$LD_SP$("h", "l")}, {name:"JP M,(nn)", $ast$:$o$$.$JP$("!==", 128)}, {name:"EI", $ast$:$o$$.$EI$()}, {name:"CALL M (nn)", $ast$:$o$$.$CALL$("!==", 128)}, $generateIndexTable$$("IY"), {name:"CP n", $ast$:$o$$.$CP$()}, 
{name:"RST 0x38", $ast$:$o$$.$RST$(56)}];
var $Analyzer$$ = function() {
  function $Analyzer$$1$$() {
    this.$bytecodes$ = {};
    this.$ast$ = [];
    this.$missingOpcodes$ = {};
  }
  $Analyzer$$1$$.prototype = {$analyze$:function $$Analyzer$$1$$$$$analyze$$($bytecodes_i$$31$$) {
    this.$bytecodes$ = $bytecodes_i$$31$$;
    this.$ast$ = Array(this.$bytecodes$.length);
    $JSSMS$Utils$$.console.time("Analyzing");
    for ($bytecodes_i$$31$$ = 0;$bytecodes_i$$31$$ < this.$bytecodes$.length;$bytecodes_i$$31$$++) {
      this.$a$($bytecodes_i$$31$$), this.$f$($bytecodes_i$$31$$);
    }
    $JSSMS$Utils$$.console.timeEnd("Analyzing");
    for ($bytecodes_i$$31$$ in this.$missingOpcodes$) {
      console.error("Missing opcode", $bytecodes_i$$31$$, this.$missingOpcodes$[$bytecodes_i$$31$$]);
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
    this.$ast$[$page$$7$$] = this.$ast$[$page$$7$$].map(this.$m$.bind(this));
  }, $a$:function $$Optimizer$$1$$$$$a$$($fn$$5$$) {
    return $fn$$5$$.map(function($_ast$$) {
      return $_ast$$ = $JSSMS$Utils$$.$traverse$($_ast$$, function($ast$$1$$) {
        if ("BinaryExpression" === $ast$$1$$.type && "Literal" === $ast$$1$$.left.type && "Literal" === $ast$$1$$.right.type) {
          var $value$$193$$;
          switch($ast$$1$$.operator) {
            case ">>":
              $value$$193$$ = $ast$$1$$.left.value >> $ast$$1$$.right.value;
              break;
            case "&":
              $value$$193$$ = $ast$$1$$.left.value & $ast$$1$$.right.value;
              break;
            default:
              return $JSSMS$Utils$$.console.log("Unimplemented evaluation optimization for operator", $ast$$1$$.operator), $ast$$1$$;
          }
          $ast$$1$$.type = "Literal";
          $ast$$1$$.value = $value$$193$$;
          $ast$$1$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$($value$$193$$) : "" + $value$$193$$;
          delete $ast$$1$$.right;
          delete $ast$$1$$.left;
        }
        return $ast$$1$$;
      });
    });
  }, $f$:function $$Optimizer$$1$$$$$f$$($fn$$6$$) {
    var $self$$6$$ = this;
    return $fn$$6$$.map(function($_ast$$1$$) {
      return $_ast$$1$$ = $JSSMS$Utils$$.$traverse$($_ast$$1$$, function($ast$$2$$) {
        if ("MemberExpression" === $ast$$2$$.type && "SZP_TABLE" === $ast$$2$$.object.name && "Literal" === $ast$$2$$.property.type) {
          var $value$$194$$ = $self$$6$$.$main$.$cpu$.$SZP_TABLE$[$ast$$2$$.property.value];
          $ast$$2$$.type = "Literal";
          $ast$$2$$.value = $value$$194$$;
          $ast$$2$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$($value$$194$$) : "" + $value$$194$$;
          delete $ast$$2$$.computed;
          delete $ast$$2$$.object;
          delete $ast$$2$$.property;
        }
        return $ast$$2$$;
      });
    });
  }, $g$:function $$Optimizer$$1$$$$$g$$($fn$$7$$) {
    var $definedReg$$ = {$b$:!1, $c$:!1, d:!1, e:!1, $h$:!1, $l$:!1}, $definedRegValue$$ = {$b$:{}, $c$:{}, d:{}, e:{}, $h$:{}, $l$:{}};
    return $fn$$7$$.map(function($_ast$$2$$) {
      return $_ast$$2$$ = $JSSMS$Utils$$.$traverse$($_ast$$2$$, function($ast$$3$$) {
        "AssignmentExpression" === $ast$$3$$.type && "=" === $ast$$3$$.operator && "Register" === $ast$$3$$.left.type && "Literal" === $ast$$3$$.right.type && "a" !== $ast$$3$$.left.name && "f" !== $ast$$3$$.left.name && ($definedReg$$[$ast$$3$$.left.name] = !0, $definedRegValue$$[$ast$$3$$.left.name] = $ast$$3$$.right);
        if ("AssignmentExpression" === $ast$$3$$.type && "Register" === $ast$$3$$.left.type && "Literal" !== $ast$$3$$.right.type && "a" !== $ast$$3$$.left.name && "f" !== $ast$$3$$.left.name) {
          return $definedReg$$[$ast$$3$$.left.name] = !1, $definedRegValue$$[$ast$$3$$.left.name] = {}, $ast$$3$$;
        }
        if ("CallExpression" === $ast$$3$$.type) {
          return $ast$$3$$.arguments[0] && "Register" === $ast$$3$$.arguments[0].type && $definedReg$$[$ast$$3$$.arguments[0].name] && "a" !== $ast$$3$$.arguments[0].name && "f" !== $ast$$3$$.arguments[0].name && ($ast$$3$$.arguments[0] = $definedRegValue$$[$ast$$3$$.arguments[0].name]), $ast$$3$$.arguments[1] && "Register" === $ast$$3$$.arguments[1].type && $definedReg$$[$ast$$3$$.arguments[1].name] && "a" !== $ast$$3$$.arguments[1].name && "f" !== $ast$$3$$.arguments[1].name && ($ast$$3$$.arguments[1] = 
          $definedRegValue$$[$ast$$3$$.arguments[1].name]), $ast$$3$$;
        }
        if ("MemberExpression" === $ast$$3$$.type && "Register" === $ast$$3$$.property.type && $definedReg$$[$ast$$3$$.property.name] && "a" !== $ast$$3$$.property.name && "f" !== $ast$$3$$.property.name) {
          return $ast$$3$$.property = $definedRegValue$$[$ast$$3$$.property.name], $ast$$3$$;
        }
        "BinaryExpression" === $ast$$3$$.type && ("Register" === $ast$$3$$.right.type && $definedReg$$[$ast$$3$$.right.name] && "a" !== $ast$$3$$.right.name && "f" !== $ast$$3$$.right.name && ($ast$$3$$.right = $definedRegValue$$[$ast$$3$$.right.name]), "Register" === $ast$$3$$.left.type && $definedReg$$[$ast$$3$$.left.name] && "a" !== $ast$$3$$.left.name && "f" !== $ast$$3$$.left.name && ($ast$$3$$.left = $definedRegValue$$[$ast$$3$$.left.name]));
        return $ast$$3$$;
      });
    });
  }, $j$:function $$Optimizer$$1$$$$$j$$($fn$$8$$) {
    var $self$$7$$ = this;
    return $fn$$8$$.map(function($_ast$$3$$) {
      return $_ast$$3$$ = $JSSMS$Utils$$.$traverse$($_ast$$3$$, function($ast$$4$$) {
        if ("CallExpression" === $ast$$4$$.type) {
          if ("port.out" === $ast$$4$$.callee.name) {
            var $port$$4$$ = $ast$$4$$.arguments[0].value, $value$$195$$ = $ast$$4$$.arguments[1];
            if ($self$$7$$.$main$.$is_gg$ && 7 > $port$$4$$) {
              $ast$$4$$.callee.name = "nop";
              return;
            }
            switch($port$$4$$ & 193) {
              case 128:
                $ast$$4$$.callee.name = "vdp.dataWrite";
                $ast$$4$$.arguments = [$value$$195$$];
                break;
              case 129:
                $ast$$4$$.callee.name = "vdp.controlWrite";
                $ast$$4$$.arguments = [$value$$195$$];
                break;
              case 64:
              ;
              case 65:
                $self$$7$$.$main$.$soundEnabled$ && ($ast$$4$$.callee.name = "psg.write", $ast$$4$$.arguments = [$value$$195$$]);
            }
          } else {
            if ("port.in_" === $ast$$4$$.callee.name) {
              $port$$4$$ = $ast$$4$$.arguments[0].value;
              if ($self$$7$$.$main$.$is_gg$ && 7 > $port$$4$$) {
                switch($port$$4$$) {
                  case 0:
                    return $ast$$4$$.type = "BinaryExpression", $ast$$4$$.operator = "|", $ast$$4$$.left = $n$BinaryExpression$$("&", $n$Identifier$$("port.keyboard.ggstart"), $n$Literal$$(191)), $ast$$4$$.right = $n$Identifier$$("port.europe"), delete $ast$$4$$.callee, delete $ast$$4$$.arguments, $ast$$4$$;
                  case 1:
                  ;
                  case 2:
                  ;
                  case 3:
                  ;
                  case 4:
                  ;
                  case 5:
                    return $ast$$4$$.type = "Literal", $ast$$4$$.value = 0, $ast$$4$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$(0) : "0", delete $ast$$4$$.callee, delete $ast$$4$$.arguments, $ast$$4$$;
                  case 6:
                    return $ast$$4$$.type = "Literal", $ast$$4$$.value = 255, $ast$$4$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$(255) : "255", delete $ast$$4$$.callee, delete $ast$$4$$.arguments, $ast$$4$$;
                }
              }
              switch($port$$4$$ & 193) {
                case 64:
                  return $ast$$4$$.callee.name = "vdp.getVCount", $ast$$4$$.arguments = [], $ast$$4$$;
                case 65:
                  return $ast$$4$$.type = "Identifier", $ast$$4$$.name = "port.hCounter", delete $ast$$4$$.callee, delete $ast$$4$$.arguments, $ast$$4$$;
                case 128:
                  return $ast$$4$$.callee.name = "vdp.dataRead", $ast$$4$$.arguments = [], $ast$$4$$;
                case 129:
                  return $ast$$4$$.callee.name = "vdp.controlRead", $ast$$4$$.arguments = [], $ast$$4$$;
                case 192:
                  return $ast$$4$$.type = "Identifier", $ast$$4$$.name = "main.keyboard.controller1", delete $ast$$4$$.callee, delete $ast$$4$$.arguments, $ast$$4$$;
                case 193:
                  return $ast$$4$$.type = "BinaryExpression", $ast$$4$$.operator = "|", $ast$$4$$.left = $n$BinaryExpression$$("|", $n$BinaryExpression$$("&", $n$Identifier$$("main.keyboard.controller2"), $n$Literal$$(63)), $n$MemberExpression$$($n$Identifier$$("port.ioPorts"), $n$Literal$$(0))), $ast$$4$$.right = $n$MemberExpression$$($n$Identifier$$("port.ioPorts"), $n$Literal$$(1)), delete $ast$$4$$.callee, delete $ast$$4$$.arguments, $ast$$4$$;
              }
              $ast$$4$$.type = "Literal";
              $ast$$4$$.value = 255;
              $ast$$4$$.raw = $DEBUG$$ ? $JSSMS$Utils$$.$toHex$(255) : "255";
              delete $ast$$4$$.callee;
              delete $ast$$4$$.arguments;
            }
          }
        }
        return $ast$$4$$;
      });
    });
  }, $m$:function $$Optimizer$$1$$$$$m$$($fn$$9$$) {
    var $returnStatementIndex$$ = null;
    $fn$$9$$.some(function($ast$$5$$, $index$$52$$) {
      if ("ReturnStatement" === $ast$$5$$.type) {
        return $returnStatementIndex$$ = $index$$52$$, !0;
      }
    });
    $returnStatementIndex$$ && ($fn$$9$$ = $fn$$9$$.slice(0, $returnStatementIndex$$));
    return $fn$$9$$;
  }};
  return $Optimizer$$1$$;
}();
var $CodeGenerator$$ = function() {
  function $CodeGenerator$$1$$() {
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
  var $toHex$$9$$ = $JSSMS$Utils$$.$toHex$;
  $CodeGenerator$$1$$.prototype = {$generate$:function $$CodeGenerator$$1$$$$$generate$$($functions$$1$$) {
    for (var $page$$8$$ = 0;$page$$8$$ < $functions$$1$$.length;$page$$8$$++) {
      $functions$$1$$[$page$$8$$] = $functions$$1$$[$page$$8$$].map(function($fn$$10$$) {
        var $body$$2$$ = [{type:"ExpressionStatement", expression:{type:"Literal", value:"use strict", raw:'"use strict"'}, _address:$fn$$10$$[0].$address$}], $tstates$$2$$ = 0;
        $fn$$10$$ = $fn$$10$$.map(function($bytecode$$9$$) {
          void 0 === $bytecode$$9$$.$ast$ && ($bytecode$$9$$.$ast$ = []);
          $tstates$$2$$ += $getTotalTStates$$1$$($bytecode$$9$$.$opcode$);
          var $decreaseTStateStmt_nextAddress$$49_updatePcStmt$$ = [{type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"-=", left:{type:"Identifier", name:"tstates"}, right:{type:"Literal", value:$tstates$$2$$, raw:$DEBUG$$ ? $toHex$$9$$($tstates$$2$$) : "" + $tstates$$2$$}}}];
          $tstates$$2$$ = 0;
          $bytecode$$9$$.$changePage$ && ($bytecode$$9$$.$ast$ = [].concat({type:"ExpressionStatement", expression:{type:"UpdateExpression", operator:"++", argument:{type:"Identifier", name:"page"}, prefix:!1}}, $bytecode$$9$$.$ast$));
          $bytecode$$9$$.$ast$ = [].concat($decreaseTStateStmt_nextAddress$$49_updatePcStmt$$, $bytecode$$9$$.$ast$);
          $bytecode$$9$$.$isFunctionEnder$ && null !== $bytecode$$9$$.$nextAddress$ && ($decreaseTStateStmt_nextAddress$$49_updatePcStmt$$ = $bytecode$$9$$.$nextAddress$ % 16384, $decreaseTStateStmt_nextAddress$$49_updatePcStmt$$ = {type:"ExpressionStatement", expression:{type:"AssignmentExpression", operator:"=", left:{type:"Identifier", name:"pc"}, right:{type:"BinaryExpression", operator:"+", left:{type:"Literal", value:$decreaseTStateStmt_nextAddress$$49_updatePcStmt$$, raw:$DEBUG$$ ? $toHex$$9$$($decreaseTStateStmt_nextAddress$$49_updatePcStmt$$) : 
          "" + $decreaseTStateStmt_nextAddress$$49_updatePcStmt$$}, right:{type:"BinaryExpression", operator:"*", left:{type:"Identifier", name:"page"}, right:{type:"Literal", value:16384, raw:"0x4000"}}}}}, $bytecode$$9$$.$ast$.push($decreaseTStateStmt_nextAddress$$49_updatePcStmt$$));
          $DEBUG$$ && $bytecode$$9$$.$ast$[0] && ($bytecode$$9$$.$ast$[0].$leadingComments$ = [{type:"Line", value:" " + $bytecode$$9$$.label}]);
          return $bytecode$$9$$.$ast$;
        });
        $fn$$10$$.forEach(function($ast$$6$$) {
          $body$$2$$ = $body$$2$$.concat($ast$$6$$);
        });
        return $body$$2$$;
      });
    }
    this.$ast$ = $functions$$1$$;
  }};
  return $CodeGenerator$$1$$;
}();
var $Recompiler$$ = function() {
  function $Recompiler$$1$$($cpu$$) {
    this.$cpu$ = $cpu$$;
    this.$rom$ = [];
    this.options = {};
    this.$parser$ = {};
    this.$analyzer$ = new $Analyzer$$;
    this.$optimizer$ = new $Optimizer$$($cpu$$.$main$);
    this.$generator$ = new $CodeGenerator$$;
    this.$bytecodes$ = {};
  }
  $Recompiler$$1$$.prototype = {$m$:function $$Recompiler$$1$$$$$m$$($rom$$2$$) {
    this.$rom$ = $rom$$2$$;
    this.$parser$ = new $Parser$$($rom$$2$$, this.$cpu$.$frameReg$);
  }, reset:function $$Recompiler$$1$$$$reset$() {
    var $self$$8$$ = this;
    this.options.$entryPoints$ = [{$address$:0, $romPage$:0, $memPage$:0}];
    2 >= this.$rom$.length ? $JSSMS$Utils$$.console.log("Parsing full ROM") : (this.options.$pageLimit$ = 0, $JSSMS$Utils$$.console.log("Parsing initial memory page of ROM"));
    for (var $fns$$ = this.parse().$analyze$().$generate$().$optimize$(), $page$$9$$ = 0;$page$$9$$ < this.$rom$.length;$page$$9$$++) {
      $fns$$[$page$$9$$].forEach(function($body$$3$$) {
        var $funcName$$ = "_" + $body$$3$$[0].$_address$;
        $body$$3$$ = $self$$8$$.$a$($body$$3$$);
        $body$$3$$ = $self$$8$$.$i$($body$$3$$);
        $body$$3$$ = $self$$8$$.$j$($funcName$$, $body$$3$$);
        $self$$8$$.$cpu$.$branches$[$page$$9$$][$funcName$$] = (new Function("return " + $self$$8$$.$f$($body$$3$$)))();
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
  }, $generate$:function $$Recompiler$$1$$$$$generate$$() {
    this.$generator$.$generate$(this.$analyzer$.$ast$);
    return this;
  }, $optimize$:function $$Recompiler$$1$$$$$optimize$$() {
    this.$optimizer$.$optimize$(this.$generator$.$ast$);
    return this.$optimizer$.$ast$;
  }, $g$:function $$Recompiler$$1$$$$$g$$($address$$26$$, $romPage$$3$$, $memPage$$1$$) {
    var $self$$10$$ = this;
    this.$parseFromAddress$($address$$26$$, $romPage$$3$$, $memPage$$1$$).$analyzeFromAddress$().$generate$().$optimize$()[0].forEach(function($body$$4$$) {
      var $funcName$$1$$ = "_" + $address$$26$$ % 16384;
      $body$$4$$ = $self$$10$$.$a$($body$$4$$);
      $body$$4$$ = $self$$10$$.$i$($body$$4$$);
      $body$$4$$ = $self$$10$$.$j$($funcName$$1$$, $body$$4$$);
      $self$$10$$.$cpu$.$branches$[$romPage$$3$$][$funcName$$1$$] = (new Function("return " + $self$$10$$.$f$($body$$4$$)))();
    });
  }, $parseFromAddress$:function $$Recompiler$$1$$$$$parseFromAddress$$($address$$27_obj$$26$$, $romPage$$4$$, $memPage$$2$$) {
    $address$$27_obj$$26$$ = {$address$:$address$$27_obj$$26$$, $romPage$:$romPage$$4$$, $memPage$:$memPage$$2$$};
    this.$parser$.$entryPoints$.push($address$$27_obj$$26$$);
    this.$bytecodes$ = this.$parser$.$parseFromAddress$($address$$27_obj$$26$$);
    return this;
  }, $analyzeFromAddress$:function $$Recompiler$$1$$$$$analyzeFromAddress$$() {
    this.$analyzer$.$analyzeFromAddress$(this.$bytecodes$);
    return this;
  }, $f$:function $$Recompiler$$1$$$$$f$$($fn$$11$$) {
    return window.escodegen.generate($fn$$11$$, {$comment$:!0, $renumber$:!0, $hexadecimal$:!0, parse:$DEBUG$$ ? window.esprima.parse : function($c$$2$$) {
      return {type:"Program", body:[{type:"ExpressionStatement", expression:{type:"Literal", value:$c$$2$$, raw:$c$$2$$}}]};
    }});
  }, $i$:function $$Recompiler$$1$$$$$i$$($body$$5$$) {
    var $whitelist$$ = "page temp location val value JSSMS.Utils.rndInt".split(" ");
    return $JSSMS$Utils$$.$traverse$($body$$5$$, function($obj$$27$$) {
      $obj$$27$$.type && "Identifier" === $obj$$27$$.type && -1 === $whitelist$$.indexOf($obj$$27$$.name) && ($obj$$27$$.name = "this." + $obj$$27$$.name);
      return $obj$$27$$;
    });
  }, $a$:function $$Recompiler$$1$$$$$a$$($ast$$7$$) {
    return $JSSMS$Utils$$.$traverse$($ast$$7$$, function($ast$$8$$) {
      "Register" === $ast$$8$$.type && ($ast$$8$$.type = "Identifier");
      return $ast$$8$$;
    });
  }, $j$:function $$Recompiler$$1$$$$$j$$($funcName$$2$$, $body$$6$$) {
    return {type:"Program", body:[{type:"FunctionDeclaration", id:{type:"Identifier", name:$funcName$$2$$}, params:[{type:"Identifier", name:"page"}, {type:"Identifier", name:"temp"}, {type:"Identifier", name:"location"}], defaults:[], body:{type:"BlockStatement", body:$body$$6$$}, rest:null, generator:!1, expression:!1}]};
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
window.JSSMS = $JSSMS$$;
module.exports=JSSMS
})(global);
