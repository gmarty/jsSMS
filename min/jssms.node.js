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
(function(window){'use strict';var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1, $SUPPORT_DATAVIEW$$ = !(!window.DataView || !window.ArrayBuffer);
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
  $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$aa$.$b$.updateStatus("Parsing instructions...");
  console.time("Instructions parsing");
  var $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ = 1024 * $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$A$.length, $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$, $i$$inline_162$$ = 0, $addresses$$inline_163$$ = [];
  for($addresses$$inline_163$$.push(0);$addresses$$inline_163$$.length;) {
    if($currentAddress$$inline_161_fractional$$inline_14$$ = $addresses$$inline_163$$.shift(), !$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$currentAddress$$inline_161_fractional$$inline_14$$]) {
      if($currentAddress$$inline_161_fractional$$inline_14$$ >= $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$ || 65 <= $currentAddress$$inline_161_fractional$$inline_14$$ >> 10) {
        console.log("Invalid address", $currentAddress$$inline_161_fractional$$inline_14$$)
      }else {
        var $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$, $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $currentAddress$$inline_161_fractional$$inline_14$$;
        $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
        var $defaultInstruction$$inline_227_opcodesArray$$inline_205$$ = [$instruction$$inline_160_opcode$$inline_204_options$$inline_226$$], $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "Unknown Opcode", $currAddr$$inline_207_prop$$inline_228$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$, $address$$inline_219_target$$inline_208$$ = $JSCompiler_alias_NULL$$, $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($instruction$$inline_160_opcode$$inline_204_options$$inline_226$$) + 
        '";', $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = "", $code$$inline_218_location$$inline_211_target$$inline_224$$ = 0;
        $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
        switch($instruction$$inline_160_opcode$$inline_204_options$$inline_226$$) {
          case 0:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "NOP";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 1:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD BC," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setBC(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 2:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (BC),A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getBC(), this.a);";
            break;
          case 3:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC BC";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.incBC();";
            break;
          case 4:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.inc8(this.b);";
            break;
          case 5:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.dec8(this.b);";
            break;
          case 6:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 7:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RLCA";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.rlca_a();";
            break;
          case 8:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "EX AF AF'";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.exAF();";
            break;
          case 9:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD HL,BC";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
            break;
          case 10:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,(BC)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.readMem(this.getBC());";
            break;
          case 11:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC BC";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.decBC();";
            break;
          case 12:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.inc8(this.c);";
            break;
          case 13:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.dec8(this.c);";
            break;
          case 14:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 15:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RRCA";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.rrca_a();";
            break;
          case 16:
            $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + 1);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = (this.b - 1) & 0xff;if (this.b != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 5;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 17:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD DE," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setDE(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 18:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (DE),A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getDE(), this.a);";
            break;
          case 19:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC DE";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.incDE();";
            break;
          case 20:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.inc8(this.d);";
            break;
          case 21:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.dec8(this.d);";
            break;
          case 22:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 23:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RLA";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.rla_a();";
            break;
          case 24:
            $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + 1);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.pc = " + $address$$inline_219_target$$inline_208$$ + "; return;";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $JSCompiler_alias_NULL$$;
            break;
          case 25:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD HL,DE";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
            break;
          case 26:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,(DE)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.readMem(this.getDE());";
            break;
          case 27:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC DE";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.decDE();";
            break;
          case 28:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.inc8(this.e);";
            break;
          case 29:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.dec8(this.e);";
            break;
          case 30:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 31:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RRA";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.rra_a();";
            break;
          case 32:
            $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + 1);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if (!((this.f & F_ZERO) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 5;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 33:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD HL," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 34:
            $code$$inline_218_location$$inline_211_target$$inline_224$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($code$$inline_218_location$$inline_211_target$$inline_224$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + "),HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($code$$inline_218_location$$inline_211_target$$inline_224$$ + 1) + ", this.h);";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 35:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.incHL();";
            break;
          case 36:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.inc8(this.h);";
            break;
          case 37:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.dec8(this.h);";
            break;
          case 38:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 39:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DAA";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.daa();";
            break;
          case 40:
            $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + 1);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 5;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 41:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD HL,HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
            break;
          case 42:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD HL,(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(this.readMemWord(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + "));";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 43:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.decHL();";
            break;
          case 44:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.inc8(this.l);";
            break;
          case 45:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.dec8(this.l);";
            break;
          case 46:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 47:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CPL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cpl_a();";
            break;
          case 48:
            $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + 1);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if (!((this.f & F_CARRY) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 5;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 49:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD SP," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sp = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 50:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + "),A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ", this.a);";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 51:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC SP";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sp++;";
            break;
          case 52:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC (HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.incMem(this.getHL());";
            break;
          case 53:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC (HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.decMem(this.getHL());";
            break;
          case 54:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL)," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 55:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SCF";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
            break;
          case 56:
            $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + 1);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 5;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 57:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD HL,SP";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
            break;
          case 58:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.readMem(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 59:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC SP";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sp--;";
            break;
          case 60:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "INC A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.inc8(this.a);";
            break;
          case 61:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DEC A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.dec8(this.a);";
            break;
          case 62:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ";";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 63:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CCF";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.ccf();";
            break;
          case 64:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 65:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.c;";
            break;
          case 66:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.d;";
            break;
          case 67:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.e;";
            break;
          case 68:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.h;";
            break;
          case 69:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.l;";
            break;
          case 70:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.readMem(this.getHL());";
            break;
          case 71:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD B,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.b = this.a;";
            break;
          case 72:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.b;";
            break;
          case 73:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 74:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.d;";
            break;
          case 75:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.e;";
            break;
          case 76:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.h;";
            break;
          case 77:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.l;";
            break;
          case 78:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.readMem(this.getHL());";
            break;
          case 79:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD C,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.c = this.a;";
            break;
          case 80:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.b;";
            break;
          case 81:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.c;";
            break;
          case 82:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 83:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.e;";
            break;
          case 84:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.h;";
            break;
          case 85:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.l;";
            break;
          case 86:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.readMem(this.getHL());";
            break;
          case 87:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD D,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.d = this.a;";
            break;
          case 88:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.b;";
            break;
          case 89:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.c;";
            break;
          case 90:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.d;";
            break;
          case 91:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 92:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.h;";
            break;
          case 93:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.l;";
            break;
          case 94:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.readMem(this.getHL());";
            break;
          case 95:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD E,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.e = this.a;";
            break;
          case 96:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.b;";
            break;
          case 97:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.c;";
            break;
          case 98:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.d;";
            break;
          case 99:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.e;";
            break;
          case 100:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 101:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.l;";
            break;
          case 102:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.readMem(this.getHL());";
            break;
          case 103:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD H,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.h = this.a;";
            break;
          case 104:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.b;";
            break;
          case 105:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.c;";
            break;
          case 106:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.d;";
            break;
          case 107:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.e;";
            break;
          case 108:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.h;";
            break;
          case 109:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 110:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.readMem(this.getHL());";
            break;
          case 111:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD L,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.l = this.a;";
            break;
          case 112:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.b);";
            break;
          case 113:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.c);";
            break;
          case 114:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.d);";
            break;
          case 115:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.e);";
            break;
          case 116:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.h);";
            break;
          case 117:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.l);";
            break;
          case 118:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "HALT";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.tstates = 0;";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ += "this.halt = true; this.pc--; return;";
            break;
          case 119:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD (HL),A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.writeMem(this.getHL(), this.a);";
            break;
          case 120:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.b;";
            break;
          case 121:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.c;";
            break;
          case 122:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.d;";
            break;
          case 123:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.e;";
            break;
          case 124:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.h;";
            break;
          case 125:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.l;";
            break;
          case 126:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.readMem(this.getHL());";
            break;
          case 127:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 128:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.b);";
            break;
          case 129:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.c);";
            break;
          case 130:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.d);";
            break;
          case 131:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.e);";
            break;
          case 132:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.h);";
            break;
          case 133:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.l);";
            break;
          case 134:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.readMem(this.getHL()));";
            break;
          case 135:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(this.a);";
            break;
          case 136:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.b);";
            break;
          case 137:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.c);";
            break;
          case 138:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.d);";
            break;
          case 139:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.e);";
            break;
          case 140:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.h);";
            break;
          case 141:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.l);";
            break;
          case 142:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.readMem(this.getHL()));";
            break;
          case 143:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(this.a);";
            break;
          case 144:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.b);";
            break;
          case 145:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.c);";
            break;
          case 146:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.d);";
            break;
          case 147:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.e);";
            break;
          case 148:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.h);";
            break;
          case 149:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.l);";
            break;
          case 150:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.readMem(this.getHL()));";
            break;
          case 151:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sub_a(this.a);";
            break;
          case 152:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.b);";
            break;
          case 153:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.c);";
            break;
          case 154:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.d);";
            break;
          case 155:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.e);";
            break;
          case 156:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.h);";
            break;
          case 157:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.l);";
            break;
          case 158:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.readMem(this.getHL()));";
            break;
          case 159:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(this.a);";
            break;
          case 160:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
            break;
          case 161:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
            break;
          case 162:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
            break;
          case 163:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
            break;
          case 164:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
            break;
          case 165:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
            break;
          case 166:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
            break;
          case 167:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
            break;
          case 168:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
            break;
          case 169:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
            break;
          case 170:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
            break;
          case 171:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
            break;
          case 172:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
            break;
          case 173:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
            break;
          case 174:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
            break;
          case 175:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$m$[0]) + "; this.a = " + $JSSMS$Utils$toHex$$(0) + ";";
            break;
          case 176:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
            break;
          case 177:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
            break;
          case 178:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
            break;
          case 179:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
            break;
          case 180:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
            break;
          case 181:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
            break;
          case 182:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
            break;
          case 183:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a];";
            break;
          case 184:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,B";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.b);";
            break;
          case 185:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.c);";
            break;
          case 186:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,D";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.d);";
            break;
          case 187:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,E";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.e);";
            break;
          case 188:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,H";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.h);";
            break;
          case 189:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,L";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.l);";
            break;
          case 190:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,(HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.readMem(this.getHL()));";
            break;
          case 191:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP A,A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(this.a);";
            break;
          case 192:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET NZ";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 193:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "POP BC";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 194:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 195:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $JSCompiler_alias_NULL$$;
            break;
          case 196:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 197:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "PUSH BC";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push2(this.b, this.c);";
            break;
          case 198:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADD A," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.add_a(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 199:
            $address$$inline_219_target$$inline_208$$ = 0;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 200:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET Z";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 201:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.pc = this.readMemWord(this.sp); this.sp += 2; return;";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $JSCompiler_alias_NULL$$;
            break;
          case 202:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 203:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = [$JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$];
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "Unimplemented 0xCB prefixed opcode";
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$;
            $code$$inline_218_location$$inline_211_target$$inline_224$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            switch($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$) {
              case 0:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC B";
                $code$$inline_218_location$$inline_211_target$$inline_224$$ = "this.b = (this.rlc(this.b));";
                break;
              case 1:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC C";
                break;
              case 2:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC D";
                break;
              case 3:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC E";
                break;
              case 4:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC H";
                break;
              case 5:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC L";
                break;
              case 6:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC (HL)";
                break;
              case 7:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLC A";
                break;
              case 8:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC B";
                break;
              case 9:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC C";
                break;
              case 10:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC D";
                break;
              case 11:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC E";
                break;
              case 12:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC H";
                break;
              case 13:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC L";
                break;
              case 14:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC (HL)";
                break;
              case 15:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRC A";
                break;
              case 16:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL B";
                break;
              case 17:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL C";
                break;
              case 18:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL D";
                break;
              case 19:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL E";
                break;
              case 20:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL H";
                break;
              case 21:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL L";
                break;
              case 22:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL (HL)";
                break;
              case 23:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RL A";
                break;
              case 24:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR B";
                break;
              case 25:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR C";
                break;
              case 26:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR D";
                break;
              case 27:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR E";
                break;
              case 28:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR H";
                break;
              case 29:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR L";
                break;
              case 30:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR (HL)";
                break;
              case 31:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RR A";
                break;
              case 32:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA B";
                break;
              case 33:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA C";
                break;
              case 34:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA D";
                break;
              case 35:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA E";
                break;
              case 36:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA H";
                break;
              case 37:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA L";
                break;
              case 38:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA (HL)";
                break;
              case 39:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLA A";
                break;
              case 40:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA B";
                break;
              case 41:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA C";
                break;
              case 42:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA D";
                break;
              case 43:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA E";
                break;
              case 44:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA H";
                break;
              case 45:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA L";
                break;
              case 46:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA (HL)";
                break;
              case 47:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRA A";
                break;
              case 48:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL B";
                break;
              case 49:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL C";
                break;
              case 50:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL D";
                break;
              case 51:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL E";
                break;
              case 52:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL H";
                break;
              case 53:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL L";
                break;
              case 54:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL (HL)";
                break;
              case 55:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SLL A";
                break;
              case 56:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL B";
                break;
              case 57:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL C";
                break;
              case 58:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL D";
                break;
              case 59:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL E";
                break;
              case 60:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL H";
                break;
              case 61:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL L";
                break;
              case 62:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL (HL)";
                break;
              case 63:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SRL A";
                break;
              case 64:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,B";
                break;
              case 65:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,C";
                break;
              case 66:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,D";
                break;
              case 67:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,E";
                break;
              case 68:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,H";
                break;
              case 69:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,L";
                break;
              case 70:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,(HL)";
                break;
              case 71:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 0,A";
                break;
              case 72:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,B";
                break;
              case 73:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,C";
                break;
              case 74:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,D";
                break;
              case 75:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,E";
                break;
              case 76:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,H";
                break;
              case 77:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,L";
                break;
              case 78:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,(HL)";
                break;
              case 79:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 1,A";
                break;
              case 80:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,B";
                break;
              case 81:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,C";
                break;
              case 82:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,D";
                break;
              case 83:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,E";
                break;
              case 84:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,H";
                break;
              case 85:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,L";
                break;
              case 86:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,(HL)";
                break;
              case 87:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 2,A";
                break;
              case 88:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,B";
                break;
              case 89:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,C";
                break;
              case 90:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,D";
                break;
              case 91:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,E";
                break;
              case 92:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,H";
                break;
              case 93:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,L";
                break;
              case 94:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,(HL)";
                break;
              case 95:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 3,A";
                break;
              case 96:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,B";
                break;
              case 97:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,C";
                break;
              case 98:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,D";
                break;
              case 99:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,E";
                break;
              case 100:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,H";
                break;
              case 101:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,L";
                break;
              case 102:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,(HL)";
                break;
              case 103:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 4,A";
                break;
              case 104:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,B";
                break;
              case 105:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,C";
                break;
              case 106:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,D";
                break;
              case 107:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,E";
                break;
              case 108:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,H";
                break;
              case 109:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,L";
                break;
              case 110:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,(HL)";
                break;
              case 111:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 5,A";
                break;
              case 112:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,B";
                break;
              case 113:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,C";
                break;
              case 114:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,D";
                break;
              case 115:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,E";
                break;
              case 116:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,H";
                break;
              case 117:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,L";
                break;
              case 118:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,(HL)";
                break;
              case 119:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 6,A";
                break;
              case 120:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,B";
                break;
              case 121:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,C";
                break;
              case 122:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,D";
                break;
              case 123:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,E";
                break;
              case 124:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,H";
                break;
              case 125:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,L";
                break;
              case 126:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,(HL)";
                break;
              case 127:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "BIT 7,A";
                break;
              case 128:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,B";
                break;
              case 129:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,C";
                break;
              case 130:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,D";
                break;
              case 131:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,E";
                break;
              case 132:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,H";
                break;
              case 133:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,L";
                break;
              case 134:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,(HL)";
                break;
              case 135:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 0,A";
                break;
              case 136:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,B";
                break;
              case 137:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,C";
                break;
              case 138:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,D";
                break;
              case 139:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,E";
                break;
              case 140:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,H";
                break;
              case 141:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,L";
                break;
              case 142:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,(HL)";
                break;
              case 143:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 1,A";
                break;
              case 144:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,B";
                break;
              case 145:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,C";
                break;
              case 146:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,D";
                break;
              case 147:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,E";
                break;
              case 148:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,H";
                break;
              case 149:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,L";
                break;
              case 150:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,(HL)";
                break;
              case 151:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 2,A";
                break;
              case 152:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,B";
                break;
              case 153:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,C";
                break;
              case 154:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,D";
                break;
              case 155:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,E";
                break;
              case 156:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,H";
                break;
              case 157:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,L";
                break;
              case 158:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,(HL)";
                break;
              case 159:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 3,A";
                break;
              case 160:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,B";
                break;
              case 161:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,C";
                break;
              case 162:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,D";
                break;
              case 163:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,E";
                break;
              case 164:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,H";
                break;
              case 165:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,L";
                break;
              case 166:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,(HL)";
                break;
              case 167:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 4,A";
                break;
              case 168:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,B";
                break;
              case 169:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,C";
                break;
              case 170:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,D";
                break;
              case 171:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,E";
                break;
              case 172:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,H";
                break;
              case 173:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,L";
                break;
              case 174:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,(HL)";
                break;
              case 175:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 5,A";
                break;
              case 176:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,B";
                break;
              case 177:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,C";
                break;
              case 178:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,D";
                break;
              case 179:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,E";
                break;
              case 180:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,H";
                break;
              case 181:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,L";
                break;
              case 182:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,(HL)";
                break;
              case 183:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 6,A";
                break;
              case 184:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,B";
                break;
              case 185:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,C";
                break;
              case 186:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,D";
                break;
              case 187:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,E";
                break;
              case 188:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,H";
                break;
              case 189:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,L";
                break;
              case 190:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,(HL)";
                break;
              case 191:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RES 7,A";
                break;
              case 192:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,B";
                break;
              case 193:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,C";
                break;
              case 194:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,D";
                break;
              case 195:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,E";
                break;
              case 196:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,H";
                break;
              case 197:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,L";
                break;
              case 198:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,(HL)";
                break;
              case 199:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 0,A";
                break;
              case 200:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,B";
                break;
              case 201:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,C";
                break;
              case 202:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,D";
                break;
              case 203:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,E";
                break;
              case 204:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,H";
                break;
              case 205:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,L";
                break;
              case 206:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,(HL)";
                break;
              case 207:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 1,A";
                break;
              case 208:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,B";
                break;
              case 209:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,C";
                break;
              case 210:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,D";
                break;
              case 211:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,E";
                break;
              case 212:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,H";
                break;
              case 213:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,L";
                break;
              case 214:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,(HL)";
                break;
              case 215:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 2,A";
                break;
              case 216:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,B";
                break;
              case 217:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,C";
                break;
              case 218:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,D";
                break;
              case 219:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,E";
                break;
              case 220:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,H";
                break;
              case 221:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,L";
                break;
              case 222:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,(HL)";
                break;
              case 223:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 3,A";
                break;
              case 224:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,B";
                break;
              case 225:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,C";
                break;
              case 226:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,D";
                break;
              case 227:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,E";
                break;
              case 228:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,H";
                break;
              case 229:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,L";
                break;
              case 230:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,(HL)";
                break;
              case 231:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 4,A";
                break;
              case 232:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,B";
                break;
              case 233:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,C";
                break;
              case 234:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,D";
                break;
              case 235:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,E";
                break;
              case 236:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,H";
                break;
              case 237:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,L";
                break;
              case 238:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,(HL)";
                break;
              case 239:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 5,A";
                break;
              case 240:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,B";
                break;
              case 241:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,C";
                break;
              case 242:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,D";
                break;
              case 243:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,E";
                break;
              case 244:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,H";
                break;
              case 245:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,L";
                break;
              case 246:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,(HL)";
                break;
              case 247:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 6,A";
                break;
              case 248:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,B";
                break;
              case 249:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,C";
                break;
              case 250:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,D";
                break;
              case 251:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,E";
                break;
              case 252:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,H";
                break;
              case 253:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,L";
                break;
              case 254:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,(HL)";
                break;
              case 255:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SET 7,A"
            }
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$, $opcodes$:$inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$, $inst$:$code$$inline_209_inst$$inline_216_inst$$inline_222$$, code:$code$$inline_218_location$$inline_211_target$$inline_224$$, $address$:$_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$, 
            $nextAddress$:$address$$inline_203_address$$inline_213_opcode$$inline_220$$};
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$inst$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.code;
            $defaultInstruction$$inline_227_opcodesArray$$inline_205$$ = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.concat($_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$opcodes$);
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$nextAddress$;
            break;
          case 204:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_ZERO) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 205:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 206:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "ADC ," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.adc_a(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 207:
            $address$$inline_219_target$$inline_208$$ = 8;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 208:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET NC";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 209:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "POP DE";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 210:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 211:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OUT (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$)) + "),A";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.port.out(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$)) + ", this.a);";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 212:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 213:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "PUSH DE";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push2(this.d, this.e);";
            break;
          case 214:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SUB " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "";
            break;
          case 215:
            $address$$inline_219_target$$inline_208$$ = 16;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 216:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET C";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 217:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "EXX";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.exBC(); this.exDE(); this.exHL();";
            break;
          case 218:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 219:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "IN A,(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.a = this.port.in_(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 220:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_CARRY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 221:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$, "IX", $address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$inst$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.code;
            $defaultInstruction$$inline_227_opcodesArray$$inline_205$$ = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.concat($_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$opcodes$);
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$nextAddress$;
            break;
          case 222:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "SBC A," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sbc_a(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 223:
            $address$$inline_219_target$$inline_208$$ = 24;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 224:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET PO";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_PARITY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 225:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "POP HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 226:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_PARITY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 227:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "EX (SP),HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "temp = this.h;this.h = this.readMem(this.sp + 1);this.writeMem(this.sp + 1, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
            break;
          case 228:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_PARITY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 229:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "PUSH HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push2(this.h, this.l);";
            break;
          case 230:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "AND (" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + "] | F_HALFCARRY;";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 231:
            $address$$inline_219_target$$inline_208$$ = 32;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 232:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET PE";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_PARITY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 233:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP (HL)";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.pc = this.getHL(); return;";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $JSCompiler_alias_NULL$$;
            break;
          case 234:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_PARITY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 235:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "EX DE,HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
            break;
          case 236:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_PARITY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 237:
            var $address$$inline_219_target$$inline_208$$ = $address$$inline_203_address$$inline_213_opcode$$inline_220$$, $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_219_target$$inline_208$$), $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = [$address$$inline_203_address$$inline_213_opcode$$inline_220$$], $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = 
            "Unimplemented 0xED prefixed opcode", $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $address$$inline_219_target$$inline_208$$, $code$$inline_218_location$$inline_211_target$$inline_224$$ = $JSCompiler_alias_NULL$$, $code$$inline_225$$ = 'throw "Unimplemented 0xED prefixed opcode";';
            $address$$inline_219_target$$inline_208$$++;
            switch($address$$inline_203_address$$inline_213_opcode$$inline_220$$) {
              case 64:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN B,(C)";
                break;
              case 65:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),B";
                break;
              case 66:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SBC HL,BC";
                break;
              case 67:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + "),BC";
                $address$$inline_219_target$$inline_208$$ += 2;
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
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "NEG";
                $code$$inline_225$$ = "temp = this.a;this.a = 0;this.sub_a(temp);";
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
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RETN / RETI";
                $address$$inline_219_target$$inline_208$$ = $JSCompiler_alias_NULL$$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IM 0";
                break;
              case 71:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD I,A";
                break;
              case 72:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN C,(C)";
                break;
              case 73:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),C";
                break;
              case 74:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "ADC HL,BC";
                break;
              case 75:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD BC,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + ")";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 79:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD R,A";
                break;
              case 80:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN D,(C)";
                break;
              case 81:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),D";
                break;
              case 82:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SBC HL,DE";
                break;
              case 83:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + "),DE";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 86:
              ;
              case 118:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IM 1";
                $code$$inline_225$$ = "this.im = 1;";
                break;
              case 87:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD A,I";
                break;
              case 88:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN E,(C)";
                break;
              case 89:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),E";
                break;
              case 90:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "ADC HL,DE";
                break;
              case 91:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD DE,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + ")";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 95:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD A,R";
                $code$$inline_225$$ = "this.a = JSSMS.Utils.rndInt(255);";
                $code$$inline_225$$ += "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 96:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN H,(C)";
                break;
              case 97:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),H";
                break;
              case 98:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SBC HL,HL";
                break;
              case 99:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + "),HL";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 103:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RRD";
                break;
              case 104:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN L,(C)";
                break;
              case 105:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),L";
                break;
              case 106:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "ADC HL,HL";
                break;
              case 107:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD HL,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + ")";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 111:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "RLD";
                break;
              case 113:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),0";
                break;
              case 114:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "SBC HL,SP";
                break;
              case 115:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + "),SP";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 120:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IN A,(C)";
                break;
              case 121:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUT (C),A";
                break;
              case 122:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "ADC HL,SP";
                break;
              case 123:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LD SP,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_219_target$$inline_208$$)) + ")";
                $address$$inline_219_target$$inline_208$$ += 2;
                break;
              case 160:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LDI";
                break;
              case 161:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "CPI";
                break;
              case 162:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "INI";
                break;
              case 163:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUTI";
                $code$$inline_225$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 168:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LDD";
                break;
              case 169:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "CPD";
                break;
              case 170:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "IND";
                break;
              case 171:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OUTD";
                break;
              case 176:
                $code$$inline_218_location$$inline_211_target$$inline_224$$ = $address$$inline_219_target$$inline_208$$ - 2;
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LDIR";
                $code$$inline_225$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();if (this.getBC() != 0) {this.f |= F_PARITY;this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_218_location$$inline_211_target$$inline_224$$) + ";return;} else {this.f &= ~ F_PARITY;}this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
                break;
              case 177:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "CPIR";
                break;
              case 178:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "INIR";
                break;
              case 179:
                $code$$inline_218_location$$inline_211_target$$inline_224$$ = $address$$inline_219_target$$inline_208$$ - 2;
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OTIR";
                $code$$inline_225$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_218_location$$inline_211_target$$inline_224$$) + ";return;}if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 184:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "LDDR";
                break;
              case 185:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "CPDR";
                break;
              case 186:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "INDR";
                break;
              case 187:
                $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "OTDR"
            }
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = {$opcode$:$address$$inline_203_address$$inline_213_opcode$$inline_220$$, $opcodes$:$inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$, $inst$:$code$$inline_209_inst$$inline_216_inst$$inline_222$$, code:$code$$inline_225$$, $address$:$_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$, $nextAddress$:$address$$inline_219_target$$inline_208$$, target:$code$$inline_218_location$$inline_211_target$$inline_224$$};
            $address$$inline_219_target$$inline_208$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.target;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$inst$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.code;
            $defaultInstruction$$inline_227_opcodesArray$$inline_205$$ = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.concat($_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$opcodes$);
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$nextAddress$;
            break;
          case 238:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "XOR A," + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + "];";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 239:
            $address$$inline_219_target$$inline_208$$ = 40;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 240:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET P";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_SIGN) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 241:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "POP AF";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.readMem(this.sp++); this.a = this.readMem(this.sp++);";
            break;
          case 242:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_SIGN) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 243:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "DI";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.iff1 = this.iff2 = false; this.EI_inst = true;";
            break;
          case 244:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_SIGN) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 245:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "PUSH AF";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push2(this.a, this.f);";
            break;
          case 246:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "OR " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + "];";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 247:
            $address$$inline_219_target$$inline_208$$ = 48;
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$);
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;";
            break;
          case 248:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RET M";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_SIGN) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 249:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "LD SP,HL";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.sp = this.getHL()";
            break;
          case 250:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_SIGN) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 251:
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "EI";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.iff1 = this.iff2 = this.EI_inst = true;";
            break;
          case 252:
            $address$$inline_219_target$$inline_208$$ = $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$l$($address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ")";
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "if ((this.f & F_SIGN) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + ";this.tstates -= 7;return;}";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ += 2;
            break;
          case 253:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$, "IY", $address$$inline_203_address$$inline_213_opcode$$inline_220$$);
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$inst$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.code;
            $defaultInstruction$$inline_227_opcodesArray$$inline_205$$ = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.concat($_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$opcodes$);
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$ = $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$.$nextAddress$;
            break;
          case 254:
            $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$.$a$($address$$inline_203_address$$inline_213_opcode$$inline_220$$));
            $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "CP " + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$;
            $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.cp_a(" + $_inst$$inline_212_currAddr$$inline_217_currAddr$$inline_223_operand$$inline_210$$ + ");";
            $address$$inline_203_address$$inline_213_opcode$$inline_220$$++;
            break;
          case 255:
            $address$$inline_219_target$$inline_208$$ = 56, $inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$), $code$$inline_209_inst$$inline_216_inst$$inline_222$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_203_address$$inline_213_opcode$$inline_220$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_219_target$$inline_208$$) + "; return;"
        }
        $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$ = {$opcode$:$instruction$$inline_160_opcode$$inline_204_options$$inline_226$$, $opcodes$:$defaultInstruction$$inline_227_opcodesArray$$inline_205$$, $inst$:$inst$$inline_206_opcodesArray$$inline_215_opcodesArray$$inline_221$$, code:$code$$inline_209_inst$$inline_216_inst$$inline_222$$, $address$:$currAddr$$inline_207_prop$$inline_228$$, $nextAddress$:$address$$inline_203_address$$inline_213_opcode$$inline_220$$, target:$address$$inline_219_target$$inline_208$$};
        $defaultInstruction$$inline_227_opcodesArray$$inline_205$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:$JSCompiler_alias_NULL$$, target:$JSCompiler_alias_NULL$$, $isJumpTarget$:$JSCompiler_alias_FALSE$$, label:""};
        $currAddr$$inline_207_prop$$inline_228$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$ = "";
        for($currAddr$$inline_207_prop$$inline_228$$ in $defaultInstruction$$inline_227_opcodesArray$$inline_205$$) {
          $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$[$currAddr$$inline_207_prop$$inline_228$$] != $JSCompiler_alias_VOID$$ && ($defaultInstruction$$inline_227_opcodesArray$$inline_205$$[$currAddr$$inline_207_prop$$inline_228$$] = $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$[$currAddr$$inline_207_prop$$inline_228$$])
        }
        $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_227_opcodesArray$$inline_205$$.$address$);
        $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.$opcodes$.length && ($JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$ = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
        $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.label = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.$hexAddress$ + " " + $JSCompiler_StaticMethods_disassemble$self$$inline_202_hexOpcodes$$inline_229_opcode$$inline_214$$ + $defaultInstruction$$inline_227_opcodesArray$$inline_205$$.$inst$;
        $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$ = $defaultInstruction$$inline_227_opcodesArray$$inline_205$$;
        $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$currentAddress$$inline_161_fractional$$inline_14$$] = $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$;
        $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$.$nextAddress$ != $JSCompiler_alias_NULL$$ && $addresses$$inline_163$$.push($instruction$$inline_160_opcode$$inline_204_options$$inline_226$$.$nextAddress$);
        $instruction$$inline_160_opcode$$inline_204_options$$inline_226$$.target != $JSCompiler_alias_NULL$$ && $addresses$$inline_163$$.push($instruction$$inline_160_opcode$$inline_204_options$$inline_226$$.target)
      }
    }
  }
  for($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[0].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;$i$$inline_162$$ < $JSCompiler_StaticMethods_init$self$$inline_154_mode$$inline_10_romSize$$inline_159_v$$inline_13$$;$i$$inline_162$$++) {
    $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$] && $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target] ? 
    $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target].$isJumpTarget$ = $JSCompiler_alias_TRUE$$ : console.log("Invalid target address", $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$w$[$i$$inline_162$$].target))
  }
  console.timeEnd("Instructions parsing");
  $JSCompiler_StaticMethods_resetDebug$self$$inline_16_clockSpeedHz$$inline_11_i$$inline_12_i$$inline_156$$.$aa$.$b$.updateStatus("Instructions parsed");
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
      if($JSCompiler_StaticMethods_run$self$$inline_165$$.$F$) {
        var $JSCompiler_StaticMethods_interrupt$self$$inline_231$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
        $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$B$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$J$ && ($JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$d$++, $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$J$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$B$ = $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$C$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$F$ = $JSCompiler_alias_FALSE$$, 
        $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$inline_231$$, $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$d$), 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$K$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$d$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$L$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$L$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$L$, $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$o$ -= 
        13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$K$ ? ($JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$d$ = 56, $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$o$ -= 13) : ($JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$d$ = $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$l$(($JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$O$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$L$), $JSCompiler_StaticMethods_interrupt$self$$inline_231$$.$o$ -= 
        19))
      }
      for(;0 < $JSCompiler_StaticMethods_run$self$$inline_165$$.$o$;) {
        switch($opcode$$inline_168$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $JSCompiler_StaticMethods_run$self$$inline_165$$.$o$ -= $OP_STATES$$[$opcode$$inline_168$$], $opcode$$inline_168$$) {
          case 1:
            var $JSCompiler_StaticMethods_setBC$self$$inline_367$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_368$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            $JSCompiler_StaticMethods_setBC$self$$inline_367$$.$g$ = $value$$inline_368$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_367$$.$f$ = $value$$inline_368$$ & 255;
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++;
            break;
          case 2:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$e$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_run$self$$inline_165$$), $JSCompiler_StaticMethods_run$self$$inline_165$$.$b$);
            break;
          case 3:
            var $JSCompiler_StaticMethods_incBC$self$$inline_233$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
            $JSCompiler_StaticMethods_incBC$self$$inline_233$$.$f$ = $JSCompiler_StaticMethods_incBC$self$$inline_233$$.$f$ + 1 & 255;
            0 == $JSCompiler_StaticMethods_incBC$self$$inline_233$$.$f$ && ($JSCompiler_StaticMethods_incBC$self$$inline_233$$.$g$ = $JSCompiler_StaticMethods_incBC$self$$inline_233$$.$g$ + 1 & 255);
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
            var $JSCompiler_StaticMethods_rlca_a$self$$inline_235$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_236$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_235$$.$b$ >> 7;
            $JSCompiler_StaticMethods_rlca_a$self$$inline_235$$.$b$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_235$$.$b$ << 1 & 255 | $carry$$inline_236$$;
            $JSCompiler_StaticMethods_rlca_a$self$$inline_235$$.$c$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_235$$.$c$ & 236 | $carry$$inline_236$$;
            break;
          case 8:
            var $JSCompiler_StaticMethods_exAF$self$$inline_238$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_239$$ = $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$b$;
            $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$b$ = $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$Q$;
            $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$Q$ = $temp$$inline_239$$;
            $temp$$inline_239$$ = $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$c$;
            $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$c$ = $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$V$;
            $JSCompiler_StaticMethods_exAF$self$$inline_238$$.$V$ = $temp$$inline_239$$;
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
            var $JSCompiler_StaticMethods_rrca_a$self$$inline_241$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_242$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_241$$.$b$ & 1;
            $JSCompiler_StaticMethods_rrca_a$self$$inline_241$$.$b$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_241$$.$b$ >> 1 | $carry$$inline_242$$ << 7;
            $JSCompiler_StaticMethods_rrca_a$self$$inline_241$$.$c$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_241$$.$c$ & 236 | $carry$$inline_242$$;
            break;
          case 16:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$ - 1 & 255;
            $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_run$self$$inline_165$$, 0 != $JSCompiler_StaticMethods_run$self$$inline_165$$.$g$);
            break;
          case 17:
            var $JSCompiler_StaticMethods_setDE$self$$inline_370$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_371$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            $JSCompiler_StaticMethods_setDE$self$$inline_370$$.$j$ = $value$$inline_371$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_370$$.$h$ = $value$$inline_371$$ & 255;
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
            var $JSCompiler_StaticMethods_rla_a$self$$inline_244$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_245$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_244$$.$b$ >> 7;
            $JSCompiler_StaticMethods_rla_a$self$$inline_244$$.$b$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_244$$.$b$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_244$$.$c$ & 1) & 255;
            $JSCompiler_StaticMethods_rla_a$self$$inline_244$$.$c$ = $JSCompiler_StaticMethods_rla_a$self$$inline_244$$.$c$ & 236 | $carry$$inline_245$$;
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
            var $JSCompiler_StaticMethods_rra_a$self$$inline_247$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $carry$$inline_248$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_247$$.$b$ & 1;
            $JSCompiler_StaticMethods_rra_a$self$$inline_247$$.$b$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_247$$.$b$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_247$$.$c$ & 1) << 7) & 255;
            $JSCompiler_StaticMethods_rra_a$self$$inline_247$$.$c$ = $JSCompiler_StaticMethods_rra_a$self$$inline_247$$.$c$ & 236 | $carry$$inline_248$$;
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
            var $JSCompiler_StaticMethods_daa$self$$inline_250$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_251$$ = $JSCompiler_StaticMethods_daa$self$$inline_250$$.$Z$[$JSCompiler_StaticMethods_daa$self$$inline_250$$.$b$ | ($JSCompiler_StaticMethods_daa$self$$inline_250$$.$c$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_250$$.$c$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_250$$.$c$ & 16) << 6];
            $JSCompiler_StaticMethods_daa$self$$inline_250$$.$b$ = $temp$$inline_251$$ & 255;
            $JSCompiler_StaticMethods_daa$self$$inline_250$$.$c$ = $JSCompiler_StaticMethods_daa$self$$inline_250$$.$c$ & 2 | $temp$$inline_251$$ >> 8;
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
            var $JSCompiler_StaticMethods_cpl_a$self$$inline_253$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
            $JSCompiler_StaticMethods_cpl_a$self$$inline_253$$.$b$ ^= 255;
            $JSCompiler_StaticMethods_cpl_a$self$$inline_253$$.$c$ |= 18;
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
            var $JSCompiler_StaticMethods_ccf$self$$inline_255$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$;
            0 != ($JSCompiler_StaticMethods_ccf$self$$inline_255$$.$c$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_255$$.$c$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_255$$.$c$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_255$$.$c$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_255$$.$c$ &= -17);
            $JSCompiler_StaticMethods_ccf$self$$inline_255$$.$c$ &= -3;
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
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$J$ = $JSCompiler_alias_TRUE$$;
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
            var $JSCompiler_StaticMethods_setBC$self$$inline_373$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_374$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$);
            $JSCompiler_StaticMethods_setBC$self$$inline_373$$.$g$ = $value$$inline_374$$ >> 8;
            $JSCompiler_StaticMethods_setBC$self$$inline_373$$.$f$ = $value$$inline_374$$ & 255;
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
            var $JSCompiler_StaticMethods_doCB$self$$inline_257$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_258$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++);
            $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$o$ -= $OP_CB_STATES$$[$opcode$$inline_258$$];
            switch($opcode$$inline_258$$) {
              case 0:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 1:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 2:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 3:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 4:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 5:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 6:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 7:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 8:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 9:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 10:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 11:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 12:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 13:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 14:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 15:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 16:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 17:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 18:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 19:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 20:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 21:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 22:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 23:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 24:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 25:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 26:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 27:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 28:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 29:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 30:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 31:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 32:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 33:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 34:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 35:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 36:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 39:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 40:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 41:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 42:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 43:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 44:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 47:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 48:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 49:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 50:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 51:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 52:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 53:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 54:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 55:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 56:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$);
                break;
              case 57:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$);
                break;
              case 58:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$);
                break;
              case 59:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$);
                break;
              case 60:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$);
                break;
              case 61:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$);
                break;
              case 62:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$))));
                break;
              case 63:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$);
                break;
              case 64:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 1);
                break;
              case 65:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 1);
                break;
              case 66:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 1);
                break;
              case 67:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 1);
                break;
              case 68:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 1);
                break;
              case 69:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 1);
                break;
              case 70:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 1);
                break;
              case 71:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 1);
                break;
              case 72:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 2);
                break;
              case 73:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 2);
                break;
              case 74:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 2);
                break;
              case 75:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 2);
                break;
              case 76:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 2);
                break;
              case 77:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 2);
                break;
              case 78:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 2);
                break;
              case 79:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 2);
                break;
              case 80:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 4);
                break;
              case 81:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 4);
                break;
              case 82:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 4);
                break;
              case 83:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 4);
                break;
              case 84:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 4);
                break;
              case 85:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 4);
                break;
              case 86:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 4);
                break;
              case 87:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 4);
                break;
              case 88:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 8);
                break;
              case 89:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 8);
                break;
              case 90:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 8);
                break;
              case 91:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 8);
                break;
              case 92:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 8);
                break;
              case 93:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 8);
                break;
              case 94:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 8);
                break;
              case 95:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 8);
                break;
              case 96:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 16);
                break;
              case 97:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 16);
                break;
              case 98:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 16);
                break;
              case 99:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 16);
                break;
              case 100:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 16);
                break;
              case 101:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 16);
                break;
              case 102:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 16);
                break;
              case 103:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 16);
                break;
              case 104:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 32);
                break;
              case 105:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 32);
                break;
              case 106:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 32);
                break;
              case 107:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 32);
                break;
              case 108:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 32);
                break;
              case 109:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 32);
                break;
              case 110:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 32);
                break;
              case 111:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 32);
                break;
              case 112:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 64);
                break;
              case 113:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 64);
                break;
              case 114:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 64);
                break;
              case 115:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 64);
                break;
              case 116:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 64);
                break;
              case 117:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 64);
                break;
              case 118:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 64);
                break;
              case 119:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 64);
                break;
              case 120:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ & 128);
                break;
              case 121:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ & 128);
                break;
              case 122:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ & 128);
                break;
              case 123:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ & 128);
                break;
              case 124:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ & 128);
                break;
              case 125:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ & 128);
                break;
              case 126:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & 128);
                break;
              case 127:
                $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$, $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ & 128);
                break;
              case 128:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -2;
                break;
              case 129:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -2;
                break;
              case 130:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -2;
                break;
              case 131:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -2;
                break;
              case 132:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -2;
                break;
              case 133:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -2;
                break;
              case 134:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -2);
                break;
              case 135:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -2;
                break;
              case 136:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -3;
                break;
              case 137:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -3;
                break;
              case 138:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -3;
                break;
              case 139:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -3;
                break;
              case 140:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -3;
                break;
              case 141:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -3;
                break;
              case 142:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -3);
                break;
              case 143:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -3;
                break;
              case 144:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -5;
                break;
              case 145:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -5;
                break;
              case 146:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -5;
                break;
              case 147:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -5;
                break;
              case 148:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -5;
                break;
              case 149:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -5;
                break;
              case 150:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -5);
                break;
              case 151:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -5;
                break;
              case 152:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -9;
                break;
              case 153:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -9;
                break;
              case 154:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -9;
                break;
              case 155:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -9;
                break;
              case 156:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -9;
                break;
              case 157:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -9;
                break;
              case 158:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -9);
                break;
              case 159:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -9;
                break;
              case 160:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -17;
                break;
              case 161:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -17;
                break;
              case 162:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -17;
                break;
              case 163:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -17;
                break;
              case 164:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -17;
                break;
              case 165:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -17;
                break;
              case 166:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -17);
                break;
              case 167:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -17;
                break;
              case 168:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -33;
                break;
              case 169:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -33;
                break;
              case 170:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -33;
                break;
              case 171:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -33;
                break;
              case 172:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -33;
                break;
              case 173:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -33;
                break;
              case 174:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -33);
                break;
              case 175:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -33;
                break;
              case 176:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -65;
                break;
              case 177:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -65;
                break;
              case 178:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -65;
                break;
              case 179:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -65;
                break;
              case 180:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -65;
                break;
              case 181:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -65;
                break;
              case 182:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -65);
                break;
              case 183:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -65;
                break;
              case 184:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ &= -129;
                break;
              case 185:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ &= -129;
                break;
              case 186:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ &= -129;
                break;
              case 187:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ &= -129;
                break;
              case 188:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ &= -129;
                break;
              case 189:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ &= -129;
                break;
              case 190:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) & -129);
                break;
              case 191:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ &= -129;
                break;
              case 192:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 1;
                break;
              case 193:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 1;
                break;
              case 194:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 1;
                break;
              case 195:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 1;
                break;
              case 196:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 1;
                break;
              case 197:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 1;
                break;
              case 198:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 1);
                break;
              case 199:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 1;
                break;
              case 200:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 2;
                break;
              case 201:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 2;
                break;
              case 202:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 2;
                break;
              case 203:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 2;
                break;
              case 204:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 2;
                break;
              case 205:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 2;
                break;
              case 206:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 2);
                break;
              case 207:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 2;
                break;
              case 208:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 4;
                break;
              case 209:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 4;
                break;
              case 210:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 4;
                break;
              case 211:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 4;
                break;
              case 212:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 4;
                break;
              case 213:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 4;
                break;
              case 214:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 4);
                break;
              case 215:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 4;
                break;
              case 216:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 8;
                break;
              case 217:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 8;
                break;
              case 218:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 8;
                break;
              case 219:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 8;
                break;
              case 220:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 8;
                break;
              case 221:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 8;
                break;
              case 222:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 8);
                break;
              case 223:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 8;
                break;
              case 224:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 16;
                break;
              case 225:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 16;
                break;
              case 226:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 16;
                break;
              case 227:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 16;
                break;
              case 228:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 16;
                break;
              case 229:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 16;
                break;
              case 230:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 16);
                break;
              case 231:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 16;
                break;
              case 232:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 32;
                break;
              case 233:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 32;
                break;
              case 234:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 32;
                break;
              case 235:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 32;
                break;
              case 236:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 32;
                break;
              case 237:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 32;
                break;
              case 238:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 32);
                break;
              case 239:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 32;
                break;
              case 240:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 64;
                break;
              case 241:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 64;
                break;
              case 242:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 64;
                break;
              case 243:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 64;
                break;
              case 244:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 64;
                break;
              case 245:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 64;
                break;
              case 246:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 64);
                break;
              case 247:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 64;
                break;
              case 248:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$g$ |= 128;
                break;
              case 249:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$f$ |= 128;
                break;
              case 250:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$j$ |= 128;
                break;
              case 251:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$h$ |= 128;
                break;
              case 252:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$k$ |= 128;
                break;
              case 253:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$i$ |= 128;
                break;
              case 254:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$), $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_257$$)) | 128);
                break;
              case 255:
                $JSCompiler_StaticMethods_doCB$self$$inline_257$$.$b$ |= 128;
                break;
              default:
                console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_258$$))
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
            var $JSCompiler_StaticMethods_setDE$self$$inline_376$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $value$$inline_377$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$l$($JSCompiler_StaticMethods_run$self$$inline_165$$.$n$);
            $JSCompiler_StaticMethods_setDE$self$$inline_376$$.$j$ = $value$$inline_377$$ >> 8;
            $JSCompiler_StaticMethods_setDE$self$$inline_376$$.$h$ = $value$$inline_377$$ & 255;
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
            var $JSCompiler_StaticMethods_exBC$self$$inline_260$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_261$$ = $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$g$;
            $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$g$ = $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$R$;
            $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$R$ = $temp$$inline_261$$;
            $temp$$inline_261$$ = $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$f$;
            $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$f$ = $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$S$;
            $JSCompiler_StaticMethods_exBC$self$$inline_260$$.$S$ = $temp$$inline_261$$;
            var $JSCompiler_StaticMethods_exDE$self$$inline_263$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_264$$ = $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$j$;
            $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$j$ = $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$T$;
            $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$T$ = $temp$$inline_264$$;
            $temp$$inline_264$$ = $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$h$;
            $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$h$ = $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$U$;
            $JSCompiler_StaticMethods_exDE$self$$inline_263$$.$U$ = $temp$$inline_264$$;
            var $JSCompiler_StaticMethods_exHL$self$$inline_266$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $temp$$inline_267$$ = $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$k$;
            $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$k$ = $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$W$;
            $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$W$ = $temp$$inline_267$$;
            $temp$$inline_267$$ = $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$i$;
            $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$i$ = $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$X$;
            $JSCompiler_StaticMethods_exHL$self$$inline_266$$.$X$ = $temp$$inline_267$$;
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
            var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_270$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $location$$inline_271$$ = 0, $temp$$inline_272$$ = 0;
            $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_270$$];
            switch($opcode$$inline_270$$) {
              case 9:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$ += 2;
                break;
              case 34:
                $location$$inline_271$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($location$$inline_271$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($location$$inline_271$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                break;
              case 42:
                $location$$inline_271$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($location$$inline_271$$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$(++$location$$inline_271$$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$));
                break;
              case 68:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$;
                break;
              case 69:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$;
                break;
              case 70:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$;
                break;
              case 77:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$;
                break;
              case 78:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$;
                break;
              case 85:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$;
                break;
              case 86:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$;
                break;
              case 93:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$;
                break;
              case 94:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$g$;
                break;
              case 97:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$f$;
                break;
              case 98:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$j$;
                break;
              case 99:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$h$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$;
                break;
              case 102:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$g$;
                break;
              case 105:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$f$;
                break;
              case 106:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$j$;
                break;
              case 107:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$h$;
                break;
              case 108:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$g$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$f$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$j$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$h$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$k$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$i$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$;
                break;
              case 125:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$;
                break;
              case 126:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$))] | 16;
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$];
                break;
              case 173:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$];
                break;
              case 174:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$))];
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$];
                break;
              case 181:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$];
                break;
              case 182:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$m$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$))];
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$a$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$)));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$ += 2;
                break;
              case 227:
                $temp$$inline_272$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$);
                $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$l$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$, $temp$$inline_272$$ & 255);
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$ + 1, $temp$$inline_272$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$r$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$p$);
                break;
              case 233:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$n$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$);
                break;
              default:
                console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_270$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_269$$.$d$--
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
            var $JSCompiler_StaticMethods_doED$self$$inline_274$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_275$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$), $temp$$inline_276$$ = 0, $location$$inline_277$$ = 0, $hlmem$$inline_278$$ = 0;
            $JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= $OP_ED_STATES$$[$opcode$$inline_275$$];
            switch($opcode$$inline_275$$) {
              case 64:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 65:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 66:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 67:
                $location$$inline_277$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$++, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
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
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ = 0;
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
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
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$ += 2;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$B$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$C$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$K$ = 0;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 71:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$O$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 72:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 73:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 74:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 75:
                var $JSCompiler_StaticMethods_setBC$self$$inline_379$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$, $value$$inline_380$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1));
                $JSCompiler_StaticMethods_setBC$self$$inline_379$$.$g$ = $value$$inline_380$$ >> 8;
                $JSCompiler_StaticMethods_setBC$self$$inline_379$$.$f$ = $value$$inline_380$$ & 255;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 79:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 80:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$j$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 81:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$j$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 82:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 83:
                $location$$inline_277$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$++, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$h$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$j$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 86:
              ;
              case 118:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$K$ = 1;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 87:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$O$;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$P$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$] | ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$C$ ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 88:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$h$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 89:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$h$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 90:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 91:
                var $JSCompiler_StaticMethods_setDE$self$$inline_382$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$, $value$$inline_383$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1));
                $JSCompiler_StaticMethods_setDE$self$$inline_382$$.$j$ = $value$$inline_383$$ >> 8;
                $JSCompiler_StaticMethods_setDE$self$$inline_382$$.$h$ = $value$$inline_383$$ & 255;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 95:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ = Math.round(255 * Math.random());
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$P$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$] | ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$C$ ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$k$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$k$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 97:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$k$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 98:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 99:
                $location$$inline_277$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$++, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$k$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 103:
                $location$$inline_277$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $hlmem$$inline_278$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($location$$inline_277$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$, $hlmem$$inline_278$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ & 15) << 4);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ & 240 | $hlmem$$inline_278$$ & 15;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 104:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 105:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 106:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 107:
                $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1)));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 111:
                $location$$inline_277$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $hlmem$$inline_278$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($location$$inline_277$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$, ($hlmem$$inline_278$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ & 15);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ & 240 | $hlmem$$inline_278$$ >> 4;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, 0);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 115:
                $location$$inline_277$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$++, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$ & 255);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($location$$inline_277$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$ >> 8);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 120:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_274$$.$m$[$JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$];
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 121:
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$b$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 122:
                $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 123:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$n$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$l$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ + 1));
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$ += 3;
                break;
              case 160:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 161:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $temp$$inline_276$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? 0 : 4;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 248 | $temp$$inline_276$$;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 162:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 128 == ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 163:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $temp$$inline_276$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                255 < $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$ + $temp$$inline_276$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 128 == ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 168:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? 4 : 0);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 169:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $temp$$inline_276$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? 0 : 4;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 248 | $temp$$inline_276$$;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 170:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 0 != ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 171:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $temp$$inline_276$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                255 < $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$ + $temp$$inline_276$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 128 == ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                break;
              case 176:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -3;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -17;
                break;
              case 177:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $temp$$inline_276$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? 0 : 4;
                0 != ($temp$$inline_276$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 248 | $temp$$inline_276$$;
                break;
              case 178:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 128 == ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                break;
              case 179:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                255 < $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$ + $temp$$inline_276$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 0 != ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                break;
              case 184:
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -3;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -17;
                break;
              case 185:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 1 | 2;
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$)));
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                $temp$$inline_276$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_274$$) ? 0 : 4;
                0 != ($temp$$inline_276$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & 248 | $temp$$inline_276$$;
                break;
              case 186:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$), $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 0 != ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                break;
              case 187:
                $temp$$inline_276$$ = $JSCompiler_StaticMethods_doED$self$$inline_274$$.$a$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$));
                $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_274$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$f$, $temp$$inline_276$$);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_274$$, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$);
                $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_274$$);
                0 != $JSCompiler_StaticMethods_doED$self$$inline_274$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$o$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$--) : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++;
                255 < $JSCompiler_StaticMethods_doED$self$$inline_274$$.$i$ + $temp$$inline_276$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ &= -17);
                $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ = 0 != ($temp$$inline_276$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_274$$.$c$ & -3;
                break;
              default:
                console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_275$$)), $JSCompiler_StaticMethods_doED$self$$inline_274$$.$d$++
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
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$B$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$C$ = $JSCompiler_alias_FALSE$$;
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
            $JSCompiler_StaticMethods_run$self$$inline_165$$.$B$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$C$ = $JSCompiler_alias_TRUE$$;
            break;
          case 252:
            $JSCompiler_StaticMethods_run$self$$inline_165$$.call(0 != ($JSCompiler_StaticMethods_run$self$$inline_165$$.$c$ & 128));
            break;
          case 253:
            var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$, $opcode$$inline_281$$ = $JSCompiler_StaticMethods_run$self$$inline_165$$.$a$($JSCompiler_StaticMethods_run$self$$inline_165$$.$d$++), $location$$inline_282$$ = $JSCompiler_alias_VOID$$, $temp$$inline_283$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$o$ -= $OP_DD_STATES$$[$opcode$$inline_281$$];
            switch($opcode$$inline_281$$) {
              case 9:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                break;
              case 25:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                break;
              case 33:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$ += 2;
                break;
              case 34:
                $location$$inline_282$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($location$$inline_282$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($location$$inline_282$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$ += 2;
                break;
              case 35:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ + 1 & 255;
                0 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ + 1 & 255);
                break;
              case 36:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 37:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 38:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++);
                break;
              case 41:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                break;
              case 42:
                $location$$inline_282$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($location$$inline_282$$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$(++$location$$inline_282$$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$ += 2;
                break;
              case 43:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ - 1 & 255;
                255 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ - 1 & 255);
                break;
              case 44:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 45:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 46:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++);
                break;
              case 52:
                $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 53:
                $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 54:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 57:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$));
                break;
              case 68:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$;
                break;
              case 69:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$;
                break;
              case 70:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 76:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$;
                break;
              case 77:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$;
                break;
              case 78:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 84:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$;
                break;
              case 85:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$;
                break;
              case 86:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 92:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$;
                break;
              case 93:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$;
                break;
              case 94:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 96:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$g$;
                break;
              case 97:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$f$;
                break;
              case 98:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$j$;
                break;
              case 99:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$h$;
                break;
              case 100:
                break;
              case 101:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$;
                break;
              case 102:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 103:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$;
                break;
              case 104:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$g$;
                break;
              case 105:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$f$;
                break;
              case 106:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$j$;
                break;
              case 107:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$h$;
                break;
              case 108:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$;
                break;
              case 109:
                break;
              case 110:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 111:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$;
                break;
              case 112:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$g$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 113:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$f$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 114:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$j$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 115:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$h$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 116:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$k$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 117:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$i$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 119:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 124:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$;
                break;
              case 125:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$;
                break;
              case 126:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 132:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 133:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 134:
                $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 140:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 141:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 142:
                $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 148:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 149:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 150:
                $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 156:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 157:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 158:
                $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 164:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$] | 16;
                break;
              case 165:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$] | 16;
                break;
              case 166:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$))] | 16;
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 172:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$];
                break;
              case 173:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$];
                break;
              case 174:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$))];
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 180:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$];
                break;
              case 181:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$];
                break;
              case 182:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$c$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$m$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$b$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$))];
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 188:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$);
                break;
              case 189:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 190:
                $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$a$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$)));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$++;
                break;
              case 203:
                $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$));
                break;
              case 225:
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$ += 2;
                break;
              case 227:
                $temp$$inline_283$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$);
                $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$l$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$));
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$, $temp$$inline_283$$ & 255);
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$ + 1, $temp$$inline_283$$ >> 8);
                break;
              case 229:
                $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$s$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$q$);
                break;
              case 233:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$);
                break;
              case 249:
                $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$n$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$);
                break;
              default:
                console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_281$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_280$$.$d$--
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
        for(var $samplesToGenerate$$inline_173$$ = this.$samplesPerLine$[$line$$inline_172$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$ = this.$d$, $offset$$inline_286$$ = this.$audioBufferOffset$, $samplesToGenerate$$inline_287$$ = $samplesToGenerate$$inline_173$$, $buffer$$inline_288$$ = [], $sample$$inline_289$$ = 0, $i$$inline_290$$ = 0;$sample$$inline_289$$ < $samplesToGenerate$$inline_287$$;$sample$$inline_289$$++) {
          for($i$$inline_290$$ = 0;3 > $i$$inline_290$$;$i$$inline_290$$++) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$i$[$i$$inline_290$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$g$[$i$$inline_290$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$b$[($i$$inline_290$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$g$[$i$$inline_290$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$b$[($i$$inline_290$$ << 
            1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[$i$$inline_290$$]
          }
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$i$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$f$ & 1) << 1;
          var $output$$inline_291$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$i$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$i$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$i$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$i$[3];
          127 < $output$$inline_291$$ ? $output$$inline_291$$ = 127 : -128 > $output$$inline_291$$ && ($output$$inline_291$$ = -128);
          $buffer$$inline_288$$[$offset$$inline_286$$ + $sample$$inline_289$$] = $output$$inline_291$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$e$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$j$;
          var $clockCycles$$inline_292$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$e$ >> 8, $clockCyclesScaled$$inline_293$$ = $clockCycles$$inline_292$$ << 8;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$e$ -= $clockCyclesScaled$$inline_293$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[0] -= $clockCycles$$inline_292$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[1] -= $clockCycles$$inline_292$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[2] -= $clockCycles$$inline_292$$;
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$h$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[3] - $clockCycles$$inline_292$$;
          for($i$$inline_290$$ = 0;3 > $i$$inline_290$$;$i$$inline_290$$++) {
            var $counter$$inline_294$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[$i$$inline_290$$];
            if(0 >= $counter$$inline_294$$) {
              var $tone$$inline_295$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$b$[$i$$inline_290$$ << 1];
              6 < $tone$$inline_295$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$g$[$i$$inline_290$$] = ($clockCyclesScaled$$inline_293$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$e$ + 512 * $counter$$inline_294$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[$i$$inline_290$$] / ($clockCyclesScaled$$inline_293$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$e$), 
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[$i$$inline_290$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[$i$$inline_290$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[$i$$inline_290$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$g$[$i$$inline_290$$] = $NO_ANTIALIAS$$);
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[$i$$inline_290$$] += $tone$$inline_295$$ * ($clockCycles$$inline_292$$ / $tone$$inline_295$$ + 1)
            }else {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$g$[$i$$inline_290$$] = $NO_ANTIALIAS$$
            }
          }
          if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$h$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$h$ * 
          ($clockCycles$$inline_292$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$h$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$d$[3])) {
            var $feedback$$inline_296$$ = 0, $feedback$$inline_296$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$f$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$f$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$f$ & 1;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_285$$.$f$ >> 1 | $feedback$$inline_296$$ << 15
          }
        }
        this.$audioBuffer$ = $buffer$$inline_288$$;
        this.$audioBufferOffset$ += $samplesToGenerate$$inline_173$$
      }
      this.$c$.$l$ = $lineno$$inline_25$$;
      if(0 == this.$frameskip_counter$ && 192 > $lineno$$inline_25$$) {
        var $startTime$$inline_24$$ = $JSSMS$Utils$getTimestamp$$(), $JSCompiler_StaticMethods_drawLine$self$$inline_175$$ = this.$c$, $lineno$$inline_176$$ = $lineno$$inline_25$$, $i$$inline_177$$ = 0, $temp$$inline_178$$ = 0, $temp2$$inline_179$$ = 0;
        if(!$JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$h$.$is_gg$ || !(24 > $lineno$$inline_176$$ || 168 <= $lineno$$inline_176$$)) {
          if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$c$[1] & 64)) {
            if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$m$) {
              var $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$;
              console.log("[" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$l$ + "] min dirty:" + $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$o$ + " max: " + $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$m$);
              for(var $i$$inline_299$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$o$;$i$$inline_299$$ <= $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$m$;$i$$inline_299$$++) {
                if($JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$v$[$i$$inline_299$$]) {
                  $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$v$[$i$$inline_299$$] = $JSCompiler_alias_FALSE$$;
                  console.log("tile " + $i$$inline_299$$ + " is dirty");
                  for(var $tile$$inline_300$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$t$[$i$$inline_299$$], $pixel_index$$inline_301$$ = 0, $address$$inline_302$$ = $i$$inline_299$$ << 5, $y$$inline_303$$ = 0;8 > $y$$inline_303$$;$y$$inline_303$$++) {
                    for(var $address0$$inline_304$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$d$[$address$$inline_302$$++], $address1$$inline_305$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$d$[$address$$inline_302$$++], $address2$$inline_306$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$d$[$address$$inline_302$$++], $address3$$inline_307$$ = $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$d$[$address$$inline_302$$++], $bit$$inline_308$$ = 
                    128;0 != $bit$$inline_308$$;$bit$$inline_308$$ >>= 1) {
                      var $colour$$inline_309$$ = 0;
                      0 != ($address0$$inline_304$$ & $bit$$inline_308$$) && ($colour$$inline_309$$ |= 1);
                      0 != ($address1$$inline_305$$ & $bit$$inline_308$$) && ($colour$$inline_309$$ |= 2);
                      0 != ($address2$$inline_306$$ & $bit$$inline_308$$) && ($colour$$inline_309$$ |= 4);
                      0 != ($address3$$inline_307$$ & $bit$$inline_308$$) && ($colour$$inline_309$$ |= 8);
                      $tile$$inline_300$$[$pixel_index$$inline_301$$++] = $colour$$inline_309$$
                    }
                  }
                }
              }
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$o$ = 512;
              $JSCompiler_StaticMethods_decodeTiles$self$$inline_298$$.$m$ = -1
            }
            var $JSCompiler_StaticMethods_drawBg$self$$inline_311$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$, $lineno$$inline_312$$ = $lineno$$inline_176$$, $pixX$$inline_313$$ = 0, $colour$$inline_314$$ = 0, $temp$$inline_315$$ = 0, $temp2$$inline_316$$ = 0, $hscroll$$inline_317$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$c$[8], $vscroll$$inline_318$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$c$[9];
            16 > $lineno$$inline_312$$ && 0 != ($JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$c$[0] & 64) && ($hscroll$$inline_317$$ = 0);
            var $lock$$inline_319$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$c$[0] & 128, $tile_column$$inline_320$$ = 32 - ($hscroll$$inline_317$$ >> 3) + $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$s$, $tile_row$$inline_321$$ = $lineno$$inline_312$$ + $vscroll$$inline_318$$ >> 3;
            27 < $tile_row$$inline_321$$ && ($tile_row$$inline_321$$ -= 28);
            for(var $tile_y$$inline_322$$ = ($lineno$$inline_312$$ + ($vscroll$$inline_318$$ & 7) & 7) << 3, $row_precal$$inline_323$$ = $lineno$$inline_312$$ << 8, $tx$$inline_324$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$s$;$tx$$inline_324$$ < $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$u$;$tx$$inline_324$$++) {
              var $tile_props$$inline_325$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$D$ + (($tile_column$$inline_320$$ & 31) << 1) + ($tile_row$$inline_321$$ << 6), $secondbyte$$inline_326$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$d$[$tile_props$$inline_325$$ + 1], $pal$$inline_327$$ = ($secondbyte$$inline_326$$ & 8) << 1, $sx$$inline_328$$ = ($tx$$inline_324$$ << 3) + ($hscroll$$inline_317$$ & 7), $pixY$$inline_329$$ = 0 == ($secondbyte$$inline_326$$ & 4) ? $tile_y$$inline_322$$ : 
              56 - $tile_y$$inline_322$$, $tile$$inline_330$$ = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$t$[($JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$d$[$tile_props$$inline_325$$] & 255) + (($secondbyte$$inline_326$$ & 1) << 8)];
              if(0 == ($secondbyte$$inline_326$$ & 2)) {
                for($pixX$$inline_313$$ = 0;8 > $pixX$$inline_313$$ && 256 > $sx$$inline_328$$;$pixX$$inline_313$$++, $sx$$inline_328$$++) {
                  $colour$$inline_314$$ = $tile$$inline_330$$[$pixX$$inline_313$$ + $pixY$$inline_329$$], $temp$$inline_315$$ = 4 * ($sx$$inline_328$$ + $row_precal$$inline_323$$), $temp2$$inline_316$$ = 3 * ($colour$$inline_314$$ + $pal$$inline_327$$), $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$p$[$sx$$inline_328$$] = 0 != ($secondbyte$$inline_326$$ & 16) && 0 != $colour$$inline_314$$, $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$b$[$temp$$inline_315$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$a$[$temp2$$inline_316$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$b$[$temp$$inline_315$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$a$[$temp2$$inline_316$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$b$[$temp$$inline_315$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$a$[$temp2$$inline_316$$ + 2]
                }
              }else {
                for($pixX$$inline_313$$ = 7;0 <= $pixX$$inline_313$$ && 256 > $sx$$inline_328$$;$pixX$$inline_313$$--, $sx$$inline_328$$++) {
                  $colour$$inline_314$$ = $tile$$inline_330$$[$pixX$$inline_313$$ + $pixY$$inline_329$$], $temp$$inline_315$$ = 4 * ($sx$$inline_328$$ + $row_precal$$inline_323$$), $temp2$$inline_316$$ = 3 * ($colour$$inline_314$$ + $pal$$inline_327$$), $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$p$[$sx$$inline_328$$] = 0 != ($secondbyte$$inline_326$$ & 16) && 0 != $colour$$inline_314$$, $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$b$[$temp$$inline_315$$] = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$a$[$temp2$$inline_316$$], 
                  $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$b$[$temp$$inline_315$$ + 1] = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$a$[$temp2$$inline_316$$ + 1], $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$b$[$temp$$inline_315$$ + 2] = $JSCompiler_StaticMethods_drawBg$self$$inline_311$$.$a$[$temp2$$inline_316$$ + 2]
                }
              }
              $tile_column$$inline_320$$++;
              0 != $lock$$inline_319$$ && 23 == $tx$$inline_324$$ && ($tile_row$$inline_321$$ = $lineno$$inline_312$$ >> 3, $tile_y$$inline_322$$ = ($lineno$$inline_312$$ & 7) << 3)
            }
            if($JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$k$) {
              var $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$;
              $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$k$ = $JSCompiler_alias_FALSE$$;
              for(var $i$$inline_333$$ = 0;$i$$inline_333$$ < $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$n$.length;$i$$inline_333$$++) {
                $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$n$[$i$$inline_333$$][0] = 0
              }
              var $height$$inline_334$$ = 0 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$c$[1] & 2) ? 8 : 16;
              1 == ($JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$c$[1] & 1) && ($height$$inline_334$$ <<= 1);
              for(var $spriteno$$inline_335$$ = 0;64 > $spriteno$$inline_335$$;$spriteno$$inline_335$$++) {
                var $y$$inline_336$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$d$[$JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$g$ + $spriteno$$inline_335$$] & 255;
                if(208 == $y$$inline_336$$) {
                  break
                }
                $y$$inline_336$$++;
                240 < $y$$inline_336$$ && ($y$$inline_336$$ -= 256);
                for(var $lineno$$inline_337$$ = $y$$inline_336$$;192 > $lineno$$inline_337$$;$lineno$$inline_337$$++) {
                  if($lineno$$inline_337$$ - $y$$inline_336$$ < $height$$inline_334$$) {
                    var $sprites$$inline_338$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$n$[$lineno$$inline_337$$];
                    if(8 <= $sprites$$inline_338$$[0]) {
                      break
                    }
                    var $off$$inline_339$$ = 3 * $sprites$$inline_338$$[0] + 1, $address$$inline_340$$ = $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$g$ + ($spriteno$$inline_335$$ << 1) + 128;
                    $sprites$$inline_338$$[$off$$inline_339$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$d$[$address$$inline_340$$++] & 255;
                    $sprites$$inline_338$$[$off$$inline_339$$++] = $y$$inline_336$$;
                    $sprites$$inline_338$$[$off$$inline_339$$++] = $JSCompiler_StaticMethods_decodeSat$self$$inline_332$$.$d$[$address$$inline_340$$] & 255;
                    $sprites$$inline_338$$[0]++
                  }
                }
              }
            }
            if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_175$$.$n$[$lineno$$inline_176$$][0]) {
              for(var $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$, $lineno$$inline_343$$ = $lineno$$inline_176$$, $colour$$inline_344$$ = 0, $temp$$inline_345$$ = 0, $temp2$$inline_346$$ = 0, $i$$inline_347$$ = 0, $sprites$$inline_348$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$n$[$lineno$$inline_343$$], $count$$inline_349$$ = Math.min(8, $sprites$$inline_348$$[0]), $zoomed$$inline_350$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$c$[1] & 
              1, $row_precal$$inline_351$$ = $lineno$$inline_343$$ << 8, $off$$inline_352$$ = 3 * $count$$inline_349$$;$i$$inline_347$$ < $count$$inline_349$$;$i$$inline_347$$++) {
                var $n$$inline_353$$ = $sprites$$inline_348$$[$off$$inline_352$$--] | ($JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$c$[6] & 4) << 6, $y$$inline_354$$ = $sprites$$inline_348$$[$off$$inline_352$$--], $x$$inline_355$$ = $sprites$$inline_348$$[$off$$inline_352$$--] - ($JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$c$[0] & 8), $tileRow$$inline_356$$ = $lineno$$inline_343$$ - $y$$inline_354$$ >> $zoomed$$inline_350$$;
                0 != ($JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$c$[1] & 2) && ($n$$inline_353$$ &= -2);
                var $tile$$inline_357$$ = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$t$[$n$$inline_353$$ + (($tileRow$$inline_356$$ & 8) >> 3)], $pix$$inline_358$$ = 0;
                0 > $x$$inline_355$$ && ($pix$$inline_358$$ = -$x$$inline_355$$, $x$$inline_355$$ = 0);
                var $offset$$inline_359$$ = $pix$$inline_358$$ + (($tileRow$$inline_356$$ & 7) << 3);
                if(0 == $zoomed$$inline_350$$) {
                  for(;8 > $pix$$inline_358$$ && 256 > $x$$inline_355$$;$pix$$inline_358$$++, $x$$inline_355$$++) {
                    $colour$$inline_344$$ = $tile$$inline_357$$[$offset$$inline_359$$++], 0 != $colour$$inline_344$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$p$[$x$$inline_355$$] && ($temp$$inline_345$$ = 4 * ($x$$inline_355$$ + $row_precal$$inline_351$$), $temp2$$inline_346$$ = 3 * ($colour$$inline_344$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$ + 
                    1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$ + 2])
                  }
                }else {
                  for(;8 > $pix$$inline_358$$ && 256 > $x$$inline_355$$;$pix$$inline_358$$++, $x$$inline_355$$ += 2) {
                    $colour$$inline_344$$ = $tile$$inline_357$$[$offset$$inline_359$$++], 0 != $colour$$inline_344$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$p$[$x$$inline_355$$] && ($temp$$inline_345$$ = 4 * ($x$$inline_355$$ + $row_precal$$inline_351$$), $temp2$$inline_346$$ = 3 * ($colour$$inline_344$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$ + 
                    1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$ + 2]), 0 != $colour$$inline_344$$ && !$JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$p$[$x$$inline_355$$ + 1] && ($temp$$inline_345$$ = 4 * ($x$$inline_355$$ + $row_precal$$inline_351$$ + 1), $temp2$$inline_346$$ = 
                    3 * ($colour$$inline_344$$ + 16), $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$], $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$ + 1] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$ + 1], $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$b$[$temp$$inline_345$$ + 2] = $JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$a$[$temp2$$inline_346$$ + 
                    2])
                  }
                }
              }
              8 <= $sprites$$inline_348$$[0] && ($JSCompiler_StaticMethods_drawSprite$self$$inline_342$$.$e$ |= 64)
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
            for(var $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_175$$, $row_precal$$inline_363$$ = $lineno$$inline_176$$ << 8, $length$$inline_364$$ = 4 * ($row_precal$$inline_363$$ + 1024), $temp$$inline_365$$ = 3 * (($JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$c$[7] & 15) + 16), $row_precal$$inline_363$$ = 4 * $row_precal$$inline_363$$;$row_precal$$inline_363$$ < $length$$inline_364$$;$row_precal$$inline_363$$ += 4) {
              $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$b$[$row_precal$$inline_363$$] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$a$[$temp$$inline_365$$], $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$b$[$row_precal$$inline_363$$ + 1] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$a$[$temp$$inline_365$$ + 1], $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$b$[$row_precal$$inline_363$$ + 2] = $JSCompiler_StaticMethods_drawBGColour$self$$inline_361$$.$a$[$temp$$inline_365$$ + 
              2]
            }
          }
        }
        this.$drawTimeCounter$ += $JSSMS$Utils$getTimestamp$$() - $startTime$$inline_24$$
      }
      var $JSCompiler_StaticMethods_interrupts$self$$inline_181$$ = this.$c$, $lineno$$inline_182$$ = $lineno$$inline_25$$;
      192 >= $lineno$$inline_182$$ ? (192 == $lineno$$inline_182$$ && ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ |= 128), 0 == $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ & 
      4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[0] & 16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$h$.$a$.$F$ = $JSCompiler_alias_TRUE$$)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$e$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$c$[1] & 32) && 224 > $lineno$$inline_182$$) && 
      ($JSCompiler_StaticMethods_interrupts$self$$inline_181$$.$h$.$a$.$F$ = $JSCompiler_alias_TRUE$$))
    }
    60 == ++this.$frameCount$ && (this.$frameCount$ = this.$drawTimeCounter$ = this.$z80TimeCounter$ = 0);
    if(this.$pause_button$) {
      var $JSCompiler_StaticMethods_nmi$self$$inline_184$$ = this.$a$;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$C$ = $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$B$;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$B$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$J$ && ($JSCompiler_StaticMethods_nmi$self$$inline_184$$.$d$++, $JSCompiler_StaticMethods_nmi$self$$inline_184$$.$J$ = $JSCompiler_alias_FALSE$$);
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
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1, $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ = $data$$21$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ ? (this.$is_sms$ = $JSCompiler_alias_TRUE$$, this.$is_gg$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 0, this.$c$.$u$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ && (this.$is_gg$ = $JSCompiler_alias_TRUE$$, this.$is_sms$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 5, this.$c$.$u$ = 27);
  if(1024 >= $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = $data$$21$$;
  0 != $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ % 1024 && ($JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.substr(512), $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ -= 512);
  var $i$$inline_33$$, $j$$inline_34$$, $number_of_pages$$inline_35$$ = Math.round($i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ / 1024), $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ = Array($number_of_pages$$inline_35$$);
  for($i$$inline_33$$ = 0;$i$$inline_33$$ < $number_of_pages$$inline_35$$;$i$$inline_33$$++) {
    if($i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$[$i$$inline_33$$] = $JSSMS$Utils$Array$$(1024), $SUPPORT_DATAVIEW$$) {
      for($j$$inline_34$$ = 0;1024 > $j$$inline_34$$;$j$$inline_34$$++) {
        $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$[$i$$inline_33$$].setUint8($j$$inline_34$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.charCodeAt(1024 * $i$$inline_33$$ + $j$$inline_34$$))
      }
    }else {
      for($j$$inline_34$$ = 0;1024 > $j$$inline_34$$;$j$$inline_34$$++) {
        $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$[$i$$inline_33$$][$j$$inline_34$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.charCodeAt(1024 * $i$$inline_33$$ + $j$$inline_34$$) & 255
      }
    }
  }
  if($i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ == $JSCompiler_alias_NULL$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$ = this.$a$;
  $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$A$ = $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$);
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$D$[0] = 0;
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$D$[1] = 0;
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$D$[2] = 1;
  $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$D$[3] = 0;
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$A$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$G$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$A$.length / 16;
    for($i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ = 0;48 > $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$;$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$z$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$A$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ & 31], $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$memWriteMap$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$] = $JSSMS$Utils$Array$$(1024)
    }
    for($i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ = 48;64 > $i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$;$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$z$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$Y$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ & 7], $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$memWriteMap$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$Y$[$i$$inline_187_pages$$inline_36_size$$10_size$$inline_32$$ & 
      7]
    }
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_38_data$$inline_31_mode$$9$$.$G$ = 0
  }
  return $JSCompiler_alias_TRUE$$
}};
var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  $length$$12$$ || ($length$$12$$ = 0);
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array, $JSSMS$Utils$writeMem$$ = $SUPPORT_DATAVIEW$$ ? function($self$$2$$, $address$$, $value$$38$$) {
  if($address$$ >> 10 >= $self$$2$$.$memWriteMap$.length || !$self$$2$$.$memWriteMap$[$address$$ >> 10] || ($address$$ & 1023) >= $self$$2$$.$memWriteMap$[$address$$ >> 10].byteLength) {
    console.error($address$$, $address$$ >> 10, $address$$ & 1023);
    debugger
  }
  $self$$2$$.$memWriteMap$[$address$$ >> 10].setInt8($address$$ & 1023, $value$$38$$);
  65532 <= $address$$ && $self$$2$$.page($address$$ & 3, $value$$38$$)
} : function($self$$3$$, $address$$1$$, $value$$39$$) {
  $self$$3$$.$memWriteMap$[$address$$1$$ >> 10][$address$$1$$ & 1023] = $value$$39$$;
  65532 <= $address$$1$$ && $self$$3$$.page($address$$1$$ & 3, $value$$39$$)
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
}, $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? function() {
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
function $JSSMS$Z80$$($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$) {
  this.$aa$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;
  this.$t$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$.$f$;
  this.$K$ = this.$n$ = this.$d$ = 0;
  this.$F$ = this.$J$ = this.$C$ = this.$B$ = $JSCompiler_alias_FALSE$$;
  this.$o$ = this.$V$ = this.$c$ = this.$O$ = this.$s$ = this.$q$ = this.$r$ = this.$p$ = this.$X$ = this.$W$ = this.$i$ = this.$k$ = this.$U$ = this.$T$ = this.$h$ = this.$j$ = this.$S$ = this.$R$ = this.$f$ = this.$g$ = this.$Q$ = this.$b$ = this.$L$ = 0;
  this.$A$ = [];
  this.$Y$ = Array(8);
  this.$M$ = Array(32);
  this.$D$ = Array(4);
  this.$G$ = 0;
  this.$memWriteMap$ = Array(65);
  this.$z$ = Array(65);
  this.$Z$ = Array(2048);
  this.$P$ = Array(256);
  this.$m$ = Array(256);
  this.$I$ = Array(256);
  this.$H$ = Array(256);
  this.$v$ = Array(131072);
  this.$u$ = Array(131072);
  this.$N$ = Array(256);
  var $c$$inline_58_padc$$inline_49_sf$$inline_43$$, $h$$inline_59_psub$$inline_50_zf$$inline_44$$, $n$$inline_60_psbc$$inline_51_yf$$inline_45$$, $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$, $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$, $flags$$inline_191_newval$$inline_54$$;
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;256 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
    $c$$inline_58_padc$$inline_49_sf$$inline_43$$ = 0 != ($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 128) ? 128 : 0, $h$$inline_59_psub$$inline_50_zf$$inline_44$$ = 0 == $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 64 : 0, $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 32, $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 
    8, $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$) ? 4 : 0, this.$P$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$, this.$m$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 
    $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ | $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$, this.$I$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$, 
    this.$I$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 128 == $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 4 : 0, this.$I$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 0 == ($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 15) ? 16 : 0, this.$H$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | 
    $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ | 2, this.$H$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 127 == $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 4 : 0, this.$H$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 15 == ($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 15) ? 16 : 0, this.$N$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 0 != $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ ? 
    $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ & 128 : 68, this.$N$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ | $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ | 16
  }
  $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;
  $c$$inline_58_padc$$inline_49_sf$$inline_43$$ = 65536;
  $h$$inline_59_psub$$inline_50_zf$$inline_44$$ = 0;
  $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ = 65536;
  for($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ = 0;256 > $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$;$JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$++) {
    for($flags$$inline_191_newval$$inline_54$$ = 0;256 > $flags$$inline_191_newval$$inline_54$$;$flags$$inline_191_newval$$inline_54$$++) {
      $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ = $flags$$inline_191_newval$$inline_54$$ - $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$, this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = 0 != $flags$$inline_191_newval$$inline_54$$ ? 0 != ($flags$$inline_191_newval$$inline_54$$ & 128) ? 128 : 0 : 64, this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= $flags$$inline_191_newval$$inline_54$$ & 40, ($flags$$inline_191_newval$$inline_54$$ & 
      15) < ($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 16), $flags$$inline_191_newval$$inline_54$$ < $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ && (this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ ^ $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ ^ 128) & ($JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ ^ 
      $flags$$inline_191_newval$$inline_54$$) & 128) && (this.$v$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] |= 4), $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++, $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ = $flags$$inline_191_newval$$inline_54$$ - $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ - 1, this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] = 0 != $flags$$inline_191_newval$$inline_54$$ ? 0 != ($flags$$inline_191_newval$$inline_54$$ & 
      128) ? 128 : 0 : 64, this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= $flags$$inline_191_newval$$inline_54$$ & 40, ($flags$$inline_191_newval$$inline_54$$ & 15) <= ($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= 16), $flags$$inline_191_newval$$inline_54$$ <= $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ && (this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ ^ 
      $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ ^ 128) & ($JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ ^ $flags$$inline_191_newval$$inline_54$$) & 128) && (this.$v$[$c$$inline_58_padc$$inline_49_sf$$inline_43$$] |= 4), $c$$inline_58_padc$$inline_49_sf$$inline_43$$++, $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ = $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ - $flags$$inline_191_newval$$inline_54$$, this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] = 
      0 != $flags$$inline_191_newval$$inline_54$$ ? 0 != ($flags$$inline_191_newval$$inline_54$$ & 128) ? 130 : 2 : 66, this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= $flags$$inline_191_newval$$inline_54$$ & 40, ($flags$$inline_191_newval$$inline_54$$ & 15) > ($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= 16), $flags$$inline_191_newval$$inline_54$$ > $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ && 
      (this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ ^ $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$) & ($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ ^ $flags$$inline_191_newval$$inline_54$$) & 128) && (this.$u$[$h$$inline_59_psub$$inline_50_zf$$inline_44$$] |= 4), $h$$inline_59_psub$$inline_50_zf$$inline_44$$++, $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ = $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ - 
      $flags$$inline_191_newval$$inline_54$$ - 1, this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] = 0 != $flags$$inline_191_newval$$inline_54$$ ? 0 != ($flags$$inline_191_newval$$inline_54$$ & 128) ? 130 : 2 : 66, this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= $flags$$inline_191_newval$$inline_54$$ & 40, ($flags$$inline_191_newval$$inline_54$$ & 15) >= ($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ & 15) && (this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= 
      16), $flags$$inline_191_newval$$inline_54$$ >= $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ && (this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= 1), 0 != (($JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ ^ $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$) & ($JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ ^ $flags$$inline_191_newval$$inline_54$$) & 128) && (this.$u$[$n$$inline_60_psbc$$inline_51_yf$$inline_45$$] |= 4), $n$$inline_60_psbc$$inline_51_yf$$inline_45$$++
    }
  }
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 256;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$--;) {
    for($c$$inline_58_padc$$inline_49_sf$$inline_43$$ = 0;1 >= $c$$inline_58_padc$$inline_49_sf$$inline_43$$;$c$$inline_58_padc$$inline_49_sf$$inline_43$$++) {
      for($h$$inline_59_psub$$inline_50_zf$$inline_44$$ = 0;1 >= $h$$inline_59_psub$$inline_50_zf$$inline_44$$;$h$$inline_59_psub$$inline_50_zf$$inline_44$$++) {
        for($n$$inline_60_psbc$$inline_51_yf$$inline_45$$ = 0;1 >= $n$$inline_60_psbc$$inline_51_yf$$inline_45$$;$n$$inline_60_psbc$$inline_51_yf$$inline_45$$++) {
          $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$ = this.$Z$;
          $JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$ = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ << 8 | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ << 9 | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ << 10 | $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;
          $flags$$inline_191_newval$$inline_54$$ = $c$$inline_58_padc$$inline_49_sf$$inline_43$$ | $n$$inline_60_psbc$$inline_51_yf$$inline_45$$ << 1 | $h$$inline_59_psub$$inline_50_zf$$inline_44$$ << 4;
          this.$b$ = $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;
          this.$c$ = $flags$$inline_191_newval$$inline_54$$;
          var $a_copy$$inline_192$$ = this.$b$, $correction$$inline_193$$ = 0, $carry$$inline_194$$ = $flags$$inline_191_newval$$inline_54$$ & 1, $carry_copy$$inline_195$$ = $carry$$inline_194$$;
          if(0 != ($flags$$inline_191_newval$$inline_54$$ & 16) || 9 < ($a_copy$$inline_192$$ & 15)) {
            $correction$$inline_193$$ |= 6
          }
          if(1 == $carry$$inline_194$$ || 159 < $a_copy$$inline_192$$ || 143 < $a_copy$$inline_192$$ && 9 < ($a_copy$$inline_192$$ & 15)) {
            $correction$$inline_193$$ |= 96, $carry_copy$$inline_195$$ = 1
          }
          153 < $a_copy$$inline_192$$ && ($carry_copy$$inline_195$$ = 1);
          0 != ($flags$$inline_191_newval$$inline_54$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_193$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_193$$);
          $flags$$inline_191_newval$$inline_54$$ = this.$c$ & 254 | $carry_copy$$inline_195$$;
          $flags$$inline_191_newval$$inline_54$$ = $JSCompiler_StaticMethods_getParity$$(this.$b$) ? $flags$$inline_191_newval$$inline_54$$ & 251 | 4 : $flags$$inline_191_newval$$inline_54$$ & 251;
          $JSCompiler_temp_const$$152_val$$inline_52_xf$$inline_46$$[$JSCompiler_temp_const$$151_oldval$$inline_53_pf$$inline_47$$] = this.$b$ | $flags$$inline_191_newval$$inline_54$$ << 8
        }
      }
    }
  }
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = this.$b$ = this.$c$ = 0;65 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
    this.$z$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $JSSMS$Utils$Array$$(1024), this.$memWriteMap$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $JSSMS$Utils$Array$$(1024)
  }
  for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;8 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
    this.$Y$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $JSSMS$Utils$Array$$(1024)
  }
  if(this.$M$ == $JSCompiler_alias_NULL$$) {
    this.$M$ = Array(32);
    for($i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$ = 0;32 > $i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$;$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$++) {
      this.$M$[$i$$inline_42_i$$inline_57_i$$inline_63_padd$$inline_48_sms$$] = $JSSMS$Utils$Array$$(1024)
    }
  }
  this.$z$[64] = $JSSMS$Utils$Array$$(1024);
  this.$memWriteMap$[64] = $JSSMS$Utils$Array$$(1024);
  this.$G$ = 2;
  this.$e$ = $JSSMS$Utils$writeMem$$.bind(this, this);
  this.$a$ = $JSSMS$Utils$readMem$$.bind(this, this.$z$);
  this.$l$ = $JSSMS$Utils$readMemWord$$.bind(this, this.$z$);
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$d$ = this.$V$ = this.$c$ = this.$O$ = this.$q$ = this.$s$ = this.$p$ = this.$r$ = this.$k$ = this.$i$ = this.$W$ = this.$X$ = this.$j$ = this.$h$ = this.$T$ = this.$U$ = this.$g$ = this.$f$ = this.$R$ = this.$S$ = this.$b$ = this.$Q$ = 0;
  this.$n$ = 57328;
  this.$K$ = this.$o$ = 0;
  this.$C$ = this.$B$ = $JSCompiler_alias_FALSE$$;
  this.$L$ = 0;
  this.$J$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$d$ + 2), this.$d$ = this.$l$(this.$d$), this.$o$ -= 7) : this.$d$ += 2
}, page:function $$JSSMS$Z80$$$$page$($address$$6$$, $value$$66$$) {
  var $offset$$16_p$$1$$, $i$$7$$;
  this.$D$[$address$$6$$] = $value$$66$$;
  switch($address$$6$$) {
    case 0:
      if(0 != ($value$$66$$ & 8)) {
        $offset$$16_p$$1$$ = ($value$$66$$ & 4) << 2;
        for($i$$7$$ = 32;48 > $i$$7$$;$i$$7$$++) {
          this.$z$[$i$$7$$] = this.$M$[$offset$$16_p$$1$$], this.$memWriteMap$[$i$$7$$] = this.$M$[$offset$$16_p$$1$$], $offset$$16_p$$1$$++
        }
      }else {
        $offset$$16_p$$1$$ = this.$D$[3] % this.$G$ << 4;
        for($i$$7$$ = 32;48 > $i$$7$$;$i$$7$$++) {
          this.$z$[$i$$7$$] = this.$A$[$offset$$16_p$$1$$++], this.$memWriteMap$[$i$$7$$] = $JSSMS$Utils$Array$$(1024)
        }
      }
      break;
    case 1:
      $offset$$16_p$$1$$ = ($value$$66$$ % this.$G$ << 4) + 1;
      for($i$$7$$ = 1;16 > $i$$7$$;$i$$7$$++) {
        this.$z$[$i$$7$$] = this.$A$[$offset$$16_p$$1$$++]
      }
      break;
    case 2:
      $offset$$16_p$$1$$ = $value$$66$$ % this.$G$ << 4;
      for($i$$7$$ = 16;32 > $i$$7$$;$i$$7$$++) {
        this.$z$[$i$$7$$] = this.$A$[$offset$$16_p$$1$$++]
      }
      break;
    case 3:
      if(0 == (this.$D$[0] & 8)) {
        $offset$$16_p$$1$$ = $value$$66$$ % this.$G$ << 4;
        for($i$$7$$ = 32;48 > $i$$7$$;$i$$7$$++) {
          this.$z$[$i$$7$$] = this.$A$[$offset$$16_p$$1$$++]
        }
      }
  }
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
  $JSCompiler_StaticMethods_dec8$self$$.$c$ = $JSCompiler_StaticMethods_dec8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$H$[$value$$61$$];
  return $value$$61$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$60$$) {
  $value$$60$$ = $value$$60$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$c$ = $JSCompiler_StaticMethods_inc8$self$$.$c$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$I$[$value$$60$$];
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
  $JSCompiler_StaticMethods_bit$self$$.$c$ = $JSCompiler_StaticMethods_bit$self$$.$c$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$N$[$mask$$5$$]
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
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$, $index$$45$$, $address$$10_address$$inline_77$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_78$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$10_address$$inline_77$$, $code$$6_sign$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $inst$$inline_80_offset$$17_operand$$1$$ = "";
  $address$$10_address$$inline_77$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_78$$ = "ADD " + $index$$45$$ + ",BC";
      $code$$6_sign$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_78$$ = "ADD " + $index$$45$$ + ",DE";
      $code$$6_sign$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getDE()));";
      break;
    case 33:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$l$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "," + $inst$$inline_80_offset$$17_operand$$1$$;
      $code$$6_sign$$ = "this.set" + $index$$45$$ + "(" + $inst$$inline_80_offset$$17_operand$$1$$ + ");";
      $address$$10_address$$inline_77$$ += 2;
      break;
    case 34:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$l$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $inst$$inline_80_offset$$17_operand$$1$$ + ")," + $index$$45$$;
      $code$$6_sign$$ = "location = " + $inst$$inline_80_offset$$17_operand$$1$$ + ";this.writeMem(location++, this." + $index$$45$$.toLowerCase() + "L);this.writeMem(location, this." + $index$$45$$.toLowerCase() + "H);";
      $address$$10_address$$inline_77$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_78$$ = "INC " + $index$$45$$;
      $code$$6_sign$$ = "this.inc" + $index$$45$$ + "();";
      break;
    case 36:
      $inst$$3_opcode$$inline_78$$ = "INC " + $index$$45$$ + "H *";
      break;
    case 37:
      $inst$$3_opcode$$inline_78$$ = "DEC " + $index$$45$$ + "H *";
      break;
    case 38:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$)) + " *";
      $address$$10_address$$inline_77$$++;
      break;
    case 41:
      $inst$$3_opcode$$inline_78$$ = "ADD " + $index$$45$$ + "  " + $index$$45$$;
      break;
    case 42:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + " (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$l$($address$$10_address$$inline_77$$)) + ")";
      $address$$10_address$$inline_77$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_78$$ = "DEC " + $index$$45$$;
      $code$$6_sign$$ = "this.dec" + $index$$45$$ + "();";
      break;
    case 44:
      $inst$$3_opcode$$inline_78$$ = "INC " + $index$$45$$ + "L *";
      break;
    case 45:
      $inst$$3_opcode$$inline_78$$ = "DEC " + $index$$45$$ + "L *";
      break;
    case 46:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $address$$10_address$$inline_77$$++;
      break;
    case 52:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "INC (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 53:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "DEC (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 54:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $address$$10_address$$inline_77$$++;
      break;
    case 57:
      $inst$$3_opcode$$inline_78$$ = "ADD " + $index$$45$$ + " SP";
      break;
    case 68:
      $inst$$3_opcode$$inline_78$$ = "LD B," + $index$$45$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_78$$ = "LD B," + $index$$45$$ + "L *";
      break;
    case 70:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD B,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_78$$ = "LD C," + $index$$45$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_78$$ = "LD C," + $index$$45$$ + "L *";
      break;
    case 78:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD C,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_78$$ = "LD D," + $index$$45$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_78$$ = "LD D," + $index$$45$$ + "L *";
      break;
    case 86:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD D,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_78$$ = "LD E," + $index$$45$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_78$$ = "LD E," + $index$$45$$ + "L *";
      break;
    case 94:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD E,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 96:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H,B *";
      break;
    case 97:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H,C *";
      break;
    case 98:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H,D *";
      break;
    case 99:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H,E *";
      break;
    case 100:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "H*";
      break;
    case 101:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "L *";
      break;
    case 102:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD H,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 103:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "H,A *";
      break;
    case 104:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L,B *";
      break;
    case 105:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L,C *";
      break;
    case 106:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L,D *";
      break;
    case 107:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L,E *";
      break;
    case 108:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "H *";
      break;
    case 109:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "L *";
      break;
    case 110:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD L,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ")";
      $address$$10_address$$inline_77$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_78$$ = "LD " + $index$$45$$ + "L,A *";
      break;
    case 112:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),B";
      $address$$10_address$$inline_77$$++;
      break;
    case 113:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),C";
      $address$$10_address$$inline_77$$++;
      break;
    case 114:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),D";
      $address$$10_address$$inline_77$$++;
      break;
    case 115:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),E";
      $address$$10_address$$inline_77$$++;
      break;
    case 116:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),H";
      $address$$10_address$$inline_77$$++;
      break;
    case 117:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),L";
      $address$$10_address$$inline_77$$++;
      break;
    case 119:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "LD (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "),A";
      $address$$10_address$$inline_77$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_78$$ = "LD A," + $index$$45$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_78$$ = "LD A," + $index$$45$$ + "L *";
      break;
    case 126:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $code$$6_sign$$ = 0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-";
      $inst$$3_opcode$$inline_78$$ = "LD A,(" + $index$$45$$ + $code$$6_sign$$ + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $code$$6_sign$$ = "this.a = this.readMem(this.getIX() " + $code$$6_sign$$ + " " + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + ");";
      $address$$10_address$$inline_77$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_78$$ = "ADD A," + $index$$45$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_78$$ = "ADD A," + $index$$45$$ + "L *";
      break;
    case 134:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "ADD A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_78$$ = "ADC A," + $index$$45$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_78$$ = "ADC A," + $index$$45$$ + "L *";
      break;
    case 142:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "ADC A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_78$$ = "SUB " + $index$$45$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_78$$ = "SUB " + $index$$45$$ + "L *";
      break;
    case 150:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "SUB A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_78$$ = "SBC A," + $index$$45$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_78$$ = "SBC A," + $index$$45$$ + "L *";
      break;
    case 158:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "SBC A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_78$$ = "AND " + $index$$45$$ + "H *";
      break;
    case 165:
      $inst$$3_opcode$$inline_78$$ = "AND " + $index$$45$$ + "L *";
      break;
    case 166:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "AND A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_78$$ = "XOR A " + $index$$45$$ + "H*";
      break;
    case 173:
      $inst$$3_opcode$$inline_78$$ = "XOR A " + $index$$45$$ + "L*";
      break;
    case 174:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "XOR A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_78$$ = "OR A " + $index$$45$$ + "H*";
      break;
    case 181:
      $inst$$3_opcode$$inline_78$$ = "OR A " + $index$$45$$ + "L*";
      break;
    case 182:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "OR A,(" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_78$$ = "CP " + $index$$45$$ + "H *";
      break;
    case 189:
      $inst$$3_opcode$$inline_78$$ = "CP " + $index$$45$$ + "L *";
      break;
    case 190:
      $inst$$inline_80_offset$$17_operand$$1$$ = $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$));
      $inst$$3_opcode$$inline_78$$ = "CP (" + $index$$45$$ + (0 < $inst$$inline_80_offset$$17_operand$$1$$ ? "+" : "-") + $JSSMS$Utils$toHex$$($inst$$inline_80_offset$$17_operand$$1$$) + "))";
      $address$$10_address$$inline_77$$++;
      break;
    case 203:
      $inst$$3_opcode$$inline_78$$ = $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$.$a$($address$$10_address$$inline_77$$);
      $JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$ = [$inst$$3_opcode$$inline_78$$];
      $inst$$inline_80_offset$$17_operand$$1$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $address$$10_address$$inline_77$$++;
      switch($inst$$3_opcode$$inline_78$$) {
        case 0:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,RLC (" + $index$$45$$ + ")";
          break;
        case 1:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,RLC (" + $index$$45$$ + ")";
          break;
        case 2:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,RLC (" + $index$$45$$ + ")";
          break;
        case 3:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,RLC (" + $index$$45$$ + ")";
          break;
        case 4:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,RLC (" + $index$$45$$ + ")";
          break;
        case 5:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,RLC (" + $index$$45$$ + ")";
          break;
        case 6:
          $inst$$inline_80_offset$$17_operand$$1$$ = "RLC (" + $index$$45$$ + ")";
          break;
        case 7:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,RLC (" + $index$$45$$ + ")";
          break;
        case 8:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,RRC (" + $index$$45$$ + ")";
          break;
        case 9:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,RRC (" + $index$$45$$ + ")";
          break;
        case 10:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,RRC (" + $index$$45$$ + ")";
          break;
        case 11:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,RRC (" + $index$$45$$ + ")";
          break;
        case 12:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,RRC (" + $index$$45$$ + ")";
          break;
        case 13:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,RRC (" + $index$$45$$ + ")";
          break;
        case 14:
          $inst$$inline_80_offset$$17_operand$$1$$ = "RRC (" + $index$$45$$ + ")";
          break;
        case 15:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,RRC (" + $index$$45$$ + ")";
          break;
        case 16:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,RL (" + $index$$45$$ + ")";
          break;
        case 17:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,RL (" + $index$$45$$ + ")";
          break;
        case 18:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,RL (" + $index$$45$$ + ")";
          break;
        case 19:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,RL (" + $index$$45$$ + ")";
          break;
        case 20:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,RL (" + $index$$45$$ + ")";
          break;
        case 21:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,RL (" + $index$$45$$ + ")";
          break;
        case 22:
          $inst$$inline_80_offset$$17_operand$$1$$ = "RL (" + $index$$45$$ + ")";
          break;
        case 23:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,RL (" + $index$$45$$ + ")";
          break;
        case 24:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,RR (" + $index$$45$$ + ")";
          break;
        case 25:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,RR (" + $index$$45$$ + ")";
          break;
        case 26:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,RR (" + $index$$45$$ + ")";
          break;
        case 27:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,RR (" + $index$$45$$ + ")";
          break;
        case 28:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,RR (" + $index$$45$$ + ")";
          break;
        case 29:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,RR (" + $index$$45$$ + ")";
          break;
        case 30:
          $inst$$inline_80_offset$$17_operand$$1$$ = "RR (" + $index$$45$$ + ")";
          break;
        case 31:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,RR (" + $index$$45$$ + ")";
          break;
        case 32:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,SLA (" + $index$$45$$ + ")";
          break;
        case 33:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,SLA (" + $index$$45$$ + ")";
          break;
        case 34:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,SLA (" + $index$$45$$ + ")";
          break;
        case 35:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,SLA (" + $index$$45$$ + ")";
          break;
        case 36:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,SLA (" + $index$$45$$ + ")";
          break;
        case 37:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,SLA (" + $index$$45$$ + ")";
          break;
        case 38:
          $inst$$inline_80_offset$$17_operand$$1$$ = "SLA (" + $index$$45$$ + ")";
          break;
        case 39:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,SLA (" + $index$$45$$ + ")";
          break;
        case 40:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,SRA (" + $index$$45$$ + ")";
          break;
        case 41:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,SRA (" + $index$$45$$ + ")";
          break;
        case 42:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,SRA (" + $index$$45$$ + ")";
          break;
        case 43:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,SRA (" + $index$$45$$ + ")";
          break;
        case 44:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,SRA (" + $index$$45$$ + ")";
          break;
        case 45:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,SRA (" + $index$$45$$ + ")";
          break;
        case 46:
          $inst$$inline_80_offset$$17_operand$$1$$ = "SRA (" + $index$$45$$ + ")";
          break;
        case 47:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,SRA (" + $index$$45$$ + ")";
          break;
        case 48:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,SLL (" + $index$$45$$ + ")";
          break;
        case 49:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,SLL (" + $index$$45$$ + ")";
          break;
        case 50:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,SLL (" + $index$$45$$ + ")";
          break;
        case 51:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,SLL (" + $index$$45$$ + ")";
          break;
        case 52:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,SLL (" + $index$$45$$ + ")";
          break;
        case 53:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,SLL (" + $index$$45$$ + ")";
          break;
        case 54:
          $inst$$inline_80_offset$$17_operand$$1$$ = "SLL (" + $index$$45$$ + ") *";
          break;
        case 55:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,SLL (" + $index$$45$$ + ")";
          break;
        case 56:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD B,SRL (" + $index$$45$$ + ")";
          break;
        case 57:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD C,SRL (" + $index$$45$$ + ")";
          break;
        case 58:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD D,SRL (" + $index$$45$$ + ")";
          break;
        case 59:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD E,SRL (" + $index$$45$$ + ")";
          break;
        case 60:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD H,SRL (" + $index$$45$$ + ")";
          break;
        case 61:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD L,SRL (" + $index$$45$$ + ")";
          break;
        case 62:
          $inst$$inline_80_offset$$17_operand$$1$$ = "SRL (" + $index$$45$$ + ")";
          break;
        case 63:
          $inst$$inline_80_offset$$17_operand$$1$$ = "LD A,SRL (" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "BIT 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "RES 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_80_offset$$17_operand$$1$$ = "SET 7,(" + $index$$45$$ + ")"
      }
      $inst$$3_opcode$$inline_78$$ = $inst$$inline_80_offset$$17_operand$$1$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($JSCompiler_StaticMethods_getIndex$self_opcodesArray$$inline_79$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_78$$ = "POP " + $index$$45$$;
      break;
    case 227:
      $inst$$3_opcode$$inline_78$$ = "EX SP,(" + $index$$45$$ + ")";
      break;
    case 229:
      $inst$$3_opcode$$inline_78$$ = "PUSH " + $index$$45$$;
      break;
    case 233:
      $inst$$3_opcode$$inline_78$$ = "JP (" + $index$$45$$ + ")";
      $address$$10_address$$inline_77$$ = $JSCompiler_alias_NULL$$;
      break;
    case 249:
      $inst$$3_opcode$$inline_78$$ = "LD SP," + $index$$45$$
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_78$$, code:$code$$6_sign$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$10_address$$inline_77$$}
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
    $tstates$$ && $code$$2$$.push($INDENT$$1$$ + "this.tstates -= " + $tstates$$ + ";");
    $tstates$$ = 0
  }
  console.time("JavaScript generation");
  $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.$w$;
  var $INDENT$$1$$ = "  ", $tstates$$ = 0, $prevPc$$ = 0, $breakNeeded$$ = $JSCompiler_alias_FALSE$$, $code$$2$$ = "function run(cycles, cyclesTo) {}var location = 0;}var opcode = 0;}var temp = 0;}}this.tstates += cycles;}}if (cycles != 0)}  this.totalCycles = cycles;".split("}");
  $code$$2$$.push("if (this.interruptLine) this.interrupt(); // Check for interrupt");
  $code$$2$$.push("while (this.tstates > cyclesTo) {");
  $code$$2$$.push("switch(this.pc) {");
  $code$$2$$.push($INDENT$$1$$ + "default:");
  $code$$2$$.push($INDENT$$1$$ + 'console.log("Bad address", this.pc);');
  for(var $i$$11$$ = 0, $length$$17$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$11$$ < $length$$17$$;$i$$11$$++) {
    if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$]) {
      if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].$isJumpTarget$ || $prevPc$$ != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevPc$$ && !$breakNeeded$$ && $code$$2$$.push($INDENT$$1$$ + "this.pc = " + $JSSMS$Utils$toHex$$($prevPc$$) + ";"), $code$$2$$.push($INDENT$$1$$ + "break;"), $code$$2$$.push($INDENT$$1$$ + "case " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].$address$) + ":")
      }
      $code$$2$$.push($INDENT$$1$$ + "// " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].label);
      $tstates$$ += $getTotalTStates$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].$opcodes$);
      $breakNeeded$$ = "return;" == $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].code.substr(-7);
      (/return;/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].code) || /this\.tstates/.test($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].code)) && $insertTStates$$();
      "" != $code$$2$$ && $code$$2$$.push($INDENT$$1$$ + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].code);
      $prevPc$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$11$$].$nextAddress$
    }
  }
  $code$$2$$.push("}");
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
  var $i$$14_r$$inline_112$$ = 0;
  this.$z$ = 0;
  this.$d$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$14_r$$inline_112$$ = 0;96 > $i$$14_r$$inline_112$$;$i$$14_r$$inline_112$$++) {
    this.$a$[$i$$14_r$$inline_112$$] = 255
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
  for($i$$14_r$$inline_112$$ = 0;192 > $i$$14_r$$inline_112$$;$i$$14_r$$inline_112$$++) {
    this.$n$[$i$$14_r$$inline_112$$] = Array(25)
  }
  this.$t$ = Array(512);
  this.$v$ = Array(512);
  for($i$$inline_108_i$$inline_111_sms$$3$$ = this.$m$ = this.$o$ = 0;512 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    this.$t$[$i$$inline_108_i$$inline_111_sms$$3$$] = Array(64)
  }
  var $g$$inline_113$$, $b$$inline_114$$;
  for($i$$inline_108_i$$inline_111_sms$$3$$ = 0;64 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    $i$$14_r$$inline_112$$ = $i$$inline_108_i$$inline_111_sms$$3$$ & 3, $g$$inline_113$$ = $i$$inline_108_i$$inline_111_sms$$3$$ >> 2 & 3, $b$$inline_114$$ = $i$$inline_108_i$$inline_111_sms$$3$$ >> 4 & 3, this.$H$[$i$$inline_108_i$$inline_111_sms$$3$$] = 85 * $i$$14_r$$inline_112$$ & 255, this.$G$[$i$$inline_108_i$$inline_111_sms$$3$$] = 85 * $g$$inline_113$$ & 255, this.$F$[$i$$inline_108_i$$inline_111_sms$$3$$] = 85 * $b$$inline_114$$ & 255
  }
  for($i$$inline_108_i$$inline_111_sms$$3$$ = 0;256 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    $g$$inline_113$$ = $i$$inline_108_i$$inline_111_sms$$3$$ & 15, $b$$inline_114$$ = $i$$inline_108_i$$inline_111_sms$$3$$ >> 4 & 15, this.$C$[$i$$inline_108_i$$inline_111_sms$$3$$] = ($g$$inline_113$$ << 4 | $g$$inline_113$$) & 255, this.$B$[$i$$inline_108_i$$inline_111_sms$$3$$] = ($b$$inline_114$$ << 4 | $b$$inline_114$$) & 255
  }
  for($i$$inline_108_i$$inline_111_sms$$3$$ = 0;16 > $i$$inline_108_i$$inline_111_sms$$3$$;$i$$inline_108_i$$inline_111_sms$$3$$++) {
    this.$A$[$i$$inline_108_i$$inline_111_sms$$3$$] = ($i$$inline_108_i$$inline_111_sms$$3$$ << 4 | $i$$inline_108_i$$inline_111_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$15$$;
  this.$j$ = $JSCompiler_alias_TRUE$$;
  for($i$$15$$ = this.$r$ = this.$e$ = this.$q$ = this.$f$ = 0;16 > $i$$15$$;$i$$15$$++) {
    this.$c$[$i$$15$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$h$.$a$.$F$ = $JSCompiler_alias_FALSE$$;
  this.$k$ = $JSCompiler_alias_TRUE$$;
  this.$o$ = 512;
  this.$m$ = -1;
  for($i$$15$$ = 0;16384 > $i$$15$$;$i$$15$$++) {
    this.$d$[$i$$15$$] = 0
  }
  for($i$$15$$ = 0;196608 > $i$$15$$;$i$$15$$ += 4) {
    this.$b$[$i$$15$$] = 0, this.$b$[$i$$15$$ + 1] = 0, this.$b$[$i$$15$$ + 2] = 0, this.$b$[$i$$15$$ + 3] = 255
  }
}};
function $JSSMS$DummyUI$$() {
  this.reset = function $this$reset$() {
  };
  this.updateStatus = function $this$updateStatus$() {
  }
}
function $JSSMS$NodeUI$$($sms$$5$$) {
  this.$a$ = $sms$$5$$;
  this.$canvasImageData$ = {data:[]}
}
$JSSMS$NodeUI$$.prototype = {reset:function $$JSSMS$NodeUI$$$$reset$() {
}, updateStatus:function $$JSSMS$NodeUI$$$$updateStatus$() {
}, $b$:function $$JSSMS$NodeUI$$$$$b$$() {
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
      $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$e$, $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$e$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_127_JSCompiler_StaticMethods_dataRead$self$$inline_124_JSCompiler_StaticMethods_getVCount$self$$inline_122_JSCompiler_inline_result$$5$$.$h$.$a$.$F$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_128_value$$inline_125$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$b$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$b$[0] | $JSCompiler_StaticMethods_in_$self$$.$b$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$, $address$$inline_133_old$$inline_139_port_temp$$inline_132$$, $reg$$inline_138_value$$71$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$.$is_gg$ && 7 > $address$$inline_133_old$$inline_139_port_temp$$inline_132$$)) {
    switch($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[0] = ($reg$$inline_138_value$$71$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[1] = $reg$$inline_138_value$$71$$ & 128;
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
            if($reg$$inline_138_value$$71$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] & 255)) {
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
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] = $reg$$inline_138_value$$71$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$h$.$is_sms$ ? ($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$H$[$reg$$inline_138_value$$71$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$G$[$reg$$inline_138_value$$71$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$F$[$reg$$inline_138_value$$71$$]) : 
            ($address$$inline_133_old$$inline_139_port_temp$$inline_132$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$C$[$reg$$inline_138_value$$71$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$B$[$reg$$inline_138_value$$71$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_133_old$$inline_139_port_temp$$inline_132$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$A$[$reg$$inline_138_value$$71$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$a$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ = $reg$$inline_138_value$$71$$, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ & 16128 | $reg$$inline_138_value$$71$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$ = $reg$$inline_138_value$$71$$ >> 
          6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ | $reg$$inline_138_value$$71$$ << 8, 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$w$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$f$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$r$) {
              $reg$$inline_138_value$$71$$ &= 15;
              switch($reg$$inline_138_value$$71$$) {
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$e$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$F$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_138_value$$71$$] & 3) && 
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
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_138_value$$71$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$i$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$d$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$e$, 0 != ($reg$$inline_138_value$$71$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_138_value$$71$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_138_value$$71$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_138_value$$71$$ & 63) << 4 : 
          $reg$$inline_138_value$$71$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_141_JSCompiler_StaticMethods_controlWrite$self$$inline_136_JSCompiler_StaticMethods_dataWrite$self$$inline_130_JSCompiler_StaticMethods_out$self$$.$c$) {
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
