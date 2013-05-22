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
$JSSMS$$.prototype = {$isRunning$:$JSCompiler_alias_FALSE$$, $cyclesPerLine$:0, $no_of_scanlines$:0, $fps$:0, $pause_button$:$JSCompiler_alias_FALSE$$, $is_sms$:$JSCompiler_alias_TRUE$$, $is_gg$:$JSCompiler_alias_FALSE$$, $soundEnabled$:$JSCompiler_alias_FALSE$$, $audioBuffer$:[], $audioBufferOffset$:0, $samplesPerFrame$:0, $samplesPerLine$:[], $fpsFrameCount$:0, $lineno$:0, reset:function $$JSSMS$$$$reset$() {
  var $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ = this.$c$.$z$, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ = 0;
  0 == $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ || this.$is_gg$ ? (this.$fps$ = 60, this.$no_of_scanlines$ = 262, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ = 3579545) : (this.$fps$ = 50, this.$no_of_scanlines$ = 313, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ = 3546893);
  this.$cyclesPerLine$ = Math.round($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ / this.$fps$ / this.$no_of_scanlines$ + 1);
  this.$c$.$z$ = $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$;
  if(this.$soundEnabled$) {
    $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ = this.$d$;
    $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$j$ = ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ << 8) / 16 / 44100;
    $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$e$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$c$ = 0;
    $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$h$ = 16;
    $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$f$ = 32768;
    for($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ = 0;4 > $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$++) {
      $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$b$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ << 1] = 1, $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$b$[($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ << 1) + 1] = 15, $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$a$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$] = 
      0, $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$d$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$] = 1, 3 != $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ && ($JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$.$g$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$] = 
      $NO_ANTIALIAS$$)
    }
    this.$samplesPerFrame$ = Math.round(44100 / this.$fps$);
    if(0 == this.$audioBuffer$.length || this.$audioBuffer$.length != this.$samplesPerFrame$) {
      this.$audioBuffer$ = Array(this.$samplesPerFrame$)
    }
    if(0 == this.$samplesPerLine$.length || this.$samplesPerLine$.length != this.$no_of_scanlines$) {
      this.$samplesPerLine$ = Array(this.$no_of_scanlines$);
      for(var $currentAddress$$inline_240_fractional$$inline_18$$ = 0, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ = 0;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ < this.$no_of_scanlines$;$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$++) {
        $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ = (this.$samplesPerFrame$ << 16) / this.$no_of_scanlines$ + $currentAddress$$inline_240_fractional$$inline_18$$, $currentAddress$$inline_240_fractional$$inline_18$$ = $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ - ($JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ >> 16 << 16), this.$samplesPerLine$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$] = 
        $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ >> 16
      }
    }
  }
  this.$e$.reset();
  this.$b$.reset();
  this.$c$.reset();
  this.$f$.reset();
  this.$a$.reset();
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$ = this.$a$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$ = [];
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$z$.$b$.updateStatus("Parsing instructions...");
  console.time("Instructions parsing");
  var $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ = 16384 * $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$rom$.length, $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$, $i$$inline_241$$ = 0, $addresses$$inline_242$$ = [];
  $addresses$$inline_242$$.push(0);
  $addresses$$inline_242$$.push(56);
  for($addresses$$inline_242$$.push(102);$addresses$$inline_242$$.length;) {
    if($currentAddress$$inline_240_fractional$$inline_18$$ = $addresses$$inline_242$$.shift(), !$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$currentAddress$$inline_240_fractional$$inline_18$$]) {
      if($currentAddress$$inline_240_fractional$$inline_18$$ >= $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$ || 65 <= $currentAddress$$inline_240_fractional$$inline_18$$ >> 10) {
        console.log("Invalid address", $JSSMS$Utils$toHex$$($currentAddress$$inline_240_fractional$$inline_18$$))
      }else {
        var $JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$ = $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $currentAddress$$inline_240_fractional$$inline_18$$;
        $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
        var $defaultInstruction$$inline_295_opcodesArray$$inline_272$$ = [$instruction$$inline_239_opcode$$inline_271_options$$inline_294$$], $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "Unknown Opcode", $currAddr$$inline_274_prop$$inline_296$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$, $address$$inline_286_target$$inline_275$$ = $JSCompiler_alias_NULL$$, $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = 'throw "Unimplemented opcode ' + $JSSMS$Utils$toHex$$($instruction$$inline_239_opcode$$inline_271_options$$inline_294$$) + 
        '";', $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = "", $code$$inline_285_location$$inline_278_target$$inline_291$$ = 0;
        $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
        switch($instruction$$inline_239_opcode$$inline_271_options$$inline_294$$) {
          case 0:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "NOP";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 1:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD BC," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setBC(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 2:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (BC),A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getBC(), this.a);";
            break;
          case 3:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC BC";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.incBC();";
            break;
          case 4:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.inc8(this.b);";
            break;
          case 5:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.dec8(this.b);";
            break;
          case 6:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 7:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RLCA";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.rlca_a();";
            break;
          case 8:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "EX AF AF'";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.exAF();";
            break;
          case 9:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD HL,BC";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(this.add16(this.getHL(), this.getBC()));";
            break;
          case 10:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,(BC)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.readMem(this.getBC());";
            break;
          case 11:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC BC";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.decBC();";
            break;
          case 12:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.inc8(this.c);";
            break;
          case 13:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.dec8(this.c);";
            break;
          case 14:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 15:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RRCA";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.rrca_a();";
            break;
          case 16:
            $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$) + 1);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DJNZ (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = (this.b - 1) & 0xff;if (this.b != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 5;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 17:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD DE," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setDE(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 18:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (DE),A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getDE(), this.a);";
            break;
          case 19:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC DE";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.incDE();";
            break;
          case 20:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.inc8(this.d);";
            break;
          case 21:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.dec8(this.d);";
            break;
          case 22:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 23:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RLA";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.rla_a();";
            break;
          case 24:
            $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$) + 1);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JR (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $JSCompiler_alias_NULL$$;
            break;
          case 25:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD HL,DE";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(this.add16(this.getHL(), this.getDE()));";
            break;
          case 26:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,(DE)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.readMem(this.getDE());";
            break;
          case 27:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC DE";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.decDE();";
            break;
          case 28:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.inc8(this.e);";
            break;
          case 29:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.dec8(this.e);";
            break;
          case 30:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 31:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RRA";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.rra_a();";
            break;
          case 32:
            $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$) + 1);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JR NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if (!((this.f & F_ZERO) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 5;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 33:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD HL," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 34:
            $code$$inline_285_location$$inline_278_target$$inline_291$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + "),HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ", this.l);this.writeMem(" + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$ + 1) + ", this.h);";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 35:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.incHL();";
            break;
          case 36:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.inc8(this.h);";
            break;
          case 37:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.dec8(this.h);";
            break;
          case 38:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 39:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DAA";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.daa();";
            break;
          case 40:
            $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$) + 1);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JR Z,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 5;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 41:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD HL,HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(this.add16(this.getHL(), this.getHL()));";
            break;
          case 42:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD HL,(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(this.readMemWord(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + "));";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 43:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.decHL();";
            break;
          case 44:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.inc8(this.l);";
            break;
          case 45:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.dec8(this.l);";
            break;
          case 46:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 47:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CPL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cpl_a();";
            break;
          case 48:
            $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$) + 1);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JR NC,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if (!((this.f & F_CARRY) != 0)) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 5;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 49:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD SP," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sp = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 50:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + "),A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ", this.a);";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 51:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC SP";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sp++;";
            break;
          case 52:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC (HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.incMem(this.getHL());";
            break;
          case 53:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC (HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.decMem(this.getHL());";
            break;
          case 54:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL)," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 55:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SCF";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f |= F_CARRY; this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
            break;
          case 56:
            $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$ + $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$) + 1);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JR C,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 5;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 57:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD HL,SP";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(this.add16(this.getHL(), this.sp));";
            break;
          case 58:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.readMem(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 59:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC SP";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sp--;";
            break;
          case 60:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "INC A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.inc8(this.a);";
            break;
          case 61:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DEC A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.dec8(this.a);";
            break;
          case 62:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ";";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 63:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CCF";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.ccf();";
            break;
          case 64:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 65:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.c;";
            break;
          case 66:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.d;";
            break;
          case 67:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.e;";
            break;
          case 68:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.h;";
            break;
          case 69:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.l;";
            break;
          case 70:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.readMem(this.getHL());";
            break;
          case 71:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD B,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.b = this.a;";
            break;
          case 72:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.b;";
            break;
          case 73:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 74:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.d;";
            break;
          case 75:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.e;";
            break;
          case 76:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.h;";
            break;
          case 77:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.l;";
            break;
          case 78:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.readMem(this.getHL());";
            break;
          case 79:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD C,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.c = this.a;";
            break;
          case 80:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.b;";
            break;
          case 81:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.c;";
            break;
          case 82:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 83:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.e;";
            break;
          case 84:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.h;";
            break;
          case 85:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.l;";
            break;
          case 86:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.readMem(this.getHL());";
            break;
          case 87:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD D,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.d = this.a;";
            break;
          case 88:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.b;";
            break;
          case 89:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.c;";
            break;
          case 90:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.d;";
            break;
          case 91:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 92:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.h;";
            break;
          case 93:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.l;";
            break;
          case 94:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.readMem(this.getHL());";
            break;
          case 95:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD E,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.e = this.a;";
            break;
          case 96:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.b;";
            break;
          case 97:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.c;";
            break;
          case 98:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.d;";
            break;
          case 99:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.e;";
            break;
          case 100:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 101:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.l;";
            break;
          case 102:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.readMem(this.getHL());";
            break;
          case 103:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD H,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.h = this.a;";
            break;
          case 104:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.b;";
            break;
          case 105:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.c;";
            break;
          case 106:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.d;";
            break;
          case 107:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.e;";
            break;
          case 108:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.h;";
            break;
          case 109:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 110:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.readMem(this.getHL());";
            break;
          case 111:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD L,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.l = this.a;";
            break;
          case 112:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.b);";
            break;
          case 113:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.c);";
            break;
          case 114:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.d);";
            break;
          case 115:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.e);";
            break;
          case 116:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.h);";
            break;
          case 117:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.l);";
            break;
          case 118:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "HALT";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.tstates = 0;";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ += "this.halt = true; this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "; return;";
            break;
          case 119:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD (HL),A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.writeMem(this.getHL(), this.a);";
            break;
          case 120:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.b;";
            break;
          case 121:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.c;";
            break;
          case 122:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.d;";
            break;
          case 123:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.e;";
            break;
          case 124:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.h;";
            break;
          case 125:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.l;";
            break;
          case 126:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.a = this.readMem(this.getHL());";
            break;
          case 127:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 128:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.b);";
            break;
          case 129:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.c);";
            break;
          case 130:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.d);";
            break;
          case 131:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.e);";
            break;
          case 132:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.h);";
            break;
          case 133:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.l);";
            break;
          case 134:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.readMem(this.getHL()));";
            break;
          case 135:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(this.a);";
            break;
          case 136:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.b);";
            break;
          case 137:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.c);";
            break;
          case 138:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.d);";
            break;
          case 139:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.e);";
            break;
          case 140:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.h);";
            break;
          case 141:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.l);";
            break;
          case 142:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.readMem(this.getHL()));";
            break;
          case 143:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(this.a);";
            break;
          case 144:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.b);";
            break;
          case 145:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.c);";
            break;
          case 146:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.d);";
            break;
          case 147:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.e);";
            break;
          case 148:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.h);";
            break;
          case 149:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.l);";
            break;
          case 150:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.readMem(this.getHL()));";
            break;
          case 151:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sub_a(this.a);";
            break;
          case 152:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.b);";
            break;
          case 153:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.c);";
            break;
          case 154:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.d);";
            break;
          case 155:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.e);";
            break;
          case 156:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.h);";
            break;
          case 157:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.l);";
            break;
          case 158:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.readMem(this.getHL()));";
            break;
          case 159:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(this.a);";
            break;
          case 160:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.b] | F_HALFCARRY;";
            break;
          case 161:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.c] | F_HALFCARRY;";
            break;
          case 162:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.d] | F_HALFCARRY;";
            break;
          case 163:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.e] | F_HALFCARRY;";
            break;
          case 164:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.h] | F_HALFCARRY;";
            break;
          case 165:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.l] | F_HALFCARRY;";
            break;
          case 166:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= this.readMem(this.getHL())] | F_HALFCARRY;";
            break;
          case 167:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a] | F_HALFCARRY;";
            break;
          case 168:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.b];";
            break;
          case 169:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.c];";
            break;
          case 170:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.d];";
            break;
          case 171:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.e];";
            break;
          case 172:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.h];";
            break;
          case 173:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.l];";
            break;
          case 174:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.getHL())];";
            break;
          case 175:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$.$l$[0]) + "; this.a = " + $JSSMS$Utils$toHex$$(0) + ";";
            break;
          case 176:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.b];";
            break;
          case 177:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.c];";
            break;
          case 178:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.d];";
            break;
          case 179:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.e];";
            break;
          case 180:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.h];";
            break;
          case 181:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.l];";
            break;
          case 182:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.getHL())];";
            break;
          case 183:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a];";
            break;
          case 184:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,B";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.b);";
            break;
          case 185:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.c);";
            break;
          case 186:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,D";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.d);";
            break;
          case 187:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,E";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.e);";
            break;
          case 188:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,H";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.h);";
            break;
          case 189:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,L";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.l);";
            break;
          case 190:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,(HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.readMem(this.getHL()));";
            break;
          case 191:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP A,A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(this.a);";
            break;
          case 192:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET NZ";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 193:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "POP BC";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setBC(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 194:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP NZ,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 195:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $JSCompiler_alias_NULL$$;
            break;
          case 196:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL NZ (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 197:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "PUSH BC";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push2(this.b, this.c);";
            break;
          case 198:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADD A," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.add_a(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 199:
            $address$$inline_286_target$$inline_275$$ = 0;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 200:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET Z";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 201:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.pc = this.readMemWord(this.sp); this.sp += 2; return;";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $JSCompiler_alias_NULL$$;
            break;
          case 202:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP Z,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 203:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSCompiler_alias_VOID$$;
            $JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = [$JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$];
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "Unimplemented 0xCB prefixed opcode";
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$;
            $code$$inline_285_location$$inline_278_target$$inline_291$$ = 'throw "Unimplemented 0xCB prefixed opcode";';
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            switch($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$) {
              case 0:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC B";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.b = (this.rlc(this.b));";
                break;
              case 1:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC C";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.c = (this.rlc(this.c));";
                break;
              case 2:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC D";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.d = (this.rlc(this.d));";
                break;
              case 3:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC E";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.e = (this.rlc(this.e));";
                break;
              case 4:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC H";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.h = (this.rlc(this.h));";
                break;
              case 5:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC L";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.l = (this.rlc(this.l));";
                break;
              case 6:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC (HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.rlc(this.readMem(this.getHL())));";
                break;
              case 7:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLC A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.a = (this.rlc(this.a));";
                break;
              case 8:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC B";
                break;
              case 9:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC C";
                break;
              case 10:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC D";
                break;
              case 11:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC E";
                break;
              case 12:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC H";
                break;
              case 13:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC L";
                break;
              case 14:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC (HL)";
                break;
              case 15:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRC A";
                break;
              case 16:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL B";
                break;
              case 17:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL C";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.c = (this.rl(this.c));";
                break;
              case 18:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL D";
                break;
              case 19:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL E";
                break;
              case 20:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL H";
                break;
              case 21:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL L";
                break;
              case 22:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL (HL)";
                break;
              case 23:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RL A";
                break;
              case 24:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR B";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.b = (this.rr(this.b));";
                break;
              case 25:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR C";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.c = (this.rr(this.c));";
                break;
              case 26:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR D";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.d = (this.rr(this.d));";
                break;
              case 27:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR E";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.e = (this.rr(this.e));";
                break;
              case 28:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR H";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.h = (this.rr(this.h));";
                break;
              case 29:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR L";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.l = (this.rr(this.l));";
                break;
              case 30:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR (HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.rr(this.readMem(this.getHL())));";
                break;
              case 31:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RR A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.a = (this.rr(this.a));";
                break;
              case 32:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA B";
                break;
              case 33:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA C";
                break;
              case 34:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA D";
                break;
              case 35:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA E";
                break;
              case 36:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA H";
                break;
              case 37:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA L";
                break;
              case 38:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA (HL)";
                break;
              case 39:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLA A";
                break;
              case 40:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA B";
                break;
              case 41:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA C";
                break;
              case 42:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA D";
                break;
              case 43:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA E";
                break;
              case 44:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA H";
                break;
              case 45:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA L";
                break;
              case 46:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA (HL)";
                break;
              case 47:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRA A";
                break;
              case 48:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL B";
                break;
              case 49:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL C";
                break;
              case 50:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL D";
                break;
              case 51:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL E";
                break;
              case 52:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL H";
                break;
              case 53:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL L";
                break;
              case 54:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL (HL)";
                break;
              case 55:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SLL A";
                break;
              case 56:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL B";
                break;
              case 57:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL C";
                break;
              case 58:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL D";
                break;
              case 59:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL E";
                break;
              case 60:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL H";
                break;
              case 61:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL L";
                break;
              case 62:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL (HL)";
                break;
              case 63:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SRL A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.a = this.srl(this.a);";
                break;
              case 64:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,B";
                break;
              case 65:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,C";
                break;
              case 66:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,D";
                break;
              case 67:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,E";
                break;
              case 68:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,H";
                break;
              case 69:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,L";
                break;
              case 70:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_0);";
                break;
              case 71:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 0,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_0);";
                break;
              case 72:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,B";
                break;
              case 73:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,C";
                break;
              case 74:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,D";
                break;
              case 75:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,E";
                break;
              case 76:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,H";
                break;
              case 77:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,L";
                break;
              case 78:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_1);";
                break;
              case 79:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 1,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_1);";
                break;
              case 80:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,B";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.b & BIT_2);";
                break;
              case 81:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,C";
                break;
              case 82:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,D";
                break;
              case 83:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,E";
                break;
              case 84:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,H";
                break;
              case 85:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,L";
                break;
              case 86:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_2);";
                break;
              case 87:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 2,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_2);";
                break;
              case 88:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,B";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.b & BIT_3);";
                break;
              case 89:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,C";
                break;
              case 90:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,D";
                break;
              case 91:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,E";
                break;
              case 92:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,H";
                break;
              case 93:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,L";
                break;
              case 94:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_3);";
                break;
              case 95:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 3,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_3);";
                break;
              case 96:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,B";
                break;
              case 97:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,C";
                break;
              case 98:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,D";
                break;
              case 99:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,E";
                break;
              case 100:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,H";
                break;
              case 101:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,L";
                break;
              case 102:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_4);";
                break;
              case 103:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 4,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_4);";
                break;
              case 104:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,B";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.b & BIT_5);";
                break;
              case 105:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,C";
                break;
              case 106:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,D";
                break;
              case 107:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,E";
                break;
              case 108:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,H";
                break;
              case 109:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,L";
                break;
              case 110:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_5);";
                break;
              case 111:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 5,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_5);";
                break;
              case 112:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,B";
                break;
              case 113:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,C";
                break;
              case 114:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,D";
                break;
              case 115:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,E";
                break;
              case 116:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,H";
                break;
              case 117:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,L";
                break;
              case 118:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_6);";
                break;
              case 119:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 6,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_6);";
                break;
              case 120:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,B";
                break;
              case 121:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,C";
                break;
              case 122:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,D";
                break;
              case 123:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,E";
                break;
              case 124:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,H";
                break;
              case 125:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,L";
                break;
              case 126:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.readMem(this.getHL()) & BIT_7);";
                break;
              case 127:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "BIT 7,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.bit(this.a & BIT_7);";
                break;
              case 128:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,B";
                break;
              case 129:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,C";
                break;
              case 130:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,D";
                break;
              case 131:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,E";
                break;
              case 132:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,H";
                break;
              case 133:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,L";
                break;
              case 134:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_0);";
                break;
              case 135:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 0,A";
                break;
              case 136:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,B";
                break;
              case 137:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,C";
                break;
              case 138:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,D";
                break;
              case 139:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,E";
                break;
              case 140:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,H";
                break;
              case 141:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,L";
                break;
              case 142:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_1);";
                break;
              case 143:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 1,A";
                break;
              case 144:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,B";
                break;
              case 145:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,C";
                break;
              case 146:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,D";
                break;
              case 147:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,E";
                break;
              case 148:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,H";
                break;
              case 149:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,L";
                break;
              case 150:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_2);";
                break;
              case 151:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 2,A";
                break;
              case 152:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,B";
                break;
              case 153:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,C";
                break;
              case 154:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,D";
                break;
              case 155:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,E";
                break;
              case 156:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,H";
                break;
              case 157:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,L";
                break;
              case 158:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_3);";
                break;
              case 159:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 3,A";
                break;
              case 160:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,B";
                break;
              case 161:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,C";
                break;
              case 162:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,D";
                break;
              case 163:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,E";
                break;
              case 164:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,H";
                break;
              case 165:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,L";
                break;
              case 166:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_4);";
                break;
              case 167:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 4,A";
                break;
              case 168:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,B";
                break;
              case 169:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,C";
                break;
              case 170:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,D";
                break;
              case 171:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,E";
                break;
              case 172:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,H";
                break;
              case 173:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,L";
                break;
              case 174:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_5);";
                break;
              case 175:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 5,A";
                break;
              case 176:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,B";
                break;
              case 177:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,C";
                break;
              case 178:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,D";
                break;
              case 179:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,E";
                break;
              case 180:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,H";
                break;
              case 181:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,L";
                break;
              case 182:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_6);";
                break;
              case 183:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 6,A";
                break;
              case 184:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,B";
                break;
              case 185:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,C";
                break;
              case 186:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,D";
                break;
              case 187:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,E";
                break;
              case 188:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,H";
                break;
              case 189:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,L";
                break;
              case 190:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) & ~BIT_7);";
                break;
              case 191:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RES 7,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.a &= ~BIT_7;";
                break;
              case 192:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,B";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.b |= BIT_0;";
                break;
              case 193:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,C";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.c |= BIT_0;";
                break;
              case 194:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,D";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.d |= BIT_0;";
                break;
              case 195:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,E";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.e |= BIT_0;";
                break;
              case 196:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,H";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.h |= BIT_0;";
                break;
              case 197:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,L";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.l |= BIT_0;";
                break;
              case 198:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_0);";
                break;
              case 199:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 0,A";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.a |= BIT_0;";
                break;
              case 200:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,B";
                break;
              case 201:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,C";
                break;
              case 202:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,D";
                break;
              case 203:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,E";
                break;
              case 204:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,H";
                break;
              case 205:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,L";
                break;
              case 206:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_1);";
                break;
              case 207:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 1,A";
                break;
              case 208:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,B";
                break;
              case 209:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,C";
                break;
              case 210:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,D";
                break;
              case 211:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,E";
                break;
              case 212:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,H";
                break;
              case 213:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,L";
                break;
              case 214:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_2)";
                break;
              case 215:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 2,A";
                break;
              case 216:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,B";
                break;
              case 217:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,C";
                break;
              case 218:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,D";
                break;
              case 219:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,E";
                break;
              case 220:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,H";
                break;
              case 221:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,L";
                break;
              case 222:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_3);";
                break;
              case 223:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 3,A";
                break;
              case 224:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,B";
                break;
              case 225:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,C";
                break;
              case 226:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,D";
                break;
              case 227:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,E";
                break;
              case 228:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,H";
                break;
              case 229:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,L";
                break;
              case 230:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_4);";
                break;
              case 231:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 4,A";
                break;
              case 232:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,B";
                break;
              case 233:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,C";
                break;
              case 234:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,D";
                break;
              case 235:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,E";
                break;
              case 236:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,H";
                break;
              case 237:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,L";
                break;
              case 238:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_5);";
                break;
              case 239:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 5,A";
                break;
              case 240:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,B";
                break;
              case 241:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,C";
                break;
              case 242:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,D";
                break;
              case 243:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,E";
                break;
              case 244:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,H";
                break;
              case 245:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,L";
                break;
              case 246:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_6);";
                break;
              case 247:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 6,A";
                break;
              case 248:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,B";
                break;
              case 249:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,C";
                break;
              case 250:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,D";
                break;
              case 251:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,E";
                break;
              case 252:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,H";
                break;
              case 253:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,L";
                break;
              case 254:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,(HL)";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.writeMem(this.getHL(), this.readMem(this.getHL()) | BIT_7);";
                break;
              case 255:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SET 7,A", $code$$inline_285_location$$inline_278_target$$inline_291$$ = "this.a |= BIT_7;"
            }
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = {$opcode$:$JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $opcodes$:$inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$, $inst$:$code$$inline_276_inst$$inline_283_inst$$inline_289$$, code:$code$$inline_285_location$$inline_278_target$$inline_291$$, $address$:$_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$, 
            $nextAddress$:$address$$inline_270_address$$inline_280_opcode$$inline_287$$};
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$inst$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.code;
            $defaultInstruction$$inline_295_opcodesArray$$inline_272$$ = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.concat($_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$opcodes$);
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$nextAddress$;
            break;
          case 204:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL Z (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_ZERO) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 205:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 206:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "ADC ," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.adc_a(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 207:
            $address$$inline_286_target$$inline_275$$ = 8;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 208:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET NC";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 209:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "POP DE";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setDE(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 210:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP NC,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 211:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OUT (" + $JSSMS$Utils$toHex$$($_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$) + "),A";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$);
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 212:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL NC (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 213:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "PUSH DE";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push2(this.d, this.e);";
            break;
          case 214:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SUB " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "";
            break;
          case 215:
            $address$$inline_286_target$$inline_275$$ = 16;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 216:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET C";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 217:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "EXX";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.exBC(); this.exDE(); this.exHL();";
            break;
          case 218:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP C,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 219:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "IN A,(" + $JSSMS$Utils$toHex$$($_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$);
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 220:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL C (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_CARRY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 221:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, "IX", $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$inst$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.code;
            $defaultInstruction$$inline_295_opcodesArray$$inline_272$$ = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.concat($_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$opcodes$);
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$nextAddress$;
            break;
          case 222:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "SBC A," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sbc_a(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 223:
            $address$$inline_286_target$$inline_275$$ = 24;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 224:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET PO";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_PARITY) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 225:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "POP HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.setHL(this.readMemWord(this.sp)); this.sp += 2;";
            break;
          case 226:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP PO,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_PARITY) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 227:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "EX (SP),HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "temp = this.h;this.h = this.readMem(this.sp + 1);this.writeMem(this.sp + 1, temp);temp = this.l;this.l = this.readMem(this.sp);this.writeMem(this.sp, temp);";
            break;
          case 228:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL PO (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_PARITY) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 229:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "PUSH HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push2(this.h, this.l);";
            break;
          case 230:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "AND (" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a &= " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + "] | F_HALFCARRY;";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 231:
            $address$$inline_286_target$$inline_275$$ = 32;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 232:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET PE";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_PARITY) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 233:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP (HL)";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.pc = this.getHL(); return;";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $JSCompiler_alias_NULL$$;
            break;
          case 234:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP PE,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_PARITY) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 235:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "EX DE,HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "temp = this.d;this.d = this.h;this.h = temp;temp = this.e;this.e = this.l;this.l = temp;";
            break;
          case 236:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL PE (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_PARITY) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 237:
            var $address$$inline_286_target$$inline_275$$ = $address$$inline_270_address$$inline_280_opcode$$inline_287$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$), $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = [$address$$inline_270_address$$inline_280_opcode$$inline_287$$], 
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "Unimplemented 0xED prefixed opcode", $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $address$$inline_286_target$$inline_275$$, $code$$inline_285_location$$inline_278_target$$inline_291$$ = $JSCompiler_alias_NULL$$, $code$$inline_292$$ = 'throw "Unimplemented 0xED prefixed opcode";', $operand$$inline_293$$ = "";
            $address$$inline_286_target$$inline_275$$++;
            switch($address$$inline_270_address$$inline_280_opcode$$inline_287$$) {
              case 64:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN B,(C)";
                $code$$inline_292$$ = "this.b = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.b];";
                break;
              case 65:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),B";
                $code$$inline_292$$ = "this.port.out(this.c, this.b);";
                break;
              case 66:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SBC HL,BC";
                $code$$inline_292$$ = "this.sbc16(this.getBC());";
                break;
              case 67:
                $operand$$inline_293$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$));
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD (" + $operand$$inline_293$$ + "),BC";
                $code$$inline_292$$ = "var location = " + $operand$$inline_293$$ + ";this.writeMem(location++, this.c);this.writeMem(location, this.b);";
                $address$$inline_286_target$$inline_275$$ += 2;
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
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "NEG";
                $code$$inline_292$$ = "temp = this.a;this.a = 0;this.sub_a(temp);";
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
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RETN / RETI";
                $code$$inline_292$$ = "this.pc = this.readMemWord(this.sp);this.sp += 2;this.iff1 = this.iff2;";
                $address$$inline_286_target$$inline_275$$ = $JSCompiler_alias_NULL$$;
                break;
              case 70:
              ;
              case 78:
              ;
              case 102:
              ;
              case 110:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IM 0";
                $code$$inline_292$$ = "this.im = 0;";
                break;
              case 71:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD I,A";
                $code$$inline_292$$ = "this.i = this.a;";
                break;
              case 72:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN C,(C)";
                $code$$inline_292$$ = "this.c = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.c];";
                break;
              case 73:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),C";
                $code$$inline_292$$ = "this.port.out(this.c, this.c);";
                break;
              case 74:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "ADC HL,BC";
                $code$$inline_292$$ = "this.adc16(this.getBC());";
                break;
              case 75:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD BC,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + ")";
                $code$$inline_292$$ = "this.setBC(this.readMemWord(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + "));";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 79:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD R,A";
                $code$$inline_292$$ = "this.r = this.a;";
                break;
              case 80:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN D,(C)";
                $code$$inline_292$$ = "this.d = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.d];";
                break;
              case 81:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),D";
                $code$$inline_292$$ = "this.port.out(this.c, this.d);";
                break;
              case 82:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SBC HL,DE";
                $code$$inline_292$$ = "this.sbc16(this.getDE());";
                break;
              case 83:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + "),DE";
                $code$$inline_292$$ = "var location = this.readMemWord(this.pc + 1);this.writeMem(location++, this.e);this.writeMem(location, this.d);";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 86:
              ;
              case 118:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IM 1";
                $code$$inline_292$$ = "this.im = 1;";
                break;
              case 87:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD A,I";
                $code$$inline_292$$ = "this.a = this.i;this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 88:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN E,(C)";
                $code$$inline_292$$ = "this.e = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.e];";
                break;
              case 89:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),E";
                $code$$inline_292$$ = "this.port.out(this.c, this.e);";
                break;
              case 90:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "ADC HL,DE";
                $code$$inline_292$$ = "this.adc16(this.getDE());";
                break;
              case 91:
                $operand$$inline_293$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$));
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD DE,(" + $operand$$inline_293$$ + ")";
                $code$$inline_292$$ = "this.setDE(" + $operand$$inline_293$$ + ");";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 95:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD A,R";
                $code$$inline_292$$ = "this.a = JSSMS.Utils.rndInt(255);";
                $code$$inline_292$$ += "this.f = (this.f & F_CARRY) | this.SZ_TABLE[this.a] | (this.iff2 ? F_PARITY : 0);";
                break;
              case 96:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN H,(C)";
                $code$$inline_292$$ = "this.h = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.h];";
                break;
              case 97:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),H";
                $code$$inline_292$$ = "this.port.out(this.c, this.h);";
                break;
              case 98:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SBC HL,HL";
                $code$$inline_292$$ = "this.sbc16(this.getHL());";
                break;
              case 99:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + "),HL";
                $code$$inline_292$$ = "var location = this.readMemWord(this.pc + 1);this.writeMem(location++, this.l);this.writeMem(location, this.h);";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 103:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RRD";
                $code$$inline_292$$ = "var location = this.getHL();temp = this.readMem(location);this.writeMem(location, (temp >> 4) | ((this.a & 0x0F) << 4));this.a = (this.a & 0xF0) | (temp & 0x0F);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 104:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN L,(C)";
                $code$$inline_292$$ = "this.l = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.l];";
                break;
              case 105:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),L";
                $code$$inline_292$$ = "this.port.out(this.c, this.l);";
                break;
              case 106:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "ADC HL,HL";
                $code$$inline_292$$ = "this.adc16(this.getHL());";
                break;
              case 107:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD HL,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + ")";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 111:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "RLD";
                break;
              case 113:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),0";
                break;
              case 114:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "SBC HL,SP";
                break;
              case 115:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + "),SP";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 120:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IN A,(C)";
                $code$$inline_292$$ = "this.a = this.port.in_(this.c);this.f = (this.f & F_CARRY) | this.SZP_TABLE[this.a];";
                break;
              case 121:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUT (C),A";
                $code$$inline_292$$ = "this.port.out(this.c, this.a);";
                break;
              case 122:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "ADC HL,SP";
                break;
              case 123:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LD SP,(" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_286_target$$inline_275$$)) + ")";
                $address$$inline_286_target$$inline_275$$ += 2;
                break;
              case 160:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LDI";
                $code$$inline_292$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();this.f = (this.f & 0xC1) | (this.getBC() != 0 ? F_PARITY : 0);";
                break;
              case 161:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "CPI";
                break;
              case 162:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "INI";
                $code$$inline_292$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 163:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUTI";
                $code$$inline_292$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.incHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 168:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LDD";
                break;
              case 169:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "CPD";
                break;
              case 170:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "IND";
                $code$$inline_292$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 171:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OUTD";
                $code$$inline_292$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.decHL();this.b = this.dec8(this.b);if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 176:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LDIR";
                $code$$inline_292$$ = "this.writeMem(this.getDE(), this.readMem(this.getHL()));this.incDE();this.incHL();this.decBC();";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = $address$$inline_286_target$$inline_275$$ - 2;
                $code$$inline_292$$ += "if (this.getBC() != 0) {this.f |= F_PARITY;this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$) + ";return;}";
                $code$$inline_292$$ += "if (!(this.getBC() != 0)) this.f &= ~ F_PARITY;this.f &= ~ F_NEGATIVE; this.f &= ~ F_HALFCARRY;";
                break;
              case 177:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "CPIR";
                $code$$inline_292$$ = "temp = (this.f & F_CARRY) | F_NEGATIVE;this.cp_a(this.readMem(this.getHL()));this.incHL();this.decBC();temp |= (this.getBC() == 0 ? 0 : F_PARITY);";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = $address$$inline_286_target$$inline_275$$ - 2;
                $code$$inline_292$$ += "if ((temp & F_PARITY) != 0 && (this.f & F_ZERO) == 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$) + ";return;}";
                $code$$inline_292$$ += "this.f = (this.f & 0xF8) | temp;";
                break;
              case 178:
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = $address$$inline_286_target$$inline_275$$ - 2;
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "INIR";
                $code$$inline_292$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.incHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$) + ";return;}if ((temp & 0x80) == 0x80) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 179:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OTIR";
                $code$$inline_292$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.incHL();";
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = $address$$inline_286_target$$inline_275$$ - 2;
                $code$$inline_292$$ += "if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$) + ";return;}";
                $code$$inline_292$$ += "if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 184:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "LDDR";
                break;
              case 185:
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "CPDR";
                break;
              case 186:
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = $address$$inline_286_target$$inline_275$$ - 2;
                $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "INDR";
                $code$$inline_292$$ = "temp = this.port.in_(this.c);this.writeMem(this.getHL(), temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$) + ";return;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;";
                break;
              case 187:
                $code$$inline_285_location$$inline_278_target$$inline_291$$ = $address$$inline_286_target$$inline_275$$ - 2, $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "OTDR", $code$$inline_292$$ = "temp = this.readMem(this.getHL());this.port.out(this.c, temp);this.b = this.dec8(this.b);this.decHL();if (this.b != 0) {this.tstates -= 5;this.pc = " + $JSSMS$Utils$toHex$$($code$$inline_285_location$$inline_278_target$$inline_291$$) + ";return;}if ((this.l + temp) > 255) {this.f |= F_CARRY; this.f |= F_HALFCARRY;} else {this.f &= ~ F_CARRY; this.f &= ~ F_HALFCARRY;}if ((temp & 0x80) != 0) this.f |= F_NEGATIVE;else this.f &= ~ F_NEGATIVE;"
            }
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = {$opcode$:$address$$inline_270_address$$inline_280_opcode$$inline_287$$, $opcodes$:$inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$, $inst$:$code$$inline_276_inst$$inline_283_inst$$inline_289$$, code:$code$$inline_292$$, $address$:$_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$, $nextAddress$:$address$$inline_286_target$$inline_275$$, target:$code$$inline_285_location$$inline_278_target$$inline_291$$};
            $address$$inline_286_target$$inline_275$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.target;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$inst$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.code;
            $defaultInstruction$$inline_295_opcodesArray$$inline_272$$ = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.concat($_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$opcodes$);
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$nextAddress$;
            break;
          case 238:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "XOR A," + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a ^= " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + "];";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 239:
            $address$$inline_286_target$$inline_275$$ = 40;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 240:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET P";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_SIGN) == 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 241:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "POP AF";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.readMem(this.sp++); this.a = this.readMem(this.sp++);";
            break;
          case 242:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP P,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_SIGN) == 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 243:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "DI";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.iff1 = this.iff2 = false; this.EI_inst = true;";
            break;
          case 244:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL P (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_SIGN) == 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 245:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "PUSH AF";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push2(this.a, this.f);";
            break;
          case 246:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "OR " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.f = this.SZP_TABLE[this.a |= " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + "];";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 247:
            $address$$inline_286_target$$inline_275$$ = 48;
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$);
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;";
            break;
          case 248:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RET M";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_SIGN) != 0) {this.pc = this.readMemWord(this.sp);this.sp += 2;this.tstates -= 6;return;}";
            break;
          case 249:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "LD SP,HL";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.sp = this.getHL()";
            break;
          case 250:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "JP M,(" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_SIGN) != 0) {this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 251:
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "EI";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.iff1 = this.iff2 = this.EI_inst = true;";
            break;
          case 252:
            $address$$inline_286_target$$inline_275$$ = $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CALL M (" + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ")";
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "if ((this.f & F_SIGN) != 0) {this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$ + 2) + ");this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + ";this.tstates -= 7;return;}";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ += 2;
            break;
          case 253:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, "IY", $address$$inline_270_address$$inline_280_opcode$$inline_287$$);
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$inst$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.code;
            $defaultInstruction$$inline_295_opcodesArray$$inline_272$$ = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.concat($_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$opcodes$);
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$ = $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$.$nextAddress$;
            break;
          case 254:
            $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$, $address$$inline_270_address$$inline_280_opcode$$inline_287$$));
            $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "CP " + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$;
            $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.cp_a(" + $_inst$$inline_279_currAddr$$inline_284_currAddr$$inline_290_operand$$inline_277$$ + ");";
            $address$$inline_270_address$$inline_280_opcode$$inline_287$$++;
            break;
          case 255:
            $address$$inline_286_target$$inline_275$$ = 56, $inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$ = "RST " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$), $code$$inline_276_inst$$inline_283_inst$$inline_289$$ = "this.push1(" + $JSSMS$Utils$toHex$$($address$$inline_270_address$$inline_280_opcode$$inline_287$$) + "); this.pc = " + $JSSMS$Utils$toHex$$($address$$inline_286_target$$inline_275$$) + "; return;"
        }
        $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$ = {$opcode$:$instruction$$inline_239_opcode$$inline_271_options$$inline_294$$, $opcodes$:$defaultInstruction$$inline_295_opcodesArray$$inline_272$$, $inst$:$inst$$inline_273_opcodesArray$$inline_282_opcodesArray$$inline_288$$, code:$code$$inline_276_inst$$inline_283_inst$$inline_289$$, $address$:$currAddr$$inline_274_prop$$inline_296$$, $nextAddress$:$address$$inline_270_address$$inline_280_opcode$$inline_287$$, target:$address$$inline_286_target$$inline_275$$};
        $defaultInstruction$$inline_295_opcodesArray$$inline_272$$ = {$address$:0, $hexAddress$:"", $opcode$:0, $opcodes$:[], $inst$:"", code:"", $nextAddress$:$JSCompiler_alias_NULL$$, target:$JSCompiler_alias_NULL$$, $isJumpTarget$:$JSCompiler_alias_FALSE$$, $jumpTargetNb$:0, label:""};
        $currAddr$$inline_274_prop$$inline_296$$ = $JSCompiler_alias_VOID$$;
        $JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$ = "";
        for($currAddr$$inline_274_prop$$inline_296$$ in $defaultInstruction$$inline_295_opcodesArray$$inline_272$$) {
          $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$[$currAddr$$inline_274_prop$$inline_296$$] != $JSCompiler_alias_VOID$$ && ($defaultInstruction$$inline_295_opcodesArray$$inline_272$$[$currAddr$$inline_274_prop$$inline_296$$] = $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$[$currAddr$$inline_274_prop$$inline_296$$])
        }
        $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.$hexAddress$ = $JSSMS$Utils$toHex$$($defaultInstruction$$inline_295_opcodesArray$$inline_272$$.$address$);
        $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.$opcodes$.length && ($JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$ = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.$opcodes$.map($JSSMS$Utils$toHex$$).join(" ") + " ");
        $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.label = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.$hexAddress$ + " " + $JSCompiler_StaticMethods_disassemble$self$$inline_269_hexOpcodes$$inline_297_opcode$$inline_281$$ + $defaultInstruction$$inline_295_opcodesArray$$inline_272$$.$inst$;
        $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$ = $defaultInstruction$$inline_295_opcodesArray$$inline_272$$;
        $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$currentAddress$$inline_240_fractional$$inline_18$$] = $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$;
        $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$.$nextAddress$ != $JSCompiler_alias_NULL$$ && $addresses$$inline_242$$.push($instruction$$inline_239_opcode$$inline_271_options$$inline_294$$.$nextAddress$);
        $instruction$$inline_239_opcode$$inline_271_options$$inline_294$$.target != $JSCompiler_alias_NULL$$ && $addresses$$inline_242$$.push($instruction$$inline_239_opcode$$inline_271_options$$inline_294$$.target)
      }
    }
  }
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[0].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[56].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;
  for($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[102].$isJumpTarget$ = $JSCompiler_alias_TRUE$$;$i$$inline_241$$ < $JSCompiler_StaticMethods_init$self$$inline_233_mode$$inline_14_romSize$$inline_238_v$$inline_17$$;$i$$inline_241$$++) {
    $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$] && ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].$nextAddress$ != $JSCompiler_alias_NULL$$ && $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].$nextAddress$] && 
    $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].$nextAddress$].$jumpTargetNb$++, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].target != $JSCompiler_alias_NULL$$ && ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].target] ? 
    ($JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].target].$isJumpTarget$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].target].$jumpTargetNb$++) : 
    console.log("Invalid target address", $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$u$[$i$$inline_241$$].target)))
  }
  console.timeEnd("Instructions parsing");
  $JSCompiler_StaticMethods_resetDebug$self$$inline_20_clockSpeedHz$$inline_15_i$$inline_16_i$$inline_235$$.$z$.$b$.updateStatus("Instructions parsed");
  clearInterval(this.$g$)
}, $JSSMS_prototype$start$:function $$JSSMS$$$$$JSSMS_prototype$start$$() {
  var $self$$1$$ = this;
  this.$isRunning$ || (this.$isRunning$ = $JSCompiler_alias_TRUE$$, this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen), this.$h$ = $JSSMS$Utils$getTimestamp$$(), this.$fpsFrameCount$ = 0, this.$g$ = setInterval(function() {
    var $now$$inline_25$$ = $JSSMS$Utils$getTimestamp$$();
    $self$$1$$.$b$.updateStatus("Running: " + ($self$$1$$.$fpsFrameCount$ / (($now$$inline_25$$ - $self$$1$$.$h$) / 1E3)).toFixed(2) + " FPS");
    $self$$1$$.$fpsFrameCount$ = 0;
    $self$$1$$.$h$ = $now$$inline_25$$
  }, 500));
  this.$b$.updateStatus("Running")
}, $JSSMS_prototype$stop$:function $$JSSMS$$$$$JSSMS_prototype$stop$$() {
  clearInterval(this.$g$);
  this.$isRunning$ = $JSCompiler_alias_FALSE$$
}, $JSSMS_prototype$frame$:function $$JSSMS$$$$$JSSMS_prototype$frame$$() {
  if(this.$isRunning$) {
    var $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$ = this.$a$;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$lineno$ = 0;
    $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$n$ += $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$z$.$cyclesPerLine$;
    for($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$A$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$);;) {
      var $JSCompiler_StaticMethods_interpret$self$$inline_244$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$, $location$$inline_245$$ = 0, $temp$$inline_246$$ = 0, $opcode$$inline_247$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
      $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$H$ = $JSCompiler_alias_FALSE$$;
      $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$n$ -= $OP_STATES$$[$opcode$$inline_247$$];
      switch($opcode$$inline_247$$) {
        case 1:
          var $JSCompiler_StaticMethods_setBC$self$$inline_432$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $value$$inline_433$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          $JSCompiler_StaticMethods_setBC$self$$inline_432$$.$g$ = $value$$inline_433$$ >> 8;
          $JSCompiler_StaticMethods_setBC$self$$inline_432$$.$f$ = $value$$inline_433$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++;
          break;
        case 2:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 3:
          var $JSCompiler_StaticMethods_incBC$self$$inline_299$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$;
          $JSCompiler_StaticMethods_incBC$self$$inline_299$$.$f$ = $JSCompiler_StaticMethods_incBC$self$$inline_299$$.$f$ + 1 & 255;
          0 == $JSCompiler_StaticMethods_incBC$self$$inline_299$$.$f$ && ($JSCompiler_StaticMethods_incBC$self$$inline_299$$.$g$ = $JSCompiler_StaticMethods_incBC$self$$inline_299$$.$g$ + 1 & 255);
          break;
        case 4:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 5:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 6:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 7:
          var $JSCompiler_StaticMethods_rlca_a$self$$inline_301$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $carry$$inline_302$$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_301$$.$a$ >> 7;
          $JSCompiler_StaticMethods_rlca_a$self$$inline_301$$.$a$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_301$$.$a$ << 1 & 255 | $carry$$inline_302$$;
          $JSCompiler_StaticMethods_rlca_a$self$$inline_301$$.$b$ = $JSCompiler_StaticMethods_rlca_a$self$$inline_301$$.$b$ & 236 | $carry$$inline_302$$;
          break;
        case 8:
          var $JSCompiler_StaticMethods_exAF$self$$inline_304$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $temp$$inline_305$$ = $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$a$;
          $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$a$ = $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$P$;
          $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$P$ = $temp$$inline_305$$;
          $temp$$inline_305$$ = $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$b$;
          $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$b$ = $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$U$;
          $JSCompiler_StaticMethods_exAF$self$$inline_304$$.$U$ = $temp$$inline_305$$;
          break;
        case 9:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 10:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 11:
          $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 12:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 13:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 14:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 15:
          var $JSCompiler_StaticMethods_rrca_a$self$$inline_307$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $carry$$inline_308$$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_307$$.$a$ & 1;
          $JSCompiler_StaticMethods_rrca_a$self$$inline_307$$.$a$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_307$$.$a$ >> 1 | $carry$$inline_308$$ << 7;
          $JSCompiler_StaticMethods_rrca_a$self$$inline_307$$.$b$ = $JSCompiler_StaticMethods_rrca_a$self$$inline_307$$.$b$ & 236 | $carry$$inline_308$$;
          break;
        case 16:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ - 1 & 255;
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 17:
          var $JSCompiler_StaticMethods_setDE$self$$inline_435$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $value$$inline_436$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          $JSCompiler_StaticMethods_setDE$self$$inline_435$$.$j$ = $value$$inline_436$$ >> 8;
          $JSCompiler_StaticMethods_setDE$self$$inline_435$$.$h$ = $value$$inline_436$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++;
          break;
        case 18:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 19:
          $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 20:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 21:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 22:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 23:
          var $JSCompiler_StaticMethods_rla_a$self$$inline_310$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $carry$$inline_311$$ = $JSCompiler_StaticMethods_rla_a$self$$inline_310$$.$a$ >> 7;
          $JSCompiler_StaticMethods_rla_a$self$$inline_310$$.$a$ = ($JSCompiler_StaticMethods_rla_a$self$$inline_310$$.$a$ << 1 | $JSCompiler_StaticMethods_rla_a$self$$inline_310$$.$b$ & 1) & 255;
          $JSCompiler_StaticMethods_rla_a$self$$inline_310$$.$b$ = $JSCompiler_StaticMethods_rla_a$self$$inline_310$$.$b$ & 236 | $carry$$inline_311$$;
          break;
        case 24:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$) + 1);
          break;
        case 25:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 26:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 27:
          $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 28:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 29:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 30:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 31:
          var $JSCompiler_StaticMethods_rra_a$self$$inline_313$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $carry$$inline_314$$ = $JSCompiler_StaticMethods_rra_a$self$$inline_313$$.$a$ & 1;
          $JSCompiler_StaticMethods_rra_a$self$$inline_313$$.$a$ = ($JSCompiler_StaticMethods_rra_a$self$$inline_313$$.$a$ >> 1 | ($JSCompiler_StaticMethods_rra_a$self$$inline_313$$.$b$ & 1) << 7) & 255;
          $JSCompiler_StaticMethods_rra_a$self$$inline_313$$.$b$ = $JSCompiler_StaticMethods_rra_a$self$$inline_313$$.$b$ & 236 | $carry$$inline_314$$;
          break;
        case 32:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 33:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++;
          break;
        case 34:
          $location$$inline_245$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($location$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$(++$location$$inline_245$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ += 2;
          break;
        case 35:
          $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 36:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 37:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 38:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 39:
          var $JSCompiler_StaticMethods_daa$self$$inline_316$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $temp$$inline_317$$ = $JSCompiler_StaticMethods_daa$self$$inline_316$$.$X$[$JSCompiler_StaticMethods_daa$self$$inline_316$$.$a$ | ($JSCompiler_StaticMethods_daa$self$$inline_316$$.$b$ & 1) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_316$$.$b$ & 2) << 8 | ($JSCompiler_StaticMethods_daa$self$$inline_316$$.$b$ & 16) << 6];
          $JSCompiler_StaticMethods_daa$self$$inline_316$$.$a$ = $temp$$inline_317$$ & 255;
          $JSCompiler_StaticMethods_daa$self$$inline_316$$.$b$ = $JSCompiler_StaticMethods_daa$self$$inline_316$$.$b$ & 2 | $temp$$inline_317$$ >> 8;
          break;
        case 40:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 41:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 42:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$)));
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ += 2;
          break;
        case 43:
          $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 44:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 45:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 46:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 47:
          var $JSCompiler_StaticMethods_cpl_a$self$$inline_319$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$;
          $JSCompiler_StaticMethods_cpl_a$self$$inline_319$$.$a$ ^= 255;
          $JSCompiler_StaticMethods_cpl_a$self$$inline_319$$.$b$ |= 18;
          break;
        case 48:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 49:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ += 2;
          break;
        case 50:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ += 2;
          break;
        case 51:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$++;
          break;
        case 52:
          $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 53:
          $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 54:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 55:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ |= 1;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ &= -3;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ &= -17;
          break;
        case 56:
          $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 57:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$));
          break;
        case 58:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$));
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ += 2;
          break;
        case 59:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$--;
          break;
        case 60:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 61:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 62:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          break;
        case 63:
          var $JSCompiler_StaticMethods_ccf$self$$inline_321$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$;
          0 != ($JSCompiler_StaticMethods_ccf$self$$inline_321$$.$b$ & 1) ? ($JSCompiler_StaticMethods_ccf$self$$inline_321$$.$b$ &= -2, $JSCompiler_StaticMethods_ccf$self$$inline_321$$.$b$ |= 16) : ($JSCompiler_StaticMethods_ccf$self$$inline_321$$.$b$ |= 1, $JSCompiler_StaticMethods_ccf$self$$inline_321$$.$b$ &= -17);
          $JSCompiler_StaticMethods_ccf$self$$inline_321$$.$b$ &= -3;
          break;
        case 65:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$;
          break;
        case 66:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          break;
        case 67:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          break;
        case 68:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          break;
        case 69:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          break;
        case 70:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 71:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$;
          break;
        case 72:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$;
          break;
        case 74:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          break;
        case 75:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          break;
        case 76:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          break;
        case 77:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          break;
        case 78:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 79:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$;
          break;
        case 80:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$;
          break;
        case 81:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$;
          break;
        case 83:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          break;
        case 84:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          break;
        case 85:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          break;
        case 86:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 87:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$;
          break;
        case 88:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$;
          break;
        case 89:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$;
          break;
        case 90:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          break;
        case 92:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          break;
        case 93:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          break;
        case 94:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 95:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$;
          break;
        case 96:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$;
          break;
        case 97:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$;
          break;
        case 98:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          break;
        case 99:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          break;
        case 101:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          break;
        case 102:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 103:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$;
          break;
        case 104:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$;
          break;
        case 105:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$;
          break;
        case 106:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          break;
        case 107:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          break;
        case 108:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          break;
        case 110:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 111:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$;
          break;
        case 112:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 113:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 114:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 115:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 116:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 117:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 118:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$n$ = 0;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$G$ = $JSCompiler_alias_TRUE$$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$--;
          break;
        case 119:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 120:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$;
          break;
        case 121:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$;
          break;
        case 122:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          break;
        case 123:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          break;
        case 124:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          break;
        case 125:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          break;
        case 126:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$));
          break;
        case 128:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 129:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 130:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 131:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 132:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 133:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 134:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 135:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 136:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 137:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 138:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 139:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 140:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 141:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 142:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 143:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 144:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 145:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 146:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 147:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 148:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 149:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 150:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 151:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 152:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 153:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 154:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 155:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 156:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 157:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 158:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 159:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 160:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$] | 16;
          break;
        case 161:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$] | 16;
          break;
        case 162:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$] | 16;
          break;
        case 163:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$] | 16;
          break;
        case 164:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$] | 16;
          break;
        case 165:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$] | 16;
          break;
        case 166:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$))] | 16;
          break;
        case 167:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$] | 16;
          break;
        case 168:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$];
          break;
        case 169:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$];
          break;
        case 170:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$];
          break;
        case 171:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$];
          break;
        case 172:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$];
          break;
        case 173:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$];
          break;
        case 174:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$))];
          break;
        case 175:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = 0];
          break;
        case 176:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$];
          break;
        case 177:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$];
          break;
        case 178:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$];
          break;
        case 179:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$];
          break;
        case 180:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$];
          break;
        case 181:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$];
          break;
        case 182:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$))];
          break;
        case 183:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$];
          break;
        case 184:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$);
          break;
        case 185:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 186:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$);
          break;
        case 187:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 188:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$);
          break;
        case 189:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 190:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$)));
          break;
        case 191:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 192:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 193:
          var $JSCompiler_StaticMethods_setBC$self$$inline_438$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $value$$inline_439$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$);
          $JSCompiler_StaticMethods_setBC$self$$inline_438$$.$g$ = $value$$inline_439$$ >> 8;
          $JSCompiler_StaticMethods_setBC$self$$inline_438$$.$f$ = $value$$inline_439$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ += 2;
          break;
        case 194:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 195:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          break;
        case 196:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 197:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$g$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$f$);
          break;
        case 198:
          $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 199:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 0;
          break;
        case 200:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 201:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ += 2;
          break;
        case 202:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 203:
          var $JSCompiler_StaticMethods_doCB$self$$inline_323$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $opcode$$inline_324$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++);
          $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$n$ -= $OP_CB_STATES$$[$opcode$$inline_324$$];
          switch($opcode$$inline_324$$) {
            case 0:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 1:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 2:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 3:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 4:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 5:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 6:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 7:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 8:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 9:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 10:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 11:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 12:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 13:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 14:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 15:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 16:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 17:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 18:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 19:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 20:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 21:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 22:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 23:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 24:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 25:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 26:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 27:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 28:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 29:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 30:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 31:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 32:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 33:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 34:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 35:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 36:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 37:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 38:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 39:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 40:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 41:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 42:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 43:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 44:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 45:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 46:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 47:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 48:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 49:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 50:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 51:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 52:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 53:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 54:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 55:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 56:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$);
              break;
            case 57:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$);
              break;
            case 58:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$);
              break;
            case 59:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$);
              break;
            case 60:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$);
              break;
            case 61:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$);
              break;
            case 62:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$))));
              break;
            case 63:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$);
              break;
            case 64:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 1);
              break;
            case 65:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 1);
              break;
            case 66:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 1);
              break;
            case 67:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 1);
              break;
            case 68:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 1);
              break;
            case 69:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 1);
              break;
            case 70:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 1);
              break;
            case 71:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 1);
              break;
            case 72:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 2);
              break;
            case 73:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 2);
              break;
            case 74:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 2);
              break;
            case 75:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 2);
              break;
            case 76:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 2);
              break;
            case 77:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 2);
              break;
            case 78:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 2);
              break;
            case 79:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 2);
              break;
            case 80:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 4);
              break;
            case 81:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 4);
              break;
            case 82:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 4);
              break;
            case 83:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 4);
              break;
            case 84:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 4);
              break;
            case 85:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 4);
              break;
            case 86:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 4);
              break;
            case 87:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 4);
              break;
            case 88:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 8);
              break;
            case 89:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 8);
              break;
            case 90:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 8);
              break;
            case 91:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 8);
              break;
            case 92:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 8);
              break;
            case 93:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 8);
              break;
            case 94:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 8);
              break;
            case 95:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 8);
              break;
            case 96:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 16);
              break;
            case 97:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 16);
              break;
            case 98:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 16);
              break;
            case 99:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 16);
              break;
            case 100:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 16);
              break;
            case 101:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 16);
              break;
            case 102:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 16);
              break;
            case 103:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 16);
              break;
            case 104:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 32);
              break;
            case 105:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 32);
              break;
            case 106:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 32);
              break;
            case 107:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 32);
              break;
            case 108:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 32);
              break;
            case 109:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 32);
              break;
            case 110:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 32);
              break;
            case 111:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 32);
              break;
            case 112:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 64);
              break;
            case 113:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 64);
              break;
            case 114:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 64);
              break;
            case 115:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 64);
              break;
            case 116:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 64);
              break;
            case 117:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 64);
              break;
            case 118:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 64);
              break;
            case 119:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 64);
              break;
            case 120:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ & 128);
              break;
            case 121:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ & 128);
              break;
            case 122:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ & 128);
              break;
            case 123:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ & 128);
              break;
            case 124:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ & 128);
              break;
            case 125:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ & 128);
              break;
            case 126:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & 128);
              break;
            case 127:
              $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$, $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ & 128);
              break;
            case 128:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -2;
              break;
            case 129:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -2;
              break;
            case 130:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -2;
              break;
            case 131:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -2;
              break;
            case 132:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -2;
              break;
            case 133:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -2;
              break;
            case 134:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -2);
              break;
            case 135:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -2;
              break;
            case 136:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -3;
              break;
            case 137:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -3;
              break;
            case 138:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -3;
              break;
            case 139:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -3;
              break;
            case 140:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -3;
              break;
            case 141:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -3;
              break;
            case 142:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -3);
              break;
            case 143:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -3;
              break;
            case 144:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -5;
              break;
            case 145:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -5;
              break;
            case 146:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -5;
              break;
            case 147:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -5;
              break;
            case 148:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -5;
              break;
            case 149:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -5;
              break;
            case 150:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -5);
              break;
            case 151:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -5;
              break;
            case 152:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -9;
              break;
            case 153:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -9;
              break;
            case 154:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -9;
              break;
            case 155:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -9;
              break;
            case 156:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -9;
              break;
            case 157:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -9;
              break;
            case 158:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -9);
              break;
            case 159:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -9;
              break;
            case 160:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -17;
              break;
            case 161:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -17;
              break;
            case 162:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -17;
              break;
            case 163:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -17;
              break;
            case 164:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -17;
              break;
            case 165:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -17;
              break;
            case 166:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -17);
              break;
            case 167:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -17;
              break;
            case 168:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -33;
              break;
            case 169:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -33;
              break;
            case 170:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -33;
              break;
            case 171:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -33;
              break;
            case 172:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -33;
              break;
            case 173:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -33;
              break;
            case 174:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -33);
              break;
            case 175:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -33;
              break;
            case 176:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -65;
              break;
            case 177:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -65;
              break;
            case 178:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -65;
              break;
            case 179:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -65;
              break;
            case 180:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -65;
              break;
            case 181:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -65;
              break;
            case 182:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -65);
              break;
            case 183:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -65;
              break;
            case 184:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ &= -129;
              break;
            case 185:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ &= -129;
              break;
            case 186:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ &= -129;
              break;
            case 187:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ &= -129;
              break;
            case 188:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ &= -129;
              break;
            case 189:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ &= -129;
              break;
            case 190:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) & -129);
              break;
            case 191:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ &= -129;
              break;
            case 192:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 1;
              break;
            case 193:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 1;
              break;
            case 194:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 1;
              break;
            case 195:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 1;
              break;
            case 196:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 1;
              break;
            case 197:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 1;
              break;
            case 198:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 1);
              break;
            case 199:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 1;
              break;
            case 200:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 2;
              break;
            case 201:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 2;
              break;
            case 202:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 2;
              break;
            case 203:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 2;
              break;
            case 204:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 2;
              break;
            case 205:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 2;
              break;
            case 206:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 2);
              break;
            case 207:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 2;
              break;
            case 208:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 4;
              break;
            case 209:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 4;
              break;
            case 210:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 4;
              break;
            case 211:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 4;
              break;
            case 212:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 4;
              break;
            case 213:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 4;
              break;
            case 214:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 4);
              break;
            case 215:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 4;
              break;
            case 216:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 8;
              break;
            case 217:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 8;
              break;
            case 218:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 8;
              break;
            case 219:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 8;
              break;
            case 220:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 8;
              break;
            case 221:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 8;
              break;
            case 222:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 8);
              break;
            case 223:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 8;
              break;
            case 224:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 16;
              break;
            case 225:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 16;
              break;
            case 226:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 16;
              break;
            case 227:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 16;
              break;
            case 228:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 16;
              break;
            case 229:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 16;
              break;
            case 230:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 16);
              break;
            case 231:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 16;
              break;
            case 232:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 32;
              break;
            case 233:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 32;
              break;
            case 234:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 32;
              break;
            case 235:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 32;
              break;
            case 236:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 32;
              break;
            case 237:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 32;
              break;
            case 238:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 32);
              break;
            case 239:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 32;
              break;
            case 240:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 64;
              break;
            case 241:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 64;
              break;
            case 242:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 64;
              break;
            case 243:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 64;
              break;
            case 244:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 64;
              break;
            case 245:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 64;
              break;
            case 246:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 64);
              break;
            case 247:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 64;
              break;
            case 248:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$g$ |= 128;
              break;
            case 249:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$f$ |= 128;
              break;
            case 250:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$j$ |= 128;
              break;
            case 251:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$h$ |= 128;
              break;
            case 252:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$k$ |= 128;
              break;
            case 253:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$i$ |= 128;
              break;
            case 254:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$), $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doCB$self$$inline_323$$)) | 128);
              break;
            case 255:
              $JSCompiler_StaticMethods_doCB$self$$inline_323$$.$a$ |= 128;
              break;
            default:
              console.log("Unimplemented CB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_324$$))
          }
          break;
        case 204:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 64));
          break;
        case 205:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ + 2);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          break;
        case 206:
          $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 207:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 8;
          break;
        case 208:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 209:
          var $JSCompiler_StaticMethods_setDE$self$$inline_441$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $value$$inline_442$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$);
          $JSCompiler_StaticMethods_setDE$self$$inline_441$$.$j$ = $value$$inline_442$$ >> 8;
          $JSCompiler_StaticMethods_setDE$self$$inline_441$$.$h$ = $value$$inline_442$$ & 255;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ += 2;
          break;
        case 210:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 211:
          $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$);
          break;
        case 212:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 213:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$);
          break;
        case 214:
          $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 215:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 16;
          break;
        case 216:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 217:
          var $JSCompiler_StaticMethods_exBC$self$$inline_326$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $temp$$inline_327$$ = $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$g$;
          $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$g$ = $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$Q$;
          $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$Q$ = $temp$$inline_327$$;
          $temp$$inline_327$$ = $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$f$;
          $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$f$ = $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$R$;
          $JSCompiler_StaticMethods_exBC$self$$inline_326$$.$R$ = $temp$$inline_327$$;
          var $JSCompiler_StaticMethods_exDE$self$$inline_329$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $temp$$inline_330$$ = $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$j$;
          $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$j$ = $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$S$;
          $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$S$ = $temp$$inline_330$$;
          $temp$$inline_330$$ = $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$h$;
          $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$h$ = $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$T$;
          $JSCompiler_StaticMethods_exDE$self$$inline_329$$.$T$ = $temp$$inline_330$$;
          var $JSCompiler_StaticMethods_exHL$self$$inline_332$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $temp$$inline_333$$ = $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$k$;
          $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$k$ = $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$V$;
          $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$V$ = $temp$$inline_333$$;
          $temp$$inline_333$$ = $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$i$;
          $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$i$ = $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$W$;
          $JSCompiler_StaticMethods_exHL$self$$inline_332$$.$W$ = $temp$$inline_333$$;
          break;
        case 218:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 219:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$t$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 220:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 1));
          break;
        case 221:
          var $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $opcode$$inline_336$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++), $location$$inline_337$$ = 0, $temp$$inline_338$$ = 0;
          $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$n$ -= $OP_DD_STATES$$[$opcode$$inline_336$$];
          switch($opcode$$inline_336$$) {
            case 9:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              break;
            case 25:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              break;
            case 33:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$ += 2;
              break;
            case 34:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($location$$inline_337$$++, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($location$$inline_337$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$ += 2;
              break;
            case 35:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ + 1 & 255;
              0 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ + 1 & 255);
              break;
            case 36:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 37:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 38:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++);
              break;
            case 41:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              break;
            case 42:
              $location$$inline_337$$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($location$$inline_337$$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$(++$location$$inline_337$$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$ += 2;
              break;
            case 43:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ - 1 & 255;
              255 == $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ && ($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ - 1 & 255);
              break;
            case 44:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 45:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 46:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++);
              break;
            case 52:
              $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 53:
              $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 54:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$(++$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 57:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$));
              break;
            case 68:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$;
              break;
            case 69:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$;
              break;
            case 70:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 76:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$;
              break;
            case 77:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$;
              break;
            case 78:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 84:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$;
              break;
            case 85:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$;
              break;
            case 86:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 92:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$;
              break;
            case 93:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$;
              break;
            case 94:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 96:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$g$;
              break;
            case 97:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$f$;
              break;
            case 98:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$j$;
              break;
            case 99:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$h$;
              break;
            case 100:
              break;
            case 101:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$;
              break;
            case 102:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 103:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$;
              break;
            case 104:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$g$;
              break;
            case 105:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$f$;
              break;
            case 106:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$j$;
              break;
            case 107:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$h$;
              break;
            case 108:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$;
              break;
            case 109:
              break;
            case 110:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 111:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$;
              break;
            case 112:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$g$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 113:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$f$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 114:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$j$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 115:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$h$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 116:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$k$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 117:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$i$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 119:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 124:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$;
              break;
            case 125:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$;
              break;
            case 126:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 132:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 133:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 134:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 140:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 141:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 142:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 148:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 149:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 150:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 156:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 157:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 158:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 164:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$] | 16;
              break;
            case 165:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$] | 16;
              break;
            case 166:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$))] | 16;
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 172:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$];
              break;
            case 173:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$];
              break;
            case 174:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$))];
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 180:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$];
              break;
            case 181:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$];
              break;
            case 182:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$l$[$JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$))];
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 188:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$);
              break;
            case 189:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 190:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$d$($JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$)));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$++;
              break;
            case 203:
              $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$));
              break;
            case 225:
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$ += 2;
              break;
            case 227:
              $temp$$inline_338$$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$);
              $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$o$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$, $temp$$inline_338$$ & 255);
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$e$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$ + 1, $temp$$inline_338$$ >> 8);
              break;
            case 229:
              $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$r$, $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$p$);
              break;
            case 233:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$);
              break;
            case 249:
              $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$m$ = $JSCompiler_StaticMethods_getIX$$($JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$);
              break;
            default:
              console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_336$$)), $JSCompiler_StaticMethods_doIndexOpIX$self$$inline_335$$.$c$--
          }
          break;
        case 222:
          $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 223:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 24;
          break;
        case 224:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 4));
          break;
        case 225:
          $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$o$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$));
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ += 2;
          break;
        case 226:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 4));
          break;
        case 227:
          $temp$$inline_246$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ + 1);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ + 1, $temp$$inline_246$$);
          $temp$$inline_246$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$e$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$, $temp$$inline_246$$);
          break;
        case 228:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 4));
          break;
        case 229:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$);
          break;
        case 230:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ &= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++)] | 16;
          break;
        case 231:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 32;
          break;
        case 232:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 4));
          break;
        case 233:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 234:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 4));
          break;
        case 235:
          $temp$$inline_246$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$j$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$k$ = $temp$$inline_246$$;
          $temp$$inline_246$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$h$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$i$ = $temp$$inline_246$$;
          break;
        case 236:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 4));
          break;
        case 237:
          var $JSCompiler_StaticMethods_doED$self$$inline_340$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $opcode$$inline_341$$ = $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$), $temp$$inline_342$$ = 0, $location$$inline_343$$ = 0;
          $JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= $OP_ED_STATES$$[$opcode$$inline_341$$];
          switch($opcode$$inline_341$$) {
            case 64:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 65:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 66:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 67:
              $location$$inline_343$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$++, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
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
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ = 0;
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
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
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$ += 2;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$B$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$C$;
              break;
            case 70:
            ;
            case 78:
            ;
            case 102:
            ;
            case 110:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$I$ = 0;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 71:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$M$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 72:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 73:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 74:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 75:
              var $JSCompiler_StaticMethods_setBC$self$$inline_444$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$, $value$$inline_445$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1));
              $JSCompiler_StaticMethods_setBC$self$$inline_444$$.$g$ = $value$$inline_445$$ >> 8;
              $JSCompiler_StaticMethods_setBC$self$$inline_444$$.$f$ = $value$$inline_445$$ & 255;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 79:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 80:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$j$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$j$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 81:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$j$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 82:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 83:
              $location$$inline_343$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$++, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$h$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$j$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 86:
            ;
            case 118:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$I$ = 1;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 87:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$M$;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$O$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$C$ ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 88:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$h$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$h$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 89:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$h$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 90:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 91:
              var $JSCompiler_StaticMethods_setDE$self$$inline_447$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$, $value$$inline_448$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1));
              $JSCompiler_StaticMethods_setDE$self$$inline_447$$.$j$ = $value$$inline_448$$ >> 8;
              $JSCompiler_StaticMethods_setDE$self$$inline_447$$.$h$ = $value$$inline_448$$ & 255;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 95:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ = Math.round(255 * Math.random());
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$O$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$] | ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$C$ ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 96:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$k$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$k$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 97:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$k$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 98:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 99:
              $location$$inline_343$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$++, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$k$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 103:
              $location$$inline_343$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($location$$inline_343$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$, $temp$$inline_342$$ >> 4 | ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ & 15) << 4);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ & 240 | $temp$$inline_342$$ & 15;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 104:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 105:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 106:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 107:
              $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1)));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 111:
              $location$$inline_343$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($location$$inline_343$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$, ($temp$$inline_342$$ & 15) << 4 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ & 15);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ & 240 | $temp$$inline_342$$ >> 4;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 113:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, 0);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 114:
              $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 115:
              $location$$inline_343$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$++, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$ & 255);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($location$$inline_343$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$ >> 8);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 120:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | $JSCompiler_StaticMethods_doED$self$$inline_340$$.$l$[$JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$];
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 121:
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$a$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 122:
              $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 123:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$m$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$o$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ + 1));
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$ += 3;
              break;
            case 160:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 161:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $temp$$inline_342$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? 0 : 4;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 248 | $temp$$inline_342$$;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 162:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 128 == ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 163:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $temp$$inline_342$$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              255 < $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$ + $temp$$inline_342$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 128 == ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 168:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 193 | (0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? 4 : 0);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 169:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $temp$$inline_342$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? 0 : 4;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 248 | $temp$$inline_342$$;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 170:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 0 != ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 171:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $temp$$inline_342$$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              255 < $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$ + $temp$$inline_342$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 128 == ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              break;
            case 176:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_incDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -3;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -17;
              break;
            case 177:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $temp$$inline_342$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? 0 : 4;
              0 != ($temp$$inline_342$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 248 | $temp$$inline_342$$;
              break;
            case 178:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 128 == ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              break;
            case 179:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_incHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              255 < $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$ + $temp$$inline_342$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 0 != ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              break;
            case 184:
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_decDE$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              0 != $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 4, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -3;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -17;
              break;
            case 185:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 1 | 2;
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$)));
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $JSCompiler_StaticMethods_decBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              $temp$$inline_342$$ |= 0 == $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doED$self$$inline_340$$) ? 0 : 4;
              0 != ($temp$$inline_342$$ & 4) && 0 == ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 64) ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & 248 | $temp$$inline_342$$;
              break;
            case 186:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$e$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$), $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 0 != ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              break;
            case 187:
              $temp$$inline_342$$ = $JSCompiler_StaticMethods_doED$self$$inline_340$$.$d$($JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$));
              $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_doED$self$$inline_340$$.$t$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$f$, $temp$$inline_342$$);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doED$self$$inline_340$$, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$);
              $JSCompiler_StaticMethods_decHL$$($JSCompiler_StaticMethods_doED$self$$inline_340$$);
              0 != $JSCompiler_StaticMethods_doED$self$$inline_340$$.$g$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$n$ -= 5, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$--) : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++;
              255 < $JSCompiler_StaticMethods_doED$self$$inline_340$$.$i$ + $temp$$inline_342$$ ? ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 1, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ |= 16) : ($JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -2, $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ &= -17);
              $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ = 0 != ($temp$$inline_342$$ & 128) ? $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ | 2 : $JSCompiler_StaticMethods_doED$self$$inline_340$$.$b$ & -3;
              break;
            default:
              console.log("Unimplemented ED Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_341$$)), $JSCompiler_StaticMethods_doED$self$$inline_340$$.$c$++
          }
          break;
        case 238:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ ^= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++)];
          break;
        case 239:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 40;
          break;
        case 240:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 128));
          break;
        case 241:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$++);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$++);
          break;
        case 242:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 128));
          break;
        case 243:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$B$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$C$ = $JSCompiler_alias_FALSE$$;
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$H$ = $JSCompiler_alias_TRUE$$;
          break;
        case 244:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 == ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 128));
          break;
        case 245:
          $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$);
          break;
        case 246:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$l$[$JSCompiler_StaticMethods_interpret$self$$inline_244$$.$a$ |= $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++)];
          break;
        case 247:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$);
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 48;
          break;
        case 248:
          $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 128));
          break;
        case 249:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$m$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$);
          break;
        case 250:
          $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, 0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 128));
          break;
        case 251:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$B$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$C$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$H$ = $JSCompiler_alias_TRUE$$;
          break;
        case 252:
          $JSCompiler_StaticMethods_interpret$self$$inline_244$$.call(0 != ($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$b$ & 128));
          break;
        case 253:
          var $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$, $opcode$$inline_346$$ = $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++), $location$$inline_347$$ = $JSCompiler_alias_VOID$$, $temp$$inline_348$$ = $JSCompiler_alias_VOID$$;
          $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$n$ -= $OP_DD_STATES$$[$opcode$$inline_346$$];
          switch($opcode$$inline_346$$) {
            case 9:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_getBC$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              break;
            case 25:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_getDE$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              break;
            case 33:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$ += 2;
              break;
            case 34:
              $location$$inline_347$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($location$$inline_347$$++, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($location$$inline_347$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$ += 2;
              break;
            case 35:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ + 1 & 255;
              0 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ + 1 & 255);
              break;
            case 36:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 37:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 38:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++);
              break;
            case 41:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              break;
            case 42:
              $location$$inline_347$$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($location$$inline_347$$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$(++$location$$inline_347$$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$ += 2;
              break;
            case 43:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ - 1 & 255;
              255 == $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ && ($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ - 1 & 255);
              break;
            case 44:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 45:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 46:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++);
              break;
            case 52:
              $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 53:
              $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 54:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$(++$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 57:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$));
              break;
            case 68:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$;
              break;
            case 69:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$;
              break;
            case 70:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$g$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 76:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$;
              break;
            case 77:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$;
              break;
            case 78:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$f$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 84:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$;
              break;
            case 85:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$;
              break;
            case 86:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$j$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 92:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$;
              break;
            case 93:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$;
              break;
            case 94:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$h$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 96:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$g$;
              break;
            case 97:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$f$;
              break;
            case 98:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$j$;
              break;
            case 99:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$h$;
              break;
            case 100:
              break;
            case 101:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$;
              break;
            case 102:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$k$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 103:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$;
              break;
            case 104:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$g$;
              break;
            case 105:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$f$;
              break;
            case 106:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$j$;
              break;
            case 107:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$h$;
              break;
            case 108:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$;
              break;
            case 109:
              break;
            case 110:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$i$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 111:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$;
              break;
            case 112:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$g$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 113:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$f$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 114:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$j$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 115:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$h$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 116:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$k$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 117:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$i$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 119:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 124:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$;
              break;
            case 125:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$;
              break;
            case 126:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 132:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 133:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 134:
              $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 140:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 141:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 142:
              $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 148:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 149:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 150:
              $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 156:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 157:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 158:
              $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 164:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$] | 16;
              break;
            case 165:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$] | 16;
              break;
            case 166:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ &= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$))] | 16;
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 172:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$];
              break;
            case 173:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$];
              break;
            case 174:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ ^= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$))];
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 180:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$];
              break;
            case 181:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$];
              break;
            case 182:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$b$ = $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$l$[$JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$a$ |= $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$))];
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 188:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$);
              break;
            case 189:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 190:
              $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$d$($JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$) + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$)));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$++;
              break;
            case 203:
              $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$));
              break;
            case 225:
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$ += 2;
              break;
            case 227:
              $temp$$inline_348$$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$);
              $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$o$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$));
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$, $temp$$inline_348$$ & 255);
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$e$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$ + 1, $temp$$inline_348$$ >> 8);
              break;
            case 229:
              $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$s$, $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$q$);
              break;
            case 233:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$);
              break;
            case 249:
              $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$m$ = $JSCompiler_StaticMethods_getIY$$($JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$);
              break;
            default:
              console.log("Unimplemented DD/FD Opcode: " + $JSSMS$Utils$toHex$$($opcode$$inline_346$$)), $JSCompiler_StaticMethods_doIndexOpIY$self$$inline_345$$.$c$--
          }
          break;
        case 254:
          $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$d$($JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$++));
          break;
        case 255:
          $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interpret$self$$inline_244$$, $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$), $JSCompiler_StaticMethods_interpret$self$$inline_244$$.$c$ = 56
      }
      var $JSCompiler_temp$$229$$;
      if($JSCompiler_temp$$229$$ = 0 >= $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$.$n$) {
        var $JSCompiler_StaticMethods_eol$self$$inline_249$$ = $JSCompiler_StaticMethods_JSSMS_Z80_prototype$frame$self$$inline_27$$;
        if($JSCompiler_StaticMethods_eol$self$$inline_249$$.$z$.$soundEnabled$) {
          var $JSCompiler_StaticMethods_updateSound$self$$inline_350$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$z$, $line$$inline_351$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$;
          0 == $line$$inline_351$$ && ($JSCompiler_StaticMethods_updateSound$self$$inline_350$$.$audioBufferOffset$ = 0);
          for(var $samplesToGenerate$$inline_352$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_350$$.$samplesPerLine$[$line$$inline_351$$], $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_350$$.$d$, $offset$$inline_354$$ = $JSCompiler_StaticMethods_updateSound$self$$inline_350$$.$audioBufferOffset$, $buffer$$inline_355$$ = [], $sample$$inline_356$$ = 0, $i$$inline_357$$ = 0;$sample$$inline_356$$ < $samplesToGenerate$$inline_352$$;$sample$$inline_356$$++) {
            for($i$$inline_357$$ = 0;3 > $i$$inline_357$$;$i$$inline_357$$++) {
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$i$[$i$$inline_357$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$g$[$i$$inline_357$$] != $NO_ANTIALIAS$$ ? $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$b$[($i$$inline_357$$ << 1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$g$[$i$$inline_357$$] >> 8 : $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$b$[($i$$inline_357$$ << 
              1) + 1]] * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[$i$$inline_357$$]
            }
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$i$[3] = $PSG_VOLUME$$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$b$[7]] * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$f$ & 1) << 1;
            var $output$$inline_358$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$i$[0] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$i$[1] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$i$[2] + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$i$[3];
            127 < $output$$inline_358$$ ? $output$$inline_358$$ = 127 : -128 > $output$$inline_358$$ && ($output$$inline_358$$ = -128);
            $buffer$$inline_355$$[$offset$$inline_354$$ + $sample$$inline_356$$] = $output$$inline_358$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$e$ += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$j$;
            var $clockCycles$$inline_359$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$e$ >> 8, $clockCyclesScaled$$inline_360$$ = $clockCycles$$inline_359$$ << 8;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$e$ -= $clockCyclesScaled$$inline_360$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[0] -= $clockCycles$$inline_359$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[1] -= $clockCycles$$inline_359$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[2] -= $clockCycles$$inline_359$$;
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[3] = 128 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$h$ ? $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[2] : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[3] - $clockCycles$$inline_359$$;
            for($i$$inline_357$$ = 0;3 > $i$$inline_357$$;$i$$inline_357$$++) {
              var $counter$$inline_361$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[$i$$inline_357$$];
              if(0 >= $counter$$inline_361$$) {
                var $tone$$inline_362$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$b$[$i$$inline_357$$ << 1];
                6 < $tone$$inline_362$$ ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$g$[$i$$inline_357$$] = ($clockCyclesScaled$$inline_360$$ - $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$e$ + 512 * $counter$$inline_361$$ << 8) * $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[$i$$inline_357$$] / ($clockCyclesScaled$$inline_360$$ + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$e$), 
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[$i$$inline_357$$] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[$i$$inline_357$$]) : ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[$i$$inline_357$$] = 1, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$g$[$i$$inline_357$$] = $NO_ANTIALIAS$$);
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[$i$$inline_357$$] += $tone$$inline_362$$ * ($clockCycles$$inline_359$$ / $tone$$inline_362$$ + 1)
              }else {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$g$[$i$$inline_357$$] = $NO_ANTIALIAS$$
              }
            }
            if(0 >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[3] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[3] = -$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[3], 128 != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$h$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$a$[3] += $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$h$ * 
            ($clockCycles$$inline_359$$ / $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$h$ + 1)), 1 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$d$[3])) {
              var $feedback$$inline_363$$ = 0, $feedback$$inline_363$$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$b$[6] & 4) ? 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$f$ & 9) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$f$ & 9 ^ 9) ? 1 : 0 : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$f$ & 1;
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$f$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$update$self$$inline_353$$.$f$ >> 1 | $feedback$$inline_363$$ << 15
            }
          }
          $JSCompiler_StaticMethods_updateSound$self$$inline_350$$.$audioBuffer$ = $buffer$$inline_355$$;
          $JSCompiler_StaticMethods_updateSound$self$$inline_350$$.$audioBufferOffset$ += $samplesToGenerate$$inline_352$$
        }
        $JSCompiler_StaticMethods_eol$self$$inline_249$$.$N$.$l$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$;
        if(192 > $JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$) {
          var $JSCompiler_StaticMethods_drawLine$self$$inline_365$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$N$, $lineno$$inline_366$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$, $i$$inline_367$$ = 0, $temp$$inline_368$$ = 0, $temp2$$inline_369$$ = 0;
          if(!$JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$h$.$is_gg$ || !(24 > $lineno$$inline_366$$ || 168 <= $lineno$$inline_366$$)) {
            if(0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[1] & 64)) {
              if(-1 != $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$m$) {
                console.log("[" + $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$l$ + "] min dirty:" + $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$o$ + " max: " + $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$m$);
                for(var $i$$inline_370$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$o$;$i$$inline_370$$ <= $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$m$;$i$$inline_370$$++) {
                  if($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$v$[$i$$inline_370$$]) {
                    $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$v$[$i$$inline_370$$] = $JSCompiler_alias_FALSE$$;
                    console.log("tile " + $i$$inline_370$$ + " is dirty");
                    for(var $tile$$inline_371$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$t$[$i$$inline_370$$], $pixel_index$$inline_372$$ = 0, $address$$inline_373$$ = $i$$inline_370$$ << 5, $y$$inline_374$$ = 0;8 > $y$$inline_374$$;$y$$inline_374$$++) {
                      for(var $address0$$inline_375$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$address$$inline_373$$++], $address1$$inline_376$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$address$$inline_373$$++], $address2$$inline_377$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$address$$inline_373$$++], $address3$$inline_378$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$address$$inline_373$$++], $bit$$inline_379$$ = 128;0 != 
                      $bit$$inline_379$$;$bit$$inline_379$$ >>= 1) {
                        var $colour$$inline_380$$ = 0;
                        0 != ($address0$$inline_375$$ & $bit$$inline_379$$) && ($colour$$inline_380$$ |= 1);
                        0 != ($address1$$inline_376$$ & $bit$$inline_379$$) && ($colour$$inline_380$$ |= 2);
                        0 != ($address2$$inline_377$$ & $bit$$inline_379$$) && ($colour$$inline_380$$ |= 4);
                        0 != ($address3$$inline_378$$ & $bit$$inline_379$$) && ($colour$$inline_380$$ |= 8);
                        $tile$$inline_371$$[$pixel_index$$inline_372$$++] = $colour$$inline_380$$
                      }
                    }
                  }
                }
                $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$o$ = 512;
                $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$m$ = -1
              }
              var $pixX$$inline_381$$ = 0, $colour$$inline_382$$ = 0, $temp$$inline_383$$ = 0, $temp2$$inline_384$$ = 0, $hscroll$$inline_385$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[8], $vscroll$$inline_386$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[9];
              16 > $lineno$$inline_366$$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[0] & 64) && ($hscroll$$inline_385$$ = 0);
              var $lock$$inline_387$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[0] & 128, $tile_column$$inline_388$$ = 32 - ($hscroll$$inline_385$$ >> 3) + $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$s$, $tile_row$$inline_389$$ = $lineno$$inline_366$$ + $vscroll$$inline_386$$ >> 3;
              27 < $tile_row$$inline_389$$ && ($tile_row$$inline_389$$ -= 28);
              for(var $tile_y$$inline_390$$ = ($lineno$$inline_366$$ + ($vscroll$$inline_386$$ & 7) & 7) << 3, $row_precal$$inline_391$$ = $lineno$$inline_366$$ << 8, $tx$$inline_392$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$s$;$tx$$inline_392$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$u$;$tx$$inline_392$$++) {
                var $tile_props$$inline_393$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$D$ + (($tile_column$$inline_388$$ & 31) << 1) + ($tile_row$$inline_389$$ << 6), $secondbyte$$inline_394$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$tile_props$$inline_393$$ + 1], $pal$$inline_395$$ = ($secondbyte$$inline_394$$ & 8) << 1, $sx$$inline_396$$ = ($tx$$inline_392$$ << 3) + ($hscroll$$inline_385$$ & 7), $pixY$$inline_397$$ = 0 == ($secondbyte$$inline_394$$ & 4) ? $tile_y$$inline_390$$ : 
                56 - $tile_y$$inline_390$$, $tile$$inline_398$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$t$[($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$tile_props$$inline_393$$] & 255) + (($secondbyte$$inline_394$$ & 1) << 8)];
                if(0 == ($secondbyte$$inline_394$$ & 2)) {
                  for($pixX$$inline_381$$ = 0;8 > $pixX$$inline_381$$ && 256 > $sx$$inline_396$$;$pixX$$inline_381$$++, $sx$$inline_396$$++) {
                    $colour$$inline_382$$ = $tile$$inline_398$$[$pixX$$inline_381$$ + $pixY$$inline_397$$], $temp$$inline_383$$ = 4 * ($sx$$inline_396$$ + $row_precal$$inline_391$$), $temp2$$inline_384$$ = 3 * ($colour$$inline_382$$ + $pal$$inline_395$$), $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$p$[$sx$$inline_396$$] = 0 != ($secondbyte$$inline_394$$ & 16) && 0 != $colour$$inline_382$$, $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_383$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_384$$], 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_383$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_384$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_383$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_384$$ + 2]
                  }
                }else {
                  for($pixX$$inline_381$$ = 7;0 <= $pixX$$inline_381$$ && 256 > $sx$$inline_396$$;$pixX$$inline_381$$--, $sx$$inline_396$$++) {
                    $colour$$inline_382$$ = $tile$$inline_398$$[$pixX$$inline_381$$ + $pixY$$inline_397$$], $temp$$inline_383$$ = 4 * ($sx$$inline_396$$ + $row_precal$$inline_391$$), $temp2$$inline_384$$ = 3 * ($colour$$inline_382$$ + $pal$$inline_395$$), $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$p$[$sx$$inline_396$$] = 0 != ($secondbyte$$inline_394$$ & 16) && 0 != $colour$$inline_382$$, $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_383$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_384$$], 
                    $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_383$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_384$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_383$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_384$$ + 2]
                  }
                }
                $tile_column$$inline_388$$++;
                0 != $lock$$inline_387$$ && 23 == $tx$$inline_392$$ && ($tile_row$$inline_389$$ = $lineno$$inline_366$$ >> 3, $tile_y$$inline_390$$ = ($lineno$$inline_366$$ & 7) << 3)
              }
              if($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$k$) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$k$ = $JSCompiler_alias_FALSE$$;
                for(var $i$$inline_399$$ = 0;$i$$inline_399$$ < $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$n$.length;$i$$inline_399$$++) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$n$[$i$$inline_399$$][0] = 0
                }
                var $height$$inline_400$$ = 0 == ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[1] & 2) ? 8 : 16;
                1 == ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[1] & 1) && ($height$$inline_400$$ <<= 1);
                for(var $spriteno$$inline_401$$ = 0;64 > $spriteno$$inline_401$$;$spriteno$$inline_401$$++) {
                  var $y$$inline_402$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$g$ + $spriteno$$inline_401$$] & 255;
                  if(208 == $y$$inline_402$$) {
                    break
                  }
                  $y$$inline_402$$++;
                  240 < $y$$inline_402$$ && ($y$$inline_402$$ -= 256);
                  for(var $lineno$$inline_403$$ = $y$$inline_402$$;192 > $lineno$$inline_403$$;$lineno$$inline_403$$++) {
                    if($lineno$$inline_403$$ - $y$$inline_402$$ < $height$$inline_400$$) {
                      var $sprites$$inline_404$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$n$[$lineno$$inline_403$$];
                      if(!$sprites$$inline_404$$ || 8 <= $sprites$$inline_404$$[0]) {
                        break
                      }
                      var $off$$inline_405$$ = 3 * $sprites$$inline_404$$[0] + 1, $address$$inline_406$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$g$ + ($spriteno$$inline_401$$ << 1) + 128;
                      $sprites$$inline_404$$[$off$$inline_405$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$address$$inline_406$$++] & 255;
                      $sprites$$inline_404$$[$off$$inline_405$$++] = $y$$inline_402$$;
                      $sprites$$inline_404$$[$off$$inline_405$$++] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$d$[$address$$inline_406$$] & 255;
                      $sprites$$inline_404$$[0]++
                    }
                  }
                }
              }
              if(0 != $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$n$[$lineno$$inline_366$$][0]) {
                for(var $colour$$inline_407$$ = 0, $temp$$inline_408$$ = 0, $temp2$$inline_409$$ = 0, $i$$inline_410$$ = 0, $sprites$$inline_411$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$n$[$lineno$$inline_366$$], $count$$inline_412$$ = Math.min(8, $sprites$$inline_411$$[0]), $zoomed$$inline_413$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[1] & 1, $row_precal$$inline_414$$ = $lineno$$inline_366$$ << 8, $off$$inline_415$$ = 3 * $count$$inline_412$$;$i$$inline_410$$ < 
                $count$$inline_412$$;$i$$inline_410$$++) {
                  var $n$$inline_416$$ = $sprites$$inline_411$$[$off$$inline_415$$--] | ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[6] & 4) << 6, $y$$inline_417$$ = $sprites$$inline_411$$[$off$$inline_415$$--], $x$$inline_418$$ = $sprites$$inline_411$$[$off$$inline_415$$--] - ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[0] & 8), $tileRow$$inline_419$$ = $lineno$$inline_366$$ - $y$$inline_417$$ >> $zoomed$$inline_413$$;
                  0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[1] & 2) && ($n$$inline_416$$ &= -2);
                  var $tile$$inline_420$$ = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$t$[$n$$inline_416$$ + (($tileRow$$inline_419$$ & 8) >> 3)], $pix$$inline_421$$ = 0;
                  0 > $x$$inline_418$$ && ($pix$$inline_421$$ = -$x$$inline_418$$, $x$$inline_418$$ = 0);
                  var $offset$$inline_422$$ = $pix$$inline_421$$ + (($tileRow$$inline_419$$ & 7) << 3);
                  if(0 == $zoomed$$inline_413$$) {
                    for(;8 > $pix$$inline_421$$ && 256 > $x$$inline_418$$;$pix$$inline_421$$++, $x$$inline_418$$++) {
                      $colour$$inline_407$$ = $tile$$inline_420$$[$offset$$inline_422$$++], 0 != $colour$$inline_407$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$p$[$x$$inline_418$$] && ($temp$$inline_408$$ = 4 * ($x$$inline_418$$ + $row_precal$$inline_414$$), $temp2$$inline_409$$ = 3 * ($colour$$inline_407$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$ + 
                      1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$ + 2])
                    }
                  }else {
                    for(;8 > $pix$$inline_421$$ && 256 > $x$$inline_418$$;$pix$$inline_421$$++, $x$$inline_418$$ += 2) {
                      $colour$$inline_407$$ = $tile$$inline_420$$[$offset$$inline_422$$++], 0 != $colour$$inline_407$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$p$[$x$$inline_418$$] && ($temp$$inline_408$$ = 4 * ($x$$inline_418$$ + $row_precal$$inline_414$$), $temp2$$inline_409$$ = 3 * ($colour$$inline_407$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$ + 
                      1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$ + 2]), 0 != $colour$$inline_407$$ && !$JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$p$[$x$$inline_418$$ + 1] && ($temp$$inline_408$$ = 4 * ($x$$inline_418$$ + $row_precal$$inline_414$$ + 1), $temp2$$inline_409$$ = 3 * 
                      ($colour$$inline_407$$ + 16), $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_408$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_409$$ + 
                      2])
                    }
                  }
                }
                8 <= $sprites$$inline_411$$[0] && ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$f$ |= 64)
              }
              if($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$h$.$is_sms$ && 0 != ($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[0] & 32)) {
                $temp$$inline_368$$ = 4 * ($lineno$$inline_366$$ << 8);
                $temp2$$inline_369$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[7] & 15) + 16);
                for($i$$inline_367$$ = 0;8 > $i$$inline_367$$;$i$$inline_367$$++) {
                  $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_368$$ + $i$$inline_367$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_369$$], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_368$$ + $i$$inline_367$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_369$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$temp$$inline_368$$ + $i$$inline_367$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp2$$inline_369$$ + 
                  2]
                }
              }
            }else {
              for(var $row_precal$$inline_423$$ = $lineno$$inline_366$$ << 8, $length$$inline_424$$ = 4 * ($row_precal$$inline_423$$ + 1024), $temp$$inline_425$$ = 3 * (($JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$c$[7] & 15) + 16), $row_precal$$inline_423$$ = 4 * $row_precal$$inline_423$$;$row_precal$$inline_423$$ < $length$$inline_424$$;$row_precal$$inline_423$$ += 4) {
                $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$row_precal$$inline_423$$] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp$$inline_425$$], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$row_precal$$inline_423$$ + 1] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp$$inline_425$$ + 1], $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$b$[$row_precal$$inline_423$$ + 2] = $JSCompiler_StaticMethods_drawLine$self$$inline_365$$.$a$[$temp$$inline_425$$ + 
                2]
              }
            }
          }
        }
        var $JSCompiler_StaticMethods_interrupts$self$$inline_427$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$N$, $lineno$$inline_428$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$;
        192 >= $lineno$$inline_428$$ ? (0 == $JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$q$ ? ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$c$[10], $JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$f$ |= 4) : $JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$q$--, 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$f$ & 4) && 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$c$[0] & 
        16) && ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$h$.$a$.$A$ = $JSCompiler_alias_TRUE$$)) : ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$q$ = $JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$c$[10], 0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$f$ & 128) && (0 != ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$c$[1] & 32) && 224 > $lineno$$inline_428$$) && ($JSCompiler_StaticMethods_interrupts$self$$inline_427$$.$h$.$a$.$A$ = 
        $JSCompiler_alias_TRUE$$));
        $JSCompiler_StaticMethods_eol$self$$inline_249$$.$A$ && $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_eol$self$$inline_249$$);
        $JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$++;
        if($JSCompiler_StaticMethods_eol$self$$inline_249$$.$lineno$ >= $JSCompiler_StaticMethods_eol$self$$inline_249$$.$z$.$no_of_scanlines$) {
          var $JSCompiler_StaticMethods_eof$self$$inline_430$$ = $JSCompiler_StaticMethods_eol$self$$inline_249$$;
          $JSCompiler_StaticMethods_eof$self$$inline_430$$.$z$.$pause_button$ && ($JSCompiler_StaticMethods_eof$self$$inline_430$$.$C$ = $JSCompiler_StaticMethods_eof$self$$inline_430$$.$B$, $JSCompiler_StaticMethods_eof$self$$inline_430$$.$B$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_eof$self$$inline_430$$.$G$ && ($JSCompiler_StaticMethods_eof$self$$inline_430$$.$c$++, $JSCompiler_StaticMethods_eof$self$$inline_430$$.$G$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_eof$self$$inline_430$$, 
          $JSCompiler_StaticMethods_eof$self$$inline_430$$.$c$), $JSCompiler_StaticMethods_eof$self$$inline_430$$.$c$ = 102, $JSCompiler_StaticMethods_eof$self$$inline_430$$.$n$ -= 11, $JSCompiler_StaticMethods_eof$self$$inline_430$$.$z$.$pause_button$ = $JSCompiler_alias_FALSE$$);
          $JSCompiler_temp$$229$$ = $JSCompiler_alias_TRUE$$
        }else {
          $JSCompiler_StaticMethods_eol$self$$inline_249$$.$n$ += $JSCompiler_StaticMethods_eol$self$$inline_249$$.$z$.$cyclesPerLine$, $JSCompiler_temp$$229$$ = $JSCompiler_alias_FALSE$$
        }
      }
      if($JSCompiler_temp$$229$$) {
        break
      }
    }
    this.$fpsFrameCount$++;
    this.$b$.requestAnimationFrame(this.$JSSMS_prototype$frame$.bind(this), this.$b$.screen)
  }
}, $readRomDirectly$:function $$JSSMS$$$$$readRomDirectly$$($data$$21$$, $fileName$$) {
  var $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = ".gg" == $fileName$$.substr(-3).toLowerCase() ? 2 : 1, $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ = $data$$21$$.length;
  1 == $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ ? (this.$is_sms$ = $JSCompiler_alias_TRUE$$, this.$is_gg$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 0, this.$c$.$u$ = 32) : 2 == $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ && (this.$is_gg$ = $JSCompiler_alias_TRUE$$, this.$is_sms$ = $JSCompiler_alias_FALSE$$, this.$c$.$s$ = 5, this.$c$.$u$ = 27);
  if(16384 >= $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = $data$$21$$;
  0 != $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ % 1024 && ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.substr(512), $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ -= 512);
  var $i$$inline_35$$, $j$$inline_36$$, $number_of_pages$$inline_37$$ = Math.round($i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ / 16384), $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ = Array($number_of_pages$$inline_37$$);
  for($i$$inline_35$$ = 0;$i$$inline_35$$ < $number_of_pages$$inline_37$$;$i$$inline_35$$++) {
    if($i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$[$i$$inline_35$$] = $JSSMS$Utils$Array$$(16384), $SUPPORT_DATAVIEW$$) {
      for($j$$inline_36$$ = 0;16384 > $j$$inline_36$$;$j$$inline_36$$++) {
        $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$[$i$$inline_35$$].setUint8($j$$inline_36$$, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.charCodeAt(16384 * $i$$inline_35$$ + $j$$inline_36$$))
      }
    }else {
      for($j$$inline_36$$ = 0;16384 > $j$$inline_36$$;$j$$inline_36$$++) {
        $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$[$i$$inline_35$$][$j$$inline_36$$] = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.charCodeAt(16384 * $i$$inline_35$$ + $j$$inline_36$$) & 255
      }
    }
  }
  if($i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ == $JSCompiler_alias_NULL$$) {
    return $JSCompiler_alias_FALSE$$
  }
  $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$ = this.$a$;
  $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ && ($JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$rom$ = $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$);
  if($JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$rom$.length) {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$K$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$rom$.length;
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$romPageMask$ = $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$K$ - 1;
    for($i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ = 0;3 > $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$;$i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$++) {
      $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$frameReg$[$i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$] = $i$$inline_42_pages$$inline_38_size$$10_size$$inline_34$$ % $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$K$
    }
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$frameReg$[3] = 0
  }else {
    $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$K$ = 0, $JSCompiler_StaticMethods_resetMemory$self$$inline_40_data$$inline_33_mode$$9$$.$romPageMask$ = 0
  }
  return $JSCompiler_alias_TRUE$$
}};
var $JSSMS$Utils$Array$$ = $SUPPORT_DATAVIEW$$ ? function($length$$12$$) {
  $length$$12$$ || ($length$$12$$ = 0);
  return new DataView(new ArrayBuffer($length$$12$$))
} : Array, $JSSMS$Utils$getTimestamp$$ = window.performance && window.performance.now ? function() {
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
function $JSSMS$Z80$$($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$) {
  this.$z$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
  this.$N$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$.$c$;
  this.$t$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$.$f$;
  this.$I$ = this.$m$ = this.$c$ = 0;
  this.$A$ = this.$H$ = this.$G$ = this.$C$ = this.$B$ = $JSCompiler_alias_FALSE$$;
  this.$n$ = this.$U$ = this.$b$ = this.$M$ = this.$s$ = this.$q$ = this.$r$ = this.$p$ = this.$W$ = this.$V$ = this.$i$ = this.$k$ = this.$T$ = this.$S$ = this.$h$ = this.$j$ = this.$R$ = this.$Q$ = this.$f$ = this.$g$ = this.$P$ = this.$a$ = this.$J$ = 0;
  this.$rom$ = [];
  this.$sram$ = $JSSMS$Utils$Array$$(32768);
  this.$frameReg$ = Array(4);
  this.$K$ = this.$romPageMask$ = 0;
  this.$memWriteMap$ = $JSSMS$Utils$Array$$(8192);
  this.$X$ = Array(2048);
  this.$O$ = Array(256);
  this.$l$ = Array(256);
  this.$F$ = Array(256);
  this.$D$ = Array(256);
  this.$w$ = Array(131072);
  this.$v$ = Array(131072);
  this.$L$ = Array(256);
  var $c$$inline_74_padc$$inline_65_sf$$inline_59$$, $h$$inline_75_psub$$inline_66_zf$$inline_60$$, $n$$inline_76_psbc$$inline_67_yf$$inline_61$$, $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$, $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$, $flags$$inline_253_newval$$inline_70$$;
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;256 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
    $c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 0 != ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 128) ? 128 : 0, $h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 64 : 0, $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 32, $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 
    8, $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ = $JSCompiler_StaticMethods_getParity$$($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$) ? 4 : 0, this.$O$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$, this.$l$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 
    $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ | $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$, 
    this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 128 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 4 : 0, this.$F$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 0 == ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 15) ? 16 : 0, this.$D$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | 
    $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ | 2, this.$D$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 127 == $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 4 : 0, this.$D$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 15 == ($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 15) ? 16 : 0, this.$L$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0 != $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ ? 
    $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ & 128 : 68, this.$L$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ | $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ | 16
  }
  $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;
  $c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 65536;
  $h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0;
  $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = 65536;
  for($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ = 0;256 > $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$;$JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$++) {
    for($flags$$inline_253_newval$$inline_70$$ = 0;256 > $flags$$inline_253_newval$$inline_70$$;$flags$$inline_253_newval$$inline_70$$++) {
      $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ = $flags$$inline_253_newval$$inline_70$$ - $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$, this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = 0 != $flags$$inline_253_newval$$inline_70$$ ? 0 != ($flags$$inline_253_newval$$inline_70$$ & 128) ? 128 : 0 : 64, this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= $flags$$inline_253_newval$$inline_70$$ & 40, ($flags$$inline_253_newval$$inline_70$$ & 
      15) < ($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 16), $flags$$inline_253_newval$$inline_70$$ < $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ && (this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 1), 0 != (($JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ ^ 128) & ($JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ ^ 
      $flags$$inline_253_newval$$inline_70$$) & 128) && (this.$w$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] |= 4), $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++, $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ = $flags$$inline_253_newval$$inline_70$$ - $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ - 1, this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] = 0 != $flags$$inline_253_newval$$inline_70$$ ? 0 != ($flags$$inline_253_newval$$inline_70$$ & 
      128) ? 128 : 0 : 64, this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= $flags$$inline_253_newval$$inline_70$$ & 40, ($flags$$inline_253_newval$$inline_70$$ & 15) <= ($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 16), $flags$$inline_253_newval$$inline_70$$ <= $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ && (this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 1), 0 != (($JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ ^ 
      $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ ^ 128) & ($JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ ^ $flags$$inline_253_newval$$inline_70$$) & 128) && (this.$w$[$c$$inline_74_padc$$inline_65_sf$$inline_59$$] |= 4), $c$$inline_74_padc$$inline_65_sf$$inline_59$$++, $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ = $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ - $flags$$inline_253_newval$$inline_70$$, this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] = 
      0 != $flags$$inline_253_newval$$inline_70$$ ? 0 != ($flags$$inline_253_newval$$inline_70$$ & 128) ? 130 : 2 : 66, this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= $flags$$inline_253_newval$$inline_70$$ & 40, ($flags$$inline_253_newval$$inline_70$$ & 15) > ($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 16), $flags$$inline_253_newval$$inline_70$$ > $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ && 
      (this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 1), 0 != (($JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$) & ($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ ^ $flags$$inline_253_newval$$inline_70$$) & 128) && (this.$v$[$h$$inline_75_psub$$inline_66_zf$$inline_60$$] |= 4), $h$$inline_75_psub$$inline_66_zf$$inline_60$$++, $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ = $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ - 
      $flags$$inline_253_newval$$inline_70$$ - 1, this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] = 0 != $flags$$inline_253_newval$$inline_70$$ ? 0 != ($flags$$inline_253_newval$$inline_70$$ & 128) ? 130 : 2 : 66, this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= $flags$$inline_253_newval$$inline_70$$ & 40, ($flags$$inline_253_newval$$inline_70$$ & 15) >= ($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ & 15) && (this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 
      16), $flags$$inline_253_newval$$inline_70$$ >= $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ && (this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 1), 0 != (($JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ ^ $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$) & ($JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ ^ $flags$$inline_253_newval$$inline_70$$) & 128) && (this.$v$[$n$$inline_76_psbc$$inline_67_yf$$inline_61$$] |= 4), $n$$inline_76_psbc$$inline_67_yf$$inline_61$$++
    }
  }
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 256;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$--;) {
    for($c$$inline_74_padc$$inline_65_sf$$inline_59$$ = 0;1 >= $c$$inline_74_padc$$inline_65_sf$$inline_59$$;$c$$inline_74_padc$$inline_65_sf$$inline_59$$++) {
      for($h$$inline_75_psub$$inline_66_zf$$inline_60$$ = 0;1 >= $h$$inline_75_psub$$inline_66_zf$$inline_60$$;$h$$inline_75_psub$$inline_66_zf$$inline_60$$++) {
        for($n$$inline_76_psbc$$inline_67_yf$$inline_61$$ = 0;1 >= $n$$inline_76_psbc$$inline_67_yf$$inline_61$$;$n$$inline_76_psbc$$inline_67_yf$$inline_61$$++) {
          $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$ = this.$X$;
          $JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$ = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ << 8 | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ << 9 | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ << 10 | $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
          $flags$$inline_253_newval$$inline_70$$ = $c$$inline_74_padc$$inline_65_sf$$inline_59$$ | $n$$inline_76_psbc$$inline_67_yf$$inline_61$$ << 1 | $h$$inline_75_psub$$inline_66_zf$$inline_60$$ << 4;
          this.$a$ = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;
          this.$b$ = $flags$$inline_253_newval$$inline_70$$;
          var $a_copy$$inline_254$$ = this.$a$, $correction$$inline_255$$ = 0, $carry$$inline_256$$ = $flags$$inline_253_newval$$inline_70$$ & 1, $carry_copy$$inline_257$$ = $carry$$inline_256$$;
          if(0 != ($flags$$inline_253_newval$$inline_70$$ & 16) || 9 < ($a_copy$$inline_254$$ & 15)) {
            $correction$$inline_255$$ |= 6
          }
          if(1 == $carry$$inline_256$$ || 159 < $a_copy$$inline_254$$ || 143 < $a_copy$$inline_254$$ && 9 < ($a_copy$$inline_254$$ & 15)) {
            $correction$$inline_255$$ |= 96, $carry_copy$$inline_257$$ = 1
          }
          153 < $a_copy$$inline_254$$ && ($carry_copy$$inline_257$$ = 1);
          0 != ($flags$$inline_253_newval$$inline_70$$ & 2) ? $JSCompiler_StaticMethods_sub_a$$(this, $correction$$inline_255$$) : $JSCompiler_StaticMethods_add_a$$(this, $correction$$inline_255$$);
          $flags$$inline_253_newval$$inline_70$$ = this.$b$ & 254 | $carry_copy$$inline_257$$;
          $flags$$inline_253_newval$$inline_70$$ = $JSCompiler_StaticMethods_getParity$$(this.$a$) ? $flags$$inline_253_newval$$inline_70$$ & 251 | 4 : $flags$$inline_253_newval$$inline_70$$ & 251;
          $JSCompiler_temp_const$$231_val$$inline_68_xf$$inline_62$$[$JSCompiler_temp_const$$230_oldval$$inline_69_pf$$inline_63$$] = this.$a$ | $flags$$inline_253_newval$$inline_70$$ << 8
        }
      }
    }
  }
  this.$a$ = this.$b$ = 0;
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
  this.$K$ = 2;
  for($i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ = 0;4 > $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$;$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$++) {
    this.$frameReg$[$i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$] = $i$$inline_58_i$$inline_73_i$$inline_79_padd$$inline_64_sms$$ % 3
  }
  for(var $method$$2$$ in $JSSMS$Debugger$$.prototype) {
    this[$method$$2$$] = $JSSMS$Debugger$$.prototype[$method$$2$$]
  }
}
$JSSMS$Z80$$.prototype = {reset:function $$JSSMS$Z80$$$$reset$() {
  this.$c$ = this.$U$ = this.$b$ = this.$M$ = this.$q$ = this.$s$ = this.$p$ = this.$r$ = this.$k$ = this.$i$ = this.$V$ = this.$W$ = this.$j$ = this.$h$ = this.$S$ = this.$T$ = this.$g$ = this.$f$ = this.$Q$ = this.$R$ = this.$a$ = this.$P$ = 0;
  this.$m$ = 57328;
  this.$I$ = this.$n$ = 0;
  this.$H$ = this.$C$ = this.$B$ = $JSCompiler_alias_FALSE$$;
  this.$J$ = 0;
  this.$G$ = $JSCompiler_alias_FALSE$$
}, call:function $$JSSMS$Z80$$$$call$($condition$$3$$) {
  $condition$$3$$ ? ($JSCompiler_StaticMethods_push1$$(this, this.$c$ + 2), this.$c$ = this.$o$(this.$c$), this.$n$ -= 7) : this.$c$ += 2
}, $e$:$SUPPORT_DATAVIEW$$ ? function($address$$, $value$$64$$) {
  if(65535 >= $address$$) {
    this.$memWriteMap$.setInt8($address$$ & 8191, $value$$64$$), 65532 == $address$$ ? this.$frameReg$[3] = $value$$64$$ : 65533 == $address$$ ? this.$frameReg$[0] = $value$$64$$ : 65534 == $address$$ ? this.$frameReg$[1] = $value$$64$$ : 65535 == $address$$ && (this.$frameReg$[2] = $value$$64$$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$), $JSSMS$Utils$toHex$$($address$$ & 8191));
    debugger
  }
} : function($address$$1$$, $value$$65$$) {
  if(65535 >= $address$$1$$) {
    this.$memWriteMap$[$address$$1$$ & 8191] = $value$$65$$, 65532 == $address$$1$$ ? this.$frameReg$[3] = $value$$65$$ : 65533 == $address$$1$$ ? this.$frameReg$[0] = $value$$65$$ : 65534 == $address$$1$$ ? this.$frameReg$[1] = $value$$65$$ : 65535 == $address$$1$$ && (this.$frameReg$[2] = $value$$65$$)
  }else {
    console.error($JSSMS$Utils$toHex$$($address$$1$$), $JSSMS$Utils$toHex$$($address$$1$$ & 8191));
    debugger
  }
}, $d$:$SUPPORT_DATAVIEW$$ ? function($address$$2$$) {
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
  debugger;
  return 0
} : function($address$$3$$) {
  if(1024 > $address$$3$$) {
    return this.$rom$[0][$address$$3$$]
  }
  if(16384 > $address$$3$$) {
    return this.$rom$[this.$frameReg$[0] & this.$romPageMask$][$address$$3$$]
  }
  if(32768 > $address$$3$$) {
    return this.$rom$[this.$frameReg$[1] & this.$romPageMask$][$address$$3$$ - 16384]
  }
  if(49152 > $address$$3$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$3$$ - 32768] : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$3$$ - 16384] : this.$rom$[this.$frameReg$[2] & this.$romPageMask$][$address$$3$$ - 32768]
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
  console.error($JSSMS$Utils$toHex$$($address$$3$$));
  debugger;
  return 0
}, $o$:$SUPPORT_DATAVIEW$$ ? function($address$$4$$) {
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
  debugger;
  return 0
} : function($address$$5$$) {
  if(1024 > $address$$5$$) {
    return this.$rom$[0][$address$$5$$] | this.$rom$[0][++$address$$5$$] << 8
  }
  if(16384 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[0] & this.$romPageMask$][$address$$5$$] | this.$rom$[this.$frameReg$[0] & this.$romPageMask$][++$address$$5$$] << 8
  }
  if(32768 > $address$$5$$) {
    return this.$rom$[this.$frameReg$[1] & this.$romPageMask$][$address$$5$$ - 16384] | this.$rom$[this.$frameReg$[1] & this.$romPageMask$][++$address$$5$$ - 16384] << 8
  }
  if(49152 > $address$$5$$) {
    return 8 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 32768] | this.$sram$[++$address$$5$$ - 32768] << 8 : 12 == (this.$frameReg$[3] & 12) ? this.$sram$[$address$$5$$ - 16384] | this.$sram$[++$address$$5$$ - 16384] << 8 : this.$rom$[this.$frameReg$[2] & this.$romPageMask$][$address$$5$$ - 32768] | this.$rom$[this.$frameReg$[2] & this.$romPageMask$][++$address$$5$$ - 32768] << 8
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
  console.error($JSSMS$Utils$toHex$$($address$$5$$));
  debugger;
  return 0
}};
function $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_d_$self$$) {
  return $JSCompiler_StaticMethods_d_$self$$.$d$($JSCompiler_StaticMethods_d_$self$$.$c$)
}
function $JSCompiler_StaticMethods_getParity$$($value$$63$$) {
  var $parity$$ = $JSCompiler_alias_TRUE$$, $j$$1$$;
  for($j$$1$$ = 0;8 > $j$$1$$;$j$$1$$++) {
    0 != ($value$$63$$ & 1 << $j$$1$$) && ($parity$$ = !$parity$$)
  }
  return $parity$$
}
function $JSCompiler_StaticMethods_sbc16$$($JSCompiler_StaticMethods_sbc16$self$$, $value$$62$$) {
  var $hl$$1$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_sbc16$self$$), $result$$2$$ = $hl$$1$$ - $value$$62$$ - ($JSCompiler_StaticMethods_sbc16$self$$.$b$ & 1);
  $JSCompiler_StaticMethods_sbc16$self$$.$b$ = ($hl$$1$$ ^ $result$$2$$ ^ $value$$62$$) >> 8 & 16 | 2 | $result$$2$$ >> 16 & 1 | $result$$2$$ >> 8 & 128 | (0 != ($result$$2$$ & 65535) ? 0 : 64) | (($value$$62$$ ^ $hl$$1$$) & ($hl$$1$$ ^ $result$$2$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_sbc16$self$$.$k$ = $result$$2$$ >> 8 & 255;
  $JSCompiler_StaticMethods_sbc16$self$$.$i$ = $result$$2$$ & 255
}
function $JSCompiler_StaticMethods_adc16$$($JSCompiler_StaticMethods_adc16$self$$, $value$$61$$) {
  var $hl$$ = $JSCompiler_StaticMethods_getHL$$($JSCompiler_StaticMethods_adc16$self$$), $result$$1$$ = $hl$$ + $value$$61$$ + ($JSCompiler_StaticMethods_adc16$self$$.$b$ & 1);
  $JSCompiler_StaticMethods_adc16$self$$.$b$ = ($hl$$ ^ $result$$1$$ ^ $value$$61$$) >> 8 & 16 | $result$$1$$ >> 16 & 1 | $result$$1$$ >> 8 & 128 | (0 != ($result$$1$$ & 65535) ? 0 : 64) | (($value$$61$$ ^ $hl$$ ^ 32768) & ($value$$61$$ ^ $result$$1$$) & 32768) >> 13;
  $JSCompiler_StaticMethods_adc16$self$$.$k$ = $result$$1$$ >> 8 & 255;
  $JSCompiler_StaticMethods_adc16$self$$.$i$ = $result$$1$$ & 255
}
function $JSCompiler_StaticMethods_add16$$($JSCompiler_StaticMethods_add16$self$$, $reg$$, $value$$60$$) {
  var $result$$ = $reg$$ + $value$$60$$;
  $JSCompiler_StaticMethods_add16$self$$.$b$ = $JSCompiler_StaticMethods_add16$self$$.$b$ & 196 | ($reg$$ ^ $result$$ ^ $value$$60$$) >> 8 & 16 | $result$$ >> 16 & 1;
  return $result$$ & 65535
}
function $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_dec8$self$$, $value$$59$$) {
  $value$$59$$ = $value$$59$$ - 1 & 255;
  $JSCompiler_StaticMethods_dec8$self$$.$b$ = $JSCompiler_StaticMethods_dec8$self$$.$b$ & 1 | $JSCompiler_StaticMethods_dec8$self$$.$D$[$value$$59$$];
  return $value$$59$$
}
function $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_inc8$self$$, $value$$58$$) {
  $value$$58$$ = $value$$58$$ + 1 & 255;
  $JSCompiler_StaticMethods_inc8$self$$.$b$ = $JSCompiler_StaticMethods_inc8$self$$.$b$ & 1 | $JSCompiler_StaticMethods_inc8$self$$.$F$[$value$$58$$];
  return $value$$58$$
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
function $JSCompiler_StaticMethods_setIY$$($JSCompiler_StaticMethods_setIY$self$$, $value$$57$$) {
  $JSCompiler_StaticMethods_setIY$self$$.$s$ = $value$$57$$ >> 8;
  $JSCompiler_StaticMethods_setIY$self$$.$q$ = $value$$57$$ & 255
}
function $JSCompiler_StaticMethods_setIX$$($JSCompiler_StaticMethods_setIX$self$$, $value$$56$$) {
  $JSCompiler_StaticMethods_setIX$self$$.$r$ = $value$$56$$ >> 8;
  $JSCompiler_StaticMethods_setIX$self$$.$p$ = $value$$56$$ & 255
}
function $JSCompiler_StaticMethods_setHL$$($JSCompiler_StaticMethods_setHL$self$$, $value$$55$$) {
  $JSCompiler_StaticMethods_setHL$self$$.$k$ = $value$$55$$ >> 8;
  $JSCompiler_StaticMethods_setHL$self$$.$i$ = $value$$55$$ & 255
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
function $JSCompiler_StaticMethods_cp_a$$($JSCompiler_StaticMethods_cp_a$self$$, $value$$52$$) {
  $JSCompiler_StaticMethods_cp_a$self$$.$b$ = $JSCompiler_StaticMethods_cp_a$self$$.$v$[$JSCompiler_StaticMethods_cp_a$self$$.$a$ << 8 | $JSCompiler_StaticMethods_cp_a$self$$.$a$ - $value$$52$$ & 255]
}
function $JSCompiler_StaticMethods_sbc_a$$($JSCompiler_StaticMethods_sbc_a$self$$, $value$$51$$) {
  var $carry$$10$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$b$ & 1, $temp$$8$$ = $JSCompiler_StaticMethods_sbc_a$self$$.$a$ - $value$$51$$ - $carry$$10$$ & 255;
  $JSCompiler_StaticMethods_sbc_a$self$$.$b$ = $JSCompiler_StaticMethods_sbc_a$self$$.$v$[$carry$$10$$ << 16 | $JSCompiler_StaticMethods_sbc_a$self$$.$a$ << 8 | $temp$$8$$];
  $JSCompiler_StaticMethods_sbc_a$self$$.$a$ = $temp$$8$$
}
function $JSCompiler_StaticMethods_sub_a$$($JSCompiler_StaticMethods_sub_a$self$$, $value$$50$$) {
  var $temp$$7$$ = $JSCompiler_StaticMethods_sub_a$self$$.$a$ - $value$$50$$ & 255;
  $JSCompiler_StaticMethods_sub_a$self$$.$b$ = $JSCompiler_StaticMethods_sub_a$self$$.$v$[$JSCompiler_StaticMethods_sub_a$self$$.$a$ << 8 | $temp$$7$$];
  $JSCompiler_StaticMethods_sub_a$self$$.$a$ = $temp$$7$$
}
function $JSCompiler_StaticMethods_adc_a$$($JSCompiler_StaticMethods_adc_a$self$$, $value$$49$$) {
  var $carry$$9$$ = $JSCompiler_StaticMethods_adc_a$self$$.$b$ & 1, $temp$$6$$ = $JSCompiler_StaticMethods_adc_a$self$$.$a$ + $value$$49$$ + $carry$$9$$ & 255;
  $JSCompiler_StaticMethods_adc_a$self$$.$b$ = $JSCompiler_StaticMethods_adc_a$self$$.$w$[$carry$$9$$ << 16 | $JSCompiler_StaticMethods_adc_a$self$$.$a$ << 8 | $temp$$6$$];
  $JSCompiler_StaticMethods_adc_a$self$$.$a$ = $temp$$6$$
}
function $JSCompiler_StaticMethods_add_a$$($JSCompiler_StaticMethods_add_a$self$$, $value$$48$$) {
  var $temp$$5$$ = $JSCompiler_StaticMethods_add_a$self$$.$a$ + $value$$48$$ & 255;
  $JSCompiler_StaticMethods_add_a$self$$.$b$ = $JSCompiler_StaticMethods_add_a$self$$.$w$[$JSCompiler_StaticMethods_add_a$self$$.$a$ << 8 | $temp$$5$$];
  $JSCompiler_StaticMethods_add_a$self$$.$a$ = $temp$$5$$
}
function $JSCompiler_StaticMethods_doIndexCB$$($JSCompiler_StaticMethods_doIndexCB$self$$, $index$$44$$) {
  var $location$$24$$ = $index$$44$$ + $JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_doIndexCB$self$$) & 65535, $opcode$$4$$ = $JSCompiler_StaticMethods_doIndexCB$self$$.$d$(++$JSCompiler_StaticMethods_doIndexCB$self$$.$c$);
  $JSCompiler_StaticMethods_doIndexCB$self$$.$n$ -= $OP_INDEX_CB_STATES$$[$opcode$$4$$];
  switch($opcode$$4$$) {
    case 0:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 1:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 2:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 3:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 4:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 5:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 6:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 7:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 8:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 9:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 10:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 11:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 12:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 13:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 14:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 15:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 16:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 17:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 18:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 19:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 20:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 21:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 22:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 23:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 24:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 25:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 26:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 27:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 28:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 29:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 30:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 31:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 32:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 33:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 34:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 35:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 36:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 37:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 38:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 39:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 40:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 41:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 42:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 43:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 44:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 45:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 46:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 47:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 48:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 49:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 50:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 51:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 52:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 53:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 54:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 55:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
      break;
    case 56:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$g$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$g$);
      break;
    case 57:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$f$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$f$);
      break;
    case 58:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$j$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$j$);
      break;
    case 59:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$h$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$h$);
      break;
    case 60:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$k$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$k$);
      break;
    case 61:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$i$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$i$);
      break;
    case 62:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$)));
      break;
    case 63:
      $JSCompiler_StaticMethods_doIndexCB$self$$.$a$ = $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$));
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$a$);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 1);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 2);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 4);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 8);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 16);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 32);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 64);
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
      $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_doIndexCB$self$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & 128);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -3);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -5);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -9);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -17);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -33);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -65);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) & -129);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 1);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 2);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 4);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 8);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 16);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 32);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 64);
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
      $JSCompiler_StaticMethods_doIndexCB$self$$.$e$($location$$24$$, $JSCompiler_StaticMethods_doIndexCB$self$$.$d$($location$$24$$) | 128);
      break;
    default:
      console.log("Unimplemented DDCB/FDCB Opcode: " + $JSSMS$Utils$toHex$$($opcode$$4$$))
  }
  $JSCompiler_StaticMethods_doIndexCB$self$$.$c$++
}
function $JSCompiler_StaticMethods_bit$$($JSCompiler_StaticMethods_bit$self$$, $mask$$5$$) {
  $JSCompiler_StaticMethods_bit$self$$.$b$ = $JSCompiler_StaticMethods_bit$self$$.$b$ & 1 | $JSCompiler_StaticMethods_bit$self$$.$L$[$mask$$5$$]
}
function $JSCompiler_StaticMethods_srl$$($JSCompiler_StaticMethods_srl$self$$, $value$$46$$) {
  var $carry$$7$$ = $value$$46$$ & 1;
  $value$$46$$ = $value$$46$$ >> 1 & 255;
  $JSCompiler_StaticMethods_srl$self$$.$b$ = $carry$$7$$ | $JSCompiler_StaticMethods_srl$self$$.$l$[$value$$46$$];
  return $value$$46$$
}
function $JSCompiler_StaticMethods_sra$$($JSCompiler_StaticMethods_sra$self$$, $value$$45$$) {
  var $carry$$6$$ = $value$$45$$ & 1;
  $value$$45$$ = $value$$45$$ >> 1 | $value$$45$$ & 128;
  $JSCompiler_StaticMethods_sra$self$$.$b$ = $carry$$6$$ | $JSCompiler_StaticMethods_sra$self$$.$l$[$value$$45$$];
  return $value$$45$$
}
function $JSCompiler_StaticMethods_sll$$($JSCompiler_StaticMethods_sll$self$$, $value$$44$$) {
  var $carry$$5$$ = ($value$$44$$ & 128) >> 7;
  $value$$44$$ = ($value$$44$$ << 1 | 1) & 255;
  $JSCompiler_StaticMethods_sll$self$$.$b$ = $carry$$5$$ | $JSCompiler_StaticMethods_sll$self$$.$l$[$value$$44$$];
  return $value$$44$$
}
function $JSCompiler_StaticMethods_sla$$($JSCompiler_StaticMethods_sla$self$$, $value$$43$$) {
  var $carry$$4$$ = ($value$$43$$ & 128) >> 7;
  $value$$43$$ = $value$$43$$ << 1 & 255;
  $JSCompiler_StaticMethods_sla$self$$.$b$ = $carry$$4$$ | $JSCompiler_StaticMethods_sla$self$$.$l$[$value$$43$$];
  return $value$$43$$
}
function $JSCompiler_StaticMethods_rr$$($JSCompiler_StaticMethods_rr$self$$, $value$$42$$) {
  var $carry$$3$$ = $value$$42$$ & 1;
  $value$$42$$ = ($value$$42$$ >> 1 | $JSCompiler_StaticMethods_rr$self$$.$b$ << 7) & 255;
  $JSCompiler_StaticMethods_rr$self$$.$b$ = $carry$$3$$ | $JSCompiler_StaticMethods_rr$self$$.$l$[$value$$42$$];
  return $value$$42$$
}
function $JSCompiler_StaticMethods_rl$$($JSCompiler_StaticMethods_rl$self$$, $value$$41$$) {
  var $carry$$2$$ = ($value$$41$$ & 128) >> 7;
  $value$$41$$ = ($value$$41$$ << 1 | $JSCompiler_StaticMethods_rl$self$$.$b$ & 1) & 255;
  $JSCompiler_StaticMethods_rl$self$$.$b$ = $carry$$2$$ | $JSCompiler_StaticMethods_rl$self$$.$l$[$value$$41$$];
  return $value$$41$$
}
function $JSCompiler_StaticMethods_rrc$$($JSCompiler_StaticMethods_rrc$self$$, $value$$40$$) {
  var $carry$$1$$ = $value$$40$$ & 1;
  $value$$40$$ = ($value$$40$$ >> 1 | $value$$40$$ << 7) & 255;
  $JSCompiler_StaticMethods_rrc$self$$.$b$ = $carry$$1$$ | $JSCompiler_StaticMethods_rrc$self$$.$l$[$value$$40$$];
  return $value$$40$$
}
function $JSCompiler_StaticMethods_rlc$$($JSCompiler_StaticMethods_rlc$self$$, $value$$39$$) {
  var $carry$$ = ($value$$39$$ & 128) >> 7;
  $value$$39$$ = ($value$$39$$ << 1 | $value$$39$$ >> 7) & 255;
  $JSCompiler_StaticMethods_rlc$self$$.$b$ = $carry$$ | $JSCompiler_StaticMethods_rlc$self$$.$l$[$value$$39$$];
  return $value$$39$$
}
function $JSCompiler_StaticMethods_decMem$$($JSCompiler_StaticMethods_decMem$self$$, $offset$$15$$) {
  $JSCompiler_StaticMethods_decMem$self$$.$e$($offset$$15$$, $JSCompiler_StaticMethods_dec8$$($JSCompiler_StaticMethods_decMem$self$$, $JSCompiler_StaticMethods_decMem$self$$.$d$($offset$$15$$)))
}
function $JSCompiler_StaticMethods_incMem$$($JSCompiler_StaticMethods_incMem$self$$, $offset$$14$$) {
  $JSCompiler_StaticMethods_incMem$self$$.$e$($offset$$14$$, $JSCompiler_StaticMethods_inc8$$($JSCompiler_StaticMethods_incMem$self$$, $JSCompiler_StaticMethods_incMem$self$$.$d$($offset$$14$$)))
}
function $JSCompiler_StaticMethods_push2$$($JSCompiler_StaticMethods_push2$self$$, $hi$$, $lo$$) {
  $JSCompiler_StaticMethods_push2$self$$.$e$(--$JSCompiler_StaticMethods_push2$self$$.$m$, $hi$$);
  $JSCompiler_StaticMethods_push2$self$$.$e$(--$JSCompiler_StaticMethods_push2$self$$.$m$, $lo$$)
}
function $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_push1$self$$, $value$$38$$) {
  $JSCompiler_StaticMethods_push1$self$$.$e$(--$JSCompiler_StaticMethods_push1$self$$.$m$, $value$$38$$ >> 8);
  $JSCompiler_StaticMethods_push1$self$$.$e$(--$JSCompiler_StaticMethods_push1$self$$.$m$, $value$$38$$ & 255)
}
function $JSCompiler_StaticMethods_ret$$($JSCompiler_StaticMethods_ret$self$$, $condition$$4$$) {
  $condition$$4$$ && ($JSCompiler_StaticMethods_ret$self$$.$c$ = $JSCompiler_StaticMethods_ret$self$$.$o$($JSCompiler_StaticMethods_ret$self$$.$m$), $JSCompiler_StaticMethods_ret$self$$.$m$ += 2, $JSCompiler_StaticMethods_ret$self$$.$n$ -= 6)
}
function $JSCompiler_StaticMethods_signExtend$$($d$$) {
  128 <= $d$$ && ($d$$ -= 256);
  return $d$$
}
function $JSCompiler_StaticMethods_jr$$($JSCompiler_StaticMethods_jr$self$$, $condition$$2$$) {
  $condition$$2$$ ? ($JSCompiler_StaticMethods_jr$self$$.$c$ += $JSCompiler_StaticMethods_signExtend$$($JSCompiler_StaticMethods_d_$$($JSCompiler_StaticMethods_jr$self$$) + 1), $JSCompiler_StaticMethods_jr$self$$.$n$ -= 5) : $JSCompiler_StaticMethods_jr$self$$.$c$++
}
function $JSCompiler_StaticMethods_jp$$($JSCompiler_StaticMethods_jp$self$$, $condition$$1$$) {
  $condition$$1$$ ? $JSCompiler_StaticMethods_jp$self$$.$c$ = $JSCompiler_StaticMethods_jp$self$$.$o$($JSCompiler_StaticMethods_jp$self$$.$c$) : $JSCompiler_StaticMethods_jp$self$$.$c$ += 2
}
function $JSCompiler_StaticMethods_interrupt$$($JSCompiler_StaticMethods_interrupt$self$$) {
  $JSCompiler_StaticMethods_interrupt$self$$.$B$ && !$JSCompiler_StaticMethods_interrupt$self$$.$H$ && ($JSCompiler_StaticMethods_interrupt$self$$.$G$ && ($JSCompiler_StaticMethods_interrupt$self$$.$c$++, $JSCompiler_StaticMethods_interrupt$self$$.$G$ = $JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_interrupt$self$$.$B$ = $JSCompiler_StaticMethods_interrupt$self$$.$C$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_interrupt$self$$.$A$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_push1$$($JSCompiler_StaticMethods_interrupt$self$$, 
  $JSCompiler_StaticMethods_interrupt$self$$.$c$), 0 == $JSCompiler_StaticMethods_interrupt$self$$.$I$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$c$ = 0 == $JSCompiler_StaticMethods_interrupt$self$$.$J$ || 255 == $JSCompiler_StaticMethods_interrupt$self$$.$J$ ? 56 : $JSCompiler_StaticMethods_interrupt$self$$.$J$, $JSCompiler_StaticMethods_interrupt$self$$.$n$ -= 13) : 1 == $JSCompiler_StaticMethods_interrupt$self$$.$I$ ? ($JSCompiler_StaticMethods_interrupt$self$$.$c$ = 56, $JSCompiler_StaticMethods_interrupt$self$$.$n$ -= 
  13) : ($JSCompiler_StaticMethods_interrupt$self$$.$c$ = $JSCompiler_StaticMethods_interrupt$self$$.$o$(($JSCompiler_StaticMethods_interrupt$self$$.$M$ << 8) + $JSCompiler_StaticMethods_interrupt$self$$.$J$), $JSCompiler_StaticMethods_interrupt$self$$.$n$ -= 19))
}
;function $JSSMS$Debugger$$() {
}
$JSSMS$Debugger$$.prototype = {$u$:[]};
function $JSCompiler_StaticMethods_peepholePortIn$$($JSCompiler_StaticMethods_peepholePortIn$self$$, $port$$1$$) {
  if($JSCompiler_StaticMethods_peepholePortIn$self$$.$z$.$is_gg$ && 7 > $port$$1$$) {
    switch($port$$1$$) {
      case 0:
        return"this.a = (this.port.keyboard.ggstart & 0xBF) | this.port.europe;";
      case 1:
      ;
      case 2:
      ;
      case 3:
      ;
      case 4:
      ;
      case 5:
        return"this.a = 0x00;";
      case 6:
        return"this.a = 0xFF;"
    }
  }
  switch($port$$1$$ & 193) {
    case 64:
      return"this.a = this.vdp.getVCount();";
    case 65:
      return"this.a = this.port.hCounter;";
    case 128:
      return"this.a = this.vdp.dataRead();";
    case 129:
      return"this.a = this.vdp.controlRead();";
    case 192:
      return"this.a = this.port.keyboard.controller1;";
    case 193:
      return"this.a = (this.port.keyboard.controller2 & 0x3F) | this.port.ioPorts[0] | this.port.ioPorts[1];"
  }
  return"this.a = 0xFF;"
}
function $JSCompiler_StaticMethods_peepholePortOut$$($JSCompiler_StaticMethods_peepholePortOut$self$$, $port$$) {
  if($JSCompiler_StaticMethods_peepholePortOut$self$$.$z$.$is_gg$ && 7 > $port$$) {
    return""
  }
  switch($port$$ & 193) {
    case 1:
      return"var value = this.a;this.port.ioPorts[0] = (value & 0x20) << 1;this.port.ioPorts[1] = (value & 0x80);";
    case 128:
      return"this.vdp.dataWrite(this.a);";
    case 129:
      return"this.vdp.controlWrite(this.a);";
    case 64:
    ;
    case 65:
      if($JSCompiler_StaticMethods_peepholePortOut$self$$.$z$.$soundEnabled$) {
        return"this.psg.write(this.a);"
      }
  }
  return""
}
function $JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_readRom16bit$self$$, $address$$12$$) {
  return $SUPPORT_DATAVIEW$$ ? 16383 > ($address$$12$$ & 16383) ? $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14].getUint16($address$$12$$ & 16383, $JSCompiler_alias_TRUE$$) : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14].getUint8($address$$12$$ & 16383) | $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$12$$ >> 14].getUint8($address$$12$$ & 16383) << 8 : $JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[$address$$12$$ >> 14][$address$$12$$ & 
  16383] & 255 | ($JSCompiler_StaticMethods_readRom16bit$self$$.$rom$[++$address$$12$$ >> 14][$address$$12$$ & 16383] & 255) << 8
}
function $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_readRom8bit$self$$, $address$$11$$) {
  return $SUPPORT_DATAVIEW$$ ? $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$11$$ >> 14].getUint8($address$$11$$ & 16383) : $JSCompiler_StaticMethods_readRom8bit$self$$.$rom$[$address$$11$$ >> 14][$address$$11$$ & 16383] & 255
}
function $JSCompiler_StaticMethods_getIndex$$($JSCompiler_StaticMethods_getIndex$self$$, $index$$45$$, $address$$9_address$$inline_85$$) {
  var $opcode$$9$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$), $opcodesArray$$3$$ = [$opcode$$9$$], $inst$$3_opcode$$inline_86$$ = "Unimplemented 0xDD or 0xFD prefixed opcode", $currAddr$$3$$ = $address$$9_address$$inline_85$$, $code$$6_code$$inline_90$$ = 'throw "Unimplemented 0xDD or 0xFD prefixed opcode";', $opcodesArray$$inline_87_operand$$2$$ = "";
  $address$$9_address$$inline_85$$++;
  switch($opcode$$9$$) {
    case 9:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + ",BC";
      $code$$6_code$$inline_90$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getBC()));";
      break;
    case 25:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + ",DE";
      $code$$6_code$$inline_90$$ = "this.set" + $index$$45$$ + "(this.add16(this.get" + $index$$45$$ + "(), this.getDE()));";
      break;
    case 33:
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "," + $opcodesArray$$inline_87_operand$$2$$;
      $code$$6_code$$inline_90$$ = "this.set" + $index$$45$$ + "(" + $opcodesArray$$inline_87_operand$$2$$ + ");";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 34:
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $inst$$3_opcode$$inline_86$$ = "LD (" + $opcodesArray$$inline_87_operand$$2$$ + ")," + $index$$45$$;
      $code$$6_code$$inline_90$$ = "var location = " + $opcodesArray$$inline_87_operand$$2$$ + ";this.writeMem(location++, this." + $index$$45$$.toLowerCase() + "L);this.writeMem(location, this." + $index$$45$$.toLowerCase() + "H);";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 35:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$45$$;
      $code$$6_code$$inline_90$$ = "this.inc" + $index$$45$$ + "();";
      break;
    case 36:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$45$$ + "H *";
      break;
    case 37:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$45$$ + "H *";
      break;
    case 38:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$)) + " *";
      $address$$9_address$$inline_85$$++;
      break;
    case 41:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + "  " + $index$$45$$;
      break;
    case 42:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + " (" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom16bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$)) + ")";
      $address$$9_address$$inline_85$$ += 2;
      break;
    case 43:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$45$$;
      $code$$6_code$$inline_90$$ = "this.dec" + $index$$45$$ + "();";
      break;
    case 44:
      $inst$$3_opcode$$inline_86$$ = "INC " + $index$$45$$ + "L *";
      break;
    case 45:
      $inst$$3_opcode$$inline_86$$ = "DEC " + $index$$45$$ + "L *";
      break;
    case 46:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L," + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$));
      $address$$9_address$$inline_85$$++;
      break;
    case 52:
      var $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$), $inst$$3_opcode$$inline_86$$ = "INC (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")", $code$$6_code$$inline_90$$ = "this.incMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 53:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "DEC (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.decMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 54:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $opcodesArray$$inline_87_operand$$2$$ = $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$ + 1));
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")," + $opcodesArray$$inline_87_operand$$2$$;
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", " + $opcodesArray$$inline_87_operand$$2$$ + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 57:
      $inst$$3_opcode$$inline_86$$ = "ADD " + $index$$45$$ + " SP";
      break;
    case 68:
      $inst$$3_opcode$$inline_86$$ = "LD B," + $index$$45$$ + "H *";
      break;
    case 69:
      $inst$$3_opcode$$inline_86$$ = "LD B," + $index$$45$$ + "L *";
      break;
    case 70:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD B,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.b = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 76:
      $inst$$3_opcode$$inline_86$$ = "LD C," + $index$$45$$ + "H *";
      break;
    case 77:
      $inst$$3_opcode$$inline_86$$ = "LD C," + $index$$45$$ + "L *";
      break;
    case 78:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD C,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.c = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 84:
      $inst$$3_opcode$$inline_86$$ = "LD D," + $index$$45$$ + "H *";
      break;
    case 85:
      $inst$$3_opcode$$inline_86$$ = "LD D," + $index$$45$$ + "L *";
      break;
    case 86:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD D,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.d = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 92:
      $inst$$3_opcode$$inline_86$$ = "LD E," + $index$$45$$ + "H *";
      break;
    case 93:
      $inst$$3_opcode$$inline_86$$ = "LD E," + $index$$45$$ + "L *";
      break;
    case 94:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD E,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.e = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 96:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H,B *";
      break;
    case 97:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H,C *";
      break;
    case 98:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H,D *";
      break;
    case 99:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H,E *";
      break;
    case 100:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "H*";
      break;
    case 101:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H," + $index$$45$$ + "L *";
      break;
    case 102:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD H,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.h = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 103:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "H,A *";
      break;
    case 104:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L,B *";
      break;
    case 105:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L,C *";
      break;
    case 106:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L,D *";
      break;
    case 107:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L,E *";
      break;
    case 108:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "H *";
      break;
    case 109:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L," + $index$$45$$ + "L *";
      break;
    case 110:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD L,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.l = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 111:
      $inst$$3_opcode$$inline_86$$ = "LD " + $index$$45$$ + "L,A *";
      break;
    case 112:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),B";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.b);";
      $address$$9_address$$inline_85$$++;
      break;
    case 113:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),C";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.c);";
      $address$$9_address$$inline_85$$++;
      break;
    case 114:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),D";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.d);";
      $address$$9_address$$inline_85$$++;
      break;
    case 115:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),E";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.e);";
      $address$$9_address$$inline_85$$++;
      break;
    case 116:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),H";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.h);";
      $address$$9_address$$inline_85$$++;
      break;
    case 117:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),L";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.l);";
      $address$$9_address$$inline_85$$++;
      break;
    case 119:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "),A";
      $code$$6_code$$inline_90$$ = "this.writeMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ", this.a);";
      $address$$9_address$$inline_85$$++;
      break;
    case 124:
      $inst$$3_opcode$$inline_86$$ = "LD A," + $index$$45$$ + "H *";
      break;
    case 125:
      $inst$$3_opcode$$inline_86$$ = "LD A," + $index$$45$$ + "L *";
      break;
    case 126:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "LD A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")";
      $code$$6_code$$inline_90$$ = "this.a = this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ");";
      $address$$9_address$$inline_85$$++;
      break;
    case 132:
      $inst$$3_opcode$$inline_86$$ = "ADD A," + $index$$45$$ + "H *";
      break;
    case 133:
      $inst$$3_opcode$$inline_86$$ = "ADD A," + $index$$45$$ + "L *";
      break;
    case 134:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "ADD A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $code$$6_code$$inline_90$$ = "this.add_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 140:
      $inst$$3_opcode$$inline_86$$ = "ADC A," + $index$$45$$ + "H *";
      break;
    case 141:
      $inst$$3_opcode$$inline_86$$ = "ADC A," + $index$$45$$ + "L *";
      break;
    case 142:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "ADC A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $address$$9_address$$inline_85$$++;
      break;
    case 148:
      $inst$$3_opcode$$inline_86$$ = "SUB " + $index$$45$$ + "H *";
      break;
    case 149:
      $inst$$3_opcode$$inline_86$$ = "SUB " + $index$$45$$ + "L *";
      break;
    case 150:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "SUB A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $code$$6_code$$inline_90$$ = "this.sub_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 156:
      $inst$$3_opcode$$inline_86$$ = "SBC A," + $index$$45$$ + "H *";
      break;
    case 157:
      $inst$$3_opcode$$inline_86$$ = "SBC A," + $index$$45$$ + "L *";
      break;
    case 158:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "SBC A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $address$$9_address$$inline_85$$++;
      break;
    case 164:
      $inst$$3_opcode$$inline_86$$ = "AND " + $index$$45$$ + "H *";
      break;
    case 165:
      $inst$$3_opcode$$inline_86$$ = "AND " + $index$$45$$ + "L *";
      break;
    case 166:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "AND A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $address$$9_address$$inline_85$$++;
      break;
    case 172:
      $inst$$3_opcode$$inline_86$$ = "XOR A " + $index$$45$$ + "H*";
      break;
    case 173:
      $inst$$3_opcode$$inline_86$$ = "XOR A " + $index$$45$$ + "L*";
      break;
    case 174:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "XOR A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $code$$6_code$$inline_90$$ = "this.f = this.SZP_TABLE[this.a ^= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")];";
      $address$$9_address$$inline_85$$++;
      break;
    case 180:
      $inst$$3_opcode$$inline_86$$ = "OR A " + $index$$45$$ + "H*";
      break;
    case 181:
      $inst$$3_opcode$$inline_86$$ = "OR A " + $index$$45$$ + "L*";
      break;
    case 182:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "OR A,(" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $code$$6_code$$inline_90$$ = "this.f = this.SZP_TABLE[this.a |= this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + ")];";
      $address$$9_address$$inline_85$$++;
      break;
    case 188:
      $inst$$3_opcode$$inline_86$$ = "CP " + $index$$45$$ + "H *";
      break;
    case 189:
      $inst$$3_opcode$$inline_86$$ = "CP " + $index$$45$$ + "L *";
      break;
    case 190:
      $inst$$inline_88_offset$$16$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $inst$$3_opcode$$inline_86$$ = "CP (" + $index$$45$$ + "+" + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "))";
      $code$$6_code$$inline_90$$ = "this.cp_a(this.readMem(this.get" + $index$$45$$ + "() + " + $JSSMS$Utils$toHex$$($inst$$inline_88_offset$$16$$) + "));";
      $address$$9_address$$inline_85$$++;
      break;
    case 203:
      $inst$$3_opcode$$inline_86$$ = $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$);
      $opcodesArray$$inline_87_operand$$2$$ = [$inst$$3_opcode$$inline_86$$];
      $inst$$inline_88_offset$$16$$ = "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";
      $code$$6_code$$inline_90$$ = 'throw "Unimplemented 0xDDCB or 0xFDCB prefixed opcode";';
      $address$$9_address$$inline_85$$++;
      switch($inst$$3_opcode$$inline_86$$) {
        case 0:
          $inst$$inline_88_offset$$16$$ = "LD B,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.b = this.rlc(this.readMem(location)); this.writeMem(location, this.b);";
          break;
        case 1:
          $inst$$inline_88_offset$$16$$ = "LD C,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.c = this.rlc(this.readMem(location)); this.writeMem(location, this.c);";
          break;
        case 2:
          $inst$$inline_88_offset$$16$$ = "LD D,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.d = this.rlc(this.readMem(location)); this.writeMem(location, this.d);";
          break;
        case 3:
          $inst$$inline_88_offset$$16$$ = "LD E,RLC (" + $index$$45$$ + ")";
          break;
        case 4:
          $inst$$inline_88_offset$$16$$ = "LD H,RLC (" + $index$$45$$ + ")";
          break;
        case 5:
          $inst$$inline_88_offset$$16$$ = "LD L,RLC (" + $index$$45$$ + ")";
          break;
        case 6:
          $inst$$inline_88_offset$$16$$ = "RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.writeMem(location, this.rlc(this.readMem(location)));";
          break;
        case 7:
          $inst$$inline_88_offset$$16$$ = "LD A,RLC (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.a = this.rlc(this.readMem(location)); this.writeMem(location, this.a);";
          break;
        case 8:
          $inst$$inline_88_offset$$16$$ = "LD B,RRC (" + $index$$45$$ + ")";
          break;
        case 9:
          $inst$$inline_88_offset$$16$$ = "LD C,RRC (" + $index$$45$$ + ")";
          break;
        case 10:
          $inst$$inline_88_offset$$16$$ = "LD D,RRC (" + $index$$45$$ + ")";
          break;
        case 11:
          $inst$$inline_88_offset$$16$$ = "LD E,RRC (" + $index$$45$$ + ")";
          break;
        case 12:
          $inst$$inline_88_offset$$16$$ = "LD H,RRC (" + $index$$45$$ + ")";
          break;
        case 13:
          $inst$$inline_88_offset$$16$$ = "LD L,RRC (" + $index$$45$$ + ")";
          break;
        case 14:
          $inst$$inline_88_offset$$16$$ = "RRC (" + $index$$45$$ + ")";
          break;
        case 15:
          $inst$$inline_88_offset$$16$$ = "LD A,RRC (" + $index$$45$$ + ")";
          break;
        case 16:
          $inst$$inline_88_offset$$16$$ = "LD B,RL (" + $index$$45$$ + ")";
          break;
        case 17:
          $inst$$inline_88_offset$$16$$ = "LD C,RL (" + $index$$45$$ + ")";
          break;
        case 18:
          $inst$$inline_88_offset$$16$$ = "LD D,RL (" + $index$$45$$ + ")";
          break;
        case 19:
          $inst$$inline_88_offset$$16$$ = "LD E,RL (" + $index$$45$$ + ")";
          break;
        case 20:
          $inst$$inline_88_offset$$16$$ = "LD H,RL (" + $index$$45$$ + ")";
          break;
        case 21:
          $inst$$inline_88_offset$$16$$ = "LD L,RL (" + $index$$45$$ + ")";
          break;
        case 22:
          $inst$$inline_88_offset$$16$$ = "RL (" + $index$$45$$ + ")";
          break;
        case 23:
          $inst$$inline_88_offset$$16$$ = "LD A,RL (" + $index$$45$$ + ")";
          break;
        case 24:
          $inst$$inline_88_offset$$16$$ = "LD B,RR (" + $index$$45$$ + ")";
          break;
        case 25:
          $inst$$inline_88_offset$$16$$ = "LD C,RR (" + $index$$45$$ + ")";
          break;
        case 26:
          $inst$$inline_88_offset$$16$$ = "LD D,RR (" + $index$$45$$ + ")";
          break;
        case 27:
          $inst$$inline_88_offset$$16$$ = "LD E,RR (" + $index$$45$$ + ")";
          break;
        case 28:
          $inst$$inline_88_offset$$16$$ = "LD H,RR (" + $index$$45$$ + ")";
          break;
        case 29:
          $inst$$inline_88_offset$$16$$ = "LD L,RR (" + $index$$45$$ + ")";
          $code$$6_code$$inline_90$$ = "var location = (this.get" + $index$$45$$ + "() + " + $JSCompiler_StaticMethods_readRom8bit$$($JSCompiler_StaticMethods_getIndex$self$$, $address$$9_address$$inline_85$$) + ") & 0xFFFF;this.l = this.rr(this.readMem(location)); this.writeMem(location, this.l);";
          break;
        case 30:
          $inst$$inline_88_offset$$16$$ = "RR (" + $index$$45$$ + ")";
          break;
        case 31:
          $inst$$inline_88_offset$$16$$ = "LD A,RR (" + $index$$45$$ + ")";
          break;
        case 32:
          $inst$$inline_88_offset$$16$$ = "LD B,SLA (" + $index$$45$$ + ")";
          break;
        case 33:
          $inst$$inline_88_offset$$16$$ = "LD C,SLA (" + $index$$45$$ + ")";
          break;
        case 34:
          $inst$$inline_88_offset$$16$$ = "LD D,SLA (" + $index$$45$$ + ")";
          break;
        case 35:
          $inst$$inline_88_offset$$16$$ = "LD E,SLA (" + $index$$45$$ + ")";
          break;
        case 36:
          $inst$$inline_88_offset$$16$$ = "LD H,SLA (" + $index$$45$$ + ")";
          break;
        case 37:
          $inst$$inline_88_offset$$16$$ = "LD L,SLA (" + $index$$45$$ + ")";
          break;
        case 38:
          $inst$$inline_88_offset$$16$$ = "SLA (" + $index$$45$$ + ")";
          break;
        case 39:
          $inst$$inline_88_offset$$16$$ = "LD A,SLA (" + $index$$45$$ + ")";
          break;
        case 40:
          $inst$$inline_88_offset$$16$$ = "LD B,SRA (" + $index$$45$$ + ")";
          break;
        case 41:
          $inst$$inline_88_offset$$16$$ = "LD C,SRA (" + $index$$45$$ + ")";
          break;
        case 42:
          $inst$$inline_88_offset$$16$$ = "LD D,SRA (" + $index$$45$$ + ")";
          break;
        case 43:
          $inst$$inline_88_offset$$16$$ = "LD E,SRA (" + $index$$45$$ + ")";
          break;
        case 44:
          $inst$$inline_88_offset$$16$$ = "LD H,SRA (" + $index$$45$$ + ")";
          break;
        case 45:
          $inst$$inline_88_offset$$16$$ = "LD L,SRA (" + $index$$45$$ + ")";
          break;
        case 46:
          $inst$$inline_88_offset$$16$$ = "SRA (" + $index$$45$$ + ")";
          break;
        case 47:
          $inst$$inline_88_offset$$16$$ = "LD A,SRA (" + $index$$45$$ + ")";
          break;
        case 48:
          $inst$$inline_88_offset$$16$$ = "LD B,SLL (" + $index$$45$$ + ")";
          break;
        case 49:
          $inst$$inline_88_offset$$16$$ = "LD C,SLL (" + $index$$45$$ + ")";
          break;
        case 50:
          $inst$$inline_88_offset$$16$$ = "LD D,SLL (" + $index$$45$$ + ")";
          break;
        case 51:
          $inst$$inline_88_offset$$16$$ = "LD E,SLL (" + $index$$45$$ + ")";
          break;
        case 52:
          $inst$$inline_88_offset$$16$$ = "LD H,SLL (" + $index$$45$$ + ")";
          break;
        case 53:
          $inst$$inline_88_offset$$16$$ = "LD L,SLL (" + $index$$45$$ + ")";
          break;
        case 54:
          $inst$$inline_88_offset$$16$$ = "SLL (" + $index$$45$$ + ") *";
          break;
        case 55:
          $inst$$inline_88_offset$$16$$ = "LD A,SLL (" + $index$$45$$ + ")";
          break;
        case 56:
          $inst$$inline_88_offset$$16$$ = "LD B,SRL (" + $index$$45$$ + ")";
          break;
        case 57:
          $inst$$inline_88_offset$$16$$ = "LD C,SRL (" + $index$$45$$ + ")";
          break;
        case 58:
          $inst$$inline_88_offset$$16$$ = "LD D,SRL (" + $index$$45$$ + ")";
          break;
        case 59:
          $inst$$inline_88_offset$$16$$ = "LD E,SRL (" + $index$$45$$ + ")";
          break;
        case 60:
          $inst$$inline_88_offset$$16$$ = "LD H,SRL (" + $index$$45$$ + ")";
          break;
        case 61:
          $inst$$inline_88_offset$$16$$ = "LD L,SRL (" + $index$$45$$ + ")";
          break;
        case 62:
          $inst$$inline_88_offset$$16$$ = "SRL (" + $index$$45$$ + ")";
          break;
        case 63:
          $inst$$inline_88_offset$$16$$ = "LD A,SRL (" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "BIT 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "RES 7,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 0,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 1,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 2,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 3,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 4,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 5,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 6,(" + $index$$45$$ + ")";
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
          $inst$$inline_88_offset$$16$$ = "SET 7,(" + $index$$45$$ + ")"
      }
      $inst$$3_opcode$$inline_86$$ = $inst$$inline_88_offset$$16$$;
      $opcodesArray$$3$$ = $opcodesArray$$3$$.concat($opcodesArray$$inline_87_operand$$2$$);
      break;
    case 225:
      $inst$$3_opcode$$inline_86$$ = "POP " + $index$$45$$;
      $code$$6_code$$inline_90$$ = "this.set" + $index$$45$$ + "(this.readMemWord(this.sp)); this.sp += 2;";
      break;
    case 227:
      $inst$$3_opcode$$inline_86$$ = "EX SP,(" + $index$$45$$ + ")";
      break;
    case 229:
      $inst$$3_opcode$$inline_86$$ = "PUSH " + $index$$45$$;
      $code$$6_code$$inline_90$$ = "this.push2(this." + $index$$45$$.toLowerCase() + "H, this." + $index$$45$$.toLowerCase() + "L);";
      break;
    case 233:
      $inst$$3_opcode$$inline_86$$ = "JP (" + $index$$45$$ + ")";
      $address$$9_address$$inline_85$$ = $JSCompiler_alias_NULL$$;
      break;
    case 249:
      $inst$$3_opcode$$inline_86$$ = "LD SP," + $index$$45$$
  }
  return{$opcode$:$opcode$$9$$, $opcodes$:$opcodesArray$$3$$, $inst$:$inst$$3_opcode$$inline_86$$, code:$code$$6_code$$inline_90$$, $address$:$currAddr$$3$$, $nextAddress$:$address$$9_address$$inline_85$$}
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
  $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.$u$;
  for(var $tstates$$ = 0, $prevPc$$ = 0, $breakNeeded$$ = $JSCompiler_alias_FALSE$$, $code$$2$$ = ['"": function() {', 'throw "Bad address: " + JSSMS.Utils.toHex(this.pc);'], $i$$10$$ = 0, $length$$17$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$.length;$i$$10$$ < $length$$17$$;$i$$10$$++) {
    if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$]) {
      if($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$isJumpTarget$ || $prevPc$$ != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$ || $breakNeeded$$) {
        $insertTStates$$(), $prevPc$$ && !$breakNeeded$$ && $code$$2$$.push("this.pc = " + $JSSMS$Utils$toHex$$($prevPc$$) + ";"), $code$$2$$.push("},"), $code$$2$$.push("" + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$) + ": function(temp) {"), $code$$2$$.push("// Nb of instructions jumping here: " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$jumpTargetNb$)
      }
      $code$$2$$.push("");
      $code$$2$$.push("if (this.tstates <= 0) {this.pc = " + $JSSMS$Utils$toHex$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$address$) + "; if (this.eol()) return;}");
      $code$$2$$.push("");
      $code$$2$$.push("// " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].label);
      $breakNeeded$$ = "return;" == $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code.substr(-7);
      $tstates$$ += $getTotalTStates$$($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$opcodes$);
      $insertTStates$$();
      "" != $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code && $code$$2$$.push($JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].code);
      $prevPc$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeJavaScript$self_tree$$1$$[$i$$10$$].$nextAddress$
    }
  }
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
function $JSSMS$Vdp$$($i$$inline_118_i$$inline_121_sms$$3$$) {
  this.$h$ = $i$$inline_118_i$$inline_121_sms$$3$$;
  var $i$$13_r$$inline_122$$ = 0;
  this.$z$ = 0;
  this.$d$ = Array(16384);
  this.$a$ = Array(96);
  for($i$$13_r$$inline_122$$ = 0;96 > $i$$13_r$$inline_122$$;$i$$13_r$$inline_122$$++) {
    this.$a$[$i$$13_r$$inline_122$$] = 255
  }
  this.$c$ = Array(16);
  this.$f$ = 0;
  this.$j$ = $JSCompiler_alias_FALSE$$;
  this.$q$ = this.$l$ = this.$w$ = this.$r$ = this.$e$ = this.$i$ = 0;
  this.$p$ = Array(256);
  this.$D$ = 0;
  this.$b$ = $i$$inline_118_i$$inline_121_sms$$3$$.$b$.$canvasImageData$.data;
  this.$H$ = Array(64);
  this.$G$ = Array(64);
  this.$F$ = Array(64);
  this.$C$ = Array(256);
  this.$B$ = Array(256);
  this.$A$ = Array(16);
  this.$g$ = this.$u$ = this.$s$ = 0;
  this.$k$ = $JSCompiler_alias_FALSE$$;
  this.$n$ = Array(192);
  for($i$$13_r$$inline_122$$ = 0;192 > $i$$13_r$$inline_122$$;$i$$13_r$$inline_122$$++) {
    this.$n$[$i$$13_r$$inline_122$$] = Array(25)
  }
  this.$t$ = Array(512);
  this.$v$ = Array(512);
  for($i$$inline_118_i$$inline_121_sms$$3$$ = this.$m$ = this.$o$ = 0;512 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    this.$t$[$i$$inline_118_i$$inline_121_sms$$3$$] = Array(64)
  }
  var $g$$inline_123$$, $b$$inline_124$$;
  for($i$$inline_118_i$$inline_121_sms$$3$$ = 0;64 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    $i$$13_r$$inline_122$$ = $i$$inline_118_i$$inline_121_sms$$3$$ & 3, $g$$inline_123$$ = $i$$inline_118_i$$inline_121_sms$$3$$ >> 2 & 3, $b$$inline_124$$ = $i$$inline_118_i$$inline_121_sms$$3$$ >> 4 & 3, this.$H$[$i$$inline_118_i$$inline_121_sms$$3$$] = 85 * $i$$13_r$$inline_122$$ & 255, this.$G$[$i$$inline_118_i$$inline_121_sms$$3$$] = 85 * $g$$inline_123$$ & 255, this.$F$[$i$$inline_118_i$$inline_121_sms$$3$$] = 85 * $b$$inline_124$$ & 255
  }
  for($i$$inline_118_i$$inline_121_sms$$3$$ = 0;256 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    $g$$inline_123$$ = $i$$inline_118_i$$inline_121_sms$$3$$ & 15, $b$$inline_124$$ = $i$$inline_118_i$$inline_121_sms$$3$$ >> 4 & 15, this.$C$[$i$$inline_118_i$$inline_121_sms$$3$$] = ($g$$inline_123$$ << 4 | $g$$inline_123$$) & 255, this.$B$[$i$$inline_118_i$$inline_121_sms$$3$$] = ($b$$inline_124$$ << 4 | $b$$inline_124$$) & 255
  }
  for($i$$inline_118_i$$inline_121_sms$$3$$ = 0;16 > $i$$inline_118_i$$inline_121_sms$$3$$;$i$$inline_118_i$$inline_121_sms$$3$$++) {
    this.$A$[$i$$inline_118_i$$inline_121_sms$$3$$] = ($i$$inline_118_i$$inline_121_sms$$3$$ << 4 | $i$$inline_118_i$$inline_121_sms$$3$$) & 255
  }
}
$JSSMS$Vdp$$.prototype = {reset:function $$JSSMS$Vdp$$$$reset$() {
  var $i$$14$$;
  this.$j$ = $JSCompiler_alias_TRUE$$;
  for($i$$14$$ = this.$r$ = this.$f$ = this.$q$ = this.$e$ = 0;16 > $i$$14$$;$i$$14$$++) {
    this.$c$[$i$$14$$] = 0
  }
  this.$c$[2] = 14;
  this.$c$[5] = 126;
  this.$h$.$a$.$A$ = $JSCompiler_alias_FALSE$$;
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
  var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$ = this.$a$.$a$;
  console.time("DOT generation");
  for(var $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$.$u$, $content$$inline_197$$ = ["digraph G {"], $i$$inline_198$$ = 0, $length$$inline_199$$ = $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$.length;$i$$inline_198$$ < $length$$inline_199$$;$i$$inline_198$$++) {
    $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$[$i$$inline_198$$] && ($content$$inline_197$$.push(" " + $i$$inline_198$$ + ' [label="' + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$[$i$$inline_198$$].label + '"];'), $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$[$i$$inline_198$$].target != $JSCompiler_alias_NULL$$ && $content$$inline_197$$.push(" " + 
    $i$$inline_198$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$[$i$$inline_198$$].target + ";"), $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$[$i$$inline_198$$].$nextAddress$ != $JSCompiler_alias_NULL$$ && $content$$inline_197$$.push(" " + $i$$inline_198$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_Debugger_prototype$writeGraphViz$self$$inline_195_tree$$inline_196$$[$i$$inline_198$$].$nextAddress$ + 
    ";"))
  }
  $content$$inline_197$$.push("}");
  $content$$inline_197$$ = $content$$inline_197$$.join("\n");
  $content$$inline_197$$ = $content$$inline_197$$.replace(/ 0 \[label="/, ' 0 [style=filled,color="#CC0000",label="');
  console.timeEnd("DOT generation");
  return $content$$inline_197$$
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
function $JSCompiler_StaticMethods_in_$$($JSCompiler_StaticMethods_in_$self$$, $port$$3$$) {
  if($JSCompiler_StaticMethods_in_$self$$.$d$.$is_gg$ && 7 > $port$$3$$) {
    switch($port$$3$$) {
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
  switch($port$$3$$ & 193) {
    case 64:
      var $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$;
      a: {
        $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
        if(0 == $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$z$) {
          if(218 < $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$l$ - 6;
            break a
          }
        }else {
          if(242 < $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$l$) {
            $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$l$ - 57;
            break a
          }
        }
        $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$l$
      }
      return $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$;
    case 65:
      return 0;
    case 128:
      $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$j$ = $JSCompiler_alias_TRUE$$;
      var $statuscopy$$inline_207_value$$inline_204$$ = $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$w$;
      $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$w$ = $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$d$[$JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$e$++ & 
      16383] & 255;
      return $statuscopy$$inline_207_value$$inline_204$$;
    case 129:
      return $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$ = $JSCompiler_StaticMethods_in_$self$$.$a$, $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$j$ = $JSCompiler_alias_TRUE$$, $statuscopy$$inline_207_value$$inline_204$$ = 
      $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$f$, $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$f$ = 0, $JSCompiler_StaticMethods_controlRead$self$$inline_206_JSCompiler_StaticMethods_dataRead$self$$inline_203_JSCompiler_StaticMethods_getVCount$self$$inline_201_JSCompiler_inline_result$$5$$.$h$.$a$.$A$ = 
      $JSCompiler_alias_FALSE$$, $statuscopy$$inline_207_value$$inline_204$$;
    case 192:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$a$;
    case 193:
      return $JSCompiler_StaticMethods_in_$self$$.$c$.$b$ & 63 | $JSCompiler_StaticMethods_in_$self$$.$b$[0] | $JSCompiler_StaticMethods_in_$self$$.$b$[1]
  }
  return 255
}
function $JSCompiler_StaticMethods_out$$($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$, $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$, $reg$$inline_217_value$$70$$) {
  if(!($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$d$.$is_gg$ && 7 > $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$)) {
    switch($address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ & 193) {
      case 1:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[0] = ($reg$$inline_217_value$$70$$ & 32) << 1;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[1] = $reg$$inline_217_value$$70$$ & 128;
        break;
      case 128:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$;
        $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ = 0;
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$;
        switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$r$) {
          case 0:
          ;
          case 1:
          ;
          case 2:
            $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ & 16383;
            if($reg$$inline_217_value$$70$$ != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$] & 255)) {
              if($address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$ && $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$ + 
              64) {
                $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$
              }else {
                if($address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ >= $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$ + 128 && $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$ + 
                256) {
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$
                }else {
                  var $tileIndex$$inline_213$$ = $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ >> 5;
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$v$[$tileIndex$$inline_213$$] = $JSCompiler_alias_TRUE$$;
                  $tileIndex$$inline_213$$ < $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$o$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$o$ = $tileIndex$$inline_213$$);
                  $tileIndex$$inline_213$$ > $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$m$ && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$m$ = $tileIndex$$inline_213$$)
                }
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$d$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$] = $reg$$inline_217_value$$70$$
            }
            break;
          case 3:
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$h$.$is_sms$ ? ($address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ = 3 * ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ & 
            31), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$H$[$reg$$inline_217_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$G$[$reg$$inline_217_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$F$[$reg$$inline_217_value$$70$$]) : 
            ($address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ = 3 * (($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ & 63) >> 1), 0 == ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ & 
            1) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$C$[$reg$$inline_217_value$$70$$], 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ + 1] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$B$[$reg$$inline_217_value$$70$$]) : 
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$[$address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ + 2] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$A$[$reg$$inline_217_value$$70$$])
        }
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$++;
        break;
      case 129:
        $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$a$;
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$j$) {
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ = $reg$$inline_217_value$$70$$, 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ & 16128 | $reg$$inline_217_value$$70$$
        }else {
          if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$j$ = $JSCompiler_alias_TRUE$$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$r$ = $reg$$inline_217_value$$70$$ >> 
          6 & 3, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ | $reg$$inline_217_value$$70$$ << 8, 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$r$) {
            $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$w$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$d$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$++ & 
            16383] & 255
          }else {
            if(2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$r$) {
              $reg$$inline_217_value$$70$$ &= 15;
              switch($reg$$inline_217_value$$70$$) {
                case 0:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$f$ & 4) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$A$ = 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ & 
                  16));
                  break;
                case 1:
                  0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$f$ & 128) && 0 != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ & 32) && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$h$.$a$.$A$ = 
                  $JSCompiler_alias_TRUE$$);
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ & 3) != ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_217_value$$70$$] & 3) && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$);
                  break;
                case 2:
                  $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$D$ = ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ & 14) << 10;
                  break;
                case 5:
                  $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$ = 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$ & -130) << 7, $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ != $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$ && 
                  ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$k$ = $JSCompiler_alias_TRUE$$, console.log("New address written to SAT: " + $address$$inline_212_old$$inline_218_port$$2_temp$$inline_211$$ + " -> " + $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$g$))
              }
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$[$reg$$inline_217_value$$70$$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$i$
            }
          }
        }
        break;
      case 64:
      ;
      case 65:
        if($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$d$.$soundEnabled$) {
          switch($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$ = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$e$, 0 != ($reg$$inline_217_value$$70$$ & 128) ? ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$ = 
          $reg$$inline_217_value$$70$$ >> 4 & 7, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$] = $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$] & 
          1008 | $reg$$inline_217_value$$70$$ & 15) : $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$] = 0 == 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$ || 2 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$ || 4 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$ ? 
          $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$] & 15 | ($reg$$inline_217_value$$70$$ & 63) << 4 : 
          $reg$$inline_217_value$$70$$ & 15, $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$) {
            case 0:
            ;
            case 2:
            ;
            case 4:
              0 == $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$] && ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[$JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$c$] = 
              1);
              break;
            case 6:
              $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$h$ = 16 << ($JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$b$[6] & 3), $JSCompiler_StaticMethods_JSSMS_SN76489_prototype$write$self$$inline_220_JSCompiler_StaticMethods_controlWrite$self$$inline_215_JSCompiler_StaticMethods_dataWrite$self$$inline_209_JSCompiler_StaticMethods_out$self$$.$f$ = 
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
