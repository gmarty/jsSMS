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
'use strict';var $JSCompiler_alias_VOID$$ = undefined, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1;
function $JSCompiler_emptyFn$$() {
  return function() {
  }
}
var $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
function $JSSMS$$($opts$$) {
  this.$opts$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if("undefined" != typeof $opts$$) {
    for(var $key$$15$$ in this.$opts$) {
      "undefined" != typeof $opts$$[$key$$15$$] && (this.$opts$[$key$$15$$] = $opts$$[$key$$15$$])
    }
  }
  this.$keyboard$ = new $JSSMS$Keyboard$$(this);
  this.$ui$ = new $opts$$.ui(this);
  this.$vdp$ = new $JSSMS$Vdp$$(this);
  this.$psg$ = new $JSSMS$SN76489$$(this);
  this.ports = new $JSSMS$Ports$$(this);
  this.$cpu$ = new $JSSMS$Z80$$(this);
  this.$ui$.updateStatus("Ready to load a ROM.")
}
$JSSMS$$.prototype = {$isRunning$:$JSCompiler_alias_FALSE$$, $cyclesPerLine$:0, $no_of_scanlines$:0, $frameSkip$:0, $fps$:0, $frameskip_counter$:0, $pause_button$:$JSCompiler_alias_FALSE$$, $is_sms$:$JSCompiler_alias_TRUE$$, $is_gg$:$JSCompiler_alias_FALSE$$, $soundEnabled$:$JSCompiler_alias_TRUE$$, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $emuWidth$:0, $emuHeight$:0, $fpsFrameCount$:0, $z80Time$:0, $drawTime$:0, $z80TimeCounter$:0, $drawTimeCounter$:0, $frameCount$:0, 
$romData$:"", $romFileName$:"", reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ = this.$vdp$.$videoMode$, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ = 3579545) : 1 == $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ && (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$vdp$.$videoMode$ = $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ = this.$psg$;
    $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$clock$ = ($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$clockFrac$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$regLatch$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$noiseFreq$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$noiseShiftReg$ = 32768;
    for($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ = 0;4 > $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$;$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$reg$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$reg$[($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$freqCounter$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$] = 0, $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$freqPolarity$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$] = 
      1, 3 != $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ && ($JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$.$freqPos$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$] = $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $fractional$$inline_13$$ = 0, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ = 0;$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$ < this.$no_of_scanlines$;$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_13$$, $fractional$$inline_13$$ = $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ - ($JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ >> 16 << 16), this.$samplesPerLine$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_592$$] = $JSCompiler_StaticMethods_init$self$$inline_590_mode$$inline_9_v$$inline_12$$ >> 
        16
      }
    }
  }
  this.$frameCount$ = 0;
  this.$frameskip_counter$ = this.$frameSkip$;
  this.$keyboard$.reset();
  this.$ui$.reset();
  this.$vdp$.reset();
  this.ports.reset();
  this.$cpu$.reset();
  $JSCompiler_StaticMethods_resetMemory$$(this.$cpu$, $JSCompiler_alias_NULL$$)
}, start:function $$JSSMS$$$$start$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = $JSCompiler_alias_TRUE$$);
  this.$frameInterval$ = setInterval(function() {
    $self$$1$$.frame()
  }, 17);
  this.$lastFpsTime$ = $JSCompiler_alias_NULL$$;
  this.$fpsFrameCount$ = 0;
  $JSCompiler_StaticMethods_printFps$$(this);
  this.$fpsInterval$ = setInterval(function() {
    $JSCompiler_StaticMethods_printFps$$($self$$1$$)
  }, 500)
}, stop:function $$JSSMS$$$$stop$() {
  clearInterval(this.$frameInterval$);
  clearInterval(this.$fpsInterval$);
  this.$isRunning$ = $JSCompiler_alias_FALSE$$
}, frame:function $$JSSMS$$$$frame$() {
  var $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$;
  var $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$;
  for($JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$ = 0;$JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$++) {
    $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$ = +new Date;
    if(193 == $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$) {
      $JSCompiler_StaticMethods_run$$(this.$cpu$, this.$cyclesPerLine$, 8);
      var $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ = this.$vdp$;
      $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$.status |= 128;
      $JSCompiler_StaticMethods_run$$(this.$cpu$, 0, 0)
    }else {
      $JSCompiler_StaticMethods_run$$(this.$cpu$, this.$cyclesPerLine$, 0)
    }
    this.$z80TimeCounter$ += +new Date - $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$;
    this.$soundEnabled$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$ = $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$, 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$ && (this.$audioBufferOffset$ = 0), $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$ = 
    this.$samplesPerLine$[$JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$], this.$audioBuffer$ = this.$psg$.update(this.$audioBufferOffset$, $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$), this.$audioBufferOffset$ += $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$);
    this.$vdp$.$line$ = $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$;
    if(0 == this.$frameskip_counter$ && 192 > $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$) {
      $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$ = +new Date;
      var $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$ = this.$vdp$, $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ = $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$;
      if(!$JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$main$.$is_gg$ || !(24 > $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ || 168 <= $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$)) {
        for(var $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$spriteCol$.length;$JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$--;) {
          $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$spriteCol$[$JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$] = $JSCompiler_alias_FALSE$$
        }
        if(0 != ($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$vdpreg$[1] & 64)) {
          if(-1 != $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$maxDirty$) {
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$;
            console.log("[" + $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$line$ + "] min dirty:" + $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$minDirty$ + 
            " max: " + $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$maxDirty$);
            for(var $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$minDirty$;$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ <= 
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$maxDirty$;$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$++) {
              if($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$isTileDirty$[$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$]) {
                $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$isTileDirty$[$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$] = $JSCompiler_alias_FALSE$$;
                console.log("tile " + $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ + " is dirty");
                for(var $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$tiles$[$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$], $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ = 
                0, $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ = $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ << 5, $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ = 0;8 > $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$;$off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$++) {
                  for(var $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$++], 
                  $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$++], $address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ = 
                  $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$++], $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$++], 
                  $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ = 128;0 != $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$;$bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ >>= 1) {
                    var $colour$$inline_905_colour$$inline_951_sx$$inline_920$$ = 0;
                    0 != ($address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ & $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$) && ($colour$$inline_905_colour$$inline_951_sx$$inline_920$$ |= 1);
                    0 != ($address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ & $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$) && ($colour$$inline_905_colour$$inline_951_sx$$inline_920$$ |= 2);
                    0 != ($address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ & $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$) && ($colour$$inline_905_colour$$inline_951_sx$$inline_920$$ |= 4);
                    0 != ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$) && ($colour$$inline_905_colour$$inline_951_sx$$inline_920$$ |= 8);
                    $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$[$lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$++] = $colour$$inline_905_colour$$inline_951_sx$$inline_920$$
                  }
                }
              }
            }
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$minDirty$ = 512;
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$maxDirty$ = -1
          }
          $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$;
          $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$;
          $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[8];
          $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vScrollLatch$;
          16 > $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ && 0 != ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[0] & 64) && ($hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ = 0);
          $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[0] & 128;
          $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ = 32 - ($hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ >> 3) + $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$h_start$;
          $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ = $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ + $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ >> 3;
          27 < $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ && ($off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ -= 28);
          $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ = ($height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ + ($address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ & 7) & 7) << 3;
          $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ = $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ << 8;
          for($address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$h_start$;$address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ < $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$h_end$;$address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$++) {
            var $tile$$inline_922_tile_props$$inline_917$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$bgt$ + (($address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ & 31) << 1) + ($off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ << 
            6), $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$tile$$inline_922_tile_props$$inline_917$$ + 1], $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ = ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & 
            8) << 1, $colour$$inline_905_colour$$inline_951_sx$$inline_920$$ = ($address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ << 3) + ($hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ & 7), $pixY$$inline_921$$ = 0 == ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & 4) ? $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ : 56 - $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$, 
            $tile$$inline_922_tile_props$$inline_917$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$tiles$[($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$tile$$inline_922_tile_props$$inline_917$$] & 
            255) + (($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & 1) << 8)];
            if(0 == ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & 2)) {
              for(var $pixX$$inline_923$$ = 0;8 > $pixX$$inline_923$$ && 256 > $colour$$inline_905_colour$$inline_951_sx$$inline_920$$;$pixX$$inline_923$$++, $colour$$inline_905_colour$$inline_951_sx$$inline_920$$++) {
                var $colour$$inline_924$$ = $tile$$inline_922_tile_props$$inline_917$$[$pixX$$inline_923$$ + $pixY$$inline_921$$];
                $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$bgPriority$[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$] = 0 != ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & 16) && 0 != $colour$$inline_924$$;
                $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.display[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$ + $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$CRAM$[$colour$$inline_924$$ + 
                $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$]
              }
            }else {
              for($pixX$$inline_923$$ = 7;0 <= $pixX$$inline_923$$ && 256 > $colour$$inline_905_colour$$inline_951_sx$$inline_920$$;$pixX$$inline_923$$--, $colour$$inline_905_colour$$inline_951_sx$$inline_920$$++) {
                $colour$$inline_924$$ = $tile$$inline_922_tile_props$$inline_917$$[$pixX$$inline_923$$ + $pixY$$inline_921$$], $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$bgPriority$[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$] = 0 != ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ & 
                16) && 0 != $colour$$inline_924$$, $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.display[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$ + $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$CRAM$[$colour$$inline_924$$ + 
                $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$]
              }
            }
            $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$++;
            0 != $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ && 23 == $address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ && ($off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ = $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ >> 3, $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ = ($height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ & 
            7) << 3)
          }
          if($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$isSatDirty$) {
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$;
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$isSatDirty$ = $JSCompiler_alias_FALSE$$;
            for($height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = 0;$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ < $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$lineSprites$.length;$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$++) {
              $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$lineSprites$[$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$][0] = 0
            }
            $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = 0 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[1] & 2) ? 8 : 16;
            1 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[1] & 1) && ($height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ <<= 1);
            for($hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ = 0;64 > $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$;$hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$++) {
              $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$sat$ + 
              $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$] & 255;
              if(208 == $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$) {
                break
              }
              $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$++;
              240 < $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ && ($lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ -= 256);
              for($address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ = 0;192 > $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$;$address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$++) {
                $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ >= $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ && $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ - $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ < $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ && ($off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ = 
                $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$lineSprites$[$address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$], 8 > $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$[0] && ($address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ = 
                3 * $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$[0] + 1, $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$sat$ + ($hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ << 
                1) + 128, $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$[$address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$++] & 
                255, $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$[$address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$++] = $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$, $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$[$address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$VRAM$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] & 
                255, $off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$[0]++))
              }
            }
          }
          if(0 != $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$lineSprites$[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$][0]) {
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$;
            $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$;
            $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$lineSprites$[$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$];
            $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$ = Math.min(8, $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$[0]);
            $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[1] & 1;
            $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ = $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ << 8;
            for($off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$ = 3 * $address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$;$address0$$inline_900_count$$inline_939_i$$inline_943_off$$inline_933_tile_y$$inline_914_vscroll$$inline_910$$--;) {
              if($address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ = $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$[$off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$--] | ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[6] & 
              4) << 6, $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ = $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$[$off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$--], $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ = $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$[$off$$inline_942_sprites$$inline_932_tile_row$$inline_913_y$$inline_899$$--] - 
              ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[0] & 8), $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ = $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ - $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ >> 
              $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$, 0 != ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$vdpreg$[1] & 2) && ($address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ &= -2), $address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ = 
              $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$tiles$[$address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$ + (($bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ & 8) >> 3)], $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ = 
              0, 0 > $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ && ($address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ = -$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$, $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ = 0), $bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ = $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ + 
              (($bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$ & 7) << 3), 0 == $lock$$inline_911_pixel_index$$inline_897_y$$inline_930_zoomed$$inline_940$$) {
                for(;8 > $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ && 256 > $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$;$address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$++, $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$++) {
                  $colour$$inline_905_colour$$inline_951_sx$$inline_920$$ = $address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$[$bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$++], 0 != $colour$$inline_905_colour$$inline_951_sx$$inline_920$$ && !$JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$bgPriority$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] && 
                  ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.display[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ + $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$CRAM$[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$ + 
                  16], $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$spriteCol$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] ? $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.status |= 
                  32 : $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$spriteCol$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] = $JSCompiler_alias_TRUE$$)
                }
              }else {
                for(;8 > $address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$ && 256 > $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$;$address3$$inline_903_pix$$inline_949_secondbyte$$inline_918_y$$inline_945$$++, $address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ += 2) {
                  if($colour$$inline_905_colour$$inline_951_sx$$inline_920$$ = $address2$$inline_902_n$$inline_944_tile$$inline_948_tx$$inline_916$$[$bit$$inline_904_offset$$inline_950_pal$$inline_919_tileRow$$inline_947$$++], 0 != $colour$$inline_905_colour$$inline_951_sx$$inline_920$$ && !$JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$bgPriority$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] && 
                  ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.display[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ + $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$CRAM$[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$ + 
                  16], $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$spriteCol$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] ? $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.status |= 
                  32 : $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$spriteCol$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$] = $JSCompiler_alias_TRUE$$), 0 != $colour$$inline_905_colour$$inline_951_sx$$inline_920$$ && !$JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$bgPriority$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ + 
                  1]) {
                    $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.display[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ + $address$$inline_898_lineno$$inline_931_row_precal$$inline_941_tile_column$$inline_912$$ + 1] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$CRAM$[$colour$$inline_905_colour$$inline_951_sx$$inline_920$$ + 
                    16], $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$spriteCol$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ + 1] ? $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.status |= 
                    32 : $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.$spriteCol$[$address$$inline_934_address1$$inline_901_rowprecal$$inline_915_x$$inline_946$$ + 1] = $JSCompiler_alias_TRUE$$
                  }
                }
              }
            }
            8 <= $hscroll$$inline_909_spriteno$$inline_929_sprites$$inline_938_tile$$inline_896$$[0] && ($JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$.status |= 64)
          }
          if($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$main$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$vdpreg$[0] & 32)) {
            $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$CRAM$[16 + ($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$vdpreg$[7] & 
            15)];
            $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ <<= 8;
            if(32 < 16 + ($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$vdpreg$[7] & 15)) {
              debugger
            }
            if(49152 < $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$) {
              debugger
            }
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$;
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$
          }
        }else {
          $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$ = $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$CRAM$[16 + ($JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.$vdpreg$[7] & 
          15)];
          $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ <<= 8;
          $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = $JSCompiler_alias_VOID$$;
          for($height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$ = 0;256 > $height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$;$height$$inline_928_i$$inline_895_i$$inline_927_i$$inline_957_lineno$$inline_908_lineno$$inline_937$$++) {
            $JSCompiler_StaticMethods_drawBGColour$self$$inline_953_JSCompiler_StaticMethods_drawLine$self$$inline_600$$.display[$JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_926_JSCompiler_StaticMethods_decodeTiles$self$$inline_894_JSCompiler_StaticMethods_drawBg$self$$inline_907_JSCompiler_StaticMethods_drawSprite$self$$inline_936_colour$$inline_603_colour$$inline_955_i$$inline_602$$
          }
        }
      }
      this.$drawTimeCounter$ += +new Date - $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$
    }
    $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$ = this.$vdp$;
    $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ = $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$;
    if(192 >= $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$) {
      if(0 == $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$counter$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$counter$ = $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$vdpreg$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.status |= 
      4) : $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$counter$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.status & 4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$vdpreg$[0] & 16)) {
        $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$main$.$cpu$.$interruptLine$ = $JSCompiler_alias_TRUE$$
      }
    }else {
      if($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$counter$ = $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$vdpreg$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.status & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$vdpreg$[1] & 
      32) && 224 > $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$main$.$cpu$.$interruptLine$ = $JSCompiler_alias_TRUE$$), $JSCompiler_StaticMethods_setVBlankFlag$self$$inline_594_lineno$$inline_601_lineno$$inline_607_location$$inline_604_row_precal$$inline_956$$ == $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$main$.$no_of_scanlines$ - 
      1) {
        $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$vScrollLatch$ = $JSCompiler_StaticMethods_interrupts$self$$inline_606_line$$inline_597_samplesToGenerate$$inline_598_startTime$$inline_18$$.$vdpreg$[9]
      }
    }
  }
  60 == ++this.$frameCount$ && (this.$z80Time$ = this.$z80TimeCounter$, this.$drawTime$ = this.$drawTimeCounter$, this.$frameCount$ = this.$drawTimeCounter$ = this.$z80TimeCounter$ = 0);
  this.$pause_button$ && ($JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$ = this.$cpu$, $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$iff2$ = $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$iff1$, $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$iff1$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$halt$ && 
  ($JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$pc$++, $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$halt$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.push($JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$pc$), $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$pc$ = 
  102, $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$.$tstates$ -= 11, this.$pause_button$ = $JSCompiler_alias_FALSE$$);
  0 == this.$frameskip_counter$-- ? (this.$frameskip_counter$ = this.$frameSkip$, $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$ = $JSCompiler_alias_TRUE$$) : $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$ = $JSCompiler_alias_FALSE$$;
  $JSCompiler_StaticMethods_nmi$self$$inline_609_JSCompiler_inline_result$$3_lineno$$inline_19$$ && this.$ui$.$writeFrame$(this.$vdp$.display, []);
  this.$fpsFrameCount$++
}, $loadROM$:function $$JSSMS$$$$$loadROM$$($data$$31$$, $size$$11$$) {
  0 != $size$$11$$ % 1024 && ($data$$31$$ = $data$$31$$.substr(512), $size$$11$$ -= 512);
  var $i$$2$$, $j$$, $number_of_pages$$ = Math.round($size$$11$$ / 1024), $pages$$1$$ = Array($number_of_pages$$);
  for($i$$2$$ = 0;$i$$2$$ < $number_of_pages$$;$i$$2$$++) {
    if($pages$$1$$[$i$$2$$] = $JSSMS$Utils$Array$$(1024), $SUPPORT_DATAVIEW$$) {
      for($j$$ = 0;1024 > $j$$;$j$$++) {
        $pages$$1$$[$i$$2$$].setUint8($j$$, $data$$31$$.charCodeAt(1024 * $i$$2$$ + $j$$) & 255)
      }
    }else {
      for($j$$ = 0;1024 > $j$$;$j$$++) {
        $pages$$1$$[$i$$2$$][$j$$] = $data$$31$$.charCodeAt(1024 * $i$$2$$ + $j$$) & 255
      }
    }
  }
  return $pages$$1$$
}};
function $JSCompiler_StaticMethods_readRomDirectly$$($JSCompiler_StaticMethods_readRomDirectly$self$$, $data$$30$$, $fileName$$) {
  var $mode$$9_pages$$;
  $mode$$9_pages$$ = ".gg" === $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
  var $size$$10$$ = $data$$30$$.length;
  1 == $mode$$9_pages$$ ? ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$h_start$ = 0, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$h_end$ = 32, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuWidth$ = 256, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuHeight$ = 192) : 2 == $mode$$9_pages$$ && ($JSCompiler_StaticMethods_readRomDirectly$self$$.$is_gg$ = 
  $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$is_sms$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$h_start$ = 5, $JSCompiler_StaticMethods_readRomDirectly$self$$.$vdp$.$h_end$ = 27, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuWidth$ = 160, $JSCompiler_StaticMethods_readRomDirectly$self$$.$emuHeight$ = 144);
  if(1024 >= $size$$10$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $mode$$9_pages$$ = $JSCompiler_StaticMethods_readRomDirectly$self$$.$loadROM$($data$$30$$, $size$$10$$);
  if($mode$$9_pages$$ == $JSCompiler_alias_NULL$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$$($JSCompiler_StaticMethods_readRomDirectly$self$$.$cpu$, $mode$$9_pages$$);
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romData$ = $data$$30$$;
  $JSCompiler_StaticMethods_readRomDirectly$self$$.$romFileName$ = $fileName$$;
  return $JSCompiler_alias_TRUE$$
}
function $JSCompiler_StaticMethods_printFps$$($JSCompiler_StaticMethods_printFps$self$$) {
  var $now$$ = +new Date, $s$$2$$ = "Running";
  $JSCompiler_StaticMethods_printFps$self$$.$lastFpsTime$ && ($s$$2$$ += ": " + ($JSCompiler_StaticMethods_printFps$self$$.$fpsFrameCount$ / (($now$$ - $JSCompiler_StaticMethods_printFps$self$$.$lastFpsTime$) / 1E3)).toFixed(2) + " (/ " + (1E3 / 17).toFixed(2) + ") FPS");
  $JSCompiler_StaticMethods_printFps$self$$.$ui$.updateStatus($s$$2$$);
  $JSCompiler_StaticMethods_printFps$self$$.$fpsFrameCount$ = 0;
  $JSCompiler_StaticMethods_printFps$self$$.$lastFpsTime$ = $now$$
}
;var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  $length$$12$$ === $JSCompiler_alias_VOID$$ && ($length$$12$$ = 0);
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array, $JSSMS$Utils$copyArray$$ = $SUPPORT_DATAVIEW$$ ? function($src$$3$$) {
  if($src$$3$$ === $JSCompiler_alias_VOID$$) {
    return $JSSMS$Utils$Array$$()
  }
  var $i$$3$$, $dest$$2$$;
  $i$$3$$ = $src$$3$$.byteLength;
  for($dest$$2$$ = new $JSSMS$Utils$Array$$($i$$3$$);$i$$3$$--;) {
    $dest$$2$$.setUint8($i$$3$$, $src$$3$$.getUint8($i$$3$$))
  }
  return $dest$$2$$
} : function($src$$4$$) {
  if($src$$4$$ === $JSCompiler_alias_VOID$$) {
    return $JSSMS$Utils$Array$$()
  }
  var $i$$4$$, $dest$$3$$;
  $i$$4$$ = $src$$4$$.length;
  for($dest$$3$$ = new $JSSMS$Utils$Array$$($i$$4$$);$i$$4$$--;) {
    "undefined" != typeof $src$$4$$[$i$$4$$] && ($dest$$3$$[$i$$4$$] = $src$$4$$[$i$$4$$])
  }
  return $dest$$3$$
}, $JSSMS$Utils$writeMem$$ = $SUPPORT_DATAVIEW$$ ? function($self$$2$$, $address$$, $value$$48$$) {
  if($address$$ >> 10 >= $self$$2$$.$memWriteMap$.length || !$self$$2$$.$memWriteMap$[$address$$ >> 10] || ($address$$ & 1023) >= $self$$2$$.$memWriteMap$[$address$$ >> 10].byteLength) {
    console.error($address$$, $address$$ >> 10, $address$$ & 1023);
    debugger
  }
  $self$$2$$.$memWriteMap$[$address$$ >> 10].setUint8($address$$ & 1023, $value$$48$$);
  65532 <= $address$$ && $self$$2$$.page($address$$ & 3, $value$$48$$)
} : function($self$$3$$, $address$$1$$, $value$$49$$) {
  $self$$3$$.$memWriteMap$[$address$$1$$ >> 10][$address$$1$$ & 1023] = $value$$49$$;
  65532 <= $address$$1$$ && $self$$3$$.page($address$$1$$ & 3, $value$$49$$)
}, $JSSMS$Utils$readMem$$ = $SUPPORT_DATAVIEW$$ ? function($array$$9$$, $address$$2$$) {
  if($address$$2$$ >> 10 >= $array$$9$$.length || !$array$$9$$[$address$$2$$ >> 10] || ($address$$2$$ & 1023) >= $array$$9$$[$address$$2$$ >> 10].byteLength) {
    console.error($address$$2$$, $address$$2$$ >> 10, $address$$2$$ & 1023);
    debugger
  }
  return $array$$9$$[$address$$2$$ >> 10].getUint8($address$$2$$ & 1023)
} : function($array$$10$$, $address$$3$$) {
  return $array$$10$$[$address$$3$$ >> 10][$address$$3$$ & 1023]
}, $JSSMS$Utils$readMemWord$$ = $SUPPORT_DATAVIEW$$ ? function($array$$11$$, $address$$4$$) {
  if($address$$4$$ >> 10 >= $array$$11$$.length || !$array$$11$$[$address$$4$$ >> 10] || ($address$$4$$ & 1023) >= $array$$11$$[$address$$4$$ >> 10].byteLength) {
    console.error($address$$4$$, $address$$4$$ >> 10, $address$$4$$ & 1023);
    debugger
  }
  return 1023 > ($address$$4$$ & 1023) ? $array$$11$$[$address$$4$$ >> 10].getUint16($address$$4$$ & 1023, $JSCompiler_alias_TRUE$$) : $array$$11$$[$address$$4$$ >> 10].getUint8($address$$4$$ & 1023) | $array$$11$$[++$address$$4$$ >> 10].getUint8($address$$4$$ & 1023) << 8
} : function($array$$12$$, $address$$5$$) {
  return $array$$12$$[$address$$5$$ >> 10][$address$$5$$ & 1023] & 255 | ($array$$12$$[++$address$$5$$ >> 10][$address$$5$$ & 1023] & 255) << 8
};
function $JSSMS$Utils$getPrefix$$($arr$$16$$) {
  var $prefix$$2$$ = $JSCompiler_alias_FALSE$$;
  $arr$$16$$.some(function($prop$$4$$) {
    return $prop$$4$$ in document ? ($prefix$$2$$ = $prop$$4$$, $JSCompiler_alias_TRUE$$) : $JSCompiler_alias_FALSE$$
  });
  return $prefix$$2$$
}
;var $OP_STATES$$ = [4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4, 8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4, 7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4, 7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 
4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4, 5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, 5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, 5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, 5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11], $OP_CB_STATES$$ = [8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 
8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 12, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 
15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8, 8, 8, 8, 8, 8, 8, 15, 8], $OP_DD_STATES$$ = [4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 14, 20, 10, 8, 8, 11, 4, 4, 15, 20, 10, 8, 8, 11, 4, 4, 4, 4, 4, 23, 23, 19, 4, 4, 15, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 8, 8, 8, 8, 8, 8, 
19, 8, 8, 8, 8, 8, 8, 8, 19, 8, 19, 19, 19, 19, 19, 19, 4, 19, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 8, 8, 19, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 14, 4, 23, 4, 15, 4, 4, 4, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 4, 4, 4, 4, 4, 4], $OP_INDEX_CB_STATES$$ = 
[0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 
0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 23, 0], $OP_ED_STATES$$ = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18, 8, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 
8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
function $JSSMS$Z80$$($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$) {
  this.$main$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;
  this.port = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$.ports;
  this.$im$ = this.$sp$ = this.$pc$ = 0;
  this.$interruptLine$ = this.$EI_inst$ = this.$halt$ = this.$iff2$ = this.$iff1$ = $JSCompiler_alias_FALSE$$;
  this.$tstates$ = this.$totalCycles$ = this.$f2$ = this.$f$ = this.$i$ = this.$r$ = this.$iyH$ = this.$iyL$ = this.$ixH$ = this.$ixL$ = this.$l2$ = this.$h2$ = this.$l$ = this.$h$ = this.$e2$ = this.$d2$ = this.$e$ = this.$d$ = this.$c2$ = this.$b2$ = this.$c$ = this.$b$ = this.$a2$ = this.$a$ = this.$interruptVector$ = 0;
  this.$rom$ = [];
  this.$ram$ = Array(8);
  this.$sram$ = $JSCompiler_alias_NULL$$;
  this.$useSRAM$ = $JSCompiler_alias_FALSE$$;
  this.$frameReg$ = Array(4);
  this.$number_of_pages$ = 0;
  this.$memWriteMap$ = Array(65);
  this.$memReadMap$ = Array(65);
  this.$dummyWrite$ = $JSSMS$Utils$Array$$(1024);
  this.$DAA_TABLE$ = Array(2048);
  this.$SZ_TABLE$ = Array(256);
  this.$SZP_TABLE$ = Array(256);
  this.$SZHV_INC_TABLE$ = Array(256);
  this.$SZHV_DEC_TABLE$ = Array(256);
  this.$SZHVC_ADD_TABLE$ = Array(131072);
  this.$SZHVC_SUB_TABLE$ = Array(131072);
  this.$SZ_BIT_TABLE$ = Array(256);
  for(var $c$$inline_44_padc$$inline_35_sf$$inline_29$$, $h$$inline_45_psub$$inline_36_zf$$inline_30$$, $n$$inline_46_psbc$$inline_37_yf$$inline_31$$, $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$, $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$, $flags$$inline_613_newval$$inline_40$$, $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 0;256 > $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$++) {
    $c$$inline_44_padc$$inline_35_sf$$inline_29$$ = 0 != ($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 128) ? 128 : 0, $h$$inline_45_psub$$inline_36_zf$$inline_30$$ = 0 == $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? 64 : 0, $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 32, $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 
    8, $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$) ? 4 : 0, this.$SZ_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$, this.$SZP_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = 
    $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ | $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$, this.$SZHV_INC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | 
    $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$, this.$SZHV_INC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 128 == $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? 4 : 0, this.$SZHV_INC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 0 == ($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 15) ? 16 : 0, this.$SZHV_DEC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | 
    $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ | 2, this.$SZHV_DEC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 127 == $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? 4 : 0, this.$SZHV_DEC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 15 == ($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 15) ? 16 : 0, 
    this.$SZ_BIT_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = 0 != $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 128 : 68, this.$SZ_BIT_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ | 16
  }
  $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 0;
  $c$$inline_44_padc$$inline_35_sf$$inline_29$$ = 65536;
  $h$$inline_45_psub$$inline_36_zf$$inline_30$$ = 0;
  $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ = 65536;
  for($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ = 0;256 > $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$;$JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$++) {
    for($flags$$inline_613_newval$$inline_40$$ = 0;256 > $flags$$inline_613_newval$$inline_40$$;$flags$$inline_613_newval$$inline_40$$++) {
      $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ = $flags$$inline_613_newval$$inline_40$$ - $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$, this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = 0 != $flags$$inline_613_newval$$inline_40$$ ? 0 != ($flags$$inline_613_newval$$inline_40$$ & 128) ? 128 : 0 : 64, this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= $flags$$inline_613_newval$$inline_40$$ & 
      40, ($flags$$inline_613_newval$$inline_40$$ & 15) < ($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ & 15) && (this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 16), $flags$$inline_613_newval$$inline_40$$ < $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ && (this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ ^ $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ ^ 
      128) & ($JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ ^ $flags$$inline_613_newval$$inline_40$$) & 128) && (this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 4), $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$++, $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ = $flags$$inline_613_newval$$inline_40$$ - $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ - 1, this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] = 
      0 != $flags$$inline_613_newval$$inline_40$$ ? 0 != ($flags$$inline_613_newval$$inline_40$$ & 128) ? 128 : 0 : 64, this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= $flags$$inline_613_newval$$inline_40$$ & 40, ($flags$$inline_613_newval$$inline_40$$ & 15) <= ($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ & 15) && (this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= 16), $flags$$inline_613_newval$$inline_40$$ <= $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ && 
      (this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= 1), 0 != (($JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ ^ $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ ^ 128) & ($JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ ^ $flags$$inline_613_newval$$inline_40$$) & 128) && (this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= 4), $c$$inline_44_padc$$inline_35_sf$$inline_29$$++, $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ = 
      $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ - $flags$$inline_613_newval$$inline_40$$, this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] = 0 != $flags$$inline_613_newval$$inline_40$$ ? 0 != ($flags$$inline_613_newval$$inline_40$$ & 128) ? 130 : 2 : 66, this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= $flags$$inline_613_newval$$inline_40$$ & 40, ($flags$$inline_613_newval$$inline_40$$ & 15) > ($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ & 
      15) && (this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= 16), $flags$$inline_613_newval$$inline_40$$ > $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ && (this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= 1), 0 != (($JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ ^ $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$) & ($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ ^ $flags$$inline_613_newval$$inline_40$$) & 
      128) && (this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= 4), $h$$inline_45_psub$$inline_36_zf$$inline_30$$++, $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ = $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ - $flags$$inline_613_newval$$inline_40$$ - 1, this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] = 0 != $flags$$inline_613_newval$$inline_40$$ ? 0 != ($flags$$inline_613_newval$$inline_40$$ & 128) ? 130 : 2 : 66, this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 
      $flags$$inline_613_newval$$inline_40$$ & 40, ($flags$$inline_613_newval$$inline_40$$ & 15) >= ($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ & 15) && (this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 16), $flags$$inline_613_newval$$inline_40$$ >= $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ && (this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 1), 0 != (($JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ ^ 
      $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$) & ($JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ ^ $flags$$inline_613_newval$$inline_40$$) & 128) && (this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 4), $n$$inline_46_psbc$$inline_37_yf$$inline_31$$++
    }
  }
  for($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 256;$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$--;) {
    for($c$$inline_44_padc$$inline_35_sf$$inline_29$$ = 0;1 >= $c$$inline_44_padc$$inline_35_sf$$inline_29$$;$c$$inline_44_padc$$inline_35_sf$$inline_29$$++) {
      for($h$$inline_45_psub$$inline_36_zf$$inline_30$$ = 0;1 >= $h$$inline_45_psub$$inline_36_zf$$inline_30$$;$h$$inline_45_psub$$inline_36_zf$$inline_30$$++) {
        for($n$$inline_46_psbc$$inline_37_yf$$inline_31$$ = 0;1 >= $n$$inline_46_psbc$$inline_37_yf$$inline_31$$;$n$$inline_46_psbc$$inline_37_yf$$inline_31$$++) {
          $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$ = this.$DAA_TABLE$;
          $JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$ = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ << 8 | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ << 9 | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ << 10 | $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;
          $flags$$inline_613_newval$$inline_40$$ = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ << 1 | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ << 4;
          this.$a$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;
          this.$f$ = $flags$$inline_613_newval$$inline_40$$;
          var $a_copy$$inline_614$$ = this.$a$, $correction$$inline_615$$ = 0, $carry$$inline_616$$ = $flags$$inline_613_newval$$inline_40$$ & 1, $carry_copy$$inline_617$$ = $carry$$inline_616$$;
          if(0 != ($flags$$inline_613_newval$$inline_40$$ & 16) || 9 < ($a_copy$$inline_614$$ & 15)) {
            $correction$$inline_615$$ |= 6
          }
          if(1 == $carry$$inline_616$$ || 159 < $a_copy$$inline_614$$ || 143 < $a_copy$$inline_614$$ && 9 < ($a_copy$$inline_614$$ & 15)) {
            $correction$$inline_615$$ |= 96, $carry_copy$$inline_617$$ = 1
          }
          153 < $a_copy$$inline_614$$ && ($carry_copy$$inline_617$$ = 1);
          0 != ($flags$$inline_613_newval$$inline_40$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_615$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_615$$);
          $flags$$inline_613_newval$$inline_40$$ = this.$f$ & 254 | $carry_copy$$inline_617$$;
          $flags$$inline_613_newval$$inline_40$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_613_newval$$inline_40$$ & 251 | 4 : $flags$$inline_613_newval$$inline_40$$ & 251;
          $JSCompiler_temp_const$$588_val$$inline_38_xf$$inline_32$$[$JSCompiler_temp_const$$587_oldval$$inline_39_pf$$inline_33$$] = this.$a$ | $flags$$inline_613_newval$$inline_40$$ << 8
        }
      }
    }
  }
  for($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = this.$a$ = this.$f$ = 0;65 > $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$++) {
    this.$memReadMap$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $JSSMS$Utils$Array$$(1024), this.$memWriteMap$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $JSSMS$Utils$Array$$(1024)
  }
  for($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 0;8 > $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$++) {
    this.$ram$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $JSSMS$Utils$Array$$(1024)
  }
  this.$sram$ == $JSCompiler_alias_NULL$$ && (this.$sram$ = $JSSMS$Utils$Array$$(32), this.$useSRAM$ = $JSCompiler_alias_FALSE$$);
  this.$memReadMap$[64] = $JSSMS$Utils$Array$$(1024);
  this.$memWriteMap$[64] = $JSSMS$Utils$Array$$(1024);
  this.$number_of_pages$ = 2
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$pc$ = this.$f2$ = this.$f$ = this.$i$ = this.$r$ = this.$iyL$ = this.$iyH$ = this.$ixL$ = this.$ixH$ = this.$h$ = this.$l$ = this.$h2$ = this.$l2$ = this.$d$ = this.$e$ = this.$d2$ = this.$e2$ = this.$b$ = this.$c$ = this.$b2$ = this.$c2$ = this.$a$ = this.$a2$ = 0;
  this.$sp$ = 57328;
  this.$im$ = this.$totalCycles$ = this.$tstates$ = 0;
  this.$EI_inst$ = this.$iff2$ = this.$iff1$ = $JSCompiler_alias_FALSE$$;
  this.$interruptVector$ = 0;
  this.$halt$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? (this.push(this.$pc$ + 2), this.$pc$ = $JSCompiler_StaticMethods_readMemWord$$(this, this.$pc$), this.$tstates$ -= 7) : this.$pc$ += 2
}, push:function $$JSSMS$Z80$$$$push$($value$$50$$, $l$$) {
  if("undefined" === typeof $l$$) {
    var $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$ = --this.$sp$;
    $JSSMS$Utils$writeMem$$(this, $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$, $value$$50$$ >> 8);
    $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$ = --this.$sp$;
    $JSSMS$Utils$writeMem$$(this, $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$, $value$$50$$ & 255)
  }else {
    $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$ = --this.$sp$, $JSSMS$Utils$writeMem$$(this, $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$, $value$$50$$), $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$ = --this.$sp$, $JSSMS$Utils$writeMem$$(this, $address$$inline_52_address$$inline_56_address$$inline_60_address$$inline_64$$, $l$$)
  }
}, page:function $$JSSMS$Z80$$$$page$($address$$9$$, $value$$77$$) {
  var $offset$$16_p$$1$$, $i$$9$$;
  this.$frameReg$[$address$$9$$] = $value$$77$$;
  switch($address$$9$$) {
    case 0:
      if(0 != ($value$$77$$ & 8)) {
        $offset$$16_p$$1$$ = ($value$$77$$ & 4) << 2;
        for($i$$9$$ = 32;48 > $i$$9$$;$i$$9$$++) {
          this.$memReadMap$[$i$$9$$] = $JSSMS$Utils$copyArray$$(this.$sram$[$offset$$16_p$$1$$]), this.$memWriteMap$[$i$$9$$] = $JSSMS$Utils$copyArray$$(this.$sram$[$offset$$16_p$$1$$]), $offset$$16_p$$1$$++
        }
        this.$useSRAM$ = $JSCompiler_alias_TRUE$$
      }else {
        $offset$$16_p$$1$$ = this.$frameReg$[3] % this.$number_of_pages$ << 4;
        for($i$$9$$ = 32;48 > $i$$9$$;$i$$9$$++) {
          this.$memReadMap$[$i$$9$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++]), this.$memWriteMap$[$i$$9$$] = $JSSMS$Utils$Array$$(1024)
        }
      }
      break;
    case 1:
      $offset$$16_p$$1$$ = ($value$$77$$ % this.$number_of_pages$ << 4) + 1;
      for($i$$9$$ = 1;16 > $i$$9$$;$i$$9$$++) {
        this.$memReadMap$[$i$$9$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++])
      }
      break;
    case 2:
      $offset$$16_p$$1$$ = $value$$77$$ % this.$number_of_pages$ << 4;
      for($i$$9$$ = 16;32 > $i$$9$$;$i$$9$$++) {
        this.$memReadMap$[$i$$9$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++])
      }
      break;
    case 3:
      if(0 == (this.$frameReg$[0] & 8)) {
        $offset$$16_p$$1$$ = $value$$77$$ % this.$number_of_pages$ << 4;
        for($i$$9$$ = 32;48 > $i$$9$$;$i$$9$$++) {
          this.$memReadMap$[$i$$9$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++])
        }
      }
  }
}};
function $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_readMemWord$self$$, $address$$8$$) {
  return $JSSMS$Utils$readMemWord$$($JSCompiler_StaticMethods_readMemWord$self$$.$memReadMap$, $address$$8$$)
}
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSSMS$Utils$readMem$$($JSCompiler_StaticMethods_d_$self$$.$memReadMap$, $JSCompiler_StaticMethods_d_$self$$.$pc$)
}
function $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_readMem$self$$, $address$$7$$) {
  return $JSSMS$Utils$readMem$$($JSCompiler_StaticMethods_readMem$self$$.$memReadMap$, $address$$7$$)
}
function $JSCompiler_StaticMethods_resetMemory$$($JSCompiler_StaticMethods_resetMemory$self$$, $p$$) {
  $p$$ != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetMemory$self$$.$rom$ = $p$$);
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[0] = 0;
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[1] = 0;
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[2] = 1;
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[3] = 0;
  if($JSCompiler_StaticMethods_resetMemory$self$$.$rom$ != $JSCompiler_alias_NULL$$) {
    $JSCompiler_StaticMethods_resetMemory$self$$.$number_of_pages$ = $JSCompiler_StaticMethods_resetMemory$self$$.$rom$.length / 16;
    for(var $i$$inline_68$$ = 0;48 > $i$$inline_68$$;$i$$inline_68$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$.$memReadMap$[$i$$inline_68$$] = $JSSMS$Utils$copyArray$$($JSCompiler_StaticMethods_resetMemory$self$$.$rom$[$i$$inline_68$$ & 31]), $JSCompiler_StaticMethods_resetMemory$self$$.$memWriteMap$[$i$$inline_68$$] = $JSSMS$Utils$Array$$(1024)
    }
    for($i$$inline_68$$ = 48;64 > $i$$inline_68$$;$i$$inline_68$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$.$memReadMap$[$i$$inline_68$$] = $JSCompiler_StaticMethods_resetMemory$self$$.$ram$[$i$$inline_68$$ & 7], $JSCompiler_StaticMethods_resetMemory$self$$.$memWriteMap$[$i$$inline_68$$] = $JSCompiler_StaticMethods_resetMemory$self$$.$ram$[$i$$inline_68$$ & 7]
    }
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$.$number_of_pages$ = 0
  }
}
function $JSCompiler_StaticMethods_getParity$$($value$$75$$) {
  var $parity$$ = $JSCompiler_alias_TRUE$$, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$75$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$74$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_sbc16$self$$.$h$ << 8 | $JSCompiler_StaticMethods_sbc16$self$$.$l$, $result$$2$$ = $hl$$1$$ - $value$$74$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$f$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$f$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$74$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$74$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$h$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$73$$) {
  var $hl$$ = $JSCompiler_StaticMethods_adc16$self$$.$h$ << 8 | $JSCompiler_StaticMethods_adc16$self$$.$l$, $result$$1$$ = $hl$$ + $value$$73$$ + ($JSCompiler_StaticMethods_adc16$self$$.$f$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$f$ = ($hl$$ ^ $result$$1$$ ^ $value$$73$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$73$$ ^ $hl$$ ^ 32768) & ($value$$73$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$h$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$72$$) {
  var $result$$ = $reg$$ + $value$$72$$;
  $JSCompiler_StaticMethods_add16$self$$.$f$ = $JSCompiler_StaticMethods_add16$self$$.$f$ & 196 | ($reg$$ ^ $result$$ ^ $value$$72$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$71$$) {
  $value$$71$$ = $value$$71$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$f$ = $JSCompiler_StaticMethods_dec8$self$$.$f$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$SZHV_DEC_TABLE$[$value$$71$$];
  return $value$$71$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$70$$) {
  $value$$70$$ = $value$$70$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$f$ = $JSCompiler_StaticMethods_inc8$self$$.$f$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$SZHV_INC_TABLE$[$value$$70$$];
  return $value$$70$$
}
function $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_decHL$self$$) {
  $JSCompiler_StaticMethods_decHL$self$$.$l$ = $JSCompiler_StaticMethods_decHL$self$$.$l$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decHL$self$$.$l$ && ($JSCompiler_StaticMethods_decHL$self$$.$h$ = $JSCompiler_StaticMethods_decHL$self$$.$h$ - 1 & 255)
}
function $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_decDE$self$$) {
  $JSCompiler_StaticMethods_decDE$self$$.$e$ = $JSCompiler_StaticMethods_decDE$self$$.$e$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decDE$self$$.$e$ && ($JSCompiler_StaticMethods_decDE$self$$.$d$ = $JSCompiler_StaticMethods_decDE$self$$.$d$ - 1 & 255)
}
function $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_decBC$self$$) {
  $JSCompiler_StaticMethods_decBC$self$$.$c$ = $JSCompiler_StaticMethods_decBC$self$$.$c$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decBC$self$$.$c$ && ($JSCompiler_StaticMethods_decBC$self$$.$b$ = $JSCompiler_StaticMethods_decBC$self$$.$b$ - 1 & 255)
}
function $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_incHL$self$$) {
  $JSCompiler_StaticMethods_incHL$self$$.$l$ = $JSCompiler_StaticMethods_incHL$self$$.$l$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incHL$self$$.$l$ && ($JSCompiler_StaticMethods_incHL$self$$.$h$ = $JSCompiler_StaticMethods_incHL$self$$.$h$ + 1 & 255)
}
function $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_incDE$self$$) {
  $JSCompiler_StaticMethods_incDE$self$$.$e$ = $JSCompiler_StaticMethods_incDE$self$$.$e$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incDE$self$$.$e$ && ($JSCompiler_StaticMethods_incDE$self$$.$d$ = $JSCompiler_StaticMethods_incDE$self$$.$d$ + 1 & 255)
}
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$69$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$iyH$ = $value$$69$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$iyL$ = $value$$69$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$68$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$ixH$ = $value$$68$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$ixL$ = $value$$68$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$67$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$h$ = $value$$67$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$67$$ & 255
}
function $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_getIY$self$$) {
  return $JSCompiler_StaticMethods_getIY$self$$.$iyH$ << 8 | $JSCompiler_StaticMethods_getIY$self$$.$iyL$
}
function $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_getIX$self$$) {
  return $JSCompiler_StaticMethods_getIX$self$$.$ixH$ << 8 | $JSCompiler_StaticMethods_getIX$self$$.$ixL$
}
function $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_getHL$self$$) {
  return $JSCompiler_StaticMethods_getHL$self$$.$h$ << 8 | $JSCompiler_StaticMethods_getHL$self$$.$l$
}
function $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_getDE$self$$) {
  return $JSCompiler_StaticMethods_getDE$self$$.$d$ << 8 | $JSCompiler_StaticMethods_getDE$self$$.$e$
}
function $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_getBC$self$$) {
  return $JSCompiler_StaticMethods_getBC$self$$.$b$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$c$
}
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$64$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$f$ = $JSCompiler_StaticMethods_cp_a$self$$.$SZHVC_SUB_TABLE$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$64$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$63$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$f$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$63$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$f$ = $JSCompiler_StaticMethods_sbc_a$self$$.$SZHVC_SUB_TABLE$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$62$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$62$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$f$ = $JSCompiler_StaticMethods_sub_a$self$$.$SZHVC_SUB_TABLE$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$61$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$f$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$61$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$f$ = $JSCompiler_StaticMethods_adc_a$self$$.$SZHVC_ADD_TABLE$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$60$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$60$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$f$ = $JSCompiler_StaticMethods_add_a$self$$.$SZHVC_ADD_TABLE$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$45$$) {
  var $location$$24$$ = $index$$45$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = 
  $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, ++$JSCompiler_StaticMethods_doIndexCB$self$$.$pc$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$tstates$ -= $OP_INDEX_CB_STATES$$[$opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$];
  switch($opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$) {
    case 6:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 14:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 22:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 30:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 38:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 46:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 54:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 62:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$));
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 70:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 1);
      break;
    case 78:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 2);
      break;
    case 86:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 4);
      break;
    case 94:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 8);
      break;
    case 102:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 16);
      break;
    case 110:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 32);
      break;
    case 118:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 64);
      break;
    case 126:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$) & 128);
      break;
    case 134:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -2;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 142:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -3;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 150:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -5;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 158:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -9;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 166:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -17;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 174:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -33;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 182:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -65;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 190:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) & -129;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 198:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 1;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 206:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 2;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 214:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 4;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 222:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 8;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 230:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 16;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 238:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 32;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 246:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 64;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    case 254:
      $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, 
      $location$$24$$) | 128;
      $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexCB$self$$, $location$$24$$, $opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$);
      break;
    default:
      console.log("Unimplemented DDCB or FDCB Opcode: " + ($opcode$$6_value$$inline_144_value$$inline_148_value$$inline_152_value$$inline_156_value$$inline_160_value$$inline_164_value$$inline_168_value$$inline_172_value$$inline_176_value$$inline_180_value$$inline_184_value$$inline_188_value$$inline_192_value$$inline_196_value$$inline_200_value$$inline_204_value$$inline_208_value$$inline_212_value$$inline_216_value$$inline_220_value$$inline_224_value$$inline_228_value$$inline_232_value$$inline_236$$ & 
      255).toString(16))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$pc$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$f$ = $JSCompiler_StaticMethods_bit$self$$.$f$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$SZ_BIT_TABLE$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$58$$) {
  var $carry$$7$$ = $value$$58$$ & 1, $value$$58$$ = $value$$58$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$f$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$SZP_TABLE$[$value$$58$$];
  return $value$$58$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$57$$) {
  var $carry$$6$$ = $value$$57$$ & 1, $value$$57$$ = $value$$57$$ >> 1 | $value$$57$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$f$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$SZP_TABLE$[$value$$57$$];
  return $value$$57$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$56$$) {
  var $carry$$5$$ = ($value$$56$$ & 128) >> 7, $value$$56$$ = ($value$$56$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$f$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$SZP_TABLE$[$value$$56$$];
  return $value$$56$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$55$$) {
  var $carry$$4$$ = ($value$$55$$ & 128) >> 7, $value$$55$$ = $value$$55$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$f$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$SZP_TABLE$[$value$$55$$];
  return $value$$55$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$54$$) {
  var $carry$$3$$ = $value$$54$$ & 1, $value$$54$$ = ($value$$54$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$f$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$f$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$SZP_TABLE$[$value$$54$$];
  return $value$$54$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$53$$) {
  var $carry$$2$$ = ($value$$53$$ & 128) >> 7, $value$$53$$ = ($value$$53$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$f$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$f$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$SZP_TABLE$[$value$$53$$];
  return $value$$53$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$52$$) {
  var $carry$$1$$ = $value$$52$$ & 1, $value$$52$$ = ($value$$52$$ >> 1 | $value$$52$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$f$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$SZP_TABLE$[$value$$52$$];
  return $value$$52$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$51$$) {
  var $carry$$ = ($value$$51$$ & 128) >> 7, $value$$51$$ = ($value$$51$$ << 1 | $value$$51$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$f$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$SZP_TABLE$[$value$$51$$];
  return $value$$51$$
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$) {
  var $value$$inline_432$$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$));
  $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$, $value$$inline_432$$)
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  var $value$$inline_436$$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$));
  $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$, $value$$inline_436$$)
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$pc$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_ret$self$$, $JSCompiler_StaticMethods_ret$self$$.$sp$), $JSCompiler_StaticMethods_ret$self$$.$sp$ += 2, $JSCompiler_StaticMethods_ret$self$$.$tstates$ -= 6)
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  if($condition$$2$$) {
    var $d$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1;
    $JSCompiler_StaticMethods_jr$self$$.$pc$ += 128 > $d$$ ? $d$$ : $d$$ - 256;
    $JSCompiler_StaticMethods_jr$self$$.$tstates$ -= 5
  }else {
    $JSCompiler_StaticMethods_jr$self$$.$pc$++
  }
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $JSCompiler_StaticMethods_jp$self$$.$pc$ = $condition$$1$$ ? $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_jp$self$$, $JSCompiler_StaticMethods_jp$self$$.$pc$) : $JSCompiler_StaticMethods_jp$self$$.$pc$ + 2
}
function $JSCompiler_StaticMethods_run$$($JSCompiler_StaticMethods_run$self$$, $cycles$$, $cyclesTo$$) {
  var $location$$21$$, $opcode$$2$$, $temp$$;
  $JSCompiler_StaticMethods_run$self$$.$tstates$ += $cycles$$;
  0 != $cycles$$ && ($JSCompiler_StaticMethods_run$self$$.$totalCycles$ = $cycles$$);
  for(;$JSCompiler_StaticMethods_run$self$$.$tstates$ > $cyclesTo$$;) {
    if($JSCompiler_StaticMethods_run$self$$.$interruptLine$) {
      var $JSCompiler_StaticMethods_interrupt$self$$inline_438$$ = $JSCompiler_StaticMethods_run$self$$;
      $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$iff1$ && !$JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$EI_inst$ && (($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$halt$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$pc$++, $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$halt$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$iff1$ = $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$iff2$ = $JSCompiler_alias_FALSE$$, 
      $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$interruptLine$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.push($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$pc$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$im$) ? ($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$pc$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$interruptVector$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$interruptVector$ ? 
      56 : $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$interruptVector$, $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$tstates$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$im$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$pc$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$tstates$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$pc$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_interrupt$self$$inline_438$$, 
      ($JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$i$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$interruptVector$), $JSCompiler_StaticMethods_interrupt$self$$inline_438$$.$tstates$ -= 19))
    }
    $opcode$$2$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
    $JSCompiler_StaticMethods_run$self$$.$EI_inst$ = $JSCompiler_alias_FALSE$$;
    $JSCompiler_StaticMethods_run$self$$.$tstates$ -= $OP_STATES$$[$opcode$$2$$];
    switch($opcode$$2$$) {
      case 1:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 2:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 3:
        var $JSCompiler_StaticMethods_incBC$self$$inline_444$$ = $JSCompiler_StaticMethods_run$self$$;
        $JSCompiler_StaticMethods_incBC$self$$inline_444$$.$c$ = $JSCompiler_StaticMethods_incBC$self$$inline_444$$.$c$ + 1 & 255;
        0 == $JSCompiler_StaticMethods_incBC$self$$inline_444$$.$c$ && ($JSCompiler_StaticMethods_incBC$self$$inline_444$$.$b$ = $JSCompiler_StaticMethods_incBC$self$$inline_444$$.$b$ + 1 & 255);
        break;
      case 4:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 5:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 6:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 7:
        var $JSCompiler_StaticMethods_rlca_a$self$$inline_446$$ = $JSCompiler_StaticMethods_run$self$$, $carry$$inline_447$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_446$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_446$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_446$$.$a$ << 1 & 255 | $carry$$inline_447$$;
        $JSCompiler_StaticMethods_rlca_a$self$$inline_446$$.$f$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_446$$.$f$ & 236 | $carry$$inline_447$$;
        break;
      case 8:
        var $JSCompiler_StaticMethods_exAF$self$$inline_449$$ = $JSCompiler_StaticMethods_run$self$$, $temp$$inline_450$$ = $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$a$;
        $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$a2$;
        $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$a2$ = $temp$$inline_450$$;
        $temp$$inline_450$$ = $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$f$;
        $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$f$ = $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$f2$;
        $JSCompiler_StaticMethods_exAF$self$$inline_449$$.$f2$ = $temp$$inline_450$$;
        break;
      case 9:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 10:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 11:
        $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 12:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 13:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 14:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 15:
        var $JSCompiler_StaticMethods_rrca_a$self$$inline_452$$ = $JSCompiler_StaticMethods_run$self$$, $carry$$inline_453$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_452$$.$a$ & 1;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_452$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_452$$.$a$ >> 1 | $carry$$inline_453$$ << 7;
        $JSCompiler_StaticMethods_rrca_a$self$$inline_452$$.$f$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_452$$.$f$ & 236 | $carry$$inline_453$$;
        break;
      case 16:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$b$ - 1 & 255;
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$, 0 != $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 17:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 18:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 19:
        $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 20:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 21:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 22:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 23:
        var $JSCompiler_StaticMethods_rla_a$self$$inline_459$$ = $JSCompiler_StaticMethods_run$self$$, $carry$$inline_460$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_459$$.$a$ >> 7;
        $JSCompiler_StaticMethods_rla_a$self$$inline_459$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_459$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_459$$.$f$ & 1) & 255;
        $JSCompiler_StaticMethods_rla_a$self$$inline_459$$.$f$ = $JSCompiler_StaticMethods_rla_a$self$$inline_459$$.$f$ & 236 | $carry$$inline_460$$;
        break;
      case 24:
        $JSCompiler_StaticMethods_run$self$$.$pc$ += $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_run$self$$) + 1;
        break;
      case 25:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 26:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 27:
        $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 28:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 29:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 30:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 31:
        var $JSCompiler_StaticMethods_rra_a$self$$inline_462$$ = $JSCompiler_StaticMethods_run$self$$, $carry$$inline_463$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_462$$.$a$ & 1;
        $JSCompiler_StaticMethods_rra_a$self$$inline_462$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_462$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_462$$.$f$ & 1) << 7) & 255;
        $JSCompiler_StaticMethods_rra_a$self$$inline_462$$.$f$ = $JSCompiler_StaticMethods_rra_a$self$$inline_462$$.$f$ & 236 | $carry$$inline_463$$;
        break;
      case 32:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 33:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 34:
        $location$$21$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $location$$21$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        var $address$$inline_470$$ = ++$location$$21$$;
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $address$$inline_470$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ += 2;
        break;
      case 35:
        $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 36:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 37:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 38:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 39:
        var $JSCompiler_StaticMethods_daa$self$$inline_473$$ = $JSCompiler_StaticMethods_run$self$$, $temp$$inline_474$$ = $JSCompiler_StaticMethods_daa$self$$inline_473$$.$DAA_TABLE$[$JSCompiler_StaticMethods_daa$self$$inline_473$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_473$$.$f$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_473$$.$f$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_473$$.$f$ & 16) << 6];
        $JSCompiler_StaticMethods_daa$self$$inline_473$$.$a$ = $temp$$inline_474$$ & 255;
        $JSCompiler_StaticMethods_daa$self$$inline_473$$.$f$ = $JSCompiler_StaticMethods_daa$self$$inline_473$$.$f$ & 2 | $temp$$inline_474$$ >> 8;
        break;
      case 40:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 41:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 42:
        $location$$21$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $location$$21$$);
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $location$$21$$ + 1);
        $JSCompiler_StaticMethods_run$self$$.$pc$ += 2;
        break;
      case 43:
        $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 44:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 45:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 46:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 47:
        var $JSCompiler_StaticMethods_cpl_a$self$$inline_476$$ = $JSCompiler_StaticMethods_run$self$$;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_476$$.$a$ ^= 255;
        $JSCompiler_StaticMethods_cpl_a$self$$inline_476$$.$f$ |= 18;
        break;
      case 48:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 49:
        $JSCompiler_StaticMethods_run$self$$.$sp$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ += 2;
        break;
      case 50:
        var $address$$inline_479$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $address$$inline_479$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ += 2;
        break;
      case 51:
        $JSCompiler_StaticMethods_run$self$$.$sp$++;
        break;
      case 52:
        $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 53:
        $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 54:
        var $value$$inline_484$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $value$$inline_484$$);
        break;
      case 55:
        $JSCompiler_StaticMethods_run$self$$.$f$ |= 1;
        $JSCompiler_StaticMethods_run$self$$.$f$ &= -3;
        $JSCompiler_StaticMethods_run$self$$.$f$ &= -17;
        break;
      case 56:
        $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 57:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$sp$));
        break;
      case 58:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$));
        $JSCompiler_StaticMethods_run$self$$.$pc$ += 2;
        break;
      case 59:
        $JSCompiler_StaticMethods_run$self$$.$sp$--;
        break;
      case 60:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 61:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 62:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        break;
      case 63:
        var $JSCompiler_StaticMethods_ccf$self$$inline_486$$ = $JSCompiler_StaticMethods_run$self$$;
        0 != ($JSCompiler_StaticMethods_ccf$self$$inline_486$$.$f$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_486$$.$f$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_486$$.$f$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_486$$.$f$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_486$$.$f$ &= -17);
        $JSCompiler_StaticMethods_ccf$self$$inline_486$$.$f$ &= -3;
        break;
      case 65:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$c$;
        break;
      case 66:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        break;
      case 67:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        break;
      case 68:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        break;
      case 69:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        break;
      case 70:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 71:
        $JSCompiler_StaticMethods_run$self$$.$b$ = $JSCompiler_StaticMethods_run$self$$.$a$;
        break;
      case 72:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_run$self$$.$b$;
        break;
      case 74:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        break;
      case 75:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        break;
      case 76:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        break;
      case 77:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        break;
      case 78:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 79:
        $JSCompiler_StaticMethods_run$self$$.$c$ = $JSCompiler_StaticMethods_run$self$$.$a$;
        break;
      case 80:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$b$;
        break;
      case 81:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$c$;
        break;
      case 83:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        break;
      case 84:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        break;
      case 85:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        break;
      case 86:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 87:
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$a$;
        break;
      case 88:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$b$;
        break;
      case 89:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$c$;
        break;
      case 90:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        break;
      case 92:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        break;
      case 93:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        break;
      case 94:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 95:
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$a$;
        break;
      case 96:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_run$self$$.$b$;
        break;
      case 97:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_run$self$$.$c$;
        break;
      case 98:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        break;
      case 99:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        break;
      case 101:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        break;
      case 102:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 103:
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_run$self$$.$a$;
        break;
      case 104:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_run$self$$.$b$;
        break;
      case 105:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_run$self$$.$c$;
        break;
      case 106:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        break;
      case 107:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        break;
      case 108:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        break;
      case 110:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 111:
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_run$self$$.$a$;
        break;
      case 112:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 113:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 114:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 115:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 116:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 117:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 118:
        $JSCompiler_StaticMethods_run$self$$.$halt$ = $JSCompiler_alias_TRUE$$;
        $JSCompiler_StaticMethods_run$self$$.$pc$--;
        break;
      case 119:
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$), $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 120:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_run$self$$.$b$;
        break;
      case 121:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_run$self$$.$c$;
        break;
      case 122:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        break;
      case 123:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        break;
      case 124:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        break;
      case 125:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        break;
      case 126:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$));
        break;
      case 128:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 129:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 130:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 131:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 132:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 133:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 134:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 135:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 136:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 137:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 138:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 139:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 140:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 141:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 142:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 143:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 144:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 145:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 146:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 147:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 148:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 149:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 150:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 151:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 152:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 153:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 154:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 155:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 156:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 157:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 158:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 159:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 160:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_run$self$$.$b$] | 16;
        break;
      case 161:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_run$self$$.$c$] | 16;
        break;
      case 162:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_run$self$$.$d$] | 16;
        break;
      case 163:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_run$self$$.$e$] | 16;
        break;
      case 164:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_run$self$$.$h$] | 16;
        break;
      case 165:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_run$self$$.$l$] | 16;
        break;
      case 166:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$))] | 16;
        break;
      case 167:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$] | 16;
        break;
      case 168:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$.$b$];
        break;
      case 169:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$.$c$];
        break;
      case 170:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$.$d$];
        break;
      case 171:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$.$e$];
        break;
      case 172:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$.$h$];
        break;
      case 173:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$.$l$];
        break;
      case 174:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$))];
        break;
      case 175:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ = 0];
        break;
      case 176:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_run$self$$.$b$];
        break;
      case 177:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_run$self$$.$c$];
        break;
      case 178:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_run$self$$.$d$];
        break;
      case 179:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_run$self$$.$e$];
        break;
      case 180:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_run$self$$.$h$];
        break;
      case 181:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_run$self$$.$l$];
        break;
      case 182:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$))];
        break;
      case 183:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$];
        break;
      case 184:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$b$);
        break;
      case 185:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 186:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$d$);
        break;
      case 187:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 188:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$h$);
        break;
      case 189:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 190:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$)));
        break;
      case 191:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 192:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 193:
        var $JSCompiler_StaticMethods_setBC$self$$inline_516$$ = $JSCompiler_StaticMethods_run$self$$, $value$$inline_517$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$);
        $JSCompiler_StaticMethods_setBC$self$$inline_516$$.$b$ = $value$$inline_517$$ >> 8;
        $JSCompiler_StaticMethods_setBC$self$$inline_516$$.$c$ = $value$$inline_517$$ & 255;
        $JSCompiler_StaticMethods_run$self$$.$sp$ += 2;
        break;
      case 194:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 195:
        $JSCompiler_StaticMethods_run$self$$.$pc$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$);
        break;
      case 196:
        $JSCompiler_StaticMethods_run$self$$.call(0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 197:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$b$, $JSCompiler_StaticMethods_run$self$$.$c$);
        break;
      case 198:
        $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++));
        break;
      case 199:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 0;
        break;
      case 200:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 201:
        $JSCompiler_StaticMethods_run$self$$.$pc$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$);
        $JSCompiler_StaticMethods_run$self$$.$sp$ += 2;
        break;
      case 202:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 203:
        var $JSCompiler_StaticMethods_doCB$self$$inline_519$$ = $JSCompiler_StaticMethods_run$self$$, $opcode$$inline_520$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++);
        $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$tstates$ -= $OP_CB_STATES$$[$opcode$$inline_520$$];
        switch($opcode$$inline_520$$) {
          case 0:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 1:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 2:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 3:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 4:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 5:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 6:
            var $value$$inline_621$$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_621$$);
            break;
          case 7:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 8:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 9:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 10:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 11:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 12:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 13:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 14:
            var $value$$inline_625$$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_625$$);
            break;
          case 15:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 16:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 17:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 18:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 19:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 20:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 21:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 22:
            var $value$$inline_629$$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_629$$);
            break;
          case 23:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 24:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 25:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 26:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 27:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 28:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 29:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 30:
            var $value$$inline_633$$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_633$$);
            break;
          case 31:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 32:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 33:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 34:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 35:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 36:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 38:
            var $value$$inline_637$$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_637$$);
            break;
          case 39:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 40:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 41:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 42:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 43:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 44:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 46:
            var $value$$inline_641$$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_641$$);
            break;
          case 47:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 48:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 49:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 50:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 51:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 52:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 53:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 54:
            var $value$$inline_645$$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_645$$);
            break;
          case 55:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 56:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$);
            break;
          case 57:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$);
            break;
          case 58:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$);
            break;
          case 59:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$);
            break;
          case 60:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$);
            break;
          case 61:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$);
            break;
          case 62:
            var $value$$inline_649$$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_649$$);
            break;
          case 63:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$);
            break;
          case 64:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 1);
            break;
          case 65:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 1);
            break;
          case 66:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 1);
            break;
          case 67:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 1);
            break;
          case 68:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 1);
            break;
          case 69:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 1);
            break;
          case 70:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 1);
            break;
          case 71:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 1);
            break;
          case 72:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 2);
            break;
          case 73:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 2);
            break;
          case 74:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 2);
            break;
          case 75:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 2);
            break;
          case 76:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 2);
            break;
          case 77:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 2);
            break;
          case 78:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 2);
            break;
          case 79:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 2);
            break;
          case 80:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 4);
            break;
          case 81:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 4);
            break;
          case 82:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 4);
            break;
          case 83:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 4);
            break;
          case 84:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 4);
            break;
          case 85:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 4);
            break;
          case 86:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 4);
            break;
          case 87:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 4);
            break;
          case 88:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 8);
            break;
          case 89:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 8);
            break;
          case 90:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 8);
            break;
          case 91:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 8);
            break;
          case 92:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 8);
            break;
          case 93:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 8);
            break;
          case 94:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 8);
            break;
          case 95:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 8);
            break;
          case 96:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 16);
            break;
          case 97:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 16);
            break;
          case 98:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 16);
            break;
          case 99:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 16);
            break;
          case 100:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 16);
            break;
          case 101:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 16);
            break;
          case 102:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 16);
            break;
          case 103:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 16);
            break;
          case 104:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 32);
            break;
          case 105:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 32);
            break;
          case 106:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 32);
            break;
          case 107:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 32);
            break;
          case 108:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 32);
            break;
          case 109:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 32);
            break;
          case 110:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 32);
            break;
          case 111:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 32);
            break;
          case 112:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 64);
            break;
          case 113:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 64);
            break;
          case 114:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 64);
            break;
          case 115:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 64);
            break;
          case 116:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 64);
            break;
          case 117:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 64);
            break;
          case 118:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 64);
            break;
          case 119:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 64);
            break;
          case 120:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ & 128);
            break;
          case 121:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ & 128);
            break;
          case 122:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ & 128);
            break;
          case 123:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ & 128);
            break;
          case 124:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ & 128);
            break;
          case 125:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ & 128);
            break;
          case 126:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & 128);
            break;
          case 127:
            $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ & 128);
            break;
          case 128:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -2;
            break;
          case 129:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -2;
            break;
          case 130:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -2;
            break;
          case 131:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -2;
            break;
          case 132:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -2;
            break;
          case 133:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -2;
            break;
          case 134:
            var $value$$inline_653$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -2;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_653$$);
            break;
          case 135:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -2;
            break;
          case 136:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -3;
            break;
          case 137:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -3;
            break;
          case 138:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -3;
            break;
          case 139:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -3;
            break;
          case 140:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -3;
            break;
          case 141:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -3;
            break;
          case 142:
            var $value$$inline_657$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -3;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_657$$);
            break;
          case 143:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -3;
            break;
          case 144:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -5;
            break;
          case 145:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -5;
            break;
          case 146:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -5;
            break;
          case 147:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -5;
            break;
          case 148:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -5;
            break;
          case 149:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -5;
            break;
          case 150:
            var $value$$inline_661$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -5;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_661$$);
            break;
          case 151:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -5;
            break;
          case 152:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -9;
            break;
          case 153:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -9;
            break;
          case 154:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -9;
            break;
          case 155:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -9;
            break;
          case 156:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -9;
            break;
          case 157:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -9;
            break;
          case 158:
            var $value$$inline_665$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -9;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_665$$);
            break;
          case 159:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -9;
            break;
          case 160:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -17;
            break;
          case 161:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -17;
            break;
          case 162:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -17;
            break;
          case 163:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -17;
            break;
          case 164:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -17;
            break;
          case 165:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -17;
            break;
          case 166:
            var $value$$inline_669$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -17;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_669$$);
            break;
          case 167:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -17;
            break;
          case 168:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -33;
            break;
          case 169:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -33;
            break;
          case 170:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -33;
            break;
          case 171:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -33;
            break;
          case 172:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -33;
            break;
          case 173:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -33;
            break;
          case 174:
            var $value$$inline_673$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -33;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_673$$);
            break;
          case 175:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -33;
            break;
          case 176:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -65;
            break;
          case 177:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -65;
            break;
          case 178:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -65;
            break;
          case 179:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -65;
            break;
          case 180:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -65;
            break;
          case 181:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -65;
            break;
          case 182:
            var $value$$inline_677$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -65;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_677$$);
            break;
          case 183:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -65;
            break;
          case 184:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ &= -129;
            break;
          case 185:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ &= -129;
            break;
          case 186:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ &= -129;
            break;
          case 187:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ &= -129;
            break;
          case 188:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ &= -129;
            break;
          case 189:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ &= -129;
            break;
          case 190:
            var $value$$inline_681$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) & -129;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_681$$);
            break;
          case 191:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ &= -129;
            break;
          case 192:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 1;
            break;
          case 193:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 1;
            break;
          case 194:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 1;
            break;
          case 195:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 1;
            break;
          case 196:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 1;
            break;
          case 197:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 1;
            break;
          case 198:
            var $value$$inline_685$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 1;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_685$$);
            break;
          case 199:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 1;
            break;
          case 200:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 2;
            break;
          case 201:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 2;
            break;
          case 203:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 2;
            break;
          case 204:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 2;
            break;
          case 205:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 2;
            break;
          case 206:
            var $value$$inline_689$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 2;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_689$$);
            break;
          case 207:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 2;
            break;
          case 208:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 4;
            break;
          case 209:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 4;
            break;
          case 210:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 4;
            break;
          case 211:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 4;
            break;
          case 212:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 4;
            break;
          case 213:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 4;
            break;
          case 214:
            var $value$$inline_693$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 4;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_693$$);
            break;
          case 215:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 4;
            break;
          case 216:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 8;
            break;
          case 217:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 8;
            break;
          case 218:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 8;
            break;
          case 219:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 8;
            break;
          case 220:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 8;
            break;
          case 221:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 8;
            break;
          case 222:
            var $value$$inline_697$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 8;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_697$$);
            break;
          case 223:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 8;
            break;
          case 224:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 16;
            break;
          case 225:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 16;
            break;
          case 226:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 16;
            break;
          case 227:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 16;
            break;
          case 228:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 16;
            break;
          case 229:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 16;
            break;
          case 230:
            var $value$$inline_701$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 16;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_701$$);
            break;
          case 231:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 16;
            break;
          case 232:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 32;
            break;
          case 233:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 32;
            break;
          case 234:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 32;
            break;
          case 235:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 32;
            break;
          case 236:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 32;
            break;
          case 237:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 32;
            break;
          case 238:
            var $value$$inline_705$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 32;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_705$$);
            break;
          case 239:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 32;
            break;
          case 240:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 64;
            break;
          case 241:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 64;
            break;
          case 242:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 64;
            break;
          case 243:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 64;
            break;
          case 244:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 64;
            break;
          case 245:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 64;
            break;
          case 246:
            var $value$$inline_709$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 64;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_709$$);
            break;
          case 247:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 64;
            break;
          case 248:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$b$ |= 128;
            break;
          case 249:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$c$ |= 128;
            break;
          case 250:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$d$ |= 128;
            break;
          case 251:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$e$ |= 128;
            break;
          case 252:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$h$ |= 128;
            break;
          case 253:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$l$ |= 128;
            break;
          case 254:
            var $value$$inline_713$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$)) | 128;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_519$$), $value$$inline_713$$);
            break;
          case 255:
            $JSCompiler_StaticMethods_doCB$self$$inline_519$$.$a$ |= 128;
            break;
          default:
            console.log("Unimplemented CB Opcode: " + $opcode$$inline_520$$.toString(16))
        }
        break;
      case 204:
        $JSCompiler_StaticMethods_run$self$$.call(0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 64));
        break;
      case 205:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$ + 2);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$);
        break;
      case 206:
        $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++));
        break;
      case 207:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 8;
        break;
      case 208:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 209:
        var $JSCompiler_StaticMethods_setDE$self$$inline_522$$ = $JSCompiler_StaticMethods_run$self$$, $value$$inline_523$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$);
        $JSCompiler_StaticMethods_setDE$self$$inline_522$$.$d$ = $value$$inline_523$$ >> 8;
        $JSCompiler_StaticMethods_setDE$self$$inline_522$$.$e$ = $value$$inline_523$$ & 255;
        $JSCompiler_StaticMethods_run$self$$.$sp$ += 2;
        break;
      case 210:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 211:
        $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_run$self$$.port, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++), $JSCompiler_StaticMethods_run$self$$.$a$);
        break;
      case 212:
        $JSCompiler_StaticMethods_run$self$$.call(0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 213:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$d$, $JSCompiler_StaticMethods_run$self$$.$e$);
        break;
      case 214:
        $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++));
        break;
      case 215:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 16;
        break;
      case 216:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 217:
        var $JSCompiler_StaticMethods_exBC$self$$inline_525$$ = $JSCompiler_StaticMethods_run$self$$, $temp$$inline_526$$ = $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$b$;
        $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$b$ = $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$b2$;
        $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$b2$ = $temp$$inline_526$$;
        $temp$$inline_526$$ = $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$c$;
        $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$c$ = $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$c2$;
        $JSCompiler_StaticMethods_exBC$self$$inline_525$$.$c2$ = $temp$$inline_526$$;
        var $JSCompiler_StaticMethods_exDE$self$$inline_528$$ = $JSCompiler_StaticMethods_run$self$$, $temp$$inline_529$$ = $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$d$;
        $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$d$ = $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$d2$;
        $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$d2$ = $temp$$inline_529$$;
        $temp$$inline_529$$ = $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$e$;
        $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$e$ = $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$e2$;
        $JSCompiler_StaticMethods_exDE$self$$inline_528$$.$e2$ = $temp$$inline_529$$;
        var $JSCompiler_StaticMethods_exHL$self$$inline_531$$ = $JSCompiler_StaticMethods_run$self$$, $temp$$inline_532$$ = $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$h$;
        $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$h$ = $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$h2$;
        $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$h2$ = $temp$$inline_532$$;
        $temp$$inline_532$$ = $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$l$;
        $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$l$ = $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$l2$;
        $JSCompiler_StaticMethods_exHL$self$$inline_531$$.$l2$ = $temp$$inline_532$$;
        break;
      case 218:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 219:
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_run$self$$.port, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++));
        break;
      case 220:
        $JSCompiler_StaticMethods_run$self$$.call(0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 1));
        break;
      case 221:
        var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$ = $JSCompiler_StaticMethods_run$self$$, $opcode$$inline_535$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++), $location$$inline_536$$ = $JSCompiler_alias_VOID$$, $temp$$inline_537$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$tstates$ -= $OP_DD_STATES$$[$opcode$$inline_535$$];
        switch($opcode$$inline_535$$) {
          case 9:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$ += 2;
            break;
          case 34:
            var $location$$inline_536$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$), $address$$inline_716$$ = $location$$inline_536$$++;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_716$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $location$$inline_536$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$ += 2;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIX$self$$inline_723$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$;
            $JSCompiler_StaticMethods_incIX$self$$inline_723$$.$ixL$ = $JSCompiler_StaticMethods_incIX$self$$inline_723$$.$ixL$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIX$self$$inline_723$$.$ixL$ && ($JSCompiler_StaticMethods_incIX$self$$inline_723$$.$ixH$ = $JSCompiler_StaticMethods_incIX$self$$inline_723$$.$ixH$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            break;
          case 42:
            $location$$inline_536$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $location$$inline_536$$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, ++$location$$inline_536$$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$ += 2;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIX$self$$inline_725$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$;
            $JSCompiler_StaticMethods_decIX$self$$inline_725$$.$ixL$ = $JSCompiler_StaticMethods_decIX$self$$inline_725$$.$ixL$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIX$self$$inline_725$$.$ixL$ && ($JSCompiler_StaticMethods_decIX$self$$inline_725$$.$ixH$ = $JSCompiler_StaticMethods_decIX$self$$inline_725$$.$ixH$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 54:
            var $address$$inline_728$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$), $value$$inline_729$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, ++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_728$$, $value$$inline_729$$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$b$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$c$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$d$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$e$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$b$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$c$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$b$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$c$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$;
            break;
          case 112:
            var $address$$inline_732$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_732$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$b$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 113:
            var $address$$inline_736$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_736$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$c$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 114:
            var $address$$inline_740$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_740$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 115:
            var $address$$inline_744$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_744$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 116:
            var $address$$inline_748$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_748$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 117:
            var $address$$inline_752$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_752$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 119:
            var $address$$inline_756$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $address$$inline_756$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ &= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ ^= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$a$ |= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$))];
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$)));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$));
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$ += 2;
            break;
          case 227:
            $temp$$inline_537$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$, $temp$$inline_537$$ & 255);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$ + 1, $temp$$inline_537$$ >> 8);
            break;
          case 229:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.push($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixH$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$ixL$);
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$sp$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$);
            break;
          default:
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_534$$.$pc$--
        }
        break;
      case 222:
        $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++));
        break;
      case 223:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 24;
        break;
      case 224:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 4));
        break;
      case 225:
        $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$));
        $JSCompiler_StaticMethods_run$self$$.$sp$ += 2;
        break;
      case 226:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 4));
        break;
      case 227:
        $temp$$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        $JSCompiler_StaticMethods_run$self$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$ + 1);
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$ + 1, $temp$$);
        $temp$$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        $JSCompiler_StaticMethods_run$self$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$);
        $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$, $temp$$);
        break;
      case 228:
        $JSCompiler_StaticMethods_run$self$$.call(0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 4));
        break;
      case 229:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$h$, $JSCompiler_StaticMethods_run$self$$.$l$);
        break;
      case 230:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ &= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++)] | 16;
        break;
      case 231:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 32;
        break;
      case 232:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 4));
        break;
      case 233:
        $JSCompiler_StaticMethods_run$self$$.$pc$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 234:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 4));
        break;
      case 235:
        $temp$$ = $JSCompiler_StaticMethods_run$self$$.$d$;
        $JSCompiler_StaticMethods_run$self$$.$d$ = $JSCompiler_StaticMethods_run$self$$.$h$;
        $JSCompiler_StaticMethods_run$self$$.$h$ = $temp$$;
        $temp$$ = $JSCompiler_StaticMethods_run$self$$.$e$;
        $JSCompiler_StaticMethods_run$self$$.$e$ = $JSCompiler_StaticMethods_run$self$$.$l$;
        $JSCompiler_StaticMethods_run$self$$.$l$ = $temp$$;
        break;
      case 236:
        $JSCompiler_StaticMethods_run$self$$.call(0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 4));
        break;
      case 237:
        var $JSCompiler_StaticMethods_doED$self$$inline_547$$ = $JSCompiler_StaticMethods_run$self$$, $opcode$$inline_548$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$), $temp$$inline_549$$ = $JSCompiler_alias_VOID$$, $location$$inline_550$$ = $JSCompiler_alias_VOID$$, $hlmem$$inline_551$$ = $JSCompiler_alias_VOID$$, $a_copy$$inline_552$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= $OP_ED_STATES$$[$opcode$$inline_548$$];
        switch($opcode$$inline_548$$) {
          case 64:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 65:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 66:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 67:
            var $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1), $address$$inline_768$$ = $location$$inline_550$$++;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $address$$inline_768$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
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
            $a_copy$$inline_552$$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ = 0;
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $a_copy$$inline_552$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
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
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$ += 2;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$iff1$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$iff2$;
            break;
          case 70:
          ;
          case 78:
          ;
          case 102:
          ;
          case 110:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$im$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 71:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$i$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 72:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 73:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 74:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 75:
            $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$++);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 79:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$r$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 80:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$d$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 81:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 82:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 83:
            var $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1), $address$$inline_776$$ = $location$$inline_550$$++;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $address$$inline_776$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$e$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$d$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 86:
          ;
          case 118:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$im$ = 1;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 87:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$i$;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZ_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$iff2$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 88:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$e$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 89:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$e$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 90:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 91:
            $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$e$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$++);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$d$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 95:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ = Math.round(255 * Math.random());
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZ_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$iff2$ ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$h$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 97:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 98:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 99:
            var $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1), $address$$inline_784$$ = $location$$inline_550$$++;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $address$$inline_784$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$h$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 103:
            $location$$inline_550$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $hlmem$$inline_551$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$, $hlmem$$inline_551$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ & 15) << 4);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ & 240 | $hlmem$$inline_551$$ & 15;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 104:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 105:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 106:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 107:
            $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$++);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 111:
            $location$$inline_550$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $hlmem$$inline_551$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$, ($hlmem$$inline_551$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ & 15);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ & 240 | $hlmem$$inline_551$$ >> 4;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 113:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, 0);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 114:
            $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 115:
            var $location$$inline_550$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1), $address$$inline_800$$ = $location$$inline_550$$++;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $address$$inline_800$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$ & 255);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $location$$inline_550$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$ >> 8);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 120:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_547$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$];
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 121:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$a$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 122:
            $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 123:
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$sp$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ + 1));
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$ += 3;
            break;
          case 160:
            var $value$$inline_809$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $value$$inline_809$$);
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 161:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$)));
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $temp$$inline_549$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 248 | $temp$$inline_549$$;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 162:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $temp$$inline_549$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 128 == ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 163:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $temp$$inline_549$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$ + $temp$$inline_549$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 128 == ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 168:
            var $value$$inline_817$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $value$$inline_817$$);
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? 4 : 0);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 169:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$)));
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $temp$$inline_549$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? 0 : 4;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 248 | $temp$$inline_549$$;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 170:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $temp$$inline_549$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 0 != ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 171:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $temp$$inline_549$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            255 < $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$ + $temp$$inline_549$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 128 == ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            break;
          case 176:
            var $value$$inline_825$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $value$$inline_825$$);
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -3;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -17;
            break;
          case 177:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$)));
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $temp$$inline_549$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? 0 : 4;
            0 != ($temp$$inline_549$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 248 | $temp$$inline_549$$;
            break;
          case 178:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $temp$$inline_549$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 128 == ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            break;
          case 179:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $temp$$inline_549$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$ + $temp$$inline_549$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 0 != ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            break;
          case 184:
            var $value$$inline_833$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $value$$inline_833$$);
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -3;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -17;
            break;
          case 185:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 1 | 2;
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$)));
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            $temp$$inline_549$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_547$$) ? 0 : 4;
            0 != ($temp$$inline_549$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & 248 | $temp$$inline_549$$;
            break;
          case 186:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$), $temp$$inline_549$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 0 != ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            break;
          case 187:
            $temp$$inline_549$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$));
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_547$$.port, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$c$, $temp$$inline_549$$);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_547$$, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$);
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_547$$);
            0 != $JSCompiler_StaticMethods_doED$self$$inline_547$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++;
            255 < $JSCompiler_StaticMethods_doED$self$$inline_547$$.$l$ + $temp$$inline_549$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ &= -17);
            $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ = 0 != ($temp$$inline_549$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_547$$.$f$ & -3;
            break;
          default:
            console.log("Unimplemented ED Opcode: " + $opcode$$inline_548$$.toString(16)), $JSCompiler_StaticMethods_doED$self$$inline_547$$.$pc$++
        }
        break;
      case 238:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ ^= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++)];
        break;
      case 239:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 40;
        break;
      case 240:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 128));
        break;
      case 241:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$++);
        $JSCompiler_StaticMethods_run$self$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$sp$++);
        break;
      case 242:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 128));
        break;
      case 243:
        $JSCompiler_StaticMethods_run$self$$.$iff1$ = $JSCompiler_StaticMethods_run$self$$.$iff2$ = $JSCompiler_alias_FALSE$$;
        $JSCompiler_StaticMethods_run$self$$.$EI_inst$ = $JSCompiler_alias_TRUE$$;
        break;
      case 244:
        $JSCompiler_StaticMethods_run$self$$.call(0 == ($JSCompiler_StaticMethods_run$self$$.$f$ & 128));
        break;
      case 245:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$a$, $JSCompiler_StaticMethods_run$self$$.$f$);
        break;
      case 246:
        $JSCompiler_StaticMethods_run$self$$.$f$ = $JSCompiler_StaticMethods_run$self$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$.$a$ |= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++)];
        break;
      case 247:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$);
        $JSCompiler_StaticMethods_run$self$$.$pc$ = 48;
        break;
      case 248:
        $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 128));
        break;
      case 249:
        $JSCompiler_StaticMethods_run$self$$.$sp$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$);
        break;
      case 250:
        $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$, 0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 128));
        break;
      case 251:
        $JSCompiler_StaticMethods_run$self$$.$iff1$ = $JSCompiler_StaticMethods_run$self$$.$iff2$ = $JSCompiler_StaticMethods_run$self$$.$EI_inst$ = $JSCompiler_alias_TRUE$$;
        break;
      case 252:
        $JSCompiler_StaticMethods_run$self$$.call(0 != ($JSCompiler_StaticMethods_run$self$$.$f$ & 128));
        break;
      case 253:
        var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$ = $JSCompiler_StaticMethods_run$self$$, $opcode$$inline_555$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++), $location$$inline_556$$ = $JSCompiler_alias_VOID$$, $temp$$inline_557$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$tstates$ -= $OP_DD_STATES$$[$opcode$$inline_555$$];
        switch($opcode$$inline_555$$) {
          case 9:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            break;
          case 25:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            break;
          case 33:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$ += 2;
            break;
          case 34:
            var $location$$inline_556$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$), $address$$inline_840$$ = $location$$inline_556$$++;
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_840$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $location$$inline_556$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$ += 2;
            break;
          case 35:
            var $JSCompiler_StaticMethods_incIY$self$$inline_847$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$;
            $JSCompiler_StaticMethods_incIY$self$$inline_847$$.$iyL$ = $JSCompiler_StaticMethods_incIY$self$$inline_847$$.$iyL$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incIY$self$$inline_847$$.$iyL$ && ($JSCompiler_StaticMethods_incIY$self$$inline_847$$.$iyH$ = $JSCompiler_StaticMethods_incIY$self$$inline_847$$.$iyH$ + 1 & 255);
            break;
          case 36:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 37:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 38:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++);
            break;
          case 41:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            break;
          case 42:
            $location$$inline_556$$ = $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $location$$inline_556$$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, ++$location$$inline_556$$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$ += 2;
            break;
          case 43:
            var $JSCompiler_StaticMethods_decIY$self$$inline_849$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$;
            $JSCompiler_StaticMethods_decIY$self$$inline_849$$.$iyL$ = $JSCompiler_StaticMethods_decIY$self$$inline_849$$.$iyL$ - 1 & 255;
            255 == $JSCompiler_StaticMethods_decIY$self$$inline_849$$.$iyL$ && ($JSCompiler_StaticMethods_decIY$self$$inline_849$$.$iyH$ = $JSCompiler_StaticMethods_decIY$self$$inline_849$$.$iyH$ - 1 & 255);
            break;
          case 44:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 45:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 46:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++);
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 54:
            var $address$$inline_852$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$), $value$$inline_853$$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, ++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_852$$, $value$$inline_853$$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 57:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$));
            break;
          case 68:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$;
            break;
          case 69:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$;
            break;
          case 70:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$b$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 76:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$;
            break;
          case 77:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$;
            break;
          case 78:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$c$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 84:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$;
            break;
          case 85:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$;
            break;
          case 86:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$d$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 92:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$;
            break;
          case 93:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$;
            break;
          case 94:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$e$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 96:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$b$;
            break;
          case 97:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$c$;
            break;
          case 98:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$e$;
            break;
          case 100:
            break;
          case 101:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$;
            break;
          case 102:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$h$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 103:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$b$;
            break;
          case 105:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$c$;
            break;
          case 106:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$;
            break;
          case 109:
            break;
          case 110:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$l$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 111:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$;
            break;
          case 112:
            var $address$$inline_856$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_856$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$b$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 113:
            var $address$$inline_860$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_860$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$c$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 114:
            var $address$$inline_864$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_864$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$d$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 115:
            var $address$$inline_868$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_868$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$e$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 116:
            var $address$$inline_872$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_872$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$h$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 117:
            var $address$$inline_876$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_876$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$l$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 119:
            var $address$$inline_880$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $address$$inline_880$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$);
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 124:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$;
            break;
          case 125:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$;
            break;
          case 126:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ = $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 164:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ &= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$))] | 16;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 172:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$];
            break;
          case 173:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$];
            break;
          case 174:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ ^= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 180:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$];
            break;
          case 181:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$];
            break;
          case 182:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$a$ |= $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$))];
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$)));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$++;
            break;
          case 203:
            $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$));
            break;
          case 225:
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$));
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$ += 2;
            break;
          case 227:
            $temp$$inline_557$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_readMemWord$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$));
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$, $temp$$inline_557$$ & 255);
            $JSSMS$Utils$writeMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$ + 1, $temp$$inline_557$$ >> 8);
            break;
          case 229:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.push($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyH$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$iyL$);
            break;
          case 233:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            break;
          case 249:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$sp$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$);
            break;
          default:
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_554$$.$pc$--
        }
        break;
      case 254:
        $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_readMem$$($JSCompiler_StaticMethods_run$self$$, $JSCompiler_StaticMethods_run$self$$.$pc$++));
        break;
      case 255:
        $JSCompiler_StaticMethods_run$self$$.push($JSCompiler_StaticMethods_run$self$$.$pc$), $JSCompiler_StaticMethods_run$self$$.$pc$ = 56
    }
  }
}
;function $JSSMS$Keyboard$$($sms$$1$$) {
  this.$main$ = $sms$$1$$;
  this.$lightgunY$ = this.$lightgunX$ = this.$ggstart$ = this.$controller2$ = this.$controller1$ = 0;
  this.$lightgunEnabled$ = this.$lightgunClick$ = $JSCompiler_alias_FALSE$$
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$ggstart$ = this.$controller2$ = this.$controller1$ = 255;
  this.$pause_button$ = $JSCompiler_alias_FALSE$$
}, keydown:function $$JSSMS$Keyboard$$$$keydown$($evt$$14$$) {
  switch($evt$$14$$.keyCode) {
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
      this.$main$.$is_sms$ ? this.$main$.$pause_button$ = $JSCompiler_alias_TRUE$$ : this.$ggstart$ &= -129;
      break;
    case 104:
      this.$controller2$ &= -2;
      break;
    case 98:
      this.$controller2$ &= -3;
      break;
    case 100:
      this.$controller2$ &= -5;
      break;
    case 102:
      this.$controller2$ &= -9;
      break;
    case 103:
      this.$controller2$ &= -17;
      break;
    case 105:
      this.$controller2$ &= -33;
      break;
    case 97:
      this.$controller2$ &= -65;
      break;
    default:
      return
  }
  $evt$$14$$.preventDefault()
}, keyup:function $$JSSMS$Keyboard$$$$keyup$($evt$$15$$) {
  switch($evt$$15$$.keyCode) {
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
      this.$controller2$ |= 1;
      break;
    case 98:
      this.$controller2$ |= 2;
      break;
    case 100:
      this.$controller2$ |= 4;
      break;
    case 102:
      this.$controller2$ |= 8;
      break;
    case 103:
      this.$controller2$ |= 16;
      break;
    case 105:
      this.$controller2$ |= 32;
      break;
    case 97:
      this.$controller2$ |= 64;
      break;
    default:
      return
  }
  $evt$$15$$.preventDefault()
}};
var $NO_ANTIALIAS$$ = Number.MIN_VALUE, $PSG_VOLUME$$ = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0];
function $JSSMS$SN76489$$($sms$$2$$) {
  this.$main$ = $sms$$2$$;
  this.$clockFrac$ = this.$clock$ = 0;
  this.$reg$ = Array(8);
  this.$regLatch$ = 0;
  this.$freqCounter$ = Array(4);
  this.$freqPolarity$ = Array(4);
  this.$freqPos$ = Array(3);
  this.$noiseFreq$ = 16;
  this.$noiseShiftReg$ = 32768;
  this.$outputChannel$ = Array(4)
}
$JSSMS$SN76489$$.prototype = {write:function $$JSSMS$SN76489$$$$write$($value$$78$$) {
  0 != ($value$$78$$ & 128) ? (this.$regLatch$ = $value$$78$$ >> 4 & 7, this.$reg$[this.$regLatch$] = this.$reg$[this.$regLatch$] & 1008 | $value$$78$$ & 15) : this.$reg$[this.$regLatch$] = 0 == this.$regLatch$ || 2 == this.$regLatch$ || 4 == this.$regLatch$ ? this.$reg$[this.$regLatch$] & 15 | ($value$$78$$ & 63) << 4 : $value$$78$$ & 15;
  switch(this.$regLatch$) {
    case 0:
    ;
    case 2:
    ;
    case 4:
      0 == this.$reg$[this.$regLatch$] && (this.$reg$[this.$regLatch$] = 1);
      break;
    case 6:
      this.$noiseFreq$ = 16 << (this.$reg$[6] & 3), this.$noiseShiftReg$ = 32768
  }
}, update:function $$JSSMS$SN76489$$$$update$($offset$$17$$, $samplesToGenerate$$1$$) {
  var $buffer$$9$$ = [], $sample$$, $i$$12_output$$;
  for($sample$$ = 0;$sample$$ < $samplesToGenerate$$1$$;$sample$$++) {
    for($i$$12_output$$ = 0;3 > $i$$12_output$$;$i$$12_output$$++) {
      this.$outputChannel$[$i$$12_output$$] = this.$freqPos$[$i$$12_output$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[this.$reg$[($i$$12_output$$ << 1) + 1]] * this.$freqPos$[$i$$12_output$$] >> 8 : $PSG_VOLUME$$[this.$reg$[($i$$12_output$$ << 1) + 1]] * this.$freqPolarity$[$i$$12_output$$]
    }
    this.$outputChannel$[3] = $PSG_VOLUME$$[this.$reg$[7]] * (this.$noiseShiftReg$ & 1) << 1;
    $i$$12_output$$ = this.$outputChannel$[0] + this.$outputChannel$[1] + this.$outputChannel$[2] + this.$outputChannel$[3];
    127 < $i$$12_output$$ ? $i$$12_output$$ = 127 : -128 > $i$$12_output$$ && ($i$$12_output$$ = -128);
    $buffer$$9$$[$offset$$17$$ + $sample$$] = $i$$12_output$$;
    this.$clockFrac$ += this.$clock$;
    var $clockCycles$$ = this.$clockFrac$ >> 8, $clockCyclesScaled$$ = $clockCycles$$ << 8;
    this.$clockFrac$ -= $clockCyclesScaled$$;
    this.$freqCounter$[0] -= $clockCycles$$;
    this.$freqCounter$[1] -= $clockCycles$$;
    this.$freqCounter$[2] -= $clockCycles$$;
    this.$freqCounter$[3] = 128 == this.$noiseFreq$ ? this.$freqCounter$[2] : this.$freqCounter$[3] - $clockCycles$$;
    for($i$$12_output$$ = 0;3 > $i$$12_output$$;$i$$12_output$$++) {
      var $counter$$ = this.$freqCounter$[$i$$12_output$$];
      if(0 >= $counter$$) {
        var $tone$$ = this.$reg$[$i$$12_output$$ << 1];
        6 < $tone$$ ? (this.$freqPos$[$i$$12_output$$] = ($clockCyclesScaled$$ - this.$clockFrac$ + 512 * $counter$$ << 8) * this.$freqPolarity$[$i$$12_output$$] / ($clockCyclesScaled$$ + this.$clockFrac$), this.$freqPolarity$[$i$$12_output$$] = -this.$freqPolarity$[$i$$12_output$$]) : (this.$freqPolarity$[$i$$12_output$$] = 1, this.$freqPos$[$i$$12_output$$] = $NO_ANTIALIAS$$);
        this.$freqCounter$[$i$$12_output$$] += $tone$$ * ($clockCycles$$ / $tone$$ + 1)
      }else {
        this.$freqPos$[$i$$12_output$$] = $NO_ANTIALIAS$$
      }
    }
    0 >= this.$freqCounter$[3] && (this.$freqPolarity$[3] = -this.$freqPolarity$[3], 128 != this.$noiseFreq$ && (this.$freqCounter$[3] += this.$noiseFreq$ * ($clockCycles$$ / this.$noiseFreq$ + 1)), 1 == this.$freqPolarity$[3] && (this.$noiseShiftReg$ = this.$noiseShiftReg$ >> 1 | (0 != (this.$reg$[6] & 4) ? 0 != (this.$noiseShiftReg$ & 9) && 0 != (this.$noiseShiftReg$ & 9 ^ 9) ? 1 : 0 : this.$noiseShiftReg$ & 1) << 15))
  }
  return $buffer$$9$$
}};
function $JSSMS$Vdp$$($i$$13_i$$inline_560_sms$$3$$) {
  this.$main$ = $i$$13_i$$inline_560_sms$$3$$;
  this.$videoMode$ = 0;
  this.$VRAM$ = Array(16384);
  this.$CRAM$ = Array(32);
  for($i$$13_i$$inline_560_sms$$3$$ = 0;32 > $i$$13_i$$inline_560_sms$$3$$;$i$$13_i$$inline_560_sms$$3$$++) {
    this.$CRAM$[$i$$13_i$$inline_560_sms$$3$$] = 0
  }
  this.$vdpreg$ = Array(16);
  this.status = 0;
  this.$firstByte$ = $JSCompiler_alias_FALSE$$;
  this.$counter$ = this.$line$ = this.$readBuffer$ = this.$operation$ = this.location = this.$commandByte$ = 0;
  this.$bgPriority$ = Array(256);
  this.$spriteCol$ = Array(256);
  this.$vScrollLatch$ = this.$bgt$ = 0;
  this.display = Array(49152);
  this.$main_JAVA$ = Array(64);
  this.$GG_JAVA1$ = Array(256);
  this.$GG_JAVA2$ = Array(16);
  this.$isPalConverted$ = $JSCompiler_alias_FALSE$$;
  this.$sat$ = this.$h_end$ = this.$h_start$ = 0;
  this.$isSatDirty$ = $JSCompiler_alias_FALSE$$;
  this.$lineSprites$ = Array(192);
  for($i$$13_i$$inline_560_sms$$3$$ = 0;192 > $i$$13_i$$inline_560_sms$$3$$;$i$$13_i$$inline_560_sms$$3$$++) {
    this.$lineSprites$[$i$$13_i$$inline_560_sms$$3$$] = Array(25)
  }
  this.$tiles$ = Array(512);
  this.$isTileDirty$ = Array(512);
  for($i$$13_i$$inline_560_sms$$3$$ = this.$maxDirty$ = this.$minDirty$ = 0;512 > $i$$13_i$$inline_560_sms$$3$$;$i$$13_i$$inline_560_sms$$3$$++) {
    this.$tiles$[$i$$13_i$$inline_560_sms$$3$$] = Array(64)
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$14_i$$inline_563$$;
  this.$isPalConverted$ = $JSCompiler_alias_FALSE$$;
  var $r$$inline_564$$, $g$$inline_565$$, $b$$inline_566$$;
  if(this.$main$.$is_sms$ && !this.$isPalConverted$) {
    for($i$$14_i$$inline_563$$ = 0;64 > $i$$14_i$$inline_563$$;$i$$14_i$$inline_563$$++) {
      $r$$inline_564$$ = $i$$14_i$$inline_563$$ & 3, $g$$inline_565$$ = $i$$14_i$$inline_563$$ >> 2 & 3, $b$$inline_566$$ = $i$$14_i$$inline_563$$ >> 4 & 3, this.$main_JAVA$[$i$$14_i$$inline_563$$] = 85 * $r$$inline_564$$ | 85 * $g$$inline_565$$ << 8 | 85 * $b$$inline_566$$ << 16, this.$isPalConverted$ = $JSCompiler_alias_TRUE$$
    }
  }else {
    if(this.$main$.$is_gg$ && !this.$isPalConverted$) {
      for($i$$14_i$$inline_563$$ = 0;256 > $i$$14_i$$inline_563$$;$i$$14_i$$inline_563$$++) {
        $g$$inline_565$$ = $i$$14_i$$inline_563$$ & 15, $b$$inline_566$$ = $i$$14_i$$inline_563$$ >> 4 & 15, this.$GG_JAVA1$[$i$$14_i$$inline_563$$] = $b$$inline_566$$ << 12 | $b$$inline_566$$ << 8 | $g$$inline_565$$ << 4 | $g$$inline_565$$
      }
      for($i$$14_i$$inline_563$$ = 0;16 > $i$$14_i$$inline_563$$;$i$$14_i$$inline_563$$++) {
        this.$GG_JAVA2$[$i$$14_i$$inline_563$$] = $i$$14_i$$inline_563$$ << 20
      }
      this.$isPalConverted$ = $JSCompiler_alias_TRUE$$
    }
  }
  this.$firstByte$ = $JSCompiler_alias_TRUE$$;
  for($i$$14_i$$inline_563$$ = this.$operation$ = this.status = this.$counter$ = this.location = 0;16 > $i$$14_i$$inline_563$$;$i$$14_i$$inline_563$$++) {
    this.$vdpreg$[$i$$14_i$$inline_563$$] = 0
  }
  this.$vdpreg$[2] = 14;
  this.$vdpreg$[5] = 126;
  this.$vScrollLatch$ = 0;
  this.$main$.$cpu$.$interruptLine$ = $JSCompiler_alias_FALSE$$;
  this.$isSatDirty$ = $JSCompiler_alias_TRUE$$;
  this.$minDirty$ = 512;
  this.$maxDirty$ = -1;
  for($i$$14_i$$inline_563$$ = 0;16384 > $i$$14_i$$inline_563$$;$i$$14_i$$inline_563$$++) {
    this.$VRAM$[$i$$14_i$$inline_563$$] = 0
  }
  for($i$$14_i$$inline_563$$ = 0;49152 > $i$$14_i$$inline_563$$;$i$$14_i$$inline_563$$++) {
    this.display[$i$$14_i$$inline_563$$] = 0
  }
}};
function $JSCompiler_StaticMethods_forceFullRedraw$$($JSCompiler_StaticMethods_forceFullRedraw$self$$) {
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$bgt$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$vdpreg$[2] & 14) << 10;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$minDirty$ = 0;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$maxDirty$ = 511;
  for(var $i$$15$$ = 0, $l$$1$$ = $JSCompiler_StaticMethods_forceFullRedraw$self$$.$isTileDirty$.length;$i$$15$$ < $l$$1$$;$i$$15$$++) {
    $JSCompiler_StaticMethods_forceFullRedraw$self$$.$isTileDirty$[$i$$15$$] = $JSCompiler_alias_TRUE$$
  }
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$sat$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$vdpreg$[5] & -130) << 7;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$
}
;function $JSSMS$DummyUI$$($sms$$4$$) {
  this.$main$ = $sms$$4$$;
  this.enable = $JSCompiler_emptyFn$$();
  this.updateStatus = $JSCompiler_emptyFn$$();
  this.$writeAudio$ = $JSCompiler_emptyFn$$();
  this.$writeFrame$ = $JSCompiler_emptyFn$$()
}
"undefined" !== typeof $ && ($.fn.$JSSMSUI$ = function $$$fn$$JSSMSUI$$($roms$$) {
  function $UI$$($root_sms$$5$$) {
    this.$main$ = $root_sms$$5$$;
    var $self$$4$$ = this, $root_sms$$5$$ = $("<div></div>"), $controls$$ = $('<div class="controls"></div>'), $fullscreenSupport$$ = $JSSMS$Utils$getPrefix$$(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), $i$$23$$;
    this.$zoomed$ = $JSCompiler_alias_FALSE$$;
    this.$hiddenPrefix$ = $JSSMS$Utils$getPrefix$$(["hidden", "mozHidden", "webkitHidden", "msHidden"]);
    this.screen = $('<canvas width=256 height=192 class="screen"></canvas>');
    this.$canvasContext$ = this.screen[0].getContext("2d");
    if(this.$canvasContext$.getImageData) {
      this.$canvasImageData$ = this.$canvasContext$.getImageData(0, 0, 256, 192);
      this.$resetCanvas$();
      this.$romContainer$ = $("<div></div>");
      this.$romSelect$ = $("<select></select>");
      this.$romSelect$.change(function() {
        $self$$4$$.$loadROM$()
      });
      this.$buttons$ = {start:$('<input type="button" value="Stop" class="btn" disabled="disabled">'), $restart$:$('<input type="button" value="Restart" class="btn" disabled="disabled">'), $sound$:$('<input type="button" value="Enable sound" class="btn" disabled="disabled">'), zoom:$('<input type="button" value="Zoom in" class="btn">')};
      this.$buttons$.start.click(function() {
        $self$$4$$.$main$.$isRunning$ ? ($self$$4$$.$main$.stop(), $self$$4$$.updateStatus("Paused"), $self$$4$$.$buttons$.start.attr("value", "Start")) : ($self$$4$$.$main$.start(), $self$$4$$.$buttons$.start.attr("value", "Stop"))
      });
      this.$buttons$.$restart$.click(function() {
        "" !== $self$$4$$.$main$.$romData$ && "" !== $self$$4$$.$main$.$romFileName$ && $JSCompiler_StaticMethods_readRomDirectly$$($self$$4$$.$main$, $self$$4$$.$main$.$romData$, $self$$4$$.$main$.$romFileName$) ? ($self$$4$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$4$$.$main$.$vdp$), $self$$4$$.$main$.start()) : $(this).attr("disabled", "disabled")
      });
      this.$buttons$.$sound$.click($JSCompiler_emptyFn$$());
      this.$buttons$.zoom.click(function() {
        $self$$4$$.$zoomed$ ? ($self$$4$$.screen.animate({width:"256px", height:"192px"}, function() {
          $(this).removeAttr("style")
        }), $self$$4$$.$buttons$.zoom.attr("value", "Zoom in")) : ($self$$4$$.screen.animate({width:"512px", height:"384px"}), $self$$4$$.$buttons$.zoom.attr("value", "Zoom out"));
        $self$$4$$.$zoomed$ = !$self$$4$$.$zoomed$
      });
      $fullscreenSupport$$ && (this.$buttons$.$fullsreen$ = $('<input type="button" value="Go fullscreen" class="btn">').click(function() {
        var $screen$$1$$ = $self$$4$$.screen[0];
        $screen$$1$$.requestFullscreen ? $screen$$1$$.requestFullscreen() : $screen$$1$$.mozRequestFullScreen ? $screen$$1$$.mozRequestFullScreen() : $screen$$1$$.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      }));
      for($i$$23$$ in this.$buttons$) {
        this.$buttons$.hasOwnProperty($i$$23$$) && this.$buttons$[$i$$23$$].appendTo($controls$$)
      }
      this.log = $('<div id="status"></div>');
      this.screen.appendTo($root_sms$$5$$);
      this.$romContainer$.appendTo($root_sms$$5$$);
      $controls$$.appendTo($root_sms$$5$$);
      this.log.appendTo($root_sms$$5$$);
      $root_sms$$5$$.appendTo($($parent$$2$$));
      "undefined" != typeof $roms$$ && this.$setRoms$($roms$$);
      $(document).bind("keydown", function($evt$$16$$) {
        $self$$4$$.$main$.$keyboard$.keydown($evt$$16$$)
      }).bind("keyup", function($evt$$17$$) {
        $self$$4$$.$main$.$keyboard$.keyup($evt$$17$$)
      })
    }else {
      $($parent$$2$$).html('<div class="alert-message error"><p><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest versions of Firefox, Google Chrome, Opera or Safari!</p></div>')
    }
  }
  var $parent$$2$$ = this;
  $UI$$.prototype = {reset:function $$UI$$$$reset$() {
    this.screen[0].width = 256;
    this.screen[0].height = 192;
    this.log.text("")
  }, $resetCanvas$:function $$UI$$$$$resetCanvas$$() {
    this.$canvasContext$.fillStyle = "black";
    this.$canvasContext$.fillRect(0, 0, 256, 192);
    for(var $i$$24$$ = 3;$i$$24$$ <= this.$canvasImageData$.data.length - 3;$i$$24$$ += 4) {
      this.$canvasImageData$.data[$i$$24$$] = 255
    }
  }, $setRoms$:function $$UI$$$$$setRoms$$($roms$$1$$) {
    var $groupName$$, $optgroup$$, $length$$16$$, $i$$25$$, $count$$7$$ = 0;
    this.$romSelect$.children().remove();
    $("<option>Select a ROM...</option>").appendTo(this.$romSelect$);
    for($groupName$$ in $roms$$1$$) {
      if($roms$$1$$.hasOwnProperty($groupName$$)) {
        $optgroup$$ = $("<optgroup></optgroup>").attr("label", $groupName$$);
        $length$$16$$ = $roms$$1$$[$groupName$$].length;
        for($i$$25$$ = 0;$i$$25$$ < $length$$16$$;$i$$25$$++) {
          $("<option>" + $roms$$1$$[$groupName$$][$i$$25$$][0] + "</option>").attr("value", $roms$$1$$[$groupName$$][$i$$25$$][1]).appendTo($optgroup$$)
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
      var $xhr$$ = $.ajaxSettings.xhr();
      "undefined" !== typeof $xhr$$.overrideMimeType && $xhr$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$5$$.xhr = $xhr$$
    }, complete:function($xhr$$1$$) {
      $JSCompiler_StaticMethods_readRomDirectly$$($self$$5$$.$main$, $xhr$$1$$.responseText, $self$$5$$.$romSelect$.val());
      $self$$5$$.$main$.reset();
      $JSCompiler_StaticMethods_forceFullRedraw$$($self$$5$$.$main$.$vdp$);
      $self$$5$$.$main$.start();
      $self$$5$$.enable();
      $self$$5$$.$buttons$.start.removeAttr("disabled")
    }})
  }, enable:function $$UI$$$$enable$() {
    this.$buttons$.$restart$.removeAttr("disabled");
    this.$main$.$soundEnabled$ ? this.$buttons$.$sound$.attr("value", "Disable sound") : this.$buttons$.$sound$.attr("value", "Enable sound")
  }, updateStatus:function $$UI$$$$updateStatus$($s$$3$$) {
    this.log.text($s$$3$$)
  }, $writeAudio$:$JSCompiler_emptyFn$$(), $writeFrame$:function $$UI$$$$$writeFrame$$($buffer$$11$$) {
    if(!this.$hiddenPrefix$ || !document[this.$hiddenPrefix$]) {
      var $imageData$$ = this.$canvasImageData$.data, $pixel$$, $i$$27$$, $j$$2$$;
      for($i$$27$$ = 0;49152 >= $i$$27$$;$i$$27$$++) {
        $pixel$$ = $buffer$$11$$[$i$$27$$], $j$$2$$ = 4 * $i$$27$$, $imageData$$[$j$$2$$] = $pixel$$ & 255, $imageData$$[$j$$2$$ + 1] = $pixel$$ >> 8 & 255, $imageData$$[$j$$2$$ + 2] = $pixel$$ >> 16 & 255
      }
      this.$canvasContext$.putImageData(this.$canvasImageData$, 0, 0)
    }
  }};
  return $UI$$
});
function $JSSMS$Ports$$($sms$$6$$) {
  this.$main$ = $sms$$6$$;
  this.$vdp$ = $sms$$6$$.$vdp$;
  this.$psg$ = $sms$$6$$.$psg$;
  this.$keyboard$ = $sms$$6$$.$keyboard$;
  this.$europe$ = 64;
  this.$hCounter$ = 0;
  this.$ioPorts$ = []
}
$JSSMS$Ports$$.prototype = {reset:function $$JSSMS$Ports$$$$reset$() {
  this.$ioPorts$ = Array(2)
}};
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_in_$self$$, $port$$1$$) {
  if($JSCompiler_StaticMethods_in_$self$$.$main$.$is_gg$ && 7 > $port$$1$$) {
    switch($port$$1$$) {
      case 0:
        return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$ggstart$ & 191 | $JSCompiler_StaticMethods_in_$self$$.$europe$;
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
  switch($port$$1$$ & 193) {
    case 64:
      var $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$videoMode$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$line$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$line$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$line$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$line$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$line$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$;
    case 65:
      return $JSCompiler_StaticMethods_in_$self$$.$hCounter$;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$firstByte$ = $JSCompiler_alias_TRUE$$;
      var $statuscopy$$inline_574_value$$inline_571$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$readBuffer$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$readBuffer$ = $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$VRAM$[$JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.location++ & 
      16383] & 255;
      return $statuscopy$$inline_574_value$$inline_571$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$, $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$firstByte$ = $JSCompiler_alias_TRUE$$, $statuscopy$$inline_574_value$$inline_571$$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.status, $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.status = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_573_JSCompiler_StaticMethods_dataRead$self$$inline_570_JSCompiler_StaticMethods_getVCount$self$$inline_568_JSCompiler_inline_result$$2$$.$main$.$cpu$.$interruptLine$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_574_value$$inline_571$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller2$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$ioPorts$[0] | $JSCompiler_StaticMethods_in_$self$$.$ioPorts$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$, $address$$inline_578_old$$inline_584_port$$, $reg$$inline_583_value$$82$$) {
  if(!($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_578_old$$inline_584_port$$)) {
    switch($address$$inline_578_old$$inline_584_port$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$ioPorts$[0] = ($reg$$inline_583_value$$82$$ & 32) << 1;
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$ioPorts$[1] = $reg$$inline_583_value$$82$$ & 128;
        0 == $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$europe$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$ioPorts$[0] = ~$JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$ioPorts$[0], $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$ioPorts$[1] = 
        ~$JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$ioPorts$[1]);
        break;
      case 128:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$vdp$;
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$firstByte$ = $JSCompiler_alias_TRUE$$;
        switch($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$operation$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_578_old$$inline_584_port$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location & 16383;
            if($reg$$inline_583_value$$82$$ != ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$VRAM$[$address$$inline_578_old$$inline_584_port$$] & 255)) {
              if($address$$inline_578_old$$inline_584_port$$ >= $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$ && $address$$inline_578_old$$inline_584_port$$ < $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$ + 64) {
                $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$
              }else {
                if($address$$inline_578_old$$inline_584_port$$ >= $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$ + 128 && $address$$inline_578_old$$inline_584_port$$ < $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$ + 256) {
                  $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$
                }else {
                  var $tileIndex$$inline_579$$ = $address$$inline_578_old$$inline_584_port$$ >> 5;
                  $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$isTileDirty$[$tileIndex$$inline_579$$] = $JSCompiler_alias_TRUE$$;
                  $tileIndex$$inline_579$$ < $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$minDirty$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$minDirty$ = $tileIndex$$inline_579$$);
                  $tileIndex$$inline_579$$ > $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$maxDirty$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$maxDirty$ = $tileIndex$$inline_579$$)
                }
              }
              $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$VRAM$[$address$$inline_578_old$$inline_584_port$$] = $reg$$inline_583_value$$82$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$CRAM$[$JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location & 31] = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main_JAVA$[$reg$$inline_583_value$$82$$ & 
            63] : $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$CRAM$[($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location & 63) >> 1] = 0 == 
            ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location & 1) ? $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$GG_JAVA1$[$reg$$inline_583_value$$82$$] : $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$CRAM$[($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location & 
            63) >> 1] | $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$GG_JAVA2$[$reg$$inline_583_value$$82$$ & 15])
        }
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$readBuffer$ = $reg$$inline_583_value$$82$$;
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location++;
        break;
      case 129:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$firstByte$) {
          $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$firstByte$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ = $reg$$inline_583_value$$82$$, $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location = 
          $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location & 16128 | $reg$$inline_583_value$$82$$
        }else {
          if($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$firstByte$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$operation$ = $reg$$inline_583_value$$82$$ >> 6 & 3, $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location = 
          $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ | $reg$$inline_583_value$$82$$ << 8, 0 == $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$operation$) {
            $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$readBuffer$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$VRAM$[$JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.location++ & 16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$operation$) {
              $reg$$inline_583_value$$82$$ &= 15;
              switch($reg$$inline_583_value$$82$$) {
                case 0:
                  0 != ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.status & 4) && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$interruptLine$ = 0 != ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 
                  16));
                  break;
                case 1:
                  0 != ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.status & 128) && 0 != ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 32) && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$interruptLine$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 3) != ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$vdpreg$[$reg$$inline_583_value$$82$$] & 3) && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = 
                  $JSCompiler_alias_TRUE$$);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$bgt$ = ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_578_old$$inline_584_port$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$, $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$ = ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 
                  -130) << 7, $address$$inline_578_old$$inline_584_port$$ != $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$, console.log("New address written to SAT: " + $address$$inline_578_old$$inline_584_port$$ + 
                  " -> " + $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$sat$))
              }
              $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$vdpreg$[$reg$$inline_583_value$$82$$] = $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$commandByte$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$ && $JSCompiler_StaticMethods_controlWrite$self$$inline_581_JSCompiler_StaticMethods_dataWrite$self$$inline_576_JSCompiler_StaticMethods_out$self$$.$psg$.write($reg$$inline_583_value$$82$$)
    }
  }
}
;window.JSSMS = $JSSMS$$;
jQuery.fn.JSSMSUI = jQuery.fn.$JSSMSUI$;

