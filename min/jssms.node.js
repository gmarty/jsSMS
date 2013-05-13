/*
jsSMS - A Sega Master System/GameGear emulator in JavaScript
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
(function(window){'use strict';var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1;
function $JSCompiler_emptyFn$$() {
  return function() {
  }
}
var $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
function $JSSMS$$($opts$$) {
  this.$i$ = {ui:$JSSMS$DummyUI$$, swfPath:"lib/"};
  if($opts$$ != $JSCompiler_alias_VOID$$) {
    for(var $key$$14$$ in this.$i$) {
      $opts$$[$key$$14$$] != $JSCompiler_alias_VOID$$ && (this.$i$[$key$$14$$] = $opts$$[$key$$14$$])
    }
  }
  this.$e$ = new $JSSMS$Keyboard$$;
  this.$b$ = new $opts$$.ui(this);
  this.$c$ = new $JSSMS$Vdp$$(this);
  this.$d$ = new $JSSMS$SN76489$$;
  this.$f$ = new $JSSMS$Ports$$(this);
  this.$a$ = new $JSSMS$Z80$$(this);
  this.$b$.updateStatus("Ready to load a ROM.");
  this.ui = this.$b$
}
$JSSMS$$.prototype = {$isRunning$:$JSCompiler_alias_FALSE$$, $cyclesPerLine$:0, $no_of_scanlines$:0, $frameSkip$:0, $fps$:0, $frameskip_counter$:0, $pause_button$:$JSCompiler_alias_FALSE$$, $is_sms$:$JSCompiler_alias_TRUE$$, $is_gg$:$JSCompiler_alias_FALSE$$, $soundEnabled$:$JSCompiler_alias_FALSE$$, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $fpsFrameCount$:0, $z80TimeCounter$:0, $drawTimeCounter$:0, $frameCount$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ = this.$c$.$z$, $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ = 3579545) : 1 == $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ && (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ = 
  3546893);
  this.$cyclesPerLine$ = Math.round($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$c$.$z$ = $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ = this.$d$;
    $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$j$ = ($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$e$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$c$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$h$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$f$ = 32768;
    for($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ = 0;4 > $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$;$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$b$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$b$[($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$a$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$] = 
      0, $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$d$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$] = 1, 3 != $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ && ($JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$.$g$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$] = 
      $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $currentAddress$$inline_161_fractional$$inline_14$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $currentAddress$$inline_161_fractional$$inline_14$$, $currentAddress$$inline_161_fractional$$inline_14$$ = $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ - ($JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$] = 
        $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ >> 16
      }
    }
  }
  this.$frameCount$ = 0;
  this.$frameskip_counter$ = this.$frameSkip$;
  this.$e$.reset();
  this.$b$.reset();
  this.$c$.reset();
  this.$f$.reset();
  this.$a$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$ = this.$a$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$V$.$b$.updateStatus("Parsing instructions...");
  console.time("Instructions parsing");
  var $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ = 16384 * $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$rom$.length, $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$, $i$$inline_162$$ = 0, $addresses$$inline_163$$ = [];
  $addresses$$inline_163$$.push(0);
  $addresses$$inline_163$$.push(56);
  for($addresses$$inline_163$$.push(102);$addresses$$inline_163$$.length;) {
    if($currentAddress$$inline_161_fractional$$inline_14$$ = $addresses$$inline_163$$.shift(), !$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$currentAddress$$inline_161_fractional$$inline_14$$]) {
      if($currentAddress$$inline_161_fractional$$inline_14$$ >= $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ || 65 <= $currentAddress$$inline_161_fractional$$inline_14$$ >> 10) {
        console.log("Invalid address", $currentAddress$$inline_161_fractional$$inline_14$$)
      }else {
        var $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$, $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $currentAddress$$inline_161_fractional$$inline_14$$, $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = $JSSMS$Utils$toHex$$;
        $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
        var $opcodesArray$$inline_203_toHex$$inline_225$$ = [$instruction$$inline_160_opcode$$inline_202_options$$inline_224$$], $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "Unknown Opcode", $currAddr$$inline_205_defaultInstruction$$inline_226$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$, $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_alias_NULL$$, $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = 'throw "Unimplemented opcode ' + 
        $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($instruction$$inline_160_opcode$$inline_202_options$$inline_224$$) + '";', $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = "", $code$$inline_223_location$$inline_209$$ = 0;
        $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
        switch($instruction$$inline_160_opcode$$inline_202_options$$inline_224$$) {
          case 0:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "NOP";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 1:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD BC," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setBC(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 2:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (BC),A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getBC(), this.a);";
            break;
          case 3:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC BC";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.incBC();";
            break;
          case 4:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.inc8(this.b);";
            break;
          case 5:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.dec8(this.b);";
            break;
          case 6:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 7:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RLCA";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.rlca_a();";
            break;
          case 8:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "EX AF AF'";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.exAF();";
            break;
          case 9:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD HL,BC";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
            break;
          case 10:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,(BC)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.readMem(this.getBC());";
            break;
          case 11:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC BC";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.decBC();";
            break;
          case 12:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.inc8(this.c);";
            break;
          case 13:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.dec8(this.c);";
            break;
          case 14:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 15:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RRCA";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.rrca_a();";
            break;
          case 16:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 1);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DJNZ (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = (this.b - 1) & 0xff;if (this.b != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 5;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 17:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD DE," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setDE(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 18:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (DE),A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getDE(), this.a);";
            break;
          case 19:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC DE";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.incDE();";
            break;
          case 20:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.inc8(this.d);";
            break;
          case 21:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.dec8(this.d);";
            break;
          case 22:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 23:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RLA";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.rla_a();";
            break;
          case 24:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 1);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JR (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.pc = " + $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ + "; return;";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $JSCompiler_alias_NULL$$;
            break;
          case 25:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD HL,DE";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
            break;
          case 26:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,(DE)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.readMem(this.getDE());";
            break;
          case 27:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC DE";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.decDE();";
            break;
          case 28:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.inc8(this.e);";
            break;
          case 29:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.dec8(this.e);";
            break;
          case 30:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 31:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RRA";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.rra_a();";
            break;
          case 32:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 1);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JR NZ,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if (!((this.f & F_ZERO) != 0)) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 5;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 33:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD HL," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 34:
            $code$$inline_223_location$$inline_209$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($code$$inline_223_location$$inline_209$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + "),HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ", this.l);this.writeMem(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($code$$inline_223_location$$inline_209$$ + 1) + ", this.h);";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 35:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.incHL();";
            break;
          case 36:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.inc8(this.h);";
            break;
          case 37:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.dec8(this.h);";
            break;
          case 38:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 39:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DAA";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.daa();";
            break;
          case 40:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 1);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JR Z,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 5;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 41:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD HL,HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
            break;
          case 42:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD HL,(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(this.readMemWord(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + "));";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 43:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.decHL();";
            break;
          case 44:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.inc8(this.l);";
            break;
          case 45:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.dec8(this.l);";
            break;
          case 46:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 47:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CPL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cpl_a();";
            break;
          case 48:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 1);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JR NC,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if (!((this.f & F_CARRY) != 0)) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 5;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 49:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD SP," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sp = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 50:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + "),A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ", this.a);";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 51:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC SP";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sp++;";
            break;
          case 52:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC (HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.incMem(this.getHL());";
            break;
          case 53:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC (HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.decMem(this.getHL());";
            break;
          case 54:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL)," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 55:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SCF";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
            break;
          case 56:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 1);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JR C,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 5;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 57:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD HL,SP";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
            break;
          case 58:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.readMem(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 59:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC SP";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sp--;";
            break;
          case 60:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "INC A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.inc8(this.a);";
            break;
          case 61:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DEC A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.dec8(this.a);";
            break;
          case 62:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ";";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 63:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CCF";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.ccf();";
            break;
          case 64:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 65:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.c;";
            break;
          case 66:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.d;";
            break;
          case 67:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.e;";
            break;
          case 68:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.h;";
            break;
          case 69:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.l;";
            break;
          case 70:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.readMem(this.getHL());";
            break;
          case 71:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD B,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.b = this.a;";
            break;
          case 72:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.b;";
            break;
          case 73:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 74:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.d;";
            break;
          case 75:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.e;";
            break;
          case 76:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.h;";
            break;
          case 77:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.l;";
            break;
          case 78:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.readMem(this.getHL());";
            break;
          case 79:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD C,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.c = this.a;";
            break;
          case 80:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.b;";
            break;
          case 81:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.c;";
            break;
          case 82:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 83:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.e;";
            break;
          case 84:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.h;";
            break;
          case 85:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.l;";
            break;
          case 86:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.readMem(this.getHL());";
            break;
          case 87:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD D,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.d = this.a;";
            break;
          case 88:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.b;";
            break;
          case 89:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.c;";
            break;
          case 90:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.d;";
            break;
          case 91:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 92:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.h;";
            break;
          case 93:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.l;";
            break;
          case 94:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.readMem(this.getHL());";
            break;
          case 95:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD E,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.e = this.a;";
            break;
          case 96:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.b;";
            break;
          case 97:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.c;";
            break;
          case 98:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.d;";
            break;
          case 99:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.e;";
            break;
          case 100:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 101:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.l;";
            break;
          case 102:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.readMem(this.getHL());";
            break;
          case 103:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD H,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.h = this.a;";
            break;
          case 104:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.b;";
            break;
          case 105:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.c;";
            break;
          case 106:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.d;";
            break;
          case 107:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.e;";
            break;
          case 108:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.h;";
            break;
          case 109:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 110:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.readMem(this.getHL());";
            break;
          case 111:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD L,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.l = this.a;";
            break;
          case 112:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.b);";
            break;
          case 113:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.c);";
            break;
          case 114:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.d);";
            break;
          case 115:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.e);";
            break;
          case 116:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.h);";
            break;
          case 117:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.l);";
            break;
          case 118:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "HALT";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.tstates = 0;";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ += "this.halt = true; this.pc--; return;";
            break;
          case 119:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD (HL),A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.writeMem(this.getHL(), this.a);";
            break;
          case 120:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.b;";
            break;
          case 121:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.c;";
            break;
          case 122:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.d;";
            break;
          case 123:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.e;";
            break;
          case 124:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.h;";
            break;
          case 125:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.l;";
            break;
          case 126:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.readMem(this.getHL());";
            break;
          case 127:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 128:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.b);";
            break;
          case 129:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.c);";
            break;
          case 130:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.d);";
            break;
          case 131:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.e);";
            break;
          case 132:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.h);";
            break;
          case 133:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.l);";
            break;
          case 134:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.readMem(this.getHL()));";
            break;
          case 135:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(this.a);";
            break;
          case 136:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.b);";
            break;
          case 137:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.c);";
            break;
          case 138:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.d);";
            break;
          case 139:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.e);";
            break;
          case 140:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.h);";
            break;
          case 141:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.l);";
            break;
          case 142:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.readMem(this.getHL()));";
            break;
          case 143:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(this.a);";
            break;
          case 144:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.b);";
            break;
          case 145:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.c);";
            break;
          case 146:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.d);";
            break;
          case 147:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.e);";
            break;
          case 148:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.h);";
            break;
          case 149:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.l);";
            break;
          case 150:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.readMem(this.getHL()));";
            break;
          case 151:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sub_a(this.a);";
            break;
          case 152:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.b);";
            break;
          case 153:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.c);";
            break;
          case 154:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.d);";
            break;
          case 155:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.e);";
            break;
          case 156:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.h);";
            break;
          case 157:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.l);";
            break;
          case 158:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.readMem(this.getHL()));";
            break;
          case 159:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(this.a);";
            break;
          case 160:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
            break;
          case 161:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
            break;
          case 162:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
            break;
          case 163:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
            break;
          case 164:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
            break;
          case 165:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
            break;
          case 166:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
            break;
          case 167:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
            break;
          case 168:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
            break;
          case 169:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
            break;
          case 170:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
            break;
          case 171:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
            break;
          case 172:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
            break;
          case 173:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
            break;
          case 174:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
            break;
          case 175:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$m$[0]) + "; this.a = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$(0) + ";";
            break;
          case 176:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
            break;
          case 177:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
            break;
          case 178:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
            break;
          case 179:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
            break;
          case 180:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
            break;
          case 181:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
            break;
          case 182:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
            break;
          case 183:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a];";
            break;
          case 184:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,B";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.b);";
            break;
          case 185:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.c);";
            break;
          case 186:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,D";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.d);";
            break;
          case 187:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,E";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.e);";
            break;
          case 188:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,H";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.h);";
            break;
          case 189:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,L";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.l);";
            break;
          case 190:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,(HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.readMem(this.getHL()));";
            break;
          case 191:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP A,A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(this.a);";
            break;
          case 192:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET NZ";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 193:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "POP BC";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 194:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP NZ,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) == 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 195:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $JSCompiler_alias_NULL$$;
            break;
          case 196:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL NZ (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) == 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 197:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "PUSH BC";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push2(this.b, this.c);";
            break;
          case 198:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADD A," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.add_a(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 199:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 0;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 200:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET Z";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 201:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.pc = this.readMemWord(this.sp); this.sp += 2; return;";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $JSCompiler_alias_NULL$$;
            break;
          case 202:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP Z,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 203:
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = [$JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$];
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "Unimplemented 0xCB prefixed opcode";
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$;
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            switch($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$) {
              case 0:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC B";
                $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = "this.b = (this.rlc(this.b));";
                break;
              case 1:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC C";
                break;
              case 2:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC D";
                break;
              case 3:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC E";
                break;
              case 4:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC H";
                break;
              case 5:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC L";
                break;
              case 6:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC (HL)";
                break;
              case 7:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RLC A";
                break;
              case 8:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC B";
                break;
              case 9:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC C";
                break;
              case 10:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC D";
                break;
              case 11:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC E";
                break;
              case 12:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC H";
                break;
              case 13:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC L";
                break;
              case 14:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC (HL)";
                break;
              case 15:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RRC A";
                break;
              case 16:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL B";
                break;
              case 17:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL C";
                break;
              case 18:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL D";
                break;
              case 19:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL E";
                break;
              case 20:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL H";
                break;
              case 21:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL L";
                break;
              case 22:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL (HL)";
                break;
              case 23:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RL A";
                break;
              case 24:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR B";
                break;
              case 25:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR C";
                break;
              case 26:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR D";
                break;
              case 27:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR E";
                break;
              case 28:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR H";
                break;
              case 29:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR L";
                break;
              case 30:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR (HL)";
                break;
              case 31:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RR A";
                break;
              case 32:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA B";
                break;
              case 33:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA C";
                break;
              case 34:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA D";
                break;
              case 35:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA E";
                break;
              case 36:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA H";
                break;
              case 37:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA L";
                break;
              case 38:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA (HL)";
                break;
              case 39:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLA A";
                break;
              case 40:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA B";
                break;
              case 41:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA C";
                break;
              case 42:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA D";
                break;
              case 43:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA E";
                break;
              case 44:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA H";
                break;
              case 45:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA L";
                break;
              case 46:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA (HL)";
                break;
              case 47:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRA A";
                break;
              case 48:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL B";
                break;
              case 49:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL C";
                break;
              case 50:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL D";
                break;
              case 51:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL E";
                break;
              case 52:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL H";
                break;
              case 53:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL L";
                break;
              case 54:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL (HL)";
                break;
              case 55:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SLL A";
                break;
              case 56:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL B";
                break;
              case 57:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL C";
                break;
              case 58:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL D";
                break;
              case 59:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL E";
                break;
              case 60:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL H";
                break;
              case 61:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL L";
                break;
              case 62:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL (HL)";
                break;
              case 63:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SRL A";
                break;
              case 64:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,B";
                break;
              case 65:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,C";
                break;
              case 66:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,D";
                break;
              case 67:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,E";
                break;
              case 68:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,H";
                break;
              case 69:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,L";
                break;
              case 70:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,(HL)";
                break;
              case 71:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 0,A";
                break;
              case 72:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,B";
                break;
              case 73:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,C";
                break;
              case 74:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,D";
                break;
              case 75:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,E";
                break;
              case 76:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,H";
                break;
              case 77:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,L";
                break;
              case 78:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,(HL)";
                break;
              case 79:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 1,A";
                break;
              case 80:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,B";
                break;
              case 81:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,C";
                break;
              case 82:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,D";
                break;
              case 83:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,E";
                break;
              case 84:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,H";
                break;
              case 85:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,L";
                break;
              case 86:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,(HL)";
                break;
              case 87:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 2,A";
                break;
              case 88:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,B";
                break;
              case 89:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,C";
                break;
              case 90:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,D";
                break;
              case 91:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,E";
                break;
              case 92:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,H";
                break;
              case 93:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,L";
                break;
              case 94:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,(HL)";
                break;
              case 95:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 3,A";
                break;
              case 96:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,B";
                break;
              case 97:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,C";
                break;
              case 98:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,D";
                break;
              case 99:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,E";
                break;
              case 100:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,H";
                break;
              case 101:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,L";
                break;
              case 102:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,(HL)";
                break;
              case 103:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 4,A";
                break;
              case 104:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,B";
                break;
              case 105:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,C";
                break;
              case 106:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,D";
                break;
              case 107:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,E";
                break;
              case 108:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,H";
                break;
              case 109:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,L";
                break;
              case 110:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,(HL)";
                break;
              case 111:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 5,A";
                break;
              case 112:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,B";
                break;
              case 113:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,C";
                break;
              case 114:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,D";
                break;
              case 115:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,E";
                break;
              case 116:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,H";
                break;
              case 117:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,L";
                break;
              case 118:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,(HL)";
                break;
              case 119:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 6,A";
                break;
              case 120:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,B";
                break;
              case 121:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,C";
                break;
              case 122:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,D";
                break;
              case 123:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,E";
                break;
              case 124:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,H";
                break;
              case 125:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,L";
                break;
              case 126:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,(HL)";
                break;
              case 127:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "BIT 7,A";
                break;
              case 128:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,B";
                break;
              case 129:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,C";
                break;
              case 130:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,D";
                break;
              case 131:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,E";
                break;
              case 132:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,H";
                break;
              case 133:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,L";
                break;
              case 134:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,(HL)";
                break;
              case 135:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 0,A";
                break;
              case 136:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,B";
                break;
              case 137:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,C";
                break;
              case 138:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,D";
                break;
              case 139:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,E";
                break;
              case 140:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,H";
                break;
              case 141:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,L";
                break;
              case 142:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,(HL)";
                break;
              case 143:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 1,A";
                break;
              case 144:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,B";
                break;
              case 145:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,C";
                break;
              case 146:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,D";
                break;
              case 147:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,E";
                break;
              case 148:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,H";
                break;
              case 149:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,L";
                break;
              case 150:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,(HL)";
                break;
              case 151:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 2,A";
                break;
              case 152:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,B";
                break;
              case 153:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,C";
                break;
              case 154:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,D";
                break;
              case 155:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,E";
                break;
              case 156:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,H";
                break;
              case 157:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,L";
                break;
              case 158:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,(HL)";
                break;
              case 159:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 3,A";
                break;
              case 160:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,B";
                break;
              case 161:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,C";
                break;
              case 162:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,D";
                break;
              case 163:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,E";
                break;
              case 164:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,H";
                break;
              case 165:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,L";
                break;
              case 166:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,(HL)";
                break;
              case 167:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 4,A";
                break;
              case 168:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,B";
                break;
              case 169:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,C";
                break;
              case 170:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,D";
                break;
              case 171:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,E";
                break;
              case 172:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,H";
                break;
              case 173:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,L";
                break;
              case 174:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,(HL)";
                break;
              case 175:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 5,A";
                break;
              case 176:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,B";
                break;
              case 177:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,C";
                break;
              case 178:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,D";
                break;
              case 179:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,E";
                break;
              case 180:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,H";
                break;
              case 181:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,L";
                break;
              case 182:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,(HL)";
                break;
              case 183:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 6,A";
                break;
              case 184:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,B";
                break;
              case 185:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,C";
                break;
              case 186:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,D";
                break;
              case 187:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,E";
                break;
              case 188:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,H";
                break;
              case 189:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,L";
                break;
              case 190:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,(HL)";
                break;
              case 191:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "RES 7,A";
                break;
              case 192:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,B";
                break;
              case 193:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,C";
                break;
              case 194:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,D";
                break;
              case 195:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,E";
                break;
              case 196:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,H";
                break;
              case 197:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,L";
                break;
              case 198:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,(HL)";
                break;
              case 199:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 0,A";
                break;
              case 200:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,B";
                break;
              case 201:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,C";
                break;
              case 202:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,D";
                break;
              case 203:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,E";
                break;
              case 204:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,H";
                break;
              case 205:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,L";
                break;
              case 206:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,(HL)";
                break;
              case 207:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 1,A";
                break;
              case 208:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,B";
                break;
              case 209:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,C";
                break;
              case 210:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,D";
                break;
              case 211:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,E";
                break;
              case 212:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,H";
                break;
              case 213:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,L";
                break;
              case 214:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,(HL)";
                break;
              case 215:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 2,A";
                break;
              case 216:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,B";
                break;
              case 217:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,C";
                break;
              case 218:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,D";
                break;
              case 219:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,E";
                break;
              case 220:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,H";
                break;
              case 221:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,L";
                break;
              case 222:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,(HL)";
                break;
              case 223:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 3,A";
                break;
              case 224:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,B";
                break;
              case 225:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,C";
                break;
              case 226:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,D";
                break;
              case 227:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,E";
                break;
              case 228:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,H";
                break;
              case 229:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,L";
                break;
              case 230:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,(HL)";
                break;
              case 231:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 4,A";
                break;
              case 232:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,B";
                break;
              case 233:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,C";
                break;
              case 234:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,D";
                break;
              case 235:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,E";
                break;
              case 236:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,H";
                break;
              case 237:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,L";
                break;
              case 238:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,(HL)";
                break;
              case 239:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 5,A";
                break;
              case 240:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,B";
                break;
              case 241:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,C";
                break;
              case 242:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,D";
                break;
              case 243:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,E";
                break;
              case 244:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,H";
                break;
              case 245:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,L";
                break;
              case 246:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,(HL)";
                break;
              case 247:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 6,A";
                break;
              case 248:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,B";
                break;
              case 249:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,C";
                break;
              case 250:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,D";
                break;
              case 251:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,E";
                break;
              case 252:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,H";
                break;
              case 253:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,L";
                break;
              case 254:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,(HL)";
                break;
              case 255:
                $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "SET 7,A"
            }
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$, $opcodes$:$inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$, $inst$:$code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$, code:$code$$inline_216_currAddr$$inline_222_operand$$inline_208$$, $address$:$_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$, $nextAddress$:$address$$inline_200_address$$inline_211_toHex$$inline_218$$};
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$inst$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.code;
            $opcodesArray$$inline_203_toHex$$inline_225$$ = $opcodesArray$$inline_203_toHex$$inline_225$$.concat($_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$opcodes$);
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$nextAddress$;
            break;
          case 204:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL Z (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_ZERO) != 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 205:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 206:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "ADC ," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.adc_a(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 207:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 8;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 208:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET NC";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 209:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "POP DE";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 210:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP NC,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) == 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 211:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OUT (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$)) + "),A";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.port.out(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$)) + ", this.a);";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 212:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL NC (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) == 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 213:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "PUSH DE";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push2(this.d, this.e);";
            break;
          case 214:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SUB " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "";
            break;
          case 215:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 16;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 216:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET C";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 217:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "EXX";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.exBC(); this.exDE(); this.exHL();";
            break;
          case 218:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP C,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 219:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "IN A,(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.a = this.port.in_(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 220:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL C (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_CARRY) != 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 221:
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$, "IX", $address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$inst$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.code;
            $opcodesArray$$inline_203_toHex$$inline_225$$ = $opcodesArray$$inline_203_toHex$$inline_225$$.concat($_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$opcodes$);
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$nextAddress$;
            break;
          case 222:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "SBC A," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sbc_a(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 223:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 24;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 224:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET PO";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_PARITY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 225:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "POP HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 226:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP PO,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_PARITY) == 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 227:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "EX (SP),HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "temp = this.h;this.h = this.readMem(this.sp + 1);this.writeMem(this.sp + 1, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
            break;
          case 228:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL PO (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_PARITY) == 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 229:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "PUSH HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push2(this.h, this.l);";
            break;
          case 230:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "AND (" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a &= " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + "] | F_HALFCARRY;";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 231:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 32;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 232:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET PE";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_PARITY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 233:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP (HL)";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.pc = this.getHL(); return;";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $JSCompiler_alias_NULL$$;
            break;
          case 234:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP PE,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_PARITY) != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 235:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "EX DE,HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
            break;
          case 236:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL PE (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_PARITY) != 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 237:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $address$$inline_200_address$$inline_211_toHex$$inline_218$$;
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $JSSMS$Utils$toHex$$;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = [$inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$];
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "Unimplemented 0xED prefixed opcode";
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$;
            $code$$inline_223_location$$inline_209$$ = 'throw "Unimplemented 0xED prefixed opcode";';
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$++;
            switch($inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$) {
              case 64:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN B,(C)";
                break;
              case 65:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),B";
                break;
              case 66:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "SBC HL,BC";
                break;
              case 67:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD (" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + "),BC";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
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
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "NEG";
                $code$$inline_223_location$$inline_209$$ = "temp = this.a;this.a = 0;this.sub_a(temp);";
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
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "RETN / RETI";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_alias_NULL$$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IM 0";
                break;
              case 71:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD I,A";
                break;
              case 72:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN C,(C)";
                break;
              case 73:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),C";
                break;
              case 74:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "ADC HL,BC";
                break;
              case 75:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD BC,(" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + ")";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 79:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD R,A";
                break;
              case 80:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN D,(C)";
                break;
              case 81:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),D";
                break;
              case 82:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "SBC HL,DE";
                break;
              case 83:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD (" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + "),DE";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 86:
              ;
              case 118:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IM 1";
                $code$$inline_223_location$$inline_209$$ = "this.im = 1;";
                break;
              case 87:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD A,I";
                break;
              case 88:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN E,(C)";
                break;
              case 89:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),E";
                break;
              case 90:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "ADC HL,DE";
                break;
              case 91:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD DE,(" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + ")";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 95:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD A,R";
                $code$$inline_223_location$$inline_209$$ = "this.a = JSSMS.Utils.rndInt(255);";
                $code$$inline_223_location$$inline_209$$ += "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 96:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN H,(C)";
                break;
              case 97:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),H";
                break;
              case 98:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "SBC HL,HL";
                break;
              case 99:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD (" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + "),HL";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 103:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "RRD";
                break;
              case 104:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN L,(C)";
                break;
              case 105:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),L";
                break;
              case 106:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "ADC HL,HL";
                break;
              case 107:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD HL,(" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + ")";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 111:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "RLD";
                break;
              case 113:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),0";
                break;
              case 114:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "SBC HL,SP";
                break;
              case 115:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD (" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + "),SP";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 120:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IN A,(C)";
                break;
              case 121:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUT (C),A";
                break;
              case 122:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "ADC HL,SP";
                break;
              case 123:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LD SP,(" + $address$$inline_200_address$$inline_211_toHex$$inline_218$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$)) + ")";
                $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ += 2;
                break;
              case 160:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LDI";
                break;
              case 161:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "CPI";
                break;
              case 162:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "INI";
                break;
              case 163:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUTI";
                $code$$inline_223_location$$inline_209$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 168:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LDD";
                break;
              case 169:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "CPD";
                break;
              case 170:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "IND";
                break;
              case 171:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OUTD";
                break;
              case 176:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LDIR";
                $code$$inline_223_location$$inline_209$$ = "for(;this.getBC() != 0; this.f |= F_PARITY, this.tstates -= 5) {this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();}";
                $code$$inline_223_location$$inline_209$$ += "if (!(this.getBC() != 0)) this.f &= ~ F_PARITY;this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
                break;
              case 177:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "CPIR";
                break;
              case 178:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "INIR";
                break;
              case 179:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OTIR";
                $code$$inline_223_location$$inline_209$$ = "for(;this.b != 0; this.tstates -= 5) {temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();}";
                $code$$inline_223_location$$inline_209$$ += "if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 184:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "LDDR";
                break;
              case 185:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "CPDR";
                break;
              case 186:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "INDR";
                break;
              case 187:
                $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = "OTDR"
            }
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = {$opcode$:$inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$, $opcodes$:$code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$, $inst$:$_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$, code:$code$$inline_223_location$$inline_209$$, $address$:$code$$inline_216_currAddr$$inline_222_operand$$inline_208$$, $nextAddress$:$address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$, 
            target:$JSCompiler_alias_NULL$$};
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.target;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$inst$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.code;
            $opcodesArray$$inline_203_toHex$$inline_225$$ = $opcodesArray$$inline_203_toHex$$inline_225$$.concat($_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$opcodes$);
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$nextAddress$;
            break;
          case 238:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "XOR A," + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a ^= " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + "];";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 239:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 40;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 240:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET P";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_SIGN) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 241:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "POP AF";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.readMem(this.sp++); this.a = this.readMem(this.sp++);";
            break;
          case 242:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP P,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_SIGN) == 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 243:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "DI";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.iff1 = this.iff2 = false; this.EI_inst = true;";
            break;
          case 244:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL P (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_SIGN) == 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 245:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "PUSH AF";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push2(this.a, this.f);";
            break;
          case 246:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "OR " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.f = this.SZP_TABLE[this.a |= " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + "];";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 247:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 48;
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$);
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;";
            break;
          case 248:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RET M";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_SIGN) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 249:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "LD SP,HL";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.sp = this.getHL()";
            break;
          case 250:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "JP M,(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_SIGN) != 0) {this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 251:
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "EI";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.iff1 = this.iff2 = this.EI_inst = true;";
            break;
          case 252:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$l$($address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CALL M (" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ")";
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "if ((this.f & F_SIGN) != 0) {this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$ + 2) + ");this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + ";this.tstates -= 7;return;}";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ += 2;
            break;
          case 253:
            $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$, "IY", $address$$inline_200_address$$inline_211_toHex$$inline_218$$);
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$inst$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.code;
            $opcodesArray$$inline_203_toHex$$inline_225$$ = $opcodesArray$$inline_203_toHex$$inline_225$$.concat($_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$opcodes$);
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$.$nextAddress$;
            break;
          case 254:
            $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ = $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$.$a$($address$$inline_200_address$$inline_211_toHex$$inline_218$$));
            $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "CP " + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$;
            $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.cp_a(" + $code$$inline_216_currAddr$$inline_222_operand$$inline_208$$ + ");";
            $address$$inline_200_address$$inline_211_toHex$$inline_218$$++;
            break;
          case 255:
            $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = 56, $inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$ = "RST " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$), $code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$ = "this.push1(" + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_200_address$$inline_211_toHex$$inline_218$$) + 
            "); this.pc = " + $_inst$$inline_210_currAddr$$inline_215_inst$$inline_221_toHex$$inline_201$$($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$) + "; return;"
        }
        $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$ = {$opcode$:$instruction$$inline_160_opcode$$inline_202_options$$inline_224$$, $opcodes$:$opcodesArray$$inline_203_toHex$$inline_225$$, $inst$:$inst$$inline_204_opcode$$inline_219_opcodesArray$$inline_213$$, code:$code$$inline_207_inst$$inline_214_opcodesArray$$inline_220$$, $address$:$currAddr$$inline_205_defaultInstruction$$inline_226$$, $nextAddress$:$address$$inline_200_address$$inline_211_toHex$$inline_218$$, target:$address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$};
        $opcodesArray$$inline_203_toHex$$inline_225$$ = $JSSMS$Utils$toHex$$;
        $currAddr$$inline_205_defaultInstruction$$inline_226$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:$JSCompiler_alias_NULL$$, target:$JSCompiler_alias_NULL$$, $isJumpTarget$:$JSCompiler_alias_FALSE$$, label:""};
        $JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$ = $JSCompiler_alias_VOID$$;
        $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = "";
        for($JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$ in $currAddr$$inline_205_defaultInstruction$$inline_226$$) {
          $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$[$JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$] != $JSCompiler_alias_VOID$$ && ($currAddr$$inline_205_defaultInstruction$$inline_226$$[$JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$] = $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$[$JSCompiler_StaticMethods_disassemble$self$$inline_199_opcode$$inline_212_prop$$inline_227$$])
        }
        $currAddr$$inline_205_defaultInstruction$$inline_226$$.$hexAddress$ = $opcodesArray$$inline_203_toHex$$inline_225$$($currAddr$$inline_205_defaultInstruction$$inline_226$$.$address$);
        $currAddr$$inline_205_defaultInstruction$$inline_226$$.$opcodes$.length && ($address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ = $currAddr$$inline_205_defaultInstruction$$inline_226$$.$opcodes$.map($opcodesArray$$inline_203_toHex$$inline_225$$).join(" ") + " ");
        $currAddr$$inline_205_defaultInstruction$$inline_226$$.label = $currAddr$$inline_205_defaultInstruction$$inline_226$$.$hexAddress$ + " " + $address$$inline_217_hexOpcodes$$inline_228_target$$inline_206$$ + $currAddr$$inline_205_defaultInstruction$$inline_226$$.$inst$;
        $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$ = $currAddr$$inline_205_defaultInstruction$$inline_226$$;
        $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$currentAddress$$inline_161_fractional$$inline_14$$] = $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$;
        $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$.$nextAddress$ != $JSCompiler_alias_NULL$$ && $addresses$$inline_163$$.push($instruction$$inline_160_opcode$$inline_202_options$$inline_224$$.$nextAddress$);
        $instruction$$inline_160_opcode$$inline_202_options$$inline_224$$.target != $JSCompiler_alias_NULL$$ && $addresses$$inline_163$$.push($instruction$$inline_160_opcode$$inline_202_options$$inline_224$$.target)
      }
    }
  }
  for($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[0].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;$i$$inline_162$$ < $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$;$i$$inline_162$$++) {
    $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$] && $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target] ? 
    $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target].$isJumpTarget$ = $JSCompiler_alias_TRUE$$ : console.log("Invalid target address", $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target))
  }
  console.timeEnd("Instructions parsing");
  $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$V$.$b$.updateStatus("Instructions parsed");
  clearInterval(this.$g$)
}, $JSSMS_prototype$start$:function $$JSSMS$$$$$JSSMS_prototype$start$$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = $JSCompiler_alias_TRUE$$);
  this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen);
  this.$h$ = $JSSMS$Utils$getTimestamp$$();
  this.$fpsFrameCount$ = 0;
  this.$g$ = setInterval(function() {
    var $now$$inline_21$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$b$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_21$$ - $self$$1$$.$h$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$h$ = $now$$inline_21$$
  }, 500);
  this.$b$.updateStatus("Running")
}, $JSSMS_prototype$stop$:function $$JSSMS$$$$$JSSMS_prototype$stop$$() {
  clearInterval(this.$g$);
  this.$isRunning$ = $JSCompiler_alias_FALSE$$
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  if(this.$isRunning$) {
    for(var $startTime$$inline_24$$ = 0, $lineno$$inline_25$$ = 0;$lineno$$inline_25$$ < this.$no_of_scanlines$;$lineno$$inline_25$$++) {
      var $startTime$$inline_24$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_run$self$$inline_165$$ = this.$a$, $location$$inline_167$$ = 0, $opcode$$inline_168$$ = 0, $temp$$inline_169$$ = 0;
      $JSCompiler_StaticMethods_run$self$$inline_165$$.$o$ += this.$cyclesPerLine$;
      if($JSCompiler_StaticMethods_run$self$$inline_165$$.$B$) {
        var $JSCompiler_StaticMethods_interrupt$self$$inline_230$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
        $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$z$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$F$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$d$++, $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$F$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$z$ = $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$A$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$B$ = $JSCompiler_alias_FALSE$$, 
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$inline_230$$, $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$d$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$G$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$d$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$H$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$H$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$H$, $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$o$ -= 
        13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$G$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$d$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$d$ = $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$l$(($JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$K$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$H$), $JSCompiler_StaticMethods_interrupt$self$$inline_230$$.$o$ -= 
        19))
      }
      for(;0 < $JSCompiler_StaticMethods_run$self$$inline_165$$.$o$;) {
        switch($opcode$$inline_168$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $JSCompiler_StaticMethods_run$self$$inline_165$$.$o$ -= $OP_STATES$$[$opcode$$inline_168$$], $opcode$$inline_168$$) {
          case 1:
            var $JSCompiler_StaticMethods_setBC$self$$inline_366$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_367$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            $JSCompiler_StaticMethods_setBC$self$$inline_366$$.$g$ = $value$$inline_367$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_366$$.$f$ = $value$$inline_367$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++;
            break;
          case 2:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 3:
            var $JSCompiler_StaticMethods_incBC$self$$inline_232$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
            $JSCompiler_StaticMethods_incBC$self$$inline_232$$.$f$ = $JSCompiler_StaticMethods_incBC$self$$inline_232$$.$f$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incBC$self$$inline_232$$.$f$ && ($JSCompiler_StaticMethods_incBC$self$$inline_232$$.$g$ = $JSCompiler_StaticMethods_incBC$self$$inline_232$$.$g$ + 1 & 255);
            break;
          case 4:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 5:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 6:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 7:
            var $JSCompiler_StaticMethods_rlca_a$self$$inline_234$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_235$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_234$$.$b$ >> 7;
            $JSCompiler_StaticMethods_rlca_a$self$$inline_234$$.$b$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_234$$.$b$ << 1 & 255 | $carry$$inline_235$$;
            $JSCompiler_StaticMethods_rlca_a$self$$inline_234$$.$c$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_234$$.$c$ & 236 | $carry$$inline_235$$;
            break;
          case 8:
            var $JSCompiler_StaticMethods_exAF$self$$inline_237$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_238$$ = $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$b$;
            $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$b$ = $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$M$;
            $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$M$ = $temp$$inline_238$$;
            $temp$$inline_238$$ = $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$c$;
            $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$c$ = $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$R$;
            $JSCompiler_StaticMethods_exAF$self$$inline_237$$.$R$ = $temp$$inline_238$$;
            break;
          case 9:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 10:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 11:
            $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 12:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 13:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 14:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 15:
            var $JSCompiler_StaticMethods_rrca_a$self$$inline_240$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_241$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_240$$.$b$ & 1;
            $JSCompiler_StaticMethods_rrca_a$self$$inline_240$$.$b$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_240$$.$b$ >> 1 | $carry$$inline_241$$ << 7;
            $JSCompiler_StaticMethods_rrca_a$self$$inline_240$$.$c$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_240$$.$c$ & 236 | $carry$$inline_241$$;
            break;
          case 16:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ - 1 & 255;
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 17:
            var $JSCompiler_StaticMethods_setDE$self$$inline_369$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_370$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            $JSCompiler_StaticMethods_setDE$self$$inline_369$$.$j$ = $value$$inline_370$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_369$$.$h$ = $value$$inline_370$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++;
            break;
          case 18:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 19:
            $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 20:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 21:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 22:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 23:
            var $JSCompiler_StaticMethods_rla_a$self$$inline_243$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_244$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_243$$.$b$ >> 7;
            $JSCompiler_StaticMethods_rla_a$self$$inline_243$$.$b$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_243$$.$b$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_243$$.$c$ & 1) & 255;
            $JSCompiler_StaticMethods_rla_a$self$$inline_243$$.$c$ = $JSCompiler_StaticMethods_rla_a$self$$inline_243$$.$c$ & 236 | $carry$$inline_244$$;
            break;
          case 24:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_run$self$$inline_165$$) + 1);
            break;
          case 25:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 26:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 27:
            $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 28:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 29:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 30:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 31:
            var $JSCompiler_StaticMethods_rra_a$self$$inline_246$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_247$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_246$$.$b$ & 1;
            $JSCompiler_StaticMethods_rra_a$self$$inline_246$$.$b$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_246$$.$b$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_246$$.$c$ & 1) << 7) & 255;
            $JSCompiler_StaticMethods_rra_a$self$$inline_246$$.$c$ = $JSCompiler_StaticMethods_rra_a$self$$inline_246$$.$c$ & 236 | $carry$$inline_247$$;
            break;
          case 32:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 33:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++;
            break;
          case 34:
            $location$$inline_167$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($location$$inline_167$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$(++$location$$inline_167$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ += 2;
            break;
          case 35:
            $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 36:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 37:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 38:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 39:
            var $JSCompiler_StaticMethods_daa$self$$inline_249$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_250$$ = $JSCompiler_StaticMethods_daa$self$$inline_249$$.$U$[$JSCompiler_StaticMethods_daa$self$$inline_249$$.$b$ | ($JSCompiler_StaticMethods_daa$self$$inline_249$$.$c$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_249$$.$c$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_249$$.$c$ & 16) << 6];
            $JSCompiler_StaticMethods_daa$self$$inline_249$$.$b$ = $temp$$inline_250$$ & 255;
            $JSCompiler_StaticMethods_daa$self$$inline_249$$.$c$ = $JSCompiler_StaticMethods_daa$self$$inline_249$$.$c$ & 2 | $temp$$inline_250$$ >> 8;
            break;
          case 40:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 41:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 42:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$)));
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ += 2;
            break;
          case 43:
            $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 44:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 45:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 46:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 47:
            var $JSCompiler_StaticMethods_cpl_a$self$$inline_252$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
            $JSCompiler_StaticMethods_cpl_a$self$$inline_252$$.$b$ ^= 255;
            $JSCompiler_StaticMethods_cpl_a$self$$inline_252$$.$c$ |= 18;
            break;
          case 48:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 49:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ += 2;
            break;
          case 50:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ += 2;
            break;
          case 51:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$++;
            break;
          case 52:
            $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 53:
            $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 54:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 55:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ |= 1;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ &= -3;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ &= -17;
            break;
          case 56:
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 57:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$));
            break;
          case 58:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$));
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ += 2;
            break;
          case 59:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$--;
            break;
          case 60:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 61:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 62:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            break;
          case 63:
            var $JSCompiler_StaticMethods_ccf$self$$inline_254$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
            0 != ($JSCompiler_StaticMethods_ccf$self$$inline_254$$.$c$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_254$$.$c$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_254$$.$c$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_254$$.$c$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_254$$.$c$ &= -17);
            $JSCompiler_StaticMethods_ccf$self$$inline_254$$.$c$ &= -3;
            break;
          case 65:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$;
            break;
          case 66:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            break;
          case 67:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            break;
          case 68:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            break;
          case 69:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            break;
          case 70:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 71:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$;
            break;
          case 72:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$;
            break;
          case 74:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            break;
          case 75:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            break;
          case 76:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            break;
          case 77:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            break;
          case 78:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 79:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$;
            break;
          case 80:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$;
            break;
          case 81:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$;
            break;
          case 83:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            break;
          case 84:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            break;
          case 85:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            break;
          case 86:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 87:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$;
            break;
          case 88:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$;
            break;
          case 89:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$;
            break;
          case 90:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            break;
          case 92:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            break;
          case 93:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            break;
          case 94:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 95:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$;
            break;
          case 96:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$;
            break;
          case 97:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$;
            break;
          case 98:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            break;
          case 99:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            break;
          case 101:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            break;
          case 102:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 103:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$;
            break;
          case 104:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$;
            break;
          case 105:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$;
            break;
          case 106:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            break;
          case 107:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            break;
          case 108:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            break;
          case 110:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 111:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$;
            break;
          case 112:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 113:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 114:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 115:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 116:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 117:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 118:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$o$ = 0;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$F$ = $JSCompiler_alias_TRUE$$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$--;
            break;
          case 119:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 120:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$;
            break;
          case 121:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$;
            break;
          case 122:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            break;
          case 123:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            break;
          case 124:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            break;
          case 125:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            break;
          case 126:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$));
            break;
          case 128:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 129:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 130:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 131:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 132:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 133:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 134:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 135:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 136:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 137:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 138:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 139:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 140:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 141:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 142:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 143:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 144:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 145:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 146:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 147:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 148:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 149:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 150:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 151:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 152:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 153:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 154:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 155:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 156:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 157:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 158:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 159:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 160:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$] | 16;
            break;
          case 161:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$] | 16;
            break;
          case 162:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$] | 16;
            break;
          case 163:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$] | 16;
            break;
          case 164:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$] | 16;
            break;
          case 165:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$] | 16;
            break;
          case 166:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$))] | 16;
            break;
          case 167:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$] | 16;
            break;
          case 168:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$];
            break;
          case 169:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$];
            break;
          case 170:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$];
            break;
          case 171:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$];
            break;
          case 172:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$];
            break;
          case 173:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$];
            break;
          case 174:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$))];
            break;
          case 175:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = 0];
            break;
          case 176:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$];
            break;
          case 177:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$];
            break;
          case 178:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$];
            break;
          case 179:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$];
            break;
          case 180:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$];
            break;
          case 181:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$];
            break;
          case 182:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$))];
            break;
          case 183:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$];
            break;
          case 184:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 185:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 186:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$);
            break;
          case 187:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 188:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$);
            break;
          case 189:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 190:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$)));
            break;
          case 191:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 192:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 193:
            var $JSCompiler_StaticMethods_setBC$self$$inline_372$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_373$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$);
            $JSCompiler_StaticMethods_setBC$self$$inline_372$$.$g$ = $value$$inline_373$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_372$$.$f$ = $value$$inline_373$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ += 2;
            break;
          case 194:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 195:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            break;
          case 196:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 197:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$f$);
            break;
          case 198:
            $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 199:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 0;
            break;
          case 200:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 201:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ += 2;
            break;
          case 202:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 203:
            var $JSCompiler_StaticMethods_doCB$self$$inline_256$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_257$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_257$$];
            switch($opcode$$inline_257$$) {
              case 0:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 1:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 2:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 3:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 4:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 5:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 6:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 7:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 8:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 9:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 10:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 11:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 12:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 13:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 14:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 15:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 16:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 17:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 18:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 19:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 20:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 21:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 22:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 23:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 24:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 25:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 26:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 27:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 28:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 29:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 30:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 31:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 32:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 33:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 34:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 35:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 36:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 39:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 40:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 41:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 42:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 43:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 44:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 47:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 48:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 49:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 50:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 51:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 52:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 53:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 54:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 55:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 56:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$);
                break;
              case 57:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$);
                break;
              case 58:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$);
                break;
              case 59:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$);
                break;
              case 60:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$);
                break;
              case 61:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$);
                break;
              case 62:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$))));
                break;
              case 63:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$);
                break;
              case 64:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 1);
                break;
              case 65:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 1);
                break;
              case 66:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 1);
                break;
              case 67:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 1);
                break;
              case 68:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 1);
                break;
              case 69:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 1);
                break;
              case 70:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 1);
                break;
              case 71:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 1);
                break;
              case 72:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 2);
                break;
              case 73:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 2);
                break;
              case 74:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 2);
                break;
              case 75:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 2);
                break;
              case 76:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 2);
                break;
              case 77:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 2);
                break;
              case 78:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 2);
                break;
              case 79:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 2);
                break;
              case 80:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 4);
                break;
              case 81:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 4);
                break;
              case 82:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 4);
                break;
              case 83:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 4);
                break;
              case 84:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 4);
                break;
              case 85:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 4);
                break;
              case 86:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 4);
                break;
              case 87:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 4);
                break;
              case 88:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 8);
                break;
              case 89:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 8);
                break;
              case 90:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 8);
                break;
              case 91:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 8);
                break;
              case 92:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 8);
                break;
              case 93:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 8);
                break;
              case 94:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 8);
                break;
              case 95:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 8);
                break;
              case 96:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 16);
                break;
              case 97:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 16);
                break;
              case 98:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 16);
                break;
              case 99:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 16);
                break;
              case 100:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 16);
                break;
              case 101:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 16);
                break;
              case 102:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 16);
                break;
              case 103:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 16);
                break;
              case 104:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 32);
                break;
              case 105:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 32);
                break;
              case 106:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 32);
                break;
              case 107:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 32);
                break;
              case 108:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 32);
                break;
              case 109:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 32);
                break;
              case 110:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 32);
                break;
              case 111:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 32);
                break;
              case 112:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 64);
                break;
              case 113:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 64);
                break;
              case 114:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 64);
                break;
              case 115:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 64);
                break;
              case 116:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 64);
                break;
              case 117:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 64);
                break;
              case 118:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 64);
                break;
              case 119:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 64);
                break;
              case 120:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ & 128);
                break;
              case 121:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ & 128);
                break;
              case 122:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ & 128);
                break;
              case 123:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ & 128);
                break;
              case 124:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ & 128);
                break;
              case 125:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ & 128);
                break;
              case 126:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & 128);
                break;
              case 127:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$, $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ & 128);
                break;
              case 128:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -2;
                break;
              case 129:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -2;
                break;
              case 130:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -2;
                break;
              case 131:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -2;
                break;
              case 132:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -2;
                break;
              case 133:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -2;
                break;
              case 134:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -2);
                break;
              case 135:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -2;
                break;
              case 136:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -3;
                break;
              case 137:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -3;
                break;
              case 138:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -3;
                break;
              case 139:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -3;
                break;
              case 140:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -3;
                break;
              case 141:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -3;
                break;
              case 142:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -3);
                break;
              case 143:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -3;
                break;
              case 144:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -5;
                break;
              case 145:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -5;
                break;
              case 146:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -5;
                break;
              case 147:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -5;
                break;
              case 148:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -5;
                break;
              case 149:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -5;
                break;
              case 150:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -5);
                break;
              case 151:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -5;
                break;
              case 152:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -9;
                break;
              case 153:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -9;
                break;
              case 154:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -9;
                break;
              case 155:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -9;
                break;
              case 156:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -9;
                break;
              case 157:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -9;
                break;
              case 158:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -9);
                break;
              case 159:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -9;
                break;
              case 160:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -17;
                break;
              case 161:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -17;
                break;
              case 162:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -17;
                break;
              case 163:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -17;
                break;
              case 164:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -17;
                break;
              case 165:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -17;
                break;
              case 166:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -17);
                break;
              case 167:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -17;
                break;
              case 168:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -33;
                break;
              case 169:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -33;
                break;
              case 170:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -33;
                break;
              case 171:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -33;
                break;
              case 172:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -33;
                break;
              case 173:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -33;
                break;
              case 174:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -33);
                break;
              case 175:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -33;
                break;
              case 176:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -65;
                break;
              case 177:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -65;
                break;
              case 178:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -65;
                break;
              case 179:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -65;
                break;
              case 180:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -65;
                break;
              case 181:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -65;
                break;
              case 182:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -65);
                break;
              case 183:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -65;
                break;
              case 184:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ &= -129;
                break;
              case 185:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ &= -129;
                break;
              case 186:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ &= -129;
                break;
              case 187:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ &= -129;
                break;
              case 188:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ &= -129;
                break;
              case 189:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ &= -129;
                break;
              case 190:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) & -129);
                break;
              case 191:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ &= -129;
                break;
              case 192:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 1;
                break;
              case 193:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 1;
                break;
              case 194:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 1;
                break;
              case 195:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 1;
                break;
              case 196:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 1;
                break;
              case 197:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 1;
                break;
              case 198:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 1);
                break;
              case 199:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 1;
                break;
              case 200:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 2;
                break;
              case 201:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 2;
                break;
              case 202:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 2;
                break;
              case 203:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 2;
                break;
              case 204:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 2;
                break;
              case 205:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 2;
                break;
              case 206:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 2);
                break;
              case 207:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 2;
                break;
              case 208:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 4;
                break;
              case 209:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 4;
                break;
              case 210:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 4;
                break;
              case 211:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 4;
                break;
              case 212:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 4;
                break;
              case 213:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 4;
                break;
              case 214:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 4);
                break;
              case 215:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 4;
                break;
              case 216:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 8;
                break;
              case 217:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 8;
                break;
              case 218:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 8;
                break;
              case 219:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 8;
                break;
              case 220:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 8;
                break;
              case 221:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 8;
                break;
              case 222:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 8);
                break;
              case 223:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 8;
                break;
              case 224:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 16;
                break;
              case 225:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 16;
                break;
              case 226:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 16;
                break;
              case 227:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 16;
                break;
              case 228:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 16;
                break;
              case 229:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 16;
                break;
              case 230:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 16);
                break;
              case 231:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 16;
                break;
              case 232:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 32;
                break;
              case 233:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 32;
                break;
              case 234:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 32;
                break;
              case 235:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 32;
                break;
              case 236:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 32;
                break;
              case 237:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 32;
                break;
              case 238:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 32);
                break;
              case 239:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 32;
                break;
              case 240:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 64;
                break;
              case 241:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 64;
                break;
              case 242:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 64;
                break;
              case 243:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 64;
                break;
              case 244:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 64;
                break;
              case 245:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 64;
                break;
              case 246:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 64);
                break;
              case 247:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 64;
                break;
              case 248:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$g$ |= 128;
                break;
              case 249:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$f$ |= 128;
                break;
              case 250:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$j$ |= 128;
                break;
              case 251:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$h$ |= 128;
                break;
              case 252:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$k$ |= 128;
                break;
              case 253:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$i$ |= 128;
                break;
              case 254:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$), $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_256$$)) | 128);
                break;
              case 255:
                $JSCompiler_StaticMethods_doCB$self$$inline_256$$.$b$ |= 128;
                break;
              default:
                console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_257$$))
            }
            break;
          case 204:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 64));
            break;
          case 205:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ + 2);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            break;
          case 206:
            $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 207:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 8;
            break;
          case 208:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 209:
            var $JSCompiler_StaticMethods_setDE$self$$inline_375$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_376$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$);
            $JSCompiler_StaticMethods_setDE$self$$inline_375$$.$j$ = $value$$inline_376$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_375$$.$h$ = $value$$inline_376$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ += 2;
            break;
          case 210:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 211:
            $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_run$self$$inline_165$$.$t$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 212:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 213:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$);
            break;
          case 214:
            $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 215:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 16;
            break;
          case 216:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 217:
            var $JSCompiler_StaticMethods_exBC$self$$inline_259$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_260$$ = $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$g$;
            $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$g$ = $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$N$;
            $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$N$ = $temp$$inline_260$$;
            $temp$$inline_260$$ = $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$f$;
            $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$f$ = $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$O$;
            $JSCompiler_StaticMethods_exBC$self$$inline_259$$.$O$ = $temp$$inline_260$$;
            var $JSCompiler_StaticMethods_exDE$self$$inline_262$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_263$$ = $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$j$;
            $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$j$ = $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$P$;
            $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$P$ = $temp$$inline_263$$;
            $temp$$inline_263$$ = $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$h$;
            $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$h$ = $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$Q$;
            $JSCompiler_StaticMethods_exDE$self$$inline_262$$.$Q$ = $temp$$inline_263$$;
            var $JSCompiler_StaticMethods_exHL$self$$inline_265$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_266$$ = $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$k$;
            $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$k$ = $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$S$;
            $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$S$ = $temp$$inline_266$$;
            $temp$$inline_266$$ = $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$i$;
            $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$i$ = $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$T$;
            $JSCompiler_StaticMethods_exHL$self$$inline_265$$.$T$ = $temp$$inline_266$$;
            break;
          case 218:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 219:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_run$self$$inline_165$$.$t$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 220:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 1));
            break;
          case 221:
            var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_269$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $location$$inline_270$$ = 0, $temp$$inline_271$$ = 0;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_269$$];
            switch($opcode$$inline_269$$) {
              case 9:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$ += 2;
                break;
              case 34:
                $location$$inline_270$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($location$$inline_270$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($location$$inline_270$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                break;
              case 42:
                $location$$inline_270$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($location$$inline_270$$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$(++$location$$inline_270$$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$));
                break;
              case 68:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$;
                break;
              case 69:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$;
                break;
              case 70:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$;
                break;
              case 77:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$;
                break;
              case 78:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$;
                break;
              case 85:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$;
                break;
              case 86:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$;
                break;
              case 93:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$;
                break;
              case 94:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$g$;
                break;
              case 97:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$f$;
                break;
              case 98:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$j$;
                break;
              case 99:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$h$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$;
                break;
              case 102:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$g$;
                break;
              case 105:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$f$;
                break;
              case 106:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$j$;
                break;
              case 107:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$h$;
                break;
              case 108:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$g$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$f$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$j$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$h$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$k$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$i$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$;
                break;
              case 125:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$;
                break;
              case 126:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$))] | 16;
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$];
                break;
              case 173:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$];
                break;
              case 174:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$))];
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$];
                break;
              case 181:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$];
                break;
              case 182:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$))];
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$ += 2;
                break;
              case 227:
                $temp$$inline_271$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$);
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$, $temp$$inline_271$$ & 255);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$ + 1, $temp$$inline_271$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$r$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$p$);
                break;
              case 233:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$n$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$);
                break;
              default:
                console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_269$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_268$$.$d$--
            }
            break;
          case 222:
            $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 223:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 24;
            break;
          case 224:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 4));
            break;
          case 225:
            $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$));
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ += 2;
            break;
          case 226:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 4));
            break;
          case 227:
            $temp$$inline_169$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ + 1);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ + 1, $temp$$inline_169$$);
            $temp$$inline_169$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$, $temp$$inline_169$$);
            break;
          case 228:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 4));
            break;
          case 229:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$);
            break;
          case 230:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ &= $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++)] | 16;
            break;
          case 231:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 32;
            break;
          case 232:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 4));
            break;
          case 233:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 234:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 4));
            break;
          case 235:
            $temp$$inline_169$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$j$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$k$ = $temp$$inline_169$$;
            $temp$$inline_169$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$h$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$i$ = $temp$$inline_169$$;
            break;
          case 236:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 4));
            break;
          case 237:
            var $JSCompiler_StaticMethods_doED$self$$inline_273$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_274$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$), $temp$$inline_275$$ = 0, $location$$inline_276$$ = 0, $hlmem$$inline_277$$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_274$$];
            switch($opcode$$inline_274$$) {
              case 64:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 65:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 66:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 67:
                $location$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$++, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
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
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ = 0;
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
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
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$ += 2;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$z$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$A$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$G$ = 0;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 71:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$K$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 72:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 73:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 74:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 75:
                var $JSCompiler_StaticMethods_setBC$self$$inline_378$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$, $value$$inline_379$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1));
                $JSCompiler_StaticMethods_setBC$self$$inline_378$$.$g$ = $value$$inline_379$$ >> 8;
                $JSCompiler_StaticMethods_setBC$self$$inline_378$$.$f$ = $value$$inline_379$$ & 255;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 79:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 80:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$j$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 81:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$j$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 82:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 83:
                $location$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$++, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$h$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$j$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 86:
              ;
              case 118:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$G$ = 1;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 87:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$K$;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$L$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$] | ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$A$ ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 88:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$h$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 89:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$h$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 90:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 91:
                var $JSCompiler_StaticMethods_setDE$self$$inline_381$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$, $value$$inline_382$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1));
                $JSCompiler_StaticMethods_setDE$self$$inline_381$$.$j$ = $value$$inline_382$$ >> 8;
                $JSCompiler_StaticMethods_setDE$self$$inline_381$$.$h$ = $value$$inline_382$$ & 255;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 95:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ = Math.round(255 * Math.random());
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$L$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$] | ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$A$ ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$k$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$k$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 97:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$k$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 98:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 99:
                $location$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$++, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$k$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 103:
                $location$$inline_276$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $hlmem$$inline_277$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($location$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$, $hlmem$$inline_277$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ & 15) << 4);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ & 240 | $hlmem$$inline_277$$ & 15;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 104:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 105:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 106:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 107:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1)));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 111:
                $location$$inline_276$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $hlmem$$inline_277$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($location$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$, ($hlmem$$inline_277$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ & 15);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ & 240 | $hlmem$$inline_277$$ >> 4;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, 0);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 115:
                $location$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$++, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$ & 255);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($location$$inline_276$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$ >> 8);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 120:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_273$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 121:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$b$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 122:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 123:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$n$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ + 1));
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$ += 3;
                break;
              case 160:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 161:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $temp$$inline_275$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? 0 : 4;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 248 | $temp$$inline_275$$;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 162:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 128 == ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 163:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $temp$$inline_275$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                255 < $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$ + $temp$$inline_275$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 128 == ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 168:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 169:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $temp$$inline_275$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? 0 : 4;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 248 | $temp$$inline_275$$;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 170:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 0 != ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 171:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $temp$$inline_275$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                255 < $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$ + $temp$$inline_275$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 128 == ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                break;
              case 176:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -3;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -17;
                break;
              case 177:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $temp$$inline_275$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? 0 : 4;
                0 != ($temp$$inline_275$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 248 | $temp$$inline_275$$;
                break;
              case 178:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 128 == ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                break;
              case 179:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                255 < $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$ + $temp$$inline_275$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 0 != ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                break;
              case 184:
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -3;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -17;
                break;
              case 185:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                $temp$$inline_275$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_273$$) ? 0 : 4;
                0 != ($temp$$inline_275$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & 248 | $temp$$inline_275$$;
                break;
              case 186:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$), $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 0 != ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                break;
              case 187:
                $temp$$inline_275$$ = $JSCompiler_StaticMethods_doED$self$$inline_273$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_273$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$f$, $temp$$inline_275$$);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_273$$, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_273$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_273$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++;
                255 < $JSCompiler_StaticMethods_doED$self$$inline_273$$.$i$ + $temp$$inline_275$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ = 0 != ($temp$$inline_275$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_273$$.$c$ & -3;
                break;
              default:
                console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_274$$)), $JSCompiler_StaticMethods_doED$self$$inline_273$$.$d$++
            }
            break;
          case 238:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ ^= $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++)];
            break;
          case 239:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 40;
            break;
          case 240:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 241:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$++);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$++);
            break;
          case 242:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 243:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$z$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$A$ = $JSCompiler_alias_FALSE$$;
            break;
          case 244:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 == ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 245:
            $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$);
            break;
          case 246:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$m$[$JSCompiler_StaticMethods_run$self$$inline_165$$.$b$ |= $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++)];
            break;
          case 247:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$);
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 48;
            break;
          case 248:
            $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 249:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$n$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_run$self$$inline_165$$);
            break;
          case 250:
            $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 251:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$z$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$A$ = $JSCompiler_alias_TRUE$$;
            break;
          case 252:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 253:
            var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_280$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $location$$inline_281$$ = $JSCompiler_alias_VOID$$, $temp$$inline_282$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_280$$];
            switch($opcode$$inline_280$$) {
              case 9:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$ += 2;
                break;
              case 34:
                $location$$inline_281$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($location$$inline_281$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($location$$inline_281$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                break;
              case 42:
                $location$$inline_281$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($location$$inline_281$$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$(++$location$$inline_281$$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$));
                break;
              case 68:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$;
                break;
              case 69:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$;
                break;
              case 70:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$;
                break;
              case 77:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$;
                break;
              case 78:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$;
                break;
              case 85:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$;
                break;
              case 86:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$;
                break;
              case 93:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$;
                break;
              case 94:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$g$;
                break;
              case 97:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$f$;
                break;
              case 98:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$j$;
                break;
              case 99:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$h$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$;
                break;
              case 102:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$g$;
                break;
              case 105:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$f$;
                break;
              case 106:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$j$;
                break;
              case 107:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$h$;
                break;
              case 108:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$g$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$f$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$j$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$h$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$k$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$i$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$;
                break;
              case 125:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$;
                break;
              case 126:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$))] | 16;
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$];
                break;
              case 173:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$];
                break;
              case 174:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$))];
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$];
                break;
              case 181:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$];
                break;
              case 182:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$))];
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$ += 2;
                break;
              case 227:
                $temp$$inline_282$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$);
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$, $temp$$inline_282$$ & 255);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$ + 1, $temp$$inline_282$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$s$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$q$);
                break;
              case 233:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$n$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$);
                break;
              default:
                console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_280$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_279$$.$d$--
            }
            break;
          case 254:
            $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++));
            break;
          case 255:
            $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_run$self$$inline_165$$, $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$ = 56
        }
      }
      this.$z80TimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_24$$;
      if(this.$soundEnabled$) {
        var $line$$inline_172$$ = $lineno$$inline_25$$;
        0 == $line$$inline_172$$ && (this.$audioBufferOffset$ = 0);
        for(var $samplesToGenerate$$inline_173$$ = this.$samplesPerLine$[$line$$inline_172$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$ = this.$d$, $offset$$inline_285$$ = this.$audioBufferOffset$, $samplesToGenerate$$inline_286$$ = $samplesToGenerate$$inline_173$$, $buffer$$inline_287$$ = [], $sample$$inline_288$$ = 0, $i$$inline_289$$ = 0;$sample$$inline_288$$ < $samplesToGenerate$$inline_286$$;$sample$$inline_288$$++) {
          for($i$$inline_289$$ = 0;3 > $i$$inline_289$$;$i$$inline_289$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$i$[$i$$inline_289$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$g$[$i$$inline_289$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$b$[($i$$inline_289$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$g$[$i$$inline_289$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$b$[($i$$inline_289$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[$i$$inline_289$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$i$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$f$ & 1) << 1;
          var $output$$inline_290$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$i$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$i$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$i$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$i$[3];
          127 < $output$$inline_290$$ ? $output$$inline_290$$ = 127 : -128 > $output$$inline_290$$ && ($output$$inline_290$$ = -128);
          $buffer$$inline_287$$[$offset$$inline_285$$ + $sample$$inline_288$$] = $output$$inline_290$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$e$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$j$;
          var $clockCycles$$inline_291$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$e$ >> 8, $clockCyclesScaled$$inline_292$$ = $clockCycles$$inline_291$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$e$ -= $clockCyclesScaled$$inline_292$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[0] -= $clockCycles$$inline_291$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[1] -= $clockCycles$$inline_291$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[2] -= $clockCycles$$inline_291$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$h$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[3] - $clockCycles$$inline_291$$;
          for($i$$inline_289$$ = 0;3 > $i$$inline_289$$;$i$$inline_289$$++) {
            var $counter$$inline_293$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[$i$$inline_289$$];
            if(0 >= $counter$$inline_293$$) {
              var $tone$$inline_294$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$b$[$i$$inline_289$$ << 1];
              6 < $tone$$inline_294$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$g$[$i$$inline_289$$] = ($clockCyclesScaled$$inline_292$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$e$ + 512 * $counter$$inline_293$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[$i$$inline_289$$] / ($clockCyclesScaled$$inline_292$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$e$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[$i$$inline_289$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[$i$$inline_289$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[$i$$inline_289$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$g$[$i$$inline_289$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[$i$$inline_289$$] += $tone$$inline_294$$ * ($clockCycles$$inline_291$$ / $tone$$inline_294$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$g$[$i$$inline_289$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$h$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$h$ * 
          ($clockCycles$$inline_291$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$h$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$d$[3])) {
            var $feedback$$inline_295$$ = 0, $feedback$$inline_295$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$f$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$f$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$f$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_284$$.$f$ >> 1 | $feedback$$inline_295$$ << 15
          }
        }
        this.$audioBuffer$ = $buffer$$inline_287$$;
        this.$audioBufferOffset$ += $samplesToGenerate$$inline_173$$
      }
      this.$c$.$l$ = $lineno$$inline_25$$;
      if(0 == this.$frameskip_counter$ && 192 > $lineno$$inline_25$$) {
        var $startTime$$inline_24$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_drawLine$self$$inline_175$$ = this.$c$, $lineno$$inline_176$$ = $lineno$$inline_25$$, $i$$inline_177$$ = 0, $temp$$inline_178$$ = 0, $temp2$$inline_179$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$h$.$is_gg$ || !(24 > $lineno$$inline_176$$ || 168 <= $lineno$$inline_176$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$m$) {
              var $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$;
              console.log("[" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$l$ + "] min dirty:" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$o$ + " max: " + $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$m$);
              for(var $i$$inline_298$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$o$;$i$$inline_298$$ <= $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$m$;$i$$inline_298$$++) {
                if($JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$v$[$i$$inline_298$$]) {
                  $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$v$[$i$$inline_298$$] = $JSCompiler_alias_FALSE$$;
                  console.log("tile " + $i$$inline_298$$ + " is dirty");
                  for(var $tile$$inline_299$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$t$[$i$$inline_298$$], $pixel_index$$inline_300$$ = 0, $address$$inline_301$$ = $i$$inline_298$$ << 5, $y$$inline_302$$ = 0;8 > $y$$inline_302$$;$y$$inline_302$$++) {
                    for(var $address0$$inline_303$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$d$[$address$$inline_301$$++], $address1$$inline_304$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$d$[$address$$inline_301$$++], $address2$$inline_305$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$d$[$address$$inline_301$$++], $address3$$inline_306$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$d$[$address$$inline_301$$++], $bit$$inline_307$$ = 
                    128;0 != $bit$$inline_307$$;$bit$$inline_307$$ >>= 1) {
                      var $colour$$inline_308$$ = 0;
                      0 != ($address0$$inline_303$$ & $bit$$inline_307$$) && ($colour$$inline_308$$ |= 1);
                      0 != ($address1$$inline_304$$ & $bit$$inline_307$$) && ($colour$$inline_308$$ |= 2);
                      0 != ($address2$$inline_305$$ & $bit$$inline_307$$) && ($colour$$inline_308$$ |= 4);
                      0 != ($address3$$inline_306$$ & $bit$$inline_307$$) && ($colour$$inline_308$$ |= 8);
                      $tile$$inline_299$$[$pixel_index$$inline_300$$++] = $colour$$inline_308$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$o$ = 512;
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_297$$.$m$ = -1
            }
            var $JSCompiler_StaticMethods_drawBg$self$$inline_310$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$, $lineno$$inline_311$$ = $lineno$$inline_176$$, $pixX$$inline_312$$ = 0, $colour$$inline_313$$ = 0, $temp$$inline_314$$ = 0, $temp2$$inline_315$$ = 0, $hscroll$$inline_316$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$c$[8], $vscroll$$inline_317$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$c$[9];
            16 > $lineno$$inline_311$$ && 0 != ($JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$c$[0] & 64) && ($hscroll$$inline_316$$ = 0);
            var $lock$$inline_318$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$c$[0] & 128, $tile_column$$inline_319$$ = 32 - ($hscroll$$inline_316$$ >> 3) + $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$s$, $tile_row$$inline_320$$ = $lineno$$inline_311$$ + $vscroll$$inline_317$$ >> 3;
            27 < $tile_row$$inline_320$$ && ($tile_row$$inline_320$$ -= 28);
            for(var $tile_y$$inline_321$$ = ($lineno$$inline_311$$ + ($vscroll$$inline_317$$ & 7) & 7) << 3, $row_precal$$inline_322$$ = $lineno$$inline_311$$ << 8, $tx$$inline_323$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$s$;$tx$$inline_323$$ < $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$u$;$tx$$inline_323$$++) {
              var $tile_props$$inline_324$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$D$ + (($tile_column$$inline_319$$ & 31) << 1) + ($tile_row$$inline_320$$ << 6), $secondbyte$$inline_325$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$d$[$tile_props$$inline_324$$ + 1], $pal$$inline_326$$ = ($secondbyte$$inline_325$$ & 8) << 1, $sx$$inline_327$$ = ($tx$$inline_323$$ << 3) + ($hscroll$$inline_316$$ & 7), $pixY$$inline_328$$ = 0 == ($secondbyte$$inline_325$$ & 4) ? $tile_y$$inline_321$$ : 
              56 - $tile_y$$inline_321$$, $tile$$inline_329$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$t$[($JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$d$[$tile_props$$inline_324$$] & 255) + (($secondbyte$$inline_325$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_325$$ & 2)) {
                for($pixX$$inline_312$$ = 0;8 > $pixX$$inline_312$$ && 256 > $sx$$inline_327$$;$pixX$$inline_312$$++, $sx$$inline_327$$++) {
                  $colour$$inline_313$$ = $tile$$inline_329$$[$pixX$$inline_312$$ + $pixY$$inline_328$$], $temp$$inline_314$$ = 4 * ($sx$$inline_327$$ + $row_precal$$inline_322$$), $temp2$$inline_315$$ = 3 * ($colour$$inline_313$$ + $pal$$inline_326$$), $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$p$[$sx$$inline_327$$] = 0 != ($secondbyte$$inline_325$$ & 16) && 0 != $colour$$inline_313$$, $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$b$[$temp$$inline_314$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$a$[$temp2$$inline_315$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$b$[$temp$$inline_314$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$a$[$temp2$$inline_315$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$b$[$temp$$inline_314$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$a$[$temp2$$inline_315$$ + 2]
                }
              }else {
                for($pixX$$inline_312$$ = 7;0 <= $pixX$$inline_312$$ && 256 > $sx$$inline_327$$;$pixX$$inline_312$$--, $sx$$inline_327$$++) {
                  $colour$$inline_313$$ = $tile$$inline_329$$[$pixX$$inline_312$$ + $pixY$$inline_328$$], $temp$$inline_314$$ = 4 * ($sx$$inline_327$$ + $row_precal$$inline_322$$), $temp2$$inline_315$$ = 3 * ($colour$$inline_313$$ + $pal$$inline_326$$), $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$p$[$sx$$inline_327$$] = 0 != ($secondbyte$$inline_325$$ & 16) && 0 != $colour$$inline_313$$, $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$b$[$temp$$inline_314$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$a$[$temp2$$inline_315$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$b$[$temp$$inline_314$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$a$[$temp2$$inline_315$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$b$[$temp$$inline_314$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_310$$.$a$[$temp2$$inline_315$$ + 2]
                }
              }
              $tile_column$$inline_319$$++;
              0 != $lock$$inline_318$$ && 23 == $tx$$inline_323$$ && ($tile_row$$inline_320$$ = $lineno$$inline_311$$ >> 3, $tile_y$$inline_321$$ = ($lineno$$inline_311$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$k$) {
              var $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$;
              $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$k$ = $JSCompiler_alias_FALSE$$;
              for(var $i$$inline_332$$ = 0;$i$$inline_332$$ < $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$n$.length;$i$$inline_332$$++) {
                $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$n$[$i$$inline_332$$][0] = 0
              }
              var $height$$inline_333$$ = 0 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$c$[1] & 1) && ($height$$inline_333$$ <<= 1);
              for(var $spriteno$$inline_334$$ = 0;64 > $spriteno$$inline_334$$;$spriteno$$inline_334$$++) {
                var $y$$inline_335$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$d$[$JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$g$ + $spriteno$$inline_334$$] & 255;
                if(208 == $y$$inline_335$$) {
                  break
                }
                $y$$inline_335$$++;
                240 < $y$$inline_335$$ && ($y$$inline_335$$ -= 256);
                for(var $lineno$$inline_336$$ = $y$$inline_335$$;192 > $lineno$$inline_336$$;$lineno$$inline_336$$++) {
                  if($lineno$$inline_336$$ - $y$$inline_335$$ < $height$$inline_333$$) {
                    var $sprites$$inline_337$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$n$[$lineno$$inline_336$$];
                    if(8 <= $sprites$$inline_337$$[0]) {
                      break
                    }
                    var $off$$inline_338$$ = 3 * $sprites$$inline_337$$[0] + 1, $address$$inline_339$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$g$ + ($spriteno$$inline_334$$ << 1) + 128;
                    $sprites$$inline_337$$[$off$$inline_338$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$d$[$address$$inline_339$$++] & 255;
                    $sprites$$inline_337$$[$off$$inline_338$$++] = $y$$inline_335$$;
                    $sprites$$inline_337$$[$off$$inline_338$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_331$$.$d$[$address$$inline_339$$] & 255;
                    $sprites$$inline_337$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$n$[$lineno$$inline_176$$][0]) {
              for(var $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$, $lineno$$inline_342$$ = $lineno$$inline_176$$, $colour$$inline_343$$ = 0, $temp$$inline_344$$ = 0, $temp2$$inline_345$$ = 0, $i$$inline_346$$ = 0, $sprites$$inline_347$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$n$[$lineno$$inline_342$$], $count$$inline_348$$ = Math.min(8, $sprites$$inline_347$$[0]), $zoomed$$inline_349$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$c$[1] & 
              1, $row_precal$$inline_350$$ = $lineno$$inline_342$$ << 8, $off$$inline_351$$ = 3 * $count$$inline_348$$;$i$$inline_346$$ < $count$$inline_348$$;$i$$inline_346$$++) {
                var $n$$inline_352$$ = $sprites$$inline_347$$[$off$$inline_351$$--] | ($JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$c$[6] & 4) << 6, $y$$inline_353$$ = $sprites$$inline_347$$[$off$$inline_351$$--], $x$$inline_354$$ = $sprites$$inline_347$$[$off$$inline_351$$--] - ($JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$c$[0] & 8), $tileRow$$inline_355$$ = $lineno$$inline_342$$ - $y$$inline_353$$ >> $zoomed$$inline_349$$;
                0 != ($JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$c$[1] & 2) && ($n$$inline_352$$ &= -2);
                var $tile$$inline_356$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$t$[$n$$inline_352$$ + (($tileRow$$inline_355$$ & 8) >> 3)], $pix$$inline_357$$ = 0;
                0 > $x$$inline_354$$ && ($pix$$inline_357$$ = -$x$$inline_354$$, $x$$inline_354$$ = 0);
                var $offset$$inline_358$$ = $pix$$inline_357$$ + (($tileRow$$inline_355$$ & 7) << 3);
                if(0 == $zoomed$$inline_349$$) {
                  for(;8 > $pix$$inline_357$$ && 256 > $x$$inline_354$$;$pix$$inline_357$$++, $x$$inline_354$$++) {
                    $colour$$inline_343$$ = $tile$$inline_356$$[$offset$$inline_358$$++], 0 != $colour$$inline_343$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$p$[$x$$inline_354$$] && ($temp$$inline_344$$ = 4 * ($x$$inline_354$$ + $row_precal$$inline_350$$), $temp2$$inline_345$$ = 3 * ($colour$$inline_343$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$ + 
                    1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_357$$ && 256 > $x$$inline_354$$;$pix$$inline_357$$++, $x$$inline_354$$ += 2) {
                    $colour$$inline_343$$ = $tile$$inline_356$$[$offset$$inline_358$$++], 0 != $colour$$inline_343$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$p$[$x$$inline_354$$] && ($temp$$inline_344$$ = 4 * ($x$$inline_354$$ + $row_precal$$inline_350$$), $temp2$$inline_345$$ = 3 * ($colour$$inline_343$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$ + 
                    1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$ + 2]), 0 != $colour$$inline_343$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$p$[$x$$inline_354$$ + 1] && ($temp$$inline_344$$ = 4 * ($x$$inline_354$$ + $row_precal$$inline_350$$ + 1), $temp2$$inline_345$$ = 
                    3 * ($colour$$inline_343$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$ + 1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$b$[$temp$$inline_344$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$a$[$temp2$$inline_345$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_347$$[0] && ($JSCompiler_StaticMethods_drawSprite$self$$inline_341$$.$e$ |= 64)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$h$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$c$[0] & 32)) {
              $temp$$inline_178$$ = 4 * ($lineno$$inline_176$$ << 8);
              $temp2$$inline_179$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$c$[7] & 15) + 16);
              for($i$$inline_177$$ = 0;8 > $i$$inline_177$$;$i$$inline_177$$++) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$b$[$temp$$inline_178$$ + $i$$inline_177$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$a$[$temp2$$inline_179$$], $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$b$[$temp$$inline_178$$ + $i$$inline_177$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$a$[$temp2$$inline_179$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$b$[$temp$$inline_178$$ + $i$$inline_177$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$a$[$temp2$$inline_179$$ + 
                2]
              }
            }
          }else {
            for(var $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$, $row_precal$$inline_362$$ = $lineno$$inline_176$$ << 8, $length$$inline_363$$ = 4 * ($row_precal$$inline_362$$ + 1024), $temp$$inline_364$$ = 3 * (($JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$c$[7] & 15) + 16), $row_precal$$inline_362$$ = 4 * $row_precal$$inline_362$$;$row_precal$$inline_362$$ < $length$$inline_363$$;$row_precal$$inline_362$$ += 4) {
              $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$b$[$row_precal$$inline_362$$] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$a$[$temp$$inline_364$$], $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$b$[$row_precal$$inline_362$$ + 1] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$a$[$temp$$inline_364$$ + 1], $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$b$[$row_precal$$inline_362$$ + 2] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_360$$.$a$[$temp$$inline_364$$ + 
              2]
            }
          }
        }
        this.$drawTimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_24$$
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_181$$ = this.$c$, $lineno$$inline_182$$ = $lineno$$inline_25$$;
      192 >= $lineno$$inline_182$$ ? (192 == $lineno$$inline_182$$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ |= 128), 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ & 
      4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[0] & 16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$h$.$a$.$B$ = $JSCompiler_alias_TRUE$$)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[1] & 32) && 224 > $lineno$$inline_182$$) && 
      ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$h$.$a$.$B$ = $JSCompiler_alias_TRUE$$))
    }
    60 == ++this.$frameCount$ && (this.$frameCount$ = this.$drawTimeCounter$ = this.$z80TimeCounter$ = 0);
    if(this.$pause_button$) {
      var $JSCompiler_StaticMethods_nmi$self$$inline_184$$ = this.$a$;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$A$ = $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$z$;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$z$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$F$ && ($JSCompiler_StaticMethods_nmi$self$$inline_184$$.$d$++, $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$F$ = $JSCompiler_alias_FALSE$$);
      $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_nmi$self$$inline_184$$, $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$d$);
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$d$ = 102;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$o$ -= 11;
      this.$pause_button$ = $JSCompiler_alias_FALSE$$
    }
    0 == this.$frameskip_counter$-- && (this.$frameskip_counter$ = this.$frameSkip$);
    this.$fpsFrameCount$++;
    this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen)
  }
}, $readRomDirectly$:function $$JSSMS$$$$$readRomDirectly$$($data$$21$$, $fileName$$) {
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1, $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ = $data$$21$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ ? (this.$is_sms$ = $JSCompiler_alias_TRUE$$, this.$is_gg$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 0, this.$c$.$u$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ && (this.$is_gg$ = $JSCompiler_alias_TRUE$$, this.$is_sms$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 5, this.$c$.$u$ = 27);
  if(16384 >= $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = $data$$21$$;
  0 != $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ % 1024 && ($JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.substr(512), $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ -= 512);
  var $i$$inline_33$$, $j$$inline_34$$, $number_of_pages$$inline_35$$ = Math.round($i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ / 16384), $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ = Array($number_of_pages$$inline_35$$);
  for($i$$inline_33$$ = 0;$i$$inline_33$$ < $number_of_pages$$inline_35$$;$i$$inline_33$$++) {
    if($i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$[$i$$inline_33$$] = $JSSMS$Utils$Array$$(16384), $SUPPORT_DATAVIEW$$) {
      for($j$$inline_34$$ = 0;16384 > $j$$inline_34$$;$j$$inline_34$$++) {
        $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$[$i$$inline_33$$].setUint8($j$$inline_34$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.charCodeAt(16384 * $i$$inline_33$$ + $j$$inline_34$$))
      }
    }else {
      for($j$$inline_34$$ = 0;16384 > $j$$inline_34$$;$j$$inline_34$$++) {
        $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$[$i$$inline_33$$][$j$$inline_34$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.charCodeAt(16384 * $i$$inline_33$$ + $j$$inline_34$$) & 255
      }
    }
  }
  if($i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ == $JSCompiler_alias_NULL$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = this.$a$;
  $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$rom$ = $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$I$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$I$ - 1;
    for($i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ = 0;3 > $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$;$i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$frameReg$[$i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$] = $i$$inline_40_pages$$inline_36_size$$10_size$$inline_32$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$I$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$I$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$romPageMask$ = 0
  }
  return $JSCompiler_alias_TRUE$$
}};
var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  $length$$12$$ || ($length$$12$$ = 0);
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array, $JSSMS$Utils$writeMem$$ = $SUPPORT_DATAVIEW$$ ? function($address$$, $value$$38$$) {
  if(65535 >= $address$$) {
    this.$memWriteMap$.setInt8($address$$ & 8191, $value$$38$$), 65532 == $address$$ ? this.$frameReg$[3] = $value$$38$$ : 65533 == $address$$ ? this.$frameReg$[0] = $value$$38$$ : 65534 == $address$$ ? this.$frameReg$[1] = $value$$38$$ : 65535 == $address$$ && (this.$frameReg$[2] = $value$$38$$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$), $JSSMS$Utils$toHex$$($address$$ & 8191));
    debugger
  }
} : $JSCompiler_emptyFn$$(), $JSSMS$Utils$readMem$$ = $SUPPORT_DATAVIEW$$ ? function($address$$2$$) {
  if(1024 > $address$$2$$) {
    return this.$rom$[0].getUint8($address$$2$$)
  }
  if(16384 > $address$$2$$) {
    return this.$rom$[this.$frameReg$[0] & this.$romPageMask$].getUint8($address$$2$$)
  }
  if(32768 > $address$$2$$) {
    return this.$rom$[this.$frameReg$[1] & this.$romPageMask$].getUint8($address$$2$$ - 16384)
  }
  if(49152 > $address$$2$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$2$$ - 32768) : 12 == (this.$frameReg$[3] & 12) ? this.$sram$.getUint8($address$$2$$ - 16384) : this.$rom$[this.$frameReg$[2] & this.$romPageMask$].getUint8($address$$2$$ - 32768)
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
  console.error($JSSMS$Utils$toHex$$($address$$2$$));
  debugger
} : $JSCompiler_emptyFn$$(), $JSSMS$Utils$readMemWord$$ = $SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
  if(1024 > $address$$4$$) {
    return this.$rom$[0].getUint16($address$$4$$, $JSCompiler_alias_TRUE$$)
  }
  if(16384 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[0] & this.$romPageMask$].getUint16($address$$4$$, $JSCompiler_alias_TRUE$$)
  }
  if(32768 > $address$$4$$) {
    return this.$rom$[this.$frameReg$[1] & this.$romPageMask$].getUint16($address$$4$$ - 16384, $JSCompiler_alias_TRUE$$)
  }
  if(49152 > $address$$4$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$4$$ - 16384] : this.$rom$[this.$frameReg$[2] & this.$romPageMask$].getUint16($address$$4$$ - 32768, $JSCompiler_alias_TRUE$$)
  }
  if(57344 > $address$$4$$) {
    return this.$memWriteMap$.getUint16($address$$4$$ - 49152, $JSCompiler_alias_TRUE$$)
  }
  if(65532 > $address$$4$$) {
    return this.$memWriteMap$.getUint16($address$$4$$ - 57344, $JSCompiler_alias_TRUE$$)
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
  console.error($JSSMS$Utils$toHex$$($address$$4$$));
  debugger
} : $JSCompiler_emptyFn$$(), $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? function() {
  return window.performance.now()
} : function() {
  return(new Date).getTime()
};
function $JSSMS$Utils$toHex$$($dec_hex$$) {
  $dec_hex$$ = $dec_hex$$.toString(16).toUpperCase();
  $dec_hex$$.length % 2 && ($dec_hex$$ = "0" + $dec_hex$$);
  return"0x" + $dec_hex$$
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
function $JSSMS$Z80$$($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$) {
  this.$V$ = $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;
  this.$t$ = $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$.$f$;
  this.$G$ = this.$n$ = this.$d$ = 0;
  this.$B$ = this.$F$ = this.$A$ = this.$z$ = $JSCompiler_alias_FALSE$$;
  this.$o$ = this.$R$ = this.$c$ = this.$K$ = this.$s$ = this.$q$ = this.$r$ = this.$p$ = this.$T$ = this.$S$ = this.$i$ = this.$k$ = this.$Q$ = this.$P$ = this.$h$ = this.$j$ = this.$O$ = this.$N$ = this.$f$ = this.$g$ = this.$M$ = this.$b$ = this.$H$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$I$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$U$ = Array(2048);
  this.$L$ = Array(256);
  this.$m$ = Array(256);
  this.$D$ = Array(256);
  this.$C$ = Array(256);
  this.$v$ = Array(131072);
  this.$u$ = Array(131072);
  this.$J$ = Array(256);
  var $c$$inline_59_padc$$inline_50_sf$$inline_44$$, $h$$inline_60_psub$$inline_51_zf$$inline_45$$, $n$$inline_61_psbc$$inline_52_yf$$inline_46$$, $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$, $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$, $flags$$inline_188_newval$$inline_55$$;
  for($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ = 0;256 > $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$++) {
    $c$$inline_59_padc$$inline_50_sf$$inline_44$$ = 0 != ($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ & 128) ? 128 : 0, $h$$inline_60_psub$$inline_51_zf$$inline_45$$ = 0 == $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ ? 64 : 0, $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ = $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ & 32, $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ = $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ & 
    8, $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$) ? 4 : 0, this.$L$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = $c$$inline_59_padc$$inline_50_sf$$inline_44$$ | $h$$inline_60_psub$$inline_51_zf$$inline_45$$ | $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ | $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$, this.$m$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = 
    $c$$inline_59_padc$$inline_50_sf$$inline_44$$ | $h$$inline_60_psub$$inline_51_zf$$inline_45$$ | $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ | $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ | $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$, this.$D$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = $c$$inline_59_padc$$inline_50_sf$$inline_44$$ | $h$$inline_60_psub$$inline_51_zf$$inline_45$$ | $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ | $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$, 
    this.$D$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 128 == $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ ? 4 : 0, this.$D$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 0 == ($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ & 15) ? 16 : 0, this.$C$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = $c$$inline_59_padc$$inline_50_sf$$inline_44$$ | $h$$inline_60_psub$$inline_51_zf$$inline_45$$ | $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ | 
    $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ | 2, this.$C$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 127 == $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ ? 4 : 0, this.$C$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 15 == ($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ & 15) ? 16 : 0, this.$J$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = 0 != $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ ? 
    $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ & 128 : 68, this.$J$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ | $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ | 16
  }
  $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ = 0;
  $c$$inline_59_padc$$inline_50_sf$$inline_44$$ = 65536;
  $h$$inline_60_psub$$inline_51_zf$$inline_45$$ = 0;
  $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ = 65536;
  for($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ = 0;256 > $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$;$JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$++) {
    for($flags$$inline_188_newval$$inline_55$$ = 0;256 > $flags$$inline_188_newval$$inline_55$$;$flags$$inline_188_newval$$inline_55$$++) {
      $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ = $flags$$inline_188_newval$$inline_55$$ - $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$, this.$v$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = 0 != $flags$$inline_188_newval$$inline_55$$ ? 0 != ($flags$$inline_188_newval$$inline_55$$ & 128) ? 128 : 0 : 64, this.$v$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= $flags$$inline_188_newval$$inline_55$$ & 40, ($flags$$inline_188_newval$$inline_55$$ & 
      15) < ($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ & 15) && (this.$v$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 16), $flags$$inline_188_newval$$inline_55$$ < $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ && (this.$v$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ ^ $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ ^ 128) & ($JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ ^ 
      $flags$$inline_188_newval$$inline_55$$) & 128) && (this.$v$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] |= 4), $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$++, $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ = $flags$$inline_188_newval$$inline_55$$ - $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ - 1, this.$v$[$c$$inline_59_padc$$inline_50_sf$$inline_44$$] = 0 != $flags$$inline_188_newval$$inline_55$$ ? 0 != ($flags$$inline_188_newval$$inline_55$$ & 
      128) ? 128 : 0 : 64, this.$v$[$c$$inline_59_padc$$inline_50_sf$$inline_44$$] |= $flags$$inline_188_newval$$inline_55$$ & 40, ($flags$$inline_188_newval$$inline_55$$ & 15) <= ($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ & 15) && (this.$v$[$c$$inline_59_padc$$inline_50_sf$$inline_44$$] |= 16), $flags$$inline_188_newval$$inline_55$$ <= $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ && (this.$v$[$c$$inline_59_padc$$inline_50_sf$$inline_44$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ ^ 
      $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ ^ 128) & ($JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ ^ $flags$$inline_188_newval$$inline_55$$) & 128) && (this.$v$[$c$$inline_59_padc$$inline_50_sf$$inline_44$$] |= 4), $c$$inline_59_padc$$inline_50_sf$$inline_44$$++, $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ = $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ - $flags$$inline_188_newval$$inline_55$$, this.$u$[$h$$inline_60_psub$$inline_51_zf$$inline_45$$] = 
      0 != $flags$$inline_188_newval$$inline_55$$ ? 0 != ($flags$$inline_188_newval$$inline_55$$ & 128) ? 130 : 2 : 66, this.$u$[$h$$inline_60_psub$$inline_51_zf$$inline_45$$] |= $flags$$inline_188_newval$$inline_55$$ & 40, ($flags$$inline_188_newval$$inline_55$$ & 15) > ($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ & 15) && (this.$u$[$h$$inline_60_psub$$inline_51_zf$$inline_45$$] |= 16), $flags$$inline_188_newval$$inline_55$$ > $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ && 
      (this.$u$[$h$$inline_60_psub$$inline_51_zf$$inline_45$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ ^ $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$) & ($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ ^ $flags$$inline_188_newval$$inline_55$$) & 128) && (this.$u$[$h$$inline_60_psub$$inline_51_zf$$inline_45$$] |= 4), $h$$inline_60_psub$$inline_51_zf$$inline_45$$++, $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ = $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ - 
      $flags$$inline_188_newval$$inline_55$$ - 1, this.$u$[$n$$inline_61_psbc$$inline_52_yf$$inline_46$$] = 0 != $flags$$inline_188_newval$$inline_55$$ ? 0 != ($flags$$inline_188_newval$$inline_55$$ & 128) ? 130 : 2 : 66, this.$u$[$n$$inline_61_psbc$$inline_52_yf$$inline_46$$] |= $flags$$inline_188_newval$$inline_55$$ & 40, ($flags$$inline_188_newval$$inline_55$$ & 15) >= ($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ & 15) && (this.$u$[$n$$inline_61_psbc$$inline_52_yf$$inline_46$$] |= 
      16), $flags$$inline_188_newval$$inline_55$$ >= $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ && (this.$u$[$n$$inline_61_psbc$$inline_52_yf$$inline_46$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ ^ $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$) & ($JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ ^ $flags$$inline_188_newval$$inline_55$$) & 128) && (this.$u$[$n$$inline_61_psbc$$inline_52_yf$$inline_46$$] |= 4), $n$$inline_61_psbc$$inline_52_yf$$inline_46$$++
    }
  }
  for($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ = 256;$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$--;) {
    for($c$$inline_59_padc$$inline_50_sf$$inline_44$$ = 0;1 >= $c$$inline_59_padc$$inline_50_sf$$inline_44$$;$c$$inline_59_padc$$inline_50_sf$$inline_44$$++) {
      for($h$$inline_60_psub$$inline_51_zf$$inline_45$$ = 0;1 >= $h$$inline_60_psub$$inline_51_zf$$inline_45$$;$h$$inline_60_psub$$inline_51_zf$$inline_45$$++) {
        for($n$$inline_61_psbc$$inline_52_yf$$inline_46$$ = 0;1 >= $n$$inline_61_psbc$$inline_52_yf$$inline_46$$;$n$$inline_61_psbc$$inline_52_yf$$inline_46$$++) {
          $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$ = this.$U$;
          $JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$ = $c$$inline_59_padc$$inline_50_sf$$inline_44$$ << 8 | $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ << 9 | $h$$inline_60_psub$$inline_51_zf$$inline_45$$ << 10 | $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;
          $flags$$inline_188_newval$$inline_55$$ = $c$$inline_59_padc$$inline_50_sf$$inline_44$$ | $n$$inline_61_psbc$$inline_52_yf$$inline_46$$ << 1 | $h$$inline_60_psub$$inline_51_zf$$inline_45$$ << 4;
          this.$b$ = $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;
          this.$c$ = $flags$$inline_188_newval$$inline_55$$;
          var $a_copy$$inline_189$$ = this.$b$, $correction$$inline_190$$ = 0, $carry$$inline_191$$ = $flags$$inline_188_newval$$inline_55$$ & 1, $carry_copy$$inline_192$$ = $carry$$inline_191$$;
          if(0 != ($flags$$inline_188_newval$$inline_55$$ & 16) || 9 < ($a_copy$$inline_189$$ & 15)) {
            $correction$$inline_190$$ |= 6
          }
          if(1 == $carry$$inline_191$$ || 159 < $a_copy$$inline_189$$ || 143 < $a_copy$$inline_189$$ && 9 < ($a_copy$$inline_189$$ & 15)) {
            $correction$$inline_190$$ |= 96, $carry_copy$$inline_192$$ = 1
          }
          153 < $a_copy$$inline_189$$ && ($carry_copy$$inline_192$$ = 1);
          0 != ($flags$$inline_188_newval$$inline_55$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_190$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_190$$);
          $flags$$inline_188_newval$$inline_55$$ = this.$c$ & 254 | $carry_copy$$inline_192$$;
          $flags$$inline_188_newval$$inline_55$$ = $JSCompiler_StaticMethods_getParity$$(this.$b$) ? $flags$$inline_188_newval$$inline_55$$ & 251 | 4 : $flags$$inline_188_newval$$inline_55$$ & 251;
          $JSCompiler_temp_const$$152_val$$inline_53_xf$$inline_47$$[$JSCompiler_temp_const$$151_oldval$$inline_54_pf$$inline_48$$] = this.$b$ | $flags$$inline_188_newval$$inline_55$$ << 8
        }
      }
    }
  }
  for($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ = this.$b$ = this.$c$ = 0;8192 > $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$++) {
    this.$memWriteMap$.setUint8($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$, 0)
  }
  for($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ = 0;32768 > $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$++) {
    this.$sram$.setUint8($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$, 0)
  }
  this.$I$ = 2;
  for($i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ = 0;4 > $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$;$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$++) {
    this.$frameReg$[$i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$] = $i$$inline_43_i$$inline_58_i$$inline_64_padd$$inline_49_sms$$ % 3
  }
  this.$e$ = $JSSMS$Utils$writeMem$$.bind(this);
  this.$a$ = $JSSMS$Utils$readMem$$.bind(this);
  this.$l$ = $JSSMS$Utils$readMemWord$$.bind(this);
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$d$ = this.$R$ = this.$c$ = this.$K$ = this.$q$ = this.$s$ = this.$p$ = this.$r$ = this.$k$ = this.$i$ = this.$S$ = this.$T$ = this.$j$ = this.$h$ = this.$P$ = this.$Q$ = this.$g$ = this.$f$ = this.$N$ = this.$O$ = this.$b$ = this.$M$ = 0;
  this.$n$ = 57328;
  this.$G$ = this.$o$ = 0;
  this.$A$ = this.$z$ = $JSCompiler_alias_FALSE$$;
  this.$H$ = 0;
  this.$F$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$d$ + 2), this.$d$ = this.$l$(this.$d$), this.$o$ -= 7) : this.$d$ += 2
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$a$($JSCompiler_StaticMethods_d_$self$$.$d$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$65$$) {
  var $parity$$ = $JSCompiler_alias_TRUE$$, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$65$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$64$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$2$$ = $hl$$1$$ - $value$$64$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$c$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$64$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$64$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$k$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$i$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$63$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$1$$ = $hl$$ + $value$$63$$ + ($JSCompiler_StaticMethods_adc16$self$$.$c$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$c$ = ($hl$$ ^ $result$$1$$ ^ $value$$63$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$63$$ ^ $hl$$ ^ 32768) & ($value$$63$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$k$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$i$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$62$$) {
  var $result$$ = $reg$$ + $value$$62$$;
  $JSCompiler_StaticMethods_add16$self$$.$c$ = $JSCompiler_StaticMethods_add16$self$$.$c$ & 196 | ($reg$$ ^ $result$$ ^ $value$$62$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$61$$) {
  $value$$61$$ = $value$$61$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$c$ = $JSCompiler_StaticMethods_dec8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$C$[$value$$61$$];
  return $value$$61$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$60$$) {
  $value$$60$$ = $value$$60$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$c$ = $JSCompiler_StaticMethods_inc8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$D$[$value$$60$$];
  return $value$$60$$
}
function $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_decHL$self$$) {
  $JSCompiler_StaticMethods_decHL$self$$.$i$ = $JSCompiler_StaticMethods_decHL$self$$.$i$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decHL$self$$.$i$ && ($JSCompiler_StaticMethods_decHL$self$$.$k$ = $JSCompiler_StaticMethods_decHL$self$$.$k$ - 1 & 255)
}
function $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_decDE$self$$) {
  $JSCompiler_StaticMethods_decDE$self$$.$h$ = $JSCompiler_StaticMethods_decDE$self$$.$h$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decDE$self$$.$h$ && ($JSCompiler_StaticMethods_decDE$self$$.$j$ = $JSCompiler_StaticMethods_decDE$self$$.$j$ - 1 & 255)
}
function $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_decBC$self$$) {
  $JSCompiler_StaticMethods_decBC$self$$.$f$ = $JSCompiler_StaticMethods_decBC$self$$.$f$ - 1 & 255;
  255 == $JSCompiler_StaticMethods_decBC$self$$.$f$ && ($JSCompiler_StaticMethods_decBC$self$$.$g$ = $JSCompiler_StaticMethods_decBC$self$$.$g$ - 1 & 255)
}
function $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_incHL$self$$) {
  $JSCompiler_StaticMethods_incHL$self$$.$i$ = $JSCompiler_StaticMethods_incHL$self$$.$i$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incHL$self$$.$i$ && ($JSCompiler_StaticMethods_incHL$self$$.$k$ = $JSCompiler_StaticMethods_incHL$self$$.$k$ + 1 & 255)
}
function $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_incDE$self$$) {
  $JSCompiler_StaticMethods_incDE$self$$.$h$ = $JSCompiler_StaticMethods_incDE$self$$.$h$ + 1 & 255;
  0 == $JSCompiler_StaticMethods_incDE$self$$.$h$ && ($JSCompiler_StaticMethods_incDE$self$$.$j$ = $JSCompiler_StaticMethods_incDE$self$$.$j$ + 1 & 255)
}
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$59$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$s$ = $value$$59$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$q$ = $value$$59$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$58$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$r$ = $value$$58$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$p$ = $value$$58$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$57$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$k$ = $value$$57$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$i$ = $value$$57$$ & 255
}
function $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_getIY$self$$) {
  return $JSCompiler_StaticMethods_getIY$self$$.$s$ << 8 | $JSCompiler_StaticMethods_getIY$self$$.$q$
}
function $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_getIX$self$$) {
  return $JSCompiler_StaticMethods_getIX$self$$.$r$ << 8 | $JSCompiler_StaticMethods_getIX$self$$.$p$
}
function $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_getHL$self$$) {
  return $JSCompiler_StaticMethods_getHL$self$$.$k$ << 8 | $JSCompiler_StaticMethods_getHL$self$$.$i$
}
function $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_getDE$self$$) {
  return $JSCompiler_StaticMethods_getDE$self$$.$j$ << 8 | $JSCompiler_StaticMethods_getDE$self$$.$h$
}
function $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_getBC$self$$) {
  return $JSCompiler_StaticMethods_getBC$self$$.$g$ << 8 | $JSCompiler_StaticMethods_getBC$self$$.$f$
}
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$54$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$c$ = $JSCompiler_StaticMethods_cp_a$self$$.$u$[$JSCompiler_StaticMethods_cp_a$self$$.$b$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$b$ - $value$$54$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$53$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$c$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$b$ - $value$$53$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$c$ = $JSCompiler_StaticMethods_sbc_a$self$$.$u$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$b$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$b$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$52$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$b$ - $value$$52$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$c$ = $JSCompiler_StaticMethods_sub_a$self$$.$u$[$JSCompiler_StaticMethods_sub_a$self$$.$b$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$b$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$51$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$c$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$b$ + $value$$51$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$c$ = $JSCompiler_StaticMethods_adc_a$self$$.$v$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$b$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$b$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$50$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$b$ + $value$$50$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$c$ = $JSCompiler_StaticMethods_add_a$self$$.$v$[$JSCompiler_StaticMethods_add_a$self$$.$b$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$b$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$44$$) {
  var $location$$24$$ = $index$$44$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$a$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$d$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$o$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
  switch($opcode$$4$$) {
    case 0:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 1:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 2:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 3:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 4:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 5:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 7:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 8:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 9:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 10:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 11:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 12:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 13:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 15:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 16:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 17:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 18:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 19:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 20:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 21:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 23:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 24:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 25:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 26:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 27:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 28:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 29:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 31:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 32:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 33:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 34:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 35:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 36:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 37:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 39:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 40:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 41:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 42:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 43:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 44:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 45:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 47:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 48:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 49:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 50:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 51:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 52:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 53:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 55:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
      break;
    case 56:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 57:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 58:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 59:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 60:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 61:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$)));
      break;
    case 63:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$b$);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 1);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 2);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 4);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 8);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 16);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 32);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 64);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & 128);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -3);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -5);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -9);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -17);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -33);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -65);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) & -129);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 1);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 4);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 8);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 16);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 32);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 64);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$($location$$24$$) | 128);
      break;
    default:
      console.log("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$4$$))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$d$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$c$ = $JSCompiler_StaticMethods_bit$self$$.$c$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$J$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$48$$) {
  var $carry$$7$$ = $value$$48$$ & 1;
  $value$$48$$ = $value$$48$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$c$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$m$[$value$$48$$];
  return $value$$48$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$47$$) {
  var $carry$$6$$ = $value$$47$$ & 1;
  $value$$47$$ = $value$$47$$ >> 1 | $value$$47$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$c$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$m$[$value$$47$$];
  return $value$$47$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$46$$) {
  var $carry$$5$$ = ($value$$46$$ & 128) >> 7;
  $value$$46$$ = ($value$$46$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$c$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$m$[$value$$46$$];
  return $value$$46$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$45$$) {
  var $carry$$4$$ = ($value$$45$$ & 128) >> 7;
  $value$$45$$ = $value$$45$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$c$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$m$[$value$$45$$];
  return $value$$45$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$44$$) {
  var $carry$$3$$ = $value$$44$$ & 1;
  $value$$44$$ = ($value$$44$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$c$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$c$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$m$[$value$$44$$];
  return $value$$44$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$43$$) {
  var $carry$$2$$ = ($value$$43$$ & 128) >> 7;
  $value$$43$$ = ($value$$43$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$c$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$c$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$m$[$value$$43$$];
  return $value$$43$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$42$$) {
  var $carry$$1$$ = $value$$42$$ & 1;
  $value$$42$$ = ($value$$42$$ >> 1 | $value$$42$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$c$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$m$[$value$$42$$];
  return $value$$42$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$41$$) {
  var $carry$$ = ($value$$41$$ & 128) >> 7;
  $value$$41$$ = ($value$$41$$ << 1 | $value$$41$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$c$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$m$[$value$$41$$];
  return $value$$41$$
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_decMem$self$$.$e$($offset$$15$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$a$($offset$$15$$)))
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$e$($offset$$14$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$a$($offset$$14$$)))
}
function $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_push2$self$$, $hi$$, $lo$$) {
  $JSCompiler_StaticMethods_push2$self$$.$e$(--$JSCompiler_StaticMethods_push2$self$$.$n$, $hi$$);
  $JSCompiler_StaticMethods_push2$self$$.$e$(--$JSCompiler_StaticMethods_push2$self$$.$n$, $lo$$)
}
function $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_push1$self$$, $value$$40$$) {
  $JSCompiler_StaticMethods_push1$self$$.$e$(--$JSCompiler_StaticMethods_push1$self$$.$n$, $value$$40$$ >> 8);
  $JSCompiler_StaticMethods_push1$self$$.$e$(--$JSCompiler_StaticMethods_push1$self$$.$n$, $value$$40$$ & 255)
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$d$ = $JSCompiler_StaticMethods_ret$self$$.$l$($JSCompiler_StaticMethods_ret$self$$.$n$), $JSCompiler_StaticMethods_ret$self$$.$n$ += 2, $JSCompiler_StaticMethods_ret$self$$.$o$ -= 6)
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$d$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$o$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$d$++
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $JSCompiler_StaticMethods_jp$self$$.$d$ = $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$l$($JSCompiler_StaticMethods_jp$self$$.$d$) : $JSCompiler_StaticMethods_jp$self$$.$d$ + 2
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$w$:[]};
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$, $index$$45$$, $address$$9_address$$inline_78$$) {
  var $inst$$inline_81_toHex$$3$$ = $JSSMS$Utils$toHex$$, $opcode$$9$$ = $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_79$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_78$$, $code$$6_sign$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $offset$$16_operand$$1$$ = "";
  $address$$9_address$$inline_78$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_79$$ = "ADD " + $index$$45$$ + ",BC";
      $code$$6_sign$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_79$$ = "ADD " + $index$$45$$ + ",DE";
      $code$$6_sign$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getDE()));";
      break;
    case 33:
      $offset$$16_operand$$1$$ = $inst$$inline_81_toHex$$3$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$l$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "," + $offset$$16_operand$$1$$;
      $code$$6_sign$$ = "this.set" + $index$$45$$ + "(" + $offset$$16_operand$$1$$ + ");";
      $address$$9_address$$inline_78$$ += 2;
      break;
    case 34:
      $offset$$16_operand$$1$$ = $inst$$inline_81_toHex$$3$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$l$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $offset$$16_operand$$1$$ + ")," + $index$$45$$;
      $code$$6_sign$$ = "location = " + $offset$$16_operand$$1$$ + ";this.writeMem(location++, this." + $index$$45$$.toLowerCase() + "L);this.writeMem(location, this." + $index$$45$$.toLowerCase() + "H);";
      $address$$9_address$$inline_78$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_79$$ = "INC " + $index$$45$$;
      $code$$6_sign$$ = "this.inc" + $index$$45$$ + "();";
      break;
    case 36:
      $inst$$3_opcode$$inline_79$$ = "INC " + $index$$45$$ + "H *";
      break;
    case 37:
      $inst$$3_opcode$$inline_79$$ = "DEC " + $index$$45$$ + "H *";
      break;
    case 38:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H," + $inst$$inline_81_toHex$$3$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$)) + " *";
      $address$$9_address$$inline_78$$++;
      break;
    case 41:
      $inst$$3_opcode$$inline_79$$ = "ADD " + $index$$45$$ + "  " + $index$$45$$;
      break;
    case 42:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + " (" + $inst$$inline_81_toHex$$3$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$l$($address$$9_address$$inline_78$$)) + ")";
      $address$$9_address$$inline_78$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_79$$ = "DEC " + $index$$45$$;
      $code$$6_sign$$ = "this.dec" + $index$$45$$ + "();";
      break;
    case 44:
      $inst$$3_opcode$$inline_79$$ = "INC " + $index$$45$$ + "L *";
      break;
    case 45:
      $inst$$3_opcode$$inline_79$$ = "DEC " + $index$$45$$ + "L *";
      break;
    case 46:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L," + $inst$$inline_81_toHex$$3$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $address$$9_address$$inline_78$$++;
      break;
    case 52:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "INC (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 53:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "DEC (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 54:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")," + $inst$$inline_81_toHex$$3$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $address$$9_address$$inline_78$$++;
      break;
    case 57:
      $inst$$3_opcode$$inline_79$$ = "ADD " + $index$$45$$ + " SP";
      break;
    case 68:
      $inst$$3_opcode$$inline_79$$ = "LD B," + $index$$45$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_79$$ = "LD B," + $index$$45$$ + "L *";
      break;
    case 70:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD B,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_79$$ = "LD C," + $index$$45$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_79$$ = "LD C," + $index$$45$$ + "L *";
      break;
    case 78:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD C,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_79$$ = "LD D," + $index$$45$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_79$$ = "LD D," + $index$$45$$ + "L *";
      break;
    case 86:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD D,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_79$$ = "LD E," + $index$$45$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_79$$ = "LD E," + $index$$45$$ + "L *";
      break;
    case 94:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD E,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 96:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H,B *";
      break;
    case 97:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H,C *";
      break;
    case 98:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H,D *";
      break;
    case 99:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H,E *";
      break;
    case 100:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "H*";
      break;
    case 101:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "L *";
      break;
    case 102:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD H,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 103:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "H,A *";
      break;
    case 104:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L,B *";
      break;
    case 105:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L,C *";
      break;
    case 106:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L,D *";
      break;
    case 107:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L,E *";
      break;
    case 108:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "H *";
      break;
    case 109:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "L *";
      break;
    case 110:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD L,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ")";
      $address$$9_address$$inline_78$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_79$$ = "LD " + $index$$45$$ + "L,A *";
      break;
    case 112:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),B";
      $address$$9_address$$inline_78$$++;
      break;
    case 113:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),C";
      $address$$9_address$$inline_78$$++;
      break;
    case 114:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),D";
      $address$$9_address$$inline_78$$++;
      break;
    case 115:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),E";
      $address$$9_address$$inline_78$$++;
      break;
    case 116:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),H";
      $address$$9_address$$inline_78$$++;
      break;
    case 117:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),L";
      $address$$9_address$$inline_78$$++;
      break;
    case 119:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "LD (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "),A";
      $address$$9_address$$inline_78$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_79$$ = "LD A," + $index$$45$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_79$$ = "LD A," + $index$$45$$ + "L *";
      break;
    case 126:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $code$$6_sign$$ = 0 < $offset$$16_operand$$1$$ ? "+" : "-";
      $inst$$3_opcode$$inline_79$$ = "LD A,(" + $index$$45$$ + $code$$6_sign$$ + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $code$$6_sign$$ = "this.a = this.readMem(this.getIX() " + $code$$6_sign$$ + " " + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + ");";
      $address$$9_address$$inline_78$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_79$$ = "ADD A," + $index$$45$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_79$$ = "ADD A," + $index$$45$$ + "L *";
      break;
    case 134:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "ADD A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_79$$ = "ADC A," + $index$$45$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_79$$ = "ADC A," + $index$$45$$ + "L *";
      break;
    case 142:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "ADC A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_79$$ = "SUB " + $index$$45$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_79$$ = "SUB " + $index$$45$$ + "L *";
      break;
    case 150:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "SUB A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_79$$ = "SBC A," + $index$$45$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_79$$ = "SBC A," + $index$$45$$ + "L *";
      break;
    case 158:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "SBC A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_79$$ = "AND " + $index$$45$$ + "H *";
      break;
    case 165:
      $inst$$3_opcode$$inline_79$$ = "AND " + $index$$45$$ + "L *";
      break;
    case 166:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "AND A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_79$$ = "XOR A " + $index$$45$$ + "H*";
      break;
    case 173:
      $inst$$3_opcode$$inline_79$$ = "XOR A " + $index$$45$$ + "L*";
      break;
    case 174:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "XOR A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_79$$ = "OR A " + $index$$45$$ + "H*";
      break;
    case 181:
      $inst$$3_opcode$$inline_79$$ = "OR A " + $index$$45$$ + "L*";
      break;
    case 182:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "OR A,(" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_79$$ = "CP " + $index$$45$$ + "H *";
      break;
    case 189:
      $inst$$3_opcode$$inline_79$$ = "CP " + $index$$45$$ + "L *";
      break;
    case 190:
      $offset$$16_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$));
      $inst$$3_opcode$$inline_79$$ = "CP (" + $index$$45$$ + (0 < $offset$$16_operand$$1$$ ? "+" : "-") + $inst$$inline_81_toHex$$3$$($offset$$16_operand$$1$$) + "))";
      $address$$9_address$$inline_78$$++;
      break;
    case 203:
      $inst$$3_opcode$$inline_79$$ = $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$.$a$($address$$9_address$$inline_78$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$ = [$inst$$3_opcode$$inline_79$$];
      $inst$$inline_81_toHex$$3$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $address$$9_address$$inline_78$$++;
      switch($inst$$3_opcode$$inline_79$$) {
        case 0:
          $inst$$inline_81_toHex$$3$$ = "LD B,RLC (" + $index$$45$$ + ")";
          break;
        case 1:
          $inst$$inline_81_toHex$$3$$ = "LD C,RLC (" + $index$$45$$ + ")";
          break;
        case 2:
          $inst$$inline_81_toHex$$3$$ = "LD D,RLC (" + $index$$45$$ + ")";
          break;
        case 3:
          $inst$$inline_81_toHex$$3$$ = "LD E,RLC (" + $index$$45$$ + ")";
          break;
        case 4:
          $inst$$inline_81_toHex$$3$$ = "LD H,RLC (" + $index$$45$$ + ")";
          break;
        case 5:
          $inst$$inline_81_toHex$$3$$ = "LD L,RLC (" + $index$$45$$ + ")";
          break;
        case 6:
          $inst$$inline_81_toHex$$3$$ = "RLC (" + $index$$45$$ + ")";
          break;
        case 7:
          $inst$$inline_81_toHex$$3$$ = "LD A,RLC (" + $index$$45$$ + ")";
          break;
        case 8:
          $inst$$inline_81_toHex$$3$$ = "LD B,RRC (" + $index$$45$$ + ")";
          break;
        case 9:
          $inst$$inline_81_toHex$$3$$ = "LD C,RRC (" + $index$$45$$ + ")";
          break;
        case 10:
          $inst$$inline_81_toHex$$3$$ = "LD D,RRC (" + $index$$45$$ + ")";
          break;
        case 11:
          $inst$$inline_81_toHex$$3$$ = "LD E,RRC (" + $index$$45$$ + ")";
          break;
        case 12:
          $inst$$inline_81_toHex$$3$$ = "LD H,RRC (" + $index$$45$$ + ")";
          break;
        case 13:
          $inst$$inline_81_toHex$$3$$ = "LD L,RRC (" + $index$$45$$ + ")";
          break;
        case 14:
          $inst$$inline_81_toHex$$3$$ = "RRC (" + $index$$45$$ + ")";
          break;
        case 15:
          $inst$$inline_81_toHex$$3$$ = "LD A,RRC (" + $index$$45$$ + ")";
          break;
        case 16:
          $inst$$inline_81_toHex$$3$$ = "LD B,RL (" + $index$$45$$ + ")";
          break;
        case 17:
          $inst$$inline_81_toHex$$3$$ = "LD C,RL (" + $index$$45$$ + ")";
          break;
        case 18:
          $inst$$inline_81_toHex$$3$$ = "LD D,RL (" + $index$$45$$ + ")";
          break;
        case 19:
          $inst$$inline_81_toHex$$3$$ = "LD E,RL (" + $index$$45$$ + ")";
          break;
        case 20:
          $inst$$inline_81_toHex$$3$$ = "LD H,RL (" + $index$$45$$ + ")";
          break;
        case 21:
          $inst$$inline_81_toHex$$3$$ = "LD L,RL (" + $index$$45$$ + ")";
          break;
        case 22:
          $inst$$inline_81_toHex$$3$$ = "RL (" + $index$$45$$ + ")";
          break;
        case 23:
          $inst$$inline_81_toHex$$3$$ = "LD A,RL (" + $index$$45$$ + ")";
          break;
        case 24:
          $inst$$inline_81_toHex$$3$$ = "LD B,RR (" + $index$$45$$ + ")";
          break;
        case 25:
          $inst$$inline_81_toHex$$3$$ = "LD C,RR (" + $index$$45$$ + ")";
          break;
        case 26:
          $inst$$inline_81_toHex$$3$$ = "LD D,RR (" + $index$$45$$ + ")";
          break;
        case 27:
          $inst$$inline_81_toHex$$3$$ = "LD E,RR (" + $index$$45$$ + ")";
          break;
        case 28:
          $inst$$inline_81_toHex$$3$$ = "LD H,RR (" + $index$$45$$ + ")";
          break;
        case 29:
          $inst$$inline_81_toHex$$3$$ = "LD L,RR (" + $index$$45$$ + ")";
          break;
        case 30:
          $inst$$inline_81_toHex$$3$$ = "RR (" + $index$$45$$ + ")";
          break;
        case 31:
          $inst$$inline_81_toHex$$3$$ = "LD A,RR (" + $index$$45$$ + ")";
          break;
        case 32:
          $inst$$inline_81_toHex$$3$$ = "LD B,SLA (" + $index$$45$$ + ")";
          break;
        case 33:
          $inst$$inline_81_toHex$$3$$ = "LD C,SLA (" + $index$$45$$ + ")";
          break;
        case 34:
          $inst$$inline_81_toHex$$3$$ = "LD D,SLA (" + $index$$45$$ + ")";
          break;
        case 35:
          $inst$$inline_81_toHex$$3$$ = "LD E,SLA (" + $index$$45$$ + ")";
          break;
        case 36:
          $inst$$inline_81_toHex$$3$$ = "LD H,SLA (" + $index$$45$$ + ")";
          break;
        case 37:
          $inst$$inline_81_toHex$$3$$ = "LD L,SLA (" + $index$$45$$ + ")";
          break;
        case 38:
          $inst$$inline_81_toHex$$3$$ = "SLA (" + $index$$45$$ + ")";
          break;
        case 39:
          $inst$$inline_81_toHex$$3$$ = "LD A,SLA (" + $index$$45$$ + ")";
          break;
        case 40:
          $inst$$inline_81_toHex$$3$$ = "LD B,SRA (" + $index$$45$$ + ")";
          break;
        case 41:
          $inst$$inline_81_toHex$$3$$ = "LD C,SRA (" + $index$$45$$ + ")";
          break;
        case 42:
          $inst$$inline_81_toHex$$3$$ = "LD D,SRA (" + $index$$45$$ + ")";
          break;
        case 43:
          $inst$$inline_81_toHex$$3$$ = "LD E,SRA (" + $index$$45$$ + ")";
          break;
        case 44:
          $inst$$inline_81_toHex$$3$$ = "LD H,SRA (" + $index$$45$$ + ")";
          break;
        case 45:
          $inst$$inline_81_toHex$$3$$ = "LD L,SRA (" + $index$$45$$ + ")";
          break;
        case 46:
          $inst$$inline_81_toHex$$3$$ = "SRA (" + $index$$45$$ + ")";
          break;
        case 47:
          $inst$$inline_81_toHex$$3$$ = "LD A,SRA (" + $index$$45$$ + ")";
          break;
        case 48:
          $inst$$inline_81_toHex$$3$$ = "LD B,SLL (" + $index$$45$$ + ")";
          break;
        case 49:
          $inst$$inline_81_toHex$$3$$ = "LD C,SLL (" + $index$$45$$ + ")";
          break;
        case 50:
          $inst$$inline_81_toHex$$3$$ = "LD D,SLL (" + $index$$45$$ + ")";
          break;
        case 51:
          $inst$$inline_81_toHex$$3$$ = "LD E,SLL (" + $index$$45$$ + ")";
          break;
        case 52:
          $inst$$inline_81_toHex$$3$$ = "LD H,SLL (" + $index$$45$$ + ")";
          break;
        case 53:
          $inst$$inline_81_toHex$$3$$ = "LD L,SLL (" + $index$$45$$ + ")";
          break;
        case 54:
          $inst$$inline_81_toHex$$3$$ = "SLL (" + $index$$45$$ + ") *";
          break;
        case 55:
          $inst$$inline_81_toHex$$3$$ = "LD A,SLL (" + $index$$45$$ + ")";
          break;
        case 56:
          $inst$$inline_81_toHex$$3$$ = "LD B,SRL (" + $index$$45$$ + ")";
          break;
        case 57:
          $inst$$inline_81_toHex$$3$$ = "LD C,SRL (" + $index$$45$$ + ")";
          break;
        case 58:
          $inst$$inline_81_toHex$$3$$ = "LD D,SRL (" + $index$$45$$ + ")";
          break;
        case 59:
          $inst$$inline_81_toHex$$3$$ = "LD E,SRL (" + $index$$45$$ + ")";
          break;
        case 60:
          $inst$$inline_81_toHex$$3$$ = "LD H,SRL (" + $index$$45$$ + ")";
          break;
        case 61:
          $inst$$inline_81_toHex$$3$$ = "LD L,SRL (" + $index$$45$$ + ")";
          break;
        case 62:
          $inst$$inline_81_toHex$$3$$ = "SRL (" + $index$$45$$ + ")";
          break;
        case 63:
          $inst$$inline_81_toHex$$3$$ = "LD A,SRL (" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "BIT 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "RES 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_81_toHex$$3$$ = "SET 7,(" + $index$$45$$ + ")"
      }
      $inst$$3_opcode$$inline_79$$ = $inst$$inline_81_toHex$$3$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_80$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_79$$ = "POP " + $index$$45$$;
      break;
    case 227:
      $inst$$3_opcode$$inline_79$$ = "EX SP,(" + $index$$45$$ + ")";
      break;
    case 229:
      $inst$$3_opcode$$inline_79$$ = "PUSH " + $index$$45$$;
      break;
    case 233:
      $inst$$3_opcode$$inline_79$$ = "JP (" + $index$$45$$ + ")";
      $address$$9_address$$inline_78$$ = $JSCompiler_alias_NULL$$;
      break;
    case 249:
      $inst$$3_opcode$$inline_79$$ = "LD SP," + $index$$45$$
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_79$$, code:$code$$6_sign$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_78$$}
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
        $tstates$$1$$ = 2 == $opcodes$$.length ? $OP_DD_STATES$$[$opcodes$$[1]] : $OP_INDEX_CB_STATES$$[$opcodes$$[2]];
        break;
      case 237:
        $tstates$$1$$ = $OP_ED_STATES$$[$opcodes$$[1]];
        break;
      default:
        $tstates$$1$$ = $OP_STATES$$[$opcodes$$[0]]
    }
    return $tstates$$1$$
  }
  function $insertTStates$$() {
    $tstates$$ && $code$$2$$.push("this.tstates -= " + $tstates$$ + ";");
    $tstates$$ = 0
  }
  console.time("JavaScript generation");
  $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.$w$;
  var $toHex$$ = $JSSMS$Utils$toHex$$, $tstates$$ = 0, $prevPc$$ = 0, $breakNeeded$$ = $JSCompiler_alias_FALSE$$, $code$$2$$ = "function run(cycles, cyclesTo) {}var location = 0;}var opcode = 0;}var temp = 0;}}this.tstates += cycles;}}if (cycles != 0)}  this.totalCycles = cycles;".split("}");
  $code$$2$$.push("if (this.interruptLine) this.interrupt(); // Check for interrupt");
  $code$$2$$.push("while (this.tstates > cyclesTo) {");
  $code$$2$$.push("if (this.interruptLine) this.interrupt(); // Check for interrupt");
  $code$$2$$.push("this.branches[this.pc].call(this);");
  $code$$2$$.push("}");
  $code$$2$$.push("},");
  $code$$2$$.push("");
  $code$$2$$.push("");
  $code$$2$$.push("branches: {");
  $code$$2$$.push('"": function() {');
  $code$$2$$.push('console.log("Bad address", this.pc);');
  for(var $i$$10$$ = 0, $length$$17$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$10$$ < $length$$17$$;$i$$10$$++) {
    if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$]) {
      if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$isJumpTarget$ || $prevPc$$ != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevPc$$ && !$breakNeeded$$ && $code$$2$$.push("this.pc = " + $toHex$$($prevPc$$) + ";"), $code$$2$$.push("},"), $code$$2$$.push("" + $toHex$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$) + ": function(temp) {")
      }
      $code$$2$$.push("// " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].label);
      $tstates$$ += $getTotalTStates$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$opcodes$);
      $breakNeeded$$ = "return;" == $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code.substr(-7);
      (/return;/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code) || /this\.tstates/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code)) && $insertTStates$$();
      "" != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code && $code$$2$$.push($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code);
      $prevPc$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$nextAddress$
    }
  }
  $code$$2$$.push("}");
  $code$$2$$.push("}");
  $code$$2$$ = $code$$2$$.join("\n");
  console.timeEnd("JavaScript generation");
  return $code$$2$$
}
;function $JSSMS$Keyboard$$() {
  this.$c$ = this.$b$ = this.$a$ = 0
}
$JSSMS$Keyboard$$.prototype = {reset:function $$JSSMS$Keyboard$$$$reset$() {
  this.$c$ = this.$b$ = this.$a$ = 255;
  this.$pause_button$ = $JSCompiler_alias_FALSE$$
}};
var $NO_ANTIALIAS$$ = Number.MIN_VALUE, $PSG_VOLUME$$ = [25, 20, 16, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 0];
function $JSSMS$SN76489$$() {
  this.$e$ = this.$j$ = 0;
  this.$b$ = Array(8);
  this.$c$ = 0;
  this.$a$ = Array(4);
  this.$d$ = Array(4);
  this.$g$ = Array(3);
  this.$h$ = 16;
  this.$f$ = 32768;
  this.$i$ = Array(4)
}
$JSSMS$SN76489$$.prototype = {};
function $JSSMS$Vdp$$($i$$inline_108_i$$inline_111_sms$$3$$) {
  this.$h$ = $i$$inline_108_i$$inline_111_sms$$3$$;
  var $i$$13_r$$inline_112$$ = 0;
  this.$z$ = 0;
  this.$d$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$13_r$$inline_112$$ = 0;96 > $i$$13_r$$inline_112$$;$i$$13_r$$inline_112$$++) {
    this.$a$[$i$$13_r$$inline_112$$] = 255
  }
  this.$c$ = Array(16);
  this.$e$ = 0;
  this.$j$ = $JSCompiler_alias_FALSE$$;
  this.$q$ = this.$l$ = this.$w$ = this.$r$ = this.$f$ = this.$i$ = 0;
  this.$p$ = Array(256);
  this.$D$ = 0;
  this.$b$ = $i$$inline_108_i$$inline_111_sms$$3$$.$b$.$canvasImageData$.data;
  this.$H$ = Array(64);
  this.$G$ = Array(64);
  this.$F$ = Array(64);
  this.$C$ = Array(256);
  this.$B$ = Array(256);
  this.$A$ = Array(16);
  this.$g$ = this.$u$ = this.$s$ = 0;
  this.$k$ = $JSCompiler_alias_FALSE$$;
  this.$n$ = Array(192);
  for($i$$13_r$$inline_112$$ = 0;192 > $i$$13_r$$inline_112$$;$i$$13_r$$inline_112$$++) {
    this.$n$[$i$$13_r$$inline_112$$] = Array(25)
  }
  this.$t$ = Array(512);
  this.$v$ = Array(512);
  for($i$$inline_108_i$$inline_111_sms$$3$$ = this.$m$ = this.$o$ = 0;512 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    this.$t$[$i$$inline_108_i$$inline_111_sms$$3$$] = Array(64)
  }
  var $g$$inline_113$$, $b$$inline_114$$;
  for($i$$inline_108_i$$inline_111_sms$$3$$ = 0;64 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    $i$$13_r$$inline_112$$ = $i$$inline_108_i$$inline_111_sms$$3$$ & 3, $g$$inline_113$$ = $i$$inline_108_i$$inline_111_sms$$3$$ >> 2 & 3, $b$$inline_114$$ = $i$$inline_108_i$$inline_111_sms$$3$$ >> 4 & 3, this.$H$[$i$$inline_108_i$$inline_111_sms$$3$$] = 85 * $i$$13_r$$inline_112$$ & 255, this.$G$[$i$$inline_108_i$$inline_111_sms$$3$$] = 85 * $g$$inline_113$$ & 255, this.$F$[$i$$inline_108_i$$inline_111_sms$$3$$] = 85 * $b$$inline_114$$ & 255
  }
  for($i$$inline_108_i$$inline_111_sms$$3$$ = 0;256 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    $g$$inline_113$$ = $i$$inline_108_i$$inline_111_sms$$3$$ & 15, $b$$inline_114$$ = $i$$inline_108_i$$inline_111_sms$$3$$ >> 4 & 15, this.$C$[$i$$inline_108_i$$inline_111_sms$$3$$] = ($g$$inline_113$$ << 4 | $g$$inline_113$$) & 255, this.$B$[$i$$inline_108_i$$inline_111_sms$$3$$] = ($b$$inline_114$$ << 4 | $b$$inline_114$$) & 255
  }
  for($i$$inline_108_i$$inline_111_sms$$3$$ = 0;16 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    this.$A$[$i$$inline_108_i$$inline_111_sms$$3$$] = ($i$$inline_108_i$$inline_111_sms$$3$$ << 4 | $i$$inline_108_i$$inline_111_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$14$$;
  this.$j$ = $JSCompiler_alias_TRUE$$;
  for($i$$14$$ = this.$r$ = this.$e$ = this.$q$ = this.$f$ = 0;16 > $i$$14$$;$i$$14$$++) {
    this.$c$[$i$$14$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$h$.$a$.$B$ = $JSCompiler_alias_FALSE$$;
  this.$k$ = $JSCompiler_alias_TRUE$$;
  this.$o$ = 512;
  this.$m$ = -1;
  for($i$$14$$ = 0;16384 > $i$$14$$;$i$$14$$++) {
    this.$d$[$i$$14$$] = 0
  }
  for($i$$14$$ = 0;196608 > $i$$14$$;$i$$14$$ += 4) {
    this.$b$[$i$$14$$] = 0, this.$b$[$i$$14$$ + 1] = 0, this.$b$[$i$$14$$ + 2] = 0, this.$b$[$i$$14$$ + 3] = 255
  }
}};
function $JSSMS$DummyUI$$() {
  this.reset = $JSCompiler_emptyFn$$();
  this.updateStatus = $JSCompiler_emptyFn$$()
}
function $JSSMS$NodeUI$$($sms$$5$$) {
  this.$a$ = $sms$$5$$;
  this.$canvasImageData$ = {data:[]}
}
$JSSMS$NodeUI$$.prototype = {reset:$JSCompiler_emptyFn$$(), updateStatus:$JSCompiler_emptyFn$$(), $b$:function $$JSSMS$NodeUI$$$$$b$$() {
  var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$ = this.$a$.$a$;
  console.time("DOT generation");
  for(var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$.$w$, $content$$inline_118$$ = ["digraph G {"], $i$$inline_119$$ = 0, $length$$inline_120$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$.length;$i$$inline_119$$ < $length$$inline_120$$;$i$$inline_119$$++) {
    $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$[$i$$inline_119$$] && ($content$$inline_118$$.push(" " + $i$$inline_119$$ + ' [label="' + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$[$i$$inline_119$$].label + '"];'), $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$[$i$$inline_119$$].target != $JSCompiler_alias_NULL$$ && $content$$inline_118$$.push(" " + 
    $i$$inline_119$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$[$i$$inline_119$$].target + ";"), $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$[$i$$inline_119$$].$nextAddress$ != $JSCompiler_alias_NULL$$ && $content$$inline_118$$.push(" " + $i$$inline_119$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_116_tree$$inline_117$$[$i$$inline_119$$].$nextAddress$ + 
    ";"))
  }
  $content$$inline_118$$.push("}");
  $content$$inline_118$$ = $content$$inline_118$$.join("\n");
  $content$$inline_118$$ = $content$$inline_118$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  console.timeEnd("DOT generation");
  return $content$$inline_118$$
}, $c$:function $$JSSMS$NodeUI$$$$$c$$() {
  return $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$$(this.$a$.$a$)
}};
function $JSSMS$Ports$$($sms$$6$$) {
  this.$d$ = $sms$$6$$;
  this.$a$ = $sms$$6$$.$c$;
  this.$e$ = $sms$$6$$.$d$;
  this.$c$ = $sms$$6$$.$e$;
  this.$b$ = []
}
$JSSMS$Ports$$.prototype = {reset:function $$JSSMS$Ports$$$$reset$() {
  this.$b$ = Array(2)
}};
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_in_$self$$, $port$$1$$) {
  if($JSCompiler_StaticMethods_in_$self$$.$d$.$is_gg$ && 7 > $port$$1$$) {
    switch($port$$1$$) {
      case 0:
        return $JSCompiler_StaticMethods_in_$self$$.$c$.$c$ & 191 | 64;
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
      var $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$z$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$l$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$l$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$l$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$j$ = $JSCompiler_alias_TRUE$$;
      var $statuscopy$$inline_128_value$$inline_125$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$w$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$w$ = $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$d$[$JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$f$++ & 
      16383] & 255;
      return $statuscopy$$inline_128_value$$inline_125$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$j$ = $JSCompiler_alias_TRUE$$, $statuscopy$$inline_128_value$$inline_125$$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$e$, $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$e$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$h$.$a$.$B$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_128_value$$inline_125$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$b$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$b$[0] | $JSCompiler_StaticMethods_in_$self$$.$b$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$, $address$$inline_133_old$$inline_139_port_temp$$inline_132$$, $reg$$inline_138_value$$70$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$.$is_gg$ && 7 > $address$$inline_133_old$$inline_139_port_temp$$inline_132$$)) {
    switch($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[0] = ($reg$$inline_138_value$$70$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[1] = $reg$$inline_138_value$$70$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$;
        $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 16383;
            if($reg$$inline_138_value$$70$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] & 255)) {
              if($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$ && $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$
              }else {
                if($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$ + 128 && $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$
                }else {
                  var $tileIndex$$inline_134$$ = $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$v$[$tileIndex$$inline_134$$] = $JSCompiler_alias_TRUE$$;
                  $tileIndex$$inline_134$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$o$ = $tileIndex$$inline_134$$);
                  $tileIndex$$inline_134$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$m$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$m$ = $tileIndex$$inline_134$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] = $reg$$inline_138_value$$70$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$h$.$is_sms$ ? ($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$H$[$reg$$inline_138_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$G$[$reg$$inline_138_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$F$[$reg$$inline_138_value$$70$$]) : 
            ($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$C$[$reg$$inline_138_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$B$[$reg$$inline_138_value$$70$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$A$[$reg$$inline_138_value$$70$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ = $reg$$inline_138_value$$70$$, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 16128 | $reg$$inline_138_value$$70$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$ = $reg$$inline_138_value$$70$$ >> 
          6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ | $reg$$inline_138_value$$70$$ << 8, 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$w$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$) {
              $reg$$inline_138_value$$70$$ &= 15;
              switch($reg$$inline_138_value$$70$$) {
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$e$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$B$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_138_value$$70$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$D$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ & -130) << 7, $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$, console.log("New address written to SAT: " + $address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$g$))
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_138_value$$70$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$e$, 0 != ($reg$$inline_138_value$$70$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_138_value$$70$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_138_value$$70$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_138_value$$70$$ & 63) << 4 : 
          $reg$$inline_138_value$$70$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$h$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ = 
              32768
          }
        }
    }
  }
}
;$JSSMS$$.prototype.readRomDirectly = $JSSMS$$.prototype.$readRomDirectly$;
$JSSMS$$.prototype.start = $JSSMS$$.prototype.$JSSMS_prototype$start$;
$JSSMS$$.prototype.stop = $JSSMS$$.prototype.$JSSMS_prototype$stop$;
$JSSMS$$.NodeUI = $JSSMS$NodeUI$$;
$JSSMS$$.NodeUI.prototype.writeGraphViz = $JSSMS$NodeUI$$.prototype.$b$;
$JSSMS$$.NodeUI.prototype.writeJavaScript = $JSSMS$NodeUI$$.prototype.$c$;
module.exports = $JSSMS$$;
})(global);
