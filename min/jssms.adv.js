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
'use strict';var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1;
function $JSCompiler_emptyFn$$() {
  return function() {
  }
}
var $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
function $JSSMS$$($opts$$) {
  this.$opts$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if($opts$$ != $JSCompiler_alias_VOID$$) {
    for(var $key$$16$$ in this.$opts$) {
      $opts$$[$key$$16$$] != $JSCompiler_alias_VOID$$ && (this.$opts$[$key$$16$$] = $opts$$[$key$$16$$])
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
  var $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ = this.$vdp$.$videoMode$, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ = 3579545) : 1 == $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ && (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$vdp$.$videoMode$ = $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ = this.$psg$;
    $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$clock$ = ($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$clockFrac$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$regLatch$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$noiseFreq$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$noiseShiftReg$ = 32768;
    for($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ = 0;4 > $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$;$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$reg$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$reg$[($clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$freqCounter$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$] = 0, $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$freqPolarity$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$] = 
      1, 3 != $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ && ($JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$.$freqPos$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$] = $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $fractional$$inline_13$$ = 0, $clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ = 0;$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$ < this.$no_of_scanlines$;$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $fractional$$inline_13$$, $fractional$$inline_13$$ = $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ - ($JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ >> 16 << 16), this.$samplesPerLine$[$clockSpeedHz$$inline_10_i$$inline_11_i$$inline_98$$] = $JSCompiler_StaticMethods_init$self$$inline_96_mode$$inline_9_v$$inline_12$$ >> 
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
  this.$ui$.requestAnimationFrame(this.frame.bind(this), this.$ui$.screen);
  this.$lastFpsTime$ = $JSCompiler_alias_NULL$$;
  this.$fpsFrameCount$ = 0;
  $JSCompiler_StaticMethods_printFps$$(this);
  this.$fpsInterval$ = setInterval(function() {
    $JSCompiler_StaticMethods_printFps$$($self$$1$$)
  }, 500)
}, stop:function $$JSSMS$$$$stop$() {
  clearInterval(this.$fpsInterval$);
  this.$isRunning$ = $JSCompiler_alias_FALSE$$
}, frame:function $$JSSMS$$$$frame$() {
  if(this.$isRunning$) {
    var $JSCompiler_inline_result$$4$$;
    for(var $startTime$$inline_18$$ = 0, $lineno$$inline_19$$ = 0;$lineno$$inline_19$$ < this.$no_of_scanlines$;$lineno$$inline_19$$++) {
      var $startTime$$inline_18$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_run$self$$inline_100$$ = this.$cpu$, $cycles$$inline_101$$ = this.$cyclesPerLine$, $location$$inline_102$$ = 0, $opcode$$inline_103$$ = 0, $temp$$inline_104$$ = 0;
      $JSCompiler_StaticMethods_run$self$$inline_100$$.$tstates$ += $cycles$$inline_101$$;
      0 != $cycles$$inline_101$$ && ($JSCompiler_StaticMethods_run$self$$inline_100$$.$totalCycles$ = $cycles$$inline_101$$);
      if($JSCompiler_StaticMethods_run$self$$inline_100$$.$interruptLine$) {
        var $JSCompiler_StaticMethods_interrupt$self$$inline_134$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$;
        $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$iff1$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$halt$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$pc$++, $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$halt$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$iff1$ = $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$iff2$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$interruptLine$ = 
        $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$inline_134$$, $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$pc$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$im$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$pc$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$interruptVector$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$interruptVector$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$interruptVector$, 
        $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$tstates$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$im$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$pc$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$tstates$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$pc$ = $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$readMemWord$(($JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$i$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$interruptVector$), 
        $JSCompiler_StaticMethods_interrupt$self$$inline_134$$.$tstates$ -= 19))
      }
      for(;0 < $JSCompiler_StaticMethods_run$self$$inline_100$$.$tstates$;) {
        switch($opcode$$inline_103$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++), $JSCompiler_StaticMethods_run$self$$inline_100$$.$tstates$ -= $OP_STATES$$[$opcode$$inline_103$$], $opcode$$inline_103$$) {
          case 1:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 2:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 3:
            var $JSCompiler_StaticMethods_incBC$self$$inline_136$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$;
            $JSCompiler_StaticMethods_incBC$self$$inline_136$$.$c$ = $JSCompiler_StaticMethods_incBC$self$$inline_136$$.$c$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incBC$self$$inline_136$$.$c$ && ($JSCompiler_StaticMethods_incBC$self$$inline_136$$.$b$ = $JSCompiler_StaticMethods_incBC$self$$inline_136$$.$b$ + 1 & 255);
            break;
          case 4:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 5:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 6:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 7:
            var $JSCompiler_StaticMethods_rlca_a$self$$inline_138$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $carry$$inline_139$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_138$$.$a$ >> 7;
            $JSCompiler_StaticMethods_rlca_a$self$$inline_138$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_138$$.$a$ << 1 & 255 | $carry$$inline_139$$;
            $JSCompiler_StaticMethods_rlca_a$self$$inline_138$$.$f$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_138$$.$f$ & 236 | $carry$$inline_139$$;
            break;
          case 8:
            var $JSCompiler_StaticMethods_exAF$self$$inline_141$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $temp$$inline_142$$ = $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$a$;
            $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$a2$;
            $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$a2$ = $temp$$inline_142$$;
            $temp$$inline_142$$ = $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$f$;
            $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$f$ = $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$f2$;
            $JSCompiler_StaticMethods_exAF$self$$inline_141$$.$f2$ = $temp$$inline_142$$;
            break;
          case 9:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 10:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 11:
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 12:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 13:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 14:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 15:
            var $JSCompiler_StaticMethods_rrca_a$self$$inline_144$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $carry$$inline_145$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_144$$.$a$ & 1;
            $JSCompiler_StaticMethods_rrca_a$self$$inline_144$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_144$$.$a$ >> 1 | $carry$$inline_145$$ << 7;
            $JSCompiler_StaticMethods_rrca_a$self$$inline_144$$.$f$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_144$$.$f$ & 236 | $carry$$inline_145$$;
            break;
          case 16:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ - 1 & 255;
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 17:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 18:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 19:
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 20:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 21:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 22:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 23:
            var $JSCompiler_StaticMethods_rla_a$self$$inline_147$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $carry$$inline_148$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_147$$.$a$ >> 7;
            $JSCompiler_StaticMethods_rla_a$self$$inline_147$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_147$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_147$$.$f$ & 1) & 255;
            $JSCompiler_StaticMethods_rla_a$self$$inline_147$$.$f$ = $JSCompiler_StaticMethods_rla_a$self$$inline_147$$.$f$ & 236 | $carry$$inline_148$$;
            break;
          case 24:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ += $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_run$self$$inline_100$$) + 1;
            break;
          case 25:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 26:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 27:
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 28:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 29:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 30:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 31:
            var $JSCompiler_StaticMethods_rra_a$self$$inline_150$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $carry$$inline_151$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_150$$.$a$ & 1;
            $JSCompiler_StaticMethods_rra_a$self$$inline_150$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_150$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_150$$.$f$ & 1) << 7) & 255;
            $JSCompiler_StaticMethods_rra_a$self$$inline_150$$.$f$ = $JSCompiler_StaticMethods_rra_a$self$$inline_150$$.$f$ & 236 | $carry$$inline_151$$;
            break;
          case 32:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 33:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 34:
            $location$$inline_102$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($location$$inline_102$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$(++$location$$inline_102$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ += 2;
            break;
          case 35:
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 36:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 37:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 38:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 39:
            var $JSCompiler_StaticMethods_daa$self$$inline_153$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $temp$$inline_154$$ = $JSCompiler_StaticMethods_daa$self$$inline_153$$.$DAA_TABLE$[$JSCompiler_StaticMethods_daa$self$$inline_153$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_153$$.$f$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_153$$.$f$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_153$$.$f$ & 16) << 6];
            $JSCompiler_StaticMethods_daa$self$$inline_153$$.$a$ = $temp$$inline_154$$ & 255;
            $JSCompiler_StaticMethods_daa$self$$inline_153$$.$f$ = $JSCompiler_StaticMethods_daa$self$$inline_153$$.$f$ & 2 | $temp$$inline_154$$ >> 8;
            break;
          case 40:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 41:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 42:
            $location$$inline_102$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($location$$inline_102$$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($location$$inline_102$$ + 1);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ += 2;
            break;
          case 43:
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 44:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 45:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 46:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 47:
            var $JSCompiler_StaticMethods_cpl_a$self$$inline_156$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$;
            $JSCompiler_StaticMethods_cpl_a$self$$inline_156$$.$a$ ^= 255;
            $JSCompiler_StaticMethods_cpl_a$self$$inline_156$$.$f$ |= 18;
            break;
          case 48:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 49:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ += 2;
            break;
          case 50:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ += 2;
            break;
          case 51:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$++;
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 54:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 55:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ |= 1;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ &= -3;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ &= -17;
            break;
          case 56:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 57:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$));
            break;
          case 58:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$));
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ += 2;
            break;
          case 59:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$--;
            break;
          case 60:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 61:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 62:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            break;
          case 63:
            var $JSCompiler_StaticMethods_ccf$self$$inline_158$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$;
            0 != ($JSCompiler_StaticMethods_ccf$self$$inline_158$$.$f$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_158$$.$f$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_158$$.$f$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_158$$.$f$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_158$$.$f$ &= -17);
            $JSCompiler_StaticMethods_ccf$self$$inline_158$$.$f$ &= -3;
            break;
          case 65:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$;
            break;
          case 66:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            break;
          case 67:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            break;
          case 68:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            break;
          case 69:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            break;
          case 70:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 71:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$;
            break;
          case 72:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$;
            break;
          case 74:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            break;
          case 75:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            break;
          case 76:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            break;
          case 77:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            break;
          case 78:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 79:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$;
            break;
          case 80:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$;
            break;
          case 81:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$;
            break;
          case 83:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            break;
          case 84:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            break;
          case 85:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            break;
          case 86:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 87:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$;
            break;
          case 88:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$;
            break;
          case 89:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$;
            break;
          case 90:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            break;
          case 92:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            break;
          case 93:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            break;
          case 94:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 95:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$;
            break;
          case 96:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$;
            break;
          case 97:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$;
            break;
          case 98:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            break;
          case 99:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            break;
          case 101:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            break;
          case 102:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 103:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$;
            break;
          case 104:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$;
            break;
          case 105:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$;
            break;
          case 106:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            break;
          case 107:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            break;
          case 108:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            break;
          case 110:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 111:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$;
            break;
          case 112:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 113:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 114:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 115:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 116:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 117:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 118:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$tstates$ = 0;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$halt$ = $JSCompiler_alias_TRUE$$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$--;
            break;
          case 119:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 120:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$;
            break;
          case 121:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$;
            break;
          case 122:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            break;
          case 123:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            break;
          case 124:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            break;
          case 125:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            break;
          case 126:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$));
            break;
          case 128:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 129:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 130:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 131:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 135:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 136:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 137:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 138:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 139:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 143:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 144:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 145:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 146:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 147:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 151:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 152:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 153:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 154:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 155:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 159:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 160:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$] | 16;
            break;
          case 161:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$] | 16;
            break;
          case 162:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$] | 16;
            break;
          case 163:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$] | 16;
            break;
          case 164:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$))] | 16;
            break;
          case 167:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$] | 16;
            break;
          case 168:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$];
            break;
          case 169:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$];
            break;
          case 170:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$];
            break;
          case 171:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$];
            break;
          case 172:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$];
            break;
          case 173:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$];
            break;
          case 174:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$))];
            break;
          case 175:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = 0];
            break;
          case 176:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$];
            break;
          case 177:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$];
            break;
          case 178:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$];
            break;
          case 179:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$];
            break;
          case 180:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$];
            break;
          case 181:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$];
            break;
          case 182:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$))];
            break;
          case 183:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$];
            break;
          case 184:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$);
            break;
          case 185:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 186:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$);
            break;
          case 187:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$)));
            break;
          case 191:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 192:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 193:
            var $JSCompiler_StaticMethods_setBC$self$$inline_160$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $value$$inline_161$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$);
            $JSCompiler_StaticMethods_setBC$self$$inline_160$$.$b$ = $value$$inline_161$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_160$$.$c$ = $value$$inline_161$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ += 2;
            break;
          case 194:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 195:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            break;
          case 196:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 197:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$b$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$c$);
            break;
          case 198:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 199:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 0;
            break;
          case 200:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 201:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ += 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 203:
            var $JSCompiler_StaticMethods_doCB$self$$inline_163$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $opcode$$inline_164$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++);
            $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$tstates$ -= $OP_CB_STATES$$[$opcode$$inline_164$$];
            switch($opcode$$inline_164$$) {
              case 0:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 1:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 2:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 3:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 4:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 5:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 6:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 7:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 8:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 9:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 10:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 11:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 12:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 13:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 14:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 15:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 16:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 17:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 18:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 19:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 20:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 21:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 22:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 23:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 24:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 25:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 26:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 27:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 28:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 29:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 30:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 31:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 32:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 33:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 34:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 35:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 36:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 39:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 40:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 41:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 42:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 43:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 44:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 47:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 48:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 49:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 50:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 51:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 52:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 53:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 54:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 55:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 56:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$);
                break;
              case 57:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$);
                break;
              case 58:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$);
                break;
              case 59:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$);
                break;
              case 60:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$);
                break;
              case 61:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$);
                break;
              case 62:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$))));
                break;
              case 63:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$);
                break;
              case 64:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 1);
                break;
              case 65:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 1);
                break;
              case 66:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 1);
                break;
              case 67:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 1);
                break;
              case 68:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 1);
                break;
              case 69:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 1);
                break;
              case 70:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 1);
                break;
              case 71:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 1);
                break;
              case 72:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 2);
                break;
              case 73:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 2);
                break;
              case 74:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 2);
                break;
              case 75:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 2);
                break;
              case 76:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 2);
                break;
              case 77:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 2);
                break;
              case 78:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 2);
                break;
              case 79:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 2);
                break;
              case 80:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 4);
                break;
              case 81:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 4);
                break;
              case 82:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 4);
                break;
              case 83:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 4);
                break;
              case 84:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 4);
                break;
              case 85:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 4);
                break;
              case 86:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 4);
                break;
              case 87:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 4);
                break;
              case 88:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 8);
                break;
              case 89:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 8);
                break;
              case 90:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 8);
                break;
              case 91:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 8);
                break;
              case 92:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 8);
                break;
              case 93:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 8);
                break;
              case 94:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 8);
                break;
              case 95:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 8);
                break;
              case 96:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 16);
                break;
              case 97:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 16);
                break;
              case 98:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 16);
                break;
              case 99:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 16);
                break;
              case 100:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 16);
                break;
              case 101:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 16);
                break;
              case 102:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 16);
                break;
              case 103:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 16);
                break;
              case 104:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 32);
                break;
              case 105:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 32);
                break;
              case 106:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 32);
                break;
              case 107:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 32);
                break;
              case 108:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 32);
                break;
              case 109:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 32);
                break;
              case 110:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 32);
                break;
              case 111:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 32);
                break;
              case 112:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 64);
                break;
              case 113:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 64);
                break;
              case 114:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 64);
                break;
              case 115:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 64);
                break;
              case 116:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 64);
                break;
              case 117:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 64);
                break;
              case 118:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 64);
                break;
              case 119:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 64);
                break;
              case 120:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ & 128);
                break;
              case 121:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ & 128);
                break;
              case 122:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ & 128);
                break;
              case 123:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ & 128);
                break;
              case 124:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ & 128);
                break;
              case 125:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ & 128);
                break;
              case 126:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & 128);
                break;
              case 127:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$, $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ & 128);
                break;
              case 128:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -2;
                break;
              case 129:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -2;
                break;
              case 130:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -2;
                break;
              case 131:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -2;
                break;
              case 132:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -2;
                break;
              case 133:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -2;
                break;
              case 134:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -2);
                break;
              case 135:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -2;
                break;
              case 136:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -3;
                break;
              case 137:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -3;
                break;
              case 138:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -3;
                break;
              case 139:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -3;
                break;
              case 140:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -3;
                break;
              case 141:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -3;
                break;
              case 142:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -3);
                break;
              case 143:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -3;
                break;
              case 144:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -5;
                break;
              case 145:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -5;
                break;
              case 146:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -5;
                break;
              case 147:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -5;
                break;
              case 148:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -5;
                break;
              case 149:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -5;
                break;
              case 150:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -5);
                break;
              case 151:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -5;
                break;
              case 152:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -9;
                break;
              case 153:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -9;
                break;
              case 154:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -9;
                break;
              case 155:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -9;
                break;
              case 156:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -9;
                break;
              case 157:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -9;
                break;
              case 158:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -9);
                break;
              case 159:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -9;
                break;
              case 160:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -17;
                break;
              case 161:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -17;
                break;
              case 162:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -17;
                break;
              case 163:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -17;
                break;
              case 164:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -17;
                break;
              case 165:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -17;
                break;
              case 166:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -17);
                break;
              case 167:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -17;
                break;
              case 168:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -33;
                break;
              case 169:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -33;
                break;
              case 170:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -33;
                break;
              case 171:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -33;
                break;
              case 172:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -33;
                break;
              case 173:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -33;
                break;
              case 174:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -33);
                break;
              case 175:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -33;
                break;
              case 176:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -65;
                break;
              case 177:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -65;
                break;
              case 178:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -65;
                break;
              case 179:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -65;
                break;
              case 180:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -65;
                break;
              case 181:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -65;
                break;
              case 182:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -65);
                break;
              case 183:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -65;
                break;
              case 184:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ &= -129;
                break;
              case 185:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ &= -129;
                break;
              case 186:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ &= -129;
                break;
              case 187:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ &= -129;
                break;
              case 188:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ &= -129;
                break;
              case 189:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ &= -129;
                break;
              case 190:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) & -129);
                break;
              case 191:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ &= -129;
                break;
              case 192:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 1;
                break;
              case 193:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 1;
                break;
              case 194:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 1;
                break;
              case 195:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 1;
                break;
              case 196:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 1;
                break;
              case 197:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 1;
                break;
              case 198:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 1);
                break;
              case 199:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 1;
                break;
              case 200:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 2;
                break;
              case 201:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 2;
                break;
              case 202:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 2;
                break;
              case 203:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 2;
                break;
              case 204:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 2;
                break;
              case 205:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 2;
                break;
              case 206:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 2);
                break;
              case 207:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 2;
                break;
              case 208:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 4;
                break;
              case 209:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 4;
                break;
              case 210:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 4;
                break;
              case 211:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 4;
                break;
              case 212:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 4;
                break;
              case 213:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 4;
                break;
              case 214:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 4);
                break;
              case 215:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 4;
                break;
              case 216:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 8;
                break;
              case 217:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 8;
                break;
              case 218:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 8;
                break;
              case 219:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 8;
                break;
              case 220:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 8;
                break;
              case 221:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 8;
                break;
              case 222:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 8);
                break;
              case 223:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 8;
                break;
              case 224:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 16;
                break;
              case 225:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 16;
                break;
              case 226:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 16;
                break;
              case 227:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 16;
                break;
              case 228:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 16;
                break;
              case 229:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 16;
                break;
              case 230:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 16);
                break;
              case 231:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 16;
                break;
              case 232:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 32;
                break;
              case 233:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 32;
                break;
              case 234:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 32;
                break;
              case 235:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 32;
                break;
              case 236:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 32;
                break;
              case 237:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 32;
                break;
              case 238:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 32);
                break;
              case 239:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 32;
                break;
              case 240:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 64;
                break;
              case 241:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 64;
                break;
              case 242:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 64;
                break;
              case 243:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 64;
                break;
              case 244:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 64;
                break;
              case 245:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 64;
                break;
              case 246:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 64);
                break;
              case 247:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 64;
                break;
              case 248:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$b$ |= 128;
                break;
              case 249:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$c$ |= 128;
                break;
              case 250:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$d$ |= 128;
                break;
              case 251:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$e$ |= 128;
                break;
              case 252:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$h$ |= 128;
                break;
              case 253:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$l$ |= 128;
                break;
              case 254:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$), $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_163$$)) | 128);
                break;
              case 255:
                $JSCompiler_StaticMethods_doCB$self$$inline_163$$.$a$ |= 128;
                break;
              default:
                console.log("Unimplemented CB Opcode: " + $opcode$$inline_164$$.toString(16))
            }
            break;
          case 204:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 64));
            break;
          case 205:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ + 2);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            break;
          case 206:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 207:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 8;
            break;
          case 208:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 209:
            var $JSCompiler_StaticMethods_setDE$self$$inline_166$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $value$$inline_167$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$);
            $JSCompiler_StaticMethods_setDE$self$$inline_166$$.$d$ = $value$$inline_167$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_166$$.$e$ = $value$$inline_167$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ += 2;
            break;
          case 210:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 211:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_run$self$$inline_100$$.port, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++), $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$);
            break;
          case 212:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 213:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$);
            break;
          case 214:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 215:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 16;
            break;
          case 216:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 217:
            var $JSCompiler_StaticMethods_exBC$self$$inline_169$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $temp$$inline_170$$ = $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$b$;
            $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$b$ = $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$b2$;
            $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$b2$ = $temp$$inline_170$$;
            $temp$$inline_170$$ = $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$c$;
            $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$c$ = $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$c2$;
            $JSCompiler_StaticMethods_exBC$self$$inline_169$$.$c2$ = $temp$$inline_170$$;
            var $JSCompiler_StaticMethods_exDE$self$$inline_172$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $temp$$inline_173$$ = $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$d$;
            $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$d$ = $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$d2$;
            $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$d2$ = $temp$$inline_173$$;
            $temp$$inline_173$$ = $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$e$;
            $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$e$ = $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$e2$;
            $JSCompiler_StaticMethods_exDE$self$$inline_172$$.$e2$ = $temp$$inline_173$$;
            var $JSCompiler_StaticMethods_exHL$self$$inline_175$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $temp$$inline_176$$ = $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$h$;
            $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$h$ = $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$h2$;
            $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$h2$ = $temp$$inline_176$$;
            $temp$$inline_176$$ = $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$l$;
            $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$l$ = $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$l2$;
            $JSCompiler_StaticMethods_exHL$self$$inline_175$$.$l2$ = $temp$$inline_176$$;
            break;
          case 218:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 219:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_run$self$$inline_100$$.port, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 220:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 1));
            break;
          case 221:
            var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $opcode$$inline_179$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++), $location$$inline_180$$ = 0, $temp$$inline_181$$ = 0;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$tstates$ -= $OP_DD_STATES$$[$opcode$$inline_179$$];
            switch($opcode$$inline_179$$) {
              case 9:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$ += 2;
                break;
              case 34:
                $location$$inline_180$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($location$$inline_180$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($location$$inline_180$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                break;
              case 42:
                $location$$inline_180$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($location$$inline_180$$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$(++$location$$inline_180$$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$));
                break;
              case 68:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$;
                break;
              case 69:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$;
                break;
              case 70:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$;
                break;
              case 77:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$;
                break;
              case 78:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$;
                break;
              case 85:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$;
                break;
              case 86:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$;
                break;
              case 93:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$;
                break;
              case 94:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$b$;
                break;
              case 97:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$c$;
                break;
              case 98:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$d$;
                break;
              case 99:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$e$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$;
                break;
              case 102:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$;
                break;
              case 104:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$b$;
                break;
              case 105:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$c$;
                break;
              case 106:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$d$;
                break;
              case 107:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$e$;
                break;
              case 108:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$;
                break;
              case 112:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$b$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$c$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$e$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$h$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$l$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$;
                break;
              case 125:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$;
                break;
              case 126:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$))] | 16;
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$];
                break;
              case 173:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$];
                break;
              case 174:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$))];
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$];
                break;
              case 181:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$];
                break;
              case 182:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$))];
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMem$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$ += 2;
                break;
              case 227:
                $temp$$inline_181$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$);
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$, $temp$$inline_181$$ & 255);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$writeMem$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$ + 1, $temp$$inline_181$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixH$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$ixL$);
                break;
              case 233:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$sp$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$);
                break;
              default:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_178$$.$pc$--
            }
            break;
          case 222:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 223:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 24;
            break;
          case 224:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 4));
            break;
          case 225:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMemWord$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$));
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ += 2;
            break;
          case 226:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 4));
            break;
          case 227:
            $temp$$inline_104$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ + 1);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ + 1, $temp$$inline_104$$);
            $temp$$inline_104$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$writeMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$, $temp$$inline_104$$);
            break;
          case 228:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 4));
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$);
            break;
          case 230:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ &= $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++)] | 16;
            break;
          case 231:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 32;
            break;
          case 232:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 4));
            break;
          case 233:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 234:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 4));
            break;
          case 235:
            $temp$$inline_104$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$h$ = $temp$$inline_104$$;
            $temp$$inline_104$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$e$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$l$ = $temp$$inline_104$$;
            break;
          case 236:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 4));
            break;
          case 237:
            var $JSCompiler_StaticMethods_doED$self$$inline_183$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $opcode$$inline_184$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$), $temp$$inline_185$$ = 0, $location$$inline_186$$ = 0, $hlmem$$inline_187$$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= $OP_ED_STATES$$[$opcode$$inline_184$$];
            switch($opcode$$inline_184$$) {
              case 64:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 65:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 66:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 67:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$++, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
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
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ = 0;
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
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
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$ += 2;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$iff1$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$iff2$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$im$ = 0;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 71:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$i$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 72:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 73:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 74:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 75:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$++);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 79:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$r$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 80:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$d$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$d$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 81:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$d$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 82:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 83:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$++, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$e$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$d$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 86:
              ;
              case 118:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$im$ = 1;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 87:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$i$;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZ_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$iff2$ ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 88:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$e$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$e$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 89:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$e$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 90:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 91:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$e$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$++);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$d$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 95:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ = Math.round(255 * Math.random());
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZ_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$iff2$ ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$h$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 97:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$h$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 98:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 99:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$++, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$h$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 103:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $hlmem$$inline_187$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$, $hlmem$$inline_187$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ & 15) << 4);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ & 240 | $hlmem$$inline_187$$ & 15;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 104:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 105:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 106:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 107:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$++);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$h$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 111:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $hlmem$$inline_187$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($location$$inline_186$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$, ($hlmem$$inline_187$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ & 15);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ & 240 | $hlmem$$inline_187$$ >> 4;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, 0);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 115:
                $location$$inline_186$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$++, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$ & 255);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($location$$inline_186$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$ >> 8);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 120:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_183$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$];
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 121:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$a$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 122:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 123:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$sp$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMemWord$($JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ + 1));
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$ += 3;
                break;
              case 160:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 161:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $temp$$inline_185$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? 0 : 4;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 248 | $temp$$inline_185$$;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 162:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 128 == ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 163:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $temp$$inline_185$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                255 < $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$ + $temp$$inline_185$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 128 == ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 168:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 169:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $temp$$inline_185$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? 0 : 4;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 248 | $temp$$inline_185$$;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 170:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 0 != ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 171:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $temp$$inline_185$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                255 < $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$ + $temp$$inline_185$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 128 == ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                break;
              case 176:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -3;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -17;
                break;
              case 177:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $temp$$inline_185$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? 0 : 4;
                0 != ($temp$$inline_185$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 248 | $temp$$inline_185$$;
                break;
              case 178:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 128 == ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                break;
              case 179:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                255 < $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$ + $temp$$inline_185$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 0 != ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                break;
              case 184:
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -3;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -17;
                break;
              case 185:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                $temp$$inline_185$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_183$$) ? 0 : 4;
                0 != ($temp$$inline_185$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & 248 | $temp$$inline_185$$;
                break;
              case 186:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$writeMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$), $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 0 != ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                break;
              case 187:
                $temp$$inline_185$$ = $JSCompiler_StaticMethods_doED$self$$inline_183$$.$readMem$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_183$$.port, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$c$, $temp$$inline_185$$);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_183$$, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_183$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_183$$.$b$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$tstates$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$--) : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++;
                255 < $JSCompiler_StaticMethods_doED$self$$inline_183$$.$l$ + $temp$$inline_185$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ = 0 != ($temp$$inline_185$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_183$$.$f$ & -3;
                break;
              default:
                console.log("Unimplemented ED Opcode: " + $opcode$$inline_184$$.toString(16)), $JSCompiler_StaticMethods_doED$self$$inline_183$$.$pc$++
            }
            break;
          case 238:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ ^= $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++)];
            break;
          case 239:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 40;
            break;
          case 240:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 128));
            break;
          case 241:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$++);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$++);
            break;
          case 242:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 128));
            break;
          case 243:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$iff1$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$iff2$ = $JSCompiler_alias_FALSE$$;
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$EI_inst$ = $JSCompiler_alias_TRUE$$;
            break;
          case 244:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 128));
            break;
          case 245:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$a$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$);
            break;
          case 246:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$SZP_TABLE$[$JSCompiler_StaticMethods_run$self$$inline_100$$.$a$ |= $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++)];
            break;
          case 247:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$);
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 48;
            break;
          case 248:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 128));
            break;
          case 249:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$sp$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_100$$);
            break;
          case 250:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_100$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 128));
            break;
          case 251:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.$iff1$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$iff2$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$EI_inst$ = $JSCompiler_alias_TRUE$$;
            break;
          case 252:
            $JSCompiler_StaticMethods_run$self$$inline_100$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_100$$.$f$ & 128));
            break;
          case 253:
            var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$, $opcode$$inline_190$$ = $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++), $location$$inline_191$$ = $JSCompiler_alias_VOID$$, $temp$$inline_192$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$tstates$ -= $OP_DD_STATES$$[$opcode$$inline_190$$];
            switch($opcode$$inline_190$$) {
              case 9:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$ += 2;
                break;
              case 34:
                $location$$inline_191$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($location$$inline_191$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($location$$inline_191$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                break;
              case 42:
                $location$$inline_191$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($location$$inline_191$$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$(++$location$$inline_191$$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$));
                break;
              case 68:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$;
                break;
              case 69:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$;
                break;
              case 70:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$;
                break;
              case 77:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$;
                break;
              case 78:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$;
                break;
              case 85:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$;
                break;
              case 86:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$d$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$;
                break;
              case 93:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$;
                break;
              case 94:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$e$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$b$;
                break;
              case 97:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$c$;
                break;
              case 98:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$d$;
                break;
              case 99:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$e$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$;
                break;
              case 102:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$;
                break;
              case 104:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$b$;
                break;
              case 105:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$c$;
                break;
              case 106:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$d$;
                break;
              case 107:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$e$;
                break;
              case 108:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$l$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$;
                break;
              case 112:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$b$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$c$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$e$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$h$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$l$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$;
                break;
              case 125:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$;
                break;
              case 126:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$))] | 16;
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$];
                break;
              case 173:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$];
                break;
              case 174:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$))];
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$];
                break;
              case 181:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$];
                break;
              case 182:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$SZP_TABLE$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$))];
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMem$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$ += 2;
                break;
              case 227:
                $temp$$inline_192$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$);
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$readMemWord$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$, $temp$$inline_192$$ & 255);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$writeMem$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$ + 1, $temp$$inline_192$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyH$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$iyL$);
                break;
              case 233:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$sp$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$);
                break;
              default:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_189$$.$pc$--
            }
            break;
          case 254:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$readMem$($JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$++));
            break;
          case 255:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_100$$, $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$), $JSCompiler_StaticMethods_run$self$$inline_100$$.$pc$ = 56
        }
      }
      this.$z80TimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_18$$;
      if(this.$soundEnabled$) {
        var $line$$inline_107$$ = $lineno$$inline_19$$;
        0 == $line$$inline_107$$ && (this.$audioBufferOffset$ = 0);
        var $samplesToGenerate$$inline_108$$ = this.$samplesPerLine$[$line$$inline_107$$];
        this.$audioBuffer$ = this.$psg$.update(this.$audioBufferOffset$, $samplesToGenerate$$inline_108$$);
        this.$audioBufferOffset$ += $samplesToGenerate$$inline_108$$
      }
      this.$vdp$.$line$ = $lineno$$inline_19$$;
      if(0 == this.$frameskip_counter$ && 192 > $lineno$$inline_19$$) {
        var $startTime$$inline_18$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_drawLine$self$$inline_110$$ = this.$vdp$, $lineno$$inline_111$$ = $lineno$$inline_19$$, $i$$inline_112$$ = 0, $temp$$inline_113$$ = 0, $temp2$$inline_114$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$main$.$is_gg$ || !(24 > $lineno$$inline_111$$ || 168 <= $lineno$$inline_111$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$vdpreg$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$maxDirty$) {
              var $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$;
              console.log("[" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$line$ + "] min dirty:" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$minDirty$ + " max: " + $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$maxDirty$);
              for(var $i$$inline_195$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$minDirty$;$i$$inline_195$$ <= $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$maxDirty$;$i$$inline_195$$++) {
                if($JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$isTileDirty$[$i$$inline_195$$]) {
                  $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$isTileDirty$[$i$$inline_195$$] = $JSCompiler_alias_FALSE$$;
                  console.log("tile " + $i$$inline_195$$ + " is dirty");
                  for(var $tile$$inline_196$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$tiles$[$i$$inline_195$$], $pixel_index$$inline_197$$ = 0, $address$$inline_198$$ = $i$$inline_195$$ << 5, $y$$inline_199$$ = 0;8 > $y$$inline_199$$;$y$$inline_199$$++) {
                    for(var $address0$$inline_200$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$VRAM$[$address$$inline_198$$++], $address1$$inline_201$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$VRAM$[$address$$inline_198$$++], $address2$$inline_202$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$VRAM$[$address$$inline_198$$++], $address3$$inline_203$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$VRAM$[$address$$inline_198$$++], $bit$$inline_204$$ = 
                    128;0 != $bit$$inline_204$$;$bit$$inline_204$$ >>= 1) {
                      var $colour$$inline_205$$ = 0;
                      0 != ($address0$$inline_200$$ & $bit$$inline_204$$) && ($colour$$inline_205$$ |= 1);
                      0 != ($address1$$inline_201$$ & $bit$$inline_204$$) && ($colour$$inline_205$$ |= 2);
                      0 != ($address2$$inline_202$$ & $bit$$inline_204$$) && ($colour$$inline_205$$ |= 4);
                      0 != ($address3$$inline_203$$ & $bit$$inline_204$$) && ($colour$$inline_205$$ |= 8);
                      $tile$$inline_196$$[$pixel_index$$inline_197$$++] = $colour$$inline_205$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$minDirty$ = 512;
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_194$$.$maxDirty$ = -1
            }
            var $JSCompiler_StaticMethods_drawBg$self$$inline_207$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$, $lineno$$inline_208$$ = $lineno$$inline_111$$, $pixX$$inline_209$$ = 0, $colour$$inline_210$$ = 0, $temp$$inline_211$$ = 0, $temp2$$inline_212$$ = 0, $hscroll$$inline_213$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$vdpreg$[8], $vscroll$$inline_214$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$vdpreg$[9];
            16 > $lineno$$inline_208$$ && 0 != ($JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$vdpreg$[0] & 64) && ($hscroll$$inline_213$$ = 0);
            var $lock$$inline_215$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$vdpreg$[0] & 128, $tile_column$$inline_216$$ = 32 - ($hscroll$$inline_213$$ >> 3) + $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$h_start$, $tile_row$$inline_217$$ = $lineno$$inline_208$$ + $vscroll$$inline_214$$ >> 3;
            27 < $tile_row$$inline_217$$ && ($tile_row$$inline_217$$ -= 28);
            for(var $tile_y$$inline_218$$ = ($lineno$$inline_208$$ + ($vscroll$$inline_214$$ & 7) & 7) << 3, $row_precal$$inline_219$$ = $lineno$$inline_208$$ << 8, $tx$$inline_220$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$h_start$;$tx$$inline_220$$ < $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$h_end$;$tx$$inline_220$$++) {
              var $tile_props$$inline_221$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$bgt$ + (($tile_column$$inline_216$$ & 31) << 1) + ($tile_row$$inline_217$$ << 6), $secondbyte$$inline_222$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$VRAM$[$tile_props$$inline_221$$ + 1], $pal$$inline_223$$ = ($secondbyte$$inline_222$$ & 8) << 1, $sx$$inline_224$$ = ($tx$$inline_220$$ << 3) + ($hscroll$$inline_213$$ & 7), $pixY$$inline_225$$ = 0 == ($secondbyte$$inline_222$$ & 4) ? $tile_y$$inline_218$$ : 
              56 - $tile_y$$inline_218$$, $tile$$inline_226$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$tiles$[($JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$VRAM$[$tile_props$$inline_221$$] & 255) + (($secondbyte$$inline_222$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_222$$ & 2)) {
                for($pixX$$inline_209$$ = 0;8 > $pixX$$inline_209$$ && 256 > $sx$$inline_224$$;$pixX$$inline_209$$++, $sx$$inline_224$$++) {
                  $colour$$inline_210$$ = $tile$$inline_226$$[$pixX$$inline_209$$ + $pixY$$inline_225$$], $temp$$inline_211$$ = 4 * ($sx$$inline_224$$ + $row_precal$$inline_219$$), $temp2$$inline_212$$ = 3 * ($colour$$inline_210$$ + $pal$$inline_223$$), $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$bgPriority$[$sx$$inline_224$$] = 0 != ($secondbyte$$inline_222$$ & 16) && 0 != $colour$$inline_210$$, $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.display[$temp$$inline_211$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$CRAM$[$temp2$$inline_212$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.display[$temp$$inline_211$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$CRAM$[$temp2$$inline_212$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.display[$temp$$inline_211$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$CRAM$[$temp2$$inline_212$$ + 2]
                }
              }else {
                for($pixX$$inline_209$$ = 7;0 <= $pixX$$inline_209$$ && 256 > $sx$$inline_224$$;$pixX$$inline_209$$--, $sx$$inline_224$$++) {
                  $colour$$inline_210$$ = $tile$$inline_226$$[$pixX$$inline_209$$ + $pixY$$inline_225$$], $temp$$inline_211$$ = 4 * ($sx$$inline_224$$ + $row_precal$$inline_219$$), $temp2$$inline_212$$ = 3 * ($colour$$inline_210$$ + $pal$$inline_223$$), $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$bgPriority$[$sx$$inline_224$$] = 0 != ($secondbyte$$inline_222$$ & 16) && 0 != $colour$$inline_210$$, $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.display[$temp$$inline_211$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$CRAM$[$temp2$$inline_212$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.display[$temp$$inline_211$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$CRAM$[$temp2$$inline_212$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.display[$temp$$inline_211$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_207$$.$CRAM$[$temp2$$inline_212$$ + 2]
                }
              }
              $tile_column$$inline_216$$++;
              0 != $lock$$inline_215$$ && 23 == $tx$$inline_220$$ && ($tile_row$$inline_217$$ = $lineno$$inline_208$$ >> 3, $tile_y$$inline_218$$ = ($lineno$$inline_208$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$isSatDirty$) {
              var $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$;
              $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$isSatDirty$ = $JSCompiler_alias_FALSE$$;
              for(var $i$$inline_229$$ = 0;$i$$inline_229$$ < $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$lineSprites$.length;$i$$inline_229$$++) {
                $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$lineSprites$[$i$$inline_229$$][0] = 0
              }
              var $height$$inline_230$$ = 0 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$vdpreg$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$vdpreg$[1] & 1) && ($height$$inline_230$$ <<= 1);
              for(var $spriteno$$inline_231$$ = 0;64 > $spriteno$$inline_231$$;$spriteno$$inline_231$$++) {
                var $y$$inline_232$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$VRAM$[$JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$sat$ + $spriteno$$inline_231$$] & 255;
                if(208 == $y$$inline_232$$) {
                  break
                }
                $y$$inline_232$$++;
                240 < $y$$inline_232$$ && ($y$$inline_232$$ -= 256);
                for(var $lineno$$inline_233$$ = 0;192 > $lineno$$inline_233$$;$lineno$$inline_233$$++) {
                  if($lineno$$inline_233$$ >= $y$$inline_232$$ && $lineno$$inline_233$$ - $y$$inline_232$$ < $height$$inline_230$$) {
                    var $sprites$$inline_234$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$lineSprites$[$lineno$$inline_233$$];
                    if(8 > $sprites$$inline_234$$[0]) {
                      var $off$$inline_235$$ = 3 * $sprites$$inline_234$$[0] + 1, $address$$inline_236$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$sat$ + ($spriteno$$inline_231$$ << 1) + 128;
                      $sprites$$inline_234$$[$off$$inline_235$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$VRAM$[$address$$inline_236$$++] & 255;
                      $sprites$$inline_234$$[$off$$inline_235$$++] = $y$$inline_232$$;
                      $sprites$$inline_234$$[$off$$inline_235$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_228$$.$VRAM$[$address$$inline_236$$] & 255;
                      $sprites$$inline_234$$[0]++
                    }
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$lineSprites$[$lineno$$inline_111$$][0]) {
              for(var $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$, $lineno$$inline_239$$ = $lineno$$inline_111$$, $colour$$inline_240$$ = 0, $temp$$inline_241$$ = 0, $temp2$$inline_242$$ = 0, $sprites$$inline_243$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$lineSprites$[$lineno$$inline_239$$], $count$$inline_244$$ = Math.min(8, $sprites$$inline_243$$[0]), $zoomed$$inline_245$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$vdpreg$[1] & 
              1, $row_precal$$inline_246$$ = $lineno$$inline_239$$ << 8, $off$$inline_247$$ = 3 * $count$$inline_244$$, $i$$inline_248$$ = $count$$inline_244$$;$i$$inline_248$$--;) {
                var $n$$inline_249$$ = $sprites$$inline_243$$[$off$$inline_247$$--] | ($JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$vdpreg$[6] & 4) << 6, $y$$inline_250$$ = $sprites$$inline_243$$[$off$$inline_247$$--], $x$$inline_251$$ = $sprites$$inline_243$$[$off$$inline_247$$--] - ($JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$vdpreg$[0] & 8), $tileRow$$inline_252$$ = $lineno$$inline_239$$ - $y$$inline_250$$ >> $zoomed$$inline_245$$;
                0 != ($JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$vdpreg$[1] & 2) && ($n$$inline_249$$ &= -2);
                var $tile$$inline_253$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$tiles$[$n$$inline_249$$ + (($tileRow$$inline_252$$ & 8) >> 3)], $pix$$inline_254$$ = 0;
                0 > $x$$inline_251$$ && ($pix$$inline_254$$ = -$x$$inline_251$$, $x$$inline_251$$ = 0);
                var $offset$$inline_255$$ = $pix$$inline_254$$ + (($tileRow$$inline_252$$ & 7) << 3);
                if(0 == $zoomed$$inline_245$$) {
                  for(;8 > $pix$$inline_254$$ && 256 > $x$$inline_251$$;$pix$$inline_254$$++, $x$$inline_251$$++) {
                    $colour$$inline_240$$ = $tile$$inline_253$$[$offset$$inline_255$$++], 0 != $colour$$inline_240$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$bgPriority$[$x$$inline_251$$] && ($temp$$inline_241$$ = 4 * ($x$$inline_251$$ + $row_precal$$inline_246$$), $temp2$$inline_242$$ = 3 * ($colour$$inline_240$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$], 
                    $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$ + 1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_254$$ && 256 > $x$$inline_251$$;$pix$$inline_254$$++, $x$$inline_251$$ += 2) {
                    $colour$$inline_240$$ = $tile$$inline_253$$[$offset$$inline_255$$++], 0 != $colour$$inline_240$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$bgPriority$[$x$$inline_251$$] && ($temp$$inline_241$$ = 4 * ($x$$inline_251$$ + $row_precal$$inline_246$$), $temp2$$inline_242$$ = 3 * ($colour$$inline_240$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$], 
                    $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$ + 1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$ + 2]), 0 != $colour$$inline_240$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$bgPriority$[$x$$inline_251$$ + 
                    1] && ($temp$$inline_241$$ = 4 * ($x$$inline_251$$ + $row_precal$$inline_246$$ + 1), $temp2$$inline_242$$ = 3 * ($colour$$inline_240$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$ + 1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$ + 
                    1], $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.display[$temp$$inline_241$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.$CRAM$[$temp2$$inline_242$$ + 2])
                  }
                }
              }
              8 <= $sprites$$inline_243$$[0] && ($JSCompiler_StaticMethods_drawSprite$self$$inline_238$$.status |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$main$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$vdpreg$[0] & 32)) {
              var $location$$inline_115$$ = $lineno$$inline_111$$ << 8;
              if(32 < 16 + ($JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$vdpreg$[7] & 15)) {
                debugger
              }
              if(49152 < $location$$inline_115$$) {
                debugger
              }
              $temp$$inline_113$$ = 4 * $location$$inline_115$$;
              $temp2$$inline_114$$ = 3 * (16 + ($JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$vdpreg$[7] & 15));
              for($i$$inline_112$$ = 0;8 > $i$$inline_112$$;$i$$inline_112$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.display[$temp$$inline_113$$ + $i$$inline_112$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$CRAM$[$temp2$$inline_114$$], $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.display[$temp$$inline_113$$ + $i$$inline_112$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$CRAM$[$temp2$$inline_114$$], $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.display[$temp$$inline_113$$ + $i$$inline_112$$ + 2] = 
                $JSCompiler_StaticMethods_drawLine$self$$inline_110$$.$CRAM$[$temp2$$inline_114$$]
              }
            }
          }else {
            for(var $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_110$$, $row_precal$$inline_259$$ = $lineno$$inline_111$$ << 8, $temp$$inline_260$$ = 0, $temp2$$inline_261$$ = 3 * (16 + ($JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.$vdpreg$[7] & 15)), $i$$inline_262$$ = 0;1024 > $i$$inline_262$$;$i$$inline_262$$++) {
              $temp$$inline_260$$ = 4 * $row_precal$$inline_259$$, $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.display[$temp$$inline_260$$] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.$CRAM$[$temp2$$inline_261$$], $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.display[$temp$$inline_260$$ + 1] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.$CRAM$[$temp2$$inline_261$$ + 1], $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.display[$temp$$inline_260$$ + 
              2] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_257$$.$CRAM$[$temp2$$inline_261$$ + 2], $row_precal$$inline_259$$++
            }
          }
        }
        this.$drawTimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_18$$
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_117$$ = this.$vdp$, $lineno$$inline_118$$ = $lineno$$inline_19$$;
      192 >= $lineno$$inline_118$$ ? (192 == $lineno$$inline_118$$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.status |= 128), 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$counter$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$counter$ = $JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$vdpreg$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_117$$.status |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$counter$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.status & 
      4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$vdpreg$[0] & 16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$main$.$cpu$.$interruptLine$ = $JSCompiler_alias_TRUE$$)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$counter$ = $JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$vdpreg$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.status & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$vdpreg$[1] & 
      32) && 224 > $lineno$$inline_118$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_117$$.$main$.$cpu$.$interruptLine$ = $JSCompiler_alias_TRUE$$))
    }
    60 == ++this.$frameCount$ && (this.$z80Time$ = this.$z80TimeCounter$, this.$drawTime$ = this.$drawTimeCounter$, this.$frameCount$ = this.$drawTimeCounter$ = this.$z80TimeCounter$ = 0);
    if(this.$pause_button$) {
      var $JSCompiler_StaticMethods_nmi$self$$inline_120$$ = this.$cpu$;
      $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$iff2$ = $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$iff1$;
      $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$iff1$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$halt$ && ($JSCompiler_StaticMethods_nmi$self$$inline_120$$.$pc$++, $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$halt$ = $JSCompiler_alias_FALSE$$);
      $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_nmi$self$$inline_120$$, $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$pc$);
      $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$pc$ = 102;
      $JSCompiler_StaticMethods_nmi$self$$inline_120$$.$tstates$ -= 11;
      this.$pause_button$ = $JSCompiler_alias_FALSE$$
    }
    0 == this.$frameskip_counter$-- ? (this.$frameskip_counter$ = this.$frameSkip$, $JSCompiler_inline_result$$4$$ = $JSCompiler_alias_TRUE$$) : $JSCompiler_inline_result$$4$$ = $JSCompiler_alias_FALSE$$;
    $JSCompiler_inline_result$$4$$ && this.$ui$.$writeFrame$(this.$vdp$.display, []);
    this.$fpsFrameCount$++;
    this.$ui$.requestAnimationFrame(this.frame.bind(this), this.$ui$.screen)
  }
}, $loadROM$:function $$JSSMS$$$$$loadROM$$($data$$31$$, $size$$11$$) {
  0 != $size$$11$$ % 1024 && ($data$$31$$ = $data$$31$$.substr(512), $size$$11$$ -= 512);
  var $i$$3$$, $j$$, $number_of_pages$$ = Math.round($size$$11$$ / 1024), $pages$$1$$ = Array($number_of_pages$$);
  for($i$$3$$ = 0;$i$$3$$ < $number_of_pages$$;$i$$3$$++) {
    if($pages$$1$$[$i$$3$$] = $JSSMS$Utils$Array$$(1024), $SUPPORT_DATAVIEW$$) {
      for($j$$ = 0;1024 > $j$$;$j$$++) {
        $pages$$1$$[$i$$3$$].setUint8($j$$, $data$$31$$.charCodeAt(1024 * $i$$3$$ + $j$$))
      }
    }else {
      for($j$$ = 0;1024 > $j$$;$j$$++) {
        $pages$$1$$[$i$$3$$][$j$$] = $data$$31$$.charCodeAt(1024 * $i$$3$$ + $j$$) & 255
      }
    }
  }
  return $pages$$1$$
}};
function $JSCompiler_StaticMethods_readRomDirectly$$($JSCompiler_StaticMethods_readRomDirectly$self$$, $data$$30$$, $fileName$$) {
  var $mode$$9_pages$$;
  $mode$$9_pages$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1;
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
  var $now$$ = $JSSMS$Utils$getTimestamp$$(), $s$$2$$ = "Running";
  $JSCompiler_StaticMethods_printFps$self$$.$lastFpsTime$ && ($s$$2$$ += ": " + ($JSCompiler_StaticMethods_printFps$self$$.$fpsFrameCount$ / (($now$$ - $JSCompiler_StaticMethods_printFps$self$$.$lastFpsTime$) / 1E3)).toFixed(2) + " (/ " + (1E3 / 17).toFixed(2) + ") FPS");
  $JSCompiler_StaticMethods_printFps$self$$.$ui$.updateStatus($s$$2$$);
  $JSCompiler_StaticMethods_printFps$self$$.$fpsFrameCount$ = 0;
  $JSCompiler_StaticMethods_printFps$self$$.$lastFpsTime$ = $now$$
}
;var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  $length$$12$$ || ($length$$12$$ = 0);
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array, $JSSMS$Utils$copyArray$$ = $SUPPORT_DATAVIEW$$ ? function($src$$3$$) {
  if(!$src$$3$$) {
    return $JSSMS$Utils$Array$$()
  }
  var $i$$4$$, $dest$$2$$;
  $i$$4$$ = $src$$3$$.byteLength;
  for($dest$$2$$ = new $JSSMS$Utils$Array$$($i$$4$$);$i$$4$$--;) {
    $dest$$2$$.setInt8($i$$4$$, $src$$3$$.getInt8($i$$4$$))
  }
  return $dest$$2$$
} : function($src$$4$$) {
  if(!$src$$4$$) {
    return $JSSMS$Utils$Array$$()
  }
  var $i$$5$$, $dest$$3$$;
  $i$$5$$ = $src$$4$$.length;
  for($dest$$3$$ = new $JSSMS$Utils$Array$$($i$$5$$);$i$$5$$--;) {
    $src$$4$$[$i$$5$$] != $JSCompiler_alias_VOID$$ && ($dest$$3$$[$i$$5$$] = $src$$4$$[$i$$5$$])
  }
  return $dest$$3$$
}, $JSSMS$Utils$writeMem$$ = $SUPPORT_DATAVIEW$$ ? function($self$$2$$, $address$$, $value$$48$$) {
  if($address$$ >> 10 >= $self$$2$$.$memWriteMap$.length || !$self$$2$$.$memWriteMap$[$address$$ >> 10] || ($address$$ & 1023) >= $self$$2$$.$memWriteMap$[$address$$ >> 10].byteLength) {
    console.error($address$$, $address$$ >> 10, $address$$ & 1023);
    debugger
  }
  $self$$2$$.$memWriteMap$[$address$$ >> 10].setInt8($address$$ & 1023, $value$$48$$);
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
  return $array$$10$$[$address$$3$$ >> 10][$address$$3$$ & 1023] & 255
}, $JSSMS$Utils$readMemWord$$ = $SUPPORT_DATAVIEW$$ ? function($array$$11$$, $address$$4$$) {
  if($address$$4$$ >> 10 >= $array$$11$$.length || !$array$$11$$[$address$$4$$ >> 10] || ($address$$4$$ & 1023) >= $array$$11$$[$address$$4$$ >> 10].byteLength) {
    console.error($address$$4$$, $address$$4$$ >> 10, $address$$4$$ & 1023);
    debugger
  }
  return 1023 > ($address$$4$$ & 1023) ? $array$$11$$[$address$$4$$ >> 10].getUint16($address$$4$$ & 1023, $JSCompiler_alias_TRUE$$) : $array$$11$$[$address$$4$$ >> 10].getUint8($address$$4$$ & 1023) | $array$$11$$[++$address$$4$$ >> 10].getUint8($address$$4$$ & 1023) << 8
} : function($array$$12$$, $address$$5$$) {
  return $array$$12$$[$address$$5$$ >> 10][$address$$5$$ & 1023] & 255 | ($array$$12$$[++$address$$5$$ >> 10][$address$$5$$ & 1023] & 255) << 8
}, $JSSMS$Utils$getTimestamp$$ = Date.now || function() {
  return(new Date).getTime()
};
function $JSSMS$Utils$getPrefix$$($arr$$16$$, $obj$$35$$) {
  var $prefix$$2$$ = $JSCompiler_alias_FALSE$$;
  $obj$$35$$ == $JSCompiler_alias_VOID$$ && ($obj$$35$$ = document);
  $arr$$16$$.some(function($prop$$4$$) {
    return $prop$$4$$ in $obj$$35$$ ? ($prefix$$2$$ = $prop$$4$$, $JSCompiler_alias_TRUE$$) : $JSCompiler_alias_FALSE$$
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
  this.$DAA_TABLE$ = Array(2048);
  this.$SZ_TABLE$ = Array(256);
  this.$SZP_TABLE$ = Array(256);
  this.$SZHV_INC_TABLE$ = Array(256);
  this.$SZHV_DEC_TABLE$ = Array(256);
  this.$SZHVC_ADD_TABLE$ = Array(131072);
  this.$SZHVC_SUB_TABLE$ = Array(131072);
  this.$SZ_BIT_TABLE$ = Array(256);
  var $c$$inline_44_padc$$inline_35_sf$$inline_29$$, $h$$inline_45_psub$$inline_36_zf$$inline_30$$, $n$$inline_46_psbc$$inline_37_yf$$inline_31$$, $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$, $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$, $flags$$inline_124_newval$$inline_40$$;
  for($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 0;256 > $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$++) {
    $c$$inline_44_padc$$inline_35_sf$$inline_29$$ = 0 != ($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 128) ? 128 : 0, $h$$inline_45_psub$$inline_36_zf$$inline_30$$ = 0 == $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? 64 : 0, $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 32, $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 
    8, $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$) ? 4 : 0, this.$SZ_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$, this.$SZP_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = 
    $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ | $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$, this.$SZHV_INC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | 
    $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$, this.$SZHV_INC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 128 == $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? 4 : 0, this.$SZHV_INC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 0 == ($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 15) ? 16 : 0, this.$SZHV_DEC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | 
    $h$$inline_45_psub$$inline_36_zf$$inline_30$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ | 2, this.$SZHV_DEC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 127 == $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? 4 : 0, this.$SZHV_DEC_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 15 == ($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 15) ? 16 : 0, 
    this.$SZ_BIT_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = 0 != $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ ? $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ & 128 : 68, this.$SZ_BIT_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ | $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ | 16
  }
  $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 0;
  $c$$inline_44_padc$$inline_35_sf$$inline_29$$ = 65536;
  $h$$inline_45_psub$$inline_36_zf$$inline_30$$ = 0;
  $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ = 65536;
  for($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ = 0;256 > $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$;$JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$++) {
    for($flags$$inline_124_newval$$inline_40$$ = 0;256 > $flags$$inline_124_newval$$inline_40$$;$flags$$inline_124_newval$$inline_40$$++) {
      $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ = $flags$$inline_124_newval$$inline_40$$ - $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$, this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] = 0 != $flags$$inline_124_newval$$inline_40$$ ? 0 != ($flags$$inline_124_newval$$inline_40$$ & 128) ? 128 : 0 : 64, this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= $flags$$inline_124_newval$$inline_40$$ & 
      40, ($flags$$inline_124_newval$$inline_40$$ & 15) < ($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ & 15) && (this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 16), $flags$$inline_124_newval$$inline_40$$ < $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ && (this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ ^ $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ ^ 
      128) & ($JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ ^ $flags$$inline_124_newval$$inline_40$$) & 128) && (this.$SZHVC_ADD_TABLE$[$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$] |= 4), $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$++, $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ = $flags$$inline_124_newval$$inline_40$$ - $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ - 1, this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] = 
      0 != $flags$$inline_124_newval$$inline_40$$ ? 0 != ($flags$$inline_124_newval$$inline_40$$ & 128) ? 128 : 0 : 64, this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= $flags$$inline_124_newval$$inline_40$$ & 40, ($flags$$inline_124_newval$$inline_40$$ & 15) <= ($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ & 15) && (this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= 16), $flags$$inline_124_newval$$inline_40$$ <= $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ && 
      (this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= 1), 0 != (($JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ ^ $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ ^ 128) & ($JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ ^ $flags$$inline_124_newval$$inline_40$$) & 128) && (this.$SZHVC_ADD_TABLE$[$c$$inline_44_padc$$inline_35_sf$$inline_29$$] |= 4), $c$$inline_44_padc$$inline_35_sf$$inline_29$$++, $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ = 
      $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ - $flags$$inline_124_newval$$inline_40$$, this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] = 0 != $flags$$inline_124_newval$$inline_40$$ ? 0 != ($flags$$inline_124_newval$$inline_40$$ & 128) ? 130 : 2 : 66, this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= $flags$$inline_124_newval$$inline_40$$ & 40, ($flags$$inline_124_newval$$inline_40$$ & 15) > ($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ & 
      15) && (this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= 16), $flags$$inline_124_newval$$inline_40$$ > $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ && (this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= 1), 0 != (($JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ ^ $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$) & ($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ ^ $flags$$inline_124_newval$$inline_40$$) & 
      128) && (this.$SZHVC_SUB_TABLE$[$h$$inline_45_psub$$inline_36_zf$$inline_30$$] |= 4), $h$$inline_45_psub$$inline_36_zf$$inline_30$$++, $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ = $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ - $flags$$inline_124_newval$$inline_40$$ - 1, this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] = 0 != $flags$$inline_124_newval$$inline_40$$ ? 0 != ($flags$$inline_124_newval$$inline_40$$ & 128) ? 130 : 2 : 66, this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 
      $flags$$inline_124_newval$$inline_40$$ & 40, ($flags$$inline_124_newval$$inline_40$$ & 15) >= ($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ & 15) && (this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 16), $flags$$inline_124_newval$$inline_40$$ >= $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ && (this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 1), 0 != (($JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ ^ 
      $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$) & ($JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ ^ $flags$$inline_124_newval$$inline_40$$) & 128) && (this.$SZHVC_SUB_TABLE$[$n$$inline_46_psbc$$inline_37_yf$$inline_31$$] |= 4), $n$$inline_46_psbc$$inline_37_yf$$inline_31$$++
    }
  }
  for($i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$ = 256;$i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$--;) {
    for($c$$inline_44_padc$$inline_35_sf$$inline_29$$ = 0;1 >= $c$$inline_44_padc$$inline_35_sf$$inline_29$$;$c$$inline_44_padc$$inline_35_sf$$inline_29$$++) {
      for($h$$inline_45_psub$$inline_36_zf$$inline_30$$ = 0;1 >= $h$$inline_45_psub$$inline_36_zf$$inline_30$$;$h$$inline_45_psub$$inline_36_zf$$inline_30$$++) {
        for($n$$inline_46_psbc$$inline_37_yf$$inline_31$$ = 0;1 >= $n$$inline_46_psbc$$inline_37_yf$$inline_31$$;$n$$inline_46_psbc$$inline_37_yf$$inline_31$$++) {
          $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$ = this.$DAA_TABLE$;
          $JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$ = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ << 8 | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ << 9 | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ << 10 | $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;
          $flags$$inline_124_newval$$inline_40$$ = $c$$inline_44_padc$$inline_35_sf$$inline_29$$ | $n$$inline_46_psbc$$inline_37_yf$$inline_31$$ << 1 | $h$$inline_45_psub$$inline_36_zf$$inline_30$$ << 4;
          this.$a$ = $i$$inline_28_i$$inline_43_i$$inline_49_padd$$inline_34_sms$$;
          this.$f$ = $flags$$inline_124_newval$$inline_40$$;
          var $a_copy$$inline_125$$ = this.$a$, $correction$$inline_126$$ = 0, $carry$$inline_127$$ = $flags$$inline_124_newval$$inline_40$$ & 1, $carry_copy$$inline_128$$ = $carry$$inline_127$$;
          if(0 != ($flags$$inline_124_newval$$inline_40$$ & 16) || 9 < ($a_copy$$inline_125$$ & 15)) {
            $correction$$inline_126$$ |= 6
          }
          if(1 == $carry$$inline_127$$ || 159 < $a_copy$$inline_125$$ || 143 < $a_copy$$inline_125$$ && 9 < ($a_copy$$inline_125$$ & 15)) {
            $correction$$inline_126$$ |= 96, $carry_copy$$inline_128$$ = 1
          }
          153 < $a_copy$$inline_125$$ && ($carry_copy$$inline_128$$ = 1);
          0 != ($flags$$inline_124_newval$$inline_40$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_126$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_126$$);
          $flags$$inline_124_newval$$inline_40$$ = this.$f$ & 254 | $carry_copy$$inline_128$$;
          $flags$$inline_124_newval$$inline_40$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_124_newval$$inline_40$$ & 251 | 4 : $flags$$inline_124_newval$$inline_40$$ & 251;
          $JSCompiler_temp_const$$94_val$$inline_38_xf$$inline_32$$[$JSCompiler_temp_const$$93_oldval$$inline_39_pf$$inline_33$$] = this.$a$ | $flags$$inline_124_newval$$inline_40$$ << 8
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
  this.$number_of_pages$ = 2;
  this.$writeMem$ = $JSSMS$Utils$writeMem$$.bind(this, this);
  this.$readMem$ = $JSSMS$Utils$readMem$$.bind(this, this.$memReadMap$);
  this.$readMemWord$ = $JSSMS$Utils$readMemWord$$.bind(this, this.$memReadMap$)
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$pc$ = this.$f2$ = this.$f$ = this.$i$ = this.$r$ = this.$iyL$ = this.$iyH$ = this.$ixL$ = this.$ixH$ = this.$h$ = this.$l$ = this.$h2$ = this.$l2$ = this.$d$ = this.$e$ = this.$d2$ = this.$e2$ = this.$b$ = this.$c$ = this.$b2$ = this.$c2$ = this.$a$ = this.$a2$ = 0;
  this.$sp$ = 57328;
  this.$im$ = this.$totalCycles$ = this.$tstates$ = 0;
  this.$EI_inst$ = this.$iff2$ = this.$iff1$ = $JSCompiler_alias_FALSE$$;
  this.$interruptVector$ = 0;
  this.$halt$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$pc$ + 2), this.$pc$ = this.$readMemWord$(this.$pc$), this.$tstates$ -= 7) : this.$pc$ += 2
}, page:function $$JSSMS$Z80$$$$page$($address$$6$$, $value$$77$$) {
  var $offset$$16_p$$1$$, $i$$10$$;
  this.$frameReg$[$address$$6$$] = $value$$77$$;
  switch($address$$6$$) {
    case 0:
      if(0 != ($value$$77$$ & 8)) {
        $offset$$16_p$$1$$ = ($value$$77$$ & 4) << 2;
        for($i$$10$$ = 32;48 > $i$$10$$;$i$$10$$++) {
          this.$memReadMap$[$i$$10$$] = $JSSMS$Utils$copyArray$$(this.$sram$[$offset$$16_p$$1$$]), this.$memWriteMap$[$i$$10$$] = $JSSMS$Utils$copyArray$$(this.$sram$[$offset$$16_p$$1$$]), $offset$$16_p$$1$$++
        }
        this.$useSRAM$ = $JSCompiler_alias_TRUE$$
      }else {
        $offset$$16_p$$1$$ = this.$frameReg$[3] % this.$number_of_pages$ << 4;
        for($i$$10$$ = 32;48 > $i$$10$$;$i$$10$$++) {
          this.$memReadMap$[$i$$10$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++]), this.$memWriteMap$[$i$$10$$] = $JSSMS$Utils$Array$$(1024)
        }
      }
      break;
    case 1:
      $offset$$16_p$$1$$ = ($value$$77$$ % this.$number_of_pages$ << 4) + 1;
      for($i$$10$$ = 1;16 > $i$$10$$;$i$$10$$++) {
        this.$memReadMap$[$i$$10$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++])
      }
      break;
    case 2:
      $offset$$16_p$$1$$ = $value$$77$$ % this.$number_of_pages$ << 4;
      for($i$$10$$ = 16;32 > $i$$10$$;$i$$10$$++) {
        this.$memReadMap$[$i$$10$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++])
      }
      break;
    case 3:
      if(0 == (this.$frameReg$[0] & 8)) {
        $offset$$16_p$$1$$ = $value$$77$$ % this.$number_of_pages$ << 4;
        for($i$$10$$ = 32;48 > $i$$10$$;$i$$10$$++) {
          this.$memReadMap$[$i$$10$$] = $JSSMS$Utils$copyArray$$(this.$rom$[$offset$$16_p$$1$$++])
        }
      }
  }
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$readMem$($JSCompiler_StaticMethods_d_$self$$.$pc$)
}
function $JSCompiler_StaticMethods_resetMemory$$($JSCompiler_StaticMethods_resetMemory$self$$, $p$$) {
  $p$$ != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetMemory$self$$.$rom$ = $p$$);
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[0] = 0;
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[1] = 0;
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[2] = 1;
  $JSCompiler_StaticMethods_resetMemory$self$$.$frameReg$[3] = 0;
  if($JSCompiler_StaticMethods_resetMemory$self$$.$rom$ != $JSCompiler_alias_NULL$$) {
    $JSCompiler_StaticMethods_resetMemory$self$$.$number_of_pages$ = $JSCompiler_StaticMethods_resetMemory$self$$.$rom$.length / 16;
    for(var $i$$inline_52$$ = 0;48 > $i$$inline_52$$;$i$$inline_52$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$.$memReadMap$[$i$$inline_52$$] = $JSSMS$Utils$copyArray$$($JSCompiler_StaticMethods_resetMemory$self$$.$rom$[$i$$inline_52$$ & 31]), $JSCompiler_StaticMethods_resetMemory$self$$.$memWriteMap$[$i$$inline_52$$] = $JSSMS$Utils$Array$$(1024)
    }
    for($i$$inline_52$$ = 48;64 > $i$$inline_52$$;$i$$inline_52$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$.$memReadMap$[$i$$inline_52$$] = $JSCompiler_StaticMethods_resetMemory$self$$.$ram$[$i$$inline_52$$ & 7], $JSCompiler_StaticMethods_resetMemory$self$$.$memWriteMap$[$i$$inline_52$$] = $JSCompiler_StaticMethods_resetMemory$self$$.$ram$[$i$$inline_52$$ & 7]
    }
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$.$number_of_pages$ = 0
  }
}
function $JSCompiler_StaticMethods_getParity$$($value$$76$$) {
  var $parity$$ = $JSCompiler_alias_TRUE$$, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$76$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$75$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_sbc16$self$$.$h$ << 8 | $JSCompiler_StaticMethods_sbc16$self$$.$l$, $result$$2$$ = $hl$$1$$ - $value$$75$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$f$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$f$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$75$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$75$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$h$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$l$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$74$$) {
  var $hl$$ = $JSCompiler_StaticMethods_adc16$self$$.$h$ << 8 | $JSCompiler_StaticMethods_adc16$self$$.$l$, $result$$1$$ = $hl$$ + $value$$74$$ + ($JSCompiler_StaticMethods_adc16$self$$.$f$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$f$ = ($hl$$ ^ $result$$1$$ ^ $value$$74$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$74$$ ^ $hl$$ ^ 32768) & ($value$$74$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$h$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$l$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$73$$) {
  var $result$$ = $reg$$ + $value$$73$$;
  $JSCompiler_StaticMethods_add16$self$$.$f$ = $JSCompiler_StaticMethods_add16$self$$.$f$ & 196 | ($reg$$ ^ $result$$ ^ $value$$73$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$72$$) {
  $value$$72$$ = $value$$72$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$f$ = $JSCompiler_StaticMethods_dec8$self$$.$f$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$SZHV_DEC_TABLE$[$value$$72$$];
  return $value$$72$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$71$$) {
  $value$$71$$ = $value$$71$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$f$ = $JSCompiler_StaticMethods_inc8$self$$.$f$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$SZHV_INC_TABLE$[$value$$71$$];
  return $value$$71$$
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
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$70$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$iyH$ = $value$$70$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$iyL$ = $value$$70$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$69$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$ixH$ = $value$$69$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$ixL$ = $value$$69$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$68$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$h$ = $value$$68$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$l$ = $value$$68$$ & 255
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
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$65$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$f$ = $JSCompiler_StaticMethods_cp_a$self$$.$SZHVC_SUB_TABLE$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$65$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$64$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$f$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$64$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$f$ = $JSCompiler_StaticMethods_sbc_a$self$$.$SZHVC_SUB_TABLE$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$63$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$63$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$f$ = $JSCompiler_StaticMethods_sub_a$self$$.$SZHVC_SUB_TABLE$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$62$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$f$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$62$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$f$ = $JSCompiler_StaticMethods_adc_a$self$$.$SZHVC_ADD_TABLE$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$61$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$61$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$f$ = $JSCompiler_StaticMethods_add_a$self$$.$SZHVC_ADD_TABLE$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$45$$) {
  var $location$$24$$ = $index$$45$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$6$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$pc$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$tstates$ -= $OP_INDEX_CB_STATES$$[$opcode$$6$$];
  switch($opcode$$6$$) {
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$)));
      break;
    case 70:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 1);
      break;
    case 78:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 2);
      break;
    case 86:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 4);
      break;
    case 94:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 8);
      break;
    case 102:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 16);
      break;
    case 110:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 32);
      break;
    case 118:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 64);
      break;
    case 126:
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & 128);
      break;
    case 134:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -2);
      break;
    case 142:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -3);
      break;
    case 150:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -5);
      break;
    case 158:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -9);
      break;
    case 166:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -17);
      break;
    case 174:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -33);
      break;
    case 182:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -65);
      break;
    case 190:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) & -129);
      break;
    case 198:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 1);
      break;
    case 206:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 2);
      break;
    case 214:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 4);
      break;
    case 222:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 8);
      break;
    case 230:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 16);
      break;
    case 238:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 32);
      break;
    case 246:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 64);
      break;
    case 254:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$writeMem$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$readMem$($location$$24$$) | 128);
      break;
    default:
      console.log("Unimplemented DDCB or FDCB Opcode: " + ($opcode$$6$$ & 255).toString(16))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$pc$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$f$ = $JSCompiler_StaticMethods_bit$self$$.$f$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$SZ_BIT_TABLE$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$59$$) {
  var $carry$$7$$ = $value$$59$$ & 1;
  $value$$59$$ = $value$$59$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$f$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$SZP_TABLE$[$value$$59$$];
  return $value$$59$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$58$$) {
  var $carry$$6$$ = $value$$58$$ & 1;
  $value$$58$$ = $value$$58$$ >> 1 | $value$$58$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$f$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$SZP_TABLE$[$value$$58$$];
  return $value$$58$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$57$$) {
  var $carry$$5$$ = ($value$$57$$ & 128) >> 7;
  $value$$57$$ = ($value$$57$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$f$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$SZP_TABLE$[$value$$57$$];
  return $value$$57$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$56$$) {
  var $carry$$4$$ = ($value$$56$$ & 128) >> 7;
  $value$$56$$ = $value$$56$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$f$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$SZP_TABLE$[$value$$56$$];
  return $value$$56$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$55$$) {
  var $carry$$3$$ = $value$$55$$ & 1;
  $value$$55$$ = ($value$$55$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$f$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$f$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$SZP_TABLE$[$value$$55$$];
  return $value$$55$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$54$$) {
  var $carry$$2$$ = ($value$$54$$ & 128) >> 7;
  $value$$54$$ = ($value$$54$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$f$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$f$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$SZP_TABLE$[$value$$54$$];
  return $value$$54$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$53$$) {
  var $carry$$1$$ = $value$$53$$ & 1;
  $value$$53$$ = ($value$$53$$ >> 1 | $value$$53$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$f$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$SZP_TABLE$[$value$$53$$];
  return $value$$53$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$52$$) {
  var $carry$$ = ($value$$52$$ & 128) >> 7;
  $value$$52$$ = ($value$$52$$ << 1 | $value$$52$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$f$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$SZP_TABLE$[$value$$52$$];
  return $value$$52$$
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_decMem$self$$.$writeMem$($offset$$15$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$readMem$($offset$$15$$)))
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$writeMem$($offset$$14$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$readMem$($offset$$14$$)))
}
function $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_push2$self$$, $value$$51$$, $l$$) {
  $JSCompiler_StaticMethods_push2$self$$.$writeMem$(--$JSCompiler_StaticMethods_push2$self$$.$sp$, $value$$51$$);
  $JSCompiler_StaticMethods_push2$self$$.$writeMem$(--$JSCompiler_StaticMethods_push2$self$$.$sp$, $l$$)
}
function $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_push1$self$$, $value$$50$$) {
  $JSCompiler_StaticMethods_push1$self$$.$writeMem$(--$JSCompiler_StaticMethods_push1$self$$.$sp$, $value$$50$$ >> 8);
  $JSCompiler_StaticMethods_push1$self$$.$writeMem$(--$JSCompiler_StaticMethods_push1$self$$.$sp$, $value$$50$$ & 255)
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$pc$ = $JSCompiler_StaticMethods_ret$self$$.$readMemWord$($JSCompiler_StaticMethods_ret$self$$.$sp$), $JSCompiler_StaticMethods_ret$self$$.$sp$ += 2, $JSCompiler_StaticMethods_ret$self$$.$tstates$ -= 6)
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  if($condition$$2$$) {
    var $d$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1;
    128 <= $d$$ && ($d$$ -= 256);
    $JSCompiler_StaticMethods_jr$self$$.$pc$ += $d$$;
    $JSCompiler_StaticMethods_jr$self$$.$tstates$ -= 5
  }else {
    $JSCompiler_StaticMethods_jr$self$$.$pc$++
  }
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $JSCompiler_StaticMethods_jp$self$$.$pc$ = $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$readMemWord$($JSCompiler_StaticMethods_jp$self$$.$pc$) : $JSCompiler_StaticMethods_jp$self$$.$pc$ + 2
}
;function $JSSMS$Keyboard$$($sms$$1$$) {
  this.$main$ = $sms$$1$$;
  this.$lightgunY$ = this.$lightgunX$ = this.$ggstart$ = this.$controller2$ = this.$controller1$ = 0;
  this.$lightgunEnabled$ = this.$lightgunClick$ = $JSCompiler_alias_FALSE$$
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$ggstart$ = this.$controller2$ = this.$controller1$ = 255;
  this.$pause_button$ = $JSCompiler_alias_FALSE$$
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
  $evt$$17$$.preventDefault()
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
  for(var $buffer$$9$$ = [], $sample$$ = 0, $feedback_i$$13_output$$ = 0;$sample$$ < $samplesToGenerate$$1$$;$sample$$++) {
    for($feedback_i$$13_output$$ = 0;3 > $feedback_i$$13_output$$;$feedback_i$$13_output$$++) {
      this.$outputChannel$[$feedback_i$$13_output$$] = this.$freqPos$[$feedback_i$$13_output$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[this.$reg$[($feedback_i$$13_output$$ << 1) + 1]] * this.$freqPos$[$feedback_i$$13_output$$] >> 8 : $PSG_VOLUME$$[this.$reg$[($feedback_i$$13_output$$ << 1) + 1]] * this.$freqPolarity$[$feedback_i$$13_output$$]
    }
    this.$outputChannel$[3] = $PSG_VOLUME$$[this.$reg$[7]] * (this.$noiseShiftReg$ & 1) << 1;
    $feedback_i$$13_output$$ = this.$outputChannel$[0] + this.$outputChannel$[1] + this.$outputChannel$[2] + this.$outputChannel$[3];
    127 < $feedback_i$$13_output$$ ? $feedback_i$$13_output$$ = 127 : -128 > $feedback_i$$13_output$$ && ($feedback_i$$13_output$$ = -128);
    $buffer$$9$$[$offset$$17$$ + $sample$$] = $feedback_i$$13_output$$;
    this.$clockFrac$ += this.$clock$;
    var $clockCycles$$ = this.$clockFrac$ >> 8, $clockCyclesScaled$$ = $clockCycles$$ << 8;
    this.$clockFrac$ -= $clockCyclesScaled$$;
    this.$freqCounter$[0] -= $clockCycles$$;
    this.$freqCounter$[1] -= $clockCycles$$;
    this.$freqCounter$[2] -= $clockCycles$$;
    this.$freqCounter$[3] = 128 == this.$noiseFreq$ ? this.$freqCounter$[2] : this.$freqCounter$[3] - $clockCycles$$;
    for($feedback_i$$13_output$$ = 0;3 > $feedback_i$$13_output$$;$feedback_i$$13_output$$++) {
      var $counter$$ = this.$freqCounter$[$feedback_i$$13_output$$];
      if(0 >= $counter$$) {
        var $tone$$ = this.$reg$[$feedback_i$$13_output$$ << 1];
        6 < $tone$$ ? (this.$freqPos$[$feedback_i$$13_output$$] = ($clockCyclesScaled$$ - this.$clockFrac$ + 512 * $counter$$ << 8) * this.$freqPolarity$[$feedback_i$$13_output$$] / ($clockCyclesScaled$$ + this.$clockFrac$), this.$freqPolarity$[$feedback_i$$13_output$$] = -this.$freqPolarity$[$feedback_i$$13_output$$]) : (this.$freqPolarity$[$feedback_i$$13_output$$] = 1, this.$freqPos$[$feedback_i$$13_output$$] = $NO_ANTIALIAS$$);
        this.$freqCounter$[$feedback_i$$13_output$$] += $tone$$ * ($clockCycles$$ / $tone$$ + 1)
      }else {
        this.$freqPos$[$feedback_i$$13_output$$] = $NO_ANTIALIAS$$
      }
    }
    0 >= this.$freqCounter$[3] && (this.$freqPolarity$[3] = -this.$freqPolarity$[3], 128 != this.$noiseFreq$ && (this.$freqCounter$[3] += this.$noiseFreq$ * ($clockCycles$$ / this.$noiseFreq$ + 1)), 1 == this.$freqPolarity$[3] && ($feedback_i$$13_output$$ = 0, $feedback_i$$13_output$$ = 0 != (this.$reg$[6] & 4) ? 0 != (this.$noiseShiftReg$ & 9) && 0 != (this.$noiseShiftReg$ & 9 ^ 9) ? 1 : 0 : this.$noiseShiftReg$ & 1, this.$noiseShiftReg$ = this.$noiseShiftReg$ >> 1 | $feedback_i$$13_output$$ << 
    15))
  }
  return $buffer$$9$$
}};
function $JSSMS$Vdp$$($i$$inline_65_sms$$3$$) {
  this.$main$ = $i$$inline_65_sms$$3$$;
  var $i$$14$$;
  this.$videoMode$ = 0;
  this.$VRAM$ = Array(16384);
  this.$CRAM$ = Array(96);
  for($i$$14$$ = 0;96 > $i$$14$$;$i$$14$$++) {
    this.$CRAM$[$i$$14$$] = 255
  }
  this.$vdpreg$ = Array(16);
  this.status = 0;
  this.$firstByte$ = $JSCompiler_alias_FALSE$$;
  this.$counter$ = this.$line$ = this.$readBuffer$ = this.$operation$ = this.location = this.$commandByte$ = 0;
  this.$bgPriority$ = Array(256);
  this.$vScrollLatch$ = this.$bgt$ = 0;
  this.display = $i$$inline_65_sms$$3$$.$ui$.$canvasImageData$.data;
  this.$main_JAVA$ = Array(64);
  this.$GG_JAVA1$ = Array(256);
  this.$GG_JAVA2$ = Array(16);
  this.$isPalConverted$ = $JSCompiler_alias_FALSE$$;
  this.$sat$ = this.$h_end$ = this.$h_start$ = 0;
  this.$isSatDirty$ = $JSCompiler_alias_FALSE$$;
  this.$lineSprites$ = Array(192);
  for($i$$14$$ = 0;192 > $i$$14$$;$i$$14$$++) {
    this.$lineSprites$[$i$$14$$] = Array(25)
  }
  this.$tiles$ = Array(512);
  this.$isTileDirty$ = Array(512);
  for($i$$inline_65_sms$$3$$ = this.$maxDirty$ = this.$minDirty$ = 0;512 > $i$$inline_65_sms$$3$$;$i$$inline_65_sms$$3$$++) {
    this.$tiles$[$i$$inline_65_sms$$3$$] = Array(64)
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$15_i$$inline_68$$;
  this.$isPalConverted$ = $JSCompiler_alias_FALSE$$;
  var $r$$inline_69$$, $g$$inline_70$$, $b$$inline_71$$;
  if(this.$main$.$is_sms$ && !this.$isPalConverted$) {
    for($i$$15_i$$inline_68$$ = 0;64 > $i$$15_i$$inline_68$$;$i$$15_i$$inline_68$$++) {
      $r$$inline_69$$ = $i$$15_i$$inline_68$$ & 3, $g$$inline_70$$ = $i$$15_i$$inline_68$$ >> 2 & 3, $b$$inline_71$$ = $i$$15_i$$inline_68$$ >> 4 & 3, this.$main_JAVA$[$i$$15_i$$inline_68$$] = 85 * $r$$inline_69$$ | 85 * $g$$inline_70$$ << 8 | 85 * $b$$inline_71$$ << 16, this.$isPalConverted$ = $JSCompiler_alias_TRUE$$
    }
  }else {
    if(this.$main$.$is_gg$ && !this.$isPalConverted$) {
      for($i$$15_i$$inline_68$$ = 0;256 > $i$$15_i$$inline_68$$;$i$$15_i$$inline_68$$++) {
        $g$$inline_70$$ = $i$$15_i$$inline_68$$ & 15, $b$$inline_71$$ = $i$$15_i$$inline_68$$ >> 4 & 15, this.$GG_JAVA1$[$i$$15_i$$inline_68$$] = $b$$inline_71$$ << 12 | $b$$inline_71$$ << 8 | $g$$inline_70$$ << 4 | $g$$inline_70$$
      }
      for($i$$15_i$$inline_68$$ = 0;16 > $i$$15_i$$inline_68$$;$i$$15_i$$inline_68$$++) {
        this.$GG_JAVA2$[$i$$15_i$$inline_68$$] = $i$$15_i$$inline_68$$ << 20
      }
      this.$isPalConverted$ = $JSCompiler_alias_TRUE$$
    }
  }
  this.$firstByte$ = $JSCompiler_alias_TRUE$$;
  for($i$$15_i$$inline_68$$ = this.$operation$ = this.status = this.$counter$ = this.location = 0;16 > $i$$15_i$$inline_68$$;$i$$15_i$$inline_68$$++) {
    this.$vdpreg$[$i$$15_i$$inline_68$$] = 0
  }
  this.$vdpreg$[2] = 14;
  this.$vdpreg$[5] = 126;
  this.$vScrollLatch$ = 0;
  this.$main$.$cpu$.$interruptLine$ = $JSCompiler_alias_FALSE$$;
  this.$isSatDirty$ = $JSCompiler_alias_TRUE$$;
  this.$minDirty$ = 512;
  this.$maxDirty$ = -1;
  for($i$$15_i$$inline_68$$ = 0;16384 > $i$$15_i$$inline_68$$;$i$$15_i$$inline_68$$++) {
    this.$VRAM$[$i$$15_i$$inline_68$$] = 0
  }
  for($i$$15_i$$inline_68$$ = 0;196608 > $i$$15_i$$inline_68$$;$i$$15_i$$inline_68$$ += 4) {
    this.display[$i$$15_i$$inline_68$$] = 0, this.display[$i$$15_i$$inline_68$$ + 1] = 0, this.display[$i$$15_i$$inline_68$$ + 2] = 0, this.display[$i$$15_i$$inline_68$$ + 3] = 255
  }
}};
function $JSCompiler_StaticMethods_forceFullRedraw$$($JSCompiler_StaticMethods_forceFullRedraw$self$$) {
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$bgt$ = ($JSCompiler_StaticMethods_forceFullRedraw$self$$.$vdpreg$[2] & 14) << 10;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$minDirty$ = 0;
  $JSCompiler_StaticMethods_forceFullRedraw$self$$.$maxDirty$ = 511;
  for(var $i$$16$$ = 0, $l$$1$$ = $JSCompiler_StaticMethods_forceFullRedraw$self$$.$isTileDirty$.length;$i$$16$$ < $l$$1$$;$i$$16$$++) {
    $JSCompiler_StaticMethods_forceFullRedraw$self$$.$isTileDirty$[$i$$16$$] = $JSCompiler_alias_TRUE$$
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
"undefined" != typeof $ && ($.fn.$JSSMSUI$ = function $$$fn$$JSSMSUI$$($roms$$) {
  function $UI$$($root_sms$$5$$) {
    this.$main$ = $root_sms$$5$$;
    var $self$$4$$ = this;
    $root_sms$$5$$ = $("<div></div>");
    var $controls$$ = $('<div class="controls"></div>'), $fullscreenSupport$$ = $JSSMS$Utils$getPrefix$$(["fullscreenEnabled", "mozFullScreenEnabled", "webkitCancelFullScreen"]), $requestAnimationFramePrefix$$ = $JSSMS$Utils$getPrefix$$(["requestAnimationFrame", "msRequestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame", "oRequestAnimationFrame"], window), $i$$24$$;
    if($requestAnimationFramePrefix$$) {
      this.requestAnimationFrame = window[$requestAnimationFramePrefix$$].bind(window)
    }else {
      var $lastTime$$ = 0;
      this.requestAnimationFrame = function $this$requestAnimationFrame$($callback$$52$$) {
        var $currTime$$ = $JSSMS$Utils$getTimestamp$$(), $timeToCall$$ = Math.max(0, 16 - ($currTime$$ - $lastTime$$));
        window.setTimeout(function() {
          $callback$$52$$($currTime$$ + $timeToCall$$)
        }, $timeToCall$$);
        $lastTime$$ = $currTime$$ + $timeToCall$$
      }
    }
    this.$zoomed$ = $JSCompiler_alias_FALSE$$;
    this.$hiddenPrefix$ = $JSSMS$Utils$getPrefix$$(["hidden", "mozHidden", "webkitHidden", "msHidden"]);
    this.screen = $('<canvas width=256 height=192 class="screen"></canvas>');
    this.$canvasContext$ = this.screen[0].getContext("2d");
    if(this.$canvasContext$.getImageData) {
      this.$canvasImageData$ = this.$canvasContext$.getImageData(0, 0, 256, 192);
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
        "" != $self$$4$$.$main$.$romData$ && "" != $self$$4$$.$main$.$romFileName$ && $JSCompiler_StaticMethods_readRomDirectly$$($self$$4$$.$main$, $self$$4$$.$main$.$romData$, $self$$4$$.$main$.$romFileName$) ? ($self$$4$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$4$$.$main$.$vdp$), $self$$4$$.$main$.start()) : $(this).attr("disabled", "disabled")
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
      for($i$$24$$ in this.$buttons$) {
        this.$buttons$.hasOwnProperty($i$$24$$) && this.$buttons$[$i$$24$$].appendTo($controls$$)
      }
      this.log = $('<div id="status"></div>');
      this.screen.appendTo($root_sms$$5$$);
      this.$romContainer$.appendTo($root_sms$$5$$);
      $controls$$.appendTo($root_sms$$5$$);
      this.log.appendTo($root_sms$$5$$);
      $root_sms$$5$$.appendTo($($parent$$2$$));
      $roms$$ != $JSCompiler_alias_VOID$$ && this.$setRoms$($roms$$);
      $(document).bind("keydown", function($evt$$18$$) {
        $self$$4$$.$main$.$keyboard$.keydown($evt$$18$$)
      }).bind("keyup", function($evt$$19$$) {
        $self$$4$$.$main$.$keyboard$.keyup($evt$$19$$)
      })
    }else {
      $($parent$$2$$).html('<div class="alert alert-error"><strong>Oh no!</strong> Your browser doesn\'t support writing pixels directly to the <code>&lt;canvas&gt;</code> tag. Try the latest versions of Firefox, Google Chrome, Opera or Safari!</div>')
    }
  }
  var $parent$$2$$ = this;
  $UI$$.prototype = {reset:function $$UI$$$$reset$() {
    this.screen[0].width = 256;
    this.screen[0].height = 192;
    this.log.text("")
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
      $xhr$$.overrideMimeType != $JSCompiler_alias_VOID$$ && $xhr$$.overrideMimeType("text/plain; charset=x-user-defined");
      return $self$$5$$.xhr = $xhr$$
    }, complete:function($xhr$$1$$, $status$$) {
      var $data$$32$$;
      "error" == $status$$ ? $self$$5$$.updateStatus("The selected rom could not be loaded.") : ($data$$32$$ = $xhr$$1$$.responseText, $JSCompiler_StaticMethods_readRomDirectly$$($self$$5$$.$main$, $data$$32$$, $self$$5$$.$romSelect$.val()), $self$$5$$.$main$.reset(), $JSCompiler_StaticMethods_forceFullRedraw$$($self$$5$$.$main$.$vdp$), $self$$5$$.$main$.start(), $self$$5$$.enable(), $self$$5$$.$buttons$.start.removeAttr("disabled"))
    }})
  }, enable:function $$UI$$$$enable$() {
    this.$buttons$.$restart$.removeAttr("disabled");
    this.$main$.$soundEnabled$ ? this.$buttons$.$sound$.attr("value", "Disable sound") : this.$buttons$.$sound$.attr("value", "Enable sound")
  }, updateStatus:function $$UI$$$$updateStatus$($s$$3$$) {
    this.log.text($s$$3$$)
  }, $writeAudio$:$JSCompiler_emptyFn$$(), $writeFrame$:function $$UI$$$$$writeFrame$$() {
    (!this.$hiddenPrefix$ || !document[this.$hiddenPrefix$]) && this.$canvasContext$.putImageData(this.$canvasImageData$, 0, 0)
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$videoMode$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$line$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$line$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$line$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$line$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$line$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$;
    case 65:
      return $JSCompiler_StaticMethods_in_$self$$.$hCounter$;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$firstByte$ = $JSCompiler_alias_TRUE$$;
      var $statuscopy$$inline_79_value$$inline_76$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$readBuffer$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$readBuffer$ = $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$VRAM$[$JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.location++ & 
      16383] & 255;
      return $statuscopy$$inline_79_value$$inline_76$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$ = $JSCompiler_StaticMethods_in_$self$$.$vdp$, $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$firstByte$ = $JSCompiler_alias_TRUE$$, $statuscopy$$inline_79_value$$inline_76$$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.status, $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.status = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_78_JSCompiler_StaticMethods_dataRead$self$$inline_75_JSCompiler_StaticMethods_getVCount$self$$inline_73_JSCompiler_inline_result$$3$$.$main$.$cpu$.$interruptLine$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_79_value$$inline_76$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller1$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$keyboard$.$controller2$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$ioPorts$[0] | $JSCompiler_StaticMethods_in_$self$$.$ioPorts$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$, $address$$inline_84_old$$inline_90_port_temp$$inline_83$$, $reg$$inline_89_value$$82$$) {
  if(!($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 7 > $address$$inline_84_old$$inline_90_port_temp$$inline_83$$)) {
    switch($address$$inline_84_old$$inline_90_port_temp$$inline_83$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$ioPorts$[0] = ($reg$$inline_89_value$$82$$ & 32) << 1;
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$ioPorts$[1] = $reg$$inline_89_value$$82$$ & 128;
        0 == $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$europe$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$ioPorts$[0] = ~$JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$ioPorts$[0], $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$ioPorts$[1] = 
        ~$JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$ioPorts$[1]);
        break;
      case 128:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$vdp$;
        $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ = 0;
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$firstByte$ = $JSCompiler_alias_TRUE$$;
        switch($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$operation$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location & 16383;
            if($reg$$inline_89_value$$82$$ != ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$VRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$] & 255)) {
              if($address$$inline_84_old$$inline_90_port_temp$$inline_83$$ >= $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$ && $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ < $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$ + 64) {
                $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$
              }else {
                if($address$$inline_84_old$$inline_90_port_temp$$inline_83$$ >= $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$ + 128 && $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ < $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$ + 256) {
                  $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$
                }else {
                  var $tileIndex$$inline_85$$ = $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ >> 5;
                  $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$isTileDirty$[$tileIndex$$inline_85$$] = $JSCompiler_alias_TRUE$$;
                  $tileIndex$$inline_85$$ < $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$minDirty$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$minDirty$ = $tileIndex$$inline_85$$);
                  $tileIndex$$inline_85$$ > $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$maxDirty$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$maxDirty$ = $tileIndex$$inline_85$$)
                }
              }
              $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$VRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$] = $reg$$inline_89_value$$82$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main$.$is_sms$ ? ($address$$inline_84_old$$inline_90_port_temp$$inline_83$$ = 3 * ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location & 31), $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$CRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$] = 
            $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main_JAVA$[$reg$$inline_89_value$$82$$ & 63] & 255, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$CRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$ + 1] = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main_JAVA$[$reg$$inline_89_value$$82$$ & 
            63] >> 8 & 255, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$CRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$ + 2] = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main_JAVA$[$reg$$inline_89_value$$82$$ & 63] >> 16 & 255) : $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main$.$is_gg$ && 
            ($address$$inline_84_old$$inline_90_port_temp$$inline_83$$ = 3 * (($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location & 63) >> 1), 0 == ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location & 1) ? ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$CRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$] = 
            $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$GG_JAVA1$[$reg$$inline_89_value$$82$$] & 255, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$CRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$ + 1] = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$GG_JAVA1$[$reg$$inline_89_value$$82$$] >> 
            8 & 255) : $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$CRAM$[$address$$inline_84_old$$inline_90_port_temp$$inline_83$$ + 2] = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$GG_JAVA2$[$reg$$inline_89_value$$82$$ & 15] >> 16 & 255)
        }
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location++;
        break;
      case 129:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$vdp$;
        if($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$firstByte$) {
          $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$firstByte$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$ = $reg$$inline_89_value$$82$$, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location = 
          $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location & 16128 | $reg$$inline_89_value$$82$$
        }else {
          if($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$firstByte$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$operation$ = $reg$$inline_89_value$$82$$ >> 6 & 3, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location = 
          $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$ | $reg$$inline_89_value$$82$$ << 8, 0 == $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$operation$) {
            $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$readBuffer$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$VRAM$[$JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.location++ & 16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$operation$) {
              $reg$$inline_89_value$$82$$ &= 15;
              switch($reg$$inline_89_value$$82$$) {
                case 1:
                  0 != ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.status & 128) && 0 != ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 32) && ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main$.$cpu$.$interruptLine$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 3) != ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$vdpreg$[$reg$$inline_89_value$$82$$] & 3) && ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = 
                  $JSCompiler_alias_TRUE$$);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$bgt$ = ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$, $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$ = ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$ & 
                  -130) << 7, $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ != $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$ && ($JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$isSatDirty$ = $JSCompiler_alias_TRUE$$, console.log("New address written to SAT: " + $address$$inline_84_old$$inline_90_port_temp$$inline_83$$ + 
                  " -> " + $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$sat$))
              }
              $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$vdpreg$[$reg$$inline_89_value$$82$$] = $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$commandByte$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$main$.$soundEnabled$ && $JSCompiler_StaticMethods_controlWrite$self$$inline_87_JSCompiler_StaticMethods_dataWrite$self$$inline_81_JSCompiler_StaticMethods_out$self$$.$psg$.write($reg$$inline_89_value$$82$$)
    }
  }
}
;window.JSSMS = $JSSMS$$;
jQuery.fn.JSSMSUI = jQuery.fn.$JSSMSUI$;

